<template>
  <div>
    <div class="authorNav">
      <router-link v-for="plate in plates" :key="plate.plateid" class="link" active-class="active" 
      :to="{name:'content',params:{sort: plate.platename}}">{{plate.platename}}</router-link>
    </div>
    <div class="signal"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'


export default {
    name:'Author',
    mounted(){
      axios.get('/api/plates').then(
        res=>{
          if(res.data){
            this.plates = res.data
          }else{
            this.plates = []
          }
        },err=>{
          console.log('网络错误',err.message)
        }
      )
    },
    data(){
      return{
        plates:null
      }
    }
}
</script>

<style>
  .authorNav{
      width: 365px;
      height: 40px;
      padding: 5px;
      box-sizing: border-box;
      overflow: auto;
      position: fixed;
      top: 40px;
      background: white;
      z-index: 5;
      border-bottom: 1px solid rgba(145, 144, 144, 0.412);
  }
  .authorNav::-webkit-scrollbar{
    width: 0 !important;
  }
  .authorNav .link{
    font-size: 14px;
  }
  .authorNav .active{
    border-bottom: 2px solid pink;
  }
</style>