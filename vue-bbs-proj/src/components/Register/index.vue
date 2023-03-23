<template>
  <div class="register">
    <div class="box">
        <transition name="imager">
            <div v-show="ifShow" class="left">
            </div>
        </transition>
        <transition name="tabler">
            <div v-show="ifShow" class="right">
                <input type="text" v-model="arr[0]" placeholder="账号"><br>
                <input type="password" v-model="arr[1]" placeholder="密码"><br>
                <input type="email" v-model="arr[2]" placeholder="邮箱">
                <div class="otinfo">
                   <input type="text" class="yz" placeholder="邮箱验证码" v-model="flag"><div @click="getCode()" :class="clicked?'span clicked':'span'" title="点击获取验证码">{{ clicked? '等待'+seconds+'s':'获取验证码' }}</div><br> 
                </div><br>
                <button @click="register()">注册</button>
            </div>
        </transition>
    </div>
   </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'Register',
    mounted(){
        this.ifShow = true
    },
    data(){
        return{
            arr:['','',''],
            yanzheng:'',
            ifShow:false,
            flag:'',
            clicked:false,
            seconds:60
        }
    },
    beforeDestroy(){
        this.ifShow = false;
    },
    methods:{
        register(){
            if(this.arr[0]===''||this.arr[1]===''){
                alert('账号密码不能为空')
            }else if(this.arr[2]!=''){
                axios.get('/api/ddCode',{params:{
                    code:this.flag,
                    email:this.arr[2]
                }}).then(
                    res=>{
                        if(res.data){
                            axios.get('/api/createUser',{params:{
                                arr:this.arr
                            }}).then(
                            res=>{ 
                            if(res.data){
                                this.flag = ''
                                alert('注册成功');
                                this.arr = this.arr.map(item =>{
                                    item = ''
                                    return item
                                })
                            }else{
                                alert('账号已存在')
                                this.flag = ''
                            }       
                        },err=>{
                            alert('注册失败',err.message)
                        })
                        }else{
                            alert('验证码输入错误')
                        }
                    },err=>{
                        console.log(err.message)
                    }
                )
                
            }
        },
        getCode(){     //获取验证码
            if(this.clicked == false){
                if(this.arr[2]!=''&&this.arr[2]!=null){
                    setTimeout(()=>{
                        this.clicked = false
                        this.seconds = 60
                        clearTimeout(this.ti)
                    },60000)
                    this.ti = setInterval(()=>{
                        this.seconds = this.seconds-1
                    },1000)
                    this.clicked = true;
                    axios.get('/api/getCode',{params:{
                        email:this.arr[2]
                    }}).then(
                        ()=>{
                            
                        },err=>{
                            console.log(err.message)
                        }
                    )
                }else{
                    alert('邮箱不能为空')
                }
            }    
        }
    }
}
</script>

<style>
    .register{
        width: 100%;
        height: 400px;
        margin: 10px auto;
        box-sizing: border-box;
        min-height: 200px;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
    }
    .register .border::before{
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
    .register .border::after{
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
    .register .box{
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
    .register .right{
        width: 49%;
        padding-top: 50px;
        padding-left: 10%;
        transition: all 0.5s linear;
    }
    .register .left{
        background-position: center center;
        width: 49%;
        background-image: url('~@/assets/imgs/真理.png');
        background-size: contain;
        background-repeat: no-repeat;
        transition: 0.5s linear;
    }
    .register input{
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
    .register .yz{
        width:100px;
        height: 20px;
        display: block;
        float: left;
        margin: 0;
    }
    .register .otinfo{
        width: 200px;
        height: 25px;
        margin-top: 20px;
        
    }
    .register p{
        margin-top: 25px;
    }
    .register .span{
        display: block;
        float: left;
        width: 80px;
        box-sizing: border-box;
        margin-left: 20px;
        color: rgb(255, 255, 255);
        cursor: pointer;
        font-size: 14px;
        background: rgb(246, 52, 52);
        text-align: center;
        border-radius: 10px;
    }
    .register .clicked{
        background: rgb(255, 129, 129);
    }
    .register span:hover{
        cursor: pointer;
    }
    .register button{
        margin-top: 25px;
        width: 200px;
        height: 20px;
        text-align: center;
    }
    .tabler-enter{
        transform: translateY(-100%);
    }
    .tabler-enter-to{
        transform: translateY(0);
    }
    .imager-enter{
        transform: translateY(100%);
    }
    .imager-enter-to{
        transform: translateY(0);
    }
</style>