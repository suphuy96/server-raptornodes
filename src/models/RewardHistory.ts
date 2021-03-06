import mongoose,{Schema} from "mongoose";
import {UserDocument} from "./User";
export interface IReWardHistory  {
    description:string;
    smartNode:string;
    ultraFastEarning:string;
    reward:string;
    paymentsPerDay:number;
    percentOfNode:number;
    feeReward:number;
    collateral:number;
    days:number;
    isVitual?:boolean;
    isSchedule:boolean;
    reTry:boolean;
    user:UserDocument;
    txid: string;
    reverse:string;
    amount:number;
    feeHost:number;
    dayEnd:Date;
}
export type ReWardHistoryDocument = mongoose.Document & IReWardHistory


const ReWardHistorySchema = new mongoose.Schema<ReWardHistoryDocument>(
    {
        description:String,
        smartNode: String,
        ultraFastEarning:String,
        reward:String,
        paymentsPerDay:Number,
        feeReward:Number,
        days:Number,
        collateral:Number,
        percentOfNode:Number,
        isVitual:Boolean,
        isSchedule:Boolean,
        reTry:Boolean,
        dayEnd:Date,
        txid:String,
        reverse:String,
        amount:Number,
        feeHost:Number,
        user:{ type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);


export const ReWardHistory = mongoose.model<ReWardHistoryDocument>("ReWardHistory", ReWardHistorySchema);
