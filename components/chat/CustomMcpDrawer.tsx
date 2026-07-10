import React from 'react';
import { getCustomMcpServers, saveCustomMcpServers, CustomMcpServerConfig } from '../../utils/customMcpClient';

interface CustomMcpDrawerProps {
    open: boolean;
    onClose: () => void;
}

const CustomMcpDrawer: React.FC<CustomMcpDrawerProps> = ({ open, onClose }) => {
    const [servers, setServers] = React.useState<CustomMcpServerConfig[]>([]);

    React.useEffect(() => {
        if (open) {
            setServers(getCustomMcpServers());
        }
    }, [open]);

    const handleToggle = (id: string, enabled: boolean) => {
        const next = servers.map(s => s.id === id ? { ...s, enabled } : s);
        setServers(next);
        saveCustomMcpServers(next);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            {/* 遮罩 */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
            
            {/* 抽屉 */}
            <div 
                className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-emerald-50/30">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🔌</span>
                        <div className="font-bold text-slate-800 text-sm">自定义工具箱</div>
                    </div>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                        ✕
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                    {servers.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-3xl mb-2 opacity-50">🛠️</div>
                            <div className="text-sm font-bold text-slate-600 mb-1">工具箱空空如也</div>
                            <div className="text-[11px] text-slate-400">请前往 设置 → MCP 服务 中添加</div>
                        </div>
                    ) : (
                        servers.map(server => (
                            <div key={server.id} className={`p-3 rounded-xl border transition-colors ${server.enabled ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200/60 opacity-70'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-bold text-sm text-slate-700 truncate max-w-[180px]">{server.name || '未命名服务'}</div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={server.enabled} 
                                            onChange={e => handleToggle(server.id, e.target.checked)} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                                    </label>
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                    {server.url || '未配置地址'}
                                </div>
                                {server.keywords && (
                                    <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-600/80 px-2 py-1 rounded inline-block">
                                        🔑 {server.keywords.split(',').join(' · ')}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-white">
                    <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                        启用的工具将会在发送消息时自动调用。<br/>
                        设置了关键词的工具会在命中时自动启用。
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomMcpDrawer;