const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css'];
const isProd = process.env.NODE_ENV === 'production';

const getNginxPath = function () {
  let name = process.env.VUE_APP_NGINX_VPATH_NAME || '';
  if (!name.startsWith('/')) {
    name = `/${name}`;
  }
  if (!name.endsWith('/')) {
    name += '/';
  }
  return name;
};

const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
  },

  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
  ],
};

let pluginsOptions = [
  new MonacoWebpackPlugin({
    features: ['!gotoSymbol'],
    languages: ['javascript', 'css', 'html', 'typescript', 'json'],
  }),
  new AntdDayjsWebpackPlugin({
    preset: 'antdv3',
  }),
];

if (isProd) {
  pluginsOptions.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8,
    })
  );
}
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
  },
  runtimeCompiler: true,
  transpileDependencies: [],
  publicPath: getNginxPath(),
  lintOnSave: false,
  outputDir: 'dist',
  devServer: {
    port: 80,
  },
  assetsDir: 'public',
  configureWebpack: {
    devtool: process.env.NODE_ENV == 'production' ? false : 'source-map',
    plugins: pluginsOptions,
    // devtool: "cheap-module-source-map",
    // externals: isProd ? assetsCDN.externals : {},
    resolve: {
      alias: {
        '@': path.resolve('src'),
        '~': path.resolve('public'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vuetxt$/i,
          loader: 'raw-loader',
        },
      ],
    },
    performance: {
      hints: 'warning',
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter(assetFilename) {
        return assetFilename.endsWith('.js');
      },
    },
    optimization: {
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        // `...`,
        //  new CssMinimizerPlugin(),
      ],
    },
  },
  chainWebpack: config => {
    if (isProd) {
      config.plugin('optimize-css').tap(args => {
        args[0].cssnanoOptions.preset[1].colormin = false;
        return args;
      });
    }

    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN;
        return args;
      });
    }

    //全局引入less变量 不要删除
    const oneOfsMap = config.module.rule('less').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('style-resources-loader')
        .loader('style-resources-loader')
        .options({
          patterns: './src/assets/styles/common.less',
        })
        .end();
    });
  },
};
