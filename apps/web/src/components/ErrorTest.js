import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const ErrorTest = ({ title = '错误边界测试组件' }) => {
    const [shouldThrowError, setShouldThrowError] = useState(false);
    // 当状态为true时抛出错误
    if (shouldThrowError) {
        throw new Error('这是一个测试错误，用于验证错误边界功能');
    }
    return (_jsxs("div", { className: "p-6 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: title }), _jsx("p", { className: "text-gray-600 mb-6", children: "\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u5C06\u89E6\u53D1\u4E00\u4E2A\u9519\u8BEF\uFF0C\u9519\u8BEF\u8FB9\u754C\u7EC4\u4EF6\u5E94\u8BE5\u6355\u83B7\u8FD9\u4E2A\u9519\u8BEF\u5E76\u663E\u793A\u53CB\u597D\u7684\u9519\u8BEF\u754C\u9762\u3002" }), _jsx("button", { onClick: () => setShouldThrowError(true), className: "px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors", children: "\u89E6\u53D1\u9519\u8BEF" })] }));
};
export default ErrorTest;
