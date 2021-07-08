const Comment=require('../models/comments');
const Post=require('../models/post');
const Like=require('../models/like');
const commentMailer=require('../mailers/comments_mailer');
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
                comment = await comment.populate('user', 'name email').execPopulate();
                commentMailer.newcomment(comment);
                return res.json(200,{
                    message:"request successful",
                    data:{
                      comment:comment
                    }
                });

                req.flash('success','comment added');
                res.redirect('/home');
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
        let postId=comment.post;
        //the person who did the comment + on whose post it has been done
        if(comment.user==req.user.id || post.user==req.user.id){

            // destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            let post =await Post.findByIdAndUpdate(postId, {
                $pull: { comments: req.params.id },
            });

            comment.remove();
            post.save();

            req.flash('success','Comment deleted!');
            return res.redirect('/home');  
        }
        else{
            req.flash('error','You cannot deleted this');
            return res.redirect('/home');
        }

    }catch(err){
            req.flash('error',err);
            return res.redirect('/home');
    }

}
module.exports.display=async function(req,res){
  try{
    let post=await Post.findById(req.params.id)
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
    });
    return res.render('comment',{//await3
        title:"codeial/comment",
        post:post,
      });  
    }
    catch(err){
      req.flash('error',err);
      return res.redirect('/home');
}
}