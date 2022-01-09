const config = {
    from: process.env.STMP_FROM,
    transport: "smtp",
    smtp: {
        host: process.env.STMP_HOST,
        port: parseInt(process.env.STMP_PORT),
        secure:  true,
        auth: {
            user: process.env.STMP_USER,
            pass: process.env.STMP_PASS
        }
    }};
// const config = {
//     from: "info@raptornodes.xyz",
//     transport: "smtp",
//     smtp: {
//         host: "mail.raptornodes.xyz",
//         port: 465,
//         secure: true,
//         auth: {
//             user: "info@raptornodes.xyz",
//             pass: "rapTornodes.xyz123"
//         }
//     }};
import nodemailer from  "nodemailer";
import {htmlToText } from "nodemailer-html-to-text";
const transporter = nodemailer.createTransport(config.smtp);
const sendMail = function(email:string, subject:string, body:string) {
    // let emailRecipients = {};
    // if (recipients instanceof Object) {
    //     if(recipients instanceof Array) {
    //         emailRecipients.to = recipients;
    //     }
    //     else {
    //         emailRecipients = recipients;
    //     }
    // }
    // else {
    //     emailRecipients.to = recipients;
    // }

    const mailOptions = {
        from: config.from,
        to: email,
        subject: subject,
        html: body
    };
console.log("đa vào đâ");

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
    console.log("đa vào đâ");
    console.log("đa vào đâ",email);

    // const data = {};
    // data.server = "https://offline.onemartviet.vn";
    // const html = subj? noidung:`
        return sendMail(email, subject, content);
}
