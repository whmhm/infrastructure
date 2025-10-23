var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Input } from '@infrastructure-monorepo/ui';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useDraft } from '@/store/draftStore';
function Home() {
    const navigate = useNavigate();
    const { users, loading, error, loadUsers, addUser } = useUserStore();
    const { saveDraft, getDraft } = useDraft();
    const [newUserName, setNewUserName] = useState('');
    const handleAddUser = () => {
        if (!newUserName.trim())
            return;
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
    const handleSaveDraft = () => __awaiter(this, void 0, void 0, function* () {
        yield saveDraft();
    });
    // 挂载时查询是否存在草稿
    // useEffect(() => {
    //   getDraft();
    // }, []);
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsx("div", { className: "max-w-4xl mx-auto px-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "\u5C0Fws\u8BB0" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { placeholder: "\u968F\u624B\u8BB0...", value: newUserName, onChange: (e) => setNewUserName(e.target.value), className: "flex-1" }), _jsx(Button, { onClick: handleAddUser, disabled: !newUserName.trim(), children: "+" })] }), _jsx("div", {})] }), _jsx("div", { className: "mb-8", children: _jsx(Button, { variant: "secondary", onClick: loadUsers, disabled: loading, children: loading ? '加载中...' : '刷新' }) }), _jsx("div", { children: loading ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" }), _jsx("p", { className: "mt-2 text-gray-600", children: "\u52A0\u8F7D\u4E2D..." })] })) : error ? (_jsx("div", { className: "text-center py-8 text-red-500", children: error })) : (_jsx("div", { className: "space-y-3", children: users.map((user) => (_jsxs("div", { className: "p-3 border rounded-md flex justify-between items-center", children: [_jsx("span", { children: user.name }), _jsx("span", { className: "text-sm text-gray-500", children: user.email })] }, user.id))) })) })] }) }) }));
}
export default Home;
