<template>
  <div class="editor">
    <div ref="editor" id="editor" class="editor__input"></div>
  </div>
  <button class="btn btn--primary editor__btn" @click="save">Сохранить</button>
</template>

<script setup>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import Paragraph from "@editorjs/paragraph";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import Warning from "@editorjs/warning";
import RawTool from "@editorjs/raw";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import Delimiter from "@editorjs/delimiter";
import SimpleImage from "@editorjs/simple-image";

import {doc, getFirestore, updateDoc} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
import {useRoute} from "vue-router";
import {ref, defineProps, onMounted} from "vue";
import {watch} from "vue";

const db = getFirestore();
const router = useRoute();

const userId = getAuth().currentUser?.uid;
const courseId = router.params.id;
const chapterNewText = ref('')
let editorjs;

const emit = defineEmits(['updateChapters'])

const updateChapters = () => {
  emit('updateChapters')
}
const props = defineProps({
  chapterId: {
    type: String,
    required: true
  },
  chapterText: {
    type: String,
    required: false
  }
})

const save = async () => {
  const chapterRef = doc(db, `users/${userId}/courses/${courseId}/chapters/${props.chapterId}`)

  try {
    chapterNewText.value = await editorjs.save()
    chapterNewText.value = JSON.stringify(chapterNewText.value)

    await updateDoc(chapterRef, {
      text: chapterNewText.value
    })

    console.log('Chapter saved', chapterNewText.value)
    updateChapters()

  } catch (error) {
    console.log("Saving failed: ", error)
  }
}
onMounted(() => {
  const initializeEditor = (text) => {
    editorjs = new EditorJS({
      holder: "editor",
      placeholder: 'Начните свою историю здесь!',
      ...(text !== undefined ? {data: JSON.parse(text)} : {}),
      tools: {
        Header,
        List,
        CodeTool,
        Paragraph,
        Embed,
        Table,
        Checklist,
        Marker,
        Warning,
        RawTool,
        Quote,
        InlineCode,
        Delimiter,
        SimpleImage,
      }
    })
  }

  initializeEditor(props.chapterText);

  watch(() => props.chapterText, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (editorjs) {
        editorjs.destroy();
      }
      initializeEditor(newValue);
    }
  })
})
</script>
