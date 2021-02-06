const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port=8000;
//using express layout
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const { Connection } = require('mongoose');
const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');// another way of writting css code
app.use(sassMiddleware({
  src:'./assests/scss',
  dest:'./assests/css',
  debug:true,
  outputStyle:'extended',
  prefix:'/css'
}));


app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assests'));
app.use(expressLayouts);
//extract style and script from sub pages in to the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// set up view engine
app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
    //todo change the secret before the product deployment
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
        {
        mongooseConnection:db,
        autoRemove:'disabled'
        },
        function(err)
        {
            console.log(err || 'connect mongo db set up ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);// to send the data of user to views page
//use express router
app.use('/', require('./routes/index'));


app.listen(port,function(err){
if(err)
{
    console.log(`Error:${err}`)
}
console.log(`server is running:${port}`);
});
