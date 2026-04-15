import request from './request'

/**
 * 获取大厅聊天历史消息
 * @param limit 消息数量，默认 50
 * @param before 可选的时间戳，用于分页查询
 */
export function getHallMessages(limit = 50, before?: number) {
  const params: Record<string, string | number> = { limit }
  if (before) params.before = before
  return request.get('/api/chat/hall', { params })
}

/**
 * 发送大厅聊天消息
 * @param userId 用户ID
 * @param userName 用户名
 * @param content 消息内容
 */
export function sendHallMessage(userId: string, userName: string, content: string) {
  return request.post('/api/chat/hall', { userId, userName, content })
}

/**
 * 获取房间聊天历史消息（暂未使用）
 * @deprecated 房间聊天功能暂未启用
 */
// export function getRoomMessages(roomId: string, limit = 50, before?: number) {
//   const params: Record<string, string | number> = { limit }
//   if (before) params.before = before
//   return request.get(`/api/chat/room/${roomId}`, { params })
// }

/**
 * 在房间发送聊天消息（暂未使用）
 * @deprecated 房间聊天功能暂未启用
 */
// export function sendRoomMessage(roomId: string, userId: string, userName: string, content: string) {
//   return request.post(`/api/chat/room/${roomId}`, { userId, userName, content })
// }
