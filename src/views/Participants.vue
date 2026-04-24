<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tournamentId = computed(() => route.params.id)

const goBack = () => {
  router.push(`/tournaments/${tournamentId.value}`)
}
</script>

<template>
  <section class="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-white">
      <h1 class="text-3xl font-black tracking-tight">참가자 관리</h1>
      <p class="mt-3 text-sm text-slate-300">
        토너먼트 {{ tournamentId }} 참가자 관리 화면입니다.
      </p>
      <button
        type="button"
        class="mt-6 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        @click="goBack"
      >
        돌아가기
      </button>
    </div>
  </section>
</template>
