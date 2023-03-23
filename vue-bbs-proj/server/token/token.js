//安装jwt npm i jsonwebtoken
//引入jwt
//创建token实例并导出
const jwt = require('jsonwebtoken')
module.exports.Token = {
    en(str){  //加密token
        let tokenKey =  jwt.sign(str,'apache')
        return tokenKey
    },
    de(token){   //解密token
        try{
            let tokenKey = jwt.verify(token,'apache')
            return {
                status:'success',
                tokenKey
            }
        }
        catch{
            return{
                status:'faile'
            }
        }
        
    }
}