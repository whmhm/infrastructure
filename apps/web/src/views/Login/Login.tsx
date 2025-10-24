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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的登录验证
    if (username && password) {
      setError('');
      try {
        const response = await login({ username, password });
        
        // 存储token到localStorage
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
        
        // 登录成功后跳转到首页
        navigate('/home');
      } catch (error: any) {
        // 处理不同类型的错误
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError('登录失败，请检查用户名和密码');
        }
      } 
    } else {
      setError('请输入用户名和密码');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
    
        <div className='bg-white p-16 rounded-lg shadow-md'>
          <div className='mb-4'>
            <h2 className="text-center text-2xl font-bold text-gray-900">用户登录</h2>
          </div>
          <div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="请输入用户名"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    密码
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="请输入密码"
                    className="w-full"
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>
              <div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;