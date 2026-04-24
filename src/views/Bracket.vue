<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  createBracket,
  getBracket,
  getTournamentById,
  selectWinner as selectWinnerApi,
} from '../api/tournamentApi'

const route = useRoute()
const router = useRouter()

const tournament = ref(null)
const bracketRounds = ref([])
const champion = ref(null)
const totalRounds = ref(0)
const loading = ref(false)
const error = ref(false)
const creating = ref(false)

const hasBracket = computed(() => bracketRounds.value.length > 0)
const participantCount = computed(() => tournament.value?.participants?.length ?? 0)
const hasEnoughParticipants = computed(() => participantCount.value >= 2)

const normalizeBracketPayload = (payload) => {
  if (Array.isArray(payload)) {
    return {
      rounds: payload,
      champion: null,
      totalRounds: payload.length,
    }
  }

  if (Array.isArray(payload?.rounds)) {
    return {
      rounds: payload.rounds,
      champion: payload.champion ?? null,
      totalRounds: payload.totalRounds ?? payload.rounds.length,
    }
  }

  if (Array.isArray(payload?.bracket)) {
    return {
      rounds: payload.bracket,
      champion: payload.champion ?? null,
      totalRounds: payload.totalRounds ?? payload.bracket.length,
    }
  }

  return {
    rounds: [],
    champion: payload?.champion ?? null,
    totalRounds: payload?.totalRounds ?? 0,
  }
}

const fetchBracket = async () => {
  loading.value = true
  error.value = false

  try {
    const [tournamentResponse, bracketResponse] = await Promise.all([
      getTournamentById(route.params.id),
      getBracket(route.params.id),
    ])

    const normalized = normalizeBracketPayload(bracketResponse)

    tournament.value = tournamentResponse
    bracketRounds.value = normalized.rounds
    champion.value = normalized.champion || tournamentResponse.champion || null
    totalRounds.value = normalized.totalRounds || tournamentResponse.totalRounds || 0
  } catch (fetchError) {
    console.error(fetchError)
    error.value = true
    window.alert(
      fetchError.response?.data?.message || '대진표 정보를 불러오지 못했습니다.',
    )
  } finally {
    loading.value = false
  }
}

const generateBracket = async () => {
  if (!tournament.value || !hasEnoughParticipants.value) {
    return
  }

  creating.value = true

  try {
    await createBracket(route.params.id)
    await fetchBracket()
  } catch (createError) {
    console.error(createError)
    window.alert(
      createError.response?.data?.message || '대진표 생성에 실패했습니다.',
    )
  } finally {
    creating.value = false
  }
}

const isByePlayer = (player) => Boolean(player?.isBye)

const canSelectWinner = (match, player) => {
  if (!player || isByePlayer(player) || match.status === 'finished') {
    return false
  }

  if (match.score1 !== null || match.score2 !== null) {
    return false
  }

  return Boolean(
    match.player1 &&
      match.player2 &&
      !isByePlayer(match.player1) &&
      !isByePlayer(match.player2),
  )
}

const selectWinner = async (match, winner) => {
  if (!winner || !canSelectWinner(match, winner)) {
    return
  }

  try {
    await selectWinnerApi(route.params.id, match.id, winner.id)
    await fetchBracket()
  } catch (selectError) {
    console.error(selectError)
    window.alert(
      selectError.response?.data?.message || '승자 반영에 실패했습니다.',
    )
  }
}

const isWinner = (match, player) => {
  if (!match.winner || !player) {
    return false
  }

  return match.winner.id === player.id
}

const getPlayerName = (player) => {
  if (!player) {
    return 'TBD'
  }

  return player.nickname
}

const getScoreLabel = (match) => {
  if (match.score1 === null || match.score2 === null) {
    return null
  }

  return `${match.score1} : ${match.score2}`
}

const goToMatchDetail = (matchId) => {
  router.push(`/matches/${matchId}`)
}

const goToTournament = () => {
  router.push(`/tournaments/${route.params.id}`)
}

watch(
  () => route.params.id,
  () => {
    fetchBracket()
  },
)

onMounted(() => {
  fetchBracket()
})
</script>

<template>
  <section class="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <button
        class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        @click="goToTournament"
      >
        <span>&larr;</span>
        <span>토너먼트로 돌아가기</span>
      </button>

      <div
        v-if="loading"
        class="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-200"
      >
        대진표를 불러오는 중...
      </div>

      <div
        v-else-if="error || !tournament"
        class="rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center text-red-100"
      >
        <h1 class="mb-2 text-2xl font-bold text-white">대진표를 불러오지 못했습니다.</h1>
      </div>

      <div
        v-else
        class="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20"
      >
        <div class="border-b border-white/10 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent px-6 py-8 sm:px-8">
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            {{ tournament.game }}
          </p>
          <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {{ tournament.title }}
          </h1>
          <p v-if="champion" class="mt-4 text-lg font-semibold text-amber-300">
            우승자: {{ champion.nickname }}
          </p>
          <p v-else-if="totalRounds" class="mt-4 text-sm text-slate-300">
            총 {{ totalRounds }} 라운드 진행
          </p>
        </div>

        <div class="p-6 sm:p-8">
          <div v-if="!hasBracket" class="rounded-2xl bg-slate-900/70 p-8 text-center">
            <p
              v-if="!hasEnoughParticipants"
              class="text-sm font-medium text-rose-200 sm:text-base"
            >
              대진표를 생성하려면 최소 2명의 참가자가 필요합니다.
            </p>
            <button
              v-else
              class="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="creating"
              @click="generateBracket"
            >
              {{ creating ? '생성 중...' : '대진표 생성' }}
            </button>
          </div>

          <div v-else class="overflow-x-auto pb-2">
            <div class="flex min-w-max gap-6">
              <div
                v-for="round in bracketRounds"
                :key="round.round"
                class="w-80 shrink-0"
              >
                <div class="mb-4 rounded-2xl bg-slate-900/80 px-5 py-4">
                  <h2 class="text-lg font-bold text-white">{{ round.name }}</h2>
                </div>

                <div class="space-y-5">
                  <article
                    v-for="(match, matchIndex) in round.matches"
                    :key="match.id"
                    class="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-black/20"
                  >
                    <div class="mb-4 flex items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-slate-300">
                        Match {{ matchIndex + 1 }}
                      </p>
                      <span
                        class="rounded-full px-3 py-1 text-xs font-semibold ring-1"
                        :class="
                          match.status === 'finished'
                            ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30'
                            : 'bg-amber-500/20 text-amber-200 ring-amber-400/30'
                        "
                      >
                        {{ match.status }}
                      </span>
                    </div>

                    <div v-if="getScoreLabel(match)" class="mb-4 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200">
                      점수: {{ getScoreLabel(match) }}
                    </div>

                    <div v-if="match.status === 'finished' && match.winner" class="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                      승자: {{ match.winner.nickname }}
                    </div>

                    <div class="space-y-3">
                      <div
                        class="rounded-xl border px-4 py-3"
                        :class="
                          isWinner(match, match.player1)
                            ? 'border-emerald-400/50 bg-emerald-500/10'
                            : 'border-white/10 bg-slate-800/90'
                        "
                      >
                        <div class="flex items-center justify-between gap-3">
                          <span
                            class="text-sm font-medium"
                            :class="[
                              isByePlayer(match.player1) ? 'text-slate-400' : 'text-white',
                              isWinner(match, match.player1) ? 'font-bold text-emerald-200' : '',
                            ]"
                          >
                            {{ getPlayerName(match.player1) }}
                          </span>
                          <button
                            class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                            :class="
                              canSelectWinner(match, match.player1)
                                ? 'bg-blue-500 text-white hover:bg-blue-400'
                                : 'cursor-not-allowed bg-slate-700 text-slate-400 opacity-60'
                            "
                            :disabled="!canSelectWinner(match, match.player1)"
                            @click="selectWinner(match, match.player1)"
                          >
                            승자 선택
                          </button>
                        </div>
                      </div>

                      <div
                        class="rounded-xl border px-4 py-3"
                        :class="
                          isWinner(match, match.player2)
                            ? 'border-emerald-400/50 bg-emerald-500/10'
                            : 'border-white/10 bg-slate-800/90'
                        "
                      >
                        <div class="flex items-center justify-between gap-3">
                          <span
                            class="text-sm font-medium"
                            :class="[
                              isByePlayer(match.player2) ? 'text-slate-400' : 'text-white',
                              isWinner(match, match.player2) ? 'font-bold text-emerald-200' : '',
                            ]"
                          >
                            {{ getPlayerName(match.player2) }}
                          </span>
                          <button
                            class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                            :class="
                              canSelectWinner(match, match.player2)
                                ? 'bg-blue-500 text-white hover:bg-blue-400'
                                : 'cursor-not-allowed bg-slate-700 text-slate-400 opacity-60'
                            "
                            :disabled="!canSelectWinner(match, match.player2)"
                            @click="selectWinner(match, match.player2)"
                          >
                            승자 선택
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                      @click="goToMatchDetail(match.id)"
                    >
                      경기 상세
                    </button>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
