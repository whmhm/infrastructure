import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense, useEffect } from "react";
import { createHashRouter, useNavigate, useLocation } from "react-router-dom";
// 使用React.lazy实现动态导入
const Index = lazy(() => import("@/views/Index/Index"));
const Login = lazy(() => import("@/views/Login/Login"));
const Home = lazy(() => import("@/views/Home/Home"));
const Me = lazy(() => import("@/views/Me/Me"));
const Analizy = lazy(() => import("@/views/Analizy/Analizy"));
// 路由守卫包装组件
const RequireAuth = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        // 不需要验证token的路由
        const noNeedAuthPaths = ['/', '/login', '/404'];
        // 检查是否需要验证token
        if (!noNeedAuthPaths.includes(location.pathname)) {
            // 从localStorage获取token
            const token = localStorage.getItem('token');
            // 如果没有token，重定向到登录页
            if (!token) {
                navigate('/login');
            }
        }
    }, [location.pathname, navigate]);
    return _jsx(_Fragment, { children: children });
};
// 创建全局路由配置
const routes = [
    {
        path: '/',
        element: (_jsx(RequireAuth, { children: _jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Index, {}) }) })),
    },
    {
        path: '/login',
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Login, {}) })),
    },
    {
        path: '/analizy',
        element: (_jsx(RequireAuth, { children: _jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Analizy, {}) }) })),
    },
    {
        path: '/home',
        element: (_jsx(RequireAuth, { children: _jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Home, {}) }) })),
    },
    {
        path: '/me',
        element: (_jsx(RequireAuth, { children: _jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Me, {}) }) })),
    },
    {
        path: '/404',
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx("div", { children: "404 Not Found" }) })),
        errorElement: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx("div", { children: "404 Not Found" }) })),
    },
    {
        path: "*",
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx("div", { children: "404 Not Found" }) }))
    }
];
export const router = createHashRouter(routes);
