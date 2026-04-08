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
  <div class="room-view w-full">
    <div class="room-grid">
      <div v-for="room in rooms" :key="room.roomId" class="room-cell">
        <RoomBox v-bind="room" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room-grid {
  display: grid;
  grid-template-columns: repeat(3, 30%);
  gap: 16px;
  justify-content: center;
}

.room-cell {
  aspect-ratio: 16 / 9;
}
</style>
