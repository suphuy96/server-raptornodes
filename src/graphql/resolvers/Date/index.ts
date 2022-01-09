import { GraphQLScalarType , GraphQLError} from "graphql";
import { Kind }  from "graphql/language";
import moment  from "moment";
export default {
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Date custom scalar type by huyquansu",
        parseValue(value:any) {
            console.log("vaof daya");
            const d = new Date(Date.parse(value));
            return d; // value from the client
        },
        serialize(value:any) {
            console.log("vaof daya");
            return moment(value, "DD/MM/YYYY").format("DD/MM/YYYY");
        },
        parseLiteral(ast:any) {
            console.log("vaof daya");
            const date =  new Date(Date.parse(ast.value));
            if (date.toString()==="Invalid Date"){
                throw new GraphQLError("Không thể format Date");
            }
            return date; // ast value is always in string format
        },
    }),
    DateTime: new GraphQLScalarType({
        name: "DateTime",
        description: "Date custom scalar type by huyquansu",
        parseValue(value:any) {
            return new Date(value); // value from the client
        },
        serialize(value:any) {
            return moment(value).format("DD/MM/YYYY HH:mm:ss");
        },
        parseLiteral(ast:any) {
            const date = new Date(ast.value);
            if (date.toString()==="Invalid Date"){
                throw new GraphQLError("Không thể format Date");
            }
            return date; // ast value is always in string format
        },
    }),
    Time: new GraphQLScalarType({
        name: "Time",
        description: "Date custom scalar type by huyquansu",
        parseValue(value:any) {
            return new Date(value); // value from the client
        },
        serialize(value:any) {
            return value; // value sent to the client
        },
        parseLiteral(ast:any) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
};
