//对axios二次封装
import axios from "axios";

//利用axios对象的create方法，创建一个axios实例
const requests = axios.create({
    //基础路径，发请求的时候，路径中会出现api
    baseURL:'/api',
    //代表请求超时时间5s
    timeout:5000,

})
//请求拦截器：在发请求之前，请求拦截器可以检测到，能在请求之前执行一些事务
requests.interceptors.request.use((config)=>{
    //config:配置对象，对象里里面有一个属性很重要，header请求头
    return config
})
//响应拦截器
requests.interceptors.response.use((res)=>{
    //成功响应的回调函数
    return res.data;
},(err)=>{
    return Promise.reject(new Error('failed'))
})


export default axios;