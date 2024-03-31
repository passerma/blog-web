<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { GetQRCodeType, GetQRLogin, GetMessageNum } from './fetch';
import { SetAuthorization } from 'utils/fetch'
import { UseMessageStore, UseUserInfoStore } from 'stores';

const visible = ref(false)
const url = ref('')
const type = ref(0)
const tips = ref('')

const userInfo = UseUserInfoStore()
const message = UseMessageStore()
const router = useRouter()
const route = useRoute()

let timer: NodeJS.Timeout | undefined
let scene = ''
let hasCode = false
let isLoading = false

const close = () => {
  visible.value = false
}

const getMessageNumData = async () => {
  const res = await GetMessageNum()
  if (res && res.code === 0) {
    message.setMessageNum(res.data)
  }
}

const getQRCodeType = () => {
  timer = setInterval(async () => {
    const res = await GetQRCodeType(scene)
    if (res && res.code === 0 && timer) {
      type.value = res.data.type
      switch (res.data.type) {
        case -1:
          tips.value = '小程序码失效，点击刷新'
          clearInterval(timer)
          timer = undefined
          hasCode = false
          break;
        case 1:
          tips.value = '扫码成功，请确认'
          break;
        case 2:
          // 登录成功
          if (res.data.token) {
            SetAuthorization(res.data.token)
            userInfo.setUserInfo({
              userName: res.data.userName,
              avatar: res.data.avatar || 'https://www.passerma.com/down/morenAvatar.png',
              userId: res.data.userId
            })
            hasCode = false
            getMessageNumData()
            MessagePlugin.success(`${res.data.userName}, 欢迎回来`)
            const to = route.query.to as string
            if (to) {
              navigateTo({
                path: to,
                replace: true
              })
            } else {
              router.replace('/center')
            }
          } else {
            MessagePlugin.error('登录失败')
          }
          clearInterval(timer)
          timer = undefined
          break;
        case 3:
          tips.value = '请完成账号绑定'
          break;
        default:
          break;
      }
    }
  }, 1000)
}

const login = async () => {
  visible.value = true
  if (hasCode) return
  if (isLoading) return
  isLoading = true
  url.value = ''
  type.value = 0
  const res = await GetQRLogin()
  isLoading = false
  if (res && res.code === 0) {
    hasCode = true
    url.value = res.data.url
    scene = res.data.scene
    getQRCodeType()
    return
  }
  MessagePlugin.error(res?.msg || "小程序码生成失败")
}

const refreshCode = () => {
  if (type.value === -1) {
    login()
  }
}

defineExpose({
  login
})
</script>

<template>
  <t-dialog header="微信扫一扫" :closeOnOverlayClick="false" :closeBtn="false" :visible.sync="visible" :cancelBtn="null"
    :confirmBtn="{
    content: '关闭',
    variant: 'base',
  }" :onConfirm="close">
    <div class="qrlogin-main">
      <t-loading size="large" :loading="!url" showOverlay>
        <img v-if="url" :src="'data:image/png;base64,' + url" />
        <div class="main-loading" v-else></div>
        <div class="mian-tip" v-show="type !== 0" @click="refreshCode">{{ tips }}</div>
      </t-loading>
    </div>
  </t-dialog>
</template>

<style lang="less">
.qrlogin-main {
  display: flex;
  justify-content: center;
  align-items: center;

  .main-loading {
    width: 200px;
    height: 200px;
  }

  .mian-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    font-size: 16px;
    color: var(--td-text-color-anti);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0009;
    cursor: pointer;
  }

  img {
    width: 200px;
    height: 200px;
    float: left;
  }
}
</style>