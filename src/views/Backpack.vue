<template>
  <div class="backpack-container">
    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="背包">
          <template #extra>
            <span class="spirit-stones">灵石：{{ playerStore.spirit_stones }}</span>
          </template>
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="all" tab="全部">
              <div class="item-grid">
                <a-card v-for="item in playerStore.inventory" 
                       :key="item.id"
                       :title="item.name"
                       size="small"
                       :class="getQualityClass(item)">
                  <template #extra>
                    <a-button type="link" @click="handleUseItem(item)">
                      {{ getItemActionText(item) }}
                    </a-button>
                  </template>
                  <p>{{ item.description }}</p>
                  <div class="item-effects">
                    <p v-for="(value, key) in item.effect" :key="key">
                      {{ getEffectDescription(key, value) }}
                    </p>
                  </div>
                </a-card>
              </div>
            </a-tab-pane>
            <a-tab-pane key="equipment" tab="装备">
              <div class="item-grid">
                <a-card v-for="item in equipmentItems" 
                       :key="item.id"
                       :title="item.name"
                       size="small"
                       :class="getQualityClass(item)">
                  <template #extra>
                    <a-button type="link" @click="handleUseItem(item)">装备</a-button>
                  </template>
                  <p>{{ item.description }}</p>
                  <div class="item-effects">
                    <p v-for="(value, key) in item.effect" :key="key">
                      {{ getEffectDescription(key, value) }}
                    </p>
                  </div>
                </a-card>
              </div>
            </a-tab-pane>
            <a-tab-pane key="pills" tab="丹药">
              <div class="item-grid">
                <a-card v-for="item in pillItems" 
                       :key="item.id"
                       :title="item.name"
                       size="small"
                       :class="getQualityClass(item)">
                  <template #extra>
                    <a-button type="link" @click="handleUseItem(item)">使用</a-button>
                  </template>
                  <p>{{ item.description }}</p>
                  <div class="item-effects">
                    <p v-for="(value, key) in item.effect" :key="key">
                      {{ getEffectDescription(key, value) }}
                    </p>
                  </div>
                </a-card>
              </div>
            </a-tab-pane>
            <a-tab-pane key="materials" tab="材料">
              <div class="item-grid">
                <a-card v-for="item in materialItems" 
                       :key="item.id"
                       :title="item.name"
                       size="small"
                       :class="getQualityClass(item)">
                  <template #extra>
                    <a-button type="link" @click="handleUseItem(item)">使用</a-button>
                  </template>
                  <p>{{ item.description }}</p>
                  <div class="item-effects">
                    <p v-for="(value, key) in item.effect" :key="key">
                      {{ getEffectDescription(key, value) }}
                    </p>
                  </div>
                </a-card>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      
      <a-col :span="8">
        <a-card title="装备栏">
          <div class="equipment-slots">
            <div v-for="slot in equipmentSlots" :key="slot.type" class="equipment-slot">
              <template v-if="slot.item">
                <a-card :title="slot.item.name" size="small" :class="getQualityClass(slot.item)">
                  <template #extra>
                    <a-button type="link" @click="unequipItem(slot.type)">卸下</a-button>
                  </template>
                  <p>{{ slot.item.description }}</p>
                  <div class="item-effects">
                    <p v-for="(value, key) in slot.item.effect" :key="key">
                      {{ getEffectDescription(key, value) }}
                    </p>
                  </div>
                </a-card>
              </template>
              <template v-else>
                <div class="empty-slot">
                  <p>{{ slot.name }}</p>
                  <p class="slot-hint">未装备</p>
                </div>
              </template>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/store'
import { message } from 'ant-design-vue'
import { ItemTypes, ItemQualities } from '@/assets/mock/gameData'

const playerStore = usePlayerStore()
const activeTab = ref('all')

// 装备栏位定义
const equipmentSlots = ref([
  { type: ItemTypes.WEAPON, name: '武器', item: null },
  { type: ItemTypes.ARMOR, name: '防具', item: null },
  { type: ItemTypes.ACCESSORY, name: '饰品', item: null }
])

// 物品分类
const equipmentItems = computed(() => 
  playerStore.inventory.filter(item => 
    [ItemTypes.WEAPON, ItemTypes.ARMOR, ItemTypes.ACCESSORY].includes(item.type)
  )
)

const pillItems = computed(() => 
  playerStore.inventory.filter(item => 
    [ItemTypes.CULTIVATION_PILL, ItemTypes.BREAKTHROUGH_PILL].includes(item.type)
  )
)

const materialItems = computed(() => 
  playerStore.inventory.filter(item => 
    [ItemTypes.MATERIAL, ItemTypes.SPIRIT_STONE].includes(item.type)
  )
)

// 获取物品品质样式
const getQualityClass = (item) => {
  const quality = Object.entries(ItemQualities).find(([_, value]) => 
    value.name === item.quality.name
  )
  return quality ? `quality-${quality[0].toLowerCase()}` : ''
}

// 获取物品操作文本
const getItemActionText = (item) => {
  switch (item.type) {
    case ItemTypes.WEAPON:
    case ItemTypes.ARMOR:
    case ItemTypes.ACCESSORY:
      return '装备'
    case ItemTypes.CULTIVATION_PILL:
    case ItemTypes.BREAKTHROUGH_PILL:
    case ItemTypes.SPIRIT_STONE:
      return '使用'
    default:
      return ''
  }
}

// 获取效果描述
const getEffectDescription = (key, value) => {
  const effectMap = {
    attack: '攻击力',
    defense: '防御力',
    spirit: '灵力',
    cultivation_rate: '修炼速度',
    breakthrough_boost: '突破概率',
    cultivation_boost: '修炼效率'
  }
  
  const effectName = effectMap[key] || key
  if (typeof value === 'number') {
    return `${effectName}: +${value}`
  }
  return `${effectName}: ${value}`
}

// 处理物品使用
const handleUseItem = (item) => {
  switch (item.type) {
    case ItemTypes.WEAPON:
    case ItemTypes.ARMOR:
    case ItemTypes.ACCESSORY:
      equipItem(item)
      break
    default:
      playerStore.useItem(item)
      message.success(`使用了 ${item.name}`)
  }
}

// 装备物品
const equipItem = (item) => {
  // 检查是否满足装备要求
  if (item.requirements) {
    if (playerStore.realmIndex < item.requirements.realm || 
        playerStore.level < item.requirements.level) {
      message.error('境界不足，无法装备')
      return
    }
  }
  
  // 找到对应的装备栏位
  const slot = equipmentSlots.value.find(slot => slot.type === item.type)
  if (slot) {
    // 如果原来有装备，先卸下
    if (slot.item) {
      playerStore.addItem(slot.item)
    }
    // 装备新物品
    slot.item = item
    // 从背包中移除
    playerStore.removeItem(item.id)
    message.success(`成功装备 ${item.name}`)
  }
}

// 卸下装备
const unequipItem = (slotType) => {
  const slot = equipmentSlots.value.find(slot => slot.type === slotType)
  if (slot && slot.item) {
    playerStore.addItem(slot.item)
    slot.item = null
    message.success('成功卸下装备')
  }
}
</script>

<style scoped>
.backpack-container {
  padding: 24px;
}

.spirit-stones {
  color: #722ed1;
  font-weight: bold;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.item-card {
  border: 1px solid #d9d9d9;
}

.item-effects {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.equipment-slots {
  display: grid;
  gap: 16px;
}

.empty-slot {
  padding: 16px;
  text-align: center;
  background: #f5f5f5;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
}

.slot-hint {
  color: #999;
  font-size: 12px;
}

/* 物品品质样式 */
.quality-common {
  border-color: #a1a1a1;
}

.quality-uncommon {
  border-color: #1a8f1a;
}

.quality-rare {
  border-color: #0070dd;
}

.quality-epic {
  border-color: #a335ee;
}

.quality-legendary {
  border-color: #ff8000;
}
</style>
