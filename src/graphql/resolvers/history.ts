import { ApolloError } from "apollo-server-express";
import {History} from "../../models/History";
import {checkIsAuthen} from "../../util/checkAuthen";


const ServiceResolvers = {
    Query: {
        historys: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                if(ctx.user.rules==="Admin"){
                    return await History.find(args).populate("user");
                }
               const ars = await History.find({user:ctx.user._id});
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
