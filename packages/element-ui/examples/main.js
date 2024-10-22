import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import FcDesigner from '../src/index';
import App from './App.vue';
import { ColaForm } from './utils';

window.colaForm = new ColaForm();

const app = createApp(App);
app.use(ElementPlus);
app.use(FcDesigner.formCreate);
app.use(FcDesigner);

app.mount('#app');
