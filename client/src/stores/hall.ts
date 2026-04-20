import { defineStore } from 'pinia'
import * as Colyseus from 'colyseus.js'
import { useUserStore } from './user'
import { getHallMessages } from '@/api/chat'
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
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000'
      client = new Colyseus.Client(wsUrl)

      try {
        room = await client.joinOrCreate('hall_room', {
          id: userStore.id,
          name: userStore.name || undefined,
          avatar: userStore.avatar || undefined,
          level: userStore.level,
        })

        this.connected = true

        // 从 REST API 加载历史消息（数据库持久化的）
        try {
          const res = await getHallMessages(50)
          if (res.code === 0 && res.data.length > 0) {
            this.messages = res.data.map((msg: any) => ({
              sessionId: msg.userId,
              userName: msg.userName,
              content: msg.content,
              timestamp: new Date(msg.createdAt).getTime()
            }))
          }
        } catch (e) {
          console.warn('[HallRoom] 加载历史消息失败，使用实时消息', e)
        }

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

        // 监听实时新消息（补充数据库加载的消息）
        room.state.messages.onAdd((msg: any) => {
          // 避免重复添加（如果消息已从数据库加载过）
          const exists = this.messages.some(m => m.timestamp === msg.timestamp)
          if (!exists) {
            this.messages.push({ ...msg })
          }
          if (this.messages.length > 100) {
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
