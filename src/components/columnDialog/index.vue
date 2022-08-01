<template>
  <div class="columnBox absolute top-60 right-20 bg-fff w-300 h-330">
    <div class="header flex justify-content-between h-37">
      <div class="ml-6">
        <a-checkbox v-model="allCheck" @change="onChange">全部</a-checkbox>
      </div>
      <div>
        <a-button class="text-12 w-44 h-26 text-center padding-2 mr-5" type="primary" @click="handleSave"> 保存 </a-button>
        <a-button class="text-12 w-44 h-26 text-center padding-2 mr-8" @click="handleCancel">取消</a-button>
      </div>
    </div>
    <div class="h-290 overflow-scroll">
      <a-tree v-model="checkedKeys" checkable :tree-data="treeData" @check="onCheck" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { gvUtil } from '@/utils/gvUtil';
import bus from '@/utils/bus';
export default {
  data() {
    return {
      columns: [],
      checkedKeys: [],
      treeData: [],
      allCheck: false, // 是否全部选中状态
      allSelectData: [],
      uid: '',
      row: {},
    };
  },
  computed: {
    ...mapState('basicLibrary', ['config']),
  },
  watch: {
    checkedKeys() {
      if (this.checkedKeys.length === this.columns?.length) {
        this.allCheck = true;
      } else {
        this.allCheck = false;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations('basicLibrary', ['setNewColumns', 'setCheckedKeys']),
    ...mapActions('leftTree', ['xUpdateTree', 'xGetTreeData']),
    init() {
      // 选中回显
      this.columns = this.config?.columns;
      if (this.columns?.length) {
        this.treeData = this.columns.map(item => ({
          title: item.title,
          key: item.key,
        }));
        this.columns.forEach(item => {
          if (item.check) {
            this.checkedKeys.push(item.key)
          }
          this.allSelectData.push(item.key)
        });
        console.log(this.treeData, this.checkedKeys, 'treeData')
      }
    },

    //点击全选触发
    onChange(e) {
      this.checkedKeys = e.target.checked ? this.allSelectData : [];
    },

    //点击复选框触发
    onCheck(checkedKeys, e) { },

    // 保存
    handleSave() {
      if (this.checkedKeys.length) {
        // 表格用
        let newColumn = this.columns.map(item => {
          if (this.checkedKeys.includes(item.key)) {
            return {
              ...item,
              check: true
            }
          } else {
            return {
              ...item,
              check: false
            }
          }
        })
        this.setNewColumns(newColumn);
        // 提交到接口
        let newColData = this.columns.map(item => {
          if (this.checkedKeys.includes(item.key)) {
            return {
              code: item.key,
              value: item.title,
              check: true
            }
          } else {
            return {
              code: item.key,
              value: item.title,
              check: false
            }
          }
        })
        bus.$emit('updateColumn');
        gvUtil.success('保存成功');
        this.$emit('closeColumn', false);
      } else gvUtil.warning('列设置不可为空，最少选择一条');
    },
    // 取消
    handleCancel() {
      this.$emit('closeColumn', false);
    },
  },
};
</script>

<style lang="less" scoped>
.columnBox {
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0px 0px 12px 0px @b3;
  .header {
    line-height: 37px;
    border-bottom: 1px solid @e5;
  }
}
</style>
