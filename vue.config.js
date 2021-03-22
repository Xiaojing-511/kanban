const path = require('path')
const webpack = require('webpack')

let webUrl
if (process.env.NODE_ENV === 'test') {
  webUrl = '/'
} else if (process.env.NODE_ENV === 'prod') {
  webUrl = '/'
} else {
  webUrl = '/'
}

module.exports = {
  // 选项...
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
  publicPath: webUrl,
  // '//test.speiyou.com'
  // : process.env.NODE_ENV === 'prod'
  // ? '//prod.speiyou.com'
  // : '/',
  // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: './static',
  // 指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
  indexPath: 'index.html',
  // 是否在保存的时候检查
  lintOnSave: false,
  pages: {
    index: {
      entry: './src/main.ts',
      template: './public/index.html'
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        API_ENV: JSON.stringify(process.env.API_ENV)
      })
    ]
  },
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true)
    // 别名配置
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
      .set('@a', path.resolve(__dirname, './src/assets'))
      .set('@c', path.resolve(__dirname, './src/components'))
      .set('@common', path.resolve(__dirname, './src/common'))
  },
  // 环境配置
  devServer: {
    // 自动打开浏览器
    open: true,
    // 浏览器校验
    overlay: {
      warnings: false,
      errors: true
    },
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: 'test.speiyou.com',
    port: '1024',
    https: false, // 使用https提供服务
    disableHostCheck: true,
    hot: true,
    proxy: {
      "/api": {
        target: "http://10.200.4.122:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        }
      }
    }
  }
}