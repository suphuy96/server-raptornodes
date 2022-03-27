import { ApolloError } from "apollo-server-express";
import {History} from "../../models/History";
import {checkIsAuthen} from "../../util/checkAuthen";

import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
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
        historys: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const objFilter:any&{status?:string,author?:string,createdAt?:any} = ctx.user.rules==="Admin"?{}:{author:ctx.user._id};
                if (args.action){
                    objFilter.action =args.action;
                }
                if (ctx.user.rules==="Admin" && args.author){
                    objFilter.author =args.author;
                }
                if (args.createdAt){
                    objFilter.createdAt = {};
                    Object.keys(args.createdAt).forEach((keyTr) =>{
                        if(["eq","neq","ne","in","nin","gte","gt","lt","lte"].includes(keyTr)){
                            objFilter.createdAt["$" + keyTr] = args.createdAt[keyTr];
                        }
                    });
                }
                // if(ctx.user.rules==="Admin"){
                //     return await History.find(args).populate("user");
                // }
               const ars = await History.find(objFilter).populate("author").sort({createdAt:-1}).limit(args.limit||100).skip(args.offset||0);
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        historyUsers :async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const count = args.count;
                const skip = args.skip;
                const params =[null,count,skip];
                const res:any =  await RPCRuner.listtransactions(params);
               const arrss:any[] = [] ;
               const minDate:number = new Date().getTime()-(86400000*7);
                // console.log(res);
               res.forEach((item:any)=>{
                   if(item.time*1000>minDate){
                   const it = {type :"Deposit",value:item.category ==="send"?-item.amount:item.amount,time:item.time*1000};
                    if(item.category ==="receive"){
                        if(item.comment && item.comment.indexOf("Reward")!==-1){
                            it.type ="Reward";
                        }else
                        it.type ="Deposit";
                    }else {
                        if(item.comment && item.comment.indexOf("join")!==-1){
                            it.type ="Join";
                        }else
                        if(item.label && item.label.indexOf("SmartNode#")!==-1){
                            it.type ="Join";
                        }else if(item.label && item.label.indexOf("WithdrawlWeekly")!==-1){
                            it.type ="Join";
                        }else{
                            it.type ="Withdraw";
                        }
                    }
                   arrss.push(it);
                   }
                });
                return arrss;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
