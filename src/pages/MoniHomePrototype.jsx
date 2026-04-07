import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

const C = {
  bg:"#F5F0EB", white:"#FFF", dark:"#222", coral:"#FF6B6B", blue:"#7EC8E3",
  yellow:"#F9D56E", mint:"#4ECDC4", amber:"#E88B4D", gray:"#C5C5C5",
  muted:"#999", sub:"#888", border:"#DDD", bL:"#EEE",
  warmBg:"#FFF8F0", warmBd:"#F0C89A", pinkBg:"#FFF0F0", pinkBd:"#FFB8B8",
  gBg:"#F0F8F0", gT:"#3B6D11", bBg:"#EBF5FF", oBg:"#FFF5EB", purple:"#B8A0D2", burg:"#C97B84",
};

const CAT = {
  meal:{l:"正餐",c:"#D85A30",bg:C.pinkBg,ic:["🍜","🍱","🍚","🥢"]},
  snack:{l:"零食",c:"#854F0B",bg:"#FFF8EB",ic:["☕","🧋","🍪","🍦"]},
  transport:{l:"交通",c:"#185FA5",bg:C.bBg,ic:["🚗","🚇","🚌","⛽"]},
  entertainment:{l:"娱乐",c:"#7B2D8B",bg:"#F6EEFA",ic:["🎬","🎮","🎵","🎭"]},
  feast:{l:"大餐",c:"#8B2252",bg:"#FFF0F5",ic:["🍷","🥘","🎂","🦞"]},
  health:{l:"健康",c:"#1A7A4C",bg:"#EEFAF3",ic:["💊","🏥","💪","🧘"]},
  shopping:{l:"购物",c:"#534AB7",bg:"#F3EEFA",ic:["🛍️","📦","👕","🎁"]},
  education:{l:"教育",c:"#2D6A9F",bg:"#EDF5FC",ic:["📚","🎓","✏️","💻"]},
  housing:{l:"居住",c:"#6B5B3E",bg:"#FBF6EE",ic:["🏠","💡","🔧","🚿"]},
  travel:{l:"旅行",c:"#0E7C6B",bg:"#E8FAF5",ic:["✈️","🏨","🎫","🗺️"]},
  others:{l:"其他",c:"#666",bg:"#F5F5F5",ic:["📝","💰","🔖","📌"]},
};

const FILTERS=[{k:"all",l:"全部"},...Object.entries(CAT).filter(([k])=>k!=="others").map(([k,v])=>({k,l:v.l})),{k:"others",l:"其他"},{k:"uncat",l:"未分类"}];

const TX=[
  {day:"today",label:"今天",total:187,items:[
    {id:1,n:"杨国福麻辣烫",a:45,t:"18:10",cat:"meal",ih:0,s:"wechat",ai:"餐饮商户，正餐时段",u:true},
    {id:2,n:"滴滴出行",a:23,t:"16:30",cat:"transport",ih:0,s:"alipay",ai:"出行平台",u:false},
    {id:3,n:"瑞幸咖啡",a:18,t:"14:20",cat:"snack",ih:0,s:"wechat",ai:"咖啡饮品",u:true},
    {id:4,n:"益禾堂",a:12,t:"19:40",cat:null,ih:0,s:"wechat",ai:null,u:false},
    {id:5,n:"美团外卖",a:56,t:"12:05",cat:"meal",ih:1,s:"wechat",ai:"外卖午餐",u:false},
    {id:6,n:"全家便利店",a:33,t:"20:15",cat:null,ih:0,s:"alipay",ai:null,u:false},
  ]},
  {day:"yest",label:"昨天",total:251,items:[
    {id:7,n:"海底捞火锅",a:180,t:"19:10",cat:"feast",ih:1,s:"alipay",ai:"火锅双人大餐",u:true},
    {id:8,n:"地铁充值",a:50,t:"08:30",cat:"transport",ih:1,s:"alipay",ai:"公共交通",u:false},
    {id:9,n:"蜜雪冰城",a:6,t:"15:00",cat:"snack",ih:1,s:"wechat",ai:"饮品",u:true},
    {id:10,n:"网易云会员",a:15,t:"22:00",cat:"entertainment",ih:2,s:"alipay",ai:"订阅服务",u:false},
  ]},
  {day:"apr5",label:"4月5日",total:248,items:[
    {id:11,n:"肯德基",a:42,t:"12:30",cat:"meal",ih:0,s:"wechat",ai:"快餐午餐",u:false},
    {id:12,n:"京东购物",a:128,t:"09:00",cat:"shopping",ih:1,s:"alipay",ai:"网购日用",u:true},
    {id:13,n:"话费充值",a:50,t:"16:00",cat:"housing",ih:1,s:"wechat",ai:"生活缴费",u:true},
    {id:14,n:"奈雪的茶",a:28,t:"15:20",cat:null,ih:0,s:"wechat",ai:null,u:false},
  ]},
  {day:"apr4",label:"4月4日",total:143,items:[
    {id:15,n:"星巴克",a:38,t:"10:00",cat:"snack",ih:0,s:"alipay",ai:"咖啡饮品",u:false},
    {id:16,n:"电影票",a:80,t:"14:00",cat:"entertainment",ih:0,s:"wechat",ai:"影院消费",u:true},
    {id:17,n:"打车回家",a:25,t:"23:00",cat:"transport",ih:0,s:"alipay",ai:"夜间出行",u:false},
  ]},
];

const TREND=Array.from({length:21},(_,i)=>[120,95,180,45,210,88,156,67,142,53,198,110,75,230,89,165,42,190,78,135,105][i]);
const TDATES=Array.from({length:21},(_,i)=>{const d=new Date(2026,3,7);d.setDate(d.getDate()-(20-i));return `${d.getMonth()+1}/${d.getDate()}`;});

function memphis(seed,n,b){const sh=[];let s=seed;const r=()=>{s=(s*16807)%2147483647;return s/2147483647;};const cols=[C.coral,C.blue,C.yellow,C.mint,C.amber,C.purple];const types=["c","s","t","z"];for(let i=0;i<n;i++){const tp=types[Math.floor(r()*types.length)];sh.push({tp,cl:cols[Math.floor(r()*cols.length)],x:b.x+r()*b.w,y:b.y+r()*b.h,sz:5+r()*9,rot:r()*40,op:.07+r()*0.1,id:i});}return sh;}

const Decor=()=>{const sh=useMemo(()=>memphis(777,7,{x:0,y:60,w:370,h:700}),[]);return(<svg style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0,overflow:"visible"}} width="100%" height="100%">{sh.map(s=>{if(s.tp==="c")return<circle key={s.id} cx={s.x} cy={s.y} r={s.sz/2} fill={s.cl} opacity={s.op}/>;if(s.tp==="s")return<rect key={s.id} x={s.x} y={s.y} width={s.sz} height={s.sz} rx={1.5} fill={s.cl} opacity={s.op} transform={`rotate(${s.rot} ${s.x+s.sz/2} ${s.y+s.sz/2})`}/>;if(s.tp==="t")return<polygon key={s.id} points={`${s.x},${s.y+s.sz} ${s.x+s.sz/2},${s.y} ${s.x+s.sz},${s.y+s.sz}`} fill={s.cl} opacity={s.op}/>;if(s.tp==="z")return<line key={s.id} x1={s.x} y1={s.y} x2={s.x+s.sz*1.5} y2={s.y} stroke={s.cl} strokeWidth={2} strokeLinecap="round" opacity={s.op}/>;return null;})}</svg>);};

const Logo=()=>(<svg width="118" height="38" viewBox="0 0 140 42"><text x="4" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">M</text><circle cx="25" cy="32" r="1.8" fill={C.coral} opacity=".75"/><text x="30" y="32" fill={C.dark} fontSize="28" fontWeight="800" fontFamily="'Nunito',sans-serif" letterSpacing="-1">oni</text><circle cx="27" cy="9" r="3.6" fill={C.coral} opacity=".72"/><circle cx="20" cy="5" r="2.4" fill={C.blue} opacity=".62"/><rect x="23" y="2.5" width="4" height="4" rx=".8" fill={C.yellow} opacity=".55" transform="rotate(20 25 4.5)"/><line x1="68" y1="7" x2="75" y2="7" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round" opacity=".35"/></svg>);

const NavIcon=()=>(<svg width="32" height="32" viewBox="0 0 52 52"><path d="M12 40C12 40 12 16 14.5 12C16 10 17 10.5 23 24C23 24 24 26.5 25 24C26 21.5 29 10.5 30.5 12C32 13.5 33 40 33 40" stroke="#F5F0EB" strokeWidth="3.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="38" cy="13" r="4.5" fill={C.coral} opacity=".85"/><circle cx="31" cy="7.5" r="3" fill={C.blue} opacity=".75"/><rect x="34.5" y="5.5" width="4.5" height="4.5" rx="1" fill={C.yellow} opacity=".65" transform="rotate(18 36.5 7.5)"/></svg>);

const Tag=({cat})=>{const m=CAT[cat];if(!m)return null;return<span style={{fontSize:10,padding:"1px 7px",borderRadius:4,fontWeight:600,background:m.bg,color:m.c,whiteSpace:"nowrap"}}>{m.l}</span>;};

export default function MoniHome(){
  const[ci,setCi]=useState(0);
  const[tOff,setTOff]=useState(0);
  const[fc,setFc]=useState("all");
  const[aiOn,setAiOn]=useState(false);
  const[aiStop,setAiStop]=useState(false);
  const[hint,setHint]=useState(true);
  const[drag,setDrag]=useState(null);
  const[dHov,setDHov]=useState(null);
  const[descIn,setDescIn]=useState(false);
  const[clsIt,setClsIt]=useState(null);
  const[ctrlO,setCtrlO]=useState(false);
  const[ctrlH,setCtrlH]=useState(null);
  const[dr,setDr]=useState("month");
  const[dl,setDl]=useState("本月");
  const[dpOpen,setDpOpen]=useState(false);
  const[scrollExp,setScrollExp]=useState(false);
  const[wi,setWi]=useState(0);
  const[pStick,setPStick]=useState(false);
  const sRef=useRef(null);
  const pRef=useRef(null);
  const lpt=useRef(null);

  useEffect(()=>{const t=setInterval(()=>{setCi(p=>(p+1)%2);},6000);return()=>clearInterval(t);},[]);

  const onScr=useCallback(()=>{const el=sRef.current;if(!el)return;if(el.scrollTop>100&&!scrollExp)setScrollExp(true);if(pRef.current){const r=pRef.current.getBoundingClientRect();const cr=el.getBoundingClientRect();setPStick(r.top<=cr.top+2);}},[scrollExp]);

  const filt=(items)=>{if(fc==="all")return items;if(fc==="uncat")return items.filter(i=>!i.cat);return items.filter(i=>i.cat===fc);};
  const uncN=TX.reduce((s,d)=>s+d.items.filter(i=>!i.cat).length,0);
  const sp=dr==="month"?"本月":dr==="week"?"本周":dr==="today"?"今日":dr==="quarter"?"近三月":"区间";

  const ts=TREND.length-7-tOff*7;
  const tSlice=TREND.slice(Math.max(0,ts),ts+7);
  const tDates=TDATES.slice(Math.max(0,ts),ts+7);
  const tMax=Math.max(...tSlice,1);

  const WV=5;
  const wCats=FILTERS.slice(wi,wi+WV);

  const bPct=62;
  const bCol=bPct<70?C.mint:bPct<90?C.amber:C.coral;

  // NOTE: Soft-stop mechanism
  // When user slides to "off" on AI control strip:
  // 1. aiStop=true → UI shows "停止中…" with amber indicators
  // 2. In-flight LLM requests are NOT cancelled — current batch completes
  // 3. Engine checks stop flag between batch iterations, not mid-request
  // 4. After current batch writes to ledger → Pulse animation → aiOn=false, aiStop=false
  // 5. This ensures no data loss from interrupted network requests
  const toggleAi=(on)=>{if(on){setAiOn(true);setAiStop(false);}else{setAiStop(true);setTimeout(()=>{setAiOn(false);setAiStop(false);},2000);}};

  const doDrop=(k)=>{setClsIt({...drag,nc:k});setDrag(null);setDHov(null);setDescIn(true);};
  const selRange=(k,l)=>{setDr(k);setDl(l);setDpOpen(false);};

  return(
  <div style={{width:"100%",maxWidth:390,margin:"0 auto",background:C.bg,borderRadius:24,border:`2.5px solid ${C.dark}`,overflow:"hidden",position:"relative",fontFamily:"'Nunito',-apple-system,sans-serif",height:780,display:"flex",flexDirection:"column"}}>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
  <style>{`
    @keyframes rb{0%{border-color:${C.coral}}25%{border-color:${C.yellow}}50%{border-color:${C.blue}}75%{border-color:${C.mint}}100%{border-color:${C.coral}}}
    @keyframes rbs{0%{box-shadow:0 0 0 2.5px ${C.coral},0 0 10px ${C.coral}44}25%{box-shadow:0 0 0 2.5px ${C.yellow},0 0 10px ${C.yellow}44}50%{box-shadow:0 0 0 2.5px ${C.blue},0 0 10px ${C.blue}44}75%{box-shadow:0 0 0 2.5px ${C.mint},0 0 10px ${C.mint}44}100%{box-shadow:0 0 0 2.5px ${C.coral},0 0 10px ${C.coral}44}}
    @keyframes p{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes sk{0%,100%{opacity:.4}50%{opacity:.15}}
    @keyframes fu{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes ec{from{max-height:48px;opacity:.7}to{max-height:500px;opacity:1}}
    .ab{animation:rb 3s linear infinite;border-width:2.5px;border-style:solid}
    .ag{animation:rbs 3s linear infinite}
    .sk{animation:sk 1.8s ease-in-out infinite;background:#ddd;border-radius:4px}
    .fi{animation:fu .3s ease-out}
    .ea{animation:ec .5s ease-out forwards;overflow:hidden}
    *{box-sizing:border-box}::-webkit-scrollbar{display:none}
  `}</style>
  <Decor/>

  {/* HEADER */}
  <div style={{padding:"12px 16px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bg,zIndex:20,flexShrink:0,position:"relative"}}>
    <Logo/>
    <div style={{fontSize:12,color:"#666",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"4px 14px",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>日常开销<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 4L5 7L8 4" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg></div>
  </div>

  {/* SCROLL AREA */}
  <div ref={sRef} onScroll={onScr} style={{flex:1,overflowY:"auto",overflowX:"hidden",position:"relative",zIndex:1}}>

  {/* CAROUSEL (vertical) */}
  <div style={{margin:"4px 16px",overflow:"hidden",borderRadius:14,border:`2px solid ${C.dark}`,height:118,position:"relative"}}>
    <div style={{transition:"transform .5s cubic-bezier(.4,0,.2,1)",transform:`translateY(-${ci*100}%)`}}>
      {/* Budget */}
      <div style={{height:118,background:C.white,padding:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3.5,background:`linear-gradient(90deg,${bCol} ${bPct}%,#eee ${bPct}%)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:4}}>
          <div>
            <div style={{fontSize:10,color:C.sub}}>4月预算</div>
            <div style={{fontSize:26,fontWeight:700,color:C.dark,letterSpacing:-1,fontFamily:"'Space Mono',monospace"}}>¥3,128</div>
            <div style={{fontSize:11,color:bCol,marginTop:2}}>剩余 ¥1,872 · 还有 24 天</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:C.sub}}>日均可用</div>
            <div style={{fontSize:18,fontWeight:700,color:C.dark,fontFamily:"'Space Mono',monospace"}}>¥78</div>
          </div>
        </div>
      </div>
      {/* Trend */}
      <div style={{height:118,background:C.white,padding:"10px 14px",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{fontSize:10,color:C.sub}}>近 7 天支出</div>
          <div style={{display:"flex",gap:10}}>
            <span onClick={()=>setTOff(o=>Math.min(o+1,2))} style={{fontSize:16,cursor:"pointer",opacity:tOff<2?.5:.2,userSelect:"none"}}>‹</span>
            <span onClick={()=>setTOff(o=>Math.max(o-1,0))} style={{fontSize:16,cursor:"pointer",opacity:tOff>0?.5:.2,userSelect:"none"}}>›</span>
          </div>
        </div>
        <svg width="100%" height="52" viewBox="0 0 260 52" preserveAspectRatio="none">
          <polyline points={tSlice.map((v,i)=>`${i*(260/6)},${48-(v/tMax)*40}`).join(" ")} fill="none" stroke={C.mint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <polygon points={`${tSlice.map((v,i)=>`${i*(260/6)},${48-(v/tMax)*40}`).join(" ")} 260,48 0,48`} fill={C.mint} opacity=".08"/>
        </svg>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#bbb"}}>
          {tDates.map((d,i)=><span key={i} style={i===tDates.length-1&&tOff===0?{color:C.mint,fontWeight:700}:{}}>{d}</span>)}
        </div>
      </div>
    </div>
    <div style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:4}}>
      {[0,1].map(i=><div key={i} onClick={()=>setCi(i)} style={{width:5,height:5,borderRadius:"50%",background:ci===i?C.dark:"#ccc",cursor:"pointer"}}/>)}
    </div>
  </div>

  {/* HINT */}
  {hint&&<div className="fi" style={{margin:"6px 16px",background:C.warmBg,border:`1.5px solid ${C.warmBd}`,borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
    <span style={{fontSize:13}}>📄</span>
    <div style={{flex:1}}><div style={{fontSize:11,color:"#8B5E2B",fontWeight:700}}>距上次导入已 7 天</div><div style={{fontSize:10,color:"#A07040"}}>导入新账单看看最近花了多少？</div></div>
    <div style={{fontSize:11,color:"#8B5E2B",fontWeight:600,background:C.white,border:"1px solid #E0C09A",borderRadius:6,padding:"3px 10px",cursor:"pointer"}}>导入</div>
    <span style={{fontSize:14,color:"#ccc",cursor:"pointer"}} onClick={()=>setHint(false)}>×</span>
  </div>}

  {/* STATS */}
  <div style={{margin:"6px 16px",display:"flex",gap:6}}>
    {[{l:`${sp}支出`,v:"¥3,128",c:C.coral},{l:`${sp}收入`,v:"¥5,000",c:C.mint},{l:"共计",v:"96 笔",c:C.dark}].map((s,i)=>(
    <div key={i} style={{flex:1,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"7px 8px",textAlign:"center"}}>
      <div style={{fontSize:9,color:C.sub}}>{s.l}</div>
      <div style={{fontSize:15,fontWeight:700,color:s.c,fontFamily:"'Space Mono',monospace"}}>{s.v}</div>
    </div>))}
  </div>

  {/* CATEGORY OVERVIEW */}
  <div style={{margin:"6px 16px",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
      <div style={{fontSize:12,fontWeight:700,color:C.dark}}>分类概览</div>
      <div onClick={()=>setDpOpen(true)} style={{fontSize:11,color:C.mint,fontWeight:600,cursor:"pointer"}}>{dl} ›</div>
    </div>
    <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden"}}>
      {[{w:"32%",c:C.coral},{w:"14%",c:C.blue},{w:"10%",c:C.yellow},{w:"8%",c:C.purple},{w:"8%",c:C.burg},{w:"14%",c:C.gray},{w:"14%",c:"transparent",p:true}].map((s,i)=>(
      <div key={i} style={{width:s.w,background:s.p?`repeating-linear-gradient(45deg,${C.amber}33,${C.amber}33 2px,${C.amber}55 2px,${C.amber}55 4px)`:s.c}}/>))}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:"3px 10px",marginTop:5,fontSize:9,color:"#666"}}>
      {[{l:"正餐 32%",c:C.coral},{l:"交通 14%",c:C.blue},{l:"零食 10%",c:C.yellow},{l:"购物 8%",c:C.purple},{l:"大餐 8%",c:C.burg},{l:"其他 14%",c:C.gray},{l:"未分类 14%",c:C.amber}].map((x,i)=>(
      <span key={i} style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:1.5,background:x.c,display:"inline-block"}}/>{x.l}</span>))}
    </div>
  </div>

  {/* FILTER WHEEL */}
  <div ref={pRef} style={{margin:"8px 16px 0",display:"flex",alignItems:"center",gap:3,paddingBottom:6,position:pStick?"sticky":"relative",top:0,zIndex:15,background:pStick?C.bg:"transparent",paddingTop:pStick?6:0,borderBottom:pStick?`1px solid ${C.border}`:"none"}}>
    <span onClick={()=>setWi(Math.max(0,wi-1))} style={{fontSize:16,cursor:"pointer",opacity:wi>0?.5:.15,userSelect:"none",flexShrink:0}}>‹</span>
    <div style={{display:"flex",gap:4,flex:1,overflow:"hidden"}}>
      {wCats.map(c=>{const act=fc===c.k;const w=c.k==="uncat"&&uncN>0;return(
      <div key={c.k} onClick={()=>setFc(c.k)} style={{padding:"4px 11px",borderRadius:20,fontSize:11,whiteSpace:"nowrap",cursor:"pointer",fontWeight:act?700:500,transition:"all .2s",flexShrink:0,background:act?C.dark:w?C.pinkBg:C.white,color:act?C.bg:w?"#D85A30":"#666",border:act?"none":`1.5px solid ${w?C.pinkBd:C.border}`}}>
        {c.l}{w?` · ${uncN}`:""}
      </div>);})}
    </div>
    <span onClick={()=>setWi(Math.min(FILTERS.length-WV,wi+1))} style={{fontSize:16,cursor:"pointer",opacity:wi+WV<FILTERS.length?.5:.15,userSelect:"none",flexShrink:0}}>›</span>
  </div>

  {/* TRANSACTION CARDS */}
  <div style={{padding:"6px 16px 90px"}}>
    {TX.map((day,di)=>{
      const items=filt(day.items);
      if(items.length===0&&fc!=="all")return null;
      const isFirst=di===0;
      const exp=isFirst||scrollExp;
      const isAi=(aiOn||aiStop)&&day.day==="apr4";
      return(
      <div key={day.day} className={`${isAi?"ab":""} ${!isFirst&&scrollExp?"ea":""}`} style={{background:C.white,borderRadius:14,padding:"12px 14px",marginBottom:8,border:isAi?undefined:`2px solid ${C.dark}`,opacity:exp?1:.7,transition:"opacity .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:exp?6:0,cursor:"pointer"}} onClick={()=>!scrollExp&&!isFirst&&setScrollExp(true)}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13,fontWeight:700,color:C.dark}}>{day.label}</span>
            {isAi&&<span style={{fontSize:10,color:aiStop?C.amber:C.mint,fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:aiStop?C.amber:C.mint,animation:"p 1.5s infinite"}}/>
              {aiStop?"正在完成…":"AI 分类中"}
            </span>}
          </div>
          <span style={{fontSize:12,color:C.coral,fontFamily:"'Space Mono',monospace"}}>−¥{day.total}</span>
        </div>
        {!exp&&!isAi&&<div style={{fontSize:10,color:C.muted,marginTop:3}}>{day.items.length} 笔 · {day.items.every(i=>i.cat)?"全部已分类 ✓":`${day.items.filter(i=>!i.cat).length} 笔未分类`}</div>}
        {(exp||isAi)&&items.map((it,idx)=>{
          if(isAi&&idx>=1)return(
          <div key={it.id} style={{display:"flex",alignItems:"center",padding:"7px 0",borderBottom:idx<items.length-1?`0.5px solid ${C.bL}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:10,background:"#f5f5f5",marginRight:10,display:"flex",alignItems:"center",justifyContent:"center"}}><div className="sk" style={{width:14,height:3}}/></div>
            <div style={{flex:1}}><div className="sk" style={{width:80,height:10,marginBottom:4}}/><div className="sk" style={{width:48,height:8}}/></div>
            <div className="sk" style={{width:30,height:10}}/>
          </div>);
          const uc=!it.cat;const m=CAT[it.cat];
          return(
          <div key={it.id} onMouseDown={()=>{lpt.current=setTimeout(()=>setDrag(it),500);}} onMouseUp={()=>clearTimeout(lpt.current)} onMouseLeave={()=>clearTimeout(lpt.current)} onTouchStart={()=>{lpt.current=setTimeout(()=>setDrag(it),500);}} onTouchEnd={()=>clearTimeout(lpt.current)} style={{display:"flex",alignItems:"center",padding:"7px 0",borderBottom:idx<items.length-1?`0.5px solid ${C.bL}`:"none",cursor:"pointer",userSelect:"none"}}>
            <div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:10,flexShrink:0,background:uc?C.oBg:(m?.bg||C.white),border:uc?"1.5px dashed #D85A30":"none"}}>
              {uc?<span style={{fontSize:13,color:"#D85A30",fontWeight:700}}>?</span>:m?.ic[it.ih%m.ic.length]}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:600,color:C.dark}}>{it.n}</span>
                {fc==="all"&&!uc&&<Tag cat={it.cat}/>}
                {uc&&<span style={{fontSize:10,padding:"1px 6px",borderRadius:4,fontWeight:600,background:C.pinkBg,color:"#D85A30",border:"1px dashed #D85A30"}}>未分类</span>}
              </div>
              <div style={{fontSize:9,color:C.muted,marginTop:2,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                {!uc&&!it.u&&it.ai&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:C.gBg,color:C.gT}}>AI: {it.ai}</span>}
                <span>{it.t} · {it.s==="wechat"?"微信":"支付宝"}</span>
              </div>
            </div>
            <div style={{fontSize:14,fontWeight:600,color:uc?"#D85A30":C.dark,flexShrink:0,marginLeft:8,fontFamily:"'Space Mono',monospace"}}>¥{it.a}</div>
          </div>);
        })}
      </div>);
    })}
  </div>
  </div>

  {/* BOTTOM NAV */}
  <div style={{background:C.white,borderTop:`1.5px solid ${C.border}`,padding:"6px 0 14px",display:"flex",justifyContent:"space-around",alignItems:"flex-end",flexShrink:0,zIndex:20}}>
    <div style={{textAlign:"center",padding:"4px 16px",cursor:"pointer"}}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#aaa" strokeWidth="1.5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <div style={{fontSize:10,color:C.muted,marginTop:2}}>设置</div>
    </div>
    <div style={{position:"relative",textAlign:"center",cursor:"pointer"}} onMouseDown={()=>{lpt.current=setTimeout(()=>setCtrlO(true),400);}} onMouseUp={()=>{clearTimeout(lpt.current);if(ctrlO&&ctrlH)toggleAi(ctrlH==="on");setCtrlO(false);setCtrlH(null);}} onMouseLeave={()=>{clearTimeout(lpt.current);setCtrlO(false);setCtrlH(null);}} onTouchStart={()=>{lpt.current=setTimeout(()=>setCtrlO(true),400);}} onTouchEnd={()=>{if(ctrlO&&ctrlH)toggleAi(ctrlH==="on");setCtrlO(false);setCtrlH(null);clearTimeout(lpt.current);}}>
      {ctrlO&&<div className="fi" style={{position:"absolute",bottom:68,left:"50%",transform:"translateX(-50%)",width:52,height:100,borderRadius:26,overflow:"hidden",border:`2px solid ${C.dark}`,display:"flex",flexDirection:"column",boxShadow:"0 4px 20px rgba(0,0,0,.15)",zIndex:30}}>
        <div onMouseEnter={()=>setCtrlH("on")} onTouchStart={()=>setCtrlH("on")} style={{flex:1,background:ctrlH==="on"?C.mint:C.white,display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s",borderBottom:`1px solid ${C.border}`}}>
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M6 10l3 3 5-6" stroke={ctrlH==="on"?"#fff":C.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div onMouseEnter={()=>setCtrlH("off")} onTouchStart={()=>setCtrlH("off")} style={{flex:1,background:ctrlH==="off"?C.coral:C.white,display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"}}>
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M6 6l8 8M14 6l-8 8" stroke={ctrlH==="off"?"#fff":C.coral} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
        </div>
      </div>}
      <div style={{marginTop:-20}}>
        <div className={aiOn&&!aiStop?"ag":""} style={{width:56,height:56,background:C.dark,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",transform:"rotate(2deg)",transition:"box-shadow .6s",boxShadow:aiStop?`0 0 0 2.5px ${C.amber},0 0 10px ${C.amber}44`:(!aiOn?"none":undefined)}}>
          <NavIcon/>
        </div>
        <div style={{fontSize:10,fontWeight:600,marginTop:3,color:aiOn?(aiStop?C.amber:C.mint):C.dark}}>
          {aiOn?(aiStop?"停止中…":"运行中"):"首页"}
        </div>
      </div>
    </div>
    <div style={{textAlign:"center",padding:"4px 16px",cursor:"pointer"}}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#aaa" strokeWidth="1.5"/><path d="M12 8v8M8 12h8" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <div style={{fontSize:10,color:C.muted,marginTop:2}}>记账</div>
    </div>
  </div>

  {/* DRAG OVERLAY */}
  {drag&&!descIn&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:50,display:"flex",flexDirection:"column",padding:16}} onClick={()=>{setDrag(null);setDHov(null);}}>
    <div style={{fontSize:14,color:C.white,fontWeight:700,textAlign:"center",marginTop:12,marginBottom:10}}>拖放到分类中</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 4px"}}>
      {Object.entries(CAT).filter(([k])=>k!=="others").slice(0,8).map(([k,m])=>(
      <div key={k} onMouseEnter={()=>setDHov(k)} onMouseLeave={()=>setDHov(null)} onClick={e=>{e.stopPropagation();doDrop(k);}} style={{background:C.white,border:`2.5px solid ${dHov===k?m.c:C.border}`,borderRadius:12,padding:"12px 8px",textAlign:"center",cursor:"pointer",transform:dHov===k?"scale(1.05)":"scale(1)",transition:"all .2s"}}>
        <div style={{fontSize:20,marginBottom:2}}>{m.ic[0]}</div>
        <div style={{fontSize:12,fontWeight:700,color:m.c}}>{m.l}</div>
      </div>))}
    </div>
    <div style={{margin:"auto auto 100px",background:C.white,borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>
      <div style={{width:32,height:32,borderRadius:8,background:C.oBg,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px dashed #D85A30"}}><span style={{fontSize:12,color:"#D85A30",fontWeight:700}}>?</span></div>
      <div><div style={{fontSize:13,fontWeight:700,color:C.dark}}>{drag.n}</div><div style={{fontSize:11,color:C.muted}}>¥{drag.a}</div></div>
    </div>
  </div>}

  {/* DESC INPUT */}
  {descIn&&clsIt&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div className="fi" style={{background:C.white,borderRadius:16,padding:20,width:"100%",maxWidth:320,border:`2px solid ${C.dark}`}}>
      <div style={{fontSize:14,fontWeight:700,color:C.dark,marginBottom:4}}>已归为「{CAT[clsIt.nc]?.l}」✓</div>
      <div style={{fontSize:12,color:C.muted,marginBottom:12}}>想告诉 AI 为什么？（可选）</div>
      <input type="text" placeholder="例：这是下午茶不是正餐" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,outline:"none",fontFamily:"inherit",background:"#FAFAFA"}}/>
      <div style={{display:"flex",gap:8,marginTop:14}}>
        <div onClick={()=>{setDescIn(false);setClsIt(null);}} style={{flex:1,padding:10,borderRadius:10,border:`1.5px solid ${C.border}`,textAlign:"center",fontSize:13,color:"#666",cursor:"pointer"}}>跳过</div>
        <div onClick={()=>{setDescIn(false);setClsIt(null);}} style={{flex:1,padding:10,borderRadius:10,background:C.dark,textAlign:"center",fontSize:13,color:C.bg,fontWeight:700,cursor:"pointer"}}>完成</div>
      </div>
    </div>
  </div>}

  {/* DATE RANGE PICKER */}
  {dpOpen&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setDpOpen(false)}>
    <div className="fi" onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:16,padding:20,width:"100%",maxWidth:320,border:`2px solid ${C.dark}`}}>
      <div style={{fontSize:14,fontWeight:700,color:C.dark,marginBottom:12}}>选择时间范围</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        {[{k:"today",l:"今天"},{k:"week",l:"本周"},{k:"month",l:"本月"},{k:"quarter",l:"近三月"}].map(o=>(
        <div key={o.k} onClick={()=>selRange(o.k,o.l)} style={{padding:"8px 16px",borderRadius:20,fontSize:13,cursor:"pointer",fontWeight:dr===o.k?700:500,background:dr===o.k?C.dark:C.white,color:dr===o.k?C.bg:"#666",border:dr===o.k?"none":`1.5px solid ${C.border}`}}>{o.l}</div>))}
      </div>
      <div style={{fontSize:11,color:C.sub,marginBottom:8}}>自定义范围</div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
        <input type="date" defaultValue="2026-03-01" style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
        <span style={{color:C.muted}}>—</span>
        <input type="date" defaultValue="2026-04-07" style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <div onClick={()=>setDpOpen(false)} style={{flex:1,padding:10,borderRadius:10,border:`1.5px solid ${C.border}`,textAlign:"center",fontSize:13,color:"#666",cursor:"pointer"}}>取消</div>
        <div onClick={()=>selRange("custom","3.1 - 4.7")} style={{flex:1,padding:10,borderRadius:10,background:C.dark,textAlign:"center",fontSize:13,color:C.bg,fontWeight:700,cursor:"pointer"}}>确定</div>
      </div>
    </div>
  </div>}

  </div>);
}
