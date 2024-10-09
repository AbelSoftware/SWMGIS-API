
const router=require('express-promise-router')();
const {login}=require('../controllers/Login-controller');


// Routes

router.route('/').post(login)


module.exports.router=router;