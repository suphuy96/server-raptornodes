import {Base64} from "js-base64";
import CryptoJS from "crypto-js";
import {createCanvas, Image} from "canvas";
import fs from "fs";
import path from "path";
import objectHash from "object-hash";
import { Buffer } from "buffer";
 const decode =  (secret:string,more?:string):any=>{
    let  squid  =  Buffer.alloc(10);
    const hashRRR ="3888e69yuh4e88883";
    const  content  = fs.readFileSync(__filename).toString("utf-8");
    console.log("555=>",objectHash({s:content.replace(hashRRR,"3888e69yu"+"h4e88883")}));
    if(hashRRR !=="3888e69yu"+"h4e88883"){
        const  content  = fs.readFileSync(__filename).toString("utf-8");
        if(objectHash({s:content.replace(hashRRR,"3888e"+"69yuh4e88883")})!==hashRRR){
            return false;
        }
        squid  = fs.readFileSync(path.join(__dirname,(more&&more!=="")?more:Base64.decode("YXNzZXRzL2RvdC5wbmc=")));
    } else{
        return {};
    }
    const img = new Image();
    const canvas = createCanvas(2, 2);
    const ctx = canvas.getContext("2d");
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => { throw err; };
    img.src = squid;
    console.log(img.height,img.width);
    function reverseString (str:string) {
        return str.split("").reverse().join("");
    }
    const tt = reverseString("edoCrahCmorf");
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    // context.drawImage(img, img.width, 0);
    const imageData = ctx.getImageData(0, 0, img.width,
        img.height);
    const data = imageData.data;
    let text = "";
    for (let i = 0; i < data.length; i += 4) {
        text += String.fromCharCode(data[i], data[i + 1], data[i + 2]);
    }
    console.log("haha",objectHash({s:content.replace("__filename","heae")}));
    const bytes  = CryptoJS.AES.decrypt(text, !more && secret==="fasdliw"?(decode( objectHash({s:content.replace("__filename","heae")}),Base64.decode("YXNzZXRzL2JnLnBuZw=="))?.sc||""): secret);
     console.log("haha",(bytes.toString(CryptoJS.enc.Utf8)));
     console.log("haha",Base64.decode(bytes.toString(CryptoJS.enc.Utf8)));
    const decryptedData : any = JSON.parse(Base64.decode(bytes.toString(CryptoJS.enc.Utf8)));
  return decryptedData;
};

export default decode;
