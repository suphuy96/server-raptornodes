import { ApolloError } from "apollo-server-express";
import {ReWard, ReWardDocument, IReWard} from "../../models/Reward";
import {ReWardHistory} from "../../models/RewardHistory";
import {WithdrawWeekly, WithdrawWeeklyDocument, IWithdrawWeekly} from "../../models/WithdrawWeekly";
import {ISmartNode, SmartNode,SmartNodeDocument} from "../../models/SmartNode";
import {checkIsAuthen,checkIsAdmin} from "../../util/checkAuthen";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import _ from "lodash";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import defaultSetting from "../../config/settingSystemDefault";

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
import  {ScheduledTask,schedule,validate} from "node-cron";
import {System, SystemDocument} from "../../models/System";
import {WALLET_PASS_PHRASE} from "../../util/secrets";
import {DataUltraFastEarning, IDataUltraFastEarning,DataUltraFastEarningDocument} from "../../models/dataUltraFastEarning";
import {IUser,UserDocument} from "../../models/User";
import {History} from "../../models/History";
let isWaitToDone = false;
let timeOutCheck = setTimeout(()=>{console.log("timeOutCheck");},100);
let timeOutCheckReTry = setTimeout(()=>{console.log("timeOutCheckReTry");},100);
let isWaitToDoneReTry = false;
let rewardTask :ScheduledTask= schedule("59 23 * * *",async () => {
    console.log("schedule-- rewardTask ----nulll");
});
let rewardTask2 :ScheduledTask= schedule("58 23 * * *",async () => {
    console.log("schedule-- rewardTask2 ----nulll");
});
const getDataUFE = async ()=>{
    const ars = await DataUltraFastEarning.find().populate("participants.author");
    if(ars.length===0){
        const deff = {amount:0,status:"Enough",description:""};
        const ss = new DataUltraFastEarning(deff);
        await ss.save();
        return ss;
    }
    return ars[0];
};

const funReward = async (reward:ReWardDocument,sNode?:SmartNodeDocument,lastHeightReward?:number) => {
    try {
        const reWardBalance = await RPCRuner.getbalance(global.settingSystem.rewardAccount,4);
        const realReWardBalance = reWardBalance;
        let totalReward = 0;
        if(sNode)
            for await (const participant of sNode.participants) {
                const comment = "ReWard in Raptornodes.com";
                const amount = participant.percentOfNode * sNode.totalMatureInNextReward*((100-global.settingSystem.feeReward) / 100);
                const feeHost = sNode.totalMatureInNextReward*((global.settingSystem.feeReward) / 100);
                totalReward+=amount;

            }
        console.log("tới đây00000");

        if(global.settingSystem.mailReward.cc.length){
            sendMail( (global.settingSystem.mailReward.cc.length ? ( global.settingSystem.mailReward.cc.join()) : ""), "Schedule ReWard  Smartnode: "+(sNode?sNode.label:""),"Schedule ReWard  Smartnode "+(sNode?sNode.label:"")+" in raptornodes.com, totalReward:" +totalReward.toFixed(8)+"RTM, reWardBalance:"+reWardBalance+"RTM").then(()=>{
                console.log("");
            });
        }
        if(totalReward>realReWardBalance){
            try{
                const settingSystem:SystemDocument = await System.findOne();
                settingSystem.missingReward = true;
                settingSystem.timeMissingReward = new Date();
                settingSystem.save();
                reward.missingReward = true;
                reward.save();
            }catch (e){

            }


            sendMail( process.env.ADMINS, "Error!! Not enough balance to pay the reward, "+(sNode?sNode.label:"")+" Smartnode","Schedule ReWard  Smartnode "+(sNode?sNode.label:"")+"in raptornodes.com, totalReward:" +totalReward.toFixed(8)+"RTM, reWardBalance:"+realReWardBalance+"RTM").then(()=>{
                console.log("");
            });
            return false;
        }else
        {
            const funReW = async(userId:UserDocument,collateral:number,percentOfNode:number,smartnode?:SmartNodeDocument)=>{
                const comment = "ReWard in Raptornodes.com";
                const amount = sNode.totalMatureInNextReward *( percentOfNode * ((100 - global.settingSystem.feeReward) / 100));
                const feeHost = sNode.totalMatureInNextReward * ( percentOfNode * ((global.settingSystem.feeReward) / 100));
                console.log("name:",userId.profile.name,"discord:",userId.discord,"email:",userId.email,"amount:",amount);
                try{
                    await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,40);
                }catch (e){
                    console.log(e);
                }
                const rawData = await RPCRuner.sendFrom({
                    address:userId.isVirtual && userId.customAddressRTM && userId.customAddressRTM!=="" ?userId.customAddressRTM: userId.addressRTM,
                    account: global.settingSystem.rewardAccount,
                    comment: comment,
                    amount: parseFloat((amount).toFixed(8)),
                    comment_to: ""
                }).catch(e => {
                    console.log(e);
                    sendMail((global.settingSystem.mailReward.cc.length ? (global.settingSystem.mailReward.cc.join()) : ""), "Schedule ReWard User ---Error", "Schedule ReWard User:" + userId.email + "  raptornodes.com. Error" + e.toString()).then(() => {
                        console.log("");
                    });
                });
                console.log("rawData", rawData);
                const history = new ReWardHistory();
                history.description = comment;
                history.user = userId;
                history.collateral = collateral;
                history.percentOfNode = percentOfNode;
                history.isVitual = userId.isVirtual;
                history.feeReward = global.settingSystem.feeReward;
                if(smartnode && smartnode._id){
                    history.smartNode = smartnode._id;
                }
                history.feeHost = feeHost;
                history.amount = parseFloat((amount).toFixed(8));
                history.reward = reward._id;
                history.days = reward.days;
                history.dayEnd = reward.dayEnd || new Date();
                history.txid = rawData;
                history.paymentsPerDay = global.settingSystem.paymentsPerDay;
                history.save();
                try {
                    if (global.settingSystem && global.settingSystem.mailReward && global.settingSystem.mailReward.enable) {
                        sendMail((userId.email.indexOf("@")?userId.email:"") + (global.settingSystem.mailReward.cc.length ? ("," + global.settingSystem.mailReward.cc.join()) : ""), _.template(global.settingSystem.mailReward.label)({
                            name: userId.profile.name,
                            email: userId.email,
                            avatar: userId.profile.picture,
                            data: ""
                        }), _.template(global.settingSystem.mailReward.template)({
                            name: userId.profile.name,
                            email: userId.email,
                            avatar: userId.profile.picture,
                            data: ""
                        })).then(data => {
                            console.log("đàads");
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
                return rawData;
            };
            console.log("vào aydadfasdlfjasldjfasd");

            //    payment in smartnode
            // for await (const smartnode of smartnodes) {
            if(sNode){
                for await (const participant of sNode.participants) {
                    console.log("tới đây00000",participant);

                    await  funReW(participant.userId,participant.collateral,participant.percentOfNode,sNode);
                }
                sNode.lastReward = new Date();
                sNode.lastHeightReward = lastHeightReward;
            sNode.save();
            }
        if(global.settingSystem.withdrawlWeekly) {
            const dataUFE: DataUltraFastEarningDocument = await getDataUFE();
            //    payment in UltraFastEarning
            if (dataUFE && dataUFE.amount && dataUFE.participants.length) {
                for await (const participant of dataUFE.participants) {
                    if (participant) {
                        const txidLastReward = await funReW(participant.author, participant.amount, (participant.amount / global.settingSystem.collateral));
                        participant.lastReward = new Date();
                        participant.txidLastReward = txidLastReward;
                        await dataUFE.save();
                    }
                }
                dataUFE.lastReward = new Date();
                await dataUFE.save();
            }
        }
            // }
            try{
                const settingSystem:SystemDocument = await System.findOne();
                settingSystem.missingReward = false;
                settingSystem.save();
                clearTimeout(timeOutCheck);
                isWaitToDone = false;
            }catch (e){
                clearTimeout(timeOutCheck);
                isWaitToDone = false;
            }
        }
        // reward.save();
        isWaitToDone = false;
        clearTimeout(timeOutCheck);
        return true;
        // return reward;
    }catch (e){
        sendMail( process.env.ADMINS, "Error!! Not enough balance to pay the reward, "+e.toString()+" Smartnode","Schedule ReWard  Smartnode ").then(()=>{
            console.log("");
        });
        console.log("fixx",e);
        throw new ApolloError("Error"+e.toString());
        return false;
    }
};
// const run = async()=>{
//     const ttt =await funReward();
//     console.log('test',ttt);
// };
// run();
const payNow =async () => {
    if(isWaitToDone){
        throw new ApolloError("The system is paying the reward");
    }
    isWaitToDone = true;
    let arsNot = "";
    const smartnodes = await SmartNode.find({statusCollateral : "Start Reward" }).populate("participants.userId");
    console.log("vào đây trả thưởng=====> ",smartnodes);
    const res:any = await RPCRuner.smartnodelist();
    const objSmartnode:any = {};
    Object.keys(res).forEach((key)=>{
        const ipAddress =res[key].address.substring(0,res[key].address.lastIndexOf(":"));
        objSmartnode[ipAddress]=res[key];
        objSmartnode[ipAddress].ipAddress = ipAddress;
    });

    const resChain = await RPCRuner.getblockchaininfo();
    for  await (const smartnode of smartnodes) {
        let lastHeightReward = 0;
        try {
            const as = await RPCRuner.getaddressdeltas(objSmartnode[smartnode.ipAddress].payee,((smartnode.lastHeightReward||0)+1),resChain.blocks);
            const arrTxAfterLastHeightReWard: {
                "address": string,
                txid: string,
                outputIndex: number,
                script: string,
                satoshis: number,
                height: number,
                isNomal?:boolean,
                time?:number
            }[] = as.filter(item => item.satoshis > 0);
            let totalMatureInNextReward = 0;
            let totalImMatureInNextReward = 0;
            let index = 0;
            for await (const txos of arrTxAfterLastHeightReWard) {
                try {
                    // lastHeightReward = txos.height;
                    const infoTran = await RPCRuner.getrawtransaction(txos.txid);
                    txos.time = (infoTran.time||0)*1000;
                    if (infoTran && infoTran.confirmations > 101) {
                        txos.isNomal = true;
                        lastHeightReward = txos.height;
                        totalMatureInNextReward += txos.satoshis / 100000000;
                    } else {
                        totalImMatureInNextReward += txos.satoshis / 100000000;
                    }
                } catch (e) {
                    console.log("e2", e);
                }
                index++;
            }
            smartnode.utxosNextReward = arrTxAfterLastHeightReWard;
            smartnode.totalImMatureInNextReward = totalImMatureInNextReward;
            smartnode.totalMatureInNextReward = totalMatureInNextReward;
        }catch (e){
            console.log("haha",e);
            sendMail((global.settingSystem.mailReward.cc.length ? (global.settingSystem.mailReward.cc.join()) : ""), "Schedule ReWard smartnode ---Error", "Schedule ReWard smartnode:" + smartnode.label + "  raptornodes.com. Error" + e.toString()).then(() => {
                console.log("");
            });
        }
        const reward = new ReWard();
        console.log("vào đây trả thưởng ",smartnode.label);
        reward.isSchedule = false;
        reward.smartNode = smartnode._id;
        reward.lastHeightReward = lastHeightReward;
        reward.paymentsPerDay = global.settingSystem.paymentsPerDay;
        reward.feeReward = global.settingSystem.feeReward;
        reward.days =  global.settingSystem&&global.settingSystem.scheduleValue?global.settingSystem.scheduleValue:1;
        reward.dayEnd = new Date();
        // const lastReward = await ReWard.findOne({smartNode:smartnode._id}).sort({createdAt: -1}).exec();
        // console.log("lastReward",lastReward);
        // reward.dayEnd = new Date();
        // reward.days = (global.settingSystem .scheduleDay||1);
        // fix custom day
        // if (lastReward) {
        //     reward.days = parseInt("" + ((reward.dayEnd.getTime() - lastReward.dayEnd.getTime() + 600000 ) / (1000 * 60 * 60 * 24)));
        // } else {
        //     if (smartnode.timeStartReward){
        //         reward.days = parseInt("" + (( reward.dayEnd.getTime() - (smartnode.timeStartReward||smartnode.updatedAt).getTime() + 600000) / (1000 * 60 * 60 * 24)));
        //     }else{
        //         reward.days = (global.settingSystem.scheduleDay !== "Everyday" && global.settingSystem.scheduleDay2 && global.settingSystem.scheduleDay2 !== "NoUse") ? 4 : global.settingSystem.scheduleValue;
        //     }
        // }
        const comment = "ReWard SmartNode:"+smartnode.label;
        reward.description = comment;

        if(smartnode.totalMatureInNextReward<=0){
            isWaitToDone = false;
            clearTimeout(timeOutCheck);
            arsNot += "\nSmartNode "+(smartnode?smartnode.label:"")+" Not enough days to pay the reward. Time Start: "+("Time Start: "+smartnode.timeStartReward)+", Time ReWard: "+reward.dayEnd;
            }else{
            await reward.save();
            timeOutCheck = setTimeout(()=>{
                isWaitToDone = false;
            },280000);

           const isDone = await funReward(reward,smartnode,lastHeightReward);
           if(isDone){
               smartnode.lastHeightReward = lastHeightReward;
           }
            await smartnode.save();

            await new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(true);
                },40);
            });
        }
    }
    sendMail( process.env.ADMINS, "SmartNode Not enough days to pay the reward",arsNot).then(()=>{
        console.log("");
    });

};
const scheduleReward =()=>{
    if(rewardTask){
        rewardTask.stop();
    }
    const weekdays = global.settingSystem.scheduleDay==="Everyday"?"*":global.settingSystem.scheduleDay;
    const mi = global.settingSystem.scheduleTime.split(":")[1];
    const hour = global.settingSystem.scheduleTime.split(":")[0];
    console.log("scheduleReward ",`${mi} ${hour} * * ${weekdays}`,global.settingSystem.scheduleDay,global.settingSystem.scheduleTime,global.settingSystem.scheduleValue);
        try {
            if(hour|| mi){
            rewardTask = schedule(`${mi} ${hour} * * ${weekdays}`, payNow);
            if(global.settingSystem.scheduleDay!=="Everyday" && global.settingSystem.scheduleDay2 && global.settingSystem.scheduleDay2!=="" && global.settingSystem.scheduleDay2!=="NoUse") {
                if(rewardTask2){
                    rewardTask2.stop();
                }
                rewardTask2 = schedule(`${mi} ${hour} * * ${weekdays}`, payNow);
            }
            }
        }catch (e){
            console.log(e);
        }

};
let keyCheck = "";
const funWithdrawWeekly = async  ()=>{
    const query :any&{status:string,confirm?:boolean}= {status:"Pending"};
    if(global.settingSystem.withdrawWeeklyConfirm){
        query.confirm = true;
    }
    const withdrawWeeklys = await WithdrawWeekly.find(query);
    for  await (const withdrawWeekly of withdrawWeeklys) {

    }
};
if(!process.env.NODE_APP_INSTANCE||process.env.NODE_APP_INSTANCE === "0"){
  setTimeout(()=>{
      keyCheck = global.settingSystem.scheduleDay+global.settingSystem.scheduleTime+global.settingSystem.scheduleValue+"fff"+global.settingSystem.scheduleDay2;
          scheduleReward();
  },8000);
}
const loadSystem = async()=>{
    const testNet = global.settingSystem?global.settingSystem.testNet:false;
    const paymentsPerDayOld = global.settingSystem.paymentsPerDay;

    const settingSystem:SystemDocument = await System.findOne();
    if(settingSystem) {
        global.settingSystem = settingSystem;
    }
    else{
        global.settingSystem = defaultSetting;
    }
    global.settingSystem.testNet = testNet;
    const key2 = global.settingSystem.scheduleDay+global.settingSystem.scheduleTime+global.settingSystem.scheduleValue+"fff"+global.settingSystem.scheduleDay2;

    if(keyCheck!==key2){
        console.log("Có thay đổi cần xử lý lại");
        keyCheck = key2;
        try{
            if(!process.env.NODE_APP_INSTANCE||process.env.NODE_APP_INSTANCE === "0"){
                    scheduleReward();
            }
        }catch (e){
            console.log(e);
        }

    }
    global.settingSystem.rewardAccount ="Reward";
    if(!global.settingSystem.rewardAddress ||global.settingSystem.rewardAddress==""){
        try{
        const addressReward = await RPCRuner.getAccountAddress("Reward").catch((e) => {
            console.log("không thể kết nối raptoreum", e.toString());
            return false;
        });
        if(addressReward){
            global.settingSystem.rewardAddress = addressReward;
            global.settingSystem.rewardAccount ="Reward";
            if(settingSystem){
                settingSystem.rewardAddress = addressReward;
                await settingSystem.save();
            }
        }
        }catch (e){

        }
    }
    try{
        const smartnodeCount:{total:number,enabled:number} = await RPCRuner.smartnodeCount();
        if(smartnodeCount && smartnodeCount.total){
            if(settingSystem){
                settingSystem.paymentsPerDay = 720000/smartnodeCount.enabled;
            }
            global.settingSystem.paymentsPerDay = 720000/smartnodeCount.enabled;
        }else if(paymentsPerDayOld){
            if(settingSystem){
                settingSystem.paymentsPerDay = paymentsPerDayOld;
            }
            global.settingSystem.paymentsPerDay = paymentsPerDayOld;
        }
    }catch (e){

    }
};
setInterval(()=>{
    console.log("setInterval");
    loadSystem();
},20000);
const ServiceResolvers = {
    Query: {
        rewards: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
               const ars = await ReWard.find({}).sort({createdAt:-1}).limit(args.limit||60).skip(args.offset||0);
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
                // const lastReward = await ReWard.findOne().sort({createdAt: -1}).exec();
                // console.log("ddlastReward",lastReward);
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        inforRewardSmartNodes: async (__: any, args: any,ctx:any) => {
            checkIsAdmin(ctx.user);
            const smartNodes = await SmartNode.find(args).populate("participants.userId");
            const res:any = await RPCRuner.smartnodelist();
            const objSmartnode:any = {};
            Object.keys(res).forEach((key)=>{
                const ipAddress =res[key].address.substring(0,res[key].address.lastIndexOf(":"));
                objSmartnode[ipAddress]=res[key];
                objSmartnode[ipAddress].ipAddress = ipAddress;
            });
            const resB = await RPCRuner.listaccounts().catch(()=>{
                return {};
            });
            return smartNodes.map((item:any)=>{
                if(objSmartnode[item.ipAddress]){
                    objSmartnode[item.ipAddress].label = item.label;
                    objSmartnode[item.ipAddress]._id = item._id;
                    objSmartnode[item.ipAddress].createdAt = item.createdAt;
                    objSmartnode[item.ipAddress].updatedAt = item.updatedAt;
                    objSmartnode[item.ipAddress].timeStartReward = item.timeStartReward;
                    objSmartnode[item.ipAddress].collateral = item.collateral;
                    objSmartnode[item.ipAddress].lastReward = item.lastReward;
                    objSmartnode[item.ipAddress].balance = resB[item.privateAccount]||0;
                    objSmartnode[item.ipAddress].privateAccount = item.privateAccount;
                    objSmartnode[item.ipAddress].privateAddress = item.privateAddress;
                    objSmartnode[item.ipAddress].statusCollateral = item.statusCollateral;
                    objSmartnode[item.ipAddress].participants = item.participants;

                    return {...objSmartnode[item.ipAddress],...item};
                }
                item.balance = resB[item.privateAccount]||0;

            });
        }
    },
    Mutation: {
        createReward: async (__: any, wr: IReWard &{tfa:string},ctx:any) => {
                checkIsAdmin(ctx.user);
                if(global.settingSystem.isMaintenance){
                    throw new ApolloError("System is Maintenance");
                }
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
                if(isWaitToDone){
                    throw new ApolloError("The system is paying the reward");
                }else{
                    await payNow();
                }
                try{
                    const history = new History();
                    history.action = "Reward By ADMIN";
                    history.author = ctx.user._id;
                    history.data = {};
                    history.dataOld = {};
                    await history.save();
                }catch{
                }
                return {_id:""};
        },
        tryReward: async (__: any, wr: {_id:string,tfa:string},ctx:any) => {
                checkIsAdmin(ctx.user);
                const reward = await ReWard.findById(wr._id);
                if(!reward){
                    throw new ApolloError("Not found ReWard");
                }
                if(!reward.missingReward ){
                    throw new ApolloError("ReWard not Missing");
                }
                if(global.settingSystem.isMaintenance){
                    throw new ApolloError("System is Maintenance");
                }
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
                const smartNode = await SmartNode.findById(reward.smartNode);
                if(!smartNode){
                    throw new ApolloError("not found SmartNode");
                }
                const res:any = await RPCRuner.smartnodelist();
                const objSmartnode:any = {};
                Object.keys(res).forEach((key)=>{
                    const ipAddress =res[key].address.substring(0,res[key].address.lastIndexOf(":"));
                    objSmartnode[ipAddress]=res[key];
                    objSmartnode[ipAddress].ipAddress = ipAddress;
                });
                let lastHeightReward = 0;

                const resChain = await RPCRuner.getblockchaininfo();
                try {
                    const as = await RPCRuner.getaddressdeltas(objSmartnode[smartNode.ipAddress].payee,((smartNode.lastHeightReward||0)+1),resChain.blocks);
                    const arrTxAfterLastHeightReWard: {
                        "address": string,
                        txid: string,
                        outputIndex: number,
                        script: string,
                        satoshis: number,
                        height: number,
                        isNomal?:boolean,
                        time?:number
                    }[] = as.filter(item => item.satoshis > 0);
                    let totalMatureInNextReward = 0;
                    let totalImMatureInNextReward = 0;
                    let index = 0;
                    for await (const txos of arrTxAfterLastHeightReWard) {
                        try {
                            // lastHeightReward = txos.height;
                            const infoTran = await RPCRuner.getrawtransaction(txos.txid);
                            txos.time = (infoTran.time||0)*1000;
                            if (infoTran && infoTran.confirmations > 101) {
                                txos.isNomal = true;
                                lastHeightReward = txos.height;
                                totalMatureInNextReward += txos.satoshis / 100000000;
                            } else {
                                totalImMatureInNextReward += txos.satoshis / 100000000;
                            }
                        } catch (e) {
                            console.log("e2", e);
                        }
                        index++;
                    }
                    smartNode.utxosNextReward = arrTxAfterLastHeightReWard;
                    smartNode.totalImMatureInNextReward = totalImMatureInNextReward;
                    smartNode.totalMatureInNextReward = totalMatureInNextReward;
                }catch (e){
                    console.log("haha",e);
                }
console.log("vào đây xhuwr lý",smartNode);
                // await funReward(reward,smartNode,lastHeightReward);
            const isDone = await funReward(reward,smartNode,lastHeightReward);
            if(isDone){
                smartNode.lastHeightReward = lastHeightReward;
            }
            await smartNode.save();

                try{
                    const history = new History();
                    history.action = "tryReward";
                    history.author = ctx.user._id;
                    history.data = {};
                    history.dataOld = {};
                    await history.save();
                }catch{
                }
                return reward;
        },
    tryRewardHistory: async (__: any, wr: {_id:string,tfa:string,ids:[string]},ctx:any) => {
            checkIsAdmin(ctx.user);
            const reward = await ReWard.findById(wr._id);
            if (!reward) {
                throw new ApolloError("Not found ReWard");
            }

            if (global.settingSystem.isMaintenance) {
                throw new ApolloError("System is Maintenance");
            }
            if (ctx.user.enableTfa) {
                if (!wr.tfa || wr.tfa === "") {
                    throw new ApolloError("undefined code 2fa");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: wr.tfa
                });
                if (!isVerified) {
                    throw new ApolloError("2fa is not correct");
                }
            }
            const smartNode = await SmartNode.findById(reward.smartNode);
            if (!smartNode) {
                throw new ApolloError("not found SmartNode");
            }
            if(isWaitToDoneReTry){
                    throw new ApolloError("The system is paying ReTry");
            }
            timeOutCheckReTry = setTimeout(()=>{
                isWaitToDoneReTry = false;
            },280000);
            isWaitToDoneReTry = true;
           const rewardhistorys = await ReWardHistory.find({reward:wr._id}).populate("user");
            console.log(rewardhistorys,"rewardhistorys");
            for await (const rewardhistory of rewardhistorys){
                    if( (!rewardhistory.txid ||rewardhistory.txid==="")){
                        try{
                            await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,40);
                        }catch (e){
                            console.log(e);
                        }
                        const rawData = await RPCRuner.sendFrom({
                            address:rewardhistory.user.isVirtual && rewardhistory.user.customAddressRTM && rewardhistory.user.customAddressRTM!=="" ?rewardhistory.user.customAddressRTM: rewardhistory.user.addressRTM,
                            account: global.settingSystem.rewardAccount,
                            comment: "reTry Reward #"+smartNode.label,
                            amount: parseFloat((rewardhistory.amount).toFixed(8)),
                            comment_to: ""
                        }).catch(e => {
                            console.log(e);
                            sendMail((global.settingSystem.mailReward.cc.length ? (global.settingSystem.mailReward.cc.join()) : ""), "ReTry ReWard User ---Error", "Schedule ReWard User:" + rewardhistory.user.email + "  raptornodes.com. Error" + e.toString()).then(() => {
                                console.log("");
                            });
                        });
                        if(rawData && rawData!==""){
                        rewardhistory.reTry = true;
                        rewardhistory.description = "reTry Reward #"+smartNode.label,
                        rewardhistory.txid = rawData;
                        }
                       await rewardhistory.save();
                    }
                }
            isWaitToDoneReTry = false;
            clearTimeout(timeOutCheckReTry);
            try{
                const history = new History();
                history.action = "tryRewardHistory";
                history.author = ctx.user._id;
                history.data = reward;
                history.dataOld = {};
                await history.save();
            }catch{
            }
            return true;
    },
    tryReverseRewardHistory: async (__: any, wr: {_id:string,tfa:string},ctx:any) => {
            checkIsAdmin(ctx.user);
            const reward = await ReWard.findById(wr._id);
            if (!reward) {
                throw new ApolloError("Not found ReWard");
            }
            if (reward.reverse) {
                throw new ApolloError("ReWard is reversed");
            }
            if (global.settingSystem.isMaintenance) {
                throw new ApolloError("System is Maintenance");
            }
            if (ctx.user.enableTfa) {
                if (!wr.tfa || wr.tfa === "") {
                    throw new ApolloError("undefined code 2fa");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: wr.tfa
                });
                if (!isVerified) {
                    throw new ApolloError("2fa is not correct");
                }
            }
            const smartNode = await SmartNode.findById(reward.smartNode);
            if (!smartNode) {
                throw new ApolloError("not found SmartNode");
            }
            if(isWaitToDoneReTry){
                throw new ApolloError("The system is paying ReTry");
            }
            timeOutCheckReTry = setTimeout(()=>{
                isWaitToDoneReTry = false;
            },280000);
            isWaitToDoneReTry = true;
            const rewardhistorys = await ReWardHistory.find({reward:wr._id}).populate("user");
            console.log(rewardhistorys,"rewardhistorys");
            for await (const rewardhistory of rewardhistorys){
                if(rewardhistory.txid &&!rewardhistory.reverse && !rewardhistory.user.isVirtual){
                    try{
                        await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,40);
                    }catch (e){
                        console.log(e);
                    }
                    const rawData = await RPCRuner.sendFrom({
                        address:settingSystem.rewardAddress,
                        account: rewardhistory.user.accountRTM,
                        comment: "Reverse Reward #"+smartNode.label,
                        amount: parseFloat((rewardhistory.amount).toFixed(8)),
                        comment_to: ""
                    }).catch(e => {
                        console.log(e);
                        sendMail((global.settingSystem.mailReward.cc.length ? (global.settingSystem.mailReward.cc.join()) : ""), "ReTry ReWard User ---Error", "Schedule ReWard User:" + rewardhistory.user.email + "  raptornodes.com. Error" + e.toString()).then(() => {
                            console.log("");
                        });
                    });
                    if(rawData && rawData!=="") {
                        rewardhistory.reverse = rawData;
                        rewardhistory.description = "Reverse Reward #"+smartNode.label;
                        await rewardhistory.save();
                    }
                }
            }
            reward.reverse = true;
            await reward.save();
            isWaitToDoneReTry = false;
            clearTimeout(timeOutCheckReTry);
            try{
                const history = new History();
                history.action = "tryReverseRewardHistory";
                history.author = ctx.user._id;
                history.data = reward;
                history.dataOld = {};
                await history.save();
            }catch{
            }
            return true;
    }
    },
    // tryRewardHistory(_id:String,tfa:String):Boolean
    // tryReverseRewardHistory(_id:String,tfa:String):Boolean
};

export default ServiceResolvers;
