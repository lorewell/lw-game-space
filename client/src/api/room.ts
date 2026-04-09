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
