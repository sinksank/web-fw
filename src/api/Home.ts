import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
  
  class ApiClient {
    private instance: AxiosInstance;
  
    constructor(baseURL: string = "http://localhost:8080") {
      this.instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      });
  
      // 请求拦截器
      this.instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          const token = localStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = token
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
  
      // 响应拦截器
      this.instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error) => {
          console.error('API 请求错误：', error.response || error.message);
          return Promise.reject(error);
        }
      );
    }
  
    // GET 请求
    get<T>(url: string, params?: Record<string, any>): Promise<T> {
      return this.instance.get(url, { params });
    }
  
    // POST 请求
    post<T>(url: string, data?: Record<string, any>): Promise<T> {
      return this.instance.post(url, data);
    }
  
    // PUT 请求
    put<T>(url: string, data?: Record<string, any>): Promise<T> {
      return this.instance.put(url, data);
    }
  
    // DELETE 请求
    delete<T>(url: string): Promise<T> {
      return this.instance.delete(url);
    }
  }
  
  export default new ApiClient("http://localhost:8080");
  