import { gql } from "apollo-server-express";

export default gql`
  
    type Tfa {
        tempSecret: String,
        dataURL:String,
        tfaURL: String,
        enable:Boolean
    }
    type Mutation {
        setupTfa: Tfa,
        getTfa:Tfa
        verifyTfa(token:String!,enable:Boolean):Boolean
    }
`;
