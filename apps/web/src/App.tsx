import { RouterProvider } from 'react-router-dom';
import { router } from '@/routers/router'; // 假设路由配置文件为当前目录下的 routers.ts
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div>
        <RouterProvider router={router}>
        
        </RouterProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;