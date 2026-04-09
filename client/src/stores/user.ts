import { defineStore } from 'pinia'
import type { UserType } from '@/types/common'

export const useUserStore = defineStore('user', {
  state: (): UserType => ({
    name: '',
    id: '',
    avatar: '',
    level: 1,
    sessionId: '',
  }),

  actions: {
    setUserInfo(info: Partial<UserType>) {
      Object.assign(this, info)
    }
  }
})
