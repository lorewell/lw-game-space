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
          <el-icon :size="14"><View /></el-icon>
          {{ watchers }} 观众
        </span>
      </div>
      <div>
        <span class="game-tag inline-flex items-center gap-6 p-y-4 p-x-10 font-12 font-medium">
          <el-icon :size="14"><Monitor /></el-icon>
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

  .room-name {
    color: var(--text);
  }

  .status-badge {
    padding: 2px 8px;
    border-radius: 12px;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    border: 1px solid var(--border);

    &--waiting {
      .status-dot {
        background: var(--text-muted);
      }
    }
    &--ready {
      color: var(--success);
      border-color: rgba(16, 185, 129, 0.2);
      .status-dot {
        background: var(--success);
        box-shadow: 0 0 8px var(--success);
      }
    }
    &--full {
      color: var(--error);
      border-color: rgba(239, 68, 68, 0.2);
      .status-dot {
        background: var(--error);
        box-shadow: 0 0 8px var(--error);
      }
    }
    .status-dot {
      border-radius: 50%;
    }
  }

  .player-slot {
    .player-avatar-wrapper {
      .player-avatar {
        border: 2px solid var(--border);
        background: var(--bg-secondary);
        transition: border-color 0.3s ease;
      }

      .avatar-ring {
        inset: -4px;
        border: 2px solid transparent;
        border-radius: 50%;
        opacity: 0.5;

        &--left {
          border-left-color: var(--accent-primary);
          border-top-color: var(--accent-primary);
        }
        &--right {
          border-right-color: var(--accent-secondary);
          border-bottom-color: var(--accent-secondary);
        }
      }

      .avatar-placeholder {
        background: var(--bg-secondary);
        border-radius: 50%;
        border: 2px dashed var(--border);
        color: var(--text-muted);
      }
    }

    .player-name {
      color: var(--text);
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .player-level {
      background: var(--bg-secondary);
      color: var(--warning);
      border-radius: 4px;
    }
  }

  .vs-badge {
    width: 32px;
    height: 32px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 50%;
    z-index: 1;

    .vs-text {
      font-size: 12px;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .vs-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
  }

  .watcher-count {
    color: var(--text-muted);
  }

  .game-tag {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .decor-line {
    height: 2px;
    width: 40px;
    background: var(--border);
    border-radius: 1px;
    margin: 0 auto;
  }

  &--waiting .vs-text {
    background: var(--text-muted);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &--ready {
    border-color: var(--success);
    &::before {
      background: var(--success);
      opacity: 0.5;
    }
    .vs-badge {
      border-color: var(--success);
    }
  }

  &--full {
    border-color: var(--error);
    .vs-badge {
      border-color: var(--error);
      animation: glow 2s ease-in-out infinite;
    }
    &::before {
      background: var(--error);
      opacity: 0.5;
    }
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(124, 58, 237, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.6);
  }
}
</style>
