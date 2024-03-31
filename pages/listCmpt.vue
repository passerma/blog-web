<script setup lang="ts">
import { RocketIcon, GridViewIcon, BrowseIcon } from 'tdesign-icons-vue-next';
import dayjs from 'dayjs'
import { translateText } from 'utils/globalFunc'
import { BlogListType, GetBlogLook } from './fetch'

type Props = {
  list: BlogListType['blogs']
}

const look = ref<Record<number, number>>({})
defineProps<Props>()

onMounted(async () => {
  const res = await GetBlogLook()
  const lookTemp: typeof look.value = {}
  if (res && res.code === 0) {
    res.data.map((item) => {
      lookTemp[item.id] = item.look
    })
    look.value = lookTemp
  }
})
</script>

<template>
  <div class="index-main">
    <div class="index-list">
      <SearchInput />
      <div v-for="(item, index) in list" :key="item.id"
        :class="[index % 2 !== 0 ? 'index-list-item' : 'index-list-item-2']">
        <NuxtLink :to="`/article/${item.id}`">
          <div class="index-list-item-img">
            <img :src="item.bgurl">
            <div class="index-list-item-img-overlay" />
          </div>
        </NuxtLink>
        <div class="index-list-item-text">
          <div class="index-list-item-title">
            <NuxtLink :to="`/article/${item.id}`">
              <h2>
                {{ item.title }}
              </h2>
            </NuxtLink>
          </div>
          <div v-if="!(index % 2)" class="index-list-item-content">
            {{ translateText(item.text).slice(0, 100) }}...
          </div>
          <div class="index-list-item-more">
            <span v-if="index % 2" class="index-list-item-more-class">
              <GridViewIcon />
              {{
        item.class
      }}
            </span>
            <span>
              <RocketIcon />
              {{ dayjs(item.created_at).format("YYYY-MM-DD") }}
            </span>
            <span v-if="!(index % 2)" class="index-list-item-more-class">
              <GridViewIcon />
              {{ item.class }}
            </span>
            <span>
              <BrowseIcon />
              {{ look[item.id] ?? item.look }}
            </span>
          </div>
          <div v-if="index % 2" class="index-list-item-content">
            {{ translateText(item.text).slice(0, 100) }}...
          </div>
        </div>
      </div>
      <Empty v-show="!list.length" width="100%" />
    </div>
    <Search />
  </div>
</template>

<style lang="less" scoped>
.index-main {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  position: relative;

  .index-list {
    width: calc(100% - 200px);
    padding: 20px;
    padding-top: 0;
    border-radius: 10px;
    background-color: var(--td-bg-color-container);

    .index-list-item,
    .index-list-item-2 {
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

      .index-list-item-img {
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

        .index-list-item-img-overlay {
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

      .index-list-item-text {
        margin-left: 20px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .index-list-item-more {
          margin-bottom: 10px;
          display: flex;

          .index-list-item-more-class {
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

        .index-list-item-title {
          margin-bottom: 10px;

          h2 {
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

        .index-list-item-content {
          color: var(--td-text-color-secondary);
          font-weight: 400;
          font-size: 16px;
          line-height: 1.7;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }

    .index-list-item-2 {
      flex-direction: row-reverse;

      .index-list-item-text {
        margin-left: 0;
        margin-right: 20px;

        .index-list-item-content {
          margin-bottom: 10px;
        }

        .index-list-item-more {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
