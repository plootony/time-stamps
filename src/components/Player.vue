<template>
  <div class="player">
    <div class="player__frame"> {{ time }}</div>
    <h3 class="player__title"> {{ title }} </h3>
  </div>


</template>

<script setup lang="ts">
defineProps(['time', 'title'])
</script>