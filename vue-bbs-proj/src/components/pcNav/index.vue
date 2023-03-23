<template>
  <div class="pcPage">
      <div class="pcFootNav">
        <div class="signal"></div>
        <ul class="listNav">
          <li>
            <router-link replace class="pcLink" active-class="active pcActive" to="/lore">我的</router-link>
          </li>
          <li>
            <router-link replace class="pcLink" active-class="active pcActive" to='/index'>首页</router-link>
          </li>
          <li>
            <router-link replace class="pcLink" active-class="active pcActive" to='/message'>消息</router-link>
          </li>
          <li>
            <router-link replace class="pcLink" active-class="active pcActive" to='/addArticle'>发帖</router-link>
          </li>
        </ul>
      </div>
      <div class="pcOnwer"> 
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
//:to="this.$store.state.userid===''?'/lore/login':{name:'userMain',params:{userid:this.$store.state.user.userid}}"
export default {
    name:'pcNav'
}
</script>

<style>
    .pcOnwer::-webkit-scrollbar{
        width: 0 !important;
    }
    .pcPage{
        width: 100%;
        padding: 0;
        margin: 0;
        display: flex;
    }
    .pcPage .listNav{
      padding-top: 40px;
    }
    .pcFootNav{
        width: 20%;
        height: 100vh;
    }
    .pcFootNav .signal{
      background: none;
    }
    .pcFootNav .listNav{
        margin: 0 auto;
        width: 250px;
        
    }
    .pcOnwer{
        width: 80%;
        height: 100vh;
        overflow-y: auto;
    }
    .pcLink{
        text-align: center;
        color: black;
        width: 100%;
        display: block;
        padding: 10px;
    }
    .pcLink:hover{
        color:rgb(43, 161, 252);
        border-radius: 5px;
    }
    .pcActive{
        background: orange;
        border-radius: 5px;
    }
</style>