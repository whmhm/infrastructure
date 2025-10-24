import { memo, useState, useEffect } from "react";
import { ollamaService } from '@infrastructure-monorepo/api-client';

interface ChatMessage {
    id: string;
    type: 'message' | 'error';
    role: 'assistant' | 'user';
    content: string;
    isStreaming?: boolean;
}

const Analizy = function () {
    const [chatList, setChatList] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [serviceAvailable, setServiceAvailable] = useState(true);

    // 检查Ollama服务是否可用
    useEffect(() => {
        const checkService = async () => {
            try {
                const available = await ollamaService.healthCheck();
                setServiceAvailable(available);
            } catch (error) {
                console.error('服务检查失败:', error);
                setServiceAvailable(false);
            }
        };
        
        checkService();
        
        // 每30秒检查一次服务可用性
        const interval = setInterval(checkService, 30000);
        return () => clearInterval(interval);
    }, []);

    // 生成唯一ID
    const generateId = (): string => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    // 发送消息函数
    const sendMessage = async (): Promise<void> => {
        if (!inputValue.trim() || isSending || !serviceAvailable) return;

        const messageContent = inputValue.trim();
        const messageId = generateId();
        const assistantId = generateId();

        try {
            setIsSending(true);
            
            // 先将用户消息添加到聊天列表
            const userMessage: ChatMessage = {
                id: messageId,
                type: 'message',
                role: 'user',
                content: messageContent
            };
            setChatList(prev => [...prev, userMessage]);
            
            // 清空输入框
            setInputValue('');

            // 添加一个正在生成的AI消息占位符
            const partialAssistantMessage: ChatMessage = {
                id: assistantId,
                type: 'message',
                role: 'assistant',
                content: '',
                isStreaming: true
            };
            setChatList(prev => [...prev, partialAssistantMessage]);

            // 调用Ollama服务分析内容
            const result = await ollamaService.analyzeContent(messageContent);

            // 更新AI消息为完整内容
            setChatList(prev => prev.map(msg => 
                msg.id === assistantId
                    ? { ...msg, content: result, isStreaming: false }
                    : msg
            ));

        } catch (error: any) {
            console.error('分析失败:', error);
            // 添加错误消息到聊天列表
            setChatList(prev => prev.map(msg => 
                msg.id === assistantId && msg.isStreaming && msg.role === 'assistant'
                    ? {
                        ...msg,
                        type: 'error',
                        content: error.message || '分析内容失败，请确保Ollama服务正常运行',
                        isStreaming: false
                    }
                    : msg
            ));
        } finally {
            setIsSending(false);
        }
    };

    // 处理输入框键盘事件
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex-1 p-4 overflow-hidden">
                {/* 服务状态提示 */}
                {!serviceAvailable && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Ollama服务不可用</span>
                        </div>
                        <p className="mt-1 text-sm">请确保：1. Ollama服务已启动 2. deepseekv1模型已下载 3. 端口11434未被占用</p>
                    </div>
                )}
                
                {/* 聊天内容区域 */}
                <div className="flex flex-col gap-4 h-full overflow-y-auto mb-4 bg-white p-4 rounded-xl shadow-sm">
                    {chatList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="text-4xl mb-4">🧠</div>
                            <p className="text-lg font-medium">DeepSeek 分析助手</p>
                            <p className="text-sm mt-2">输入文本内容，使用本地 DeepSeek 模型进行智能分析</p>
                            {serviceAvailable && (
                                <p className="text-xs mt-4 text-green-600">✓ 服务连接正常</p>
                            )}
                        </div>
                    ) : (
                        chatList.map((chatItem) => {
                            // 为AI消息添加头像和样式
                            if (chatItem.role === 'assistant') {
                                return (
                                    <div key={chatItem.id} className="flex items-start gap-3 self-start max-w-[80%]">
                                        <div className="w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                            AI
                                        </div>
                                        <div className={`bg-blue-100 p-3 rounded-lg rounded-tl-none ${chatItem.type === 'error' ? 'bg-red-50 border border-red-100 text-red-600' : ''}`}>
                                            <p className="text-gray-800">{chatItem.content}</p>
                                            {chatItem.isStreaming && (
                                                <div className="flex space-x-1 mt-1">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            // 用户消息样式
                            return (
                                <div key={chatItem.id} className="flex items-start gap-3 self-end max-w-[80%] justify-end">
                                    <div className="bg-green-100 p-3 rounded-lg rounded-tr-none">
                                        <p className="text-gray-800">{chatItem.content}</p>
                                    </div>
                                    <div className="w-8 h-8 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                        我
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                
                {/* 输入框区域 */}
                <div className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <textarea
                        className={`flex-1 p-3 bg-transparent border-0 rounded-lg outline-none placeholder-gray-400 text-gray-800 focus:bg-gray-50 transition-colors duration-200 min-h-[80px] resize-none ${!serviceAvailable ? 'opacity-50' : ''}`}
                        placeholder="输入要分析的文本内容..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSending || !serviceAvailable}
                    />
                    <button 
                        className={`px-6 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${(isSending || !serviceAvailable) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
                        onClick={sendMessage}
                        disabled={isSending || !inputValue.trim() || !serviceAvailable}
                    >
                        {isSending ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>发送中</span>
                            </div>
                        ) : (
                            '发送'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(Analizy);

