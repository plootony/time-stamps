<template>
  <div class="playlist">
    <h2 class="playlist__title">Главы курса</h2>

    <span v-if="!courseStore.chapters.length">Вы еще не создали ни одной главы</span>

    <ul v-else class="playlist__items">
      <li
          v-for="chapter in courseStore.chapters"
          :key="chapter.id"
          :class="['playlist__item', {'is-selected' : chapter.id === courseStore.chapterId}]"
          @click="loadChapter(chapter.id)"
      >
        <div class="playlist__item-title">{{ chapter.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useCourseStore} from "@/stores/course";
import {collection, getDocs, doc, getDoc, query} from "firebase/firestore";
import {useRoute} from "vue-router"
import type {IChapter} from "@/interfaces/IChapter";

const courseStore = useCourseStore()
const router = useRoute()
const db = courseStore.db
const userId = courseStore.userId
const courseId = router.params.id as string
const isLoading = ref<boolean>(false)

/** Получение глав курса */
const getChapters = async (): Promise<void> => {
  courseStore.chapters = []

  try {
    isLoading.value = true
    console.log('Пытаюсь получить главы курса')

    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    const docRef = query(collection(db, `users/${userId}/courses/${courseId}/chapters/`))
    const docSnap = await getDocs(docRef)

    if (docSnap.empty) {
      console.log('Список глав пуст')
      return
    }

    if (docSnap) {
      docSnap.docs.map(doc => {
        courseStore.chapters.push({...doc.data(), id: doc.id} as IChapter)
      })
    }

    const lastChapter = courseStore.chapters[courseStore.chapters.length - 1]
    if (lastChapter) {
      await loadChapter(lastChapter.id)
    }

    console.log('Загрузка завершена', courseStore.chapters)

  } catch
      (error) {
    console.log('Не удалось загрузить главы', error)
  } finally {
    isLoading.value = false
  }
}

/** Загрузка текста выбранной главы */
const loadChapter = async (id: string): Promise<void> => {
  try {
    const chapterRef = doc(db, `users/${userId}/courses/${courseId}/chapters/${id}`)
    const chapterSnap = await getDoc(chapterRef)

    if (chapterSnap.exists()) {
      const chapterData = chapterSnap.data()
      courseStore.chapterId = id
      courseStore.chapterText = chapterData.text || ""
      courseStore.playerTitle = chapterData.title || ""
      courseStore.playerDesc = chapterData.desc|| ""
      courseStore.playerTime = chapterData.time || ""
      console.log('Загружен текст главы', courseStore.chapterText)

    } else {
      console.log('Глава не найдена')
    }
  } catch (error) {
    console.log('Не удалось загрузить текст главы', error)
  }
}

onMounted(() => {
  getChapters()
})
</script>
