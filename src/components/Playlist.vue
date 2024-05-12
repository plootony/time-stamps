<template>
  <div class="playlist">
    <h2 class="playlist__title">Главы курса</h2>

    <ul class="playlist__items">
      <li
          v-for="chapter in chaptersList"
          :key="chapter.id"
          :class="['playlist__item']"
          @click="setChapterTime(chapter.id, chapter.time, chapter.title, chapter.text)"
      >
        <div class="playlist__item-title">{{ chapter.title }}</div>

        <div class="playlist__item-time">{{ chapter.time }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type {IChapter} from "@/interfaces/IChapter"

defineProps<{
  chaptersList: IChapter[]
}>()

const emit = defineEmits(['updateAll'])

const setChapterTime = (id: string, time: number | undefined, title: string, text: string) => {
  emit('updateAll', id, time, title, text)
}
</script>