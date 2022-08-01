<template>
  <div class="Upload">
    <!-- 文件上传 -->
    <a-upload
      v-if="upload.type === 'file'"
      :name="upload.fileName"
      :show-upload-list="upload.showUploadList"
      :multiple="upload.multiple"
      :accept="upload.accept"
      :headers="uploadHeaders"
      :list-type="upload.listType ? upload.listType : 'text'"
      class="fileUpload"
      :before-upload="beforeUpload"
      :file-list="upload.fileList"
      :custom-request="customRequest"
      @change="handleChange"
    >
      <a-input ref="userNameInput" v-model="sourceFileName" :loading="true" :disabled="disabledType" placeholder="请选择">
        <a-icon slot="suffix" type="upload" />
      </a-input>
    </a-upload>
    <!-- 图片上传 -->
    <a-upload
      v-else-if="upload.type === 'image'"
      :name="upload.fileName"
      :list-type="upload.listType ? upload.listType : 'picture-card'"
      class="imageUpload"
      :show-upload-list="upload.showUploadList"
      :action="uploadAction"
      :accept="upload.accept"
      :before-upload="beforeUpload"
      :file-list="upload.fileList"
      @change="handleChange"
    >
      <img v-if="upload.imageUrl" :src="upload.imageUrl" alt="avatar" />
      <div v-else>
        <a-icon :type="upload.loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">{{ upload.antUploadText }}</div>
      </div>
    </a-upload>
  </div>
</template>

<script>
const defaultAddress = `${process.env.VUE_APP_UPLOAD_HOST}/sys/upload?group=lzdigit`;
import { mapMutations } from 'vuex';

export default {
  name: 'Upload',
  props: {
    /*
     *@description:上传组件upload是必传对象包含属性
     *@author: 杨世杰
     *@date: 2022-03-30 11:27:00
     *@variable: fileName 文件名称
     *@variable: multiple 是否支持多选文件
     *@variable: accept 上传的文件类型 -必传要做校验传''是所有
     *@variable: type 类型 file / image ~
     *@variable: showUploadList 是否需要显示文件上传列表
     *@variable: loading 上传图片loading状态 / image
     *@variable: antUploadText 上传图片icon下的文字 / image
     *@variable: listType 上传列表的内建样式，支持三种基本样式text,picture和picture-card默认text
     *@variable: fileList 已经上传的文件列表（受控）
     */
    upload: {
      type: Object,
      default: () => {},
    },
    // 上传地址
    uploadAction: {
      type: String,
      default: () => defaultAddress,
    },
    fileSize: {
      type: Number,
      default: () => 256,
    },
    //接口，请求的接口，必须要暴漏一个config的合并参数，否则没有loading的效果
    uploadApi: {
      type: Function,
      required: true,
      default: () => null,
    },
    sourceFileName: {
      type: String,
      default: () => '',
    },
    disabledType: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      uploadHeaders: {},
      status: '',
    };
  },
  methods: {
    ...mapMutations(['SET_LOADING']),
    async customRequest(file) {
      try {
        const body = new FormData();
        body.append('file', file.file);
        this.SET_LOADING(true);
        const { data } = await this.uploadApi(body);
        file.onSuccess(data, file);
        this.$emit('on-success', data, file);
      } catch (e) {
        console.log(e);
        this.SET_LOADING(false);
        this.$message.error(e.msg);
      }
    },
    //上传文件改变时的状态
    handleChange(info) {
      this.$emit('changeUpload', info);
    },
    //上传文件前
    beforeUpload(file) {
      const name = file.name.substr(file.name.lastIndexOf('.'));
      const files = this.upload.accept.split(',');
      const checkType = this.upload.accept !== '' ? files.includes(name) : true;
      //根据文件后缀判断是否符合规范
      if (!checkType) {
        this.$message.error(`仅支持${this.upload.accept}文件`);
      }
      const size = file.size / 1024 / 1024 < this.fileSize;
      if (!size) {
        this.$message.error(`文件最大为${this.fileSize}M`);
      }
      this.$emit('beforeUpload', file);
      return checkType && size;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.fileUpload {
  display: block;
  width: 100%;
  .ant-upload {
    width: 100% !important;
  }
}
</style>
