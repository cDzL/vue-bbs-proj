<template>
  <div class="subslist" ref="el">
	<div v-if="isfailed" style="color:red;text-align:center;">
      网络请求出现问题，请检查网络
    </div>
    <div v-show="loaded">
		<p v-if="users.length==0" style="text-align: center;">你还没有关注任何人</p>
		<Subser v-for="user of users" :key="user.userid" :user="user"></Subser>
		<div v-show="finished&&users.length>0" style="text-align: center;">已经到底了~</div>
    </div>
  </div>
</template>

<script>
import Subser from '../../components/Subser'
import axios from 'axios'
export default {
    name:'Subscribe',
    components:{Subser},
    data(){
      return{
        users:[],
        loaded:false,
		isfailed:false,
		index:0,
		finished:false
      }
    },
    mounted(){
		this.initPage()
		this.bindEventListener()
    },
	beforeDestroy(){
		this.$refs.el.removeEventListener("scroll",this.scrollHandler)
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
                this.index = Number(this.index+1);
				this.initPage()
            }
        },
      initPage(){      //初始化
        axios.get('/api/subslist',{params:{
          userid:this.$store.state.user.userid,index:this.index
        }}).then(
          res=>{
            if(res.data){
				if(res.data.length<=0){
					this.finished = true;
				}else{
					this.users = this.users.concat(res.data);
					this.finished = false;
				}
				this.loaded = true;
				this.isfailed = false
            }else{
				console.log('请求失败')
				this.isfailed = true
            }
          },err=>{
            console.log('网络错误',err.message)
			this.isfailed = true
          }
        )
      }
      
    }
}
</script>

<style>
  .subslist{
	overflow-y: auto;
    width: 365px;
    height: 660px;
    box-sizing: border-box;
    background: white;
    position: absolute;
    top: 40px;
    border-radius: 20px;
  }
  .subslist::-webkit-scrollbar{
    width: 0;
  }
  .subslist .authorInfo{
		height: 40px;
		padding-left: 5px;
		padding-top: 10px;
		position: relative;
	}
	.subslist .authorInfo img{
		height: 40px;
		width: 40px;
		border-radius: 50%;
		overflow: hidden;
		vertical-align:middle;
	}
	.subslist .authorInfo p{
		height: 30px;
		padding-left: 10px;
		vertical-align:middle;
		display: inline-block;
		
	}
	.subslist .authorInfo span{
		font-size: 13px;
		color: #cacaca;
		display: block;
	}
	.subslist .articleInfo{
		padding: 10px;
		max-height: 50px;
		overflow: hidden;
		font-size: 14px;
	}
  .subslist .btn_subscribe{
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
	.subslist .btn_subscribe_active{
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
</style>