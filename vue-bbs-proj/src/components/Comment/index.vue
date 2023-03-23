<template>
  <div v-show="loaded" class="comment">
    <div class="authorInfo">
        <img :src="user.att_img" :onerror="this.src = '~@/assets/logo.png'">
        <p><span>{{user.username}}</span></p>
        <p><span>{{ comment.comtime }}</span></p>
        <button v-if="user.userid==authorid" class="theAuthor">楼</button>
    </div>
    <div class="commentContent">
        {{comment.content}}
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'Comment',
    props:['comment'],
    data(){
        return{
            user:{},
            authorid:0,
            loaded:false
        }
    },
    mounted(){
        axios.get('/api/user',{params:{
            userid:this.comment.userid,
        }}).then(
            res=>{
                if(res.data){
                    this.user = res.data
                }else{
                    console.log('网络请求失败')
                }
            },err=>{
                console.log('网络请求失败',err.message)
            }
        ).then(()=>{
            axios.get('/api/authorid/',{params:{
                aid:this.comment.aid
            }}).then(res=>{
                this.authorid = res.data.userid
                this.loaded = true
            },err=>{
                console.log('请求作者信息失败',err.message)
            })
        },()=>{

        })
    }
}
</script>

<style>
    .comment{
        border-bottom: 1px solid rgba(47, 47, 47, 0.2);
    }
    .comment .authorInfo{
		height: 40px;
		padding-left: 5px;
        padding-top: 10px;
        position: relative;
	}
	.comment .authorInfo img{
		height: 30px;
		width: 30px;
		border-radius: 50%;
		overflow: hidden;
		vertical-align:middle;
	}
	.comment .authorInfo p{
		height: 30px;
		padding-left: 10px;
		vertical-align:middle;
		display: inline-block;
	}
    .comment .authorInfo span{
        font-size: 13px;
		display: block;
    }
    .comment .commentContent{
        padding: 0px 20px 10px 20px;
        font-size:14px;
        margin-top: 20px;
        background: white;
    }

    .comment .authorInfo .theAuthor{
        background: rgb(247, 178, 4);
		border: none;
		color: rgb(255, 255, 255);
		font-size: 13px;
		border-radius: 50%;
		position: absolute;
        height: 20px;
        width: 20px;
		right: 40px;
		top: 20px;
    }
	
</style>