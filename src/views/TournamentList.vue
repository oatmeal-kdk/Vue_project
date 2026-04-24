<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getTournaments } from '../api/tournamentApi'

const router = useRouter()
const tournaments = ref([])
const loading = ref(false)
const error = ref(false)

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

const fetchTournaments = async () => {
  loading.value = true
  error.value = false

  try {
    tournaments.value = await getTournaments()
  } catch (fetchError) {
    console.error(fetchError)
    error.value = true
  } finally {
    loading.value = false
  }
}

const goToTournament = (id) => {
  router.push({ name: 'tournamentDetail', params: { id } })
}

onMounted(() => {
  fetchTournaments()
})
</script>

<template>
  <section class="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 flex flex-col gap-3">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Tournament Hub
        </p>
        <h1 class="text-3xl font-black tracking-tight sm:text-4xl">
          온라인 게임 토너먼트 목록
        </h1>
        <p class="max-w-2xl text-sm text-slate-300 sm:text-base">
          진행 예정, 진행 중, 종료된 토너먼트를 한눈에 확인하고 바로 상세 페이지로 이동할 수
          있습니다.
        </p>
      </div>

      <div
        v-if="loading"
        class="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-200"
      >
        불러오는 중...
      </div>

      <div
        v-else-if="error"
        class="rounded-3xl border border-red-400/20 bg-red-500/10 px-6 py-10 text-center text-red-100"
      >
        토너먼트 목록을 불러오지 못했습니다.
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="tournament in tournaments"
          :key="tournament.id"
          class="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition duration-300 hover:scale-[1.03] hover:border-cyan-400/40 hover:bg-white/10"
          @click="goToTournament(tournament.id)"
        >
          <div class="mb-5 flex items-start justify-between gap-3">
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {{ tournament.game }}
              </p>
              <h2 class="text-2xl font-bold text-white">
                {{ tournament.title }}
              </h2>
            </div>
            <span
              class="inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1"
              :class="statusConfig[tournament.status]?.badge || statusConfig.finished.badge"
            >
              {{ statusConfig[tournament.status]?.label || 'Finished' }}
            </span>
          </div>

          <div class="space-y-3 text-sm text-slate-300">
            <div class="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
              <span>참가자</span>
              <span class="font-semibold text-white">
                {{ tournament.currentParticipants }} / {{ tournament.maxParticipants }}
              </span>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
              <span>상태</span>
              <span class="font-semibold text-white">
                {{ statusConfig[tournament.status]?.label || 'Finished' }}
              </span>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between text-sm text-cyan-300">
            <span>상세 보기</span>
            <span class="transition duration-300 group-hover:translate-x-1">&rarr;</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
