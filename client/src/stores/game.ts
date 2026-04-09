import { defineStore } from 'pinia'
import * as Colyseus from 'colyseus.js'
import { useUserStore } from './user'

interface GameState {
  connected: boolean
  roomId: string
  players: { sessionId: string; name: string; ready: boolean }[]
  status: 'waiting' | 'playing' | 'finished'
}

let client: Colyseus.Client | null = null
let room: Colyseus.Room | null = null

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    connected: false,
    roomId: '',
    players: [],
    status: 'waiting',
  }),

  actions: {
    async join(roomId: string) {
      if (room) await this.leave()

      const userStore = useUserStore()
      client = new Colyseus.Client('ws://localhost:3000')

      try {
        room = await client.joinOrCreate('game_room', {
          roomId,
          name: userStore.name || undefined,
          avatar: userStore.avatar || undefined,
        })

        this.connected = true
        this.roomId = roomId

        // 初始化玩家列表
        room.state.players.forEach((p: any, key: string) => {
          this.players.push({ sessionId: key, name: p.name, ready: p.ready })
        })
        this.status = room.state.status

        // 监听玩家加入
        room.state.players.onAdd((p: any, key: string) => {
          this.players.push({ sessionId: key, name: p.name, ready: p.ready })
        })

        // 监听玩家离开
        room.state.players.onRemove((_: any, key: string) => {
          this.players = this.players.filter(p => p.sessionId !== key)
        })

        // 监听状态变化
        room.state.onChange(() => {
          this.status = room!.state.status
        })

        room.onLeave(() => {
          this.connected = false
          this.players = []
          room = null
        })

        room.onError((code: number, message?: string) => {
          console.error('[GameRoom] 错误:', code, message)
          this.connected = false
        })
      } catch (e) {
        console.error('[GameRoom] 加入失败:', e)
        this.connected = false
        throw e
      }
    },

    async leave() {
      if (room) {
        await room.leave()
        room = null
      }
      this.connected = false
      this.players = []
      this.roomId = ''
      this.status = 'waiting'
    },

    sendReady() {
      room?.send('ready', {})
    },
  },
})
