<template>
    <div class="adminplateWall">
      <div class="adminplateinfo">
            <span v-if="update">帖子ID：{{ plate.plateid }}</span><br>
            <span>板块名称：<input type="text" v-model="updateplate.platename"/></span><br>
            <div class="platebottombtns">
                <span @click="close()">取消</span><span @click="submit()">确定</span>
            </div>
      </div>
    </div>
</template>
  
<script>
import axios from 'axios'
export default {
    name:'PlateO',
    props:['close','plate','update','insert'],
    mounted(){
        this.updateplate = this.plate
    },   
    data(){
        return{
            updateplate:{}
        }
    },
    methods:{
        submit(){
            if(this.updateplate.platename != "" && this.updateplate.platename != null)
                if(this.update){
                    axios.get('/api/updateplate',{params:{
                        updateplate:this.updateplate
                    }}).then(
                        ()=>{
                            this.close()
                        },
                        err=>{
                            console.log(err.message)
                        }
                    )
                }else{
                    axios.get('/api/addplate',{params:{platename:this.updateplate.platename}}).then(
                        ()=>{
                            this.insert()
                            this.close()
                        },err=>{
                            console.log(err.message)
                        }
                    )
                }
            else alert('板块名不能为空')
        }
    }
}
</script>
  
<style>
    .adminplateWall{
        position: fixed;
        width: 100%;
        background: rgba(50, 50, 50, 0.436);
        height: 100vh;
        top: 0;
        left: 0;
    }
    .adminplateWall .adminplateinfo{
        margin: 20vh auto;
        background: white;
        width: 300px;
        height: 160px;
        border-radius: 20px;
        padding-left: 20px;
        padding-top: 10px;
        box-sizing: border-box;
    }
    .adminplateWall span{
        height: 30px;
        line-height: 40px;
        cursor: pointer;
    }
    .adminplateWall input{
        height: 20px;
    }
    .adminplateWall .platebottombtns{
        height: 60px;
        width: 100%;
        display: block;
    }
    .adminplateWall .platebottombtns span:nth-child(1){
        float: left;
    }
    .adminplateWall .platebottombtns span:nth-child(2){
        float: right;
        margin-right: 20px;
    }
    .adminplateWall .platebottombtns span:hover{
        color: rgb(25, 221, 255);
    }
</style>