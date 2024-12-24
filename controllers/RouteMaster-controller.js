const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')
const { isFloat } = require('../helpers/commonFunction')

async function updateLatLong(req, res) {
    try {
        const { Id, Latitude, Longitude, userId, isPole } = req.body

        if (!Id || (!Latitude || !isFloat(Latitude)) || (!Longitude || !isFloat(Longitude))) return sendError(res, "Bad Request", 400)

        let updateQuery
        if (isPole == true) {
            updateQuery = `EXEC spUpdateLatlong @flag=4, @Lat = '${Latitude}', @Long = '${Longitude}',@Sr_No=${Id}, @userId=${userId}`

        } else {
            updateQuery = `EXEC spUpdateLatlong @flag=3, @Lat = '${Latitude}', @Long = '${Longitude}',@Sr_No=${Id}, @userId=${userId}`

        }


        updateQuery = await executeQuery(updateQuery)

        return sendSuccess(res, "Success", updateQuery[0], 200)

    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}


async function getRouteSpot(req, res) {
    try {
        const { wardId, Lat, Long } = req.query
        if (!wardId) return sendError(res, "Bad Request", 400)
        let updateQuery = ``
        if (Lat && Long) {
            updateQuery = `EXEC spGetSpotName  @flag='getlayerBasedonLatLong' ,@lat=${Lat},@lon=${Long}`

        } else {
            updateQuery = `EXEC spGetSpotName  @flag='getAllDatafromlayers' ,@WardId=${wardId}`
        }
        updateQuery = await executeQuery(updateQuery)
        return sendSuccess(res, "Success", updateQuery, 200)
    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}


async function getAllLayersTable(req, res) {
    try {
        // const {wardId} = req.query

        // if(!wardId) return sendError(res,"Bad Request",400)

        let getquery = `EXEC spGetRouteName @flag='getallLayer'`

        getquery = await executeQuery(getquery)

        return sendSuccess(res, "Success", getquery, 200)

    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}


async function getSpecificLayer(req, res) {
    try {
        let { layerName } = req.query
        layerName = 'Layer_' + layerName
        if (!layerName) return sendError(res, "Bad Request", 400)

        let Query = `EXEC spGetSpotName  @flag='getAllDatafromSpecifclayers', @layerName='${layerName}'`

        Query = await executeQuery(Query)

        return sendSuccess(res, "Success", Query, 200)

    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}


async function InsertLayer(req, res) {
    try {
        let { rows, Fields, TableName, LayerType } = req.body
        console.log(req.body)
        layerName = 'Layer_' + TableName
        if (!layerName) return sendError(res, "Bad Request", 400)

        let Columns = ''
        let Values = ''
        for (let i of Fields) {
            Columns = Columns + `${i.name} ${i.type},`
        }
        Columns = Columns.replace(/,$/, '');


        for (let i of rows) {
            let data = '('
            for (let j in i) {
                data = data + `''${i[j]}''` + ','
            }
            data = data.replace(/,$/, '');
            data = data + '),'
            Values = Values + data
        }

        Values = Values.replace(/,$/, '');
        let Query = `EXEC spGetRouteName  @flag='createLayer', @TableName='${layerName}', @Columns='${Columns}', @Values='${Values}',@LayerType='${LayerType}'`

        Query = await executeQuery(Query)

        return sendSuccess(res, "Success", Query, 200)

    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}


// INSERT INTO [Route_Sweeping_Machines] (Geom)
// VALUES (
//     geometry::STGeomFromText(
//         'MULTILINESTRING ((72.826803282043016 18.9430701521295, 72.82451531797885 18.945603656711583, 72.821483300560487 18.948101936073176, 72.82014400452293 18.949386248232887))',
//         4326 -- Spatial Reference System Identifier (SRID), commonly 4326 for WGS84.
//     )
// )
async function updateSpecificLayer(req, res) {
    try {
        let { data, TableName } = req.body
        let layerName = 'Layer_' + TableName
        if (!layerName) return sendError(res, "Bad Request", 400)

        let filterRecordToInsert = data.filter(x => {
            return x.Id == ''
        }).map(({ Id, ...rest }) => rest)

        let filterRecordToUpdate = data.filter(x => {
            return x.Id != ''
        })

        if (filterRecordToInsert.length > 0) {
            let Columns = JSON.stringify(Object.keys(filterRecordToInsert[0])).replace(/[\[\]]/g, '').replace(/"/g, '')

            Values = ''
            for (let i of filterRecordToInsert) {
                Values = Values + '('
                let val = JSON.stringify(Object.values(i)).replace(/[\[\]]/g, '').replace(/"/g, "''")
                Values = Values + val + ')'
                console.log(Values)
            }

            let Query = `EXEC spGetRouteName  @flag='insertRecordInLayer', @TableName='${layerName}',@Columns='${Columns}' , @Values=N'${Values}'`
            console.log(Query)
            Query = await executeQuery(Query)
        }

        if (filterRecordToUpdate.length > 0) {
            let Query = `EXEC spGetRouteName  @flag='updateLayer', @TableName='${layerName}', @data=N'${JSON.stringify(filterRecordToUpdate)}'`
            console.log(Query)
            Query = await executeQuery(Query)
        }

        return sendSuccess(res, "Success", {}, 200)

    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}

module.exports = { updateSpecificLayer, getSpecificLayer, updateLatLong, getRouteSpot, getAllLayersTable, InsertLayer }