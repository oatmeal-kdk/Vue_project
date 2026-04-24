<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getMatchById, submitMatchScore } from '../api/tournamentApi'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const error = ref(false)
const match = ref(null)

const scoreForm = reactive({
  score1: '',
  score2: '',
})

const matchId = computed(() => route.params.id)
const isFinished = computed(() => match.value?.status === 'finished')

const currentScoreLabel = computed(() => {
  if (match.value?.score1 === null || match.value?.score2 === null) {
    return '미제출'
  }

  return `${match.value.score1} : ${match.value.score2}`
})

const winnerName = computed(() => match.value?.winner?.nickname || '')

const fetchMatch = async () => {
  loading.value = true
  error.value = false

  try {
    match.value = await getMatchById(matchId.value)
  } catch (fetchError) {
    console.error(fetchError)
    error.value = true
  } finally {
    loading.value = false
  }
}

const submitScore = async () => {
  if (scoreForm.score1 === '' || scoreForm.score2 === '') {
    window.alert('점수를 모두 입력해주세요.')
    return
  }

  const score1 = Number(scoreForm.score1)
  const score2 = Number(scoreForm.score2)

  if (Number.isNaN(score1) || Number.isNaN(score2)) {
    window.alert('유효한 점수를 입력해주세요.')
    return
  }

  if (score1 < 0 || score2 < 0) {
    window.alert('점수는 음수일 수 없습니다.')
    return
  }

  if (score1 === score2) {
    window.alert('동점은 허용되지 않습니다.')
    return
  }

  submitting.value = true

  try {
    match.value = await submitMatchScore(matchId.value, { score1, score2 })
    window.alert('점수가 제출되었습니다.')
  } catch (submitError) {
    console.error(submitError)
    window.alert(
      submitError.response?.data?.message || '점수 제출 중 오류가 발생했습니다.',
    )
  } finally {
    submitting.value = false
  }
}

const goToBracket = () => {
  if (!match.value?.tournamentId) {
    router.push('/tournaments')
    return
  }

  router.push(`/tournaments/${match.value.tournamentId}/bracket`)
}

watch(
  match,
  (value) => {
    scoreForm.score1 = value?.score1 ?? ''
    scoreForm.score2 = value?.score2 ?? ''
  },
  { immediate: true },
)

watch(
  () => route.params.id,
  () => {
    fetchMatch()
  },
)

onMounted(() => {
  fetchMatch()
})
</script>

<template>
  <section class="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
    <div class="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
      <div
        v-if="loading"
        class="rounded-2xl border border-white/10 bg-slate-900/70 px-6 py-12 text-center text-slate-200"
      >
        매치 정보를 불러오는 중...
      </div>

      <div
        v-else-if="error || !match"
        class="rounded-2xl border border-red-400/20 bg-red-500/10 px-6 py-12 text-center text-red-100"
      >
        매치 정보를 불러오지 못했습니다.
      </div>

      <div v-else class="space-y-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Match Detail
            </p>
            <h1 class="mt-2 text-3xl font-black tracking-tight text-white">경기 상세</h1>
            <p class="mt-3 text-sm text-slate-300">
              토너먼트 {{ match.tournamentId }} · 라운드 {{ match.round }}
            </p>
          </div>

          <span
            class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1"
            :class="
              isFinished
                ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30'
                : 'bg-amber-500/20 text-amber-200 ring-amber-400/30'
            "
          >
            {{ match.status }}
          </span>
        </div>

        <div class="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-6">
          <div
            class="rounded-2xl border px-5 py-6 text-center"
            :class="
              match.winner?.id === match.player1?.id
                ? 'border-emerald-400/40 bg-emerald-500/10'
                : 'border-white/10 bg-slate-800/80'
            "
          >
            <p class="text-sm text-slate-400">Player 1</p>
            <p class="mt-2 text-2xl font-bold text-white">
              {{ match.player1?.nickname || 'TBD' }}
            </p>
            <input
              v-model="scoreForm.score1"
              type="number"
              min="0"
              class="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-center text-xl font-bold text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isFinished"
            />
          </div>

          <div class="flex flex-col items-center justify-center gap-3 px-2">
            <span class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              VS
            </span>
            <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
              {{ currentScoreLabel }}
            </span>
          </div>

          <div
            class="rounded-2xl border px-5 py-6 text-center"
            :class="
              match.winner?.id === match.player2?.id
                ? 'border-emerald-400/40 bg-emerald-500/10'
                : 'border-white/10 bg-slate-800/80'
            "
          >
            <p class="text-sm text-slate-400">Player 2</p>
            <p class="mt-2 text-2xl font-bold text-white">
              {{ match.player2?.nickname || 'TBD' }}
            </p>
            <input
              v-model="scoreForm.score2"
              type="number"
              min="0"
              class="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-center text-xl font-bold text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isFinished"
            />
          </div>
        </div>

        <div class="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200 sm:grid-cols-2 sm:p-6">
          <div class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
            <p class="text-slate-400">토너먼트 ID</p>
            <p class="mt-2 text-base font-semibold text-white">{{ match.tournamentId }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
            <p class="text-slate-400">라운드</p>
            <p class="mt-2 text-base font-semibold text-white">{{ match.round }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
            <p class="text-slate-400">현재 점수</p>
            <p class="mt-2 text-base font-semibold text-white">{{ currentScoreLabel }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
            <p class="text-slate-400">상태</p>
            <p class="mt-2 text-base font-semibold text-white">{{ match.status }}</p>
          </div>
        </div>

        <div
          v-if="isFinished && winnerName"
          class="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-200"
        >
          승자: {{ winnerName }}
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            @click="goToBracket"
          >
            대진표로 돌아가기
          </button>
          <button
            type="button"
            class="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isFinished || submitting"
            @click="submitScore"
          >
            {{ submitting ? '제출 중...' : '점수 제출' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
