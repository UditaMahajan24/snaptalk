const { Router } = require('express');
const express=require('express');
const router=express.Router();
const passport=require('passport');

const commentsController=require('../controllers/comments_controller');
router.post('/create',passport.checkAuthentication,commentsController.create);
router.get('/destroy/:id',passport.checkAuthentication,commentsController.destroy);//destroying the comment
router.get('/display/:id',commentsController.display);
module.exports=router;