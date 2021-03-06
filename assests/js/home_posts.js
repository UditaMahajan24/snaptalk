{
    //method to submit form data for new post using ajax
    let createPost=function(){
        let newPostForm = $('#new-post-form');
          
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                  type:'post',
                  url:'/posts/create',
                  data:newPostForm.serialize(),
                  success:function(data){
                      let newPost = newPostDom(data.data.post);
                      deletePost($(' .delete-post-button',newPost));// way to send link
                      $('#posts-list-container>ul').prepend(newPost);
                      // call the create comment class
                    new PostComments(data.data.post._id);
                      new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                  },error:function(error){
                      console.log(error.responseText);
                  }
            });
        });
    }
    // method to create a post in dom
    let newPostDom=function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>  
            </small>
        ${ post.content}
        <br>
        <small>
        ${post.user.name}
    </small>
    
    </p>
    <div class="post-comments">
        <form action="/comments/create" method="POST" id="post-${post._id}-comments-form">
            <input type="text" name="content" placeholder="Type Here to add comments..." required>
            <input type="hidden" name="post" value="${post._id}">
             <input type="submit" value="Addcomments">
        </form>
        <div class="post-comments-list">
             <ul id="post-comments-${post._id}">
                  
             </ul>
        </div>
    </div>
    </li>`)
    }
 // method to delete the post from dom
 let deletePost=function(deleteLink){
     $(deleteLink).click(function(e){
         e.preventDefault();
         $.ajax({
             type:'get',
             url:$(deleteLink).prop('href'),
             success:function(data){
                 $(`#post-${data.data.post_id}`).remove();
                 new Noty({
                    theme: 'relax',
                    text: "Post deleted!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
             }
         })
     })
 }
 

// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
let convertPostsToAjax = function(){
    $('#posts-list-container>ul>li').each(function(){
        let self = $(this);
        let deleteButton = $(' .delete-post-button', self);
        deletePost(deleteButton);

        let postId = self.prop('id').split("-")[1];// to get id from self
        new PostComments(postId);
        // console.log( "value of this is",this);
        // let deleteButton = $(' .delete-post-button', this);
        // deletePost(deleteButton);

    });
}

    createPost();
    convertPostsToAjax();
}

