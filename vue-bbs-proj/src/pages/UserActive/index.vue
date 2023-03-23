<template>
  <div class="userActive" ref="el">
    <div v-if="!personal">
        <div v-show="loaded">
            <div v-if="!articles.length">空空如也</div>
            <Article v-for="article of articles" :article="article" :key="article.aid"></Article>
        </div>
    </div>
    <div v-else style="text-align: center;">
        该用户设置不可见
    </div>
   </div>
</template>

<script>
import Article from '../../components/Article'
import axios from 'axios'
import PubSub from 'pubsub-js'
export default {
    name:'UserActive',
    components:{Article},
    data(){
        return{
            articles:[],
            loaded:false,
            index:0,
            personal:false,
            finished:false
        }
    },
    mounted(){
        const id = this.$route.params.userid
        if(id == this.$store.state.user.userid){
            this.initPage()
            this.bindEventListener()
        }else{
            axios.get('/api/getactivepersonal',{params:{userid:id}}).then(
                res=>{
                    if(res.data){
                        const {data:{activepersonal}} = res
                        if(activepersonal){
                            this.personal = res.data.activepersonal
                        }else{
                            this.initPage()
                            this.bindEventListener()
                        }     
                    }
                },err=>{
                    console.log(err.message)
                }
            )
        }
        
        this.delId = PubSub.subscribe('delArt',(msgName,value)=>{
            this.articles = this.articles.filter(a=>{
                if(a.aid!=value) return a
            })
        })
        this.dsoId = PubSub.subscribe('suco',(msgName,value)=>{
            this.articles.map(a=>{
                if(a.aid==value.aid)
                    if(value.type)a.support = a.support+value.num
                    else a.collect = a.collect+value.num
                return a
            })
        })
    },
    methods:{
        initPage(){    //初始化
            axios.get('/api/myarticels',{
            params:{
                userid:this.$route.params.userid,
                index:this.index
            }}).then(res=>{
                if(res.data){
                    let {data} = res
                    if(data.length>0){ 
                        this.articles = this.articles.concat(data)
                        this.finished = false
                    }else{
                        this.finished = true
                    }
                    this.loaded = true
                    }
                },err=>{
                    console.log('请求失败',err.message)
                })
        },
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
                this.initPage()
            }
        },
        },
    beforeDestroy(){
        PubSub.unsubscribe(this.delId);
        PubSub.unsubscribe(this.dsoId);
        this.$refs.el.removeEventListener("scroll",this.scrollHandler);
    }
    }
</script>

<style> 
    .userActive{
        width: 365px;
        height: 400px;
        background: white;
        border-radius: 20px;
        overflow-y: auto;
    }
    .userActive::-webkit-scrollbar{
        width: 0;
    }
</style>