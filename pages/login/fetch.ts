import Fetch from 'utils/fetch'

export async function LoginFrist() {
  const req = {
    method: 'post' as const
  }
  return await Fetch('user/login', req)
}

export async function LoginSecond(req: { userName: string, passWord: string, clientId: string }) {
  const data = {
    method: 'post' as const,
    data: req
  }
  return await Fetch('user/login', data)
}

export async function SendRegisterCode(email: string) {
  const data = {
    method: 'post' as const,
    data: {
      email
    }
  }
  return await Fetch('user/registercode', data)
}

export async function PostRegister(req: { userName: string, email: string, passWord: string, authCode: string }) {
  const data = {
    method: 'post' as const,
    data: req
  }
  return await Fetch('user/register', data)
}

export async function SendFogetCode(email: string) {
  const req = {
    method: 'post' as const,
    data: {
      email
    }
  }
  return await Fetch('user/login/forget/email', req)
}

export async function ResetPass(data: any) {
  const req = {
    method: 'post' as const,
    data
  }
  return await Fetch('user/login/reset/email', req)
}

export async function GetQRLogin() {
  return await Fetch('user/loginqrcode')
}

export async function GetQRCodeType(scene: string) {
  return await Fetch(`user/qrcodetype?scene=${scene}`)
}

export async function GetMessageNum() {
  return await Fetch('user/message/unread')
}
