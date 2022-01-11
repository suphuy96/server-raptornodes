import mongoose,{Schema} from "mongoose";
import {UserDocument} from "./User";
export interface IReWardHistory  {
    description:string;
    smartNode:string;
    reward:string;
    paymentsPerDay:number;
    percentOfNode:number;
    feeReward:number;
    collateral:number;
    days:number;
    isSchedule:boolean;
    user:UserDocument;
    txid: string;
    amount:number;
    dayEnd:Date;
}
export type ReWardHistoryDocument = mongoose.Document & IReWardHistory


const ReWardHistorySchema = new mongoose.Schema<ReWardHistoryDocument>(
    {
        description:String,
        smartNode: String,
        reward:String,
        paymentsPerDay:Number,
        feeReward:Number,
        days:Number,
        collateral:Number,
        percentOfNode:Number,

        isSchedule:Boolean,
        dayEnd:Date,
        txid:String,
        amount:Number,
        user:{ type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);


export const ReWardHistory = mongoose.model<ReWardHistoryDocument>("ReWardHistory", ReWardHistorySchema);
