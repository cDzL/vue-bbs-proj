<template>
    <div class="Puserlist">
        <div class="h3">
            <span>所有用户信息</span><br>
            <input class="search" v-model="keywords" placeholder="输入:id,用户名,电话,签名" type="text"/><button @click="search()" class="keysearch">搜索</button>
        </div>
      <div class="ulistItem">
          <label>
              <span class="userid">ID</span>
              <span class="username">用户名</span>
              <span class="sex">性别</span>
              <span class="age">年龄</span>
              <span class="telphone">电话号码</span>
              <span class="fansnum">粉丝数</span>
              <span class="email">邮箱</span>
              <span class="sort">身份</span>
              <span class="state">状态</span>
              <span class="options">操作</span>
          </label>
          <p v-if="list.length<=0">空空如也,没有任何记录</p>
          <ul class="items" v-if="list.length>0">
              <li v-for="item of list" :key="item.userid">
                  <span class="userid">{{ item.userid }}</span>
                  <span class="username">{{ item.username }}</span>
                  <span class="sex">{{ item.sex>0? '男':'女' }}</span>
                  <span class="age">{{item.age}}</span>
                  <span class="telphone">{{ item.telphone }}</span>
                  <span class="fansnum">{{ item.fansnum }}</span>
                  <span class="email">{{ item.email }}</span>
                  <span class="sort">{{ item.sort>0? '版主':'普通会员' }}</span>
                  <span class="state">{{ item.state>0? '禁止发帖':'正常' }}</span>
                  <span  class="options">
                    <span @click="deletenotice(item.userid)">删除</span>
                    <span @click="showNotice(item)">预览</span>
                  </span>
              </li>
          </ul>
          <li class="bottombtns"><button @click="back()">上一页</button>{{ index+1 + '/' + total }}页<button @click="next()">下一页</button></li>
      </div>
      <adminUserInfo v-if="show" :user= "user" :close= "close"></adminUserInfo>
    </div>
</template>
  
  <script>
  import axios from 'axios'
  import adminUserInfo from './user.vue'
  export default {
      name:'PuserList',
      components:{adminUserInfo},
      mounted(){
          axios.get('/api/getalluser').then(
              res=>{
                  if(res){
                      const {data} = res
                      if(data.total%10>0){
                          this.total = parseInt(data.total/10)+1
                      }else{
                          this.total = data.total/10
                      }
                  }else{
                      console.log('失败')
                  }
              },err=>{
                  console.log(err.message)
              }
          )
          this.getUsers()
      },
      data(){
          return{
              list:[],
              userid:{},
              show:false,
              index:0,
              total:0,
              keywords:''
          }
      },
      methods:{
          showNotice(item){
              this.user = item
              this.show = true
          },
          close(){
              this.show = false
          },
          back(){
              if(this.index+1 >1){
                  this.index = this.index-1
                  this.getNotices()
              }
          },
          next(){
              if(this.index+1 <this.total){
                  this.index = this.index+1
                  this.getNotices()
              }
          },
          getUsers(){    //获取信息
              axios.get('/api/getusers',{params:{
                  index:this.index}
              }).then(
                  res=>{
                      if(res){
                          const {data} = res
                          this.list = data//this.list.concat(data)
                      }else{
                          console.log('失败')
                      }
                  },err=>{
                      console.log(err.message)
                  }
          )
          },
          deletenotice(userid){     //删除公告记录
              axios.get('/api/deleteuser',{params:{
                userid
              }}).then(
                  res=>{
                      if(res){
                          alert('删除成功')
                          this.list = this.list.filter(item=>{
                              if(item.userid!=userid){
                                  return item
                              } 
                          })
                          console.log(this.list)
                      }else{
                          alert('删除失败')
                      }
                  },err=>{
                      alert('网络故障',err.message)
                  }
              )
          },
          search(){       //搜索帖子
            if(this.keywords==''){
                this.list = []
                this.getUsers()
            }else{
                axios.get('/api/searchUser',{params:{keywords:this.keywords}}).then(
                    res=>{
                        if(res.data)
                        {
                            this.list = res.data
                        }else{
                            this.list = []
                        }
                            
                    },err=>{
                        console.log('网络错误',err)
                    }
                )
            }
            
          }
      }
  }
  </script>
  
  <style>
    .Puserlist{
        width: 100%;
        position: relative;
        min-height: 90vh;
        border-bottom-right-radius: 20px;
    }
    .Puserlist label{
        width: 100%;
    }
    .Puserlist p{
        padding: 20px;
        text-align: center;
        font-weight: 1000;
    }
    .Puserlist .items{
        max-height: 60vh;
        overflow: auto;
    }
    .Puserlist .items span{
        border: none;
        cursor: pointer;
    }
    .Puserlist .items li{
        border-bottom: 1px solid gray;
        height: 50px;
        line-height: 40px;
    }
    .ulistItem span{
        display: inline-block;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid rgb(0, 0, 0);
        border-left: 1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        overflow: hidden;
    }
    .Puserlist .h3{
        padding: 20px;
        background: rgb(14, 85, 72);
        color: white;
        height: 110px;
        box-sizing: border-box;
        border-top-right-radius: 20px;
    }
    .Puserlist .h3 .search{
        height: 30px;
        width: 160px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
    }
    .Puserlist .h3 .keysearch{
        border: 2px solid white;
        margin-left: 10px;
        background: none;
        border-radius: 10px;
        padding: 5px;
        height: 30px;
        box-sizing: border-box;
        color: white;
        opacity: 0.9;
    }
    .Puserlist .h3 .keysearch:hover{
        opacity: 1;
        scale: 1.1;
    }
    .Puserlist .h3 span{
        border: none;
        font-weight: 1000;
        font-size: 20px;
    }
    .Puserlist .userid{
        width: 8%;
    }
    .Puserlist .username{
        width: 12%;
    }
    .Puserlist .sex{
        width: 5%;
    }
    .Puserlist .telphone{
        width: 15%;
    }
    .Puserlist .email{
        width:20%
    }
    .Puserlist .fansnum{
        width: 8%;
    }
    .Puserlist .options{
        width: 13%;
    }
    .Puserlist .sort{
        width: 7%;
    }
    .Puserlist .age{
        width: 5%
    }
    .Puserlist .state{
        width: 7%;
    }
    .Puserlist .options span{
        padding: 5px;
    }
    .Puserlist .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    .Puserlist .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    }
    .Puserlist .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 50%;
    }
  </style>