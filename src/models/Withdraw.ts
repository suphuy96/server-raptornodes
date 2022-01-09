import mongoose,{Schema} from "mongoose";
export interface IWithdraw  {
    address: string;
    amount:number;
    ip: string;
    confirm: string;
    description:string,
    txid: string;
    author: Schema.Types.ObjectId;
}
export type WithdrawDocument = mongoose.Document & IWithdraw


const WithdrawSchema = new mongoose.Schema<WithdrawDocument>(
    {
        address: { type: String },
        amount: Number,
        ip: String,
        description:String,
        confirm: String,
        txid: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);



export const Withdraw = mongoose.model<WithdrawDocument>("Withdraw", WithdrawSchema);
