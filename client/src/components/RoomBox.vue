<script setup lang="ts">
import type { RoomState } from '@/types/common'

const props = defineProps<RoomState>()
</script>

<template>
  <div
    class="room-box flex flex-col items-center p-12 rounded-4 cursor-pointer gap-8 w-full h-full"
  >
    <!-- 房间名 -->
    <div class="room-name font-13 font-medium w-full truncate text-center">
      {{ props.roomName }}
    </div>

    <!-- 对战区 -->
    <div class="battle-area flex items-center justify-center gap-10 w-full">
      <!-- 玩家1 -->
      <div class="player-slot flex flex-col items-center gap-4">
        <el-avatar :size="48" :src="props.users[0]?.avatar || undefined" class="player-avatar">
          {{ props.users[0]?.name?.charAt(0) || '?' }}
        </el-avatar>
        <span class="player-name font-11 truncate w-52 text-center">
          {{ props.users[0]?.name || '等待加入' }}
        </span>
      </div>

      <!-- VS -->
      <div class="font-16 font-bold">VS</div>

      <!-- 玩家2 -->
      <div class="player-slot flex flex-col items-center gap-4">
        <el-avatar :size="48" :src="props.users[1]?.avatar || undefined" class="player-avatar">
          {{ props.users[1]?.name?.charAt(0) || '?' }}
        </el-avatar>
        <span class="player-name font-11 truncate w-52 text-center">
          {{ props.users[1]?.name || '等待加入' }}
        </span>
      </div>
    </div>

    <!-- 游戏名称 -->
    <div class="game-status font-12 flex items-center justify-between">
      <div>{{ props.users.length - 2 > 0 ? props.users.length - 2 + '正在观看' : '' }}</div>

      <div class="px-6 py-2 rounded-4 font-11">
        {{ props.gameName ? props.gameName : '暂无游戏' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room-box {
  border: 1px solid var(--el-border-color);
  background: var(--el-fill-color-blank);
  transition: all 0.2s;

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.room-name {
  color: var(--el-text-color-primary);
}

.player-avatar {
  border: 2px solid var(--el-border-color-light);
}

.player-slot .player-name {
  color: var(--el-text-color-secondary);
}
</style>
