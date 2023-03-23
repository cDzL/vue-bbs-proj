<template>
    <div class="header">
        <div class="header_container">
            <div>   
                <img src="~@/assets/backrocket.png" alt="图片" title="图片">
            </div>
            <div class="header_btns">
                <li @click="hideImgs">设置背景</li>
                <li v-if="!ifAdmin" @click="showOut">公告</li>
                <li @click="toAdmin">{{ifAdmin? '切换用户登录':'切换管理员登录'}}</li>
                <li v-show="false">登出</li>
            </div>
            <div class="header_switch">下拉</div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Header",
    props:['toAdmin','ifAdmin','showOut','hideImgs'],
    data(){
        return{
            flag:false
        }
    }
}
</script>

<style>
    .header{
        height: 80px;
        padding: 10px 80px;
        width: 100%;
        top:-80px;
        left: 0;
        position: fixed;
        background: rgba(255, 255, 255, 0.036);
        box-sizing: border-box;
        transition: all .5s;
        z-index: 999;
        color: rgb(0, 0, 0);
    }
    .header .header_switch{
        width: 60px;
        height: 20px;
        background: rgba(255, 255, 255, 0.075);
        position: absolute;
        text-align: center;
        right: -50px;
        top: 70px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        cursor: pointer;
        transition: all .5s;
        font-weight: 1000;
    }
    .header img{
        height: 60px;
        width: 60px;
        border-radius: 50%;
        overflow: hidden;
        scale: 1.4;
    }
    .header .header_container{
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    .header .header_btns{
        width: 300px;
        height: 40px;
        line-height: 50px;
        display: flex;
        justify-content: space-around;
        cursor: pointer;
    }
    .header .header_btns li:hover{
        font-weight: 1000;
    }
    .header:hover{
        top: 0;
    }
</style>