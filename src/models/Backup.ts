import mongoose,{Schema} from "mongoose";
export interface IBackup  {
    label: string;
    path: string;
    author: Schema.Types.ObjectId;
}
export type BackupDocument = mongoose.Document & IBackup

const BackupSchema = new mongoose.Schema<BackupDocument>(
    {
        path: { type: String },
        label: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);
export const Backup = mongoose.model<BackupDocument>("Backup", BackupSchema);
