
const router=require('express-promise-router')();
const {uploadFile,updateToiletMaster}=require('../controllers/File-controller');
const {upload,uploadForTiolet} = require('../helpers/multer-handler')


// Routes

router.route('/post').post(upload.single('file'),uploadFile)
router.route('/updateToiletrecord').post(uploadForTiolet.single('file'),updateToiletMaster)


module.exports.router=router;