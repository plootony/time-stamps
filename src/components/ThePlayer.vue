<template>
  <vue-plyr
    ref="playerRef"
    @ready="ready"
  >
    <div class="plyr__video-embed">
      <iframe
        allowfullscreen
        allowtransparency
        allow="autoplay"
        :src="`${playerLink}?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
      ></iframe>
    </div>
  </vue-plyr>
</template>

<script setup lang='ts'>
import {useCourseStore} from '@/stores/course'
import {ref, watch} from 'vue'

const courseStore = useCourseStore()
const playerRef = ref()
const playerLink = courseStore.playerLink

/** Получение текущей временной метки */
const getPlayerTime = (): void => {
  courseStore.playerTime = playerRef.value.player.currentTime
}

/** Установка текущей временной метки */
const setPlayerTime = (): void => {
  playerRef.value.player.currentTime = courseStore.playerTime
}

/** Подтвреждение загрузки компонента плеера */
const ready = (): void => {
  courseStore.isPlayerReady = true
}

/** Обновление текущей временной метки */
watch(() => courseStore.playerTime, setPlayerTime)

defineExpose({getPlayerTime})
</script>