import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRoomList, joinRoom as apiJoinRoom, leaveRoom as apiLeaveRoom } from '@/api/room'
import type { RoomState } from '@/types/common'

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: ref<RoomState[]>([]),
    currentRoomId: ref<string | null>(null),
    loading: ref(false),
  }),

  actions: {
    /** 刷新房间列表 */
    async fetchRooms() {
      this.loading = true
      try {
        const res = await getRoomList()
        if (res.code === 0) {
          this.rooms = res.data
        }
      } catch (e) {
        console.error('[RoomStore] 获取房间列表失败', e)
      } finally {
        this.loading = false
      }
    },

    /** 加入房间 */
    async joinRoom(roomId: string, userInfo: { userId: string; name: string; avatar?: string; level?: number }) {
      try {
        const res = await apiJoinRoom(roomId, userInfo)
        if (res.code === 0) {
          // 更新房间列表中对应房间的信息
          const index = this.rooms.findIndex(r => r.roomId === roomId)
          if (index !== -1) {
            this.rooms[index] = res.data
          }
          this.currentRoomId = roomId
          return { success: true, room: res.data }
        }
        return { success: false, message: res.message || '加入房间失败' }
      } catch (e: any) {
        return { success: false, message: e?.response?.data?.message || '加入房间失败' }
      }
    },

    /** 离开房间 */
    async leaveRoom(roomId: string, userId: string) {
      try {
        const res = await apiLeaveRoom(roomId, userId)
        if (res.code === 0) {
          // 更新房间列表中对应房间的信息
          const index = this.rooms.findIndex(r => r.roomId === roomId)
          if (index !== -1) {
            this.rooms[index] = res.data
          }
          if (this.currentRoomId === roomId) {
            this.currentRoomId = null
          }
          return { success: true }
        }
        return { success: false, message: res.message || '离开房间失败' }
      } catch (e: any) {
        return { success: false, message: e?.response?.data?.message || '离开房间失败' }
      }
    },
  },
})
