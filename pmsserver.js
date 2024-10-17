require('dotenv').config()
const http = require('http');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const express=require('express');
const cors=require('cors');
const path=require('path');
const morgan = require('morgan');
const route=require('./routes/baseroute');
mongoose.Promise=global.Promise;
const port=process.env.PORT;
const host=process.env.HOST;
const dbcon=require('./helpers/init_mongodb');
const connectSql = require('./helpers/dbseinst')

//const {verifyAccessToken } = require('./helpers/jwt_helper')
const app=express();
var allowedDomains = ['http://swd.mcgm.gov.in:8082/', 'http://swd.mcgm.gov.in:3000/api/'];
var corsOptions = {
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
 
    if (allowedDomains.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}
// Middleware 
app.use(morgan('dev'));
app.use(cors());

// Enable JSON and URL-encoded form data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true ,limit:'55550mb'}));
app.use(express.json( {limit: '10000mb', extended: true}));
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/imgs', express.static(path.join(__dirname, '/uploads')));
app.use('/api', route);

//test server
app.get('/', async (req, res, next)=>{  
res.send("Welcome to PMS API");
});

//Catch Error 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.stack=404;
  next(err);
})

// Error Handler Function
app.use((err, req, res, next)=>{
  const error=app.get('env') === 'development' ? err :{};
  const status=err.status || 500;

  //Responce to client
  res.status(status).json({   
    status: err.status || 500,
    message: error.message,
    data:[]   
  });

  console.log(err);
})

// listening on port
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
    connectSql.getPool()
  });