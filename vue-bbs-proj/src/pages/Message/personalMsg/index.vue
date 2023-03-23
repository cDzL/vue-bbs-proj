<template>
    <div class="personalMsg" ref="el">
        <h3 v-if="isfailed" class="isfailed">网络连接超时</h3>
        <div v-if="list.length>0" class="message_person_info">
            <Item v-for="p in list" :key="p.userid" :p="p"></Item>
        </div>
        <div v-else class="nomsg_view">
            没有私信
        </div>
        <div v-show="finished&&list.length>0" style="text-align: center;">已经到底了~</div>
    </div>
</template>

<script>
import Item from '../../../components/Item'
import axios from 'axios'
export default {
    name:'PersonalMsg',
    components:{
        Item
    },
    data(){
        return{
            list:[],
            index:0,
            finished:false,
            isfailed:false
        }
    },
    mounted(){
        this.initPage()
        this.bindEventListener()
    },
    beforeDestroy(){
        this.$refs.el.removeEventListener("scroll",this.scrollHandler);
    },
    methods:{
        initPage(){
            axios.get('/api/personalmsg',{params:{
                userid:this.$store.state.user.userid,
                index:this.index
            }}).then(
                res=>{
                    if(res.data.length>0){
                        this.list = this.list.concat(res.data)
                    }else{
                        this.finished = true
                    }
                },err=>{
                    this.isfailed = true
                    console.log(err.message)
                }
            )
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
        }
    }
}
</script>

<style>
.personalMsg{
    width: 365px;
    background: white;
    height: 600px;
    position: absolute;
    top: 40px;
    left: 0;
    border-top: 2px solid rgb(0, 106, 255);
    border-radius: 20px;
}
.personalMsg .message_person_info{
    overflow-y: scroll;
    height: 600px;
}
.personalMsg .message_person_info::-webkit-scrollbar{
    width: 0 !important;
}
.personalMsg .nomsg_view{
    height: 400px;
    width: 100%;
    text-align: center;
    line-height: 30rem;
}
.personalMsg .isfailed{
    width: 100%;
    height: 20px;
    color: red;
    text-align: center;
}
</style>