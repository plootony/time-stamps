<template>
  <div class="playlist">
    <h2 class="playlist__title">Главы курса</h2>

    <chapter-dialog/>

    <ul class="playlist__items">
      <li
          v-for="chapter in chaptersList"
          :key="chapter.id"
          class="playlist__item"
          @click="setChapterTime(chapter.time, chapter.title)"
      >
        <div class="playlist__item-title">{{ chapter.title }}</div>
        <div class="playlist__item-time">{{ chapter.time }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type {IChapter} from "@/interfaces/IChapter";
import ChapterDialog from "@/components/ChapterDialog.vue";

defineProps<{
  chaptersList: IChapter[]
}>()

const emit = defineEmits(['setChapterTime'])

const setChapterTime = (time: number | undefined, title: string) => {
  emit('setChapterTime', time, title)
}

</script>