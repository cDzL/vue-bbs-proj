<template>
  <div class="searchPage">
    <div class="search_head">
        <input type="text" v-model="keywords" placeholder="输入关键词">
        <a class="link" active-class="active" @click="searchArticles()">搜索</a>
    </div>
    <div class="resultContainer" ref="el">
        <div v-show="loaded">
            <div v-if="articles.length<0">没有搜索到结果</div>
            <Article v-for="article of articles" :article="article" :key="article.aid"></Article>
        </div>
    </div>
  </div>
</template>

<script>
import Article from '../../components/Article'
import axios from 'axios'
export default {
    name:'SearchPage',
    components:{Article},
    data(){
        return{
            keywords:'',
            articles:[],
            index:0,
            finished:false,
            loaded:false,
            temp:''
        }
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
                this.initPage()
            }
        },
        searchArticles(){
            if(this.keywords != this.temp){
                this.articles = [];
                this.initPage();
                this.temp = this.keywords
            }  
        },
        initPage(){
            if(this.keywords!=''){
                this.temp = this.keywords
                axios.get('/api/searcharticles',{params:{
                    keywords:this.keywords,
                    index:this.index
                }}).then(
                    res=>{
                        if(res.data){
                            if(res.data.length>0){
                                this.articles = this.articles.concat(res.data)
                                this.finished = false
                            }else{
                                this.finished = true
                            }
                            this.loaded = true
                            this.keywords = ''
                        }
                    },
                    err=>{
                        console.log(err.message)
                    }
                )
            }
        }
    }
}
</script>

<style>
.searchPage{
    height: 680px;
    width: 365px;
    box-sizing: border-box;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin: 0px auto;
    background: #fff;
}
.searchPage .search_head {
    width: 365px;
    height: 35px;
    position: fixed;
    top: 0;
    box-sizing: border-box;
    background: #fff;
    z-index: 999;
    padding: 5px;
    
}
.searchPage .search_head input{
    width: 75%;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
}
.searchPage .search_head a{
    width: 15%;
    margin-left: 5%;
    cursor: pointer;
}
.searchPage .search_head a:hover{
    font-weight: 1000;
}
.searchPage .resultContainer{
    width: 100%;
    height: 100%;
    margin-top: 30px;
    overflow-y: scroll;
}
</style>