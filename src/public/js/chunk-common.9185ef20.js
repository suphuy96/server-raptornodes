(self["webpackChunkRaptorNodes"]=self["webpackChunkRaptorNodes"]||[]).push([[64],{8815:(e,t,a)=>{"use strict";a.d(t,{RY:()=>n,WD:()=>s});var o=a(4830),r=a.n(o);const l=e=>{const t=[],a=r().utils.decode_range(e["!ref"]);let o,l=a.s.r;for(o=a.s.c;o<=a.e.c;++o){const a=e[r().utils.encode_cell({c:o,r:l})];let n="UNKNOWN "+o.toString();a&&a.t&&(n=r().utils.format_cell(a)),t.push(n)}return t},n=e=>new Promise(((t,a)=>{const o=new FileReader,n=!!o.readAsBinaryString;o.onload=e=>{try{console.log("vafo dadlkfjalsdfj");const a=r().read(e.target.result,{type:n?"binary":"array",cellDates:!0,cellNF:!1,cellText:!1}),o=[],s=["Node-1","Node-2","Node-3","Node-4","Node-5","Node-6","Node-7","Node-8","Node-9","Node-10","Node-11","Node-12"];for(let e=0;e<a.SheetNames.length;e++)if(s.includes(a.SheetNames[e])){const t=a.Sheets[a.SheetNames[e]],n=(l(t),r().utils.sheet_to_json(t));o.push({key:a.SheetNames[e],data:n})}t(o)}catch(e){a(e)}},o.readAsArrayBuffer(e)})),s=(e,t)=>{const a=r().utils.json_to_sheet(e),o=r().utils.book_new();r().utils.book_append_sheet(o,a,"data");const l=new Date,n=l.getDate()+"-"+(l.getMonth()+1)+"--"+l.getTime(),s=t+"_"+n;r().writeFile(o,s+".xlsx")}},1949:()=>{},4756:()=>{},6839:()=>{},4832:(e,t,a)=>{"use strict";a.d(t,{Ue:()=>r,Od:()=>l,o3:()=>n});var o=a(9968);const r=o.Ps`
  mutation createContact($title: String!,$content:String!,$name:String!,$email:String!){
    createContact(title:$title,content: $content,name:$name,email: $email){
      _id
      name
      email
      createdAt
      updatedAt
    }
  }
`,l=o.Ps`
  mutation deleteContact($_id: String!){
    deleteContact(_id:$_id){
      _id
    }
  }
`,n=o.Ps`
  query {
  contacts{
    _id
    name
    email
    title
    content
    createdAt
    updatedAt
  }

  }
`},6577:(e,t,a)=>{"use strict";a.d(t,{Vx:()=>r,Ue:()=>l,Od:()=>n,o3:()=>s});var o=a(9968);const r=o.Ps`
  mutation updateFaq($_id:String!, $answer: String,$label:String){
    updateFaq(_id:$_id, answer:$answer,label: $label){
      _id
      answer
      label
      createdAt
      updatedAt
    }
  }
`,l=o.Ps`
  mutation createFaq($answer: String!,$label:String!){
    createFaq(answer:$answer,label: $label){
      _id
      answer
      label
      createdAt
      updatedAt
    }
  }
`,n=o.Ps`
  mutation deleteFaq($_id: String!){
    deleteFaq(_id:$_id){
      _id
    }
  }
`,s=o.Ps`
  query {
  faqs{
    _id
    answer
    label
    createdAt
    updatedAt
  }

  }
`},5310:(e,t,a)=>{"use strict";a.d(t,{ZH:()=>r,uX:()=>l,$y:()=>n});var o=a(9968);o.Ps`
  mutation createUserAddress($address: String!,$label:String){
    createUserAddress(address:$address,label: $label){
      address
    }
  }
`;const r=o.Ps`
  mutation verifyTfa($token: String!){
    verifyTfa(token:$token)
  }
`,l=o.Ps`
  mutation widthDrawlSmartNode($_id:String!,$token: String){
    widthDrawlSmartNode(_id:$_id,token:$token)
  }
`,n=(o.Ps`
  mutation {
    getTfa {
      dataURL
      tempSecret
    }
  }
`,o.Ps`
  mutation {
    setupTfa {
      dataURL
      tempSecret
    }
  }
`)},7638:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});const o=[{country:"United States Dollar",symbol:"USD",charCode:"$"},{country:"BITCOIN",symbol:"BTC",charCode:"btc"},{country:"ETHERUM",symbol:"ETH",charCode:"ETH"},{country:"Argentina Peso",symbol:"ARS",charCode:"$"},{country:"Australia Dollar",symbol:"AUD",charCode:"$"},{country:"Brazil Real",symbol:"BRL",charCode:"R$"},{country:"Canada Dollar",symbol:"CAD",charCode:"$"},{country:"Chile Peso",symbol:"CLP",charCode:"$"},{country:"China Yuan Renminbi",symbol:"CNY",charCode:"¥"},{country:"Cuba Peso",symbol:"CUP",charCode:"₱"},{country:"Czech Republic Koruna",symbol:"CZK",charCode:"Kč"},{country:"Denmark Krone",symbol:"DKK",charCode:"kr"},{country:"East Caribbean Dollar",symbol:"XCD",charCode:"$"},{country:"Euro Member Countries",symbol:"EUR",charCode:"€"},{country:"Hong Kong Dollar",symbol:"HKD",charCode:"$"},{country:"Hungary Forint",symbol:"HUF",charCode:"Ft"},{country:"India Rupee",symbol:"INR",charCode:""},{country:"Indonesia Rupiah",symbol:"IDR",charCode:"Rp"},{country:"Israel Shekel",symbol:"ILS",charCode:"₪"},{country:"Japan Yen",symbol:"JPY",charCode:"¥"},{country:"Malaysia Ringgit",symbol:"MYR",charCode:"RM"},{country:"Mauritius Rupee",symbol:"MUR",charCode:"₨"},{country:"Mexico Peso",symbol:"MXN",charCode:"$"},{country:"Mongolia Tughrik",symbol:"MNT",charCode:"₮"},{country:"Mozambique Metical",symbol:"MZN",charCode:"MT"},{country:"Namibia Dollar",symbol:"NAD",charCode:"$"},{country:"Nepal Rupee",symbol:"NPR",charCode:"₨"},{country:"Netherlands Antilles Guilder",symbol:"ANG",charCode:"ƒ"},{country:"New Zealand Dollar",symbol:"NZD",charCode:"$"},{country:"Nicaragua Cordoba",symbol:"NIO",charCode:"C$"},{country:"Nigeria Naira",symbol:"NGN",charCode:"₦"},{country:"Norway Krone",symbol:"NOK",charCode:"kr"},{country:"Oman Rial",symbol:"OMR",charCode:"﷼"},{country:"Pakistan Rupee",symbol:"PKR",charCode:"₨"},{country:"Panama Balboa",symbol:"PAB",charCode:"B/."},{country:"Paraguay Guarani",symbol:"PYG",charCode:"Gs"},{country:"Peru Sol",symbol:"PEN",charCode:"S/."},{country:"Philippines Peso",symbol:"PHP",charCode:"₱"},{country:"Poland Zloty",symbol:"PLN",charCode:"zł"},{country:"Qatar Riyal",symbol:"QAR",charCode:"﷼"},{country:"Romania Leu",symbol:"RON",charCode:"lei"},{country:"Russia Ruble",symbol:"RUB",charCode:"₽"},{country:"Saint Helena Pound",symbol:"SHP",charCode:"£"},{country:"Saudi Arabia Riyal",symbol:"SAR",charCode:"﷼"},{country:"Serbia Dinar",symbol:"RSD",charCode:"Дин."},{country:"Seychelles Rupee",symbol:"SCR",charCode:"₨"},{country:"Singapore Dollar",symbol:"SGD",charCode:"$"},{country:"Solomon Islands Dollar",symbol:"SBD",charCode:"$"},{country:"Somalia Shilling",symbol:"SOS",charCode:"S"},{country:"South Africa Rand",symbol:"ZAR",charCode:"R"},{country:"Sri Lanka Rupee",symbol:"LKR",charCode:"₨"},{country:"Sweden Krona",symbol:"SEK",charCode:"kr"},{country:"Switzerland Franc",symbol:"CHF",charCode:"CHF"},{country:"Suriname Dollar",symbol:"SRD",charCode:"$"},{country:"Syria Pound",symbol:"SYP",charCode:"£"},{country:"Taiwan New Dollar",symbol:"TWD",charCode:"NT$"},{country:"Thailand Baht",symbol:"THB",charCode:"฿"},{country:"Trinidad and Tobago Dollar",symbol:"TTD",charCode:"TT$"},{country:"Turkey Lira",symbol:"TRY",charCode:""},{country:"Tuvalu Dollar",symbol:"TVD",charCode:"$"},{country:"Ukraine Hryvnia",symbol:"UAH",charCode:"₴"},{country:"United Kingdom Pound",symbol:"GBP",charCode:"£"},{country:"United States Dollar",symbol:"USD",charCode:"$"},{country:"Uruguay Peso",symbol:"UYU",charCode:"$U"},{country:"Venezuela Bolívar",symbol:"VEF",charCode:"Bs"},{country:"Viet Nam Dong",symbol:"VND",charCode:"₫"}]},4250:(e,t,a)=>{"use strict";a.d(t,{T:()=>o,l:()=>r});const o=function(e){if(!e)return"";let t=(e%1).toFixed(8).toString().replace("0.",".");return"0"===t&&(t="00000000"),console.log(t,"duoi"),parseInt(e.toString()).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")+t},r=function(e,t=""){return t+e.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,"$1,")}},909:(e,t,a)=>{"use strict";a.d(t,{Z:()=>R});var o=a(3673),r=a(2323);const l={style:{flex:"1",overflow:"hidden"}},n={class:"text-h6"};function s(e,t,a,s,i,c){const d=(0,o.up)("q-icon"),u=(0,o.up)("q-card-section"),m=(0,o.up)("q-card");return(0,o.wg)(),(0,o.j4)(m,{dark:"",bordered:"",class:"card-dark"},{default:(0,o.w5)((()=>[(0,o.Wm)(u,{horizontal:"",class:"q-pa-md",style:{display:"flex"}},{default:(0,o.w5)((()=>[(0,o._)("div",l,[(0,o._)("div",n,(0,r.zw)(e.title),1),(0,o._)("div",{onClick:t[0]||(t[0]=t=>e.action&&e.action()),class:"text-subtitle2",style:{"font-size":"1.65rem","white-space":"nowrap","text-overflow":"ellipsis",overflow:"hidden"}},(0,r.zw)(e.subtitle),1)]),e.icon?((0,o.wg)(),(0,o.j4)(d,{key:0,class:"stat gradient-border",name:e.icon,size:"1.6em"},null,8,["name"])):(0,o.kq)("",!0)])),_:1}),(0,o.Wm)(u,null,{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3})])),_:3})}var i=a(1959);function c(){const e=(0,i.iH)(0);function t(){return e.value+=1,e.value}return{clickCount:e,increment:t}}const d=(0,o.aZ)({name:"CardCustom",props:{title:{type:String,required:!0},subtitle:{type:String,default:""},action:{type:Function},icon:{type:String},active:{type:Boolean}},data(){return{}},emits:["onNeedReload"],setup(){return{...c()}}});var u=a(4260),m=a(151),y=a(1598),p=a(5869),h=a(5589),b=a(2025),f=a(4554),w=a(7518),g=a.n(w);const C=(0,u.Z)(d,[["render",s]]),R=C;g()(d,"components",{QCard:m.Z,QLinearProgress:y.Z,QSeparator:p.Z,QCardSection:h.Z,QSpace:b.Z,QIcon:f.Z})},9110:(e,t,a)=>{"use strict";a.d(t,{Z:()=>_e});var o=a(3673),r=a(2323);const l=(0,o._)("h4",{class:"font-raptornodes float-left",style:{"line-height":"0"}},"Return on inverstment",-1),n={class:"text-h6 text-left"},s=(0,o.Uk)("RaptorNodes ROI Calculator "),i=(0,o.Uk)(" *Adjusted for 1,250,000 RTM Collateral "),c={key:0,class:"text-right"},d={key:1,class:"text-right"},u={class:"row col-12 q-pa-sm"},m={class:"row col-12"},y=(0,o.Uk)("collateral: "),p={class:"text-amber"},h={class:"row col-12"},b=(0,o.Uk)(" Active SmartNodes "),f=(0,o._)("br",null,null,-1),w={class:"text-amber",style:{"font-weight":"bold","font-size":"1em",margin:"0px 6px"}},g=(0,o.Uk)(" RTM Per Day (est)"),C={class:"text-amber",style:{"font-weight":"bold","font-size":"1em",margin:"0px 6px"}},R={style:{height:"80px"}},_={class:"text-amber fixmg"},D=(0,o.Uk)(" =((720000/Active SmartNodes)/1250000)"),S=(0,o._)("br",null,null,-1),T={class:"row col-12"},k=(0,o.Uk)("RTM Per week (est) "),P={class:"text-amber",style:{"font-weight":"bold","font-size":"1em",margin:"0px 6px",float:"left"}},M={style:{height:"200px"}},N=(0,o._)("p",{class:"text-amber fixmg"},"Example of Math",-1),x=(0,o.Uk)("RTM Shared / 1,250,000 RTM = Percentage of Node"),W=(0,o.Uk)("500,000 / 1,250,000 = 40%"),$=(0,o.Uk)("Est. Wkly Payments x 1000 RTM = Est. RTM Earned"),v=(0,o.Uk)("10 x 1000 RTM = 10,000 RTM"),U=(0,o.Uk)("Percentage of Node x Est. RTM Earned = Est. Reward"),q=(0,o.Uk)("40% x 10,000 RTM = 4,000 RTM"),A=(0,o.Uk)("RaptorNodes Fee x Est. Rewards = Est. Fee"),Z=(0,o.Uk)("3.5% x 4,000 RTM = 140 RTM"),z=(0,o.Uk)("Est. Fee - Est. Rewards = Est. Payment"),F=(0,o.Uk)("4,000 RTM = 3,860 RTM"),I=(0,o._)("p",null,null,-1);function Q(e,t,a,Q,E,B){const H=(0,o.up)("q-tooltip"),V=(0,o.up)("q-icon"),K=(0,o.up)("q-space"),L=(0,o.up)("q-item-label"),O=(0,o.up)("q-item-section"),j=(0,o.up)("q-item"),Y=(0,o.up)("q-select"),G=(0,o.up)("q-toggle"),X=(0,o.up)("q-separator"),J=(0,o.up)("q-list"),ee=(0,o.up)("q-td"),te=(0,o.up)("q-input"),ae=(0,o.up)("q-tr"),oe=(0,o.up)("q-table"),re=(0,o.up)("q-card");return(0,o.wg)(),(0,o.j4)(re,{style:(0,r.j5)("width:"+(e.isDialog?"99.9%":"900px;")),class:(0,r.C_)((e.isDialog?"":"q-pa-md ")+"container  row col-12 card-dark")},{default:(0,o.w5)((()=>[l,(0,o.Wm)(oe,{title:"Treats",rows:e.rows,columns:e.columns,"row-key":"name",dark:"",pagination:e.initialPagination,class:"rol col-12 card-dark",color:"amber"},{top:(0,o.w5)((()=>[(0,o._)("p",n,[s,(0,o.Wm)(V,{name:"eva-question-mark-circle-outline",size:"1em"},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{anchor:"top middle",self:"bottom middle",class:"text-white bg-indigo"},{default:(0,o.w5)((()=>[i])),_:1})])),_:1})]),(0,o.Wm)(K),(0,o.Wm)(Y,{dense:"",dark:"",options:e.currencys,modelValue:e.currency,"onUpdate:modelValue":t[0]||(t[0]=t=>e.currency=t),"option-value":"symbol",style:{width:"240px"}},{option:(0,o.w5)((e=>[(0,o.Wm)(j,(0,o.dG)({dense:""},e.itemProps),{default:(0,o.w5)((()=>[(0,o.Wm)(O,null,{default:(0,o.w5)((()=>[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(e.opt.country),1)])),_:2},1024),(0,o.Wm)(L,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(e.opt.symbol)+" - "+(0,r.zw)(e.opt.charCode),1)])),_:2},1024)])),_:2},1024)])),_:2},1040)])),selected:(0,o.w5)((()=>[(0,o.Wm)(j,{dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(O,null,{default:(0,o.w5)((()=>[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(e.currency.country),1)])),_:1}),(0,o.Wm)(L,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(e.currency.symbol)+" - "+(0,r.zw)(e.currency.charCode),1)])),_:1})])),_:1})])),_:1})])),_:1},8,["options","modelValue"]),e.isDialog?((0,o.wg)(),(0,o.iD)("p",d,(0,r.zw)(e.currency.symbol)+" "+(0,r.zw)(e.currency.charCode)+(0,r.zw)(e.marketCap.current_price),1)):((0,o.wg)(),(0,o.iD)("p",c,[(0,o.Uk)((0,r.zw)(e.currency.symbol)+" Price "+(0,r.zw)(e.currency.charCode)+(0,r.zw)(e.marketCap.current_price)+"|Current Price ",1),(0,o.Wm)(G,{style:{"margin-left":"10px"},dense:"",modelValue:e.isRTM,"onUpdate:modelValue":t[1]||(t[1]=t=>e.isRTM=t),label:(e.isDialog?"":"Display ")+"RTM"},null,8,["modelValue","label"])]))])),bottom:(0,o.w5)((()=>[(0,o.Wm)(ae,null,{default:(0,o.w5)((()=>[(0,o.Wm)(ee,{colspan:"100%",style:{display:"flex"}},{default:(0,o.w5)((()=>[(0,o._)("div",u,[(0,o._)("div",m,[(0,o._)("span",null,[y,(0,o._)("b",p,(0,r.zw)(e.collateral),1)])]),(0,o._)("div",h,[b,f,(0,o._)("p",w,(0,r.zw)(e.ActiveSmartNodes),1),g,(0,o._)("p",C,(0,r.zw)(e.paymentsPerDay),1),(0,o.Wm)(V,{name:"eva-question-mark-circle-outline",size:"1.4em"},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{anchor:"top middle",self:"bottom middle",class:"text-white bg-indigo"},{default:(0,o.w5)((()=>[(0,o._)("div",R,[(0,o._)("p",_,[D,S,(0,o._)("b",null,"=((720000/"+(0,r.zw)(e.ActiveSmartNodes)+")/1250000)",1)])])])),_:1})])),_:1}),(0,o._)("div",T,[k,(0,o._)("p",P,(0,r.zw)(7*e.paymentsPerDay),1),(0,o.Wm)(V,{name:"eva-question-mark-circle-outline",size:"1.4em"},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{anchor:"top middle",self:"bottom middle",class:"text-white bg-indigo"},{default:(0,o.w5)((()=>[(0,o._)("div",M,[N,(0,o.Wm)(J,{separator:""},{default:(0,o.w5)((()=>[(0,o.Wm)(j,{dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(O,null,{default:(0,o.w5)((()=>[(0,o.Wm)(L,{class:"text-bold text-left"},{default:(0,o.w5)((()=>[x])),_:1})])),_:1}),(0,o.Wm)(O,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(L,{caption:""},{default:(0,o.w5)((()=>[W])),_:1})])),_:1})])),_:1}),(0,o.Wm)(X),(0,o.Wm)(j,{dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(O,{class:"text-bold text-left"},{default:(0,o.w5)((()=>[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[$])),_:1})])),_:1}),(0,o.Wm)(O,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(L,{caption:""},{default:(0,o.w5)((()=>[v])),_:1})])),_:1})])),_:1}),(0,o.Wm)(X),(0,o.Wm)(j,{dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(O,{class:"text-bold text-left"},{default:(0,o.w5)((()=>[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[U])),_:1})])),_:1}),(0,o.Wm)(O,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(L,{caption:""},{default:(0,o.w5)((()=>[q])),_:1})])),_:1})])),_:1}),(0,o.Wm)(X),(0,o.Wm)(j,{dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(O,{class:"text-bold text-left"},{default:(0,o.w5)((()=>[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[A])),_:1})])),_:1}),(0,o.Wm)(O,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(L,{caption:""},{default:(0,o.w5)((()=>[Z])),_:1})])),_:1})])),_:1}),(0,o.Wm)(X),(0,o.Wm)(j,{dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(O,{class:"text-bold text-left"},{default:(0,o.w5)((()=>[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[z])),_:1})])),_:1}),(0,o.Wm)(O,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(L,{caption:""},{default:(0,o.w5)((()=>[F])),_:1})])),_:1})])),_:1}),(0,o.Wm)(X)])),_:1})])])),_:1})])),_:1})])])])])),_:1}),(0,o.Wm)(ee,{colspan:"100%",style:{display:"flex"}},{default:(0,o.w5)((()=>[(0,o.Wm)(te,{class:"q-ma-sm",type:"number",dark:"",dense:"",label:"Input RTM",modelValue:e.yourRTM,"onUpdate:modelValue":t[2]||(t[2]=t=>e.yourRTM=t),modelModifiers:{number:!0}},null,8,["modelValue"]),(0,o.Wm)(te,{class:"q-ma-sm",type:"number",dark:"",dense:"",label:"input Day",modelValue:e.yourInutDay,"onUpdate:modelValue":t[3]||(t[3]=t=>e.yourInutDay=t),modelModifiers:{number:!0}},null,8,["modelValue"]),(0,o.Wm)(K),I])),_:1})])),_:1})])),_:1},8,["rows","columns","pagination"])])),_:1},8,["style","class"])}var E=a(5777),B=a(6392),H=a(9582),V=a(4250),K=a(9968);K.Ps`
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
`;const L=K.Ps`
  query  {
    smartnodeCount {
      total enabled
    }
  }
`;var O,j=a(5181),Y=a(6839),G=a(7638),X=function(e,t,a,o){var r,l=arguments.length,n=l<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,a):o;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)n=Reflect.decorate(e,t,a,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(l<3?r(n):l>3?r(t,a,n):r(t,a))||n);return l>3&&n&&Object.defineProperty(t,a,n),n},J=function(e,t){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(e,t)};let ee=class extends E.w3{isDialog;marketCap;collateral=125e4;ActiveSmartNodes=36;priceChange24h=0;currentPrice=0;currencys=G.Z;isRTM=!1;totalLockedCoins="Loading...";yourRTM=0;yourInutDay=90;initialPagination={sortBy:"day1",descending:!1,page:1,rowsPerPage:10};get currency(){return this.$store.state.balance.currency}set currency(e){this.$store.commit("balance/setCurrency",e),this.$store.dispatch("balance/fetchGetMarketCap").then((()=>{console.log("thuwr")}))}setup(){const e=(0,H.tv)(),t=()=>{e.push({path:"login"}).then((e=>{console.log(e)}))};return{goLogin:t}}async created(){this.$store.dispatch("balance/fetchGetMarketCap").then((()=>{console.log("thuwr")})),this.isDialog&&(this.yourInutDay=365);const e=await this.$apollo.query({query:L});e&&e.data&&(this.ActiveSmartNodes=parseInt(e.data.smartnodeCount.enabled)||501),console.log(e,e.data.smartnodeCount.enabled)}};X([(0,B.f)({type:Boolean,default:()=>!1}),J("design:type",Boolean)],ee.prototype,"isDialog",void 0),X([(0,j.ZM)((e=>e.balance.market)),J("design:type","function"===typeof(O="undefined"!==typeof Y.Z&&Y.Z)?O:Object)],ee.prototype,"marketCap",void 0),ee=X([(0,E.Ei)({name:"roiCalculator",computed:{columns(){let e=parseInt(this.yourInutDay)||1;const t=[{name:"rtm",required:!0,label:"RTM",align:"left",field:"rtm",sortable:!0},{name:"Day1",align:"center",label:"1 Day",field:"Day1",sortable:!0},{name:"Day7",label:"7 Day",field:"Day7",sortable:!0},{name:"Day30",label:"30 Day",field:"Day30"}];return this.isDialog||t.push({name:"Day365",label:"365 Day",field:"Day365"}),t.push({name:"Yourinput",label:`your Input: ${e||""} Day`,field:"Yourinput"}),t},rows(){let e=this.isRTM?1:parseFloat(this.marketCap.current_price),t=parseFloat(""!==this.yourInutDay?this.yourInutDay:0),a=parseFloat(this.yourRTM)||1;const o=this.currency&&this.currency.charCode?this.currency.charCode:"$";console.log("currentPrice",e);let r=this.isDialog?[5e3,1e4,5e4,1e5,this.yourRTM||0]:[5e3,1e4,5e4,1e5,1e5,125e4,15e5,this.yourRTM||0];return[{rtm:"",Day1:(1*this.profitPerDay*100).toFixed(3)+"%",Day7:(7*this.profitPerDay*100).toFixed(3)+"%",Day30:(30*this.profitPerDay*100).toFixed(3)+"%",Day365:(365*this.profitPerDay*100).toFixed(3)+"%",Yourinput:(this.profitPerDay*a*t).toFixed(3)+"%"}].concat(r.map((r=>({rtm:(0,V.T)(r),Day1:(this.isRTM?"":o)+(0,V.l)(e*r*1*this.profitPerDay)+(this.isRTM?"RTM":""),Day7:(this.isRTM?"":o)+(0,V.l)(e*r*7*this.profitPerDay)+(this.isRTM?"RTM":""),Day30:(this.isRTM?"":o)+(0,V.l)(e*r*30*this.profitPerDay)+(this.isRTM?"RTM":""),Day365:(this.isRTM?"":o)+(0,V.l)(e*r*365*this.profitPerDay)+(this.isRTM?"RTM":""),Yourinput:(this.isRTM?"":o)+(0,V.l)(e*a*t*this.profitPerDay)+(this.isRTM?"RTM":"")}))))},profitPerDay(){return 72e4/this.ActiveSmartNodes/this.collateral},paymentsPerDay(){return 72e4/this.ActiveSmartNodes}}})],ee);const te=ee;var ae=a(4260),oe=a(151),re=a(673),le=a(4554),ne=a(8870),se=a(2025),ie=a(3314),ce=a(3414),de=a(2035),ue=a(2350),me=a(8886),ye=a(8186),pe=a(3884),he=a(7011),be=a(5869),fe=a(9721),we=a(4689),ge=a(7518),Ce=a.n(ge);const Re=(0,ae.Z)(te,[["render",Q]]),_e=Re;Ce()(te,"components",{QCard:oe.Z,QTable:re.Z,QIcon:le.Z,QTooltip:ne.Z,QSpace:se.Z,QSelect:ie.Z,QItem:ce.Z,QItemSection:de.Z,QItemLabel:ue.Z,QToggle:me.Z,QTr:ye.Z,QTd:pe.Z,QList:he.Z,QSeparator:be.Z,QBadge:fe.Z,QInput:we.Z})},4618:(e,t,a)=>{e.exports=a.p+"img/raptornodes-white.4463eeab.png"},5382:()=>{},2095:()=>{},1219:()=>{}}]);