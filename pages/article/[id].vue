<script setup lang="ts">
import {
  RocketIcon, GridViewIcon, BrowseIcon, ChatDoubleIcon, ChatAddIcon, ChatIcon, StarFilledIcon, HeartFilledIcon,
  StarIcon, HeartIcon
} from 'tdesign-icons-vue-next';
import { GetBlogDetail, GetBlogLook, GetOperateRes, PostBlogOperateRes, PutLookRes } from './fetch'
import CommentCmpt from './commentCmpt.vue'
import { GetAuthorization } from 'utils/fetch'
import dayjs from 'dayjs';
import { MessagePlugin } from 'tdesign-vue-next';
import highlight from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { MdPreview, config } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { UseThemeStore } from 'stores'

const route = useRoute()
const themeStore = UseThemeStore()

let blogText = ''
let isOperate = ''
let detail = ref<any>()
const look = ref<number | undefined>()
const commentNum = ref(0)
const linkAllTitle = ref<any[]>([])
const minLinkNum = ref(5)
const likeNum = ref(0)
const collectNum = ref(0)
const like = ref(false)
const collect = ref(false)

const res = await useAsyncData(() => {
  const id = route.params.id as string
  return GetBlogDetail(id)
})
if (res.data.value && res.data.value.code === 0) {
  detail.value = res.data.value.data
}

onMounted(async () => {
  const el = document.getElementById('__nuxt')
  el && (el.scrollTop = 0);

  const id = route.params.id as string
  if (detail.value.text) {
    addAnchor()
  }
  // 更新阅读数量
  PutLookRes(id)
  // 查询操作数据
  getOperate()
  // 获取阅读数量
  const res = await GetBlogLook(id)
  if (res && res.code === 0) {
    for (let i = 0; i < res.data.length; i++) {
      const element = res.data[i];
      if (element.id.toString() === id) {
        look.value = element.look
      }
    }
  }
})

onBeforeRouteLeave(() => {
  document.title = 'passerma博客'
})

const addAnchor = () => {
  const linkAllTitleV = []
  let text = detail.value.text
  text = text.replace(/&nbsp;/g, '')
  text = text.replace(/\s/g, '')
  blogText = text
  const allH1 = document.querySelectorAll('.article-id-content h1') as unknown as HTMLElement[]
  const allH2 = document.querySelectorAll('.article-id-content h2') as unknown as HTMLElement[]
  const allH3 = document.querySelectorAll('.article-id-content h3') as unknown as HTMLElement[]
  const allH4 = document.querySelectorAll('.article-id-content h4') as unknown as HTMLElement[]
  const allH5 = document.querySelectorAll('.article-id-content h5') as unknown as HTMLElement[]
  linkAllTitleV.push(...setId(allH1, 1))
  linkAllTitleV.push(...setId(allH2, 2))
  linkAllTitleV.push(...setId(allH3, 3))
  linkAllTitleV.push(...setId(allH4, 4))
  linkAllTitleV.push(...setId(allH5, 5))
  linkAllTitleV.sort(sortLink)
  linkAllTitle.value = linkAllTitleV
}

/**
 * 设置h的锚点
 */
const setId = (allH: HTMLElement[], h: number) => {
  const linkTitle: any[] = []
  for (let i = 0; i < allH.length; i++) {
    let id = allH[i].getAttribute('id')
    if (!id) {
      allH[i].setAttribute('id', allH[i].innerText)
      id = allH[i].innerText
    }
    const title = allH[i].innerText.replace(/\s/g, '')
    linkTitle.push({ h, title, href: id })
  }
  if (linkTitle.length !== 0) {
    (h < minLinkNum.value) && (minLinkNum.value = h)
  }
  return linkTitle
}

/**
 * 排序标题
 */
const sortLink = (a: any, b: any) => {
  return blogText.indexOf(a.title) - blogText.indexOf(b.title)
}

/**
 * 设置评论数量
 * @param num 数量
 */
const setCommentNum = (num: number) => {
  commentNum.value = num
}

/**
 * 获取文章操作
 */
const getOperate = async () => {
  const res = await GetOperateRes(route.params.id as string)
  if (res && res.code === 0) {
    likeNum.value = res.data.likeNum
    collectNum.value = res.data.collectNum
    like.value = !!res.data.like
    collect.value = !!res.data.collect
  }
}

/**
 * 更新文章操作
 * @param type 类型
 */
const postBlogOperate = async (type: 'like' | 'collect') => {
  if (!GetAuthorization()) {
    MessagePlugin.info('请登录后操作')
    return
  }
  if (isOperate) return
  isOperate = type
  let data = {}
  if (type === 'like') {
    data = { like: !like.value }
  } else {
    data = { collect: !collect.value }
  }
  const res = await PostBlogOperateRes(route.params.id as string, data)
  if (res && res.code === 0) {
    MessagePlugin.success(type === 'like' ? '点赞成功' : '收藏成功')
    if (type === 'like') {
      if (like.value) {
        if (likeNum.value > 0) {
          likeNum.value--
        }
      } else {
        likeNum.value++
      }
      like.value = !like.value
    }
    if (type === 'collect') {
      if (collect.value) {
        if (collectNum.value > 0) {
          collectNum.value--
        }
      } else {
        collectNum.value++
      }
      collect.value = !collect.value
    }
  } else {
    MessagePlugin.error(res?.msg || '操作失败')
  }
  isOperate = ''
}

config({
  editorExtensions: {
    highlight: {
      instance: highlight
    }
  },
  markdownItConfig(md) {
    md.use(TargetBlankExtension);
  }
})
</script>

<template>
  <Title>{{ detail.title || 'passerma博客' }}</Title>
  <div class="article-id">
    <div v-if="!detail.text" :image-size="100" description="文章不存在" />
    <template v-else>
      <div class="article-id-left">
        <div id="article" class="article-id-left-box">
          <h1 class="article-id-title">
            {{ detail.title }}
          </h1>
          <div class="article-id-info">
            <span class="article-id-info-item">
              <RocketIcon />
              {{ dayjs(detail.created_at).format("YYYY-MM-DD HH:mm") }}
            </span>
            <span class="article-id-info-item">
              <GridViewIcon />
              {{ detail.class }}
            </span>
            <span class="article-id-info-item">
              <BrowseIcon />
              {{ look ?? detail.look }}
            </span>
            <span class="article-id-info-item">
              <ChatDoubleIcon />
              {{ commentNum }}
            </span>
          </div>
          <div class="article-id-content" v-if="detail.blog_type === 2">
            <div class="article-id-content-word" v-html="detail.content" />
          </div>
          <div class="article-id-content" v-else>
            <div class="article-id-content-markdown">
              <MdPreview v-show="themeStore.theme.theme" :modelValue="detail.content" :theme="themeStore.theme.theme"
                showCodeRowNumber noKatex noMermaid noIconfont />
            </div>
          </div>
          <article class="article-id-content-seo">{{ detail.text }}</article>
        </div>
        <CommentCmpt :setCommentNum="setCommentNum" />
      </div>
      <div class="article-id-right">
        <div class="article-id-right-box">
          <t-anchor v-if="linkAllTitle.length > 0" container="#__nuxt">
            <t-anchor-item v-for="item in linkAllTitle" :key="item.title" :href="'#' + item.href" :title="item.title"
              :class="'article-id-right-box-anchor-' + (item.h + 1 - minLinkNum)" />
          </t-anchor>
          <div class="article-id-right-box-link">
            <a title="点赞" :class="like ? 'link-span link-select' : 'link-span'" @click="postBlogOperate('like')">
              <HeartFilledIcon v-if="like" />
              <HeartIcon v-else />
              <span v-show="likeNum" class="link-num">{{ likeNum }}</span>
            </a>
            <a title="收藏" :class="collect ? 'link-span link-select' : 'link-span'" @click="postBlogOperate('collect')">
              <StarFilledIcon v-if="collect" />
              <StarIcon v-else />
              <span v-show="collectNum" class="link-num">{{ collectNum }}</span>
            </a>
            <a title="查看评论" class="link-span" href="#comment">
              <ChatIcon />
              <span v-show="commentNum" class="link-num">{{ commentNum }}</span>
            </a>
            <a title="发表评论" class="link-span" href="#comment-form">
              <ChatAddIcon />
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="css">
:root {
  --article-oprate-num-bg: #c2c8d1;
  --article-oprate-num-color: #fff;
}

[theme-mode="dark"]:root {
  --article-oprate-num-bg: #3F4854;
  --article-oprate-num-color: #e1e1e1;
}

[theme-mode="dark"] .md-editor-dark {
  --md-bk-color: #242424;
}
</style>

<style lang="less" scoped>
.article-id {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .article-id-left {
    width: calc(100% - 200px);

    .article-id-left-box {
      background: var(--td-bg-color-container);
      border-radius: 10px;
      padding: 20px;
    }

    .article-id-title {
      font-weight: bold;
      font-size: 34px;
      margin-bottom: 20px;
      color: var(--td-text-color-primary);
    }

    .article-id-info {
      display: flex;

      .t-icon {
        margin-right: 5px;
      }

      &-item {
        color: var(--td-text-color-secondary);
        font-size: 14px;
        height: 20px;
        display: inline-block;
        margin-right: 20px;
        display: flex;
        align-items: center;
      }
    }

    .article-id-content {
      .article-id-content-markdown {
        :deep(.md-editor-preview-wrapper) {
          padding: 0;
        }
      }

      &-seo {
        overflow: hidden;
        width: 0;
        height: 0;
        position: absolute;
      }
    }
  }

  .article-id-right {
    width: 200px;
    padding-left: 15px;

    .article-id-right-box {
      width: 185px;
      position: fixed;
      top: 50px;

      .t-anchor {
        width: 100%;
        max-height: 400px;
        overflow: auto;
        background: var(--td-bg-color-container);
        margin-bottom: 20px;
        border-radius: 10px;
        padding: 20px 0;

        &::-webkit-scrollbar {
          width: 12px;
          height: 12px;
          background: transparent;
        }

        &::-webkit-scrollbar-corner {
          width: 0px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          border: 4px solid transparent;
          background-clip: content-box;
          background-color: var(--td-scrollbar-color);
        }

        .article-id-right-box-anchor-1 {
          padding-left: 8px;
        }

        .article-id-right-box-anchor-2 {
          padding-left: 12px;
        }

        .article-id-right-box-anchor-3 {
          padding-left: 16px;
        }

        .article-id-right-box-anchor-4 {
          padding-left: 20px;
        }

        .article-id-right-box-anchor-5 {
          padding-left: 24px;
        }
      }

      .article-id-right-box-link {
        display: flex;
        flex-direction: column;

        .link-span {
          background-color: var(--td-bg-color-container);
          width: 50px;
          height: 50px;
          text-align: center;
          display: flex;
          position: relative;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-bottom: 15px;
          cursor: pointer;

          .t-icon {
            font-size: 24px;
            color: var(--td-text-color-secondary);
            transition: all .2s linear;
          }

          &:hover {
            .i-icon {
              color: var(--td-text-color-primary);
            }
          }

          .link-num {
            position: absolute;
            top: 0;
            left: 38px;
            height: 19px;
            line-height: 19px;
            min-width: 19px;
            padding: 0 5px;
            border-radius: 9px;
            font-size: 12px;
            text-align: center;
            white-space: nowrap;
            background-color: var(--article-oprate-num-bg);
            color: var(--article-oprate-num-color);
            user-select: none;
          }
        }

        .link-select {
          .t-icon {
            color: var(--td-text-color-link);
          }

          .link-num {
            background-color: var(--td-text-color-link);
          }

          &:hover {
            .i-icon {
              color: var(--td-text-color-link);
            }
          }
        }
      }
    }
  }
}
</style>