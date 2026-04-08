<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useSystemStore } from './stores/system'
import { storeToRefs } from 'pinia'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { theme } from '@/config/system'

const route = useRoute()
const systemStore = useSystemStore()

const { loading, loadingTip } = storeToRefs(systemStore)
const layoutMap = {
  DefaultLayout
}
const layout = computed(() => layoutMap[route.meta?.layout] || DefaultLayout)
</script>

<template>
  <AConfigProvider :locale="zhCN" :theme="{ token: theme }">
    <component :is="layout" />
  </AConfigProvider>

  <Transition name="fade">
    <div v-if="loading" class="loading">
      <LoadingOutlined class="loading-icon"></LoadingOutlined>
      <div class="m-t-16">{{ loadingTip }}</div>
    </div>
  </Transition>
</template>

<style lang="less" scoped>
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
  color: @primary-color;

  .loading-icon {
    margin-top: 30vh;
    color: @primary-color;
    font-size: 30px;
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
