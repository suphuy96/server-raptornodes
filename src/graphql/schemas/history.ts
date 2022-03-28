import { gql } from "apollo-server-express";

export default gql`
    type History  {
        _id:String,
        action:String,
        data:JSON,
        dataOld:JSON,
        author:Author,
        createdAt:DateTime
    }
    type HistoryUser  {
        type:String,
        value:Float,
        time:Float,
    }
 
    type Query {
        historyUsers(time:Float,author:String):[HistoryUser]
        historys(action:String,author:String,createdAt:InputSearchDate,limit:Int,offset:Int):[History]
    }
`;
