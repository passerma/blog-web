// https://nuxt.com/docs/api/configuration/nuxt-config

const dayjs = require('dayjs')

export default defineNuxtConfig({
  app: {
    head: {
      title: 'passerma博客',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: 'passerma博客,马小葱博客,Power by passerma,致力于分享前端，后端各类知识,欢迎大家关注' },
        { name: 'keywords', content: '马小葱,passerma,博客,前端,后端,全栈' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        { rel: 'stylesheet', href: '/index.css' }
      ],
      script: [
        { src: '/theme.js' },
        { src: "/baidu.js" },
        { src: "/md_font.js" }
      ]
    },
    // pageTransition: { name: 'page', mode: 'out-in' }
  },
  alias: {
    "utils": `${__dirname}/utils`,
    "stores": `${__dirname}/stores`
  },
  typescript: {
    tsConfig: {
      include: [
        `${__dirname}/node_modules/tdesign-vue-next/global.d.ts`,
        `${__dirname}/types/index.d.ts`
      ]
    }
  },
  devServer: {
    port: 4001
  },
  vite: {
    server: {
      proxy: {
        '/api/': {
          target: 'http://127.0.0.1:4000',
          rewrite(path: string) {
            return path.replace(/^\/api\//, '')
          },
        },
        '/img/': 'http://127.0.0.1:4002',
        '/cdn.nlark.com/': 'http://127.0.0.1:4003'
      }
    },
    define: {
      'process.env.generate_time': JSON.stringify(process.env.generate_time || dayjs().format('YYYY-MM-DD HH:mm:ss')),
    }
  },
  experimental: {
    payloadExtraction: false,
  }
})
