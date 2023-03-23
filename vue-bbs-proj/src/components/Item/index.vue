<template>
	<li @touchstart='getStartPosition' @touchend='excuteEvent($event,p)' @click='toConcat(p.userid,p.username)'>
		<img :src="p.att_img"/>
		<p>{{p.username}}<br/><span class="last_msg">{{p.content}}</span></p>
		<span class="last_msg_time" >{{p.pmsgtime.slice(0,10)}}</span>
		<button class="btn_msg_remove" @click="removeItem(p.id)" v-if="p.ifshow">删除</button>
	</li>
</template>

<script>
	export default{
		name:'Item',
		props:['p','removeItem'],
		data(){
			return{
				startX:0
			}
		},
		methods:{
			//获取滑动的位置
			getStartPosition(e){
				if(e.touches.length == 1){
					this.startX = e.touches[0].clientX
				}
			},
			//滑动执行显示删除按钮
			excuteEvent(e,p){
				if(e.changedTouches.length == 1){
					let endX = e.changedTouches[0].clientX
					let diff = endX - this.startX
					if(Math.abs(diff)>40){
						if(diff<0){
							p.ifshow = true
						}
						else{
							p.ifshow = false
						}
							
					}
				}
			},
			toConcat(userid,username){
				this.$router.push({
					name:'concat',
					params:{
						userid,
						username
					}
				})
			}
		}
	}
</script>

<style>
	.message_person_info li{
		padding: 10px 5px 15px 5px;
		border-bottom: 1px solid #dddddd;
		border-collapse: collapse;
		position: relative;
		overflow: hidden;
	}
	.message_person_info li img{
		height: 30px;
		width: 30px;
		border-radius: 50%;
		overflow: hidden;
		vertical-align:middle;
	}
	.message_person_info li p{
		height: 30px;
		padding-top: 0;
		padding-left: 10px;
		vertical-align:middle;
		display: inline-block;
		
	}
	.message_person_info li span{
		font-size: 13px;
		color: #cacaca;
	}
	.message_person_info .last_msg{
		display: block;
		width: 100px;
		height: 20px;
		overflow: hidden;
	}
	.message_person_info .last_msg_time{
		float: right;
	}
	
	.btn_msg_remove{
		position: absolute;
		right: 0;
		animation: show .2s linear;
		background: red;
		border: none;
		color: white;
		padding: 5px;
	}
	@keyframes show {
		0%{
			transform: translateX(50%);
		}
		100%{
			transform: translateX(0);
		}
	}
</style>