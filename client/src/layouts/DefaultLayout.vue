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

    <PageSide class="w-20%" />
  </el-container>
</template>

<style lang="scss" scoped>
.page-content {
  width: 80%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
