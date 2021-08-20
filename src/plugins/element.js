import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  // 导入弹框提示组件
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将弹框提示组件挂载到Vue原型对象中
Vue.prototype.$message = Message
