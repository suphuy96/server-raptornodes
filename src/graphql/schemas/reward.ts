import { gql } from "apollo-server-express";

export default gql`
    type Reward {
        _id:String!,
        description: String,
        paymentsPerDay: Float,
        feeReward: Float,
        days: Int,
        isSchedule:Boolean,
        dayEnd: Date,
        createdAt:DateTime,
        updatedAt:DateTime
        
    }
    type RewardHistory {
        _id:String!,
        description :String,
        smartNode:String,
        reward:String,
        paymentsPerDay:Float,
        feeReward:Float,
        percentOfNode:Float,
        collateral:Float,
        days:Int,
        isSchedule:Boolean,
        user:Author,
        txid:String,
        amount:Float,
        dayEnd:Float,
        createdAt:DateTime,
        updatedAt:DateTime

    }
    type Query {
        rewards:[Reward]
        rewardHistorys(reward:String):[RewardHistory]
    }
    type Mutation {
        createReward(days:Int,description:String,tfa:String):Reward
    }
`;
