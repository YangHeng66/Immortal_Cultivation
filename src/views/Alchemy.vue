<template>
  <div class="alchemy-container">
    <a-card title="炼丹房">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="丹方列表">
            <a-list :data-source="playerStore.alchemyRecipes">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-card :title="item.name">
                    <p>难度：{{ item.difficulty }}</p>
                    <p>成功率：{{ item.successRate * 100 }}%</p>
                    <p>所需材料：{{ item.materials.join(', ') }}</p>
                  </a-card>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/store'

const playerStore = usePlayerStore()
</script>

<style scoped>
.alchemy-container {
  padding: 24px;
}
</style>
