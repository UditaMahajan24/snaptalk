const passport = require('passport');
const User=require('../models/user');
const friendship=require('../models/friendship');
const chatbox=require('../models/chatroom');
const Post=require('../models/post');
const AccessToken=require('../models/accesstoken');
const crypto=require('crypto');
const passwordMailer=require('../mailers/reset_password');
const fs=require('fs');
const path=require('path');
const cloudinary=require('../config/cloud');

module.exports.login=async function(req,res)
{
    try{
    res.render('Login_form',{
        title:"login page",
        deleted:true
    });
}
catch(err)
{
    return;
}
}
module.exports.profile= async function(req,res){
   let loguser=await User.findById(req.user._id)
   .populate({
       path:"friend_pending",
       populate:{
        path: "to_user", 
       }
   })
   let user= await User.findById(req.params.id)
     .populate("chatroom")
     .populate({
      path: "friends",
      populate: {
      path: "from_user",
      },
     })
    .populate({
    path: "friends",
     populate: {
      path: "to_user",
    },
  })
  let posts=await Post.find({}) //await 1
  .sort("-createdAt")
  .populate("user")
        return res.render('user_profile',{
            title:"user profile",
            profile_user:user,
            logged_user:loguser,
            posts:posts
            });
}

module.exports.profile_update=async function(req,res)
{
    let user=await User.findById(req.params.id);
    res.render('update_profile',{
        title:"profile_update",
        user:user
    });
}
module.exports.update=async function(req,res){
   if(req.user.id==req.params.id){
       try{
           let user=await User.findById(req.params.id);
           console.log("update the information",user.avtar_id);
           User.uploadedAvtar(req,res, async function(err){
               if(err){
                   console.log('***** multer error',err);
               }
               user.name=req.body.name;
               user.email=req.body.email;
               user.about=req.body.about;
               if(req.file){
                  // if(user.avtar)
                   //{
                    //if(fs.existsSync(path.join(__dirname,'..',user.avtar))){// checking if file actually exist or not
                      // fs.unlinkSync(path.join(__dirname,'..',user.avtar));
                   // }
                   //}
                   const avtar_result =  await cloudinary.uploader.upload(req.file.path);
                   if(user.avtar_id!=undefined){
                    await cloudinary.uploader.destroy(user.avtar_id);   
                } 
                    user.avtar=avtar_result.secure_url;
                    user.avtar_id=avtar_result.public_id;
                   //user.avtar=User.avtarPath + '/' + req.file.filename;
               }
              await user.save();
               return res.redirect('/user/profile/'+req.params.id);
           });
       }
       catch(err){
             req.flash('error',err);
             return res.redirect(' back');
       }
   }
   else{
       req.flash('error','Unauthorized');
      return res.status(401).send('unauthorized');
  }

}

// for sign in
//module.exports.signIn=function(req,res){
    //if(req.isAuthenticated())
   // {
       // return res.redirect('back');
    //}
    //return res.render('user_sign_in',{
    //title:"user sign_in"
    //});
//}
// for sign up
//module.exports.signUp=function(req,res){
    //if(req.isAuthenticated())
    //{
        //console.log("yes req is authenticated");
        //return res.redirect('back');
   // }
    //console.log("rendering page");
    //return res.render('user_sign_up',{
    //title:"user sign_Up"
    //});
//}
// for getting data of sign up 
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm)
    {
     return res.render('Login_form',{
         title:"login page",
         deleted:"false"
     });
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err)
        {
            console.log("error in finding the user in signing up");
            return
        }
        if(!user)
        {
            User.create(req.body,function(err,user){
                if(err){
              console.log("error in creating  the user while signing up");
               return
             }
              return res.render('Login_form',{
                title:"login page",
                deleted:"true"
            });
            });
        }
        else
        {
            return res.render('Login_form',{
                title:"login page",
                deleted:"true"
            }); 
        }
    });
}

// for getting data of sign in
module.exports.createSession=async function(req,res){
    req.flash('success','Logged in successfuly');
    try{
    let user= await User.findOne({email: req.body.email});
    console.log(user);
    if(user.about==undefined){
      return res.redirect('/user/Profile-Update/'+req.user._id);
    }
    else
    {
    return res.redirect('/home');
    }
}
catch(err)
{
    console.log("error in google",err);
    return;
}
}

//for signing out
module.exports.destroySession=function(req,res){
    req.logout();
    req.flash('success','you have logged out successfuly');
    return res.redirect('/');
}
module.exports.verify=async function(req,res){
    try{
   const user = await User.findOne({email:req.body.email});
        if(!user)
        {
            console.log("user not found");
            return   
        }
        let token = await AccessToken.findOne({ user: user._id });
  if (token) await AccessToken.deleteOne();
  let resetToken = crypto.randomBytes(32).toString("hex");
  let accesstoken= await AccessToken.create({
    token: resetToken,
    user: user._id,
    isValid:true
});
console.log(accesstoken);
  accesstoken = await accesstoken.populate('user','email').execPopulate();
  console.log(accesstoken.user.email);
  passwordMailer.newpassword(accesstoken);
  res.render('mailsend',{
    title:"mail send",
    });
}
catch(err){
    console.log("error is",err);
    return res.redirect(' back');
}
};
module.exports.findUser= async function(req,res){
    var searchfriend = req.body.friendname;

    let result=await User.find({name:{

        $regex: new RegExp('^'+searchfriend, "ig")

     }}); 
     return res.render('search',{
        title:"Search",
        result: result
    });
}
module.exports.check=function(req,res){
    return res.render('email_verify',{
        title:"verify email"
        });
}
module.exports.resetPassword=async function(req,res){
    if(req.body.newPassword != req.body.confirmPassword)
    {
    return res.redirect('back');
    }
    let passwordResetToken =await AccessToken.findOne(AccessToken.findOne({ token: req.params.accessToken }));
    if (!passwordResetToken || passwordResetToken.isValid==false) {
        console.log("wrong");
        return res.redirect('back');
      }
      passwordResetToken  = await passwordResetToken.populate('user').execPopulate(); 
       passwordResetToken.user.password=req.body.newPassword;
       console.log("password",passwordResetToken.user.password);
      await passwordResetToken.user.save();
      await passwordResetToken.updateOne({isValid:false});
     console.log(passwordResetToken.isValid);
     req.flash('success','Password changed');
      return res.redirect('/');
}
module.exports.resetPage=function(req,res){
    console.log(req.query.accessToken);
    return res.render('reset_password',{
        title:"reset password",
        accesstoken:req.query.accessToken
        });
}