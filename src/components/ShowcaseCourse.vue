<template>
  <div class="card">
    <img
        class="card__image"
        :src="`src/assets/images/${course.image}`"
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
    <button class="btn btn--primary" @click="deleteCourse" style="margin-left: auto">Удалить</button>
  </div>
</template>

<script setup lang="ts">
import type {ICourse} from "@/interfaces/ICourse";

const props = defineProps<{ course: ICourse }>()

const emit = defineEmits(['deleteCourse'])

const deleteCourse = () => {
  emit('deleteCourse', props.course.id)
}
</script>