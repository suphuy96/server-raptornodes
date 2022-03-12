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
const funReward = async (reward:ReWardDocument,sNode?:SmartNodeDocument) => {
    try {

        const reWardBalance = await RPCRuner.getbalance(global.settingSystem.rewardAccount,11);
        const realReWardBalance = reWardBalance;
        let totalReward = 0;
        if(sNode)
            for await (const participant of sNode.participants) {
                const comment = "ReWard in Raptornodes.com";
                const amount = reward.days*(global.settingSystem.paymentsPerDay * participant.percentOfNode * ((100 - global.settingSystem.feeReward) / 100));
                const feeHost = reward.days*(global.settingSystem.paymentsPerDay * participant.percentOfNode * (( global.settingSystem.feeReward) / 100));
                totalReward+=amount;

            }

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

            sendMail( process.env.ADMINS, "Error!! Not enough balance to pay the reward, "+(sNode?sNode.label:"")+" Smartnode","Schedule ReWard  Smartnode "+(sNode?sNode.label:"")+"in raptornodes.com, totalReward:" +totalReward.toFixed(8)+"RTM, reWardBalance:"+reWardBalance+"RTM").then(()=>{
                console.log("");
            });
        }else
        {
            const funReW = async(userId:UserDocument,collateral:number,percentOfNode:number,smartnode?:SmartNodeDocument)=>{
                const comment = "ReWard in Raptornodes.com";
                const amount = reward.days * (global.settingSystem.paymentsPerDay * percentOfNode * ((100 - global.settingSystem.feeReward) / 100));
                const feeHost = reward.days * (global.settingSystem.paymentsPerDay * percentOfNode * ((global.settingSystem.feeReward) / 100));
                try{
                    await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
                }catch (e){
                    console.log(e);
                }
                const rawData = await RPCRuner.sendFrom({
                    address: userId.addressRTM,
                    account: global.settingSystem.rewardAccount,
                    comment: comment,
                    amount: parseFloat((amount).toFixed(8)),
                    comment_to: ""
                }).catch(e => {
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
                        sendMail(userId.email + (global.settingSystem.mailReward.cc.length ? ("," + global.settingSystem.mailReward.cc.join()) : ""), _.template(global.settingSystem.mailReward.label)({
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

                const dataUFE:DataUltraFastEarningDocument = await getDataUFE();
            //    payment in UltraFastEarning
            if(dataUFE && dataUFE.amount&&dataUFE.participants.length){
                for await (const participant of dataUFE.participants){
                    if(participant){
                     const txidLastReward =  await funReW(participant.author,participant.amount,(participant.amount/global.settingSystem.collateral));
                        participant.lastReward = new Date();
                        participant.txidLastReward = txidLastReward;
                        await dataUFE.save();
                    }
                }
                 dataUFE.lastReward = new Date();
                await dataUFE.save();
            }
            //    payment in smartnode
            // for await (const smartnode of smartnodes) {
            if(sNode){
                for await (const participant of sNode.participants) {
                  await  funReW(participant.userId,participant.collateral,participant.percentOfNode,sNode);
                }
            sNode.lastReward = new Date();
            sNode.save();
            }
            // }
            try{
                const settingSystem:SystemDocument = await System.findOne();
                settingSystem.missingReward = false;
                settingSystem.save();
            }catch (e){

            }
        }
        // reward.save();

        // return reward;
    }catch (e){
        throw new ApolloError("Error"+e.toString());
        console.log("fixx",e);
    }
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
            rewardTask = schedule(`${mi} ${hour} * * ${weekdays}`, async () => {

                const smartnodes = await SmartNode.find({statusCollateral : "Start Reward" }).populate("participants.userId");
                console.log("vào đây trả thưởng=====> ");
                for  await (const smartnode of smartnodes) {
                    const reward = new ReWard();
                    console.log("vào đây trả thưởng ",smartnode.label);

                    reward.isSchedule = false;
                    reward.smartNode = smartnode._id;
                        reward.paymentsPerDay = global.settingSystem.paymentsPerDay;
                    reward.feeReward = global.settingSystem.feeReward;
                    const lastReward = await ReWard.findOne({smartNode:smartnode._id}).sort({createdAt: -1}).exec();
                    console.log("lastReward",lastReward);
                    reward.dayEnd = new Date();
                    // fix custom day
                    if (lastReward) {
                        reward.days = parseInt("" + ((reward.dayEnd.getTime() - lastReward.dayEnd.getTime() + 600000 ) / (1000 * 60 * 60 * 24)));
                    } else {
                        if (smartnode.timeStartReward){
                            console.log(( reward.dayEnd.getTime() - smartnode.timeStartReward.getTime() + 600000),"-----");
                            reward.days = parseInt("" + (( reward.dayEnd.getTime() - smartnode.timeStartReward.getTime() + 600000) / (1000 * 60 * 60 * 24)));
                        }else{
                            reward.days = (global.settingSystem.scheduleDay !== "Everyday" && global.settingSystem.scheduleDay2 && global.settingSystem.scheduleDay2 !== "NoUse") ? 4 : global.settingSystem.scheduleValue;
                        }
                    }
                    const comment = "ReWard in Raptornodes.com";
                    reward.description = comment;

                    if(reward.days<=0){
                    sendMail( process.env.ADMINS, "SmartNode "+(smartnode?smartnode.label:"")+"Not enough days to pay the reward","SmartNode "+(smartnode?smartnode.label:"")+" Not enough days to pay the reward. Time Start: "+(lastReward?("last Reward"+lastReward.dayEnd):("Time Start: "+smartnode.timeStartReward))+", Time ReWard: "+reward.dayEnd).then(()=>{
                        console.log("");
                    }); }else{
                    await reward.save();
                        await funReward(reward,smartnode);
                        await new Promise((resolve)=>{
                            setTimeout(()=>{
                                resolve(true);
                            },5000);
                        });
                      }
                }
            });
            if(global.settingSystem.scheduleDay!=="Everyday" && global.settingSystem.scheduleDay2 && global.settingSystem.scheduleDay2!=="" && global.settingSystem.scheduleDay2!=="NoUse") {
                if(rewardTask2){
                    rewardTask2.stop();
                }
                rewardTask2 = schedule(`${mi} ${hour} * * ${weekdays}`, async () => {
                    const smartnodes = await SmartNode.find({statusCollateral : "Start Reward" }).populate("participants.userId");
                    for  await (const smartnode of smartnodes) {
                        const reward = new ReWard();
                        console.log("vào đây trả thưởng 2 ",smartnode.label);
                        reward.isSchedule = false;
                        reward.paymentsPerDay = global.settingSystem.paymentsPerDay;
                        reward.feeReward = global.settingSystem.feeReward;
                        const lastReward = await ReWard.findOne({smartNode:smartnode._id}).sort({createdAt: -1}).exec();
                        reward.dayEnd = new Date();
                        // fix custom day
                        if (lastReward) {
                            reward.days = parseInt("" + (( reward.dayEnd.getTime() -lastReward.dayEnd.getTime() + 600000 ) / (1000 * 60 * 60 * 24)));
                        } else {
                            if (smartnode.timeStartReward){
                                reward.days = parseInt("" + ( reward.dayEnd.getTime() -(smartnode.timeStartReward.getTime() + 600000) / (1000 * 60 * 60 * 24)));
                            }else
                            reward.days = 3;
                        }
                        const comment = "ReWard in Raptornodes.com";
                        reward.description = comment;
                        if(reward.days<=0){
                            sendMail( process.env.ADMINS, "SmartNode "+(smartnode?smartnode.label:"")+" Not enough days to pay the reward ","SmartNode "+(smartnode?smartnode.label:"")+" Not enough days to pay the reward. "+(lastReward?("last Reward"+lastReward.dayEnd):("Time Start: "+smartnode.timeStartReward))+", Time ReWard: "+reward.dayEnd).then(()=>{
                                console.log("");
                            }); }else{
                        await reward.save();
                        await funReward(reward, smartnode);
                        await new Promise((resolve)=>{
                            setTimeout(()=>{
                                resolve(true);
                            },5000);
                        });
                        }
                    }
                });
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
               const ars = await ReWard.find({});
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
        }
    },
    Mutation: {
        createReward: async (__: any, wr: IReWard &{tfa:string,startNode:string},ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const reward = new ReWard();
                reward.isSchedule = false;
                reward.paymentsPerDay = global.settingSystem.paymentsPerDay;
                reward.feeReward = global.settingSystem.feeReward;
                reward.days = wr.days;
                const smartNode = await SmartNode.findById(wr.startNode);
                if(!smartNode){
                    throw new ApolloError("not found SmartNode");
                }
                reward.smartNode = smartNode._id;
                const lastReward = await ReWard.findOne({smartNode:smartNode._id}).sort({createdAt: -1}).exec();
                reward.dayEnd = wr.dayEnd ||new Date();
                if(lastReward){
                    reward.days = parseInt(""+((lastReward.dayEnd.getTime()-reward.dayEnd.getTime()+600000)/(1000*60*60*24)));
                } else{
                    reward.days = parseInt("" + (( reward.dayEnd.getTime() - smartNode.timeStartReward.getTime() + 600000) / (1000 * 60 * 60 * 24)));
                }
                const comment = "ReWard in Raptornodes.com";
                reward.description = wr.description||comment;
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
                reward.save();
                await funReward(reward,smartNode);
                try{
                    const history = new History();
                    history.action = "createReward";
                    history.author = ctx.user._id;
                    history.data = reward;
                    history.dataOld = {};
                    await history.save();
                }catch{
                }
                return reward;

            } catch (error) {
                throw new ApolloError(error);
            }
        },
        tryReward: async (__: any, wr: {_id:string,tfa:string},ctx:any) => {
            try {
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
                await funReward(reward,smartNode);
                return reward;

            } catch (error) {
                throw new ApolloError(error);
            }
        }

    }
};

export default ServiceResolvers;
