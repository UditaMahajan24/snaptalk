const Post= require('../models/post');
const fs=require('fs');
const path=require('path');
const { type } = require('os');
const Comment=require('../models/comments');
const Like=require('../models/like');
const { findById } = require('../models/post');
const cloudinary=require('../config/cloud');

module.exports.create_post=async function(req,res){
    return res.render('post_create',{
        title:"codeial/post-create",
    });
}

module.exports.create= async function(req,res){
    try{
     var mime,typeofPost;
     Post.upload(req,res,async function(err){
        try{
        
    if(err){
        console.log("Post multer error");
    }
    else
    {
     if(req.file!=undefined){
         mime=req.file.mimetype;
     }
     if(mime.includes('video')){
         typeofPost="Video";
     }
     else{
         typeofPost="Image";
     };
 }
 const post_result = await cloudinary.uploader.upload(req.file.path);
   console.log("post_rsult is",post_result);
  let post=await Post.create({
    content:req.body.content,
    typepv:typeofPost,
    user:req.user,
    postPath:post_result.secure_url,
    postid:post_result.public_id
});
return  res.redirect("/home");   
}catch(err){
    console.log("error on cloud post is",err);
}
});
     }
     catch(err){
        console.log("error on post is",err);
    }
}
// to delete a post created by a user
module.exports.destroy=async function(req,res){
    try{
   let post= await Post.findById(req.params.id);
        if(post.user==req.user.id)
        {
            await Like.deleteMany({likeable:post,onModel:'Post'});
            await Like.deleteMany({likeable:{$in:post.comments},onModel:'Comment'});// delete likes associated with comments
            await Comment.deleteMany({post:req.params.id});
            if(post.repost==true){
                await cloudinary.uploader.destroy(post.postid);   
            } 
            post.remove();
            if(req.xhr)
            {

                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"post deleted successfully"
                });
            }
            req.flash('success','post deleted');
                return res.redirect('back');
        }
        else
        {
            return res.redirect('back');
        }
}

catch(err){
    return res.json(500,{
        message:'error in deleting post'
    });
}
}
module.exports.repost= async function(req,res){
    let post=await Post.findById(req.params.id);
    let new_post=await Post.create({
        content:post.content,
        typepv:post.typepv,
        user:req.user,
        postPath:post.postPath,
        repost:false
    });
    req.flash('success','Post Created');
    return res.redirect('/home'); 
}