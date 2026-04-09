import { Router, Request, Response } from 'express'
import { User } from '../models/User'

const router = Router()

/**
 * GET /api/user/:userId
 * 根据 userId 获取用户信息，若不存在则自动创建
 */
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    let user = await User.findOne({ userId })
    if (!user) {
      user = await User.create({ userId, name: `游客_${userId.slice(-6)}` })
    }
    res.json({ code: 0, data: user })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取用户信息失败', error: String(err) })
  }
})

/**
 * PUT /api/user/:userId
 * 更新用户信息（name、avatar、level），仅允许更新白名单字段
 */
router.put('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { name, avatar, level } = req.body as { name?: string; avatar?: string; level?: number }

  const update: Record<string, unknown> = {}
  if (name   !== undefined) update.name   = String(name).slice(0, 20)
  if (avatar !== undefined) update.avatar = String(avatar).slice(0, 200)
  if (level  !== undefined) update.level  = Math.max(1, Number(level))

  if (Object.keys(update).length === 0) {
    res.status(400).json({ code: 400, message: '没有可更新的字段' })
    return
  }

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true }
    )
    res.json({ code: 0, data: user })
  } catch (err) {
    res.status(500).json({ code: 500, message: '更新用户信息失败', error: String(err) })
  }
})

export default router
