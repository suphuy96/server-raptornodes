(()=>{"use strict";var e={4887:(e,t,a)=>{a(71),a(5363);var r=a(8880),o=a(9592),n=a(3673);function s(e,t,a,r,o,s){const i=(0,n.up)("router-view");return(0,n.wg)(),(0,n.j4)(i)}var i=a(8825);const l=(0,n.aZ)({name:"App",setup(){const e=(0,i.Z)();e.dark.set(!0)}});var c=a(4260);const d=(0,c.Z)(l,[["render",s]]),m=d;var p=a(5984),u=a(7083),h=a(9582);const f=[{path:"/",component:()=>Promise.all([a.e(736),a.e(358)]).then(a.bind(a,2358)),children:[{path:"",component:()=>Promise.all([a.e(736),a.e(64),a.e(450)]).then(a.bind(a,7435))},{path:"roi",name:"roi",component:()=>Promise.all([a.e(736),a.e(64),a.e(370)]).then(a.bind(a,4370))},{path:"plans",name:"plans",component:()=>Promise.all([a.e(736),a.e(64),a.e(72)]).then(a.bind(a,2072))},{path:"networks",name:"networks",component:()=>Promise.all([a.e(736),a.e(653)]).then(a.bind(a,5653))},{path:"contact",name:"contact",component:()=>Promise.all([a.e(736),a.e(64),a.e(16)]).then(a.bind(a,1016))},{path:"faq",name:"faq",component:()=>Promise.all([a.e(736),a.e(64),a.e(681)]).then(a.bind(a,6681))}]},{path:"/",component:()=>Promise.all([a.e(736),a.e(64),a.e(457)]).then(a.bind(a,6457)),children:[{path:"dashboard",name:"dashboard",component:()=>Promise.all([a.e(736),a.e(64),a.e(964)]).then(a.bind(a,9964))},{path:"settings",name:"Settings",component:()=>Promise.all([a.e(736),a.e(64),a.e(554)]).then(a.bind(a,8554))},{path:"wallet",name:"wallet",component:()=>Promise.all([a.e(736),a.e(64),a.e(338)]).then(a.bind(a,2338))},{path:"withdraw",name:"withdraw",component:()=>Promise.all([a.e(736),a.e(64),a.e(669)]).then(a.bind(a,4669))},{path:"roi-calculator",name:"roi-calculator",component:()=>Promise.all([a.e(736),a.e(64),a.e(370)]).then(a.bind(a,4370))},{path:"mynodes",name:"Mynodes",component:()=>Promise.all([a.e(736),a.e(64),a.e(758)]).then(a.bind(a,7758))},{path:"contact-us",name:"contact-us",component:()=>Promise.all([a.e(736),a.e(64),a.e(16)]).then(a.bind(a,1016))}]},{path:"/admin/",component:()=>Promise.all([a.e(736),a.e(64),a.e(457)]).then(a.bind(a,6457)),children:[{path:"dashboard",name:"Admin-Dashboard",component:()=>Promise.all([a.e(736),a.e(64),a.e(471)]).then(a.bind(a,7471))},{path:"settings",name:"Admin-Settings",component:()=>Promise.all([a.e(736),a.e(64),a.e(883)]).then(a.bind(a,9883))},{path:"faq",name:"Admin-Settings-Faq",component:()=>Promise.all([a.e(736),a.e(64),a.e(419)]).then(a.bind(a,5419))},{path:"nodes",name:"Admin-Nodes",component:()=>Promise.all([a.e(736),a.e(64),a.e(274)]).then(a.bind(a,3274))},{path:"users",name:"Admin-Users",component:()=>Promise.all([a.e(736),a.e(64),a.e(37)]).then(a.bind(a,5037))},{path:"contact",name:"Admin-contact",component:()=>Promise.all([a.e(736),a.e(64),a.e(922)]).then(a.bind(a,9072))},{path:"data-old",name:"Admin-Data-old",component:()=>Promise.all([a.e(736),a.e(64),a.e(720)]).then(a.bind(a,7720))},{path:"backup",name:"Admin-Backup",component:()=>Promise.all([a.e(736),a.e(64),a.e(981)]).then(a.bind(a,7981))}]},{path:"/",component:()=>Promise.all([a.e(736),a.e(358)]).then(a.bind(a,2358)),children:[{path:"login",component:()=>Promise.all([a.e(736),a.e(33)]).then(a.bind(a,7033))}]},{path:"/:catchAll(.*)*",component:()=>Promise.all([a.e(736),a.e(293)]).then(a.bind(a,7293))}],b=f,y=(0,u.BC)((function({store:e}){const t=h.r5,a=(0,h.p7)({scrollBehavior:()=>({left:0,top:0}),routes:b,history:t("")});return a.beforeEach((async(t,a,r)=>{if(console.log("-----",t),console.log(e.getters),e.state.user.me&&""===e.state.user.me._id&&!e.state.user.init&&await e.dispatch("user/getInfo"),e.state.user.me&&""!==e.state.user.me._id){if(await e.dispatch("balance/getVariableSystem"),e.state.user.me.email&&"/login"===t.path)return"Admin"===e.state.user.me.rules&&r("Admin-Dashboard"),r("dashboard");"Admin"===e.state.user.me.rules&&"/admin/"===t.path&&(console.log("hahahhahaskdfhjajsdf"),r("/admin/dashboard"))}else if(!["/roi","/plans","/networks","/login","/","/faq"].includes(t.path))return r("login");return r()})),a}));async function g(e,t){const r="function"===typeof p["default"]?await(0,p["default"])({}):p["default"],{storeKey:n}=await Promise.resolve().then(a.bind(a,5984)),s="function"===typeof y?await y({store:r}):y;r.$router=s;const i=e(m);return i.use(o.Z,t),{app:i,store:r,storeKey:n,router:s}}var v=a(6489),w=a(677),P=a(4434),S=a(5151),_=a(6249);const k={config:{},directives:{Ripple:v.Z,ClosePopup:w.Z},plugins:{Notify:P.Z,Dialog:S.Z,Loading:_.Z}};var N=a(1413);(0,N.z)("service-worker.js",{ready(){},registered(){},cached(){},updatefound(){},updated(){location.reload(!0),console.log("New content is available; please refresh.")},offline(){},error(){}}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&window.navigator.standalone&&a.e(736).then(a.t.bind(a,9501,23));const A="";async function $({app:e,router:t,store:a,storeKey:r},o){let n=!1;const s=e=>{try{return t.resolve(e).href}catch(a){}return Object(e)===e?null:e},i=e=>{if(n=!0,"string"===typeof e&&/^https?:\/\//.test(e))return void(window.location.href=e);const t=s(e);null!==t&&(window.location.href=t,window.location.reload())},l=window.location.href.replace(window.location.origin,"");for(let d=0;!1===n&&d<o.length;d++)try{await o[d]({app:e,router:t,store:a,ssrContext:null,redirect:i,urlPath:l,publicPath:A})}catch(c){return c&&c.url?void i(c.url):void console.error("[Quasar] boot error:",c)}!0!==n&&(e.use(t),e.use(a,r),e.mount("#q-app"))}g(r.ri,k).then((e=>Promise.all([Promise.resolve().then(a.bind(a,287))]).then((t=>{const a=t.map((e=>e.default)).filter((e=>"function"===typeof e));$(e,a)}))))},287:(e,t,a)=>{a.r(t),a.d(t,{getToken:()=>d,apolloProvider:()=>f,default:()=>b});var r=a(9864),o=a(7422),n=a(133),s=a(3515),i=a(8033),l=a(7083);let c="";function d(){return c&&""===c||(c=localStorage.getItem("tk")||""),c}const m=(0,r.L)({uri:s.Z.server+"/graphql",headers:{authorization:localStorage.getItem("token")||""}}),p=new o.h,u={watchQuery:{fetchPolicy:"no-cache",errorPolicy:"ignore"},query:{fetchPolicy:"no-cache",errorPolicy:"all"}},h=new n.f({link:m,cache:p,connectToDevTools:!0,defaultOptions:u}),f=(0,i.r)({defaultClient:h,errorHandler({graphQLErrors:e,networkError:t}){e&&e.map((({message:e,locations:t,path:a})=>console.log(`[GraphQL error]: Message: ${e}}`))),t&&console.log(`[Network error]: ${t.toString()}`)}}),b=(0,l.xr)((function({app:e}){e.use(f)}))},3515:(e,t,a)=>{a.d(t,{Z:()=>r});const r={CLIENT_ID:"917714938934480906",portServer:3456,server:"",isDev:!1}},3194:(e,t,a)=>{a.d(t,{_:()=>n,s:()=>s});var r=a(52),o=a.n(r);const n=(e="USD")=>o().get("https://api.coingecko.com/api/v3/coins/markets?vs_currency="+e+"&ids=raptoreum&order=market_cap_desc&per_page=100&page=1&sparkline=false"),s=()=>o().get("https://api.coingecko.com/api/v3/coins/raptoreum/market_chart?vs_currency=usd&days=7&interval=1h")},3047:(e,t,a)=>{a.d(t,{sb:()=>o,zj:()=>n,C3:()=>s,f1:()=>i,uR:()=>l});var r=a(9968);const o=r.Ps`
  query  {
    getBalance{
      balance
      received
    }
  }
`,n=r.Ps`
  query
    getBalanceByAddress($address: String!){
        getBalanceByAddress(address: $address){
        balance
        received
        }
    }

`,s=r.Ps`
  query  {
    getSmartNodes{
      proTxHash
      address
      payee
      status
      lastpaidtime
      lastpaidblock
      owneraddress
      votingaddress
      collateraladdress
      pubkeyoperator
    }
  }
`,i=r.Ps`
  query
    transactions($category:String) {
    transactions(category:$category){
      address
      category
      amount
      label
      confirmations
      blockhash
      blockindex
      blocktime
      txid
      time
      timereceived
    }
  }
`,l=r.Ps`
  query{
    lastTxid
  }
`},3567:(e,t,a)=>{a.d(t,{Vx:()=>o,Ue:()=>n,Od:()=>s,I3:()=>i,o3:()=>l});var r=a(9968);const o=r.Ps`
  mutation updateSmartNode($_id:String!, $label: String,$ipAddress:String){
    updateSmartNode(_id:$_id, label:$label,ipAddress: $ipAddress){
      _id
      label
      ipAddress
      address
    }
  }
`,n=r.Ps`
  mutation createSmartNode($ipAddress: String!,$label:String!){
    createSmartNode(ipAddress:$ipAddress,label: $label){
      _id
      label
      ipAddress
      address
    }
  }
`,s=r.Ps`
  mutation deleteFaq($_id: String!){
    deleteFaq(_id:$_id){
      _id
    }
  }
`,i=r.Ps`
  query {
    myNodes{
      _id
      label
      ipAddress
      address
      participants{
        collateral
        pendingRTMRewards
        percentOfNode
        RTMRewards
        time
        userId{
          _id
          email
          discord
          profile{
            picture
            discordName

          }
        }
      }
      proTxHash
      payee
      status
      lastpaidtime
      lastpaidblock
      owneraddress
      votingaddress
      collateraladdress
      pubkeyoperator

      createdAt
      updatedAt
    }

  }
`,l=r.Ps`
  query {
    smartNodes{
      _id
      label
      ipAddress
      address
      participants{
        collateral
        pendingRTMRewards
        percentOfNode
        RTMRewards
        time
        userId{
          _id
          email
          discord
          profile{
            picture
            discordName

          }
        }
      }
      proTxHash
      payee
      status
      lastpaidtime
      lastpaidblock
      owneraddress
      votingaddress
      collateraladdress
      pubkeyoperator
      createdAt
      updatedAt
    }

  }
`},149:(e,t,a)=>{a.d(t,{EQ:()=>o,vk:()=>n,_K:()=>s});var r=a(9968);const o=r.Ps`
  mutation updateSystem($enableWithdraw: Boolean,  $mailWellcome: inputSettingTemplateMail, $mailNewSession: inputSettingTemplateMail, $mailWithdraw: inputSettingTemplateMail, $mailDespost: inputSettingTemplateMail, $mailJobSmartNode: inputSettingTemplateMail, $mailTfa: inputSettingTemplateMail, $mailReward: inputSettingTemplateMail, $tfa:String!){
    updateSystem(enableWithdraw: $enableWithdraw,  mailWellcome: $mailWellcome, mailNewSession: $mailNewSession, mailWithdraw: $mailWithdraw, mailDespost: $mailDespost, mailJobSmartNode: $mailJobSmartNode, mailTfa: $mailTfa, mailReward: $mailReward, tfa:$tfa){
      _id
      createdAt
      updatedAt
    }
  }
`,n=r.Ps`
  query {
    variableSystem{
      enableWithdraw
      testNet
    }
  }
  `,s=r.Ps`
  query {
    settingSystem{
      _id
      enableWithdraw
      mailWellcome{
        template
        enable
        cc
        label
      }
      mailNewSession{
        template
        enable
        cc
        label
      }
      mailWithdraw{
        template
        enable
        cc
        label
      }
      mailDespost{
        template
        enable
        cc
        label
      }
      mailJobSmartNode{
        template
        enable
        cc
        label
      }
      mailTfa{
        template
        enable
        cc
        label
      }
      mailReward{
        template
        enable
        cc
        label
      }
      createdAt
      updatedAt
  }

  }
`},5984:(e,t,a)=>{a.r(t),a.d(t,{default:()=>R,storeKey:()=>x,useStore:()=>D});var r=a(7083),o=a(3617),n=a(287),s=a(9968);const i=s.Ps`
  query  {
    me{
      _id
      email
      profile{
        name
        picture
        discordAvatar
        discordName
      }
      discord
      rules
      enableTfa
      addressRTM
      username
    }
  }
`,l={_id:"",name:"",email:"",rules:"User",addressRTM:"",enableTfa:!1};function c(){return{me:l,init:!1}}const d=c,m={set(e,t){e.me=t},setInit(e,t){e.init=t},setDefault(e){e.me=l},setInfo(e,t){e.me=t}},p={async getInfoRefresh({dispatch:e}){await Promise.all([e("fetchInfo")])},async getInfo({dispatch:e}){await Promise.all([e("fetchInfo")])},async fetchInfo({commit:e,state:t}){if(""===t.me._id){console.log(this);try{const t=await n.apolloProvider.defaultClient.query({query:i});t.data.me&&e("setInfo",t.data.me),e("setInit",!0)}catch(a){e("setInit",!0),console.log("e",a)}}},async fetchInfoRefresh({commit:e,state:t}){console.log(this);try{const t=await n.apolloProvider.defaultClient.query({query:i});t.data.me&&e("setInfo",t.data.me)}catch(a){console.log("e",a)}}},u={namespaced:!0,actions:p,mutations:m,state:d,getters:{getMe:e=>{e.me}}},h=u;var f=a(3047),b=a(3050),y=a.n(b),g=a(3194),v=a(149);const w={country:"United States Dollar",symbol:"USD",charCode:"$"};let P=w;try{const e=localStorage.getItem("currency")||"";P=JSON.parse(e)||{country:"United States Dollar",symbol:"USD",charCode:"$"}}catch(B){P={country:"United States Dollar",symbol:"USD",charCode:"$"}}function S(){return{balance:0,received:0,explorerLink:"https://explorer.raptoreum.com/",variableSystem:{enableWithdraw:!0,testNet:!1},currency:P||w,market:{price_change_24h:0,price_change_percentage_24h:0,received:0,market_cap:0,current_price:0,total_volume:0,high_24h:0,low_24h:0,last_updated:""}}}const _=S,k={set(e,t){t},setCurrency(e,t){e.currency=t,localStorage.setItem("currency",JSON.stringify(t))},setVariableSystem(e,t){e.variableSystem=t,t.testNet&&(e.explorerLink="https://testnet.raptoreum.com/")},setBalance(e,t){console.log("vào đây"),e.balance=t.balance/1e8,e.received=t.received/1e8},setMarketcap(e,t){e.market=t}},N={showTransition({commit:e,state:t},a){try{return window.open(t.explorerLink+"tx/"+a,"_blank"),!0}catch(B){return console.log("e",B),!1}},showAddress({commit:e,state:t},a){try{return window.open(t.explorerLink+"address/"+a,"_blank"),!0}catch(B){return console.log("e",B),!1}},async getVariableSystem({dispatch:e}){await Promise.all([e("fetchVariableSystem")])},async fetchVariableSystem({commit:e}){try{const t=await n.apolloProvider.defaultClient.query({query:v.vk});t.data.variableSystem&&e("setVariableSystem",t.data.variableSystem)}catch(B){console.log("e",B)}},async getBalance({dispatch:e}){await Promise.all([e("fetchBalance")])},async fetchBalance({commit:e}){try{const t=await n.apolloProvider.defaultClient.query({query:f.sb});t.data.getBalance&&(console.log("hahaha",t.data.getBalance),e("setBalance",t.data.getBalance))}catch(B){console.log("e",B)}},async fetchGetMarketCap({commit:e,state:t}){try{const a=await(0,g._)(t.currency.symbol),r=a.data[0];console.log(r,"marketCapmarketCapmarketCap"),e("setMarketcap",y()(r,["received","market_cap","current_price","total_volume","high_24h","low_24h","last_updated","price_change_24h","price_change_percentage_24h","atl_date","ath_date","atl","ath"]))}catch(B){console.log("e",B)}}},A={namespaced:!0,actions:N,mutations:k,state:_},$=A;var T=a(3567);function q(){return{myNodes:[]}}const M=q,O={set(e,t){t},setMyNodes(e,t){console.log("vào đâymyNodesState"),e.myNodes=t}},C={async getMyNodes({dispatch:e}){await Promise.all([e("fetchMyNodes")])},async fetchMyNodes({commit:e}){try{const t=await n.apolloProvider.defaultClient.query({query:T.I3});t.data.myNodes&&(console.log("hahaha",t.data.myNodes),e("setMyNodes",t.data.myNodes))}catch(B){console.log("e",B)}}},j={namespaced:!0,actions:C,mutations:O,state:M},I=j,x=Symbol("vuex-key"),R=(0,r.h)((function(){const e=(0,o.MT)({modules:{user:h,balance:$,smartNode:I},strict:!1});return e}));function D(){return(0,o.oR)(x)}}},t={};function a(r){var o=t[r];if(void 0!==o)return o.exports;var n=t[r]={id:r,loaded:!1,exports:{}};return e[r].call(n.exports,n,n.exports,a),n.loaded=!0,n.exports}a.m=e,(()=>{var e=[];a.O=(t,r,o,n)=>{if(!r){var s=1/0;for(d=0;d<e.length;d++){for(var[r,o,n]=e[d],i=!0,l=0;l<r.length;l++)(!1&n||s>=n)&&Object.keys(a.O).every((e=>a.O[e](r[l])))?r.splice(l--,1):(i=!1,n<s&&(s=n));if(i){e.splice(d--,1);var c=o();void 0!==c&&(t=c)}}return t}n=n||0;for(var d=e.length;d>0&&e[d-1][2]>n;d--)e[d]=e[d-1];e[d]=[r,o,n]}})(),(()=>{a.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;return a.d(t,{a:t}),t}})(),(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;a.t=function(r,o){if(1&o&&(r=this(r)),8&o)return r;if("object"===typeof r&&r){if(4&o&&r.__esModule)return r;if(16&o&&"function"===typeof r.then)return r}var n=Object.create(null);a.r(n);var s={};e=e||[null,t({}),t([]),t(t)];for(var i=2&o&&r;"object"==typeof i&&!~e.indexOf(i);i=t(i))Object.getOwnPropertyNames(i).forEach((e=>s[e]=()=>r[e]));return s["default"]=()=>r,a.d(n,s),n}})(),(()=>{a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}})(),(()=>{a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce(((t,r)=>(a.f[r](e,t),t)),[]))})(),(()=>{a.u=e=>"js/"+(64===e?"chunk-common":e)+"."+{16:"c3b6879e",33:"41e688eb",37:"91a4c0da",64:"9185ef20",72:"f84795aa",274:"562f7440",293:"085485d5",338:"dc8033c6",358:"2fdd282a",370:"be0dccb6",419:"cf7be2fe",450:"5a0caca0",457:"5f9d6e12",471:"d919ac99",554:"70fcf6dd",653:"02f19074",669:"ca95593e",681:"24114409",720:"3ece9957",758:"e7230424",883:"f488eab7",922:"4cb5f2d9",964:"0b8ffcc6",981:"1a58ddaf"}[e]+".js"})(),(()=>{a.miniCssF=e=>"css/"+{143:"app",736:"vendor"}[e]+"."+{143:"c5b4dd2a",736:"4b03c59f"}[e]+".css"})(),(()=>{a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{var e={},t="RaptorNodes:";a.l=(r,o,n,s)=>{if(e[r])e[r].push(o);else{var i,l;if(void 0!==n)for(var c=document.getElementsByTagName("script"),d=0;d<c.length;d++){var m=c[d];if(m.getAttribute("src")==r||m.getAttribute("data-webpack")==t+n){i=m;break}}i||(l=!0,i=document.createElement("script"),i.charset="utf-8",i.timeout=120,a.nc&&i.setAttribute("nonce",a.nc),i.setAttribute("data-webpack",t+n),i.src=r),e[r]=[o];var p=(t,a)=>{i.onerror=i.onload=null,clearTimeout(u);var o=e[r];if(delete e[r],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((e=>e(a))),t)return t(a)},u=setTimeout(p.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=p.bind(null,i.onerror),i.onload=p.bind(null,i.onload),l&&document.head.appendChild(i)}}})(),(()=>{a.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}})(),(()=>{a.nmd=e=>(e.paths=[],e.children||(e.children=[]),e)})(),(()=>{a.p=""})(),(()=>{var e={143:0};a.f.j=(t,r)=>{var o=a.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else{var n=new Promise(((a,r)=>o=e[t]=[a,r]));r.push(o[2]=n);var s=a.p+a.u(t),i=new Error,l=r=>{if(a.o(e,t)&&(o=e[t],0!==o&&(e[t]=void 0),o)){var n=r&&("load"===r.type?"missing":r.type),s=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+n+": "+s+")",i.name="ChunkLoadError",i.type=n,i.request=s,o[1](i)}};a.l(s,l,"chunk-"+t,t)}},a.O.j=t=>0===e[t];var t=(t,r)=>{var o,n,[s,i,l]=r,c=0;if(s.some((t=>0!==e[t]))){for(o in i)a.o(i,o)&&(a.m[o]=i[o]);if(l)var d=l(a)}for(t&&t(r);c<s.length;c++)n=s[c],a.o(e,n)&&e[n]&&e[n][0](),e[s[c]]=0;return a.O(d)},r=self["webpackChunkRaptorNodes"]=self["webpackChunkRaptorNodes"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var r=a.O(void 0,[736],(()=>a(4887)));r=a.O(r)})();