import { defineStore } from 'pinia'
import type { SystemState } from '@/types/common'

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    loading: false,
    loadingTip: '加载中...',

    newSpaceNotice: '',
    newMessage: '',
    newUpdateNotice: '',
  }),

  actions: {
    setLoading(loading: boolean, tip: string = '加载中') {
      this.loading = loading
      this.loadingTip = tip + '...'
    }
  }
})
