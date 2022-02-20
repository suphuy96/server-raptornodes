import errorHandler from "errorhandler";
import app from "./app";
import cron from "./cron/index";
import { createServer } from "http";
import { ApolloServer,ExpressContext } from "apollo-server-express";
import { schema } from "./graphql/schema";
import {User, UserDocument} from "./models/User";
import {NativeError} from "mongoose";
import jwt from "jsonwebtoken";
import {ISystem,SystemDocument,System} from "./models/System";
import defaultSetting from "./config/settingSystemDefault";
import RpcRaptoreum,{OptionRpcClient} from "./libs/rpc-raptoreum";
import { SESSION_SECRET } from "./util/secrets";
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
global.settingSystem = defaultSetting;

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}


/**
 * Start Express server.
 */

const context = async (integrationContext:ExpressContext) =>{
        const req= integrationContext.req;
    let token = "";
    // console.log("vào đây",req.headers["authorization"]);
    if (req && req.cookies)
    {
        token = req.cookies["jwt"];
    } else  if (req && req.headers && req.headers.authorization)
    {
        token = (req.headers["authorization"]).toString();
        // console.log(token,"d");
    }
// console.log('token',token)

    const jwt_payload:UserDocument|null = await new Promise((resolve, reject) => {
        jwt.verify(token, SESSION_SECRET, function (err:any, decoded:any) {
            // err
            // console.log(decoded);
            // if (err)
            //     resolve(null);
            //, tokenJWT:decoded.tokenJWT
            if(!decoded){
                resolve(null);
            } else
            User.findOne({ email:decoded.email }, (err: NativeError, user: UserDocument) => {
                // if (err) {   console.log("hết hạn",err);
                //     resolve(null); }
                if (!user) {
                    console.log("hết hạn");
                    resolve(null);
                }
                // console.log(user);
                // user.comparePassword(password, (err: Error, isMatch: boolean) => {
                //     if (err) { return done(err); }
                //     if (isMatch) {
                //         return done(undefined, user);
                //     }
                resolve(user);
                // });
            });
            // resolve(null);
        });
    });
    // console.log('jwt_payload',jwt_payload);
    if(jwt_payload){
        // console.log(jwt_payload);
        integrationContext.req.user= jwt_payload;
    }

    if(integrationContext.req){
        // integrationContext.req.apiServices = ApiServices;
        // integrationContext.req.provider = 'graphql';
        return integrationContext.req;
    } else {
        const context ={};
        // if(integrationContext.connection && integrationContext.connection.context){
        //     context = integrationContext.connection.context;
        //     context.req = {};
        //     context.req.apiServices = ApiServices;
        //     context.req.provider = 'graphql';
        //     return context;
        // }
    }

};
const server = new ApolloServer({
    schema,
    context,
    introspection: process.env.NODE_ENV!=="production"
});
const loadSystem = async()=>{
    const settingSystem:SystemDocument = await System.findOne();
    global.settingSystem = settingSystem;
    try{
        const res = await  RPCRuner.getblockchaininfo();
        if(res && res && res.chain){
            global.settingSystem.testNet = (res.chain!=="main"?true:false);
        }

    }catch (e){

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
    global.settingSystem.withdrawlWeeklyAccount = "WithdrawlWeekly";
    if(!global.settingSystem.withdrawWeeklyAddress ||global.settingSystem.withdrawWeeklyAddress==""){
        const withdrawWeeklyAddress = await RPCRuner.getAccountAddress("WithdrawlWeekly").catch((e) => {
            console.log("không thể kết nối raptoreum", e.toString());
            return false;
        });
        console.log(withdrawWeeklyAddress,"withdrawWeeklyAddress");
        if(withdrawWeeklyAddress){
            global.settingSystem.withdrawWeeklyAddress = withdrawWeeklyAddress;
            settingSystem.withdrawWeeklyAddress = withdrawWeeklyAddress;
            global.settingSystem.withdrawlWeeklyAccount ="WithdrawlWeekly";
            await settingSystem.save();
        }
    }
    const smartnodeCount:{total:number,enabled:number} = await RPCRuner.smartnodeCount();
    if(smartnodeCount.total){
        settingSystem.paymentsPerDay = 720000/smartnodeCount.enabled;
    }

};
const main = async ()=>{
    await loadSystem();
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
    const httpServer = createServer(app);
    httpServer.listen({ port: app.get("port") }, (): void =>{
        console.log(
            "  App is running at http://localhost:%d in %s mode",
            app.get("port"),
            app.get("env")
        );}
    );
    if(!process.env.NODE_APP_INSTANCE||process.env.NODE_APP_INSTANCE === "0"){
        cron();
    }


};
main();
export default server;
