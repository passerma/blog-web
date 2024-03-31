import fetch from "utils/fetch"

export async function GetUserInfoPage(id: string) {
  return await fetch(`user/info/page/${id}`, {})
} 