const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port=8000;
//using express layout
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assests'));
app.use(expressLayouts);
//extract style and script from sub pages in to the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
//use express router
app.use('/', require('./routes/index'));

// set up view engine
app.set('view engine','ejs');
app.set('views','./views');


app.listen(port,function(err){
if(err)
{
    console.log(`Error:${err}`)
}
console.log(`server is running:${port}`);
});
