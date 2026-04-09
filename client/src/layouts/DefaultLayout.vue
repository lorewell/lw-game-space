<script setup lang="ts">
import PageSide from './components/PageSide.vue'
</script>

<template>
  <el-container class="w-screen h-screen">
    <el-main v-scrollbar class="page-content">
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" />
      </RouterView>
    </el-main>

    <PageSide />
  </el-container>
</template>

<style lang="scss" scoped>
.page-content {
  width: calc(100% - 350px);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
