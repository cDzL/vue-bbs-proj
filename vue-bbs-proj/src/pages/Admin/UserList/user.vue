<template>
  <div class="adminuserWall">
    <div class="adminuserinfo">
        <span>用户名称：{{ user.username }}</span><br>
        <span>密码：{{ user.upassword }}</span><br>
        <span>性别：{{ user.sex>0? '男':'女' }}</span><br>
        <span>年龄：{{ user.age }}</span><br>
        <span>签名：<input v-model="updateduser.signalname"/></span><br>
        <span>电话: <input v-model="updateduser.telphone"/></span><br>
        <span>地址：<input v-model="updateduser.address"/></span><br>
        <span>粉丝数：{{ user.fansnum }}</span><br>
        <span>订阅数：{{ user.subsnum }}</span><br>
        <span>身份：{{ updateduser.sort>0? '版主':'普通会员'}}<button :class="updateduser.sort ? 'red':'green'" @click="changeSort()">{{ updateduser.sort?'撤销版主':"赋予版主" }}</button></span><br>
        <span>邮箱：<input v-model="updateduser.email"/></span><br>
        <span>状态：{{ updateduser.state>0? '禁止发帖':'正常'}}</span><button :class="updateduser.state ? 'green':'red'" @click="changeState()">{{ updateduser.state?'解除':"禁贴" }}</button><br>
        <span>注册日期：{{ user.regdate? user.regdate:'暂无' }}</span><br>
        <div class="userbottombtns">
            <span @click="close()">取消</span><span @click="save()">确定修改</span>
        </div>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'adminUserInfo',
    props:['close','user'],
    mounted(){
        this.updateduser = this.user
    },
    data(){
        return{
            updateduser:{}
        }
    },
    methods:{
        save(){   //保存信息
            axios.get('/api/changeInfo',{params:{
                user:this.updateduser
            }}).then(
                res=>{
                    if(res.data){
                        alert('修改成功')
                        this.close()
                    }else{
                        alert('修改失败')
                    }
                },err=>{
                    alert('网络故障',err)
                }
            )
        },
        changeSort(){
            if(this.updateduser.sort) this.updateduser.sort = 0
            else this.updateduser.sort = 1
        },
        changeState(){
            if(this.updateduser.state) this.updateduser.state = 0
            else this.updateduser.state = 1
        }
    }
}
</script>

<style>
    .adminuserWall{
        position: fixed;
        width: 100%;
        background: rgba(50, 50, 50, 0.436);
        height: 100vh;
        top: 0;
        left: 0;
    }
    .adminuserWall .adminuserinfo{
        margin: 50px auto;
        background: white;
        width: 400px;
        height: 600px;
        border-radius: 20px;
        padding-left: 20px;
        padding-top: 10px;
        box-sizing: border-box;
    }
    .adminuserWall .adminuserinfo .red{
        background: rgb(197, 6, 6);
        outline: none;
        border: none;
        border-radius: 5px;
        padding: 5px;
        margin-left: 20px;
        color: #fff;
    }
    .adminuserWall .adminuserinfo .green{
        background: rgb(9, 146, 4);
        outline: none;
        border: none;
        border-radius: 5px;
        padding: 5px;
        margin-left: 20px;
    }
    .adminuserWall span{
        height: 30px;
        line-height: 40px;
        cursor: pointer;
    }
    .adminuserWall input{
        height: 20px;
    }
    .adminuserWall .userbottombtns{
        height: 60px;
        width: 100%;
        display: block;
    }
    .adminuserWall .userbottombtns span:nth-child(1){
        float: left;
    }
    .adminuserWall .userbottombtns span:nth-child(2){
        float: right;
        margin-right: 20px;
    }
    .adminuserWall .userbottombtns span:hover{
        color: rgb(25, 221, 255);
    }
</style>