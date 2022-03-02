import { ApolloError } from "apollo-server-express";
import {checkIsAuthen} from "../../util/checkAuthen";
import {Client, Intents,MessageAttachment,CategoryChannel, TextBasedChannel} from "discord.js";


const config = {idChanel:"933749911130882099",pID:"896562206529945661", idBot:"917714938934480906"};
const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES] });
try{
    // const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

    client.on("ready", async() => {
        // console.log(`Logged in as ${client.user.tag}!`);
        // const ch = await client.channels.fetch(config.idChanel);
        // const ms = await ch.messages.fetch({limit:10});
        // ms.forEach((item)=>{
        //     console.log(item);
        // });
    });
    client.on("messageCreate",(message)=>{
        console.log(message);

    });
    client.on("message", (message) => {
        console.log(message.content);

    });

    client.login(process.env.TOKENDISCORD);

}catch (e){
    console.log();
}


 interface UserDiscord{
    id: string
    bot: boolean
    system: boolean
    username: string
    discriminator: string
    avatar: string
    banner: string
    accentColor: string
}
 interface IDiscord {
    channelId: string
    guildId: string
    id: string
    createdTimestamp: string
    type: string
    system: boolean
    content: string
    author: UserDiscord
    pinned: boolean
    embeds: any
    components: any
    attachments: any
    stickers: number
    editedTimestamp: string
    reactions: number
}

const ServiceResolvers = {
    Query: {
        discords: async (__: any, args: any,ctx:any) => {
            try {
                checkIsAuthen(ctx.user);
                const ch :any= await client.channels.fetch(config.idChanel);
                const ms = await ch.messages.fetch({limit:20});
                const ars:any[] =[];
                ms.forEach((item:any)=>{
                    const clone = JSON.parse(JSON.stringify(item));
                    clone.createdAt = item.createdTimestamp;
                    clone.author =  JSON.parse(JSON.stringify(item.author));
                    clone.embeds =  JSON.parse(JSON.stringify(item.embeds));
                    clone.attachments =  JSON.parse(JSON.stringify(item.attachments));
                    ars.unshift(clone);
                    console.log(item.attachments);

                });
                return ars;
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

export default ServiceResolvers;
