<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useSystemStore } from './stores/system'
import { storeToRefs } from 'pinia'
import { Loading } from '@element-plus/icons-vue'

const route = useRoute()
const systemStore = useSystemStore()

const { loading, loadingTip } = storeToRefs(systemStore)
const layoutMap: Record<string, typeof DefaultLayout> = {
  DefaultLayout
}
const layout = computed(() => layoutMap[route.meta?.layout as string] ?? DefaultLayout)
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <component :is="layout" />
  </ElConfigProvider>

  <Transition name="fade">
    <div v-if="loading" class="loading">
      <ElIcon class="loading-icon" :size="30"><Loading /></ElIcon>
      <div class="m-t-16">{{ loadingTip }}</div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
  color: var(--el-color-primary);

  .loading-icon {
    margin-top: 30vh;
    color: var(--el-color-primary);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
