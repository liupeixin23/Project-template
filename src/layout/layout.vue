<!--
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-06-01 17:11:29
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-06-03 23:14:06
 * @FilePath: /digital-process-ui/personal-work/src/layout/layout.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="overflow-hidden flex h-full">
    <a-layout class="p-20 flex flex-col flex-1 overflow-hidden">
      <div class="flex contentBox">
        <a-layout-content class="flex-1 flex flex-col bg-white relative rounded-11 overflow-auto">
          <headerFunctionalAreas id="header"></headerFunctionalAreas>
          <router-view v-if="isCheck" id="main" class="flex-1 flex flex-col overflow-auto" />
          <template>
            <a-empty v-if="!isCheck" class="flex-1 flex flex-col justify-content-center rounded-11" />
          </template>
        </a-layout-content>
      </div>
    </a-layout>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import headerFunctionalAreas from './components/headerFunctionalAreas';
export default {
  name: 'Layout',
  components: {
    headerFunctionalAreas,
  },
  data() {
    return {
      isCheck: false,
    };
  },
  computed: {
  },
  created() {
    this.setToken();
    this.xGteAllDictionData();
  },
  mounted() {
  },
  methods: {
    ...mapActions('dataDictionary', ['xGteAllDictionData']),
    ...mapMutations(['SET_TOKEN']),
    setToken() {
      let json = this.$route.query;
      if (json.tk) {
        this.SET_TOKEN(json.tk);
      } else {
        localStorage.clear();
        window.parent.postMessage(
          {
            type: 'childFrame',
            url: window.location.href,
          },
          '*'
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
#main {
  width: 100vw;
  overflow: auto;
}
.contentBox {
  height: calc(100vh - 71px);
}
#header {
  overflow: hidden;
}
</style>
