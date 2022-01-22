import { gql } from "apollo-server-express";

export default gql`
  
    type balanceAccount {
        name: String,
        ip: String,
        startAt:Int,
    }

    type Transaction{
        account:String,
        address:String,
        category: String
        amount: Float,
        fee:Float,
        label: String,
        vout: Int
        confirmations: Int,
        instantlock: Boolean,
        instantlock_internal: Boolean,
        chainlock: Boolean,
        blockhash: String,
        blockindex: Int,
        comment:String,
        blocktime: Int,
        txid: String,
        walletconflicts:[String],
        time: Int,
        timereceived: Int
    }
   
    type balanceAccount {
        name: String,
        ip: String,
        startAt:Int,
    }
    type balance{
        balance:Float,
        received:Float
        rewarded:Float
    }
    type InfoRTM {
    walletversion:Int,
    balance:Float,
    privatesend_balance:Float,
    unconfirmed_balance:Float,
    immature_balance:Int,
    txcount:Int,
    keypoololdest:Int,
    keypoolsize:Float,
    paytxfee: Float,
    keys_left: Int,
     chain:String,
        blocks:Int,
    headers: Int,
    bestblockhash: String,
    difficulty:Float,
    mediantime: Float,
    verificationprogress: Float,
    chainwork: String,
    pruned: Boolean
   
    }
    type accountBalance{
        account:String,
        balance:Float,
        rewarded:Float
    }
    type Query {
        reWardBalancePending:Float
        getBalance:balance
        getBalanceByAddress(address:String!):balance
        transactions(category:String,count:Int,skip:Int):[Transaction]
        listaccounts:[accountBalance]
        lastTxid:String
        getInfoRTM:InfoRTM
    }
`;
