const Like=require('../models/like');
const Post=require('../models/post');
const Comment=require('../models/comments');

module.exports.toggleLike = async function(req,res){
    try{
      
        //likeable/toggle/?id=abcde&&type=Post
        let likeable;
        let deleted=false;
        if(req.query.type=='Post')
        {
                likeable=(await Post.findById(req.query.id)).populate('likes');
        }
        else{
            likeable=(await Comment.findById(req.query.id)).populate('likes')
        }
        //check if like exist
        let existinglike=await Like.findOne({
          likeable:req.query.id,
          onModel:req.query.type,
          user:req.user._id
        });
        //delete the existing like
        if(existinglike){
            likeable.likes.pull(existinglike._id);
            likeable.save();
            existinglike.remove();
            deleted =true;
        }
        else
         {
        let newlike=await Like.create({
            likeable:req.query.id,
          onModel:req.query.type,
          user:req.user._id
        });
        likeable.likes.push(newlike._id);
        likeable.save();
         }
        
      return res.json(200,{
          message:"request successful",
          data:{
            deleted:deleted
          }
      });

 }
    catch(err){
        console.log(err);
        return res.json(500,{
            message:'Internal server error'
        });
    }
}