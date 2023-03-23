<template>
	<div class="concat">
		<div class="message_person_head">{{user.username}}</div>
		<div class="content" ref="el">
			<li v-for="pmsg in list" :key="pmsg.personalmsgid">
				<span :class="pmsg.fromuserid==user.userid? 'talker':'me'">{{ pmsg.content }}</span>
			</li>
		</div>
		<div class="msg"><textarea v-model="msg" class="input" :maxlength="40"></textarea><button class="send" @click="sendPersonalMsg()">发送<span>{{msg.length}}/40</span></button>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
export default{
	name:'Concat',
	mounted() {
		const {username,userid} = this.$route.params
		this.user.username = username
		this.user.userid = userid
		this.initPage()
		this.bindEventListener()
	},
	data(){
		return{
			msg:'',
			user:{
				username:'默认',
				userid:0
			},
			list:[],
			index:0,
			finished:false
		}
	},
	beforeDestroy(){
        this.$refs.el.removeEventListener("scroll",this.scrollHandler);
    },
	methods:{
		initPage(){
			if(this.$store.state.user.userid!='' && this.$store.state.user.userid!=null){
				let userid = this.$store.state.user.userid
				let talkerid = this.user.userid
				axios.get('/api/getpersonalmsgslist',{params:{
					userid,
					talkerid,
					index:this.index
				}}).then(
					res=>{
						if(res.data){
							if(res.data.length>0){
								this.list = this.list.concat(res.data)
							}else{
								this.finished = true
							}
						}
					},err=>{
						console.log(err.message)
					}
				)
			}
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
		sendPersonalMsg(){     //发送信息
			if(this.$store.state.user.userid!=''&&this.$store.state.user.userid!=null){
				if(this.msg.length>0){
					axios.get('/api/sendpmsg',{params:{
						msg:this.msg,
						fromuserid:this.$store.state.user.userid,
						touserid:this.user.userid
					}}).then(
						res=>{
							if(res.data){
								let id = parseInt(Math.random()*100000).toString()
								this.list = this.list.concat({personalmsgid:id,content:this.msg,fromuserid:this.$store.state.user.userid})
								this.msg = ''
							}
						},err=>{
							console.log('网络错误',err.message)
						}
					)
				}else{
					alert('输入不能为空')
				}
				
			}
		}
}
	}
		
</script>

<style >
	.concat{
		height: 640px;
		background: #ffffff88;
		width: 365px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
		margin: 0 auto;
	}
	.concat .message_person_head{
		background: white;
		text-align: center;
		color: #dd2d53;
		flex: 0.5;
		font-size: 16px;
		padding:5px;
		border-bottom: 1px solid gray;
	}
	.concat .content{
		overflow-y: scroll;
		width: 100%;
		height: 100%;
	}
	.concat .content li{
		font-size: 14px;
		letter-spacing: 2px;
		padding: 10px;
		min-height: 40px;
	}
	.concat .content span{
		background: rgb(255, 255, 255);
		padding: 3px;
		border-radius: 5px;
		position: relative;
	}
	.concat .content .me{
		display: block;
		float: right;
		background: #ef4c6f;
		color: #fff;
	}
	.concat .content .talker:before{
		content: '';
		width: 0px;
		height: 0px;
		border-top: 7px solid transparent;
		border-right: 10px solid #fff;
		border-bottom: 7px solid transparent;
		position: absolute;
		top: 30%;
		left: -6px;
	}
	.concat .content .me:after{
		content: '';
		width: 0px;
		height: 0px;
		border-top: 7px solid transparent;
		border-left: 10px solid #ef4c6f;
		border-bottom: 7px solid transparent;
		position: absolute;
		top: 30%;
		right: -6px;
	}
	.concat .content::-webkit-scrollbar{
		width: 0;
	}
	.concat .msg{
		width: 365px;
		flex: 1;
		position: fixed;
		top: 640px;
		display: flex;
	}
	.concat .input{
		flex: 8;
		border:1px solid #c2c2c2;
		height: 40px;
		padding: 5px;
		box-sizing: border-box;
		resize: none;
	}
	.concat .send{
		flex:2;
		height: 40px;
	}
	.concat .send span{
		font-size: 12px;
	}
</style>