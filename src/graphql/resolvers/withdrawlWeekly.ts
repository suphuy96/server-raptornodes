import { ApolloError } from "apollo-server-express";
import {WithdrawWeekly, WithdrawWeeklyDocument, IWithdrawWeekly} from "../../models/WithdrawWeekly";

import {checkIsAdmin, checkIsAuthen} from "../../util/checkAuthen";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import {Iparticipant, ISmartNode, SmartNode} from "../../models/SmartNode";
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
        withdrawWeeklys: async (__: any, args: { status:string,smartNode:string },ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const objFilter:any&{status?:string,smartNode?:string,author?:string} = ctx.user.rules==="Admin"?{}:{author:ctx.user._id};
                if (args.status){
                    objFilter.status =args.status;
                }
                if (args.smartNode){
                    objFilter.smartNode =args.smartNode;
                }
                const ars = await WithdrawWeekly.find(objFilter).populate("author");
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
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        withdrawWeeklyOnboardings: async (__: any, args: { status:string },ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const balance = await RPCRuner.getbalance(global.settingSystem.withdrawlWeeklyAccount||"WithdrawlWeekly");

                const  withdrawWeeklys = await WithdrawWeekly.aggregate([{ $match:{status:"Pending"}},{
                    $group :{
                        _id : null,
                        count:{ "$sum":1
                        },
                        amount:{ "$sum":"$amount"
                        }}}]).exec();
                console.log("withdrawWeeklys",withdrawWeeklys);
               const withdrawlIsPending = withdrawWeeklys.length?withdrawWeeklys[0].amount:0;
                return {
                    balance,
                    withdrawlIsPending,
                    weeklyFund:global.settingSystem.weeklyFund||0,
                    availability:(global.settingSystem.weeklyFund||0)+withdrawlIsPending-(balance>(global.settingSystem.weeklyFund||0)?(global.settingSystem.weeklyFund||0):balance)
                };
            } catch (error) {
                throw new ApolloError(error);
            }
        }

    },
    Mutation: {
        createWithdrawWeekly: async (__: any, wr: IWithdrawWeekly &{tfa:string},ctx:any) => {
            try {
                //check authen
                checkIsAuthen(ctx.user);
                if(global.settingSystem && global.settingSystem.enableWithdraw===false){
                    throw new ApolloError("The system is maintenance!!");
                }
                if(global.settingSystem.isMaintenance){
                    throw new ApolloError("System is Maintenance");
                }
                if(!wr.smartNode || wr.smartNode===""){
                    throw new ApolloError("Missing field Data smartNode");
                }
                if(!wr.address || wr.address ===""){
                    throw new ApolloError("Please enter data field address");
                }
                if(!wr.amount || wr.amount <global.settingSystem.withdrawlWeeklyMinimum){
                    throw new ApolloError("the amount must be lower "+global.settingSystem.withdrawlWeeklyMinimum);
                }
                if(!ctx.user.enableTfa){
                    throw new ApolloError("You need to enable Two Factor Authentication");
                }
                const smartNode = await SmartNode.findById(wr.smartNode);
                if(!smartNode){
                    throw new ApolloError("Missing field Data smartNode");
                }
                const participant :Iparticipant = smartNode.participants.find(ii=>ii.userId && typeof ii.userId==="object"&&ctx.user._id.equals(ii.userId._id));
                if(!participant){
                    throw new ApolloError("you have no collateral in smartnode "+smartNode.label);

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
                const WithdrawWeeklys = await WithdrawWeekly.find({smartNode:wr.smartNode});
                const WithdrawWeeklyCurrent = WithdrawWeeklys.find(item=>item.status==="Pending");
                if(WithdrawWeeklyCurrent){
                    if(WithdrawWeeklyCurrent.confirm===true){
                        throw new ApolloError("You have been approved with the amount "+WithdrawWeeklyCurrent.amount+"RTM, if you want to change please cancel the current request!");
                    }
                    if(wr.address)
                    WithdrawWeeklyCurrent.address = wr.address;
                    if(wr.amount)
                        WithdrawWeeklyCurrent.amount = wr.amount;

                    WithdrawWeeklyCurrent.collateralOld = participant.collateral;
                    await WithdrawWeeklyCurrent.save();
                    return  WithdrawWeeklyCurrent;
                } else {
                    const withdraw = new WithdrawWeekly();
                    withdraw.address = wr.address;
                    withdraw.amount = wr.amount;

                    withdraw.collateralOld = participant.collateral;
                    withdraw.author = ctx.user._id;
                    withdraw.smartNode = wr.smartNode;
                    try {
                        const withdrawSave= await withdraw.save();

                        return withdrawSave;
                    }catch (e){
                        throw new ApolloError("Error"+e.toString());
                        console.log("fixx",e);
                    }
                    return withdraw;

                }



            } catch (error) {
                throw new ApolloError(error);
            }
        },
        updateWithdrawWeekly: async (__: any, args:{_id:string,confirm:boolean,status:string,tfa:string},ctx:any) => {
            checkIsAuthen(ctx.user);
            const withdrawWeekly = await WithdrawWeekly.findById(args._id);
            if(!withdrawWeekly){
                throw new ApolloError("Not found document");
            }
            if(ctx.user.rules !=="Admin" && !ctx.user._id.equals(withdrawWeekly.author)){
                throw new ApolloError("You Not Has Permission");
            }
            if(ctx.user.rules ==="Admin"){
                if(args.confirm|| args.confirm===false){
                    withdrawWeekly.confirm = args.confirm;
                }
            }
            if(args.status && args.status === "Cancel" && withdrawWeekly.status==="Pending"){
                withdrawWeekly.status = args.status;
            } else if(args.status && withdrawWeekly.status!=="Pending"){
                throw new ApolloError("Not Done");
            }

            await withdrawWeekly.save();
            return withdrawWeekly;
        }
    }
};

export default ServiceResolvers;
