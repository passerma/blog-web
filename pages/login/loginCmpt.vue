<script setup lang="ts">
import { LogoWechatIcon, UserIcon, MailIcon, PreciseMonitorIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  LoginFrist, LoginSecond, GetMessageNum, SendRegisterCode, PostRegister, SendFogetCode,
  ResetPass
} from './fetch';
import { SetAuthorization } from 'utils/fetch'
import { UseUserInfoStore, UseMessageStore } from 'stores';
import QrLoginCmpt from './qrLoginCmpt.vue'

const zcData = reactive({
  name: '',
  email: '',
  pass: '',
  passRe: '',
  code: '',
  loading: false,
  codeLoading: false,
  codeText: '获取验证码'
})
const dlData = reactive({
  name: '',
  pass: '',
  loading: false
})
const forgetData = reactive({
  email: '',
  pass: '',
  passRe: '',
  code: '',
  codeTime: 0,
  loading: false
})

const isShowFogetPass = ref(false)
const switchCnt = ref<HTMLElement>()
const aContainer = ref<HTMLElement>()
const bContainer = ref<HTMLElement>()
const switchC1 = ref<HTMLElement>()
const switchC2 = ref<HTMLElement>()
const switchCircle1 = ref<HTMLElement>()
const switchCircle2 = ref<HTMLElement>()
const qrLoginCmptRef = ref<typeof QrLoginCmpt>()

const userInfo = UseUserInfoStore()
const message = UseMessageStore()
const router = useRouter()

let nextTime = 60
let timer: NodeJS.Timeout
let fogetTimer: NodeJS.Timeout

const changeFunc = () => {
  switchCnt.value!.classList.toggle('is-txr')
  aContainer.value!.classList.toggle('is-txl')
  bContainer.value!.classList.toggle('is-txl')
  bContainer.value!.classList.toggle('is-z200')
  switchC1.value!.classList.toggle('is-hidden')
  switchC2.value!.classList.toggle('is-hidden')
  switchCircle1.value!.classList.toggle('circle-right')
  switchCircle2.value!.classList.toggle('circle-left')
}

//#region 注册相关
/**
 * 验证码倒计时
 */
const setCodeLoding = () => {
  nextTime = 60
  zcData.codeText = `${nextTime} 秒`
  timer = setInterval(() => {
    nextTime--
    zcData.codeText = `${nextTime} 秒`
    if (nextTime <= 0) {
      clearInterval(timer)
      zcData.codeText = '获取验证码'
    }
  }, 1000)
}

const sendCode = async () => {
  if (zcData.codeText !== '获取验证码' || zcData.codeLoading) { return }
  if (zcData.email === '') {
    MessagePlugin.info('请输入邮箱')
    return
  }
  zcData.codeLoading = true
  const data = await SendRegisterCode(zcData.email)
  zcData.codeLoading = false
  if (!data || data.code !== 0) {
    MessagePlugin.error(data?.msg || '验证码发送失败')
    return
  }
  MessagePlugin.success('验证码发送成功')
  setCodeLoding()
}

const register = async () => {
  const { name, code, email, pass, passRe } = zcData
  if (name === '') {
    MessagePlugin.info('请输入用户名')
    return
  }
  if (email === '') {
    MessagePlugin.info('请输入邮箱')
    return
  }
  if (pass === '') {
    MessagePlugin.info('请输入密码')
    return
  }
  if (passRe === '') {
    MessagePlugin.info('请确认输入密码')
    return
  }
  if (code === '') {
    MessagePlugin.info('请确认输入验证码')
    return
  }
  if (pass !== passRe) {
    MessagePlugin.info('两次密码输入不一致')
    return
  }
  if (zcData.loading) { return }
  zcData.loading = true
  const res = await PostRegister({
    userName: name,
    email,
    passWord: pass,
    authCode: code
  })
  zcData.loading = false
  if (!res || res.code !== 0) {
    MessagePlugin.error(res?.msg || '注册失败')
    return
  }
  if (res.data) {
    SetAuthorization(res.data.token)
    userInfo.setUserInfo({
      userName: res.data.userName,
      avatar: res.data.avatar || 'https://www.passerma.com/down/morenAvatar.png',
      userId: res.data.userId
    })
    MessagePlugin.closeAll()
    MessagePlugin.success(`${res.data.userName}, 欢迎回来`)
    router.replace('/center')
  } else {
    MessagePlugin.success('注册成功')
    changeFunc()
  }
}
//#endregion

//#region 忘记密码相关
const toFogetPass = (show: boolean) => {
  isShowFogetPass.value = show
}

const sendForgetCode = async () => {
  if (forgetData.email === "") {
    MessagePlugin.info('请输入邮箱')
    return
  }
  if (forgetData.loading) return
  forgetData.loading = true
  const res = await SendFogetCode(forgetData.email)
  if (res && res.code === 0) {
    MessagePlugin.success('验证码发送成功')
    forgetData.codeTime = 60
    fogetTimer = setInterval(() => {
      forgetData.codeTime--
      if (forgetData.codeTime <= 0) {
        clearInterval(fogetTimer)
        forgetData.codeTime = 0
      }
    }, 1000)
  } else {
    MessagePlugin.error(res?.msg || '验证码发送失败')
  }
  forgetData.loading = false
}

const fogetPassOk = async () => {
  if (forgetData.loading) return
  const { email, pass, passRe, code } = forgetData
  if (email === '') {
    MessagePlugin.info('请输入邮箱')
    return
  }
  if (pass === '') {
    MessagePlugin.info('请输入密码')
    return
  }
  if (code === '') {
    MessagePlugin.info('请确认输入验证码')
    return
  }
  if (pass !== passRe) {
    MessagePlugin.info('两次密码输入不一致')
    return
  }
  forgetData.loading = true
  const res = await ResetPass({
    pass,
    email,
    code
  })
  if (res && res.code === 0) {
    MessagePlugin.closeAll()
    MessagePlugin.success('修改密码成功')
    forgetData.code = ''
    forgetData.email = ''
    forgetData.pass = ''
    forgetData.passRe = ''
    clearInterval(fogetTimer)
    forgetData.codeTime = 0
    toFogetPass(false)
  } else {
    MessagePlugin.error(res?.msg || '修改密码失败')
  }
  forgetData.loading = false
}
//#endregion

//#region 登录相关
/**
 * 获取消息数量
 */
const getMessageNumData = async () => {
  const res = await GetMessageNum()
  if (res && res.code === 0) {
    message.setMessageNum(res.data)
  }
}

/**
 * 登录
 */
const login = async () => {
  const { name, pass, loading } = dlData
  if (name === '') {
    MessagePlugin.info('请输入用户名或邮箱')
    return
  }
  if (pass === '') {
    MessagePlugin.info('请输入密码')
    return
  }
  if (loading) return
  dlData.loading = true
  const req1 = await LoginFrist()
  if (!req1 || req1.code !== 0 || !req1.data) {
    MessagePlugin.error(req1?.msg || '服务器请求失败')
    dlData.loading = false
    return
  }
  const passWord = aesEncrypto(req1.data.aesKey, pass)
  const req2 = await LoginSecond({
    clientId: req1.data.clientId,
    passWord,
    userName: name
  })
  dlData.loading = false
  if (!req2 || req2.code !== 0 || !req2.data) {
    MessagePlugin.error(req2?.msg || '登录失败')
    return
  }
  SetAuthorization(req2.data.token)
  getMessageNumData()
  userInfo.setUserInfo({
    userName: req2.data.userName,
    avatar: req2.data.avatar || 'https://www.passerma.com/down/morenAvatar.png',
    userId: req2.data.userId
  })
  MessagePlugin.closeAll()
  MessagePlugin.success(`${req2.data.userName}, 欢迎回来`)
  router.replace('/center')
}

const enterLogin = (e: KeyboardEvent) => {
  if (e.key === 'Enter' &&
    bContainer.value!.classList.contains('is-z200') &&
    isShowFogetPass.value === false
  ) {
    login()
  }
}

const QRlogin = () => {
  qrLoginCmptRef.value!.login()
}
//#endregion

onMounted(() => {
  document.addEventListener('keyup', enterLogin)
})

onBeforeUnmount(() => {
  document.removeEventListener('keyup', enterLogin)
})
</script>

<template>
  <div class="login-main">
    <div ref="aContainer" class="container a-container is-txl">
      <div class="form">
        <div class="form_title">注册账户</div>
        <span class="form__span">使用邮箱📮注册</span>
        <t-input v-model="zcData.name" class="form__input" placeholder="请输入用户名">
          <template #prefix-icon>
            <UserIcon />
          </template>
        </t-input>
        <t-input v-model="zcData.email" class="form__input" placeholder="请输入邮箱">
          <template #prefix-icon>
            <MailIcon />
          </template>
        </t-input>
        <t-input v-model="zcData.pass" type="password" class="form__input" placeholder="请输入密码">
          <template #prefix-icon>
            <LockOnIcon />
          </template>
        </t-input>
        <t-input v-model="zcData.passRe" type="password" class="form__input" placeholder="请确认输入密码">
          <template #prefix-icon>
            <LockOnIcon />
          </template>
        </t-input>
        <div class="authCode">
          <t-input v-model="zcData.code" class="form__input" placeholder="请确认输入验证码">
            <template #prefix-icon>
              <PreciseMonitorIcon />
            </template>
          </t-input>
          <t-button :loading="zcData.codeLoading" :disabled="zcData.codeText !== '获取验证码'" @click="sendCode">
            {{ zcData.codeText }}
          </t-button>
        </div>
        <t-button class="reqBtn" :loading="zcData.loading" @click="register">
          注册
        </t-button>
      </div>
    </div>
    <div ref="bContainer" class="container b-container is-txl is-z200">
      <div class="form">
        <div class="form_title">{{ isShowFogetPass ? '找回密码' : '登录到 passerma' }}</div>
        <div class="form__icons" v-show="!isShowFogetPass">
          <LogoWechatIcon @click="QRlogin" class="form__icon" />
        </div>
        <span class="form__span" v-show="!isShowFogetPass">或者使用邮箱用户</span>
        <template v-if="!isShowFogetPass">
          <t-input v-model="dlData.name" class="form__input" placeholder="请输入用户名或邮箱">
            <template #prefix-icon>
              <UserIcon />
            </template>
          </t-input>
          <t-input v-model="dlData.pass" type="password" class="form__input" placeholder="请输入密码">
            <template #prefix-icon>
              <LockOnIcon />
            </template>
          </t-input>
          <a class="form__link" @click="toFogetPass(true)">忘记密码</a>
          <t-button class="reqBtn" :loading="dlData.loading" @click="login">
            登录
          </t-button>
        </template>
        <template v-else>
          <t-input v-model="forgetData.email" class="form__input" placeholder="请输入邮箱">
            <template #prefix-icon>
              <UserIcon />
            </template>
          </t-input>
          <t-input v-model="forgetData.pass" type="password" class="form__input" placeholder="请输入密码">
            <template #prefix-icon>
              <LockOnIcon />
            </template>
          </t-input>
          <t-input v-model="forgetData.passRe" type="password" class="form__input" placeholder="请输入确认密码">
            <template #prefix-icon>
              <LockOnIcon />
            </template>
          </t-input>
          <div class="authCode">
            <t-input v-model="forgetData.code" class="form__input" placeholder="请确认输入验证码">
              <template #prefix-icon>
                <PreciseMonitorIcon />
              </template>
            </t-input>
            <t-button :disabled="forgetData.codeTime !== 0" @click="sendForgetCode">
              {{ forgetData.codeTime !== 0 ? `${forgetData.codeTime}` : "发送验证码" }}
            </t-button>
          </div>
          <a class="form__link" @click="toFogetPass(false)">返回登录</a>
          <t-button class="reqBtn" :loading="forgetData.loading" @click="fogetPassOk">
            确认
          </t-button>
        </template>
      </div>
    </div>
    <div ref="switchCnt" class="switch is-txr">
      <div ref="switchCircle1" class="switch__circle circle-right" />
      <div ref="switchCircle2" class="switch__circle switch__circle--t circle-left" />
      <div ref="switchC1" class="switch__container is-hidden">
        <div class="form_title">欢迎回来 🏠</div>
        <p class="switch__description">登录获取最佳体验</p>
        <button class="switch__button button switch-btn" @click="changeFunc">
          前往登录
        </button>
      </div>
      <div ref="switchC2" class="switch__container">
        <div class="form_title">你好，朋友 👬</div>
        <p class="switch__description">注册账户获取最佳体验</p>
        <button class="switch__button button switch-btn" @click="changeFunc">
          前往注册
        </button>
      </div>
    </div>
    <QrLoginCmpt ref="qrLoginCmptRef" />
  </div>
</template>

<style lang="less" scoped>
.login-main {
  position: relative;
  max-width: 800px;
  min-width: 800px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 500px;
    height: 100%;
    padding: 0 25px;
    background-color: #ecf0f3;
    transition: left 1.25s, z-index 1.25s;
  }

  .form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .form__icon {
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 30px;
  }

  .form__input {
    width: 350px;
    margin: 12px 0;
  }

  .authCode {
    width: 350px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .form__input {
      width: 220px;
    }

    button {
      margin-left: 20px;
    }
  }

  .form__span {
    margin-bottom: 10px;
    color: var(--td-text-color-secondary);
  }

  .form__icons {
    color: var(--td-text-color-secondary);
  }

  .form__link {
    color: var(--td-text-color-secondary);
    font-size: 15px;
    margin-top: 25px;
    border-bottom: 1px solid var(--td-text-color-secondary);
    line-height: 2;
    cursor: pointer;

    &:hover {
      color: var(--td-text-color-primary);
      border-bottom: 1px solid var(--td-text-color-primary);
    }
  }

  .form_title {
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 20px;
    color: var(--td-text-color-primary);
  }

  .switch__description {
    font-size: 14px;
    letter-spacing: 0.25px;
    text-align: center;
    line-height: 1.6;
    color: var(--td-text-color-secondary);
  }

  .reqBtn {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 50px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.15px;
    // color: #f9f9f9;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    border: none;
    outline: none;
    cursor: pointer;
    transition: box-shadow 0s, background-color .2s;
  }

  .button {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 50px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.15px;
    background-color: var(--td-brand-color);
    color: var(--td-text-color-anti);
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    border: none;
    outline: none;
    user-select: none;
  }

  /**/
  .a-container {
    z-index: 100;
    left: calc(100% - 450px);
  }

  .b-container {
    left: calc(100% - 500px);
    z-index: 0;
  }

  .switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 400px;
    padding: 0 50px;
    z-index: 200;
    transition: left 1.25s, z-index 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
  }

  .switch__circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: #ecf0f3;
    box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
    bottom: -55%;
    left: -60%;
    transition: left 1.25s, z-index 1.25s;
  }

  .switch__circle--t {
    top: -30%;
    left: 60%;
    width: 300px;
    height: 300px;
  }

  .switch__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    width: 400px;
    padding: 50px 55px;
    transition: all 1.25s;
  }

  .switch__button {
    cursor: pointer;
  }

  .switch__button:hover {
    box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
    transform: scale(0.985);
    transition: 0.25s;
  }

  .switch__button:active,
  .switch__button:focus {
    box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
    transform: scale(0.97);
    transition: 0.25s;
  }

  /**/
  .is-txr {
    left: calc(100% - 400px);
    transition: left 1.25s, z-index 1.25s;
    transform-origin: left;
  }

  .is-txl {
    left: -50px;
    transition: left 1.25s, z-index 1.25s;
    transform-origin: right;
  }

  .circle-left {
    left: -40%;
  }

  .circle-right {
    left: 40%;
  }

  .is-z200 {
    z-index: 200;
    transition: left 1.25s, z-index 1.25s;
  }

  .is-hidden {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    transition: all 1.25s;
  }
}

[theme-mode="dark"] {
  .login-main {
    background-color: #1F2930;
    box-shadow: 10px 10px 10px #28354A, -10px -10px 10px #1F1F1F;

    .container {
      background-color: #1F2930;
    }

    .reqBtn {
      box-shadow: 8px 8px 16px #28354A, -8px -8px 16px #1F1F1F;
    }

    .button {
      box-shadow: 8px 8px 16px #28354A, -8px -8px 16px #1F1F1F;
    }

    /**/
    .switch {
      background-color: #1F2930;
      box-shadow: 4px 4px 10px #28354A, -4px -4px 10px #1F1F1F;
    }

    .switch__circle {
      background-color: #1F2930;
      box-shadow: inset 8px 8px 12px #28354A, inset -8px -8px 12px #1F1F1F;
    }

    .switch__button:hover {
      box-shadow: 6px 6px 10px #28354A, -6px -6px 10px #1F1F1F;
    }

    .switch__button:active,
    .switch__button:focus {
      box-shadow: 2px 2px 6px #28354A, -2px -2px 6px #1F1F1F;
    }
  }
}
</style>
