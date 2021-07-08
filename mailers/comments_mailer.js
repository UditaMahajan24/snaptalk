const nodemailer=require('../config/nodemailer');
// this is another way of exporting method

exports.newcomment=(comment)=>{
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');// comment:comment is sending data to ejs template
    nodemailer.transporter.sendMail({
        from:'uditamahajan24@gmail.com',
        to:comment.user.email,
        subject:'new comment published',
        html:htmlString

    },(err,info)=>{
         if(err){
             console.log('error in sending mail',err);
             return;
         }
         console.log('Message sent',info);
         return;
    });
}