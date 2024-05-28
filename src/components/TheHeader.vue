<template>
  <header class="header">
    <span class="header__welcome">Welcome, Anton! 👋</span>

    <div class="header__controls">

      <TheSearch />

      <div class="dropdown">
        <button class="dropdown__btn">
          <svg class="icon icon--bell icon--lg">
            <use xlink:href="@/assets/icons/sprite.svg#bell"></use>
          </svg>
        </button>
      </div>

      <div class="dropdown">
        <button class="dropdown__btn">
          <svg class="icon icon--settings icon--lg">
            <use xlink:href="@/assets/icons/sprite.svg#settings"></use>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import TheSearch from "@/components/TheSearch.vue";
</script>