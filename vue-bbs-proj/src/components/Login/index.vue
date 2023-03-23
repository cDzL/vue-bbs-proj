<template>
    <div class="login">
        <div class="border"></div>
        <div class="box">
            <transition name="table">
            <div v-show="ifShow" class="left">
                <input type="text" placeholder="账号" v-model="arr[0]"><br>
                <input type="password" placeholder="密码" v-model="arr[1]"><br>
                <div class="otinfo">
                    <input type="text" class="yz" placeholder="验证码" v-model="flag"><div @click="changeYz()" class="span">{{yanzheng}}</div>
                </div><br>
                <button @click="setUserInfo()">登录</button>
                <button @click="tosetPass()">忘记密码</button>
            </div>
            </transition>
            <transition name="image">
                <div v-show="ifShow" class="right">
                    <img src="" alt="">
                </div>
            </transition>
        </div>
   </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'Login',
    mounted(){
        this.ifShow = true
        this.changeYz()
    },
    data(){
        return{
            yanzheng:'',
            ifShow:false,
            arr:['',''],
            flag:''
        }
    },
    methods:{
        setUserInfo(){  
            if(this.arr[0]===''||this.arr[1]==='')
                alert('输入不能为空')
            else if(this.flag!= this.yanzheng){
                alert('验证码输入错误')
                this.changeYz()
            }else{
                axios.get('/api/login',{params:{
                    arr:this.arr
                }}).then(res=>{
                    if(res.data){
                        const {userid} = res.data
                        this.$store.dispatch('changeUserInfo',{userid:userid,username:this.arr[0],upassword:this.arr[1]})
                        this.$router.replace({name:'userMain',params:{userid}})
                    }else{
                        alert('账号或者密码错误')
                        this.changeYz()
                    }
                })
            }
        },
        changeYz(){
            this.yanzheng = parseInt(Math.random()*100000).toString()
        },
        tosetPass(){
            this.$router.push({
                path:"/setPass"
            })
        }
    },
    beforeDestroy(){
        this.ifShow = false
    }
}
</script>

<style>
    .login{
        width: 100%;
        height: 400px;
        margin: 10px auto;
        box-sizing: border-box;
        min-height: 200px;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
    }
    .login .border::before{
        content: '';
        width: 100%;
        height: 400px;
        background: linear-gradient(0deg,transparent,rgb(255, 2, 2),rgb(0, 51, 255),rgb(255, 2, 2));
        position: absolute;
        top: -50%;
        left:-50%;
        transform-origin: bottom right;
        animation: circle 6s linear infinite;
    }
    .login .border::after{
        content: '';
        width: 99%;
        height: 400px;
        background: linear-gradient(0deg,transparent,rgb(255, 2, 2),rgb(0, 34, 255),rgb(255, 2, 2));
        position: absolute;
        top: -50%;
        left:-50%;
        transform-origin: bottom right;
        animation: circle 6s linear infinite;
        animation-delay: -3s;
    }
    .login .box{
        width: 99%;
        height: 394px;
        position: absolute;
        bottom: 3px;
        left: 3px;
        background: rgb(255, 255, 255);
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
        border-radius: 20px;
        z-index: 1;
    }
    .login .box .left{
        width: 49%;
        padding-top: 60px;
        box-sizing: border-box;
        transition: all 0.5s linear;
        padding-left: 10%;
    }
    .login .box .left .otinfo{
        width: 200px;
        height: 25px;
        margin-top: 20px;
    }
    .login .box .right{
        background-position: center center;
        width: 49%;
        background-image: url('~@/assets/imgs/黎明.png');
        background-size: contain;
        background-repeat: no-repeat;
        transition: 0.5s linear;
    }
    .login input{
        border-radius: 5px;
        border:none;
        padding: 5px;
        width: 200px;
        height: 25px;
        box-sizing: border-box;
        margin-top: 20px;
        color: rgb(8, 8, 8);
        border: 1px solid pink;
    }
    .login .yz{
        width:120px;
        height: 20px;
        display: block;
        float: left;
        margin: 0;
    }
    .login .box .left li{
        margin-top: 10px;
    }
    .login .left .span{
        display: block;
        float: left;
        width: 60px;
        box-sizing: border-box;
        margin-left: 20px;
        color: rgb(129, 130, 132);
        cursor: pointer;
    }
    .login span:hover{
        cursor: pointer;
    }
    .login button{
        margin-top: 25px;
        width: 200px;
        height: 20px;
        text-align: center;
        float: left;
    }
    .table-enter{
        transform: translateY(-100%);
    }
    .table-enter-to{
        transform: translateY(0);
    }
    .image-enter{
        transform: translateY(100%);
    }
    .image-enter-to{
        transform: translateY(0);
    }

    @keyframes circle {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
</style>


