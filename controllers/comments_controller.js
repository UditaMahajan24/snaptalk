const Comment=require('../models/comments');
const Post=require('../models/post');
module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            },function(err,comment){
                //handle error
                if(err)
                {
                    console.log("error in creating the comment");
                    return;
                }
                post.comments.push(comment);
                post.save();
                res.redirect('/');
            });
        }
    });
}
module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user==req.user.id)
        {
        //if the user who has commented is requesting 
        let postId=comment.post;
        comment.remove();
        Post.findByIdAndUpdate(postId,{$pull:{comments:req.param.id}},function(err,post){//finding comments in post and removing it
            return res.redirect('back');
        })
        } 
        else{
            return res.redirect('back');
        }  
    });
}