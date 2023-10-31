<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import { UseSearchStore } from 'stores';

let thisWidth = 0
let thisLeft = 0
let thisType = 0
const searchStore = UseSearchStore()
const searchRef = ref()
const searchInputRef = ref()
const props = defineProps({
  domClass: {
    type: String,
    default: 'page'
  }
})

const onEnter = (v?: string) => {
  searchStore.searchValueSet(v)
}

const scroll = () => {
  const scrollTop = document.getElementById('__nuxt')!.scrollTop
  if (scrollTop >= 50 && thisType !== 1) {
    (searchRef.value as HTMLDivElement).style['position'] = 'fixed'
    thisType = 1
  }
  if (scrollTop < 50 && thisType !== 0) {
    (searchRef.value as HTMLDivElement).style['position'] = 'unset'
    thisType = 0
  }
}

onMounted(() => {
  const search = (searchRef.value as HTMLDivElement)
  thisWidth = document.querySelector(`.${props.domClass}`)!.clientWidth - 240
  thisLeft = document.querySelector(`.${props.domClass}`)!.getBoundingClientRect().left + 20
  search.style['width'] = thisWidth + 'px'
  search.style['left'] = thisLeft + 'px'
  document.getElementById('__nuxt')!.addEventListener('scroll', scroll)
  scroll()
})

onBeforeUnmount(() => {
  document.getElementById('__nuxt')!.removeEventListener('scroll', scroll)
})

watch(() => searchStore.search.searchVis, (vis) => {
  if (vis) {
    setTimeout(() => {
      (searchInputRef.value as HTMLInputElement)?.focus()
    }, 100)
  }
})
</script>

<template>
  <div :class="searchStore.search.searchVis ? 'searchInput' : 'searchInput-none'">
    <div v-show="searchStore.search.searchVis" class="searchInput-box" ref="searchRef">
      <div class="searchInput-wrap">
        <t-input auto-width placeholder="请输入搜索内容" @enter="onEnter" clearable
          :defaultValue="searchStore.search.searchValue" @clear="onEnter('')" ref="searchInputRef">
          <template #suffixIcon>
            <SearchIcon :style="{ cursor: 'pointer' }" />
          </template>
        </t-input>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.searchInput {
  width: 100%;
  height: 66px;

  .searchInput-wrap {
    border-bottom: 1px solid var(--td-component-border) !important;
  }

  .searchInput-box {
    width: 100%;
    height: 66px;
    padding-top: 20px;
    padding-bottom: 10px;
    top: 0;
    background: var(--td-bg-color-container);
    z-index: 1;
  }

  :deep(.t-input) {
    min-width: 150px;
    height: 32px;
    padding: 0;
    font-size: 16px;
    border-radius: 0;
    border: none !important;
    box-shadow: none !important;

    input {
      font-size: 16px;
    }
  }
}

.searchInput-none {
  width: 100%;
  height: 20px;
}
</style>