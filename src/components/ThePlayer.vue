<template>
  <div class="player">
    <YouTube
        class="player__frame"
        :src="courseStore.playerLink"
        ref="youtube"
    />

    <h2
        v-if="courseStore.playerTitle"
        class="player__title"
    >{{ courseStore.playerTitle }}</h2>

    <p
        v-if="courseStore.playerDesc"
        class="player__subtitle"
    >{{ courseStore.playerDesc }}</p>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useCourseStore} from "@/stores/course";
import YouTube from 'vue3-youtube'

const courseStore = useCourseStore()
const youtube = ref<any>()

/** Получаем время плеера */
const getPlayerTime = (): void => {
  if (youtube.value === null) return
  courseStore.playerTime = youtube.value.getCurrentTime().toFixed()
}

watch(() => courseStore.playerTime, () => {
  youtube.value.seekTo(courseStore.playerTime)
  // youtube.value.playVideo()
})

defineExpose({getPlayerTime})
</script>
