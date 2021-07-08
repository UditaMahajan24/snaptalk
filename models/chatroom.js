const mongoose = require("mongoose");
const chatboxSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    messages:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    }],
    latest:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    }
});
const Chatbox = mongoose.model("Chatbox" , chatboxSchema);
module.exports = Chatbox;
