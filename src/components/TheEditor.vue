<template>
  <div class="editor">
    <QuillEditor
        @ready="ready"
        ref="editorRef"
        theme="snow"
        toolbar="full"
        @text-change="highlightCode"
    /></div>

  <button
      class="btn btn--primary"
      @click="saveChapter"
  >Сохранить главу</button>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useCourseStore} from "@/stores/course"
import {doc, updateDoc} from 'firebase/firestore'
import {useRoute} from 'vue-router'
import {QuillEditor} from '@vueup/vue-quill'
import hljs from 'highlight.js'

const router = useRoute()
const courseStore = useCourseStore()
const courseId = router.params.id as string
const editorRef = ref<InstanceType<typeof QuillEditor> | null>(null)
const isReady = ref<boolean>(false)

const ready = (): void => {
  isReady.value = true
}

/** Получаем текст главы из эдитора */
const saveChapter = async (): Promise<void> => {
  const chapterRef = doc(courseStore.db, `users/${courseStore.userId}/courses/${courseId}/chapters/${courseStore.chapterId}`)
  try {
    if (editorRef.value === null || !isReady.value) return
    courseStore.chapterText = editorRef.value.getHTML()
    await updateDoc(chapterRef, {
      text: courseStore.chapterText
    })
    console.log('Глава успешно сохранена!')
  } catch (error) {
    console.error('Сохранить главу не удалось!', error)
  }
}

/** Записываем текст главы в эдитор */
const setChapter = (): void => {
  if (editorRef.value === null || !isReady.value) return
  editorRef.value.setHTML(courseStore.chapterText)
}

/** Подсветка кода */
const highlightCode = (): void => {
  const elements = document.querySelectorAll('.ql-syntax');
  elements.forEach((block) => {
    hljs.highlightBlock(block as HTMLElement);
  })
}

watch(() => courseStore.chapterId, (): void => {
  setChapter()
})
</script>

