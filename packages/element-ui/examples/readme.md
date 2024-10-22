# 模式切换

通过type=?切换，只要前置字母是(d|D)就切换到设计器模式，否则为表单模式

> sf.html: 表单模式
>
> sf.html?type=d: 设计器模式



# 接口

使用colaForm实例调用

```js
class ColaForm {
  /**
   * 设置主题
   * 支持: [Form]
   * @param {string} theme：'dark' | 'light'
   */
  setTheme(theme);

  /**
   * 设置语言
   * 支持: [Designer]
   * @param {string} lang：'zhCN' | 'enUS'
   */
  setLang(lang);

  /**
   * 设置只读
   * 支持: [Form]
   * @param {boolean} readonly
   */
  setReadonly = (readonly);

  /**
   * 设置预览（预览模式下会隐藏按钮）
   * 支持: [Form]
   * @param {boolean} preview
   */
  setPreview(preview);

  /**
   * 加载数据
   * 支持: [Designer, Form]
   * @param {string} schema: 表单纲要
   * @param {string} formData: 表单数据，Designer模式下该参数无效
   */
  load(schema, formData);

  /**
   * 提交，通过[colaForm.save]消息返回数据
   * 支持: [Designer, Form]
   */
  submit();

  /**
   * 重置清空(Form模式只会清空表单数据), 通过[colaForm.reset]消息返回清空前的数据
   * 支持: [Designer, Form]
   */
  reset();
}
```



# 事件

* colaForm.save

  用户使用提交按钮或外部调用colaForm.submit()触发，`Designer返回schema, Form返回formData`(下同)

* colaFrom.reset

  用户使用重置按钮或外部调用colaForm.reset()触发，返回清空前的数据

* colaFrom.exit

  用户点击页面中的退出按钮后触发，仅对Designer有效，返回当前schema