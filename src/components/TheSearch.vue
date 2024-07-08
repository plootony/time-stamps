<template>
  <div class="search">
    <button class="search__btn">
      <TheIcon name="search" modify="icon--lg" />
    </button>

    <input
      v-model="text"
      class="search__input"
      type="text"
      placeholder="Поиск"
    >

    <div class="search__result">
      <template v-if="results.length">
        <div
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
      </template>

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
import {useFilterCourses} from '@/composables/useFilterCourses'
import {useRouter} from 'vue-router'
import TheIcon from '@/components/TheIcon.vue'

const router = useRouter()
const {searchClear, text, results} = useFilterCourses()
</script>