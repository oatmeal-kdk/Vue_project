<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  getTournamentById,
  joinTournament as joinTournamentApi,
} from '../api/tournamentApi'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const tournament = ref(null)
const loading = ref(false)
const error = ref(false)
const joining = ref(false)

const statusConfig = {
  upcoming: {
    label: 'Upcoming',
    badge: 'bg-blue-100 text-blue-700 ring-blue-200',
  },
  ongoing: {
    label: 'Ongoing',
    badge: 'bg-green-100 text-green-700 ring-green-200',
  },
  finished: {
    label: 'Finished',
    badge: 'bg-gray-100 text-gray-700 ring-gray-200',
  },
}

const fetchTournament = async () => {
  loading.value = true
  error.value = false

  try {
    tournament.value = await getTournamentById(route.params.id)
  } catch (fetchError) {
    console.error(fetchError)
    error.value = true
    tournament.value = null
  } finally {
    loading.value = false
  }
}

const isJoined = computed(() => {
  if (!tournament.value || !authStore.user) {
    return false
  }

  return (tournament.value.participants ?? []).some(
    (participant) => participant.id === authStore.user.id,
  )
})

const isFull = computed(() => {
  if (!tournament.value) {
    return false
  }

  return tournament.value.currentParticipants >= tournament.value.maxParticipants
})

const joinButtonText = computed(() => {
  if (!authStore.isLoggedIn) {
    return '로그인 필요'
  }

  if (isJoined.value) {
    return '참가 완료'
  }

  if (isFull.value) {
    return '정원 마감'
  }

  if (joining.value) {
    return '처리 중...'
  }

  return '참가하기'
})

const joinTournament = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  if (!tournament.value || !authStore.user || isJoined.value || isFull.value) {
    return
  }

  joining.value = true

  try {
    await joinTournamentApi(route.params.id, authStore.user)
    await fetchTournament()
  } catch (joinError) {
    console.error(joinError)
    window.alert('토너먼트 참가에 실패했습니다.')
  } finally {
    joining.value = false
  }
}

const goToBracket = () => {
  if (!tournament.value) {
    return
  }

  router.push(`/tournaments/${tournament.value.id}/bracket`)
}

const goToList = () => {
  router.push('/tournaments')
}

onMounted(() => {
  fetchTournament()
})
</script>

<template>
  <section class="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <button
        class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        @click="goToList"
      >
        <span>&larr;</span>
        <span>목록으로</span>
      </button>

      <div
        v-if="loading"
        class="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-200"
      >
        불러오는 중...
      </div>

      <div
        v-else-if="error"
        class="rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center text-red-100"
      >
        토너먼트 정보를 불러오지 못했습니다.
      </div>

      <div
        v-else-if="tournament"
        class="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20"
      >
        <div class="border-b border-white/10 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent p-8">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                {{ tournament.game }}
              </p>
              <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {{ tournament.title }}
              </h1>
            </div>
            <span
              class="inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1"
              :class="statusConfig[tournament.status]?.badge || statusConfig.finished.badge"
            >
              {{ statusConfig[tournament.status]?.label || 'Finished' }}
            </span>
          </div>
          <p class="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            {{ tournament.description }}
          </p>
        </div>

        <div class="grid gap-8 p-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div class="space-y-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl bg-slate-900/80 p-5">
                <p class="mb-2 text-sm text-slate-400">참가 현황</p>
                <p class="text-2xl font-bold text-white">
                  {{ tournament.currentParticipants }} / {{ tournament.maxParticipants }}
                </p>
              </div>
              <div class="rounded-2xl bg-slate-900/80 p-5">
                <p class="mb-2 text-sm text-slate-400">진행 상태</p>
                <p class="text-2xl font-bold text-white">
                  {{ statusConfig[tournament.status]?.label || 'Finished' }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                class="rounded-xl px-5 py-3 text-sm font-semibold text-white transition"
                :class="
                  !authStore.isLoggedIn || isJoined || isFull || joining
                    ? 'cursor-not-allowed bg-blue-500/40 opacity-60'
                    : 'bg-blue-500 hover:bg-blue-400'
                "
                :disabled="!authStore.isLoggedIn || isJoined || isFull || joining"
                @click="joinTournament"
              >
                {{ joinButtonText }}
              </button>
              <button
                class="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                @click="goToBracket"
              >
                대진표 보기
              </button>
            </div>
          </div>

          <aside class="rounded-2xl bg-slate-900/80 p-6">
            <h2 class="mb-4 text-xl font-bold text-white">참가자 목록</h2>
            <ul class="space-y-3">
              <li
                v-for="participant in tournament.participants ?? []"
                :key="participant.id"
                class="flex items-center justify-between rounded-xl border border-white/5 bg-slate-800/90 px-4 py-3 text-sm text-slate-200"
              >
                <span>{{ participant.nickname }}</span>
                <span class="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                  #{{ participant.id }}
                </span>
              </li>
            </ul>
          </aside>
        </div>
      </div>

      <div
        v-else
        class="rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center text-red-100"
      >
        <h1 class="mb-2 text-2xl font-bold text-white">토너먼트를 찾을 수 없습니다.</h1>
        <p class="text-sm text-red-100/80">유효한 토너먼트 ID로 다시 접속해주세요.</p>
      </div>
    </div>
  </section>
</template>
