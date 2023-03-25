const nodemailer = require('nodemailer');
const config = {
    service:"qq",
    secure:true,
    auth:{
        user:'1733720614@qq.com',
        pass:'*******'
    }
};
const transporter = nodemailer.createTransport(config);
module.exports = function(maile){
    transporter.sendMail(maile,function(error,info){
        if(error){
            return console.log(error)
        }
        console.log('mail sent',info.response)
    });
};