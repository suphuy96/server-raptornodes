import {mongo} from "mongoose";

export default  {
    _id: new mongo.ObjectId(),
    enableWithdraw: true,
    testnet: true,
    collateral: 1500000,
    mailWellcome: {
        label:"Wellcome to raptornodes.com",
        template:"Wellcome to raptornodes.com\",Hello {{name}},Thank you for trusting us.",
        cc: new Array(0),
        enable:true
    },
    mailNewSession:  {
        label:"you have new Session login raptornodes.com",
        template:"Hey {{name}}, you have new Session login raptornodes.com",
        cc: new Array(0),
        enable:true
    },
    mailWithdraw:  {
        label:"you have new Withdraw in raptornodes.com",
        template:"you have new Withdraw in raptornodes.com {{name}}",
        cc: new Array(0),
        enable:true
    },
    mailDespost:   {
        label:"you have new despost in raptornodes.com",
        template:"Hey {{name}}, you have new despost in raptornodes.com",
        cc: new Array(0),
        enable:true
    },
    mailJobSmartNode:   {
        label:"you have new JobSmartNode in raptornodes.com",
        template:"Hey {{name}}you have new JobSmartNode in raptornodes.com",
        cc: new Array(0),
        enable:true
    },
    mailTfa: {
        label:"you enable Tfa in raptornodes.com",
        template:"Hey {{name}} you enable Tfa in raptornodes.com",
        cc: new Array(0),
        enable:true
    },
    mailReward: {
        label:"you got Reward in raptornodes.com",
        template:"Hey {{name}} you got Reward in raptornodes.com",
        cc: new Array(0),
        enable:true
    },
    createdAt:new Date(),
    updatedAt:new Date()
};
