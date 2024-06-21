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
      <router-link
          v-for="link in links"
          :key="link.id"
          :to="{name: link.url}"
          class="nav__item">
        <TheIcon :name="link.icon" modify="icon--lg"/>
      </router-link>

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

<script setup lang='ts'>
import {getAuth, signOut} from 'firebase/auth'
import {useRouter} from 'vue-router'
import TheIcon from "@/components/TheIcon.vue";

const router = useRouter()

interface ILink {
  id: number,
  icon: string,
  url: string
}

const links = [
  {
    id: 1,
    icon: 'home',
    url: 'home'
  },
  {
    id: 2,
    icon: 'calendar',
    url: 'calendar'
  }
] as ILink[]

const logout = async (): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}
</script>