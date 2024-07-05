<template>
  <guest-layout>
    <template #content>
      <div class="auth">
        <form class="auth-form">
          <h2 class="auth-form__title">{{ title }}</h2>

          <p class="auth-form__subtitle">{{ subtitle }}</p>

          <div :class="['form-group', {'is-loading' : isLoading, 'is-error' : v.userEmail.$errors.length}]">
            <label class="form-group__label">Введите логин</label>

            <input
              type="email"
              class="form-group__input"
              placeholder="name@mail.com"
              v-model="v.userEmail.$model"
            >
            <div class="form-group__errors">
                <span
                  v-for="error in v.userEmail.$errors"
                  :key="error.$uid"
                  class="form-group__error"
                > {{ error.$message }}</span>
            </div>
          </div>

          <div :class="['form-group', {'is-loading' : isLoading, 'is-error' : v.password.$errors.length}]">
            <label class="form-group__label">Введите пароль</label>

            <input
              type="password"
              class="form-group__input"
              placeholder="••••••••"
              v-model="v.password.$model"
            >

            <div class="form-group__errors">
                <span
                  v-for="error in v.password.$errors"
                  :key="error.$uid"
                  class="form-group__error"
                > {{ error.$message }}</span>
            </div>
          </div>

          <div
            v-if="!isAuth"
            :class="['form-group', {'is-loading' : isLoading, 'is-error' : v.passwordConfirm.$errors.length}]"
          >
            <label class="form-group__label">Повторите пароль</label>

            <input
              type="password"
              class="form-group__input"
              placeholder="••••••••"
              v-model="v.passwordConfirm.$model"
            >

            <div class="form-group__errors">
                <span
                  v-for="error in v.passwordConfirm.$errors"
                  :key="error.$uid"
                  class="form-group__error"
                > {{ error.$message }}</span>
            </div>
          </div>

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

<script setup lang='ts'>
import {computed, ref} from 'vue'
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {FirebaseError} from '@firebase/util'
import {useRouter} from 'vue-router'
import {toast} from 'vue3-toastify'
import useVuelidate from '@vuelidate/core'
import {helpers, minLength, required, maxLength, email, sameAs} from '@vuelidate/validators'
import GuestLayout from '@/layouts/GuestLayout.vue'

const router = useRouter()
const isAuth = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const userEmail = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')

interface IErrors {
  userEmail: boolean
  password: boolean
}

const rules = computed(() => ({
  userEmail: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    email: helpers.withMessage('Вы ввели неверный email', email)
  },
  password: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    minLength: helpers.withMessage(`Минимальная длина: 8 символа`, minLength(8)),
    maxLength: helpers.withMessage(`Максимальная длина: 16 символа`, maxLength(16))
  },
  passwordConfirm: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    sameAsPassword: helpers.withMessage(`Пароли не совпадают`, sameAs(password.value)),
    minLength: helpers.withMessage(`Минимальная длина: 8 символа`, minLength(8)),
    maxLength: helpers.withMessage(`Максимальная длина: 16 символа`, maxLength(16))
  }
}))

const v = useVuelidate(rules, {userEmail, password, passwordConfirm})

const errors = ref<IErrors>({
  userEmail: false,
  password: false
})

const toggleAuth = (): void => {
  isAuth.value = !isAuth.value
  clearForm()
}

/** Очищаем инптуы*/
const clearForm = (): void => {
  userEmail.value = ''
  password.value = ''
  passwordConfirm.value = ''
}

/** Переключение форм */
const submitForm = (): void => {
  if (isAuth.value) {
    signIn()

  } else {
    signUp()
  }
}

/** Обработка ошибок */
function authErrors(error: FirebaseError) {
  if (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        toast.error('Такой email уже используется')
        errors.value.userEmail = true
        break
      case 'auth/invalid-credential':
        toast.error('Неверный логин или пароль')
        errors.value.userEmail = true
        break
      default:
        toast.error('Произошла непредвиденная ошибка: ' + error.message)
        break
    }
  } else {
    toast.error('Произошла непредвиденная ошибка: ' + error)
  }
}

/** Регистрация */
const signUp = async (): Promise<void> => {
  v.value.$touch()

  if (v.value.$error) return

  isLoading.value = true

  if (password.value !== passwordConfirm.value) {
    toast.error('Пароли не совпадают')
    isLoading.value = false
    return
  }

  try {
    await createUserWithEmailAndPassword(getAuth(), userEmail.value, password.value)

    router.push('/')
  } catch (error: unknown) {

    if (error instanceof FirebaseError) {
      authErrors(error)
    }

  } finally {
    isLoading.value = false
  }
}

/** Авторизация*/
const signIn = async (): Promise<void> => {
  passwordConfirm.value = password.value

  v.value.$touch()

  if (v.value.$error) return

  isLoading.value = true

  try {
    await signInWithEmailAndPassword(getAuth(), userEmail.value, password.value)

    router.push('/')
  } catch (error: unknown) {

    if (error instanceof FirebaseError) {
      authErrors(error)
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