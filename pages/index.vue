<script setup lang="tsx">
import { MessagePlugin } from 'tdesign-vue-next'
import List from './listCmpt.vue'
import { GetBlogList, type BlogListType } from './fetch'
import { UseSearchStore } from 'stores';

const searchStore = UseSearchStore()
const list = ref<BlogListType['blogs']>([])
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
})

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
  <List :list="list" />
</template>