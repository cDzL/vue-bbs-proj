<template>
  <div class="noticeList">
    <div class="h3">
        <span>所有公告信息</span><br>
        <input class="search" v-model="keywords" placeholder="输入id,公告标题" type="text"/><button @click="search()" class="keysearch">搜索</button>
    </div>
    <div class="listItem">
        <label>
            <span class="noticeid">ID</span>
            <span class="noticetitle">公告标题</span>
            <span class="noticecontent">公告内容</span>
            <span class="noticetime">公告时间</span>
            <span class="options">操作</span>
        </label>
        <p v-if="list.length<=0">空空如也,没有任何记录</p>
        <ul class="items" v-if="list.length>0">
            <li v-for="item of list" :key="item.noticeid">
                <span class="noticeid">{{item.noticeid}}</span>
                <span class="noticetitle">{{item.title}}</span>
                <span class="noticecontent">{{item.content}}</span>
                <span class="noticetime">{{item.noticetime}}</span>
                <span  class="options">
                    <span @click="deletenotice(item.noticeid)">删除</span>
                    <span @click="showNotice(item)">预览</span>
                </span>
            </li>
        </ul>
        <li class="bottombtns"><button @click="back()">上一页</button>{{ index+1 + '/' + total }}页<button @click="next()">下一页</button></li>
    </div>
    <Notice v-if="show" :notice= "notice" :close= "close"></Notice>
  </div>
</template>

<script>
import Notice from '../../../components/Notice'
import axios from 'axios'
export default {
    name:'NoticeList',
    components:{Notice},
    mounted(){
        axios.get('/api/getallnotice').then(
            res=>{
                if(res){
                    const {data} = res
                    if(data.total%10>0){
                        this.total = parseInt(data.total/10)+1
                    }else{
                        this.total = data.total/10
                    }
                }else{
                    console.log('失败')
                }
            },err=>{
                console.log(err.message)
            }
        )
        this.getNotices()
    },
    data(){
        return{
            list:[],
            notice:{},
            show:false,
            index:0,
            total:0,
            keywords:''
        }
    },
    methods:{
        showNotice(item){
            this.notice = item
            this.show = true
        },
        close(){
            this.show = false
        },
        back(){
            if(this.index+1 >1){
                this.index = this.index-1
                this.getNotices()
            }
        },
        next(){
            if(this.index+1 <this.total){
                this.index = this.index+1
                this.getNotices()
            }
        },
        getNotices(){    //获取信息
            axios.get('/api/getnotices',{params:{
                index:this.index}
            }).then(
                res=>{
                    if(res){
                        const {data} = res
                        this.list = data//this.list.concat(data)
                    }else{
                        console.log('失败')
                    }
                },err=>{
                    console.log(err.message)
                }
        )
        },
        deletenotice(noticeid){     //删除公告记录
            axios.get('/api/deletenotice',{params:{
                noticeid
            }}).then(
                res=>{
                    if(res){
                        alert('删除成功')
                        this.list = this.list.filter(item=>{
                            if(item.noticeid!=noticeid){
                                return item
                            } 
                        })
                        console.log(this.list)
                    }else{
                        alert('删除失败')
                    }
                },err=>{
                    alert('网络故障',err.message)
                }
            )
        },
        search(){       //搜索帖子
            if(this.keywords==''){
                this.list = []
                this.getNotices()
            }else{
                axios.get('/api/searchNotice',{params:{keywords:this.keywords}}).then(
                    res=>{
                        if(res.data)
                        {
                            this.list = res.data
                        }else{
                            this.list = []
                        }
                            
                    },err=>{
                        console.log('网络错误',err)
                    }
                )
            }
            
          }
    }
}
</script>

<style>
    .noticeList{
        width: 100%;
        position: relative;
        min-height: 90vh;
        border-bottom-right-radius: 20px;
    }
    .noticeList label{
        width: 100%;
    }
    .noticeList p{
        padding: 20px;
        text-align: center;
        font-weight: 1000;
    }
    .noticeList .items{
        max-height: 60vh;
        overflow: auto;
    }
    .noticeList .items span{
        border: none;
        cursor: pointer;
    }
    .noticeList .items li{
        border-bottom: 1px solid gray;
        height: 50px;
        line-height: 40px;
    }
    .noticeList span{
        display: inline-block;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid rgb(0, 0, 0);
        border-left: 1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        overflow: hidden;
    }
    .noticeList .h3{
        padding: 20px;
        background: rgb(14, 85, 72);
        color: white;
        height: 110px;
        box-sizing: border-box;
        border-top-right-radius: 20px;
    }
    .noticeList .h3 .search{
        height: 30px;
        width: 160px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
    }
    .noticeList .h3 .keysearch{
        border: 2px solid white;
        margin-left: 10px;
        background: none;
        border-radius: 10px;
        padding: 5px;
        height: 30px;
        box-sizing: border-box;
        color: white;
        opacity: 0.9;
    }
    .noticeList .h3 .keysearch:hover{
        opacity: 1;
        scale: 1.1;
    }
    .noticeList .h3 span{
        border: none;
        font-weight: 1000;
        font-size: 20px;
    }
    .noticeList .noticeid{
        width: 10%;
    }
    .noticeList .noticetitle{
        width: 20%;
    }
    .noticeList .noticecontent{
        width: 35%;
    }
    .noticeList .noticetime{
        width: 20%;
    }
    .noticeList .options{
        width: 15%;
    }
    .noticeList .options span{
        padding: 10px;
    }
    .noticeList .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    .noticeList .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    }
    .noticeList .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 45%;
    }
</style>