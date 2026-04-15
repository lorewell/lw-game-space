import { Schema, model, Document } from 'mongoose'

export interface IChatMessage extends Document {
  userId: string        // 发送者用户ID
  userName: string      // 发送者用户名（冗余存储便于查询）
  content: string       // 消息内容
  type: 'hall' | 'room' // 消息类型：大厅聊天 or 房间聊天
  roomId?: string       // 房间ID（仅 room 类型需要）
  createdAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId:   { type: String, required: true, index: true },
    userName: { type: String, required: true },
    content:  { type: String, required: true, maxlength: 500 },
    type:     { type: String, enum: ['hall', 'room'], default: 'hall' },
    roomId:   { type: String, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// 复合索引：大厅消息按时间倒序
ChatMessageSchema.index({ type: 1, createdAt: -1 })
// 复合索引：房间消息按房间和时间
ChatMessageSchema.index({ roomId: 1, createdAt: -1 })

export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema)
