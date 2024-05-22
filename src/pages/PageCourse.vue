<template>
  <main-layout>
    <template #content>
      <div :class="['course', { 'is-loading': isLoading }]">
        <div class="course__heading">
          <div class="course__title-wrapper">
            <button
                @click="$router.go(-1)"
                class="btn btn--primary"
            >Назад
            </button>

            <h1 class="course__title">{{ courseDetails.title }}</h1>
          </div>

          <button
              @click="addChapter"
              class="btn btn--primary"
          >Добавить главу
          </button>
        </div>

        <div class="course__body">
          <div class="course__left">

            <chapter-add
                :modal-show="isShow"
                @modal-close="modalClose"
            />

            <the-player
                v-if="courseStore.playerLink"
                ref="playerRef"
            />

            <span v-else>Загрузка...</span>

            <the-editor />
          </div>

          <div class="course__right">
            <the-playlist />
          </div>
        </div>
      </div>
    </template>
  </main-layout>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import MainLayout from "@/layouts/MainLayout.vue"
import ThePlaylist from "@/components/ThePlaylist.vue"
import TheEditor from "@/components/TheEditor.vue"
import ThePlayer from "@/components/ThePlayer.vue";
import ChapterAdd from "@/components/ChapterAdd.vue";
import {useCourseStore} from "@/stores/course";
import {doc, getDoc} from "firebase/firestore";
import {useRoute} from "vue-router";
import type {ICourse} from "@/interfaces/ICourse";

const courseStore = useCourseStore()
const router = useRoute()

const isShow = ref(false)
const playerRef = ref()
const isLoading = ref(false)
const userId = courseStore.userId
const db = courseStore.db
const courseId = router.params.id
const courseDetails = ref({} as ICourse)

/** Добавление новой главы */
const addChapter = (): void => {
  isShow.value = true
  getPlayerTime() // Передаем время плеера
}

/** Получение текущей временной метки */
const getPlayerTime = async (): Promise<void> => {
  if (playerRef.value === null) return

  try {
    await playerRef.value.getPlayerTime()

  } catch (error) {
    console.log('Плеер еще грузится')
  }
}

/** Закрытие модального окна */
const modalClose = (): void => {
  isShow.value = false
}

const getCourseDetails = async (): Promise<void> => {

  try {
    isLoading.value = true

    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    const docRef = doc(db, `users/${userId}/courses/${courseId}`)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      courseDetails.value = docSnap.data() as ICourse
      courseStore.playerLink = courseDetails.value.link
    } else {
      console.log("Документ не найден")
    }

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getCourseDetails()
})
</script>
