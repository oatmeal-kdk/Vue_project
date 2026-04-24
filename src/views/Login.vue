<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const submitting = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const handleSubmit = async () => {
  if (!form.email || !form.password) {
    window.alert('이메일과 비밀번호를 입력해주세요.')
    return
  }

  submitting.value = true

  try {
    await authStore.loginUser({ ...form })
    router.push('/tournaments')
  } catch {
    // Store error is rendered in the template.
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
    <div class="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
      <div class="mb-8">
        <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Sign In
        </p>
        <h1 class="text-3xl font-black tracking-tight text-white">로그인</h1>
        <p class="mt-3 text-sm text-slate-300">
          로그인한 사용자만 토너먼트 생성, 참가, 대진표 관리 기능을 사용할 수 있습니다.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="mb-2 block text-sm font-semibold text-slate-200">
            이메일
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="player@example.com"
          />
        </div>

        <div>
          <label for="password" class="mb-2 block text-sm font-semibold text-slate-200">
            비밀번호
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <p v-if="authStore.error" class="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {{ authStore.error }}
        </p>

        <button
          type="submit"
          class="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-300">
        계정이 없나요?
        <RouterLink to="/register" class="font-semibold text-cyan-300 transition hover:text-cyan-200">
          회원가입
        </RouterLink>
      </p>
    </div>
  </section>
</template>
