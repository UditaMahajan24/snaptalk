const mongoose=require('mongoose');
const LikeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
    },
    //this define the objectid of liked object
    likeable:{
        type:mongoose.Schema.ObjectId,
        required:true,
        refPath:'onModel'
    },
    //this field is used for defining the typr of the liked object since this is a dynamic reference
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},{
    timestamps:true
});
const Like=mongoose.model('Like',LikeSchema);
module.exports=Like;