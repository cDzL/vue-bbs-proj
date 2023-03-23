<template>
  <div class="suggest" ref="el">
    <div v-if="isfailed" style="color:red;text-align:center;">
      网络请求出现问题，请检查网络
    </div>
    <Article v-for="article in articles" :article='article' :key="article.aid"></Article>
    <div v-if="articles.length<=0" style="text-align:center;">空空如也</div>
    <div v-show="finished && articles.length>0" style="text-align: center;">已经到底了~</div>
  </div>
</template>
<script>
import Article from '@/components/Article'
import axios from 'axios'
import PubSub from 'pubsub-js'
export default {
    name:"Suggest",
    components:{Article},
    mounted(){
      this.delId = PubSub.subscribe('delArt',(msgName,value)=>{
          this.articles = this.articles.filter(a=>{
              if(a.aid!=value) return a
          })
        })
      this.sucoId = PubSub.subscribe('suco',(msgName,value)=>{
          if(value.type){
            this.articles = this.articles.filter(a=>{
              if(a.aid == value.aid){a.support = a.support+value.num}
              return a;
            })
          }else{
            this.articles = this.articles.filter(a=>{
              if(a.aid == value.aid){a.collect = a.collect+value.num}
              return a;
            })
          }
      }),
      this.initPage()
      this.bindEventListener()
    },
    methods:{
        bindEventListener(){   //绑定监听方法
              const el = this.$refs.el;
              if(!el) return
              el.addEventListener('scroll',this.scrollHandler);
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
      initPage(){
        axios.get('/api/suggest',{params:{index:this.index}}).then(
        res=>{
          const {data} = res
          if(data){
              this.loaded = true
              this.isfailed = false
              if(data.length<=0){
                this.finished = true
              }else{
              this.articles = this.articles.concat(data)
              this.finished = false
              }
            }else{
              console.log('请求失败')
              this.isfailed = true
              this.loaded = false
            }
        },err=>{
          console.log(err.message)
          this.isfailed = true
        }
      )
      }
    },
    beforeDestroy(){
      PubSub.unsubscribe(this.delId)
      PubSub.unsubscribe(this.sucoId)
      this.$refs.el.removeEventListener("scroll",this.scrollHandler)
    },
    data(){
      return{
        isfailed:false,
        articles:[],
        index:0,
        finished:false
      }
    }
}
</script>

<style>
  .suggest{
    width: 365px;
    height: 660px;
    box-sizing: border-box;
    background: white;
    position: absolute;
    top: 40px;
    border-radius: 20px;
    overflow-y: scroll;
  }
  .suggest::-webkit-scrollbar{
    width: 0;
  }
  
</style>