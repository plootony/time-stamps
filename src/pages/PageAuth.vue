<template>
  <guest-layout>
    <template #content>
      <div class="auth">
        <form class="auth-form">
          <h2 class="auth-form__title">{{ title }}</h2>

          <p class="auth-form__subtitle">{{ subtitle }}</p>

          <div :class="['form-group', {'is-loading' : isLoading, 'is-error' : errors.email}]">
            <label class="form-group__label">Введите логин</label>

            <input
                type="email"
                class="form-group__input"
                placeholder="name@mail.com"
                v-model="email">
          </div>

          <div :class="['form-group', {'is-loading' : isLoading, 'is-error' : errors.password}]">
            <label class="form-group__label">Введите пароль</label>

            <input
                type="password"
                class="form-group__input"
                placeholder="••••••••"
                v-model="password"
            >
          </div>

          <div v-if="!isAuth"
               :class="['form-group', {'is-loading' : isLoading, 'is-error' : errors.password}]">
            <label class="form-group__label">Повторите пароль</label>

            <input
                type="password"
                class="form-group__input"
                placeholder="••••••••"
                v-model="passwordConfirm"
            >
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
import GuestLayout from '@/layouts/GuestLayout.vue'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import {FirebaseError} from '@firebase/util'
import {useRouter} from 'vue-router'
import {toast} from 'vue3-toastify'

const router = useRouter()
const isAuth = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')

interface IErrors {
  email: boolean
  password: boolean
}

const errors = ref<IErrors>({
  email: false,
  password: false,
})

const toggleAuth = (): void => {
  isAuth.value = !isAuth.value
  clearForm()
  clearErrors()
}

//** Очищаем инптуы*/
const clearForm = (): void => {
  email.value = ''
  password.value = ''
  passwordConfirm.value = ''

}

/** Очищаем ошибки */
const clearErrors = (): void => {
  errors.value.email = false
  errors.value.password = false
}

/** Переключение форм */
const submitForm = (): void => {
  if (isAuth.value) {
    signIn()

  } else {
    signUp()
  }
}

// TODO: Возможно стоит вывести ошибки непосредственно под инпутом

/** Обработка ошибок */
function authErrors(error: FirebaseError) {
  if (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        toast.error('Такой email уже используется')
        errors.value.email = true
        break
      case 'auth/invalid-credential':
        toast.error('Неверный логин или пароль')
        errors.value.email = true
        break
      case 'auth/invalid-email':
        toast.error('Недопустимый формат email')
        errors.value.email = true
        break
      case 'auth/weak-password':
        toast.error('Слабый пароль. Пароль должен быть не менее 6 символов')
        errors.value.password = true
        break
      case 'auth/missing-password':
        toast.error('Необходимо ввести пароль')
        errors.value.password = true
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
  clearErrors()

  isLoading.value = true

  if (password.value !== passwordConfirm.value) {
    toast.error('Пароли не совпадают')
    isLoading.value = false
    return
  }

  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value)

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
  clearErrors()
  isLoading.value = true

  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value)

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