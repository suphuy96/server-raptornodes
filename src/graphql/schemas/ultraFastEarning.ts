import { gql } from "apollo-server-express";

export default gql`
    type participantSmartnode  {
        _idWithdrawWeekly:String,
        smartNode:String,
        exchange:Float,
        time:Date,
        author:Author,
        collateralNew:Float,
        collateralOld:Float,
        txids:[String]
    }
    type UltraFastEarning {
        _id:String!,
        address: String!,
        status:String,
        swap:Boolean,
        inFund:Boolean,
        participants:[participantSmartnode],
        description :String,
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
        ultraFastEarnings:[UltraFastEarning]
    }
    type Mutation {
        createUltraFastEarning(amount:Float!,description:String,tfa:String):UltraFastEarning
    }
`;