const { name } = require('ejs');
const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
//const AVTAR_PATH=path.join('/uploads/users/avtars');
const userSchema = new mongoose.Schema({
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
},
name:{
 type:String,
 required:true
},
about:{
  type:String,
},
avtar:{
    type:String
},
avtar_id:{
type:String
},
friend_request:[
  {
    type : mongoose.Schema.Types.ObjectId,
      ref : "FriendRequest"
  }
],
friend_pending:[
  {
    type : mongoose.Schema.Types.ObjectId,
      ref : "FriendRequest"
  }
],
friends : [
  {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Friendships"
  }
],
chatroom:[
  {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Chatbox"
}
]
},{
    timestamps:true
});
let storage = multer.diskStorage({
   // destination: function (req, file, cb) {
     // cb(null, path.join(__dirname,'..',AVTAR_PATH));// j
    //},
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  })

// static files
userSchema.statics.uploadedAvtar=multer({ storage: storage 
}).single('avtar');
//userSchema.statics.avtarPath=AVTAR_PATH;

const User= mongoose.model('User',userSchema);
module.exports=User;