const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')


async function apiQuery(req,res){
    try {
        let {Spname,flag,data} = req.body

        if(!Spname) return sendError(res,"Bad Request",400)

        let finalData = ''
        if(flag){
            flag = `@flag='${flag}',`
        }else{
            flag = ''
        }
        
        if(data){
            for(let i in data){
                if(isNaN(data[i])){
                    finalData = finalData + `@${i}='${data[i]}',`
                    
                }else{

                    if(data[i] != null){
                        finalData =finalData + `@${i}=${data[i]},`
                    }else{
                        continue
                    }
                    
                }
                
            }
        }
        
        finalData = finalData.replace(/,$/, '')

        if(finalData == ''){
            flag = flag.replace(/,$/, '')
        }



        
        let Query = `EXEC ${Spname}   ${flag} ${finalData}`
        
        console.log(Query,'--QUERY')
        Query = await executeQuery(Query)

        return sendSuccess(res,"Success",Query,200)

    } catch (err) {
        return sendError(res,JSON.stringify(err.stack),500)
    }
}


async function RawQuery(req,res){
    try {
        let {Spname} = req.body

        if(!Spname) return sendError(res,"Bad Request",400)

        
        Query = await executeQuery(Spname)

        return sendSuccess(res,"Success",Query,200)

    } catch (err) {
        return sendError(res,JSON.stringify(err.stack),500)
    }
}


module.exports = {apiQuery,RawQuery}