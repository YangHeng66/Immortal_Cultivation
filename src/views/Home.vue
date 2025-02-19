<template>
  <div class="home-container">
    <a-card title="修仙者信息" style="width: 300px">
      <template #extra><a href="#">详情</a></template>
      <a-descriptions :column="1">
        <a-descriptions-item label="境界">{{ playerStore.realm }}</a-descriptions-item>
        <a-descriptions-item label="修为">
          {{ playerStore.cultivation }}/{{ playerStore.maxCultivation }}
        </a-descriptions-item>
        <a-descriptions-item label="灵石">{{ playerStore.spirit_stones }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/store'

const playerStore = usePlayerStore()
</script>

<style scoped>
.home-container {
  padding: 24px;
}
</style>
