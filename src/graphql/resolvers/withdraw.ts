import { ApolloError } from "apollo-server-express";
import {Withdraw, WithdrawDocument, IWithdraw} from "../../models/Withdraw";
import {checkIsAuthen} from "../../util/checkAuthen";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import {WALLET_PASS_PHRASE} from "../../util/secrets";
import {History} from "../../models/History";
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
        withdraws: async (__: any, args: any,ctx:any) => {
            try {
               checkIsAuthen(ctx.user);
               const ars = await Withdraw.find({author:ctx.user._id}).populate("author");
                const res:any =  await RPCRuner.listtransactions([ctx.user.accountRTM]);
                //
                // "walletconflicts": null,
                console.log(args,__);
                ars.forEach((item:any)=>{
                    const check = res.find((it:any)=>it.txid===item.txid);
                    if(check){
                        item.fee = check.fee;
                        item.blockhash = check.blockhash;
                        item.confirmations = check.confirmations;
                        item.time= check.time;
                        item.timereceived= check.timereceived;
                    }
                });
                    // res =  res.filter((item:any)=>item.category==="send");
                // const merged = _.merge(_.keyBy(res, "txid"), _.keyBy(ars, "txid"));
                // console.log(_.values(merged));
                // return _.values(merged);
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        createWithdraw: async (__: any, wr: IWithdraw &{tfa:string},ctx:any) => {
            try {
                //check authen
                checkIsAuthen(ctx.user);
                if(global.settingSystem && global.settingSystem.enableWithdraw===false){
                    throw new ApolloError("The system is maintenance!!");
                }
                if(global.settingSystem.isMaintenance){
                    throw new ApolloError("System is Maintenance");
                }
                const youBalance = await RPCRuner.getbalance(ctx.user.accountRTM,2);
                if(wr.amount>youBalance){
                    throw new ApolloError(
                        "Your balance is not enough." +youBalance+"RTM");
                }
                const withdraw = new Withdraw();
                withdraw.address = wr.address;
                withdraw.amount = wr.amount;
                const comment = "Withdraw in Raptornodes.com";
                withdraw.description = wr.description||comment;
                withdraw.author = ctx.user._id;
                if(!ctx.user.enableTfa){
                    throw new ApolloError("You need to enable Two Factor Authentication");
                }
                //Verifi 2fa
                if(ctx.user.enableTfa){
                    if(!wr.tfa||wr.tfa===""){
                        throw new ApolloError("undefined code 2fa");
                    }
                    const isVerified = speakeasy.totp.verify({
                        secret: ctx.user.tfa.secret,
                        encoding: "base32",
                        token: wr.tfa
                    });
                    if(!isVerified){
                        throw new ApolloError("2fa is not correct");
                    }
                }
                try {
                    try{
                        await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
                    }catch (e){
                        console.log(e);
                    }
                    const rawData = await RPCRuner.sendFrom({address:wr.address,account:ctx.user.accountRTM,comment:comment,amount:wr.amount,comment_to:""});
                    withdraw.txid = rawData;
                    const withdrawSave= await withdraw.save();
                    try {
                        if(global.settingSystem && global.settingSystem.mailWithdraw && global.settingSystem.mailWithdraw.enable){
                            //send mail
                            sendMail(ctx.user.email+( global.settingSystem.mailWithdraw.cc.length?(","+global.settingSystem.mailWithdraw.cc.join()):""),_.template(global.settingSystem.mailWithdraw.label)({name:ctx.user.profile.name,email:ctx.user.email,avatar:ctx.user.profile.picture,data:""}),_.template(global.settingSystem.mailWithdraw.template)({name:ctx.user.profile.name,email:ctx.user.email,avatar:ctx.user.profile.picture,data:""})).then(data=>{
                                console.log("đàads");
                            });
                        }
                    }catch(e){
                        console.log(e);
                    }
                    try{
                        const history = new History();
                        history.action = "createWithdraw";
                        history.author = ctx.user._id;
                        history.data = withdrawSave;
                        history.dataOld =  {};
                        await history.save();
                    }catch{
                    }
                    return withdrawSave;
                }catch (e){
                    throw new ApolloError(""+e.toString());
                    console.log("fixx",e);
                }
                return withdraw;

            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
