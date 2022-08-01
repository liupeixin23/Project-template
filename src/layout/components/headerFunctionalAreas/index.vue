<template>
  <div class="functionalAreas h-48 bg-headerFunction flex rounded-t-11 justify-between">
    <div class="flex">
      <div v-for="(item, index) in btnNameArr" :key="index" class="flex mb-8 mt-8 align-items-center cursor-pointer plr-12" @click="item.disable ? '' : handleBtn(item)">
        <i :class="['iconfont ', item.icon, item.disable ? 'disable' : 'color']"></i
        ><span :class="['text-14', 'font-semibold', item.disable ? 'disable' : 'color', 'mlr-4']"> {{ item.name }}</span>
        <i v-if="item.special" :class="['iconfont ', 'icon-down-arrow', item.disable ? 'disable' : 'color']"></i>
      </div>
    </div>
    <div class="flex">
      <div
        v-for="(item, index) in leftBtnArr"
        :key="index"
        v-throttle="1000"
        class="flex mb-8 mt-8 align-items-center cursor-pointer plr-12"
        @click="item.disable ? '' : handleRightBtn(item)"
      >
        <i :class="['iconfont ', item.icon, 'color']"></i><span :class="['text-14', 'font-semibold	', item.disable ? 'disable' : 'color', 'mlr-4']"> {{ item.name }}</span>
        <i v-if="item.special" :class="['iconfont ', 'icon-down-arrow', item.disable ? 'disable' : 'color']"></i>
      </div>
    </div>
    <!-- 弹窗组件写这下面 -->
  </div>
</template>

<script>
import bus from '@/utils/bus';
import { isFullScreen, exitFullscreen, full } from '@/utils/fullScreen';
import { mapState, mapActions, mapMutations } from 'vuex';
import { utilSelf } from '@/utils/util';
export default {
  name: 'Index',
  components: {
  },

  data() {
    return {
      btnNameArr: [
        {
          type: 'create',
          name: '新建',
          icon: 'icon-othernew',
          code: 'lz624-library:LibraryResouce:create',
          disable: false,
        },
        {
          type: 'edit',
          name: '编辑',
          icon: 'icon-edit',
          code: 'lz624-library:LibraryResouceRevision:update',
          disable: false,
        },
        {
          type: 'version',
          name: '升版',
          icon: 'icon-icon15',
          code: 'lz624-library:LibraryResouceRevision:upgrade',
          disable: false,
        },
        {
          type: 'release',
          name: '发布',
          icon: 'icon-icon66',
          code: 'lz624-library:LibraryResouceRevision:release',
          disable: false,
          childList: [
            {
              name: '零件送审',
              type: 'partSend',
              behavior: 'audit',
            },
            {
              name: '组件送审',
              type: 'moduleSend',
              behavior: 'audit',
            },
            {
              name: '零件快速发布',
              type: 'partSendFast',
              behavior: 'audit',
            },
            {
              name: '组件快速发布',
              type: 'moduleSendFast',
              behavior: 'audit',
            },
          ],
        },
        {
          type: 'import',
          name: '导入',
          icon: 'icon-icon134',
          code: 'lz624-library:LibraryResouceRevision:import',
          disable: false,
        },
        {
          type: 'export',
          name: '导出',
          icon: 'icon-icon114',
          code: 'lz624-library:LibraryResouceRevision:export',
          disable: false,
        },
        {
          type: 'delete',
          name: '删除',
          icon: 'icon-delete',
          code: 'lz624-library:LibraryResouce:delete',
          disable: false,
        },
      ],
      leftBtnArr: [
        {
          type: 'find',
          name: '查找',
          icon: 'icon-find',
          disable: false,
        },
        {
          type: 'refresh',
          name: '刷新',
          icon: 'icon-shuaxin',
          disable: false,
        },
        {
          type: 'magnify',
          name: '放大',
          icon: 'icon-icon127',
          disable: false,
        },
        {
          type: 'magnify',
          name: '列设置',
          icon: 'icon-liebiao',
          disable: false,
        },
        {
          type: 'more',
          name: '',
          icon: 'icon-more',
          disable: false,
        },
      ],
    };
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    // 初始化
    this.init();
  },
  methods: {
    init() {
    },
    // 左侧按钮点击
    handleBtn(item) {
      console.log(item.name)
    },
    // 右侧按钮点击
    handleRightBtn(item) {
      console.log(item.name)
      if (item.name === '放大' || item.name === '缩小') {
        this.handleFullScreen(item)
      }
    },
    /** 全屏 */
    handleFullScreen(item) {
      const fullScreen = window.addEventListener('resize', () => {
        if (!isFullScreen()) {
          item.name = '放大';
          item.icon = 'icon-icon127';
          window.removeEventListener('resize', fullScreen);
        }
      });
      if (isFullScreen()) {
        item.name = '放大';
        item.icon = 'icon-icon127';
        exitFullscreen();
      } else {
        item.name = '缩小';
        item.icon = 'icon-icon126';
        full(document.documentElement); //要设置全屏的元素
      }
      item.isMagnify = !item.isMagnify;
    },
  },
};
</script>

<style lang="less" scoped>
.color {
  color: #ffffff;
}
.disable {
  color: #94b8ea;
}
// .cursor-pointer:hover,
.active {
  border-radius: 8px;
  background-color: #18a0fb;
}
</style>
