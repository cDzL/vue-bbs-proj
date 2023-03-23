<template>
  <transition name="juBaoMv">
      <div class="jubao" v-if="showJubao">
        <div>
          <h3>举报原因</h3>
          <textarea v-model="reason"></textarea><br>
          <button @click="submit()">提交</button>
          <button @click="chanel()">取消</button>
        </div>
      </div>
    </transition> 
</template>

<script>
import PubSub from 'pubsub-js';
import axios from 'axios';
export default {
    name:'JuBao',
    mounted(){
        this.jubaoId = PubSub.subscribe('jubao',(msgName,aid)=>{
            this.showJubao = true
            this.aid = aid
      })
    },
    beforeDestroy(){
      PubSub.unsubscribe(this.jubaoId)
    },
    data(){
        return{
            showJubao:false,
            reason:'就是想举报',
            aid:null
        }
    },
    methods:{
        submit(){
            if(this.$store.state.user.userid>0)
            {
                const userid = this.$store.state.user.userid
                const username = this.$store.state.user.username
                axios.get('/api/reportarticle',{params:{userid:userid,username:username,aid:this.aid,reason:this.reason}}).then(
                    res=>{
                        if(res.data){
                            this.showJubao = false
                        }
                    },err=>{
                        console.log(err.message)
                    }
                )
            }else{
                alert('请先登录')
            }
        },
        chanel(){
            this.showJubao = false
      }
    }
    
}
</script>

<style>
.jubao{
        height: 40%;
        width: 365px;
        background: rgba(144, 144, 144, 0.629);
        position: absolute;
        left: 0;
        top:20%;
        z-index: 3;
        transition: all .3s linear;
        border-radius: 20px;
    }
    .jubao div{
        margin: 100px 80px;
        text-align: center;
    }
    .jubao textarea{
        resize: none;
        width: 200px;
        height: 80px;
        padding: 10px;
        border-radius: 10px;
    }
    
    .juBaoMv-enter{
    transform: translateY(-100%);
    }
    .juBaoMv-enter-to{
        transform: translateY(0);
    }
    .juBaoMv-leave{
        transform: translateY(0);
    }
    .juBaoMv-leave-to{
        transform: translateY(-100%);
    }
</style>