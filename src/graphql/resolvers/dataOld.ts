import { ApolloError } from "apollo-server-express";
import {DataOld, DataOldDocument, IDataOld} from "../../models/DataOld";
import {checkIsAdmin} from "../../util/checkAuthen";

const ServiceResolvers = {
    Query: {
        dataOlds: async (__: any, args: any,ctx:any) => {
            try {
                // checkIsAdmin(ctx.user);
               return await DataOld.find();
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        importDataOld: async (__: any,arg: {dataOlds: IDataOld[]},ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                await DataOld.deleteMany({});
                await DataOld.insertMany(arg.dataOlds);
                return true;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        createDataOld: async (__: any, dataOldInput: IDataOld,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const dataOld = new DataOld();
                dataOld.address = dataOldInput.address;
                dataOld.discordName = dataOldInput.discordName;
                dataOld.discordId = dataOldInput.discordId;
                dataOld.RTMRewards = dataOldInput.RTMRewards;
                dataOld.collateral = dataOldInput.collateral;
                dataOld.percentOfNode = dataOldInput.percentOfNode;
                dataOld.RTMRewards = dataOldInput.RTMRewards;
                dataOld.pendingRTMRewards = dataOldInput.pendingRTMRewards;
                dataOld.smartNode = dataOldInput.smartNode;
                const dataOldSave= await dataOld.save();
                return dataOldSave;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        updateDataOld: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const dataOld = await DataOld.findById(args._ida);
                if(!dataOld){
                    throw new ApolloError("Not found document");
                }
                if(args.discordName){
                    dataOld.discordName = args.discordName;
                }
                if(args.discordId){
                    dataOld.discordId = args.discordId;
                }
                if(args.collateral){
                    dataOld.collateral = args.collateral;
                }
                if(args.percentOfNode){
                    dataOld.percentOfNode = args.percentOfNode;
                }
                if(args.RTMRewards){
                    dataOld.RTMRewards = args.RTMRewards;
                }  if(args.pendingRTMRewards){
                    dataOld.pendingRTMRewards = args.pendingRTMRewards;
                }
                if(args.smartNode){
                    dataOld.smartNode = args.smartNode;
                }
                return dataOld;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        deleteDataOld: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const dataOld = await DataOld.findOne({_id:args._id});
                if(!dataOld){
                    throw new ApolloError("Not found document");
                }
                dataOld.delete();
                return dataOld;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    }
};

export default ServiceResolvers;
