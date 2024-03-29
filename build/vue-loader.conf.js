'use strict'
const isProduction = process.env.NODE_ENV === 'production'

function cssLoaders (options) {
  options = options || {}
  
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    
    // Extract CSS when that option is specified
    // (which is the case during production build)
    // if (options.extract) {
    //   return ExtractTextPlugin.extract({
    //     use: loaders,
    //     fallback: 'vue-style-loader',
    //     publicPath: '../../'
    //   })
    // } else {
    //   return ['vue-style-loader'].concat(loaders)
    // }
  
    return ['vue-style-loader'].concat(loaders)
  }
  
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less')
  }
}

module.exports = {
  loaders: cssLoaders({
    sourceMap: false,
    usePostCSS: true,
    extract: true
  }),
  cssSourceMap: false,
  cacheBusting: true,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
