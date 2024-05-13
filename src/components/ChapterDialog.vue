<template>
  <button
      class="btn btn--primary"
      @click="modalShow = true"
      style="margin-right: 16px;"
  >Добавить новую главу
  </button>
  <the-modal
      :modalShow="modalShow"
      @modalClose="modalClose"
  >
    <template #header>
      <h2 class="modal__title">Добавить новую главу</h2>
    </template>

    <template #content>
      <form class="playlist__form">
        <div class="form-group">
          <label class="form-group__label">Заголовок</label>

          <input v-model="title" type="text" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Описание</label>

          <input v-model="desc" type="text" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Время пока что</label>

          <input v-model="time" type="text" class="form-group__input">
        </div>

      </form>
    </template>

    <template #footer>
      <button
          class="btn btn--outline"
          @click.prevent="modalClose"
      >Закрыть
      </button>

      <button
          @click.prevent="addNewChapter"
          class="btn btn--primary"
      >Сохранить
      </button>
    </template>
  </the-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import TheModal from "@/components/TheModal.vue";
import {getAuth} from "firebase/auth";
import {getFirestore, setDoc, doc} from "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import type {IChapter} from "@/interfaces/IChapter";
import {useRoute} from "vue-router";

const modalShow = ref<boolean>(false)
const modalClose = (): void => {
  modalShow.value = false
  title.value = ''
  desc.value = ''
  time.value = 0
}

const router = useRoute()
const db = getFirestore()

const userId = getAuth().currentUser?.uid
const courseId = router.params.id

const title = ref<string>('Глава 1 - Введение в JavaScript');
const desc = ref<string>('Как писать говнокод и не плакать по ночам');
const time = ref<number>(100);

const emit = defineEmits(['updateChapters'])

const updateChapters = (): void => {
  emit('updateChapters')
  console.log('Обновляем после добавления курса')
}

const addNewChapter = async (): Promise<void> => {
  const newChapter: IChapter = {
    id: uuidv4(),
    title: title.value,
    desc: desc.value,
    time: time.value
  }

  if (userId) {
    await setDoc(doc(db, `users/${userId}/courses/${courseId}/chapters/${newChapter.id}`), newChapter)
    updateChapters()
    modalClose()
  }
}
</script>