<template>
  <div
      class="card"
      @click.stop="router.push(`/course/${course.id}`)"
  >
    <img
        class="card__image"
        :src="course.image"
        width="200" height="170"
        :alt="course.title"
    >

    <div class="card__body">
      <h2 class="card__title">{{ course.title }}</h2>

      <p class="card__subtitle">{{ course.desc }}</p>

      <div class="tags">
        <span
            v-for="tag in course.tags"
            :key="tag"
            class="tag"
        >{{ tag }}
        </span>
      </div>
    </div>

    <button
        class="card__link"
        @click.stop="deleteCourse"
        style="margin-left: auto; margin-bottom: auto"
    >Удалить
    </button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import type {ICourse} from "@/interfaces/ICourse";

const router = useRouter()
const props = defineProps<{ course: ICourse }>()
const emit = defineEmits(['deleteCourse'])

/** Эмитим удаление курса */
const deleteCourse = (): void => {
  emit('deleteCourse', props.course.id)
}
</script>