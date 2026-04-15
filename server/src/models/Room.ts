import { Schema, model, Document } from 'mongoose'

// 用户信息子文档
const RoomUserSchema = new Schema(
  {
    userId:   { type: String, required: true },
    name:     { type: String, required: true },
    avatar:   { type: String, default: '' },
    level:    { type: Number, default: 1 },
  },
  { _id: false }
)

export interface IRoomUser {
  userId: string
  name: string
  avatar: string
  level: number
}

export interface IRoom extends Document {
  roomId: string
  roomName: string
  gameName: string
  users: IRoomUser[]       // 当前房间内用户的详细信息列表
  createdAt: Date
  updatedAt: Date
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId:   { type: String, required: true, unique: true, index: true },
    roomName: { type: String, required: true, default: '新房间' },
    gameName: { type: String, required: true, default: '' },
    users:    { type: [RoomUserSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const Room = model<IRoom>('Room', RoomSchema)
