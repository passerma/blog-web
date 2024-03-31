<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import fetch from 'utils/fetch'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  susText: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: 'default',
  },
  req: {
    type: Object,
    default: null
  },
  className: {
    type: String,
    default: ""
  },
  complete: {
    type: Function,
    default: () => () => { }
  }
})

let time = 0
let timer: any = null
let canReq = true
let scene = ''

const url = ref('')
const visible = ref(false)
const tips = ref('')

const setTimer = () => {
  timer = setInterval(async () => {
    let res = await fetch(`wechat/operate/wecode/${scene}`)
    if (res && res.code === 0 && timer) {
      switch (res.data.type) {
        case 1: // 超时
          tips.value = "小程序码失效，点击刷新"
          clearInterval(timer)
          timer = null
          canReq = true
          break;
        case 2: // 确认操作
          tips.value = "扫码成功，请确认"
          break;
        case 3: // 操作成功
          clearInterval(timer)
          timer = null
          MessagePlugin.success(props.susText || "操作成功")
          props.complete()
          visible.value = false
          url.value = ''
          tips.value = ''
          canReq = true
          break;
        default:
          break;
      }
    }
  }, 1000)
}

const getWecode = async () => {
  visible.value = true
  if (!canReq) return
  canReq = false
  url.value = ''
  tips.value = ''
  let res = await fetch(props.req.url, {
    method: 'post'
  })
  if (res && res.code === 0) {
    url.value = res.data.url
    scene = res.data.scene
    setTimer()
  } else {
    MessagePlugin.error(`小程序码生成失败 ${res?.msg || ''}`)
    tips.value = `小程序码生成失败，${res?.msg || '点击刷新'}`
    canReq = true
  }
  time = 1
}

const close = () => {
  visible.value = false
}

const refresh = () => {
  if (!canReq) return
  tips.value = ''
  url.value = ''
  getWecode()
}

onBeforeUnmount(() => {
  if (timer !== null) {
    clearInterval(timer)
  }
  timer = null
})
</script>

<template>
  <div class="com-showscode">
    <t-button :theme="theme" @click="getWecode">
      {{ title }}
    </t-button>
    <t-dialog header="微信扫一扫" :closeOnOverlayClick="false" :closeBtn="false" :visible="visible" :cancelBtn="null"
      :confirmBtn="{
        content: '关闭',
        variant: 'base',
      }" :onConfirm="close">
      <div class="com-showscode-main">
        <t-loading size="large" :loading="!url && !tips" showOverlay>
          <img v-if="url" :src="'data:image/png;base64,' + url" />
          <div class="com-showscode-loading" v-else></div>
          <div class="com-showscode-tip" v-show="!!tips" @click="refresh">{{ tips }}</div>
        </t-loading>
      </div>
    </t-dialog>
  </div>
</template>

<style lang="less" scoped>
.com-showscode {
  .com-showscode-main {
    display: flex;
    justify-content: center;
    align-items: center;

    .com-showscode-loading {
      width: 200px;
      height: 200px;
    }

    .com-showscode-tip {
      position: absolute;
      text-align: center;
      padding: 20px;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 18px;
      height: 100%;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
    }

    .t-loading__parent {
      height: 200px;
    }

    img {
      width: 200px;
      height: 200px;
    }
  }
}
</style>