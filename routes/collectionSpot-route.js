
const router=require('express-promise-router')();
const { apiQuery,RawQuery } = require('../controllers/dbCommonApi');
const {updateLatLong,getRouteSpot,getAllLayersTable,getSpecificLayer, InsertLayer, updateSpecificLayer}=require('../controllers/RouteMaster-controller');


// Routes

router.route('/updatelatlong').put(updateLatLong)
router.route('/getRouteAndSpotByWard').get(getRouteSpot)
router.route('/getAllLayersTable').get(getAllLayersTable)
router.route('/getSpecificLayer').get(getSpecificLayer)
router.route('/insertLayer').post(InsertLayer)
router.route('/updateLayer').put(updateSpecificLayer)
router.route('/dbQuery').post(apiQuery)
router.route('/rawQuery').post(RawQuery)


module.exports.router=router;