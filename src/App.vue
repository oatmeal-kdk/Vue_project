<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

import { useAuthStore } from './stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const nickname = computed(() => authStore.user?.nickname || '')

const handleLogout = () => {
  authStore.logoutUser()
  router.push('/')
}

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      // Router guard handles invalid tokens on protected routes.
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <header class="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-6">
          <RouterLink
            to="/"
            class="text-lg font-black uppercase tracking-[0.25em] text-cyan-300 transition hover:text-cyan-200"
          >
            Arena
          </RouterLink>
          <nav class="hidden items-center gap-4 text-sm font-medium text-slate-300 sm:flex">
            <RouterLink to="/tournaments" class="transition hover:text-white">
              토너먼트
            </RouterLink>
            <RouterLink
              v-if="isLoggedIn"
              to="/tournaments/create"
              class="transition hover:text-white"
            >
              토너먼트 생성
            </RouterLink>
          </nav>
        </div>

        <div v-if="!isLoggedIn" class="flex items-center gap-3">
          <RouterLink
            to="/login"
            class="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            로그인
          </RouterLink>
          <RouterLink
            to="/register"
            class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            회원가입
          </RouterLink>
        </div>

        <div v-else class="flex items-center gap-3">
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100">
            {{ nickname }}
          </span>
          <button
            type="button"
            class="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
            @click="handleLogout"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <RouterView />
  </div>
</template>
