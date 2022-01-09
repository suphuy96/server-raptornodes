import mongoose,{Schema} from "mongoose";
export interface IFaq  {
    label: string;
    answer: string;
    author: Schema.Types.ObjectId;
}
export type FaqDocument = mongoose.Document & IFaq


const FaqSchema = new mongoose.Schema<FaqDocument>(
    {
        answer: { type: String },
        label: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);


export const Faq = mongoose.model<FaqDocument>("Faq", FaqSchema);
