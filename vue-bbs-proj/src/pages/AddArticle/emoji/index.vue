<template>
  <div class="emowall" @click.stop="close()">
        <div class="emos">
            <span v-for="emo in list" :key="emo.emoid" @click="selectemo(emo.emodec)" :title="emo.emoname">{{emo.emodec}}</span>
            <div class="emowallbtn">       
                <button @click="close()" title="关闭标签页">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:"EmoJi",
    props:['close','selectemo'],
    data(){
        return{
            list:[],
            index:0
        }
    },
    mounted(){
        this.initPage()
    },
    methods:{
        initPage(){
            axios.get('/api/getemoji',{params:{index:this.index}}).then(
                res=>{
                    if(res.data){
                        if(res.data.length>0){
                            const {data} = res
                            data.map(emo=>{
                                emo.emodec = String.fromCodePoint("0x"+(emo.emodec).toString(16))
                                return data
                            })
                            this.list = data
                        }
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
.emowall{
    min-width: 100%;
    min-height: 100vh;
    z-index: 9;
    top: calc(100% - 215px);
    left: -25%;
    position: absolute;
}
.emowall .emos{
    width: 200px;
    height: 190px;
    background: rgb(239, 235, 235);
    border-radius: 20px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
}
.emowall .emos:after{
    content: '';
    width: 0px;
    height: 0px;
    border-top: 10px solid rgb(239, 235, 235);
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    position: absolute;
    bottom: -8px;
    left: 45%;
}
.emowall .emos span{
    font-size: 20px;
    width: 30px;
    height: 30px;
    display: block;
    float: left;
    cursor: pointer;
    text-align: center;
}
.emowall .emowallbtn{
    position: absolute;
    bottom: 5px;
    left: 40%;
}
</style>