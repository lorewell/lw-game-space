<script setup lang="ts">
import type { RoomState, RoomUser } from '@/types/common'

const props = defineProps<RoomState>()

// 判断房间状态
const isWaiting = props.users.length === 0
const isFull = props.users.length >= 2
const hasOnePlayer = props.users.length === 1

// 获取玩家信息（兼容两种类型）
const getPlayerName = (user?: RoomUser) => user?.name || '等待加入'
const getPlayerLevel = (user?: RoomUser) => user?.level || 1
const getPlayerAvatar = (user?: RoomUser) => user?.avatar
</script>

<template>
  <div
    class="room-box group relative flex flex-col h-full p-4 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
    :class="{
      'room-box--waiting': isWaiting,
      'room-box--ready': hasOnePlayer,
      'room-box--full': isFull
    }"
  >
    <!-- 背景光效 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="room-glow absolute w-40 h-40 rounded-full transition-opacity duration-500" />
      <div class="corner-accent corner-accent--tl" />
      <div class="corner-accent corner-accent--tr" />
      <div class="corner-accent corner-accent--bl" />
      <div class="corner-accent corner-accent--br" />
    </div>

    <!-- 顶部装饰 -->
    <div class="relative flex items-center justify-center gap-3 mb-3 z-1">
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <div class="w-2 h-2 rotate-45 bg-accent-primary shadow-[0_0_8px_var(--accent-glow)]" />
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>

    <!-- 房间头部 -->
    <div class="relative flex items-center justify-between mb-3 z-1">
      <h3 class="text-base font-semibold text-text">{{ props.roomName }}</h3>
      <div class="status-badge" :class="{
        'status-badge--waiting': isWaiting,
        'status-badge--ready': hasOnePlayer,
        'status-badge--full': isFull
      }">
        <span class="status-dot" />
        <span class="text-xs font-medium">
          {{ isWaiting ? '等待中' : hasOnePlayer ? '准备中' : '对战中' }}
        </span>
      </div>
    </div>

    <!-- 对战区域 -->
    <div class="relative flex-1 flex items-center justify-between gap-2 z-1 min-h-0">
      <!-- 玩家1 -->
      <div class="player-slot player-slot--left flex flex-col items-center gap-1.5 flex-1">
        <div class="relative">
          <div class="avatar-glow absolute inset-0 rounded-full scale-110" />
          <el-avatar
            :size="56"
            :src="getPlayerAvatar(props.users[0])"
            class="player-avatar border-2 transition-all duration-300"
          >
            {{ props.users[0]?.name?.charAt(0) || '?' }}
          </el-avatar>
          <div v-if="!props.users[0]" class="avatar-placeholder absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-border">
            <span class="text-xl text-text-muted font-light">+</span>
          </div>
        </div>
        <span class="player-name text-xs font-medium text-text max-w-16 truncate">
          {{ getPlayerName(props.users[0]) }}
        </span>
        <span v-if="props.users[0]" class="player-level text-xs px-1.5 py-0.5 rounded-md bg-warning/10 text-warning">
          Lv.{{ getPlayerLevel(props.users[0]) }}
        </span>
      </div>

      <!-- VS 区域 -->
      <div class="vs-container flex items-center gap-1.5">
        <div class="vs-line w-6 h-0.5 bg-gradient-to-r from-transparent to-player-left" />
        <div class="vs-badge w-10 h-10 flex items-center justify-center rounded-full relative">
          <span class="vs-text text-sm font-bold">VS</span>
        </div>
        <div class="vs-line w-6 h-0.5 bg-gradient-to-l from-transparent to-player-right" />
      </div>

      <!-- 玩家2 -->
      <div class="player-slot player-slot--right flex flex-col items-center gap-1.5 flex-1">
        <div class="relative">
          <div class="avatar-glow avatar-glow--right absolute inset-0 rounded-full scale-110" />
          <el-avatar
            :size="56"
            :src="getPlayerAvatar(props.users[1])"
            class="player-avatar player-avatar--right border-2 transition-all duration-300"
          >
            {{ props.users[1]?.name?.charAt(0) || '?' }}
          </el-avatar>
          <div v-if="!props.users[1]" class="avatar-placeholder absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-border">
            <span class="text-xl text-text-muted font-light">+</span>
          </div>
        </div>
        <span class="player-name text-xs font-medium text-text max-w-16 truncate">
          {{ getPlayerName(props.users[1]) }}
        </span>
        <span v-if="props.users[1]" class="player-level text-xs px-1.5 py-0.5 rounded-md bg-warning/10 text-warning">
          Lv.{{ getPlayerLevel(props.users[1]) }}
        </span>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="relative flex items-center justify-between mt-3 pt-3 border-t border-border z-1">
      <div class="flex items-center gap-1.5 text-xs text-text-secondary">
        <i class="i-ph-users-three text-sm" />
        <span>{{ props.users.length }}/2</span>
      </div>
      <div class="game-tag flex items-center gap-1.5 px-2 py-1 rounded-md bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-medium">
        <i class="i-ph-game-controller text-sm" />
        <span>{{ props.gameName || '暂无游戏' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础样式 */
.room-box {
  background: linear-gradient(145deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}

.room-box:hover {
  border-color: var(--accent-primary);
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-card-hover);
}

/* 状态变体 */
.room-box--waiting {
  .vs-text { color: var(--text-muted); }
  .room-glow { background: var(--text-muted); opacity: 0.1; }
}

.room-box--ready {
  border-color: var(--success);
  .room-glow { background: var(--success); opacity: 0.15; }
  .vs-badge { animation: glowPulse 2s ease-in-out infinite; }
  .status-dot { animation: pulse 1.5s ease-in-out infinite; }
}

.room-box--full {
  border-color: var(--error);
  .room-glow { background: var(--error); opacity: 0.2; }
  .vs-badge {
    animation: glowPulse 2s ease-in-out infinite;
    --tw-shadow-color: var(--error);
  }
  .status-dot { animation: pulse 1s ease-in-out infinite; }
}

/* 背景光效 */
.room-glow {
  top: -20px;
  left: -20px;
  filter: blur(30px);
  transition: opacity 0.5s ease;
}

.group:hover .room-glow {
  opacity: 0.3;
}

/* 角落装饰 */
.corner-accent {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--border-light);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.corner-accent--tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
.corner-accent--tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }
.corner-accent--bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }
.corner-accent--br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

.group:hover .corner-accent {
  border-color: var(--accent-primary);
  opacity: 1;
}

/* 状态徽章 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge--waiting {
  background: var(--bg-elevated);
  color: var(--text-muted);
  .status-dot { background: var(--text-muted); }
}

.status-badge--ready {
  background: var(--success-bg);
  color: var(--success);
  .status-dot { background: var(--success); }
}

.status-badge--full {
  background: var(--error-bg);
  color: var(--error);
  .status-dot { background: var(--error); }
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

/* 玩家样式 */
.player-slot--left .player-avatar { border-color: var(--player-left); }
.player-slot--right .player-avatar--right { border-color: var(--player-right); }

.player-avatar {
  background: var(--bg-secondary);
  font-size: 20px;
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.player-slot--left .avatar-glow {
  background: var(--player-left);
  opacity: 0.2;
  left: -8px;
}

.player-slot--right .avatar-glow--right {
  background: var(--player-right);
  opacity: 0.2;
  right: -8px;
}

.group:hover .avatar-glow {
  opacity: 0.4;
}

.player-name {
  text-align: center;
}

.player-level {
  font-size: 10px;
}

/* VS 徽章 */
.vs-container {
  flex-shrink: 0;
}

.vs-badge {
  background: var(--bg-secondary);
  border: 2px solid var(--vs-color);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

.vs-text {
  color: var(--vs-color);
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.vs-line {
  height: 2px;
}

/* 游戏标签 */
.game-tag {
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

/* 动画 */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(251, 191, 36, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
