import { gql } from "apollo-server-express";

export default gql`
    type Backup {
        _id:String!,
        label: String!,
        path: String!,
        author:Author,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type Query {
        backups:[Backup]
    }
    type Mutation {
        deleteBackup(_id:String!):Backup
        reStore(_id:String!):Backup
        createBackup(label:String!):Backup
    }
`;
