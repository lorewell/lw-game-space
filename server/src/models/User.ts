import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  userId: string      // 对应前端 localStorage 中的持久化 ID
  name: string
  avatar: string
  level: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name:   { type: String, required: true, default: '游客' },
    avatar: { type: String, default: '' },
    level:  { type: Number, default: 1, min: 1 },
  },
  {
    timestamps: true,   // 自动维护 createdAt / updatedAt
    versionKey: false,
  }
)

export const User = model<IUser>('User', UserSchema)
