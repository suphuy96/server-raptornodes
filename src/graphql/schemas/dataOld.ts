import { gql } from "apollo-server-express";

export default gql`
    input inputDataOld{
        discordId:String!,
        discordName:String,
        address:String,
        collateral:Float,
        percentOfNode:Float,
        RTMRewards:Float,
        pendingRTMRewards:Float,
        smartNode:String
    }
    type DataOld {
        _id:String!,
        discordId: String!,
        discordName: String,
        address:String,
        collateral:Float,
        percentOfNode:Float,
        RTMRewards:Float,
        pendingRTMRewards:Float,
        smartNode:String,
    }
    type Query {
        dataOlds:[DataOld]
    }
   
    type Mutation {
        updateDataOld(_id:String,discordId:String,discordName:String,address:String,collateral:Float,percentOfNode:Float,RTMRewards:Float,pendingRTMRewards:Float,smartNode:String):DataOld
        deleteDataOld(_id:String!):DataOld
        createDataOld(discordId:String!,discordName:String,address:String,collateral:Float,percentOfNode:Float,RTMRewards:Float,pendingRTMRewards:Float,smartNode:String):DataOld
        importDataOld(dataOlds:[inputDataOld]!,importNow:Boolean):Boolean
    }
`;
