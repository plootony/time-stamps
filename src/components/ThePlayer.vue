<template>
  <div
      v-show="courseStore.isPlayerReady"
      class="player"
  >
    <YouTube
        class="player__frame"
        :src="courseStore.playerLink"
        ref="youtube"
        @ready="onReady"
        width="100%"
    />

    <div
        v-if="courseStore.playerTitle"
        :class="{ 'player__info': courseStore.playerTitle}"
    >
      <h2
          v-if="courseStore.playerTitle"
          class="player__title"
      >{{ courseStore.playerTitle }}</h2>
    </div>
  </div>

  <div v-show="!courseStore.isPlayerReady" class="player">
    <div class="player__frame"></div>
  </div>
</template>

<script setup lang='ts'>
import {onUnmounted, ref, watch} from 'vue'
import {useCourseStore} from '@/stores/course'
import YouTube from 'vue3-youtube'

const courseStore = useCourseStore()
const youtube = ref<any>()

const onReady = (event: any) => {
  youtube.value = event.target
  courseStore.isPlayerReady = true
}

/** Получаем время плеера */
const getPlayerTime = (): void => {
  if (courseStore.isPlayerReady === false) return

  courseStore.playerTime = youtube.value.getCurrentTime().toFixed()
}

watch(() => courseStore.playerTime, () => {
  if (!courseStore.isPlayerReady) return

  if (courseStore.isPlay === true) {
    youtube.value.seekTo(courseStore.playerTime)
    youtube.value.playVideo()
  } else {
    youtube.value.pauseVideo()
  }
})

defineExpose({getPlayerTime})

onUnmounted(() => {
  courseStore.playerLink = ''
  courseStore.playerTitle = ''
  courseStore.isPlayerReady = false
})
</script>
