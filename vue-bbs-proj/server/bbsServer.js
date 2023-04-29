const express = require('express');
const multer = require('multer');  //引入multer,上传图片需要的
const app = express();
app.use((request,response,next)=>{
    request.url = request.url.replace('/api','')  //解决打包后请求404的问题
    next()
})

const cors = require('cors')   //解决请求跨域问题
const uploadimg = require('./router/uploadImg')
//数据库相关
const options = require('./shame/sql');
const admoptions = require('./shame/admin')
//邮箱验证
const nodemail = require('./email/emailer')
//token验证
//const Token = require('./token/token')
let objMulter = multer({dest:"./public/upload"})//设置上传的图片所存放位置
app.use(cors())  //设置允许跨域
app.use(express.static('../dist'))
app.use(objMulter.any())//表示允许上传任意文件类型
app.use(express.static("./public"))
app.use('/',uploadimg)

app.get('/upload/*', (req, res)=>{
    res.sendFile( __dirname + "/public" + req.url );
})


let postcode = ''   //用户验证码

app.all('/createUser',(req,res)=>{   //注册账号
    if(postcode!=''){
        const {query:{arr}} = req
        const regdate = getDate()
        let array = [...arr,regdate]
        options.createUser(array,res)
    }else{
        res.send(false)
    }
})
app.all('/login',(req,res)=>{        //登录账号
    const {query:{arr}} = req
    options.login(arr,res) 
})
app.all('/user',(req,res)=>{         //获取玩家信息
    const {query:{userid}} = req
    let arr = [userid]
    options.user(arr,res)
})
app.all('/pubArticle',(req,res)=>{   //发布新帖
    const {query:{article}} =req;
    let {userid,title,content,pubtime,plateid} = JSON.parse(article);
    pubtime = getDate();
    let arr = [userid,title,content,pubtime,plateid];
    options.pubAtricle(arr,res);
})
app.all('/myarticels',(req,res)=>{   //个人动态
    const {query:{userid,index}} = req
    let arr = [userid]
    options.myarticle(arr,res,index)
})
app.all('/suggest',(req,res)=>{      //推荐页  
    const {query:{index}} = req
    options.suggest(res,index)
})
app.all('/delArticle',(req,res)=>{   //删除帖子
    const {query:{aid}} = req
    let arr= [aid]
    options.delArticle(arr,res)
})
app.get('/support',(req,res)=>{      //点赞和取消点赞
    let {query:{userid,aid,supporter,type}} = req
    let arr = []
    if(Number(type)>0){
        arr = [supporter+'/'+userid,aid,userid]
    }else{
        supporter = supporter.split('/').filter(s=>{if(s!=userid){return s}}).toString().replace(',','/')
        arr = [supporter,aid,userid]
    }
    options.support(arr,res,Number(type))
    
})
app.get('/collect',(req,res)=>{      //收藏和取消收藏
    let {query:{userid,aid,collecter,type}} = req
    let arr = []
    if(Number(type)>0){
        arr = [collecter+'/'+userid,aid,userid]
    }else{
        collecter = collecter.split('/').filter(s=>{if(s!=userid){return s}}).toString().replace(',','/')
        arr = [collecter,aid,userid]
    }
    options.collect(arr,res,Number(type))
})
app.all('/changeInfo',(req,res)=>{   //修改用户信息
    const {query:{user}} = req
    let sort = JSON.parse(user).sort
    if(typeof(sort) === "number"){
        console.log(1)
        const {userid,signalname,telphone,address,sort,state,email} = JSON.parse(user)
        let arr = [signalname,telphone,address,sort,email,state,userid]
        admoptions.adminchangeInfo(arr,res)
    }else{
        const {userid,att_img,username,signalname,age,sex,telphone,address,email} = JSON.parse(user)
        let arr = [att_img,username,signalname,age,sex,telphone,address,email,userid]
        options.changeInfo(arr,res)
    }
    
})
app.get('/article',(req,res)=>{      //进入某贴得详情页
    const {query:{aid}} = req
    const arr = [aid]
    options.article(arr,res)
})
app.get('/sendMsg',(req,res)=>{      //发送评论
    const {query:{comment}}= req
    let {aid,userid,content,comtime} = JSON.parse(comment)
    comtime = getDate()
    let arr = [userid,aid,content,comtime]
    options.sendMsg(arr,res)
})
app.get('/comments',(req,res)=>{     //获取评论
    const {query:{aid,type,index}} = req
    options.comments(aid,res,Number(type),index)
})
app.get('/authorid',(req,res)=>{     //获取作者id
    const {query:{aid}} = req
    const arr= [aid]
    options.authorid(arr,res)
})
app.get('/subscribe',(req,res)=>{    //关注 
    const {query:{auserid,userid}} = req
    let arr = [userid,auserid]
    options.subscribe(arr,res)
})
app.get('/subslist',(req,res)=>{     //获取关注列表
    const {query:{userid}} = req
    if(userid==null||userid==undefined){
        res.send([])
    }else{
        options.subslist(userid,res)
    }
})
app.get('/mycomments',(req,res)=>{    //获取用户所有评论
    const {query:{userid,index}} = req
    let arr = [userid]
    options.mycomments(arr,res,index)
})
app.get('/message',(req,res)=>{       //获取他人给用户的评论
    const {query:{userid,sort,index}} = req
    let arr = [userid,Number(sort)]
    options.message(arr,res,index)
})
app.get('/delMsg',(req,res)=>{        //删除消息
    const {query:{messageid}} = req
    let arr = [messageid]
    options.delMsg(arr,res)
})
app.get('/delComt',(req,res)=>{        //删除评论
    const {query:{cid}} = req
    let arr = [cid]
    options.delComt(arr,res)
})
app.get('/getCollectArt',(req,res)=>{   //收藏的帖子列表
    const {query:{userid,index}} = req
    options.getCollectArt(userid,res,index)
})
app.get('/searchArticle',(req,res)=>{
    const {query:{keywords}} = req
    options.SearchArticle(keywords,res)
})
app.get('/reportarticle',(req,res)=>{
    const {query:{userid,username,aid,reason}} = req
    let arr = [userid,username,aid,reason]
    options.ReportArticle(arr,res)

})
app.all('/gettags',(req,res)=>{
    options.getTags(res)
})
app.all('/requestaut',(req,res)=>{    //申请版主
    const {query:{userid,username}} = req
    options.requestAut([userid,username],res)
})
app.all('/plates',(req,res)=>{
    options.Plates(res)
})
app.get('/getarticlesByPlateName',(req,res)=>{
    const {query:{platename,index}} = req
    options.GetArticlesByPlateName(platename,index,res)
})

app.get('/aboutspots',(req,res)=>{    //显示红点
    const {query:{userid}} = req;
    options.AboutSpots(userid,res)
})

app.get('/personalmsg',(req,res)=>{   //获取私信列表
    const {query:{userid,index}} = req
    options.PersonalMsg(userid,res,index)
})

app.get('/noticedata',(req,res)=>{  //获取首页进入时的公告信息
    options.NoticeData(res)
})
app.get('/hidespots',(req,res)=>{  //点击之后把所有红点清掉
    const {query:{userid,i}} = req
    options.DeleteOff(userid,res,i)
})
app.get('/getpersonalmsgslist',(req,res)=>{
    const {query:{userid,talkerid,index}} = req;
    options.getPersonalMsgsList(userid,talkerid,res,index)
})
app.get('/sendpmsg',(req,res)=>{    //发送私信
    const {query:{msg,fromuserid,touserid}} = req;
    let pmsgtime = getDate()
    let arr = [msg,fromuserid,touserid,pmsgtime]
    options.addPMsg(arr,res)
})
app.all('/getsetting',(req,res)=>{   //获取用户隐私设置
    const {query:{userid}} = req
    options.getSetting(userid,res)
})
app.get('/upadatesetting',(req,res)=>{   //更新用户隐私设置
    const {query:{userid,personal1,personal2,personal3}} = req
    options.updateSetting([Number(personal1),Number(personal2),Number(personal3),userid],res)
})
app.get('/getactivepersonal',(req,res)=>{  
    const {query:{userid}} = req
    options.getActPer(userid,res)
})
app.get('/getcommentpersonal',(req,res)=>{  
    const {query:{userid}} = req
    options.getComPer(userid,res)
})
app.get('/getcollectpersonal',(req,res)=>{
    const {query:{userid}} = req
    options.getColPer(userid,res)
})
app.get('/searcharticles',(req,res)=>{   //搜索帖子
    const {query:{keywords,index}} = req
    options.findArticles(keywords,res,index)
})

app.get('/getemoji',(req,res)=>{  //获取表情列表
    const {query:{index}} = req;
    options.getEmoji(index,res);
})
app.get('/getimgList',(req,res)=>{    //获取图片列表
    const {query:{index}} = req
    options.getImgList(index,res)
})


//---------------------------管理员------------------------------------
app.all('/pubnotice',(req,res)=>{      //发布公告
    const {query:{notice}} = req
    let noticetime = getDate()
    let {content,title} = JSON.parse(notice)
    let arr = [content,noticetime,title]
    admoptions.pubNotice(arr,res)
    
})
app.all('/getnotices',(req,res)=>{     //加载公告信息
    const {query:{index}} = req
    admoptions.getNotices(index,res)
})
app.all('/getallnotice',(req,res)=>{   //加载公告信息
    admoptions.getAllNotice(res)
})
app.all('/deletenotice',(req,res)=>{   //删除公告
    const {query:{userid}} = req
    let arr = [userid]
    admoptions.deleteNotice(arr,res)
})
app.all('/getusers',(req,res)=>{     //加载公告信息
    const {query:{index}} = req
    admoptions.getUsers(index,res)
})
app.all('/getalluser',(req,res)=>{   //加载用户信息
    admoptions.getAllUser(res)
})
app.all('/deleteuser',(req,res)=>{   //删除用户
    const {query:{userid}} = req;
    let arr = [userid];
    admoptions.deleteUser(arr,res);
})
app.all('/adminlogin',(req,res)=>{
    const {query:{admin}} = req;
    const {adminname,adminpassword} = JSON.parse(admin)
    let arr = [adminname,adminpassword]
    admoptions.adminLogin(arr,res)
})
app.all('/getarticles',(req,res)=>{
    const {query:{index}} = req;
    admoptions.getArticles(index,res);
})
app.get('/searchUser',(req,res)=>{
    const {query:{keywords}} = req
    admoptions.SearchUser(keywords,res)
})
app.get('/searchNotice',(req,res)=>{
    const {query:{keywords}} = req
    admoptions.SearchUser(keywords,res)
})
app.get('/getallarticle',(req,res)=>{
    admoptions.getAllArticle(res)
})
app.get('/getcommuts',(req,res)=>{
    const {query:{index}}= req;
    admoptions.getCommuts(index,res)
})
app.get('/getallcommut',(req,res)=>{
    admoptions.getAllCommut(res)
})
app.get('/deletecommut',(req,res)=>{
    const {query:{commutid}} = req;
    let arr = [commutid];
    admoptions.deleteCommut(arr,res);
})
app.get('/searchCommut',(req,res)=>{
    const {query:{keywords}} = req
    admoptions.SearchCommut(keywords,res)
})
app.get('/getplates',(req,res)=>{
    const {query:{index}}= req;
    admoptions.getPlates(index,res)
})
app.get('/getallplate',(req,res)=>{
    admoptions.getAllPlate(res)
})
app.get('/updateplate',(req,res)=>{
    const{query:{updateplate}} = req
    let {plateid,platename} = JSON.parse(updateplate)
    const arr = [platename,plateid]
    admoptions.updatePlate(arr,res)
})
app.get('/addplate',(req,res)=>{
    const {query:{platename}} = req
    admoptions.addPlate(platename,res)
})
app.all('/searchPlate',(req,res)=>{
    const {query:{keywords}} = req
    admoptions.SearchPlate(keywords,res)
})
app.get('/deleteplate',(req,res)=>{
    const {query:{plateid}} = req
    admoptions.deletePlate(plateid,res)
})
app.get('/getarticlebyid',(req,res)=>{    //依靠id查找帖子
    const {query:{aid}} = req
    admoptions.getArticleById(aid,res)
})
app.get('/getallreport',(req,res)=>{      //获取举报信息总数
    admoptions.getAllReport(res)
})
app.get('/getreports',(req,res)=>{    //获取所有举报信息
    const{query:{index}} = req
    admoptions.getReports(index,res)
})
app.get('/deletereport',(req,res)=>{    //删除举报信息 
    const {query:{reportid}} = req
    admoptions.deleteReport(reportid,res)
})
app.all('/getallaskfor',(req,res)=>{      //获取申请消息总数
    admoptions.getAllAskFor(res)
})
app.get('/getaskfors',(req,res)=>{    //获取所有申请信息
    const{query:{index}} = req
    admoptions.getAskFors(index,res)
})
app.get('/deleteaskfor',(req,res)=>{    //删除申请
    const {query:{askforid}} = req
    admoptions.deleteAskFor(askforid,res)
})
app.get('/agreeReq',(req,res)=>{     //同意申请
    const {query:{userid}} = req
    admoptions.AgreeReq(userid,res)
})
app.get('/upbgimg',(req,res)=>{     //上传背景图片
    const {query:{str}} = req
    admoptions.uploadBgimg(str,res)
})
app.get('/deletebgimg',(req,res)=>{
    const {query:{bgimgid}} = req
    admoptions.deleteBgImg(bgimgid,res)
})



/* ------------------     邮箱验证    ------------------- */
app.get('/getcode',(req)=>{
    const {query:{email}} = req;
    postcode = createCode();
    console.log(postcode)
    let mail = {
        from:'<1733720614@qq.com>',
        subject:"接受凭证",
        to:email,
        text:"您的验证码是："+postcode+"如非本本人操作，请忽略"
    };
    //发送邮件
    nodemail(mail);
    //60s后重置
    setTimeout(function(){
        postcode = ''
    },60000)
})
app.get('/ddCode',(req,res)=>{ //验证码比对
    const {query:{code}} = req;
    if(code===postcode){
        res.send(true)
    }else{
        res.send(false)
    }
})
app.get('/setpassword',(req,res)=>{
    const {query:{username,password,email,code}} = req
    if(code == postcode){
        options.resetPsaaword(username,password,email,res)
    }else{
        res.send(false)
    }
})

app.all('/adminchangeInfo',(req,res)=>{   //修改用户信息
    const {query:{user}} = req
    const arr = [...JSON.parse(user)]
    console.log(arr)
    options.changeInfo(arr,res)
})




app.listen(8888,()=>{      //开启端口
    console.log('端口号8888已开启')
})

function getDate(){
    let now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()+1
    const date = now.getDate()
    //const hour = now.getHours()
    //const minute = now.getMinutes()
    const str = year+'-'+month+'-'+date//+'/'+hour+':'+minute
    return str
}
function createCode(){
    return  parseInt(Math.random()*100000).toString()
} 