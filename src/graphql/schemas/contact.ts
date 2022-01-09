import { gql } from "apollo-server-express";

export default gql`
    type Contact {
        _id:String!,
        name: String!,
        email: String!,
        title: String!,
        content: String!,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type Query {
        contacts:[Contact]
    }
    type Mutation {
        deleteContact(_id:String!):Contact
        createContact(name:String!,email:String!,title:String!,content:String!):Contact
    }
`;
