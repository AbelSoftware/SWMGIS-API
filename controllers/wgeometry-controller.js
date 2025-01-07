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
    getTableSchema: async (req, res) => {
        try {
            console.log(req.user)
            const { layername } = req.params;
            let queryData = `EXEC spMaster_GetLayerSchema  @LayerName= '${layername}',@UserId=${req.user.id},@PlatformType='WEB'`
            updateQuery = await executeQuery(queryData)
            return sendSuccess(res, "Success", updateQuery, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    },
    getDropdownData: async (req, res) => {
        try {
            //console.log(req.user)
            const { layername } = req.params;
            let queryData = `EXEC spMaster_GetLayerDropdownData  @LayerName= '${layername}',@UserId=${req.user.id}`
            updateQuery = await executeQuery(queryData)
            const transformedData = updateQuery.reduce((result, current) => {
                const key = current.ColumnName;
                if (!result[key]) {
                    result[key] = {
                        LayerName: current.LayerName,
                        ColumnName: key,
                        DisplayValue: []
                    };
                }
                if (!result[key].DisplayValue.includes(current.DisplayValue)) {
                    result[key].DisplayValue.push(current.DisplayValue);
                }
                return result;
            }, {});

            const finalArray = Object.values(transformedData);
            return sendSuccess(res, "Success", finalArray, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    },
    getlayermasterdata: async (req, res) => {
        try {
            console.log(req.body)
            // const dynamicWhere = buildDynamicWhere(req.body);
            let queryData = `EXEC spLayerMaster_GetLayerMasterData 
               @LayerName = '${req.body.LayerName}',@UserId = ${req.body.UserId},
               @FilterKey1=    '${req.body.FilterKey1 ? req.body.FilterKey1 : null}',   @FilterKeyValue1=    '${req.body.FilterKeyValue1}', 
                @FilterKey2=    '${req.body.FilterKey2}',   @FilterKeyValue2=    '${req.body.FilterKeyValue2}',
                 @FilterKey3=    '${req.body.FilterKey3}',   @FilterKeyValue3=    '${req.body.FilterKeyValue3}',
                  @FilterKey4=    '${req.body.FilterKey4}',   @FilterKeyValue4=    '${req.body.FilterKeyValue4}'        
               `
            // let queryData = `EXEC spLayerMaster_GetLayerData  @LayerName= '${LayerName}',
            //                   @FilterKey1 = '${FilterKey1}', @FilterKeyValue1 = '${FilterKeyValue1}'
            //                   @FilterKey2 = '${FilterKey2}', @FilterKeyValue2 = '${FilterKeyValue2}'
            //                   @FilterKey3 = '${FilterKey3}', @FilterKeyValue3 = '${FilterKeyValue3}'
            //                   @FilterKey4 = '${FilterKey4}', @FilterKeyValue4 = '${FilterKeyValue4}'
            //                  ,@UserId=${UserId}`
            updateQuery = await executeQuery(queryData)
            return sendSuccess(res, "Success", updateQuery, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    },
    getlayergeometrydata: async (req, res) => {
        try {
            // console.log(req.body)
            // const dynamicWhere = buildDynamicWhere(req.body);
            let queryData = `EXEC spWebLayerMaster_GetLayerGeometryData 
               @LayerName = '${req.body.LayerName}',@Zone = '${req.body.Ward}',@Ward = '${req.body.Ward}',@Prabhag = '${req.body.Prabhag}'
              ,@FromDate= ${req.body.FromDate},@ToDate= ${req.body.FromDate},@UserId = ${req.body.UserId}     
               `
            updateQuery = await executeQuery(queryData)
            updateQuery.forEach(entry => {
                // Parse the geom_text into a JSON object
                if (entry.geom_text) {
                    const geom = JSON.parse(entry.geom_text);
                    const geomType = geom.type;
                    const coordinates = geom.coordinates;
                    // Handle "Point" type
                    if (geomType === "Point") {
                        entry.Points = [
                            {
                                latitude: coordinates[1], // Latitude is the second value
                                longitude: coordinates[0] // Longitude is the first value
                            }
                        ];
                    }
                    // Handle "MultiLineString" type
                    else if (geomType === "MultiLineString") {
                        const points = [];
                        coordinates.forEach(line => {
                            line.forEach(coord => {
                                points.push({
                                    latitude: coord[1], // Latitude is the second value
                                    longitude: coord[0] // Longitude is the first value
                                });
                            });
                        });
                        entry.Points = points;
                    }
                }
                else {
                    entry.Points = [];
                }
                // Remove the original "geom_text" key
                delete entry.geom_text;
            });
            return sendSuccess(res, "Success", updateQuery, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    },

    updateGeometry: async (req, res) => {
        try {
            let checkLayerType = `EXEC spLayerMaster_GetLayerGeomType  @LayerName= '${req.body.LayerName}'`;
            checkLayerType = await executeQuery(checkLayerType)
            const { LayerType } = checkLayerType[0]
            let Geom;
            if (LayerType == 'Point') {
                Geom = convertToPoint(req.body.data)
            } else {
                Geom = convertToMultiLineString(req.body.data)
            }
            // let queryData = `EXEC spLayerMaster_UpdateLayerData  @LayerName= '${req.body.LayerName}',@geom= '${Geom}', @Id = '${req.body.Id}',@UserId=${req.body.UserId}`
            // updateQuery = await executeQuery(queryData)
            return sendSuccess(res, "Success", Geom, 200)
        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
    },
    addUpdateLayerData: async (req, res) => {
        const { LayerName, data, coordinates } = req.body;
        try {
            if (!LayerName || !data) {
                throw new Error("Invalid request data: TableName or data is missing.");
            }
            let checkLayerType = `EXEC spLayerMaster_GetLayerGeomType  @LayerName= '${req.body.LayerName}'`;
            checkLayerType = await executeQuery(checkLayerType)
            const { LayerType } = checkLayerType[0]
            let Geom;
            if (LayerType == 'POINT') {
                Geom = convertToPoint(req.body.coordinates);
                data['geom'] = Geom;
               
            } else {
                Geom = convertToMultiLineString(req.body.coordinates)
                data['geom'] = Geom;
               
            }
            let message, updateQuery;
            if (data.qgs_fid) {
                // Perform an UPDATE operation
                data['ModifiedBy'] = req.user.id;
                updateQuery = await executeAddUpdateLayerQuery(LayerName, data, coordinates);
                message = "Data updated successfully.";
                return sendSuccess(res, message, updateQuery, 200)
            } else {
                // Perform an INSERT operation
                data['CreatedBy'] = req.user.id;
                updateQuery = await executeAddUpdateLayerQuery(LayerName, data, coordinates);
                message = "Data added successfully.";
                return sendSuccess(res, message, updateQuery, 201)
            }
            // let  updateQuery = await executeAddUpdateLayerQuery(LayerName, data,coordinates)

        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
        // // Extract keys and values from the "data" object
        // const keys = Object.keys(data); // ["id", "layer_name", "column_name", "display_value"]
        // const values = Object.values(data); // [47, "Layer_collectionSpot", "Segregation_done", "Yes"]

        // // Check if "id" exists in the data to determine whether to INSERT or UPDATE
        // if (data.id) {
        //     // Create a dynamic UPDATE query
        //     const setClauses = keys
        //         .filter((key) => key !== "id") // Exclude "id" from SET clause
        //         .map((key) => `${key} = @${key}`) // Generate "column = value" for each key
        //         .join(", ");

        //     const query = `
        //     UPDATE ${LayerName}
        //     SET ${setClauses}
        //     WHERE id = @id;
        //   `;

        //     console.log("Generated UPDATE Query:", query);

        //     // Example: Running the query using a SQL library (e.g., mssql)
        //     // Assuming `dbPool` is your database connection pool
        //     // Execute the query
        //     // const pool = await sql.connect("your-connection-string");
        //     // const result = await pool.request();
        //     // keys.forEach((key, index) => {
        //     //     result.input(key, values[index]); // Bind dynamic parameters
        //     // });

        //     // await result.query(query);
        //     return { success: true, message: "Update query executed successfully." };
        // } else {
        //     // Create a dynamic INSERT query
        //     const columns = keys.join(", "); // "id, layer_name, column_name, display_value"
        //     const placeholders = keys.map((key) => `@${key}`).join(", "); // "@id, @layer_name, @column_name, @display_value"

        //     const query = `
        //     INSERT INTO ${LayerName} (${columns})
        //     VALUES (${placeholders});
        //   `;

        //     console.log("Generated INSERT Query:", query);

        //     // Example: Running the query using a SQL library (e.g., mssql)
        //     // const pool = await sql.connect("your-connection-string");
        //     // const result = await pool.request();
        //     // keys.forEach((key, index) => {
        //     //     result.input(key, values[index]); // Bind dynamic parameters
        //     // });

        //     // await result.query(query);
        //     return { success: true, message: "Insert query executed successfully." };
        // }
    },
    addUpdateLayerFormData: async (req, res) => {
        const { LayerName } = req.body;
       
        console.log("Form Data:", req.body); // Check if form data is present
        console.log("Uploaded File:", req.file); // Check if the file is uploaded
     
     
        // Handle image path
        if (req.file) {
            req.body.ImagePath = `/uploads/${LayerName}/${req.file.filename}`;
        }
        
        console.log(req.body)
        try {
            if (!LayerName || !req.body) {
                throw new Error("Invalid request : data is missing.");
            }
            let checkLayerType = `EXEC spLayerMaster_GetLayerGeomType  @LayerName= '${req.body.LayerName}'`;
            checkLayerType = await executeQuery(checkLayerType)
            const { LayerType } = checkLayerType[0]
            let Geom;
            if (LayerType == 'POINT') {
                Geom = convertToPoint([[req.body.Longitude,req.body.Latitude]]);
                req.body.geom = Geom;               
            } else {
                Geom = convertToMultiLineString([[req.body.Longitude,req.body.Latitude]])
                req.body.geom = Geom;               
            }
            let message, updateQuery;
            if (req.body.qgs_fid) {
                // Perform an UPDATE operation
                req.body['ModifiedBy'] = 1;
              //  req.body.ImgPath=ImgPath;
                let data=req.body;                
                updateQuery = await executeAddUpdateLayerFormQuery(LayerName,data);
                message = "Data updated successfully.";
                return sendSuccess(res, message, updateQuery, 200)
            } else {
                // Perform an INSERT operation
                req.body.CreatedBy = 1;
             ///  req.body.ImgPath=ImgPath;
                let data=req.body;
                updateQuery = await executeAddUpdateLayerFormQuery(LayerName,data);
                message = "Data added successfully.";
                return sendSuccess(res, message, updateQuery, 201)
            }
            // let  updateQuery = await executeAddUpdateLayerQuery(LayerName, data,coordinates)

        } catch (err) {
            return sendError(res, JSON.stringify(err.stack), 500)
        }
      
    }
}
function convertToMultiLineString(coords) {
    const lines = coords.map(coord => coord.join(' ')).join(', ');
    return `MULTILINESTRING ((${lines}))`;
}
function convertToPoint(coords) {
    const lines = coords.map(coord => coord.join(' ')).join(', ');
    return `Point (${lines})`;
}
function buildDynamicWhere(filters) {
    const conditions = [];

    for (let i = 1; i <= 4; i++) {
        const key = filters[`FilterKey${i}`];
        const value = filters[`FilterKeyValue${i}`];

        if (key && value) {
            conditions.push(`${key} = '${value}'`);
        }
    }

    return conditions.length > 0 ? conditions.join(' AND ') : '1=1'; // Default to true if no filters
}