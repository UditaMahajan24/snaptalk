const nodemailer=require('../config/nodemailer');
// this is another way of exporting method

exports.newpassword=(accesstoken)=>{
    let htmlString=nodemailer.renderTemplate({accesstoken:accesstoken},'/reset_password/new_password.ejs');// comment:comment is sending data to ejs template
    nodemailer.transporter.sendMail({
        from:'codeial',
        to:accesstoken.user.email,
        subject:'reset password',
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