import { OverlayScrollbars } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'

/**
 * v-scrollbar 指令
 * 用法：
 *   <div v-scrollbar></div>
 *   <div v-scrollbar="{ scrollbars: { autoHide: 'scroll' } }"></div>
 */
export const vScrollbar = {
  mounted(el, binding) {
    const options = binding.value ?? {}
    const instance = OverlayScrollbars(el, {
      scrollbars: {
        autoHide: 'move',
        autoHideDelay: 500
      },
      ...options
    })
    el._osInstance = instance
  },
  updated(el, binding) {
    const instance = el._osInstance
    if (instance && binding.value && binding.oldValue !== binding.value) {
      instance.options(binding.value, true)
    }
  },
  beforeUnmount(el) {
    el._osInstance?.destroy()
    el._osInstance = null
  }
}

export default vScrollbar
