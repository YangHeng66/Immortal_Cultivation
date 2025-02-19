<template>
  <div class="battle-container">
    <a-card class="battle-card">
      <a-row :gutter="16">
        <!-- 玩家信息 -->
        <a-col :span="8">
          <div class="character-info player-info">
            <h2>{{ player.name }}</h2>
            <p>境界：{{ player.realm }}</p>
            <a-progress
              :percent="(player.currentHp / player.maxHp) * 100"
              :stroke-color="getHpColor(player.currentHp, player.maxHp)"
              class="hp-bar"
            />
            <p class="hp-text">生命值：{{ player.currentHp }}/{{ player.maxHp }}</p>
            <div class="stats">
              <p>攻击力：{{ player.attack }}</p>
              <p>防御力：{{ player.defense }}</p>
            </div>
          </div>
        </a-col>

        <!-- 战斗区域 -->
        <a-col :span="8">
          <div class="battle-area">
            <div class="battle-log">
              <div v-for="(log, index) in battleLogs" :key="index" :class="log.type">
                {{ log.message }}
              </div>
            </div>
            <div class="battle-actions" v-if="!battleEnded">
              <a-button-group>
                <a-button type="primary" @click="attack" :disabled="isPlayerTurn === false">
                  攻击
                </a-button>
                <a-button @click="defend" :disabled="isPlayerTurn === false">
                  防御
                </a-button>
                <a-button danger @click="retreat">
                  撤退
                </a-button>
              </a-button-group>
            </div>
            <div class="battle-result" v-else>
              <h2 :class="victory ? 'victory-text' : 'defeat-text'">
                {{ victory ? '战斗胜利！' : '战斗失败！' }}
              </h2>
              <div class="rewards" v-if="victory">
                <h3>获得奖励：</h3>
                <p v-for="(reward, index) in battleRewards" :key="index">
                  {{ reward.name }}: {{ reward.amount }}
                </p>
              </div>
              <a-button type="primary" @click="endBattle">
                返回
              </a-button>
            </div>
          </div>
        </a-col>

        <!-- 怪物信息 -->
        <a-col :span="8">
          <div class="character-info monster-info">
            <h2>{{ monster.name }}</h2>
            <p>等级：{{ monster.level }}</p>
            <a-progress
              :percent="(monster.currentHp / monster.maxHp) * 100"
              :stroke-color="getHpColor(monster.currentHp, monster.maxHp)"
              class="hp-bar"
            />
            <p class="hp-text">生命值：{{ monster.currentHp }}/{{ monster.maxHp }}</p>
            <div class="stats">
              <p>攻击力：{{ monster.attack }}</p>
              <p>防御力：{{ monster.defense }}</p>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const props = defineProps({
  player: {
    type: Object,
    required: true
  },
  monster: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['battle-end', 'retreat'])

// 战斗状态
const isPlayerTurn = ref(true)
const battleLogs = ref([])
const battleEnded = ref(false)
const victory = ref(false)
const battleRewards = ref([])
const playerState = ref({
  ...props.player,
  currentHp: props.player.hp,
  isDefending: false
})
const monsterState = ref({
  ...props.monster,
  currentHp: props.monster.hp,
  isDefending: false
})

// 计算伤害
const calculateDamage = (attacker, defender) => {
  const baseDamage = attacker.attack - defender.defense / 2
  const variation = baseDamage * 0.2 // 20%的伤害浮动
  const finalDamage = Math.max(
    1,
    Math.floor(baseDamage + (Math.random() * variation * 2 - variation))
  )
  return defender.isDefending ? Math.floor(finalDamage / 2) : finalDamage
}

// 获取生命值颜色
const getHpColor = (current, max) => {
  const percentage = (current / max) * 100
  if (percentage > 60) return '#52c41a'
  if (percentage > 30) return '#faad14'
  return '#f5222d'
}

// 添加战斗日志
const addBattleLog = (message, type = 'normal') => {
  battleLogs.value.push({ message, type })
  if (battleLogs.value.length > 5) {
    battleLogs.value.shift()
  }
}

// 玩家攻击
const attack = async () => {
  if (!isPlayerTurn.value || battleEnded.value) return

  const damage = calculateDamage(playerState.value, monsterState.value)
  monsterState.value.currentHp = Math.max(0, monsterState.value.currentHp - damage)
  addBattleLog(`你对${monsterState.value.name}造成了${damage}点伤害！`, 'player-action')

  if (monsterState.value.currentHp <= 0) {
    handleVictory()
    return
  }

  // 重置防御状态
  playerState.value.isDefending = false
  // 切换回合
  await nextTurn()
}

// 玩家防御
const defend = async () => {
  if (!isPlayerTurn.value || battleEnded.value) return

  playerState.value.isDefending = true
  addBattleLog('你进入了防御状态，下次受到的伤害减半！', 'player-action')
  
  // 切换回合
  await nextTurn()
}

// 怪物行动
const monsterAction = async () => {
  if (battleEnded.value) return

  const damage = calculateDamage(monsterState.value, playerState.value)
  playerState.value.currentHp = Math.max(0, playerState.value.currentHp - damage)
  addBattleLog(`${monsterState.value.name}对你造成了${damage}点伤害！`, 'monster-action')

  if (playerState.value.currentHp <= 0) {
    handleDefeat()
    return
  }

  // 重置防御状态
  monsterState.value.isDefending = false
  // 切换回合
  isPlayerTurn.value = true
}

// 下一回合
const nextTurn = async () => {
  isPlayerTurn.value = false
  // 延迟一下怪物行动，让玩家能看清战斗过程
  await new Promise(resolve => setTimeout(resolve, 1000))
  await monsterAction()
}

// 处理胜利
const handleVictory = () => {
  battleEnded.value = true
  victory.value = true
  // 计算奖励
  const expReward = Math.floor(Math.random() * 50) + 50
  const spiritStones = Math.floor(Math.random() * 30) + 20
  battleRewards.value = [
    { name: '经验', amount: expReward },
    { name: '灵石', amount: spiritStones }
  ]
  addBattleLog('战斗胜利！', 'victory')
}

// 处理失败
const handleDefeat = () => {
  battleEnded.value = true
  victory.value = false
  addBattleLog('战斗失败！', 'defeat')
}

// 结束战斗
const endBattle = () => {
  emit('battle-end', {
    victory: victory.value,
    rewards: victory.value ? battleRewards.value : null
  })
}

// 撤退
const retreat = () => {
  emit('retreat')
}

// 初始化战斗
onMounted(() => {
  addBattleLog(`你遇到了${monsterState.value.name}！`, 'system')
  addBattleLog('战斗开始！', 'system')
})
</script>

<style scoped>
.battle-container {
  width: 100%;
}

.battle-card {
  background: #f5f5f5;
}

.character-info {
  text-align: center;
  padding: 16px;
  border-radius: 4px;
  background: white;
}

.player-info {
  border-left: 4px solid #1890ff;
}

.monster-info {
  border-left: 4px solid #ff4d4f;
}

.hp-bar {
  margin: 8px 0;
}

.hp-text {
  margin: 4px 0;
  font-size: 14px;
}

.stats {
  text-align: left;
  margin-top: 8px;
}

.battle-area {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 4px;
}

.battle-log {
  width: 100%;
  height: 150px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding: 8px;
  background: #f8f8f8;
  border-radius: 4px;
}

.battle-actions {
  margin-top: 16px;
}

.battle-result {
  text-align: center;
}

.victory-text {
  color: #52c41a;
}

.defeat-text {
  color: #ff4d4f;
}

.rewards {
  margin: 16px 0;
}

/* 战斗日志样式 */
.player-action {
  color: #1890ff;
}

.monster-action {
  color: #ff4d4f;
}

.system {
  color: #722ed1;
}

.victory {
  color: #52c41a;
  font-weight: bold;
}

.defeat {
  color: #ff4d4f;
  font-weight: bold;
}
</style>
