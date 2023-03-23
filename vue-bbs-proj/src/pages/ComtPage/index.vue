<template>
    <div class="commentPage" ref="el">
        <div v-show="loaded">
            <Comt v-for='comment in comments' :key="comment.commutid" :comment='comment'></Comt>
        </div>
        <div v-show="finished&&comments.length>0" style="text-align: center;">已经到底了~</div>
        <div v-if="!comments.length" class="noComs">暂无评论</div>
        <div class="signal"></div>
        <div :class="isMobile? 'msg':'msg pcMsg'">
			<textarea v-model="comt.content" class="input"></textarea><button @click="sendMsg()" class="send">发送<span>{{comt.content.length}}/40</span></button>
		</div>
    </div>
</template>
<script>
import Comt from '../../components/Comment'
import axios from 'axios'
export default {
    name:'ComtPage',
    components:{Comt},
    data(){
        return{
            isMobile:false,
            comments:[],
            comt:{
                userid:0,
                aid:0,
                content:'',
                comtime:''
            },
            index:0,
            finished:false,
            loaded:false
        }
    },
    mounted(){
        this.isMobile = this.$store.state.isMobile;
        this.comt.userid = this.$store.state.user.userid;
        let {aid,type} = this.$route.params;
        this.comt.aid = aid;
        this.SortInfo(aid,type,this.index);
        this.bindEventListener();
    },
    beforeDestroy(){
        this.$refs.el.removeEventListener("scroll",this.scrollHandler);
    },
    methods:{
        bindEventListener(){   //绑定监听方法
            const el = this.$refs.el;
            if(!el) return
            el.addEventListener('scroll',this.scrollHandler)
            
        },
        scrollHandler(){
            let divHeight = this.$refs.el.offsetHeight
            let nScrollHeight = this.$refs.el.scrollHeight
            let nScrollTop = this.$refs.el.scrollTop
            if(nScrollTop + divHeight +1 >= nScrollHeight && !this.finished){
                this.index = Number(this.index+1)
                let {aid,type} = this.$route.params
                this.SortInfo(aid,type,this.index)
            }
        },
        sendMsg(){   //发送评论
            if(this.$store.state.user.userid!=null)
                if(this.comt.content.length>0){
                    axios.get('/api/sendMsg',{params:{
                        comment:this.comt
                    }}).then(res=>{
                        if(res.data) {
                            this.comt.content = ''
                        }else{
                            console.log('发送失败')
                        }
                    },err=>{
                        console.log(err.message)
                    })
                }else{
                    alert('不能为空')
                }
            else alert('请先登录')      
        },
        SortInfo(aid,type,index){
            axios.get('/api/comments',{params:{
            aid,
            type,
            index
        }}).then(res=>{
            if(res.data){
                if(res.data.length<=0){
                    this.finished = true;
                }
                else {
                    this.comments = this.comments.concat(res.data)
                    this.finished = false
                }
                this.loaded = true
            }else{
                console.log('请求失败')
            }
        },err=>{
            console.log('网络请求失败',err.message)
        })
        }
    },computed:{
        routeSort:function(){
            const {type} = this.$route.params
            return type
        }
    },
    watch:{
        //监视路由是否发生变化
        routeSort:function(newType){
                this.comments = []
                this.SortInfo(this.comt.aid,newType,0)
            }
    }
}
</script>

<style>
    .commentPage{
        width:365px;
        margin: 0 auto;
        height: 500px;
        overflow-y: scroll;
    }
    .commentPage .noComs{
        margin-top: 20px;
        text-align: center;
    }
    .commentPage .msg{
		width: 365px;
        height: 50px;
		position: fixed;
		top: 660px;
		display: flex;
        background: white;
        box-sizing: border-box;
	}
    .commentPage .pcMsg{
		bottom: 0;
        padding: 10px;
    }
	.commentPage .input{
		flex: 8;
		border:1px solid #c2c2c2;
		height: 30px;
		padding: 5px;
		box-sizing: border-box;
        border-radius: 10px;
        resize: none;

	}
	.commentPage .send{
		flex:3;
		height: 30px;
        font-size: 10px;
	}
    .commentPage .msg li{
        flex:2;
        font-size: 10px;
        display: flex;
        flex-direction: column;
        padding-left: 2px;
        box-sizing: border-box;
    }
    .commentPage .msg li:hover{
        color:pink;
        box-sizing: border-box;
        cursor: pointer;
    }
	.commentPage .send span{
		font-size: 8px;
	}
    .commentPage .msg p{
        height: 20px;
        width: 20px;
        text-align: center;
    }
</style>