<template>
  <guest-layout>
    <template #content>
      <div class="auth">
        <form v-if="!isRegistered" class="auth-form">
          <h2 class="auth-form__title">Авторизация</h2>
          <p class="auth-form__subtitle">Введите логин и пароль для авторизации</p>

          <div class="form-group">
            <label class="form-group__label">Введите логин</label>
            <input type="email" class="form-group__input" placeholder="name@mail.com">
            <p v-if="false" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <div class="form-group">
            <label class="form-group__label">Введите пароль</label>
            <input type="password" class="form-group__input" placeholder="••••••••">
            <p v-if="false" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <button class="btn btn--primary" type="submit">Войти</button>

          <p class="auth-form__register">Нет аккаунта? <span @click="isRegistered = true">Регистрация</span></p>
        </form>

        <form v-else class="auth-form">
          <h2 class="auth-form__title">Регистрация</h2>
          <p class="auth-form__subtitle">Введите email и пароль для авторизации</p>

          <div class="form-group">
            <label class="form-group__label">Введите email</label>
            <input type="email" class="form-group__input" placeholder="name@mail.com">
            <p v-if="false" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <div class="form-group">
            <label class="form-group__label">Введите пароль</label>
            <input type="password" class="form-group__input" placeholder="••••••••">
            <p v-if="false" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <div class="form-group">
            <label class="form-group__label">Повторите пароль</label>
            <input type="password" class="form-group__input" placeholder="••••••••">
            <p v-if="false" class="form-group__error">Тут будет выводиться ошибка валидации, авторизации и тд</p>
          </div>

          <button class="btn btn--primary" type="submit">Регистрация</button>

          <p class="auth-form__register">Уже есть аккаунт? <span @click="isRegistered = false">Авторизация</span></p>
        </form>
      </div>
    </template>
  </guest-layout>
</template>

<script setup lang="ts">
import GuestLayout from "@/layouts/GuestLayout.vue";
import {ref} from "vue";

const isRegistered = ref<boolean>(false)
</script>