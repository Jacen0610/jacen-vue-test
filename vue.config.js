const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const {plugins} = require("eslint-plugin-vue/lib/configs/base");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
  devServer: {
    port: 6916
  }
})

