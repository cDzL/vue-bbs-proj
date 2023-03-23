<template>
  <div class="addAticle">
    <!-- <Dialog v-if="false"></Dialog> -->
    <textarea class="addAticleTitle" v-model="article.title"></textarea>
    <div ref="addAticleContent" class="addAticleContent" contenteditable="true">
    </div>
    <div class="tagWall">
        <h6>Tags:</h6>
        <span v-for="tag in selectedTag" :key="tag.plateid" @click="removethis(tag)" title="点击取消该标签">{{'#' + tag.platename }}</span>
    </div>
    <div class="addBtn">
            <button @click="addemo()">表情</button>
            <button class="addPic" @click="addPic()">图片</button>
            <button @click="Pubslish()">发布</button>
            <button @click="addTag()">添加标签</button>
            <input ref="changeImg" type="file" style="display:none"/>
    </div>
    <div class="tagwall" v-if="showtagwall">
        <div class="tags">
            <h5 v-show="selectedTag.length>=3">以达到最大标签数</h5>
            <span v-for="tag in tags" :key="tag.plateid" title="选择标签" @click="selecttag(tag)">{{ tag.platename }}</span>
            <div class="tagwallbtn">       
                <button @click="close()" title="关闭标签页">取消</button>
            </div>
        </div>
    </div>
    <Emoji v-if="showemowall" :close="close" :selectemo="selectemo"></Emoji>
  </div>
</template>
<script>
//import Dialog from '../../components/Dialog'
import Emoji from './emoji'
import axios from 'axios'
export default {
    name:'AddArticel',
    components:{

        Emoji
    },
    mounted(){
        this.article.userid = this.$store.state.user.userid
        axios.get('/api/gettags').then(
            res=>{
                if(res.data)
                    this.tags = res.data
                else
                    console.log('请求错误')
            },err=>{
                console.log(err.message)
            }
        )
    },
    data(){
        return{
            article:{
                userid:'',
                title:'输入标题',
                content:'输入要发布的内容',
                pubtime:'',
                plateid:''
            },
            tags:null,
            selectedTag:[],
            showtagwall:false,
            showemowall:false,
            i:128512
        }
    },
    methods:{
        getDate(){    //获取当前时间
            let now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth()+1
            const date = now.getDate()
            //const hour = now.getHours()
            //const minute = now.getMinutes()
            const str = year+'-'+month+'-'+date//+'/'+hour+':'+minute
            return str
        },
        addPic(){     //添加图片
            if(this.$store.state.user.userid!=''&&this.$store.state.user.userid!=null){
                let _this = this
                let img = document.createElement('img')
                img.className = 'upimg'
                let obj = new FormData()
                this.$refs.changeImg.onchange = function(){
                    let reader = new FileReader()
                    reader.readAsDataURL(this.files[0])
                    reader.onload = function(){      
                        _this.$refs.addAticleContent.appendChild(img)
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
        },
        Pubslish(){   //发布帖子
            this.article.content = this.$refs.addAticleContent.innerHTML
            if(this.selectedTag.length<1) this.selectedTag = [{plateid:0,platename:'其他'}]
            if(this.article.content!=''){
                let str= ''
                this.selectedTag.map(tag=>{
                    str = str+'/'+tag.platename
                    return tag
                })
                this.article.plateid = str
                if(this.$store.state.user.userid!='' && this.$store.state.user.userid!=null){
                    axios.get('/api/pubArticle',{params:{
                        article:this.article
                    }}).then(res=>{
                        if(res.data){
                            alert('发布成功')
                            this.$router.replace({
                                name:'userMain',
                                params:{
                                    userid:this.$store.state.user.userid
                                }
                            })
                        }else{
                            alert('发布失败，网络故障')
                        } 
                    },()=>{})
                }else alert('请先登录')
                
            }
            else alert('内容不能为空')
        },
        addTag(){
            this.showtagwall = true
        },
        close(){
            this.showtagwall = false
            this.showemowall = false
        },
        selecttag(tag){
            if(this.selectedTag.length<3)
                if(JSON.stringify(this.selectedTag).indexOf(JSON.stringify(tag))===-1)   //不允许重复标签
                    this.selectedTag = this.selectedTag.concat(tag);
        },
        removethis(tag){
            this.selectedTag = this.selectedTag.filter(t=>{
                if(t.plateid != tag.plateid) return true
            })
        },
        addemo(){
            this.showemowall = true
            // axios.get('api/addemo',{params:{i:this.i}}).then(
            //     ()=>{
            //         console.log(this.i)
            //         this.i = this.i+1
            //     },err=>{
            //         console.log(err.message)
            //     }
            // )
        },
        selectemo(emodec){
            const span = document.createElement('span')
            span.innerHTML = emodec
            this.$refs.addAticleContent.appendChild(span)
        }
    }
}
</script>

<style>
    .addAticle{
        width: 365px;
        margin: 10px auto;
        position: relative;
    }
    .addAticle textarea{
        width: 100%;
        resize: none;
        padding: 5px;
        box-sizing: border-box;
    }
    .addAticle .tagWall span{
        padding: 10px;
        display: block;
        float: left;
        cursor: pointer;
    }
    .addAticle .tagwall{
        position: fixed;
        width: 100%;
        min-height: 100vh;
        background: rgba(75, 75, 75, 0.411);
        z-index: 9;
        top: 0;
        left: 0;
    }
    .addAticle .tagwall .tags{
        margin: 20vh auto;
        width: 180px;
        height: 200px;
        overflow: auto;
        background: #fff;
        border-radius: 20px;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
    }
    
    .addAticle .tagwall .tags span{
        font-size: 14px;
        padding: 5px;
        width: 30px;
        display: block;
        float: left;
        cursor: pointer;
    }
    .addAticle .tagwall .tagwallbtn{
        position: absolute;
        bottom: 10px;
        left: 70px;
    }
    .addAticle .tagwall .tagwallbtn button{
        background: none;
        border: none;
    }
    .addAticle .tagwall .tags span:hover{
        font-weight: 1000;
    }
    .addAticleContent{
        width: 100%;
        height: 35rem;
        border:1px solid rgb(0, 0, 0);
        box-sizing: border-box;
        padding: 5px;
        background: white;
        overflow-y: auto;
        position: relative;
    }
    .addAticle .tagWall{
        width: 100%;
        height: 50px;
        bottom: 23px;
        left: 0;
        position: absolute;
        background: rgb(96, 96, 96);
        color: #fff;
    }
    .addAticleContent::-webkit-scrollbar{
        width: 0 !important;
    }
    .addAticle .upimg{
        max-width: 355px;
    }
</style>