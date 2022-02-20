import mongoose,{Schema} from "mongoose";
export interface IWithdrawWeekly  {
    _id?:string;
    address: string;
    amount:number;
    collateralOld:number;
    ip: string;
    smartNode:string;
    status: string;
    confirm:boolean;
    description:string;
    txid: string;
    ultraFastEarning?:string;
    author: Schema.Types.ObjectId;
}
export type WithdrawWeeklyDocument = mongoose.Document & IWithdrawWeekly


const WithdrawWeeklySchema = new mongoose.Schema<WithdrawWeeklyDocument>(
    {
        address: { type: String },
        amount: Number,
        collateralOld:Number,
        ip: String,
        smartNode:String,
        status: { type: String ,default: "Pending"},
        confirm: { type: Boolean ,default:false},
        description:String,
        txid: String,
        ultraFastEarning:String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);



export const WithdrawWeekly = mongoose.model<WithdrawWeeklyDocument>("WithdrawWeekly", WithdrawWeeklySchema);
