import fetch from 'utils/fetch'

export async function Logout() {
  const req = {
    method: 'delete' as const
  }
  return await fetch('user/login', req)
}

export async function PutLogin(data: any) {
  const req = {
    method: 'put' as const,
    data
  }
  return await fetch('user/login', req)
}

export async function SendFogetCode() {
  const req = {
    method: 'post' as const,
  }
  return await fetch('user/login/forget', req)
}

export async function ResetPass(data: any) {
  const req = {
    method: 'post' as const,
    data
  }
  return await fetch('user/login/reset', req)
}

export async function GetLikeBlog() {
  return await fetch('user/blog/like')
}

export async function GetCollectBlog() {
  return await fetch('user/blog/collect')
}

export async function GetComment() {
  return await fetch('user/blog/comment')
}

export async function GetMessage() {
  return await fetch('user/message')
}

export async function DelMessageUnread(id: number) {
  return await fetch(`user/message/unread/${id}`, { method: 'DELETE' })
}

export async function GetMessageSet() {
  return await fetch(`user/message/set`)
}

export async function PostMessageSet(data: any) {
  return await fetch(`user/message/set`, {
    method: 'post',
    data
  })
}

export async function PostAvatar(data: any) {
  return await fetch(`user/avatar`, {
    method: 'post',
    data
  })
}

export async function GetBindInfo() {
  return await fetch(`user/bindinfo`)
}

export async function PostUnbindEmail(code: string) {
  return await fetch(`user/unbind/email/${code}`, {
    method: 'post'
  })
}

export async function PostbindEmail(data: any) {
  return await fetch(`user/bind/email`, {
    method: 'post',
    data
  })
}

export async function GetUserInfo() {
  return await fetch(`user/info`)
}

export async function PutUserInfo(data: any) {
  return await fetch(`user/info`, {
    method: 'put',
    data
  })
}