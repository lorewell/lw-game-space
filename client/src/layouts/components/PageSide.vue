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
    // 第一次登录，生成随机 ID
    userId = `user_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`
    localStorage.setItem('userId', userId)
  }

  // 请求后端获取用户信息（不存在则自动创建）
  const res = await getUserInfo(userId)
  if (res.code === 0 && res.data) {
    userStore.setUserInfo({
      id: res.data.id || userId,
      name: res.data.name,
      avatar: res.data.avatar,
      level: res.data.level
    })
  } else {
    // 降级：直接用本地 ID
    userStore.setUserInfo({ id: userId, name: userId.slice(0, 8) })
  }

  hallStore.connect()
}

// -------- 修改用户名 --------
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

// -------- 修改头像 --------
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
  <div class="page-side h-full flex flex-col p-12 box-border overflow-hidden">
    <div class="side-title font-15 font-bold text-center p-t-8 p-b-12">大鸟转转转酒吧</div>

    <!-- 用户信息 -->
    <div class="user-info flex items-center gap-10 p-t-8 p-b-12">
      <!-- 头像（可点击修改） -->
      <div class="avatar-wrap" @click="openAvatarDialog">
        <el-avatar :size="40" :src="userStore.avatar || undefined">
          {{ userStore.name?.charAt(0) || '?' }}
        </el-avatar>
        <div class="avatar-mask">
          <el-icon><Camera /></el-icon>
        </div>
      </div>
      <div class="user-meta flex flex-col gap-4">
        <div class="name-row flex items-center gap-6">
          <span class="name font-14 font-medium">{{ userStore.name || '未登录' }}</span>
          <el-icon class="edit-icon" @click="openNameDialog"><EditPen /></el-icon>
        </div>
        <div class="level">
          <el-tag size="small" type="warning">Lv.{{ userStore.level }}</el-tag>
        </div>
      </div>
    </div>

    <!-- 修改用户名弹窗 -->
    <el-dialog v-model="nameDialogVisible" title="修改用户名" width="280px" :append-to-body="true">
      <el-input
        v-model="newName"
        placeholder="请输入新用户名"
        maxlength="20"
        show-word-limit
        clearable
      />
      <template #footer>
        <el-button @click="nameDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="nameUpdating"
          :disabled="!newName.trim()"
          @click="confirmUpdateName"
          >确认</el-button
        >
      </template>
    </el-dialog>

    <!-- 修改头像弹窗 -->
    <el-dialog v-model="avatarDialogVisible" title="修改头像" width="320px" :append-to-body="true">
      <div class="avatar-preview-wrap flex flex-col items-center gap-12">
        <el-avatar :size="64" :src="newAvatar || undefined">
          {{ userStore.name?.charAt(0) || '?' }}
        </el-avatar>
        <el-input v-model="newAvatar" placeholder="粘贴头像图片 URL" clearable />
      </div>
      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="avatarUpdating" @click="confirmUpdateAvatar"
          >确认</el-button
        >
      </template>
    </el-dialog>

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

  .avatar-wrap {
    position: relative;
    cursor: pointer;
    flex-shrink: 0;

    .avatar-mask {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover .avatar-mask {
      opacity: 1;
    }
  }

  .name {
    color: var(--el-text-color-primary);
  }

  .edit-icon {
    cursor: pointer;
    color: var(--el-text-color-placeholder);
    font-size: 13px;
    transition: color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }
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
