<template>
   <div v-if="loaded" class="article">
    <div class="authorInfo">
        <img :src="user.att_img">
        <p @click="toauthorcenter(user.userid)">作者:{{user.username}}<span>关注：{{user.fansnum > 10000 ? ((user.fansnum/10000).toFixed(1) + 'w') : user.fansnum}}</span></p>
		<button @click="subscribe()" :class="subscirbed?'btn_subscribe_active':'btn_subscribe'">+关注</button>
		<p @click="more()" class="more">. . .<span @click.stop="jubao()" v-show="al.isfl4&&!mine">举报</span> 
		<span v-show="al.isfl4&&(isAuthor||mine)" @click="delArticle()" class="del">删除</span></p>
	</div>
    <div class="articleInfo" @click="toArticlePage(article.aid)">
        <h4>{{article.title}}</h4>
        <div ref="simpleArticleContent" class="articleContent">
        </div>
    </div>
    <div class="articleBotm">
        <li @click="collect()" @mouseenter="incrementMov(1)" @mouseleave="noMov(1)" :class="opt.colected?'supported':''">收藏:{{article.collect==0 ? 0:article.collect-1}}<span v-if="al.isfl1">+1</span></li>
        <li @mouseenter="incrementMov(2)" @mouseleave="noMov(2)">评论:{{article.commut}}<span v-if="al.isfl2">+1</span></li>
        <li @click="support()" @mouseenter="incrementMov(3)" @mouseleave="noMov(3)" :class="opt.suped?'supported':''">赞:{{article.support==0 ? 0 : article.support-1 }}<span v-if="al.isfl3">+1</span></li>
    </div>
   </div>
</template>

<script>
import PubSub from 'pubsub-js'
import axios from 'axios'
export default {
    name:'Article',
    mounted(){
        if(this.$store.state.user.userid==this.article.userid){
			this.subscirbed = true
			this.mine = true
		}
		if(this.$store.state.user.sort == 1){
			this.isAuthor = true
		}
		this.initArticle()
		//this.$refs.simpleArticleContent.innerHTML = this.article.content
    },
    props:['article'],
    data(){
        return{
			user:{
				
			},
			al:{
				isfl1:false,
				isfl2:false,
				isfl3:false,
				isfl4:false
			},
			opt:{
				suped:false,
				colected:false
			},
			isAuthor:false,
			subscirbed:false,
			loaded:false,
			mine:false,
			logined:false
        }
    },
	methods:{
		toArticlePage(aid){
			this.$router.push({
				name:'commentPage',
				params:{
					aid,
					type:0
				}
			})
		},
		incrementMov(n){
			if(n==1)
				this.al.isfl1 = true
			if(n==3)
				this.al.isfl3 = true
			if(n==2)
				this.al.isfl2 = true
		},
		noMov(n){
			if(n==1)
				this.al.isfl1 = false
			if(n==2)
				this.al.isfl2 = false
			else
				this.al.isfl3 = false
		},
		subscribe(){  //关注或者取消关注
			if(this.logined){
				if(!this.mine){
					const auserid = this.article.userid//获取作者id
					axios.get('/api/subscribe',{params:{
						auserid,
						userid:this.$store.state.user.userid
					}}).then(res=>{
						if(res.data){
							this.subscirbed = !this.subscirbed
						}
					},err=>{
						console.log('请求失败',err.message)
					})
				}else{
					alert('不可以关注自己')
				}
			}
			
		},
		more(){    //更多。。。
			this.al.isfl4 = !this.al.isfl4
		},
		jubao(){   //举报
			if(this.logined)
				PubSub.publish('jubao',this.article.aid)
		},
		delArticle(){   //删除帖子
			if(this.mine){
				axios.get('/api/delArticle',{params:{
					aid:this.article.aid
				}}).then(
					res=>{
						if(res.data){
							PubSub.publish('delArt',this.article.aid)
							alert('删除成功')}
						else alert('删除失败')
					},err=>{
						console.log(err.message)
					}
				)
			}
		},
		support(){   //点赞或取消点赞
			if(this.logined){
				if(!this.opt.suped){
					axios.get('/api/support',{params:{
						userid:this.$store.state.user.userid,
						aid:this.article.aid,
						supporter:this.article.supporter,
						type:1
					}}).then(res=>{
						if(res.data){
							this.opt.suped = true
							PubSub.publish('suco',{aid:this.article.aid,type:true,num:1})
						}
					},err=>{
						console.log(err.message)
					})
				}else{
					axios.get('/api/support',{params:{
						userid:this.$store.state.user.userid,
						aid:this.article.aid,
						supporter:this.article.supporter,
						type:-1
					}}).then(res=>{
						if(res.data){
							this.opt.suped = false
							PubSub.publish('suco',{aid:this.article.aid,type:true,num:-1})
						}
					},err=>{
						console.log(err.message)
					})
				}
			}
		},
		collect(){   //收藏或取消收藏
			if(this.logined){
				if(!this.opt.colected){
					axios.get('/api/collect',{params:{
						userid:this.$store.state.user.userid,
						aid:this.article.aid,
						collecter:this.article.collecter,
						type:1
					}}).then(res=>{
						if(res.data){
							this.opt.colected = true
							PubSub.publish('suco',{aid:this.article.aid,type:false,num:1})
						}
					},err=>{
						console.log(err.message)
					})
				}else{
					axios.get('/api/collect',{params:{
						userid:this.$store.state.user.userid,
						aid:this.article.aid,
						collecter:this.article.collecter,
						type:-1
					}}).then(res=>{
						if(res.data){
							console.log(3)
							this.opt.colected = false
							PubSub.publish('suco',{aid:this.article.aid,type:false,num:-1})
							
						}
					},err=>{
						console.log(err.message)
					})
				}
			}
			
		},
		initArticle(){    //初始化该组件
			this.logined = false
			axios.get('/api/user',{params:{userid:this.article.userid}}).then(
				res=>{
					if(res.data){
						const {data} = res
						this.user = {...data}
					}else{
						alert('图片加载失败')
					}
				},
				err=>{
					console.log('网络请示失败',err.message)
				}
			).then(()=>{
				let userid = 0
				if(this.$store.state.user.userid != '' && this.$store.state.user.userid != null){
					userid = this.$store.state.user.userid
					this.logined = true
					this.ifsupport()
				}
				axios.get('/api/subslist',{params:{
					userid
				}}).then(res=>{
					if(res.data){
						if(!this.mine){
							res.data.map(s=>{
								if(s.userid==this.article.userid){
									this.subscirbed = true
								}
								return s
							})
						}
						this.loaded = true
					}
				},err=>{
					console.log('获取关注的人信息失败',err.message)
				})
			})
			
		},
		ifsupport(){    //判断是否点赞或者收藏
			if(this.logined){
				let supporters = this.article.supporter.split('/')
				let collecters = this.article.collecter.split('/')
				if(supporters){
					supporters.map(s=>{
						if(s==this.$store.state.user.userid)
						this.opt.suped = true
						return s
					})
				}else{
					this.opt.suped =false
				}
				if(collecters){
					collecters.map(c=>{
						if(c==this.$store.state.user.userid)
						this.opt.colected = true
						return c
					})
				}else{
					this.opt.colected = false
				}
			}
			
		},
		toauthorcenter(userid){
			this.$router.replace({name:'userMain',params:{userid}})
		}
		
	}
}
</script>

<style>
    .article{
		border-bottom: 1px solid rgba(133, 133, 135,0.2);
		padding-bottom: 5px;
		user-select: none;
	}
	.article .more{
		position: absolute;
		right: 10px;
		top: -5px;
		color: black !important;
		min-height: 80px;
	}
	.article .supported{
		color: rgb(247, 62, 92);
	}
	.article .more span{
		font-size: 12px !important;
	}
	.article .more .del{
		text-align: center;
	}
	.article .more:hover{
		cursor: pointer;
		color: rgb(245, 123, 176) !important;
	}
	.article .btn_subscribe{
		background: rgb(245, 123, 176);
		border: none;
		color: rgb(255, 255, 255);
		padding: 2px;
		font-size: 13px;
		border-radius: 5px;
		position: absolute;
		right: 40px;
		top: 20px;
		z-index: 0;
	}
	.article .btn_subscribe_active{
		background: rgb(203, 203, 203);
		border: none;
		color: rgb(112, 112, 112);
		padding: 2px;
		font-size: 13px;
		border-radius: 5px;
		position: absolute;
		right: 40px;
		top: 20px;
	}
	.article .authorInfo{
		height: 40px;
		padding-left: 5px;
		padding-top: 10px;
		position: relative;
	}
	.article .authorInfo img{
		height: 30px;
		width: 30px;
		border-radius: 50%;
		overflow: hidden;
		vertical-align:middle;
	}
	.article .authorInfo p{
		height: 30px;
		padding-left: 10px;
		vertical-align:middle;
		display: inline-block;
		
	}
	.article .authorInfo span{
		font-size: 13px;
		color: #cacaca;
		display: block;
	}
	.article .articleInfo{
		padding: 10px;
		max-height: 50px;
		overflow: hidden;
		font-size: 14px;
	}
	.article .articleBotm{
		width: 100%;
		color: rgb(181, 173, 173);
	}
	.article .articleBotm li{
		display: inline-block;
		height: 20px;
		width:33%;
		box-sizing: border-box;
		text-align: center;
	}
	.article .articleBotm:hover{
		cursor: pointer;
	}
	.article .articleBotm li:hover{
		color:pink;
	}
</style>