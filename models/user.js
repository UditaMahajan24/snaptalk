const { name } = require('ejs');
const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVTAR_PATH=path.join('/uploads/users/avtars');
const userSchema = new mongoose.Schema({
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
name:{
 type:String,
 required:true
},
avtar:{
    type:String
}
},{
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVTAR_PATH));// j
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })


const User= mongoose.model('User',userSchema);
module.exports=User;