import { gql } from "apollo-server-express";

export default gql`
    type WithdrawWeekly {
        _id:String!,
        description :String,
        status:String,
        address:String,
        smartNode:String,
        confirm:Boolean,
        collateralOld:Float,
        author:Author,
        txid:String,
        ultraFastEarning:String,
        amount:Float,
        blockhash:String,
        confirmations:String,
        fee:Float,
        time:Float,
        timereceived:Float,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type withdrawlsInSmartNode {
        count:Int
        amount:Float
    }
    type withdrawWeeklyOnboarding{
        balance:Float,
        withdrawlIsPending:Float,
        weeklyFund:Float,
        availability:Float,
    }
    type Query {
        withdrawWeeklys(smartNode:String,status:String):[WithdrawWeekly]
        withdrawWeeklyOnboardings:withdrawWeeklyOnboarding
    }
    type Mutation {
        createWithdrawWeekly(smartNode:String!,address:String!,amount:Float!,tfa:String):WithdrawWeekly
        updateWithdrawWeekly(_id:String!,status:String,confirm:Boolean,tfa:String):WithdrawWeekly
        confirmWithdrawWeekly(_id:String!,tfa:String):WithdrawWeekly
    }
`;
