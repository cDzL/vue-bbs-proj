<template>
  <div class="dialog"> 
    <div class="dialogWin">
        <h2>确定吗</h2>
        <span>取消</span><span>确定</span>
    </div>
  </div>
</template>

<script>
export default {
    name:'Dialog'
}
</script>

<style>
    .dialog{
        width:100%;
        height:100vh;
        background: rgba(24, 24, 24, 0.5); 
        z-index:999;
        position: fixed;
        left: 0;
        top: 0;
        text-align: center;
    }
    .dialog .dialogWin{
        margin: 20% auto;
        width:200px;
        height: 100px;
        background: white;
        border-radius: 20px;
    }
    .dialogWin span:hover{
        cursor: pointer;
        color: orange;
    }
</style>