import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'
import type { DirectiveBinding } from 'vue'

interface ScrollbarElement extends HTMLElement {
  _osInstance?: ReturnType<typeof OverlayScrollbars>
}

/**
 * v-scrollbar 指令
 * 用法：
 *   <div v-scrollbar></div>
 *   <div v-scrollbar="{ scrollbars: { autoHide: 'scroll' } }"></div>
 */
export const vScrollbar = {
  mounted(el: ScrollbarElement, binding: DirectiveBinding<PartialOptions>) {
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
  updated(el: ScrollbarElement, binding: DirectiveBinding<PartialOptions>) {
    const instance = el._osInstance
    if (instance && binding.value && binding.oldValue !== binding.value) {
      instance.options(binding.value, true)
    }
  },
  beforeUnmount(el: ScrollbarElement) {
    el._osInstance?.destroy()
    el._osInstance = undefined
  }
}

export default vScrollbar
