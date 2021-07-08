const express=require('express');
const router= express.Router();
const passport=require('passport');
const usercontroller=require('../controllers/user_controllers');
router.get('/profile/:id',usercontroller.profile);
router.post('/update/:id',passport.checkAuthentication,usercontroller.update);
router.get('/Profile-Update/:id',passport.checkAuthentication,usercontroller.profile_update);
//router.get('/sign-in',usercontroller.signIn);
//router.get('/sign-up',usercontroller.signUp);
router.post('/create',usercontroller.create);
router.post('/create-session', passport.authenticate(
    'local',
   {failureRedirect:'/'},
),usercontroller.createSession);

router.get('/sign-out',usercontroller.destroySession);
router.post('/search',usercontroller.findUser);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));// route to ask info from user
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),usercontroller.createSession);
router.get('/check',usercontroller.check);
router.post('/verify',usercontroller.verify);
router.get('/reset-password',usercontroller.resetPage);
router.post('/forgotpassword/:accessToken',usercontroller.resetPassword);
module.exports=router;
