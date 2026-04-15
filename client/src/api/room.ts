import request from './request'
import type { RoomState } from '@/types/common'

interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

/**
 * 获取所有房间列表
 */
export function getRoomList() {
  return request.get<never, ApiResponse<RoomState[]>>('/api/room')
}

/**
 * 获取指定房间信息
 */
export function getRoomInfo(roomId: string) {
  return request.get<never, ApiResponse<RoomState>>(`/api/room/${roomId}`)
}

/**
 * 加入房间
 * @param roomId 房间ID
 * @param userInfo 用户信息
 */
export function joinRoom(roomId: string, userInfo: { userId: string; name: string; avatar?: string; level?: number }) {
  return request.post<never, ApiResponse<RoomState>>(`/api/room/${roomId}/join`, userInfo)
}

/**
 * 离开房间
 * @param roomId 房间ID
 * @param userId 用户ID
 */
export function leaveRoom(roomId: string, userId: string) {
  return request.post<never, ApiResponse<RoomState>>(`/api/room/${roomId}/leave`, { userId })
}
