<!--
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-07-28 19:19:45
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-08-01 11:35:56
 * @FilePath: /Project-template/src/components/alert/index.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by liupeixin liupx@nancal.com, All Rights Reserved. 
-->
<template>
  <div class="my-tip" v-if="visible">
    <a-alert :type="type" banner show-icon>
      <p v-for="(item, index) in content" slot="description" :key="index">{{ item }}</p>
    </a-alert>
  </div>
</template>

<script>
export default {
  name: "MyMessage",
  data() {
    return {
      content: '',
      time: 3,
      visible: false,
      type: 'error',//'success','warning','error'
    }
  },
  mounted() {
    this.close()
  },
  methods: {
    close() {
      window.setTimeout(() => {
        this.visible = false
      }, this.time * 1000);
    }
  }
}
</script>
<style lang="less" scoped>
.my-tip {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 375px;
  z-index: 9999;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.ant-alert-banner {
  border-radius: 10px;
}
.ant-alert-error {
  background-color: #fff;
}
</style>