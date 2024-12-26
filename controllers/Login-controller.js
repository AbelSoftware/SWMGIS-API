const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')
const { isFloat } = require('../helpers/commonFunction')
const jwt=require('jsonwebtoken');
async function login(req, res) {
    try {
        const { Username, Password } = req.body
        if (!Username || !Password) return sendError(res, "Bad Request", 400)
        let checkuser = `EXEC splogin @Username = '${Username}', @Password= '${Password}'`     
        checkuser = await executeQuery(checkuser)       
        if (!checkuser[0]) {
            checkuser = 'No User Found'
            return sendSuccess(res, "Success", checkuser, 404)
        } else {
            checkuser = checkuser[0]
            let { UserId } = checkuser
            console.log(checkuser)
            const token= jwt.sign({id:UserId},"ABEL@2024")
            console.log(token)
            res.cookie("token",token)
            return sendSuccess(res, "Success", checkuser, 200)
        }
    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}

module.exports = { login }