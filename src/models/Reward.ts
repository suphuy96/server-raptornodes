import mongoose,{Schema} from "mongoose";
export interface IDataOld  {
    description:string,
    smartNode:string;
}
export type DataOldDocument = mongoose.Document & IDataOld


const DataOldSchema = new mongoose.Schema<DataOldDocument>(
    {
        description:String,
        smartNode: String
    },
    { timestamps: true },
);


export const DataOld = mongoose.model<DataOldDocument>("DataOld", DataOldSchema);
