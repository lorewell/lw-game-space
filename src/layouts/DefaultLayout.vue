<script setup lang="ts">
import PageSide from './components/PageSide.vue'
</script>

<template>
  <el-container class="min-w-[1536px]" style="min-height: 100vh">
    <PageSide />

    <el-main v-scrollbar class="page-content">
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" />
      </RouterView>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.page-content {
  padding: 24px;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
