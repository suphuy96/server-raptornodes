import { ApolloError } from "apollo-server-express";
import {Contact, ContactDocument, IContact} from "../../models/Contact";
import {checkIsAdmin} from "../../util/checkAuthen";

const ServiceResolvers = {
    Query: {
        contacts: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
               return await Contact.find();
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Mutation: {
        createContact: async (__: any, contactInput: IContact,ctx:any) => {
            try {
                const contact = new Contact();
                contact.title = contactInput.title;
                contact.content = contactInput.content;
                contact.name = contactInput.name;
                contact.email = contactInput.email;
                const contactSave= await contact.save();
                return contactSave;
            } catch (error) {
                throw new ApolloError(error);
            }
        },

        deleteContact: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAdmin(ctx.user);
                const contact = await Contact.findOne({_id:args._id});
                if(!contact){
                    throw new ApolloError("Not found document");
                }
                contact.delete();
                return contact;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    }
};

export default ServiceResolvers;
