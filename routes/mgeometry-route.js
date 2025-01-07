
const router = require('express-promise-router')();
const { MGeometryLayer } = require('../controllers/basecontroller');
const {userAuth,validateToken}=require('../helpers/auth')
const {uploadForLayers} = require('../helpers/multer-handler')

// Routes
router.route('/validateusersection').post(validateToken,MGeometryLayer.getIsUserInSection)
router.route('/getlayermasterdata').post(validateToken,MGeometryLayer.getlayermasterdata)
router.route('/getdropdowndata/:layername').get(validateToken,MGeometryLayer.getDropdownData)
router.route('/getlayerschema/:layername').get(validateToken,MGeometryLayer.getTableSchema)
router.route('/addupdatelayerdata').post(MGeometryLayer.addUpdateLayerData)
router.route('/addupdatelayerformdata').post(validateToken,uploadForLayers.single('file'),MGeometryLayer.addUpdateLayerFormData)
router.route('/getlayergeometrydata').post(MGeometryLayer.getlayergeometrydata)


module.exports.router = router;