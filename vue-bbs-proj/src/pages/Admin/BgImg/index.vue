<template>
<div class="adminBgImg">
    <p v-if="tip.show" :class="tip.success ? 'success':'failed'">{{ tip.success ? '公告发布成功':'公告发布失败' }}</p>
    <h2>背景图片</h2>
    <div>
        <button @click="addPic()">添加图片并预览</button>
        <button @click="submit()">确定上传</button>
    </div>
    <div v-show="show" class="BgImgwall" @click="hideImg()">
        <img ref="BgImg" class="BgImg">
    </div>
    <div class="aimglistItem">
          <label>
            <span class="imgurl">地址</span>
            <span class="imgcontent">图片</span>
            <span class="options">操作</span>
          </label>
          <p v-if="list.length<=0">空空如也,没有任何记录</p>
          <ul class="items" v-if="list.length>0">
              <li v-for="item of list" :key="item.bgimgid">
                  <span class="imgurl">{{item.bgurl}}</span>
                  <img class="imgcontent" :src="item.bgurl">
                  <span  class="options">
                      <span @click="deletebgimg(item.bgimgid)">删除</span>
                      <span @click="bigImg(item.bgurl)">大图</span>
                  </span>
              </li>
          </ul>
          <li class="bottombtns"><button @click="back()">上一页</button>&nbsp;<button @click="next()">下一页</button></li>
      </div>
    <input ref="changeImg" type="file" style="display:none"/>
</div>
</template>
<script>
//import BgimgList from '@/components/BgimgList'
import axios from 'axios'
export default {
    name:'BgImg',
    data(){
        return{
            url:'',
            show:false,
            tip:{show:false,success:true},
            list:[],
            index:0
        }
    },
    mounted(){
        this.initPage()
    },
    methods:{
        initPage(){
            axios.get('/api/getimgList',{params:{
                index:this.index
            }}).then(
                res=>{
                    if(res.data){
                        if(res.data.length<4){
                            this.finished = true
                        }
                        this.list = res.data
                    }
                },err=>{
                    console.log(err.message)
                }
            )
        },
        close(){
            this.show = false
        },
        addPic(){     //添加图片
            let _this = this
            let obj = new FormData()
            this.$refs.changeImg.onchange = function(){
                let reader = new FileReader()
                reader.readAsDataURL(this.files[0])
                const file = this.files[0]
                obj.append('file',file)
                axios.post('/api/uploadImg',obj,{
                    headers:{
                        'Content-Type':'multipart/form-data;'
                    }
                }).then(res=>{
                    _this.$refs.BgImg.src = res.data.str
                    _this.url = res.data.str
                    _this.show = true
                },err=>{console.log(err.message)})
            }
            this.$refs.changeImg.click()
        },
        submit(){     //确认上传
            if(this.url!=''&&this.url!=null){
                axios.get('/api/upbgimg',{params:{
                    str:this.url
                }}).then(
                    (res)=>{
                        if(res.data){
                            alert("上传成功")
                            this.url = ''
                        }
                    },err=>{
                        console.log(err.message)
                    }
                )
            }
            
        },
        hideImg(){
            this.show = false
        },
        back(){
            if(this.index>=1){
                this.index = this.index -1
                this.initPage()
                this.finished = false
            }
        },
        next(){
            if(!this.finished){
                this.index = this.index +1 
                this.initPage()
            }
        },
        bigImg(url){
            this.show = true
            this.$refs.BgImg.src = url
        },
        deletebgimg(bgimgid){   //
            axios.get('/api/deletebgimg',{params:{
                bgimgid
            }}).then(
                res=>{
                    if(res.data){
                        alert('删除成功')
                        this.initPage()
                    }
                },err=>{
                    console.log(err.message)
                }
            )
        }

    }
    
}
</script>

<style>
    .adminBgImg{
        margin: 10px auto;
        width: 1000px;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
    .adminBgImg .BgImgwall{
        display: fixed;
        width: 100%;
        height: 100vh;
    }
    .adminBgImg .BgImg{
        width: 800px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-sizing: border-box;
        margin: 20px auto;   
    }
    .adminBgImg .aimglistItem span{
        display: inline-block;
        text-align: center;
        overflow: hidden;
    }
    .aimglistItem .items li{
        width: 100%;
        height: 130px;
    }
    .aimglistItem .items img{
        height: 120px;
        border-radius: 20px;
        overflow: hidden;
    }
    .adminBgImg p{
        position: fixed;
        top: 20%;
        left: 50%;
        padding: 5px;
        font-size: 16px;
    }
    .aimglistItem .imgurl{
        width: 50%;
    }
    .aimglistItem .imgcontent{
        width: 25%;  
    }
    .aimglistItem .options{
        width: 25%;
    }
    .adminBgImg .success{
        color: rgb(9, 202, 9);
    }
    .adminBgImg .failed{
        color: rgb(237, 28, 28);
    }
    .aimglistItem .options span:nth-child(1):hover{
        color: rgb(239, 43, 43);
    }
    .aimglistItem .options span:nth-child(2):hover{
        color: rgb(17, 156, 84);
    }
    .aimglistItem .options span{
        padding: 10px;
        cursor: pointer;
    }
    .aimglistItem .bottombtns{
        position: absolute;
        bottom: 10px;
        left: 45%;
    }
</style>