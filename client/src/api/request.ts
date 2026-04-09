import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
})

// 响应拦截：统一取 data 层
request.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

export default request
