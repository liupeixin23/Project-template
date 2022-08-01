import Vue from 'vue'
import Message from './index.vue'

const messageBox = Vue.extend(Message)

Message.install = function (content, type, time) {
  let options = {
    content,
    type,
    time
  }
  let instance = new messageBox({
    data: options
  }).$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.visible = true
  })
}

export default Message