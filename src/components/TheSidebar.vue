<template>
  <aside class="sidebar">
    <a href="/" class="router-link-active router-link-exact-active logo">
      <img
          src="@/assets/images/logo.svg"
          width="44"
          height="45"
          alt="logo"
      >
    </a>

    <nav class="nav">
      <a href="/" class="router-link-active router-link-exact-active nav__item">
        <svg class="icon icon--home icon--lg">
          <use xlink:href="@/assets/icons/sprite.svg#home"></use>
        </svg>
      </a>

      <button
          @click.prevent="logout"
          class="nav__item nav__logout"
      >
        <svg class="icon icon--folder icon--lg">
          <use xlink:href="@/assets/icons/sprite.svg#arrow-long-left"></use>
        </svg>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import {getAuth, signOut} from "firebase/auth";
import {useRouter} from "vue-router";

const router = useRouter()

const logout = async (): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}
</script>