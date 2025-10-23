var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState, useEffect, useRef } from "react";
import { SEEventSource } from '@/hooks/sse';
const Analizy = function () {
    const [chatList, setChatList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const sseRef = useRef(null);
    const lastAssistantIdRef = useRef('');
    // 初始化SSE连接
    useEffect(() => {
        // 封装聊天室SSE连接
        sseRef.current = new SEEventSource('/api/chat', {
            maxRetries: 5,
            retryInterval: 1000,
            maxRetryInterval: 30000,
        });
        // sseRef.current.connect();
        // 监听SSE消息
        const handleMessage = (evt) => {
            try {
                // 将Event类型断言为MessageEvent
                const event = evt;
                // 解析JSON数据
                const data = JSON.parse(event.data);
                // 处理数据
                if (data.type === 'message') {
                    console.log('普通消息:', data.content);
                    // 处理完整消息
                    if (data.isStreaming) {
                        // 更新流式消息
                        setChatList(prev => prev.map(msg => msg.id === lastAssistantIdRef.current && msg.role === 'assistant'
                            ? Object.assign(Object.assign({}, msg), { content: data.content, isStreaming: false }) : msg));
                    }
                    else {
                        // 添加新消息
                        setChatList(prev => [...prev, data]);
                        lastAssistantIdRef.current = data.id;
                    }
                }
                else if (data.type === 'partial') {
                    // 处理流式部分内容
                    console.log('部分消息:', data.content);
                    if (lastAssistantIdRef.current && data.role === 'assistant') {
                        // 更新现有的流式消息
                        setChatList(prev => {
                            const existingAssistant = prev.find(msg => msg.id === lastAssistantIdRef.current && msg.role === 'assistant');
                            if (existingAssistant) {
                                // 更新已有消息
                                return prev.map(msg => msg.id === lastAssistantIdRef.current
                                    ? Object.assign(Object.assign({}, msg), { content: data.content }) : msg);
                            }
                            else {
                                // 创建新的流式消息
                                lastAssistantIdRef.current = data.id;
                                return [...prev, Object.assign(Object.assign({}, data), { isStreaming: true })];
                            }
                        });
                    }
                }
                else if (data.type === 'error') {
                    // 处理错误消息
                    console.error('错误消息:', data.content);
                    setChatList(prev => [...prev, data]);
                    setIsSending(false);
                }
            }
            catch (error) {
                console.error('解析SSE消息失败:', error);
            }
        };
        sseRef.current.addEventListener('message', handleMessage);
        // 清理函数
        return () => {
            if (sseRef.current) {
                sseRef.current.close();
            }
        };
    }, []);
    // 生成唯一ID
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
    // 发送消息函数
    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!inputValue.trim() || isSending)
            return;
        const messageContent = inputValue.trim();
        const messageId = generateId();
        try {
            setIsSending(true);
            // 先将用户消息添加到聊天列表
            const userMessage = {
                id: messageId,
                type: 'message',
                role: 'user',
                content: messageContent
            };
            setChatList(prev => [...prev, userMessage]);
            // 清空输入框
            setInputValue('');
            // 发送POST请求到流式接口
            const response = yield fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageContent,
                    messageId: messageId
                })
            });
            if (!response.ok) {
                throw new Error(`服务器错误: ${response.status}`);
            }
            // 重置发送状态
            setIsSending(false);
        }
        catch (error) {
            console.error('发送消息失败:', error);
            // 添加错误消息到聊天列表
            setChatList(prev => [...prev, {
                    id: generateId(),
                    type: 'error',
                    role: 'assistant',
                    content: '发送消息失败，请稍后重试'
                }]);
            setIsSending(false);
        }
    });
    // 处理输入框键盘事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 flex flex-col", children: _jsxs("div", { className: "flex-1 p-4 overflow-hidden", children: [_jsx("div", { className: "flex flex-col gap-4 h-full overflow-y-auto mb-4 bg-white p-4 rounded-xl shadow-sm", children: chatList.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-500", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCAC" }), _jsx("p", { className: "text-lg font-medium", children: "\u6B22\u8FCE\u4F7F\u7528\u5206\u6790\u52A9\u624B" }), _jsx("p", { className: "text-sm mt-2", children: "\u8BF7\u8F93\u5165\u4F60\u7684\u95EE\u9898\uFF0C\u6211\u4F1A\u4E3A\u4F60\u63D0\u4F9B\u5206\u6790\u7ED3\u679C" })] })) : (chatList.map((item) => {
                        // 为AI消息添加头像和样式
                        if (item.role === 'assistant') {
                            return (_jsxs("div", { className: "flex items-start gap-3 self-start max-w-[80%]", children: [_jsx("div", { className: "w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold", children: "AI" }), _jsxs("div", { className: `bg-blue-100 p-3 rounded-lg rounded-tl-none ${item.type === 'error' ? 'bg-red-50 border border-red-100 text-red-600' : ''}`, children: [_jsx("p", { className: "text-gray-800", children: item.content }), item.isStreaming && (_jsxs("div", { className: "flex space-x-1 mt-1", children: [_jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: '200ms' } }), _jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: '400ms' } })] }))] })] }, item.id));
                        }
                        // 用户消息样式
                        else {
                            return (_jsxs("div", { className: "flex items-start gap-3 self-end max-w-[80%] justify-end", children: [_jsx("div", { className: "bg-green-100 p-3 rounded-lg rounded-tr-none", children: _jsx("p", { className: "text-gray-800", children: item.content }) }), _jsx("div", { className: "w-8 h-8 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center text-white font-bold", children: "\u6211" })] }, item.id));
                        }
                    })) }), _jsxs("div", { className: "flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200", children: [_jsx("input", { className: "flex-1 p-3 bg-transparent border-0 rounded-lg outline-none placeholder-gray-400 text-gray-800 focus:bg-gray-50 transition-colors duration-200", type: "text", placeholder: "\u8F93\u5165\u4F60\u7684\u95EE\u9898...", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyDown, disabled: isSending }), _jsx("button", { className: `px-6 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`, onClick: sendMessage, disabled: isSending || !inputValue.trim(), children: isSending ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "\u53D1\u9001\u4E2D" })] })) : ('发送') })] })] }) }));
};
export default memo(Analizy);
