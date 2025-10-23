import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routers/router'
import { useUserStore } from './store/userStore'

// 在应用启动时初始化store
const { loadUsers } = useUserStore.getState();
loadUsers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)