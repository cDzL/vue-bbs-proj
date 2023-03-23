<template>
  <div class="forgetPass">
    <div class="formwall">
        <input type="text" v-model="username" placeholder="用户名称"><br>
        <input type="password" v-model="password" placeholder="修改后的密码"><br>
        <input type="email" v-model="email" placeholder="绑定的邮箱"><br>
        <input type="text" class="yz" placeholder="邮箱验证码" v-model="flag"><div @click="getCode()" :class="clicked?'span clicked':'span'" title="点击获取验证码">{{ clicked? '等待'+seconds+'s':'获取验证码' }}</div><br> 
        <button @click="back()" class="forPass_submit">返回</button> <button @click="resetPass()" class="forPass_submit">确定</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:"ForgetPass",
    data(){
        return{
            username:'',
            password:'',
            email:'',
            clicked:false,
            seconds:60,
            flag:'',
        }
    },
    methods:{
        getCode(){     //获取验证码
            if(this.clicked == false){
                if(this.email!=''&&this.email!=null&&this.username!=''&&this.password!=''){
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
                        email:this.email
                    }}).then(
                        ()=>{
                            
                        },err=>{
                            console.log(err.message)
                        }
                    )
                }else{
                    alert('输入不能为空')
                }
            }    
        },
        resetPass(){    //重新设置密码
            if(this.password===''||this.email===''){
                alert('密码邮箱不能为空')
            }else if(this.flag!=''){
                axios.get('/api/setpassword',{params:{
                    username:this.username,
                    password:this.password,
                    email:this.email,
                    code:this.flag
                }}).then(
                res=>{ 
                    if(res.data){
                        alert('修改成功');
                        this.$router.replace({
                            path:'/lore/login'
                        })
                    }else{
                        alert('账号异常，该账号不存在或者验证马输入错误')
                    }       
                },err=>{
                    alert('网络异常',err.message)
                }) 
            }else{
                alert('请输入验证码')
            }
        },
        back(){
            this.$router.back(1)
        }
    }
}
</script>

<style>
.forgetPass{
    width: 50%;
    margin: 10% auto;
    box-sizing: border-box;
}
.forgetPass .formwall{
    background: #fff;
    text-align: center;
    width: 300px;
    height: 240px;
    border-radius: 20px;
}
.forgetPass input{
    width: 180px;
    height: 30px;
    margin-top: 20px;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid black;
}
.forgetPass input:focus{
    border: 1px solid rgba(8, 8, 8, 0.555);
    outline: 2px solid rgba(247, 2, 92, 0.612);
}
.forgetPass .yz{
    width: 90px;
}
.forgetPass .forPass_submit{
    margin-top: 10px;
    width: 90px;
}
.forgetPass .span{
    display: inline-block;
    width: 80px;
    box-sizing: border-box;
    margin-left: 10px;
    color: rgb(255, 255, 255);
    cursor: pointer;
    font-size: 14px;
    background: rgb(246, 52, 52);
    text-align: center;
    border-radius: 10px;
    }
.forgetPass .clicked{
    background: rgb(255, 129, 129);
}
</style>