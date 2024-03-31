import { defineNuxtPlugin } from '#app'
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(TDesign)
})
