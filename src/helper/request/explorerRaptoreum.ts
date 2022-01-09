import axios, {AxiosResponse} from "axios";
const urlApi ="https://explorer.raptoreum.com/api";
// export const getCountSmartNode =():Promise<AxiosResponse>=> {
  // return axios.post( "http://localhost:3456/graphql",{query:"query  { smartnodeCount { total enabled } }"});
// };
export const getMarketcap =():Promise<AxiosResponse>=> {
  return axios.get( urlApi+"/marketcap");
};
export const getTotalLockedCoins =():Promise<AxiosResponse>=> {
  return axios.get( urlApi+"/gettotallockedcoins");
};
