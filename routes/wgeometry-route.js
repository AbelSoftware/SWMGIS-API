
const router = require('express-promise-router')();
const { WebGeometry } = require('../controllers/basecontroller');
const {userAuth,validateToken}=require('../helpers/auth')
const {uploadForLayers} = require('../helpers/multer-handler')

// Routes
router.route('/validateusersection').post(userAuth,WebGeometry.getIsUserInSection)
router.route('/getlayermasterdata').post(userAuth,WebGeometry.getlayermasterdata)
router.route('/getdropdowndata/:layername').get(userAuth,WebGeometry.getDropdownData)
router.route('/getlayerschema/:layername').get(userAuth,WebGeometry.getTableSchema)
router.route('/addupdatelayerdata').post(WebGeometry.addUpdateLayerData)
router.route('/addupdatelayerformdata').post(userAuth,uploadForLayers.single('file'),WebGeometry.addUpdateLayerFormData)
router.route('/getlayergeometrydata').post(userAuth,WebGeometry.getlayergeometrydata)


module.exports.router = router;