import React, { useState } from 'react';

interface ErrorTestProps {
  title?: string;
}

const ErrorTest: React.FC<ErrorTestProps> = ({ title = '错误边界测试组件' }) => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // 当状态为true时抛出错误
  if (shouldThrowError) {
    throw new Error('这是一个测试错误，用于验证错误边界功能');
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">
        点击下方按钮将触发一个错误，错误边界组件应该捕获这个错误并显示友好的错误界面。
      </p>
      <button
        onClick={() => setShouldThrowError(true)}
        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        触发错误
      </button>
    </div>
  );
};

export default ErrorTest;