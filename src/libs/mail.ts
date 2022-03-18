import {STMP_PASS} from "../util/secrets";
const config = process.env.USE_STMP_HOST==="1"?{
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
    }}: {
    service: "SendGrid",
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.STMP_PASS,
    }
};
import nodemailer from  "nodemailer";
import {htmlToText } from "nodemailer-html-to-text";
const transporter = nodemailer.createTransport(config.smtp);
const sendMail = function(email:string, subject:string, body:string) {
  const mailOptions = {
        from: config.from,
        to: email,
        subject: subject,
        html: body
    };
   return new Promise((resolve)=>{
 if (transporter) {
            transporter.use("compile", htmlToText());
            transporter.sendMail(mailOptions, (err, info) => {
                if (err){
                    console.log(err);
                    resolve(false);
                }
                else{
                    resolve( {data:{data:{guismsCreate:true}}});
                }

            });
        }
        else{
            resolve(false);
        }

    });
};
export default function (email:string,subj:string,content:string ):Promise<any> {
    const subject =  subj;
        return sendMail(email, subject, content);
}
