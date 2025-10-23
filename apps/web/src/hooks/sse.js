export class SEEventSource {
    constructor(url, options = {}) {
        var _a, _b, _c;
        this.eventSource = null;
        this.retryCount = 0;
        this.retryTimer = null;
        this.isManuallyClosed = false;
        this.eventListeners = new Map();
        this.url = url;
        this.options = Object.assign({ maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : 5, retryInterval: (_b = options.retryInterval) !== null && _b !== void 0 ? _b : 1000, maxRetryInterval: (_c = options.maxRetryInterval) !== null && _c !== void 0 ? _c : 30000 }, options);
    }
    /**
     * 建立SSE连接
     */
    connect() {
        try {
            // 创建EventSource实例
            this.eventSource = new EventSource(this.url);
            // 设置标准事件监听器
            this.setupDefaultListeners();
            // 恢复用户自定义事件监听器
            this.restoreEventListeners();
            // 重置重试计数
            this.retryCount = 0;
        }
        catch (error) {
            console.error('SSE连接初始化失败:', error);
            this.handleConnectionError();
        }
    }
    /**
     * 设置默认事件监听器
     */
    setupDefaultListeners() {
        if (!this.eventSource)
            return;
        this.eventSource.addEventListener('open', (event) => {
            console.log('SSE连接已打开', event);
        });
        this.eventSource.addEventListener('error', (error) => {
            console.error('SSE连接错误:', error);
            this.handleConnectionError();
        });
        // 默认message事件监听器
        this.eventSource.addEventListener('message', (event) => {
            console.log('收到SSE消息:', event.data);
        });
    }
    /**
     * 处理连接错误并重试
     */
    handleConnectionError() {
        // 清理当前连接
        this.cleanup();
        // 如果是手动关闭，不进行重试
        if (this.isManuallyClosed) {
            return;
        }
        // 检查是否达到最大重试次数
        if (this.retryCount >= this.options.maxRetries) {
            console.error(`已达到最大重试次数(${this.options.maxRetries})，停止重试`);
            return;
        }
        // 计算重试间隔（指数退避）
        this.retryCount++;
        const retryInterval = Math.min(this.options.retryInterval * Math.pow(2, this.retryCount - 1), this.options.maxRetryInterval);
        console.log(`将在${retryInterval}ms后进行第${this.retryCount}次重试`);
        // 设置重试定时器
        this.retryTimer = setTimeout(() => {
            console.log(`开始第${this.retryCount}次重试`);
            this.connect();
        }, retryInterval);
    }
    /**
     * 添加自定义事件监听器
     */
    addEventListener(event, listener) {
        // 保存监听器到映射中
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(listener);
        // 如果连接已存在，立即添加监听器
        if (this.eventSource) {
            this.eventSource.addEventListener(event, listener);
        }
    }
    /**
     * 移除事件监听器
     */
    removeEventListener(event, listener) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                this.eventListeners.delete(event);
            }
        }
        // 如果连接已存在，立即移除监听器
        if (this.eventSource) {
            this.eventSource.removeEventListener(event, listener);
        }
    }
    /**
     * 恢复所有事件监听器
     */
    restoreEventListeners() {
        if (!this.eventSource)
            return;
        this.eventListeners.forEach((listeners, event) => {
            // 跳过标准事件，它们已经在setupDefaultListeners中设置
            if (['open', 'error', 'message'].includes(event)) {
                return;
            }
            listeners.forEach(listener => {
                this.eventSource.addEventListener(event, listener);
            });
        });
    }
    /**
     * 清理资源
     */
    cleanup() {
        // 清除重试定时器
        if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = null;
        }
        // 关闭EventSource连接
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
    /**
     * 手动关闭连接
     */
    close() {
        this.isManuallyClosed = true;
        this.cleanup();
        console.log('SSE连接已手动关闭');
    }
    /**
     * 重新打开连接
     */
    reconnect() {
        this.isManuallyClosed = false;
        this.cleanup();
        this.connect();
    }
    /**
     * 获取连接状态
     */
    isConnected() {
        return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
    }
    /**
     * 获取当前重试次数
     */
    getRetryCount() {
        return this.retryCount;
    }
}
