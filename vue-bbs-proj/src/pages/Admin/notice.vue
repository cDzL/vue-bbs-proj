<template>
  <div class="editnotice">
    <p v-if="tip.show" :class="tip.success ? 'success':'failed'">{{ tip.success ? '公告发布成功':'公告发布失败' }}</p>
    <input placeholder="输入标题" type="text" v-model="notice.title"/>
    <div ref="noticecontent" class="noticecontent" contenteditable="true"></div>
    <button @click="showNotice()">预览</button>
    <button @click="addPic()">图片</button>
    <input ref="changeImg" type="file" style="display:none"/>
    <button @click="publishNotice()">发布</button>
    <Notice :close= 'close' :notice= "notice" v-if="show"></Notice>
  </div>
</template>

<script>
import Notice from '@/components/Notice'
import axios from 'axios'
export default {
    name:'notice',
    components:{Notice},
    data(){
        return{
            notice:{
                content:'输入内容',
                title:'输入标题'
            },
            show:false,
            tip:{show:false,success:true}
        }
    },
    methods:{
        showNotice(){
            this.notice.content = this.$refs.noticecontent.innerHTML
            this.show = true
        },
        close(){
            this.show = false
        },
        publishNotice(){
            this.notice.content = this.$refs.noticecontent.innerHTML
            if(this.notice.content!='')
                axios.get('/api/pubnotice',{
                    params:{
                        notice:this.notice
                    }
                }).then( () =>{
                    this.notice.title = ''
                    this.notice.content = ''
                    this.tip.show = true
                    this.tip.success = true
                    setTimeout(()=>{this.tip.show=false},2000)
                }, () =>{
                    this.tip.show = true
                    this.tip.success = false
                    setTimeout(()=>{this.tip.show=false},2000)
                })
            else{
                this.tip.show = true
                this.tip.success = false
                setTimeout(()=>{this.tip.show=false},2000)
            }
        },
        addPic(){     //添加图片
            let _this = this
            let img = document.createElement('img')
            img.className = 'upimg'
            let obj = new FormData()
            this.$refs.changeImg.onchange = function(){
                let reader = new FileReader()
                reader.readAsDataURL(this.files[0])
                reader.onload = function(){      
                    _this.$refs.noticecontent.appendChild(img)
                }
                const file = this.files[0]
                obj.append('file',file)
                axios.post('/api/uploadImg',obj,{
                    headers:{
                        'Content-Type':'multipart/form-data;'
                    }
                }).then(res=>{
                    img.src = res.data.str
                },err=>{console.log(err.message)})
            }
            this.$refs.changeImg.click()
        }
    }
    
}
</script>

<style>
    .editnotice{
        margin: 10px auto;
        width: 80%;

    }
    .editnotice .noticecontent{
        width: 600px;
        height: 500px;
        background: white;
        border-radius: 10px;
        padding: 10px;
        box-sizing: border-box;
        margin-top: 20px;
        overflow-y: auto;
    }
    .editnotice p{
        position: fixed;
        top: 20%;
        left: 50%;
        padding: 5px;
        font-size: 16px;
    }
    .editnotice .success{
        color: rgb(9, 202, 9);
    }
    .editnotice .failed{
        color: rgb(237, 28, 28);
    }
</style>