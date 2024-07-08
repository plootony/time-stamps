<template>
  <div class="smart-select">
    <div :class="['form-group']">
      <label class="form-group__label">Выберите курс из списка</label>

      <input
        v-model="text"
        type="text"
        class="form-group__input"
        placeholder="Введите название курса"
      >

    </div>

    <ul
      v-if="results.length"
      class="smart-select__result"
    >
      <li
        v-for="(result, index) in results"
        @click="selectCourse(index, result.title)"
        class="smart-select__result-item"
      >
        {{ result.title }}
      </li>
    </ul>
  </div>

</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {useFilterCourses} from '@/composables/useFilterCourses'
import {useCourses} from '@/composables/useCourses'

const {text, results} = useFilterCourses()
const {getCourses} = useCourses()

const selectCourse = (index: number, title: string): void => {
  results.value = []
  text.value = title
}

onMounted(() => {
  getCourses()
})
</script>