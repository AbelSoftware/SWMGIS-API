
const router = require('express-promise-router')();
const { User } = require('../controllers/basecontroller');
const {userAuth,validateToken}=require('../helpers/auth')
const {uploadForLayers} = require('../helpers/multer-handler')

// Routes
router.route('/validateusersection').post(validateToken,User.getIsUserInSection)
router.route('/resetpassword').post(validateToken,User.resetUserPassword)



module.exports.router = router;