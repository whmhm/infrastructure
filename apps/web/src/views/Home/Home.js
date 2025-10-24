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
import { useEffect, useState } from 'react';
import { useRecordStore } from '@/store/recordStore';
function Home() {
    const { notes, saveNote, getNotes, getNote, deleteNote, error, clearError } = useRecordStore();
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showNotes, setShowNotes] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [operationStatus, setOperationStatus] = useState({ type: null, message: '' });
    // 初始化加载笔记
    useEffect(() => {
        loadNotes();
    }, []);
    // 加载笔记数据
    const loadNotes = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            yield getNotes();
        }
        catch (err) {
            console.error('加载笔记失败:', err);
        }
        finally {
            setLoading(false);
        }
    });
    // 错误处理
    useEffect(() => {
        if (error) {
            setOperationStatus({ type: 'error', message: error });
            // 3秒后清除错误提示
            const timer = setTimeout(() => {
                clearError();
                setOperationStatus({ type: null, message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);
    // 1分钟自动保存草稿
    useEffect(() => {
        if (!inputValue.trim())
            return;
        const timer = setTimeout(() => {
            handleSaveDraft();
        }, 60000); // 1分钟
        return () => clearTimeout(timer);
    }, [inputValue]);
    // 保存草稿（使用API）
    const handleSaveDraft = () => __awaiter(this, void 0, void 0, function* () {
        if (!inputValue.trim())
            return;
        try {
            // 草稿保存也使用同样的API，只是不更新UI状态
            yield saveNote(inputValue, editingId || undefined);
            setDraftSaved(true);
            // 3秒后清除保存提示
            setTimeout(() => {
                setDraftSaved(false);
            }, 3000);
        }
        catch (err) {
            console.error('保存草稿失败:', err);
        }
    });
    // 添加或更新笔记
    const handleSaveNote = () => __awaiter(this, void 0, void 0, function* () {
        const content = inputValue.trim();
        if (!content)
            return;
        setLoading(true);
        try {
            yield saveNote(content, editingId || undefined);
            setInputValue('');
            setEditingId(null);
            setDraftSaved(false);
            setOperationStatus({ type: 'success', message: editingId ? '笔记更新成功' : '笔记创建成功' });
            // 3秒后清除成功提示
            setTimeout(() => {
                setOperationStatus({ type: null, message: '' });
            }, 3000);
        }
        catch (err) {
            console.error('保存笔记失败:', err);
            setOperationStatus({ type: 'error', message: '保存失败，请重试' });
        }
        finally {
            setLoading(false);
        }
    });
    // 编辑笔记
    const handleEditNote = (note) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const fullNote = yield getNote(note.id);
            if (fullNote) {
                setInputValue(fullNote.content);
                setEditingId(note.id);
                setShowNotes(false);
            }
        }
        catch (err) {
            console.error('加载笔记失败:', err);
        }
        finally {
            setLoading(false);
        }
    });
    // 删除笔记
    const handleDeleteNote = (id) => __awaiter(this, void 0, void 0, function* () {
        if (window.confirm('确定要删除这条笔记吗？')) {
            setLoading(true);
            try {
                yield deleteNote(id);
                setOperationStatus({ type: 'success', message: '笔记删除成功' });
                // 3秒后清除成功提示
                setTimeout(() => {
                    setOperationStatus({ type: null, message: '' });
                }, 3000);
                if (editingId === id) {
                    setInputValue('');
                    setEditingId(null);
                }
            }
            catch (err) {
                console.error('删除笔记失败:', err);
                setOperationStatus({ type: 'error', message: '删除失败，请重试' });
            }
            finally {
                setLoading(false);
            }
        }
    });
    // 取消编辑
    const handleCancelEdit = () => {
        setInputValue('');
        setEditingId(null);
    };
    // 切换笔记列表显示
    const toggleNotes = () => {
        setShowNotes(!showNotes);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsx("div", { className: "max-w-4xl mx-auto px-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [operationStatus.type && (_jsx("div", { className: `mb-4 p-3 rounded-md text-sm ${operationStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`, children: operationStatus.message })), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: editingId ? '编辑笔记' : '小记' }), _jsx("button", { onClick: toggleNotes, className: "text-sm text-blue-600 hover:text-blue-800", disabled: loading, children: showNotes ? '隐藏笔记' : '查看笔记' })] }), _jsxs("div", { className: "relative", children: [_jsx("textarea", { placeholder: editingId ? "编辑笔记内容..." : "随手记...", value: inputValue, onChange: (e) => {
                                            setInputValue(e.target.value);
                                            setDraftSaved(false);
                                        }, className: "flex-1 min-h-[100px] p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none", rows: 4, disabled: loading }), draftSaved && (_jsx("div", { className: "absolute bottom-2 right-2 text-xs text-green-600", children: "\u8349\u7A3F\u5DF2\u4FDD\u5B58\uFF08\u901A\u8FC7API\uFF09" }))] }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx("button", { onClick: handleSaveNote, disabled: !inputValue.trim() || loading, className: `px-4 py-2 rounded-md transition-colors ${inputValue.trim() && !loading ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`, children: loading ? '保存中...' : (editingId ? '更新' : '保存') }), editingId && (_jsx("button", { onClick: handleCancelEdit, className: "px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300", disabled: loading, children: "\u53D6\u6D88" })), _jsx("button", { onClick: handleSaveDraft, disabled: !inputValue.trim() || loading, className: `ml-auto px-3 py-1 rounded text-sm transition-colors ${inputValue.trim() && !loading ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`, children: "\u4FDD\u5B58\u8349\u7A3F" })] })] }), showNotes && (_jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "\u7B14\u8BB0\u5217\u8868" }), _jsx("button", { onClick: loadNotes, className: "text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1", disabled: loading, children: loading ? '刷新中...' : '🔄 刷新' })] }), loading && !notes.length ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "\u52A0\u8F7D\u4E2D..." })) : notes.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "\u6682\u65E0\u7B14\u8BB0\uFF0C\u5F00\u59CB\u521B\u5EFA\u7B2C\u4E00\u6761\u5427\uFF01" })) : (_jsx("div", { className: "space-y-3", children: notes.map((note) => (_jsx("div", { className: `p-3 border rounded-md transition-all ${editingId === note.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm mb-2 line-clamp-2", children: note.content }), _jsxs("div", { className: "flex gap-3 text-xs text-gray-500", children: [_jsxs("span", { children: ["\u521B\u5EFA: ", new Date(note.createdAt).toLocaleString()] }), note.updatedAt && note.updatedAt !== note.createdAt && (_jsxs("span", { children: ["\u66F4\u65B0: ", new Date(note.updatedAt).toLocaleString()] }))] })] }), _jsxs("div", { className: "flex gap-1 ml-2", children: [_jsx("button", { onClick: () => handleEditNote(note), className: "p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors", title: "\u7F16\u8F91", disabled: loading, children: "\u270F\uFE0F" }), _jsx("button", { onClick: () => handleDeleteNote(note.id), className: "p-1 text-red-600 hover:bg-red-100 rounded transition-colors", title: "\u5220\u9664", disabled: loading, children: "\uD83D\uDDD1\uFE0F" })] })] }) }, note.id))) }))] }))] }) }) }));
}
export default Home;
