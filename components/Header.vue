<script setup lang="ts">
import { LogoGithubIcon, MailIcon, BugIcon, LogoWechatStrokeIcon, SunnyIcon, MoonIcon } from 'tdesign-icons-vue-next';
import { UseUserInfoStore, UseMessageStore, UseThemeStore } from 'stores'
import { generateTime } from '~/utils/globalFunc'

const userInfo = UseUserInfoStore().userInfo
const useMessage = UseMessageStore()
const themeStore = UseThemeStore()
const route = useRoute()
const themeModeV = ref('')

onMounted(() => {
  themeModeV.value = window.localStorage.getItem('theme-mode') ? 'dark' : 'light'
  themeStore.themeSet(themeModeV.value)
})

const themeModeChange = (v: any) => {
  if (v === 'dark') {
    document.documentElement.setAttribute('theme-mode', 'dark');
    window.localStorage.setItem('theme-mode', 'dark')
  } else {
    document.documentElement.removeAttribute('theme-mode');
    window.localStorage.removeItem('theme-mode')
  }
  themeStore.themeSet(v)
}

watch(() => route.path, (v) => {
  const el = document.getElementById('__nuxt')
  el && (el.scrollTop = 0);
})
</script>
<template>
  <div class="header">
    <div class="header-box">
      <img class="header-box-img" src="/favicon.png" />
      <h1 class="header-box-title">passerma博客</h1>
      <div class="header-box-link">
        <a href="https://github.com/passerma" target="_blank">
          <LogoGithubIcon />
        </a>
        <a href="mailto:admin@passerma.com">
          <MailIcon />
        </a>
        <a href="https://www.passerma.com/article/1/#comment-form" target="_blank">
          <BugIcon />
        </a>
        <t-popup placement="right" showArrow>
          <LogoWechatStrokeIcon />
          <template #content>
            <div class="header-box-link-wechat">
              <img src="https://www.passerma.com/down/passerma_wechat_all.png" />
            </div>
          </template>
        </t-popup>
      </div>
      <div :class="route.path == '/' ? 'header-box-page header-box-page-select' : 'header-box-page'">
        <NuxtLink to="/" class="header-box-page-link"> 首页 </NuxtLink>
      </div>
      <div :class="route.path.startsWith('/article') ? 'header-box-page header-box-page-select' : 'header-box-page'">
        <NuxtLink to="/article" class="header-box-page-link"> 文章 </NuxtLink>
      </div>
      <div
        :class="route.path.startsWith('/center') || route.path.startsWith('/login') ? 'header-box-page header-box-page-select' : 'header-box-page'">
        <NuxtLink v-if="userInfo.userName !== ''" to="/center">
          <t-badge class="header-box-page-img" :count="useMessage.message.messageNum" size="small">
            <img :src="userInfo.avatar" />
          </t-badge>
          <span class="header-box-page-name">{{ userInfo.userName }}</span>
        </NuxtLink>
        <NuxtLink v-else to="/login" class="header-box-page-link"> 登录 </NuxtLink>
      </div>
    </div>
    <div class="header-box-switch">
      <t-radio-group variant="default-filled" v-model="themeModeV" @change="themeModeChange">
        <t-radio-button value="light">
          <SunnyIcon />
        </t-radio-button>
        <t-radio-button value="dark">
          <MoonIcon />
        </t-radio-button>
      </t-radio-group>
    </div>
    <div class="header-box-link-copy">
      <a href="https://www.passerma.com">&copy;&nbsp;PASSERMA</a>
      <a href="https://beian.miit.gov.cn/" rel="noopener noreferrer" target="_blank">浙ICP备18045684号-2</a>
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011802001747" rel="noopener noreferrer"
        target="_blank">浙公网安备33011802001747号</a>
    </div>
    <div class="header-box-info">
      <span v-show="generateTime !== ''">构建时间: {{ generateTime }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header {
  width: 185px;
  height: 100%;
  padding-top: 50px;
  margin-right: 15px;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  flex-shrink: 0;
  position: relative;

  .header-box {
    width: 185px;
    max-height: 100%;
    background-color: var(--td-bg-color-container);
    position: fixed;
    top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    padding-top: 25px;

    .header-box-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .header-box-title {
      text-align: center;
      margin-top: 15px;
      font-family: "passerma-font";
      letter-spacing: 2px;
      font-size: 18px;
      color: var(--td-text-color-primary);
    }

    .header-box-link {
      height: 20px;
      line-height: 20px;
      margin: 8px 0 14px 0;

      .t-icon {
        font-size: 20px;
        color: var(--td-text-color-secondary);
        margin: 0 5px;
        cursor: pointer;

        &:hover {
          color: var(--td-text-color-primary);
        }
      }
    }

    .header-box-page {
      width: 100%;
      height: 45px;
      text-align: center;

      .header-box-page-img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }
      }

      .header-box-page-name {
        display: block;
        max-width: calc(~"100% - 45px");
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 10px;
        line-height: 44px;
      }

      a {
        color: var(--td-text-color-secondary);
        line-height: 44px;
        width: 100%;
        display: inline-block;
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }

      &:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      &-select {
        background-color: var(--td-brand-color-light);

        a {
          color: var(--td-brand-color);
        }
      }

      .header-box-page-link {
        font-family: "passerma-font";
        letter-spacing: 4px;
      }
    }
  }

  .header-box-link-copy {
    position: fixed;
    top: 440px;
    text-align: center;
    width: 185px;

    a {
      margin: 0 5px;
      color: var(--td-text-color-secondary);
      font-size: 12px;
      display: inline-block;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .header-box-switch {
    position: fixed;
    top: 405px;
    width: 185px;
    display: flex;
    align-items: center;
    justify-content: center;

    .t-icon {
      font-size: 20px;
      transform: translateY(-1px);
    }
  }

  .header-box-info {
    position: fixed;
    width: 185px;
    bottom: 5px;
    text-align: center;

    span {
      font-size: 20px;
      zoom: 0.5;
    }
  }
}

.header-box-link-wechat {
  width: 500px;

  img {
    width: 100%;
  }
}
</style>