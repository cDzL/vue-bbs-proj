
const connection = require('./connection')

// ---------管理员--------------
module.exports.pubNotice = (arr,response)=>{         //发布新公告
    const sql = "insert into notice(content,noticetime,title) value(?,?,?)"
    connection.query(sql,arr,(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}
module.exports.getNotices = (index,response)=>{            //加载公告信息
    const sql = "select * from notice limit ?,10"
    let from = index*10
    connection.query(sql,from,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            result.map(r=>{
                r.noticetime = JSON.stringify(r.noticetime).slice(1,11)
                return r
            })
            response.send(result)
        }
    })
}
module.exports.getAllNotice = (response)=>{          //获取公告数量
    const sql = "select count(*) from notice"
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send({total:result[0]['count(*)']})
        }
    })
}
module.exports.deleteNotice= (arr,response)=>{      //删除公告
    const sql = "delete from notice where noticeid = ?"
    connection.query(sql,arr,(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}
module.exports.getUsers = (index,response)=>{            //加载用户信息
    const sql = "select * from users limit ?,10"
    let from = index*10
    connection.query(sql,from,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            result.map(r=>{
                r.regdate = JSON.stringify(r.regdate).slice(1,11)
                return r
            })
            response.send(result)
        }
    })
}
module.exports.getAllUser = (response)=>{          //获取公告数量
    const sql = "select count(*) from users"
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send({total:result[0]['count(*)']})
        }
    })
}
module.exports.deleteUser= (arr,response)=>{       //删除用户信息
    const sql = "delete from notice where userid = ?"
    connection.query(sql,arr,(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}
module.exports.adminLogin = (arr,response)=>{       //管理员登录
    const sql = 'select * from admins where adminname = ? && adminpassword = ?';
    connection.query(sql,arr,(err,result)=>{
        if(err){
            console.log(err.message);
            response.send(false);
        }else{
            if(result.length>0){
                response.send(true);
            }    
            else{
                response.send(false)
            }          
        }
    })
}
module.exports.getArticles = (index,response)=>{    //加载帖子信息
    const sql = 'select * from articles limit ?,?'
    let from = index*10
    let to = 10
    const arr = [from,to]
    connection.query(sql,arr,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            result.map(r=>{
                r.pubtime = JSON.stringify(r.pubtime).slice(1,11)
                return r
            })
            response.send(result)
        }
    })
}
module.exports.getAllArticle =(response)=>{         //获取所有帖子的数量
    const sql = "select count(*) from articles";
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send({total:result[0]['count(*)']})
        }
    })
} 
module.exports.SearchUser =(keywords,response)=>{   //搜索用户
    const sql = "select * from users where userid = ? || username like ? || signalname like ? || address like ? || telphone like ?"
    connection.query(sql,[keywords,'%'+keywords+'%','%'+keywords+'%','%'+keywords+'%',keywords+'%'],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            result.map(r=>{
                r.regdate = JSON.stringify(r.regdate).slice(1,11)
                return r
            })
            response.send(result)
        }
    })
}
module.exports.SearchNotice =(keywords,response)=>{  //搜索公告
    const sql = "select * from notice where noticeid = ? || title like ?"
    connection.query(sql,[keywords,'%'+keywords+'%'],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            result.map(r=>{
                r.noticetime = JSON.stringify(r.noticetime).slice(1,11)
                return r
            })
            response.send(result)
        }
    })
}
module.exports.getCommuts =(index,response)=>{       //获取所有评论
    const sql = "select * from commut limit ?,10"
    let from = index*10
    connection.query(sql,from,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            result.map(r=>{
                r.comtime = JSON.stringify(r.comtime).slice(1,11)
                return r
            })
            response.send(result)
        }
    })
}
module.exports.getAllCommut =(response)=>{         //获取所有帖子的数量
    const sql = "select count(*) from commut";
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send({total:result[0]['count(*)']})
        }
    })
} 
module.exports.deleteCommut = (arr,response)=>{     //删除帖子
    const sql = "delete from commut where commutid = ?"
    connection.query(sql,arr,(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}
module.exports.SearchCommut =(keywords,response)=>{   //搜索评论
    const sql = "select * from commut where userid = ? || aid = ? || content like ?"
    connection.query(sql,[keywords,keywords,'%'+keywords+'%'],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            result.map(r=>{
                r.comtime = JSON.stringify(r.comtime).slice(1,11)
                return r
            })
            response.send(result)
        }
    })
}

module.exports.getPlates = (index,response)=>{
    const sql = "select * from plate limit ?,10"
    let from = index*10
    connection.query(sql,from,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}
module.exports.getAllPlate =(response)=>{         //获取所有帖子的数量
    const sql = "select count(*) from plate";
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send({total:result[0]['count(*)']})
        }
    })
} 
module.exports.updatePlate = (arr,response)=>{  //修改板块信息
    const sql = "update plate set platename = ? where plateid = ?"
    connection.query(sql,arr,(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}
module.exports.addPlate = (platename,response)=>{   //添加板块
    const sql = "insert into plate(platename) values(?)"
    connection.query(sql,platename,(err)=>{
        if(err){
            console.log(err.message);
            response.send(false);
        }else{
            response.send(true);
        }
    })
}
module.exports.SearchPlate = (keywords,response)=>{  //搜索板块
    const sql = "select * from plate where plateid = ? || platename like ?"
    connection.query(sql,[keywords,'%'+keywords+'%'],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}
module.exports.deletePlate = (plateid,response)=>{   //删除板块
    const sql = "delete from plate where plateid = ?"
    connection.query(sql,plateid,(err)=>{
        if(err){
            console.log(err.message);
            response.send(false);
        }else{
            response.send(true);
        }
    })
}

module.exports.getArticleById = (aid,response)=>{   //
    const sql = "select * from articles where aid = ?"
    connection.query(sql,aid,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result[0])
        }
    })
}

module.exports.getAllReport =(response)=>{         //获取所有举报信息的数量
    const sql = "select count(*) from report";
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send({total:result[0]['count(*)']})
        }
    })
} 

module.exports.getReports = (index,response)=>{   //获取举报的信息
    const sql = "select * from report limit ?,?";
    let from = index*10
    let to = 10
    connection.query(sql,[from,to],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.deleteReport = (reportid,response)=>{   
    const sql = "delete from report where reportid = ?"
    connection.query(sql,reportid,(err)=>{
        if(err){
            console.log(err.message);
            response.send(false);
        }else{
            response.send(true);
        }
    })
}

module.exports.getAllAskFor =(response)=>{         //获取所有帖子的数量
    const sql = "select count(*) from askfor";
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send({total:result[0]['count(*)']})
        }
    })
} 

module.exports.getAskFors = (index,response)=>{   //获取请求版主的信息
    const sql = "select * from askfor limit ?,?";
    let from = index*10
    let to = 10
    connection.query(sql,[from,to],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}
module.exports.deleteAskFor = (askforid,response)=>{
    const sql = "delete from askfor where askforid = ?"
    connection.query(sql,askforid,(err)=>{
        if(err){
            console.log(err.message);
            response.send(false);
        }else{
            response.send(true);
        }
    })
}

module.exports.AgreeReq = (userid,response)=>{   
    const sql = "update users set sort = 1 where userid = ?"
    connection.query(sql,userid,(err)=>{
        if(err){
            response.send(false)
        }else{
            response.send(true)
        }
    })
}

module.exports.uploadBgimg = (url,response)=>{
    const sql = "insert into backgroundimg (bgurl) values(?)" ;
    connection.query(sql,url,(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}

module.exports.deleteBgImg = (bgimgid,response)=>{
    const sql = "delete from backgroundimg where bgimgid = ?"
    connection.query(sql,bgimgid,(err)=>{
        if(err){
            response.send(false)
        }else{
            response.send(true)
        }
    })
}

module.exports.adminchangeInfo =(arr,response)=>{   //修改用户信息
    const sql = "UPDATE USERS SET signalname=?,telphone=?,address=?,sort=?,email=?,state=? where userid = ?"
    connection.query(sql,arr,(err)=>{
        if(err)response.send(false)
        else response.send(true)
    })
}
// module.exports.addemo = (i,response)=>{
//    const sql = "insert into emoji(emodec) values(?)"
//     connection.query(sql,i,(err)=>{
//         if(err){
//             response.send(false)
//         }else{
//             response.send(true)
//         }
//     })
// }