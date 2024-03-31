<script setup lang="ts">
import { MessagePlugin } from "tdesign-vue-next";
import fetch from "utils/fetch"

const props = defineProps({
  req: {
    type: Object,
    default: null
  },
  className: {
    type: String,
    default: ""
  }
})

const time = ref(0)
const timer = ref(null)
const loading = ref(false)

const send = async () => {
  if (timer.value || loading.value) return
  loading.value = true
  let res = await fetch(props.req.url, props.req)
  if (res && res.code === 0) {
    MessagePlugin.success('验证码发送成功')
    time.value = 60;
    (timer.value as any) = setInterval(() => {
      let timeV = time.value
      timeV--
      if (timeV <= 0) {
        clearInterval(timer.value as any)
        time.value = 0
        timer.value = null
      } else {
        time.value = timeV
      }
    }, 1000)
  } else {
    MessagePlugin.error(`验证码发送失败 ${res?.msg || ''}`)
  }
  loading.value = false
}

onBeforeUnmount(() => {
  if (timer.value !== null) {
    clearInterval(timer.value)
  }
  timer.value = null
})
</script>

<template>
  <t-button :class="className" theme="default" :disabled="loading || timer !== null" @click="send">
    {{ time === 0 ? '发送验证码' : `发送验证码 (${time})` }}
  </t-button>
</template>