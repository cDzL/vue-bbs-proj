<template>
  <div class="plateList">
    <div class="h3">
        <span>所有板块信息</span><br>
        <input class="search" v-model="keywords" placeholder="输入id,板块名称" type="text"/>
        <button @click="search()" class="platebtn">搜索</button>
        <button @click="addPlate()" class="platebtn">添加</button>
    </div>
    <div class="plistItem">
        <label>
            <span class="plateid">ID</span>
            <span class="platename">板块名称</span>
            <span class="options">操作</span>
        </label>
        <p v-if="list.length<=0">空空如也,没有任何记录</p>
        <ul class="items" v-if="list.length>0">
            <li v-for="item of list" :key="item.plateid">
                <span class="plateid">{{item.plateid}}</span>
                <span class="platename">{{item.platename}}</span>
                <span  class="options">
                    <span @click="deletenotice(item.plateid)">删除</span>
                    <span @click="showPlate(item)">修改</span>
                </span>
            </li>
        </ul>
        <li class="bottombtns"><button @click="back()">上一页</button>{{ index+1 + '/' + total }}页<button @click="next()">下一页</button></li>
    </div>
    <Plate v-if="show" :plate= "plate" :insert= "insert" :update= "update" :close= "close"></Plate>
  </div>
</template>

<script>
import Plate from './plate.vue'
import axios from 'axios'
export default {
    name:'plateList',
    components:{Plate},
    mounted(){
        axios.get('/api/getallplate').then(
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
        this.getPlates()
    },
    data(){
        return{
            list:[],
            plate:{},
            show:false,
            index:0,
            total:0,
            keywords:'',
            update:false
        }
    },
    methods:{
        showPlate(item){
            this.plate = item
            this.show = true
            this.update = true
        },
        addPlate(){
            this.update =false
            this.show = true
            this.plate = {plateid:0,platename:''}
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
        getPlates(){    //获取信息
            axios.get('/api/getplates',{params:{
                index:this.index}
            }).then(
                res=>{
                    if(res){
                        const {data} = res
                        this.list = data
                    }else{
                        console.log('失败')
                    }
                },err=>{
                    console.log(err.message)
                }
        )
        },
        deletenotice(plateid){     //删除记录
            axios.get('/api/deleteplate',{params:{
              plateid
            }}).then(
                res=>{
                    if(res){
                        alert('删除成功')
                        this.list = this.list.filter(item=>{
                            if(item.plateid!=plateid){
                                return item
                            } 
                        })
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
                this.list = [];
                this.index = 0;
                this.getPlates()
            }else{
                axios.get('/api/searchPlate',{params:{keywords:this.keywords}}).then(
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
            
        },
        insert(){
            this.getPlates()
        }
    }
}
</script>

<style>
    .plateList{
        width: 100%;
        position: relative;
        min-height: 90vh;
        border-bottom-right-radius: 20px;
    }
    .plateList label{
        width: 100%;
    }
    .plateList p{
        padding: 20px;
        text-align: center;
        font-weight: 1000;
    }
    .plateList .items{
        max-height: 60vh;
        overflow: auto;
    }
    .plateList .items span{
        border: none;
        cursor: pointer;
    }
    .plateList .items li{
        border-bottom: 1px solid gray;
        height: 50px;
        line-height: 40px;
    }
    .plistItem span{
        display: inline-block;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid rgb(0, 0, 0);
        border-left: 1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        overflow: hidden;
    }
    .plateList .h3{
        padding: 20px;
        background: rgb(14, 85, 72);
        color: white;
        height: 110px;
        box-sizing: border-box;
        border-top-right-radius: 20px;
    }
    .plateList .h3 .search{
        height: 30px;
        width: 160px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
    }
    .plateList .h3 .platebtn{
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
    .plateList .h3 .platebtn:hover{
        opacity: 1;
        scale: 1.1;
    }
    .plateList .h3 span{
        border: none;
        font-weight: 1000;
        font-size: 20px;
    }
    .plateList .plateid{
        width: 40%;
    }
    .plateList .platename{
        width: 40%;
    }
    .plateList .options{
        width: 20%;
    }
    .plateList .options span{
        padding: 10px;
    }
    .plateList .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    .plateList .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    }
    .plateList .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 45%;
    }
</style>