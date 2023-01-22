<template>
  <div class="container">
    <MainComponent/>
  </div>
</template>

<script setup>
import MainComponent from './components/MainComponent.vue'

</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
</style>
