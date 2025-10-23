import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
import { createHashRouter } from "react-router-dom";
// 使用React.lazy实现动态导入
const Index = lazy(() => import("@/views/Index/Index"));
const Login = lazy(() => import("@/views/Login/Login"));
const Home = lazy(() => import("@/views/Home/Home"));
const Me = lazy(() => import("@/views/Me/Me"));
const Analizy = lazy(() => import("@/views/Analizy/Analizy"));
export const router = createHashRouter([
    {
        path: '/',
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Index, {}) })),
    },
    {
        path: '/login',
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Login, {}) })),
    },
    {
        path: '/analizy',
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Analizy, {}) })),
    },
    {
        path: '/home',
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Home, {}) })),
    },
    {
        path: '/me',
        element: (_jsx(Suspense, { fallback: _jsx("div", { children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(Me, {}) })),
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
]);
