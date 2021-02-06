const express=require('express');
const router= express.Router();
const passport=require('passport');
const usercontroller=require('../controllers/user_controllers');
router.get('/profile',passport.checkAuthentication,usercontroller.profile);
router.get('/sign-in',usercontroller.signIn);
router.get('/sign-up',usercontroller.signUp);
router.post('/create',usercontroller.create);
router.post('/create-session', passport.authenticate(
    'local',
   {failureRedirect:'/user/sign-in'},
),usercontroller.createSession);

router.get('/sign-out',usercontroller.destroySession);





module.exports=router;
