<template>
  <guest-layout>
    <template #content>
      <div class="auth">
        <form class="auth-form">
          <h2 class="auth-form__title">{{ title }}</h2>

          <p class="auth-form__subtitle">{{ subtitle }}</p>

          <div :class="['form-group', {'is-loading' : isLoading}]">
            <label class="form-group__label">Введите логин</label>

            <input
                type="email"
                class="form-group__input"
                placeholder="name@mail.com"
                v-model="email">
          </div>

          <div :class="['form-group', {'is-loading' : isLoading}]">
            <label class="form-group__label">Введите пароль</label>

            <input
                type="password"
                class="form-group__input"
                placeholder="••••••••"
                v-model="password"
            >
          </div>

          <div v-if="!isAuth" :class="['form-group', {'is-loading' : isLoading}]">
            <label class="form-group__label">Повторите пароль</label>

            <input
                type="password"
                class="form-group__input"
                placeholder="••••••••"
                v-model="passwordConfirm"
            >
          </div>

          <div v-if="isError" class="auth-form__error"> {{ isError }}</div>

          <button
              :class="['btn btn--primary', {'is-loading' : isLoading}]"
              type="submit"
              @click.prevent="submitForm"
          >{{ title }}
          </button>

          <span
              @click="toggleAuth"
              class="auth-form__register"
          >{{ link }}</span>
        </form>
      </div>
    </template>
  </guest-layout>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import GuestLayout from "@/layouts/GuestLayout.vue";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {useRouter} from "vue-router";

const router = useRouter()
const isAuth = ref<boolean>(false)
const isError = ref<string>('')
const isLoading = ref<boolean>(false)

const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')

const toggleAuth = (): void => {
  isAuth.value = !isAuth.value
}

const submitForm = (): void => {
  if (isAuth.value) {
    signIn()

  } else {
    signUp()
  }
}

const signUp = async (): Promise<void> => {
  isLoading.value = true

  if (password.value !== passwordConfirm.value) {
    isError.value = 'Пароли не совпадают'
    isLoading.value = false
    return
  }

  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      isError.value = error.message
    }
  } finally {
    isLoading.value = false
  }
}

const signIn = async (): Promise<void> => {
  isLoading.value = true

  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value)
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      isError.value = error.message
    }
  } finally {
    isLoading.value = false
  }
}

const title = computed<string>((): string => {
  return isAuth.value ? 'Авторизация' : 'Регистрация '
})

const subtitle = computed<string>((): string => {
  return isAuth.value ? 'Введите данные для авторизации' : 'Введите данные для регистрации'
})

const link = computed<string>((): string => {
  return isAuth.value ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'
})
</script>