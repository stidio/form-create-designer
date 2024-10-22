<template>
  <form-create v-model="formData" v-model:api="fapi" :rule="rule" :option="option" :disabled="disabled" @submit="onSubmit" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { formCreate } from '../src/index';
import { callEvent, postMessage } from "./utils";
import form from "../src/config/base/form";

const option = ref({});
const rule = ref([]);
const fapi = ref(null);
const formData = ref({});
const disabled = ref(false);

const onSubmit = (formData) => {
  postMessage('colaForm.save', formCreate.toJson(formData));
}
const onReset = () => {
  postMessage('colaForm.reset', formCreate.toJson(formData.value));
}

onMounted(() => {
  callEvent.addListener('colaForm', (type, ...args) => {
    if (type === 'setTheme') {
      const [theme] = args;
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } else if (type === 'setLang') {

    } else if (type === 'setReadonly') {
      disabled.value = args[0];
    } else if (type === 'setPreview') {
      // https://www.form-create.com/v3/guide/global-options
      option.value = { ...option.value ?? {}, preview: args[0] };
    } else if (type === 'load') {
      const schema = formCreate.parseJson(args[0] ?? '{"rule": [], "option": {}}');
      rule.value = schema?.rule ?? [];
      option.value = { ...schema.option ?? {}, preview: option.value?.preview };
      formData.value = formCreate.parseJson(args[1] ?? '{}');
    } else if (type === 'submit') {
      fapi.value.submit();
    } else if (type === 'reset') {
      onReset();
      fapi.value.resetFields();
    }
  });
})
onUnmounted(() => {
  callEvent.removeAllListeners('colaForm');
})

</script>