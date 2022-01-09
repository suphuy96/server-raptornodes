import { ApolloError } from "apollo-server-express";
import pick from "lodash/pick";
import { UserAddressDocument, UserAddress } from "../../models/UserAddress";
import {checkIsAdmin} from "../../util/checkAuthen";
import {Backup} from "../../models/Backup";
import {Faq} from "../../models/Faq";

const ServiceResolvers = {
    Query: {
        userAddresss: async (__: any, args: any,ctx:any) => {
            try {
               if(!ctx.user){
                   throw new ApolloError("No session login");
               }
               return UserAddress.find({author:ctx.user._id});
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        createUserAddress: async (__: any, userAddress: {label:string,address:string},ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
                const user = new UserAddress();
                user.address = userAddress.address;
                user.label = userAddress.label;
                user.author = ctx.user._id;
                user.save();
                return user;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        updateUserAddress: async (__: any, args: any,ctx:any) => {
            try {
                if(!ctx.user){
                    throw new ApolloError("No session login");
                }
                const faq = await UserAddress.findOne({_id:args._id});
                if(!faq){
                    throw new ApolloError("Not found document");
                }
                if(ctx.user.rules!=="Admin"&& faq.author!==ctx.user._id){
                    throw new ApolloError("you not have permissiom");
                }
                if(args.address){
                    faq.address = args.address;
                }
                if(args.label){
                    faq.label = args.label;
                }
                faq.save();
                return faq;
            } catch (error) {
                throw new ApolloError(error);
            }
        },    deleteUserAddress: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const uaddress = await UserAddress.findOne({_id:args._id});
                if(!uaddress){
                    throw new ApolloError("Not found document");
                }
                if(ctx.user.rules!=="Admin"&& uaddress.author!==ctx.user._id){
                    throw new ApolloError("you not have permissiom");
                }
                uaddress.delete();
                return uaddress;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    }
};

export default ServiceResolvers;
