import { Router, Request, Response } from 'express'
import { Room } from '../models/Room'

const router = Router()

/**
 * GET /api/room
 * 获取所有房间列表（不含消息记录，减少传输量）
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.find({}, { messages: 0 }).sort({ createdAt: -1 })
    res.json({ code: 0, data: rooms })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取房间列表失败', error: String(err) })
  }
})

export default router
