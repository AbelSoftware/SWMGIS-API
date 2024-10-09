
const router=require('express-promise-router')();
const {updateLatLong,getRouteSpot,getAllLayersTable,getSpecificLayer, InsertLayer, updateSpecificLayer}=require('../controllers/RouteMaster-controller');


// Routes

router.route('/updatelatlong').put(updateLatLong)
router.route('/getRouteAndSpotByWard').get(getRouteSpot)
router.route('/getAllLayersTable').get(getAllLayersTable)
router.route('/getSpecificLayer').get(getSpecificLayer)
router.route('/insertLayer').post(InsertLayer)
router.route('/updateLayer').put(updateSpecificLayer)


// router.route('/:assetid')
// .get(assetController.getAssetById)
// .put(assetController.replaceAsset)
// .patch(assetController.updateAsset);



module.exports.router=router;