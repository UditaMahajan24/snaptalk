const express=require('express');
const router= express.Router();
const homecontroller=require('../controllers/home_controllers');
router.get('/',homecontroller.home);
router.use('/user',require('./users'));
router.use('/posts',require('./post'));
router.use('/comments',require('./comments'));
router.use('/api',require('./api'));





module.exports=router;
