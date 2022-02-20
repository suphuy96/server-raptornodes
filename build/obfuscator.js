const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");
const {Base64} = require("js-base64");
const creDotMatrix = require("./encode");
const config = require("./config");
const pathDecode = path.join(__dirname,"..","dist","util","decode.js");
const  source  = fs.readFileSync(pathDecode).toString("utf-8");
//decode.js
var obfuscationResult = JavaScriptObfuscator.obfuscate(source,{target: "node",ignoreImports:true,ignoreRequireImports:true,disableConsoleOutput:true});
var sourcDecode = obfuscationResult.getObfuscatedCode();
console.log(sourcDecode);
fs.writeFileSync(pathDecode,sourcDecode);

//secrets.js
const pathSecrets = path.join(__dirname,"..","dist","util","secrets.js");
const  sourceSecrets  = fs.readFileSync(pathSecrets).toString("utf-8");

var obfuscationResult = JavaScriptObfuscator.obfuscate(sourceSecrets,{target: "node",ignoreImports:true,ignoreRequireImports:true,disableConsoleOutput:true});
var sourcSecretsR = obfuscationResult.getObfuscatedCode();
console.log(sourcSecretsR);
fs.writeFileSync(pathSecrets,sourcSecretsR);
console.log(Base64.encode("assets/bg.png"));



fs.writeFileSync(path.join(__dirname,"..","dist","util","config.js"),`"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    sc: "fasdliw"
};`);
