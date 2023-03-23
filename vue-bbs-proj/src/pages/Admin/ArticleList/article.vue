<template>
    <div class="adminarticleWall">
      <div class="adminarticleinfo">
          <span>帖子ID：{{ article.aid }}</span><br>
          <span>作者ID：{{ article.userid }}</span><br>
          <span>标题：{{ article.title }}</span><br>
          <span>点赞数：{{ article.support }}</span><br>
          <span>收藏数：{{ article.collect }}</span><br>
          <span>评论数：{{ article.commut }}</span><br>
          <span>发布时间：{{ article.pubtime? article.pubtime:'暂无' }}</span><br>
          <h4>内容预览</h4>
          <div class="contentContainer" ref="contentContainer"></div>
          <div class="articlebottombtns">
            <span @click="close()">取消</span>
          </div>
      </div>
      
    </div>
</template>
  
<script>
//import axios from 'axios'
export default {
    name:'adminArticle',
    props:['close','article'],
    mounted(){
        this.$refs.contentContainer.innerHTML = this.article.content
    }
}
</script>
  
<style>
    .adminarticleWall{
        position: fixed;
        width: 100%;
        background: rgba(50, 50, 50, 0.436);
        height: 100vh;
        top: 0;
        left: 0;
    }
    .adminarticleWall .adminarticleinfo{
        margin: 50px auto;
        background: white;
        width: 400px;
        height: 600px;
        border-radius: 20px;
        padding-left: 20px;
        padding-top: 10px;
        box-sizing: border-box;
        position: relative;
    }
    .adminarticleWall .contentContainer img{
        max-width: 360px;
    }
    .adminarticleWall .contentContainer{
        width: 100%;
        height: 240px;
        overflow: auto;
    }
    .adminarticleWall span{
        height: 30px;
        line-height: 40px;
        cursor: pointer;
    }
    .adminarticleWall input{
        height: 20px;
    }
    .adminarticleWall .articlebottombtns{
        height: 60px;
        width: 100%;
        display: block;
        position: absolute;
        bottom: 0;
        left: 20px;
    }
    .adminarticleWall .articlebottombtns span:nth-child(1){
        float: left;
    }
    .adminarticleWall .articlebottombtns span:nth-child(2){
        float: right;
        margin-right: 20px;
    }
    .adminarticleWall .articlebottombtns span:hover{
        color: rgb(25, 221, 255);
    }
</style>