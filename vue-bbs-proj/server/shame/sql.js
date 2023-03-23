
const connection = require('./connection')
//const token = require('../token/token')


module.exports.createUser = (arr,response)=>{  //注册用户新新增user
    const sql = "INSERT INTO users(username,upassword,email,regdate) VALUES(?,?,?,?)";
    connection.query(sql,arr,(err)=>{
        if(err){
            response.send(false);
        }
        else {
            const sql1 = "insert into setting(username) values(?)";
            connection.query(sql1,arr[0],(err)=>{
                if(err){
                    console.log(err.message);
                    response.send(false);
                }else{
                    response.send(true);
                }
            })
        }
        
    })
}

module.exports.resetPsaaword = (username,password,email,response)=>{
    const sql = "update users set upassword = ? where username = ? && email = ?"
    connection.query(sql,[password,username,email],(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}

module.exports.login =(arr,response)=>{    //登录验证
    const sql = "SELECT users.userid from users where username = ? && upassword = ?"
    connection.query(sql,arr,(err,result)=>{
        if(err){

            response.send(false)
        }else{
            if(result.length>0){
                response.send(JSON.stringify(result[0]))
            }else{
                response.send(false)
            }
        }
    })
}

module.exports.changeInfo =(arr,response)=>{   //修改用户信息
    const sql = "UPDATE USERS SET att_img=?,username=?,signalname=?,age=?,sex=?,telphone=?,address=?,email=? where userid = ?"
    connection.query(sql,arr,(err)=>{
        if(err)response.send(false)
        else response.send(true)
    })
}

module.exports.user = (arr,response)=>{       //获取用户的详细信息
    const sql = "update users set subsnum = (select count(*) from subs where userid = ?),fansnum = (select count(*) from fans where userid = ?) where userid = ?"
    connection.query(sql,[arr[0],arr[0],arr[0]],(err)=>{
        if(err) response.send(false)
        else{
            const sql1 = "SELECT * FROM users WHERE userid = ?"
            connection.query(sql1,arr,(err,result)=>{
                if(err) response.send(false)
                else response.send(JSON.stringify(result[0]))
            })
        }
    }) 
    
}
module.exports.pubAtricle = (arr,response)=>{   //发布文章
    let sql = ''
    if(arr[4]!=''){
        sql = "INSERT INTO articles(userid,title,content,pubtime,plateid,supporter,collecter) VALUES(?,?,?,?,?,'','')"
    }else{
        sql = "INSERT INTO articles(userid,title,content,pubtime,supporter,collecter) VALUES(?,?,?,?,'','')"
        arr = [arr[0],arr[1],arr[2],arr[3]]
    }
    connection.query(sql,arr,(err)=>{
        if(err) {
            console.log(err.message)
            response.send(false)
        }
        else response.send(true)
    })
}

module.exports.myarticle = (arr,response,index)=>{    //获取用户个人的帖子
    const sql = 'select * from articles where userid = ? limit ?,? '
    let from = index*10
    let to = 10
    arr = [...arr,from,to]
    connection.query(sql,arr,(err,result)=>{
        if(err) response.send(false)
        else {

            response.send(result)
        }
    })
}

module.exports.suggest = (response,index)=>{        //推荐页
    const sql = 'SELECT * FROM articles order by pubtime desc limit ?,?'
    let from = index*10
    let to = 10
    connection.query(sql,[from,to],(err,result)=>{
        if(err) {
            console.log(err.message)
            response.send(false)
        }else {
            response.send(result)
        }
    })
}

module.exports.delArticle = (arr,response)=>{   //删除帖子
    const sql = 'DELETE FROM articles where aid = ?'
    connection.query(sql,arr,(err)=>{
        if(err) response.send(false)
        else response.send(true)
    })
}

module.exports.support = (arr,response,type)=>{      //点赞或者取消点赞
    let messagetime = getDate()
    const sql = 'UPDATE articles SET support = ? , supporter = ? where aid = ?';
    let num = 0;
    let content = '';
    if(arr[0]!='/'||arr[0]!='') {num = arr[0].split('/').length+type-1;} else {num = 0;}
    let array = [num,arr[0],arr[1]];
    connection.query(sql,array,(err)=>{
        if(err) {
            response.send(false);
        }
        else {
            if(type == 1){ 
                content = '点赞了';            //arr = [supporter,aid,userid]
                const sql1 = "insert into message (aid,content,messagetime,fromuserid,touserid,flag) values(?,?,?,?,(select userid from articles where aid = ?),?)"
                connection.query(sql1,[arr[1],content,messagetime,arr[2],arr[1],false],(err)=>{
                    if(err){
                        response.send(false)
                    }else{
                        response.send(true)
                    }
                })
            }
            else response.send(true);
        }
    })
}

module.exports.collect = (arr,response,type)=>{     //收藏或取消收藏
    const sql = 'UPDATE articles SET collect = ? , collecter = ? where aid = ?';
    let num = 0;
    if(arr[0]!='/'||arr[0]!='') {num = arr[0].split('/').length+type-1;} else {num = 0;}
    let array = [num,...arr];
    connection.query(sql,array,(err)=>{
        if(err) {
            response.send(false);
        }
        else {
            //userid,aid
            if(type==1){
                const sql = "insert into collects (userid,aid) values(?,?)"
                connection.query(sql,[arr[2],arr[1]],(err)=>{
                    if(err){
                        response.send(false)
                    }else{
                        response.send(true)
                    }
                })
            }else{
                response.send(true)
            }
        }
    })
}

module.exports.article = (arr,response)=>{         //获取帖子的详细信息
    const sql = 'SELECT * FROM articles WHERE aid = ?'
    connection.query(sql,arr,(err,result)=>{
        if(err){ 
            response.send(false)}
        else {
            response.send(result[0])
        }
    })
}

module.exports.sendMsg =(arr,response)=>{          //发送评论
    const sql = "insert into commut (userid,aid,content,comtime) values(?,?,?,?)"
    connection.query(sql,arr,(err)=>{
        if(err) {
            response.send(false);
        }
        else{
            //[userid,aid,content,comtime]
            const sql1 = "insert into message (aid,touserid,fromuserid,messagetime,content,flag) values(?,(select userid from articles where aid = ?),?,?,?,true)"
            let a = [arr[1],arr[1],arr[0],arr[3],arr[2]]
            connection.query(sql1,a,(err)=>{
                if(err) {
                    response.send(false);
                }else{
                    const sql2 = "update articles set commut = (select count(*) from commut where aid = ?) where aid = ?"
                    connection.query(sql2,[arr[1],arr[1]],(err)=>{
                        if(err){
                            response.send(false);
                        }else{
                            const sql3 = "insert into offmessage (aid,touserid,fromuserid,messagetime,content,flag) values(?,(select userid from articles where aid = ?),?,?,?,true)"
                            connection.query(sql3,a,(err)=>{
                                if(err){
                                    console.log(err.message)
                                    response.send(false)
                                }else{
                                    response.send(true)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports.comments = (aid,response,type,index)=>{     //获取评论
    let sql = 'select * from commut where aid = ? limit ?,?'
    let from = index*10
    let to = 10
    let array = [aid,from,to]
    if(type==1) {
        sql = 'select * from commut where aid =? && userid = (select userid from articles where aid = ?) limit ?,?';
        array = [aid,aid,from,to]
    }
    connection.query(sql,array,(err,result)=>{
        if(err) {
            response.send(false);
        }
        else {
            result.map(r=>{
                r.comtime = JSON.stringify(r.comtime).slice(1,11)
                return r
            })
            response.send(result);
        }
    })
}

module.exports.authorid = (arr,response)=>{        //获取作者编号
    const sql = 'SELECT userid from articles where aid = ?'
    connection.query(sql,arr,(err,result)=>{
        if(err) {
            response.send(false)
        }
        else response.send(result[0])
    })
}

module.exports.subscribe = (arr,response)=>{       //关注或取消关注
    const sql = "select * from subs where userid=? && subsid = ?";
    connection.query(sql,arr,(err,result)=>{
        if(err) {response.send(false);}
        else{
            if(result.length<1){     //没有关注时就关注
                const sql1 = "insert into subs (userid,subsid) values(?,?)";
                //arr[userid,auserid]  本人和作者
                connection.query(sql1,arr,(err)=>{
                    if(err) {response.send(false)}
                    else {
                        const sq2 = "insert into fans (userid,fanid) values(?,?)";
                        connection.query(sq2,[arr[1],arr[0]],(err)=>{
                            if(err) {response.send(false)}
                            else response.send(true)
                        })
                    }
                })
            }else{                    //关注时就取关
                const sql1 = "delete from subs where userid = ? && subsid = ?"
                connection.query(sql1,arr,(err)=>{
                    if(err) response.send(false)
                    else{
                        const sql2 = "delete from fans where fanid=? && userid = ?"
                        connection.query(sql2,arr,(err)=>{
                            if(err) response.send(false)
                            else response.send(true)
                        })
                    }
                })
            }
            
        }
    })
    
    
}

module.exports.subslist = (userid,response)=>{        //获取所有关注的人
    const sql = "select * from users where userid in(select subsid from subs where userid = ?)"
    connection.query(sql,userid,(err,result)=>{
        if(err) {
            console.log(err.message)
            response.send(false)}
        else response.send(result)
    })
}

module.exports.mycomments = (arr,response,index)=>{      //获取个人评论
    const sql = 'select * from commut where userid = ? limit ?,?'
    let from = index*10
    let to = 10
    arr = [...arr,from,to]
    connection.query(sql,arr,(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.message = (arr,response,index)=>{         //获取他人给用户的评论
    const sql = "select * from message where touserid = ? && flag = ?  && fromuserid != ? limit ?,?"
    let from = index*10
    let to = 10
    connection.query(sql,[...arr,arr[0],from,to],(err,result)=>{
        if(err){
            response.send(false)
        }else {
            response.send(result)}
    })
}

module.exports.delMsg = (arr,response)=>{
    const sql = 'delete from message where messageid = ?'
    connection.query(sql,arr,(err)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(true)
        }
    })
}

module.exports.delComt = (arr,response)=>{        //删除评论
    const sql = 'delete from commut where commutid = ?'
    connection.query(sql,arr,(err)=>{
        if(err){
            response.send(false)
        }else response.send(true)
    })
}

module.exports.getCollectArt = (userid,response,index)=>{
    const sql = "select * from articles where aid in (select aid from collects where userid = ?) limit ?,?"
    let from = index*10
    let to = 10
    connection.query(sql,[userid,from,to],(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.SearchArticle =(keywords,response)=>{
    const sql = "select * from articles where aid = ? || userid = ? || title like ?;"
    connection.query(sql,[keywords,keywords,'%'+keywords+'%'],(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.ReportArticle = (arr,response)=>{
    const sql = "insert into report(userid,username,aid,reason) values(?,?,?,?)"
    connection.query(sql,arr,(err)=>{
        if(err){
            response.send(false)
        }else{
            response.send(true)
        }
    })
}
module.exports.getTags = (response)=>{
    const sql = "select * from plate";
    connection.query(sql,(err,result)=>{
        if(err){
            response.send(false);
        }else{
            response.send(result);
        }
    })
}

module.exports.requestAut = (arr,response)=>{    //申请版主
    const sql = "insert into askfor(userid,username) values(?,?)";
    connection.query(sql,arr,(err)=>{
        if(err){
            response.send(false);
        }else{
            response.send(true);
            
        }
    })
}

module.exports.Plates = (response)=>{
    const sql = "select * from plate";
    connection.query(sql,(err,result)=>{
        if(err){
            response.send(false);
        }else{
            response.send(result)
        }
    })
}

module.exports.GetArticlesByPlateName =(platename,index,response)=>{
    const sql = "select * from articles where plateid like ? limit ?,?"
    let keywords = "%/" + platename + "%"
    let from = index*10
    let to = 10
    connection.query(sql,[keywords,from,to],(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.AboutSpots = (userid,response)=>{
    const sql = "select count(*) from offmessage where touserid = ? && flag = 1 && fromuserid != ?"
    let show = [false,false,false]
    connection.query(sql,[userid,userid],(err,result)=>{
        if(err){
            response.send(false)
        }else{
            if(result[0]['count(*)']>0){
                show[0] = true;
            }else{
                show[0] = false;
            }
            const sql1 = "select count(*) from offmessage where touserid = ? && flag = 0 && fromuserid != ?";
            connection.query(sql1,[userid,userid],(err,result1)=>{
                if(err){
                    response.send(false);
                }else{
                    if(result1[0]['count(*)']>0){
                        show[1] = true;
                    }else{
                        show[1] = false;
                    }
                    const sql2 = "select count(*) from offpersonalmsg where touserid = ? && fromuserid != ?";
                    connection.query(sql2,[userid,userid],(err,result2)=>{
                        if(err){
                            response.send(false);
                        }else{
                            if(result2[0]['count(*)']>0){
                                show[2] = true;
                            }else{
                                show[2] = false;
                            }
                            response.send(show);
                        }
                    })
                    
                }
            })
        }
    })
}
module.exports.PersonalMsg = (userid,response,index)=>{
    //const sql = "select * from users where userid in (select fromuserid from personalmsg where touserid = ? group by fromuserid) limit ?,?";
    const sql = "select u.userid,u.username,u.att_img,pm.personalmsgid,pm.content,pm.pmsgtime,pm.touserid from users as u left join personalmsg as pm on u.userid = pm.fromuserid group by pm.fromuserid having pm.personalmsgid is not null && pm.touserid = ? limit ?,?"
    let from = index*10
    let to = 10
    connection.query(sql,[userid,from,to],(err,result)=>{
        if(err){
            console.log(err.message);
            response.send(false)
        }else{
            response.send(result)
        }
    })
}
module.exports.NoticeData = (response)=>{
    const sql = "select title,content from notice order by noticeid desc limit 0,1"
    connection.query(sql,(err,result)=>{
        if(err){
            console.log('NoticeData',err.message)
            response.send(false)
        }else{
            response.send(result[0])
        }
    })
}

module.exports.DeleteOff = (userid,response,i)=>{    //删除红点
    console.log(i)
    if(i==0){
        const sql = "delete from offmessage where touserid = ? && flag = 1"
        connection.query(sql,userid,(err)=>{
            if(err){
                response.send(false)
            }else{
                response.send(true)
            }
        })
    }else if(i==1){
        const sql = "delete from offmessage where touserid = ? && flag = 0"
        connection.query(sql,userid,(err)=>{
            if(err){
                response.send(false)
            }else{
                response.send(true)
            }
        })
    }else{
        const sql = "delete from offpersonalmsg where touserid = ?"
        connection.query(sql,userid,(err)=>{
            if(err){
                response.send(false)
            }else{
                response.send(true)
            }
        })
    }
    
    
}

module.exports.getPersonalMsgsList = (userid,talkerid,response,index)=>{
    const sql = "select * from personalmsg where (fromuserid =? && touserid =?) || (touserid =? && fromuserid =?) limit ?,?"
    let from = index*10
    let to = 10
    connection.query(sql,[userid,talkerid,userid,talkerid,from,to],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.addPMsg = (arr,response)=>{     //发送私信
    const sql = "insert into personalmsg(content,fromuserid,touserid,pmsgtime) values(?,?,?,?)";
    connection.query(sql,arr,(err)=>{
        if(err){
            response.send(false)
        }else{
            const sql1 = "insert into offpersonalmsg(content,fromuserid,touserid,pmsgtime) values(?,?,?,?)";
            connection.query(sql1,arr,(err)=>{
                if(err){
                    response.send(false)
                }else{
                    response.send(true)
                }
            })
            
        }
    })
}

module.exports.getSetting =(userid,response)=>{    //获取用户设置
    const sql = "select activepersonal,commentpersonal,collectpersonal from setting where username =(select username from users where userid = ?)"
    connection.query(sql,userid,(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result[0])
        }
    })
}
module.exports.updateSetting =(arr,response)=>{    //获取用户设置
    const sql = "update setting set activepersonal = ? ,commentpersonal = ? , collectpersonal = ? where username in(select username from users where userid = ?)"
    connection.query(sql,arr,(err)=>{
        if(err){
            response.send(false)
        }else{
            response.send(true)
        }
    })
}
module.exports.getActPer = (userid,response)=>{
    const sql = "select activepersonal from setting where username =(select username from users where userid = ?)"
    connection.query(sql,userid,(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result[0])
        }
    })
}

module.exports.getComPer = (userid,response)=>{    //是否设为隐藏
    const sql = "select commentpersonal from setting where username =(select username from users where userid = ?)"
    connection.query(sql,userid,(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result[0])
        }
    })
}
module.exports.getColPer = (userid,response)=>{
    const sql = "select collectpersonal from setting where username =(select username from users where userid = ?)"
    connection.query(sql,userid,(err,result)=>{
        if(err){
            response.send(false)
        }else{
            response.send(result[0])
        }
    })
}

module.exports.findArticles = (keywords,response,index)=>{  //搜索
    const sql = "select * from articles where userid like ? || title like ? || userid in (select userid from users where username like ?) order by pubtime desc limit ?,?"
    let from = index*10
    let to = 10
    connection.query(sql,[keywords+"%","%"+keywords+"%",keywords+"%",from,to],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.getEmoji = (index,response)=>{
    const sql = "select * from emoji group by emodec limit ?,?"
    let from = index*30
    let to = 30
    connection.query(sql,[from,to],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}

module.exports.getImgList = (index,response)=>{
    const sql = "select * from backgroundimg limit ?,?";
    let from = index*4
    let to = 4
    connection.query(sql,[from,to],(err,result)=>{
        if(err){
            console.log(err.message)
            response.send(false)
        }else{
            response.send(result)
        }
    })
}




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
