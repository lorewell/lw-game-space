<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'
import { useHallStore } from '@/stores/hall'
import { getUserInfo, updateUserInfo } from '@/api/user'

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

// 修改用户名
const nameDialogVisible = ref(false)
const newName = ref('')
const nameUpdating = ref(false)

function openNameDialog() {
  newName.value = userStore.name || ''
  nameDialogVisible.value = true
}

async function confirmUpdateName() {
  const name = newName.value.trim()
  if (!name) return
  nameUpdating.value = true
  try {
    const res = await updateUserInfo(userStore.id, { name })
    if (res.code === 0) {
      userStore.setUserInfo({ name: res.data.name })
      ElMessage.success('用户名修改成功')
      nameDialogVisible.value = false
    } else {
      ElMessage.error(res.message || '修改失败')
    }
  } catch {
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    nameUpdating.value = false
  }
}

// 修改头像
const avatarDialogVisible = ref(false)
const newAvatar = ref('')
const avatarUpdating = ref(false)

function openAvatarDialog() {
  newAvatar.value = userStore.avatar || ''
  avatarDialogVisible.value = true
}

async function confirmUpdateAvatar() {
  avatarUpdating.value = true
  try {
    const res = await updateUserInfo(userStore.id, { avatar: newAvatar.value.trim() })
    if (res.code === 0) {
      userStore.setUserInfo({ avatar: res.data.avatar })
      ElMessage.success('头像修改成功')
      avatarDialogVisible.value = false
    } else {
      ElMessage.error(res.message || '修改失败')
    }
  } catch {
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    avatarUpdating.value = false
  }
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
  <div class="page-side h-full flex flex-col w-340 border-l border-[var(--border)]">
    <!-- 顶部标题 (固定) -->
    <div class="side-header shrink-0 p-t-20 p-x-16 p-b-16 text-center">
      <div class="header-decoration flex items-center justify-center gap-12 m-b-12">
        <div class="deco-line flex-1 h-1"></div>
        <div class="deco-icon w-24 h-24 flex items-center justify-center">
          <el-icon :size="20"><Star /></el-icon>
        </div>
        <div class="deco-line flex-1 h-1"></div>
      </div>
      <h2 class="side-title font-18 font-600 m-0 m-b-8">游戏大厅</h2>
      <div
        class="online-indicator inline-flex items-center gap-6 p-y-4 p-x-12 font-11 border border-[var(--border)]"
        :class="{ connected: hallStore.connected }"
      >
        <span class="indicator-dot w-6 h-6"></span>
        <span class="indicator-text">{{ hallStore.connected ? '在线' : '连接中' }}</span>
      </div>
    </div>

    <!-- 中间滚动区域 -->
    <div v-scrollbar class="flex-1 min-h-0">
      <div class="side-content p-b-16">
        <!-- 用户信息 -->
        <div
          class="user-card relative m-x-16 m-b-20 p-16 border border-[var(--border)] overflow-hidden"
        >
          <div class="card-glow absolute w-100 h-100 pointer-events-none opacity-10"></div>
          <div class="user-main flex items-center gap-16 relative z-1">
            <!-- 头像 -->
            <div class="avatar-container relative cursor-pointer" @click="openAvatarDialog">
              <el-avatar
                :size="56"
                :src="userStore.avatar || undefined"
                class="user-avatar border-2 border-[var(--border)] transition-all-300"
              >
                {{ userStore.name?.charAt(0) || '?' }}
              </el-avatar>
              <div
                class="avatar-level absolute p-y-2 p-x-6 font-10 font-bold border border-[var(--bg-card)]"
              >
                <span>Lv.{{ userStore.level }}</span>
              </div>
              <div
                class="avatar-overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity-300"
              >
                <el-icon :size="20" color="white"><Camera /></el-icon>
              </div>
            </div>

            <!-- 用户信息 -->
            <div class="user-info flex-1 min-w-0">
              <div class="user-name-row flex items-center gap-8 m-b-4">
                <span class="user-name font-15 font-600 truncate">{{
                  userStore.name || '未登录'
                }}</span>
                <button
                  class="edit-btn p-4 border-none bg-transparent cursor-pointer flex items-center justify-center"
                  @click="openNameDialog"
                  title="修改名称"
                >
                  <el-icon :size="14"><Edit /></el-icon>
                </button>
              </div>
              <div class="user-id font-11">ID: {{ userStore.id?.slice(0, 12) }}...</div>
            </div>
          </div>
        </div>

        <!-- 公告区 -->
        <div class="notice-section m-b-24">
          <div class="section-header flex items-center gap-8 p-x-16 p-b-12 font-14 font-600">
            <el-icon class="section-icon" :size="16"><Bell /></el-icon>
            <span>系统公告</span>
          </div>
          <div class="notice-content m-x-16 flex flex-col gap-10">
            <div
              v-if="systemStore.newSpaceNotice"
              class="notice-item notice-item--highlight flex items-center gap-10 p-y-10 p-x-12 font-12 border border-[var(--border)] transition-all-300"
            >
              <span class="notice-tag p-y-2 p-x-6 font-10 font-bold shrink-0">新</span>
              <span>{{ systemStore.newSpaceNotice }}</span>
            </div>
            <div
              v-if="systemStore.newUpdateNotice"
              class="notice-item flex items-center gap-10 p-y-10 p-x-12 font-12 border border-[var(--border)] transition-all-300"
            >
              <span class="notice-tag notice-tag--update p-y-2 p-x-6 font-10 font-bold shrink-0"
                >更</span
              >
              <span>{{ systemStore.newUpdateNotice }}</span>
            </div>
            <div
              v-if="!systemStore.newSpaceNotice && !systemStore.newUpdateNotice"
              class="notice-empty p-20 text-center font-12 border border-dashed border-[var(--border)]"
            >
              暂无公告
            </div>
          </div>
        </div>

        <!-- 在线玩家 -->
        <div class="online-section m-b-24">
          <div class="section-header flex items-center gap-8 p-x-16 p-b-12 font-14 font-600">
            <el-icon class="section-icon" :size="16"><User /></el-icon>
            <span>在线玩家</span>
            <span class="online-count m-l-auto font-10 p-y-2 p-x-8">{{
              hallStore.onlineUsers.length
            }}</span>
          </div>
          <div class="online-list p-x-16 flex flex-wrap gap-8">
            <div
              v-for="user in hallStore.onlineUsers.slice(0, 8)"
              :key="user.sessionId"
              class="online-item flex items-center gap-8 p-y-6 p-x-10 border border-[var(--border)] transition-all-200"
            >
              <el-avatar :size="28" :src="user.avatar || undefined" class="online-avatar">
                {{ user.name?.charAt(0) }}
              </el-avatar>
              <span class="online-name font-11 truncate">{{ user.name }}</span>
              <el-tag size="small" type="warning" class="online-level border-none h-18 font-9">
                Lv.{{ user.level }}
              </el-tag>
            </div>
            <div
              v-if="hallStore.onlineUsers.length === 0"
              class="empty-state flex-1 flex flex-col items-center justify-center p-20 gap-12"
            >
              <el-icon class="empty-icon opacity-50" :size="32"><ChatDotRound /></el-icon>
              <span class="font-12">暂无玩家在线</span>
            </div>
            <div
              v-if="hallStore.onlineUsers.length > 8"
              class="more-users w-full text-center font-11 p-8 text-[var(--text-muted)]"
            >
              还有 {{ hallStore.onlineUsers.length - 8 }} 位玩家...
            </div>
          </div>
        </div>

        <!-- 聊天区 -->
        <div class="chat-section flex-1 flex flex-col min-h-200 m-b-24">
          <div class="section-header flex items-center gap-8 p-x-16 p-b-12 font-14 font-600">
            <el-icon class="section-icon" :size="16"><ChatDotRound /></el-icon>
            <span>大厅聊天</span>
          </div>

          <!-- 消息列表 -->
          <div
            class="message-list flex-1 p-x-16 flex flex-col gap-8 overflow-y-auto"
            ref="messageListRef"
          >
            <div
              v-for="(msg, index) in hallStore.messages"
              :key="index"
              class="message-item p-y-6 p-x-10 font-12 border border-[var(--border)] break-all"
            >
              <span class="message-name font-bold color-[var(--accent-primary)]">{{
                msg.userName
              }}</span>
              <span class="message-colon color-[var(--text-muted)] m-x-2">:</span>
              <span class="message-content color-[var(--text)]">{{ msg.content }}</span>
            </div>
            <div
              v-if="hallStore.messages.length === 0"
              class="empty-state flex-1 flex flex-col items-center justify-center p-20 gap-12"
            >
              <el-icon class="empty-icon opacity-50" :size="32"><ChatDotRound /></el-icon>
              <span class="font-12">暂无消息，快来聊天吧~</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部功能区 (固定) -->
    <div class="side-footer shrink-0 border-t border-[var(--border)]">
      <!-- 消息输入 -->
      <div class="message-input-area p-t-16 p-x-16 p-b-12 relative">
        <el-input
          v-model="inputContent"
          placeholder="说点什么..."
          :disabled="!hallStore.connected"
          @keydown="handleKeydown"
          maxlength="200"
          size="default"
          class="message-input"
        >
          <template #append>
            <el-button
              :disabled="!hallStore.connected || !inputContent.trim()"
              @click="handleSend"
              class="send-btn bg-transparent border-none p-0 h-full flex items-center justify-center"
            >
              <el-icon class="color-white" :size="16"><Promotion /></el-icon>
            </el-button>
          </template>
        </el-input>
        <div
          v-if="!hallStore.connected"
          class="connection-hint absolute left-16 right-16 flex items-center justify-center gap-6 p-4 font-10 border border-[var(--border)] -translate-y-1/2"
        >
          <span class="hint-dot w-4 h-4 rounded-full"></span>
          正在连接服务器...
        </div>
      </div>

      <div
        class="w-full p-x-14 p-y-8 flex items-center justify-between font-12 color-[var(--text-muted)] border-t border-[var(--border)]"
      >
        <div>下午好，现在是16:00</div>
        <div class="flex items-center gap-8">
          <el-icon
            class="cursor-pointer transition-colors hover:color-[var(--warning)]"
            :class="{ 'color-[var(--warning)]': systemStore.theme === 'light' }"
            @click="systemStore.setTheme('light')"
          >
            <Sunny />
          </el-icon>
          <el-icon
            class="cursor-pointer transition-colors hover:color-[var(--accent-primary)]"
            :class="{ 'color-[var(--accent-primary)]': systemStore.theme === 'dark' }"
            @click="systemStore.setTheme('dark')"
          >
            <Moon />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 修改用户名弹窗 -->
    <el-dialog
      v-model="nameDialogVisible"
      title="修改用户名"
      width="300px"
      :append-to-body="true"
      class="game-dialog"
    >
      <div class="dialog-content flex flex-col gap-16">
        <el-input
          v-model="newName"
          placeholder="请输入新用户名"
          maxlength="20"
          show-word-limit
          clearable
          size="large"
        />
      </div>
      <template #footer>
        <el-button @click="nameDialogVisible = false" class="dialog-btn font-500">取消</el-button>
        <el-button
          type="primary"
          :loading="nameUpdating"
          :disabled="!newName.trim()"
          @click="confirmUpdateName"
          class="dialog-btn dialog-btn--primary font-500"
        >
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改头像弹窗 -->
    <el-dialog
      v-model="avatarDialogVisible"
      title="修改头像"
      width="340px"
      :append-to-body="true"
      class="game-dialog"
    >
      <div class="dialog-content avatar-preview flex flex-col gap-16 items-center">
        <el-avatar :size="80" :src="newAvatar || undefined">
          {{ userStore.name?.charAt(0) || '?' }}
        </el-avatar>
        <el-input v-model="newAvatar" placeholder="粘贴头像图片 URL" clearable size="large" />
      </div>
      <template #footer>
        <el-button @click="avatarDialogVisible = false" class="dialog-btn font-500">取消</el-button>
        <el-button
          type="primary"
          :loading="avatarUpdating"
          @click="confirmUpdateAvatar"
          class="dialog-btn dialog-btn--primary font-500"
        >
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.page-side {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);

  .side-header {
    background: linear-gradient(180deg, var(--bg-elevated) 0%, transparent 100%);

    .header-decoration {
      .deco-line {
        background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
      }

      .deco-icon {
        color: var(--accent-primary);
        filter: drop-shadow(0 0 6px var(--accent-glow));
        animation: pulse 2s ease-in-out infinite;
      }
    }

    .side-title {
      color: var(--text);
      letter-spacing: 2px;
    }

    .online-indicator {
      background: var(--bg-card);
      border-radius: 12px;
      color: var(--text-muted);

      .indicator-dot {
        border-radius: 50%;
        background: var(--text-muted);
        transition: all 0.3s ease;
      }

      &.connected {
        color: var(--success);
        border-color: rgba(16, 185, 129, 0.2);

        .indicator-dot {
          background: var(--success);
          box-shadow: 0 0 8px var(--success);
        }
      }
    }
  }

  .user-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);

    .card-glow {
      top: -50px;
      right: -50px;
      background: var(--accent-gradient);
      filter: blur(40px);
    }

    .user-main {
      .avatar-container {
        .user-avatar {
          background: var(--bg-secondary);

          &:hover {
            border-color: var(--accent-primary);
          }
        }

        .avatar-level {
          bottom: -4px;
          right: -4px;
          background: var(--accent-gradient);
          color: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .avatar-overlay {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 50%;
          color: white;
        }

        &:hover {
          .avatar-overlay {
            opacity: 1;
          }
        }
      }

      .user-info {
        .user-name {
          color: var(--text);
        }

        .edit-btn {
          color: var(--text-muted);

          &:hover {
            color: var(--accent-primary);
          }
        }

        .user-id {
          color: var(--text-secondary);
          font-family: var(--font-mono);
          letter-spacing: 0.5px;
        }
      }
    }
  }

  .section-header {
    color: var(--text);

    .section-icon {
      color: var(--accent-primary);
    }
  }

  .notice-section {
    .notice-item {
      background: var(--bg-elevated);
      border-radius: 8px;
      color: var(--text-secondary);

      .notice-tag {
        border-radius: 4px;
        color: white;
        background: var(--accent-gradient);

        &--update {
          background: var(--success-gradient);
        }
      }

      &--highlight {
        border-color: var(--accent-primary);
        background: rgba(124, 58, 237, 0.05);
        color: var(--text);
      }

      &:hover {
        transform: translateX(4px);
      }
    }

    .notice-empty {
      color: var(--text-muted);
      background: var(--bg-card);
      border-radius: 8px;
    }
  }

  .online-section {
    .online-count {
      background: var(--bg-secondary);
      border-radius: 10px;
      color: var(--text-muted);
    }

    .online-item {
      background: var(--bg-card);
      border-radius: 16px;

      .online-name {
        color: var(--text-secondary);
      }

      .online-level {
        background: rgba(251, 191, 36, 0.1);
        color: var(--warning);
        border-radius: 10px;
        line-height: 16px;
      }

      &:hover {
        border-color: var(--accent-primary);
        background: var(--bg-elevated);
      }
    }
  }

  .chat-section {
    .message-list {
      .message-item {
        background: var(--bg-card);
        border-radius: 8px;
        line-height: 1.5;
      }
    }
  }

  .empty-state {
    color: var(--text-muted);
  }
}

.side-footer {
  background: var(--bg-elevated);

  .message-input-area {
    .message-input {
      :deep(.el-input-group__append) {
        background: var(--accent-primary);
        color: white;
        border: none;
        padding: 0 12px;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 0.9;
        }
      }

      :deep(.el-input__wrapper) {
        background: var(--bg-secondary);
        box-shadow: none;
        border: 1px solid var(--border);

        &.is-focus {
          border-color: var(--accent-primary);
        }
      }
    }

    .connection-hint {
      background: var(--bg-secondary);
      border-radius: 4px;
      color: var(--text-muted);

      .hint-dot {
        background: var(--warning);
        animation: pulse 1s infinite;
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

:deep(.game-dialog) {
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xl);

  .el-dialog__header {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid var(--border);

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
    }
  }

  .el-dialog__body {
    padding: 24px 20px;
  }

  .el-dialog__footer {
    padding: 0 20px 20px;
    border-top: none;
  }

  .dialog-btn {
    border-radius: 8px;

    &--primary {
      background: var(--accent-gradient);
      border: none;
      box-shadow: 0 4px 12px var(--accent-glow);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px var(--accent-glow);
      }
    }
  }
}
</style>
