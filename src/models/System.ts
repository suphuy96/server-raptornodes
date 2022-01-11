import mongoose,{Schema} from "mongoose";
export interface settingTemplateMail{
    template:string
    label:string
    cc:[string]
    enable:boolean
}
export interface ISystem  {
    enableWithdraw: boolean;
    testNet?: boolean;
    collateral: number;
    collateralMin: number;
    paymentsPerDay:number;
    feeReward:number;
    scheduleTime:string,
    scheduleDay:string,
    scheduleValue:number,
    rewardAddress:string,
    mailWellcome: settingTemplateMail;
    mailNewSession: settingTemplateMail;
    mailWithdraw: settingTemplateMail;
    mailDespost: settingTemplateMail;
    mailJobSmartNode: settingTemplateMail;
    mailTfa: settingTemplateMail;
    mailReward: settingTemplateMail;
}
export type SystemDocument = mongoose.Document & ISystem
const templateSetting = {
    template:String,
    label:String,
    cc:[String],
    enable:Boolean
};

const SystemSchema = new mongoose.Schema<SystemDocument>(
    {
        enableWithdraw: Boolean,
        collateral:Number,
        collateralMin: Number,
        paymentsPerDay:Number,
        rewardAddress:String,
        feeReward:Number,
        scheduleTime:String,
        scheduleDay:String,
        scheduleValue:Number,
        mailWellcome: templateSetting,
        mailNewSession: templateSetting,
        mailWithdraw: templateSetting,
        mailDespost: templateSetting,
        mailJobSmartNode: templateSetting,
        mailTfa: templateSetting,
        mailReward: templateSetting,
    },
    { timestamps: true },
);


export const System = mongoose.model<SystemDocument>("System", SystemSchema);
