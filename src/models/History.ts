import mongoose,{Schema} from "mongoose";
import {UserDocument} from "./User";
export interface IHistory  {
    data:any;
    dataOld:any;
    action:string;
    author:UserDocument;
}
export type HistoryDocument = mongoose.Document & IHistory


const HistorySchema = new mongoose.Schema<HistoryDocument>(
    {
        data:Object,
        dataOld: Object,
        action:String,
        author:{ type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);


export const History = mongoose.model<HistoryDocument>("History", HistorySchema);
