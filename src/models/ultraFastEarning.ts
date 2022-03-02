import mongoose,{Schema} from "mongoose";
export interface IUltraFastEarning  {
    address: string;
    amount:number;
    description:string,
    txid: string;
    status:string;
    swap:boolean;
    inFund:boolean;
    participants:any[];
    author: Schema.Types.ObjectId;
}
export type UltraFastEarningDocument = mongoose.Document & IUltraFastEarning


const UltraFastEarningSchema = new mongoose.Schema<UltraFastEarningDocument>(
    {
        amount: Number,
        address: String,
        description:String,
        txid: String,
        swap: Boolean,
        inFund: Boolean,
        status:String,
        participants: Array,
        author: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);



export const UltraFastEarning = mongoose.model<UltraFastEarningDocument>("UltraFastEarning", UltraFastEarningSchema);
