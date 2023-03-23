//（更改配置之后记得重启一下脚手架）
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭语法检查
  lintOnSave: false,
  //开启代理服务器：需要与之通讯的服务器（方式一：缺点：不灵活，只能代理一个服务器，并且不能在ajax请求时控制是否使用代理服务器）
  //解决跨域问题
  /*devServer:{
    proxy:'http://localhost:5000'
  }*/
  //方式二
  devServer:{
    proxy:{
      '/api':{   //请求前缀：如果请求前缀相同则访问下面的服务器8080 -> 8081
        //需要与之通讯的服务器
        target: 'http://localhost:8888',
        //重写路径：将前缀删除
        pathRewrite:{'^/api':''},
        //用于支持webscoket(默认为true)
        ws: true,
        //是否对请求服务器显示真实的服务器地址(默认为true)
        changeOrigin: true
      },
      '/ace':{
        target: 'http://localhost:8888',
        pathRewrite:{'/ace':''},
        ws:true,
        changeOrigin: true
      }
      // /!*'/aca':{
      //   target: 'http://localhost:5001'
      //   pathRewrite:{'^/aca':''},
      // }*!/
    }
  }
})
