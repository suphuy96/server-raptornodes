import { ApolloError } from "apollo-server-express";
const ServiceResolvers = {
    Query: {
        getRoi: async (__: any, args: any,ctx:any) => {
            try {
                console.log(ctx);
                const mockUsers = [{ name: "xyz" }, { name: "abc" }];
                return mockUsers;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        getAllRoi: async (__: any, args: any,ctx:any) => {
            try {
                console.log(ctx.user);
                const mockUsers = [{ name: "xyz" }, { name: "abc" }];
                return mockUsers;
            } catch (error) {
                throw new ApolloError(error);
            }
        },
    },
};

export default ServiceResolvers;
