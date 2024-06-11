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
        <span class="playlist__item-title">{{ chapter.title }}</span>
        <span class="playlist__item-title">{{ formatTime(chapter.time) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import {onMounted, ref, watch} from 'vue'
import {useCourseStore} from '@/stores/course'
import {collection, getDocs, doc, getDoc, query, orderBy} from 'firebase/firestore'
import {useRoute} from 'vue-router'
import type {IChapter} from '@/interfaces/IChapter'
import { formatTime } from '@/helpers/timeFormatter'

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

    const docRef = query(collection(db, `users/${userId}/courses/${courseId}/chapters/`), orderBy('time', 'asc'))
    const docSnap = await getDocs(docRef)

    if (docSnap.empty) {
      console.log('Список глав пуст')
      return
    }

    if (docSnap) {
      courseStore.chapters = docSnap.docs.map(doc => {
        const chapterData = doc.data()
        console.log('Глава получена', chapterData)
        return {
          ...chapterData,
          id: doc.id,
          time: Number(chapterData.time)
        } as IChapter
      })
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
      courseStore.chapterText = chapterData.text
      courseStore.playerTitle = chapterData.title
      courseStore.playerTime = chapterData.time

    } else {
      console.log('Глава не найдена')
    }
  } catch (error) {
    console.log('Не удалось загрузить текст главы', error)
  }
}

onMounted(async () => {
  await getChapters()

  if (courseStore.chapters.length) {
    await loadChapter(courseStore.chapters[0].id)
  }
})

watch(() => courseStore.chapters, async () => {
  if (courseStore.chapters.length === 0) return

  await loadChapter(courseStore.chapters[courseStore.chapters.length - 1].id)
}, {deep: true})
</script>
