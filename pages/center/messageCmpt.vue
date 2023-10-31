<script setup lang="tsx">
import dayjs from 'dayjs';
import { DelMessageUnread, GetMessage, GetMessageSet, PostMessageSet } from './fetch'
import { RollbackIcon } from 'tdesign-icons-vue-next'
import { UseMessageStore } from '~/stores';

type messageData = {
  id: number
  title: string
  text: string
  created_at: string
  content: string
  is_read: number
}

type messageSetData = {
  type: string,
  message: number
  email: number
}

const messageStore = UseMessageStore()

const select = ref('1')
const messageData = reactive<messageData[]>([])
const messageSetData = reactive<messageSetData[]>([
  {
    type: '评论收到回复',
    message: 0,
    email: 0
  }
])
const showMessage = ref(false)
const messageDataShow = ref<messageData | null>(null)
let isDelUnread = false
const messageColumns = [
  { colKey: 'type', title: '消息类型' },
  {
    colKey: 'message', title: '站内信', width: '200',
    cell: (h: any, { row }: { row: messageSetData }) => {
      return (
        <t-switch size="large" customValue={[1, 0]} label={['开', '关']} value={row.message}
          onChange={(v: number) => onMessageSetChange(v, 'message')}
        />
      );
    }
  },
  {
    colKey: 'email', title: '邮件', width: '200',
    cell: (h: any, { row }: { row: messageSetData }) => {
      return (
        <t-switch size="large" customValue={[1, 0]} label={['开', '关']} value={row.email}
          onChange={(v: number) => onMessageSetChange(v, 'email')}
        />
      );
    }
  },
]

const showMessageFunc = (show: boolean, item?: messageData) => {
  showMessage.value = show
  if (item) {
    messageDataShow.value = { ...item }
    if (item.is_read === 0) {
      clearMessage(null, item)
    }
  }
}

const clearMessage = async (e: any, item: messageData) => {
  e && e.stopPropagation()
  e && e.preventDefault()
  if (isDelUnread) return
  isDelUnread = true
  const res = await DelMessageUnread(item.id)
  if (res && res.code === 0) {
    item.is_read = 1
    messageStore.cutMessageNum()
  }
  isDelUnread = false
}

const onMessageSetChange = async (value: number, type: 'message' | 'email') => {
  const data: Record<string, number> = {}
  data[type] = value
  const res = await PostMessageSet(data)
  if (res && res.code === 0) {
    messageSetData[0][type] = value
  }
}

const getMessageSet = async () => {
  const res = await GetMessageSet()
  if (res && res.code === 0 && res.data) {
    messageSetData[0].message = res.data.replay_message
    messageSetData[0].email = res.data.replay_email
  }
}

const getMessage = async () => {
  const res = await GetMessage()
  if (res && res.code === 0) {
    messageData.push(...res.data)
  }
}

onMounted(() => {
  getMessageSet()
  getMessage()
})
</script>

<template>
  <div class="center-message">
    <div class="center-message-menu">
      <t-menu width="110px" v-model="select">
        <t-menu-item value="1">列表</t-menu-item>
        <t-menu-item value="2">设置</t-menu-item>
      </t-menu>
    </div>
    <div v-if="select === '1'" class="center-message-content">
      <Empty v-if="messageData.length <= 0" height="200px" width="100%" text="消息列表为空" />
      <div v-for="item in messageData" :key="item.id" class="content-item">
        <div class="content-item-title">{{ item.title }}</div>
        <div class="content-item-time">
          {{ dayjs(item.created_at).format("YYYY-MM-DD HH:mm") }}
        </div>
        <div class="content-item-text">{{ item.text || '请点击查看详情阅读' }}</div>
        <div class="content-item-btn" @click="showMessageFunc(true, item)">
          查看详情 →
          <span v-show="item.is_read === 0" class="content-item-btn-clear" @click="(e) => clearMessage(e, item)">
            <t-tag theme="primary" variant="light">标记为已读</t-tag>
          </span>
        </div>
      </div>
    </div>
    <div v-else class="center-message-set">
      <t-table row-key="index" :data="messageSetData" :columns="messageColumns" />
    </div>
    <t-drawer class="center-message-show" :header="false" :visible="showMessage" :footer="false" size="60%"
      :onClose="() => showMessageFunc(false)">
      <div class="center-message-show-back" @click="showMessageFunc(false)" title="返回">
        <RollbackIcon />
      </div>
      <div class="center-message-show-title">
        {{ messageDataShow?.title || "" }}
      </div>
      <div class="center-message-show-time">
        {{
          messageDataShow ? dayjs(messageDataShow.created_at).format("YYYY-MM-DD HH:mm") : ""
        }}
      </div>
      <div class="center-message-show-text" v-html="messageDataShow ? messageDataShow.content : ''"></div>
    </t-drawer>
  </div>
</template>

<style lang="css">
:root {
  --center-message-content-btn-color: #0052d9;
}

[theme-mode="dark"]:root {
  --center-message-content-btn-color: #3C86FF;
}
</style>

<style lang="less" scoped>
.center-message {
  display: flex;
  padding: 10px;

  .center-message-menu {
    width: 120px;
    padding: 0 5px;

    :deep(.t-menu) {
      border: none;
      padding: 4px 0;
    }
  }

  .center-message-content {
    padding: 0 10px;
    margin-top: 4px;
    flex: 1;
    background-color: var(--td-bg-color-page);
    border-radius: 10px;

    .content-item {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
      margin: 15px 0;
      background-color: var(--td-bg-color-container);
      padding: 10px;
      border-radius: 10px;

      &-title {
        color: var(--td-text-color-primary);
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 4px;
      }

      &-time {
        color: var(--td-text-color-placeholder);
        font-size: 12px;
        border-bottom: 1px solid var(--td-component-stroke);
        padding-bottom: 4px;
      }

      &-text {
        padding-top: 10px;
        margin-bottom: 10px;
        color: var(--td-text-color-secondary);
      }

      &-btn {
        padding: 8px;
        background-color: var(--td-bg-color-page);
        cursor: pointer;
        height: 40px;
        line-height: 24px;

        &:hover {
          color: var(--center-message-content-btn-color);
        }

        &-clear {
          float: right;
        }
      }
    }
  }

  .center-message-set {
    padding: 15px;
    margin-top: 4px;
    flex: 1;
    background-color: var(--td-bg-color-page);
    border-radius: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .center-message-show {
    .t-drawer__body {
      position: relative;
    }

    &-back {
      position: fixed;
      width: 40px;
      height: 40px;
      color: var(--td-text-color-secondary);
      background-color: var(--td-bg-color-page);
      top: 25px;
      font-size: 20px;
      display: flex;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        color: var(--td-text-color-primary);
      }
    }

    &-title {
      font-size: 18px;
      margin: 10px 0;
      font-weight: 600;
      text-align: center;
      color: var(--td-text-color-primary);
    }

    &-time {
      padding-bottom: 10px;
      text-align: center;
      color: var(--td-text-color-secondary);
      border-bottom: 1px solid var(--td-component-stroke);
      margin-bottom: 20px;
    }

    &-text {
      overflow-x: hidden;
      background-color: #fff;
    }
  }
}
</style>