<template>
	<div class="usercenter">
		<div class="usercenter_head">
			<div class="head_left">
				<img :src='user.att_img'/><br>
				<span>昵称：{{user.username}}</span><br>
				<span>uid：{{user.userid}}</span><br>
				<span>状态：<span :class="user.state ? 'warn':'normal'" v-text="user.state ? '禁止发帖':'正常'"></span></span><br>
				<span>身份：{{ !user.sort ? '无':"版主" }}</span>
			</div>
			<div class="head_right" v-if="loaded">
				<label>
					<span> {{user.fansnum}}粉丝 </span> |
					<span> {{user.subsnum}}关注 </span> 
				</label><br>
				<span>
					<span>签名：{{user.signalname}}</span>
				</span>
				<p v-if="(user.userid === this.$store.state.user.userid)">
					<button @click="toUserInfo(user.userid)">编辑资料</button>
				</p>
				<p v-if="(user.userid === this.$store.state.user.userid)">
					<button @click="toUserSet(user.userid)">隐私设置</button>
				</p>
				<p v-if="(user.userid === this.$store.state.user.userid)">
					<button v-if="user.sort<=0" @click="requestAut()">申请版主</button>
				</p>
				<p v-if="(user.userid != this.$store.state.user.userid)">
					<button @click="tosendMessage(user.userid,user.username)">发送私信</button>
				</p>
			</div>
		</div>
		<div class="usercenter_contentnav">
			<router-link class="contentnav" active-class="navactive" :to="{name:'userActive',params:{userid:user.userid}}">动态</router-link>
			<router-link class="contentnav" active-class="navactive" :to="{name:'userComt',params:{userid:user.userid}}">评论</router-link>
			<router-link class="contentnav" active-class="navactive" :to="{name:'userCollect',params:{userid:user.userid}}">收藏</router-link>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
import axios from 'axios'
	export default{
		name:'User',
		mounted(){
			this.initPage()
		},
		data(){
			return{
				user:{},
				loaded:false
			}
		},
		methods:{
			initPage(){
				this.user.userid = this.$route.params.userid
				if(this.user.userid>0)
				axios.get('/api/user',{params:{
					userid:this.user.userid
				}}).then(response =>{
					const {data} = response
					this.user = data
					this.$store.dispatch('changeSort',this.user.sort)
					this.loaded = true
				},()=>{
					
				})
				else this.$router.replace({
					path:'/lore'
				})
			},
			toUserInfo(userid){
				this.$router.push({
					name:'userInfo',
					params:{
						userid
					}
				})
			},
			requestAut(){
				axios.get('/api/requestaut',{params:{userid:this.user.userid,username:this.user.username}}).then(
					res=>{
						if(res.data){
							alert('请求成功，请等待管理员审核')
						}else{
							alert('申请失败')
						}
					},err=>{
						console.log('网络错误',err.message)
					}
				)
				
			},
			newUserCenter(){
				this.initPage()
			},
			tosendMessage(){
				this.$router.push({
					name:'concat',
					params:{
						username:this.user.username,
						userid:this.user.userid
					}
				})
			},
			toUserSet(userid){
				this.$router.push({
					name:'userSet',
					params:{
						userid
					}
				})
			}
		},
		computed:{
			routeId:function(){
				const {userid} = this.$route.params
				return userid
			}
		},
		watch:{
			//监视路由是否发生变化
			routeId:function(){
					this.newUserCenter()
				}
		}

	}
</script>

<style>
	.usercenter{
		width:365px;
		padding: 10px 0;
		margin: 10px auto;
		background: white;
		border-radius: 20px;
		padding-bottom: 20px;
		box-sizing: border-box;
		max-height: 680px;
		overflow: hidden;
	}
	.usercenter .usercenter_head{
		display: flex;
		border-bottom: 1px solid rgba(149, 147, 147,0.2);
		padding-bottom: 10px;
		padding-left: 20px;
	}
	.usercenter .usercenter_head .head_left{
		flex:4;
	}
	.usercenter .usercenter_head .head_right{
		flex:6;
		
	}
	.usercenter .usercenter_head img{
		height: 80px;
		width:80px;
		border-radius: 50%;
		overflow: hidden;
	}
	
	.usercenter .usercenter_head span{
		color:rgb(118, 117, 117);
		font-size: 14px;
		padding: 3px;
	}
	.usercenter .usercenter_head button{
		display: block;
		width: 90%;
		margin-top: 10px;
		color: rgb(224, 55, 129);
		border: 1px solid rgb(224, 55, 129);
		background: none;
		font-size: 16px;
	}
	.usercenter .usercenter_contentnav{
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid rgba(149, 147, 147,0.2);
	}
	.contentnav{
		color:rgb(30, 29, 29);
		padding:5px;
	}
	.navactive{
		color:rgb(224, 55, 129);
		border-bottom:2px solid rgb(224, 55, 129);
	}
</style>