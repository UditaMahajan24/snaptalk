const Post=require('../models/post');
const User=require('../models/user');
/*module.exports.home=function(req,res){// home is function name
    //console.log(req.cookies);
    //res.cookie('user_id',25);
   // Post.find({},function(err,posts){
        //return res.render('home',{
          // title:"codeial/home",
            //posts:posts
    //});
   // });
            //populate the user of each post
    Post.find({})
    .populate('user')
    .populate({
    path:'comments',
    populate:
    {path:'user'}
    })
    .exec(function(err,posts){
       User.find({},function(err,users){// to find all users in user schema
        return res.render('home',{
            title:"codeial/home",
            posts:posts,
            all_users:users// putting all users in all_users
        });
       });
    });

};*/

//method2 async wait
module.exports.home= async function(req,res){
try{
  let posts=await Post.find({}) //await 1
    .sort('-createdAt')
    .populate('user')
    .populate({
    path:'comments',
    populate:
    {path:'user'}
    });
  
  let users= await User.find({});// to find all users in user schema (await2)
  return res.render('home',{//await3
    title:"codeial/home",
    posts:posts,
    all_users:users// putting all users in all_users
  });   
}
catch(err){
console.log('Error',err);
return;
}
}