// ==================== User ====================
export interface UserType {
  name: string
  id: string
  sessionId: string
  avatar?: string
  level?: number
}

// ==================== System ====================
export interface SystemState {
  theme: 'light' | 'dark'
  loading: boolean
  loadingTip: string
  newSpaceNotice: string
  newMessage: string
  newUpdateNotice: string
}

// ==================== Hall ====================
export interface ChatMessage {
  sessionId: string
  userName: string
  content: string
  timestamp: number
}

export interface HallState {
  connected: boolean
  onlineUsers: UserType[]
  messages: ChatMessage[]
}

// ==================== Room ====================
export interface RoomUser {
  userId: string
  name: string
  avatar: string
  level: number
}

export interface RoomState {
  roomId: string
  roomName: string
  gameName: string
  users: RoomUser[]
}
