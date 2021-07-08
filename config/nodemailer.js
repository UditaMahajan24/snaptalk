const nodemailer=require("nodemailer");
const ejs=require('ejs');
const path=require('path');
require('dotenv').config();

let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.user,
        pass:process.env.pass
    }
});
let renderTemplate=(data, relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),// relative path is used to call this function
        data,
        function(err,template){
            if(err)
            {
                console.log('error in rendering template');
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}

