import { useEffect, useState } from 'react';
import { useRecordStore } from '@/store/recordStore';

function Home() {
  const { notes, saveNote, getNotes, getNote, deleteNote, error, clearError } = useRecordStore();
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [operationStatus, setOperationStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''});

  // 初始化加载笔记
  useEffect(() => {
    loadNotes();
  }, []);

  // 加载笔记数据
  const loadNotes = async () => {
    setLoading(true);
    try {
      await getNotes();
    } catch (err) {
      console.error('加载笔记失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 错误处理
  useEffect(() => {
    if (error) {
      setOperationStatus({type: 'error', message: error});
      // 3秒后清除错误提示
      const timer = setTimeout(() => {
        clearError();
        setOperationStatus({type: null, message: ''});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // 1分钟自动保存草稿
  useEffect(() => {
    if (!inputValue.trim()) return;
    
    const timer = setTimeout(() => {
      handleSaveDraft();
    }, 60000); // 1分钟
    
    return () => clearTimeout(timer);
  }, [inputValue]);

  // 保存草稿（使用API）
  const handleSaveDraft = async () => {
    if (!inputValue.trim()) return;
    
    try {
      // 草稿保存也使用同样的API，只是不更新UI状态
      await saveNote(inputValue, editingId || undefined);
      setDraftSaved(true);
      
      // 3秒后清除保存提示
      setTimeout(() => {
        setDraftSaved(false);
      }, 3000);
    } catch (err) {
      console.error('保存草稿失败:', err);
    }
  };

  // 添加或更新笔记
  const handleSaveNote = async () => {
    const content = inputValue.trim();
    if (!content) return;
    
    setLoading(true);
    try {
      await saveNote(content, editingId || undefined);
      setInputValue('');
      setEditingId(null);
      setDraftSaved(false);
      setOperationStatus({type: 'success', message: editingId ? '笔记更新成功' : '笔记创建成功'});
      
      // 3秒后清除成功提示
      setTimeout(() => {
        setOperationStatus({type: null, message: ''});
      }, 3000);
    } catch (err) {
      console.error('保存笔记失败:', err);
      setOperationStatus({type: 'error', message: '保存失败，请重试'});
    } finally {
      setLoading(false);
    }
  };

  // 编辑笔记
  const handleEditNote = async (note: any) => {
    setLoading(true);
    try {
      const fullNote = await getNote(note.id);
      if (fullNote) {
        setInputValue(fullNote.content);
        setEditingId(note.id);
        setShowNotes(false);
      }
    } catch (err) {
      console.error('加载笔记失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 删除笔记
  const handleDeleteNote = async (id: number) => {
    if (window.confirm('确定要删除这条笔记吗？')) {
      setLoading(true);
      try {
        await deleteNote(id);
        setOperationStatus({type: 'success', message: '笔记删除成功'});
        
        // 3秒后清除成功提示
        setTimeout(() => {
          setOperationStatus({type: null, message: ''});
        }, 3000);
        
        if (editingId === id) {
          setInputValue('');
          setEditingId(null);
        }
      } catch (err) {
        console.error('删除笔记失败:', err);
        setOperationStatus({type: 'error', message: '删除失败，请重试'});
      } finally {
        setLoading(false);
      }
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setInputValue('');
    setEditingId(null);
  };

  // 切换笔记列表显示
  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* 操作状态提示 */}
          {operationStatus.type && (
            <div className={`mb-4 p-3 rounded-md text-sm ${operationStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {operationStatus.message}
            </div>
          )}
          
          {/* 笔记输入区域 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingId ? '编辑笔记' : '小记'}</h2>
              <button 
                onClick={toggleNotes} 
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={loading}
              >
                {showNotes ? '隐藏笔记' : '查看笔记'}
              </button>
            </div>
            
            <div className="relative">
                <textarea
                  placeholder={editingId ? "编辑笔记内容..." : "随手记..."}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setDraftSaved(false);
                  }}
                  className="flex-1 min-h-[100px] p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
                  rows={4}
                  disabled={loading}
                />
              
              {draftSaved && (
                <div className="absolute bottom-2 right-2 text-xs text-green-600">
                  草稿已保存（通过API）
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleSaveNote} 
                disabled={!inputValue.trim() || loading}
                className={`px-4 py-2 rounded-md transition-colors ${inputValue.trim() && !loading ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {loading ? '保存中...' : (editingId ? '更新' : '保存')}
              </button>
              
              {editingId && (
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                  disabled={loading}
                >
                  取消
                </button>
              )}
              
              <button 
                onClick={handleSaveDraft}
                disabled={!inputValue.trim() || loading}
                className={`ml-auto px-3 py-1 rounded text-sm transition-colors ${inputValue.trim() && !loading ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                保存草稿
              </button>
            </div>
          </div>
          
          {/* 笔记列表，仅在点击查看时显示 */}
          {showNotes && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">笔记列表</h3>
                <button 
                  onClick={loadNotes} 
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  disabled={loading}
                >
                  {loading ? '刷新中...' : '🔄 刷新'}
                </button>
              </div>
              
              {loading && !notes.length ? (
                <div className="text-center py-8 text-gray-500">
                  加载中...
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无笔记，开始创建第一条吧！
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div 
                      key={note.id} 
                      className={`p-3 border rounded-md transition-all ${editingId === note.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm mb-2 line-clamp-2">{note.content}</p>
                          <div className="flex gap-3 text-xs text-gray-500">
                            <span>创建: {new Date(note.createdAt).toLocaleString()}</span>
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                              <span>更新: {new Date(note.updatedAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button 
                            onClick={() => handleEditNote(note)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="编辑"
                            disabled={loading}
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="删除"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;