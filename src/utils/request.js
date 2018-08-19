import axios from 'axios';
import querystring from 'querystring';
// import Message from '../components/basic/Message'
import { BASE_API } from '../config';

//设置默认请求头
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
// 发送请求前处理request的数据
// axios.defaults.transformRequest = [
//   function(data) {
//     return querystring.stringify(data);
//   }
// ];
// 带cookie请求 axios.defaults.withCredentials = true;

// 创建axios实例
const service = axios.create({
  baseURL: BASE_API, // api的base_url
  timeout: 30000, // 请求超时时间
  transformRequest: [
    function(data) {
      // Do whatever you want to transform the data
      return querystring.stringify(data);
    }
  ],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// request拦截器
service.interceptors.request.use(
  config => {
    const token = '';
    if (!config.data) {
      config.data = {};
    }
    config.data.token = token || '';
    // if (config.method === 'post') {   // 序列化   config.data =
    // querystring.stringify(config.data); }
    return config;
  },
  error => {
    // Do something with request error console.log(error); // for debug
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    // store.dispatch('HideListLoading');
    return response.data;
  },
  err => {
    // store.dispatch('HideListLoading');

    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求';
          break;
        case 401:
          err.message = '未授权，请重新登录';
          break;
        case 403:
          err.message = '拒绝访问';
          break;
        case 404:
          err.message = '请求错误,未找到该资源';
          break;
        case 405:
          err.message = '请求方法未允许';
          break;
        case 408:
          err.message = '请求超时';
          break;
        case 500:
          err.message = '服务器端出错';
          break;
        case 501:
          err.message = '网络未实现';
          break;
        case 502:
          err.message = '网络错误';
          break;
        case 503:
          err.message = '服务不可用';
          break;
        case 504:
          err.message = '网络超时';
          break;
        case 505:
          err.message = 'http版本不支持该请求';
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
    } else {
      err.message = '连接到服务器失败';
    }
    return Promise.resolve(err.response);
    // return Promise.reject(err);
  }
);

// get 方法请求
export const get = (url, data) => {
  return axios
    .get(url, { params: data })
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

//post请求
export function post(url, data, options) {
  return axios
    .post(url, data, options)
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

export default service;
