<template>
  <div class="player">
    <iframe
        class="player__frame"
        :src="`https://www.youtube.com/embed/${link}?si=gnxvFIpitPYsyqbC&amp;controls=1&amp;start=${time}`"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
    ></iframe>
    <h3 class="player__title">{{ title }}</h3>
  </div>
</template>

<script setup lang="ts">
defineProps(['time', 'title', 'link'])
</script>