const User=require('../models/user');
const Friendships=require('../models/friendship');
const Chatbox=require('../models/chatroom');
const Message=require('../models/message');
const FriendRequest=require('../models/friendrequest');
module.exports.friend_add=async function(req,res)
{
    try{
    let value=req.query.id.split("/");
    let User1= await User.findById(req.user);
    let User2=await User.findById(value[0]);
    let newFriend=await Friendships.create({
        to_user : req.user._id,
        from_user : value[0]
    });
    let newRoom=await Chatbox.create({
        name:User2.id+User1.id
    });
    let friend_request=await FriendRequest.findById(value[1]);
    User2.friends.push(newFriend);
    User2.chatroom.push(newRoom);
    User1.friends.push(newFriend);
    User1.chatroom.push(newRoom);
    User1.friend_request.pull(friend_request);
    User2.friend_pending.pull(friend_request);
    User2.save();
    User1.save();
    friend_request.remove();
    return res.redirect('back');
}
catch(err){
    req.flash('error',err);
    return res.redirect('/home');
}
}
module.exports.friends_remove=async function(req,res)
{
    let value=req.query.id.split("/");
    console.log(req.query.id);
    try{
    let existingFriendship = await Friendships.findOne({
        from_user : req.user,
        to_user : value[0],
    });
    if(!existingFriendship)
    {
    existingFriendship = await Friendships.findOne({
        from_user : value[0],
        to_user : req.user
    }); 
}
    let User1= await User.findById(req.user);
    let User2=await User.findById(value[0]);
    let chatname=value[1];
        let chat= await Chatbox.findOne({name:chatname});
       User2.chatroom.pull(chat._id);
       User1.chatroom.pull(chat._id);
       User2.friends.pull(existingFriendship._id);
       User1.friends.pull(existingFriendship._id);
       User2.save();
       User1.save();
       existingFriendship.remove();
       chat.remove();
       let message=await Message.deleteMany({chatroom:chatname});
    return res.redirect('back');
}
catch(err){
    console.log(err);
    return res.json(500,{
        message:'Internal server error'
    });
}
}
module.exports.friendrequest=async function(req,res){
    try{
    let newFriendRequest=await FriendRequest.create({
        from_user : req.user._id,
        to_user:req.query.id

    });
    let user = await User.findById(req.query.id)
    user.friend_request.push(newFriendRequest);
    user.save();
    let user1=await User.findById(req.user._id)
    user1.friend_pending.push(newFriendRequest);
    user1.save();
    return res.redirect('back');
}
catch(err){
    console.log(err);
    return res.json(500,{
        message:'error in creating friend'
    });
}
}

module.exports.displayrequest=async function(req,res)
{
    try{
    let user = await User.findById(req.user.id)
      .populate({
        path: "friend_request",
        populate: {
        path: "from_user",
        },
       })
       return res.render('friendRequest',{
        title:"codeial/friendrequest",
        user:user
    });
}
catch(err){
    console.log(err);
    return res.json(500,{
        message:'error in displaying friend'
    });
}
}
module.exports.deleterequest=async function(req,res)
{
    try{
    let value=req.query.id.split("/");
    let user= await User.findById(req.user);
    let user2=await User.findById(value[0]);
    let friend_request=await FriendRequest.findById(value[1]);
    user.friend_request.pull(friend_request);
    user2.friend_pending.pull(friend_request);
    user.save();
    user2.save();
    friend_request.remove();
    return res.redirect('back');
    }
    catch(err){
        console.log(err);
        return res.json(500,{
            message:'error in deleting request'
        });
    } 
}
module.exports.display_friends=async function(req,res)
{
    let chatroom=await Chatbox.find({})
     .sort({"latest":-1})
    let user= await User.findById(req.user._id)
     .populate({
        path: "friends",
        populate: {
        path: "from_user",
        populate:{
            path:"chatroom"
        }
        },
       })
      .populate({
      path: "friends",
       populate: {
        path: "to_user",
        populate:{
            path:"chatroom"
        }
      },
    })
   return  res.render('my_friends',{
        title:"friends",
        user:user,
        chatroom:chatroom
    })
}
module.exports.chatroom=async function(req,res){
    let user=await User.find({});
    ans=req.query.name.split("/");
    return res.render('chat_box',{
        title:"codeial/chat",
        name:ans[0],
        chatroom:ans[1]
    });
}