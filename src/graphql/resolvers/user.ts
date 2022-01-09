import { ApolloError } from "apollo-server-express";
import pick from "lodash/pick";
import {IUser, User} from "../../models/User";
import {checkIsAdmin} from "../../util/checkAuthen";
import speakeasy from "speakeasy";
import RpcRaptoreum, {OptionRpcClient} from "../../libs/rpc-raptoreum";
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
        me: async (__: any, args: any,ctx:any) => {
            try {
               if(!ctx.user){
                   throw new ApolloError("No session login");
               }
               return pick(ctx.user,["email","_id","profile","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        users: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
              const users = await User.find({rules:"User"});

                const res = await RPCRuner.listaddressbalances().catch(()=>{
                    return {};
                });
                if(res && typeof res==="object"){
                    users.forEach(item=>{
                        item.balance = res[item.addressRTM]||0;
                    });
                }
                return users;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    },
    Mutation:{
        updateUser: async (__: any, args: IUser&{_id:string,tfa:string},ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
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
                const user = await User.findById(args._id);
                if(args.status || args.status===false){
                    user.status = args.status;
                }
                if(args.discord || args.discord===""){
                    user.discord = args.discord;
                }
                if(args.enableTfa ||args.enableTfa===false){
                    user.enableTfa = args.enableTfa;
                }
              await user.save();

                return pick(user,["email","_id","profile","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        removeUser: async (__: any, args: any,ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
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
                return pick(ctx.user,["email","_id","profile","discord","createdAt","rules","updatedAt","addressRTM", "enableTfa"]);
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    }
};

export default ServiceResolvers;
