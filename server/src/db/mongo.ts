import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lw-game-space'

export async function connectMongo(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB 连接成功:', MONGO_URI)
  } catch (err) {
    console.error('❌ MongoDB 连接失败:', err)
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB 断开连接')
  })

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB 重新连接')
  })
}

export const db = mongoose.connection
export default mongoose
