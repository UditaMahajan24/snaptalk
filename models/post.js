const mongoose=require('mongoose');
const postSchema=new mongoose.Schema({
 content:{
     type:String,
     required:true
 },
 user:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'User' // schema to which we are refering
 },
 comments:[//array of comments
     {
         type:mongoose.Schema.Types.ObjectId,
         ref:'Comment'//refering to comment Schema
     }
 ]
}, {
     timestamps:true
});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;