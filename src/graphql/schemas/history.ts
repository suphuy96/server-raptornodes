import { gql } from "apollo-server-express";

export default gql`
    type History  {
        _id:String,
        action:String,
        data:JSONObject,
        dataOld:JSONObject,
        author:Author,
        createdAt:DateTime
    }
 
    type Query {
        historys(action:String,author:String,createdAt:InputSearchDate,limit:Int,offset:Int):[History]
    }
`;
