const express=require('express');
const router= express.Router();
const homecontroller=require('../controllers/home_controllers');
const usercontroller=require('../controllers/user_controllers');
router.get('/',usercontroller.login);
router.get('/home',homecontroller.home);
router.use('/user',require('./users'));
router.use('/posts',require('./post'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));
router.use('/api',require('./api'));
router.use('/friends',require('./friends'));
module.exports=router;
