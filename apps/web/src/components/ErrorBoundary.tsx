import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级 UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 你同样可以将错误日志上报给服务器
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // 自定义降级 UI
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">应用发生错误</h2>
            <p className="text-gray-600 mb-2">很抱歉，页面出现了问题。</p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md text-left text-sm text-red-700">
                <p className="font-semibold">错误信息:</p>
                <pre className="mt-2 whitespace-pre-wrap">{error.toString()}</pre>
              </div>
            )}
            <button
              onClick={this.resetError}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;