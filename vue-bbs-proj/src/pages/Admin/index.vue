<template>
  <div v-if="flag" class="adminPage">
    <div class="adminwrap">
      <ul class="adminNav">
        <li><a class="pcLink" @click="changeShow1()">管理</a></li>
        <transition name="managelist">
          <ul class="secnav" v-show="show1">
            <router-link  class="pcLink" active-class="active" replace v-for="nav in navs" :key="nav.id" :to = nav.path>{{ nav.name }}</router-link>
          </ul>
        </transition>
        <li><a @click="changeShow2()" class="pcLink">公告</a></li>
        <transition name="managelist">
          <ul class="secnav" v-show="show2">
            <router-link class="pcLink" active-class="active" replace v-for="n in notices" :key="n.id" :to = n.path>{{ n.name }}</router-link>
          </ul>
        </transition>
        <li><a class="pcLink" @click="changeShow3()">消息</a></li>
        <transition name="managelist">
          <ul class="secnav" v-show="show3">
            <router-link class="pcLink" active-class="active" replace v-for="n in messages" :key="n.id" :to = n.path>{{ n.name }}</router-link>
          </ul>
        </transition>
        <li><router-link class="pcLink" active-class="active" to="/admin/plates">板块</router-link></li>
        <li><router-link class="pcLink" active-class="active" to="/admin/bgimg">图片</router-link></li>
      </ul>
      <div class="viewcontainer">
        <router-view></router-view>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name:'Admin',
  beforeMount(){      //防止强制访问
    let admin  = this.$store.state.admin
    axios.get('/api/adminlogin',{params:{
                admin
      }}).then(
          res =>{
              if(res.data){
                this.flag = true
              }else{
                this.$router.replace({
                  path:'/adminlogin'
                })
              }
          },err =>{
              console.log('网路错误',err.message);
              this.$router.replace({
                path:'/adminlogin'
              })
          }
    )
  },
  data(){
      return{
          navs:[
              {name:'会员管理',id:0,path:'/admin/users'},
              {name:'帖子管理',id:1,path:'/admin/articles'},
              {name:'评论管理',id:2,path:'/admin/comments'}
          ],
          notices:[
              {name:'公告列表',id:3,path:'/admin/noticelist'},
              {name:'公告发布',id:4,path:'/admin/notice'}
          ],
          messages:[
              {name:'举报消息',id:5,path:'/admin/report'},
              {name:'申请消息',id:6,path:'/admin/request'}
          ],
          show1:false,
          show2:false,
          show3:false,
          flag:false
      }
  },
  methods:{
      changeShow1(){
        this.show1 = !this.show1
      },
      changeShow2(){
        this.show2 = !this.show2
      },
      changeShow3(){
        this.show3 = !this.show3
      }
  }
}
</script>

<style>
  .adminPage{
    width: 90%;
    background: rgba(252, 252, 252, 0.708);
    margin: 10px auto;
    box-sizing: border-box;
    border-radius: 20px;
    backdrop-filter: 2rem;
    border:1px solid rgb(85, 85, 85);
    padding: 0;
    display: flex;
  }
  .adminwrap{
    width: 100%;
    min-height: 90vh;
    margin: 0 auto;
  }
  /* rgb(35, 66, 112) */
  .adminPage .adminNav{
    width: 160px;
    min-height: 95vh;
    padding-left: 20px; 
    display: block;
    float: left;
    background: rgb(21, 54, 103);
    box-sizing: border-box;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    
  }
  .adminPage .adminNav li{
    box-sizing: border-box;
    height: 50px;
    font-size: 18px;
    cursor: pointer;
  }
  .adminPage .adminNav li a{
    font-size: 18px;
    padding: 10px;
  }
  .adminPage .adminNav a{
    font-size: 14px;
    color: rgb(255, 255, 255);
    
    overflow: hidden;
    text-align: inherit;
    width: 80%;
    transition: all .2s linear;
  }
  .adminPage .adminNav a:hover{
    color: rgb(253, 216, 171);
    border-bottom: 1px solid rgba(255, 255, 255, 0.775);
  }
  .secnav{
    transition: all .5s;
  }
  .managelist-enter{
    transform: translateX(-100%);
    opacity: 0;
    height: 0;
  }
  .managelist-enter-to{
    transform: translateX(0);
    opacity: 1;
    height: 120px;
    
  }
  .managelist-leave{
    transform: translateX(0);
    opacity: 1;
    height: 120px;
  }
  .managelist-leave-to{
    transform: translateX(-50%);
    opacity: 0;
    height: 0;
  }
  .viewcontainer{
    display: block;
    float: left;
    width:calc(100% - 160px);
    height: 630px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
</style>