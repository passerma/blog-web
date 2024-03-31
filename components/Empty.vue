<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  width: {
    type: String,
    default: '200px'
  },
  height: {
    type: String,
    default: '200px'
  },
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div :class="`empty ${props.class}`" :style="{ width, height }">
    {{ text }}
  </div>
</template>

<style lang="less" scoped>
.empty {
  border-radius: 4px;
  color: var(--td-text-color-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>