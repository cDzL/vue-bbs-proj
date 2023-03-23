<template>
  <div class="authorContent" ref="el">
    <div v-if="isfailed" style="color:red;text-align:center;">
      网络请求出现问题，请检查网络
    </div>
    <div v-show="loaded">
      <div v-if="!articles.length" style="text-align:center;">空空如也</div>
      <Article v-for="article in articles" :article='article' :key="article.aid"></Article>
    </div>
    <div v-if="finished&&articles.length>0" style="text-align: center;">已经到底了~</div>
  </div>

</template>

<script>
import Article from '../../components/Article'
import axios from 'axios'
export default {
    name: "Content",
    components: {Article},
    data(){
        return{
            articles:[],
            index:0,
            isfailed:false,
            loaded:false,
            finished:false
        }
    },
    mounted(){
        const {sort} = this.$route.params
        this.SortInfo(sort)
        this.bindEventListener()
    },
    beforeDestroy(){
        this.$refs.el.removeEventListener("scroll",this.scrollHandler);
    },
    methods:{
        SortInfo(sort){
            axios.get('/api/getarticlesByPlateName',{params:{platename:sort,index:this.index}}).then(
                res=>{
                    if(res.data){
                        this.articles = res.data;
                    }else{
                        this.articles = [];
                    }
                    this.loaded = true
                },err=>{
                    console.log(err.message);
                    this.isfailed = true;
                }   
            )
        },
        bindEventListener(){   //绑定监听方法
            const el = this.$refs.el;
            if(!el) return
            el.addEventListener('scroll',this.scrollHandler);
        },
      scrollHandler(){
            let divHeight = this.$refs.el.offsetHeight
            let nScrollHeight = this.$refs.el.scrollHeight
            let nScrollTop = this.$refs.el.scrollTop
            if(nScrollTop + divHeight +1 >= nScrollHeight && this.finished!=false){
                this.index = Number(this.index+1)
                const {sort} = this.$route.params
                this.SortInfo(sort)
            }
      }
    },
    computed:{
        routeSort:function(){
            const {sort} = this.$route.params
            return sort
        }
    },
    watch:{
        //监视路由是否发生变化
        routeSort:{
            handler(newV){
                this.SortInfo(newV)
            }
        }
    }
}
</script>

<style>
    .authorContent{
        overflow-y: auto;
        width: 365px;
        height: 620px;
        pad: 10px;
        box-sizing: border-box;
        background: white;
        position: relative;
    }
    .authorContent::-webkit-scrollbar{
        width: 0;
    }
</style>