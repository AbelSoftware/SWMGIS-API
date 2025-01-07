const { executeQuery, executeAddUpdateLayerQuery ,executeAddUpdateLayerFormQuery} = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')
const { isFloat } = require('../helpers/commonFunction')

module.exports = {
    getIsUserInSection: async (req, res) => {
        try {
            const { Latitude, Longitude } = req.body;           
            let queryData = `EXEC spUser_IsUserInSection @UserId=${req.user.id}, @Latitude= ${Latitude},@Longitude=${Longitude}`
            updateQuery = await executeQuery(queryData)
            const { status, msg } = updateQuery[0]
            if (status == 1) {
                return sendSuccess(res, msg, updateQuery, 200)
            } else {
                return sendSuccess(res, msg, updateQuery, 401)
            }
            // return sendSuccess(res, "Success", updateQuery, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    },
    resetUserPassword: async (req, res) => {
        try {
            const { Latitude, Longitude } = req.body;           
            let queryData = `EXEC spUser_ResetPassword @UserId=${req.user.id}, @Password= '${Password}'`
            updateQuery = await executeQuery(queryData)        
          
        return sendSuccess(res, msg, updateQuery, 200)
           
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    }
}
