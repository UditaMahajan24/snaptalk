const mongoose=require('../config/mongoose');
const Msg=require('../models/message');
const Chatbox=require('../models/chatroom');
module.exports.chatSockets = function(socketServer){
   let io=require('socket.io')(socketServer);
   io.on('connection',function(socket){
       console.log('new connection received',socket.id);
       socket.on('disconnect',function(){
        io.emit('offline',socket.id);
        console.log('connection disconnected');
      }); 
   socket.on('join_room',function(data){
       console.log('joining request received',data);
       socket.join(data.chatroom);
       const clientsInRoom =  io.in(data.chatroom).allSockets();
       const val=process.binding('util').getPromiseDetails(clientsInRoom)[1].size;
       io.in(data.chatroom).emit('user_joined',data,val);//tell all other users in the room that new user has joined
       console.log(clientsInRoom);
       Msg.find({chatroom:data.chatroom}).then(result=>{
        socket.emit('output-message',result);
    }) 
   });
    socket.on('send_message', function(data){
       const message= new Msg({
           message:data.message,
           email:data.user_email,
           chatroom:data.chatroom
       });
       Chatbox.findOneAndUpdate(
        { name: data.chatroom },
        {$set:{latest:message._id }},
         { $push: { messages: message._id }},
      ).exec();
       message.save().then(()=>{
        io.in(data.chatroom).emit('receive_message', data,message.createdAt);
       });   
});
socket.on('leave_room', function(data){
    const clientsInRoom =  io.in(data.chatroom).allSockets();
    const val=process.binding('util').getPromiseDetails(clientsInRoom)[1].size;
    io.in(data.chatroom).emit('left_room', val);
  
});
});
}
