const passport=require('passport');
const localStrategy=require('passport-local').Strategy;
const User=require('../models/user');

//authentication using passport
passport.use(new localStrategy({
    usernameField:'email',
    passReqToCallback:true
},
function(req,email,password,done){
   //find the user and establish the identity
   User.findOne({email:email},function(err,user){
       if(err)
       {
           req.flash('error',err);
           return done(err);
       }
       if(!user || user.password!=password)
       {
           req.flash('error','invalid Username/Password');
           return done(null,false);
       }
       return done(null,user);

   });
}
));

//serializing the user to decide whick key is to be kept in the cookies

passport.serializeUser(function(user,done){
    done(null,user.id)
});

//deserializing the user from the key in the cookies

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        {
            console.log('error in finding user -->passport');
            return done(err);
        }
        return done(null,user);
    });
});

//check if the user is authenticated
passport.checkAuthentication=function(req,res,next)
{
    //if the user is signed in then pass the request to the next function (controller action)
    if(req.isAuthenticated())
    {
        return next();
    }
    // if the user is not signed in
    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie we are just sending it to the local for the views
        res.locals.user=req.user;
        
    }
    next();
}

module.exports=passport;


