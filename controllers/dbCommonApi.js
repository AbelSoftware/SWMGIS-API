const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')


async function apiQuery(req,res){
    try {
        const {Spname,flag,data} = req.body

        if(!Spname) return sendError(res,"Bad Request",400)

        let finalData = ''

        for(let i in data){
            if(isNaN(data[i])){
                finalData = `@${i}='${data[i]}',`
            }else{
                finalData = `@${i}=${data[i]},`
            }
            
        }
        finalData = finalData.replace(/,$/, '')

        
        let Query = `EXEC ${Spname}  @flag='${flag}' ,${finalData}`
        
        console.log(Query)
        Query = await executeQuery(Query)

        return sendSuccess(res,"Success",Query,200)

    } catch (err) {
        return sendError(res,JSON.stringify(err.stack),500)
    }
}


module.exports = {apiQuery}