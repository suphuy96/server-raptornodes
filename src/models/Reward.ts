import mongoose,{Schema} from "mongoose";
export interface IReWard  {
    description:string;
    paymentsPerDay:number;
    feeReward:number;
    days:number;
    isSchedule:boolean;
    smartNode:string;
    missingReward?:boolean,
    timeReTry?:Date,
    dayStart?:Date;
    dayEnd:Date;
}
export type ReWardDocument = mongoose.Document & IReWard

const ReWardSchema = new mongoose.Schema<ReWardDocument>(
    {
        description:String,
        paymentsPerDay:Number,
        feeReward:Number,
        days:Number,
        isSchedule:Boolean,
        smartNode:String,
        missingReward:Boolean,
        timeReTry:Date,
        dayStart:Date,
        dayEnd:Date,
    },
    { timestamps: true },
);


export const ReWard = mongoose.model<ReWardDocument>("ReWard", ReWardSchema);
