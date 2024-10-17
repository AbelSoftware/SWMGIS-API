const {executeQuery} = require('../helpers/dbQuery')
const {sendError,sendSuccess} = require('../helpers/responseHandler')
const {isFloat} = require('../helpers/commonFunction')

async function login(req,res){
    try {
        const {MobileNumber,Password} = req.body

        if(!MobileNumber || !Password) return sendError(res,"Bad Request",400)

        let checkuser = `EXEC splogin @LoginMobile = '${MobileNumber}', @LoginPwd = '${Password}'`
        console.log(checkuser)
        checkuser = await executeQuery(checkuser)

        if(!checkuser[0]){
            checkuser = 'No User Found'
            return sendSuccess(res,"Success",checkuser,404)

        }else{
            checkuser = checkuser[0]
            return sendSuccess(res,"Success",checkuser,200)
        }

        

    } catch (err) {
        return sendError(res,JSON.stringify(err.stack),500)
    }
}

module.exports = {login}