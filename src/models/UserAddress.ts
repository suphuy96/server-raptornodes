import mongoose, {Schema} from "mongoose";

export type UserAddressDocument = mongoose.Document & {
    label: string;
    address: string;
    author: Schema.Types.ObjectId;
};


const userAddressSchema = new mongoose.Schema<UserAddressDocument>(
    {
        address: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
        label: String,
    },
    { timestamps: true },
);



export const UserAddress = mongoose.model<UserAddressDocument>("UserAddress", userAddressSchema);
