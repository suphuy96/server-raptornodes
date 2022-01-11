import { ApolloError } from "apollo-server-express";
import {ReWard, ReWardDocument, IReWard} from "../../models/ReWard";
import {ReWardHistory} from "../../models/RewardHistory";
import {User, IUser} from "../../models/User";
import {SmartNode,SmartNodeDocument, ISmartNode} from "../../models/SmartNode";
import {checkIsAuthen,checkIsAdmin} from "../../util/checkAuthen";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
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
        rewardHistorys: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
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
    Mutation: {
    }
};

export default ServiceResolvers;
