const sql = require('mssql');

// Configuration for the MSSQL database connection
const config = {
  user: 'sa',          // Database username
  password: 'aBel2003',  // Database password
  server: '172.174.239.107',      // Server IP or hostname
  database: 'SWMGIS',      // Name of the database
  pool: {
    max: 1000,                     // Maximum number of connections in the pool
    min: 0,                      // Minimum number of connections in the pool
    idleTimeoutMillis: 30000      // Idle timeout
  },
  options: {
    encrypt: true,                // If you're connecting to Azure, you might need this
    trustServerCertificate: true, // For local dev with self-signed certs
    connectTimeout: 30000
  }
};

// Create and export the connection pool
let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
      })
      .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
      });
  }
  return poolPromise;
};

module.exports = {
  sql,
  getPool
};
