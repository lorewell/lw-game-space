import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', {
  state: () => ({
    loading: false,
    loadingTip: '加载中...'
  }),

  actions: {
    setLoading(loading, tip = '加载中') {
      this.loading = loading
      this.loadingTip = tip + '...'
    }
  }
})
