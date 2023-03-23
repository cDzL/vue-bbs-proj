<template>
  <div @click="toUser()" class="authorInfo">
        <img :src="user.att_img">
        <p>{{user.username}}<span>关注：{{user.fansnum > 10000 ? ((user.fansnum/10000).toFixed(1) + 'w') : user.fansnum}}</span></p>
        <button @click="subscribe()" :class="subscirbed?'btn_subscribe_active':'btn_subscribe'">+关注</button>
      </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'Subser',
    data(){
        return{
            subscirbed:true
        }
    },
    props:['user'],
    methods:{
        subscribe(){  //关注或者取消关注
			if(this.$store.state.user.userid!=this.user.userid){
				const auserid = this.user.userid//获取作者id
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
		},
        toUser(){     //
            this.$router.replace({
				name:'userMain',
                params:{
                    userid:this.user.userid
                }
			})
        }
    }
}
</script>

<style>

</style>