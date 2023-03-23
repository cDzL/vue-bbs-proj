<template>
    <div class="commentList">
      <div class="h3">
          <span>所有评论信息</span><br>
          <input class="search" v-model="keywords" placeholder="：帖子id,用户id,评论内容" type="text"/><button @click="search()" class="keysearch">搜索</button>
      </div>
      <div class="listItem">
          <label>
              <span class="commutid">ID</span>
              <span class="userid">用户id</span>
              <span class="commutcontent">评论内容</span>
              <span class="comtime">评论时间</span>
              <span class="options">操作</span>
          </label>
          <p v-if="list.length<=0">空空如也,没有任何记录</p>
          <ul class="items" v-if="list.length>0">
              <li v-for="item of list" :key="item.commutid">
                  <span class="commutid">{{item.commutid}}</span>
                  <span class="userid">{{item.userid}}</span>
                  <span class="commutcontent">{{item.content}}</span>
                  <span class="comtime">{{item.comtime}}</span>
                  <span  class="options">
                      <span @click="deletecommut(item.commutid)">删除</span>
                  </span>
              </li>
          </ul>
          <li class="bottombtns"><button @click="back()">上一页</button>{{ index+1 + '/' + total }}页<button @click="next()">下一页</button></li>
      </div>
    </div>
</template>
  
<script>
import axios from 'axios'
export default {
    name:'commentList',
    mounted(){
        axios.get('/api/getallcommut').then(
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
        this.getNotices()
    },
    data(){
        return{
            list:[],
            notice:{},
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
        getNotices(){    //获取信息
            axios.get('/api/getcommuts',{params:{
                index:this.index}
            }).then(
                res=>{
                    if(res){
                        const {data} = res
                        this.list = data   //this.list.concat(data)
                    }else{
                        console.log('失败')
                    }
                },err=>{
                    console.log(err.message)
                }
        )
        },
        deletecommut(commutid){     //删除公告记录
            axios.get('/api/deletecommut',{params:{
                commutid
            }}).then(
                res=>{
                    if(res){
                        this.list = this.list.filter(item=>{
                            if(item.commutid!=commutid){
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
        search(){
            if(this.keywords==''){
                this.list = []
                this.getNotices()
            }else{
                axios.get('/api/searchCommut',{params:{keywords:this.keywords}}).then(
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
    .commentList{
        width: 100%;
        position: relative;
        min-height: 90vh;
        border-bottom-right-radius: 20px;
    }
    .commentList label{
        width: 100%;
    }
    .commentList p{
        padding: 20px;
        text-align: center;
        font-weight: 1000;
    }
    .commentList .items{
        max-height: 60vh;
        overflow: auto;
    }
    .commentList .items span{
        border: none;
        cursor: pointer;
        overflow: hidden;
    }
    .commentList .items li{
        border-bottom: 1px solid gray;
        height: 50px;
        line-height: 40px;
    }
    .commentList span{
        display: inline-block;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid rgb(0, 0, 0);
        border-left: 1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        overflow: hidden;
    }
    .commentList .h3{
        padding: 20px;
        background: rgb(14, 85, 72);
        color: white;
        height: 110px;
        box-sizing: border-box;
        border-top-right-radius: 20px;
    }
    .commentList .h3 .search{
        height: 30px;
        width: 160px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
    }
    .commentList .h3 .keysearch{
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
    .commentList .h3 .keysearch:hover{
        opacity: 1;
        scale: 1.1;
    }
    .commentList .h3 span{
        border: none;
        font-weight: 1000;
        font-size: 20px;
    }
    .commentList .commutid{
        width: 10%;
    }
    .commentList .userid{
        width: 10%;
    }
    .commentList .commutcontent{
        width: 35%;
    }
    .commentList .comtime{
        width: 25%;
    }
    .commentList .options{
        width: 20%;
    }
    .commentList .options span{
        padding: 10px; 
    }
    .commentList .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    /* .commentList .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    } */
    .commentList .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 45%;
    }
</style>