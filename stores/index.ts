import { reactive } from 'vue'
import { defineStore } from 'pinia'

type searchStore = {
  searchVis: boolean
  searchValue: string
  searchOrder: string
  searchClass: { value: string, checked: boolean }[]
}

type theme = {
  theme: 'light' | 'dark' | undefined
}

export const UseUserInfoStore = defineStore('userInfo', () => {
  // 用户信息
  const userInfo = reactive({
    userName: '',
    avatar: '',
    userId: 0
  })

  /**
   * 设置用户信息
   * @param p 信息
   */
  const setUserInfo = (p: { userName: string, avatar: string, userId: number }) => {
    userInfo.userName = p.userName
    userInfo.avatar = p.avatar
    userInfo.userId = p.userId
  }

  /**
   * 设置用户头像
   * @param p 信息
   */
  const setUserInfoAvatar = (avatar: string) => {
    userInfo.avatar = avatar
  }

  return { userInfo, setUserInfo, setUserInfoAvatar }
})

export const UseSearchStore = defineStore('search', () => {
  // 查询信息
  const search = reactive<searchStore>({
    searchVis: false,
    searchValue: '',
    searchOrder: 'created_at desc',
    searchClass: []
  })

  const searchVisSet = () => {
    search.searchVis = !search.searchVis
  }
  const searchValueSet = (v?: string) => {
    search.searchValue = v || ''
  }
  const searchOrderSet = (s: string) => {
    search.searchOrder = s
  }
  const searchClassSet = (value: string, checked: boolean) => {
    const classList: { value: string, checked: boolean }[] = JSON.parse(JSON.stringify(search.searchClass))
    const item = classList.find((item) => item.value === value)
    if (item) {
      item.checked = checked
    }
    search.searchClass = classList
  }

  const searchClassInit = (classList: { value: string, checked: boolean }[]) => {
    search.searchClass = classList
  }

  return { search, searchVisSet, searchValueSet, searchOrderSet, searchClassSet, searchClassInit }
})

export const UseMessageStore = defineStore('message', () => {
  const message = reactive({
    messageNum: 0
  })

  const setMessageNum = (num: number) => {
    message.messageNum = num
  }

  const cutMessageNum = () => {
    const v = message.messageNum - 1
    message.messageNum = v > 0 ? v : 0
  }

  return { message, setMessageNum, cutMessageNum }
})

export const UseThemeStore = defineStore('theme', () => {
  const theme = reactive<theme>({
    theme: undefined
  })

  const themeSet = (v: string) => {
    if (v === 'dark' || v === 'light') {
      theme.theme = v
    }
  }

  return { theme, themeSet }
})