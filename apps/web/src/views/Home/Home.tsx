import { useEffect, useState } from 'react';
import { Button, Input } from '@infrastructure-monorepo/ui';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useDraft } from '@/store/draftStore';
import ErrorTest from '@/components/ErrorTest';

function Home() {
  const navigate = useNavigate();
  const { users, loading, error, loadUsers, addUser } = useUserStore();
  const { saveDraft, getDraft } = useDraft()
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = () => {
    if (!newUserName.trim()) return;

    addUser(newUserName);
    setNewUserName('');
  };
  // // 输入内容一分钟没有添加保存为草稿
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleSaveDraft();
  //   }, 60000);
  //   return () => clearTimeout(timer);
  // }, [newUserName]);

  const handleSaveDraft = async () => {
    await saveDraft();
  }
  // 挂载时查询是否存在草稿
  // useEffect(() => {
  //   getDraft();
  // }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* 添加用户表单 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">小ws记</h2>
            <div className="flex gap-2">
              <Input
                placeholder="随手记..."
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddUser} disabled={!newUserName.trim()}>
                +
              </Button>
            </div>
            <div></div>
          </div>
          <div className="mb-8">
            <Button variant="secondary" onClick={loadUsers} disabled={loading}>
              {loading ? '加载中...' : '刷新'}
            </Button>
          </div>
          {/* 错误边界测试组件
          <div className="mb-8">
            <ErrorTest title="错误边界测试" />
          </div> */}
          
          {/* 用户列表 */}
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">加载中...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="p-3 border rounded-md flex justify-between items-center">
                    <span>{user.name}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;