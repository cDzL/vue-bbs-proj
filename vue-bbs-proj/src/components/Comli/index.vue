<template>
    <div @mouseenter="showDelbtn()" @mouseleave="hideDelbtn()" class="comli">
        <div><span v-if="this.show"  @click="delComt()">x</span></div>
        <span @click="toArticle(comment.aid)" class="aid">帖子ID：{{comment.aid}}</span><br>
       <span>评论：{{comment.content}}</span>
    </div>
</template>
  
<script>
import axios from 'axios'
import PubSub from 'pubsub-js'
export default {
    name:'ComLi',
    props:['comment'],
    data(){
        return{
            show:false,
            onwer:false
        }
    },
    mounted(){
        const {userid} =this.$route.params
        if(this.$store.state.user.userid == userid)
            this.onwer  =true
        else this.onwer = false
    },
    methods:{
        toArticle(aid){
            this.$router.replace({
				name:'commentPage',
				params:{
					aid,
					type:0
				}
			})
        },
        delComt(){
           if(confirm('确定删除该评论吗')==true){
            axios.get('/api/delComt',{params:{
                cid:this.comment.commutid
            }}).then(
                res=>{
                    if(res.data){
                        PubSub.publish('delcomt',{cid:this.comment.commutid})
                    }
                },err=>{
                    console.log('请求失败',err.message)
                }
            )
           }
            
        },
        showDelbtn(){
            if(this.onwer)
            this.show = true
        },
        hideDelbtn(){
            if(this.onwer)
            this.show = false
        }
    }
}
</script>

<style>
    .comli{
        background: white;
        font-size: 14px;
        width:365px;
        height: 80px;
        padding: 10px;
        border-bottom:1px solid rgba(92, 92, 92, 0.341);
        cursor: pointer;
        overflow: hidden;
        box-sizing: border-box;
    }
    .comli .aid{
        font-size: 12px;
    }
    .comli .aid:hover{
        color: rgb(254, 32, 124);
    }
    .comli span{
        float: left;
    }
    .comli div {
        height: 20px;
    }
    .comli div span{
        float: right;
        transform:all 1s;
    }
    .comli div span:hover{
        color: red;
        scale: 1.3;
    }
</style>