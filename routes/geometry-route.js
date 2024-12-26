
const router = require('express-promise-router')();
const { GeometryLayer } = require('../controllers/basecontroller');
const {userAuth}=require('../helpers/auth')


// Routes

router.route('/getlayerdata').post(userAuth,GeometryLayer.getlayerdata)
router.route('/updatelayerdata').post(GeometryLayer.updateGeometry)

module.exports.router = router;