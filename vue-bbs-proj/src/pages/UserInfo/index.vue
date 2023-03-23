<template>
	<div class="userinfo">
		<div v-if="isfailed" class="isfailed">网络连接超时</div>
		<div id="userImg">
			<img :src="user.att_img"/>
			<input type="button" @click="changeImg()" value="更换图片"/>
			<input id="changeImg" type="file" style="display:none"/>
		</div>
		<div class="optons">
			<p><span>昵  称：</span><input id="username" type="span" v-model="user.username" maxlength="9" placeholder="不能为空/最大9" :disabled="!editable"/></p>
			<p><span>个性签名：</span><input id="signalname" type="span" v-model="user.signalname" placeholder="这个人很冷漠,没有签名" :disabled="!editable"/></p>
			<p><span router-link>性  别：</span>
			<label>
				<input value="1" name="sex" type="radio" :checked="user.sex ? true : false" @change="changesex()" :disabled="!editable"/>男
			</label>
			<label>
				<input value="0" name="sex" type="radio" :checked="!(user.sex)? true : false" @change="changesex()" :disabled="!editable"/>女
			</label>
			</p>
			<p><span>年  龄：</span><input id="userage" v-model="user.age" type="number" maxlength="2" placeholder="18" :disabled="!editable"/></p>
			<p><span>电  话：</span><input id="usertel" v-model="user.telphone" maxlength="11" type="number" placeholder="最大长度为11" :disabled="!editable"/></p>
			<p><span>地  址：</span><input id="useradr" v-model="user.address" type="text" placeholder="地球" :disabled="!editable"/></p>
			<p><span>邮  箱：</span><input type="email" v-model="user.email" placeholder="邮箱地址" :disabled="!editable"/></p>
			<div class="option_btns" v-if="(this.user.userid === this.$store.state.user.userid)">
				<span class="option_btn edit" @click='edit()'>编辑 </span><span class="option_btn save" @click="save()"> 保存</span><br/>
			</div>
		</div>
		<div class="signal"></div>
	</div>
</template>

<script>
import axios from 'axios'
	export default{
		name:'UserInfo',
		mounted() {
			this.user.userid = this.$route.params.userid
			axios.get('/api/user',{params:{
				userid:this.user.userid
			}}).then( response =>{
				this.isfailed = false
				const {data} = response
				const {userid,att_img,username,signalname,age,sex,telphone,address,email} = data
				this.user = {userid,att_img,username,signalname,age,sex,telphone,address,email}
			},()=>{
				this.isfailed =true
			})
		},
		data(){
			return{
				user:{
					userid:'',
					att_img:'',
					username:'',
					signalname:'默认签名',
					age:18,
					sex:1,
					telphone:'114514',
					address:'地球',
					email:''
				},
				isfailed:false,
				editable:false
			}
		},
		methods:{
			changesex(){
				this.user.usersex = 0+!this.user.usersex
			},
			edit(){
				this.editable = true
			},
			save(){
				if(this.user.userid === this.$store.state.user.userid){
					this.editable = false
					axios.get('/api/changeInfo',{params:{
						user:this.user
					}}).then(res=>{
						if(res.data){ 
							alert('修改成功')
							this.$store.dispatch('changeName',this.user.username)
						}
						else alert('修改失败')
					},err=>{
						alert('修改失败',err.message)
					})
				}else{
					alert('数据异常')
				}
				
			},
			changeImg(){
				let _this = this
				document.getElementById('changeImg').onchange = function(){
					let reader = new FileReader()
					reader.readAsDataURL(this.files[0])
					reader.onload = function(){
						_this.user.att_img = reader.result
					}
					const file = this.files[0]
					let obj = new FormData()
					obj.append('file',file)
					axios.post('/api/uploadImg',obj,{
						headers:{
							//上传的不是普通数据是文件类型的数据需要用到
							'Content-Type':'multipart/form-data'
						}
					}).then(res=>{
						_this.user.att_img = res.data.str
					},err=>{console.log(err)})
				}
				document.getElementById('changeImg').click()
				
				
			}
		}
	}
</script>

<style>
	.isfailed{
		width: 100%;
		height: 20px;
		color: red;
		text-align: center;
	}
	.userinfo{
		width: 365px;
		box-sizing: border-box;
		margin: 10px auto;
		padding: 10px;
		background:white;
		border-radius: 20px;
		height: 650px;
		overflow: auto;
	}
	.userinfo input{
		border-radius: 10px;
	}
	#userImg{
		width: 90px;
		height: 140px;
	}
	#userImg img{
		border-radius: 50%;
		overflow: hidden;
	}
	.userinfo .option_btns{
		cursor: pointer;
	}
	.userinfo input{
		color: #000000;
		border:1px solid #8d8d8d;
		padding: 5px;
		
	}
	.userinfo p span{
		display: block;
		padding-bottom: 5px;
	}
	.userinfo p input{
		display: inline-block;
	}
	.userinfo .option_btn{
		display: inline-block;
		color: #7411ff;
		width: 45%;
		text-align: center;
		border:1px solid #7411ff;
		padding: 5px;
	}
	.userinfo .option_btn:active{
		border: 1px solid #ffaa00;
		color:#ffaa00
	}
	.userinfo img{
		width: 90px;
		height: 90px;
		border: 1px solid #8d8d8d;
	}
	.userinfo p{
		padding: 10px;
		text-align: none;
	}
</style>