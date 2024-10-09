const express=require('express');
const router=require('express-promise-router')();
const collectionSpot = require('./collectionSpot-route').router

const UserRoute = require('./login-route').router


 router.use('/collectingSpot', collectionSpot);
 router.use('/login',UserRoute );
 
module.exports=router;