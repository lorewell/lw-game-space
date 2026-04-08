<script setup>
import { computed } from 'vue'
import { useCacheViewStore } from '@/stores/cacheView'
import PageSide from './components/PageSide.vue'

const cacheViewStore = useCacheViewStore()
const cachedViews = computed(() => cacheViewStore.cachedViews)
</script>

<template>
  <ALayout class="min-w-[1536px]" style="min-height: 100vh">
    <ALayout class="page-body">
      <PageSide />

      <ALayoutContent v-scrollbar class="page-content">
        <RouterView v-slot="{ Component, route }">
          <KeepAlive :include="cachedViews">
            <component :is="Component" :key="route.fullPath" />
          </KeepAlive>
        </RouterView>
      </ALayoutContent>
    </ALayout>
  </ALayout>
</template>

<style lang="less" scoped>
.page-body {
  height: calc(100vh - @navbar-height);
  margin-top: @navbar-height;

  .page-content {
    padding: 24px;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
