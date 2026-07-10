/**
 * 自定义 MCP 客户端 (Model Context Protocol over HTTP+SSE)
 */

import { getProxyWorkerUrl } from './proxyWorker';

const MCP_SERVERS_KEY = 'aetheros.customMcp.servers';

export interface CustomMcpServerConfig {
    id: string;
    name: string;
    url: string;
    enabled: boolean;
    keywords?: string;
    hiddenPrompt?: string;
}

export interface CustomMcpToolDef {
    name: string;
    originalName: string;
    serverId: string;
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

export const getCustomMcpServers = (): CustomMcpServerConfig[] => {
    try {
        const data = localStorage.getItem(MCP_SERVERS_KEY);
        if (data) {
            return JSON.parse(data);
        }
        const oldUrl = localStorage.getItem('aetheros.customMcp.url');
        const oldEnabled = localStorage.getItem('aetheros.customMcp.enabled');
        if (oldUrl) {
            const servers = [{
                id: 'default',
                name: 'default',
                url: oldUrl,
                enabled: oldEnabled === '1'
            }];
            saveCustomMcpServers(servers);
            return servers;
        }
        return [];
    } catch {
        return [];
    }
};

export const saveCustomMcpServers = (servers: CustomMcpServerConfig[]): void => {
    try {
        localStorage.setItem(MCP_SERVERS_KEY, JSON.stringify(servers));
    } catch { /* ignore */ }
};

export const isCustomMcpEnabled = (): boolean => {
    return getCustomMcpServers().some(s => s.enabled && s.url.trim().length > 0);
};

export const isCustomMcpConfigured = (): boolean => {
    return isCustomMcpEnabled();
};

export function exportCustomMcpLocal(): Record<string, string> | undefined {
    try {
        const out: Record<string, string> = {};
        const data = localStorage.getItem(MCP_SERVERS_KEY);
        if (data) out[MCP_SERVERS_KEY] = data;
        
        // 旧配置兼容
        const tk = localStorage.getItem('aetheros.customMcp.url'); if (tk) out['aetheros.customMcp.url'] = tk;
        const en = localStorage.getItem('aetheros.customMcp.enabled'); if (en) out['aetheros.customMcp.enabled'] = en;
        return Object.keys(out).length ? out : undefined;
    } catch { return undefined; }
}

export function importCustomMcpLocal(data: Record<string, string> | null | undefined): void {
    if (!data || typeof data !== 'object') return;
    try {
        if (typeof data[MCP_SERVERS_KEY] === 'string') localStorage.setItem(MCP_SERVERS_KEY, data[MCP_SERVERS_KEY]);
        else {
            if (typeof data['aetheros.customMcp.url'] === 'string') localStorage.setItem('aetheros.customMcp.url', data['aetheros.customMcp.url']);
            if (typeof data['aetheros.customMcp.enabled'] === 'string') localStorage.setItem('aetheros.customMcp.enabled', data['aetheros.customMcp.enabled']);
        }
    } catch { /* ignore */ }
}

// ========== JSON-RPC 会话状态 (内存, 进程级) ==========

interface ServerState {
    config: CustomMcpServerConfig;
    sessionId: string | null;
    initialized: boolean;
    cachedTools: CustomMcpToolDef[];
    initPromise: Promise<void> | null;
    requestIdCounter: number;
}

const serverStates: Record<string, ServerState> = {};

const getState = (serverId: string): ServerState => {
    if (!serverStates[serverId]) {
        const config = getCustomMcpServers().find(s => s.id === serverId) || { id: serverId, name: serverId, url: '', enabled: false };
        serverStates[serverId] = { config, sessionId: null, initialized: false, cachedTools: [], initPromise: null, requestIdCounter: 0 };
    } else {
        const freshConfig = getCustomMcpServers().find(s => s.id === serverId);
        if (freshConfig) serverStates[serverId].config = freshConfig;
    }
    return serverStates[serverId];
};

const buildRequest = (state: ServerState, method: string, params?: any, isNotification = false): McpJsonRpcRequest => {
    const req: McpJsonRpcRequest = { jsonrpc: '2.0', method, params };
    if (!isNotification) req.id = ++state.requestIdCounter;
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
    state: ServerState,
    body: McpJsonRpcRequest,
    expectResponse = true
): Promise<{ response: McpJsonRpcResponse | null }> => {
    let url = state.config.url;
    if (!url) throw new Error(`未配置服务器 ${state.config.name} 的 MCP URL`);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
    };
    if (state.sessionId) headers['Mcp-Session-Id'] = state.sessionId;

    let resp: Response;
    try {
      resp = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
      });
    } catch (e: any) {
        if (e.name === 'TypeError' && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError') || e.message.includes('fetch'))) {
             throw new Error(`网络错误: 可能是跨域 (CORS) 拦截或 HTTP(S) 混用导致。由于你正在 HTTPS 环境（如 GitHub Pages）访问 HTTP 服务，浏览器会强行拦截。解决方案：\n1. 用 HTTP 访问本应用\n2. 给目标 MCP 配置 HTTPS\n3. 通过 Worker 代理转发。\n原地址: ${url}`);
        }
        throw e;
    }

    const newSid = resp.headers.get('Mcp-Session-Id') || resp.headers.get('mcp-session-id');
    if (newSid) state.sessionId = newSid;

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

const doInitialize = async (state: ServerState): Promise<void> => {
    const initReq = buildRequest(state, 'initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'AetherOS-Aetheros', version: '1.0.0' },
    });
    const { response } = await post(state, initReq);
    if (response?.error) throw new Error(`Initialize 失败: ${response.error.message}`);

    const notif = buildRequest(state, 'notifications/initialized', {}, true);
    await post(state, notif, false).catch(() => {});

    try {
        const { response: toolsResp } = await post(state, buildRequest(state, 'tools/list'));
        if (toolsResp?.result?.tools && Array.isArray(toolsResp.result.tools)) {
            // 工具名为了避免不同服务器冲突，使用 serverId 过滤前缀并替换非法字符
            const safePrefix = state.config.id.replace(/[^a-zA-Z0-9_-]/g, '_');
            state.cachedTools = toolsResp.result.tools.map((t: any) => ({
                name: `${safePrefix}__${t.name}`,
                originalName: t.name,
                serverId: state.config.id,
                description: `[${state.config.name}] ${t.description || ''}`,
                inputSchema: t.inputSchema || t.input_schema || { type: 'object', properties: {} },
            }));
            console.log(`[Custom-MCP] ${state.config.name} 工具清单:`, state.cachedTools.map(t => t.name).join(', '));
        }
    } catch (e) {
        console.warn(`[Custom-MCP] ${state.config.name} tools/list 失败:`, e);
    }

    state.initialized = true;
};

const ensureInitialized = async (state: ServerState): Promise<void> => {
    if (state.initialized) return;
    if (!state.initPromise) {
        state.initPromise = doInitialize(state).catch((e) => {
            state.initPromise = null;
            throw e;
        });
    }
    await state.initPromise;
};

export const listCustomMcpTools = async (forceRefresh = false): Promise<CustomMcpToolDef[]> => {
    const servers = getCustomMcpServers().filter(s => s.enabled && s.url);
    const allTools: CustomMcpToolDef[] = [];
    
    for (const server of servers) {
        const state = getState(server.id);
        if (forceRefresh) {
            state.initialized = false;
            state.sessionId = null;
            state.cachedTools = [];
            state.initPromise = null;
        }
        try {
            await ensureInitialized(state);
            allTools.push(...state.cachedTools);
        } catch (e) {
            console.error(`[Custom-MCP] 服务器 ${server.name} 初始化失败:`, e);
        }
    }
    return allTools;
};

export const callCustomMcpTool = async (toolName: string, args: Record<string, any> = {}): Promise<CustomMcpToolResult> => {
    try {
        // 先在所有已缓存工具里找
        let toolDef: CustomMcpToolDef | undefined;
        for (const sid of Object.keys(serverStates)) {
            const found = serverStates[sid].cachedTools.find(t => t.name === toolName);
            if (found) { toolDef = found; break; }
        }
        
        if (!toolDef) {
            // 如果没找到，尝试触发刷新
            const tools = await listCustomMcpTools();
            toolDef = tools.find(t => t.name === toolName);
        }

        if (!toolDef) {
            return { success: false, error: `找不到工具定义: ${toolName}` };
        }

        const state = getState(toolDef.serverId);
        await ensureInitialized(state);
        
        const body = buildRequest(state, 'tools/call', { name: toolDef.originalName, arguments: args });
        const { response } = await post(state, body);
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

export const testCustomMcpConnection = async (serverId: string): Promise<{ ok: boolean; message: string; tools?: CustomMcpToolDef[] }> => {
    try {
        const state = getState(serverId);
        state.initialized = false;
        state.sessionId = null;
        state.cachedTools = [];
        state.initPromise = null;
        
        await ensureInitialized(state);
        const tools = state.cachedTools;
        if (!tools.length) return { ok: true, message: '已连接, 但工具清单为空', tools };
        return { ok: true, message: `已连接, 拿到 ${tools.length} 个工具`, tools };
    } catch (e: any) {
        return { ok: false, message: e?.message || String(e) };
    }
};

export const resetCustomMcpSession = (): void => {
    for (const key of Object.keys(serverStates)) {
        delete serverStates[key];
    }
};
