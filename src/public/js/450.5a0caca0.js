"use strict";(self["webpackChunkRaptorNodes"]=self["webpackChunkRaptorNodes"]||[]).push([[450],{7435:(e,t,o)=>{o.r(t),o.d(t,{default:()=>H});var a=o(3673),c=o(2323),n=o(4618),s=o.n(n);const l={class:"row col-12 flex flex-center",style:{"flex-direction":"column","justify-content":"center"}},r=(0,a._)("p",{style:{"font-size":"2.8em"}},"SmartNode Hosting ",-1),i=(0,a._)("p",{class:"text-h7"},"Shared and Private Nodes",-1),p=(0,a._)("p",{class:"text-h7"},"Earn Passive icome with your Raptoreum (RTM)",-1),d=(0,a._)("p",{class:"text-h7 text-center"},"We host the hardware - We maintain the nodes - YOU EARN REWARDS!",-1),m={class:"row col-12 q-mt-md info-raptor-home"},f={class:"col-12 col-lg-3 col-md-6 col-sm-12 text-center"},u=(0,a._)("p",{class:"text-amber fixmg"},"Price",-1),g={class:"fixmg"},h={class:"col-12 col-lg-3 col-md-6 col-sm-12 text-center"},x=(0,a._)("p",{class:"text-amber fixmg"},"Smartnode Count",-1),y={key:0,class:"fixmg"},k={key:1,class:"fixmg"},_={class:"col-12 col-lg-3 col-md-6 col-sm-12 text-center"},b=(0,a._)("p",{class:"text-amber fixmg"},"Market Cap",-1),C={class:"fixmg"},w={class:"col-12 col-lg-3 col-md-6 col-sm-12 text-center"},v=(0,a._)("p",{class:"text-amber fixmg"},"Locked by SmartNodes",-1),R={class:"fixmg fixmg"};function P(e,t,o,n,P,L){const q=(0,a.up)("q-img"),j=(0,a.up)("q-btn"),z=(0,a.up)("q-page");return(0,a.wg)(),(0,a.j4)(z,{class:"row q-pa-lg"},{default:(0,a.w5)((()=>[(0,a._)("div",l,[(0,a.Wm)(q,{class:"logo-raptornodes",src:s(),style:{"margin-top":"20px"}}),r,i,p,d,(0,a.Wm)(j,{label:"JOIN NOW",class:"custom-btn","dark-percentage":"",size:"1.6em",onClick:e.goLogin},null,8,["onClick"])]),(0,a._)("div",m,[(0,a._)("div",f,[u,(0,a._)("p",g,[(0,a.Uk)("$"+(0,c.zw)(e.marketCap.current_price)+" USD ",1),(0,a._)("span",{style:(0,c.j5)("color:"+(e.marketCap.price_change_percentage_24h<0?"red":"#fff"))},(0,c.zw)(e.marketCap.price_change_percentage_24h.toFixed(2))+"%",5)])]),(0,a._)("div",h,[x,e.count?((0,a.wg)(),(0,a.iD)("p",y,(0,c.zw)(e.count.enabled)+"/"+(0,c.zw)(e.count.total),1)):((0,a.wg)(),(0,a.iD)("p",k,"Loading..."))]),(0,a._)("div",_,[b,(0,a._)("p",C,"$"+(0,c.zw)(e.formatPrice(e.marketCap.market_cap)),1)]),(0,a._)("div",w,[v,(0,a._)("p",R,(0,c.zw)(e.totalLockedCoins),1)])])])),_:1})}var L=o(9582),q=o(5181),j=o(4250),z=o(9968);const N=z.Ps`
  query  {
    totalLockedCoins
    smartnodeCount {
    total enabled
  }
  }
`;z.Ps`
  query  {
    getBalance{
      received
      balance
    }
    totalLockedCoins
    smartnodeCount {
      total enabled
    }
  }
`;var O,Z,S=o(5777),W=o(6839),D=o(4756),I=function(e,t,o,a){var c,n=arguments.length,s=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,o):a;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)s=Reflect.decorate(e,t,o,a);else for(var l=e.length-1;l>=0;l--)(c=e[l])&&(s=(n<3?c(s):n>3?c(t,o,s):c(t,o))||s);return n>3&&s&&Object.defineProperty(t,o,s),s},M=function(e,t){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(e,t)};let E=class extends S.w3{marketCap;me;formatPrice=j.T;currentPrice=0;count={total:0,enabled:0};totalLockedCoins="Loading...";setup(){const e=(0,L.tv)(),t=()=>{e.push({path:"login"}).then((e=>{console.log(e)}))};return{goLogin:t}}async created(){this.$store.dispatch("balance/fetchGetMarketCap").then((()=>{console.log("thuwr")}));const e=await this.$apollo.query({query:N});console.log("graphql",e),this.count={total:parseInt(e.data.smartnodeCount.total),enabled:parseInt(e.data.smartnodeCount.enabled)},this.totalLockedCoins=e.data.totalLockedCoins}};I([(0,q.ZM)((e=>e.balance.market)),M("design:type","function"===typeof(O="undefined"!==typeof W.Z&&W.Z)?O:Object)],E.prototype,"marketCap",void 0),I([(0,q.ZM)((e=>e.user.me)),M("design:type","function"===typeof(Z="undefined"!==typeof D.e&&D.e)?Z:Object)],E.prototype,"me",void 0),E=I([(0,S.Ei)({name:"PageIndex",components:{}})],E);const $=E;var Q=o(4260),U=o(4379),A=o(4027),B=o(2165),T=o(7518),F=o.n(T);const G=(0,Q.Z)($,[["render",P]]),H=G;F()($,"components",{QPage:U.Z,QImg:A.Z,QBtn:B.Z})}}]);