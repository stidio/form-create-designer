<template>
  <form-create v-model="formData" v-model:api="fapi" :rule="rule" :option="option" :disabled="disabled"
    @submit="onSubmit" @reload="onReload" @change="onChange" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { formCreate } from '../src/index';
import { callEvent, hookFetch, postMessage } from "./utils";

const option = ref({});
const rule = ref([]);
const fapi = ref(null);
const formData = ref({});
const disabled = ref(false);
const uploadFields = [];

function onSubmit(formData) {
  postMessage('colaForm.save', formCreate.toJson(formData));
}
function onReset() {
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
      hookUpload(undefined, true);
    } else if (type === 'setPreview') {
      // https://www.form-create.com/v3/guide/global-options
      option.value = { ...option.value ?? {}, preview: args[0] };
      hookUpload(undefined, true);
    } else if (type === 'load') {
      uploadFields.length = 0;
      const schema = formCreate.parseJson(args[0] ?? '{"rule": [], "option": {}}');
      rule.value = (schema?.rule ?? []).map(item => {
        if (item.type === 'upload') {
          item.props = {
            // 只保留了disabled, multiple, accept, limit 4个属性，详见upload.js
            ...item.props ?? {},
            onRemove: (file, fileList) => {
              postMessage('colaForm.upload.remove', formCreate.toJson({ id: item.field, file: file.url }));
            },
            onPreview: (file) => {
              postMessage('colaForm.upload.preview', formCreate.toJson({ id: item.field, file: file.url }));
            },
          };
          uploadFields.push({
            id: item.field,
            ...['disabled', 'multiple', 'accept', 'limit'].reduce((obj, field) => {
              if (item.props.hasOwnProperty(field)) {
                return { ...obj, [field]: item.props[field] };
              }
              return obj;
            }, {})
          });
        }
        return item;
      });
      option.value = { ...schema.option ?? {}, preview: option.value?.preview };
      formData.value = formCreate.parseJson(args[1] ?? '{}');
    } else if (type === 'submit') {
      fapi.value.submit();
    } else if (type === 'reset') {
      onReset();
      fapi.value.resetFields();
    } else if (type === 'setFieldsValue') {
      formData.value = { ...formData.value, ...formCreate.parseJson(args[0] ?? "{}") };
    }
  });
})
onUnmounted(() => {
  callEvent.removeAllListeners('colaForm');
})

function hookUpload(id, onlyStyle = false) {
  if (id != undefined && !uploadFields.some((field) => field.id == id)) return;

  setTimeout(() => {
    document.querySelectorAll('._fc-upload').forEach((fcUpload, index) => {
      if (index >= uploadFields.length) return;
      const field = uploadFields[index];
      if (id != undefined && id != field.id) return;

      const elUpload = fcUpload.querySelector('.el-upload.el-upload--text');
      if (elUpload) {
        if (onlyStyle) {
          const button = elUpload.querySelector('button');
          if (button) {
            button.onclick = (event) => {
              postMessage('colaForm.upload', formCreate.toJson({ ...field, files: formData.value[field.id] }));
              event.stopPropagation();
            };
          }
        }

        if (disabled.value === true || option.value?.preview === true) {
          elUpload.style.display = 'none';
        } else {
          elUpload.style.display = 'inline-flex';
          elUpload.style.margin = '0 0 10px';
        }
      }
    });
  }, 100);
}

const onReload = () => hookUpload();
const onChange = (field) => {
  hookUpload(field);
  postMessage('colaForm.change', formCreate.toJson({ id: field, formData: formData.value }));
}

hookFetch(formCreate);
</script>

<style>
  .el-upload-list {
    margin: 0 !important;
  }
</style>