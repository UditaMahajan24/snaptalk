const passport = require('passport');
const User=require('../models/user');

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:"user profile",
            profile_user:user
            });
    });
}

module.exports.update=function(req,res){
    if(req.user.id == req.params.id)
    {
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        });
    }
    else{
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
    return res.redirect('/');
}

//for signing out
module.exports.destroySession=function(req,res){
    req.logout();
    return res.redirect('/');
}




