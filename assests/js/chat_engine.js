class chatEngine{
    constructor(chatBoxId,userEmail,chatroom)
    {
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.chatroom=chatroom;
        this.socket=io.connect('https://snap-talk.herokuapp.com/',{transports: ['websocket', 'polling', 'flashsocket']});
        if(this.userEmail)
        this.connectionHandler();
    }
    getTime=function(date){
       console.log("date is",date);
       let dateobj=new Date(date);
       console.log("indian time is"+dateobj.toString());
       let time=dateobj.toString().substring(16,21);
       return time;
   }
    connectionHandler(){
        let self=this;
        this.socket.on('connect',function(){
            console.log('connection established using sockets');
            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:self.chatroom
            });
            self.socket.on('offline',function(val){
                console.log("request received to go offline");
                self.socket.emit('leave_room',{
                    chatroom:self.chatroom
                })

            });
            self.socket.on('left_room',function(val){
                if(val<2){
                    $('#name div').empty() 
                }
            })
            self.socket.on('user_joined',function(data,val){
                console.log('a user joined',data);
                if(val==2){
                    $('#name').append($('<div>', {
                        'html':"online"
                    }));  
                }
            });
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: self.chatroom
                });
            }
        });
        self.socket.on('output-message', function(data,val){
            console.log("data is",val);
            if(data.length){
              data.forEach(element => {
                  let time=self.getTime(element.createdAt);
                  if(time.substring(0,3)>="13")
                  {     
                      let ans=time.substring(0,2);
                      time=eval(ans+"-12")+time.substring(2,5)+"pm";
                  }
                  else{
                    if(time.substring(0,3)>="12"){
                        time=time+"pm";
                    }
                    else{
                      time=time+"am";
                    }
                  }
                let newMessage = $('<li>');
                let messageType = 'other-message';
    
                if (element.email == self.userEmail){
                    messageType = 'self-message';
                }
                newMessage.append($('<span>', {
                    'html': element.message+'<br><sub>'+time+'</sub>'
                }));
                newMessage.addClass(messageType);
    
                $('#chat-messages-list').append(newMessage); 
                $('#chat-messages-list').scrollTop($('#chat-messages-list')[0].scrollHeight);
              });    
            }
        });
        self.socket.on('receive_message', function(data,latestTime){
            let dateobj=new Date(latestTime);
            console.log("latest time is",dateobj.toString());
            let time=dateobj.toString().substring(16,21);
            if(time.substring(0,3)>="13")
                  {     
                      let ans=time.substring(0,2);
                      time=eval(ans+"-12")+time.substring(2,5)+"pm";
                  }
                  else{
                    if(time.substring(0,3)>="12"){
                        time=time+"pm";
                    }
                    else{
                      time=time+"am";
                    }
                  }
                  console.log("new time in list iss",time);
                  
            let newMessage = $('<li>');
            let messageType = 'other-message';
            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }
            newMessage.append($('<span>', {
                'html': data.message+'<br><sub>'+time+'</sub>'
            }));
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            $('#chat-messages-list').animate({scrollTop: $('#chat-messages-list').prop("scrollHeight")}, 500);
        });
    }
}