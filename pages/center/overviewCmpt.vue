<script setup lang="ts">
import { HeartIcon, StarIcon, ChatBubbleSmileIcon, JumpIcon } from 'tdesign-icons-vue-next';
import dayjs from 'dayjs';
import { GetAuthorization } from 'utils/fetch'
import { GetCollectBlog, GetComment, GetLikeBlog } from './fetch';
import { UseUserInfoStore } from 'stores';

const userInfo = UseUserInfoStore();

const likeData = ref<{ id: number, title: string }[]>([])
const collectData = ref<{ id: number, title: string }[]>([])
const commentData = ref<{
  id: number, title: string, comment: string, created_at: string,
  blog_id: number
}[]>([])

const getLikeBlogData = () => {
  if (GetAuthorization()) {
    GetLikeBlog().then(res => {
      if (res && res.code === 0) {
        likeData.value = res.data
      }
    });
    GetCollectBlog().then(res => {
      if (res && res.code === 0) {
        collectData.value = res.data
      }
    });
    GetComment().then(res => {
      if (res && res.code === 0) {
        commentData.value = res.data
      }
    });
  }
}

onMounted(() => {
  getLikeBlogData()
})

watch(() => userInfo.userInfo.userId, (v) => {
  if (v) {
    getLikeBlogData()
  }
})
</script>

<template>
  <div class="center-overview">
    <div class="center-overview-like">
      <div class="like-item">
        <div class="like-item-title">
          <HeartIcon />
          点赞
        </div>
        <Empty v-if="likeData.length <= 0" text="还没有点赞任何内容哦" width="100%" height="200px" />
        <t-list stripe split v-else>
          <t-list-item v-for="v in likeData" :key="v.id">
            <t-link :href="`/article/${v.id}`" target="_blank">{{ v.title }}
              <JumpIcon class="link-icon" slot="suffixIcon" />
            </t-link>
          </t-list-item>
        </t-list>
      </div>
      <div class="like-item">
        <div class="like-item-title">
          <StarIcon />
          收藏
        </div>
        <Empty v-if="collectData.length <= 0" text="还没有收藏任何内容哦" width="100%" height="200px" />
        <t-list stripe split v-else>
          <t-list-item v-for="v in collectData" :key="v.id">
            <t-link :href="`/article/${v.id}`" target="_blank">{{ v.title }}
              <JumpIcon class="link-icon" slot="suffixIcon" />
            </t-link>
          </t-list-item>
        </t-list>
      </div>
    </div>
    <div class="center-overview-comment">
      <div class="comment-header">
        <ChatBubbleSmileIcon />
        评论
      </div>
      <div class="comment-box">
        <Empty v-if="commentData.length <= 0" text="快去评论吧" width="100%" height="300px" />
        <div v-for="item in commentData" :key="item.id" class="comment-item">
          <div class="comment-content">
            <t-link :href="`/article/${item.blog_id}?comment=${item.id}`" target="_blank">
              {{ item.comment }}
              <JumpIcon slot="suffixIcon" />
            </t-link>
          </div>
          <div class="comment-desc">
            <span class="comment-desc-left">评论于</span>
            <t-link class="comment-bolg" :href="`/article/${item.blog_id}`" theme="primary" target="_blank">
              {{ item.title }}
            </t-link>
            <span class="comment-time">{{ dayjs(item.created_at).format("YYYY-MM-DD HH:mm") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.center-overview {
  padding: 10px;

  .center-overview-like {
    display: flex;

    .like-item {
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      border: 1px var(--td-component-stroke) solid;
      box-sizing: border-box;

      &:first-child {
        margin-right: 5px;
      }

      &:last-child {
        margin-left: 5px;
      }

      .like-item-title {
        padding: 10px 20px;
        border-bottom: 1px var(--td-component-stroke) solid;
        display: flex;
        align-items: center;
        color: var(--td-brand-color);

        .t-icon {
          margin-right: 10px;
        }
      }

      .t-list {
        max-height: 300px;
        overflow-y: auto;

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
      }

      .t-list-item__content {
        width: 100%;
        word-break: break-all;
      }

      .link-icon {
        margin-left: 5px;
      }
    }
  }

  .center-overview-comment {
    margin-top: 10px;
    border: 1px var(--td-component-stroke) solid;

    .comment-header {
      padding: 10px 20px;
      border-bottom: 1px var(--td-component-stroke) solid;
      display: flex;
      align-items: center;
      color: var(--td-brand-color);

      .t-icon {
        margin-right: 10px;
      }
    }

    .comment-box {
      max-height: 400px;
      overflow-y: auto;

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

      .comment-item {
        padding: 8px 20px;
        border-bottom: 1px solid var(--td-component-stroke);

        .comment-content {
          font-size: 14px;
          margin-bottom: 5px;

          .t-icon {
            margin-left: 5px;
          }
        }

        .comment-desc {
          height: 22px;
          display: flex;
          align-items: center;

          .comment-desc-left {
            color: var(--td-text-color-secondary);
            margin-right: 5px;
          }

          .comment-time {
            color: var(--td-text-color-placeholder);
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>