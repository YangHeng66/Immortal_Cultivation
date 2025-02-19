import { defineStore } from 'pinia'
import { realms, items } from '@/assets/mock/gameData'

// 计算修炼速度的基础值
const calculateCultivationRate = (realm, level, spirit) => {
  return (realm * 10 + level * 2 + spirit * 0.5)
}

// 计算装备加成
const calculateEquipmentBonus = (equipment) => {
  const bonus = {
    strength: 0,
    agility: 0,
    spirit: 0,
    cultivation_rate: 0,
    breakthrough_bonus: 0,
    attack: 0,
    defense: 0,
    criticalRate: 0,
    dodgeRate: 0
  }
  
  Object.values(equipment).forEach(item => {
    if (item && item.effect) {
      Object.entries(item.effect).forEach(([key, value]) => {
        if (key in bonus) {
          bonus[key] += value
        }
      })
    }
  })
  
  return bonus
}

// 计算突破成功率
const calculateBreakthroughRate = (state) => {
  // 基础成功率
  let baseRate = 0.1
  
  // 根据当前境界和等级调整
  baseRate += state.level * 0.02
  
  // 根据灵力属性调整
  baseRate += state.baseSpirit * 0.01
  
  // 考虑物品效果加成
  const breakthroughBoost = state.effects.find(
    effect => effect.type === 'breakthrough_boost'
  )
  if (breakthroughBoost) {
    baseRate += breakthroughBoost.value
  }
  
  // 限制成功率范围
  return Math.max(0.1, Math.min(0.9, baseRate))
}

// 计算修炼速度
const calculateCultivationRateNew = (state) => {
  // 基础修炼速度
  let baseRate = state.baseSpirit * 0.5 + state.level * 2
  
  // 考虑物品效果加成
  const cultivationBoost = state.effects.find(
    effect => effect.type === 'cultivation_boost'
  )
  if (cultivationBoost) {
    baseRate *= (1 + cultivationBoost.value)
  }
  
  return baseRate
}

// 玩家状态管理
export const usePlayerStore = defineStore('player', {
  state: () => ({
    name: '无名修士',
    level: 1,
    realm: '练气期一层',
    realmIndex: 0,
    cultivation: 0,
    maxCultivation: 100,
    spirit_stones: 100,
    
    // 基础属性
    baseStrength: 10,
    baseAgility: 10,
    baseSpirit: 10,
    
    // 装备
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    
    // 背包
    inventory: [
      items[0], // 青锋剑
      items[1], // 练气丹
      items[2], // 筑基丹
      items[3], // 灵石
      items[4], // 玄铁护甲
      items[5]  // 聚灵珠
    ],
    
    // 状态效果
    effects: [],
    
    // 战斗相关
    currentHp: 100,
    maxHp: 100,
    inBattle: false,
    battleExp: 0,
    
    // 战斗统计
    battleStats: {
      totalBattles: 0,
      victories: 0,
      defeats: 0,
      retreats: 0
    },
    
    breakthrough_bonus: 0, // 添加突破概率加成
    activeEffects: [], // 激活的效果列表
    cultivationRate: 0,
  }),

  getters: {
    // 获取当前境界名称
    currentRealm: (state) => {
      return state.realm
    },
    
    // 获取境界等级
    realmLevel: (state) => {
      const realms = {
        '练气期': 1,
        '筑基期': 2,
        '金丹期': 3,
        '元婴期': 4,
        '化神期': 5
      }
      const currentRealm = state.realm.split('期')[0] + '期'
      return realms[currentRealm] || 1
    },
    
    // 获取装备加成
    equipmentBonus: (state) => calculateEquipmentBonus(state.equipment),
    
    // 计算最终属性（基础+装备加成）
    strength: (state) => state.baseStrength + state.equipmentBonus.strength,
    agility: (state) => state.baseAgility + state.equipmentBonus.agility,
    spirit: (state) => state.baseSpirit + state.equipmentBonus.spirit,
    
    // 计算当前修炼速度（考虑装备和状态效果）
    cultivationRate: (state) => {
      let rate = calculateCultivationRate(state.realmIndex + 1, state.level, state.baseSpirit + state.equipmentBonus.spirit)
      
      // 计算装备加成
      rate *= (1 + state.equipmentBonus.cultivation_rate)
      
      // 计算状态效果加成
      const now = Date.now()
      state.effects.forEach(effect => {
        if (effect.type === 'cultivation_boost' && 
            now < effect.startTime + effect.duration * 1000) {
          rate *= (1 + effect.value)
        }
      })
      
      return rate
    },
    
    // 计算突破成功率
    breakthroughRate: (state) => calculateBreakthroughRate(state),
    
    // 计算战斗属性
    combatStats: (state) => {
      const equipmentBonus = calculateEquipmentBonus(state.equipment)
      return {
        attack: state.baseStrength * 2 + equipmentBonus.attack,
        defense: state.baseAgility * 1.5 + equipmentBonus.defense,
        maxHp: 100 + state.baseStrength * 10,
        criticalRate: state.baseAgility * 0.01 + equipmentBonus.criticalRate || 0,
        dodgeRate: state.baseAgility * 0.005 + equipmentBonus.dodgeRate || 0
      }
    }
  },
  
  actions: {
    // 修炼相关
    cultivate() {
      // 计算本次修炼获得的修为
      const gain = this.cultivationRate / 10
      this.cultivation += gain
      
      // 检查是否达到突破条件
      if (this.cultivation >= this.maxCultivation) {
        this.cultivation = this.maxCultivation
      }
    },
    
    // 境界突破
    async breakthrough() {
      const rate = this.breakthroughRate
      const success = Math.random() < rate
      
      if (success) {
        // 获取当前境界信息
        const [realm, level] = this.realm.split('期')
        const currentLevel = parseInt(level.replace('层', ''))
        
        // 更新境界和层数
        if (currentLevel < 9) {
          // 同境界升层
          this.realm = `${realm}期${currentLevel + 1}层`
        } else {
          // 进入下一个境界
          const nextRealm = {
            '练气': '筑基',
            '筑基': '金丹',
            '金丹': '元婴',
            '元婴': '化神'
          }[realm]
          
          if (nextRealm) {
            this.realm = `${nextRealm}期一层`
          }
        }
        
        // 重置修为和突破加成
        this.cultivation = 0
        this.breakthrough_bonus = 0
        
        // 提升基础属性
        this.baseStrength += Math.floor(Math.random() * 3) + 1
        this.baseAgility += Math.floor(Math.random() * 3) + 1
        this.baseSpirit += Math.floor(Math.random() * 3) + 1
        
        return {
          success: true,
          message: '突破成功！'
        }
      } else {
        // 突破失败，增加下次突破的成功率
        this.breakthrough_bonus += 0.05
        return {
          success: false,
          message: '突破失败，但获得了一些感悟，下次突破的成功率提高了！'
        }
      }
    },

    // 使用物品
    useItem(item) {
      // 检查物品是否存在于背包
      const itemIndex = this.inventory.findIndex(i => i.id === item.id)
      if (itemIndex === -1) {
        return {
          success: false,
          message: '物品不存在'
        }
      }

      // 检查使用条件
      if (item.requiredRealm && item.requiredRealm !== this.realm) {
        return {
          success: false,
          message: '境界不符，无法使用该物品'
        }
      }

      // 应用物品效果
      if (item.effects) {
        item.effects.forEach(effect => {
          this.addEffect({
            ...effect,
            startTime: Date.now()
          })
        })
      }

      // 从背包中移除物品
      this.inventory.splice(itemIndex, 1)

      return {
        success: true,
        message: `成功使用${item.name}`
      }
    },

    // 添加状态效果
    addEffect(effect) {
      // 检查是否已有同类效果
      const existingEffectIndex = this.effects.findIndex(e => e.type === effect.type)
      
      if (existingEffectIndex !== -1) {
        // 如果已存在同类效果，更新持续时间和效果值
        const existingEffect = this.effects[existingEffectIndex]
        const remainingTime = Math.max(0, 
          existingEffect.startTime + existingEffect.duration * 1000 - Date.now()
        )
        
        // 取较大的效果值和较长的持续时间
        this.effects[existingEffectIndex] = {
          ...effect,
          value: Math.max(effect.value, existingEffect.value),
          duration: Math.max(effect.duration, remainingTime / 1000)
        }
      } else {
        // 添加新效果
        this.effects.push(effect)
      }
    },

    // 移除过期效果
    removeExpiredEffects() {
      const now = Date.now()
      this.effects = this.effects.filter(effect => {
        return effect.startTime + effect.duration * 1000 > now
      })
    },

    // 获取效果加成值
    getEffectBonus(type) {
      let bonus = 0
      const now = Date.now()
      
      this.effects.forEach(effect => {
        if (effect.type === type && effect.startTime + effect.duration * 1000 > now) {
          bonus += effect.value
        }
      })
      
      return bonus
    },

    // 添加物品到背包
    addItem(item) {
      // 检查背包容量
      if (this.inventory.length >= 100) {
        return {
          success: false,
          message: '背包已满'
        }
      }

      this.inventory.push(item)
      return {
        success: true,
        message: `获得${item.name}`
      }
    },

    // 移除物品
    removeItem(itemId) {
      const index = this.inventory.findIndex(item => item.id === itemId)
      if (index !== -1) {
        this.inventory.splice(index, 1)
        return true
      }
      return false
    },

    // 装备物品
    equipItem(item, slot) {
      // 如果该位置已有装备，先卸下
      if (this.equipment[slot]) {
        this.addItem(this.equipment[slot])
      }
      this.equipment[slot] = item
      this.removeItem(item.id)
    },
    
    // 卸下装备
    unequipItem(slot) {
      if (this.equipment[slot]) {
        this.addItem(this.equipment[slot])
        this.equipment[slot] = null
      }
    },
    
    // 处理战斗奖励
    addRewards({ exp, items, spiritStones }) {
      // 添加经验
      this.battleExp += exp
      if (this.battleExp >= this.maxCultivation) {
        this.breakthrough()
      }
      
      // 添加物品
      if (items) {
        items.forEach(item => this.addItem(item))
      }
      
      // 添加灵石
      if (spiritStones) {
        this.spirit_stones += spiritStones
      }
    },
    
    // 更新战斗统计
    updateBattleStats(result) {
      this.battleStats.totalBattles++
      switch (result) {
        case 'victory':
          this.battleStats.victories++
          break
        case 'defeat':
          this.battleStats.defeats++
          break
        case 'retreat':
          this.battleStats.retreats++
          break
      }
    },
    
    // 重置战斗状态
    resetBattleState() {
      this.currentHp = this.maxHp
      this.inBattle = false
    },
    
    // 更新修炼和突破相关属性
    updateCultivationStats() {
      // 清理过期效果
      const now = Date.now()
      this.effects = this.effects.filter(
        effect => effect.endTime === -1 || effect.endTime > now
      )
      
      // 更新修炼速度和突破成功率
      this.cultivationRate = calculateCultivationRateNew(this)
      this.breakthroughRate = calculateBreakthroughRate(this)
    },
  }
})
