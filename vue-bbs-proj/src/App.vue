<template>
  <div class="wrap">
    <Header :toAdmin ='toAdmin' :ifAdmin="ifAdmin" v-if="!isMobile" :showOut="showOut" :hideImgs="hideImgs"></Header>
    <div v-if="!ifAdmin">
      <pcNav></pcNav>
      <Notice :close='close' :notice="notice" v-if="show"></Notice>
    </div>
    <router-view v-if="ifAdmin"></router-view>
    <imgList v-show="showImgs" :hideImgs="hideImgs"></imgList>
  </div>
</template>
<script>
  import pcNav from './components/pcNav'
  import Header from './components/Header'
  import Notice from './components/Notice'
  import imgList from './components/ImgList'
import axios from 'axios'
  export default {
    name: 'App',
    components:{
    pcNav,
    Header,
    Notice,
    imgList
},
    data(){
      return{
        isMobile:false,
        ifAdmin:false,
        show:false,
        notice:{
          title:'',
          content:''
        },
        showImgs:false
        
      }
    },
    mounted(){
      this._isMobile()
      this.getNotice()
    },
    methods:{
      _isMobile(){
        let flag = navigator.userAgent.match(/(phone|iPhone|pod|iPod|ios|Android|Moblie|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        this.$store.dispatch('changeIsMobile',flag?true:false)
        this.isMobile = this.$store.state.isMobile
      },
      toAdmin(){
        this.ifAdmin = !this.ifAdmin
        if(this.ifAdmin){
          this.$router.replace({
            path:'/adminlogin'
          })
        }else{
          this.$router.replace({
            path:'/lore/login'
          })
        }
          
      },
      close(){
        this.show = false
      },
      showOut(){
        this.show = !this.show
      },
      getNotice(){
        axios.get('/api/noticedata').then(
          res=>{
            if(res.data){
              this.notice = res.data
            }
          },err=>{
            console.log(err.message)
          }
        )
      },
      hideImgs(){
        this.showImgs = !this.showImgs
      }
    }
}
</script>

<style>
  body{
    width:100%;
    margin: 0 auto;
    height: 100vh;
    background-image: url('~@/assets/imgs/GuildWars2.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .wrap{
    width:100%;
  }
  /* 将滚轮条清除掉 */
  *::-webkit-scrollbar{
    width: 0 !important;
  }
  *{
    list-style: none;
    text-decoration: none;
    margin: 0;
    padding: 0;
  }
  .link{
    flex: 1;
    text-align: center;
    color: black;
    padding: 10px;
    padding-bottom: 0;
  }
  .signal{
    min-height: 50px;
    background: white;
  }
  .warn{
    color:red !important;
    border: 1px solid red;
  }
  .normal{
    color:green !important;
    border: 1px solid green;
  }
</style>
