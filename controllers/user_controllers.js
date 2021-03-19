const passport = require('passport');
const User=require('../models/user');
const fs=require('fs');
const path=require('path');


module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:"user profile",
            profile_user:user
            });
    });
}

module.exports.update=async function(req,res){
   // if(req.user.id == req.params.id)
    //{
        //User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
           // return res.redirect('back');
       // });
   // }
    //else{
      //  return res.status(401).send('unauthorized');
   // }
   if(req.user.id==req.params.id){
       try{
           let user=await User.findById(req.params.id);
           User.uploadedAvtar(req,res,function(err){
               if(err){
                   console.log('***** multer error',err);
               }
               user.name=req.body.name;
               user.email=req.body.email;
               if(req.file){
                   if(user.avtar)
                   {
                    if(fs.existsSync(path.join(__dirname,'..',user.avtar))){// checking if file actually exist or not
                       fs.unlinkSync(path.join(__dirname,'..',user.avtar));
                    }
                   }
                   user.avtar=User.avtarPath + '/' + req.file.filename;
               }
               user.save();
               return res.redirect('back');
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
module.exports.signIn=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('back');
    }
    return res.render('user_sign_in',{
    title:"user sign_in"
    });
}
// for sign up
module.exports.signUp=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('back');
    }
    return res.render('user_sign_up',{
    title:"user sign_Up"
    });
}
// for getting data of sign up 
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm)
    {
    return res.redirect('back');
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
             return res.redirect('/user/sign-in')
            });
        }
        else
        {
            return res.redirect('back');
        }
    });
}

// for getting data of sign in
module.exports.createSession=function(req,res){
    req.flash('success','Logged in successfuly');
    return res.redirect('/');
}

//for signing out
module.exports.destroySession=function(req,res){
    req.logout();
    req.flash('success','you have logged out successfuly');
    return res.redirect('/');
}




