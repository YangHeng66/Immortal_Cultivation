import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'GameLayout',
    component: () => import('@/layouts/GameLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/cultivation',
        name: 'Cultivation',
        component: () => import('@/views/Cultivation.vue')
      },
      {
        path: '/backpack',
        name: 'Backpack',
        component: () => import('@/views/Backpack.vue')
      },
      {
        path: '/adventure',
        name: 'Adventure',
        component: () => import('@/views/Adventure.vue')
      },
      {
        path: '/pet',
        name: 'Pet',
        component: () => import('@/views/Pet.vue')
      },
      {
        path: '/alchemy',
        name: 'Alchemy',
        component: () => import('@/views/Alchemy.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
