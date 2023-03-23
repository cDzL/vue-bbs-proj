const fs = require('fs')

exports.uploadimg = (req,res)=>{
    let oldName= req.files[0].filename
    //解决中文乱码问题
    let newName = Buffer.from(req.files[0].originalname,"latin1").toString("utf-8")
    fs.renameSync("./public/upload/"+oldName,'./public/upload/'+newName)
    res.send({
        err:0,
        str:'http://localhost:8888/upload/' + newName
    })
}
