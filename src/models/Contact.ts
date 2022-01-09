import mongoose,{Schema} from "mongoose";
export interface IContact  {
    title: string;
    content: string;
    name: string;
    email: string;
}
export type ContactDocument = mongoose.Document & IContact


const ContactSchema = new mongoose.Schema<ContactDocument>(
    {
        title: { type: String },
        content: {type:String,limit:1000},
        name: String,
        email:String
    },
    { timestamps: true },
);


export const Contact = mongoose.model<ContactDocument>("Contact", ContactSchema);
