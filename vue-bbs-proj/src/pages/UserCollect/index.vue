<template>
  <div class="userCollect" ref="el">
    <div v-if="!personal">
        <div v-show="loaded">
            <div v-if="!articles.length" style="text-align: center;">空空如也</div>
            <Article v-for="article of articles" :article="article" :key="article.aid"></Article>
        </div>
    </div>
    <div v-else style="text-align: center;">
        该用户设置不可见
    </div>
  </div>
</template>

<script>
import Article from '@/components/Article'
import axios from 'axios'
export default {
  name:"UserCollect",
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
        axios.get('/api/getcollectpersonal',{params:{userid:id}}).then(
            res=>{
                if(res.data){
                    const {data:{collectpersonal}} = res
                    if(collectpersonal){
                        this.personal = res.data.collectpersonal
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
  },
  methods:{
    initPage(){
      axios.get('/api/getCollectArt',{params:{
        userid:this.$route.params.userid,
        index:this.index
      }}).then(
          res=>{
            const {data} = res
            if(data){
              if(data.length>0){
                this.articles = this.articles.concat(data)
                this.finished = false
              }else{
                this.finished = true
              }
              this.loaded = true
            }else{
              console.log('请求失败')
            }
          },err=>{
            console.log(err.message)
          }
        )
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
    this.$refs.el.removeEventListener("scroll",this.scrollHandler);
  }
}
</script>

<style>
    .userCollect{
      overflow-y: auto;
      width: 365px;
      height: 420px;
      box-sizing: border-box;
      background: white;
      position: absolute;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
</style>