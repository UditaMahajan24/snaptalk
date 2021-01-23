const User=require('../models/user');

module.exports.profile=function(req,res){
    return res.render('user_profile',{
    title:"user profile"
    });
}

// for sign in
module.exports.signIn=function(req,res){
    return res.render('user_sign_in',{
    title:"user sign_in"
    });
}
// for sign up
module.exports.signUp=function(req,res){
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
}










