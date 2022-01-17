import mongoose,{Schema} from "mongoose";
import {IUser, UserDocument} from "./User";
export interface Iparticipant{
    userId: UserDocument ;
    collateral:number;
    percentOfNode:number;
    RTMRewards:number;
    pendingRTMRewards:number;
    txids:any[];
    time:Date;
}
export interface ISmartNode {
    label: string;
    ipAddress: string;
    statusCollateral: string,
    privateAddress:string,
    privateAccount:string,
    private: boolean,
    collateral: number,
    participants:Iparticipant[];
    showParticipants:boolean;
    lastReward:Date,
    timeStartReward:Date,
}
export type SmartNodeDocument = mongoose.Document & ISmartNode

const participantType = {
    userId:{ type: Schema.Types.ObjectId, ref: "User" },
    collateral:Number,
    percentOfNode:Number,
    RTMRewards:Number,
    pendingRTMRewards:Number,
    txids:[String],
    time:Date
};
const SmartNodeSchema = new mongoose.Schema<SmartNodeDocument>(
    {
        label: {type:String,unique:true},
        ipAddress: String,
        statusCollateral: {type:String,default:""},
        private: {type:Boolean,default:false},
        privateAddress:String,
        privateAccount:String,
        collateral:Number,
        lastReward:Date,
        timeStartReward:Date,
        participants:{type:[participantType],default:[]},
        showParticipants:{type:Boolean,default:false}
    },
    { timestamps: true },
);

export const SmartNode = mongoose.model<SmartNodeDocument>("SmartNode", SmartNodeSchema);
