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
        mailWellcome: settingTemplateMail,
        mailNewSession: settingTemplateMail,
        mailWithdraw: settingTemplateMail,
        mailDespost: settingTemplateMail,
        mailJobSmartNode: settingTemplateMail,
        mailTfa: settingTemplateMail,
        mailReward: settingTemplateMail,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type VariableSystem {
        _id:String,
        collateral:Float,
        collateralMin:Float,
        enableWithdraw: Boolean,
        testNet:Boolean
    }
    type RewardRTM {
        rewardAddress:String,
        balance:String,
    }
  
    type Query {
        variableSystem:VariableSystem
        settingSystem:System
        rewardInfo:RewardRTM
    }
    type Mutation {
        updateSystem(enableWithdraw: Boolean,collateralMin:Float,collateral:Float, mailWellcome: inputSettingTemplateMail, mailNewSession: inputSettingTemplateMail, mailWithdraw: inputSettingTemplateMail, mailDespost: inputSettingTemplateMail, mailJobSmartNode: inputSettingTemplateMail, mailTfa: inputSettingTemplateMail, mailReward: inputSettingTemplateMail,tfa:String!):System
    }
`;
