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
    type Query {
        smartnodeCount:countSN
        myNodes:[smartNode]
        getSmartNodes:[smartNode]
        smartNodes:[smartNode]
        smartNodeEnough:smartNode
    }
    type Mutation {
        createSmartNode(label:String!,ipAddress:String,private:Boolean,showParticipants:Boolean,statusCollateral:String,collateral:Float):smartNode
        updateSmartNode(_id:String!,tfa:String,label:String,ipAddress:String,private:Boolean,showParticipants:Boolean,statusCollateral:String,collateral:Float):smartNode
        withdrawEnoughSmartNode(_id:String!,amount:Float!,address:String!,tfa:String):smartNode
        deleteSmartNode(_id:String!):Boolean
        joinSmartNode(_id:String,amount:Float, token:String):smartNode
        addParticipantSmartNode(_id:String!,userId:String!,collateral:Float!,txid:String,tfa:String):smartNode
        widthDrawlSmartNode(_id:String!, token:String):Boolean
    }
`;

