const express=require('express');
const router=require('express-promise-router')();
const collectionSpot = require('./collectionSpot-route').router

const LoginRoute = require('./login-route').router
const FileRoute = require('./File-route').router
const mgeomroute=require('./mgeometry-route').router
const UserRoute=require('./user-route').router
const WebGeometryRoute=require('./wgeometry-route').router

 router.use('/collectingSpot', collectionSpot);
 router.use('/login',LoginRoute );
 router.use('/file',FileRoute );
 router.use('/mgeometry',mgeomroute );
 router.use('/user',UserRoute);
 router.use('/webgeometry',WebGeometryRoute);
module.exports=router;