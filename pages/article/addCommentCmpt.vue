<script setup lang="ts">
import { UserIcon, DeleteIcon } from 'tdesign-icons-vue-next';
import { url2File } from 'utils/imageFun'
import { PostBlogComments, PutBlogComments } from './fetch'
import { UseUserInfoStore } from '~/stores';
import { MessagePlugin } from 'tdesign-vue-next';

const userInfoStore = UseUserInfoStore()
const route = useRoute()

const props = defineProps({
  isBlog: {
    type: Boolean,
    default: false
  },
  parent: {
    type: Number,
    default: 0
  },
  toUser: {
    type: Number,
    default: 0
  },
  updateComment: {
    type: Function,
    default: () => () => { }
  },
  closeComment: {
    type: Function,
    default: () => () => { }
  }
})

const commentV = ref('')
const files = ref<any[]>([])
const user = ref('')

let fileList: any[] = []
let id = 0

const userName = computed({
  get: () => {
    const userNameSto = userInfoStore.userInfo.userName
    if (userNameSto) {
      return userNameSto
    } else {
      return user.value
    }
  },
  set: (value) => {
    const userNameSto = userInfoStore.userInfo.userName
    if (!userNameSto) {
      user.value = value
    }
  }
})

const delImg = (index: number) => {
  files.value.splice(index, 1)
  fileList.splice(index, 1)
}

const beforeUpload = (file: any) => {
  if (fileList.length >= 8) {
    MessagePlugin.info('仅支持上传8张图片图片！')
    return false
  }
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    MessagePlugin.info('仅支持jpg，png格式图片！')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    MessagePlugin.info('图片大小不能超过5MB！')
    return false
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const imgFile = e.target?.result
    files.value.push(imgFile)
    fileList.push(file.raw)
  }
  reader.readAsDataURL(file.raw!)
  return false
}

const postComment = async () => {
  let userValue = user.value
  if (userInfoStore.userInfo.userName) {
    userValue = userInfoStore.userInfo.userName
  }
  if (commentV.value.trim() === '') {
    MessagePlugin.info('请输入评论')
    return
  }
  if (userValue.trim() === '') {
    MessagePlugin.info('请输入用户名')
    return
  }
  const data = new FormData()
  data.append('comment', commentV.value)
  data.append('user', userValue)
  data.append('parent', props.parent ? props.parent.toString() : '')
  data.append('toUser', props.toUser ? props.toUser.toString() : '')
  const filesPromiseArr: any[] = []
  for (let i = 0; i < fileList.length; i++) {
    if (typeof fileList[i] === 'string') {
      filesPromiseArr.push(url2File(fileList[i]))
    } else {
      filesPromiseArr.push(Promise.resolve(fileList[i]))
    }
  }
  const filesV = await Promise.all(filesPromiseArr)
  for (let i = 0; i < filesV.length; i++) {
    if (filesV[i]) {
      data.append('imgs', filesV[i])
    }
  }
  if (id) {
    const res = await PutBlogComments(id, data)
    if (res && res.code === 0) {
      MessagePlugin.success('修改成功')
      commentV.value = ''
      files.value = []
      fileList = []
      id = 0
      props.updateComment()
      return
    }
    MessagePlugin.error(res?.msg || '修改失败')
  } else {
    const res = await PostBlogComments(route.params.id as string, data)
    if (res && res.code === 0) {
      MessagePlugin.success('评论成功')
      commentV.value = ''
      files.value = []
      fileList = []
      id = 0
      props.updateComment()
      return
    }
    MessagePlugin.error(res?.msg || '评论失败')
  }
}

const setCommentV = (v: string, idV: number, img: string) => {
  commentV.value = v
  id = idV
  const filesV = []
  fileList = []
  if (img) {
    const imgArr = img.split('_')
    for (let i = 0; i < imgArr.length; i++) {
      const element = imgArr[i]
      filesV.push(element)
      fileList.push(element)
    }
    files.value = filesV
  } else {
    files.value = []
  }
}

defineExpose({
  setCommentV
})
</script>

<template>
  <div :id="isBlog ? 'comment-form' : ''" class="article-comment-form">
    <div class="article-comment-form-title">
      <t-avatar :image="userInfoStore.userInfo.avatar !== '' ? userInfoStore.userInfo.avatar : null">
        <template v-if="!userInfoStore.userInfo.userName" #icon>
          <user-icon />
        </template>
        {{ userInfoStore.userInfo.userName ? userInfoStore.userInfo.userName[0] : "" }}
      </t-avatar>
      说点什么
      <span v-if="!isBlog" class="article-comment-form-close" @click="closeComment()">关闭</span>
    </div>
    <div class="article-comment-form-text">
      <t-textarea v-model="commentV" placeholder="请输入评论" />
      <div class="article-comment-form-upload-imgbox">
        <div v-for="item, index in files" class="article-comment-form-upload-img">
          <img :src="item">
          <div>
            <DeleteIcon @click="delImg(index)" />
          </div>
        </div>
      </div>
      <div class="article-comment-form-upload">
        <t-upload accept="image/*" :before-upload="beforeUpload" />
        最多上传8张图片，仅支持jpg，png格式图片，单张大小5MB以内！
      </div>
      <div class="article-comment-form-btn">
        <t-input v-model="userName" label="用户名：" placeholder="请输入用户名" :disabled="userInfoStore.userInfo.userName !== ''"
          clearable />
        <t-button @click="postComment()">
          评论
        </t-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.article-comment-form {
  background: var(--td-bg-color-container);

  &-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--td-text-color-primary);
    height: 35px;
    position: relative;

    .t-avatar {
      margin-right: 15px;
    }

    .article-comment-form-close {
      position: absolute;
      right: 0;
      cursor: pointer;
      transition: all .3s;
      color: var(--td-text-color-secondary);

      &:hover {
        color: var(--td-text-color-primary);
      }
    }
  }

  .article-comment-form-text {
    margin-top: 10px;

    textarea {
      height: 80px !important;
    }
  }

  .article-comment-form-upload-imgbox {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;

    .article-comment-form-upload-img {
      width: 25%;
      margin-top: 5px;
      max-height: 100px;
      padding: 0 5px;
      flex-shrink: 0;
      position: relative;

      img {
        vertical-align: middle;
        object-fit: contain;
        width: 100%;
        max-height: 100px;
      }

      div {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.6);
        cursor: pointer;
        transition: all .5s linear;
        opacity: 0;
      }

      &:hover {
        div {
          color: #fff;
          opacity: .6;
        }
      }
    }
  }

  .article-comment-form-upload {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--td-text-color-placeholder);

    .t-upload {
      margin-right: 10px;
    }
  }

  .article-comment-form-btn {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    .t-input__wrap {
      width: 300px;
    }
  }
}
</style>
