<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>
<script>
export default {
  data() {
    return {
      locale: require('ant-vue-nancal/es/locale-provider/zh_CN').default,
    };
  },
  computed: {
  },
};
</script>
