<template>
  <div :class="['editor', { 'is-disabled': !courseStore.chapterId }]">
    <div  ref="editor" id="editor" class="editor__input"></div>
  </div>

  <button
      v-if="courseStore.chapterId"
      class="btn btn--primary editor__btn"
      @click="saveChapter"
  >Сохранить</button>
</template>

<script setup>
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import CodeTool from '@editorjs/code'
import Paragraph from '@editorjs/paragraph'
import Table from '@editorjs/table'
import Checklist from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'

import { doc, updateDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import {onMounted, onUnmounted, watch} from 'vue'
import { useCourseStore } from '@/stores/course'

const router = useRoute()
const courseStore = useCourseStore()
const courseId = router.params.id
let editorjs = null

const saveChapter = async () => {
  const chapterRef = doc(courseStore.db, `users/${courseStore.userId}/courses/${courseId}/chapters/${courseStore.chapterId}`)

  try {
    const savedData = await editorjs.save()
    courseStore.chapterText = JSON.stringify(savedData)

    await updateDoc(chapterRef, {
      text: courseStore.chapterText
    })

    console.log('Глава успешно сохранена!')

  } catch (error) {
    console.error('Сохранить главу не удалось!', error)
  }
}

onMounted(() => {
  const initializeEditor = (text) => {
    if (editorjs) {
      editorjs.destroy()
    }

    editorjs = new EditorJS({
      holder: "editor",
      placeholder: 'Начните свою историю здесь!',
      data: text ? JSON.parse(text) : {},
      tools: {
        header: Header,
        list: List,
        code: CodeTool,
        paragraph: Paragraph,
        table: Table,
        checklist: Checklist,
        delimiter: Delimiter,
      },
    })
  }

  watch(() => courseStore.chapterText, (newValue) => {
    initializeEditor(newValue)
    console.log('текст главы в вотчере', courseStore.chapterText)
  })

  initializeEditor(courseStore.chapterText)
})

onUnmounted(() => {
  courseStore.chapterId = null
})

</script>