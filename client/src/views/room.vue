<script setup lang="ts">
import { onMounted } from 'vue'
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

// 计算统计数据
const stats = {
  idle: roomStore.rooms.filter(r => r.users.length === 0).length,
  waiting: roomStore.rooms.filter(r => r.users.length === 1).length,
  battling: roomStore.rooms.filter(r => r.users.length >= 2).length,
}

onMounted(() => {
  roomStore.fetchRooms()
})
</script>

<template>
  <div class="room-view h-full flex flex-col relative">
    <!-- 页面头部 -->
    <header class="view-header flex items-center justify-between shrink-0 px-6 py-4 border-b border-border/50 relative z-1">
      <div class="flex items-center gap-4">
        <!-- 标题图标 -->
        <div class="title-icon w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-[0_4px_15px_var(--accent-glow)]">
          <i class="i-ph-squares-four text-white text-xl" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-text flex items-center gap-2">
            <span>游戏房间</span>
            <span class="text-sm font-normal text-text-muted">Battle Arena</span>
          </h1>
          <p class="text-sm text-text-secondary">选择房间开始对战</p>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="header-stats flex items-center gap-4 px-5 py-3 rounded-xl bg-bg-card border border-border shadow-[var(--shadow-sm)]">
        <div class="stat-item flex flex-col items-center px-3">
          <span class="stat-value text-xl font-bold font-mono text-text">{{ stats.idle }}</span>
          <span class="stat-label text-xs text-text-muted uppercase tracking-wider">空闲</span>
        </div>
        <div class="stat-divider w-px h-8 bg-border" />
        <div class="stat-item flex flex-col items-center px-3">
          <span class="stat-value text-xl font-bold font-mono text-success">{{ stats.waiting }}</span>
          <span class="stat-label text-xs text-text-muted uppercase tracking-wider">等待</span>
        </div>
        <div class="stat-divider w-px h-8 bg-border" />
        <div class="stat-item flex flex-col items-center px-3">
          <span class="stat-value text-xl font-bold font-mono text-error">{{ stats.battling }}</span>
          <span class="stat-label text-xs text-text-muted uppercase tracking-wider">对战</span>
        </div>
      </div>
    </header>

    <!-- 房间网格 -->
    <main v-scrollbar class="flex-1 min-h-0 p-6 relative z-1 overflow-hidden">
      <div class="room-grid grid grid-cols-3 grid-rows-3 gap-5" :class="{ 'is-loading': roomStore.loading }">
        <div
          v-for="(room, index) in roomStore.rooms"
          :key="room.roomId"
          class="room-cell min-w-0 min-h-40 cursor-pointer animate-cell-in"
          :style="{ animationDelay: `${index * 60}ms` }"
          @click="enterRoom(room)"
        >
          <RoomBox v-bind="room" />
        </div>
      </div>
    </main>

    <!-- 底部提示 -->
    <footer class="view-footer shrink-0 px-6 py-3 border-t border-border/50 relative z-1">
      <div class="footer-tip inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-card border border-border text-sm text-text-secondary">
        <i class="i-ph-info text-accent-secondary" />
        <span>点击房间即可加入对战，最多2人同时对战</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.room-view {
  background: transparent;
}

/* 页面头部 */
.view-header {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, transparent 100%);
}

.title-icon {
  animation: float 3s ease-in-out infinite;
}

/* 统计卡片 */
.header-stats {
  animation: slideDown 0.5s ease-out;
}

.stat-item {
  animation: fadeIn 0.5s ease-out;
}

.stat-value {
  line-height: 1.2;
}

.stat-label {
  margin-top: 2px;
}

/* 房间网格 */
.room-grid {
  animation: fadeIn 0.5s ease-out;
}

.is-loading {
  opacity: 0.5;
  pointer-events: none;
}

/* 房间单元格 */
.room-cell {
  animation: cellIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes cellIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 底部提示 */
.view-footer {
  background: linear-gradient(0deg, var(--bg-secondary) 0%, transparent 100%);
}

.footer-tip {
  transition: all 0.3s ease;
}

.footer-tip:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 15px var(--accent-glow);
}

/* 动画 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 响应式 */
@media (max-width: 1200px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-stats {
    width: 100%;
    justify-content: center;
  }

  .room-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(5, 1fr);
  }
}

@media (max-width: 768px) {
  .room-view {
    padding: 12px;
  }

  .title-icon {
    width: 36px;
    height: 36px;
  }

  h1 {
    font-size: 18px;
  }
}
</style>
