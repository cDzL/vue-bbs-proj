<template>
    <div class="reportList">
      <div class="h3">
          <span>所有举报信息</span><br>
      </div>
      <div class="plistItem">
          <label>
              <span class="reportid">ID</span>
              <span class="userid">用户ID</span>
              <span class="username">用户名称</span>
              <span class="aid">帖子ID</span>
              <span class="reason">举报原因</span>
              <span class="options">操作</span>
          </label>
          <p v-if="list.length<=0">空空如也,没有任何记录</p>
          <ul class="items" v-if="list.length>0">
              <li v-for="item of list" :key="item.reportid">
                  <span class="reportid">{{item.reportid}}</span>
                  <span class="userid">{{item.userid}}</span>
                  <span class="username">{{item.username}}</span>
                  <span class="aid">{{ item.aid }}</span>
                  <span class="reason">{{ item.reason }}</span>
                  <span  class="options">
                      <span @click="deletereport(item.reportid)">删除</span>
                      <span @click="showArticle(item.aid)">浏览</span>
                      <span @click="deletearticle(item.aid,this.reportid)">删除帖子</span>
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
    name:'reportList',
    components:{adminArticle},
    mounted(){
        axios.get('/api/getallreport').then(
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
        this.getReports()
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
        showArticle(aid){
            axios.get('/api/getarticlebyid',{params:{aid}}).then(
                res=>{
                    const{data} = res
                    this.article = data
                    this.show = true
                },err=>{
                    console.log(err.message)
                }
            )
            
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
        getReports(){    //获取信息
            axios.get('/api/getreports',{params:{
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
        deletereport(reportid){     //删除举报信息
            axios.get('/api/deletereport',{params:{
                reportid
            }}).then(
                res=>{
                    if(res){
                        alert('删除成功')
                        this.list = this.list.filter(item=>{
                            if(item.reportid!=reportid){
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
        deletearticle(aid,reportid){     //删除帖子记录
              axios.get('/api/delArticle',{params:{
                  aid
              }}).then(
                  res=>{
                      if(res){
                          alert('帖子删除成功')
                          this.deletereport(reportid)
                      }else{
                          alert('删除失败')
                      }
                  },err=>{
                      alert('网络故障',err.message)
                  }
              )
        }
    }
}
</script>

<style>
    .reportList{
        width: 100%;
        position: relative;
        min-height: 90vh;
        border-bottom-right-radius: 20px;
    }
    .reportList label{
        width: 100%;
    }
    .reportList p{
        padding: 20px;
        text-align: center;
        font-weight: 1000;
    }
    .reportList .items{
        max-height: 60vh;
        overflow: auto;
    }
    .reportList .items span{
        border: none;
        cursor: pointer;
    }
    .reportList .items li{
        border-bottom: 1px solid gray;
        height: 50px;
        line-height: 40px;
    }
    .plistItem span{
        display: inline-block;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid rgb(0, 0, 0);
        border-left: 1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        overflow: hidden;
    }
    .reportList .h3{
        padding: 20px;
        background: rgb(14, 85, 72);
        color: white;
        height: 110px;
        box-sizing: border-box;
        border-top-right-radius: 20px;
    }
    .reportList .h3 .search{
        height: 30px;
        width: 160px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
    }
    .reportList .h3 .platebtn{
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
    .reportList .h3 .platebtn:hover{
        opacity: 1;
        scale: 1.1;
    }
    .reportList .h3 span{
        border: none;
        font-weight: 1000;
        font-size: 20px;
    }
    .reportList .reportid{
        width: 10%;
    }
    .reportList .userid{
        width: 10%;
    }
    .reportList .username{
        width: 15%;
    }
    .reportList .aid{
        width: 10%;
    }
    .reportList .reason{
        width: 25%
    }
    .reportList .options{
        width: 30%;
    }
    .reportList .options span{
        padding: 10px;
    }
    .reportList .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    .reportList .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    }
    .reportList .options span:nth-child(3):hover{
        color: rgb(239, 43, 43);
    }
    .reportList .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 45%;
    }
</style>