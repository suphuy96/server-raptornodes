let fs = require("fs");
let path = require("path");
const { createCanvas } = require("canvas");
const JavaScriptObfuscator  = require("javascript-obfuscator");
const Base64 = require("js-base64").Base64;
var CryptoJS = require("crypto-js");
var decode = require("./decode");
function reverseString (str) {
    return str.split("").reverse().join("");
}
var creDotMatrix = async (secret,name,objDot,path2)=>{
    let data  = JSON.stringify(objDot);
    // objDot.CHECK_FH =  "huyquansu hello raptornodes.com " + new Date();
    data +="             ";
    var ciphertext = CryptoJS.AES.encrypt(data+'                    ', secret).toString();
    console.log(data.length,ciphertext.length,ciphertext.length/3,ciphertext.length%3);
    console.log(data.length,ciphertext.length,ciphertext.length/3,ciphertext.length%3,data);
// Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext, secret);
    console.log(bytes.toString(CryptoJS.enc.Utf8))
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log("decryptedData",decryptedData);
    console.log(ciphertext)
    var height = parseInt(Math.sqrt(ciphertext.length /3)) ;
    let width = height ;
    let nehuyk = height;
    if (ciphertext.length != (height * height * 3)) {
        if (ciphertext.length - (height * height * 3) <= height) {
            width += 1;
            nehuyk = height * 3;
        } else {
            nehuyk = 2 * height;
            width += 2;
        }
    }
    console.log(height,nehuyk,'heightheightheightheight')
    // nehuyk+=2;

    const canvas = createCanvas(width, nehuyk);
    const ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, width,
        nehuyk);
    var dataIMG = imageData.data;
    var j = 0;
    for (let i = 0; i < dataIMG.length; i += 4) {
        dataIMG[i] = ciphertext.charCodeAt(j); // red
        dataIMG[i + 1] = ciphertext.charCodeAt(j + 1); // green
        dataIMG[i + 2] = ciphertext.charCodeAt(j + 2); // blue
        dataIMG[i + 3] = 255; // blue
        j += 3;
    }
    console.log(ciphertext.substring(0,j));
    // let data = imageData.data;

    ctx.putImageData(imageData, 0, 0);
    const out = fs.createWriteStream(path.join(__dirname, "..","assets", name));
    const stream = canvas.createPNGStream();
    stream.pipe(out);
        if(!objDot.sc)
    fs.writeFileSync(path.join(__dirname,  "..", "src","util","config.ts"),`export default {
    sc: "${secret}"
};
`);
    out.on("finish", () => {
        console.log("=>>>>.....");

        decode(secret,path.join(__dirname, "..","assets", name));
        console.log("The PNG file was created.....");
    });
    const outs = fs.createWriteStream(path.join(__dirname, "..", "dist","assets", name));
    const streams = canvas.createPNGStream();
    streams.pipe(outs);
    if(path2){
        out.on("finish coppy", () => console.log("The PNG file coppyed."));
        const outs = fs.createWriteStream(path2);
        const streams = canvas.createPNGStream();
        streams.pipe(outs);
    }
};

module.exports = creDotMatrix;

//
// const prompt = require("prompt");
//
// prompt.start();
//
// prompt.get(["SESSION_SECRET","MONGODB_URI", "WALLET_PASS_PHRASE","STMP_PASS"], function (err, result) {
//     if (err) {
//         return onErr(err);
//     }
//     console.log("Command-line input received:");
//     creDotMatrix(result["SESSION_SECRET"],result);
// });
//
// function onErr(err) {
//     console.log(err);
//     return 1;
// }
//
//

