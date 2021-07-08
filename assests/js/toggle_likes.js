// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            console.log(self);

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                let clas =$(self).innerHtml;
                console.log("class is",clas);
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    $(self).attr('data-likes', likesCount);
               $(self).html("<i class='fa fa-heart-o fa-lg ' aria-hidden='true' style='font-weight:bolder;'></i>"+`${likesCount}&nbsp`);
                    
                }else{
                    likesCount += 1;
                    $(self).attr('data-likes', likesCount);
               $(self).html("<i class='fa fa-heart fa-lg ' aria-hidden='true' style='color:red;'></i>"+`${likesCount}&nbsp`);
                }
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        });
    }
}
