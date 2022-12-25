import axios from 'axios';

axios.defaults.headers.common['Authorization'] = 'Bearer None';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 20000;

// 添加请求拦截器
axios.interceptors.request.use(
    (config) => {
      // 请求
      return config;
    },
    (error) => {
      // 请求错误
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器
axios.interceptors.response.use(
    (response) => {
      // 响应数据
      return response;
    },
    (error) => {
      // 对响应错误
      return Promise.reject(error);
    }
  );

  const httpUtil = {
    // 基础响应信息
    baseResponseData: { statusCode: 500, succeed: false, errorMessage: 'net::ERR_CONNECTION_REFUSED', data: null },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SetBaseUrl(url:string){
      //axios.defaults.baseURL = 'https://fanyi-api.baidu.com';
      axios.defaults.baseURL = url;
    },
    // Get
    async get(url:string, params:any) {
      return new Promise((resolve) => {
        axios
          .get(url, { params: params })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              resolve(error.response.data);
            }
            resolve(this.baseResponseData);
          });
      });
    },  
  };
  
  export default httpUtil;