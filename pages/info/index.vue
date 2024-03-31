<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { GetUserInfoPage } from './fetch'
import { LogoQqIcon, LinkIcon } from 'tdesign-icons-vue-next'

const state = ref(0)
const info = ref({
  introduction: '',
  avatar: '',
  username: '',
  qq: '',
  blog: ''
})

const route = useRoute()

onMounted(async () => {
  const { u } = route.query
  if (!u) {
    state.value = 2
    return
  }
  const res = await GetUserInfoPage(u as string)
  if (res && res.code === 0 && res.data) {
    if (res.data.blog &&
      !(res.data.blog as string).startsWith('http://') &&
      !(res.data.blog as string).startsWith('https://')
    ) {
      res.data.blog = `https://${res.data.blog}`
    }
    info.value = res.data
    state.value = 1
  } else {
    state.value = 2
  }
})

const click = () => {
  if (info.value.qq) {
    navigator.clipboard.writeText(info.value.qq).then(() => {
      MessagePlugin.success('复制成功')
    }).catch(err => {
      console.error(err)
      MessagePlugin.error('复制失败')
    })
  }
}
</script>

<template>
  <div class="info-id-page">
    <!-- <el-empty v-if="state === 2" :image-size="200" description="用户不存在" /> -->
    <t-skeleton v-if="state === 0" theme="tab" animation="gradient"></t-skeleton>
    <div class="page-box" v-else-if="state === 1">
      <t-divider>{{ info.username }} 主页</t-divider>
      <img class="box-avatar" :src="info.avatar || 'https://www.passerma.com/down/morenAvatar.png'" />
      <div class="box-username">{{ info.username }}</div>
      <div class="box-introduction">{{ info.introduction || `${info.username} 暂无简介` }}</div>
      <div>
        <div class="box-qq" @click="click">
          <LogoQqIcon class="box-chatIcon" />
          {{ info.qq || '暂无' }}
        </div>
        <div class="box-blog">
          <LinkIcon class="box-chatIcon" theme="outline" size="16" fill="#005980" />
          <a v-if="info.blog" target="_blank" :href="info.blog">{{ info.blog }}</a>
          <span v-else>暂无</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.info-id-page {
  background-color: var(--td-bg-color-container);
  padding: 20px;
  border-radius: 10px;

  .page-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .box-avatar {
      width: 160px;
      height: 160px;
      border: 4px solid var(--td-bg-color-component);
      border-radius: 50%;
    }

    .box-username {
      margin: 8px 0;
      font-size: 24px;
      font-weight: bold;
      color: var(--td-text-color-primary);
    }

    .box-introduction {
      max-width: 200px;
      margin: 8px 0;
      color: var(--td-text-color-secondary);
      word-break: break-all;
      margin-bottom: 18px;
    }

    .box-qq,
    .box-blog {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 3px 0;
      line-height: 1.5;
      color: var(--td-brand-color);
      font-size: 14px;
      cursor: pointer;

      a {
        color: var(--td-brand-color);
        border-bottom: 1px solid var(--td-brand-color);
      }

      .box-chatIcon {
        margin-right: 8px;
        color: var(--td-brand-color);
        font-size: 16px;
      }
    }
  }
}
</style>