<script setup lang="ts">
import { RocketIcon, GridViewIcon, BrowseIcon } from 'tdesign-icons-vue-next';
import dayjs from 'dayjs'
import { type BlogListType, GetBlogList } from './fetch'
import { translateText } from '~/utils/globalFunc'
import { GetBlogLook } from '../fetch'
import { UseSearchStore } from 'stores'
import { MessagePlugin } from 'tdesign-vue-next'

const searchStore = UseSearchStore()
const list = ref<BlogListType['blogs']>([])
const look = ref<Record<number, number>>({})

const res = await useAsyncData(() => {
  const classList = []
  for (let i = 0; i < searchStore.search.searchClass.length; i++) {
    const element = searchStore.search.searchClass[i];
    if (element.checked) {
      classList.push(element.value)
    }
  }
  return GetBlogList({
    wd: searchStore.search.searchValue || '',
    order: searchStore.search.searchOrder || '',
    class: classList.join('_')
  })
})
if (res.data.value && res.data.value.code === 0) {
  list.value = res.data.value.data.blogs
}

onMounted(() => {
  const data = res.data.value
  if (data && data.code === 0) {
    list.value = data.data.blogs
  } else {
    MessagePlugin.error(data?.msg || '查询文章列表失败')
  }
  getBlogLook()
})

const getBlogLook = async () => {
  const res = await GetBlogLook()
  const lookTemp: Record<number, number> = {}
  if (res && res.code === 0) {
    res.data.map((item) => {
      lookTemp[item.id] = item.look
    })
    look.value = lookTemp
  }
}

const getBlogListData = async () => {
  const classList = []
  for (let i = 0; i < searchStore.search.searchClass.length; i++) {
    const element = searchStore.search.searchClass[i];
    if (element.checked) {
      classList.push(element.value)
    }
  }
  const res = await GetBlogList({
    wd: searchStore.search.searchValue || '',
    order: searchStore.search.searchOrder || '',
    class: classList.join('_')
  })
  if (res && res.code === 0) {
    list.value = res.data.blogs || []
  } else {
    MessagePlugin.error(res?.msg || '查询文章列表失败')
  }
}

watch([
  () => searchStore.search.searchClass,
  () => searchStore.search.searchValue,
  () => searchStore.search.searchOrder
], () => {
  getBlogListData()
})
</script>

<template>
  <div class="article">
    <div class="article-list">
      <SearchInput />
      <div v-for="(item) in list" :key="item.id"
        :class="[item.beauti === 1 ? 'article-list-item' : 'article-list-item article-list-item-no']">
        <div class="article-list-item-text">
          <div class="article-list-item-title">
            <nuxt-link :to="`/article/${item.id}`">
              <h1>
                {{ item.title }}
              </h1>
            </nuxt-link>
          </div>
          <div class="article-list-item-content">
            {{ translateText(item.text).slice(0, 150) }}...<nuxt-link :to="`/article/${item.id}`">
              查看更多...
            </nuxt-link>
          </div>
          <div class="article-list-item-more">
            <span class="article-list-item-more-class">
              <GridViewIcon />
              {{ item.class }}
            </span>
            <span>
              <RocketIcon />
              {{ dayjs(item.created_at).format("YYYY-MM-DD") }}
            </span>
            <span>
              <BrowseIcon theme="outline" size="14" stroke-linejoin="miter" stroke-linecap="square" />
              {{ look[item.id] ?? item.look }}
            </span>
          </div>
        </div>
        <nuxt-link v-if="item.beauti === 1" :to="`/article/${item.id}`">
          <div class="article-list-item-img">
            <img :src="item.bgurl">
            <div class="article-list-item-img-overlay" />
          </div>
        </nuxt-link>
      </div>
      <Empty v-show="!list.length" width="100%" />
    </div>
    <Search />
  </div>
</template>

<style lang="less" scoped>
.article {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;

  .article-list {
    width: calc(100% - 200px);
    padding: 20px;
    padding-top: 0;
    border-radius: 10px;
    background-color: var(--td-bg-color-container);

    .article-list-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid var(--td-component-stroke);
      margin-bottom: 25px;
      padding-bottom: 25px;

      &:last-child {
        margin-bottom: 0;
        border-bottom: 0;
        padding-bottom: 0;
      }

      .article-list-item-img {
        width: 266px;
        height: 154px;
        position: relative;
        padding: 5px;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 5px;

        img {
          width: 100%;
          display: block;
          height: 100%;
          object-fit: contain;
          border-radius: 3px;
          overflow: hidden;
        }

        .article-list-item-img-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          background-color: rgba(0, 0, 0, 0.6);
          transition: all 0.2s ease-in-out;

          &:hover {
            opacity: 0.6;
          }
        }
      }

      .article-list-item-text {
        margin-right: 8px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .article-list-item-more {
          font-size: 16px;
          display: flex;

          .article-list-item-more-class {
            letter-spacing: 2px;
            transition: color .3s;
            cursor: pointer;

            &:hover {
              color: var(--td-text-color-secondary);
            }
          }

          span {
            font-size: 14px;
            color: var(--td-text-color-placeholder);
            display: flex;
            align-items: center;
            margin-right: 10px;

            .t-icon {
              margin-right: 5px;
            }
          }
        }

        .article-list-item-title {
          margin-bottom: 10px;

          h1 {
            margin-bottom: 0;
            color: var(--td-text-color-primary);
            letter-spacing: normal;
            font-weight: 700;
            font-size: 22px;
            word-wrap: break-word;
            word-break: break-all;
            transition: all 0.2s ease-in-out;

            &:hover {
              color: var(--td-text-color-secondary);
            }
          }
        }

        .article-list-item-content {
          color: var(--td-text-color-secondary);
          font-size: 16px;
          line-height: 1.7;
          word-wrap: break-word;
          word-break: break-all;
          margin-bottom: 10px;

          a {
            color: var(--td-brand-color);

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }

    .article-list-item-no {
      .article-list-item-text {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
