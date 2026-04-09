<script setup lang="ts">
import type { RoomState } from '@/types/common'
import RoomBox from '@/components/RoomBox.vue'

const rooms: RoomState[] = Array.from({ length: 9 }, (_, i) => ({
  roomId: `room_${i + 1}`,
  roomName: `房间 ${i + 1}`,
  gameName: '五子棋',
  users: [],
  messages: []
}))
</script>

<template>
  <div class="room-view">
    <header class="page-header">
      <div class="header-left">
        <div class="header-eyebrow">// GAME LOBBY</div>
        <h1 class="header-title">BATTLE ROOMS</h1>
      </div>
      <div class="header-stats">
        <div class="stat-block">
          <span class="stat-value">{{ rooms.length }}</span>
          <span class="stat-label">ROOMS</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <span class="stat-value">0</span>
          <span class="stat-label">ONLINE</span>
        </div>
      </div>
    </header>

    <div class="room-grid">
      <div
        v-for="(room, index) in rooms"
        :key="room.roomId"
        class="room-cell"
        :style="{ '--i': index }"
      >
        <RoomBox v-bind="room" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room-view {
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--el-border-color);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 56px;
    height: 2px;
    background: var(--el-color-primary);
  }
}

.header-eyebrow {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--el-color-primary);
  opacity: 0.75;
  margin-bottom: 6px;
}

.header-title {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--el-text-color-primary);
}

.header-stats {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.stat-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.stat-value {
  font-family: 'Courier New', monospace;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  color: var(--el-text-color-primary);
}

.stat-label {
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--el-text-color-secondary);
  opacity: 0.5;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--el-border-color);
  align-self: flex-end;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  min-width: 0;
}

.room-cell {
  min-width: 0;
  aspect-ratio: 16 / 10;
  animation: cellIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 40ms);
}

@keyframes cellIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
