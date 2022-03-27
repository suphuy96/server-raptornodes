import { gql } from "apollo-server-express";

export default gql`
    type participant {
        userId:Author,
        collateral:Float,
        percentOfNode:Float,
        exchange:Float,
        RTMRewards:Float,
        pendingRTMRewards:Float,
        txids:[String],
        source:String,
        time:Date
    }
    type UtxosNextReward {
    address: String,
    txid: String,
    outputIndex: Int,
    script: String,
    satoshis: Float,
    height: Float,
    time:DateTime,
    isNomal:Boolean
    }
    type smartNode {
        _id:String,
    proTxHash: String,
        address: String,
        label: String,
        ipAddress: String,
        privateAddress: String,
        privateAccount: String,
        balance:Float,
        private: Boolean,
        statusCollateral: String,
        collateral: Float,
        participants:[participant],
        yourParticipant:participant,
        showParticipants:Boolean,
        lastReward:DateTime,
        timeStartReward:DateTime,
        heightStartReward: Int,
        lastHeightReward:Int,
        totalMatureInNextReward:Float,
        totalImMatureInNextReward:Float,
        utxosNextReward:[UtxosNextReward]
        createdAt:DateTime,
        updatedAt:DateTime
    payee: String,
    status: String,
    lastpaidtime: Int,
    lastpaidblock: Int,
        owneraddress: String,
        votingaddress: String,
        collateraladdress: String,
        pubkeyoperator: String
    }
    type countSN{
    total: Int,
    enabled: Int
    }
    type StatisticalNodes{
        count: Float,
        participant:participant
        collateral: Float
        smartnodes:smartNode
    }
    type Statistical{
        statisticalNodes:[StatisticalNodes]
        rewardCount: Float
        rewardAmount: Float
    }
    type InforReward{
        _id:String,
        proTxHash: String,
        address: String,
        ipAddress: String,
        payee: String,
        status: String,
    }
    input inputParticipant {
        userId:String!,
        collateral:Float!,
        percentOfNode:Float,
        exchange:Float,
        txids:[String],
        source:String,
        time:Date
    }
    input inputBalanceNode {
        _id:String!,
        participants:inputParticipant!
    }
    type Query {
        smartnodeCount:countSN
        myNodes:[smartNode]
        getSmartNodes:[smartNode]
        inforRewardSmartNodes:InforReward
        smartNodes(statusCollateral:String):[smartNode]
        smartNodeEnough:smartNode
        statisticalUser(user:String!):Statistical
    }
    type Mutation {
        createSmartNode(label:String!,ipAddress:String,private:Boolean,showParticipants:Boolean,statusCollateral:String,collateral:Float):smartNode
        updateSmartNode(_id:String!,tfa:String,label:String,ipAddress:String,lastHeightReward:Int,private:Boolean,showParticipants:Boolean,statusCollateral:String,collateral:Float):smartNode
        withdrawEnoughSmartNode(_id:String!,amount:Float!,address:String!,tfa:String):smartNode
        deleteSmartNode(_id:String!):Boolean
        joinSmartNode(_id:String,amount:Float, token:String):smartNode
        deleteParticipantSmartNode(_id:String!,userId:String,collateral:Float!,fullName:String,isManual:Boolean,addressReward:String,txid:String,tfa:String):smartNode
        addParticipantSmartNode(_id:String!,userId:String,collateral:Float!,fullName:String,isManual:Boolean,addressReward:String,txid:String,tfa:String):smartNode
        widthDrawlSmartNode(_id:String!, token:String):Boolean
        balanceNodes(tfa:String,collateral:Float, participantsInNodes:[inputBalanceNode]):Boolean
    }
`;

