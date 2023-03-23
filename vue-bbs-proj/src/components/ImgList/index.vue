<template>
<transition name="imgsmove">
    <div class="imgList">
        <div class="imgwall">
            <p v-if="list.length<=0" style="color: #fff;text-align:center;">暂无其他背景图片可选</p>
            <div v-else>
                <img @click="changeBgimg(img.bgurl)" v-for="img in list" :key="img.bgimgid" :src="img.bgurl">
            </div>
            <div class="back_toleft control_btn" @click="back()"></div>
            <div class="next_toright control_btn" @click="next()"></div>
            <div class="close" @click="hideImgs">×</div>
        </div>
    </div>
</transition>
</template>

<script>
import axios from 'axios'
export default {
    name:"ImgList",
    props:['hideImgs'],
    mounted(){
        this.index = 0
        this.initPage()
    },
    data(){
        return{
            list:[],
            index:0,
            finished:false
        }
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
        changeBgimg(url){
            document.body.style.backgroundImage = "url("+"'"+url+"'"+")";
            this.hideImgs();
        }
    }
}
</script>

<style>
.imgList{
    position: fixed;
    width: 100%;
    height: 150px;
    background: rgba(0, 0, 0, 0.468);
    bottom: 0;
    left: 0;
    transition: all .5s;
}
.imgList .imgwall{
    width: 1000px;
    height: 100%;
    margin: 20px auto;
    position: relative;
}
.imgList .imgwall img{
    width: 20%;
    height: 100%;
    border-radius: 20px;
    float: left;
    cursor: pointer;
    margin-left: 40px;
}
.imgList .imgwall img:hover{
    scale: 1.2;
}
.imgList .imgwall img:nth-child(1){
    margin: 0;
}
.imgList .imgwall .control_btn{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    top: 25%;
    cursor: pointer;
}
.imgList .imgwall .back_toleft{
    border-right: 25px solid #fff;
    left: -8%;
}
.imgList .imgwall .next_toright{
    border-left: 25px solid #fff;
    right: -2%;
}
.imgList .imgwall .back_toleft:hover{
    border-right: 25px solid rgb(251, 198, 23);
}
.imgList .imgwall .next_toright:hover{
    border-left: 25px solid rgb(248, 191, 22);
}   
.imgList .imgwall .close{
    position: absolute;
    top: -20px;
    right: 0;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: all .5s;
    transform-origin: center;
}
.imgList .imgwall .close:hover{
    color: rgb(255, 94, 41);
    scale: 1.3;
    transform: rotateZ( 90deg);
}
.imgsmove-enter{
    transform: translateY(100%);
}
.imgsmove-enter-to{
    transform: translateY(0%);
}
.imgsmove-leave{
    transform: translateY(0%);
}
.imgsmove-leave-to{
    transform: translateY(100%);
}
</style>