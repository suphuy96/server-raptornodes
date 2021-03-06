import { ApolloError } from "apollo-server-express";
import {ReWardHistory} from "../../models/RewardHistory";
import {checkIsAdmin, checkIsAuthen} from "../../util/checkAuthen";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import {mongo} from "mongoose";
import {ReWard} from "../../models/Reward";
import speakeasy from "speakeasy";
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
        dataRewardUser: async (__: any, args: any,ctx:any) => {

            checkIsAdmin(ctx.user);
            const dataGroup = ReWardHistory.aggregate([{ $match:{smartNode:args.smartNode}},{
                $group :{
                    _id : "user",
                    count:{ "$sum":1
                    },
                    amount:{ "$sum":"$amount"
                    }}}]).exec();
            return dataGroup;
        },
        rewardHistorys: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                if(ctx.user.rules==="Admin"){
                    return await ReWardHistory.find(args).populate("user");
                }
               const ars = await ReWardHistory.find({user:ctx.user._id});
                   // .populate("author");
                // const res:any =  await RPCRuner.listtransactions([ctx.user.accountRTM]);
                // //
                // // "walletconflicts": null,
                // console.log(args,__);
                // ars.forEach((item:any)=>{
                //     const check = res.find((it:any)=>it.txid===item.txid);
                //     if(check){
                //         item.fee = check.fee;
                //         item.blockhash = check.blockhash;
                //         item.confirmations = check.confirmations;
                //         item.time= check.time;
                //         item.timereceived= check.timereceived;
                //     }
                // });
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    // Mutation: {
    //     reTryrewardHistory tryReward: async (__: any, wr: {_id:string,tfa:string},ctx:any) => {
    // try {
    //     checkIsAdmin(ctx.user);
    //     const reward = await ReWard.findById(wr._id);
    //     if(!reward){
    //         throw new ApolloError("Not found ReWard");
    //     }
    //     if(!reward.missingReward ){
    //         throw new ApolloError("ReWard not Missing");
    //     }
    //     if(global.settingSystem.isMaintenance){
    //         throw new ApolloError("System is Maintenance");
    //     }
    //     if(ctx.user.enableTfa){
    //         if(!wr.tfa||wr.tfa===""){
    //             throw new ApolloError("undefined code 2fa");
    //         }
    //         const isVerified = speakeasy.totp.verify({
    //             secret: ctx.user.tfa.secret,
    //             encoding: "base32",
    //             token: wr.tfa
    //         });
    //         if(!isVerified){
    //             throw new ApolloError("2fa is not correct");
    //         }
    //     }}
    // }
    // }
};

export default ServiceResolvers;
