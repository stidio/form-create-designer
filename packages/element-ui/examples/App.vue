<template>
  <Form v-if="type === 'Form'" />
  <Designer v-if="type === 'Designer'" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Designer from './Designer.vue';
import Form from './Form.vue';

const type = ref('');

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  type.value = urlParams.get('type')?.at(0)?.toLowerCase() == 'd' ? 'Designer' : 'Form';
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>