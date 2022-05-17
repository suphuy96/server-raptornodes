import { ApolloError } from "apollo-server-express";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import {checkIsAuthen,checkIsAdmin} from "../../util/checkAuthen";
import {ReWardHistory} from "../../models/RewardHistory";
import {getblockcount} from "../../helper/request/explorerRaptoreum";
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
// let mapBalance:Map<string, number> = new Map();
let objBalance:any = {};
let objBalance11:any = {};
let objreceived:any = {};
let timeLastRequest = 1;
const timeCache = 300000;
const ServiceResolvers = {
    Query: {
        getBalance: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                if(timeLastRequest+timeCache<new Date().getTime()) {
                    objBalance = await RPCRuner.listaccounts().catch(() => {
                        return {};
                    });
                    // console.log('get nuew')
                }
                // if(timeLastRequest+(timeCache)<new Date().getTime()||(!objBalance11[ctx.user.accountRTM]&&objBalance11[ctx.user.accountRTM]!==0)) {
                    const balanceHaveConfirmations = await RPCRuner.getbalance(ctx.user.accountRTM,11);
                    objBalance11[ctx.user.accountRTM] = balanceHaveConfirmations;
                    // console.log('get n2uew')

                // }
                if(timeLastRequest+timeCache<new Date().getTime()||(!objreceived[ctx.user.accountRTM]&&objreceived[ctx.user.accountRTM]!==0)) {
                    const received = await RPCRuner.getreceivedbyaccount(ctx.user.accountRTM);
                    objreceived[ctx.user.accountRTM] = received;
                    // console.log('get nue33w')

                }
                timeLastRequest = new Date().getTime();
                // console.log('----===',timeLastRequest);


                const balance = await objBalance[ctx.user.accountRTM];
                // const balanceHaveConfirmations = objBalance11[ctx.user.accountRTM];
                const received = objreceived[ctx.user.accountRTM];
                const dataReward:{amount:number}[] = await ReWardHistory.aggregate([{ $match:{user:ctx.user._id}},{
                    $group :{
                        _id : null,
                        count:{ "$sum":1
                        },
                        amount:{ "$sum":"$amount"
                        }}}]).exec();
                return await {balance,balanceHaveConfirmations,rewarded:dataReward&&dataReward[0]?dataReward[0].amount:0,received};
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
                const params = ctx.user.rules==="Admin"?[args.account?args.account:null,count,skip]:[ctx.user.accountRTM,count,skip];
                const res:any =  await RPCRuner.listtransactions(params);
                // "walletconflicts": null,
                // console.log(args.time);
                if(args.category){
                    return  res.filter((item:any)=>item.category===args.category);
                }
                return res;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        reWardBalancePending: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const count = args.count;
                const skip = args.skip;
                const params = [global.settingSystem.rewardAccount,count,skip];
                const res:any[] =  await RPCRuner.listtransactions(params);
                // const arrs = res.filter((it:any)=>it &&it.amount && it.confirmations<4);
                // let balancePending = 0;
                // console.log(arrs);
                // arrs.forEach((item)=>{
                //     balancePending+=item.amount;
                // });
                return 0;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        getblockcount:async (__: any, args: any,ctx:any) => {
           const res:{data:number} = await  getblockcount(global.settingSystem.testNet);
            return res.data;
        },
        listaddressgroupings: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const objDa = await RPCRuner.listaddressgroupings();
                console.log(objDa,"objDa");
                const list:{account:string,balance:number}[] = [];
                Object.keys(objDa).forEach((key)=>{
                    list.push({account:key,balance:objDa[key]});
                });
                return await list;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        listaccounts: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const objDa = await RPCRuner.listaccounts();
                const list:{account:string,balance:number}[] = [];
                Object.keys(objDa).forEach((key)=>{
                    list.push({account:key,balance:objDa[key]});
                });
                return await list;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    },
};

export default ServiceResolvers;
