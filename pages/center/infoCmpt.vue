<script setup lang="ts">
import { ImageIcon } from 'tdesign-icons-vue-next'
import { UseUserInfoStore } from 'stores'
import { GetUserInfo, PostAvatar, PutUserInfo } from './fetch';
import { MessagePlugin } from 'tdesign-vue-next';
import myUpload from 'vue-image-crop-upload';

const userInfoStore = UseUserInfoStore()

const loading = ref(true)
const setAvatarVis = ref(false)
const userInfo = reactive({
  introduction: '',
  qq: '',
  qqShow: false,
  blog: '',
  blogShow: false
})
const uploader = ref()

const setAvatar = () => {
  setAvatarVis.value = true
}

const setUserInfo = async () => {
  loading.value = true
  const res = await PutUserInfo(userInfo)
  if (res && res.code === 0) {
    MessagePlugin.success('修改个人信息成功')
  } else {
    MessagePlugin.error(res?.msg || '修改个人信息失败')
  }
  loading.value = false
}

const cropSuccess = async (imgDataUrl: string) => {
  const file = base64ToFile(imgDataUrl, Date.now().toString())
  let res = await PostAvatar(file)
  if (res && res.code === 0) {
    userInfoStore.setUserInfoAvatar(res.data)
    MessagePlugin.success('修改成功')
    // this.$refs.uploader.setStep(1)
    uploader.value.setStep(1)
  } else {
    MessagePlugin.error(res?.msg || '修改失败')
  }
}

onMounted(async () => {
  const res = await GetUserInfo()
  if (res && res.code === 0 && res.data) {
    const { introduction, qq, qqShow, blog, blogShow } = res.data
    userInfo.introduction = introduction
    userInfo.qq = qq
    userInfo.qqShow = qqShow
    userInfo.blog = blog
    userInfo.blogShow = blogShow
  } else {
    MessagePlugin.error(res?.msg || '查询个人信息失败')
  }
  loading.value = false
})
</script>

<template>
  <div class="center-info">
    <div class="center-info-item center-info-item-avatar">
      <div class="item-title">头像</div>
      <div class="item-avatar">
        <img :src="userInfoStore.userInfo.avatar" />
        <div @click="setAvatar" class="item-open">
          <ImageIcon class="open-icons" slot="icon" />
        </div>
      </div>
      <t-button @click="setAvatar" size="small" class="item-btn" variant="outline">
        <ImageIcon slot="icon" />
        修改头像
      </t-button>
    </div>
    <div class="center-info-item">
      <div class="item-title">简介</div>
      <t-textarea placeholder="简单介绍一下你自己" v-model="userInfo.introduction" :maxlength="60" />
    </div>
    <div class="center-info-item  center-info-item2">
      <div class="item-box">
        <div class="item-title">QQ</div>
        <t-input placeholder="你的QQ" v-model="userInfo.qq">
          <template #suffix>
            <t-switch v-model="userInfo.qqShow" :label="['显示', '隐藏']" />
          </template>
        </t-input>
      </div>
      <div class="item-box">
        <div class="item-title">博客</div>
        <t-input placeholder="你的博客地址" v-model="userInfo.blog">
          <template #suffix>
            <t-switch v-model="userInfo.blogShow" :label="['显示', '隐藏']" />
          </template>
        </t-input>
      </div>
    </div>
    <t-button :loading="loading" class="center-info-btn" theme="primary" @click="setUserInfo">更新信息</t-button>
    <my-upload :width="150" :height="150" url="" v-model="setAvatarVis" img-format="png" @crop-success="cropSuccess"
      :noRotate="false" ref="uploader" :maxSize="2048" />
  </div>
</template>

<style lang="less" scoped>
.center-info {
  padding: 10px;

  .center-info-item {
    position: relative;
    margin-bottom: 8px;
    width: 800px;

    .item-title {
      color: var(--td-text-color-primary);
      font-size: 14px;
      padding-bottom: 8px;
    }
  }

  .center-info-item2 {
    display: flex;
    flex-direction: row;

    .item-box {
      flex: 1;

      &:last-child {
        margin-left: 50px;
      }
    }
  }

  .center-info-item-avatar {
    .item-avatar {
      position: relative;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }

      .item-open {
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
        transition: all .3s;
        opacity: 0;
        cursor: pointer;

        &:hover {
          opacity: 0.6;
        }

        .open-icons {
          font-size: 24px;
          color: #fff;
        }
      }
    }

    .item-btn {
      position: absolute;
      bottom: 34px;
      left: 90px;

      :deep(.t-button__text) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .center-info-btn {
    margin: 30px 0 10px 0;
  }
}
</style>

<style lang="css">
[theme-mode="dark"] {
  @media (prefers-color-scheme: dark) {
    .vue-image-crop-upload .vicp-wrap {
      /* box-shadow: 0 1px 3px 0 #E6E6E6; */
      background-color: #121212;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4::after,
    .vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4::before {
      background-color: #A3A3A3;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-icon1 .vicp-icon1-arrow {
      border-bottom: 14.7px solid #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-icon1 .vicp-icon1-body {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-icon1 .vicp-icon1-bottom {
      border: 6px solid #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-hint {
      color: #A3A3A3;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-no-supported-hint {
      background-color: #292929;
      color: #A3A3A3;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area:hover {
      border-color: #000000;
      background-color: #000000;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-img-container {
      background-color: #38382F;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-img-container .vicp-img-shade {
      -webkit-box-shadow: 0 2px 6px 0 #E6E6E6;
      box-shadow: 0 2px 6px 0 #E6E6E6;
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-rotate i {
      background-color: #E6E6E6;
      color: #121212;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-rotate i:hover {
      -webkit-box-shadow: 0 1px 3px 0 #E6E6E6;
      box-shadow: 0 1px 3px 0 #E6E6E6;
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon5,
    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon6 {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon5:hover,
    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon6:hover {
      -webkit-box-shadow: 0 1px 3px 0 #E6E6E6;
      box-shadow: 0 1px 3px 0 #E6E6E6;
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon5::before {
      background-color: #121212;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon6::before {
      background-color: #121212;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon6::after {
      background-color: #121212;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-webkit-slider-thumb {
      -webkit-box-shadow: 0 2px 6px 0 #E6E6E6;
      box-shadow: 0 2px 6px 0 #E6E6E6;
      background-color: #47B37E;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-moz-range-thumb {
      box-shadow: 0 2px 6px 0 #E6E6E6;
      background-color: #47B37E;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-ms-thumb {
      box-shadow: 0 2px 6px 0 #E6E6E6;
      background-color: #47B37E;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]:active::-moz-range-thumb {
      box-shadow: 0 1px 3px 0 #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]:active::-ms-thumb {
      box-shadow: 0 1px 3px 0 #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]:active::-webkit-slider-thumb {
      -webkit-box-shadow: 0 1px 3px 0 #E6E6E6;
      box-shadow: 0 1px 3px 0 #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-webkit-slider-runnable-track {
      -webkit-box-shadow: 0 1px 3px 0 #E6E6E6;
      box-shadow: 0 1px 3px 0 #E6E6E6;
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-moz-range-track {
      box-shadow: 0 1px 3px 0 #E6E6E6;
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-ms-track {
      box-shadow: 0 1px 3px 0 #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-ms-fill-lower {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-ms-fill-upper {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]:focus::-webkit-slider-runnable-track {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]:focus::-moz-range-track {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]:focus::-ms-fill-lower {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]:focus::-ms-fill-upper {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-right .vicp-preview .vicp-preview-item span {
      color: #575757;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-loading {
      color: #757575;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-progress-wrap {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-progress-wrap .vicp-progress {
      background-color: #66C294;
      -webkit-box-shadow: 0 2px 6px 0 #E6E6E6;
      box-shadow: 0 2px 6px 0 #E6E6E6;
      background-image: #E6E6E6;
      background-image: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-progress-wrap .vicp-progress::after {
      border: 1px solid #E6E6E6;
      -webkit-box-shadow: 0 1px 4px 0 #E6E6E6;
      box-shadow: 0 1px 4px 0 #E6E6E6;
      background-color: #66C294;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-operate a {
      color: #66C294;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-operate a:hover {
      background-color: #E6E6E6;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-error,
    .vue-image-crop-upload .vicp-wrap .vicp-success {
      color: #FF4738;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-success {
      color: #66C294;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-icon3::after {
      border-color: #66C294;
    }

    .vue-image-crop-upload .vicp-wrap .vicp-icon2::after,
    .vue-image-crop-upload .vicp-wrap .vicp-icon2::before {
      background-color: #FF4738;
    }

    .e-ripple {
      background-color: #E6E6E6;
    }

  }
}
</style>