<template>
  <a-layout class="game-layout">
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        style="height: 100%"
      >
        <a-menu-item key="home">
          <router-link to="/">主页</router-link>
        </a-menu-item>
        <a-menu-item key="cultivation">
          <router-link to="/cultivation">修炼</router-link>
        </a-menu-item>
        <a-menu-item key="backpack">
          <router-link to="/backpack">背包</router-link>
        </a-menu-item>
        <a-menu-item key="adventure">
          <router-link to="/adventure">历练</router-link>
        </a-menu-item>
        <a-menu-item key="pet">
          <router-link to="/pet">宠物</router-link>
        </a-menu-item>
        <a-menu-item key="alchemy">
          <router-link to="/alchemy">炼丹</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content style="padding: 0 24px; min-height: 280px">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedKeys = ref([route.path.split('/')[1] || 'home'])
</script>

<style scoped>
.game-layout {
  min-height: 100vh;
}
</style>
