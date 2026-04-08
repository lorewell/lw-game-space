<script setup>
import { useCacheViewStore } from '@/stores/cacheView'
import routes from '@/router/dynamic/ai-bid'

const router = useRouter()
const route = useRoute()

const cacheViewStore = useCacheViewStore()

function getMenuItems(routes) {
  const menuItems = []

  const fillItems = (list) => {
    list.forEach((item) => {
      if (item.meta?.inNavbar) {
        menuItems.push({
          key: item.name,
          label: item.meta.title,
          title: item.meta.title,
          icon: item.meta?.icon
            ? h('span', {
                class: `iconfont ${item.meta.icon}`,
                style: 'font-size: 18px',
              })
            : null,
        })
      }

      if (item.children && item.children.length) {
        fillItems(item.children)
      }
    })
  }

  fillItems(routes)
  return menuItems
}

const sideBarMenuList = computed(() => {
  return getMenuItems(routes)
})

/**
 * 切换菜单
 * @param route
 */
const onMenuClick = async ({ item }) => {
  const targetRoute = item.originItemValue

  if (route.name === targetRoute.key) return

  if (targetRoute?.meta?.target) {
    const { href } = router.resolve({ name: targetRoute.key })
    window.open(href, targetRoute.meta.target)
    return
  }
  cacheViewStore.clearCacheView()
  router.push({ name: targetRoute.key })
}
</script>
<template>
  <ALayoutSider width="@sidebar-width" class="h-full">
    <AMenu
      :selected-keys="[route.name]"
      mode="inline"
      :items="sideBarMenuList"
      :style="{ height: '100%', borderRight: 0 }"
      @click="onMenuClick"
    ></AMenu>
  </ALayoutSider>
</template>
<style scoped lang="less">
:deep(.ant-menu) {
  width: @sidebar-width;

  .ant-menu-item {
    width: 208px;
    margin: 16px;
    padding: 13px 0;

    .ant-menu-title-content {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
    }
  }
}
</style>
