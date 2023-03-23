<template>
  <div class="userComt" ref="el">
    <div v-if="!personal">
      <div v-show="loaded">
        <div v-if="this.comments.length<=0">空空如也</div>
        <ComLi v-for='comment in comments' :key="comment.cid" :comment='comment'></ComLi>
      </div>
    </div>
    <div v-else style="text-align: center;">
        该用户设置不可见
    </div>
  </div>
</template>

<script>
import ComLi from '../../components/Comli'
import PubSub from 'pubsub-js'
import axios from 'axios'
export default {
    name:'UserComt',
    components:{ComLi},
    data(){
      return{
        loaded:false,
        comments:[],
        user:{
          userid:''
        },
        index:0,
        finish:false,
        personal:false
      }
    },
    mounted(){
      const id = this.$route.params.userid
      if(id == this.$store.state.user.userid){
          this.initPage()
          this.bindEventListener()
      }else{
          axios.get('/api/getcommentpersonal',{params:{userid:id}}).then(
              res=>{
                  if(res.data){
                      const {data:{commentpersonal}} = res
                      if(commentpersonal){
                          this.personal = res.data.commentpersonal
                      }else{
                          this.initPage()
                          this.bindEventListener()
                      }     
                  }
              },err=>{
                  console.log(err.message)
              }
          )
      }
      this.delComtId = PubSub.subscribe('delcomt',(msgName,value)=>{
        this.comments = this.comments.filter(c=>{
                if(c.commutid!=value.cid) return c
            })
      })
    },
    methods:{
      initPage(){
        axios.get('/api/mycomments',{params:{
          userid:this.$route.params.userid,
          index:this.index
        }}).then(res=>{
          if(res.data){
            if(res.data.length>0){
              this.comments = this.comments.concat(res.data)
              this.finish = false
            }else{
              this.finish = true
            }
            this.loaded = true
          }else{
            console.log('请求失败')
          }
        },err=>{
          console.log(err.message)
        })
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
    },
    beforeDestroy(){
      PubSub.unsubscribe(this.delComtId);
      this.$refs.el.removeEventListener("scroll",this.scrollHandler);
    }
}
</script>

<style>
    .userComt{
      text-align: center;
      background: white;
      border-radius: 20px;
      height: 420px;
      overflow: auto;
    }
</style>