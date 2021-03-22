/* eslint-disable */
import axios from "axios"
import qs from "qs"
import Cookies from "js-cookie";

// 普通接口
const request = axios.create({
  baseURL: '',
  timeout: 50000, // 请求超时时间,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  params: {}
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    if (response.data.code === 405) {
      localStorage.removeItem('user');
      Cookies.remove('token');
      window.location.href = 'https://sso.100tal.com/portal/login/1014326443'
      return
    }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { request }
