<template>
  <div class="search">
    <button class="search__btn">
      <TheIcon name="search" modify="icon--lg"/>
    </button>

    <input
        v-model="text"
        class="search__input"
        type="text"
        placeholder="Поиск"
    >

    <div class="search__result">
      <div
          v-if="results.length"
          v-for="result in results"
          @click="router.push(`/course/${result.id}`)"
          class="search__result-item"
      >
        <img
            class="search__result-img"
            :src="result.image"
            width="100"
            height="56"
            alt="img"
        >

        <div class="search__result-body">
          <h3 class="search__result-title">{{ result.title }}</h3>
          <p class="search__result-desc">{{ result.desc }}</p>
        </div>
      </div>

      <div
          v-else-if="text.length > 2"
          class="search__result-item"
      >
        <p class="search__result-desc">К сожалению ничего не нашлось</p>
      </div>
    </div>
  </div>

  <div
      v-if="results.length"
      @click="searchClear"
      class="overlay"
  ></div>
</template>

<script setup lang='ts'>
import TheIcon from '@/components/TheIcon.vue'
import {ref, watch} from 'vue'
import {useCourseStore} from '@/stores/course'
import type {ICourse} from '@/interfaces/ICourse'
import {useRouter} from 'vue-router'

const router = useRouter()
const courseStore = useCourseStore()
const text = ref<string>('')
let results = ref([] as ICourse[])

/** Фильтрует курсы по введенному тексту */
const filterCourses = (): void => {
  results.value = []

  // TODO: Реализовать фильр, через запрос на сервер, (но пока нет пагинации, пусть будет так)
  if (text.value) {
    results.value = courseStore.courses.filter((course: ICourse) => {
      return course.title.toLowerCase().includes(text.value.toLowerCase())
    })
  }
}

/** Очищает результаты поиска */
const searchClear = (): void => {
  results.value = []
  text.value = ''
}

watch(text, () => {
  if (text.value.length > 2) {
    filterCourses()
  } else {
    results.value = []
  }
})
</script>