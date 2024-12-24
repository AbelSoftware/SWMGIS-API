const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')
const { isFloat } = require('../helpers/commonFunction')

module.exports = {
    getlayerdata: async (req, res) => {
        try {
            const { UserId, Latitude, Longitude, LayerName, Id } = req.body
            let queryData = `EXEC spLayerMaster_GetLayerData  @LayerName= '${LayerName}', @Id = '${Id}',@UserId=${UserId}`
            updateQuery = await executeQuery(queryData)
            return sendSuccess(res, "Success", updateQuery, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    },
    updateGeometry: async (req, res) => {
        try {
            const Geom = convertToMultiLineString(req.body.data)
            let dd=`EXEC spLayerMaster_UpdateLayerData  @LayerName= '${req.body.LayerName}',@geom= '${Geom}', @Id = '${req.body.Id}',@UserId=${req.body.UserId}`;
            console.log(dd)
            let queryData = `EXEC spLayerMaster_UpdateLayerData  @LayerName= '${req.body.LayerName}',@geom= '${Geom}', @Id = '${req.body.Id}',@UserId=${req.body.UserId}`
            updateQuery = await executeQuery(queryData)
            return sendSuccess(res, "Success", updateQuery, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    }

}
function convertToMultiLineString(coords) {
    const lines = coords.map(coord => coord.join(' ')).join(', ');
    return `MULTILINESTRING ((${lines}))`;
}