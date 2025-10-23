import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface DefaultOptions {
    baseURL: string;
    timeout: number;
    headers: Record<string, string | number | boolean>;
}

// 环境配置
const envConfigs = {
    // ((import.meta as any).env?.VITE_API_BASE_URL) || 
    development: {
        baseURL: 'http://localhost:3000/',
        timeout: 10000,
    },
    production: {
        baseURL: ((import.meta as any).env?.VITE_API_BASE_URL) || 'https://api.example.com',
        timeout: 15000,
    }
};

// 获取当前环境
const getCurrentEnvironment = () => {
    // 使用 Vite 的环境变量访问方式
    const viteEnv = (import.meta as any).env;
    
    // 检查是否是生产环境
    if (viteEnv?.MODE === 'production' || viteEnv?.NODE_ENV === 'production') {
        return 'production';
    }
    
    // 默认为开发环境
    return 'development';
};
class HttpService {
    httpInstance: AxiosInstance;

    constructor(options: Partial<DefaultOptions> = {}) {
        
        const requestHeader = this.getConfig(options);
        this.httpInstance = axios.create({
            ...requestHeader,
        });

        this.setupInterceptors();
    }

    getConfig(options: Partial<DefaultOptions>) {
        const currentEnv = getCurrentEnvironment();
        const envConfig = envConfigs[currentEnv];
        
        console.log('options', envConfig);

        const defaultOptions: Partial<DefaultOptions> = {
            baseURL: envConfig.baseURL,
            timeout: envConfig.timeout,
            headers: {
                "Content-Type": "application/json",
            },
        };
        
        return Object.assign({}, defaultOptions, options);
    }
    
    setupInterceptors() {
        this.interceptors();
        this.interceptorsResponse();
    }

    interceptors() {
        this.httpInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // 安全地访问 localStorage
                const token = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
                if (token) {
                    config.headers.set("Authorization", `Bearer ${token}`);
                }
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );
    }

    interceptorsResponse() {
        this.httpInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 对响应数据做点什么
                if (response.data?.code === 200) {
                    return response.data;
                }
                return response;
            },
            (error: any) => {
                this.handleError(error);
                return Promise.reject(error);
            }
        );
    }

    // 错误处理
    handleError(error: any): void {
        if (error.response) {
            // 请求已发送，服务器返回状态码不在 2xx 范围内
            console.error("服务器返回错误:", error.response.status, error.response?.data);
        } else if (error.request) {
            // 请求已发送，但没有收到响应
            console.error("请求已发送，但没有收到响应:", error.request);
        } else {
            // 其他错误
            console.error("发生错误:", error?.message || error);
        }
    }

    request<T = any>(config: Partial<InternalAxiosRequestConfig>): Promise<T> {
        // 确保配置对象存在
        const requestConfig = { ...config };
        
        // 处理baseURL和url的拼接，避免重复的斜杠
        if (requestConfig.url) {
            const baseURL = this.httpInstance.defaults.baseURL || '';
            const url = requestConfig.url;
            
            // 智能拼接baseURL和url，避免重复的斜杠
            if (baseURL && url) {
                const baseEndsWithSlash = baseURL.endsWith('/');
                const urlStartsWithSlash = url.startsWith('/');
                
                if (baseEndsWithSlash && urlStartsWithSlash) {
                    requestConfig.url = baseURL + url.substring(1);
                } else if (!baseEndsWithSlash && !urlStartsWithSlash) {
                    requestConfig.url = baseURL + '/' + url;
                } else {
                    // 其他情况直接拼接
                    requestConfig.url = baseURL + url;
                }
            }
        }
        console.log('requestConfig',requestConfig);
        
        
        return this.httpInstance(requestConfig) as Promise<T>;
    }
}

export { HttpService };
