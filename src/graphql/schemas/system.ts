import { gql } from "apollo-server-express";

export default gql`
    type settingTemplateMail{
        template:String
        label:String
        cc:[String]
        enable:Boolean
    }
    input inputSettingTemplateMail{
        template:String
        label:String
        cc:[String]
        enable:Boolean
    }

    type System {
        _id:String,
        enableWithdraw: Boolean,
        testNet: Boolean,
        collateral: Float,
        collateralMin: Float,
        paymentsPerDay:Float,
        withdrawWeekly: Boolean,
        withdrawWeeklyConfirm: Boolean,
        withdrawWeeklyMinimum: Int,
        withdrawWeeklyScheduleTime: String,
        weeklyFund:Float,
        feeReward:Float,
        scheduleTime:String,
        scheduleDay:String,
        scheduleValue:Float,
        mailWellcome: settingTemplateMail,
        mailNewSession: settingTemplateMail,
        mailWithdraw: settingTemplateMail,
        mailDespost: settingTemplateMail,
        mailJobSmartNode: settingTemplateMail,
        isMaintenance:Boolean,
        missingReward:Boolean,
        timeMissingReward: Date,
        mailTfa: settingTemplateMail,
        mailReward: settingTemplateMail,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type VariableSystem {
        _id:String,
        collateral:Float,
        collateralMin:Float,
        withdrawWeekly:Boolean,
        withdrawWeeklyConfirm:Boolean,
        withdrawWeeklyMinimum:Float,
        withdrawWeeklyScheduleTime:String,
        weeklyFund:Float,
        enableWithdraw: Boolean,
        paymentsPerDay:Float,
        isMaintenance:Boolean,
        feeReward:Float,
        testNet:Boolean,
        scheduleTime:String,
        scheduleDay:String,
        scheduleValue:Int,
    }
    type RewardRTM {
        rewardAddress:String,
        balance:Float,
        received:Float
    }
    type withdrawlWeeklyRTM {
        address:String,
        balance:Float,
        received:Float,
        withdrawlIsPending:Float,
        withdrawlISPaid:Float,
        withdrawlISPaidCount:Float,withdrawlIsPendingCount:Float
    }
    type Query {
        variableSystem:VariableSystem
        settingSystem:System
        rewardInfo:RewardRTM
        withdrawlWeeklyInfo:withdrawlWeeklyRTM
    }
    type Mutation {
        sendByAccount(tfa:String,address:String!,account:String!,amount:Float!):String
        updateSystem(enableWithdraw: Boolean,    withdrawWeekly: Boolean,
            withdrawWeeklyConfirm: Boolean,
            withdrawWeeklyScheduleTime:String,
            weeklyFund:Float,
            withdrawWeeklyMinimum: Float, scheduleTime:String,scheduleDay:String,scheduleValue:Float,isMaintenance:Boolean,collateralMin:Float,collateral:Float,paymentsPerDay:Float,feeReward:Float,, mailWellcome: inputSettingTemplateMail, mailNewSession: inputSettingTemplateMail, mailWithdraw: inputSettingTemplateMail, mailDespost: inputSettingTemplateMail, mailJobSmartNode: inputSettingTemplateMail, mailTfa: inputSettingTemplateMail, mailReward: inputSettingTemplateMail,tfa:String!):System
    }
`;
