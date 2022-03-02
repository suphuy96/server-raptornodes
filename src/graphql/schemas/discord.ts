import { gql } from "apollo-server-express";

export default gql`
    type UserDiscord{
    id: String
    bot: Boolean
    system: Boolean
    username: String
    discriminator: String
    avatar: String
    banner: String
    accentColor: String
    }
    type MessageFooter {
        text: String
     icon_url: String
       }

    type MessageAuthor {
         name:String
       url:String
         icon_url: String
        },
    type MessageEmbed {
    type: String
    title: String
    description:String
    url:String
    color: String
    timestamp: DateTime
    fields: [String]
    thumbnail: String
    image: String
    video: String
    provider: String
        footer: MessageFooter
        author:MessageAuthor
    }
    type MessageAttachment{
        attachment  :String
     id: String
   url: String
   height: Int
   width: Int
   contentType: String
     description:String
    }
    type Discord {
        channelId: String
        guildId: String
        id: String
        createdAt:DateTime
        createdTimestamp: Float
        type: String
        system: Boolean
        content: String
        author: UserDiscord 
    pinned: Boolean
    embeds: [MessageEmbed]
    components: [String]
    attachments: [MessageAttachment]
    stickers: Int
    editedTimestamp: DateTime
    reactions: Int
    }
    type Query {
        discords:[Discord]
    }
`;
