<template>
    <div class="articleList">
        <div class="h3">
            <span>所有帖子信息</span><br>
            <input class="search" placeholder="输入:帖子id或标题,作者id" v-model="keywords" type="text"/><button @click="search()" class="keysearch">搜索</button>
        </div>
      <div class="alistItem">
          <label>
              <span class="articleid">帖子ID</span>
              <span class="userid">作者ID</span>
              <span class="articletitle">帖子标题</span>
              <span class="articlecontent">帖子内容</span>
              <span class="articletime">发帖时间</span>
              <span class="options">操作</span>
          </label>
          <p v-if="list.length<=0">空空如也,没有任何记录</p>
          <ul class="items" v-if="list.length>0">
              <li v-for="item of list" :key="item.aid">
                  <span class="articleid">{{item.aid}}</span>
                  <span class="userid">{{item.userid}}</span>
                  <span class="articletitle">{{item.title}}</span>
                  <span class="articlecontent">{{item.content}}</span>
                  <span class="articletime">{{item.pubtime}}</span>
                  <span  class="options">
                      <span @click="deletearticle(item.aid)">删除</span>
                      <span @click="showArticle(item)">预览</span>
                  </span>
              </li>
          </ul>
          <li class="bottombtns"><button @click="back()">上一页</button>{{ index+1 + '/' + total }}页<button @click="next()">下一页</button></li>
      </div>
      <adminArticle v-if="show" :article= "article" :close= "close"></adminArticle>
    </div>
</template>
  
  <script>
  import adminArticle from './article.vue'
  import axios from 'axios'
  export default {
      name:'articleList',
      components:{adminArticle},
      mounted(){
          axios.get('/api/getallarticle').then(
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
          this.getArticles()
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
          showArticle(item){
              this.article = item
              this.show = true
          },
          close(){
              this.show = false
          },
          back(){
              if(this.index+1 >1){
                  this.index = this.index-1
                  this.getArticles()
              }
          },
          next(){
              if(this.index+1 <this.total){
                  this.index = this.index+1
                  this.getArticles()
              }
          },
          getArticles(){    //获取信息
              axios.get('/api/getarticles',{params:{
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
          deletearticle(aid){     //删除帖子记录
              axios.get('/api/delArticle',{params:{
                  aid
              }}).then(
                  res=>{
                      if(res){
                          this.list = this.list.filter(item=>{
                              if(item.aid!=aid){
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
          search(){       //搜索帖子
            if(this.keywords==''){
                this.list = []
                this.getArticles()
            }else{
                axios.get('/api/searchArticle',{params:{keywords:this.keywords}}).then(
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
    .articleList{
        width: 100%;
        position: relative;
        min-height: 90vh;
        border-bottom-right-radius: 20px;
    }
    .articleList label{
        width: 100%;
    }
    .articleList p{
        padding: 20px;
        text-align: center;
        font-weight: 1000;
    }
    .articleList .items{
        max-height: 60vh;
        overflow: auto;
    }
    .articleList .items span{
        border: none;
        cursor: pointer;
    }
    .articleList .items li{
        border-bottom: 1px solid gray;
        height: 50px;
        line-height: 40px;
    }
    .alistItem span{
        display: inline-block;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid rgb(0, 0, 0);
        border-left: 1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        overflow: hidden;
    }
    .articleList .h3{
        padding: 20px;
        background: rgb(14, 85, 72);
        color: white;
        height: 110px;
        box-sizing: border-box;
        border-top-right-radius: 20px;
    }
    .articleList .h3 .search{
        height: 30px;
        width: 160px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
    }
    .articleList .h3 .keysearch{
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
    .articleList .h3 .keysearch:hover{
        opacity: 1;
        scale: 1.1;
    }
    .articleList .h3 span{
        border: none;
        font-weight: 1000;
        font-size: 20px;
    }
    .articleList .articleid{
        width: 5%;
    }
    .articleList .userid{
        width: 5%;
    }
    .articleList .articletitle{
        width: 20%;
    }
    .articleList .articlecontent{
        width: 35%;
    }
    .articleList .articletime{
        width: 20%;
    }
    .articleList .options{
        width: 15%;
    }
    .articleList .options span{
        padding: 10px;
    }
    .articleList .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    .articleList .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    }
    .articleList .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 45%;
    }
</style>