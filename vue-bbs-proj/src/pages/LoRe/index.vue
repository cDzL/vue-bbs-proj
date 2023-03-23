<template>
    <div :class="isMobile ?'pcLoRe  mLoRe':'pcLoRe'">
        <div class="lr_nav">
            <li>
                <router-link replace class="link" active-class="active" to="/lore/login">Sign in</router-link>
            </li>
            <li>
                <router-link replace class="link" active-class="active" to="/lore/register">Register</router-link>
            </li>
        </div>
         <router-view></router-view>

    </div>
</template>

<script>

export default {
    name:'LoginRegister',
    mounted(){
        if(this.$store.state.user.userid!=''&&this.$store.state.user.userid!=null){
            this.$router.replace({
                name:'userMain',
                params:{
                    userid:this.$store.state.user.userid
                }
            })
        }
    },
    data(){
        return{
            isMobile:this.$store.state.isMobile
        }
    }
}
</script>

<style>
    .pcLoRe{
        width: 50%;
        margin: 10% auto;
        box-sizing: border-box;
    }
    .pcLoRe .lr_nav{
        display: flex;
        justify-content: space-around;
    }
    .mLoRe{
        width: 100%;
        margin: 20% auto;
    }
    
</style>