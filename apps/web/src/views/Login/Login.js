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
import { useState } from 'react';
import { Button, Input } from '@infrastructure-monorepo/ui';
// Card, CardContent, CardHeader, CardTitle
import { useNavigate } from 'react-router-dom';
import { login } from '@infrastructure-monorepo/api-client';
function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // 简单的登录验证
        if (username && password) {
            setError('');
            try {
                yield login({ username, password });
                // 登录成功后跳转到首页
                navigate('/home');
            }
            catch (error) {
                setError('登录失败，请检查用户名和密码');
            }
        }
        else {
            setError('请输入用户名和密码');
        }
    });
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-md w-full space-y-8", children: _jsxs("div", { className: 'bg-white p-16 rounded-lg shadow-md', children: [_jsx("div", { className: 'mb-4', children: _jsx("h2", { className: "text-center text-2xl font-bold text-gray-900", children: "\u7528\u6237\u767B\u5F55" }) }), _jsx("div", { children: _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleLogin, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700 mb-1", children: "\u7528\u6237\u540D" }), _jsx(Input, { id: "username", name: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true, placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D", className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "\u5BC6\u7801" }), _jsx(Input, { id: "password", name: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801", className: "w-full" })] }), error && (_jsx("div", { className: "text-red-500 text-sm text-center", children: error }))] }), _jsx("div", { children: _jsx(Button, { type: "submit", className: "w-full", children: "\u767B\u5F55" }) })] }) })] }) }) }));
}
export default Login;
