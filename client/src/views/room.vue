<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { RoomState } from '@/types/common'
import RoomBox from '@/components/RoomBox.vue'
import { getRoomList } from '@/api/room'

const router = useRouter()
const rooms = ref<RoomState[]>([])

async function fetchRooms() {
  try {
    const res = await getRoomList()
    if (res.code === 0 && res.data.length > 0) {
      rooms.value = res.data
    } else {
      // 后端暂无数据时使用默认占位房间
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
  <div class="room-view p-24">
    <div class="room-grid flex items-center justify-center">
      <div
        v-for="(room, index) in rooms"
        :key="room.roomId"
        class="room-cell"
        :style="{ '--i': index }"
        @click="enterRoom(room)"
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
  overflow-x: hidden;

  .room-grid {
    display: grid;
    grid-template-columns: repeat(3, 28%);
    gap: 24px;
    width: 100%;
    min-width: 0;
  }
  .room-cell {
    min-width: 0;
    aspect-ratio: 16 / 9;
    animation: cellIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i) * 40ms);
  }
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
