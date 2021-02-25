const Comment=require('../models/comments');
const Post=require('../models/post');
module.exports.create= async function(req,res){
    try{
   let post=await  Post.findById(req.body.post);
        if(post){
         let comment= await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
                post.comments.push(comment);
                post.save();
                req.flash('success','comment added');
                res.redirect('/');
        }
    }
    catch(err){
        console.log('Error',err);
        return;
    }
}
module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user==req.user.id)
        {
        //if the user who has commented is requesting 
        let postId=comment.post;
        comment.remove();
        Post.findByIdAndUpdate(postId,{$pull:{comments:req.param.id}},function(err,post){//finding comments in post and removing it
            req.flash('success','comment deleted');
            return res.redirect('back');
        });
        } 
        else{
            return res.redirect('back');
        }  
    });
}