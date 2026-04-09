<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '@/stores/game'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

async function init() {
  const roomId = route.params.roomId as string
  try {
    await gameStore.join(roomId)
  } catch {
    ElMessage.error('加入房间失败，请重试')
    router.replace({ name: 'Home' })
  }
}

function back() {
  router.push({ name: 'Home' })
}

onMounted(init)
onUnmounted(() => gameStore.leave())
</script>

<template>
  <div class="game-view h-full flex flex-col items-center justify-center gap-24 p-24">
    <!-- 连接中 -->
    <template v-if="!gameStore.connected">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span class="font-14">正在加入房间...</span>
    </template>

    <!-- 已连接 -->
    <template v-else>
      <div class="room-header flex items-center justify-between w-full" style="max-width: 600px">
        <el-button size="small" @click="back">返回大厅</el-button>
        <span class="font-16 font-bold">房间：{{ gameStore.roomId }}</span>
        <el-tag :type="gameStore.status === 'playing' ? 'success' : 'info'">
          {{ gameStore.status === 'playing' ? '对战中' : '等待中' }}
        </el-tag>
      </div>

      <div class="players-area flex items-center gap-40" style="max-width: 600px">
        <div
          v-for="player in gameStore.players"
          :key="player.sessionId"
          class="player-card flex flex-col items-center gap-8 p-16 rounded-8"
        >
          <el-avatar :size="56">{{ player.name.charAt(0) }}</el-avatar>
          <span class="font-13 font-medium">{{ player.name }}</span>
          <el-tag size="small" :type="player.ready ? 'success' : 'info'">
            {{ player.ready ? '已准备' : '未准备' }}
          </el-tag>
        </div>

        <div
          v-if="gameStore.players.length < 2"
          class="player-card flex flex-col items-center gap-8 p-16 rounded-8"
        >
          <el-avatar :size="56">?</el-avatar>
          <span class="font-13">等待对手加入...</span>
        </div>
      </div>

      <el-button
        v-if="gameStore.status === 'waiting'"
        type="primary"
        @click="gameStore.sendReady()"
      >
        准备
      </el-button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.game-view {
  width: 100%;
}

.player-card {
  border: 1px solid var(--el-border-color);
  background: var(--el-fill-color-light);
  min-width: 120px;
}
</style>
