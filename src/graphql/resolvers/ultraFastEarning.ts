import { ApolloError } from "apollo-server-express";
import {UltraFastEarning, UltraFastEarningDocument, IUltraFastEarning} from "../../models/ultraFastEarning";
import {checkIsAuthen} from "../../util/checkAuthen";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import {IWithdrawWeekly, WithdrawWeekly} from "../../models/WithdrawWeekly";
import {ReWard} from "../../models/Reward";
import {SmartNode} from "../../models/SmartNode";
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
        ultraFastEarnings: async (__: any, args: any,ctx:any) => {
            try {
               checkIsAuthen(ctx.user);
               const ars = await UltraFastEarning.find({author:ctx.user._id}).populate("author");
                const res:any =  await RPCRuner.listtransactions([ctx.user.accountRTM]);
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
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        createUltraFastEarning: async (__: any, wr: IUltraFastEarning &{tfa:string},ctx:any) => {
            try {
                //check authen
                checkIsAuthen(ctx.user);
                const balance = await RPCRuner.getbalance(global.settingSystem.withdrawlWeeklyAccount||"WithdrawlWeekly");
                const youBalance = await RPCRuner.getbalance(ctx.user.accountRTM);

                const  withdrawWeeklys = await WithdrawWeekly.aggregate([{ $match:{status:"Pending"}},{
                    $group :{
                        _id : null,
                        count:{ "$sum":1
                        },
                        amount:{ "$sum":"$amount"
                        }}}]).exec();
                const withdrawlIsPending = withdrawWeeklys.length?withdrawWeeklys[0].amount:0;
                const availability=(global.settingSystem.weeklyFund||0)+withdrawlIsPending-(balance>(global.settingSystem.weeklyFund||0)?(global.settingSystem.weeklyFund||0):balance);
                if(wr.amount>youBalance){
                    throw new ApolloError("\n" +
                        "Not enough money, please enter a maximum of!"+(youBalance).toFixed(8)+" RTM");
                }
                if(wr.amount>availability){
                    throw new ApolloError("\n" +
                        "The amount is too large, please enter a maximum of!"+(availability).toFixed(8)+" RTM");
                }
                if(global.settingSystem && global.settingSystem.enableWithdraw===false){
                    throw new ApolloError("The system is maintenance!!");
                }
                if(global.settingSystem.isMaintenance){
                    throw new ApolloError("System is Maintenance");
                }
                const ultraFastEarning = new UltraFastEarning();
                ultraFastEarning.address = global.settingSystem.withdrawWeeklyAddress;
                ultraFastEarning.amount = wr.amount;
                ultraFastEarning.status = "Processing";
                const comment = "UFE in Raptornodes.com";
                ultraFastEarning.description = wr.description||comment;
                ultraFastEarning.author = ctx.user._id;
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
                    const rawData = await RPCRuner.sendFrom({address:(global.settingSystem.withdrawWeeklyAddress),account:ctx.user.accountRTM,comment:comment,amount:wr.amount,comment_to:""});
                    ultraFastEarning.txid = rawData;
                    ultraFastEarning.participants = [];
                    const withdrawSave= await ultraFastEarning.save();
                    const withdrawWeeklys = await WithdrawWeekly.find({status:"Pending"}).sort({createdAt: 1}).exec();
                    if(withdrawWeeklys.length){
                       const withdrawWeekly = withdrawWeeklys[0];
                       const funX = (withdrawWeeklyss:IWithdrawWeekly[])=>{
                           let total = 0;
                           const participants:any[] = [];
                           withdrawWeeklyss.some((item)=>{
                               if(ultraFastEarning.amount<total+item.amount){
                                   total += item.amount;
                                   participants.push({

                                       smartNode:item.smartNode,author:item.author,collateralOld :item.collateralOld ,
                                       collateralNew:item.collateralOld-item.amount,
                                       exchange:item.amount,
                                       _idWithdrawWeekly:item._id,
                                       timeEchange:new Date()});
                               } else{
                                   return true;
                               }
                           });
                           return {total,participants};
                       };
                      let info:{total:number,participants:any[]} = {total:0,participants:[]};
                       if(withdrawWeekly.amount<withdrawWeekly.amount){
                           info = funX(withdrawWeeklys);
                       } else{
                           const withdrawWeeklysSort = withdrawWeeklys.sort((a,b)=>(a.amount-b.amount));
                         if(withdrawWeeklysSort[0].amount<withdrawWeekly.amount)
                           info = funX(withdrawWeeklysSort);
                       }
                       if(info.participants.length) {
                           ultraFastEarning.swap = true;
                           for await (const participant of info.participants) {
                               const smartNode = await SmartNode.findById( participant.smartNode);
                               console.log(smartNode,"smartNode");
                               const yyyParticipants =   smartNode.participants.find(ii=>ii.userId && typeof ii.userId==="object"&&participant.author.equals(ii.userId._id));
                               console.log(yyyParticipants,"yyyParticipants");
                               yyyParticipants.collateral -= participant.exchange;
                               yyyParticipants.exchange = (yyyParticipants.exchange||0)+participant.exchange;
                               const yourParticipants =   smartNode.participants.find(ii=>ii.userId && typeof ii.userId==="object"&&ctx.user._id.equals(ii.userId._id));
                              if(yourParticipants){
                                  yourParticipants.collateral += participant.exchange;
                                  yourParticipants.txids.push(ultraFastEarning.txid);
                                  yourParticipants.percentOfNode=yourParticipants.collateral/smartNode.collateral;
                                  yourParticipants.time =new Date();
                              } else{
                                  smartNode.participants.push({userId:ctx.user._id,RTMRewards:0,collateral:participant.exchange,pendingRTMRewards:0,percentOfNode:participant.exchange/smartNode.collateral
                                      ,txids:[ultraFastEarning.txid]
                                      ,time:new Date()});
                              }
                               await smartNode.save();
                           }

                           ultraFastEarning.participants = info.participants;
                       } else{
                           ultraFastEarning.swap = false;
                           ultraFastEarning.inFund = true;
                       }
                    } else{
                        ultraFastEarning.inFund = true;
                    }
                     await ultraFastEarning.save();
                    try {
                        if(global.settingSystem && global.settingSystem.mailWithdraw && global.settingSystem.mailWithdraw.enable){
                            //send mail
                            // sendMail(ctx.user.email+( global.settingSystem.mailWithdraw.cc.length?(","+global.settingSystem.mailWithdraw.cc.join()):""),_.template(global.settingSystem.mailWithdraw.label)({name:ctx.user.profile.name,email:ctx.user.email,avatar:ctx.user.profile.picture,data:""}),_.template(global.settingSystem.mailWithdraw.template)({name:ctx.user.profile.name,email:ctx.user.email,avatar:ctx.user.profile.picture,data:""})).then(data=>{
                            //     console.log("đàads");
                            // });
                        }
                    }catch(e){
                        console.log(e);
                    }
                    return withdrawSave;
                }catch (e){
                    throw new ApolloError("Error"+e.toString());
                    console.log("fixx",e);
                }
                return ultraFastEarning;

            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
