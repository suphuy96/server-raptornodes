import { ApolloError } from "apollo-server-express";
import {UltraFastEarning, UltraFastEarningDocument, IUltraFastEarning} from "../../models/ultraFastEarning";
import {checkIsAuthen} from "../../util/checkAuthen";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import {IUser, User} from "../../models/User";

import {IWithdrawWeekly, WithdrawWeekly} from "../../models/WithdrawWeekly";
import {ReWard} from "../../models/Reward";
import {SmartNode} from "../../models/SmartNode";
import {WALLET_PASS_PHRASE} from "../../util/secrets";
import {DataUltraFastEarning, IDataUltraFastEarning, IparticipantInUFE} from "../../models/dataUltraFastEarning";
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

const getDataUFE = async ()=>{
    const ars = await DataUltraFastEarning.find();
    if(ars.length===0){
        const deff = {amount:0,status:"Enough",description:""};
        const ss = new DataUltraFastEarning(deff);
        await ss.save();
        return ss;
    }
    return ars[0];
};
let isCheckWithdrawlWeekly = false;

setInterval(async()=>{
    console.log("check withdrawl weekly");
    isCheckWithdrawlWeekly = true;
    const withdrawWeeklys = await WithdrawWeekly.find({status:"waitForPayment"});
    if(withdrawWeeklys && withdrawWeeklys.length){
        try{
            for (const withdrawWeekly of withdrawWeeklys){
                await new Promise((resolve) => {
                    setTimeout(()=>{resolve(true),2000;});
                });
                const balance = await RPCRuner.getbalance(global.settingSystem.withdrawlWeeklyAccount||"WithdrawlWeekly");
                if(balance>=withdrawWeekly.amount){
                    const auth = await User.findById(withdrawWeekly.author);
                    try{
                        await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
                    }catch (e){
                        console.log(e);
                    }
                    const rawData2 = await RPCRuner.sendFrom({address:(auth.addressRTM),account:global.settingSystem.withdrawlWeeklyAccount||"WithdrawlWeekly",comment:"WithdrawlWeekly in Raptornodes.com",amount:withdrawWeekly.amount,comment_to:""});
                    if(rawData2){
                        withdrawWeekly.status = "Done";
                        withdrawWeekly.txid = rawData2;
                        await withdrawWeekly.save();
                    }
                }
            }
        }catch (e){
            console.log("e",e);
        }
    }


    const dataUFEf = await getDataUFE();
        if(dataUFEf && dataUFEf.participants.length){
            const withdrawWeeklyPendings = await WithdrawWeekly.find({status:"Pending"});
            const funX = (participants:IparticipantInUFE[],dataUFE:IDataUltraFastEarning)=>{
                let total = 0;
                const participantsS:any[] = [];
                participants.some((item)=>{
                    if(dataUFE.amount<=total+item.amount){
                        total += item.amount;
                        participantsS.push({
                            ultraFastEarnings:item.ultraFastEarnings,
                            txids:item.txids,
                            author:item.author,
                            full:true,
                            amount :item.amount ,
                            change:0,
                            timeEchange:new Date()});
                    } else{
                        if(dataUFE.amount<total) {
                           const participantr=  {
                                ultraFastEarnings: item.ultraFastEarnings,
                                    txids: item.txids,
                                author: item.author,
                                full: true,
                                amount: dataUFE.amount-total,
                                change: item.amount -(dataUFE.amount-total),
                                timeEchange: new Date()
                            };
                            participantsS.push(participantr);
                            total+=participantr.amount;

                        }
                        return true;
                    }
                });
                return {total,participants};
            };
            if(withdrawWeeklyPendings && withdrawWeeklyPendings.length){
                try {
                    for (const withdrawWeekly of withdrawWeeklyPendings) {
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(true), 500;
                            });
                        });
                        const dataUFE = await getDataUFE();
                        const balance = await RPCRuner.getbalance(global.settingSystem.withdrawlWeeklyAccount||"WithdrawlWeekly");
                        if(balance>=withdrawWeekly.amount){
                            let info:{total:number,participants:any[]} = {total:0,participants:[]};
                            if(withdrawWeekly.amount>=dataUFE.participants[0].amount){
                                info = funX(dataUFE.participants,dataUFE);
                            } else{
                                const participantsSort = dataUFE.participants.sort((a,b)=>(a.amount-b.amount));
                                if(withdrawWeekly.amount>=participantsSort[0].amount){
                                    info = funX(participantsSort,dataUFE);
                                }else{

                                }
                            }
                            if(info.participants.length && info.total === withdrawWeekly.amount){
                                for await (const participant of info.participants) {
                                    await new Promise((resolve)=>{
                                        setTimeout(()=>{
                                            resolve(true);
                                        },500);
                                    });
                                    const auth = await User.findById(withdrawWeekly.author);
                                    try{
                                        await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
                                    }catch (e){
                                        console.log(e);
                                    }
                                    // setup status;
                                    // withdrawWeekly.status = "waitForPayment";
                                    // await withdrawWeekly.save();
                                    const rawData3 = await RPCRuner.sendFrom({address:(auth.addressRTM),account:global.settingSystem.withdrawlWeeklyAccount||"WithdrawlWeekly",comment:"WithdrawlWeekly in Raptornodes.com",amount:withdrawWeekly.amount,comment_to:""});
                                    if(rawData3){
                                        // update transition in withdrawWeekly
                                        withdrawWeekly.status = "Done";
                                        withdrawWeekly.txid = rawData3;
                                        withdrawWeekly.ultraFastEarning = participant.ultraFastEarnings?participant.ultraFastEarnings[participant.ultraFastEarnings.length-1]:"";
                                        await withdrawWeekly.save();

                                        const smartNode = await SmartNode.findById( withdrawWeekly.smartNode);
                                        console.log(smartNode,"444smartNode");

                                        const withdrawParticipant =   smartNode.participants.find(ii=>ii.userId && typeof ii.userId==="object"&&withdrawWeekly.author ===ii.userId._id);
                                        console.log("withdrawParticipant222",withdrawParticipant);

                                        if(withdrawParticipant){
                                            withdrawParticipant.collateral -= withdrawWeekly.amount;
                                            withdrawParticipant.txids.push(rawData3);
                                            withdrawParticipant.percentOfNode=withdrawParticipant.collateral/smartNode.collateral;
                                            withdrawParticipant.exchange = (withdrawParticipant.exchange||0) - withdrawWeekly.amount;
                                            withdrawParticipant.time =new Date();
                                            await smartNode.save();
                                        }

                                            // const arss:[IparticipantInUFE]= new Array() ;
                                            let totalD = 0;
                                            // dataUFE.participants.forEach((part:IparticipantInUFE)=>{
                                                for await (const part of dataUFE.participants) {
                                                const participantInUFEDone = info.participants.find((item)=>item.author ===part.author);
                                                if(participantInUFEDone){
                                                    if(participantInUFEDone.full){
                                                        part.amount = 0;
                                                    } else{
                                                        part.amount =participantInUFEDone.change;
                                                        // arss.push(part);
                                                    }
                                                    const yourParticipants =   smartNode.participants.find(ii=>ii.userId && typeof ii.userId==="object"&&part.author===ii.userId._id);
                                                    if(yourParticipants){
                                                        yourParticipants.collateral += part.amount;
                                                        yourParticipants.txids =yourParticipants.txids.concat(part.txids);
                                                        yourParticipants.percentOfNode=yourParticipants.collateral/smartNode.collateral;
                                                        yourParticipants.time =new Date();
                                                    } else{
                                                        smartNode.participants.push({userId:part.author,RTMRewards:0,collateral:part.amount,pendingRTMRewards:0,percentOfNode:part.amount/smartNode.collateral
                                                            ,txids:part.txids
                                                            ,time:new Date()});
                                                    }
                                                }
                                                    totalD+=part.amount;


                                                        await smartNode.save();


                                            }
                                        dataUFE.participants = dataUFE.participants.filter((item:IparticipantInUFE)=>item.amount);
                                        dataUFE.amount = totalD;
                                        await dataUFE.save();
                                        // update transition in ultraFastEarning

                                        // update smartnode for user ultraFastEarning


                                    }

                                }
                            }
                        }

                    }
                }catch (e){
                }
            }
        }
    isCheckWithdrawlWeekly = false;
},180000);

const ServiceResolvers = {
    Query: {
        ultraFastEarnings: async (__: any, args: any,ctx:any) => {
            try {
               checkIsAuthen(ctx.user);
                const objFilter:any&{status?:string,smartNode?:string,author?:string,createdAt?:any} = ctx.user.rules==="Admin"?{}:{author:ctx.user._id};
                if (args.status){
                    objFilter.status =args.status;
                }
                if (args.smartNode){
                    objFilter.smartNode =args.smartNode;
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
               const ars = await UltraFastEarning.find(objFilter).populate("author");
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
                    try{
                        await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
                    }catch (e){
                        console.log(e);
                    }
                    const rawData = await RPCRuner.sendFrom({address:(global.settingSystem.withdrawWeeklyAddress),account:ctx.user.accountRTM,comment:comment,amount:wr.amount,comment_to:""});
                        if(!rawData){
                            throw new ApolloError("send RTM correct");
                        }
                    ultraFastEarning.txid = rawData;
                    ultraFastEarning.participants = [];
                    const withdrawSave= await ultraFastEarning.save();
                    const withdrawWeeklys = await WithdrawWeekly.find({status:"Pending"}).sort({createdAt: 1}).exec();
                    console.log("withdrawWeeklys",withdrawWeeklys);
                    if(withdrawWeeklys.length){
                       const withdrawWeekly = withdrawWeeklys[0];
                       const funX = (withdrawWeeklyss:IWithdrawWeekly[])=>{
                           let total = 0;
                           const participants:any[] = [];
                           withdrawWeeklyss.some((item)=>{
                               if(ultraFastEarning.amount>total+item.amount){
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
                       if(ultraFastEarning.amount>=withdrawWeekly.amount){
                           info = funX(withdrawWeeklys);
                       } else{
                           const withdrawWeeklysSort = withdrawWeeklys.sort((a,b)=>(a.amount-b.amount));
                         if(ultraFastEarning.amount>=withdrawWeeklysSort[0].amount)
                           info = funX(withdrawWeeklysSort);
                       }
                       if(info.participants.length) {
                           ultraFastEarning.swap = true;
                           ultraFastEarning.inFund = false;
                           for await (const participant of info.participants) {
                               await new Promise((resolve)=>{
                                   setTimeout(()=>{
                                       resolve(true);
                                   },500);
                               });
                               const smartNode = await SmartNode.findById( participant.smartNode);
                               console.log(smartNode,"smartNode");
                               const withdrawParticipant =   smartNode.participants.find(ii=>ii.userId && typeof ii.userId==="object"&&participant.author.equals(ii.userId._id));
                               console.log("withdrawParticipant",withdrawParticipant);

                               if(withdrawParticipant){
                                   withdrawParticipant.collateral -= participant.exchange;
                                   withdrawParticipant.txids.push(ultraFastEarning.txid);
                                   withdrawParticipant.percentOfNode=withdrawParticipant.collateral/smartNode.collateral;
                                   withdrawParticipant.exchange = (withdrawParticipant.exchange||0) - participant.exchange;
                                   withdrawParticipant.time =new Date();
                               }
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
                              const wrwk = await WithdrawWeekly.findById(participant._idWithdrawWeekly);
                              wrwk.status = "waitForPayment";
                               wrwk.ultraFastEarning = ultraFastEarning._id;
                              await wrwk.save();
                               const balancec = await RPCRuner.getbalance(global.settingSystem.withdrawlWeeklyAccount||"WithdrawlWeekly");
                               if(balancec>=wrwk.amount){
                                   const auth = await User.findById(participant.author);
                                   if(auth){
                                       try{
                                           await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
                                       }catch (e){
                                           console.log(e);
                                       }
                                   const rawData2 = await RPCRuner.sendFrom({address:(global.settingSystem.withdrawWeeklyAddress),account:auth.accountRTM,comment:"WithdrawlWeekly in Raptornodes.com",amount:wr.amount,comment_to:""});
                                        if(rawData2){
                                            wrwk.status = "Done";
                                            wrwk.txid = rawData2;
                                           await wrwk.save();
                                        }
                                   } else{
                                       console.log("error not auth");
                                   }
                               }
                           }

                           ultraFastEarning.participants = info.participants;
                           console.log("haha222",info,ultraFastEarning);
                           if(ultraFastEarning.amount-info.total>0){
                               // chuaw xuwr lys
                               const dataUFE = await getDataUFE();
                               console.log(dataUFE,"2dataUFE",JSON.stringify(dataUFE));
                               const findYouParticipant = dataUFE.participants.find((item:any)=>{ctx.user._id.equals(item.author);});
                               if(findYouParticipant){
                               //    update
                                   findYouParticipant.txids.push(rawData);
                                   findYouParticipant.time = new Date();
                                   findYouParticipant.amount += (ultraFastEarning.amount||0)-info.total;
                                   findYouParticipant.ultraFastEarnings.push(ultraFastEarning._id);
                               }else{
                                   const YouParticipant:IparticipantInUFE = {time:new Date(),amount:ultraFastEarning.amount-info.total,txids:[rawData],ultraFastEarnings:[ultraFastEarning._id],author:ctx.user._id};
                                   dataUFE.participants.push(YouParticipant);
                               }
                               let am = 0;
                               dataUFE.participants.forEach((item)=>{
                                   am+=item.amount;
                               });
                               dataUFE.amount = am;
                               await dataUFE.save();
                           }
                       } else{
                           ultraFastEarning.swap = false;
                           ultraFastEarning.inFund = true;
                       }
                    } else{
                        ultraFastEarning.swap = false;
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
