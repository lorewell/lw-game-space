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
  <div class="page-side h-full flex flex-col">
    <!-- 顶部标题 -->
    <div class="side-header">
      <div class="header-decoration">
        <div class="deco-line"></div>
        <div class="deco-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="deco-line"></div>
      </div>
      <h2 class="side-title">游戏大厅</h2>
      <div class="online-indicator" :class="{ connected: hallStore.connected }">
        <span class="indicator-dot"></span>
        <span class="indicator-text">{{ hallStore.connected ? '在线' : '连接中' }}</span>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="user-card">
      <div class="card-glow"></div>
      <div class="user-main">
        <!-- 头像 -->
        <div class="avatar-container" @click="openAvatarDialog">
          <el-avatar :size="56" :src="userStore.avatar || undefined" class="user-avatar">
            {{ userStore.name?.charAt(0) || '?' }}
          </el-avatar>
          <div class="avatar-level">
            <span>Lv.{{ userStore.level }}</span>
          </div>
          <div class="avatar-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="user-info">
          <div class="user-name-row">
            <span class="user-name">{{ userStore.name || '未登录' }}</span>
            <button class="edit-btn" @click="openNameDialog" title="修改名称">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          <div class="user-id">ID: {{ userStore.id?.slice(0, 12) }}...</div>
        </div>
      </div>
    </div>

    <!-- 修改用户名弹窗 -->
    <el-dialog v-model="nameDialogVisible" title="修改用户名" width="300px" :append-to-body="true" class="game-dialog">
      <div class="dialog-content">
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
        <el-button @click="nameDialogVisible = false" class="dialog-btn">取消</el-button>
        <el-button type="primary" :loading="nameUpdating" :disabled="!newName.trim()" @click="confirmUpdateName" class="dialog-btn dialog-btn--primary">
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改头像弹窗 -->
    <el-dialog v-model="avatarDialogVisible" title="修改头像" width="340px" :append-to-body="true" class="game-dialog">
      <div class="dialog-content avatar-preview">
        <el-avatar :size="80" :src="newAvatar || undefined">
          {{ userStore.name?.charAt(0) || '?' }}
        </el-avatar>
        <el-input v-model="newAvatar" placeholder="粘贴头像图片 URL" clearable size="large" />
      </div>
      <template #footer>
        <el-button @click="avatarDialogVisible = false" class="dialog-btn">取消</el-button>
        <el-button type="primary" :loading="avatarUpdating" @click="confirmUpdateAvatar" class="dialog-btn dialog-btn--primary">
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 公告区 -->
    <div class="notice-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span>系统公告</span>
      </div>
      <div class="notice-content">
        <div v-if="systemStore.newSpaceNotice" class="notice-item notice-item--highlight">
          <span class="notice-tag">新</span>
          <span>{{ systemStore.newSpaceNotice }}</span>
        </div>
        <div v-if="systemStore.newUpdateNotice" class="notice-item">
          <span class="notice-tag notice-tag--update">更</span>
          <span>{{ systemStore.newUpdateNotice }}</span>
        </div>
        <div v-if="!systemStore.newSpaceNotice && !systemStore.newUpdateNotice" class="notice-empty">
          暂无公告
        </div>
      </div>
    </div>

    <!-- 在线玩家 -->
    <div class="online-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span>在线玩家</span>
        <span class="online-count">{{ hallStore.onlineUsers.length }}</span>
      </div>
      <div class="online-list">
        <div
          v-for="user in hallStore.onlineUsers.slice(0, 8)"
          :key="user.sessionId"
          class="online-item"
        >
          <el-avatar :size="28" :src="user.avatar || undefined" class="online-avatar">
            {{ user.name?.charAt(0) }}
          </el-avatar>
          <span class="online-name">{{ user.name }}</span>
          <el-tag size="small" type="warning" class="online-level">
            Lv.{{ user.level }}
          </el-tag>
        </div>
        <div v-if="hallStore.onlineUsers.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <span>暂无玩家在线</span>
        </div>
        <div v-if="hallStore.onlineUsers.length > 8" class="more-users">
          还有 {{ hallStore.onlineUsers.length - 8 }} 位玩家...
        </div>
      </div>
    </div>

    <!-- 消息区域 -->
    <div class="chat-section">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>大厅聊天</span>
      </div>

      <!-- 消息列表 -->
      <div class="message-list" ref="messageListRef">
        <div
          v-for="(msg, index) in hallStore.messages"
          :key="index"
          class="message-item"
        >
          <span class="message-name">{{ msg.userName }}</span>
          <span class="message-colon">:</span>
          <span class="message-content">{{ msg.content }}</span>
        </div>
        <div v-if="hallStore.messages.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>暂无消息，快来聊天吧~</span>
        </div>
      </div>

      <!-- 消息输入 -->
      <div class="message-input-area">
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
              class="send-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </el-button>
          </template>
        </el-input>
        <div v-if="!hallStore.connected" class="connection-hint">
          <span class="hint-dot"></span>
          正在连接服务器...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-side {
  width: 340px;
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-left: 1px solid var(--border);
  padding: 0;
  overflow: hidden;
}

// 顶部标题
.side-header {
  padding: 20px 16px 16px;
  text-align: center;
  background: linear-gradient(180deg, var(--bg-elevated) 0%, transparent 100%);
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;

  .deco-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  }

  .deco-icon {
    width: 24px;
    height: 24px;
    color: var(--accent-primary);
    filter: drop-shadow(0 0 6px var(--accent-glow));
    animation: pulse 2s ease-in-out infinite;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.side-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.online-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--bg-card);
  border-radius: 12px;
  font-size: 11px;
  color: var(--text-muted);
  border: 1px solid var(--border);

  .indicator-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
  }

  &.connected {
    border-color: var(--success);
    .indicator-dot {
      background: var(--success);
      animation: pulse 1.5s ease-in-out infinite;
    }
    .indicator-text {
      color: var(--success);
    }
  }
}

// 用户卡片
.user-card {
  position: relative;
  margin: 0 16px 16px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;

  .card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent-gradient);
  }
}

.user-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;

  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.user-avatar {
  border: 2px solid var(--accent-primary);
  background: var(--bg-elevated);
  font-size: 20px;
  font-weight: 600;
  box-shadow: 0 0 20px var(--accent-glow);
}

.avatar-level {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--warning);
  color: #000;
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  opacity: 0;
  transition: opacity var(--transition-fast);

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.edit-btn {
  width: 24px;
  height: 24px;
  padding: 4px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
  }
}

.user-id {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  font-family: var(--font-mono);
}

// 通用区块头部
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;

  .section-icon {
    width: 14px;
    height: 14px;
    color: var(--accent-primary);
  }
}

// 公告区
.notice-section {
  margin: 0 16px 12px;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.notice-content {
  margin-top: 8px;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }

  &--highlight {
    border-left: 2px solid var(--warning);
    color: var(--text);
  }
}

.notice-tag {
  flex-shrink: 0;
  padding: 2px 6px;
  background: var(--error);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;

  &--update {
    background: var(--info);
  }
}

.notice-empty {
  text-align: center;
  padding: 12px;
  color: var(--text-muted);
  font-size: 12px;
}

// 在线玩家
.online-section {
  margin: 0 16px 12px;
  max-height: 160px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.online-count {
  margin-left: auto;
  padding: 2px 8px;
  background: var(--accent-primary);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 10px;
}

.online-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.online-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-elevated);
  }
}

.online-avatar {
  border: 1px solid var(--border-light);
  background: var(--bg-elevated);
  font-size: 11px;
}

.online-name {
  flex: 1;
  font-size: 12px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.online-level {
  font-size: 10px;
}

.more-users {
  text-align: center;
  padding: 8px;
  font-size: 11px;
  color: var(--text-muted);
}

// 聊天区
.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 16px 16px;
  min-height: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  min-height: 120px;
}

.message-item {
  padding: 6px 0;
  font-size: 12px;
  line-height: 1.5;
  animation: slideUp 0.3s ease-out;

  &:not(:last-child) {
    border-bottom: 1px dashed var(--border);
  }
}

.message-name {
  color: var(--accent-secondary);
  font-weight: 500;
}

.message-colon {
  color: var(--text-muted);
}

.message-content {
  color: var(--text-secondary);
  word-break: break-all;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: var(--text-muted);
  font-size: 12px;

  .empty-icon {
    width: 32px;
    height: 32px;
    opacity: 0.5;
  }
}

// 消息输入
.message-input-area {
  margin-top: 12px;
}

.message-input {
  :deep(.el-input__wrapper) {
    background: var(--bg-card);
    border: 1px solid var(--border);
    box-shadow: none;
    transition: all var(--transition-fast);

    &:hover, &:focus {
      border-color: var(--accent-primary);
    }
  }

  :deep(.el-input__inner) {
    color: var(--text);
    &::placeholder {
      color: var(--text-muted);
    }
  }
}

.send-btn {
  background: var(--accent-primary) !important;
  border-color: var(--accent-primary) !important;
  color: white !important;
  padding: 0 12px !important;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    background: var(--accent-primary-dark-2) !important;
  }

  &:disabled {
    background: var(--bg-elevated) !important;
    border-color: var(--border) !important;
    color: var(--text-muted) !important;
  }
}

.connection-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted);

  .hint-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--warning);
    animation: pulse 1s ease-in-out infinite;
  }
}

// Dialog 样式
:deep(.game-dialog) {
  .el-dialog {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .el-dialog__header {
    border-bottom: 1px solid var(--border);
    padding: 16px 20px;
  }

  .el-dialog__title {
    color: var(--text);
    font-weight: 600;
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    border-top: 1px solid var(--border);
    padding: 16px 20px;
  }

  .el-input__wrapper {
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    box-shadow: none;

    &:hover, &:focus {
      border-color: var(--accent-primary);
    }
  }

  .el-input__inner {
    color: var(--text);
    &::placeholder {
      color: var(--text-muted);
    }
  }
}

.dialog-content {
  &.avatar-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
}

.dialog-btn {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text);

  &:hover {
    background: var(--bg-card);
    border-color: var(--accent-primary);
  }

  &--primary {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;

    &:hover {
      background: var(--accent-primary-dark-2);
    }
  }
}

// 动画
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
