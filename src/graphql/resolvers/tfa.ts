import { ApolloError } from "apollo-server-express";
import speakeasy from "speakeasy";

import { User, UserDocument } from "../../models/User";
import {NativeError} from "mongoose";
import sendMail from "../../libs/mail";

const ServiceResolvers = {
    Mutation:{
        getTfa: async (__: any, args: any,ctx:any) => {
            try {

                return {
                    tempSecret: "",
                    dataURL:"",
                    tfaURL: ""
                };
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        setupTfa: async (__: any, args: any,ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
                if(ctx.user.tfa && ctx.user.tfa.dataURL&&ctx.user.tfa.dataURL!=='' && ctx.user.enableTfa){
                    // console.log("không vào đây rrrr")
                       // if(ctx.user.tfa.secret){
                       //
                       // }
                    return ctx.user.tfa;
                }
                // console.log("không xuống");
                const secret = speakeasy.generateSecret({
                    length: 10,
                    name: ctx.user?ctx.user.email:"huyquansu96@gmail.com",
                    issuer: "Raptornodes v1.1"+(process.env.TESTNET==="1"?"- testnet":"")
                });
                const url = speakeasy.otpauthURL({
                    secret: secret.base32,
                    label: ctx.user?ctx.user.email:"huyquansu96@gmail.com",
                    issuer: "Raptornodes v1.1"+(process.env.TESTNET==="1"?"- testnet":""),
                    encoding: "base32"
                });
                // const dataURL= await QRCode.toDataURL(url);
                console.log("url",url);
                const obj = {

                    tempSecret: secret.base32,
                    dataURL:url,
                    tfaURL: secret.otpauth_url
                };
                if(ctx.user.save){
                    ctx.user.tfa = obj;
                    ctx.user.save();
                } else{
                new Promise(resolve => {
                    User.findById(ctx.user.id,(err: NativeError, user: UserDocument)=>{
                        user.tfa = obj;
                        user.save();
                        resolve(user);
                    });
                });}
                return {
                    tempSecret: secret.base32,
                    dataURL:url,
                    tfaURL: secret.otpauth_url
                };

            } catch (error) {
                throw new ApolloError(error);
            }
        },
        verifyTfa: async (__: any, args: {token:string,enable:boolean},ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
                // const secret = speakeasy.generateSecret({
                //     length: 10,
                //     name: ctx.user?ctx.user.email:"",
                //     issuer: "Raptornodes v1.0"
                // });
                // const url = speakeasy.otpauthURL({
                //     secret: secret.base32,
                //     label: ctx.user?ctx.user.email:"",
                //     issuer: "Raptornodes v1.0",
                //     encoding: "base32"
                // });
                // const dataURL= await QRCode.toDataURL(url);
                 const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.tempSecret,
                    encoding: "base32",
                    token: args.token
                });
                if (isVerified) {
                    console.log("DEBUG: TFA is verified to be enabled");
                    if(ctx.user.save){
                        console.log("vào đây",ctx.user.id);
                        ctx.user.tfa.secret = ctx.user.tfa.tempSecret;
                        ctx.user.tfa.tempSecret = "";
                        ctx.user.tfa.dataURL = "";
                        ctx.user.tfa.done = new Date();
                        ctx.user.enableTfa = args.enable===false?false:true;
                        ctx.user.save((err: Error) => {
                            console.log(err);
                        });

                    } else{
                        new Promise(resolve => {
                            User.findById(ctx.user.id,(err: NativeError, user: UserDocument)=>{
                                user.tfa.secret = user.tfa.tempSecret;
                                user.tfa.done = new Date();
                                user.enableTfa =  args.enable===false?false:true;
                                user.save((err: Error) => {
                                    console.log(err);
                                });
                                resolve(user);
                            });
                        });}
                    try{
                        sendMail(ctx.user.email,"raptornodes.com - 2FA enabled","Hey! "+ctx.user.profile.name+" 2FA is enabled, You can rest assured on raptornodes.com, every action needs your confirmation by 2FA.").then((data)=>{
                            console.log(data);
                        });
                    }catch (e){

                    }
                    // commons.userObject.tfa.secret = commons.userObject.tfa.tempSecret;
                    // return res.send({
                    //     "status": 200,
                    //     "message": "Two-factor Auth is enabled successfully"
                    // });
                    return true;
                } else {
                    throw new ApolloError("Not verified TFA");
                }

            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
