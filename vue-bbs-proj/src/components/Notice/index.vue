<template>
  <div class="NoticeWall">
        <div class="NoticePage">
            <h2>公告栏</h2><br>
            <h5>{{ notice.title }}</h5><br>
            <div ref="NoticeContent" class="NoticeContent"></div>
            <button @click="close()">确定</button>
        </div>
  </div>
</template>

<script>
export default {
    name:'Notice',
    props:['close','notice'],
    mounted(){
        this.$refs.NoticeContent.innerHTML = this.$props.notice.content
    }
}
</script>

<style>
    .NoticeWall{
        width:100%;
        height:100vh;
        background: rgba(90, 90, 90, 0.5); 
        z-index:999;
        position: fixed;
        left: 0;
        top: 0;
    }
    .NoticePage{
        margin: 100px auto;
        width:420px;
        height: 500px;
        background: white;
        border-radius: 20px;
        padding: 10px;
        position: relative;
        transition: all 0.5s linear;
        overflow: hidden;
        box-sizing: border-box;
    }
    .NoticePage h2{
        text-align: center;
    }
    .NoticePage button{
        font-size: 20px;
        position: absolute;
        bottom: 10px;
        left: 190px;
    }
    .NoticeWall .NoticeContent{
        height: 400px;
        width: 100%;
        overflow-y: auto;
        letter-spacing: 2px;
    }
    .NoticePage p{
        text-align: center;
    }
</style>