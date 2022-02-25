import { ApolloError } from "apollo-server-express";
import {DataUltraFastEarning, DataUltraFastEarningDocument, IDataUltraFastEarning} from "../../models/dataUltraFastEarning";
import {checkIsAdmin,checkIsAuthen} from "../../util/checkAuthen";
import speakeasy from "speakeasy";

const ServiceResolvers = {
    Query: {
        dataUltraFastEarning: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const ars = await DataUltraFastEarning.find().populate("participants.author");
                if(ars.length===0){
                    const deff = {};
                    const ss = new DataUltraFastEarning(deff);
                    await ss.save();
                    return ss;
                }
                const re = ars[0];
                return re;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        dataUltraFastEarningMe: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const ars = await DataUltraFastEarning.find();
                if(ars.length===0){
                    const deff = {};
                    const ss = new DataUltraFastEarning(deff);
                    await ss.save();
                    return [];
                }
                const re = ars[0];
                console.log('re.participants',re.participants,ctx.user._id,ctx.user._id.equals(re.participants[0].author))
                return re.participants.filter((item)=>ctx.user._id.equals(item.author));
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        updateDataUltraFastEarning: async (__: any, systemInput: ISystem&{tfa:string},ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                if(ctx.user.enableTfa){
                    if(!systemInput.tfa||systemInput.tfa===""){
                        throw new ApolloError("undefined code 2fa");
                    }
                    const isVerified = speakeasy.totp.verify({
                        secret: ctx.user.tfa.secret,
                        encoding: "base32",
                        token: systemInput.tfa
                    });
                    if(!isVerified){
                        throw new ApolloError("2fa is not correct");
                    }
                }
                const system = await DataUltraFastEarning.findOne();

                return system;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
