const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const User=require('../models/user');
require('dotenv').config();
let opt={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:'codeial'
}
passport.use(new JWTStrategy(opt,function(jwtPayLoad,done){
User.findById(jwtPayLoad._id,function(err,user){
    if(err){
        console.log('Error in finding user from jwt');
        return;
    }
    if(user)
    {
        return done(null,user);
    }
    else{
        return done(null,false);
    }
});
}));

module.export=passport;
