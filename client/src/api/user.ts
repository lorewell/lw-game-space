import request from './request'
import type { UserType } from '@/types/common'

interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

/**
 * 根据 userId 获取用户信息（不存在则自动创建）
 */
export function getUserInfo(userId: string) {
  return request.get<never, ApiResponse<UserType>>(`/api/user/${userId}`)
}

/**
 * 更新用户信息
 */
export function updateUserInfo(userId: string, payload: Partial<Pick<UserType, 'name' | 'avatar' | 'level'>>) {
  return request.put<never, ApiResponse<UserType>>(`/api/user/${userId}`, payload)
}
