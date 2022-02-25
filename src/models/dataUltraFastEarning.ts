import mongoose,{Schema} from "mongoose";
export interface  IparticipantInUFE  {
    time:Date;
        author:any;
        amount:number;
        ultraFastEarnings:[string];
        txids:[string];
}
export interface IDataUltraFastEarning  {
    amount:number;
    description:string,
    status:string;
    participants:IparticipantInUFE[];
}
export type DataUltraFastEarningDocument = mongoose.Document & IDataUltraFastEarning
const participantType = {
    author:{ type: Schema.Types.ObjectId, ref: "User" },
    time:Date,
    txids:[String],
    amount:Number,
    ultraFastEarnings:[String],
};

const DataUltraFastEarningSchema = new mongoose.Schema<DataUltraFastEarningDocument>(
    {
        amount: Number,
        description:String,
        status:String,
        participants:{type:[participantType],default:[]},
    },
    { timestamps: true },
);



export const DataUltraFastEarning = mongoose.model<DataUltraFastEarningDocument>("DataUltraFastEarning", DataUltraFastEarningSchema);
