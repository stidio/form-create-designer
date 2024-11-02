import { EventEmitter } from 'events';
import uniqueId from '@form-create/utils/lib/unique';

const callEvent = new EventEmitter();
function postMessage(channel, message) {
  const callable = window[channel];
  if (typeof callable === 'function') {
    callable(message);
  } else if (typeof callable === 'object' && callable.postMessage) {
    callable.postMessage(message);
  } else {
    console.log(channel, message);
  }
}

class ColaForm {
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.postMessage = postMessage; // 开发环境构建一个函数方便调试
    }
  }

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
   * @param {string} formData: 表单数据（可夹带私数据），Designer模式下该参数无效
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

  /**
   * 设置表单项数据（在老数据上合并新数据）
   * 支持: [Form]
   * @param {[field]: value} data: 表单项数据集合，可只传入部分数据，可夹带私数据
   */
  setFieldsValue = (data) => this.#post('setFieldsValue', data);
}

function hookFetch(form) {
  const orgFetch = form.fetch;
  form.fetch = (option, effectArgs) => {
    if (option.action.startsWith('colaForm.$')) {
      if (!window[option.action]) return; // 未注册channel不处理
      
      const session = uniqueId();
      const sessionTimeout = setTimeout(() => {
        if (window[option.action][session]) {
          option.onError?.('timeout');
          delete window[option.action][session];
        }
      }, 30000);

      window[option.action][session] = {
        setData: (data) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(option.action, session, 'setData:', data);
          }

          try {
            const body = JSON.parse(data);
            if (typeof body === 'object' && body !== null && body.hasOwnProperty('error')) {
              option.onError?.(body.error);
            } else {
              option.onSuccess(body);
            }
          } catch (e) {
            option.onError?.(e);
          }

          delete window[option.action][session];
          clearTimeout(sessionTimeout);
        },
      };

      postMessage(
        option.action,
        JSON.stringify({
          session,
          id: effectArgs.rule.field,
          type: effectArgs.rule.type,
          data: option.data,
          headers: option.headers,
        })
      );
    } else {
      return orgFetch(option, effectArgs);
    }
  };
}

export { callEvent, postMessage, ColaForm, hookFetch };
