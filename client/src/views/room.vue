<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRoomStore } from '@/stores/room'
import { useUserStore } from '@/stores/user'
import type { RoomState } from '@/types/common'
import RoomBox from '@/components/RoomBox.vue'

const router = useRouter()
const roomStore = useRoomStore()
const userStore = useUserStore()

async function enterRoom(room: RoomState) {
  if (room.users.length >= 2) {
    ElMessage.warning('该房间已满')
    return
  }

  const result = await roomStore.joinRoom(room.roomId, {
    userId: userStore.id,
    name: userStore.name || '游客',
    avatar: userStore.avatar,
    level: userStore.level,
  })

  if (result.success) {
    router.push({ name: 'Game', params: { roomId: room.roomId } })
  } else {
    ElMessage.error(result.message || '加入房间失败')
  }
}

onMounted(() => {
  roomStore.fetchRooms()
})
</script>

<template>
  <div class="room-view">
    <!-- 页面标题 -->
    <header class="view-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          游戏房间
        </h1>
        <p class="page-subtitle">选择房间开始对战</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-value">{{ roomStore.rooms.filter(r => r.users.length === 0).length }}</span>
          <span class="stat-label">空闲房间</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ roomStore.rooms.filter(r => r.users.length === 1).length }}</span>
          <span class="stat-label">等待中</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ roomStore.rooms.filter(r => r.users.length >= 2).length }}</span>
          <span class="stat-label">对战中</span>
        </div>
      </div>
    </header>

    <!-- 房间网格 -->
    <main class="room-grid" :class="{ 'is-loading': roomStore.loading }">
      <div
        v-for="(room, index) in roomStore.rooms"
        :key="room.roomId"
        class="room-cell"
        :style="{ '--i': index }"
        @click="enterRoom(room)"
      >
        <RoomBox v-bind="room" />
      </div>
    </main>

    <!-- 底部提示 -->
    <footer class="view-footer">
      <div class="footer-tip">
        <svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>点击房间即可加入对战，最多2人同时对战</span>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.room-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  overflow: hidden;
}

// 页面头部
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  margin: 0;

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--accent-gradient);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 15px var(--accent-glow);

    svg {
      width: 24px;
      height: 24px;
      color: white;
    }
  }
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  padding-left: 52px;
}

// 统计信息
.header-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  font-family: var(--font-mono);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
}

// 房间网格
.room-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  min-height: 0;
  transition: opacity var(--transition-normal);

  &.is-loading {
    opacity: 0.5;
  }
}

.room-cell {
  min-width: 0;
  min-height: 0;
  cursor: pointer;
  animation: cellIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 50ms);
  transition: transform var(--transition-normal);

  &:hover {
    z-index: 1;
  }
}

@keyframes cellIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 底部提示
.view-footer {
  flex-shrink: 0;
  padding-top: 20px;
  margin-top: auto;
  border-top: 1px solid var(--border);
}

.footer-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--text-secondary);

  .tip-icon {
    width: 16px;
    height: 16px;
    color: var(--accent-secondary);
    flex-shrink: 0;
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .room-view {
    padding: 20px 24px;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-stats {
    width: 100%;
    justify-content: space-around;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    padding-left: 0;
  }
}

@media (max-width: 900px) {
  .room-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 16px;
  }
}
</style>
