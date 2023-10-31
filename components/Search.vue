<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import { UseSearchStore } from 'stores'

const searchStore = UseSearchStore()
const options = [{
  value: 'created_at desc',
  label: '创建时间 新-旧'
}, {
  value: 'created_at',
  label: '创建时间 旧-新'
}, {
  value: 'look desc',
  label: '阅读数量 多-少'
}, {
  value: 'look',
  label: '阅读数量 少-多'
}, {
  value: 'comment_num desc',
  label: '评论数量 多-少'
}, {
  value: 'comment_num',
  label: '评论数量 少-多'
}]

const searchVisChange = () => {
  searchStore.searchVisSet()
}

const searchClassSet = (checked: boolean, v: string) => {
  searchStore.searchClassSet(v, checked)
}

const searchOrderSet = (v: string) => {
  searchStore.searchOrderSet(v)
}
</script>

<template>
  <div class="search">
    <div class="search-main">
      <t-button block variant="outline" @click="searchVisChange">
        <SearchIcon slot="icon" />搜索
      </t-button>
      <t-divider align="left">文章排序</t-divider>
      <t-select :value="searchStore.search.searchOrder" @change="searchOrderSet">
        <t-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </t-select>
      <t-divider align="left">文章分类</t-divider>
      <div>
        <t-check-tag v-for="(tag, index) in searchStore.search.searchClass" :key="index" :checked="tag.checked"
          @change="(checked: boolean) => searchClassSet(checked, tag.value)">
          {{ tag.value }}
        </t-check-tag>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search {
  width: 200px;
  padding-left: 15px;

  .search-main {
    width: 185px;
    position: fixed;
    padding: 20px;
    top: 50px;
    background: var(--td-bg-color-container);
    border-radius: 10px;

    :deep(.t-button__text) {
      display: flex;
      align-items: center;
      justify-content: center;

      .t-icon {
        margin-right: 8px;
      }
    }
  }

  .t-tag {
    user-select: none;
    margin-right: 8px;
    margin-bottom: 4px;
  }
}
</style>