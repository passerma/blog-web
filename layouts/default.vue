<script setup lang="ts">
import { UseSearchStore, UseUserInfoStore, UseMessageStore } from 'stores';
import { GetBlogClass, GetIslogin, GetMessageNum } from './fetch';

const userInfoStore = UseUserInfoStore()
const searchStore = UseSearchStore()
const messageStore = UseMessageStore()
const phoneTipVisible = ref(false)

onBeforeMount(async () => {
  isLogin()
  notPcShow()
  getBlogClass()
})

const getMessageNum = async () => {
  const res = await GetMessageNum()
  if (res && res.code === 0) {
    messageStore.setMessageNum(res.data)
  }
}

const isLogin = async () => {
  const res = await GetIslogin()
  if (res && res.code === 0) {
    SetAuthorization(res.data.token)
    userInfoStore.setUserInfo(res.data)
    getMessageNum()
  }
}

const phoneTipClose = (no?: boolean) => {
  no && localStorage.setItem("notPcShowData", "true")
  phoneTipVisible.value = false
}

const notPcShow = () => {
  let ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  const notPcShowData = localStorage.getItem('notPcShowData')
  if (!isPc && !notPcShowData) {
    phoneTipVisible.value = true
  }
}

const getBlogClass = async () => {
  const res = await GetBlogClass()
  if (res && res.code === 0) {
    const classList = res.data.map((res: any) => ({
      value: res,
      checked: false
    }))
    searchStore.searchClassInit(classList)
  }
}
</script>

<template>
  <div class="main">
    <Header />
    <div class="page">
      <slot />
    </div>
    <t-back-top container="#__nuxt" :visible-height="200" size="small" />
    <t-dialog theme="info" header="由于本站未适配移动端，推荐PC端访问，或者前往passerma微信小程序" cancelBtn="关闭" confirmBtn="不再提示"
      :visible="phoneTipVisible" :onClose="() => phoneTipClose()" :onConfirm="() => phoneTipClose(true)">
      <img class="main-noPcShow" src="https://www.passerma.com/down/passerma_wechat_all.png" />
    </t-dialog>
  </div>
</template>

// 全局样式
<style lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.i-icon {
  line-height: 1;

  svg {
    vertical-align: middle;
  }
}

html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
}

#__nuxt {
  overflow-y: scroll;
  overflow-x: auto;
  color: var(--td-text-color-secondary);
  background-color: var(--td-bg-color-page);
  position: relative;

  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    background: transparent;
  }

  &::-webkit-scrollbar-corner {
    width: 0px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
  }
}

a {
  text-decoration: none;
}
</style>

<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  min-width: 1000px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;

  .main-noPcShow {
    width: 100%;
  }

  .page {
    padding: 50px 0;
    flex: 1;
    overflow-x: hidden;
    min-height: 100%;
    z-index: 1;
  }
}
</style>
