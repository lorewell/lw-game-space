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
    class="room-box"
    :class="{
      'room-box--waiting': isWaiting,
      'room-box--ready': hasOnePlayer,
      'room-box--full': isFull
    }"
  >
    <!-- 顶部装饰线 -->
    <div class="room-decor-top">
      <div class="decor-line"></div>
      <div class="decor-diamond"></div>
      <div class="decor-line"></div>
    </div>

    <!-- 房间名称 -->
    <div class="room-header">
      <h3 class="room-name">{{ props.roomName }}</h3>
      <div class="room-status">
        <span v-if="isWaiting" class="status-badge status-badge--waiting">
          <span class="status-dot"></span>
          等待中
        </span>
        <span v-else-if="hasOnePlayer" class="status-badge status-badge--ready">
          <span class="status-dot"></span>
          准备中
        </span>
        <span v-else class="status-badge status-badge--full">
          <span class="status-dot"></span>
          对战中
        </span>
      </div>
    </div>

    <!-- 对战区域 -->
    <div class="battle-area">
      <!-- 玩家1 -->
      <div class="player-slot player-slot--left">
        <div class="player-avatar-wrapper">
          <el-avatar :size="64" :src="props.users[0]?.avatar || undefined" class="player-avatar">
            {{ props.users[0]?.name?.charAt(0) || '?' }}
          </el-avatar>
          <div class="avatar-ring ring--left"></div>
          <div v-if="!props.users[0]" class="avatar-placeholder">
            <span class="placeholder-icon">+</span>
          </div>
        </div>
        <span class="player-name">{{ props.users[0]?.name || '等待加入' }}</span>
        <span v-if="props.users[0]" class="player-level">
          Lv.{{ props.users[0]?.level || 1 }}
        </span>
      </div>

      <!-- VS 区域 -->
      <div class="vs-container">
        <div class="vs-line vs-line--left"></div>
        <div class="vs-badge">
          <span class="vs-text">VS</span>
        </div>
        <div class="vs-line vs-line--right"></div>
      </div>

      <!-- 玩家2 -->
      <div class="player-slot player-slot--right">
        <div class="player-avatar-wrapper">
          <el-avatar :size="64" :src="props.users[1]?.avatar || undefined" class="player-avatar">
            {{ props.users[1]?.name?.charAt(0) || '?' }}
          </el-avatar>
          <div class="avatar-ring ring--right"></div>
          <div v-if="!props.users[1]" class="avatar-placeholder">
            <span class="placeholder-icon">+</span>
          </div>
        </div>
        <span class="player-name">{{ props.users[1]?.name || '等待加入' }}</span>
        <span v-if="props.users[1]" class="player-level">
          Lv.{{ props.users[1]?.level || 1 }}
        </span>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="room-footer">
      <div class="footer-left">
        <span class="watcher-count" v-if="watchers > 0">
          <svg class="watcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          {{ watchers }} 观众
        </span>
      </div>
      <div class="footer-right">
        <span class="game-tag">
          <svg class="game-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M6 12h4M14 12h4"/>
          </svg>
          {{ props.gameName || '暂无游戏' }}
        </span>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="room-decor-bottom">
      <div class="decor-line"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room-box {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  background: linear-gradient(
    145deg,
    var(--bg-card) 0%,
    var(--bg-elevated) 100%
  );
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);

  // 状态光效
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

  // 状态变体
  &--waiting {
    .vs-text { color: var(--text-muted); }
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

// 装饰线
.room-decor-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;

  .decor-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--border-light),
      transparent
    );
  }

  .decor-diamond {
    width: 8px;
    height: 8px;
    background: var(--accent-primary);
    transform: rotate(45deg);
    box-shadow: 0 0 8px var(--accent-glow);
  }
}

.room-decor-bottom {
  margin-top: auto;
  padding-top: 12px;

  .decor-line {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--border-light),
      transparent
    );
  }
}

// 房间头部
.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.room-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &--waiting {
    background: rgba(90, 90, 110, 0.3);
    color: var(--text-muted);
    .status-dot { background: var(--text-muted); }
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

// 对战区域
.battle-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 0;
}

.player-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;

  &--left {
    .player-avatar { border-color: var(--player-left); }
    .avatar-ring { border-color: var(--player-left); }
  }

  &--right {
    .player-avatar { border-color: var(--player-right); }
    .avatar-ring { border-color: var(--player-right); }
  }
}

.player-avatar-wrapper {
  position: relative;
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
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px dashed;
  border-radius: 50%;
  opacity: 0.3;
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 3px dashed var(--border-light);
  background: rgba(0, 0, 0, 0.2);

  .placeholder-icon {
    font-size: 28px;
    color: var(--text-muted);
    font-weight: 300;
  }
}

.player-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.player-level {
  font-size: 10px;
  color: var(--warning);
  background: rgba(245, 158, 11, 0.1);
  padding: 2px 6px;
  border-radius: 8px;
}

// VS 容器
.vs-container {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
}

.vs-line {
  width: 20px;
  height: 2px;
  background: var(--border-light);

  &--left {
    background: linear-gradient(90deg, transparent, var(--vs-color));
  }

  &--right {
    background: linear-gradient(90deg, var(--vs-color), transparent);
  }
}

.vs-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--vs-color);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}

.vs-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--vs-color);
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

// 底部信息
.room-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.watcher-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);

  .watcher-icon {
    width: 14px;
    height: 14px;
  }
}

.game-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--accent-gradient);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  color: white;

  .game-icon {
    width: 14px;
    height: 14px;
  }
}

// 动画
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
