"use strict";(self["webpackChunkRaptorNodes"]=self["webpackChunkRaptorNodes"]||[]).push([[189],{32189:(e,a,t)=>{t.r(a),t.d(a,{default:()=>x});var r=t(83673);const l={class:"row col-12 flex flex-center",style:{"flex-direction":"column","justify-content":"center"}},s=(0,r._)("div",{style:{"max-width":"900px"},class:"container row col-12 fixh5"},[(0,r._)("h5",{class:"font-raptornodes",style:{"line-height":"0"}},"raptor Nodes")],-1),o=(0,r._)("p",{class:"text-h7 text-left font-raptornodes"},"ALL Nodes",-1);function n(e,a,t,n,i,d){const c=(0,r.up)("q-space"),u=(0,r.up)("q-input"),p=(0,r.up)("q-table"),f=(0,r.up)("q-card"),m=(0,r.up)("q-page");return(0,r.wg)(),(0,r.j4)(m,{class:"row q-pa-md"},{default:(0,r.w5)((()=>[(0,r._)("div",l,[s,(0,r.Wm)(f,{style:{width:"900px"},class:"container q-pa-md row col-12 card-dark"},{default:(0,r.w5)((()=>[(0,r.Wm)(p,{rows:e.rows,columns:e.columns,"row-key":"name",dark:"",filter:e.search,pagination:e.initialPagination,class:"rol col-12",color:"amber"},{top:(0,r.w5)((()=>[o,(0,r.Wm)(c),(0,r.Wm)(u,{filled:"",modelValue:e.search,"onUpdate:modelValue":a[0]||(a[0]=a=>e.search=a),dense:"",placeholder:"Search by IP"},null,8,["modelValue"])])),_:1},8,["rows","columns","filter","pagination"])])),_:1})])])),_:1})}var i=t(85777),d=t(79582),c=t(93047),u=function(e,a,t,r){var l,s=arguments.length,o=s<3?a:null===r?r=Object.getOwnPropertyDescriptor(a,t):r;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)o=Reflect.decorate(e,a,t,r);else for(var n=e.length-1;n>=0;n--)(l=e[n])&&(o=(s<3?l(o):s>3?l(a,t,o):l(a,t))||o);return s>3&&o&&Object.defineProperty(a,t,o),o};let p=class extends i.w3{currentPrice=0;totalLockedCoins="Loading...";search="";columns=[{name:"ip",required:!0,label:"IP",align:"left",field:"address",sortable:!0},{name:"status",required:!0,label:"Status",align:"center",field:"status",sortable:!0},{name:"Owner Address",required:!0,label:"Owner Address",align:"center",field:"owneraddress",sortable:!0},{name:"Payee Address",required:!0,label:"Payee Address",align:"center",field:"payee",sortable:!0},{name:"Last Paid Block",required:!0,label:"Last Paid Block",align:"center",field:"lastpaidblock",sortable:!0},{name:"Last Paid Time",required:!0,label:"Last Paid Time",align:"center",field:"lastpaidtime",sortable:!0}];rows=[];initialPagination={sortBy:"day1",descending:!1,page:1,rowsPerPage:10};setup(){const e=(0,d.tv)(),a=()=>{e.push({path:"login"}).then((e=>{console.log(e)}))};return{goLogin:a}}async created(){const e=await this.$apollo.query({query:c.C3});this.rows=e.data.getSmartNodes||[]}};p=u([(0,i.Ei)({name:"pageIndex",computed:{}})],p);const f=p;var m=t(74260),g=t(24379),w=t(10151),h=t(30673),b=t(62025),y=t(64689),P=t(7518),q=t.n(P);const k=(0,m.Z)(f,[["render",n]]),x=k;q()(f,"components",{QPage:g.Z,QCard:w.Z,QTable:h.Z,QSpace:b.Z,QInput:y.Z})}}]);