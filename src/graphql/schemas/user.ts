import { gql } from "apollo-server-express";

export default gql`
    type Profile {
    name: String,
    discordName:String,
    discordAvatar:String,
    location: String,
    website: String,
    picture: String,
    rules: String,
    enableTfa:Boolean
}
    type Author {
        _id:String,
        username: String,
        email: String,   name: String,
        discordName:String,
        discordAvatar:String,
        location: String,
        website: String,
        picture: String,
        discord:String,
        profile: Profile
    }
    type User {
        _id:String,
        username: String,
        email: String,
        addressRTM:String,
        discord:String,
        profile: Profile,
        rules: String,
        balance:Float,
        collateral:Float,
        portfolio:Float,
        status:Boolean,
        enableTfa:Boolean,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type Query {
        me:User
        users: [User]
    }
    type Mutation {
        updateUser(_id:String,discord:String,enableTfa:Boolean,status:Boolean,tfa:String):User
        removeUser(_id:String,tfa:String):Boolean
    }
`;
