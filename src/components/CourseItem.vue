<template>
  <div
    class="card"
    @click.stop="router.push(`/course/${course.id}`)"
  >
    <img
      class="card__image"
      :src="course.image"
      width="300" height="170"
      :alt="course.title"
    >

    <div class="card__body">
      <h2 class="card__title">{{ course.title }}</h2>

      <p class="card__subtitle">{{ course.desc }}</p>

      <div :class="['tags', {'is-collapsed' : course.tags.length > 10 }]">
        <span
          v-for="tag in course.tags"
          :key="tag"
          class="tag"
        >{{ tag }}
        </span>
      </div>
    </div>

    <the-dropdown
      @click.stop
      modify="card__dropdown"
    >
      <template #button-content>
        <TheIcon name="menu-dots" modify="icon--lg" />
      </template>

      <template #content>
        <ul class="dropdown__menu">
          <li
            @click="showConfirm = true"
            class="dropdown__item"
          >Удалить
          </li>

          <li class="dropdown__item is-disabled">Редактировать</li>
        </ul>
      </template>
    </the-dropdown>

    <confirm-dialog
      :is-show="showConfirm"
      title="Вы уверены что хотите удалить курс?"
      :desc="course.title"
      confirm-text="Удалить курс"
      confirm-type="danger"
      @confirm="deleteCourse"
      @close="showConfirm = false"
    />
  </div>
</template>

<script setup lang='ts'>
import {useRouter} from 'vue-router'
import type {ICourse} from '@/interfaces/ICourse'
import TheDropdown from '@/components/TheDropdown.vue'
import TheIcon from '@/components/TheIcon.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import {ref} from 'vue'

const router = useRouter()
const props = defineProps<{course: ICourse}>()
const emit = defineEmits(['deleteCourse'])

const showConfirm = ref<boolean>(false)

/** Эмитим удаление курса */
const deleteCourse = (): void => {
  emit('deleteCourse', props.course.id)
}
</script>
