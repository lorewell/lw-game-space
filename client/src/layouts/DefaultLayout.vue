<script setup lang="ts">
import PageSide from './components/PageSide.vue'
</script>

<template>
  <el-container class="relative w-screen h-screen overflow-hidden">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="bg-orb bg-orb--1"></div>
      <div class="bg-orb bg-orb--2"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 主内容区 -->
    <el-main class="page-content">
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" />
      </RouterView>
    </el-main>

    <!-- 侧边栏 -->
    <PageSide />
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  background: var(--bg-primary);
}

// 背景装饰
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;

  &--1 {
    width: 400px;
    height: 400px;
    background: var(--accent-primary);
    top: -100px;
    left: -100px;
    animation: float 20s ease-in-out infinite;
  }

  &--2 {
    width: 300px;
    height: 300px;
    background: var(--accent-secondary);
    bottom: -50px;
    right: 20%;
    animation: float 15s ease-in-out infinite reverse;
  }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(30px, 30px);
  }
  50% {
    transform: translate(0, 50px);
  }
  75% {
    transform: translate(-30px, 30px);
  }
}

// 主内容区
.page-content {
  position: relative;
  z-index: 1;
  width: calc(100% - 340px);
  padding: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
}
</style>
