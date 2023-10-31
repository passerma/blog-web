<script setup lang="ts">
import Login from './loginCmpt.vue'
import { UseUserInfoStore } from 'stores';

const userInfo = UseUserInfoStore();
const router = useRouter()

watch(() => userInfo.userInfo.userId, (v) => {
  if (v) {
    router.push('/center')
  }
})
</script>

<template>
  <Login />
</template>