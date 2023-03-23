<template>
  <div class="toMe" ref="el">
    <h3 v-if="isfailed" class="isfailed">网络连接超时</h3>
    <div v-show="loaded&&!isfailed">
        <div v-if="persons.length" class="message_person_info">
          <MsgLi v-for="person of persons" :key="person.messageid" :person="person"></MsgLi>
        </div>
        <div v-else class="nomsg_view">
          这里空空如也哦，给小伙伴打声招呼吧
        </div>
        <div v-show="finished&&persons.length>0" style="text-align: center;">已经到底了~</div>
    </div>
    
  </div>
</template>

<script>
import MsgLi from '../../../components/MsgLi'
import axios from 'axios'
import PubSub from 'pubsub-js'
export default {
    name:'toMe',
    components:{MsgLi},
    mounted(){
      this.deltoMeId = PubSub.subscribe('deltoMe',(msgName,value)=>{
        this.persons = this.persons.filter(p=>{
          if(p.messageid!=value.messageid) return p
        })
      })
      this.initPage()
      this.bindEventListener()
    },
    beforeDestroy(){
        this.$refs.el.removeEventListener("scroll",this.scrollHandler);
    },
    data(){
      return{
        persons:[],
        isfailed:false,
        loaded:false,
        index:0,
        finished:false
      }
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
              this.index = Number(this.index+1)
              this.initPage()
          }
      },
      initPage(){
        axios.get('/api/message',{params:{
          userid:this.$store.state.user.userid,
          sort:1,
          index:this.index
        }}).then(
          res=>{
            if(res.data){
              if(res.data.length>0){
                    this.persons = this.persons.concat(res.data)
                    this.finished = false
                }else{
                    this.finished = true
                }
              this.loaded = true
            }else{
              console.log('获取数据失败')
            }
          },err=>{
            console.log('请求失败',err.message)
            this.isfailed = true
          }
        )
      }
    }
}
</script>

<style>
  .toMe{
    width: 365px;
    background: white;
    height: 600px;
    position: absolute;
    top: 40px;
    left: 0;
    border-top: 2px solid rgb(0, 106, 255);
    border-radius: 20px;
  }
  .toMe .message_person_info{
      overflow-y: scroll;
      height: 600px;
  }
  .toMe .message_person_info::-webkit-scrollbar{
    width: 0 !important;
  }
  .toMe .nomsg_view{
    height: 400px;
    width: 100%;
    text-align: center;
    line-height: 30rem;
  }
  .toMe .isfailed{
    width: 100%;
    height: 20px;
    color: red;
    text-align: center;
  }
</style>