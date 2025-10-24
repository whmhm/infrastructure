import axios from 'axios';

interface OllamaRequest {
  model: string;
  prompt: string;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
  stream?: boolean;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
}

interface OllamaError {
  error: string;
}

class OllamaService {
  private baseURL: string;
  private defaultModel: string;
  private axiosInstance;

  constructor() {
    this.baseURL = 'http://localhost:11434/api';
    this.defaultModel = 'deepseek-r1';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // 增加超时时间到60秒，以便处理较长的推理时间
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('Ollama请求:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('Ollama请求配置错误:', error);
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          // 服务器返回了错误状态码
          const errorData = error.response.data as OllamaError;
          console.error('Ollama服务错误:', errorData.error || error.message);
          return Promise.reject(new Error(errorData.error || `Ollama服务错误: ${error.response.status}`));
        } else if (error.request) {
          // 请求已发出但没有收到响应
          console.error('Ollama服务无响应:', error.message);
          return Promise.reject(new Error('Ollama服务无响应，请确保本地Ollama服务已启动且端口11434可用'));
        } else {
          // 请求配置出错
          return Promise.reject(new Error(error.message));
        }
      }
    );
  }

  /**
   * 生成文本回复
   * @param prompt 用户输入的提示
   * @param options 模型参数选项
   * @param model 模型名称，默认为deepseekv1
   * @returns Promise<OllamaResponse>
   */
  async generate(prompt: string, options?: OllamaRequest['options'], model?: string): Promise<OllamaResponse> {
    try {
      const request: OllamaRequest = {
        model: model || this.defaultModel,
        prompt,
        options: {
          temperature: 0.7,
          max_tokens: 1024,
          ...options,
        },
        stream: false,
      };

      const response = await this.axiosInstance.post('/generate', request);
      return response.data;
    } catch (error) {
      console.error('Ollama generate error:', error);
      throw new Error('连接Ollama服务失败，请确保本地Ollama服务已启动且deepseek-r1模型已下载');
    }
  }

  /**
   * 分析文本内容
   * @param text 要分析的文本
   * @returns Promise<string> 分析结果
   */
  async analyzeContent(text: string): Promise<string> {
    // 对输入文本进行预处理，限制长度以避免请求过大
    const maxTextLength = 4000;
    const processedText = text.length > maxTextLength 
      ? text.substring(0, maxTextLength) + '...（文本过长已截断）' 
      : text;

    const prompt = `请分析以下文本内容:\n\n${processedText}\n\n分析要点：\n1. 主要主题\n2. 关键观点\n3. 情感倾向\n4. 可能的改进建议\n\n请用简洁清晰的语言进行分析，确保回答全面且条理清晰。`;

    const response = await this.generate(prompt, {
      temperature: 0.7,      // 保持一定的创造性
      max_tokens: 2048,      // 允许更长的回复
      top_p: 0.9,           // 控制输出多样性
    });
    return response.response;
  }

  /**
   * 检查Ollama服务是否可用
   * @returns Promise<boolean>
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/tags', { timeout: 5000 });
      // 检查响应中是否包含deepseek-r1模型
      if (response.data && response.data.models) {
        const hasDeepseekModel = response.data.models.some(
          (model: any) => model.name === 'deepseek-r1'
        );
        if (!hasDeepseekModel) {
          console.warn('Ollama服务可用，但未找到deepseek-r1模型');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Ollama服务不可用:', error);
      return false;
    }
  }
}

// 创建单例实例
export const ollamaService = new OllamaService();

export default ollamaService;