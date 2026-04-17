<script setup lang="ts">
import PageSide from './components/PageSide.vue'
</script>

<template>
  <el-container class="layout-container relative w-screen h-screen overflow-hidden">
    <!-- 动态背景 -->
    <div class="bg-decorations fixed inset-0 pointer-events-none overflow-hidden z-0">
      <!-- 光球1 - 紫 -->
      <div class="bg-orb bg-orb--1" />
      <!-- 光球2 - 青 -->
      <div class="bg-orb bg-orb--2" />
      <!-- 光球3 - 粉 -->
      <div class="bg-orb bg-orb--3" />
      <!-- 网格背景 -->
      <div class="bg-grid" />
      <!-- 噪点纹理 -->
      <div class="bg-noise" />
    </div>

    <!-- 主内容区 -->
    <el-main class="page-content relative z-1">
      <RouterView v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </RouterView>
    </el-main>

    <!-- 侧边栏 -->
    <PageSide />
  </el-container>
</template>

<style scoped>
.layout-container {
  background: var(--bg-primary);
}

/* ========== 动态背景 ========== */
.bg-decorations {
  transition: background 0.3s ease;
}

[data-theme='dark'] .bg-decorations {
  background: radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(34, 211, 238, 0.06) 0%, transparent 50%);
}

[data-theme='light'] .bg-decorations {
  background: radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(34, 211, 238, 0.03) 0%, transparent 50%);
}

/* 光球 */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

[data-theme='light'] .bg-orb {
  opacity: 0.25;
}

.bg-orb--1 {
  width: 500px;
  height: 500px;
  background: var(--accent-primary);
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.bg-orb--2 {
  width: 400px;
  height: 400px;
  background: var(--accent-secondary);
  bottom: -100px;
  right: 25%;
  animation-delay: -7s;
}

.bg-orb--3 {
  width: 300px;
  height: 300px;
  background: var(--accent-tertiary);
  top: 40%;
  right: -50px;
  animation-delay: -14s;
  opacity: 0.3;
}

/* 网格背景 */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
}

/* 噪点纹理 */
.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, 30px) scale(1.05);
  }
  50% {
    transform: translate(0, 50px) scale(1);
  }
  75% {
    transform: translate(-30px, 30px) scale(0.95);
  }
}

/* 主内容区 */
.page-content {
  width: calc(100% - 320px);
  padding: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
}

/* 页面过渡 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 1200px) {
  .page-content {
    width: 100%;
  }
}
</style>
