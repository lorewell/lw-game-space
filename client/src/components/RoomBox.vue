<script setup lang="ts">
import type { RoomState } from '@/types/common'

const props = defineProps<RoomState>()
</script>

<template>
  <div
    class="room-box relative overflow-hidden flex flex-col items-center p-6 rounded-xl cursor-pointer transition-all duration-300 group"
  >
    <!-- 背景装饰：磨砂质感与几何图形 -->
    <div class="absolute inset-0 bg-white/5 backdrop-blur-sm z-0"></div>
    <div
      class="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"
    ></div>

    <!-- 房间状态标识 -->
    <div class="absolute top-3 right-3 flex gap-1.5 z-10">
      <div
        v-for="i in 2"
        :key="i"
        class="w-2 h-2 rounded-full border border-white/20"
        :class="props.users[i - 1] ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-white/10'"
      ></div>
    </div>

    <!-- 房间名：更具设计力的排版 -->
    <div class="room-header w-full flex flex-col items-center mb-6 z-10">
      <span class="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Room Instance</span>
      <h3 class="room-name text-lg font-bold tracking-tight truncate w-full text-center">
        {{ props.roomName }}
      </h3>
    </div>

    <!-- 对战区：强调冲突感与空间 -->
    <div class="battle-arena relative flex items-center justify-between w-full px-2 py-4 z-10">
      <!-- 玩家1 -->
      <div
        class="player-node flex flex-col items-center gap-3 transition-transform group-hover:-translate-x-1"
      >
        <div class="avatar-wrapper relative">
          <div
            class="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-full opacity-0 group-hover:opacity-40 blur transition-opacity"
          ></div>
          <el-avatar
            :size="56"
            :src="props.users[0]?.avatar || undefined"
            class="relative border-2 border-white/10 bg-black/20"
          >
            {{ props.users[0]?.name?.charAt(0) || '?' }}
          </el-avatar>
        </div>
        <span
          class="player-identity text-[11px] font-medium opacity-70 group-hover:opacity-100 transition-opacity"
        >
          {{ props.users[0]?.name || 'OPEN SLOT' }}
        </span>
      </div>

      <!-- VS 核心装饰 -->
      <div class="vs-container relative flex flex-col items-center">
        <div
          class="vs-line w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"
        ></div>
        <div
          class="vs-badge absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 py-0.5 border border-white/20 rounded text-[10px] font-black italic tracking-widest leading-none"
        >
          VS
        </div>
      </div>

      <!-- 玩家2 -->
      <div
        class="player-node flex flex-col items-center gap-3 transition-transform group-hover:translate-x-1"
      >
        <div class="avatar-wrapper relative">
          <div
            class="absolute -inset-1 bg-gradient-to-tr from-accent to-primary rounded-full opacity-0 group-hover:opacity-40 blur transition-opacity"
          ></div>
          <el-avatar
            :size="56"
            :src="props.users[1]?.avatar || undefined"
            class="relative border-2 border-white/10 bg-black/20"
          >
            {{ props.users[1]?.name?.charAt(0) || '?' }}
          </el-avatar>
        </div>
        <span
          class="player-identity text-[11px] font-medium opacity-70 group-hover:opacity-100 transition-opacity"
        >
          {{ props.users[1]?.name || 'OPEN SLOT' }}
        </span>
      </div>
    </div>

    <!-- 底部：页脚风格的标签 -->
    <div class="mt-auto w-full pt-4 border-t border-white/5 flex items-center justify-between z-10">
      <span class="text-[10px] font-mono opacity-40"
        >#{{ props.roomId.split('_')[1] || '00' }}</span
      >
      <div
        class="game-tag px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold tracking-wider uppercase text-primary"
      >
        {{ props.gameName }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 24px -1px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: var(--el-color-primary-light-5);
    transform: translateY(-4px) scale(1.02);
    box-shadow:
      0 20px 40px -12px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(var(--el-color-primary-rgb), 0.1);
  }
}

.room-name {
  color: var(--el-text-color-primary);
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.vs-badge {
  color: var(--el-color-primary);
  box-shadow: 0 0 15px rgba(var(--el-color-primary-rgb), 0.3);
}

.game-tag {
  letter-spacing: 0.1em;
  transition: all 0.3s;

  .room-box:hover & {
    background: var(--el-color-primary);
    color: white;
    box-shadow: 0 0 10px var(--el-color-primary-light-3);
  }
}
</style>
