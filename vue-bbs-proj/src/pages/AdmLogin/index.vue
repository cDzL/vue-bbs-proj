<template>
    <div class="admLogin">
        <div class="loginWall">
            <div class="left_img">
                <p v-if="show">欢迎管理员,请稍后</p>
                <img src="~@/assets/imgs/蕾贝.png" alt="蕾贝图片" title="蕾贝图片"/>
            </div>
            <div class="right_form">
                <div class="tab_form">
                    <div class="form_item">
                        <div class="form_info">账户</div>
                        <input type="text" v-model="admin.adminname" placeholder="请输入管理员账号">
                    </div>
                    <div class="re_line"></div>
                    <div class="form_item">
                        <div class="form_info">密码</div>
                        <input type="password" v-model="admin.adminpassword" placeholder="请输入密码">
                    </div>
                </div>
                <div class="loginbtn">
                    <button @click="admLoginReq()" class="submit_login">登录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'AdmLogin',
    data(){
        return{
            admin:{
                adminname:'',
                adminpassword:''
            },
            show:false
        }
    },
    methods:{
        admLoginReq(){
            axios.get('/api/adminlogin',{params:{
                admin:this.admin
            }}).then(
                res =>{
                    if(res.data){
                        this.$store.dispatch('changeAdmin',this.admin)
                        this.show = true
                        setTimeout(()=>{
                            this.show = false
                            this.$router.replace({
                                path:'/admin'
                            });
                        },1500)
                    }else{
                        alert('账号或密码错误');
                    }
                },err =>{
                    console.log('网路错误',err.message);
                }
            )
        }
    }
}
</script>

<style>
.admLogin{
	width: 100%;
	height: 100vh;
	position: fixed;
}
.admLogin .loginWall{
	width: 650px;
	height: 320px;
	background: white;
	margin: 10% auto;
	border-radius: 5px;
}
.admLogin .loginWall .left_img{
	width: 50%;
	height: 100%;
	padding: 20px;
	position: relative;
	display: block;
	float: left;
    box-sizing: border-box;
}
.admLogin .loginWall .left_img p{
	position: absolute;
	right: -50%;
	text-align: center;
	width: 90%;
    color: rgb(13, 140, 13);
}
.admLogin .loginWall .left_img img{
	width: 100%;
	height: 100%;
}
.admLogin .loginWall .right_form{
	width: 50%;
	height: 100%;
	display: block;
	float: right;
}
.admLogin .loginWall .tab_form{
	margin: 80px auto;
	border-radius: 20px;
	border: 1px solid gray;
	width: 80%;
	height: 100px;
    box-sizing: border-box;
}
.admLogin .loginWall .tab_form input{
	margin-left: 20px;
	outline: none;
	border: none;
	line-height: 20px;
	width: 60%;
}
.admLogin .loginWall .tab_form .form_item{
	width: 100%;
	height: 50%;
	padding: 12px 20px;
    box-sizing: border-box;
}
.admLogin .loginWall .tab_form .form_info{
	display: block;
	float: left;
}
.admLogin .loginWall .tab_form .re_line{
	display: block;
	width: 100%;
	border-bottom: 1px solid gray;
}
.admLogin .loginWall .right_form .loginbtn{
	width: 100%;
	height: 40px;
	margin-top: -40px;
	text-align: center;
}
.admLogin .loginWall .submit_login{
	outline: none;
	border: none;
	width: 60%;
	padding: 5px;
	color: white;
	background: rgb(41, 191, 250);
    box-sizing: border-box;
}
</style>