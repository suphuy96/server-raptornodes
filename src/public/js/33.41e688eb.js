"use strict";(self["webpackChunkRaptorNodes"]=self["webpackChunkRaptorNodes"]||[]).push([[33],{7033:(e,o,t)=>{t.r(o),t.d(o,{default:()=>w});var n=t(3673);const a={style:{"flex-direction":"column",display:"flex","padding-top":"80px"},class:"items-center"},s=(0,n._)("p",{style:{color:"red"},class:"font-s16"},"Previous raptornodes USER?",-1),l=(0,n._)("p",{style:{color:"red","text-align":"center"},class:"font-s16"},"You need to login with Discord auth to see your old balance",-1),r=(0,n.Uk)(" Login with Google "),c=(0,n._)("p",{style:{"margin-top":"80px",padding:"0px 20px"},class:"text-center"}," By logging in, you will able to see your personal payments, manage your payout addresses, see pending rewards and more. ",-1);function i(e,o,t,i,g,d){const p=(0,n.up)("q-btn"),u=(0,n.up)("q-page");return(0,n.wg)(),(0,n.j4)(u,{class:"row items-center",style:{"flex-direction":"column"}},{default:(0,n.w5)((()=>[(0,n._)("div",a,[s,l,(0,n.Wm)(p,{onClick:e.redirectLogin,style:{padding:"20px"},size:"1.4em","dark-percentage":"",class:"shadow-2 bg-white text-black",icon:"eva-google-outline"},{default:(0,n.w5)((()=>[r])),_:1},8,["onClick"]),c])])),_:1})}var g=t(3515),d=t(9582);const p=(0,n.aZ)({name:"LoginPage",setup(){const e=(0,d.tv)(),o=()=>{e.push({path:"dashboard"}).then((e=>{console.log(e)}))};return{goMain:o}},methods:{redirectLogin(){console.log(location.href),location.href=g.Z.isDev?"http://localhost:3456/auth/google?checkauthen=1":location.origin+"/auth/google"}},async created(){const e=new URLSearchParams(location.hash.replace("#/login?",""));console.log(e),e.get("token")&&(console.log("Có token",e.get("token")),localStorage.setItem("token",e.get("token")||""),await this.$store.dispatch("user/getInfo"),this.goMain())}});var u=t(4260),h=t(4379),k=t(2165),m=t(7518),y=t.n(m);const f=(0,u.Z)(p,[["render",i]]),w=f;y()(p,"components",{QPage:h.Z,QBtn:k.Z})}}]);