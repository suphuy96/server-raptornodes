import { gql } from "apollo-server-express";

export default gql`
    type UserAddress {
        _id:String,
        label: String,
        address: String,
        author:Author,
    }
    type Query {
        userAddresss:[UserAddress]
    }
    type Mutation {
        updateUserAddress(_id:String!,address:String,label:String):UserAddress
        createUserAddress(address:String!,label:String):UserAddress
        deleteUserAddress(_id:String!):UserAddress
    }
`;
