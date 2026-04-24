import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/tournaments',
    },
    {
      path: '/tournaments',
      name: 'tournamentList',
      component: () => import('../views/TournamentList.vue'),
    },
    {
      path: '/tournaments/create',
      name: 'tournamentCreate',
      component: () => import('../views/TournamentCreate.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tournaments/:id',
      name: 'tournamentDetail',
      component: () => import('../views/TournamentDetail.vue'),
    },
    {
      path: '/tournaments/:id/participants',
      name: 'participants',
      component: () => import('../views/Participants.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tournaments/:id/bracket',
      name: 'bracket',
      component: () => import('../views/Bracket.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/matches/:id',
      name: 'match',
      component: () => import('../views/MatchDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      return to.meta.requiresAuth ? '/login' : true
    }
  }

  if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    return '/'
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/'
  }

  return true
})

export default router
