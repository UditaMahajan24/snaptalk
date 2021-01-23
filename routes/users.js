const express=require('express');
const router= express.Router();
const usercontroller=require('../controllers/user_controllers');
router.get('/profile',usercontroller.profile);
router.get('/sign-in',usercontroller.signIn);
router.get('/sign-up',usercontroller.signUp);
router.post('/create',usercontroller.create);







module.exports=router;
