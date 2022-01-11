import mongoose,{Schema} from "mongoose";
export interface IReWard  {
    description:string;
    paymentsPerDay:number;
    feeReward:number;
    days:number;
    isSchedule:boolean;
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
        dayEnd:Date,
    },
    { timestamps: true },
);


export const ReWard = mongoose.model<ReWardDocument>("ReWard", ReWardSchema);
