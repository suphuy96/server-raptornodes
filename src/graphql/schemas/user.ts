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
        autoCompounding:Boolean,
        portfolio:Float,
        status:Boolean,
        enableTfa:Boolean,
        createdAt:DateTime,
        updatedAt:DateTime
    }
    type ReNewVe{
        tfa:Boolean,status:Boolean
    }
    type Query {
        me:User
        users: [User]
    }
    type Mutation {
        newPasswordResetToken(email:String!):Boolean
        newVerificationToken(email:String!):ReNewVe
        verifiForGot(email:String!,password:String!,token:String!):String
        verifiLogin(email:String!,password:String!,token:String!):String
        signupUser(email:String!,password:String!,confirmPassword:String!):User
        updateUser(_id:String,discord:String,enableTfa:Boolean,status:Boolean,tfa:String):User
        updateProfileUser(autoCompounding:Boolean,tfa:String):User
        removeUser(_id:String,tfa:String):Boolean
    }
`;
