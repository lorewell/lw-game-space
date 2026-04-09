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
  <div class="room-view p-24">
    <div class="room-grid flex items-center justify-center">
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
