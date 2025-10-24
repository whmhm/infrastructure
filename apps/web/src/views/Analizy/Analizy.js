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
import { memo, useState, useEffect } from "react";
import { ollamaService } from '@infrastructure-monorepo/api-client';
const Analizy = function () {
    const [chatList, setChatList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [serviceAvailable, setServiceAvailable] = useState(true);
    // 检查Ollama服务是否可用
    useEffect(() => {
        const checkService = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const available = yield ollamaService.healthCheck();
                setServiceAvailable(available);
            }
            catch (error) {
                console.error('服务检查失败:', error);
                setServiceAvailable(false);
            }
        });
        checkService();
        // 每30秒检查一次服务可用性
        const interval = setInterval(checkService, 30000);
        return () => clearInterval(interval);
    }, []);
    // 生成唯一ID
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
    // 发送消息函数
    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!inputValue.trim() || isSending || !serviceAvailable)
            return;
        const messageContent = inputValue.trim();
        const messageId = generateId();
        const assistantId = generateId();
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
            // 添加一个正在生成的AI消息占位符
            const partialAssistantMessage = {
                id: assistantId,
                type: 'message',
                role: 'assistant',
                content: '',
                isStreaming: true
            };
            setChatList(prev => [...prev, partialAssistantMessage]);
            // 调用Ollama服务分析内容
            const result = yield ollamaService.analyzeContent(messageContent);
            // 更新AI消息为完整内容
            setChatList(prev => prev.map(msg => msg.id === assistantId
                ? Object.assign(Object.assign({}, msg), { content: result, isStreaming: false }) : msg));
        }
        catch (error) {
            console.error('分析失败:', error);
            // 添加错误消息到聊天列表
            setChatList(prev => prev.map(msg => msg.id === assistantId && msg.isStreaming && msg.role === 'assistant'
                ? Object.assign(Object.assign({}, msg), { type: 'error', content: error.message || '分析内容失败，请确保Ollama服务正常运行', isStreaming: false }) : msg));
        }
        finally {
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
    return (_jsx("div", { className: "min-h-screen bg-gray-100 flex flex-col", children: _jsxs("div", { className: "flex-1 p-4 overflow-hidden", children: [!serviceAvailable && (_jsxs("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("span", { className: "font-medium", children: "Ollama\u670D\u52A1\u4E0D\u53EF\u7528" })] }), _jsx("p", { className: "mt-1 text-sm", children: "\u8BF7\u786E\u4FDD\uFF1A1. Ollama\u670D\u52A1\u5DF2\u542F\u52A8 2. deepseekv1\u6A21\u578B\u5DF2\u4E0B\u8F7D 3. \u7AEF\u53E311434\u672A\u88AB\u5360\u7528" })] })), _jsx("div", { className: "flex flex-col gap-4 h-full overflow-y-auto mb-4 bg-white p-4 rounded-xl shadow-sm", children: chatList.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-500", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83E\uDDE0" }), _jsx("p", { className: "text-lg font-medium", children: "DeepSeek \u5206\u6790\u52A9\u624B" }), _jsx("p", { className: "text-sm mt-2", children: "\u8F93\u5165\u6587\u672C\u5185\u5BB9\uFF0C\u4F7F\u7528\u672C\u5730 DeepSeek \u6A21\u578B\u8FDB\u884C\u667A\u80FD\u5206\u6790" }), serviceAvailable && (_jsx("p", { className: "text-xs mt-4 text-green-600", children: "\u2713 \u670D\u52A1\u8FDE\u63A5\u6B63\u5E38" }))] })) : (chatList.map((chatItem) => {
                        // 为AI消息添加头像和样式
                        if (chatItem.role === 'assistant') {
                            return (_jsxs("div", { className: "flex items-start gap-3 self-start max-w-[80%]", children: [_jsx("div", { className: "w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold", children: "AI" }), _jsxs("div", { className: `bg-blue-100 p-3 rounded-lg rounded-tl-none ${chatItem.type === 'error' ? 'bg-red-50 border border-red-100 text-red-600' : ''}`, children: [_jsx("p", { className: "text-gray-800", children: chatItem.content }), chatItem.isStreaming && (_jsxs("div", { className: "flex space-x-1 mt-1", children: [_jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: '200ms' } }), _jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: '400ms' } })] }))] })] }, chatItem.id));
                        }
                        // 用户消息样式
                        return (_jsxs("div", { className: "flex items-start gap-3 self-end max-w-[80%] justify-end", children: [_jsx("div", { className: "bg-green-100 p-3 rounded-lg rounded-tr-none", children: _jsx("p", { className: "text-gray-800", children: chatItem.content }) }), _jsx("div", { className: "w-8 h-8 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center text-white font-bold", children: "\u6211" })] }, chatItem.id));
                    })) }), _jsxs("div", { className: "flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200", children: [_jsx("textarea", { className: `flex-1 p-3 bg-transparent border-0 rounded-lg outline-none placeholder-gray-400 text-gray-800 focus:bg-gray-50 transition-colors duration-200 min-h-[80px] resize-none ${!serviceAvailable ? 'opacity-50' : ''}`, placeholder: "\u8F93\u5165\u8981\u5206\u6790\u7684\u6587\u672C\u5185\u5BB9...", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyDown, disabled: isSending || !serviceAvailable }), _jsx("button", { className: `px-6 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${(isSending || !serviceAvailable) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`, onClick: sendMessage, disabled: isSending || !inputValue.trim() || !serviceAvailable, children: isSending ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "\u53D1\u9001\u4E2D" })] })) : ('发送') })] })] }) }));
};
export default memo(Analizy);
