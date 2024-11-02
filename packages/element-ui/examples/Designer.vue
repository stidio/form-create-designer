<template>
  <fc-designer ref="designer" height="100vh" :config="config" :locale="locale" @save="onSave" @exit="onExit" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { formCreate, designerForm } from '../src/index';
import En from "../src/locale/en";
import { callEvent, postMessage, hookFetch } from "./utils";

const designer = ref(null);
const config = ref({
  autoActive: true,
  fieldReadonly: false,
  showSaveBtn: true,
  showInputData: false,
  formOptions: {
    submitBtn: false,
  }
});
const locale = ref(null);

function onSave({ rule, options }) {
  postMessage('colaForm.save', `{"rule":${rule.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}, "option":${options.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}}`);
}
function onExit() {
  postMessage('colaForm.exit', formCreate.toJson({ rule: designer.value.getRule(), option: designer.value.getOption() }));
}
function onReset() {
  postMessage('colaForm.reset', formCreate.toJson({ rule: designer.value.getRule(), option: designer.value.getOption() }));
}

onMounted(() => {
  callEvent.addListener('colaForm', (type, ...args) => {
    if (type === 'setTheme') {

    } else if (type === 'setLang') {
      const [lang] = args;
      locale.value = (lang ?? '').toLowerCase().includes('en') ? En : null;
    } else if (type === 'setReadonly') {

    } else if (type === 'setPreview') {

    } else if (type === 'load') {
      const schema = formCreate.parseJson(args[0] ?? '{"rule": [], "option": {}}');
      designer.value.setRule(schema.rule);
      designer.value.setOption(schema.option);
    } else if (type === 'submit') {
      designer.value.handleSave();
    } else if (type === 'reset') {
      onReset();
      designer.value.clearDragRule();
    }
  });
})
onUnmounted(() => {
  callEvent.removeAllListeners('colaForm');
})

hookFetch(designerForm);
hookFetch(formCreate);
</script>

<style>
.el-main {
  --el-main-padding: 10px;
}

.el-header {
  --el-header-padding: 0 10px;
}

._fc-m-con {
  padding: var(--el-main-padding) !important;
}
</style>