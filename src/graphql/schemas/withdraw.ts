import { gql } from "apollo-server-express";

export default gql`
    type Withdraw {
        _id:String!,
        address: String!,
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
        withdraws:[Withdraw]
    }
    type Mutation {
        createWithdraw(address:String!,amount:Float!,description:String,tfa:String):Withdraw
    }
`;
