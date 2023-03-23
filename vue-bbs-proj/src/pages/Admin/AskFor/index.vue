<template>
    <div class="requestList">
      <div class="h3">
          <span>所有申请版主信息</span><br>
      </div>
      <div class="aplistItem">
          <label>
              <span class="askforid">ID</span>
              <span class="userid">用户ID</span>
              <span class="username">用户名称</span>
              <span class="options">操作</span>
          </label>
          <p v-if="list.length<=0">空空如也,没有任何记录</p>
          <ul class="items" v-if="list.length>0">
              <li v-for="item of list" :key="item.askforid">
                  <span class="askforid">{{item.askforid}}</span>
                  <span class="userid">{{item.userid}}</span>
                  <span class="username">{{item.username}}</span>
                  <span  class="options">
                      <span @click="deleteask(item.askforid)">删除</span>
                      <span @click="agreeReq(item.userid,item.askforid)">同意</span>
                  </span>
              </li>
          </ul>
          <li class="bottombtns"><button @click="back()">上一页</button>{{ index+1 + '/' + total }}页<button @click="next()">下一页</button></li>
      </div>
      <adminArticle v-if="show" :article= "article" :close= "close"></adminArticle>
    </div>
</template>
<script>
import adminArticle from '../ArticleList/article.vue'
import axios from 'axios'
export default {
    name:'requestList',
    components:{adminArticle},
    mounted(){
        axios.get('/api/getallaskfor').then(
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
        this.getAskfors()
    },
    data(){
        return{
            list:[],
            article:{},
            show:false,
            index:0,
            total:0,
            keywords:''
        }
    },
    methods:{
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
        getAskfors(){    //获取信息
            axios.get('/api/getaskfors',{params:{
                index:this.index}
            }).then(
                res=>{
                    if(res){
                        const {data} = res
                        this.list = data
                    }else{
                        console.log('失败')
                    }
                },err=>{
                    console.log(err.message)
                }
        )
        },
        deleteask(askforid){     //删除信息
            axios.get('/api/deleteaskfor',{params:{
                askforid
            }}).then(
                res=>{
                    if(res){
                        this.list = this.list.filter(item=>{
                            if(item.askforid!=askforid){
                                return item
                            } 
                        })
                    }else{
                        alert('删除失败')
                    }
                },err=>{
                    alert('网络故障',err.message)
                }
            )
        },
        agreeReq(userid,askforid){   //同意申请请求
            axios.get('/api/agreeReq',{params:{
                userid
            }}).then(
                res=>{
                    if(!res.data){
                        alert('失败')
                    }else{
                        this.deleteask(askforid)
                    }
                },err=>{
                    console.log(err.message)
                }
            )
        }
    }
}
</script>

<style>
    .requestList{
        width: 100%;
        position: relative;
        min-height: 90vh;
        border-bottom-right-radius: 20px;
    }
    .requestList label{
        width: 100%;
    }
    .requestList p{
        padding: 20px;
        text-align: center;
        font-weight: 1000;
    }
    .requestList .items{
        max-height: 60vh;
        overflow: auto;
    }
    .requestList .items span{
        border: none;
        cursor: pointer;
    }
    .requestList .items li{
        border-bottom: 1px solid gray;
        height: 50px;
        line-height: 40px;
    }
    .aplistItem span{
        display: inline-block;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid rgb(0, 0, 0);
        border-left: 1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        overflow: hidden;
    }
    .requestList .h3{
        padding: 20px;
        background: rgb(14, 85, 72);
        color: white;
        height: 110px;
        box-sizing: border-box;
        border-top-right-radius: 20px;
    }
    .requestList .h3 .search{
        height: 30px;
        width: 160px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
    }
    .requestList .h3 .platebtn{
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
    .requestList .h3 .platebtn:hover{
        opacity: 1;
        scale: 1.1;
    }
    .requestList .h3 span{
        border: none;
        font-weight: 1000;
        font-size: 20px;
    }
    .requestList .askforid{
        width: 20%;
    }
    .requestList .userid{
        width: 25%;
    }
    .requestList .username{
        width: 25%;
    }
    .requestList .options{
        width: 30%;
    }
    .requestList .options span{
        padding: 10px;
    }
    .requestList .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    .requestList .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    }
    .requestList .options span:nth-child(3):hover{
        color: rgb(239, 43, 43);
    }
    .requestList .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 45%;
    }
</style>