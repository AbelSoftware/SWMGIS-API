const { sql, getPool } = require('../helpers/dbseinst')



async function executeQuery(Query) {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to the database
            let pool = await getPool()

            // Execute your stored procedure or query
            let result = await pool.request()
                .query(Query);

            // console.log(result);  // Result contains the returned rows

            resolve(result.recordset)
        } catch (err) {
            console.error('SQL error', err);
            reject(err)
        }

    })

}

async function executeAddUpdateLayerQuery(LayerName, data, coordinates) {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to the database
            let pool = await getPool()
           
            const keys = Object.keys(data); // ["id", "layer_name", "column_name", "display_value"]
            const values = Object.values(data); // [47, "Layer_collectionSpot", "Segregation_done", "Yes"]

            // Check if "id" exists in the data to determine whether to INSERT or UPDATE
            if (data.qgs_fid) {
                // Create a dynamic UPDATE query
                const setClauses = keys
                    .filter((key) => key !== "qgs_fid") // Exclude "qgs_fid" from SET clause
                    .map((key) => `${key} = @${key}`) // Generate "column = value" for each key
                    .join(", ");

                const query = ` UPDATE ${LayerName}
                                SET ${setClauses}
                                WHERE qgs_fid = @qgs_fid;
                              `;
                console.log("Generated UPDATE Query:", query);
                
                // Assuming `Pool` is your database connection pool
                // Execute the query               
                const result = await pool.request();
                keys.forEach((key, index) => {
                    result.input(key, values[index]); // Bind dynamic parameters
                });

                let res = await result.query(query);
                resolve(res.recordset)
                // return { success: true, message: "Update query executed successfully." };
            } else {
                // Create a dynamic INSERT query
                const columns = keys.join(", "); // "id, layer_name, column_name, display_value"
                const placeholders = keys.map((key) => `@${key}`).join(", "); // "@id, @layer_name, @column_name, @display_value"

                const query = `
                              INSERT INTO ${LayerName} (${columns})
                              VALUES (${placeholders});
                            `;

                console.log("Generated INSERT Query:", query);

                // Example: Running the query using a SQL library (e.g., mssql)
                // const pool = await sql.connect("your-connection-string");
                const result = await pool.request();
                keys.forEach((key, index) => {
                    result.input(key, values[index]); // Bind dynamic parameters
                });

                let res = await result.query(query);
                resolve(res.recordset)
                // return { success: true, message: "Insert query executed successfully." };
            }

            // resolve(result.recordset)
        } catch (err) {
            console.error('SQL error', err);
            reject(err)
        }

    })

}

async function executeAddUpdateLayerFormQuery(LayerName, data) {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to the database
            let pool = await getPool()         
            const keys = Object.keys(data); // ["id", "layer_name", "column_name", "display_value"]
            const values = Object.values(data); // [47, "Layer_collectionSpot", "Segregation_done", "Yes"]
          
            // Check if "id" exists in the data to determine whether to INSERT or UPDATE
            if (data.qgs_fid) {
                // Create a dynamic UPDATE query
                const setClauses = keys
                    .filter((key) => key !== "qgs_fid" && key !== "LayerName"  && key !== "Latitude"  && key !== "Longitude") // Exclude "qgs_fid" from SET clause
                    .map((key) => `${key} = @${key}`) // Generate "column = value" for each key
                    .join(", ");

                const query = ` UPDATE ${LayerName}
                                SET ${setClauses}
                                WHERE qgs_fid = @qgs_fid;
                              `;
                console.log("Generated UPDATE Query:", query);
                
                // Assuming `Pool` is your database connection pool
                // Execute the query               
                // const result = await pool.request();
                // keys.forEach((key, index) => {
                //     result.input(key, values[index]); // Bind dynamic parameters
                // });

                // let res = await result.query(query);
                resolve()
                // return { success: true, message: "Update query executed successfully." };
            } else {
                // Create a dynamic INSERT query
                const columns = keys 
                               .filter((key) => key !== "qgs_fid" && key !== "LayerName"  && key !== "Latitude"  && key !== "Longitude") // Exclude "qgs_fid" from SET clause                             
                               .join(", "); // "id, layer_name, column_name, display_value"
                const placeholders = keys
                                    .filter((key) => key !== "qgs_fid" && key !== "LayerName"  && key !== "Latitude"  && key !== "Longitude") // Exclude "qgs_fid" from SET clause                             
                                    .map((key) => `@${key}`).join(", "); // "@id, @layer_name, @column_name, @display_value"

                const query = `
                              INSERT INTO ${LayerName} (${columns})
                              VALUES (${placeholders});
                            `;

                console.log("Generated INSERT Query:", query);

                // Example: Running the query using a SQL library (e.g., mssql)
                // const pool = await sql.connect("your-connection-string");
                // const result = await pool.request();
                // keys.forEach((key, index) => {
                //     result.input(key, values[index]); // Bind dynamic parameters
                // });

                // let res = await result.query(query);
                resolve()
                // return { success: true, message: "Insert query executed successfully." };
            }

            // resolve(result.recordset)
        } catch (err) {
            console.error('SQL error', err);
            reject(err)
        }

    })

}

module.exports = { executeQuery, executeAddUpdateLayerQuery ,executeAddUpdateLayerFormQuery}