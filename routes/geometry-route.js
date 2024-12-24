
const router = require('express-promise-router')();
const { GeometryLayer } = require('../controllers/basecontroller');



// Routes

router.route('/getlayerdata').post(GeometryLayer.getlayerdata)
router.route('/updatelayerdata').post(GeometryLayer.updateGeometry)

module.exports.router = router;