<template>
  <div class="pet-container">
    <a-card title="宠物系统">
      <a-tabs>
        <a-tab-pane key="1" tab="我的宠物">
          <a-list :data-source="playerStore.pets" :grid="{ gutter: 16, column: 3 }">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card :title="item.name">
                  <p>{{ item.description }}</p>
                  <p>能力：{{ item.abilities.join(', ') }}</p>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/store'

const playerStore = usePlayerStore()
</script>

<style scoped>
.pet-container {
  padding: 24px;
}
</style>
