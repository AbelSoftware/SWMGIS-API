
const router=require('express-promise-router')();
const {uploadFile}=require('../controllers/File-controller');
const {upload} = require('../helpers/multer-handler')


// Routes

router.route('/post').post(upload.single('file'),uploadFile)


module.exports.router=router;