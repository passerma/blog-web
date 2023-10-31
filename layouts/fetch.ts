import Fetch from "utils/fetch";

//#region 类型定义
type isLoginRes = {
  token: string
  userName: string
  avatar: string
  userId: number
}
//#endregion

/**
 * 判断是否已经登录
 */
export function GetIslogin() {
  return Fetch<isLoginRes>('/user/islogin')
}

export function GetBlogClass() {
  return Fetch<string[]>('/blog/class/list')
}

export async function GetMessageNum() {
  return await Fetch('user/message/unread')
}