const fs = require("fs");
const path = require("path");
const objectHash = require("object-hash");
const {Base64} = require("js-base64");
const config = require("./config");
const creDotMatrix = require("./encode");
const pathBundle = path.join(__dirname, "..","bundle.js");
let  content  = fs.readFileSync(pathBundle).toString("utf-8");
const hashS = objectHash({s:content});
console.log("hash1====>",hashS);
// content = content.replace("3888e69yuh4e88883",hashS);
// content = content.replace("3888e69yuh4e88883",hashS);
var run = async()=> {
    content = content.replace("3888e69yuh4e88883", hashS);
    fs.writeFileSync(pathBundle, content);
    fs.writeFileSync(path.join(__dirname, "..", "dist", "bundle.js"), content);
    const hashF = objectHash({s: content.replace("__filename", "heae")});
    const folder = "mainnet-raptornodes";

    creDotMatrix(hashF, "bg.png", {
        createBy: "huyquansu96@gmail.com",
        sc: Base64.encode(config.SESSION_SECRET)
    }, path.join(__dirname, "..", "..", folder, "bin", "assets", "bg.png"));
//coppy.
    await new Promise((resolve)=>{
        setTimeout(()=>{resolve(true);},2100);
    });
    fs.writeFileSync(path.join(__dirname, "..", "azure", "bin", "www"), content);
    fs.copyFileSync(path.join(__dirname, "..", "assets", "dot.png"), path.join(__dirname, "..", "azure", "bin", "assets", "dot.png"));
    fs.copyFileSync(path.join(__dirname, "..", "assets", "bg.png"), path.join(__dirname, "..", "azure", "bin", "assets", "bg.png"));
    fs.writeFileSync(path.join(__dirname, "..", "..", folder, "bin", "www"), content);
    // fs.copyFileSync(path.join(__dirname, "..", "assets", "dot.png"), path.join(__dirname, "..", "..", folder, "bin", "assets", "dot.png"));
};
run();
