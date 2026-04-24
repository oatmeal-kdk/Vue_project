<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { createTournament } from '../api/tournamentApi'

const router = useRouter()
const submitting = ref(false)

const form = reactive({
  title: '',
  game: '',
  description: '',
  maxParticipants: '',
  format: 'single_elimination',
  startDate: '',
  visibility: 'public',
})

const gameOptions = [
  'League of Legends',
  'Valorant',
  'Overwatch',
  'PUBG',
  'StarCraft',
  '기타',
]

const participantOptions = [4, 8, 16, 32, 64]

const formatOptions = [
  { label: 'Single Elimination', value: 'single_elimination' },
  { label: 'Double Elimination', value: 'double_elimination' },
  { label: 'Round Robin', value: 'round_robin' },
]

const handleSubmit = async () => {
  if (!form.title || !form.game || !form.maxParticipants || !form.startDate) {
    window.alert('필수 항목을 모두 입력해 주세요.')
    return
  }

  submitting.value = true

  try {
    await createTournament({
      ...form,
      maxParticipants: Number(form.maxParticipants),
    })
    router.push('/tournaments')
  } catch (error) {
    console.error(error)
    window.alert('토너먼트 생성에 실패했습니다.')
  } finally {
    submitting.value = false
  }
}

const goToTournaments = () => {
  router.push('/tournaments')
}
</script>

<template>
  <section class="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl">
      <div class="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
        <div class="border-b border-white/10 bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-transparent px-6 py-8 sm:px-8">
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Tournament Manager
          </p>
          <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
            토너먼트 생성
          </h1>
          <p class="mt-3 text-sm text-slate-300 sm:text-base">
            새로운 온라인 게임 토너먼트를 등록하고 참가자를 모집할 수 있습니다.
          </p>
        </div>

        <form class="space-y-6 px-6 py-8 sm:px-8" @submit.prevent="handleSubmit">
          <div>
            <label for="title" class="mb-2 block text-sm font-semibold text-slate-200">
              토너먼트 제목
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="예: Spring Valorant Masters"
              class="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
            />
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label for="game" class="mb-2 block text-sm font-semibold text-slate-200">
                게임 종류
              </label>
              <select
                id="game"
                v-model="form.game"
                class="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              >
                <option disabled value="">게임을 선택하세요</option>
                <option v-for="game in gameOptions" :key="game" :value="game">
                  {{ game }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="maxParticipants"
                class="mb-2 block text-sm font-semibold text-slate-200"
              >
                최대 참가 인원
              </label>
              <select
                id="maxParticipants"
                v-model="form.maxParticipants"
                class="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              >
                <option disabled value="">인원을 선택하세요</option>
                <option
                  v-for="participant in participantOptions"
                  :key="participant"
                  :value="participant"
                >
                  {{ participant }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label for="description" class="mb-2 block text-sm font-semibold text-slate-200">
              설명
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="5"
              placeholder="토너먼트 규칙, 진행 방식, 참가 조건 등을 입력하세요"
              class="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
            />
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label for="format" class="mb-2 block text-sm font-semibold text-slate-200">
                토너먼트 방식
              </label>
              <select
                id="format"
                v-model="form.format"
                class="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              >
                <option v-for="format in formatOptions" :key="format.value" :value="format.value">
                  {{ format.label }}
                </option>
              </select>
            </div>

            <div>
              <label for="startDate" class="mb-2 block text-sm font-semibold text-slate-200">
                시작 날짜/시간
              </label>
              <input
                id="startDate"
                v-model="form.startDate"
                type="datetime-local"
                class="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              />
            </div>
          </div>

          <div>
            <p class="mb-3 text-sm font-semibold text-slate-200">공개 여부</p>
            <div class="flex flex-col gap-3 sm:flex-row">
              <label
                class="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200"
              >
                <input
                  v-model="form.visibility"
                  type="radio"
                  value="public"
                  class="h-4 w-4 border-white/20 bg-slate-800 text-blue-400 focus:ring-blue-400"
                />
                <span>Public</span>
              </label>
              <label
                class="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200"
              >
                <input
                  v-model="form.visibility"
                  type="radio"
                  value="private"
                  class="h-4 w-4 border-white/20 bg-slate-800 text-blue-400 focus:ring-blue-400"
                />
                <span>Private</span>
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-xl bg-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
              @click="goToTournaments"
            >
              취소
            </button>
            <button
              type="submit"
              class="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
            >
              {{ submitting ? '생성 중...' : '생성하기' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
