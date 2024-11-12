const {sql,getPool} = require('../helpers/dbseinst')



async function executeQuery(Query) {
    return new Promise(async(resolve,reject)=>{

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


module.exports = {executeQuery}