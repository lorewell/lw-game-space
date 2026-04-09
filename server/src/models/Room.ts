import { Schema, model, Document } from 'mongoose'

// 嵌入式子文档：聊天消息
const ChatMessageSchema = new Schema(
  {
    sessionId: { type: String, required: true },
    userName:  { type: String, required: true },
    content:   { type: String, required: true, maxlength: 200 },
    timestamp: { type: Number, required: true },
  },
  { _id: false }  // 消息作为嵌入文档，无需单独 _id
)

export interface IChatMessage {
  sessionId: string
  userName: string
  content: string
  timestamp: number
}

export interface IRoom extends Document {
  roomId: string
  roomName: string
  gameName: string
  userIds: string[]        // 当前房间内用户的 userId 列表
  messages: IChatMessage[]
  createdAt: Date
  updatedAt: Date
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId:   { type: String, required: true, unique: true, index: true },
    roomName: { type: String, required: true, default: '新房间' },
    gameName: { type: String, required: true, default: '' },
    userIds:  { type: [String], default: [] },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const Room = model<IRoom>('Room', RoomSchema)
