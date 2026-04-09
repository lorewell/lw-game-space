import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 5) {
      console.error('❌ Redis 重连次数超限，放弃重连')
      return null
    }
    return Math.min(times * 500, 3000)
  },
})

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect()
    console.log('✅ Redis 连接成功:', REDIS_URL)
  } catch (err) {
    console.error('❌ Redis 连接失败:', err)
    process.exit(1)
  }

  redis.on('close', () => {
    console.warn('⚠️  Redis 连接已关闭')
  })

  redis.on('reconnecting', () => {
    console.log('🔄 Redis 重连中...')
  })
}

export default redis
