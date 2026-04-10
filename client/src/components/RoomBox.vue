<script setup lang="ts">
import type { RoomState } from '@/types/common'

const props = defineProps<RoomState>()

// 判断房间状态
const isWaiting = props.users.length === 0
const isFull = props.users.length >= 2
const hasOnePlayer = props.users.length === 1
const watchers = Math.max(0, props.users.length - 2)
</script>

<template>
  <div
    class="room-box relative flex flex-col w-full h-full p-16 overflow-hidden cursor-pointer"
    :class="{
      'room-box--waiting': isWaiting,
      'room-box--ready': hasOnePlayer,
      'room-box--full': isFull
    }"
  >
    <!-- 房间名称 -->
    <div class="flex items-center justify-between m-b-12">
      <h3 class="room-name font-16 font-semibold m-0">{{ props.roomName }}</h3>
      <div>
        <span
          v-if="isWaiting"
          class="status-badge status-badge--waiting inline-flex items-center gap-4 font-11 font-medium"
        >
          <span class="status-dot w-6 h-6"></span>
          等待中
        </span>
        <span
          v-else-if="hasOnePlayer"
          class="status-badge status-badge--ready inline-flex items-center gap-4 font-11 font-medium"
        >
          <span class="status-dot w-6 h-6"></span>
          准备中
        </span>
        <span
          v-else
          class="status-badge status-badge--full inline-flex items-center gap-4 font-11 font-medium"
        >
          <span class="status-dot w-6 h-6"></span>
          对战中
        </span>
      </div>
    </div>

    <!-- 对战区域 -->
    <div class="flex-1 flex items-center justify-between gap-8 p-y-8">
      <!-- 玩家1 -->
      <div class="player-slot player-slot--left flex flex-col items-center gap-6 flex-1">
        <div class="player-avatar-wrapper relative">
          <el-avatar :size="64" :src="props.users[0]?.avatar || undefined" class="player-avatar">
            {{ props.users[0]?.name?.charAt(0) || '?' }}
          </el-avatar>
          <div class="avatar-ring ring--left absolute"></div>
          <div
            v-if="!props.users[0]"
            class="avatar-placeholder absolute inset-0 flex items-center justify-center"
          >
            <span class="placeholder-icon font-28">+</span>
          </div>
        </div>
        <span class="player-name font-13 font-medium text-center whitespace-nowrap">
          {{ props.users[0]?.name || '等待加入' }}
        </span>
        <span v-if="props.users[0]" class="player-level font-10 p-y-2 p-x-6">
          Lv.{{ props.users[0]?.level || 1 }}
        </span>
      </div>

      <!-- VS 区域 -->
      <div class="vs-container flex items-center gap-4 p-x-4">
        <div class="vs-line vs-line--left"></div>
        <div class="vs-badge flex items-center justify-center">
          <span class="vs-text font-bold">VS</span>
        </div>
        <div class="vs-line vs-line--right"></div>
      </div>

      <!-- 玩家2 -->
      <div class="player-slot player-slot--right flex flex-col items-center gap-6 flex-1">
        <div class="player-avatar-wrapper relative">
          <el-avatar :size="64" :src="props.users[1]?.avatar || undefined" class="player-avatar">
            {{ props.users[1]?.name?.charAt(0) || '?' }}
          </el-avatar>
          <div class="avatar-ring ring--right absolute"></div>
          <div
            v-if="!props.users[1]"
            class="avatar-placeholder absolute inset-0 flex items-center justify-center"
          >
            <span class="placeholder-icon font-28">+</span>
          </div>
        </div>
        <span class="player-name font-13 font-medium text-center whitespace-nowrap">
          {{ props.users[1]?.name || '等待加入' }}
        </span>
        <span v-if="props.users[1]" class="player-level font-10 p-y-2 p-x-6">
          Lv.{{ props.users[1]?.level || 1 }}
        </span>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="flex items-center justify-between m-t-8 p-t-8">
      <div>
        <span v-if="watchers > 0" class="watcher-count inline-flex items-center gap-4 font-12">
          <svg
            class="w-14 h-14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {{ watchers }} 观众
        </span>
      </div>
      <div>
        <span class="game-tag inline-flex items-center gap-6 p-y-4 p-x-10 font-12 font-medium">
          <svg
            class="w-14 h-14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h4M14 12h4" />
          </svg>
          {{ props.gameName || '暂无游戏' }}
        </span>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="m-t-auto p-t-8">
      <div class="decor-line"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room-box {
  background: linear-gradient(145deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--accent-gradient);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-4px) scale(1.02);
    box-shadow:
      var(--shadow-lg),
      0 0 30px rgba(124, 58, 237, 0.15);

    &::before {
      opacity: 1;
    }

    .vs-badge {
      animation: glow 2s ease-in-out infinite;
    }
  }

  &--waiting .vs-text {
    color: var(--text-muted);
  }

  &--ready {
    border-color: var(--success);
    &::before {
      background: var(--success);
      opacity: 0.5;
    }
  }

  &--full {
    border-color: var(--error);
    .vs-badge {
      animation: glow 2s ease-in-out infinite;
    }
    &::before {
      background: var(--error);
      opacity: 0.7;
    }
  }
}

.decor-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-light), transparent);
}

.room-name {
  color: var(--text);
}

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;

  .status-dot {
    border-radius: 50%;
  }

  &--waiting {
    background: rgba(90, 90, 110, 0.3);
    color: var(--text-muted);
    .status-dot {
      background: var(--text-muted);
    }
  }

  &--ready {
    background: rgba(16, 185, 129, 0.15);
    color: var(--success);
    .status-dot {
      background: var(--success);
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &--full {
    background: rgba(239, 68, 68, 0.15);
    color: var(--error);
    .status-dot {
      background: var(--error);
      animation: pulse 1s ease-in-out infinite;
    }
  }
}

.player-slot--left {
  .player-avatar {
    border-color: var(--player-left);
  }
  .avatar-ring {
    border-color: var(--player-left);
  }
}

.player-slot--right {
  .player-avatar {
    border-color: var(--player-right);
  }
  .avatar-ring {
    border-color: var(--player-right);
  }
}

.player-avatar {
  border: 3px solid var(--accent-primary);
  background: var(--bg-secondary);
  font-size: 24px;
  font-weight: 600;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.avatar-ring {
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px dashed;
  border-radius: 50%;
  opacity: 0.3;
  animation: spin 10s linear infinite;
}

.avatar-placeholder {
  border-radius: 50%;
  border: 3px dashed var(--border-light);
  background: rgba(0, 0, 0, 0.2);
}

.placeholder-icon {
  color: var(--text-muted);
  font-weight: 300;
}

.player-name {
  color: var(--text);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-level {
  color: var(--warning);
  background: rgba(245, 158, 11, 0.1);
  border-radius: 8px;
}

.vs-line {
  width: 20px;
  height: 2px;
  &--left {
    background: linear-gradient(90deg, transparent, var(--vs-color));
  }
  &--right {
    background: linear-gradient(90deg, var(--vs-color), transparent);
  }
}

.vs-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--vs-color);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

.vs-text {
  font-size: 14px;
  color: var(--vs-color);
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
  font-family: var(--font-mono);
}

.watcher-count {
  color: var(--text-secondary);
}

.room-footer-border {
  border-top: 1px solid var(--border);
}

.game-tag {
  background: var(--accent-gradient);
  border-radius: var(--radius-sm);
  color: white;
}

@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 10px rgba(239, 68, 68, 0.4),
      0 0 20px rgba(239, 68, 68, 0.2);
  }
  50% {
    box-shadow:
      0 0 20px rgba(239, 68, 68, 0.6),
      0 0 40px rgba(239, 68, 68, 0.3);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 小屏幕：头像和 VS 缩小
@media (max-width: 900px) {
  .player-avatar-wrapper :deep(.el-avatar) {
    width: 44px !important;
    height: 44px !important;
    line-height: 44px !important;
    font-size: 18px !important;
  }

  .avatar-ring {
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
  }

  .vs-badge {
    width: 32px;
    height: 32px;
  }

  .vs-text {
    font-size: 10px;
  }

  .vs-line {
    width: 12px;
  }
}
</style>
