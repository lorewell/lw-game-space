import { Router, Request, Response } from 'express'
import { Room } from '../models/Room'

const router = Router()

/**
 * GET /api/room
 * 获取所有房间列表
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 })
    res.json({ code: 0, data: rooms })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取房间列表失败', error: String(err) })
  }
})

/**
 * POST /api/room/:roomId/join
 * 加入房间
 * Body: { userId, name, avatar, level }
 */
router.post('/:roomId/join', async (req: Request, res: Response) => {
  const { roomId } = req.params
  const { userId, name, avatar, level } = req.body as {
    userId: string
    name: string
    avatar?: string
    level?: number
  }

  if (!userId || !name) {
    res.status(400).json({ code: 400, message: '缺少必要参数 userId, name' })
    return
  }

  try {
    const room = await Room.findOne({ roomId })
    if (!room) {
      res.status(404).json({ code: 404, message: '房间不存在' })
      return
    }

    // 检查是否已在房间中
    if (room.users.some(u => u.userId === userId)) {
      res.json({ code: 0, data: room, message: '已在房间中' })
      return
    }

    // 检查房间是否已满（最多2人）
    if (room.users.length >= 2) {
      res.status(400).json({ code: 400, message: '房间已满' })
      return
    }

    // 添加用户到房间
    room.users.push({
      userId,
      name,
      avatar: avatar || '',
      level: level || 1
    })

    await room.save()

    res.json({ code: 0, data: room })
  } catch (err) {
    res.status(500).json({ code: 500, message: '加入房间失败', error: String(err) })
  }
})

/**
 * POST /api/room/:roomId/leave
 * 离开房间
 * Body: { userId }
 */
router.post('/:roomId/leave', async (req: Request, res: Response) => {
  const { roomId } = req.params
  const { userId } = req.body as { userId: string }

  if (!userId) {
    res.status(400).json({ code: 400, message: '缺少必要参数 userId' })
    return
  }

  try {
    const room = await Room.findOne({ roomId })
    if (!room) {
      res.status(404).json({ code: 404, message: '房间不存在' })
      return
    }

    // 移除用户
    const beforeLength = room.users.length
    room.users = room.users.filter(u => u.userId !== userId)

    if (room.users.length === beforeLength) {
      res.status(400).json({ code: 400, message: '用户不在该房间中' })
      return
    }

    await room.save()

    res.json({ code: 0, data: room })
  } catch (err) {
    res.status(500).json({ code: 500, message: '离开房间失败', error: String(err) })
  }
})

/**
 * GET /api/room/:roomId
 * 获取指定房间信息
 */
router.get('/:roomId', async (req: Request, res: Response) => {
  const { roomId } = req.params

  try {
    const room = await Room.findOne({ roomId })
    if (!room) {
      res.status(404).json({ code: 404, message: '房间不存在' })
      return
    }
    res.json({ code: 0, data: room })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取房间信息失败', error: String(err) })
  }
})

export default router
