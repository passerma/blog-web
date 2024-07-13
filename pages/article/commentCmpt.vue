<script setup lang="ts">
import dayjs from 'dayjs';
import {
  ChatAddIcon, EditIcon, DeleteIcon, BrowseIcon
} from 'tdesign-icons-vue-next';
import { GetBlogComments, type BlogComment, DelBlogComment } from './fetch'
import AddCommentCmpt from './addCommentCmpt.vue'
import { UseUserInfoStore } from '~/stores';
import { MessagePlugin } from 'tdesign-vue-next';

const useUserInfo = UseUserInfoStore()
const route = useRoute()

const commentLen = ref(0)
const comment = ref<BlogComment[]>([])
const editId = ref(0)
const commentNames = ref<Record<string, string>>({})

let needScroll = false
const commentRefs: Record<string, any> = {}

const props = defineProps({
  setCommentNum: {
    type: Function,
    default: () => { }
  }
})

onMounted(() => {
  if (route.query && route.query.comment) {
    needScroll = true
  }
  getcomment()
})

const setCommentRef = (el: any, k: string) => {
  if (el) {
    commentRefs[k] = el
  }
}

const getcomment = async () => {
  editId.value = 0
  const data = await GetBlogComments(route.params.id as string)
  if (data && data.code === 0 && data.data) {
    dealComment(data.data)
  } else {
    MessagePlugin.info(data?.msg || '查询评论失败')
  }
}

const dealComment = (data: BlogComment[]) => {
  const firstComment: any = []
  const firstCommentRe: Record<string, BlogComment[]> = {}
  const commentNamesT: Record<string, string> = {}
  commentLen.value = data.length
  props.setCommentNum(data.length)
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    // 处理图片
    if (element.comment_img) {
      if (!element.comment_img.includes('/img/')) {
        element.comment_img = element.comment_img.replaceAll('-', '_')
      }
      const imgs = element.comment_img.split('_')
      const imgsUrl: string[] = []
      for (let j = 0; j < imgs.length; j++) {
        const imgsEl = imgs[j]
        if (!imgsEl.includes('/img/')) {
          imgsUrl.push(`/api/file/commentImg/${imgsEl}`)
        } else {
          imgsUrl.push(imgsEl)
        }
      }
      element.comment_img = imgsUrl.join('_')
    }
    // 处理头像
    if (element.user_id !== null && !element.avatar) {
      element.avatar = 'https://www.passerma.com/down/morenAvatar.png'
    }
    commentNamesT[element.id.toString()] = element.user_name || element.user
    if (!element.to_user) {
      firstComment.push(element)
    } else if (firstCommentRe[element.to_user]) {
      firstCommentRe[element.to_user].unshift(element)
    } else {
      firstCommentRe[element.to_user] = [element]
    }
  }
  for (let i = 0; i < firstComment.length; i++) {
    const element = firstComment[i]
    element.child = firstCommentRe[element.id] || []
  }
  commentNames.value = commentNamesT
  comment.value = firstComment
}

const reComment = (id: number) => {
  editId.value = id
  commentRefs[`comment_${id}`] && commentRefs[`comment_${id}`].setCommentV('', 0, '')
}

const editComment = (id: number, v: string, comment_img: string) => {
  editId.value = id
  commentRefs[`comment_${id}`] && commentRefs[`comment_${id}`].setCommentV(v, id, comment_img)
}

const delComment = async (id: number) => {
  const data = await DelBlogComment(id)
  if (data && data.code === 0) {
    MessagePlugin.success('删除成功')
    getcomment()
  } else {
    MessagePlugin.error(data?.msg || '删除失败')
  }
}

const reCommentMouse = (parent: string, type: string) => {
  const item = document.getElementById(`comment-${parent}`)
  if (item && type === 'enter') {
    item.classList.add(`comment-breath`)
  } else if (item && type === 'leave') {
    item.classList.remove(`comment-breath`)
  }
}

const closeComment = () => {
  editId.value = 0
}

onUpdated(() => {
  if (needScroll && route.query && route.query.comment) {
    const commentId = `#comment-${route.query.comment}`
    const commentDom = document.querySelector(commentId)
    if (commentDom) {
      needScroll = false
      commentDom.scrollIntoView();
    }
  }
})
</script>

<template>
  <div id="comment" class="article-comment">
    <div v-if="commentLen > 0" class="article-comment-main">
      <div class="article-comment-top">
        全部评论 <span>{{ commentLen }}</span>
      </div>
      <div v-for="(item, index) in comment" :key="item.id" class="article-comment-item" :id="`comment-${item.id}`">
        <t-popup showArrow destroyOnClose :delay="100" :disabled="item.user_id === null" placement="right-top">
          <t-avatar size="40px" :image="item.avatar || null" style="cursor: pointer;">
            {{ item.user[0] }}
          </t-avatar>
          <template #content>
            <div class="article-comment-user-info">
              <img :src="item.avatar" />
              <div class="info-introduction">{{ item.introduction }}</div>
              <t-link theme="primary" hover="color" target="_blank" :href="`/info?u=${item.user_id}`" underline> 前往主页
              </t-link>
            </div>
          </template>
        </t-popup>
        <div class="article-comment-item-content">
          <div class="article-comment-item-content-name">
            <t-popup showArrow destroyOnClose :delay="100" :disabled="item.user_id === null" placement="right-top">
              <span style="cursor: pointer;">{{ item.user_name || item.user }}</span>

              <template #content>
                <div class="article-comment-user-info">
                  <img :src="item.avatar" />
                  <div class="info-introduction">{{ item.introduction }}</div>
                  <t-link theme="primary" hover="color" target="_blank" :href="`/info?u=${item.user_id}`" underline>
                    前往主页
                  </t-link>
                </div>
              </template>
            </t-popup>
            <t-tag v-if="item.location !== ''" theme="success" variant="light" size="small">{{ item.location }}</t-tag>
          </div>
          <div class="article-comment-item-content-more">
            {{ dayjs(item.created_at).format("YYYY-MM-DD HH:mm") }}
            <span class="article-comment-item-content-more-re" @click="reComment(item.id)">
              <ChatAddIcon />
              回复
            </span>
            <span v-if="item.user_id !== null && useUserInfo.userInfo.userId === item.user_id"
              class="article-comment-item-content-more-re"
              @click="editComment(item.id, item.comment, item.comment_img)">
              <EditIcon />
              修改
            </span>
            <t-popconfirm theme="warning" content="评论删除后无法恢复，确认删除吗" @confirm="delComment(item.id)">
              <span v-if="item.user_id !== null && useUserInfo.userInfo.userId === item.user_id"
                class="article-comment-item-content-more-re">
                <DeleteIcon />
                删除
              </span>
            </t-popconfirm>
          </div>
          <div v-if="item.comment_img" class="article-comment-item-img-box">
            <t-image-viewer v-for="img in item.comment_img.split('_')" :key="img" :images="[img]">

              <template #trigger="{ open }">
                <div class="box-item">
                  <img alt="图片" :src="img" />
                  <div class="box-btn" @click="open">
                    <BrowseIcon size="1.4em" />
                  </div>
                </div>
              </template>
            </t-image-viewer>
          </div>
          <div :class="item.child.length > 0
            ? 'article-comment-item-content-text article-comment-item-content-text-border'
            : 'article-comment-item-content-text'
            ">
            {{ item.comment }}
          </div>
          <div v-show="item.id === editId" :class="item.child.length === 0 && index === comment.length - 1
            ? 'article-comment-item-content-form article-comment-item-content-form-border'
            : 'article-comment-item-content-form'
            ">
            <AddCommentCmpt :ref="(el) => setCommentRef(el, `comment_${item.id}`)" :to-user="item.id" :parent="item.id"
              :update-comment="getcomment" :close-comment="closeComment" />
          </div>
          <div v-for="item2 in item.child" :key="item2.id" class="article-comment-item-child"
            :id="`comment-${item2.id}`">
            <t-popup showArrow destroyOnClose :delay="100" :disabled="item2.user_id === null" placement="right-top">
              <t-avatar size="40px" :image="item2.avatar || null" style="cursor: pointer;">
                {{ item2.user[0] }}
              </t-avatar>

              <template #content>
                <div class="article-comment-user-info">
                  <img :src="item2.avatar" />
                  <div class="info-introduction">{{ item2.introduction }}</div>
                  <t-link theme="primary" hover="color" target="_blank" :href="`/info?u=${item2.user_id}`" underline>
                    前往主页
                  </t-link>
                </div>
              </template>
            </t-popup>
            <div class="article-comment-item-content">
              <div class="article-comment-item-content-name">
                <t-popup showArrow destroyOnClose :delay="100" :disabled="item2.user_id === null" placement="right-top">
                  <span style="cursor: pointer;">{{ item2.user_name || item2.user }}</span>
                  <template #content>
                    <div class="article-comment-user-info">
                      <img :src="item2.avatar" />
                      <div class="info-introduction">{{ item2.introduction }}</div>
                      <t-link theme="primary" hover="color" target="_blank" :href="`/info?u=${item2.user_id}`"
                        underline>
                        前往主页
                      </t-link>
                    </div>
                  </template>
                </t-popup>
                <t-tag v-if="item2.location !== ''" theme="success" variant="light" size="small">{{ item2.location
                  }}</t-tag>
              </div>
              <div class="article-comment-item-content-more">
                {{ dayjs(item2.created_at).format("YYYY-MM-DD HH:mm") }}
                <span class="article-comment-item-content-more-re" @click="reComment(item2.id)">
                  <ChatAddIcon />
                  回复
                </span>
                <span v-if="item2.user_id !== null && useUserInfo.userInfo.userId === item2.user_id"
                  class="article-comment-item-content-more-re" @click="
                    editComment(item2.id, item2.comment, item2.comment_img)
                    ">
                  <EditIcon />
                  修改
                </span>
                <t-popconfirm theme="warning" content="评论删除后无法恢复，确认删除吗" @confirm="delComment(item2.id)">
                  <span v-if="item2.user_id !== null && useUserInfo.userInfo.userId === item2.user_id"
                    class="article-comment-item-content-more-re">
                    <DeleteIcon />
                    删除
                  </span>
                </t-popconfirm>
              </div>
              <div class="article-comment-item-content-text">
                <span class="text-re" v-if="item2.parent &&
                  item2.parent !== item2.to_user &&
                  commentNames[item2.parent]
                " @mouseenter="() => reCommentMouse(item2.parent, 'enter')"
                  @mouseleave="() => reCommentMouse(item2.parent, 'leave')">
                  {{ `@${commentNames[item2.parent]}` }}
                  <br />
                </span>
                {{ item2.comment }}
              </div>
              <div v-if="item2.comment_img" class="article-comment-item-img-box">
                <t-image-viewer v-for="img in item2.comment_img.split('_')" :key="img" :images="[img]">

                  <template #trigger="{ open }">
                    <div class="box-item">
                      <img alt="图片" :src="img" />
                      <div class="box-btn" @click="open">
                        <BrowseIcon size="1.4em" />
                      </div>
                    </div>
                  </template>
                </t-image-viewer>
              </div>
              <div v-show="item2.id === editId" class="
                  article-comment-item-content-form
                  article-comment-item-content-form-border
                ">
                <AddCommentCmpt :ref="(el) => setCommentRef(el, `comment_${item2.id}`)" :to-user="item.id"
                  :parent="item2.id" :update-comment="getcomment" :close-comment="closeComment" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="article-comment-top-none">暂无评论，我会出手</div>
    <div class="article-comment-form-main">
      <AddCommentCmpt :is-blog="true" :update-comment="getcomment" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.article-comment {
  margin-top: 20px;

  .article-comment-main {
    background: var(--td-bg-color-container);
    border-radius: 10px;
    overflow: hidden;
    padding-bottom: 10px;

    .article-comment-top {
      padding: 15px;
      border-bottom: 1px solid var(--td-component-stroke);
      color: var(--td-text-color-primary);
      font-size: 16px;
      margin: 0 20px;
      margin-bottom: 20px;

      span {
        margin-left: 6px;
        font-size: 14px;
        color: var(--td-text-color-secondary);
        font-weight: normal;
      }
    }

    .article-comment-item {
      display: flex;
      align-items: flex-start;
      padding: 0 20px;
      background: var(--td-bg-color-container);

      .t-avatar {
        flex-shrink: 0;
      }

      &:last-child {
        .article-comment-item-child:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .article-comment-item-content-text {
          border-bottom: none;
          margin-bottom: 0;
        }
      }

      .article-comment-item-content {
        flex-grow: 1;
        margin-left: 10px;

        &-name {
          font-size: 16px;
          font-weight: 500;
          color: var(--td-text-color-primary);
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .t-tag {
            margin-left: 8px;
          }
        }

        &-more {
          font-size: 14px;
          color: var(--td-text-color-secondary);
          margin-top: 1px;

          .article-comment-item-content-more-re {
            margin-left: 5px;
            cursor: pointer;

            svg {
              transform: translateY(-1px);
            }

            &:hover {
              color: var(--td-text-color-primary);
            }
          }
        }

        &-text {
          margin-top: 5px;
          margin-bottom: 10px;
          padding-bottom: 10px;
          font-size: 16px;
          line-height: 1.5;
          word-break: break-word;
          border-bottom: 1px solid var(--td-component-stroke);

          span {
            border-radius: 4px;
            padding: 0 3px;
            cursor: pointer;
            color: var(--td-text-color-secondary);
            background-color: var(--td-bg-color-component);
          }
        }

        .article-comment-item-content-text-border {
          margin-bottom: 10px !important;
          border-bottom: 1px solid var(--td-component-stroke) !important;
        }

        .article-comment-item-content-form {
          margin-bottom: 15px;
        }

        .article-comment-item-content-form-border {
          border-top: 1px solid var(--td-component-stroke) !important;
          padding-top: 10px;
        }
      }

      .article-comment-item-child {
        display: flex;
        align-items: flex-start;
        border-bottom: 1px solid var(--td-component-stroke);
        margin-bottom: 10px;

        .article-comment-item-content-text {
          border-bottom: none !important;
          margin-bottom: 0;
        }

        .article-comment-item-img-box {
          margin-bottom: 10px;
          margin-top: -10px;
        }
      }

      .article-comment-item-img-box {
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .box-item {
          width: 25%;
          max-height: 100px;
          padding: 5px;
          border-radius: 2px;
          box-sizing: border-box;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            max-height: 90px;
            vertical-align: middle;
            object-fit: contain;
          }

          .box-btn {
            position: absolute;
            color: #fff;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.6);
            opacity: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: zoom-in;

            &:hover {
              opacity: 0.6;
            }
          }
        }
      }
    }
  }

  .article-comment-top-none {
    background: var(--td-bg-color-container);
    color: var(--td-text-color-primary);
    padding: 20px;
    border-radius: 10px;
  }

  .article-comment-form-main {
    background: var(--td-bg-color-container);
    margin-top: 20px;
    padding: 20px;
    border-radius: 10px;
  }
}

.article-comment-user-info {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 200px;
    height: 200px;
    border-radius: 5px;
  }

  .info-introduction {
    width: 200px;
    margin: 8px 0;
    word-wrap: break-wordl;
  }
}

.comment-breath {
  animation: commentBreath 1s ease-in-out infinite;
}

@keyframes commentBreath {
  0% {
    transform: scale(1);
    opacity: .8;
  }

  50% {
    transform: scale(1.02);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: .8;
  }
}
</style>
