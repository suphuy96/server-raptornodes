import { ApolloError } from "apollo-server-express";
import RpcRaptoreum ,{OptionRpcClient} from "../../libs/rpc-raptoreum";
import {getMarketcap, getTotalLockedCoins} from "../../helper/request/explorerRaptoreum";
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

        marketCap: async (__: any, args: any,ctx:any) => {
            try {
                const data= await getMarketcap();
                console.log("ddd",data);

                return data.data;
            } catch (error) {
                console.log("looixo rồi",error.toString());
                throw new ApolloError(error);
            }
        },
        totalLockedCoins: async (__: any, args: any,ctx:any) => {
            try {
                const data= await getTotalLockedCoins();
                console.log("ddd",data);

                return data.data;
            } catch (error) {
                console.log("looixo rồi",error.toString());
                throw new ApolloError(error);
            }
        },
    },
};

export default ServiceResolvers;
