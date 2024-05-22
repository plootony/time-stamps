<!--<template>-->
<!--  <div v-show="courseStore.chapterId" class="editor">-->
<!--    <div ref="editor" id="editor" class="editor__input"></div>-->
<!--  </div>-->

<!--  <button class="btn btn&#45;&#45;primary editor__btn" @click="saveChapter">Сохранить</button>-->
<!--</template>-->

<!--<script setup>-->
<!--import EditorJS from "@editorjs/editorjs"-->
<!--import Header from "@editorjs/header"-->
<!--import List from "@editorjs/list"-->
<!--import CodeTool from "@editorjs/code"-->
<!--import Paragraph from "@editorjs/paragraph"-->
<!--import Embed from "@editorjs/embed"-->
<!--import Table from "@editorjs/table"-->
<!--import Checklist from "@editorjs/checklist"-->
<!--import Marker from "@editorjs/marker"-->
<!--import Warning from "@editorjs/warning"-->
<!--import RawTool from "@editorjs/raw"-->
<!--import Quote from "@editorjs/quote"-->
<!--import InlineCode from "@editorjs/inline-code"-->
<!--import Delimiter from "@editorjs/delimiter"-->
<!--import SimpleImage from "@editorjs/simple-image"-->

<!--import { doc, updateDoc } from 'firebase/firestore'-->
<!--import { useRoute } from "vue-router"-->
<!--import { onMounted, watch } from "vue"-->
<!--import { useCourseStore } from "@/stores/course"-->

<!--const router = useRoute()-->
<!--const courseStore = useCourseStore()-->
<!--const courseId = router.params.id-->
<!--let editorjs = null-->

<!--const saveChapter = async () => {-->
<!--  const chapterRef = doc(courseStore.db, `users/${courseStore.userId}/courses/${courseId}/chapters/${courseStore.chapterId}`)-->

<!--  try {-->
<!--    // Сохраняем данные из редактора-->
<!--    const savedData = await editorjs.save()-->
<!--    courseStore.chapterText = JSON.stringify(savedData)-->

<!--    // Обновляем документ в Firestore-->
<!--    await updateDoc(chapterRef, {-->
<!--      text: courseStore.chapterText-->
<!--    })-->

<!--    console.log("Text saved: ", courseStore.chapterText)-->

<!--  } catch (error) {-->
<!--    console.error("Saving failed: ", error)-->
<!--  }-->
<!--}-->

<!--onMounted(() => {-->
<!--  const initializeEditor = (text) => {-->
<!--    if (editorjs) {-->
<!--      editorjs.destroy()-->
<!--    }-->

<!--    editorjs = new EditorJS({-->
<!--      holder: "editor",-->
<!--      placeholder: 'Начните свою историю здесь!',-->
<!--      data: text ? JSON.parse(text) : {},-->
<!--      tools: {-->
<!--        header: Header,-->
<!--        list: List,-->
<!--        code: CodeTool,-->
<!--        paragraph: Paragraph,-->
<!--        embed: Embed,-->
<!--        table: Table,-->
<!--        checklist: Checklist,-->
<!--        marker: Marker,-->
<!--        warning: Warning,-->
<!--        raw: RawTool,-->
<!--        quote: Quote,-->
<!--        inlineCode: InlineCode,-->
<!--        delimiter: Delimiter,-->
<!--        image: SimpleImage,-->
<!--      },-->
<!--    })-->
<!--  }-->

<!--  initializeEditor(courseStore.chapterText)-->

<!--  watch(() => courseStore.chapterText, (newValue, oldValue) => {-->
<!--      initializeEditor(newValue)-->
<!--      console.log('текст главы в вотчере', courseStore.chapterText)-->
<!--  })-->
<!--})-->
<!--</script>-->
<template>
  <div v-show="courseStore.chapterId" class="editor">
    <div ref="editor" id="editor" class="editor__input"></div>
  </div>

  <button class="btn btn--primary editor__btn" @click="saveChapter">Сохранить</button>
</template>

<script setup>
import EditorJS from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import CodeTool from "@editorjs/code"
import Paragraph from "@editorjs/paragraph"
import Embed from "@editorjs/embed"
import Table from "@editorjs/table"
import Checklist from "@editorjs/checklist"
import Marker from "@editorjs/marker"
import Warning from "@editorjs/warning"
import RawTool from "@editorjs/raw"
import Quote from "@editorjs/quote"
import InlineCode from "@editorjs/inline-code"
import Delimiter from "@editorjs/delimiter"
import SimpleImage from "@editorjs/simple-image"

import { doc, updateDoc } from 'firebase/firestore'
import { useRoute } from "vue-router"
import { onMounted, watch } from "vue"
import { useCourseStore } from "@/stores/course"

const router = useRoute()
const courseStore = useCourseStore()
const courseId = router.params.id
let editorjs = null

const saveChapter = async () => {
  const chapterRef = doc(courseStore.db, `users/${courseStore.userId}/courses/${courseId}/chapters/${courseStore.chapterId}`)

  try {
    // Сохраняем данные из редактора
    const savedData = await editorjs.save()
    courseStore.chapterText = JSON.stringify(savedData)

    // Обновляем документ в Firestore
    await updateDoc(chapterRef, {
      text: courseStore.chapterText
    })

    console.log("Text saved: ", courseStore.chapterText)

  } catch (error) {
    console.error("Saving failed: ", error)
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
        embed: Embed,
        table: Table,
        checklist: Checklist,
        marker: Marker,
        warning: Warning,
        raw: RawTool,
        quote: Quote,
        inlineCode: InlineCode,
        delimiter: Delimiter,
        image: SimpleImage,
      },
    })
  }

  // Инициализируем редактор с текстом выбранной главы
  watch(() => courseStore.chapterText, (newValue) => {
    initializeEditor(newValue)
    console.log('текст главы в вотчере', courseStore.chapterText)
  })

  // Инициализируем редактор при первом монтировании
  initializeEditor(courseStore.chapterText)
})
</script>
