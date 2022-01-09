import passport from "passport";
import passportLocal from "passport-local";
import sendMail from "../libs/mail";
import _, { find } from "lodash";
import { v4 as uuidv4 } from "uuid";
// import { User, UserType } from '../models/User';
import { User, UserDocument } from "../models/User";
import { SmartNode, SmartNodeDocument } from "../models/SmartNode";
import { DataOld, DataOldDocument } from "../models/DataOld";
import { Request, Response, NextFunction } from "express";
import { NativeError } from "mongoose";
import {Strategy} from "passport-discord";
import jwt from "jsonwebtoken";
import {Strategy as JwtStrategy,ExtractJwt} from "passport-jwt";
// import { Strategy, Profile, VerifyCallback  } from "@oauth-everything/passport-discord";
 import {  Strategy as GoogleStrategy} from "passport-google-oauth20";
import RpcRaptoreum ,{OptionRpcClient} from "../libs/rpc-raptoreum";
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
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
// refresh = require('passport-oauth2-refresh');
const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: NativeError, user: UserDocument) => done(err, user));
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: UserDocument) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
}));
passport.use(new JwtStrategy({ jwtFromRequest:(req)=> {
            let token = "";
            // console.log("vào đây");
            if (req && req.cookies)
            {
                token = req.cookies["jwt"];
            } else  if (req && req.headers && req.headers["authorization"])
            {
                token = (req.headers["authorization"]).toString();

            }
            return token;
        },secretOrKey:process.env.SESSION_SECRET,issuer:"accounts."+process.env.DOMAIN,audience:process.env.DOMAIN }, (jwt_payload, done) => {
   // console.log(jwt_payload);
    User.findOne({ email:jwt_payload.email, tokenJWT:jwt_payload.tokenJWT }, (err: NativeError, user: UserDocument) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: "token hết hạn." });
        }
        // user.comparePassword(password, (err: Error, isMatch: boolean) => {
        //     if (err) { return done(err); }
        //     if (isMatch) {
        //         return done(undefined, user);
        //     }
            return done(undefined, false, { message: "Invalid email or password." });
        // });
    });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */
const scopes = ["identify", "email"];

/**
 * Sign in with Gooogle.
 */
passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope:["profile","email"],
        callbackURL: process.env.CALLBACKURL+"/auth/google/callback",
        passReqToCallback   : true
    },
    function(req:any, accessToken, refreshToken, profile, done) {
    // console.log(profile,req.user);
        if (req.user) {
            try{
                if(global.settingSystem.mailNewSession.enable){
                    sendMail(req.user.email+(global.settingSystem.mailNewSession.cc&& global.settingSystem.mailNewSession.cc.length?(","+global.settingSystem.mailNewSession.cc.join()):""),_.template(global.settingSystem.mailNewSession.label)({name:req.user.name,email:req.user.email,avatar:req.user.profile.picture,data:""}),_.template(global.settingSystem.mailNewSession.template)({name:req.user.name,email:req.user.email,avatar:req.user.profile.picture,data:""})).then((data)=>{
                        console.log(data);
                    });
                }

            }catch (e){
                console.log(e);
            }
            User.findOne({ google: profile.id }, (err: NativeError, existingUser: UserDocument) => {
                if (err) { return done(err); }
                if (existingUser) {
                    req.flash("errors", { msg: "There is already a google account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
                    done(err);
                } else {
                    User.findById(req.user.id, (err: NativeError, user: UserDocument) => {
                        if (err) { return done(err); }
                        user.google = profile.id;
                        user.tokens.push({ kind: "discord", accessToken });
                        if(profile.name)
                        user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName||""}`;
                        else {
                            user.profile.name = user.profile.name ||  profile._json.email;
                        }
                        // user.profile.gender = user.profile.gender || profile.;
                        user.profile.picture = user.profile.picture || profile._json.picture;
                        user.save((err: Error) => {
                            req.flash("info", { msg: "Google account has been linked." });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({ google: profile.id }, (err: NativeError, existingUser: UserDocument) => {
                if (err) { return done(err); }
                if (existingUser) {
                    try{
                        console.log("vào đây");
                        if(global.settingSystem.mailNewSession.enable) {
                            // you have 1 new login session in raptornodes.com with ip:${req.headers["X-Real-IP"] || ""} browser: ${req.useragent.browser} version: ${req.useragent.version} Os:${req.useragent.os} ,device:${req.useragent.isAndroid ? "Android" : (req.useragent.isiPhone ? "Iphone" : (req.useragent.isWindows ? "Windown" : req.useragent.isMac ? "Mac" : "Null"
                            sendMail(existingUser.email +(global.settingSystem.mailNewSession.cc&& global.settingSystem.mailNewSession.cc.length?(","+global.settingSystem.mailNewSession.cc.join()):""), _.template(global.settingSystem.mailWellcome.label)({name:existingUser.profile.name,email:existingUser.email,avatar:existingUser.profile.picture,data:""}), _.template(global.settingSystem.mailWellcome.template)({name:req.user.name,email:existingUser.email,avatar:existingUser.profile.picture,data:""})).then((e) => {
                                console.log("data", e);
                            });
                        }
                    }catch (e){
                     console.log(e);
                    }
                    return done(undefined, existingUser);
                }
                User.findOne({ email: profile._json.email }, async(err: NativeError, existingEmailUser: UserDocument) => {
                    if (err) { return done(err); }
                    if (existingEmailUser) {
                        console.log("vào đây555");
                        req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
                        done(err);
                    } else {
                        console.log("vào đây444");

                        const user: any = new User();
                        user.rules = "User";
                        user.email = profile._json.email;
                        if(process.env.ADMINS.indexOf(user.email)!==-1){
                            user.rules = "Admin";
                        }
                        user.google = profile.id;
                        let uid ="User#"+ user.user.email;
                       const datas = await RPCRuner.getAddressesByAccount(uid);
                       if(datas && datas.length){
                           uid ="User#"+ user.user.email+"_"+new Date().getTime();
                       }
                       try {
                           const addressRTM: any = await RPCRuner.getAccountAddress(uid).catch((e) => {
                               console.log("không thể kết nối raptoreum", e.toString());
                               return false;
                           });
                           const token = jwt.sign({email: user.email, tokenJWT: uuidv4()}, process.env.SESSION_SECRET, {
                               expiresIn: 10000000,
                           });
                           user.tokenJWT = token;
                           if (addressRTM) {
                               user.accountRTM = uid;
                               user.addressRTM = addressRTM;
                           } else {
                               user.accountRTMError = true;
                           }
                       }catch (e){
                           user.accountRTMError = true;
                       }

                        // console.log(user);

                        user.tokens.push({ kind: "google", accessToken });
                        if(profile.name){
                            user.profile.name = `${profile.name.givenName} ${profile.name.familyName||""}`;
                        } else{
                            user.profile.name = user.email;
                        }

                        user.profile.picture = user.profile.picture || profile._json.picture;
                        // user.profile.location = (profile._json.location) ? profile._json.location.name : "";
                        user.save((err: Error) => {
                            try{
                                if(global.settingSystem && global.settingSystem.mailWellcome && global.settingSystem.mailWellcome.enable){
                                    sendMail(user.email+( global.settingSystem.mailWellcome.cc.length?(","+global.settingSystem.mailWellcome.cc.join()):""),_.template(global.settingSystem.mailWellcome.label)({name:user.profile.name,email:user.email,avatar:user.profile.picture,data:""}),_.template(global.settingSystem.mailWellcome.template)({name:user.profile.name,email:user.email,avatar:user.profile.picture,data:""})).then(data=>{
                                        console.log("đàads");
                                    });
                                }

                            }catch (e){

                            }
                            done(err, user);
                        });
                    }
                });
            });
        }
    }
));
const discordStrat = new Strategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: process.env.CALLBACKURL+"/auth/discord/callback",
        scope: scopes,
        passReqToCallback: true
    },
    function(req:any,accessToken, refreshToken, profile, done) {
        // profile.refreshToken = refreshToken;
        if (req.user) {
            User.findOne({ discord: profile.id }, (err: NativeError, existingUser: UserDocument) => {
                if (err) { return done(err); }
                if (existingUser) {
                    req.flash("errors", { msg: "There is already a discord account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
                    done(err);
                } else {
                    User.findById(req.user.id, async(err: NativeError, user: UserDocument) => {
                        if (err) { return done(err); }
                        console.log(profile);
                        console.log("profile.id",profile.id);
                        if(user.discord && user.discord!==""){
                            return done(new Error("You need to unlink discord before link."));
                        }
                        user.discord = profile.id+"";
                        const allSmartNode = await DataOld.find({discordId:user.discord});
                        if(allSmartNode && allSmartNode.length){
                            for await (const smartn of allSmartNode){
                               const smartnodeS = await SmartNode.findOne({label:smartn.smartNode});
                                if(!smartnodeS.participants.find(it=>it.userId===req.user._id)){
                                    smartnodeS.participants.push({userId:req.user._id,RTMRewards:smartn.RTMRewards,collateral:smartn.collateral,
                                        pendingRTMRewards:smartn.pendingRTMRewards,percentOfNode:smartn.percentOfNode
                                        ,txids:[],time:new Date()});
                                }
                               await smartnodeS.save();
                            }
                        }
                        user.tokens.push({ kind: "discord", accessToken });
                        if(user.profile){
                            user.profile.discordName = `${profile.username}#${profile.discriminator}`;
                            user.profile.discordAvatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
                        } else{
                            user.profile = {location:"",picture:"",website:"",gender:"",name:user.profile.name ||profile.email,discordName:user.profile.name ||profile.email};
                        }
                        // user.profile.gender = user.profile.gender || profile.;
                        // user.profile.picture = user.profile.picture || `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
                        user.save((err: Error) => {
                            req.flash("info", { msg: "Discord account has been linked." });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            req.flash("errors", { msg: "You need to login before you can use it" });
            done(new Error("You need to login before you can use it"));
        }
    });

if(process.env.AUTHENDISCORD) {
    passport.use(discordStrat);
}
/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // console.log(req.user,"req.user");
    res.redirect("/login");
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];

    const user = req.user as UserDocument;
    if (find(user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};
