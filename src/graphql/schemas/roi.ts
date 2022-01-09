import { gql } from "apollo-server-express";

export default gql`
  
    type Roi {
        name: String,
        ip: String,
        startAt:Int,
    }
    type Query {
        getRoi:Roi
        getAllRoi: [Roi]
    }
`;
