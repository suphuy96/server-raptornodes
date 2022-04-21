import { ApolloError } from "apollo-server-express";
import {Backup, BackupDocument, IBackup} from "../../models/Backup";
import {checkIsAdmin} from "../../util/checkAuthen";
import backupDB,{reStoreBK} from "../../helper/backup/mongodb";
import moment from "moment";

const ServiceResolvers = {
    Query: {
        backups: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
               return await Backup.find().sort({createdAt:-1}).populate("author");
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        createBackup: async (__: any, bk: IBackup,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const backup = new Backup();
                backup.label = bk.label;
                const day = moment(new Date()).format("DD-MM-YYYY_HH_mm")+".zip";
                const pathZip= await backupDB(day);
                backup.path = day;
                backup.author = ctx.user._id;
                const faqSave= await backup.save();
                return faqSave;
            } catch (error) {
                throw new ApolloError(error);
            }
        },   reStore: async (__: any, bk:{_id:string},ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const backup = await Backup.findById(bk._id);
                if(!backup){
                    throw new ApolloError("Not found document");
                }
                const pathZip= await reStoreBK(backup.path);
                return backup;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        deleteBackup: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const backup = await Backup.findOne({_id:args._id});
                if(!backup){
                    throw new ApolloError("Not found document");
                }
                backup.delete();
                return backup;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    }
};

export default ServiceResolvers;
