var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Tree } from '@infrastructure-monorepo/ui';
// Card, CardContent, CardHeader, CardTitle
import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = (e) => __awaiter(this, void 0, void 0, function* () {
        // e.preventDefault();
        // // 简单的登录验证
        // if (username && password) {
        //   setError('');
        //   try {
        //     const response = await login({ username, password });
        //     // 存储token到localStorage
        //     if (response?.token) {
        //       localStorage.setItem('token', response.token);
        //     }
        //     // 登录成功后跳转到首页
        //     navigate('/home');
        //   } catch (error: any) {
        //     // 处理不同类型的错误
        //     if (error.response?.data?.error) {
        //       setError(error.response.data.error);
        //     } else {
        //       setError('登录失败，请检查用户名和密码');
        //     }
        //   } 
        // } else {
        //   setError('请输入用户名和密码');
        // }
    });
    const treeData = [
        {
            id: "1111",
            name: "parent",
            dep: 0,
            active: true,
            children: [
                {
                    parentId: "1111",
                    id: "2222",
                    name: "children",
                    dep: 1,
                    active: false,
                    children: [
                        {
                            parentId: "2222",
                            id: "2-1",
                            dep: 2,
                            active: false,
                            name: "2-1 children",
                        }
                    ]
                }
            ]
        }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-md w-full space-y-8", children: _jsx(Tree, { data: treeData }) }) }));
}
export default Login;
