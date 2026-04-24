<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const submitting = ref(false)

const form = reactive({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleSubmit = async () => {
  if (!form.nickname || !form.email || !form.password || !form.confirmPassword) {
    window.alert('모든 항목을 입력해주세요.')
    return
  }

  if (form.password !== form.confirmPassword) {
    window.alert('비밀번호가 일치하지 않습니다.')
    return
  }

  submitting.value = true

  try {
    await authStore.registerUser({
      nickname: form.nickname,
      email: form.email,
      password: form.password,
    })
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
        <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
          Sign Up
        </p>
        <h1 class="text-3xl font-black tracking-tight text-white">회원가입</h1>
        <p class="mt-3 text-sm text-slate-300">
          닉네임과 계정을 등록하고 토너먼트 생성 및 참가 권한을 활성화하세요.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="nickname" class="mb-2 block text-sm font-semibold text-slate-200">
            닉네임
          </label>
          <input
            id="nickname"
            v-model="form.nickname"
            type="text"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="PlayerOne"
          />
        </div>

        <div>
          <label for="email" class="mb-2 block text-sm font-semibold text-slate-200">
            이메일
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
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
            class="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="mb-2 block text-sm font-semibold text-slate-200"
          >
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <p v-if="authStore.error" class="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {{ authStore.error }}
        </p>

        <button
          type="submit"
          class="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? '가입 중...' : '회원가입' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-300">
        이미 계정이 있나요?
        <RouterLink to="/login" class="font-semibold text-emerald-300 transition hover:text-emerald-200">
          로그인
        </RouterLink>
      </p>
    </div>
  </section>
</template>
