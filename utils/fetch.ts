import axios, { type AxiosRequestConfig } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import Log from './log'

// 返回结果类型
export interface resType<T> {
  code: number,
  msg: string,
  data: T,
}

const server = process.server // 是否服务端发起请求
const serverUrl = process.env.server_url || 'http://127.0.0.1:4000'
let authorization = '' // 请求token
let keepTokenTimer: any = 0 // token刷新定时器

/**
 * 设置token
 * @param v token
 */
export function SetAuthorization(v: string) {
  authorization = v
  if (!keepTokenTimer && v !== '') {
    keepTokenTimer = setInterval(() => {
      Fetch<{ token: string }>('user/keeplogin', { method: 'POST' }).then((res) => {
        if (res && res.code === 0 && res.data) {
          authorization = res.data.token
        } else {
          MessagePlugin.error('保持登录失败，请刷新界面重新登录')
        }
      })
    }, 60 * 4 * 1000)
  }
  if (v === '') {
    clearInterval(keepTokenTimer)
  }
}

/**
 * 发起请求
 * @param path 请求路径
 * @param fetchObj 请求参数
 * @returns 请求结果 ｜ null
 */
export default function Fetch<T = any>(
  path: string,
  fetchObj: AxiosRequestConfig = {}) {
  const {
    method = 'GET' as const,
    params = {},
    data = {},
    timeout = 60000,
    headers = {}
  } = fetchObj
  if (authorization) {
    headers.Authorization = authorization
  }
  path = path.startsWith('/') ? path : `/${path}`
  return new Promise<null | resType<T>>((resolve) => {
    const obj = {
      url: server ? `${serverUrl}${path}` : `/api${path}`,
      method,
      params,
      data,
      timeout,
      headers
    }
    axios(obj).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      Log.error(`请求失败：${path}`, err)
      resolve(null)
    })
  })
}

/**
 * 获取token
 * @returns token
 */
export function GetAuthorization() {
  return authorization
}
