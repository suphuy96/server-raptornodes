let fs = require("fs");
let path = require("path");
const { createCanvas,Image } = require("canvas");
const Base64 = require("js-base64").Base64;
var CryptoJS = require("crypto-js");
const config = require("./config");

var decodeMatrix = async (secret,fileName)=>{
    console.log(fileName,"dddd");
    const  squid  = fs.readFileSync( fileName && fileName!==""?fileName:path.join("..","src","assets","dot.png"));
    const img = new Image();
    const canvas = createCanvas(2, 2);
    const ctx = canvas.getContext("2d");
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => {
        console.log("dfdfd");
        throw err; };
    img.src = squid;
    console.log(img.height,img.width);
    function reverseString (str) {
        return str.split("").reverse().join("");
    }
    let tt = reverseString("edoCrahCmorf");
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    // context.drawImage(img, img.width, 0);
    var imageData = ctx.getImageData(0, 0, img.width,
        img.height);
    let data = imageData.data;
    var text = "";
    for (let i = 0; i < data.length; i += 4) {
        text += String[tt](data[i], data[i + 1], data[i + 2]);
    }
    var bytes  = CryptoJS.AES.decrypt(text, secret);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log("decryptedData======>",decryptedData);
};
module.exports = decodeMatrix;