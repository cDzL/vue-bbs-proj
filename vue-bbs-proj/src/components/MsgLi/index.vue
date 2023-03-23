<template>
    <div @mouseenter="showthis()" @mouseleave="hidethis()" class="msgli">
        <div><span v-if="show" @click="delMsg(person.messageid)" title="删除">x</span></div>
        <span @click="toArticle(person.aid)" class="aid">ID为{{person.fromuserid}}的用户，在你的| 帖子-ID:{{person.aid}} |{{person.flag?'评论说':''}}</span><br>
       <span>{{person.content}}</span>
    </div>
</template>

<script>
import axios from 'axios'
import PubSub from 'pubsub-js'
export default {
    name:'MsgLi',
    props:['person'],
    data(){
        return{
            show:false
        }
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
        delMsg(messageid){
           if(confirm('确定删除该信息吗')==true){
            axios.get('/api/delMsg',{params:{
                messageid
            }}).then(
                res=>{
                    if(res.data){
                        PubSub.publish('deltoMe',{messageid:this.person.messageid})
                    }
                },err=>{
                    console.log('请求失败',err.message)
                }
            )
           }
            
        },
        showthis(){
            this.show = true
        },
        hidethis(){
            this.show = false
        }
    }
}
</script>

<style>
    .msgli{
        font-size: 14px;
        width:365px;
        height: 90px;
        padding: 10px;
        border-bottom:1px solid rgba(75, 74, 75, 0.438);
        cursor: pointer;
        overflow: hidden;
        box-sizing: border-box;
    }
    .msgli .aid{
        font-size: 12px;
    }
    .msgli .aid:hover{
        color: rgb(254, 32, 124);
    }
    .msgli span{
        float: left;
    }
    .msgli div {
        height: 20px;
    }
    .msgli div span{
        float: right;
    }
    .msgli div span:hover{
        color: red;
        scale: 1.5;
    }
</style>