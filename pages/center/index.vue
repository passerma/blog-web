<script setup lang="ts">
import { UseMessageStore, UseUserInfoStore } from '~/stores';

import Setting from './settingCmpt.vue'
import Overview from './overviewCmpt.vue'
import Message from './messageCmpt.vue'
import Info from './infoCmpt.vue'

const messageStore = UseMessageStore()
const userInfoStore = UseUserInfoStore()
const router = useRouter()

const tabValue = ref('first')

watch(() => userInfoStore.userInfo.userId, (v) => {
  if (!v) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="center">
    <t-tabs v-model="tabValue">
      <t-tab-panel value="first" label="个人概览" :destroyOnHide="false">
        <Overview />
      </t-tab-panel>
      <t-tab-panel class="center-panel-message" value="message">
        <template #label>
          <t-badge :count="messageStore.message.messageNum" class="center-panel-message">
            消息中心
          </t-badge>
        </template>
        <Message />
      </t-tab-panel>
      <t-tab-panel value="info" label="个人信息">
        <Info />
      </t-tab-panel>
      <t-tab-panel value="second" label="账号设置" :destroyOnHide="true">
        <Setting />
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<style lang="less">
.center {
  position: relative;
  border-radius: 10px;
  overflow: hidden;

  .t-tabs__nav-item {
    .t-tabs__nav-item-wrapper {
      padding: 5px 10px;
    }
  }

  .center-panel-message {
    color: unset;
  }
}
</style>