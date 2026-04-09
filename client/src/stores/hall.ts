import { defineStore } from 'pinia'
import * as Colyseus from 'colyseus.js'
import { useUserStore } from './user'
import type { HallState } from '@/types/common'

let client: Colyseus.Client | null = null
let room: Colyseus.Room | null = null

export const useHallStore = defineStore('hall', {
  state: (): HallState => ({
    connected: false,
    onlineUsers: [],
    messages: [],
  }),

  actions: {
    async connect() {
      if (room) return

      const userStore = useUserStore()
      client = new Colyseus.Client('ws://localhost:3000')

      try {
        room = await client.joinOrCreate('hall_room', {
          id: userStore.id, // 传递持久化的 userId
          name: userStore.name || undefined,
          avatar: userStore.avatar || undefined,
          level: userStore.level,
        })

        this.connected = true

        // 初始化在线用户列表
        room.state.users.forEach((user: any) => {
          this.onlineUsers.push({ ...user })
        })

        // 监听用户加入
        room.state.users.onAdd((user: any, key: string) => {
          this.onlineUsers.push({ ...user })
        })

        // 监听用户离开
        room.state.users.onRemove((user: any, key: string) => {
          this.onlineUsers = this.onlineUsers.filter(u => u.sessionId !== key)
        })

        // 初始化历史消息
        room.state.messages.forEach((msg: any) => {
          this.messages.push({ ...msg })
        })

        // 监听新消息
        room.state.messages.onAdd((msg: any) => {
          this.messages.push({ ...msg })
          if (this.messages.length > 50) {
            this.messages.shift()
          }
        })

        room.onLeave(() => {
          this.connected = false
          this.onlineUsers = []
          room = null
        })

        room.onError((code: number, message?: string) => {
          console.error('[HallRoom] 连接错误:', code, message)
          this.connected = false
        })
      } catch (e) {
        console.error('[HallRoom] 加入失败:', e)
        this.connected = false
      }
    },

    sendMessage(content: string) {
      if (!room || !content.trim()) return
      room.send('chat', { content })
    },

    disconnect() {
      room?.leave()
      room = null
      client = null
      this.connected = false
      this.onlineUsers = []
      this.messages = []
    },
  },
})
