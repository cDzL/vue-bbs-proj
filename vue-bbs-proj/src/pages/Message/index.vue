<template>
	<div class="message">
		<div class="msgNav">
			<router-link class="link Box" active-class="active" to="/message/comment"><b @click="hidespot(0)">评论</b><span v-show="show[0]"></span></router-link>
			<router-link class="link Box" active-class="active" to="/message/supportme"><b @click="hidespot(1)">赞我</b><span v-show="show[1]"></span></router-link>
			<router-link class="link Box" active-class="active" to="/message/personalmsg"><b @click="hidespot(2)">私信</b><span  v-show="show[2]"></span></router-link>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
import axios from 'axios'
export default {
	name:'Message',
	mounted(){
		if(this.$store.state.user.userid!=''&&this.$store.state.user.userid!=null)
		axios.get('/api/aboutspots',{params:{
			userid:this.$store.state.user.userid
		}}).then(
			res=>{
				if(res.data){
					this.show = res.data
				}else{
					console.log('请求失败')
				}
			},err=>{
				console.log(err.message)
			}
		)
	},
	data(){
		return{
			show:[false,false,false]
		}
	},
	methods:{
		hidespot(i){
			if(this.$store.state.user.userid!=''&&this.$store.state.user.userid!=null){
				if(this.show[i]){
					axios.get('/api/hidespots',{params:{
						userid:this.$store.state.user.userid,
						i
					}}).then(
						res=>{
							if(res.data){
								this.show[i] = false
							}
						},err=>{
							console.log(err.message)
						}
					)
				}
			}
		}
	}
}
</script>

<style>
	.message{
		width:365px;
		height: 620px;
		margin: 10px auto;
		background: white;
		border-radius: 20px;
		position: relative;
	}
	.message .msgNav{
		position: absolute;
		top: 0;
		left: 0;
		width: 365px;
		height: 40px;
		background: white;
		display: flex;
		border-radius: 20px;
	}
	.message .temp{
		height: 400px;
	}
	.message .msgNav .Box{
		position: relative;
	}
	.message .msgNav span{
		display: block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: red;
		position: absolute;
		right: 30%;
		top: 30%;
		

	}
	
	
</style>