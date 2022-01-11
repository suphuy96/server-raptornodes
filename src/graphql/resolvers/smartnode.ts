import { ApolloError } from "apollo-server-express";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import {checkIsAdmin, checkIsAuthen} from "../../util/checkAuthen";
import {ISmartNode, SmartNode,Iparticipant} from "../../models/SmartNode";
import _ from "lodash";
import {Withdraw} from "../../models/Withdraw";

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
        smartNodeEnough: async (__: any, args: any,ctx:any) => {
            try {
                // checkIsAuthen(ctx.user);
                const smartNode = await SmartNode.findOne({statusCollateral : "Not Enough"}).populate("participants.userId");

                return smartNode;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        smartNodes: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const smartNodes = await SmartNode.find().populate("participants.userId");

                const res:any = await RPCRuner.smartnodelist();
                const objSmartnode:any = {};
                 Object.keys(res).forEach((key)=>{
                     const ipAddress =res[key].address.replace(":10227","").replace(":10226","");
                     objSmartnode[ipAddress]=res[key];
                     objSmartnode[ipAddress].ipAddress = ipAddress;
                 });
                const resB = await RPCRuner.listaddressbalances().catch(()=>{
                    return {};
                });
              return smartNodes.map((item:any)=>{
                    if(objSmartnode[item.ipAddress]){
                        objSmartnode[item.ipAddress].label = item.label;
                        objSmartnode[item.ipAddress]._id = item._id;
                        objSmartnode[item.ipAddress].createdAt = item.createdAt;
                        objSmartnode[item.ipAddress].updatedAt = item.updatedAt;
                        objSmartnode[item.ipAddress].collateral = item.collateral;
                        objSmartnode[item.ipAddress].balance = resB[item.privateAddress]||0;
                        objSmartnode[item.ipAddress].privateAccount = item.privateAccount;
                        objSmartnode[item.ipAddress].privateAddress = item.privateAddress;
                        objSmartnode[item.ipAddress].statusCollateral = item.statusCollateral;
                        objSmartnode[item.ipAddress].participants = item.participants;

                        return {...objSmartnode[item.ipAddress],...item};
                    }
                     return item;
                });
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        myNodes: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const smartNodes = await SmartNode.find().populate("participants.userId");
                const res:any = await RPCRuner.smartnodelist();
                const objSmartnode:any = {};
                Object.keys(res).forEach((key)=>{
                    const ipAddress =res[key].address.replace(":10227","").replace(":10226","");
                    objSmartnode[ipAddress]=res[key];
                    objSmartnode[ipAddress].ipAddress = ipAddress;
                });
                console.log("smartNodes",smartNodes);
                return smartNodes.filter(item=> item.participants.filter(ii=>ii.userId && typeof ii.userId==="object"&&ctx.user._id.equals(ii.userId._id)).length!==0).map((item:any)=>{
                    if(objSmartnode[item.ipAddress]){
                        objSmartnode[item.ipAddress].label = item.label;
                        objSmartnode[item.ipAddress]._id = item._id;
                        objSmartnode[item.ipAddress].createdAt = item.createdAt;
                        objSmartnode[item.ipAddress].updatedAt = item.updatedAt;
                        objSmartnode[item.ipAddress].collateral = item.collateral;
                        objSmartnode[item.ipAddress].privateAddress = item.privateAddress;
                        objSmartnode[item.ipAddress].privateAccount = item.privateAccount;
                        objSmartnode[item.ipAddress].statusCollateral = item.statusCollateral;
                        objSmartnode[item.ipAddress].participants = item.participants;
                        return {...objSmartnode[item.ipAddress],...item};
                    }
                    return item;
                });
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        getSmartNodes: async (__: any, args: any,ctx:any) => {
            try {
                // if(!ctx.user){
                //     throw new ApolloError("No session login");
                // }
                // console.log(await RPCRuner.smartnodelist())
                const smartNodes = await SmartNode.find();

                const res:any = await RPCRuner.smartnodelist();
                const objSmartnode:any = {};
                Object.keys(res).forEach((key)=>{
                    const ipAddress =res[key].address.replace(":10227","").replace(":10226","");
                    objSmartnode[ipAddress]=res[key];
                    objSmartnode[ipAddress].ipAddress = ipAddress;
                });
                return smartNodes.map((item:any)=>{
                    if(objSmartnode[item.ipAddress]){
                        objSmartnode[item.ipAddress].label = item.label;
                        objSmartnode[item.ipAddress]._id = item._id;
                        objSmartnode[item.ipAddress].createdAt = item.createdAt;
                        objSmartnode[item.ipAddress].updatedAt = item.updatedAt;
                        objSmartnode[item.ipAddress].collateral = item.collateral;
                        objSmartnode[item.ipAddress].privateAddress = item.privateAddress;
                        objSmartnode[item.ipAddress].statusCollateral = item.statusCollateral;
                        objSmartnode[item.ipAddress].participants = item.participants;
                        return {...objSmartnode[item.ipAddress],...item};
                    }
                    return item;
                });
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        smartnodeCount: async (__: any, args: any,ctx:any) => {
            try {
                console.log(ctx);
                const data= await RPCRuner.smartnodeCount();
                return data;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },  Mutation:{
        createSmartNode:  async(__: any, args: ISmartNode,ctx:any) => {
            checkIsAdmin(ctx.user);
                const smartNode = new SmartNode();
            smartNode.label = args.label;
            smartNode.ipAddress = args.ipAddress||"";
            if(args.participants) {
                smartNode.participants = args.participants;
            }
            else{
                smartNode.participants =[];
            }
            smartNode.private = false;
            if(args.private ||args.private===false){
                smartNode.private = args.private;
            }
            const smartNodes = await SmartNode.find({label:smartNode.label});
                if(smartNodes && smartNodes.length){
                    throw new ApolloError("Label not unique");
                }
            const privateAddress: any = await RPCRuner.getAccountAddress("SmartNode#"+smartNode.label).catch((e) => {
                console.log("không thể kết nối raptoreum", e.toString());
                return false;
            });
            smartNode.privateAddress = privateAddress;
            smartNode.privateAccount = "SmartNode#"+smartNode.label;
            smartNode.collateral = global.settingSystem.collateral||1500000;
            if(args.collateral){
                smartNode.collateral = args.collateral;
            }
            smartNode.statusCollateral = "Not Enough";
            if(args.statusCollateral){
                smartNode.statusCollateral = args.statusCollateral;
            }
            smartNode.save();
            return smartNode;
        },
        updateSmartNode: async (__: any, args:ISmartNode&{_id:string},ctx:any) => {
            checkIsAdmin(ctx.user);
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                throw new ApolloError("Not found document");
            }
            if(args.label){
                smartNode.label = args.label;
            }
            if(args.ipAddress){
                smartNode.ipAddress = args.ipAddress;
            }
            if(args.collateral){
                smartNode.collateral = args.collateral;
            }
            if(args.private ||args.private===false){
                smartNode.private = args.private;
            }
            if(!smartNode.privateAccount ||smartNode.privateAccount===""){
                smartNode.privateAccount = "SmartNode#"+smartNode.label;
            }
            if(args.statusCollateral){
                smartNode.statusCollateral = args.statusCollateral;
            }
            await smartNode.save();
            return smartNode;
        },
        withdrawEnoughSmartNode: async (__: any, args:{_id:string,amount:number,address:string,tfa:string},ctx:any) => {
            checkIsAdmin(ctx.user);
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                throw new ApolloError("Not found document");
            }
            if(!args.amount){
                throw new ApolloError("require amount");
            }
            if(!args.address ||args.address ===""){
                throw new ApolloError("require address");
            }
            if(ctx.user.enableTfa){
                if(!args.tfa||args.tfa===""){
                    throw new ApolloError("undefined code 2fa");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: args.tfa
                });
                if(!isVerified){
                    throw new ApolloError("2fa is not correct");
                }
            }
            const comment = "sendTo address Smartnode "+smartNode.label;
            let account =  smartNode.privateAccount;
            if(smartNode.privateAccount&& smartNode.privateAccount!==""){
                account = smartNode.privateAccount;
            }

            const rawData:string = await RPCRuner.sendFrom({address:args.address,account: account,comment,amount:args.amount,comment_to:""});

            await smartNode.save();
            return smartNode;
        },
        deleteSmartNode: async (__: any, args:ISmartNode&{_id:string},ctx:any) => {
            checkIsAdmin(ctx.user);
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                throw new ApolloError("Not found document");
            }
            await smartNode.remove();

            return true;
        },
        joinSmartNode: async (__: any, args: {_id:string,token:string,amount:number},ctx:any) => {
            checkIsAuthen(ctx.user);
            try{
            if(global.settingSystem && global.settingSystem.mailJobSmartNode && global.settingSystem.mailJobSmartNode.enable){
                sendMail(ctx.user.email+( global.settingSystem.mailJobSmartNode.cc.length?(","+global.settingSystem.mailJobSmartNode.cc.join()):""),_.template(global.settingSystem.mailJobSmartNode.label)({name:ctx.user.profile.name,email:ctx.user.email,avatar:ctx.user.profile.picture,data:""}),_.template(global.settingSystem.mailJobSmartNode.template)({name:ctx.user.profile.name,email:ctx.user.email,avatar:ctx.user.profile.picture,data:""})).then(data=>{
                    console.log("đàads");
                });
            }
            }catch (e){

            }
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                 throw new ApolloError("Not Found SmartNode _id"+args._id);
            }

            if( smartNode.statusCollateral ==="Enough"){
                throw new ApolloError("SmartNode:"+smartNode.label+" is Enough");

            }
            try{
                const comment = "#join SmartNode:#"+smartNode.label+"- Raptornodes.com";
            const rawData:string = await RPCRuner.sendFrom({address:smartNode.privateAddress,account:ctx.user.accountRTM,comment,amount:args.amount,comment_to:""});
            if(rawData){
                const withdraw = new Withdraw();
                withdraw.address = smartNode.privateAddress;
                withdraw.amount = args.amount;
                withdraw.description = comment;
                // withdraw.type = comment;
                withdraw.author = ctx.user._id;
                withdraw.txid = rawData;
                withdraw.save();
                const participants = smartNode.participants.find((ii:Iparticipant)=>ii.userId && typeof ii.userId==="object"&&ctx.user._id.equals(ii.userId._id));
                if(participants){
                    participants.collateral+=args.amount;
                    participants.percentOfNode=participants.collateral/smartNode.collateral;
                    participants.txids.push(rawData);
                    participants.time =new Date();
                }else{
                    smartNode.participants.push({userId:ctx.user._id,RTMRewards:0,collateral:args.amount,pendingRTMRewards:0,percentOfNode:args.amount/smartNode.collateral
                        ,txids:[rawData]
                        ,time:new Date()});
                }
                let collateral = 0;
                smartNode.participants.forEach((ii:Iparticipant)=>{
                    collateral+=ii.collateral;
                });
                if(collateral>=smartNode.collateral){
                    smartNode.statusCollateral ==="Enough";
                }
                smartNode.save();
                return smartNode;
            }else{
                throw new ApolloError("Error 1234567");

            }
            }catch (e){
                throw new ApolloError("Error"+e.toString());
            }

                return {};
        },
        widthDrawlSmartNode: async (__: any, args: {_id:string,token:string},ctx:any) => {
            if(!ctx.user){
                throw new ApolloError("No session login");
            }
            if(ctx.user.enableTfa){
                if(!args.token && args.token===""){
                    throw new ApolloError("Not verified TFA");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: args.token
                });
                if (!isVerified) {
                    throw new ApolloError("Not verified TFA");
                }
            }
            try{
                sendMail(ctx.user.email,"raptornodes.com - widthDrawl SmartNode","Hey! "+ctx.user.profile.name+", widthDrawl SmartNode #2 done. ").then((data)=>{
                    console.log(data);
                });
            }catch (e){

            }
            return true;
        }
    }
};

export default ServiceResolvers;
