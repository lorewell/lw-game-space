<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'
import { useHallStore } from '@/stores/hall'

const userStore = useUserStore()
const systemStore = useSystemStore()
const hallStore = useHallStore()

const inputContent = ref('')
const messageListRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

function handleSend() {
  const text = inputContent.value.trim()
  if (!text) return
  hallStore.sendMessage(text)
  inputContent.value = ''
}

function handleKeydown(e: Event) {
  const ke = e as KeyboardEvent
  if (ke.key === 'Enter' && !ke.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

watch(() => hallStore.messages.length, scrollToBottom)

onMounted(() => {
  hallStore.connect()
})

onUnmounted(() => {
  hallStore.disconnect()
})
</script>

<template>
  <div class="page-side h-full flex flex-col p-12 box-border overflow-hidden">
    <div class="side-title font-15 font-bold text-center p-t-8 p-b-12">大鸟转转转酒吧</div>

    <!-- 用户信息 -->
    <div class="user-info flex items-center gap-10 p-t-8 p-b-12">
      <el-avatar :size="40" :src="userStore.avatar || undefined">
        {{ userStore.name?.charAt(0) || '?' }}
      </el-avatar>
      <div class="user-meta flex flex-col gap-4">
        <div class="name font-14 font-medium">{{ userStore.name || '未登录' }}</div>
        <div class="level">
          <el-tag size="small" type="warning">Lv.{{ userStore.level }}</el-tag>
        </div>
      </div>
    </div>

    <!-- 公告区 -->
    <div class="space-notice p-y-10 font-12">
      <div v-if="systemStore.newSpaceNotice" class="new-notice flex items-center gap-6 p-y-4">
        <el-icon><Bell /></el-icon>
        <span>{{ systemStore.newSpaceNotice }}</span>
      </div>
      <div v-if="systemStore.newUpdateNotice" class="update-notice flex items-center gap-6 p-y-4">
        <el-icon><Promotion /></el-icon>
        <span>{{ systemStore.newUpdateNotice }}</span>
      </div>
      <div
        v-if="!systemStore.newSpaceNotice && !systemStore.newUpdateNotice"
        class="no-notice text-center p-y-4"
      >
        暂无公告
      </div>
    </div>

    <!-- 大厅信息区 -->
    <div class="space-info flex-1 flex flex-col overflow-hidden m-t-10">
      <!-- 在线用户 -->
      <div class="inline-user overflow-y-auto m-b-8" style="max-height: 120px">
        <div class="section-header flex items-center justify-between font-12 font-semibold m-b-6">
          <span>在线玩家</span>
          <el-badge :value="hallStore.onlineUsers.length" :max="99" type="success" />
        </div>
        <div class="user-list flex flex-col gap-4">
          <div
            v-for="user in hallStore.onlineUsers"
            :key="user.sessionId"
            class="user-item flex items-center gap-6 rounded"
            style="padding: 3px 4px"
          >
            <el-avatar :size="24" :src="user.avatar || undefined">
              {{ user.name?.charAt(0) }}
            </el-avatar>
            <span class="user-name flex-1 font-12 truncate">{{ user.name }}</span>
            <el-tag size="small" type="warning" class="user-level shrink-0"
              >Lv.{{ user.level }}</el-tag
            >
          </div>
          <div
            v-if="hallStore.onlineUsers.length === 0"
            class="empty-tip font-12 text-center p-y-8"
          >
            暂无玩家在线
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="space-message flex-1 overflow-y-auto p-6 m-b-8 rounded" ref="messageListRef">
        <div
          v-for="(msg, index) in hallStore.messages"
          :key="index"
          class="message-item font-12 p-y-2"
        >
          <span class="msg-name font-medium">{{ msg.userName }}：</span>
          <span class="msg-content">{{ msg.content }}</span>
        </div>
        <div v-if="hallStore.messages.length === 0" class="empty-tip font-12 text-center p-y-8">
          暂无消息，快来聊天吧~
        </div>
      </div>

      <!-- 消息输入 -->
      <div class="message-input shrink-0">
        <el-input
          v-model="inputContent"
          placeholder="说点什么..."
          :disabled="!hallStore.connected"
          @keydown="handleKeydown"
          maxlength="200"
          size="small"
        >
          <template #append>
            <el-button
              :disabled="!hallStore.connected || !inputContent.trim()"
              @click="handleSend"
              size="small"
            >
              发送
            </el-button>
          </template>
        </el-input>
        <div v-if="!hallStore.connected" class="conn-status font-11 text-center m-t-4">
          连接中...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 仅保留依赖 Element Plus CSS 变量的样式

.page-side {
  width: 350px;
  border-left: 1px solid var(--el-border-color);
}

.side-title {
  color: var(--el-text-color-primary);
}

.user-info {
  border-bottom: 1px solid var(--el-border-color-lighter);
  .name {
    color: var(--el-text-color-primary);
  }
}

.space-notice {
  border-bottom: 1px solid var(--el-border-color-lighter);
  .new-notice,
  .update-notice {
    color: var(--el-color-warning);
  }
  .no-notice {
    color: var(--el-text-color-placeholder);
  }
}

.section-header {
  color: var(--el-text-color-secondary);
}

.user-item {
  &:hover {
    background: var(--el-fill-color-light);
  }
}

.space-message {
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-blank);
  .message-item {
    line-height: 1.6;
    word-break: break-all;
  }
  .msg-name {
    color: var(--el-color-primary);
  }
  .msg-content {
    color: var(--el-text-color-regular);
  }
}

.empty-tip {
  color: var(--el-text-color-placeholder);
}
.conn-status {
  color: var(--el-text-color-placeholder);
}
</style>
