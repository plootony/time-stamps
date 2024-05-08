<template>
  <guest-layout>
    <template #content>
      <div class="auth">
        <form class="auth-form">
          <h2 class="auth-form__title">{{ title }}</h2>

          <p class="auth-form__subtitle">{{ subtitle }}</p>

          <div :class="['form-group', {'is-error' : isError}]">
            <label class="form-group__label">Введите логин</label>

            <input type="email" class="form-group__input" placeholder="name@mail.com">

            <p v-if="isError" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <div :class="['form-group', {'is-error' : isError}]">
            <label class="form-group__label">Введите пароль</label>

            <input type="password" class="form-group__input" placeholder="••••••••">

            <p v-if="isError" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <div v-if="!isAuth" :class="['form-group', {'is-error' : isError}]">
            <label class="form-group__label">Повторите пароль</label>

            <input type="password" class="form-group__input" placeholder="••••••••">

            <p v-if="isError" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <button class="btn btn--primary" type="submit">{{ title }}</button>

          <p @click="toggleAuth" class="auth-form__register">{{ link }}</p>
        </form>
      </div>
    </template>
  </guest-layout>
</template>

<script setup lang="ts">
import GuestLayout from "@/layouts/GuestLayout.vue";
import {computed, ref} from "vue";

const isError = ref<boolean>(true)
const isLoading = ref<boolean>(false)

const isAuth = ref<boolean>(false)

const toggleAuth = () => {
  isAuth.value = !isAuth.value
}

const title = computed<string>(() => {
  return isAuth.value ? 'Регистрация' : 'Авторизация'
})

const subtitle = computed<string>(() => {
  return isAuth.value ? 'Введите данные для регистрации' : 'Введите данные для авторизации'
})

const link = computed<string>(() => {
  return isAuth.value ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'
})

</script>
e>