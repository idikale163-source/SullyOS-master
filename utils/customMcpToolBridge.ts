import { listCustomMcpTools, CustomMcpToolDef } from './customMcpClient';
import type { OpenAITool } from '../types';

export const customMcpToolsToOpenAI = (tools: CustomMcpToolDef[]): OpenAITool[] => {
    return tools.map(t => ({
        type: 'function' as const,
        function: {
            name: t.name,
            description: t.description || `Call ${t.name}`,
            parameters: t.inputSchema || { type: 'object', properties: {} },
        }
    }));
};

export const fetchOpenAIToolsForCustomMcp = async (): Promise<OpenAITool[]> => {
    try {
        const tools = await listCustomMcpTools();
        return customMcpToolsToOpenAI(tools);
    } catch (e) {
        console.warn('获取自定义 MCP 工具失败', e);
        return [];
    }
};