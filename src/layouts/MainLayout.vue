<template>
  <div class="wrap">
    <the-sidebar/>

    <div class="content">
      <the-header/>

      <main class="main">
        <slot name="content"></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TheSidebar from "@/components/TheSidebar.vue";
</script>