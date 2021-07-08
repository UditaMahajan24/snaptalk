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
  .sort("-createdAt")
  .populate("user")
  .populate({
    path: "comments",
    populate: {
      path: "user",
    },
  })
  .populate({
    path: "comments",
    populate: {
      path: "likes",
    },
  }).populate('likes');
  let user=await User.findById(req.user.id)
        .populate({
            path:'friends',
            populate:{
                path:'to_user'
            }
        })
        .populate({
            path:'friends',
            populate:{
                path:'from_user'
            }
        });

        var friend=[];
        friend[0]=req.user.name;
        var i=1;
        for(friends of user.friends){ 
            if((req.user.id == friends.from_user.id || friends.to_user.id ==req.user.id)){
                    if(friends.from_user.id == user.id) {
                        friend[i]=friends.to_user.name;
                        i++;
                    }
                 
                    if(friends.to_user.id == user.id) {
                        friend[i]=friends.from_user.name;
                        i++;
                    }
            }
        }

  return res.render('home',{//await3
    title:"codeial/home",
    posts:posts,
    user:user,
    friendlist:friend
  });   
}
catch(err){
  return res.json(500,{
    message:'error in rendering home page'
});
}
}
