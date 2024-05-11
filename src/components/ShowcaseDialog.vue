<template>
  <button
      class="btn btn--primary"
      @click="modalShow = true"
  >Добавить новый курс
  </button>

  <the-modal
      :modalShow="modalShow"
      @modalClose="modalClose"
  >
    <template #header>
      <h2 class="modal__title">Добавить новый курс</h2>
    </template>

    <template #content>
      <form class="showcase__form">
        <div class="form-group">
          <label class="form-group__label">Заголовок</label>
          <input v-model="title" type="text" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Описание</label>
          <input v-model="desc" type="text" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Картинка</label>
          <input @change="getImage" type="file" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Ссылка на ютуб</label>
          <input v-model="link" type="text" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Теги</label>
          <input v-model="tags" type="text" class="form-group__input">
        </div>
      </form>
    </template>

    <template #footer>
      <button class="btn btn--outline" @click.prevent="modalClose">Закрыть</button>
      <button @click.prevent="addNewCourse" class="btn btn--primary">Сохранить</button>
    </template>
  </the-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import {getAuth} from "firebase/auth";
import {getFirestore, setDoc, doc} from "firebase/firestore";
import type {ICourse} from "@/interfaces/ICourse";
import TheModal from "@/components/TheModal.vue";

const db = getFirestore()
const title = ref<string>('');
const desc = ref<string>('');
const image = ref<string>('');
const link = ref<string>('');
const tags = ref<string>('');

const emit = defineEmits(['updateCourses'])
const updateCourses = (): void => {
  emit('updateCourses')
  console.log('Обновляем после добавления курса')
}

const getImage = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file.name;
  }
}

const addNewCourse = async (): Promise<void> => {
  const newCourse: ICourse = {
    id: uuidv4(),
    title: title.value,
    desc: desc.value,
    image: image.value,
    link: link.value,
    tags: tags.value.split(',').map(tag => tag.trim()),
    createdAt: new Date(),
    isCompleted: false
  }

  const userId = getAuth().currentUser?.uid
  if (userId) {
    await setDoc(doc(db, `users/${userId}/courses/${newCourse.id}`), newCourse)
    updateCourses()
    modalClose()
  }
}

const modalShow = ref<boolean>(false)

const modalClose = (): void => {
  modalShow.value = false
  title.value = ''
  desc.value = ''
  image.value = ''
  link.value = ''
  tags.value = ''
}
</script>