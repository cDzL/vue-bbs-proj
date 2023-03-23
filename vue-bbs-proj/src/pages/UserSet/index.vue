<template>
  <div class="userset">
    <div class="lineOpt" @click="changePersonSet(0)">
      <span>隐藏我的动态</span><a :class="personal1 ? 'wallon':''"><b :class="personal1? 'on':'off'"></b></a>
    </div>
    <div class="lineOpt" @click="changePersonSet(1)">
      <span>隐藏我的评论</span><a :class="personal2 ? 'wallon':''"><b :class="personal2? 'on':'off'"></b></a>
    </div>
    <div class="lineOpt" @click="changePersonSet(2)">
      <span>隐藏我的收藏</span><a :class="personal3 ? 'wallon':''"><b :class="personal3? 'on':'off'"></b></a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'UserSet',
    data(){
      return{
        personal1:false,
        personal2:false,
        personal3:false
      }
    },
    mounted(){
      const id = this.$route.params.userid
      if(this.$store.state.user.userid!=''&&this.$store.state.user.userid!=null&&this.$store.state.user.userid == id){
        axios.get("/ace/getsetting",{params:{
          userid:id
        }}).then(
          res=>{
            if(res.data){
              const {data} = res
              this.personal1 = data.activepersonal
              this.personal2 = data.commentpersonal
              this.personal3 = data.collectpersonal
            }
          },err=>{
            console.log(err.message)
          }
        )
      }
    },
    beforeDestroy(){
      if(this.$store.state.user.userid!=''&&this.$store.state.user.userid!=null){
        axios.get('/api/upadatesetting',{params:{
          userid:this.$store.state.user.userid,
          personal1:Number(this.personal1),
          personal2:Number(this.personal2),
          personal3:Number(this.personal3)
        }}).then(
          ()=>{
            
          },err=>{
            console.log(err.message)
          }
        )
      }
    },
    methods:{
      changePersonSet(i){
        if(i==0){
          this.personal1 = !this.personal1
        }else if(i==1){
          this.personal2 = !this.personal2
        }else if(i==2){
          this.personal3 = !this.personal3
        }
      }
    }
}
</script>

<style>
  .userset{
    height: 650px;
    width: 365px;
    background: #fff;
    margin: 0 auto;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .userset .lineOpt{
    height: 30px;
    width: 100%;
    padding: 5px;
    letter-spacing: 2px;
  }
  .userset .lineOpt span{
    display: block;
    float: left;
  }
  .userset .lineOpt a{
    width: 35px;
    height: 15px;
    border-radius: 10px;
    background: rgba(116, 116, 116, 0.277);
    display: block;
    float: right;
  }
  .userset .lineOpt .wallon{
    background: rgba(255, 92, 179, 0.356);
  }
  .userset .lineOpt a b{
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: block;
    position: relative;
    transition: all 0.2s linear;
  }
  
  .userset .lineOpt .off{
    background: rgb(73, 73, 73);
    
  }
  .userset .lineOpt .on{
    background: rgba(255, 92, 179, 0.996);
    transform: translateX(130%);
  }
</style>