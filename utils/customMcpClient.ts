/**
 * 自定义 MCP 客户端 (Model Context Protocol over HTTP+SSE)
 */

import { getProxyWorkerUrl } from './proxyWorker';

const MCP_URL_KEY = 'aetheros.customMcp.url';
const MCP_ENABLED_KEY = 'aetheros.customMcp.enabled';

export interface CustomMcpToolDef {
    name: string;
    description?: string;
    inputSchema?: any;
}

export interface CustomMcpToolResult {
    success: boolean;
    data?: any;
    rawText?: string;
    error?: string;
}

interface McpJsonRpcRequest {
    jsonrpc: '2.0';
    method: string;
    params?: any;
    id?: number;
}

interface McpJsonRpcResponse {
    jsonrpc: '2.0';
    id?: number;
    result?: any;
    error?: { code: number; message: string; data?: any };
}

// ========== 状态 (持久化在 localStorage) ==========

export const getCustomMcpUrl = (): string => {
    try { return localStorage.getItem(MCP_URL_KEY) || ''; } catch { return ''; }
};

export const setCustomMcpUrl = (url: string): void => {
    try { localStorage.setItem(MCP_URL_KEY, url.trim()); } catch { /* ignore */ }
};

export const isCustomMcpEnabled = (): boolean => {
    try { return localStorage.getItem(MCP_ENABLED_KEY) === '1'; } catch { return false; }
};

export const setCustomMcpEnabled = (enabled: boolean): void => {
    try { localStorage.setItem(MCP_ENABLED_KEY, enabled ? '1' : '0'); } catch { /* ignore */ }
};

export const isCustomMcpConfigured = (): boolean => {
    return isCustomMcpEnabled() && getCustomMcpUrl().length > 0;
};

export function exportCustomMcpLocal(): Record<string, string> | undefined {
    try {
        const out: Record<string, string> = {};
        const tk = localStorage.getItem(MCP_URL_KEY); if (tk) out[MCP_URL_KEY] = tk;
        const en = localStorage.getItem(MCP_ENABLED_KEY); if (en) out[MCP_ENABLED_KEY] = en;
        return Object.keys(out).length ? out : undefined;
    } catch { return undefined; }
}

export function importCustomMcpLocal(data: Record<string, string> | null | undefined): void {
    if (!data || typeof data !== 'object') return;
    try {
        if (typeof data[MCP_URL_KEY] === 'string') localStorage.setItem(MCP_URL_KEY, data[MCP_URL_KEY]);
        if (typeof data[MCP_ENABLED_KEY] === 'string') localStorage.setItem(MCP_ENABLED_KEY, data[MCP_ENABLED_KEY]);
    } catch { /* ignore */ }
}

// ========== JSON-RPC 会话状态 (内存, 进程级) ==========

let requestIdCounter = 0;
let sessionId: string | null = null;
let initialized = false;
let cachedTools: CustomMcpToolDef[] = [];
let initPromise: Promise<void> | null = null;

const buildRequest = (method: string, params?: any, isNotification = false): McpJsonRpcRequest => {
    const req: McpJsonRpcRequest = { jsonrpc: '2.0', method, params };
    if (!isNotification) req.id = ++requestIdCounter;
    return req;
};

const parseSse = (text: string): McpJsonRpcResponse | null => {
    const dataLines: string[] = [];
    for (const line of text.split('\n')) {
        if (line.startsWith('data: ')) dataLines.push(line.slice(6));
        else if (line.startsWith('data:')) dataLines.push(line.slice(5));
    }
    for (let i = dataLines.length - 1; i >= 0; i--) {
        try { return JSON.parse(dataLines[i]); } catch { /* try previous */ }
    }
    return null;
}

const parseResp = (text: string, contentType: string): McpJsonRpcResponse => {
    if (contentType.includes('text/event-stream') || /^\s*(event:|data:)/.test(text)) {
        const parsed = parseSse(text);
        if (parsed) return parsed;
    }
    try { return JSON.parse(text); } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) { try { return JSON.parse(m[0]); } catch { /* fall through */ } }
        throw new Error(`MCP: 无法解析响应: ${text.slice(0, 300)}`);
    }
};

const post = async (
    body: McpJsonRpcRequest,
    expectResponse = true
): Promise<{ response: McpJsonRpcResponse | null }> => {
    let url = getCustomMcpUrl();
    if (!url) throw new Error('未配置自定义 MCP URL');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
    };
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;

    let resp: Response;
    try {
      resp = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
      });
    } catch (e: any) {
        if (e.name === 'TypeError' && e.message.includes('Failed to fetch')) {
             throw new Error(`网络错误: 可能是跨域 (CORS) 拦截或地址无法访问。请确保目标 MCP 服务已开启 CORS 或你使用的是正确的本地地址，或配置 Worker 代理。\n原地址: ${url}`);
        }
        throw e;
    }

    const newSid = resp.headers.get('Mcp-Session-Id') || resp.headers.get('mcp-session-id');
    if (newSid) sessionId = newSid;

    if (resp.status === 202) return { response: null };
    if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        throw new Error(`MCP HTTP ${resp.status}: ${txt.slice(0, 200)}`);
    }
    if (!expectResponse) return { response: null };

    const ct = resp.headers.get('content-type') || '';
    const text = await resp.text();
    return { response: parseResp(text, ct) };
};

const doInitialize = async (): Promise<void> => {
    const initReq = buildRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'AetherOS-Aetheros', version: '1.0.0' },
    });
    const { response } = await post(initReq);
    if (response?.error) throw new Error(`Initialize 失败: ${response.error.message}`);

    const notif = buildRequest('notifications/initialized', {}, true);
    await post(notif, false).catch(() => {});

    try {
        const { response: toolsResp } = await post(buildRequest('tools/list'));
        if (toolsResp?.result?.tools && Array.isArray(toolsResp.result.tools)) {
            cachedTools = toolsResp.result.tools.map((t: any) => ({
                name: t.name,
                description: t.description || '',
                inputSchema: t.inputSchema || t.input_schema || { type: 'object', properties: {} },
            }));
            console.log('[Custom-MCP] 工具清单:', cachedTools.map(t => t.name).join(', '));
        }
    } catch (e) {
        console.warn('[Custom-MCP] tools/list 失败:', e);
    }

    initialized = true;
};

const ensureInitialized = async (): Promise<void> => {
    if (initialized) return;
    if (!initPromise) {
        initPromise = doInitialize().catch((e) => {
            initPromise = null;
            throw e;
        });
    }
    await initPromise;
};

export const listCustomMcpTools = async (forceRefresh = false): Promise<CustomMcpToolDef[]> => {
    if (forceRefresh) {
        initialized = false;
        sessionId = null;
        cachedTools = [];
        initPromise = null;
    }
    await ensureInitialized();
    return cachedTools;
};

export const callCustomMcpTool = async (toolName: string, args: Record<string, any> = {}): Promise<CustomMcpToolResult> => {
    try {
        await ensureInitialized();
        const body = buildRequest('tools/call', { name: toolName, arguments: args });
        const { response } = await post(body);
        if (!response) return { success: false, error: '空响应' };
        if (response.error) return { success: false, error: `MCP 错误 [${response.error.code}]: ${response.error.message}` };

        const result = response.result;
        if (result?.content && Array.isArray(result.content)) {
            const textParts = result.content.filter((c: any) => c?.type === 'text').map((c: any) => c.text || '');
            const fullText = textParts.join('\\n').trim();
            if (result.isError) return { success: false, error: fullText || '自定义工具执行失败', rawText: fullText };
            
            try { return { success: true, data: JSON.parse(fullText), rawText: fullText }; }
            catch { return { success: true, data: fullText, rawText: fullText }; }
        }
        return { success: true, data: result };
    } catch (e: any) {
        return { success: false, error: e?.message || String(e) };
    }
};

export const testCustomMcpConnection = async (): Promise<{ ok: boolean; message: string; tools?: CustomMcpToolDef[] }> => {
    try {
        initialized = false;
        sessionId = null;
        cachedTools = [];
        initPromise = null;
        const tools = await listCustomMcpTools(false);
        if (!tools.length) return { ok: true, message: '已连接, 但工具清单为空', tools };
        return { ok: true, message: `已连接, 拿到 ${tools.length} 个工具`, tools };
    } catch (e: any) {
        return { ok: false, message: e?.message || String(e) };
    }
};

export const resetCustomMcpSession = (): void => {
    initialized = false;
    sessionId = null;
    cachedTools = [];
    initPromise = null;
};
