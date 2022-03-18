import { ApolloError } from "apollo-server-express";
import pick from "lodash/pick";
import {IUser, User, UserDocument} from "../../models/User";
import {checkIsAdmin, checkIsAuthen} from "../../util/checkAuthen";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import RpcRaptoreum, {OptionRpcClient} from "../../libs/rpc-raptoreum";
import {SmartNode} from "../../models/SmartNode";
import {History} from "../../models/History";
import user from "../schemas/user";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import {SESSION_SECRET} from "../../util/secrets";
import {NativeError} from "mongoose";
import {DataOld} from "../../models/DataOld";

const ODefaults: OptionRpcClient = {
    host: process.env.rpcbind,
    port:  parseInt(process.env.rpcport||"19998"),
    user: process.env.rpcuser,
    pass: process.env.rpcpassword,
    protocol: "http",
    disableAgent: false,
    queueSize: 16,

};
const RPCRuner = new RpcRaptoreum(ODefaults);
const ServiceResolvers = {
    Query: {
        me: async (__: any, args: any,ctx:any) => {
            try {
               if(!ctx.user){
                   throw new ApolloError("No session login");
               }
               return pick(ctx.user,["email","_id","profile","discord","autoCompounding","createdAt","rules","updatedAt","customAddrressRTM","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        users: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
              const users = await User.find( );

                const res = await RPCRuner.listaccounts().catch(()=>{
                    return {};
                });
                const smartNodes = await SmartNode.find({}).populate("participants.userId");
                const objSmartnode:any = {};
                smartNodes.forEach((smartNode)=>{
                    smartNode.participants.forEach(participant=>{
                        if(participant.userId && participant.userId._id){
                            objSmartnode[participant.userId._id] =participant.collateral + (objSmartnode[participant.userId._id]||0);
                        }
                    });
                });
                if(res && typeof res==="object"){
                    users.forEach(item=>{

                        item.collateral = objSmartnode[item._id]||0;
                        item.balance = res[item.accountRTM]||0;
                        item.portfolio = item.balance+item.collateral;

                    });
                }
                return users;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    },
    Mutation:{
        createUser: async (__: any, args: {email:string,password:string,discord:string,name:string,customAddressRTM:string,tfa:string},ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                if(ctx.user.enableTfa){
                    if(!args.tfa||args.tfa===""){
                        throw new ApolloError("undefined code 2fa");
                    }
                    const isVerified = speakeasy.totp.verify({
                        secret: ctx.user.tfa.secret,
                        encoding: "base32",
                        token: args.tfa
                    });
                    if(!isVerified){
                        throw new ApolloError("2fa is not correct");
                    }
                }
                if(args.password&&args.password!==""&&args.password.length<6){
                    throw new ApolloError("Password must be at least 6 characters long");
                }
                if(!args.email||args.email.length<6){
                    throw new ApolloError("Email is not valid");
                }
                if(!args.password||args.password===""){
                    args.password = crypto.randomBytes(16).toString("hex");
                }
                const user = new User({
                    email: args.email,
                    password: args.password,
                    verified:true,
                    customAddressRTM:args.customAddressRTM,
                    isVirtual:true,
                    verificationExpires:Date.now()+3600000,
                    profile:{
                        name:args.name||args.email
                    }
                });
                user.customAddressRTM = args.customAddressRTM;
                if(args.discord && args.discord!==""){
                    user.discord = args.discord;
                }
                const existingUser = await  User.findOne({ email: args.email });
                if (existingUser) {
                    throw new ApolloError("Account with that email address already exists." );
                }
                let uid ="User#"+ args.email;
                const datas = await RPCRuner.getAddressesByAccount(uid);
                if(datas && datas.length){
                    const existingUserUseAddressRTM = await  User.findOne({ accountRTM: uid });
                    if(existingUserUseAddressRTM){
                        uid ="User#"+ user.email+"_"+new Date().getTime();
                    }
                }
                try {
                    let addressRTM: any = await RPCRuner.getAccountAddress(uid).catch((e) => {
                        console.log("không thể kết nối raptoreum", e.toString());
                        return false;
                    });
                    const addressRTMExist = await User.findOne({addressRTM:addressRTM});
                    if(addressRTMExist){
                        // get another wallet address
                        addressRTM = await RPCRuner.getAccountAddress(uid).catch((e) => {
                            console.log("không thể kết nối raptoreum", e.toString());
                            return false;
                        });
                    }
                    if (addressRTM) {
                        user.accountRTM = uid;
                        user.addressRTM = addressRTM;
                    } else {
                        user.accountRTMError = true;
                    }
                }catch (e){
                    user.accountRTMError = true;
                }
                await user.save();
                if(user.discord && user.discord!==""){
                    const allSmartNode = await DataOld.find({discordId:user.discord});
                    if(allSmartNode && allSmartNode.length){
                        for await (const smartn of allSmartNode){
                            const smartnodeS = await SmartNode.findOne({label:smartn.smartNode});
                            if(smartnodeS) {
                                if (!smartnodeS.participants.find(it => it.userId === user._id)) {
                                    smartnodeS.participants.push({
                                        userId: user._id,
                                        RTMRewards: smartn.RTMRewards,
                                        collateral: smartn.collateral,
                                        pendingRTMRewards: smartn.pendingRTMRewards,
                                        percentOfNode: smartn.collateral / smartnodeS.collateral
                                        ,
                                        txids: [],
                                        source: "Import excel",
                                        time: new Date()
                                    });
                                    try {
                                        smartn.done = true;
                                        await smartn.save();
                                    } catch (e) {

                                    }
                                }
                                await smartnodeS.save();
                            }
                        }
                    }
                }
                try{
                    const history = new History();
                    history.action = "createUser";
                    history.author = user._id;
                    history.data = user;
                    history.dataOld = {};
                    history.save().then();
                }catch{
                }
                return pick(user,["email","_id","profile","autoCompounding","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },

        signupUser: async (__: any, args: {email:string,password:string,confirmPassword:string},ctx:any) => {
            try {
                if(ctx.user){
                    throw new ApolloError("You need to log out");
                }
                if(args.password!==args.confirmPassword){
                    throw new ApolloError("Passwords do not match");
                }
                if(!args.password||args.password.length<6){
                    throw new ApolloError("Password must be at least 6 characters long");
                }
                const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if(!emailRegexp.test(args.email)){
                    throw new ApolloError("Email is not valid");
                }
                const code  = crypto.randomInt(10000,90000);
                const user = new User({
                    email: args.email,
                    password: args.password,
                    verified:false,
                    verificationToken:code,
                    verificationExpires:Date.now()+3600000,
                    profile:{
                        name:args.email.substring(0,args.email.indexOf("@"))
                    }
                });

                const existingUser = await  User.findOne({ email: args.email });
                if (existingUser) {
                    throw new ApolloError("Account with that email address already exists." );
                }
                await user.save();
               await sendMail(user.email,"verify account on raptornodes.com","your verification code is: "+code);
                try{
                    const history = new History();
                    history.action = "createUser";
                    history.author = user._id;
                    history.data = user;
                    history.dataOld = {};
                    history.save().then();
                }catch{
                }
                return pick(user,["email","_id","profile","autoCompounding","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        verifiLogin:async (__: any, args: {email:string,password:string,token:string},ctx:any) => {
            try {
                if(ctx.user){
                    throw new ApolloError("You need to log out");
                }
                if(!args.token ||args.token===""){
                    throw new ApolloError("Token is not valid");
                }
                if(!args.password||args.password.length<6){
                    throw new ApolloError("Password must be at least 6 characters long");
                }
                const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if(!emailRegexp.test(args.email)){
                    throw new ApolloError("Email is not valid");
                }
                const user = await  User.findOne({ email: args.email.toLowerCase() });
                if (!user) {
                    throw new ApolloError("Does not exist with email." );
                }
                const isMatch = new Promise(resolve =>{
                    user.comparePassword(args.password, async(err: Error, isMatch: boolean) => {
                        resolve(isMatch);
                    }) ;
                } );
                if (isMatch) {
                    if(user.enableTfa){
                        if(!args.token||args.token===""){
                            throw new ApolloError("undefined code 2fa");
                        }
                        const isVerified = speakeasy.totp.verify({
                            secret: ctx.user.tfa.secret,
                            encoding: "base32",
                            token: args.token
                        });
                        if(!isVerified){
                            throw new ApolloError("2fa is not correct");
                        }
                    }else{
                        if(!user.verificationExpires){
                            throw new ApolloError("Session has expired, please reload the page and try again");
                        }
                        console.log("Date.now()>user.verificationExpires",Date.now()>user.verificationExpires);
                        if(Date.now()>(user.verificationExpires||0)){
                            throw new ApolloError("Verification code Expired");
                        }
                        if( args.token!==(user.verificationToken||"")){
                            throw new ApolloError("token is invalid");
                        }
                        user.verificationToken = null;
                        user.verificationExpires = null;

                    }
                    if(!user.verified&& (!user.accountRTM||user.accountRTM==="")){
                        let uid ="User#"+ user.email;
                        const datas = await RPCRuner.getAddressesByAccount(uid);
                        if(datas && datas.length){
                            const existingUserUseAddressRTM = await  User.findOne({ accountRTM: uid });
                            if(existingUserUseAddressRTM){
                                uid ="User#"+ user.email+"_"+new Date().getTime();
                            }
                        }
                        try {
                            let addressRTM: any = await RPCRuner.getAccountAddress(uid).catch((e) => {
                                console.log("không thể kết nối raptoreum", e.toString());
                                return false;
                            });
                            const addressRTMExist = await User.findOne({addressRTM:addressRTM});
                            if(addressRTMExist){
                                // get another wallet address
                                addressRTM = await RPCRuner.getAccountAddress(uid).catch((e) => {
                                    console.log("không thể kết nối raptoreum", e.toString());
                                    return false;
                                });
                            }
                            if (addressRTM) {
                                user.accountRTM = uid;
                                user.addressRTM = addressRTM;
                            } else {
                                user.accountRTMError = true;
                            }
                        }catch (e){
                            user.accountRTMError = true;
                        }
                    }
                    const token = jwt.sign({email: user.email, tokenJWT: uuidv4()}, SESSION_SECRET, {
                        expiresIn: 10000000,
                    });
                    user.tokenJWT = token;
                    user.verified = true;
                    await user.save();
                    await new Promise((resolve)=>{
                        ctx.req.logIn(user,()=>{
                            resolve(true);
                        });
                    });
                    if(process.env.NODE_ENV!=="production"){
                        return token;
                    } else{
                        return "";
                    }
                }else{
                    throw new ApolloError("Invalid email or password");
                }
                try{
                    const history = new History();
                    history.action = "createUser";
                    history.author = user._id;
                    history.data = user;
                    history.dataOld = {};
                    history.save().then();
                }catch{
                }
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        verifiForGot:async (__: any, args: {email:string,password:string,token:string},ctx:any) => {
            try {
                if(ctx.user){
                    throw new ApolloError("You need to log out");
                }
                if(!args.token ||args.token===""){
                    throw new ApolloError("Token is not valid");
                }
                if(!args.password||args.password.length<6){
                    throw new ApolloError("Password must be at least 6 characters long");
                }
                const user = await  User.findOne({ email: args.email.toLowerCase() });
                if (!user) {
                    throw new ApolloError("Does not exist account with email." );
                }
                     if(!user.passwordResetExpires){
                            throw new ApolloError("Session has expired, please reload the page and try again");
                        }
                        if(Date.now()>(user.passwordResetExpires||0)){
                            throw new ApolloError("Verification code Expired");
                        }
                        if( args.token!==(user.passwordResetToken||"")){
                            throw new ApolloError("token is invalid");
                        }
                        user.passwordResetToken = null;
                        user.passwordResetExpires = null;
                    const token = jwt.sign({email: user.email, tokenJWT: uuidv4()}, SESSION_SECRET, {
                        expiresIn: 10000000,
                    });
                    user.password = args.password;
                    user.tokenJWT = token;
                    user.verified = true;
                    await user.save();
                    await new Promise((resolve)=>{
                        ctx.req.logIn(user,()=>{
                            resolve(true);
                        });
                    });

                if(process.env.NODE_ENV!=="production"){
                        return token;
                    } else{
                        return "";
                    }

                try{
                    const history = new History();
                    history.action = "createUser";
                    history.author = user._id;
                    history.data = user;
                    history.dataOld = {};
                    history.save().then();
                }catch{
                }
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        newPasswordResetToken:async (__: any, args: {email:string},ctx:any) =>{
            if(ctx.user){
                throw new ApolloError("You need to log out");
            }
            if(!args.email){
                throw new ApolloError("Email is not valid");
            }
            const user = await User.findOne({email:args.email});
            if(!user){
                throw new ApolloError("Not found User");
            }
            let code  = "4423456";
            if(user.verificationToken){
                if(Date.now()+3540000<(user.passwordResetExpires||1)){
                    code =user.passwordResetToken;
                    return true;
                }
            }else{
                 code  = crypto.randomInt(10000000,90000000) +"";
                user.passwordResetToken = code+"";
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
            }

            await sendMail(user.email,"Reset your password on Raptornodes.com","You are receiving this email because you (or someone else) have requested the reset of the password for your account. your \n" +
                " confirmation code is: "+code);
            await user.save();
            return true;
        },
        newVerificationToken:async (__: any, args: {email:string},ctx:any) =>{
            if(ctx.user){
                throw new ApolloError("You need to log out");
            }
            if(!args.email){
                throw new ApolloError("Email is not valid");
            }
            const user = await User.findOne({email:args.email});
            if(!user){
                throw new ApolloError("Not found User");
            }
            if(user.enableTfa){
                return {tfa:true,status:true};
            }
            if(user.verificationToken){
                if(Date.now()+3540000<(user.verificationExpires||1)){
                    await sendMail(user.email,"verify account on raptornodes.com","your verification code is: "+user.verificationToken);
                    return  {tfa:false,status:true};
                }
            }
            const code  = crypto.randomInt(100000,900000);
            user.verificationToken = code+"";
            await sendMail(user.email,"verify account on raptornodes.com","your verification code is: "+code);
            user.verificationExpires = Date.now()+3600000;
            await user.save();
            return {tfa:false,status:true};
        },
        updateProfileUser: async (__: any, args: IUser&{autoCompounding:boolean,tfa:string},ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
                checkIsAuthen(ctx.user);
                if(ctx.user.enableTfa){
                    if(!args.tfa||args.tfa===""){
                        throw new ApolloError("undefined code 2fa");
                    }
                    const isVerified = speakeasy.totp.verify({
                        secret: ctx.user.tfa.secret,
                        encoding: "base32",
                        token: args.tfa
                    });
                    if(!isVerified){
                        throw new ApolloError("2fa is not correct");
                    }
                }
                const user = await User.findById(ctx.user._id);
                if(!user){
                    throw new ApolloError("Not found User");
                }
                const cloneData =JSON.parse(JSON.stringify(user));
                if(args.autoCompounding || args.autoCompounding===false){
                    user.autoCompounding = args.autoCompounding;
                }
                await user.save();
                try{
                    const history = new History();
                    history.action = "updateUser";
                    history.author = ctx.user._id;
                    history.data = user;
                    history.dataOld = cloneData;
                    await history.save();
                }catch{
                }
                return pick(user,["email","_id","profile","autoCompounding","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        updateUser: async (__: any, args: IUser&{_id:string,tfa:string,customAddressRTM:string,password:string,isVirtual:boolean},ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
                checkIsAdmin(ctx.user);
                if(ctx.user.enableTfa){
                    if(!args.tfa||args.tfa===""){
                        throw new ApolloError("undefined code 2fa");
                    }
                    const isVerified = speakeasy.totp.verify({
                        secret: ctx.user.tfa.secret,
                        encoding: "base32",
                        token: args.tfa
                    });
                    if(!isVerified){
                        throw new ApolloError("2fa is not correct");
                    }
                }
                const user = await User.findById(args._id);
                    if(!user){
                        throw new ApolloError("Not found User");
                    }
                const cloneData =JSON.parse(JSON.stringify(user));
                if(args.status || args.status===false){
                    user.status = args.status;
                }
                if(args.discord || args.discord!==""){
                    user.discord = args.discord;
                }
                if(args.isVirtual || args.isVirtual===false){
                    user.isVirtual = args.isVirtual;
                }
                if(args.password && args.password!=="" && args.password.length>6){
                    user.password = args.password;
                }
                if(args.customAddressRTM){
                    user.customAddressRTM = args.customAddressRTM;
                }
                if(args.enableTfa ||args.enableTfa===false){
                    user.enableTfa = args.enableTfa;
                }

              await user.save();
                try{
                    const history = new History();
                    history.action = "updateUser";
                    history.author = ctx.user._id;
                    history.data = user;
                    history.dataOld = cloneData;
                    await history.save();
                }catch{
                }
                return pick(user,["email","_id","profile","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        removeUser: async (__: any, args: any,ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
                checkIsAdmin(ctx.user);
                if(ctx.user.enableTfa){
                    if(!args.tfa||args.tfa===""){
                        throw new ApolloError("undefined code 2fa");
                    }
                    const isVerified = speakeasy.totp.verify({
                        secret: ctx.user.tfa.secret,
                        encoding: "base32",
                        token: args.tfa
                    });
                    if(!isVerified){
                        throw new ApolloError("2fa is not correct");
                    }
                }
                try{
                    const history = new History();
                    history.action = "removeUser";
                    history.author = ctx.user._id;
                    history.data = user;
                    history.dataOld = user;
                    await history.save();
                }catch{
                }
                return pick(ctx.user,["email","_id","profile","autoCompounding","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    }
};

export default ServiceResolvers;
