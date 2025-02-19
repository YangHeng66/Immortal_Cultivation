// 境界设定
export const realms = [
  { name: '炼气期', levels: 9 },
  { name: '筑基期', levels: 9 },
  { name: '金丹期', levels: 9 },
  { name: '元婴期', levels: 9 },
  { name: '化神期', levels: 9 }
]

// 物品类型定义
export const itemTypes = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  PILL: 'pill',
  MATERIAL: 'material',
  SPIRIT_STONE: 'spirit_stone'
}

// 物品品质定义
export const itemQualities = {
  COMMON: {
    name: '普通',
    color: '#999999'
  },
  UNCOMMON: {
    name: '优秀',
    color: '#1890ff'
  },
  RARE: {
    name: '稀有',
    color: '#722ed1'
  },
  EPIC: {
    name: '史诗',
    color: '#eb2f96'
  },
  LEGENDARY: {
    name: '传说',
    color: '#faad14'
  }
}

// 物品效果类型
export const effectTypes = {
  CULTIVATION_BOOST: 'cultivation_boost',      // 提升修炼速度
  BREAKTHROUGH_BOOST: 'breakthrough_boost',    // 提升突破概率
  STRENGTH_BOOST: 'strength_boost',           // 提升力量
  AGILITY_BOOST: 'agility_boost',            // 提升敏捷
  SPIRIT_BOOST: 'spirit_boost',              // 提升灵力
  HEALING: 'healing',                        // 恢复生命值
  DAMAGE_BOOST: 'damage_boost',              // 提升伤害
  DEFENSE_BOOST: 'defense_boost'             // 提升防御
}

// 丹药数据
export const pills = [
  {
    id: 'cultivation_pill_1',
    name: '聚气丹',
    type: itemTypes.PILL,
    quality: 'COMMON',
    description: '提升修炼速度的基础丹药',
    requiredRealm: '练气期',
    effects: [
      {
        type: effectTypes.CULTIVATION_BOOST,
        value: 0.2,
        duration: 3600
      }
    ],
    price: 100
  },
  {
    id: 'breakthrough_pill_1',
    name: '凝元丹',
    type: itemTypes.PILL,
    quality: 'UNCOMMON',
    description: '提升突破概率的丹药',
    requiredRealm: '练气期',
    effects: [
      {
        type: effectTypes.BREAKTHROUGH_BOOST,
        value: 0.1,
        duration: 1800
      }
    ],
    price: 500
  },
  {
    id: 'healing_pill_1',
    name: '回气丹',
    type: itemTypes.PILL,
    quality: 'COMMON',
    description: '恢复生命值的丹药',
    effects: [
      {
        type: effectTypes.HEALING,
        value: 50,
        duration: 0
      }
    ],
    price: 50
  }
]

// 装备数据
export const equipment = [
  {
    id: 'weapon_1',
    name: '青锋剑',
    type: itemTypes.WEAPON,
    quality: 'UNCOMMON',
    description: '一把锋利的长剑，适合练气期修士使用',
    requiredRealm: '练气期',
    effects: [
      {
        type: effectTypes.DAMAGE_BOOST,
        value: 10,
        duration: -1
      }
    ],
    price: 1000
  },
  {
    id: 'armor_1',
    name: '灵纹甲',
    type: itemTypes.ARMOR,
    quality: 'UNCOMMON',
    description: '刻有防护灵纹的护甲',
    requiredRealm: '练气期',
    effects: [
      {
        type: effectTypes.DEFENSE_BOOST,
        value: 15,
        duration: -1
      }
    ],
    price: 1000
  }
]

// 材料数据
export const materials = [
  {
    id: 'material_1',
    name: '灵草',
    type: itemTypes.MATERIAL,
    quality: 'COMMON',
    description: '常见的灵草，可用于炼丹',
    price: 10
  },
  {
    id: 'material_2',
    name: '妖兽内丹',
    type: itemTypes.MATERIAL,
    quality: 'UNCOMMON',
    description: '妖兽体内的能量结晶，是重要的炼丹材料',
    price: 100
  }
]

// 灵石数据
export const spiritStones = [
  {
    id: 'spirit_stone_1',
    name: '下品灵石',
    type: itemTypes.SPIRIT_STONE,
    quality: 'COMMON',
    description: '含有少量灵气的灵石',
    value: 100,
    price: 100
  },
  {
    id: 'spirit_stone_2',
    name: '中品灵石',
    type: itemTypes.SPIRIT_STONE,
    quality: 'UNCOMMON',
    description: '含有较多灵气的灵石',
    value: 1000,
    price: 1000
  }
]

// 物品数据
export const items = [
  {
    id: 1,
    name: '青锋剑',
    type: itemTypes.WEAPON,
    quality: itemQualities.UNCOMMON,
    description: '一把锋利的长剑，略微泛着青光',
    effect: {
      attack: 10,
      spirit: 5
    },
    requirements: {
      realm: 0,
      level: 3
    }
  },
  {
    id: 2,
    name: '练气丹',
    type: itemTypes.CULTIVATION_PILL,
    quality: itemQualities.COMMON,
    description: '服用后可增加修炼速度',
    effect: {
      type: 'cultivation_boost',
      value: 0.3,
      duration: 3600 // 1小时
    }
  },
  {
    id: 3,
    name: '筑基丹',
    type: itemTypes.BREAKTHROUGH_PILL,
    quality: itemQualities.RARE,
    description: '服用后可提高突破成功率',
    effect: {
      value: 0.2
    }
  },
  {
    id: 4,
    name: '灵石',
    type: itemTypes.SPIRIT_STONE,
    quality: itemQualities.COMMON,
    description: '蕴含精纯灵力的石头，可用于修炼',
    effect: {
      value: 100
    }
  },
  {
    id: 5,
    name: '玄铁护甲',
    type: itemTypes.ARMOR,
    quality: itemQualities.UNCOMMON,
    description: '用玄铁打造的护甲，能提供不错的防护',
    effect: {
      defense: 15,
      spirit: 3
    },
    requirements: {
      realm: 0,
      level: 5
    }
  },
  {
    id: 6,
    name: '聚灵珠',
    type: itemTypes.ACCESSORY,
    quality: itemQualities.RARE,
    description: '能够聚集天地灵气的宝珠',
    effect: {
      spirit: 8,
      cultivation_rate: 0.1
    },
    requirements: {
      realm: 1,
      level: 1
    }
  }
]

// 宠物数据
export const pets = [
  {
    id: 1,
    name: '火灵兽',
    description: '带有火属性的灵兽',
    abilities: ['火球术', '火焰护盾'],
    growthRate: 1.2
  },
  {
    id: 2,
    name: '风翼兽',
    description: '擅长飞行的灵兽',
    abilities: ['疾风术', '风之护佑'],
    growthRate: 1.1
  }
]

// 丹方数据
export const alchemyRecipes = [
  {
    id: 1,
    name: '聚气丹',
    materials: ['龙血草', '灵石'],
    difficulty: 1,
    successRate: 0.8
  },
  {
    id: 2,
    name: '筑基丹',
    materials: ['千年灵芝', '龙血草', '灵石'],
    difficulty: 3,
    successRate: 0.5
  }
]

// 奇遇事件
export const events = [
  {
    id: 1,
    name: '灵药园',
    description: '发现一片灵药园，可以采集珍贵药材',
    choices: [
      { text: '仔细采集', result: 'get_materials' },
      { text: '迅速离开', result: 'safe_escape' }
    ]
  },
  {
    id: 2,
    name: '秘境入口',
    description: '发现一个神秘的秘境入口',
    choices: [
      { text: '进入探索', result: 'enter_secret_realm' },
      { text: '原路返回', result: 'safe_escape' }
    ]
  }
]

// 历练地图数据
export const adventureMaps = [
  {
    id: 1,
    name: '练气山脉',
    description: '适合练气期修士历练的山脉，常有低阶妖兽出没',
    requiredRealm: 0,
    monsters: ['wolf', 'bear', 'snake'],
    rewards: {
      exp: [50, 100],
      items: ['common_treasure', 'spirit_stone'],
      dropRate: 0.3
    }
  },
  {
    id: 2,
    name: '灵药园',
    description: '有许多灵药的园地，但也有不少妖兽守护',
    requiredRealm: 0,
    monsters: ['herb_guardian', 'poison_spider', 'herb_ape'],
    rewards: {
      exp: [80, 150],
      items: ['herb', 'spirit_stone', 'uncommon_treasure'],
      dropRate: 0.4
    }
  },
  {
    id: 3,
    name: '筑基秘境',
    description: '充满机缘的秘境，但危险也比较大',
    requiredRealm: 1,
    monsters: ['fire_beast', 'thunder_bird', 'rock_golem'],
    rewards: {
      exp: [200, 400],
      items: ['rare_treasure', 'spirit_stone', 'breakthrough_pill'],
      dropRate: 0.5
    }
  },
  {
    id: 4,
    name: '青木林',
    description: '位于山脚下的一片茂密森林，适合初入修仙之人历练。',
    difficulty: '简单',
    recommendedRealm: '练气期',
    possibleDrops: ['青木剑', '培元丹', '灵草'],
    monsters: [
      {
        id: 1,
        name: '青木狼',
        description: '栖息在青木林中的灵狼，速度敏捷。',
        level: 5,
        hp: 100,
        attack: 15,
        defense: 8,
        drops: ['狼牙', '狼皮', '培元丹']
      },
      {
        id: 2,
        name: '藤蔓精',
        description: '由百年藤蔓诞生的植物精怪，防御较高。',
        level: 8,
        hp: 150,
        attack: 12,
        defense: 15,
        drops: ['藤蔓', '木灵珠', '灵草']
      }
    ]
  },
  {
    id: 5,
    name: '灵石矿洞',
    description: '蕴含丰富灵石的矿洞，但也潜伏着各种危险的妖兽。',
    difficulty: '普通',
    recommendedRealm: '筑基期',
    possibleDrops: ['下品灵石', '灵铁剑', '聚气丹'],
    monsters: [
      {
        id: 3,
        name: '石甲兽',
        description: '浑身覆盖着坚硬石甲的妖兽，防御极高。',
        level: 15,
        hp: 300,
        attack: 25,
        defense: 30,
        drops: ['石甲', '妖兽内丹', '下品灵石']
      },
      {
        id: 4,
        name: '晶岩蝎',
        description: '生活在矿洞中的毒蝎，攻击带有毒性。',
        level: 18,
        hp: 200,
        attack: 35,
        defense: 20,
        drops: ['蝎毒', '晶岩', '聚气丹']
      }
    ]
  },
  {
    id: 6,
    name: '火焰谷',
    description: '常年被火焰环绕的峡谷，是较为危险的历练之地。',
    difficulty: '困难',
    recommendedRealm: '金丹期',
    possibleDrops: ['火灵剑', '结丹丹', '火灵石'],
    monsters: [
      {
        id: 5,
        name: '火焰狮',
        description: '浑身缭绕着火焰的狮型妖兽，攻击力极强。',
        level: 25,
        hp: 500,
        attack: 50,
        defense: 35,
        drops: ['火灵珠', '狮鬃', '结丹丹']
      },
      {
        id: 6,
        name: '岩浆巨蟒',
        description: '生活在岩浆中的巨大蟒蛇，防御和攻击都很高。',
        level: 28,
        hp: 600,
        attack: 45,
        defense: 40,
        drops: ['蛇胆', '火灵石', '火灵草']
      }
    ]
  }
]

// 怪物数据
export const monsters = {
  // 练气山脉怪物
  wolf: {
    name: '灵狼',
    level: 1,
    hp: 100,
    attack: 15,
    defense: 5,
    description: '带有一丝灵气的野狼，速度较快'
  },
  bear: {
    name: '黑熊',
    level: 2,
    hp: 200,
    attack: 25,
    defense: 15,
    description: '力大无穷的黑熊，防御力较高'
  },
  snake: {
    name: '青纹蛇',
    level: 3,
    hp: 80,
    attack: 35,
    defense: 8,
    description: '毒性较强的蛇类，攻击力较高'
  },
  
  // 灵药园怪物
  herb_guardian: {
    name: '守药兽',
    level: 4,
    hp: 150,
    attack: 20,
    defense: 20,
    description: '守护灵药的灵兽，各项属性较为平衡'
  },
  poison_spider: {
    name: '毒眼蜘蛛',
    level: 4,
    hp: 120,
    attack: 40,
    defense: 10,
    description: '剧毒蜘蛛，攻击力极高'
  },
  herb_ape: {
    name: '采药猿',
    level: 5,
    hp: 180,
    attack: 30,
    defense: 25,
    description: '喜欢采集灵药的灵猿，综合实力较强'
  },
  
  // 筑基秘境怪物
  fire_beast: {
    name: '火灵兽',
    level: 8,
    hp: 300,
    attack: 50,
    defense: 30,
    description: '浑身冒着火焰的灵兽，攻击力惊人'
  },
  thunder_bird: {
    name: '雷鸟',
    level: 8,
    hp: 250,
    attack: 60,
    defense: 20,
    description: '带有雷电之力的灵鸟，攻击力极高'
  },
  rock_golem: {
    name: '岩石巨人',
    level: 9,
    hp: 500,
    attack: 40,
    defense: 50,
    description: '身体坚硬如岩石的巨人，防御力惊人'
  },
  
  // 青木林怪物
  qingmu_wolf: {
    name: '青木狼',
    level: 5,
    hp: 100,
    attack: 15,
    defense: 8,
    description: '栖息在青木林中的灵狼，速度敏捷。'
  },
  tengran_jing: {
    name: '藤蔓精',
    level: 8,
    hp: 150,
    attack: 12,
    defense: 15,
    description: '由百年藤蔓诞生的植物精怪，防御较高。'
  },
  
  // 灵石矿洞怪物
  shijia_shou: {
    name: '石甲兽',
    level: 15,
    hp: 300,
    attack: 25,
    defense: 30,
    description: '浑身覆盖着坚硬石甲的妖兽，防御极高。'
  },
  jingyan_xie: {
    name: '晶岩蝎',
    level: 18,
    hp: 200,
    attack: 35,
    defense: 20,
    description: '生活在矿洞中的毒蝎，攻击带有毒性。'
  },
  
  // 火焰谷怪物
  huoyan_shi: {
    name: '火焰狮',
    level: 25,
    hp: 500,
    attack: 50,
    defense: 35,
    description: '浑身缭绕着火焰的狮型妖兽，攻击力极强。'
  },
  yanjiang_ju: {
    name: '岩浆巨蟒',
    level: 28,
    hp: 600,
    attack: 45,
    defense: 40,
    description: '生活在岩浆中的巨大蟒蛇，防御和攻击都很高。'
  }
}

// 战利品数据
export const treasures = {
  common_treasure: {
    name: '灵物袋',
    description: '装有一些普通灵物的袋子',
    items: [
      { type: itemTypes.SPIRIT_STONE, count: [10, 50], weight: 70 },
      { type: itemTypes.MATERIAL, count: [1, 3], weight: 30 }
    ]
  },
  uncommon_treasure: {
    name: '灵药篮',
    description: '装有一些灵药的篮子',
    items: [
      { type: itemTypes.CULTIVATION_PILL, count: [1, 2], weight: 40 },
      { type: itemTypes.SPIRIT_STONE, count: [50, 100], weight: 40 },
      { type: itemTypes.MATERIAL, count: [2, 4], weight: 20 }
    ]
  },
  rare_treasure: {
    name: '秘境宝箱',
    description: '秘境中发现的宝箱，里面可能有珍贵物品',
    items: [
      { type: itemTypes.BREAKTHROUGH_PILL, count: [1, 1], weight: 20 },
      { type: itemTypes.SPIRIT_STONE, count: [100, 300], weight: 40 },
      { type: itemTypes.WEAPON, count: [1, 1], weight: 20 },
      { type: itemTypes.ARMOR, count: [1, 1], weight: 20 }
    ]
  }
}
