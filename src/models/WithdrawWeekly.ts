import mongoose,{Schema} from "mongoose";
export interface IWithdrawWeekly  {
    address: string;
    amount:number;
    ip: string;
    status: boolean;
    confirm:boolean;
    description:string;
    txid: string;
    author: Schema.Types.ObjectId;
}
export type WithdrawWeeklyDocument = mongoose.Document & IWithdrawWeekly


const WithdrawWeeklySchema = new mongoose.Schema<WithdrawWeeklyDocument>(
    {
        address: { type: String },
        amount: Number,
        ip: String,
        status: { type: Boolean ,default:false},
        confirm: { type: Boolean ,default:false},
        description:String,
        txid: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);



export const WithdrawWeekly = mongoose.model<WithdrawWeeklyDocument>("WithdrawWeekly", WithdrawWeeklySchema);
