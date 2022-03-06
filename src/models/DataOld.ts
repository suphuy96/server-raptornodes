import mongoose,{Schema} from "mongoose";
export interface IDataOld  {
    discordId:string;
    done?:boolean;
    discordName: string;
    address:string;
    collateral:number;
    percentOfNode:number;
    RTMRewards:number;
    pendingRTMRewards:number;
    smartNode:string;
}
export type DataOldDocument = mongoose.Document & IDataOld


const DataOldSchema = new mongoose.Schema<DataOldDocument>(
    {
        discordId: String,
        done:Boolean,
        discordName: String,
        address: String,
        collateral:Number,
        percentOfNode:Number,
        RTMRewards:Number,
        pendingRTMRewards:Number,
        smartNode:String,
    },
    { timestamps: true },
);


export const DataOld = mongoose.model<DataOldDocument>("DataOld", DataOldSchema);
