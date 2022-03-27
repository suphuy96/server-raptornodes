import { ApolloError } from "apollo-server-express";
import {OptionRpcClient} from "../../libs/rpc-raptoreum";
import RpcRaptoreum from "../../libs/rpc-raptoreum";
import speakeasy from "speakeasy";
import sendMail from "../../libs/mail";
import {History} from "../../models/History";
import {checkIsAdmin, checkIsAuthen} from "../../util/checkAuthen";
import {ISmartNode, SmartNode, Iparticipant, SmartNodeDocument} from "../../models/SmartNode";
import _ from "lodash";
import {Withdraw} from "../../models/Withdraw";
import {WALLET_PASS_PHRASE} from "../../util/secrets";
import {User} from "../../models/User";
import {mongo} from "mongoose";
import {ReWardHistory} from "../../models/RewardHistory";

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
        statisticalUser: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const user = new mongo.ObjectId(args.user);
                const statisticalNodes = await SmartNode.aggregate([
                    { $project : { "participants" : 1 } },
                    {  $unwind:"$participants"},
                    {
                        $match:{"participants.userId":{ $eq: user} }},

                   {
              $group :{
                    _id : "$_id",
                        count:{ "$sum":1
                    },
                  participant: { "$mergeObjects":"$participants"},
                    collateral:{ "$sum":"$participants.collateral"
                    }},},
                    {$lookup: {
                    from: "smartnodes",
                        localField: "_id",
                        foreignField: "_id",
                        as: "smartnodes"
                }},
                    {  $unwind:"$smartnodes"},
                   ]).exec();

                const dataReward = await ReWardHistory.aggregate([{ $match:{user:user}},{
                    $group :{
                        _id : null,
                        count:{ "$sum":1
                        },
                        amount:{ "$sum":"$amount"
                        }}}]).exec();
                console.log("dataReward",dataReward);
                if(dataReward&&dataReward.length){
                    return {statisticalNodes,rewardCount:dataReward[0].cound,rewardAmount:dataReward[0].amount};
                }
                return {statisticalNodes,rewardCount:0,rewardAmount:0};
            }catch (e){
                console.log(e);
            }
        },
        smartNodes: async (__: any, args: any,ctx:any) => {
            try {
                // checkIsAuthen(ctx.user);
                const smartNodes = await SmartNode.find(args).populate("participants.userId");
                const res:any = await RPCRuner.smartnodelist();
                const objSmartnode:any = {};
                Object.keys(res).forEach((key)=>{
                    const ipAddress =res[key].address.replace(":10227","").replace(":10226","");
                    objSmartnode[ipAddress]=res[key];
                    objSmartnode[ipAddress].ipAddress = ipAddress;
                });
                const resB = await RPCRuner.listaccounts().catch(()=>{
                    return {};
                });
                const smartnodesr:ISmartNode[] = smartNodes.map((item:any)=>{
                    if(objSmartnode[item.ipAddress]){
                        objSmartnode[item.ipAddress].label = item.label;
                        objSmartnode[item.ipAddress]._id = item._id;
                        objSmartnode[item.ipAddress].createdAt = item.createdAt;
                        objSmartnode[item.ipAddress].updatedAt = item.updatedAt;
                        objSmartnode[item.ipAddress].timeStartReward = item.timeStartReward;
                        objSmartnode[item.ipAddress].collateral = item.collateral;
                        objSmartnode[item.ipAddress].lastReward = item.lastReward;
                        objSmartnode[item.ipAddress].lastHeightReward = item.lastHeightReward;
                        objSmartnode[item.ipAddress].balance = resB[item.privateAccount]||0;
                        objSmartnode[item.ipAddress].privateAccount = item.privateAccount;
                        objSmartnode[item.ipAddress].privateAddress = item.privateAddress;
                        objSmartnode[item.ipAddress].statusCollateral = item.statusCollateral;
                        objSmartnode[item.ipAddress].participants = item.participants;

                        return {...objSmartnode[item.ipAddress],...item};
                    }
                    item.balance = resB[item.privateAccount]||0;

                    return item;
                });
                const resChain = await RPCRuner.getblockchaininfo();
                for await (const smartN of smartnodesr){
                    if(smartN.ipAddress && smartN.ipAddress!=="" && smartN.statusCollateral ==="Start Reward" && smartN.payee){
                        try {
                            const as = await RPCRuner.getaddressdeltas(smartN.payee,((smartN.lastHeightReward||0)+1),resChain.blocks);
                            console.log("smartN.lastHeightReward",smartN.lastHeightReward);
                            const arrTxAfterLastHeightReWard: {
                                "address": string,
                                txid: string,
                                outputIndex: number,
                                script: string,
                                satoshis: number,
                                height: number,
                                isNomal?:boolean,
                                time?:number
                            }[] = as.filter((item) => item.satoshis > 0);
                            let totalMatureInNextReward = 0;
                            let totalImMatureInNextReward = 0;
                            let index = 0;
                            for await (const txos of arrTxAfterLastHeightReWard) {
                                try {
                                    const infoTran = await RPCRuner.getrawtransaction(txos.txid);
                                    txos.time = (infoTran.time||0)*1000;
                                    if (infoTran && infoTran.confirmations > 101) {
                                        txos.isNomal = true;
                                        totalMatureInNextReward += txos.satoshis / 100000000;
                                    } else {
                                        totalImMatureInNextReward += txos.satoshis / 100000000;
                                    }
                                } catch (e) {
                                    console.log("e2", e);
                                }
                                index++;
                            }
                            smartN.utxosNextReward = arrTxAfterLastHeightReWard;
                            smartN.totalImMatureInNextReward = totalImMatureInNextReward;
                            smartN.totalMatureInNextReward = totalMatureInNextReward;
                        }catch (e){
                           console.log("haha",e);
                        }

                    }
                }
                return smartnodesr;
            } catch (error) {
                console.log("dddd",error);
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
                return smartNodes.filter(item=> item.participants.filter(ii=>ii.userId && typeof ii.userId==="object"&&ctx.user._id.equals(ii.userId._id)).length!==0).map((item:any)=>{
                    if(objSmartnode[item.ipAddress]){
                        objSmartnode[item.ipAddress].label = item.label;
                        objSmartnode[item.ipAddress]._id = item._id;
                        objSmartnode[item.ipAddress].createdAt = item.createdAt;
                        objSmartnode[item.ipAddress].updatedAt = item.updatedAt;
                        objSmartnode[item.ipAddress].collateral = item.collateral;
                        objSmartnode[item.ipAddress].lastReward = item.lastReward;
                        objSmartnode[item.ipAddress].lastHeightReward = item.lastHeightReward;
                        objSmartnode[item.ipAddress].privateAddress = item.privateAddress;
                        objSmartnode[item.ipAddress].privateAccount = item.privateAccount;
                        objSmartnode[item.ipAddress].statusCollateral = item.statusCollateral;
                        objSmartnode[item.ipAddress].participants = item.participants;
                        return {...objSmartnode[item.ipAddress],...item};
                    }
                    return item;
                });
            } catch (error) {
                console.log(error);
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
            // const cloneData = JSON.parse(JSON.stringify(smartNode));
            smartNode.label = args.label;
            smartNode.ipAddress = args.ipAddress||"";
            if(global.settingSystem.isMaintenance){
                throw new ApolloError("System is Maintenance");
            }
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
            let accountAddress ="SmartNode#"+ smartNode.label;
            const datas = await RPCRuner.getAddressesByAccount(accountAddress);
            //check used account
            if(datas && datas.length){
                accountAddress ="SmartNode#"+ smartNode.label+"_"+new Date().getTime();
            }
            // const privateAddress: any = await RPCRuner.getAccountAddress("SmartNode#"+smartNode.label).catch((e) => {
            //     console.log("không thể kết nối raptoreum", e.toString());
            //     return false;
            // });
            const privateAddress: any = await RPCRuner.getAccountAddress(accountAddress).catch((e) => {
                console.log("không thể kết nối raptoreum", e.toString());
                return false;
            });
            smartNode.privateAddress = privateAddress;
            smartNode.privateAccount = "SmartNode#"+smartNode.label;
            smartNode.collateral = global.settingSystem.collateral||1500000;
            if(args.showParticipants ||args.showParticipants===false){
                smartNode.showParticipants = args.showParticipants;
            }
            if(args.collateral){
                smartNode.collateral = args.collateral;
            }
            smartNode.statusCollateral = "Not Enough";
            if(args.statusCollateral){
                smartNode.statusCollateral = args.statusCollateral;
            }
            // const history = new History();
            // history.action = "create";
            // history.author = ctx.user._id;
            // history.data = smartNode;
            // history.dataOld = cloneData;

            smartNode.save();
            try{
                const history = new History();
                history.action = "createSmartNode";
                history.author = ctx.user._id;
                history.data = smartNode;
                history.dataOld = {};
                await history.save();
            }catch{
            }
            return smartNode;
        },
        addParticipantSmartNode:async (__: any, args:{_id:string,userId:string,collateral:number,txid:string ,tfa:string},ctx:any) => {
            checkIsAdmin(ctx.user);
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
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                throw new ApolloError("Not found document");
            }
            const cloneData = JSON.parse(JSON.stringify(smartNode));
            const user = await User.findById(args.userId);
            if(!user){
                throw new ApolloError("Not found user");
            }
            if(args.collateral<0){
                throw new ApolloError("collateral must be greater than 0");
            }
            let collateral = 0;
            smartNode.participants.forEach((ii:Iparticipant)=>{
                collateral +=ii.collateral;
            });
            if(collateral>=smartNode.collateral){
                throw new ApolloError("smartNode is Enough");
            }
            if(!args.collateral){
                throw new ApolloError("collateral >0");
            }
            const participantF = smartNode.participants.find(it=>user._id.equals(it.userId));
            if(participantF){
                participantF.collateral+=args.collateral;
                participantF.percentOfNode=participantF.collateral / smartNode.collateral;
                if(args.txid&&args.txid!==""){
                    participantF.txids.push(args.txid);
                }
                participantF.time = new Date();
                participantF.source =  (participantF.source==="Add Manual"?"":((participantF.source||"")+"-"))+ "Add Manual";
            }else {
                const participant: Iparticipant = {
                    userId: user,
                    collateral: args.collateral,
                    percentOfNode: args.collateral / smartNode.collateral,
                    RTMRewards: 0,
                    exchange: 0,
                    pendingRTMRewards: 0,
                    txids: args.txid&&args.txid!==""?[args.txid]:[],
                    source: "Add Manual",
                    time: new Date(),
                };
                const collateral2 = 0;
                smartNode.participants.push(participant);
            }
            let collateral2 = 0;
            smartNode.participants.forEach((ii:Iparticipant)=>{
                collateral2 +=ii.collateral;
            });
            if(smartNode.statusCollateral ==="Not Enough"&&collateral2>=global.settingSystem.collateral){
                smartNode.statusCollateral = "Enough";
            }


            await smartNode.save();
            try{
                const history = new History();
                history.action = "addParticipantSmartNode";
                history.author = ctx.user._id;
                history.data = smartNode;
                history.dataOld = cloneData;
                await history.save();
            }catch{
            }

            return smartNode;
        },
        deleteParticipantSmartNode:async (__: any, args:{_id:string,userId:string,collateral:number,txid:string ,tfa:string},ctx:any) => {
            checkIsAdmin(ctx.user);
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
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                throw new ApolloError("Not found document");
            }
            const cloneData = JSON.parse(JSON.stringify(smartNode));
            const user = await User.findById(args.userId);
            if(!user){
                throw new ApolloError("Not found user");
            }

            const participantF = smartNode.participants.find(it=>user._id.equals(it.userId));
            if(args.collateral>participantF.collateral){
                throw new ApolloError("collateral Not have:"+args.collateral+">"+participantF.collateral);
            }
            if(args.collateral<0){
                throw new ApolloError("collateral must be greater than 0");
            }
            if(participantF){
                if(args.collateral===participantF.collateral){
                    smartNode.participants = smartNode.participants.filter(it=>!user._id.equals(it.userId));
                }else {
                    participantF.collateral -= args.collateral;
                    participantF.percentOfNode = participantF.collateral / smartNode.collateral;
                    if (args.txid && args.txid !== "") {
                        participantF.txids.push(args.txid);
                    }
                    participantF.time = new Date();
                    participantF.source = (participantF.source === "Delete Manual" ? "" : ((participantF.source || "") + "-")) + "Delete Manual";
                }
            }else {
                throw new ApolloError("Not found your participant");
            }


            await smartNode.save();
            try{
                const history = new History();
                history.action = "deleteParticipantSmartNode";
                history.author = ctx.user._id;
                history.data = smartNode;
                history.dataOld = cloneData;
                await history.save();
            }catch{
            }

            return smartNode;
        },
        updateSmartNode: async (__: any, args:ISmartNode&{_id:string,tfa:string},ctx:any) => {
            checkIsAdmin(ctx.user);
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
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                throw new ApolloError("Not found document");
            }
            const cloneData = JSON.parse(JSON.stringify(smartNode));
            if(args.label){
                smartNode.label = args.label;
            }
            if(args.ipAddress){
                smartNode.ipAddress = args.ipAddress;
            }
            if(args.lastHeightReward){
                smartNode.lastHeightReward = args.lastHeightReward;
            }
            if(args.collateral&&smartNode.collateral!==args.collateral){
                let collateral = 0;
                smartNode.collateral = args.collateral;
                smartNode.participants.forEach((ii:Iparticipant)=>{
                    collateral +=ii.collateral;
                    ii.percentOfNode = ii.collateral/args.collateral;
                });
                if(collateral>=smartNode.collateral){
                    smartNode.statusCollateral ="Enough";
                }
            }
            if(args.private ||args.private===false){
                smartNode.private = args.private;
            }
            if(!smartNode.privateAccount ||smartNode.privateAccount===""){
                smartNode.privateAccount = "SmartNode#"+smartNode.label;
            }

            if(args.showParticipants ||args.showParticipants===false){
                smartNode.showParticipants = args.showParticipants;
            }
            if(args.statusCollateral &&args.statusCollateral!== smartNode.statusCollateral){
                smartNode.statusCollateral = args.statusCollateral;
                if(args.statusCollateral ==="Start Reward"&&!smartNode.timeStartReward){
                    smartNode.timeStartReward = new Date();
                    if(!smartNode.lastHeightReward){
                        const res = await RPCRuner.getblockchaininfo();
                        smartNode.heightStartReward =res.blocks ;
                        smartNode.lastHeightReward =res.blocks ;
                    }
                }
            }
            await smartNode.save();
            try{
                const history = new History();
                history.action = "updateSmartNode";
                history.author = ctx.user._id;
                history.data = smartNode;
                history.dataOld = cloneData;
                await history.save();
            }catch{
            }
            return smartNode;
        },
        balanceNodes: async (__: any, args:{collateral?:number,tfa:string,
            participantsInNodes?:{_id:string,
                participants:{
                    userId:string,
                    collateral:number,
                    percentOfNode?:number,
                    exchange:number,
                    txids?:[string],
                    source?:string,
                    time?:Date
                }}[]
        },ctx:any) => {
            checkIsAdmin(ctx.user);
            if(global.settingSystem)
            global.settingSystem.isMaintenance = true;
            if(ctx.user.enableTfa){
                if(!args.tfa||args.tfa===""){
                    if(global.settingSystem)
                        global.settingSystem.isMaintenance = false;
                    throw new ApolloError("undefined code 2fa");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: args.tfa
                });
                if(!isVerified){
                    if(global.settingSystem)
                        global.settingSystem.isMaintenance = false;
                    throw new ApolloError("2fa is not correct");
                }
            }
            const smartNodes = await SmartNode.find();
            const cloneData = JSON.parse(JSON.stringify(smartNodes));
            const mapUser = new Map<string, Iparticipant>();
            const mapPa = new Map<string, Iparticipant[]>();
            const mapChanged = new Map<string, string|boolean>();
            const mapTotalCurrentCollateral = new Map<string, number>();
            smartNodes.forEach((doc:SmartNodeDocument)=>{
                let totalCurrentCollateral = 0;
                let keyChange ="huy";
                doc.participants?.forEach((item,index)=>{
                    totalCurrentCollateral +=item.collateral;
                    const existUser = mapUser.get(item.userId.toString()||"");
                    keyChange+=(item.userId?._id||"")+item.collateral.toString();
                    if(existUser){
                        mapUser.set(item?.userId?._id.toString()||"",{...item,userId:item.userId,collateral:item.collateral+existUser.collateral,percentOfNode:(item.collateral+existUser.collateral)/(doc.collateral||1)});
                    }else{
                        mapUser.set(item?.userId?._id.toString()||"",item);
                    }
                });
                mapTotalCurrentCollateral.set(doc._id.toString()||"",totalCurrentCollateral);
                mapChanged.set(doc._id||"",keyChange);
            });
            // let participants:Iparticipant[] = [];
            const smartnodesEn:SmartNodeDocument[] =smartNodes.sort((itema:any,itemb:any)=>{return itema.statusCollateral==="Not Enough"?11800000:(mapTotalCurrentCollateral.get(itemb._id.toString())-mapTotalCurrentCollateral.get(itema._id.toString()));});
            // const smartnodesEn:SmartNodeDocument[] =[];
            // smartnodesEnf.forEach((item)=>smartnodesEn.push({...item}));
            const added:string[] = [];
            console.log("mapUser",mapUser.size);
            let Cache :Iparticipant|null = null;
            smartnodesEn.forEach((smartnode)=>{
                let keyChange = "huy";
                console.log(smartnode.label)
                const participantsR :Iparticipant[]= [];
                let total = 0;
                const totalCollateralNode = (args.collateral?(args.collateral):(smartnode?.collateral||global.settingSystem.collateral));
                mapUser.forEach((value:Iparticipant,key)=>{
                    if((!added.includes(key)||(Cache&&(Cache.userId===key||Cache.userId.toString()===key))) &&total<totalCollateralNode){
                        added.push(key)
                        if((Cache&&Cache.collateral&&(Cache.userId===key||Cache.userId.toString()===key))){
                            if(Cache.collateral>totalCollateralNode){
                                const ii :Iparticipant = { userId: Cache.userId,
                                    RTMRewards: Cache.RTMRewards,
                                    pendingRTMRewards: Cache.pendingRTMRewards,
                                    txids: Cache.txids,
                                    time: new Date(),
                                    source: Cache.source,collateral:totalCollateralNode,percentOfNode:totalCollateralNode/totalCollateralNode};
                                participantsR.push(ii);
                                total+=ii.collateral;
                                Cache = {userId: Cache.userId,
                                    RTMRewards: Cache.RTMRewards,
                                    pendingRTMRewards: Cache.pendingRTMRewards,
                                    txids: Cache.txids,
                                    time: new Date(),
                                    source: Cache.source,percentOfNode:(Cache.collateral-ii.collateral)/totalCollateralNode,collateral:Cache.collateral-ii.collateral};
                                keyChange+=(value.userId?._id||"")+ii.collateral.toString();
                            } else{
                                // participantsR.push({...Cache,...{userId:value.userId}});
                                participantsR.push( { userId: Cache.userId,
                                    RTMRewards: Cache.RTMRewards,
                                    pendingRTMRewards: Cache.pendingRTMRewards,
                                    txids: Cache.txids,
                                    source: Cache.source,
                                    time: new Date(),collateral:Cache.collateral, percentOfNode:Cache.collateral/totalCollateralNode});
                                keyChange+=(value.userId?._id||"")+Cache.collateral.toString();
                                total+=Cache.collateral;
                                Cache =null;
                            }
                        }else{
                            total+=value.collateral;
                        if(total<totalCollateralNode){
                            added.push(key);
                            participantsR.push( { userId: value.userId,
                                RTMRewards: value.RTMRewards,
                                pendingRTMRewards: value.pendingRTMRewards,
                                txids: value.txids,
                                source: value.source,
                                time: new Date(),collateral:value.collateral, percentOfNode:value.collateral/totalCollateralNode});
                            keyChange+=(value.userId?._id||"")+value.collateral.toString();
                            Cache=null;
                        }else if(total===totalCollateralNode){
                            Cache=null;
                            added.push(key);
                            participantsR.push( { userId: value.userId,
                                RTMRewards: value.RTMRewards,
                                pendingRTMRewards: value.pendingRTMRewards,
                                txids: value.txids,
                                source: value.source,
                                time: new Date(),collateral:value.collateral, percentOfNode:value.collateral/totalCollateralNode});
                            keyChange+=(value.userId?._id||"")+value.collateral.toString();
                        } else {
                            added.push(key);
                            const ii :Iparticipant = { userId: value.userId,
                                   RTMRewards: value.RTMRewards,
                                    pendingRTMRewards: value.pendingRTMRewards,
                                    txids: value.txids,
                                  source: value.source,
                                   time: new Date(),collateral:value.collateral-(total-totalCollateralNode), percentOfNode: (value.collateral-(total-totalCollateralNode))/totalCollateralNode};
                                participantsR.push(ii);
                                Cache = { userId: value.userId,
                                    RTMRewards: value.RTMRewards,
                                    pendingRTMRewards: value.pendingRTMRewards,
                                    txids: value.txids,
                                    source: value.source,
                                    collateral:value.collateral-ii.collateral,
                                    time: new Date(),
                                    percentOfNode:(value.collateral-ii.collateral)/totalCollateralNode};
                                // console.log(Cache,"Cache",value.collateral,ii.collateral);
                                if(Cache&& Cache.collateral===0){
                                    Cache =null;
                                }
                                keyChange+=(value.userId?._id||"")+ii.collateral.toString();
                            total = totalCollateralNode;
                        }
                        }
                    }
                });
                if(keyChange===mapChanged.get(smartnode._id||"")){
                    mapChanged.set(smartnode._id||"",false);
                }
                mapTotalCurrentCollateral.set(smartnode._id||"",total);
                // console.log(participantsR,"participantsR",smartnode.label,'sdfsdf');
                // smartnode.participants = participantsR;
                mapPa.set(smartnode._id.toString()||"",participantsR);
                // participants = participants.concat(participantsR);
            });
            if(added.length<mapUser.size){
                if(global.settingSystem)
                    global.settingSystem.isMaintenance = false;
                throw new ApolloError("Error! You need to create new Nodes to fill Collateral");
            }
            console.log("toiws ddaya rooif",mapPa.size);
            for await (const smartNode of smartNodes){
                const pa = mapPa.get(smartNode._id.toString());
                // console.log("pa",pa);
                smartNode.participants = pa;
                if(args.collateral){
                    smartNode.collateral = args.collateral;
                }
                await smartNode.save();
            }
            try{
                const history = new History();
                history.action = "balanceNodes";
                history.author = ctx.user._id;
                history.data = smartNodes;
                history.dataOld = cloneData;
                await history.save();
            }catch{
                if(global.settingSystem)
                    global.settingSystem.isMaintenance = false;
            }
            if(global.settingSystem)
                global.settingSystem.isMaintenance = false;
            return true;
        },
        withdrawEnoughSmartNode: async (__: any, args:{_id:string,amount:number,address:string,tfa:string},ctx:any) => {
            checkIsAdmin(ctx.user);
            const smartNode = await SmartNode.findById(args._id);

            if(!smartNode){
                throw new ApolloError("Not found document");
            }
            if(global.settingSystem.isMaintenance){
                throw new ApolloError("System is Maintenance");
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
            try{
                await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
            }catch (e){
                console.log(e);
            }
            const rawData:string = await RPCRuner.sendFrom({address:args.address,account: account,comment,amount:args.amount,comment_to:""});

            await smartNode.save();
            try{
                const history = new History();
                history.action = "withdrawEnoughSmartNode";
                history.author = ctx.user._id;
                history.data = rawData;
                history.dataOld = smartNode;
                await history.save();
            }catch{
            }
            return smartNode;
        },
        deleteSmartNode: async (__: any, args:ISmartNode&{_id:string},ctx:any) => {
            checkIsAdmin(ctx.user);
            throw new ApolloError("delete not allow");
            // const smartNode = await SmartNode.findById(args._id);
            // if(!smartNode){
            //     throw new ApolloError("Not found document");
            // }
            // if(global.settingSystem.isMaintenance){
            //     throw new ApolloError("System is Maintenance");
            // }
            // await smartNode.remove();

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
            if(!ctx.user.enableTfa){
                throw new ApolloError("You need to enable Two Factor Authentication");
            }
            if(global.settingSystem.isMaintenance){
                throw new ApolloError("System is Maintenance");
            }
            if(ctx.user.enableTfa){
                if(!args.token && args.token===""){
                    throw new ApolloError("Not verified 2FA");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: args.token
                });
                if (!isVerified) {
                    throw new ApolloError("Not verified 2FA");
                }
            }
            const smartNode = await SmartNode.findById(args._id);
            if(!smartNode){
                throw new ApolloError("Not Found SmartNode _id"+args._id);
            }
            const cloneData = JSON.parse(JSON.stringify(smartNode));
            if( smartNode.statusCollateral !=="Not Enough"){
                throw new ApolloError("SmartNode:"+smartNode.label+" is "+smartNode.statusCollateral);

            }
            try{
                const comment = "#join SmartNode:#"+smartNode.label+"- Raptornodes.com";
                try{
                    await RPCRuner.walletpassphrase(WALLET_PASS_PHRASE,20);
                }catch (e){
                    console.log(e);
                }
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
                        smartNode.statusCollateral ="Enough";
                    }
                    await smartNode.save();
                    try{
                        const history = new History();
                        history.action = "joinSmartNode";
                        history.author = ctx.user._id;
                        history.data = cloneData;
                        history.dataOld = smartNode;
                        await history.save();
                    }catch{
                    }
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
            if(global.settingSystem.isMaintenance){
                throw new ApolloError("System is Maintenance");
            }
            if(ctx.user.enableTfa){
                if(!args.token && args.token===""){
                    throw new ApolloError("Not verified 2FA");
                }
                const isVerified = speakeasy.totp.verify({
                    secret: ctx.user.tfa.secret,
                    encoding: "base32",
                    token: args.token
                });
                if (!isVerified) {
                    throw new ApolloError("Not verified 2FA");
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
    },
    smartNode:{
        yourParticipant:async (model:ISmartNode,args:any, ctx:any) => {
            return model.participants.find(ii=>ii.userId && typeof ii.userId==="object"&&ctx.user._id.equals(ii.userId._id));
        }
    }
};

export default ServiceResolvers;
