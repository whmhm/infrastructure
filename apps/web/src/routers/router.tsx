import path from "path";
import React, { lazy, Suspense } from "react";
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
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Index />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/analizy',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Analizy />
      </Suspense>
    ),
  },
  {
    path: '/home',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/me',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Me />
      </Suspense>
    ),
  },
  {
    path: '/404',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <div>404 Not Found</div>
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<div>加载中...</div>}>
        <div>404 Not Found</div>
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <div>404 Not Found</div>
      </Suspense>
    )
  }
]);
