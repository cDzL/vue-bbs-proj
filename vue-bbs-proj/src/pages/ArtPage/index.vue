<template>
  <div class="atp">
    <div v-show="loaded" class="articlePage">
        <div class="backHead">
            <span @click="Back()"> back </span>
        </div>
        <div class="authorInfo">
            <img :src="user.att_img" :onerror="this.src = '~@/assets/logo.png'">
            <p>作者：{{user.username}}<span>关注：{{user.fansnum > 10000 ? ((user.fansnum/10000).toFixed(1) + 'w') : user.fansnum}}</span></p>
        </div>
        <div class="articleInfo">
            <h3>{{article.title}}</h3>
            <div ref="articleContent" class="articleContent">
            </div>
        </div>
        <div class="tags">
            <span>标签：</span>
            <span @click="toAuthorSort(tag)" class="tag" v-for="tag in tags" :key="tag.plateid" :title="tag+'标签'">{{tag}}</span>
        </div>
        <div class="articleBotm">
            <li></li>
            <li></li>
            <li></li>
            <li>
                <router-link replace class="link" active-class="active" :to="{name:'commentPage',params:{aid:aid,type:0}}">默认</router-link>|
                <router-link replace class="link" active-class="active" :to="{name:'commentPage',params:{aid:aid,type:1}}">只看楼主</router-link>

            </li>   
        </div>
    </div>
    <router-view></router-view>
    <div class="signal">
    </div>
   </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name:'ArtPage',
        mounted(){
            this.initPage()
        },
        methods:{
            Back(){   //返回
                this.$router.back(1)
            },
            initPage(){  //初始化数据信息
                const {aid} = this.$route.params
                this.aid = aid
                axios.get('/api/article',{params:{aid:this.aid}}).then(
                    response => {
                        if(response.data){
                            this.article = response.data
                            this.loadContent()
                        }else console.log('获取失败')
                    },err =>{
                        console.log(err.message)
                    }
                ).then(()=>{
                    axios.get('/api/user',{params:{
                                userid:this.article.userid
                            }}).then(res=>{
                                if(res.data){
                                    this.user = res.data
                                }else{
                                    console.log('网络故障请稍后再试')
                                }
                            },err=>{console.log('请求失败：',err)})
                })
            },
            // loadContent(textList,imgList){   //展示数据
            //     let articleContent = document.getElementById('articleContent')
            //     let str = ''
            //     for(let text of textList){
            //         let div = document.createElement('div')
            //         div.innerText = str+text
            //         articleContent.appendChild(div)
            //     }
            //     if(imgList.length>1)
            //         for(let i=1;i<imgList.length;i++){
            //             let img = document.createElement('img')
            //             img.src = imgList[i]
            //             articleContent.appendChild(img)
            //         }
            //     this.loaded = true
            // }
            loadContent(){
                this.$refs.articleContent.innerHTML = this.article.content
                this.loaded =true
                this.tags = this.article.plateid.split('/').filter(t=>{
                    if(t!='') return true
                })
            },
            toAuthorSort(sort){
                this.$router.push({
                    name:'content',
                    params:{
                        sort
                    }
                })
            }
        },
        data(){
            return{
                aid:'',
                article:{},
                user:{},
                loaded:false,
                tags:[]
            }
        }
    }
</script>

<style>
    .active{
		color: #2d83ec;
	}
    .atp{
        width: 365px;
        height: 680px;
        margin: 0 auto;
        overflow: hidden;
        padding: 0;
        box-sizing: border-box;
        background: white;
        padding-bottom: 10px;
        padding-top: 40px;
    }
    .atp::-webkit-scrollbar{
        width: 0%;
    }
    .atp .signal{
        background: none;
    }
    .articlePage{
        border-bottom: 1px solid rgb(133, 133, 135,0.1);
        width: 365px;
        background: white;
	}
    .articlePage .backHead {
        background: rgb(9, 138, 230);
        font-size: 14px;
        padding: 5px;
        position: fixed;
        top: 0;
        width: 365px;
        box-sizing: border-box;
        z-index: 999;
    }
    .articlePage .backHead span:hover{
        cursor: default;
    }
	.articlePage .authorInfo{
		height: 40px;
		padding-left: 5px;
	}
	.articlePage .authorInfo img{
		height: 30px;
		width: 30px;
		border-radius: 50%;
		overflow: hidden;
		vertical-align:middle;
	}
	.articlePage .authorInfo p{
		height: 30px;
		padding-left: 10px;
		vertical-align:middle;
		display: inline-block;
		
	}
    .articlePage .tag{
        font-size: 12px;
        padding: 5px;
        color: #ff0084;
        cursor: pointer;
    }
    .articlePage .authorInfo span{
		font-size: 13px;
		color: #cacaca;
		display: block;
	}
	.articlePage .articleInfo{
		padding: 0px 10px 10px 10px;
		min-height: 50px;
		overflow: hidden;
		font-size: 14px;
        box-sizing: border-box;
	}
	.articlePage .articleBotm{
		width: 365px;
        margin-top: 20px;
		display: inline-flex;
		justify-content: space-around;
	}
	.articlePage .articleBotm:hover{
		cursor: default;
	}
    .articleContent img{
        max-width: 350px;
        max-height: 360px;
        margin: 0 auto;
    }
</style>