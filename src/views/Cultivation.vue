<template>
  <div class="cultivation-container">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="修炼状态">
          <a-descriptions :column="1">
            <a-descriptions-item label="当前境界">
              {{ playerStore.realm }} {{ playerStore.currentLevel }}
            </a-descriptions-item>
            <a-descriptions-item label="修为值">
              {{ playerStore.cultivation.toFixed(1) }}/{{ playerStore.maxCultivation }}
            </a-descriptions-item>
            <a-descriptions-item label="修炼速度">
              {{ playerStore.cultivationRate.toFixed(1) }}/秒
            </a-descriptions-item>
          </a-descriptions>
          <a-progress 
            :percent="(playerStore.cultivation / playerStore.maxCultivation) * 100" 
            status="active"
            :stroke-color="getProgressColor"
          />
          <div class="attributes">
            <p>力量：{{ playerStore.strength }}</p>
            <p>敏捷：{{ playerStore.agility }}</p>
            <p>灵力：{{ playerStore.spirit }}</p>
          </div>
          <div class="action-buttons">
            <a-button 
              type="primary" 
              @click="startCultivation" 
              :loading="isCultivating"
            >
              {{ isCultivating ? '修炼中...' : '开始修炼' }}
            </a-button>
            <a-button 
              type="primary" 
              danger 
              @click="tryBreakthrough"
              :disabled="playerStore.cultivation < playerStore.maxCultivation"
            >
              尝试突破 (成功率: {{ (playerStore.breakthroughRate * 100).toFixed(1) }}%)
            </a-button>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="8">
        <a-card title="修炼物品">
          <a-list :data-source="cultivationItems" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card :title="item.name" size="small">
                  <p>{{ item.description }}</p>
                  <a-button type="link" @click="useItem(item)">使用</a-button>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/store'
import { message } from 'ant-design-vue'

const playerStore = usePlayerStore()
const isCultivating = ref(false)
let cultivationInterval = null

// 计算进度条颜色
const getProgressColor = computed(() => {
  const percent = (playerStore.cultivation / playerStore.maxCultivation) * 100
  if (percent >= 100) return '#f50'  // 可以突破时显示红色
  if (percent >= 80) return '#ffa940'  // 接近突破时显示橙色
  return '#1890ff'  // 默认蓝色
})

// 过滤出修炼相关的物品
const cultivationItems = computed(() => {
  return playerStore.inventory.filter(item => 
    item.type === 'cultivation_pill' || 
    item.type === 'breakthrough_pill' || 
    item.type === 'spirit_stone'
  )
})

const startCultivation = () => {
  if (isCultivating.value) {
    clearInterval(cultivationInterval)
    isCultivating.value = false
    return
  }

  isCultivating.value = true
  cultivationInterval = setInterval(() => {
    playerStore.cultivate()
  }, 1000)
}

const tryBreakthrough = async () => {
  if (playerStore.cultivation >= playerStore.maxCultivation) {
    const result = playerStore.breakthrough()
    if (result.success) {
      message.success(result.message)
    } else {
      message.error(result.message)
    }
  }
}

const useItem = (item) => {
  playerStore.useItem(item)
  message.success(`使用了 ${item.name}`)
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (cultivationInterval) {
    clearInterval(cultivationInterval)
  }
})
</script>

<style scoped>
.cultivation-container {
  padding: 24px;
}
.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}
.attributes {
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
</style>
