import { Room } from '../models/Room'

const INITIAL_ROOMS = [
  { roomId: '1',  roomName: '房间 1',  gameName: '对战游戏' },
  { roomId: '2',  roomName: '房间 2',  gameName: '对战游戏' },
  { roomId: '3',  roomName: '房间 3',  gameName: '对战游戏' },
  { roomId: '4',  roomName: '房间 4',  gameName: '对战游戏' },
  { roomId: '5',  roomName: '房间 5',  gameName: '对战游戏' },
  { roomId: '6',  roomName: '房间 6',  gameName: '对战游戏' },
  { roomId: '7',  roomName: '房间 7',  gameName: '对战游戏' },
  { roomId: '8',  roomName: '房间 8',  gameName: '对战游戏' },
  { roomId: '9',  roomName: '房间 9',  gameName: '对战游戏' },
]

export async function seedRooms(): Promise<void> {
  try {
    const count = await Room.countDocuments()
    if (count > 0) {
      console.log('🟡 房间数据已存在，跳过初始化')
      return
    }

    await Room.insertMany(INITIAL_ROOMS)
    console.log('✅ 已初始化 9 个固定房间')
  } catch (err) {
    console.error('❌ 房间初始化失败:', err)
  }
}
