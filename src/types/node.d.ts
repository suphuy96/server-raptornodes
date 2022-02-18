
interface settingTemplateMail{
    template:string
    label:string
    cc:any[]
    enable:boolean
}
 interface ISystem  {
    _id?:any;
     enableWithdraw: boolean;
     testNet?: boolean;
     collateral: number;
     rewardAddress?:string,
     rewardAccount?:string,
     withdrawlWeekly?:boolean,
     withdrawlWeeklyMinimum?:number,
     withdrawWeeklyConfirm?:boolean,
     withdrawlWeeklyScheduleTime?:string,
     withdrawWeeklyAddress?:string,
     withdrawlWeeklyAccount?:string,
     weeklyFund?:number,
     paymentsPerDay:number,
     feeReward:number,
     scheduleTime:string,
     scheduleDay:string,
     scheduleValue:number,
     isMaintenance?:boolean;
    mailWellcome: settingTemplateMail;
    mailNewSession: settingTemplateMail;
    mailWithdraw: settingTemplateMail;
    mailDespost: settingTemplateMail;
    mailJobSmartNode: settingTemplateMail;
    mailTfa: settingTemplateMail;
    mailReward: settingTemplateMail;
     createdAt?:any;
     updatedAt?:any;
}
declare namespace NodeJS{
    interface Global {
        settingSystem: ISystem
    }
}
