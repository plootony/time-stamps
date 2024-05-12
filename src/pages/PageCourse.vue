<template>
  <main-layout>
    <template #content>
      <div class="course">
        <div class="course__heading">
          <div class="course__title-wrapper">
            <button
                @click="$router.go(-1)"
                class="btn btn--primary"
            >Назад
            </button>

            <h1 class="course__title">{{ courseInfo?.title }}</h1>
          </div>

          <chapter-dialog @update-chapters="getAllChapters"/>
        </div>

        <div class="course__body">
          <Player
              :time="currentPlayerTime"
              :title="currentPlayerTitle"
          />

          <playlist
              :chapters-list="chaptersList"
              @updateAll="updateAll"
          />
        </div>

        <editor
            v-if="editorShow"
            :chapter-id="currentChapterId"
            :chapter-text="currentChapterText"
        />
      </div>
    </template>
  </main-layout>
</template>

<script setup lang="ts">
import {getAuth} from "firebase/auth";
import {collection, doc, getDoc, getDocs, getFirestore, query} from "firebase/firestore"
import {useRoute} from "vue-router"
import {onMounted, ref} from "vue"
import type {ICourse} from "@/interfaces/ICourse";
import type {IChapter} from "@/interfaces/IChapter";
import MainLayout from "@/layouts/MainLayout.vue"
import Player from "@/components/Player.vue";
import Playlist from "@/components/Playlist.vue";
import ChapterDialog from "@/components/ChapterDialog.vue";
import Editor from "@/components/Editor.vue";

const db = getFirestore()
const router = useRoute()
const isLoading = ref<boolean>(false)
const editorShow = ref<boolean>(false)

const userId = getAuth().currentUser?.uid
const courseId = router.params.id as string
const courseInfo = ref<ICourse | null>(null)

const chaptersList = ref<IChapter[]>([])

const currentPlayerTime = ref<number>(0)
const currentPlayerTitle = ref<string>('')
const currentChapterId = ref<string>('')
const currentChapterText = ref<string>('')

const getOneCourse = async (): Promise<void> => {

  try {
    isLoading.value = true

    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    const docRef = doc(db, `users/${userId}/courses/${courseId}`)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      courseInfo.value = docSnap.data() as ICourse
    } else {
      console.log("Документ не найден")
    }

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
const getAllChapters = async (): Promise<void> => {
  chaptersList.value = []

  try {
    isLoading.value = true

    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    const docRef = query(collection(db, `users/${userId}/courses/${courseId}/chapters/`))
    const docSnap = await getDocs(docRef)

    if (docSnap) {
      docSnap.docs.map(doc => {
        chaptersList.value.push(doc.data() as IChapter)
      })
    }

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const updateAll = (id: string, time: number, title: string, text: string): void => {
  currentPlayerTime.value = time
  currentPlayerTitle.value = title
  currentChapterId.value = id
  editorShow.value = true
  currentChapterText.value = text
}

// watch(currentChapterText, (newValue) => {
//   currentChapterText.value = newValue;
// })

onMounted(() => {
  getOneCourse()
  getAllChapters()
})
</script>