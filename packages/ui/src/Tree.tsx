import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface TreeItem {
  id: string;
  name: string;
  parentId?: string;
  dep?: number;
  active: boolean;
  children?: TreeItem[];
}

interface TreeProps {
  data: TreeItem[];
}

// 递归复制树形结构数据，并设置根节点默认展开
const cloneTreeData = (data: TreeItem[], isRoot = true): TreeItem[] => {
  return data.map(item => ({
    ...item,
    // 根节点默认展开
    active: isRoot ? true : item.active,
    children: item.children ? cloneTreeData(item.children, false) : undefined
  }));
};

export const Tree: React.FC<TreeProps> = ({ data }) => {
  // 使用本地状态管理树数据 
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  
  // 初始化树数据，创建副本避免直接修改props
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setTreeData(cloneTreeData(data));
    }
  }, [JSON.stringify(data)]);
  
  // 递归查找并更新节点的active状态
  const toggleNode = (nodes: TreeItem[], targetId: string): TreeItem[] => {
    return nodes.map(node => {
      if (node.id === targetId) {
        return {
          ...node,
          active: !node.active
        };
      }
      if (node.children) {
        return {
          ...node,
          children: toggleNode(node.children, targetId)
        };
      }
      return node;
    });
  };
  
  // 处理节点点击事件
  const handleToggle = (e: React.MouseEvent, item: TreeItem) => {
    e.stopPropagation();
    // 只有有子节点的节点才可以展开/收起
    if (item.children && item.children.length > 0) {
      setTreeData(prevData => toggleNode(prevData, item.id));
    }
  };
  
  // 根据深度计算缩进样式
  const getIndentClass = (depth: number) => {
    // 使用Tailwind支持的标准margin类名
    const indentClasses = {
      0: '4px',  // 缩进样式
      1: '8px',
      2: '12px',
      3: '16px',
      4: '20px'
    };
    // 对于深度大于4的节点，使用最大缩进
    return indentClasses[depth as keyof typeof indentClasses] || '24px';
  };
  
  // 递归渲染树节点
  const renderNode = (node: TreeItem) => {
    const depth = node.dep || 0;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="w-full">
        <div 
          className={clsx(
            'w-full', 
            'py-2',
            hasChildren ? 'cursor-pointer' : '', 
            'hover:bg-gray-100', 
            'flex', 
            'items-center'
          )}
          onClick={(e) => handleToggle(e, node)}
          style={{ cursor: hasChildren ? 'pointer' : 'default', paddingLeft: getIndentClass(depth) }}
        >
          {/* 只有有子节点的才显示展开/收起图标 */}
          {hasChildren && (
            <span className="inline-block mr-2 w-4 text-gray-500 text-xs">
              {node.active ? '▼' : '▶'}
            </span>
          )}
          {node.name}
        </div>
        
        {/* 当节点激活且有子节点时显示子节点 */}
        {node.active && hasChildren && (
          <div>
            {node.children?.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };
  
  // 确保treeData是数组
  if (!Array.isArray(treeData)) {
    return <div>Invalid tree data</div>;
  }
  
  return (
    <div className="w-full">
      {treeData.map(node => renderNode(node))}
    </div>
  );
};
