import {STMP_PASS} from "../util/secrets";
const config = {
    from: process.env.STMP_FROM,
    transport: "smtp",
    smtp: {
        host: process.env.STMP_HOST,
        port: parseInt(process.env.STMP_PORT),
        secure:  true,
        auth: {
            user: process.env.STMP_USER,
            pass: STMP_PASS
        }
    }};
import nodemailer from  "nodemailer";
import {htmlToText } from "nodemailer-html-to-text";
import nodemailerSendgrid  from "nodemailer-sendgrid";
const transporter = nodemailer.createTransport(nodemailerSendgrid({apiKey:process.env.SENDGRID_API_KEY}));
const sendMail = function(email:string, subject:string, body:string) {
  const mailOptions = {
        from:process.env.STMP_FROM,
        to: email,
        subject: subject,
        html: body
    };
   return new Promise((resolve)=>{
 // if (transporter) {
            transporter.use("compile", htmlToText());
            transporter.sendMail(mailOptions, (err, info) => {
                if (err){
                    console.log(err);
                    resolve(false);
                }
                else{
                    console.log(err,info);
                    resolve( {data:{data:{guismsCreate:true}}});
                }
            });
        // }
        // else{
        //     resolve(false);
        // }

    });
};
export default function (email:string,subj:string,content:string ):Promise<any> {
    const subject =  subj;
        return sendMail(email, subject, content);
}
