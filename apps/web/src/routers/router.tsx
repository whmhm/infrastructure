import path from "path";
import React, { lazy, Suspense, useEffect } from "react";
import { createHashRouter, useNavigate, useLocation } from "react-router-dom";

// 使用React.lazy实现动态导入
const Index = lazy(() => import("@/views/Index/Index"));
const Login = lazy(() => import("@/views/Login/Login"));
const Home = lazy(() => import("@/views/Home/Home"));
const Me = lazy(() => import("@/views/Me/Me"));
const Analizy = lazy(() => import("@/views/Analizy/Analizy"));

// 路由守卫包装组件
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return <>{children}</>;
};

// 创建全局路由配置
const routes = [
  {
    path: '/',
    element: (
      <RequireAuth>
        <Suspense fallback={<div>加载中...</div>}>
          <Index />
        </Suspense>
      </RequireAuth>
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
      <RequireAuth>
        <Suspense fallback={<div>加载中...</div>}>
          <Analizy />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: '/home',
    element: (
      <RequireAuth>
        <Suspense fallback={<div>加载中...</div>}>
          <Home />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: '/me',
    element: (
      <RequireAuth>
        <Suspense fallback={<div>加载中...</div>}>
          <Me />
        </Suspense>
      </RequireAuth>
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
];

export const router = createHashRouter(routes);
