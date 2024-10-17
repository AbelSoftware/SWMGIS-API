const express=require('express');
const router=require('express-promise-router')();
const collectionSpot = require('./collectionSpot-route').router

const UserRoute = require('./login-route').router
const FileRoute = require('./File-route').router


 router.use('/collectingSpot', collectionSpot);
 router.use('/login',UserRoute );
 router.use('/file',FileRoute );

 
module.exports=router;