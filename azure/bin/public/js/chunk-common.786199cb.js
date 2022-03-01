(self["webpackChunkRaptorNodes"]=self["webpackChunkRaptorNodes"]||[]).push([[64],{48815:(e,t,a)=>{"use strict";a.d(t,{RY:()=>r,WD:()=>n});var o=a(54701);const l=e=>{const t=[],a=o["default"].utils.decode_range(e["!ref"]);let l,r=a.s.r;for(l=a.s.c;l<=a.e.c;++l){const a=e[o["default"].utils.encode_cell({c:l,r})];let n="UNKNOWN "+l.toString();a&&a.t&&(n=o["default"].utils.format_cell(a)),t.push(n)}return t},r=e=>new Promise(((t,a)=>{const r=new FileReader,n=!!r.readAsBinaryString;r.onload=e=>{try{console.log("vafo dadlkfjalsdfj");const a=o["default"].read(e.target.result,{type:n?"binary":"array",cellDates:!0,cellNF:!1,cellText:!1}),r=[],s=["Node-1","Node-2","Node-3","Node-4","Node-5","Node-6","Node-7","Node-8","Node-9","Node-10","Node-11","Node-12"];for(let e=0;e<a.SheetNames.length;e++)if(s.includes(a.SheetNames[e])){const t=a.Sheets[a.SheetNames[e]],n=(l(t),o["default"].utils.sheet_to_json(t));r.push({key:a.SheetNames[e],data:n})}t(r)}catch(e){a(e)}},r.readAsArrayBuffer(e)})),n=(e,t)=>{const a=o["default"].utils.json_to_sheet(e),l=o["default"].utils.book_new();o["default"].utils.book_append_sheet(l,a,"data");const r=new Date,n=r.getDate()+"-"+(r.getMonth()+1)+"--"+r.getTime(),s=t+"_"+n;o["default"].writeFile(l,s+".xlsx")}},1949:()=>{},94756:()=>{},56839:()=>{},51473:()=>{},61621:()=>{},2945:(e,t,a)=>{"use strict";a.d(t,{Ue:()=>l,Od:()=>r,o3:()=>n});var o=a(49968);const l=o.Ps`
  mutation createContact($title: String!,$content:String!,$name:String!,$email:String!){
    createContact(title:$title,content: $content,name:$name,email: $email){
      _id
      name
      email
      createdAt
      updatedAt
    }
  }
`,r=o.Ps`
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
`},36577:(e,t,a)=>{"use strict";a.d(t,{Vx:()=>l,Ue:()=>r,Od:()=>n,o3:()=>s});var o=a(49968);const l=o.Ps`
  mutation updateFaq($_id:String!, $answer: String,$label:String){
    updateFaq(_id:$_id, answer:$answer,label: $label){
      _id
      answer
      label
      createdAt
      updatedAt
    }
  }
`,r=o.Ps`
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
`},25310:(e,t,a)=>{"use strict";a.d(t,{ZH:()=>l,uX:()=>r,$y:()=>n});var o=a(49968);o.Ps`
  mutation createUserAddress($address: String!,$label:String){
    createUserAddress(address:$address,label: $label){
      address
    }
  }
`;const l=o.Ps`
  mutation verifyTfa($token: String!){
    verifyTfa(token:$token)
  }
`,r=o.Ps`
  mutation createWithdrawWeekly($smartNode:String!,$address:String!,$amount:Float!,$tfa:String){
    createWithdrawWeekly(smartNode:$smartNode,address:$address,amount:$amount,tfa:$tfa){
      _id
      description
      status
      confirm
      author{
        discord
        _id
      }
      txid
      amount
      blockhash
      confirmations
      fee
      time
      timereceived
      createdAt
      updatedAt
    }
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
`)},19709:(e,t,a)=>{"use strict";a.d(t,{JC:()=>l,tn:()=>r});var o=a(49968);const l=o.Ps`
  query  {
    totalLockedCoins
    smartnodeCount {
    total enabled
  }
  }
`,r=o.Ps`
  query  {
    getblockcount
  }
`;o.Ps`
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
`},1919:(e,t,a)=>{"use strict";a.d(t,{a:()=>l,T:()=>r});var o=a(49968);const l=o.Ps`
  query rewardHistorys($reward:String,$smartNode:String,$user:String){
    rewardHistorys(reward:$reward,smartNode: $smartNode,user:$user){
      _id
      description
      paymentsPerDay
      feeReward
      days
      user{
        email
        profile{
          picture
          name
          discordName
        }
        discord
        _id
      }
      txid
      amount
      collateral
      isSchedule
      dayEnd
      createdAt
      updatedAt
    }

  }
`,r=o.Ps`
  query rewardHistorys($reward:String){
    rewardHistorys(reward:$reward){
      _id
      description
      paymentsPerDay
      feeReward
      days
      amount
      txid
      collateral
      isSchedule
      dayEnd
      createdAt
      updatedAt
    }

  }
`},84743:(e,t,a)=>{"use strict";a.d(t,{Ue:()=>l,Vx:()=>r,IO:()=>n});var o=a(49968);const l=o.Ps`
  mutation createUltraFastEarning( $description:String,$amount:Float!,$tfa:String){
    createUltraFastEarning(description: $description,amount: $amount,tfa: $tfa){
      _id
      address
      amount
      createdAt
      updatedAt
    }
  }
`,r=o.Ps`
  mutation updateUltraFastEarning($_id:String!,$status:String, $description:String,$tfa:String){
    updateUltraFastEarning(_id: $_id,status:$status,description: $description,tfa: $tfa){
      _id
      address
      amount
      createdAt
      updatedAt
    }
  }
`,n=o.Ps`
  query {
    ultraFastEarnings{
    _id
      address
      status
      swap
      inFund
      participants{
        _idWithdrawWeekly
        smartNode
        exchange
        time
        author{
          _id
          username
          email
          discord
          profile{
            name
            discordName
            discordAvatar
            picture
          }
        }
        collateralNew
        collateralOld
        txids
      }
      description
        author{
        _id
        username
        email
        discord
        profile{
          name
          discordName
          discordAvatar
          picture
        }
      }
      txid
      amount
      blockhash
      confirmations
      fee
      time
      timereceived
    createdAt
    updatedAt
  }

  }
`},91490:(e,t,a)=>{"use strict";a.d(t,{Vx:()=>l,Ue:()=>r,o3:()=>n});var o=a(49968);const l=o.Ps`
  mutation updateUserAddress($_id:String!, $address: String,$label:String){
    updateUserAddress(_id:$_id, address:$address,label: $label){
      _id
      address
      label
    }
  }
`,r=o.Ps`
  mutation createUserAddress($address: String!,$label:String){
    createUserAddress(address:$address,label: $label){
      _id
     address
      label
    }
  }
`,n=(o.Ps`
  mutation deleteUserAddress($_id: String!){
    deleteUserAddress(_id:$_id){
      _id
    }
  }
`,o.Ps`
  query {
  userAddresss{
    _id
    address
    label
  }

  }
`)},74633:(e,t,a)=>{"use strict";a.d(t,{Vx:()=>l,o3:()=>r,kh:()=>n});var o=a(49968);const l=o.Ps`
  mutation updateWithdrawWeekly($_id:String!,$status:String, $confirm: Boolean,$tfa:String){
    updateWithdrawWeekly(_id:$_id,status:$status, confirm:$confirm,tfa:$tfa){
      _id
      status
      author{
        email
        profile{
          discordName
          discordAvatar
          name
          picture
        }
      }
      address
      description
      amount
      confirm
      collateralOld
      smartNode
      txid
      time
      blockhash
      confirmations
      fee
      createdAt
      updatedAt
    }
  }
`,r=o.Ps`
  query
  withdrawWeeklys ($smartNode:String,$status:String){
    withdrawWeeklys(smartNode:$smartNode,status:$status){
      _id
      status
      confirm
      collateralOld
      smartNode
      author{
        email
        profile{
          discordName
          discordAvatar
          name
          picture
        }
      }
      address
      description
      amount
      txid
      time
      blockhash
      confirmations
      fee
      createdAt
      updatedAt
    }
  }


`,n=o.Ps`
  query{
    withdrawWeeklyOnboardings{
     balance
      withdrawlIsPending
      weeklyFund
      availability
    }
  }


`},17638:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});const o=[{country:"United States Dollar",symbol:"USD",charCode:"$"},{country:"BITCOIN",symbol:"BTC",charCode:"btc"},{country:"ETHERUM",symbol:"ETH",charCode:"ETH"},{country:"Argentina Peso",symbol:"ARS",charCode:"$"},{country:"Australia Dollar",symbol:"AUD",charCode:"$"},{country:"Brazil Real",symbol:"BRL",charCode:"R$"},{country:"Canada Dollar",symbol:"CAD",charCode:"$"},{country:"Chile Peso",symbol:"CLP",charCode:"$"},{country:"China Yuan Renminbi",symbol:"CNY",charCode:"¥"},{country:"Cuba Peso",symbol:"CUP",charCode:"₱"},{country:"Czech Republic Koruna",symbol:"CZK",charCode:"Kč"},{country:"Denmark Krone",symbol:"DKK",charCode:"kr"},{country:"East Caribbean Dollar",symbol:"XCD",charCode:"$"},{country:"Euro Member Countries",symbol:"EUR",charCode:"€"},{country:"Hong Kong Dollar",symbol:"HKD",charCode:"$"},{country:"Hungary Forint",symbol:"HUF",charCode:"Ft"},{country:"India Rupee",symbol:"INR",charCode:""},{country:"Indonesia Rupiah",symbol:"IDR",charCode:"Rp"},{country:"Israel Shekel",symbol:"ILS",charCode:"₪"},{country:"Japan Yen",symbol:"JPY",charCode:"¥"},{country:"Malaysia Ringgit",symbol:"MYR",charCode:"RM"},{country:"Mauritius Rupee",symbol:"MUR",charCode:"₨"},{country:"Mexico Peso",symbol:"MXN",charCode:"$"},{country:"Mongolia Tughrik",symbol:"MNT",charCode:"₮"},{country:"Mozambique Metical",symbol:"MZN",charCode:"MT"},{country:"Namibia Dollar",symbol:"NAD",charCode:"$"},{country:"Nepal Rupee",symbol:"NPR",charCode:"₨"},{country:"Netherlands Antilles Guilder",symbol:"ANG",charCode:"ƒ"},{country:"New Zealand Dollar",symbol:"NZD",charCode:"$"},{country:"Nicaragua Cordoba",symbol:"NIO",charCode:"C$"},{country:"Nigeria Naira",symbol:"NGN",charCode:"₦"},{country:"Norway Krone",symbol:"NOK",charCode:"kr"},{country:"Oman Rial",symbol:"OMR",charCode:"﷼"},{country:"Pakistan Rupee",symbol:"PKR",charCode:"₨"},{country:"Panama Balboa",symbol:"PAB",charCode:"B/."},{country:"Paraguay Guarani",symbol:"PYG",charCode:"Gs"},{country:"Peru Sol",symbol:"PEN",charCode:"S/."},{country:"Philippines Peso",symbol:"PHP",charCode:"₱"},{country:"Poland Zloty",symbol:"PLN",charCode:"zł"},{country:"Qatar Riyal",symbol:"QAR",charCode:"﷼"},{country:"Romania Leu",symbol:"RON",charCode:"lei"},{country:"Russia Ruble",symbol:"RUB",charCode:"₽"},{country:"Saint Helena Pound",symbol:"SHP",charCode:"£"},{country:"Saudi Arabia Riyal",symbol:"SAR",charCode:"﷼"},{country:"Serbia Dinar",symbol:"RSD",charCode:"Дин."},{country:"Seychelles Rupee",symbol:"SCR",charCode:"₨"},{country:"Singapore Dollar",symbol:"SGD",charCode:"$"},{country:"Solomon Islands Dollar",symbol:"SBD",charCode:"$"},{country:"Somalia Shilling",symbol:"SOS",charCode:"S"},{country:"South Africa Rand",symbol:"ZAR",charCode:"R"},{country:"Sri Lanka Rupee",symbol:"LKR",charCode:"₨"},{country:"Sweden Krona",symbol:"SEK",charCode:"kr"},{country:"Switzerland Franc",symbol:"CHF",charCode:"CHF"},{country:"Suriname Dollar",symbol:"SRD",charCode:"$"},{country:"Syria Pound",symbol:"SYP",charCode:"£"},{country:"Taiwan New Dollar",symbol:"TWD",charCode:"NT$"},{country:"Thailand Baht",symbol:"THB",charCode:"฿"},{country:"Trinidad and Tobago Dollar",symbol:"TTD",charCode:"TT$"},{country:"Turkey Lira",symbol:"TRY",charCode:""},{country:"Tuvalu Dollar",symbol:"TVD",charCode:"$"},{country:"Ukraine Hryvnia",symbol:"UAH",charCode:"₴"},{country:"United Kingdom Pound",symbol:"GBP",charCode:"£"},{country:"United States Dollar",symbol:"USD",charCode:"$"},{country:"Uruguay Peso",symbol:"UYU",charCode:"$U"},{country:"Venezuela Bolívar",symbol:"VEF",charCode:"Bs"},{country:"Viet Nam Dong",symbol:"VND",charCode:"₫"}]},14250:(e,t,a)=>{"use strict";a.d(t,{T:()=>o,l:()=>l});const o=function(e,t=!1){if(!e)return t?"0":"0.00000000";let a=(e%1).toFixed(8).toString().replace("0.",".");if("0"===a&&(a=t?"0":"00000000"),t){while("0"===a[a.length-1])a=a.substring(0,a.length-2);"."===a&&(a="")}return console.log(a,"duoi"),parseInt(e.toString()).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")+a},l=function(e,t=""){return t+e.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,"$1,")}},98690:(e,t,a)=>{"use strict";a.d(t,{Z:()=>We});var o=a(83673),l=a(62323),r=a(14618),n=a.n(r);const s={class:"q-layout-container fix-flex-mobile600",style:{display:"flex","justify-content":"space-between","max-width":"720px",margin:"0 auto"}},i={class:"text-center flex-center col-12 col-sm-12"},d={style:{"font-size":"24px",padding:"20px 0px"}},c=(0,o._)("p",{class:"text-amber"},"Public Node",-1),u={class:"justify-center flex",style:{height:"320px","text-align":"justify!important"}},m={class:"box box2 card-dark"},p=(0,o._)("span",null,null,-1),y=(0,o._)("span",null,null,-1),b=(0,o._)("span",null,null,-1),f=(0,o._)("span",null,null,-1),h={class:"content"},g=(0,o.Uk)("MINIMUM COLLATERAL"),w=(0,o.Uk)("Participants"),_=(0,o.Uk)("Collateral"),C=(0,o.Uk)("Collateral Remaining"),S={class:"text-amber",style:{"margin-top":"10px","font-size":"16px"}},$=(0,o.Uk)(" You need to enable Two Factor Authentication "),N={key:0,class:"text-center col-12 col-sm-12"},P=(0,o._)("p",{class:"text-amber mb-fix-ma-top"},"Private Node",-1),v={class:"justify-center flex",style:{height:"320px","text-align":"justify!important"}},k={class:"box box2 card-dark"},W=(0,o._)("span",null,null,-1),x=(0,o._)("span",null,null,-1),A=(0,o._)("span",null,null,-1),R=(0,o._)("span",null,null,-1),U={class:"content"},q=(0,o.Uk)("MINIMUM COLLATERAL"),T=(0,o.Uk)("FULL"),D=(0,o.Uk)("Private nodes let you keep RTM secure in your own wallet"),Z=(0,o.Uk)("Please contact us for more infomation"),M=(0,o.Uk)(" COMING SOOM! ");function E(e,t,a,r,E,O){const j=(0,o.up)("q-img"),B=(0,o.up)("q-item-label"),F=(0,o.up)("q-item-section"),I=(0,o.up)("q-item"),Q=(0,o.up)("q-separator"),V=(0,o.up)("q-linear-progress"),z=(0,o.up)("q-list"),H=(0,o.up)("q-tooltip"),L=(0,o.up)("q-btn"),J=(0,o.up)("q-space"),K=(0,o.up)("q-bar"),Y=(0,o.up)("q-input"),G=(0,o.up)("q-icon"),X=(0,o.up)("q-card-section"),ee=(0,o.up)("q-card-actions"),te=(0,o.up)("q-form"),ae=(0,o.up)("q-card"),oe=(0,o.up)("q-dialog"),le=(0,o.Q2)("close-popup");return(0,o.wg)(),(0,o.iD)("div",s,[(0,o._)("div",i,[e.isPage?((0,o.wg)(),(0,o.j4)(j,{key:0,class:"logo-raptornodes hidden-mobile600",src:n(),style:{margin:"10px 0px"}})):(0,o.kq)("",!0),(0,o._)("span",d,"Onboarding - RaptorNode #"+(0,l.zw)(e.smartNodeEnough.label),1),c,(0,o._)("div",u,[(0,o._)("div",m,[p,y,b,f,(0,o._)("div",h,[(0,o.Wm)(z,{separator:""},{default:(0,o.w5)((()=>[(0,o.Wm)(I,{class:"fix-pad-6"},{default:(0,o.w5)((()=>[(0,o.Wm)(F,null,{default:(0,o.w5)((()=>[(0,o.Wm)(B,{class:"text-bold text-left lbb"},{default:(0,o.w5)((()=>[g])),_:1})])),_:1}),(0,o.Wm)(F,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(B,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,l.zw)(e.variableSystem.collateralMin)+" RTM",1)])),_:1})])),_:1})])),_:1}),(0,o.Wm)(Q),(0,o.Wm)(I,{class:"fix-pad-6"},{default:(0,o.w5)((()=>[(0,o.Wm)(F,{class:"text-bold text-left lbb"},{default:(0,o.w5)((()=>[(0,o.Wm)(B,null,{default:(0,o.w5)((()=>[w])),_:1})])),_:1}),(0,o.Wm)(F,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(B,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,l.zw)(e.smartNodeEnough.participants?e.smartNodeEnough.participants.length:0),1)])),_:1})])),_:1})])),_:1}),(0,o.Wm)(Q),(0,o.Wm)(I,{class:"fix-pad-6"},{default:(0,o.w5)((()=>[(0,o.Wm)(F,{class:"text-bold text-left lbb"},{default:(0,o.w5)((()=>[(0,o.Wm)(B,null,{default:(0,o.w5)((()=>[_])),_:1})])),_:1}),(0,o.Wm)(F,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(B,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,l.zw)(e.formatPrice(Math.round(1e3*e.collateralJoin)/1e3,!0))+"/"+(0,l.zw)(e.formatPrice(Math.round(1e3*e.variableSystem.collateral)/1e3,!0))+" RTM",1)])),_:1})])),_:1})])),_:1}),(0,o.Wm)(Q),(0,o.Wm)(I,{class:"fix-pad-6"},{default:(0,o.w5)((()=>[(0,o.Wm)(F,{class:"text-bold text-left lbb"},{default:(0,o.w5)((()=>[(0,o.Wm)(B,null,{default:(0,o.w5)((()=>[C])),_:1})])),_:1}),(0,o.Wm)(F,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(B,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,l.zw)(e.formatPrice(Math.round(1e3*(e.variableSystem.collateral-e.collateralJoin))/1e3,!0))+" RTM",1)])),_:1})])),_:1})])),_:1}),(0,o.Wm)(Q),(0,o.Wm)(I,{class:"fix-pad-6",dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(F,null,{default:(0,o.w5)((()=>[(0,o.Wm)(V,{color:"white","animation-speed":"100",dark:"",value:e.collateralJoin/e.variableSystem.collateral,class:""},null,8,["value"])])),_:1})])),_:1}),e.meCollateralJoin?((0,o.wg)(),(0,o.j4)(I,{key:0,dense:""},{default:(0,o.w5)((()=>[(0,o.Wm)(F,null,{default:(0,o.w5)((()=>[(0,o._)("p",S,"Your collateral: "+(0,l.zw)(Math.round(1e3*e.meCollateralJoin)/1e3)+" RTM",1)])),_:1})])),_:1})):(0,o.kq)("",!0)])),_:1})])])]),(0,o.Wm)(L,{disable:!e.me.enableTfa&&""!==e.me._id,label:""===e.smartNodeEnough._id?"Wait next time":""!==e.me._id?e.meCollateralJoin?"JOIN MORE":"JOIN NOW":"SIGN UP",class:(0,l.C_)((e.isPage?"q-mt-lg":"q-mt-sm")+" custom-btn"),style:{width:"320px"},"dark-percentage":"",size:"1.4em",onClick:e.joinNow},{default:(0,o.w5)((()=>[e.me&&!e.me.enableTfa&&""!==e.me._id?((0,o.wg)(),(0,o.j4)(H,{key:0,class:"bg-red"},{default:(0,o.w5)((()=>[$])),_:1})):(0,o.kq)("",!0)])),_:1},8,["disable","label","class","onClick"])]),e.isPage?((0,o.wg)(),(0,o.iD)("div",N,[e.isPage?((0,o.wg)(),(0,o.j4)(j,{key:0,class:"logo-raptornodes hidden-mobile600",src:n(),style:{margin:"10px 0px"}})):(0,o.kq)("",!0),P,(0,o._)("div",v,[(0,o._)("div",k,[W,x,A,R,(0,o._)("div",U,[(0,o.Wm)(z,{separator:""},{default:(0,o.w5)((()=>[(0,o.Wm)(I,null,{default:(0,o.w5)((()=>[(0,o.Wm)(F,{class:"text-bold text-left lbb"},{default:(0,o.w5)((()=>[(0,o.Wm)(B,null,{default:(0,o.w5)((()=>[q])),_:1})])),_:1}),(0,o.Wm)(F,{side:""},{default:(0,o.w5)((()=>[(0,o.Wm)(B,{caption:""},{default:(0,o.w5)((()=>[T])),_:1})])),_:1})])),_:1}),(0,o.Wm)(Q),(0,o.Wm)(I,null,{default:(0,o.w5)((()=>[(0,o.Wm)(F,{class:"text-left lbb"}),(0,o.Wm)(F,{side:""})])),_:1}),(0,o.Wm)(Q),(0,o.Wm)(I,null,{default:(0,o.w5)((()=>[(0,o.Wm)(F,{class:"text-bold text-left lbb"},{default:(0,o.w5)((()=>[(0,o.Wm)(B,null,{default:(0,o.w5)((()=>[D])),_:1})])),_:1})])),_:1}),(0,o.Wm)(Q),(0,o.Wm)(I,null,{default:(0,o.w5)((()=>[(0,o.Wm)(F,{class:"text-bold text-left lbb"},{default:(0,o.w5)((()=>[(0,o.Wm)(B,null,{default:(0,o.w5)((()=>[Z])),_:1})])),_:1})])),_:1}),(0,o.Wm)(Q)])),_:1})])])]),(0,o.Wm)(L,{label:"COMING SOOM",disable:"",class:(0,l.C_)((e.isPage?"q-mt-lg":"q-mt-sm")+" custom-btn"),style:{width:"320px"},"dark-percentage":"",size:"1.4em",onClick:e.joinNow},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{"transition-show":"scale","transition-hide":"scale"},{default:(0,o.w5)((()=>[M])),_:1})])),_:1},8,["class","onClick"])])):(0,o.kq)("",!0),(0,o.Wm)(oe,{modelValue:e.dialog,"onUpdate:modelValue":t[4]||(t[4]=t=>e.dialog=t),style:{"min-width":"50vw"},persistent:""},{default:(0,o.w5)((()=>[(0,o.Wm)(ae,null,{default:(0,o.w5)((()=>[(0,o.Wm)(K,null,{default:(0,o.w5)((()=>[(0,o._)("div",null,"Balance:"+(0,l.zw)(e.balance)+"RTM - "+(0,l.zw)(e.currency.charCode)+(0,l.zw)(e.formatMoney(e.currentPrice*e.balance))+" "+(0,l.zw)(e.currency.symbol),1),(0,o.Wm)(J)])),_:1}),(0,o.Wm)(te,{onSubmit:e.joinRequest},{default:(0,o.w5)((()=>[(0,o.Wm)(X,{style:{overflow:"hidden","min-width":"320px"}},{default:(0,o.w5)((()=>[(0,o.Wm)(Y,{class:"q-pa-sm",modelValue:e.amount,"onUpdate:modelValue":t[1]||(t[1]=t=>e.amount=t),modelModifiers:{number:!0},label:"Amount",rules:[t=>0!==t&&t<=e.balance&&t<=e.variableSystem.collateral-e.collateralJoin||"Please use maximum "+(e.variableSystem.collateral-e.collateralJoin<e.balance?e.variableSystem.collateral-e.collateralJoin:e.balance)]},{append:(0,o.w5)((()=>[(0,o.Wm)(L,{label:"All",onClick:t[0]||(t[0]=t=>e.amount=e.variableSystem.collateral-e.collateralJoin<e.balance?e.variableSystem.collateral-e.collateralJoin:e.balance)})])),_:1},8,["modelValue","rules"]),e.me.enableTfa?((0,o.wg)(),(0,o.j4)(Y,{key:0,class:"q-pa-sm",modelValue:e.tfa,"onUpdate:modelValue":t[3]||(t[3]=t=>e.tfa=t),type:e.isPwd?"password":"text",label:"2FA",rules:[t=>""!==t||!e.me.enableTfa||"Please input 2FA"]},{append:(0,o.w5)((()=>[(0,o.Wm)(G,{name:e.isPwd?"visibility_off":"visibility",class:"cursor-pointer",onClick:t[2]||(t[2]=t=>e.isPwd=!e.isPwd)},null,8,["name"])])),_:1},8,["modelValue","type","rules"])):(0,o.kq)("",!0)])),_:1}),(0,o.Wm)(ee,{align:"right"},{default:(0,o.w5)((()=>[(0,o.wy)((0,o.Wm)(L,{flat:"",label:"CLOSE",color:"red"},null,512),[[le]]),(0,o.Wm)(L,{flat:"",label:"Join",color:"primary",type:"submit"})])),_:1})])),_:1},8,["onSubmit"])])),_:1})])),_:1},8,["modelValue"])])}var O,j,B,F,I=a(85777),Q=a(76392),V=a(55181),z=a(61621),H=a(94756),L=a(51473),J=a(93567),K=a(14250),Y=a(1949),G=a(64434),X=function(e,t,a,o){var l,r=arguments.length,n=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,a):o;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)n=Reflect.decorate(e,t,a,o);else for(var s=e.length-1;s>=0;s--)(l=e[s])&&(n=(r<3?l(n):r>3?l(t,a,n):l(t,a))||n);return r>3&&n&&Object.defineProperty(t,a,n),n},ee=function(e,t){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(e,t)};let te=class extends I.w3{isPage;hiddenPrivate;variableSystem;me;balance;currency;currentPrice;smartNodeEnough;dialog=!1;amount=0;tfa="";isPwd=!0;formatPrice=K.T;get meCollateralJoin(){if(!this.me||""===this.me._id)return 0;if(!this.smartNodeEnough.participants)return 0;let e=this.smartNodeEnough.participants.find((e=>"object"===typeof e.userId&&e.userId._id===this.me._id));return e&&e.collateral||0}get collateralJoin(){let e=0;return this.smartNodeEnough.participants&&this.smartNodeEnough.participants.forEach((t=>{e+=t.collateral})),e}joinNow(){""!==this.smartNodeEnough._id?""===this.me._id?(localStorage.setItem("goToMynodes","true"),this.goLogin()):this.dialog=!0:G.Z.create({message:"Wait next time",color:"red",position:"bottom"})}formatMoney=K.l;async joinRequest(){const e=await this.$apollo.mutate({mutation:J.$k,variables:{_id:this.smartNodeEnough._id,amount:this.amount,token:this.me&&this.me.enableTfa?this.tfa:null}}).catch((e=>(G.Z.create({message:"Error:"+e.toString(),color:"red",position:"bottom"}),!1)));e&&(this.dialog=!1,this.tfa="",G.Z.create({message:"Join Done",color:"blue",position:"bottom"}),await this.$store.dispatch("smartNode/getSmartNodeEnough"),await this.$store.dispatch("balance/getBalance"))}goLogin(){this.$router.push({path:"login"}).then((e=>{console.log(e)}))}async created(){this.$store.dispatch("balance/getVariableSystem").then((()=>{console.log("thuwr")})),await this.$store.dispatch("smartNode/getSmartNodeEnough").catch((()=>{console.log("done")})),this.balance||await this.$store.dispatch("balance/getBalance").catch((()=>{console.log("done")})),console.log("done")}};X([(0,Q.f)({type:Boolean,default:()=>!1}),ee("design:type",Boolean)],te.prototype,"isPage",void 0),X([(0,Q.f)({type:Boolean,default:()=>!1}),ee("design:type",Boolean)],te.prototype,"hiddenPrivate",void 0),X([(0,V.ZM)((e=>e.balance.variableSystem)),ee("design:type","function"===typeof(O="undefined"!==typeof z.W&&z.W)?O:Object)],te.prototype,"variableSystem",void 0),X([(0,V.ZM)((e=>e.user.me)),ee("design:type","function"===typeof(j="undefined"!==typeof H.e&&H.e)?j:Object)],te.prototype,"me",void 0),X([(0,V.ZM)((e=>e.balance.balance)),ee("design:type",Number)],te.prototype,"balance",void 0),X([(0,V.ZM)((e=>e.balance.currency)),ee("design:type","function"===typeof(B="undefined"!==typeof Y.Z&&Y.Z)?B:Object)],te.prototype,"currency",void 0),X([(0,V.ZM)((e=>e.balance.market?e.balance.market.current_price:1)),ee("design:type",Number)],te.prototype,"currentPrice",void 0),X([(0,V.ZM)((e=>e.smartNode.smartNodeEnough)),ee("design:type","function"===typeof(F="undefined"!==typeof L.Z&&L.Z)?F:Object)],te.prototype,"smartNodeEnough",void 0),te=X([(0,I.Ei)({name:"joinNode"})],te);const ae=te;var oe=a(74260),le=a(83066),re=a(24027),ne=a(27011),se=a(83414),ie=a(52035),de=a(2350),ce=a(65869),ue=a(69721),me=a(51598),pe=a(2165),ye=a(5363),be=a(46778),fe=a(10151),he=a(10846),ge=a(62025),we=a(68689),_e=a(25589),Ce=a(64689),Se=a(24554),$e=a(99367),Ne=a(60677),Pe=a(7518),ve=a.n(Pe);const ke=(0,oe.Z)(ae,[["render",E]]),We=ke;ve()(ae,"components",{QLayout:le.Z,QImg:re.Z,QList:ne.Z,QItem:se.Z,QItemSection:ie.Z,QItemLabel:de.Z,QSeparator:ce.Z,QBadge:ue.Z,QLinearProgress:me.Z,QBtn:pe.Z,QTooltip:ye.Z,QDialog:be.Z,QCard:fe.Z,QBar:he.Z,QSpace:ge.Z,QForm:we.Z,QCardSection:_e.Z,QInput:Ce.Z,QIcon:Se.Z,QCardActions:$e.Z}),ve()(ae,"directives",{ClosePopup:Ne.Z})},93643:(e,t,a)=>{"use strict";a.d(t,{Z:()=>q});var o=a(83673),l=a(62323),r=a(98880);const n=(0,o._)("p",{class:"text-h5 text-left"},null,-1),s=(0,o.Uk)("Rewarded: "),i=(0,o.Uk)(" RTM"),d=["src"],c={class:""};function u(e,t,a,u,m,p){const y=(0,o.up)("q-space"),b=(0,o.up)("q-input"),f=(0,o.up)("q-select"),h=(0,o.up)("q-th"),g=(0,o.up)("q-tr"),w=(0,o.up)("q-btn"),_=(0,o.up)("q-td"),C=(0,o.up)("q-avatar"),S=(0,o.up)("q-table");return(0,o.wg)(),(0,o.j4)(S,{rows:e.rewardHistorys,columns:e.columns,"row-key":"name","visible-columns":e.visibleColumns,dark:"",style:{width:"100%"},pagination:e.initialPagination,filter:e.search,class:"card-dark",color:"amber"},{top:(0,o.w5)((()=>[n,(0,o._)("span",null,[s,(0,o._)("b",null,(0,l.zw)(e.formatPrice(e.rewarded)),1),i]),(0,o.Wm)(y),(0,o.Wm)(b,{modelValue:e.search,"onUpdate:modelValue":t[0]||(t[0]=t=>e.search=t),dense:"",placeholder:"Search Rewards.."},null,8,["modelValue"]),(0,o.Wm)(f,{modelValue:e.visibleColumns,"onUpdate:modelValue":t[1]||(t[1]=t=>e.visibleColumns=t),multiple:"",outlined:"",dense:"","options-dense":"","display-value":e.$q.lang.table.columns,"emit-value":"","map-options":"",options:e.columns,"option-value":"name","options-cover":"",style:{"min-width":"150px"}},null,8,["modelValue","display-value","options"])])),header:(0,o.w5)((e=>[(0,o.Wm)(g,{props:e},{default:(0,o.w5)((()=>[(0,o.Wm)(h,{"auto-width":""}),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.cols,(t=>((0,o.wg)(),(0,o.j4)(h,{key:t.name,props:e},{default:(0,o.w5)((()=>[(0,o.Uk)((0,l.zw)(t.label),1)])),_:2},1032,["props"])))),128))])),_:2},1032,["props"])])),body:(0,o.w5)((t=>[(0,o.Wm)(g,{props:t},{default:(0,o.w5)((()=>[(0,o.Wm)(_,{"auto-width":""},{default:(0,o.w5)((()=>[(0,o.Wm)(w,{size:"sm",round:"",dense:"",color:t.row.txid&&""!==t.row.txid?"blue":"red",onClick:a=>e.showTransition(t.row.txid),icon:"eva-external-link-outline"},null,8,["color","onClick"])])),_:2},1024),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.cols,(e=>((0,o.wg)(),(0,o.j4)(_,{key:e.name,props:t},{default:(0,o.w5)((()=>["avatar"===e.name?((0,o.wg)(),(0,o.j4)(C,{key:0},{default:(0,o.w5)((()=>[(0,o._)("img",{src:e.value},null,8,d)])),_:2},1024)):((0,o.wg)(),(0,o.iD)(o.HY,{key:1},[(0,o.Uk)((0,l.zw)(e.value),1)],64))])),_:2},1032,["props"])))),128)),(0,o.Wm)(_,{"auto-width":""},{default:(0,o.w5)((()=>[(0,o.Wm)(w,{size:"sm",round:"",dense:"",onClick:a=>e.showTransition(t.row.txid),icon:"eva-external-link-outline"},null,8,["onClick"])])),_:2},1024)])),_:2},1032,["props"]),(0,o.wy)((0,o.Wm)(g,{props:t},{default:(0,o.w5)((()=>[(0,o.Wm)(_,{colspan:"100%"},{default:(0,o.w5)((()=>[(0,o._)("div",c,(0,l.zw)(t.row.answer),1)])),_:2},1024)])),_:2},1032,["props"]),[[r.F8,t.expand]])])),_:1},8,["rows","columns","visible-columns","pagination","filter"])}var m=a(14250),p=a(85777),y=a(76392),b=a(55181),f=function(e,t,a,o){var l,r=arguments.length,n=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,a):o;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)n=Reflect.decorate(e,t,a,o);else for(var s=e.length-1;s>=0;s--)(l=e[s])&&(n=(r<3?l(n):r>3?l(t,a,n):l(t,a))||n);return r>3&&n&&Object.defineProperty(t,a,n),n},h=function(e,t){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(e,t)};let g=class extends p.w3{rewardHistorys;isAdmin;moreVisibleColumns;rewarded;showTransition;showAddress;initialPagination={sortBy:"createdAt",descending:!0,page:1,rowsPerPage:10};search="";visibleColumns=["amount","paymentsPerDay","dayEnd","description","days","address","createdAt"];columns=[{name:"amount",label:"Amount",align:"left",field:"amount",sortable:!0},{name:"collateral",label:"Collateral",align:"left",field:"collateral",sortable:!0},{name:"percentOfNode",label:"PercentOfNode",align:"left",field:"percentOfNode",sortable:!0},{name:"paymentsPerDay",label:"PaymentsPerDay",align:"left",field:"paymentsPerDay",sortable:!0},{name:"dayEnd",label:"DayEnd",align:"center",field:"dayEnd",sortable:!0},{name:"description",required:!0,label:"Description",align:"center",field:"description",sortable:!0},{name:"days",label:"Days",align:"center",field:"days",sortable:!0},{name:"createdAt",required:!0,label:"CreatedAt",align:"center",field:"createdAt",sortable:!0}];formatPrice(e){return(0,m.T)(e)}formatMoney(e){return(0,m.l)(e)}created(){this.visibleColumns=this.visibleColumns.concat(this.moreVisibleColumns),this.isAdmin&&(this.columns=[{name:"avatar",label:"Avatar",align:"left",field:e=>e.user&&e.user.profile?e.user.profile.picture:"",sortable:!0},{name:"name",label:"Name",align:"left",field:e=>e.user&&e.user.profile?e.user.profile.name:"",sortable:!0},{name:"email",label:"Email",align:"left",field:e=>e.user?e.user.email:"",sortable:!0}].concat(this.columns))}};f([(0,y.f)({type:Array,default:()=>[]}),h("design:type",Array)],g.prototype,"rewardHistorys",void 0),f([(0,y.f)({type:Boolean,default:()=>!1}),h("design:type",Boolean)],g.prototype,"isAdmin",void 0),f([(0,y.f)({type:Array,default:()=>[]}),h("design:type",Array)],g.prototype,"moreVisibleColumns",void 0),f([(0,y.f)({type:Number,default:()=>0}),h("design:type",Number)],g.prototype,"rewarded",void 0),f([(0,b.aU)("balance/showTransition"),h("design:type",void 0)],g.prototype,"showTransition",void 0),f([(0,b.aU)("balance/showAddress"),h("design:type",void 0)],g.prototype,"showAddress",void 0),g=f([(0,p.Ei)({name:"RewardHistory"})],g);const w=g;var _=a(74260),C=a(30673),S=a(62025),$=a(64689),N=a(63314),P=a(18186),v=a(92414),k=a(83884),W=a(2165),x=a(75096),A=a(7518),R=a.n(A);const U=(0,_.Z)(w,[["render",u]]),q=U;R()(w,"components",{QTable:C.Z,QSpace:S.Z,QInput:$.Z,QSelect:N.Z,QTr:P.Z,QTh:v.Z,QTd:k.Z,QBtn:W.Z,QAvatar:x.Z})},14618:(e,t,a)=>{e.exports=a.p+"img/raptornodes-white.4463eeab.png"}}]);