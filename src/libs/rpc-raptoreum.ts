import axios, {AxiosResponse, ResponseType} from "axios";
export interface OptionRpcClient {
    host ? : string;
    port ? : number;
    user: string;
    pass: string;
    protocol ? : string;
    disableAgent ? : boolean;
    queueSize: number;
    jsonrpc ? : string;
    log ? : any;
}
interface OptionRequestJsonRpc {
    timeout ? : number;
}
interface OptionGetAddressDeltas {
    addresses:string[]
    start ? : number;
    end ? : number;
}
export default class RpcRaptoreum {
    host ? : string;
    port ? : number;
    user: string;
    pass: string;
    protocol ? : string;
    disableAgent ? : boolean;
    queueSize: number;
    batchedCalls: any[];
    rejectUnauthorized: boolean;
    log: any;
    urlRPC: string;
    jsonrpc: string;
    constructor(opts: OptionRpcClient) {
        this.host = opts.host || "127.0.0.1";
        this.port = opts.port || 9998;
        this.user = opts.user || "user";
        this.pass = opts.pass || "pass";
        this.protocol = opts.protocol === "https" ? "https" : "http";
        this.batchedCalls = null;
        this.disableAgent = opts.disableAgent || false;
        const queueSize = opts.queueSize || 16;
        this.rejectUnauthorized = true;
        this.log = opts.log;
        this.jsonrpc = opts.jsonrpc || "2.0";
        this.urlRPC = `${this.protocol}://${this.host}${this.port && this.port !== 443 ? `:${this.port}` : ""}`;


    }
    requestJsonRpcCallBack(method: string, params: any, options: OptionRequestJsonRpc = {}):Promise<AxiosResponse<any>> {
        const payload = {
            jsonrpc:this.jsonrpc,
            method,
            params,
            id: 1,
        };
        if (payload.method) {
            payload.method = payload.method.toLowerCase();
        }
           return axios.post(
                this.urlRPC,
                payload, {
                    timeout: options.timeout,
                    auth: {
                        username: this.user,
                        password: this.pass
                    }
                },
            );
    }
    requestJsonRpc(method: string, params: any, options: OptionRequestJsonRpc = {}):Promise<any> {
        const payload = {
            jsonrpc:this.jsonrpc,
            method,
            params,
            id: 1,
        };
        if (payload.method) {
            payload.method = payload.method.toLowerCase();
        }
        return new Promise<any>((resolve,reject)=>{
            this.requestJsonRpcCallBack(method,params,options).then((response)=>{
                if (response.status !== 200) {
                    reject(response);
                }
                resolve(response.data.result);
            }).catch((error)=>{
                console.log("rpc error");
                console.log(error,error.toJSON());
                if(error.code==="ECONNREFUSED"){
                    reject(new Error("Không thể kết nối tới RPC raptoreum"));
                }
                if(error.response && error.response.data){
                    console.log(error.response.data);
                    const message = error.response.data.error?error.response.data.error.message:JSON.stringify(error.response.data.error);
                    reject(new Error(message));

                }
                reject(error);
            });
        });

    }
    getWalletInfo(opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getWalletInfo",null,opts);
    }
    getAddressesByAccount(params:string,opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getaddressesbyaccount",[params],opts);
    }
    getAccountAddress(params:string,opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getaccountaddress",[params],opts);
    }
    getAccount(params:string,opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getaccount",params,opts);
    }

    getAddressDeltas(params:{addresses:string[],start ? : number,end ? : number;}[],opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getaddressdeltas",params,opts);
    }
    getAddressBalance(address:string,opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getaddressbalance",[{addresses:[address||""]}],opts);
    }
    getbalance(account:string,opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getbalance",[account],opts);
    }

    getreceivedbyaccount(account:string,opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("getreceivedbyaccount",[account],opts);
    }
    listAccounts(opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("listaccounts",null,opts);
    }
    sendFrom(params:{account:string,address:string,amount:number,comment:string,comment_to:string},opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("sendfrom",[params.account,params.address,(params.amount),6,false,params.comment,params.comment_to],opts);
    }
//    smartnode info
    smartnode(params:string,opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("smartnode",params,opts);
    }
    smartnodeCount(opts?:OptionRequestJsonRpc):Promise<{total:number,enabled:number}>{
        return this.requestJsonRpc("smartnode",["count"],opts);
    }
    smartnodelist(opts?:OptionRequestJsonRpc):Promise<{total:number,enabled:number}>{
        return this.requestJsonRpc("smartnodelist",null,opts);
    }
    getaddresstxids(account:string,opts?:OptionRequestJsonRpc):Promise<{total:number,enabled:number}>{
        return this.requestJsonRpc("listtransactions", [account],opts);
    }
    listtransactions(params:any, opts?:OptionRequestJsonRpc):Promise<any[]>{
        return this.requestJsonRpc("listtransactions",params,opts);
    }
    listaddressbalances( opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("listaddressbalances",null,opts);
    }
    listaccounts( opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("listaccounts",null,opts);
    }

    listaddressgroupings( opts?:OptionRequestJsonRpc):Promise<any>{
        return this.requestJsonRpc("listaddressgroupings",null,opts);
    }

    getwalletinfo(opts?:OptionRequestJsonRpc):Promise<{
        "walletname": string,
        "walletversion":number,
        "balance":number,
        "privatesend_balance":number,
        "unconfirmed_balance":number,
        "immature_balance":number,
        "txcount":number,
        "keypoololdest":number,
        "keypoolsize":number,
        "paytxfee": number,
        "keys_left": number,
    }>{
        return this.requestJsonRpc("getwalletinfo",null,opts);
    }
    getblockchaininfo(opts?:OptionRequestJsonRpc):Promise<{ "chain": string,
        "blocks": number,
        "headers": number,
        "bestblockhash": string,
        "difficulty":number,
        "mediantime": number,
        "verificationprogress": number,
        "chainwork": string,
        "pruned": boolean,
        "softforks":[],
        "bip9_softforks": any
    }>{
        return this.requestJsonRpc("getblockchaininfo",null,opts);
    }

}
