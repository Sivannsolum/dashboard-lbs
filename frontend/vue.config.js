module.exports = {
  publicPath: process.env.VUE_PUBLIC_PATH,
  transpileDependencies: ['vuetify'],
  configureWebpack: { devtool: 'source-map' },
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
    config.plugin('html').tap(args => {
      args[0].title = 'Dashboard'
      return args
    })
  },
  pluginOptions: {
    i18n: {
      locale: process.env.VUE_APP_I18N_LOCALE,
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}

// setDevServer()