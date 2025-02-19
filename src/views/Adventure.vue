<template>
  <div class="adventure-container">
    <a-row :gutter="16">
      <!-- 左侧地图列表 -->
      <a-col :span="8">
        <a-card title="历练地图">
          <a-list :data-source="availableMaps" :bordered="false">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card
                  :class="['map-card', { 'map-locked': !isMapAvailable(item) }]"
                  hoverable
                  @click="selectMap(item)"
                >
                  <template #title>
                    <span>{{ item.name }}</span>
                    <a-tag :color="getMapDifficultyColor(item.difficulty)" class="map-difficulty">
                      {{ item.difficulty }}
                    </a-tag>
                  </template>
                  <div class="map-info">
                    <p>{{ item.description }}</p>
                    <p>推荐境界：{{ item.recommendedRealm }}</p>
                    <p>可能掉落：
                      <a-tag v-for="drop in item.possibleDrops" :key="drop" color="blue">
                        {{ drop }}
                      </a-tag>
                    </p>
                  </div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- 右侧战斗区域 -->
      <a-col :span="16">
        <div v-if="!selectedMap" class="select-map-hint">
          <a-empty description="请选择一个历练地图" />
        </div>
        <div v-else>
          <a-card :title="selectedMap.name">
            <template v-if="!inBattle">
              <div class="map-detail">
                <p class="map-description">{{ selectedMap.description }}</p>
                <div class="map-monsters">
                  <h3>可能遇到的妖兽：</h3>
                  <a-list :data-source="selectedMap.monsters" :grid="{ gutter: 16, column: 2 }">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-card class="monster-card">
                          <template #title>
                            <span>{{ item.name }}</span>
                            <a-tag :color="getMonsterLevelColor(item.level)">
                              Level {{ item.level }}
                            </a-tag>
                          </template>
                          <p>{{ item.description }}</p>
                          <div class="monster-stats">
                            <p>生命值：{{ item.hp }}</p>
                            <p>攻击力：{{ item.attack }}</p>
                            <p>防御力：{{ item.defense }}</p>
                          </div>
                        </a-card>
                      </a-list-item>
                    </template>
                  </a-list>
                </div>
                <a-button type="primary" size="large" @click="startBattle" class="start-battle-btn">
                  开始历练
                </a-button>
              </div>
            </template>
            <template v-else>
              <battle-component
                :player="playerStats"
                :monster="currentMonster"
                @battle-end="handleBattleEnd"
                @retreat="handleRetreat"
              />
            </template>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/store'
import { message } from 'ant-design-vue'
import BattleComponent from '@/components/BattleComponent.vue'
import { adventureMaps } from '@/assets/mock/gameData'

const store = usePlayerStore()
const selectedMap = ref(null)
const inBattle = ref(false)
const currentMonster = ref(null)

// 根据玩家境界筛选可用地图
const availableMaps = computed(() => {
  return adventureMaps.map(map => ({
    ...map,
    available: isMapAvailable(map)
  }))
})

// 玩家战斗属性
const playerStats = computed(() => ({
  name: '玩家',
  level: store.level,
  realm: store.realm,
  ...store.combatStats
}))

// 检查地图是否可用
const isMapAvailable = (map) => {
  if (!map || !map.recommendedRealm || !store.realm) return false
  
  // 获取推荐境界的主要阶段（如"练气"、"筑基"、"金丹"）
  const recommendedRealm = map.recommendedRealm.split('期')[0]
  const playerRealm = store.realm.split('期')[0]
  
  // 获取境界等级
  const realmLevels = {
    '练气': 1,
    '筑基': 2,
    '金丹': 3,
    '元婴': 4,
    '化神': 5
  }
  
  return realmLevels[playerRealm] >= realmLevels[recommendedRealm]
}

// 选择地图
const selectMap = (map) => {
  if (!isMapAvailable(map)) {
    message.warning('你的境界还不足以探索此地图')
    return
  }
  selectedMap.value = map
  inBattle.value = false
  currentMonster.value = null
}

// 获取地图难度颜色
const getMapDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case '简单': return 'green'
    case '普通': return 'blue'
    case '困难': return 'orange'
    case '噩梦': return 'red'
    default: return 'default'
  }
}

// 获取妖兽等级颜色
const getMonsterLevelColor = (level) => {
  if (level <= 10) return 'green'
  if (level <= 20) return 'blue'
  if (level <= 30) return 'orange'
  return 'red'
}

// 开始战斗
const startBattle = () => {
  if (!selectedMap.value) return
  
  // 随机选择一个妖兽
  const randomIndex = Math.floor(Math.random() * selectedMap.value.monsters.length)
  currentMonster.value = selectedMap.value.monsters[randomIndex]
  inBattle.value = true
}

// 处理战斗结束
const handleBattleEnd = ({ victory, rewards }) => {
  if (victory) {
    store.addRewards(rewards)
    message.success('战斗胜利！获得了奖励！')
  } else {
    message.error('战斗失败！')
  }
  store.updateBattleStats(victory ? 'victory' : 'defeat')
  inBattle.value = false
  currentMonster.value = null
}

// 处理撤退
const handleRetreat = () => {
  store.updateBattleStats('retreat')
  message.info('成功撤退！')
  inBattle.value = false
  currentMonster.value = null
}
</script>

<style scoped>
.adventure-container {
  padding: 24px;
}

.map-card {
  margin-bottom: 16px;
  transition: all 0.3s;
}

.map-card:hover {
  transform: translateY(-2px);
}

.map-locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.map-locked:hover {
  transform: none;
}

.map-difficulty {
  float: right;
}

.map-info {
  font-size: 14px;
}

.select-map-hint {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-detail {
  text-align: center;
}

.map-description {
  font-size: 16px;
  margin-bottom: 24px;
}

.monster-card {
  margin-bottom: 16px;
}

.monster-stats {
  color: #666;
  font-size: 14px;
}

.start-battle-btn {
  margin-top: 24px;
}
</style>
