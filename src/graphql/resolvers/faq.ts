import { ApolloError } from "apollo-server-express";
import {Faq, FaqDocument, IFaq} from "../../models/Faq";
import {checkIsAdmin} from "../../util/checkAuthen";

const ServiceResolvers = {
    Query: {
        faqs: async (__: any, args: any,ctx:any) => {
            try {
                // checkIsAdmin(ctx.user);
               return await Faq.find().populate("author");
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        createFaq: async (__: any, faqInput: IFaq,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const faq = new Faq();
                faq.answer = faqInput.answer;
                faq.label = faqInput.label;
                faq.author = ctx.user._id;
                const faqSave= await faq.save();
                return faqSave;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        updateFaq: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const faq = await Faq.findById(args._id);
                if(!faq){
                    throw new ApolloError("Not found document");
                }
                if(args.answer){
                    faq.answer = args.answer;
                }
                if(args.label){
                    faq.label = args.label;
                }
                await  faq.save();
                return faq;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        deleteFaq: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const faq = await Faq.findOne({_id:args._id});
                if(!faq){
                    throw new ApolloError("Not found document");
                }
                faq.delete();
                return faq;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    }
};

export default ServiceResolvers;
