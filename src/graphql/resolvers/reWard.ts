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
import moment from "moment";
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
let rewardTask :ScheduledTask= schedule("59 23 * * *",async () => {
    console.log("schedule-- rewardTask ----nulll");
});

const invalid = validate("0 0 * * mon");
console.log("invalid",invalid);
const funReward = async (reward:ReWardDocument) => {
    try {
        const smartnodes = await SmartNode.find({statusCollateral : "Enough" }).populate("participants.userId");
        if(global.settingSystem.mailReward.cc.length){
            sendMail( (global.settingSystem.mailReward.cc.length ? ( global.settingSystem.mailReward.cc.join()) : ""), "Schedule ReWard "+smartnodes.length+" Smartnode","Schedule ReWard "+smartnodes.length+" Smartnode in raptornodes.com").then(()=>{
                console.log("");
            });
        }
        for  await (const smartnode of smartnodes) {
            for await (const participant of smartnode.participants) {
                const comment = "ReWard in Raptornodes.com";
                const amount = global.settingSystem.paymentsPerDay * participant.percentOfNode * ((100 - global.settingSystem.feeReward) / 100);
                console.log(participant.userId.addressRTM);

                const rawData = await RPCRuner.sendFrom({
                    address: participant.userId.addressRTM,
                    account: global.settingSystem.rewardAccount,
                    comment: comment,
                        amount: parseFloat((amount).toFixed(8)),
                    comment_to: ""
                }).catch(e=>{
                    sendMail( (global.settingSystem.mailReward.cc.length ? ( global.settingSystem.mailReward.cc.join()) : ""), "Schedule ReWard User ---Error","Schedule ReWard User:"+participant.userId.email+"  raptornodes.com. Error"+ e.toString()).then(()=>{
                        console.log("");
                    });
                });
                console.log("rawData", rawData);
                const history = new ReWardHistory();
                history.description = comment;
                history.user = participant.userId;
                history.collateral = participant.collateral;
                history.percentOfNode = participant.percentOfNode;
                history.feeReward = global.settingSystem.feeReward;
                history.smartNode = smartnode._id;
                history.amount = parseFloat((amount).toFixed(8));
                history.reward = reward._id;
                history.days = reward.days;
                history.dayEnd = reward.dayEnd||new Date();
                history.txid = rawData;
                history.paymentsPerDay = global.settingSystem.paymentsPerDay;
                history.save();
                try {
                    if (global.settingSystem && global.settingSystem.mailReward && global.settingSystem.mailReward.enable) {
                        sendMail(participant.userId.email + (global.settingSystem.mailReward.cc.length ? ("," + global.settingSystem.mailReward.cc.join()) : ""), _.template(global.settingSystem.mailReward.label)({
                            name: participant.userId.profile.name,
                            email: participant.userId.email,
                            avatar: participant.userId.profile.picture,
                            data: ""
                        }), _.template(global.settingSystem.mailReward.template)({
                            name: participant.userId.profile.name,
                            email: participant.userId.email,
                            avatar: participant.userId.profile.picture,
                            data: ""
                        })).then(data => {
                            console.log("đàads");
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            smartnode.lastReward = new Date();
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

    rewardTask = schedule(`${mi} ${hour} * * ${weekdays}`,async ()=>{
        const reward = new ReWard();
        console.log("vào đây trả thưởng");
        reward.isSchedule = false;
        reward.paymentsPerDay = global.settingSystem.paymentsPerDay;
        reward.feeReward = global.settingSystem.feeReward;
        reward.days = global.settingSystem.scheduleValue;
        reward.dayEnd = new Date();
        const comment = "ReWard in Raptornodes.com";

        reward.description = comment;
       await reward.save();
       funReward(reward).then();
    });

};
let keyCheck = "";

if(!process.env.NODE_APP_INSTANCE||process.env.NODE_APP_INSTANCE === "0"){
  setTimeout(()=>{
      keyCheck = global.settingSystem.scheduleDay+global.settingSystem.scheduleTime+global.settingSystem.scheduleValue+"fff";
          scheduleReward();
  },8000);
}
const loadSystem = async()=>{
    const testNet = global.settingSystem.testNet;

    const settingSystem:SystemDocument = await System.findOne();
    global.settingSystem = settingSystem;
    global.settingSystem.testNet = testNet;
    const key2 = global.settingSystem.scheduleDay+global.settingSystem.scheduleTime+global.settingSystem.scheduleValue+"fff";

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
        const addressReward = await RPCRuner.getAccountAddress("Reward").catch((e) => {
            console.log("không thể kết nối raptoreum", e.toString());
            return false;
        });
        if(addressReward){
            global.settingSystem.rewardAddress = addressReward;
            settingSystem.rewardAddress = addressReward;
            global.settingSystem.rewardAccount ="Reward";
            await settingSystem.save();
        }
    }

};
setInterval(()=>{
    console.log("setInterval");
    loadSystem();
},15000);
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
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        createReward: async (__: any, wr: IReWard &{tfa:string},ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const reward = new ReWard();
                reward.isSchedule = false;
                reward.paymentsPerDay = global.settingSystem.paymentsPerDay;
                reward.feeReward = global.settingSystem.feeReward;
                reward.days = wr.days;
                reward.dayEnd = wr.dayEnd ||new Date();
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
                await funReward(reward);
                return reward;

            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
