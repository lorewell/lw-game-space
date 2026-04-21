<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'
import { useHallStore } from '@/stores/hall'
import { getUserInfo } from '@/api/user'
import UserInfoDialog from '@/components/UserInfoDialog.vue'

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

async function userLogin() {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = `user_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`
    localStorage.setItem('userId', userId)
  }

  const res = await getUserInfo(userId)
  if (res.code === 0 && res.data) {
    userStore.setUserInfo({
      id: res.data.id || userId,
      name: res.data.name,
      avatar: res.data.avatar,
      level: res.data.level
    })
  } else {
    userStore.setUserInfo({ id: userId, name: userId.slice(0, 8) })
  }

  hallStore.connect()
}

const userInfoDialogVisible = ref(false)

function openUserInfoDialog() {
  userInfoDialogVisible.value = true
}

watch(() => hallStore.messages.length, scrollToBottom)

onMounted(() => {
  userLogin()
})

onUnmounted(() => {
  hallStore.disconnect()
})
</script>

<template>
  <div
    class="page-side h-full flex flex-col w-80 bg-gradient-to-b from-bg-secondary to-bg-primary border-l border-border relative overflow-hidden"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-accent-primary/5 blur-60" />
      <div
        class="absolute -bottom-10 right-0 w-32 h-32 rounded-full bg-accent-secondary/5 blur-50"
      />
    </div>

    <!-- 顶部区域 - 用户卡片 -->
    <div class="relative shrink-0 px-3 pt-3 pb-2 z-1">
      <!-- 标题 -->
      <div class="flex items-center justify-center gap-2 mb-2">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-accent-primary/50" />
        <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-primary/10">
          <i class="i-ph-crown text-accent-primary text-xs" />
          <span class="text-xs font-semibold gradient-text">游戏大厅</span>
        </div>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-accent-primary/50" />
      </div>

      <!-- 用户信息卡片 -->
      <div
        class="user-card relative flex items-center gap-2 p-2 rounded-lg border border-border bg-bg-card/80 hover:border-accent-primary/50 transition-all cursor-pointer"
        @click="openUserInfoDialog"
      >
        <!-- 头像 -->
        <div class="relative shrink-0">
          <div class="p-0.5 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary">
            <el-avatar
              :size="36"
              :src="userStore.avatar || undefined"
              class="bg-bg-secondary border-2 border-bg-card"
            >
              {{ userStore.name?.charAt(0) || '?' }}
            </el-avatar>
          </div>
          <div
            class="absolute -bottom-1 -right-1 px-1 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary shadow-sm"
          >
            Lv.{{ userStore.level }}
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-sm font-semibold text-text truncate">{{
              userStore.name || '未登录'
            }}</span>
            <i
              class="i-ph-pencil-simple text-text-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div class="text-[10px] text-text-muted truncate">
            ID: {{ userStore.id?.slice(0, 8) }}...
          </div>
        </div>
      </div>
    </div>

    <!-- 中间滚动区域 -->
    <div class="flex-1 min-h-0 relative z-1 flex flex-col">
      <div class="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        <!-- 公告区 -->
        <section class="section-card">
          <div class="section-header flex items-center gap-1.5 mb-1.5 text-xs font-semibold">
            <i class="i-ph-bell text-accent-primary text-sm" />
            <span>系统公告</span>
          </div>
          <div class="space-y-1.5">
            <div
              v-if="systemStore.newSpaceNotice"
              class="notice-item flex items-center gap-2 p-2 rounded-md bg-accent-primary/5 border border-accent-primary/20 text-xs"
            >
              <span
                class="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-accent-primary"
                >新</span
              >
              <span class="text-text-secondary truncate">{{ systemStore.newSpaceNotice }}</span>
            </div>
            <div
              v-if="!systemStore.newSpaceNotice && !systemStore.newUpdateNotice"
              class="p-3 text-center text-xs text-text-muted border border-dashed border-border rounded-md"
            >
              暂无公告
            </div>
          </div>
        </section>

        <!-- 在线玩家 -->
        <section class="section-card">
          <div class="section-header flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-1.5 text-xs font-semibold">
              <i class="i-ph-users text-accent-secondary text-sm" />
              <span>在线玩家</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-full bg-bg-elevated text-[10px] text-text-muted">
              {{ hallStore.onlineUsers.length }}
            </span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <div
              v-for="user in hallStore.onlineUsers.slice(0, 6)"
              :key="user.sessionId"
              class="online-item flex items-center gap-1 px-1.5 py-1 rounded-md border border-border bg-bg-card/50 hover:bg-bg-elevated transition-colors"
            >
              <el-avatar :size="18" :src="user.avatar || undefined" class="shrink-0">
                {{ user.name?.charAt(0) }}
              </el-avatar>
              <span class="text-[10px] text-text-secondary truncate max-w-14">{{ user.name }}</span>
            </div>
            <div
              v-if="hallStore.onlineUsers.length === 0"
              class="w-full py-2 text-center text-xs text-text-muted"
            >
              暂无玩家在线
            </div>
          </div>
        </section>

        <!-- 聊天区 -->
        <section class="section-card flex-1 flex flex-col min-h-0">
          <div class="section-header flex items-center gap-1.5 mb-1.5 text-xs font-semibold">
            <i class="i-ph-chat-circle-dots text-accent-tertiary text-sm" />
            <span>大厅聊天</span>
          </div>

          <!-- 消息列表 -->
          <div class="message-list flex-1 min-h-0 overflow-y-auto space-y-1" ref="messageListRef">
            <div
              v-for="msg in hallStore.messages"
              :key="msg.userName + msg.content"
              class="message-item p-1.5 rounded-md bg-bg-elevated/50 text-xs"
            >
              <span class="font-semibold text-accent-primary">{{ msg.userName }}</span>
              <span class="text-text-muted mx-1">:</span>
              <span class="text-text">{{ msg.content }}</span>
            </div>
            <div
              v-if="hallStore.messages.length === 0"
              class="flex-1 flex flex-col items-center justify-center py-4 gap-1 text-xs text-text-muted"
            >
              <i class="i-ph-chat-teardrop-dots text-lg opacity-50" />
              <span>暂无消息</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 底部功能区 -->
    <div class="relative shrink-0 z-1 bg-bg-elevated/80 backdrop-blur border-t border-border">
      <!-- 消息输入 -->
      <div class="px-3 py-2">
        <el-input
          v-model="inputContent"
          placeholder="说点什么..."
          :disabled="!hallStore.connected"
          @keydown="handleKeydown"
          maxlength="200"
          size="small"
          class="message-input"
        >
          <template #append>
            <el-button
              :disabled="!hallStore.connected || !inputContent.trim()"
              @click="handleSend"
              class="!px-2 !bg-gradient-to-r !from-accent-primary !to-accent-secondary !border-none !text-white !text-xs"
            >
              <i class="i-ph-paper-plane-tilt" />
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 底部工具栏 -->
      <div class="px-3 pb-2 flex items-center justify-between">
        <span class="text-[10px] text-text-muted"
          >{{ new Date().getHours() >= 12 ? '下午' : '上午' }}好</span
        >
        <div class="flex items-center gap-1">
          <button
            class="p-1 rounded hover:bg-bg-hover transition-colors"
            :class="{ 'text-warning': systemStore.theme === 'light' }"
            @click="systemStore.setTheme('light')"
            title="浅色模式"
          >
            <i class="i-ph-sun text-xs" />
          </button>
          <button
            class="p-1 rounded hover:bg-bg-hover transition-colors"
            :class="{ 'text-accent-primary': systemStore.theme === 'dark' }"
            @click="systemStore.setTheme('dark')"
            title="深色模式"
          >
            <i class="i-ph-moon text-xs" />
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑用户信息弹窗 -->
    <UserInfoDialog v-model="userInfoDialogVisible" />
  </div>
</template>

<style scoped>
.page-side {
  max-height: 100vh;
}

.section-card {
  background: var(--bg-card/60);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px;
}

.user-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-card:hover {
  box-shadow: var(--shadow-sm);
}

.message-input :deep(.el-input__wrapper) {
  background: var(--bg-secondary);
  box-shadow: none;
  border: 1px solid var(--border);
}

.message-input :deep(.el-input__wrapper:hover) {
  border-color: var(--accent-primary);
}

.message-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--accent-primary) / 20;
}

.message-input :deep(.el-input__inner) {
  color: var(--text);
  font-size: 12px;
}

.message-input :deep(.el-input__inner::placeholder) {
  color: var(--text-muted);
  font-size: 12px;
}

:deep(.game-dialog) {
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
}

:deep(.game-dialog .el-dialog__header) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

:deep(.game-dialog .el-dialog__body) {
  padding: 16px;
}
</style>
