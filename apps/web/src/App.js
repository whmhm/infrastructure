import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routers/router'; // 假设路由配置文件为当前目录下的 routers.ts
import ErrorBoundary from './components/ErrorBoundary';
function App() {
    return (_jsx(ErrorBoundary, { children: _jsx("div", { children: _jsx(RouterProvider, { router: router }) }) }));
}
export default App;
