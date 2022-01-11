import { ApolloError } from "apollo-server-express";
import {System, SystemDocument, ISystem} from "../../models/System";
import {checkIsAdmin,checkIsAuthen} from "../../util/checkAuthen";
import {mongo} from "mongoose";
import speakeasy from "speakeasy";
import defaultSetting from "../../config/settingSystemDefault";
import RpcRaptoreum,{OptionRpcClient} from "../../libs/rpc-raptoreum";
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
        rewardInfo: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                // if(global.settingSystem){
                //     return global.settingSystem;
                // }
              const  address = global.settingSystem.rewardAddress;
                const balance = await RPCRuner.getAddressBalance(address);
                console.log("dfasdfad",global.settingSystem.rewardAddress,balance);
                return {balance:balance?(balance.balance/100000000):0,received:balance?(balance.received/100000000):0,rewardAddress:global.settingSystem.rewardAddress};
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        settingSystem: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const ars = await System.find();
                if(ars.length===0){
                    const deff = defaultSetting;
                    const ss = new System(deff);
                    await ss.save();
                    return ss;
                }
                return ars[0];
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        variableSystem: async (__: any, args: any,ctx:any) => {
            try {
                // checkIsAuthen(ctx.user);
                if(global.settingSystem){
                    return global.settingSystem;
                }
                const ars = await System.find();
                if(ars.length===0){
                    const deff = defaultSetting;
                    // const ss = new System(deff);
                    // await ss.save();

                    return deff;
                }
                return ars[0];
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        sendByAccount: async (__: any, raw:{account:string,address:string,amount:number,tfa:string},ctx:any) => {
            checkIsAdmin(ctx.user);
            if(ctx.user.enableTfa){
                if(!raw.tfa||raw.tfa===""){
                    throw new ApolloError("undefined code 2fa");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: raw.tfa
                });
                if(!isVerified){
                    throw new ApolloError("2fa is not correct");
                }
            }
            const rawData:string = await RPCRuner.sendFrom({address:raw.address,account: raw.account,comment:"RAW",amount:raw.amount,comment_to:""});
            return rawData;

        },
        updateSystem: async (__: any, systemInput: ISystem&{tfa:string},ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                if(ctx.user.enableTfa){
                    if(!systemInput.tfa||systemInput.tfa===""){
                        throw new ApolloError("undefined code 2fa");
                    }
                    const isVerified = speakeasy.totp.verify({
                        secret: ctx.user.tfa.secret,
                        encoding: "base32",
                        token: systemInput.tfa
                    });
                    if(!isVerified){
                        throw new ApolloError("2fa is not correct");
                    }
                }
                let system = await System.findOne();
                if(!system){
                     system = new System();
                }

                if(systemInput.enableWithdraw||systemInput.enableWithdraw===false){
                    system.enableWithdraw = systemInput.enableWithdraw;
                }
                if(systemInput.scheduleTime){
                    system.scheduleTime = systemInput.scheduleTime;
                }
                if(systemInput.scheduleDay){
                    system.scheduleDay = systemInput.scheduleDay;
                }
                if(systemInput.scheduleValue){
                    system.scheduleValue = systemInput.scheduleValue;
                }

                if(systemInput.collateral){
                    system.collateral = systemInput.collateral;
                }
                if(systemInput.collateralMin||systemInput.collateralMin){
                    system.collateralMin = systemInput.collateralMin;
                }
                if(systemInput.feeReward||systemInput.feeReward){
                    system.feeReward = systemInput.feeReward;
                }
                if(systemInput.paymentsPerDay||systemInput.paymentsPerDay){
                    system.paymentsPerDay = systemInput.paymentsPerDay;
                }
                if(systemInput.mailTfa){
                    system.mailTfa = systemInput.mailTfa;
                }
                if(systemInput.mailJobSmartNode){
                    system.mailJobSmartNode = systemInput.mailJobSmartNode;
                }
                if(systemInput.mailReward){
                    system.mailReward = systemInput.mailReward;
                }
                if(systemInput.mailWellcome){
                    system.mailWellcome = systemInput.mailWellcome;
                }
                if(systemInput.mailNewSession){
                    system.mailNewSession = systemInput.mailNewSession;
                }
                if(systemInput.mailWithdraw){
                    system.mailWithdraw = systemInput.mailWithdraw;
                }
                if(systemInput.mailDespost){
                    system.mailDespost = systemInput.mailDespost;
                }
                       await system.save();

                const testNet = global.settingSystem.testNet;
                const rewardAddress = global.settingSystem.rewardAddress;
                // const rewardAddress = global.settingSystem.rewardAddress;
                global.settingSystem = system;
                if(!rewardAddress ||rewardAddress===""){
                try{
                    const addressReward = await RPCRuner.getAccountAddress("Reward").catch((e) => {
                        console.log("không thể kết nối raptoreum", e.toString());
                        return false;
                    });
                    global.settingSystem.testNet = testNet;
                    if(addressReward){
                        global.settingSystem.rewardAddress = addressReward;
                        // settingSystem.rewardAddress = addressReward;
                        // settingSystem.save();
                        global.settingSystem.rewardAccount ="Reward";
                    }
                }catch (e){

                }
                } else{
                    global.settingSystem.rewardAddress = rewardAddress;
                }

                return system;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
