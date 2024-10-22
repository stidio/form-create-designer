import { EventEmitter } from 'events';

const callEvent = new EventEmitter();
function postMessage(channel, message) {
  const callable = window[channel];
  if (typeof callable === 'function') {
    callable(message);
  } else if (callable !== undefined) {
    callable.postMessage(message);
  } else {
    console.log(channel, message);
  }
}

class ColaForm {
  #post(type, ...args) {
    callEvent.emit('colaForm', type, ...args);
  }

  /**
   * 设置主题
   * 支持: [Form]
   * @param {string} theme：'dark' | 'light'
   */
  setTheme = (theme) => this.#post('setTheme', theme);

  /**
   * 设置语言
   * 支持: [Designer]
   * @param {string} lang：'zhCN' | 'enUS'
   */
  setLang = (lang) => this.#post('setLang', lang);

  /**
   * 设置只读
   * 支持: [Form]
   * @param {boolean} readonly
   */
  setReadonly = (readonly) => this.#post('setReadonly', readonly);

  /**
   * 设置预览（预览模式下会隐藏按钮）
   * 支持: [Form]
   * @param {boolean} preview
   */
  setPreview = (preview) => this.#post('setPreview', preview);

  /**
   * 加载数据
   * 支持: [Designer, Form]
   * @param {string} schema: 表单纲要
   * @param {string} formData: 表单数据，Designer模式下该参数无效
   */
  load = (schema, formData) => this.#post('load', schema, formData);

  /**
   * 提交，通过[colaForm.save]消息返回数据
   * 支持: [Designer, Form]
   */
  submit = () => this.#post('submit');

  /**
   * 重置清空(Form模式只会清空表单数据), 通过[colaForm.reset]消息返回清空前的数据
   * 支持: [Designer, Form]
   */
  reset = () => this.#post('reset');
}

export { callEvent, postMessage, ColaForm };
