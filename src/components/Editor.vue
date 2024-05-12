<template>
  <div class="editor">
    <div class="editor__input">
      <small>{{ chapterId }}</small>
      <br>
      <br>
      <p>{{ chapterText }}</p>
    </div>

    <button @click="updateTextOnly" class="btn btn--primary">Сохранить</button>
  </div>
</template>

<script setup lang="ts">
import {doc, getFirestore, updateDoc} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
import {useRoute} from "vue-router";
import {ref} from "vue";

const db = getFirestore()
const router = useRoute()

const userId = getAuth().currentUser?.uid
const courseId = router.params.id


const props = defineProps({
  chapterId: {
    type: String,
    required: true
  },
  chapterText: {
    type: String,
    required: true
  }
})

// Рабочее сохранение данных
const chapterNewText = ref('')

async function updateTextOnly() {
  const chapterRef = doc(db, `users/${userId}/courses/${courseId}/chapters/${props.chapterId}`)

  try {
    await updateDoc(chapterRef, {
      text: chapterNewText.value
    })
    console.log('Поле "text" успешно обновлено');
  } catch (error) {
    console.error('Ошибка при обновлении поля "text":', error);
  }
}
</script>
