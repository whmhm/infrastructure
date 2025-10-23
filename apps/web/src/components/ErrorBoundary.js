import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.resetError = () => {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
            });
        };
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }
    static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级 UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }
    componentDidCatch(error, errorInfo) {
        // 你同样可以将错误日志上报给服务器
        console.error('React Error Boundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }
    render() {
        const { hasError, error, errorInfo } = this.state;
        const { children, fallback } = this.props;
        if (hasError) {
            // 自定义降级 UI
            if (fallback) {
                return fallback;
            }
            return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-red-600 mb-4", children: "\u5E94\u7528\u53D1\u751F\u9519\u8BEF" }), _jsx("p", { className: "text-gray-600 mb-2", children: "\u5F88\u62B1\u6B49\uFF0C\u9875\u9762\u51FA\u73B0\u4E86\u95EE\u9898\u3002" }), error && (_jsxs("div", { className: "mt-4 p-4 bg-red-50 rounded-md text-left text-sm text-red-700", children: [_jsx("p", { className: "font-semibold", children: "\u9519\u8BEF\u4FE1\u606F:" }), _jsx("pre", { className: "mt-2 whitespace-pre-wrap", children: error.toString() })] })), _jsx("button", { onClick: this.resetError, className: "mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors", children: "\u91CD\u8BD5" })] }) }));
        }
        return children;
    }
}
export default ErrorBoundary;
