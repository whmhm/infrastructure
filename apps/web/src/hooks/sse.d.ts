interface SEOptions {
    maxRetries?: number;
    retryInterval?: number;
    maxRetryInterval?: number;
}
export declare class SEEventSource {
    private url;
    private options;
    private eventSource;
    private retryCount;
    private retryTimer;
    private isManuallyClosed;
    private eventListeners;
    constructor(url: string, options?: SEOptions);
    /**
     * 建立SSE连接
     */
    connect(): void;
    /**
     * 设置默认事件监听器
     */
    private setupDefaultListeners;
    /**
     * 处理连接错误并重试
     */
    private handleConnectionError;
    /**
     * 添加自定义事件监听器
     */
    addEventListener(event: string, listener: EventListener): void;
    /**
     * 移除事件监听器
     */
    removeEventListener(event: string, listener: EventListener): void;
    /**
     * 恢复所有事件监听器
     */
    private restoreEventListeners;
    /**
     * 清理资源
     */
    private cleanup;
    /**
     * 手动关闭连接
     */
    close(): void;
    /**
     * 重新打开连接
     */
    reconnect(): void;
    /**
     * 获取连接状态
     */
    isConnected(): boolean;
    /**
     * 获取当前重试次数
     */
    getRetryCount(): number;
}
export {};
//# sourceMappingURL=sse.d.ts.map