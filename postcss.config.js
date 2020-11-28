module.exports = {
  plugins: {
    autoprefixer:{},
    "postcss-px-to-viewport":{
      //这里以iphone6的设计稿给viewportWidth,viewportHeight赋的值
      viewportWidth: 375,//视图的宽度，对应的是我们设计稿的宽度
      viewportHeight: 667,//视图的高度，对应的是我们设计稿的高度.(也可以不配置)

      unitPrecision: 5,//指定'px'转换成视窗单位值的小数位（很多时候无法整除，这里指定px转成vw时保留5位小数）
      viewportUnit: 'vw',//指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['ignore','tab-bar','tab-bar-item'],//指定不需要转换的类（即class为 ignore, tab-bar, tab-bar-item的那些），后面再讲
      minPixelValue: 1,//小于或等于'1px'不转换为视窗单位,
      mediaQuery:false //允许在媒体查询中转换'px'
    },
  }
}
