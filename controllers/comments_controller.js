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
                if (req.xhr){
                      // Similar for comments to fetch the user's id!
                comment = await comment.populate('user', 'name').execPopulate();
    
                    return res.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "comment created!"
                    });
                }
                req.flash('success','comment added');
                res.redirect('/');
        }
    }
    catch(err){
        console.log('Error',err);
        return;
    }
}
module.exports.destroy= async function(req,res){
    try{
    let comment=await Comment.findById(req.params.id);
        if(comment.user==req.user.id)
        {
        //if the user who has commented is requesting 
        let postId=comment.post;
        comment.remove();
      let post= Post.findByIdAndUpdate(postId,{$pull:{comments:req.param.id}});//finding comments in post and removing it
            // send the comment id which was deleted back to the views
             if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            
            req.flash('success','comment deleted');
            return res.redirect('back');
        } 
        else{
            return res.redirect('back');
        }  
}
catch(err){
    req.flash('error', err);
    return;
}

}