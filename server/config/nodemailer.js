import nodemailer from 'nodemailer';
//Generate email from backend
//Find the user and password from logging to Brevo website by clicking on SMTP on th drop-down menu
const transporter=nodemailer.createTransport({
          host:'smtp-relay.brevo.com',
          port:587,
          auth:{
                    user:process.env.SMTP_USER,
                    pass:process.env.SMTP_PASS,
          }
          //Mention smtp_user,smtp_pass and sender_email in env file and write host port and
          //auth i.e. user and pass here.
          //then go to authcontroller and add this into the *register* function and where required
});
export default transporter;