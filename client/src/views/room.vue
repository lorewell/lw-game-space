<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { RoomState } from '@/types/common'
import RoomBox from '@/components/RoomBox.vue'
import { getRoomList } from '@/api/room'

const router = useRouter()
const rooms = ref<RoomState[]>([])
const loading = ref(true)

async function fetchRooms() {
  try {
    const res = await getRoomList()
    if (res.code === 0 && res.data.length > 0) {
      rooms.value = res.data
    } else {
      rooms.value = Array.from({ length: 9 }, (_, i) => ({
        roomId: `room_${i + 1}`,
        roomName: `房间 ${i + 1}`,
        gameName: '五子棋',
        users: [],
        messages: []
      }))
    }
  } catch {
    rooms.value = Array.from({ length: 9 }, (_, i) => ({
      roomId: `room_${i + 1}`,
      roomName: `房间 ${i + 1}`,
      gameName: '五子棋',
      users: [],
      messages: []
    }))
  } finally {
    loading.value = false
  }
}

function enterRoom(room: RoomState) {
  if (room.users.length >= 2) {
    ElMessage.warning('该房间已满')
    return
  }
  router.push({ name: 'Game', params: { roomId: room.roomId } })
}

onMounted(fetchRooms)
</script>

<template>
  <div class="w-full h-full flex flex-col p-y-20 p-x-32 overflow-hidden">
    <!-- 页面标题 -->
    <header class="view-header flex items-center justify-between p-b-8 m-b-8 shrink-0">
      <div class="flex flex-col gap-4">
        <h1 class="page-title flex items-center gap-10 font-22 font-bold m-0">
          <span class="title-icon flex items-center justify-center w-32 h-32 shrink-0">
            <svg
              class="w-18 h-18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          游戏房间
        </h1>
        <p class="page-subtitle font-12 m-0 p-l-42">选择房间开始对战</p>
      </div>
      <div class="header-stats flex items-center gap-16 p-y-8 p-x-16">
        <div class="flex flex-col items-center gap-2">
          <span class="stat-value font-16 font-bold">{{
            rooms.filter((r) => r.users.length === 0).length
          }}</span>
          <span class="stat-label font-11 uppercase">空闲房间</span>
        </div>
        <div class="stat-divider"></div>
        <div class="flex flex-col items-center gap-2">
          <span class="stat-value font-16 font-bold">{{
            rooms.filter((r) => r.users.length === 1).length
          }}</span>
          <span class="stat-label font-11 uppercase">等待中</span>
        </div>
        <div class="stat-divider"></div>
        <div class="flex flex-col items-center gap-2">
          <span class="stat-value font-16 font-bold">{{
            rooms.filter((r) => r.users.length >= 2).length
          }}</span>
          <span class="stat-label font-11 uppercase">对战中</span>
        </div>
      </div>
    </header>

    <!-- 房间网格 -->
    <main class="room-grid flex-1 min-h-0" :class="{ 'is-loading': loading }">
      <div
        v-for="(room, index) in rooms"
        :key="room.roomId"
        class="room-cell min-w-0 min-h-0 cursor-pointer"
        :style="{ '--i': index }"
        @click="enterRoom(room)"
      >
        <RoomBox v-bind="room" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
// 页面头部
.view-header {
  border-bottom: 1px solid var(--border);
}

.page-title {
  color: var(--text);
}

.title-icon {
  background: var(--accent-gradient);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 15px var(--accent-glow);

  svg {
    color: white;
  }
}

.page-subtitle {
  color: var(--text-secondary);
}

// 统计信息
.header-stats {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.stat-value {
  color: var(--text);
  font-family: var(--font-mono);
}

.stat-label {
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
}

// 房间网格
.room-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  transition: opacity var(--transition-normal);

  &.is-loading {
    opacity: 0;
  }
}

.room-cell {
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

// 响应式调整
@media (max-width: 1200px) {
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
    font-size: 20px;
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
