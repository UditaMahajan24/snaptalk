const queue=require('../config/kue');
const commentMailer=require('../mailers/comments_mailer');
queue.process('emails',function(job,done){
    console.log('email worker is processing the job',job.data);
    commentMailer.newcomment(job.data);
    done();
});