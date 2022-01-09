import { gql } from "apollo-server-express";

export default gql`
    type Faq {
        _id:String!,
        label: String!,
        answer: String!,
        author:Author,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type Query {
        faqs:[Faq]
    }
    type Mutation {
        updateFaq(_id:String,answer:String,label:String):Faq
        deleteFaq(_id:String!):Faq
        createFaq(answer:String!,label:String!):Faq
    }
`;
