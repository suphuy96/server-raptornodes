import { ApolloError } from "apollo-server-express";
import {History} from "../../models/History";
import {checkIsAuthen} from "../../util/checkAuthen";


const ServiceResolvers = {
    Query: {
        historys: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const objFilter:any&{status?:string,author?:string,createdAt?:any} = ctx.user.rules==="Admin"?{}:{author:ctx.user._id};
                if (args.action){
                    objFilter.action =args.action;
                }
                if (ctx.user.rules==="Admin" && args.author){
                    objFilter.author =args.author;
                }
                if (args.createdAt){
                    objFilter.createdAt = {};
                    Object.keys(args.createdAt).forEach((keyTr) =>{
                        if(["eq","neq","ne","in","nin","gte","gt","lt","lte"].includes(keyTr)){
                            objFilter.createdAt["$" + keyTr] = args.createdAt[keyTr];
                        }
                    });
                }
                // if(ctx.user.rules==="Admin"){
                //     return await History.find(args).populate("user");
                // }
               const ars = await History.find(objFilter).populate("author").limit(args.limit||100).skip(args.offset||0);
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
