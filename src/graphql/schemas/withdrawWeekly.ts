import { gql } from "apollo-server-express";

export default gql`
    type WithdrawWeekly {
        _id:String!,
        description :String,
        status:Boolean,
        confirm:Boolean,
        author:Author,
        txid:String,
        amount:Float,
        blockhash:String,
        confirmations:String,
        fee:Float,
        time:Float,
        timereceived:Float,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type Query {
        withdrawWeeklys:[WithdrawWeekly]
    }
    type Mutation {
        createWithdrawWeekly(address:String!,amount:Float!,tfa:String):WithdrawWeekly
        updateWithdrawWeekly(_id:String!,tfa:String):WithdrawWeekly
        confirmWithdrawWeekly(_id:String!,tfa:String):WithdrawWeekly
    }
`;
