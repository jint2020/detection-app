<template>
    <div>
        <HelloWorld msg="Vite + Vue" />
    </div>
</template>

<script setup lang="ts">
// src\components\HelloWorld.vue
import HelloWorld from '../components/HelloWorld.vue'
const onClickLeft = () => history.back();
</script>

<style scoped>
</style>