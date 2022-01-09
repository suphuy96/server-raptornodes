import { ApolloError } from "apollo-server-express";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import {checkIsAuthen,checkIsAdmin} from "../../util/checkAuthen";
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
        getBalance: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);

                return await RPCRuner.getAddressBalance(ctx.user.addressRTM);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        getBalanceByAddress: async (__: any, args: { address:string },ctx:any) => {
            try {
                return await RPCRuner.getAddressBalance(args.address);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        lastTxid: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);


                const res:any =  await RPCRuner.getaddresstxids(ctx.user.accountRTM);
                // return  res.filter(item=>item.category==='send');
                // "walletconflicts": null,
                if(res.length===0){
                    return "";
                }
                return res[res.length-1].txid;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        getInfoRTM: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const res:any =  await RPCRuner.getblockchaininfo();
                const res2:any = await RPCRuner.getwalletinfo();
                console.log(res2,"res2",_.merge(res,res2));
                return  _.merge(res,res2);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        transactions: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const count = args.count;
                const skip = args.skip;
                const params = ctx.user.rules==="Admin"?[null,count,skip]:[ctx.user.accountRTM,count,skip];
                const res:any =  await RPCRuner.listtransactions(params);
                //
                // "walletconflicts": null,
                console.log("vào ayadfasdkflajsdflajsdlfjasd",__);
                if(args.category){
                    return  res.filter((item:any)=>item.category===args.category);
                }
                return res;
            } catch (error) {
                throw new ApolloError(error);
            }
        }

    },
};

export default ServiceResolvers;
