function toggleFriend(toggleFriendBtn ,pending){
    console.log(toggleFriendBtn);
    console.log($(toggleFriendBtn));
    $(toggleFriendBtn).click(function(){
                    $(this).hide();
    }
    );
}
toggleFriend($(".toggle-friend-btn , .pending"));