import { gql } from "apollo-server-express";

export default gql`
    type participantInUFE  {
        time:Date,
        author:Author,
        ultraFastEarnings:[String],
        txids:[String],
        amount:Float
    }
    type DataUltraFastEarning {
        _id:String!,
        status:String,
        participants:[participantInUFE],
        description :String,
        amount:Float,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    input inputParticipantInUFE  {
        time:Date,
        author:String,
        ultraFastEarnings:[String],
        txids:[String]
    }
    type Query {
        dataUltraFastEarning:DataUltraFastEarning
        dataUltraFastEarningMe:[participantInUFE]
    }
    type Mutation {
        updateDataUltraFastEarning(participants:inputParticipantInUFE,description:String,tfa:String):DataUltraFastEarning
    }
`;
