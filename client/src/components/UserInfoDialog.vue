<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { updateUserInfo } from '@/api/user'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const userStore = useUserStore()

const newName = ref('')
const newAvatar = ref('')
const updating = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      newName.value = userStore.name || ''
      newAvatar.value = userStore.avatar || ''
    }
  }
)

function close() {
  emit('update:modelValue', false)
}

async function confirmUpdate() {
  const name = newName.value.trim()
  if (!name) return
  updating.value = true
  try {
    const res = await updateUserInfo(userStore.id, {
      name,
      avatar: newAvatar.value.trim() || undefined
    })
    if (res.code === 0) {
      userStore.setUserInfo({ name: res.data.name, avatar: res.data.avatar })
      ElMessage.success('用户信息修改成功')
      close()
    } else {
      ElMessage.error(res.message || '修改失败')
    }
  } catch {
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="编辑用户信息"
    width="340px"
    :append-to-body="true"
    class="game-dialog"
  >
    <div class="dialog-body flex flex-col gap-20">
      <!-- 头像预览 -->
      <div class="avatar-section flex flex-col items-center gap-12">
        <div class="avatar-wrap relative">
          <el-avatar :size="80" :src="newAvatar || undefined" class="dialog-avatar">
            {{ newName?.charAt(0) || userStore.name?.charAt(0) || '?' }}
          </el-avatar>
          <div class="level-badge">Lv.{{ userStore.level }}</div>
        </div>
        <el-input v-model="newAvatar" placeholder="头像图片 URL（选填）" clearable size="default">
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
      </div>

      <el-divider style="margin: 0; border-color: var(--border)" />

      <!-- 用户名 -->
      <div class="name-section flex flex-col gap-8">
        <label class="field-label font-13">用户名</label>
        <el-input
          v-model="newName"
          placeholder="请输入新用户名"
          maxlength="20"
          show-word-limit
          clearable
          size="large"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <template #footer>
      <el-button @click="close" class="dialog-btn font-medium">取消</el-button>
      <el-button
        type="primary"
        :loading="updating"
        :disabled="!newName.trim()"
        @click="confirmUpdate"
        class="dialog-btn dialog-btn--primary font-medium"
      >
        保存修改
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.avatar-section {
  .avatar-wrap {
    position: relative;
    display: inline-block;

    .dialog-avatar {
      background: var(--bg-secondary);
      border: 2px solid var(--border);
    }

    .level-badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      background: var(--accent-gradient);
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      border: 1px solid var(--bg-card);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
}

.name-section {
  .field-label {
    color: var(--text-secondary);
    font-weight: 600;
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
