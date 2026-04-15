import { Router, Request, Response } from 'express'
import { ChatMessage } from '../models/ChatMessage'

const router = Router()

/**
 * GET /api/chat/hall
 * 获取大厅聊天历史消息
 * Query: limit=50, before=timestamp（分页查询）
 */
router.get('/hall', async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100)
  const before = req.query.before ? new Date(Number(req.query.before)) : new Date()

  try {
    const messages = await ChatMessage.find({
      type: 'hall',
      createdAt: { $lt: before }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // 返回按时间正序排列
    res.json({ code: 0, data: messages.reverse() })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取大厅消息失败', error: String(err) })
  }
})

/**
 * POST /api/chat/hall
 * 发送大厅聊天消息
 * Body: { userId, userName, content }
 */
router.post('/hall', async (req: Request, res: Response) => {
  const { userId, userName, content } = req.body as {
    userId: string
    userName: string
    content: string
  }

  if (!userId || !userName || !content) {
    res.status(400).json({ code: 400, message: '缺少必要参数' })
    return
  }

  const trimmedContent = String(content).trim().slice(0, 500)
  if (!trimmedContent) {
    res.status(400).json({ code: 400, message: '消息内容不能为空' })
    return
  }

  try {
    const message = await ChatMessage.create({
      userId,
      userName,
      content: trimmedContent,
      type: 'hall'
    })

    res.json({ code: 0, data: message })
  } catch (err) {
    res.status(500).json({ code: 500, message: '发送消息失败', error: String(err) })
  }
})

/**
 * 房间聊天接口暂未启用
 * GET  /api/chat/room/:roomId
 * POST /api/chat/room/:roomId
 */
// router.get('/room/:roomId', async (req: Request, res: Response) => { ... })
// router.post('/room/:roomId', async (req: Request, res: Response) => { ... })

export default router
