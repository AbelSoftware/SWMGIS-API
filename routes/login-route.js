
const router=require('express-promise-router')();
const {login,weblogin}=require('../controllers/Login-controller');


// Routes

router.route('/').post(login);
router.route('/weblogin').post(weblogin);

module.exports.router=router;