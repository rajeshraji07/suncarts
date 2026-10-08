/* FoodBridge additions for SunCart. Self-contained: builds its own sections, never touches script.js state.
   Replace the sample data below (SRC, INST, CENTERS, VOL, posts, reqs) with your API, and score() with your AI service. */
(function(){
const $=(s,el=document)=>el.querySelector(s),$$=(s,el=document)=>[...el.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KM=.3,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])*KM,eta=d=>Math.round(d/20*60+8);
const now=()=>Date.now(),inMin=m=>now()+m*6e4,minsTo=t=>Math.round((t-now())/6e4),clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const hhmm=t=>new Date(t).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
const dur=m=>m<=0?'0 min':m<60?m+' min':Math.floor(m/60)+' h '+(m%60)+' min';
const atTime=(v,past)=>{const[h,m]=v.split(':').map(Number),d=new Date();d.setHours(h,m,0,0);let t=d.getTime();if(past){if(t>now()+36e5)t-=864e5}else if(t<now()-216e5)t+=864e5;return t;};
const toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),3800);};
const hash=s=>Math.abs([...s].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7));
const jit=(a,h)=>[a[0]+((h%9)-4)*.9,a[1]+(((h>>4)%9)-4)*.9];
const vn=t=>`<span class="vn ${t==='Veg'?'veg':'non'}"><i></i>${t}</span>`;

/* ---------- sample data (same schematic grid as the existing map: 1 unit = 0.3 km) ---------- */
const AREAS={'Adyar':[28,66],'Anna Nagar':[34,24],'Guindy':[44,64],'T. Nagar':[46,48],'Tambaram':[42,92],'Velachery':[58,74]};
const SRC=[
 {name:'Grand Residency Hotel',k:'Hotel',pos:[44,60],veg:140,non:60,pick:40,addr:'12 Mount Road, Guindy, Chennai',ph:'+91 98400 11001'},
 {name:'Malabar Pot',k:'Restaurant',pos:[30,70],veg:20,non:80,pick:25,addr:'4 Lattice Bridge Road, Adyar, Chennai',ph:'+91 98400 11002'},
 {name:'Saravana Kitchen',k:'Restaurant',pos:[47,46],veg:90,non:0,pick:50,addr:'88 Usman Road, T. Nagar, Chennai',ph:'+91 98400 11003'},
 {name:'Punjab Rasoi',k:'Restaurant',pos:[36,26],veg:35,non:45,pick:35,addr:'21 2nd Avenue, Anna Nagar, Chennai',ph:'+91 98400 11004'},
 {name:'Hotel Seaview',k:'Hotel',pos:[57,76],veg:70,non:55,pick:60,addr:'7 Velachery Main Road, Chennai',ph:'+91 98400 11005'},
 {name:'Banana Leaf Kitchen',k:'Restaurant',pos:[41,90],veg:0,non:0,pick:0,addr:'15 GST Road, Tambaram, Chennai',ph:'+91 98400 11006'}
].map(s=>({...s,pickAt:inMin(s.pick)}));
const INST=[
 {id:'I1',name:'Hope Orphanage',k:'Orphanage',pos:[28,70],addr:'9 Gandhi Nagar, Adyar, Chennai',ph:'+91 98410 22001'},
 {id:'I2',name:'Sunrise Old-Age Home',k:'Old-age home',pos:[34,22],addr:'33 Shanthi Colony, Anna Nagar, Chennai',ph:'+91 98410 22002'},
 {id:'I3',name:'Asha Night Shelter',k:'NGO',pos:[47,50],addr:'5 Panagal Park Road, T. Nagar, Chennai',ph:'+91 98410 22003'},
 {id:'I4',name:'St. Mary School',k:'School',pos:[58,72],addr:'2 School Road, Velachery, Chennai',ph:'+91 98410 22004'},
 {id:'I5',name:'City Engineering College',k:'College',pos:[44,68],addr:'Anna University Road, Guindy, Chennai',ph:'+91 98410 22005'},
 {id:'I6',name:'Karunai Illam',k:'Old-age home',pos:[26,66],addr:'18 Besant Avenue, Adyar, Chennai',ph:'+91 98410 22006'}
];
const CENTERS=[
 {id:'c1',name:'Adyar Center',pos:[30,72],cap:400,load:250,open:1,addr:'Adyar Center, Chennai',ph:'+91 44 4000 1001'},
 {id:'c2',name:'T. Nagar Center',pos:[48,44],cap:300,load:285,open:1,addr:'T. Nagar Center, Chennai',ph:'+91 44 4000 1002'},
 {id:'c3',name:'Anna Nagar Center',pos:[36,20],cap:350,load:120,open:1,addr:'Anna Nagar Center, Chennai',ph:'+91 44 4000 1003'},
 {id:'c4',name:'Velachery Center',pos:[60,78],cap:450,load:140,open:1,addr:'Velachery Center, Chennai',ph:'+91 44 4000 1004'},
 {id:'c5',name:'Tambaram Center',pos:[40,95],cap:250,load:60,open:0,addr:'Tambaram Center, Chennai',ph:'+91 44 4000 1005'}
];
const VOL=[{name:'Karthik R',pos:[40,62],ph:'+91 98420 33001'},{name:'Meena S',pos:[30,68],ph:'+91 98420 33002'},{name:'Imran K',pos:[36,30],ph:'+91 98420 33003'},{name:'Divya P',pos:[56,76],ph:'+91 98420 33004'}];
const STATUS=['Available','Pickup assigned','Picked up','Delivered'];
const URG={High:1,Medium:.6,Low:.3};
const BASE={don:94,veg:2150,non:1090,red:3180};
const fb={vt:'All',rad:10,layer:'All',me:'Guindy',q:'',sel:null,route:null,tab:'donor',donor:'Grand Residency Hotel',inst:'I1',res:null,viaCtr:true,pn:0,rn:0,img:null};
let posts=[],reqs=[];
const mkP=o=>({id:'FP-'+(++fb.pn),status:'Available',alloc:[],img:null,urgent:false,unit:'kg',ph:'+91 98400 12000',...o});
const mkR=o=>({id:'R'+(++fb.rn),rem:o.qty,recv:[],...o});
posts=[
 mkP({donor:'Malabar Pot',pos:[30,70],area:'Adyar',addr:'4 Lattice Bridge Road, Adyar, Chennai',type:'Non-Veg',cat:'Cooked meals',name:'Chicken biryani and gravy',qty:25,serv:60,prepAt:inMin(-90),safeAt:inMin(50),pickAt:inMin(10)}),
 mkP({donor:'Saravana Kitchen',pos:[47,46],area:'T. Nagar',addr:'88 Usman Road, T. Nagar, Chennai',type:'Veg',cat:'Cooked meals',name:'Sambar rice and curd rice',qty:32,serv:80,prepAt:inMin(-60),safeAt:inMin(200),pickAt:inMin(30)}),
 mkP({donor:'Hot Breads Bakery',pos:[40,66],area:'Guindy',addr:'3 Race Course Road, Guindy, Chennai',type:'Veg',cat:'Bakery',name:'Buns and bread loaves',qty:12,unit:'kg',serv:40,prepAt:inMin(-240),safeAt:inMin(420),pickAt:inMin(45)}),
 mkP({donor:'Grand Residency Hotel',pos:[44,60],area:'Guindy',addr:'12 Mount Road, Guindy, Chennai',type:'Veg',cat:'Cooked meals',name:'Veg thali (rice, dal, curry)',qty:56,serv:140,prepAt:inMin(-2000),safeAt:inMin(-1700),pickAt:inMin(-1900),status:'Delivered',vol:'Karthik R',alloc:[{iid:'I1',rid:'R0',n:90,s:92,d:5.7},{iid:'I3',rid:'R0',n:50,s:88,d:3.1}]}),
 mkP({donor:'Grand Residency Hotel',pos:[44,60],area:'Guindy',addr:'12 Mount Road, Guindy, Chennai',type:'Non-Veg',cat:'Cooked meals',name:'Chicken fried rice',qty:20,serv:50,prepAt:inMin(-4000),safeAt:inMin(-3700),pickAt:inMin(-3900),status:'Delivered',vol:'Meena S',alloc:[{iid:'I5',rid:'R0',n:50,s:90,d:2.4}]})
];
reqs=[
 mkR({inst:'I1',type:'Veg',qty:50,people:50,who:'Children',byAt:inMin(180),urg:'High'}),
 mkR({inst:'I3',type:'Veg',qty:40,people:40,who:'Adults',byAt:inMin(210),urg:'Medium'}),
 mkR({inst:'I4',type:'Veg',qty:30,people:30,who:'Children',byAt:inMin(240),urg:'Medium'}),
 mkR({inst:'I5',type:'Non-Veg',qty:45,people:45,who:'Adults and children',byAt:inMin(170),urg:'High'}),
 mkR({inst:'I6',type:'Non-Veg',qty:20,people:20,who:'Adults',byAt:inMin(160),urg:'Low'}),
 mkR({inst:'I2',type:'Non-Veg',qty:35,people:35,who:'Adults',byAt:inMin(150),urg:'High'}),
 mkR({inst:'I1',type:'Veg',qty:60,people:60,who:'Children',byAt:inMin(-1700),urg:'Medium',rem:0,recv:[{pid:'FP-4',n:60}]})
];
const I=id=>INST.find(i=>i.id===id),PO=id=>posts.find(p=>p.id===id),ME=()=>AREAS[fb.me];
const nearest=(L,pos)=>L.reduce((a,b)=>dist(a.pos,pos)<=dist(b.pos,pos)?a:b);
const live=p=>minsTo(p.safeAt)>0,urgent=p=>p.status==='Available'&&live(p)&&(p.urgent||minsTo(p.safeAt)<=60);
const rstat=r=>r.rem<=0?'Fulfilled':r.rem<r.qty?'Partly fulfilled':'Open';

/* ---------- smart matching + AI score: food type, quantity, distance, requirement, expiry, urgency ---------- */
function score(p,r){
  const i=I(r.inst),d=dist(p.pos,i.pos),e=eta(d),arrive=Math.max(0,minsTo(p.pickAt))+e;
  const left=minsTo(p.safeAt)-arrive,slack=minsTo(r.byAt)-arrive;
  const f={qty:clamp(p.serv/r.rem),dist:clamp(1-d/25),exp:clamp(left/90),time:clamp(slack/60),urg:URG[r.urg]};
  const s=Math.round(100*(.25*f.qty+.2*f.dist+.2*f.exp+.15*f.time+.2*f.urg));
  return {r,iid:r.inst,rid:r.id,d,e,left,slack,s,f,ok:p.type===r.type&&r.rem>0&&left>=10&&slack>=0&&d<=12&&live(p)};
}
const rank=p=>reqs.map(r=>score(p,r)).filter(m=>m.ok).sort((a,b)=>b.s-a.s);
const why=(p,m,n)=>[`${p.type} food matches this ${m.r.type} requirement`,`${n} of the ${m.r.rem} meals needed, from ${p.serv} available`,`${m.d.toFixed(1)} km away, about ${m.e} min by road`,`Arrives with ${dur(Math.round(m.left))} of safe time left`,`Reaches them ${dur(Math.round(m.slack))} before the ${hhmm(m.r.byAt)} deadline`,`${m.r.urg} urgency requirement`];
function allocate(p){ // splits one donation across the best-matching institutes
  let rest=p.serv;const list=[];
  for(const m of rank(p)){if(rest<=0)break;const n=Math.min(rest,m.r.rem);list.push({...m,n,ck:{qty:p.serv>=m.r.rem,near:m.d<=6,time:m.left>=30&&m.slack>=0},why:why(p,m,n)});rest-=n;}
  return {list,rest};
}
function accept(p){
  const al=allocate(p);if(!al.list.length)return;
  al.list.forEach(m=>{m.r.rem-=m.n;m.r.recv.push({pid:p.id,n:m.n});});
  p.alloc=al.list.map(({r,...m})=>m);p.rest=al.rest;p.status='Pickup assigned';p.vol=nearest(VOL,p.pos).name;fb.route=p.id;
  renderAll();toast(`Matched to ${p.alloc.length} institute${p.alloc.length>1?'s':''}. ${p.vol} will collect.`);
  $('#fb-map').scrollIntoView({behavior:'smooth'});
}

/* ---------- route optimisation: volunteer, donor, (Sun Cart Center), institutes in the shortest order ---------- */
function plan(p){
  const vol=VOL.find(v=>v.name===p.vol)||nearest(VOL,p.pos),ctr=fb.viaCtr?nearest(CENTERS.filter(c=>c.open),p.pos):null;
  const stops=p.alloc.map(a=>({t:'inst',name:I(a.iid).name,pos:I(a.iid).pos}));
  const perms=a=>a.length<2?[a]:a.flatMap((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).map(r=>[x,...r]));
  const head=[{t:'vol',name:vol.name+' (volunteer)',pos:vol.pos},{t:'donor',name:p.donor,pos:p.pos},...(ctr?[{t:'center',name:ctr.name,pos:ctr.pos}]:[])];
  const len=s=>s.slice(1).reduce((a,x,i)=>a+dist(s[i].pos,x.pos),0);
  const all=perms(stops).map(o=>[...head,...o]).sort((a,b)=>len(a)-len(b)),best=all[0];let t=0;
  const legs=best.slice(1).map((x,i)=>{const d=dist(best[i].pos,x.pos),m=Math.round(d/22*60+(i?5:0));t+=m;return{d,m,at:t};});
  return {stops:best,legs,km:len(best),min:t,saved:len(all[all.length-1])-len(best)};
}

/* ---------- map ---------- */
const MK={src:['c','var(--sun)'],donor:['c','var(--leaf)'],ngo:['s','var(--ink)'],inst:['s','var(--ink)'],center:['s','var(--leaf)'],vol:['d','var(--blue)']};
const TL={src:'Hotel / Restaurant',donor:'Food donor',ngo:'NGO',inst:'Institute',center:'Sun Cart Center',vol:'Volunteer'};
function ents(){
  const L=[];
  SRC.forEach((s,i)=>L.push({id:'s'+i,t:'src',...s}));
  posts.filter(p=>p.status==='Available'&&live(p)).forEach(p=>L.push({id:'d'+p.id,t:'donor',k:'Food donor',name:p.donor,pos:p.pos,veg:p.type==='Veg'?p.serv:0,non:p.type==='Veg'?0:p.serv,pickAt:p.pickAt,addr:p.addr,ph:p.ph}));
  INST.forEach(i=>L.push({id:'i'+i.id,t:i.k==='NGO'?'ngo':'inst',...i,inst:i.id}));
  CENTERS.forEach(c=>L.push({id:c.id,t:'center',k:'Sun Cart Center',...c}));
  VOL.forEach((v,i)=>L.push({id:'v'+i,t:'vol',k:'Volunteer',...v}));
  return L.map(e=>({...e,d:dist(ME(),e.pos),food:e.t==='src'||e.t==='donor'}));
}
function visible(){
  const q=fb.q.trim().toLowerCase();
  return ents().filter(e=>{
    if(e.d>fb.rad)return false;
    if(q&&!(e.name+' '+e.k+' '+(e.addr||'')).toLowerCase().includes(q))return false;
    if(e.food&&fb.vt!=='All'&&!(fb.vt==='Veg'?e.veg:e.non))return false;
    switch(fb.layer){
      case'Hotels':return e.t==='src'&&e.k==='Hotel';case'Restaurants':return e.t==='src'&&e.k==='Restaurant';
      case'NGOs':return e.t==='ngo';case'Institutes':return e.t==='inst';case'Centers':return e.t==='center';
      case'Donors':return e.t==='donor';case'Volunteers':return e.t==='vol';
      case'Available food':return e.food&&e.veg+e.non>0;default:return true;}
  }).sort((a,b)=>a.d-b.d);
}
function marker(e,k){
  const [sh,c]=MK[e.t],[x,y]=e.pos,L=e.t==='src'?(e.k==='Hotel'?'H':'R'):{donor:'D',ngo:'N',inst:'I',center:'C',vol:'V'}[e.t];
  const shape=sh==='c'?`<circle r="2.8" style="fill:${c}"/>`:sh==='s'?`<rect x="-2.5" y="-2.5" width="5" height="5" rx=".8" style="fill:${c}"/>`:`<rect x="-2.2" y="-2.2" width="4.4" height="4.4" rx=".5" transform="rotate(45)" style="fill:${c}"/>`;
  const dim=e.t==='src'&&!(e.veg+e.non)?'dim':'';
  return `<g data-fbmk="${e.id}" tabindex="0" role="button" class="${dim}" transform="translate(${x} ${y}) scale(${k})" aria-label="${esc(e.name)}, ${TL[e.t]}, ${e.d.toFixed(1)} km"><title>${esc(e.name)}</title><circle class="fb-sel" r="${fb.sel===e.id?4.4:0}"/><circle r="3.4" fill="transparent"/>${shape}<text class="mkl" y=".9"${e.t==='src'?' style="fill:var(--on-sun)"':''}>${L}</text></g>`;
}
function mapSvg(list,o={}){ // zooms to the chosen radius; markers keep their on-screen size
  const me=ME(),h=o.mini?50:Math.max(8,fb.rad/KM*1.2),k=h/50,vb=o.mini?'0 0 100 100':`${me[0]-h} ${me[1]-h} ${2*h} ${2*h}`,step=h<=15?5:h<=30?10:20;
  let s=`<svg class="map fbmap" viewBox="${vb}" role="group" aria-label="Interactive map of food sources, institutes, centers and volunteers">`;
  for(let i=-20;i<=120;i+=step)s+=`<line class="grid-l" x1="${i}" y1="-20" x2="${i}" y2="120"/><line class="grid-l" x1="-20" y1="${i}" x2="120" y2="${i}"/>`;
  if(!o.mini)[10,5,3,1].forEach(r=>{s+=`<circle class="fb-ring${r===fb.rad?' on':''}" cx="${me[0]}" cy="${me[1]}" r="${r/KM}"/>`;});
  if(o.mini){reqs.filter(r=>r.rem>0).forEach(r=>{const p=I(r.inst).pos;s+=`<circle class="fb-heat" cx="${p[0]}" cy="${p[1]}" r="${2.5+r.rem/18}"/>`;});
    posts.filter(p=>p.alloc.length&&p.status!=='Delivered').forEach(p=>p.alloc.forEach(a=>{const q=I(a.iid).pos;s+=`<line class="fb-flow" x1="${p.pos[0]}" y1="${p.pos[1]}" x2="${q[0]}" y2="${q[1]}"/>`;}));}
  if(o.route)s+=`<polyline class="fb-route" points="${o.route.stops.map(x=>x.pos.join(',')).join(' ')}"/>`;
  s+=list.map(e=>marker(e,k)).join('');
  if(o.route)o.route.stops.forEach((x,i)=>{s+=`<g transform="translate(${x.pos[0]+3.4*k} ${x.pos[1]-3.4*k}) scale(${k})" pointer-events="none"><circle class="fb-step" r="1.7"/><text class="fb-stepn" y=".8">${i+1}</text></g>`;});
  if(!o.mini)s+=`<g transform="translate(${me[0]} ${me[1]}) scale(${k})" pointer-events="none"><circle class="fb-me" r="1.3"/><text class="fb-you" x="-2" y="-2.2" text-anchor="end">You</text></g>`;
  return s+'</svg>';
}
function detail(e){
  if(!e)return '<p class="note">Tap a marker or a result to see its details.</p>';
  const kv=(a,b)=>`<div class="kv"><span>${a}</span><span>${b}</span></div>`;
  let h=`<h3>${esc(e.name)}</h3><p class="note" style="margin:2px 0 8px">${TL[e.t]}${e.t==='src'||e.t==='inst'||e.t==='ngo'?' · '+esc(e.k):''}</p>`+kv('Distance',`${e.d.toFixed(1)} km, about ${eta(e.d)} min`);
  if(e.food)h+=kv('Available Veg',`<b>${e.veg}</b> meals`)+kv('Available Non-Veg',`<b>${e.non}</b> meals`)+kv('Pickup time',e.pickAt&&(e.veg+e.non)?hhmm(e.pickAt):'Not available now');
  if(e.inst){const rs=reqs.filter(r=>r.inst===e.inst&&r.rem>0);h+=kv('Needs',rs.length?rs.map(r=>`${r.rem} ${r.type}`).join(', ')+' meals':'Nothing right now');}
  if(e.t==='center')h+=kv('Holding',`${e.load} of ${e.cap} meals`)+kv('Status',e.open?'Open':'Closed right now');
  if(e.addr)h+=kv('Address',esc(e.addr));
  h+=kv('Contact',`<a href="tel:${e.ph.replace(/\s/g,'')}">${esc(e.ph)}</a>`);
  if(e.addr)h+=`<p style="margin-top:12px"><a class="btn primary small" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(e.addr)}">Navigate</a></p>`;
  return h;
}
function routeHtml(){
  const opts=posts.filter(p=>p.alloc.length&&p.status!=='Delivered');
  if(!opts.length)return '<h3>Best route</h3><p class="note">Accept a match and the optimised pickup and delivery route is drawn here.</p>';
  const p=PO(fb.route)&&opts.includes(PO(fb.route))?PO(fb.route):opts[0];fb.route=p.id;const r=plan(p);
  return `<h3>Best pickup and delivery route</h3><div class="fbtools"><select id="fbRouteSel" aria-label="Accepted donation">${opts.map(o=>`<option value="${o.id}"${o.id===p.id?' selected':''}>${o.id} · ${esc(o.donor)} · ${o.serv} meals</option>`).join('')}</select>
    <label><input type="checkbox" id="fbVia"${fb.viaCtr?' checked':''}> Pass through a Sun Cart Center</label></div>
    <div class="stats"><div class="stat"><span class="label">Distance</span><b>${r.km.toFixed(1)} km</b></div><div class="stat"><span class="label">Travel time</span><b>${r.min} min</b></div><div class="stat"><span class="label">Saved</span><b>${r.saved.toFixed(1)} km</b></div></div>
    <ol class="fbsteps">${r.stops.map((s,i)=>`<li><b>${i+1}. ${esc(s.name)}</b><small>${i?`${r.legs[i-1].d.toFixed(1)} km · ${r.legs[i-1].m} min · arrive in ${r.legs[i-1].at} min`:'Start'}</small></li>`).join('')}</ol>`;
}
function renderMap(){
  const routeBox=routeHtml(),list=visible(),sel=ents().find(e=>e.id===fb.sel),p=PO(fb.route),opts=p&&p.alloc.length&&p.status!=='Delivered'?plan(p):null;
  $('#fbMap').innerHTML=mapSvg(list,{route:opts});
  $('#fbDetail').innerHTML=detail(sel);
  $('#fbList').innerHTML=`<p class="note" style="margin-top:14px"><b>${list.length}</b> result${list.length===1?'':'s'} within ${fb.rad} km of ${esc(fb.me)}</p>`+list.slice(0,8).map(e=>`<button class="fbrow" data-fbmk="${e.id}" aria-current="${fb.sel===e.id}"><span class="dot" style="background:${MK[e.t][1]}"></span><b>${esc(e.name)}</b><small>${TL[e.t]} · ${e.d.toFixed(1)} km${e.food?` · Veg ${e.veg}, Non-Veg ${e.non}`:''}</small></button>`).join('');
  $('#fbRoute').innerHTML=routeBox;
}

/* ---------- food posts, alerts, results ---------- */
function foodCard(p){
  const m=minsTo(p.safeAt),d=dist(ME(),p.pos),dead=!live(p)&&p.status==='Available';
  return `<article class="prod fbcard ${p.type==='Veg'?'is-veg':'is-non'}">${p.img?`<div class="tile photo"><img src="${p.img}" alt="${esc(p.name)}"></div>`:`<div class="tile ${p.type==='Veg'?'groceries':'medicines'}" aria-hidden="true">${esc(p.name[0])}</div>`}
  <div class="b"><div>${vn(p.type)} ${urgent(p)?'<span class="pill crit">Urgent</span>':''}</div><h3>${esc(p.name)}</h3>
  <div class="s">${esc(p.donor)} · ${esc(p.cat)}</div><div class="s">${p.serv} servings · ${p.qty} ${p.unit}</div>
  <div class="s">${dead?'Past safe time':'Safe for '+dur(m)} · Pickup ${hhmm(p.pickAt)}</div><div class="s">${esc(p.area)} · ${d.toFixed(1)} km from you</div>
  <div class="row"><span class="pill ${p.status==='Available'?'warn':'good'}">${dead?'Expired':p.status}</span>${p.status==='Available'&&!dead?`<button class="btn primary small" data-fbfind="${p.id}">Find recipients</button>`:''}</div></div></article>`;
}
function renderFood(){
  const L=posts.filter(p=>p.status!=='Delivered'),g=t=>L.filter(p=>p.type===t);
  const grp=t=>{const a=g(t);return fb.vt!=='All'&&fb.vt!==t?'':`<div class="fbgh">${vn(t)}<span class="note" style="margin:0">${a.length} post${a.length===1?'':'s'} · ${a.reduce((x,p)=>x+p.serv,0)} servings</span></div><div class="grid">${a.length?a.map(foodCard).join(''):`<div class="empty">No ${t} food posted right now.</div>`}</div>`;};
  $('#fbFood').innerHTML=grp('Veg')+grp('Non-Veg');
}
function renderAlerts(){
  const L=posts.filter(urgent);
  $('#fbAlerts').innerHTML=L.map(p=>{
    const d=dist(ME(),p.pos),by=Math.max(5,Math.round((minsTo(p.safeAt)-20)/5)*5),ms=rank(p).slice(0,3),vs=VOL.filter(v=>dist(v.pos,p.pos)<=5);
    return `<div class="fbalert" role="alert"><div><b>URGENT: ${p.serv} ${p.type} meals available ${d.toFixed(1)} km away. Pickup required within ${by} minutes.</b><small>Notified: ${ms.length?ms.map(m=>esc(I(m.iid).name)).join(', '):'no matching institute in range yet'} and ${vs.length} volunteer${vs.length===1?'':'s'} within 5 km.</small></div><button class="btn small primary" data-fbfind="${p.id}">Find recipients</button></div>`;}).join('');
}
const chk=(ok,a,b)=>`<span class="pill ${ok?'good':'plain'}">${ok?'✓ '+a:b}</span>`;
function renderResult(){
  const p=PO(fb.res),el=$('#fbResult');
  if(!p){el.innerHTML='<div class="empty">Post food or press Find recipients on a post. AI matches appear here.</div>';return;}
  const done=p.status!=='Available',al=done?{list:p.alloc,rest:p.rest||0}:allocate(p),L=al.list,top=L[0];
  let h=`<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${vn(p.type)}<h3>${p.serv} meals · ${esc(p.name)}</h3></div>`;
  if(!live(p))return void(el.innerHTML=h+'<div class="alertbox crit"><b>Past its safe time.</b> This food can no longer be matched.</div>');
  if(!L.length){const c=nearest(CENTERS.filter(c=>c.open),p.pos);return void(el.innerHTML=h+`<div class="alertbox crit"><b>No institute can take this ${p.type} food in time.</b> Type, distance, safe time or deadline do not fit any open requirement. Send it to ${esc(c.name)} (${dist(p.pos,c.pos).toFixed(1)} km) for checking and later distribution.</div>`);}
  h+=`<div style="margin-top:12px"><div class="label">AI Match Score</div><div class="bigscore">AI Match Score: ${top.s}%</div><div class="bar"><i style="width:${top.s}%"></i></div></div>
  <div class="alertbox good"><b>Why ${esc(I(top.iid).name)} is recommended</b><ul class="why">${(top.why||[`${top.n} meals matched`]).map(w=>`<li>${esc(w)}</li>`).join('')}</ul></div>
  <h3 style="margin-top:16px">${L.length>1?'Split across '+L.length+' institutes':'Allocation'}</h3><div class="match" style="margin-top:10px">`;
  L.forEach((a,i)=>{const n=I(a.iid);h+=`<div class="cand ${i===0?'best':''}"><div class="rank">${i+1}</div><div><b>${esc(n.name)}</b><small>${a.n} ${p.type} meals · ${a.d.toFixed(1)} km${a.e?' · about '+a.e+' min':''}</small>${a.ck?`<div class="checks">${chk(1,'Food type matched','')}${chk(a.ck.qty,'Quantity matched','Partial quantity')}${chk(a.ck.near,'Nearby location','Farther away')}${chk(a.ck.time,'Suitable pickup time','Tight timing')}</div>`:''}</div><div class="score">${a.s}%<small>Match</small></div></div>`;});
  h+=`</div><div class="bar" style="margin-top:12px"><i style="width:${Math.round((p.serv-al.rest)/p.serv*100)}%"></i></div><p class="note">${p.serv-al.rest} of ${p.serv} meals allocated${al.rest?`. ${al.rest} left unmatched: they stay listed for new requirements or go to the nearest Sun Cart Center.`:'.'}</p>`;
  h+=done?`<div class="alertbox good"><b>${esc(p.status)}.</b> See the route on the map.</div>`:`<p style="margin-top:12px"><button class="btn primary" data-fbacc="${p.id}">Accept matches and plan route</button></p>`;
  el.innerHTML=h;
}

/* ---------- requirements ---------- */
function renderNeeds(){
  const L=reqs.filter(r=>r.rem>0&&(fb.vt==='All'||r.type===fb.vt)).map(r=>({r,i:I(r.inst),d:dist(ME(),I(r.inst).pos)})).filter(x=>x.d<=fb.rad).sort((a,b)=>URG[b.r.urg]-URG[a.r.urg]||a.d-b.d);
  $('#fbNeeds').innerHTML=L.length?L.map(({r,i,d})=>{
    const sug=posts.filter(p=>p.status==='Available').map(p=>({p,m:score(p,r)})).filter(o=>o.m.ok).sort((a,b)=>b.m.s-a.m.s).slice(0,2);
    return `<article class="card fbreq"><div class="head"><h3>${esc(i.name)}</h3><span>${vn(r.type)} <span class="pill ${r.urg==='High'?'crit':r.urg==='Medium'?'warn':'plain'}">${r.urg} urgency</span></span></div>
    <p class="need">Need ${r.qty} ${r.type} meals for ${r.people} people before ${hhmm(r.byAt)}.</p>
    <div class="note" style="margin:0">${esc(i.k)} · ${r.who} · ${d.toFixed(1)} km from you · ${esc(i.addr)}</div>
    <div class="bar" role="img" aria-label="${r.qty-r.rem} of ${r.qty} meals matched"><i style="width:${Math.round((r.qty-r.rem)/r.qty*100)}%"></i></div>
    <div class="note">${rstat(r)}: ${r.qty-r.rem} of ${r.qty} meals matched</div>
    <div class="note">Suitable donations: ${sug.length?sug.map(({p,m})=>`<b>${esc(p.donor)}</b> (${p.serv} meals, ${m.s}% match)`).join(' · '):'none yet, we will alert you when matching food is posted'}</div></article>`;}).join(''):`<div class="empty">No open ${fb.vt==='All'?'':fb.vt+' '}requirements within ${fb.rad} km.</div>`;
}
function reqLine(){
  const q=+$('#fbRQty').value||0,n=+$('#fbRPeople').value||0,b=$('#fbRBy').value;
  $('#fbReqLine').textContent=`Need ${q} ${$('#fbRType').value} meals for ${n} people${b?' before '+b:''}.`;
}

/* ---------- dashboards ---------- */
const stat=(l,v)=>`<div class="stat"><span class="label">${l}</span><b>${v}</b></div>`;
const tbl=(h,rows)=>`<div class="tbl"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.join('')||`<tr><td colspan="${h.length}" class="note">Nothing here yet.</td></tr>`}</tbody></table></div>`;
const meals=(L,t)=>L.filter(p=>!t||p.type===t).reduce((a,p)=>a+p.serv,0),names=p=>[...new Set(p.alloc.map(a=>I(a.iid).name))].join(', ')||'Not matched yet';
const split=(v,n)=>`<div class="split" role="img" aria-label="Veg ${v}, Non-Veg ${n}"><i class="v" style="width:${v/(v+n||1)*100}%"></i><i class="n" style="width:${n/(v+n||1)*100}%"></i></div>`;
function actBtn(p){return p.status==='Available'?`<button class="btn small line" data-fbfind="${p.id}">Find recipients</button>`:p.status==='Delivered'?'Done':`<button class="btn small primary" data-fbadv="${p.id}">${p.status==='Pickup assigned'?'Mark picked up':'Mark delivered'}</button>`;}
function dashDonor(){
  const donors=[...new Set(posts.map(p=>p.donor))],mine=posts.filter(p=>p.donor===fb.donor),act=mine.filter(p=>p.status!=='Delivered'),hist=mine.filter(p=>p.status==='Delivered');
  const inst=new Set(mine.flatMap(p=>p.alloc.map(a=>a.iid)));
  return `<div class="fbtools"><label class="label" for="fbDonorSel">Donor</label><select id="fbDonorSel">${donors.map(d=>`<option${d===fb.donor?' selected':''}>${esc(d)}</option>`).join('')}</select></div>
  <div class="stats">${stat('Active donations',act.length)}${stat('Veg donations',mine.filter(p=>p.type==='Veg').length+' · '+meals(mine,'Veg')+' meals')}${stat('Non-Veg donations',mine.filter(p=>p.type!=='Veg').length+' · '+meals(mine,'Non-Veg')+' meals')}${stat('Quantity donated',meals(mine)+' meals')}${stat('Matched institutions',inst.size)}</div>${split(meals(mine,'Veg'),meals(mine,'Non-Veg'))}
  <h3 style="margin:22px 0 10px">Active donations and pickup status</h3>`+tbl(['ID','Food','Servings','Matched to','Pickup status','Action'],act.map(p=>`<tr><td class="mono">${p.id}</td><td>${vn(p.type)} ${esc(p.name)}</td><td class="num">${p.serv}</td><td>${esc(names(p))}</td><td><span class="pill ${p.status==='Available'?'plain':'warn'}">${p.status}</span></td><td>${actBtn(p)}</td></tr>`))+
  `<h3 style="margin:22px 0 10px">Donation history</h3>`+tbl(['ID','Food','Servings','Delivered to'],hist.map(p=>`<tr><td class="mono">${p.id}</td><td>${vn(p.type)} ${esc(p.name)}</td><td class="num">${p.serv}</td><td>${esc(names(p))}</td></tr>`))+
  `<h3 style="margin:22px 0 10px">Your impact</h3><div class="stats">${stat('Meals delivered',meals(hist))}${stat('Food saved',Math.round(meals(hist)*.45)+' kg')}${stat('People served',meals(hist))}${stat('Institutions helped',new Set(hist.flatMap(p=>p.alloc.map(a=>a.iid))).size)}</div>`;
}
function dashInst(){
  const rs=reqs.filter(r=>r.inst===fb.inst),cur=rs.filter(r=>r.rem>0),i=I(fb.inst),rec=rs.flatMap(r=>r.recv.map(x=>({r,x,p:PO(x.pid)}))).filter(o=>o.p);
  const near=posts.filter(p=>p.status==='Available'&&live(p)).map(p=>({p,m:cur.map(r=>score(p,r)).filter(m=>m.ok).sort((a,b)=>b.s-a.s)[0]})).filter(o=>o.m);
  return `<div class="fbtools"><label class="label" for="fbInstSel">Institute</label><select id="fbInstSel">${INST.map(n=>`<option value="${n.id}"${n.id===fb.inst?' selected':''}>${esc(n.name)}</option>`).join('')}</select></div>
  <div class="stats">${stat('Current requirements',cur.length)}${stat('Veg requirement',cur.filter(r=>r.type==='Veg').reduce((a,r)=>a+r.rem,0)+' meals')}${stat('Non-Veg requirement',cur.filter(r=>r.type!=='Veg').reduce((a,r)=>a+r.rem,0)+' meals')}${stat('Received donations',rec.reduce((a,o)=>a+o.x.n,0)+' meals')}${stat('Pending requests',cur.filter(r=>!r.recv.length).length)}</div>
  <h3 style="margin:8px 0 10px">Current food requirements</h3>`+tbl(['Need','Type','By','Urgency','Progress'],cur.map(r=>`<tr><td>${r.qty} meals for ${r.people} people</td><td>${vn(r.type)}</td><td class="num">${hhmm(r.byAt)}</td><td><span class="pill ${r.urg==='High'?'crit':r.urg==='Medium'?'warn':'plain'}">${r.urg}</span></td><td>${rstat(r)}: ${r.qty-r.rem}/${r.qty}</td></tr>`))+
  `<h3 style="margin:22px 0 10px">Nearby available food</h3>`+tbl(['Donor','Food','Servings','Distance','Match'],near.map(({p,m})=>`<tr><td>${esc(p.donor)}</td><td>${vn(p.type)} ${esc(p.name)}</td><td class="num">${p.serv}</td><td class="num">${dist(p.pos,i.pos).toFixed(1)} km</td><td class="num">${m.s}%</td></tr>`))+
  `<h3 style="margin:22px 0 10px">Received donations</h3>`+tbl(['Donation','From','Meals','Status'],rec.map(o=>`<tr><td class="mono">${o.p.id}</td><td>${vn(o.p.type)} ${esc(o.p.donor)}</td><td class="num">${o.x.n}</td><td><span class="pill ${o.p.status==='Delivered'?'good':'warn'}">${o.p.status}</span></td></tr>`))+
  `<h3 style="margin:22px 0 10px">Requirement history</h3>`+tbl(['Need','Type','Result'],rs.filter(r=>r.rem<=0).map(r=>`<tr><td>${r.qty} meals for ${r.people} people</td><td>${vn(r.type)}</td><td><span class="pill good">Fulfilled</span></td></tr>`));
}
function dashAdmin(){
  const act=posts.filter(p=>p.status!=='Available'),red=BASE.red+act.reduce((a,p)=>a+p.alloc.reduce((x,y)=>x+y.n,0),0),vm=BASE.veg+meals(posts,'Veg'),nm=BASE.non+meals(posts,'Non-Veg');
  const days=[...Array(7)].map((_,i)=>new Date(Date.now()-(6-i)*864e5).toLocaleDateString('en-GB',{weekday:'short'})),sv=[210,260,190,300,280,340,0],sn=[110,140,90,160,150,170,0];
  sv[6]=meals(posts,'Veg');sn[6]=meals(posts,'Non-Veg');
  const W=640,H=230,T=10,B=26,L=34,mx=520,bw=(W-L)/7,y=n=>T+(H-T-B)*(1-n/mx);
  let c=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Meals posted per day, Veg and Non-Veg">`+[0,250,500].map(t=>`<line class="gl" x1="${L}" x2="${W}" y1="${y(t)}" y2="${y(t)}"/><text x="${L-6}" y="${y(t)+4}" text-anchor="end">${t}</text>`).join('');
  days.forEach((d,i)=>{const x=L+i*bw+bw*.2,w=bw*.6;c+=`<rect x="${x}" y="${y(sv[i])}" width="${w}" height="${y(0)-y(sv[i])}" rx="2" fill="var(--leaf)"/><rect x="${x}" y="${y(sv[i]+sn[i])}" width="${w}" height="${y(sv[i])-y(sv[i]+sn[i])}" rx="2" fill="var(--crit)"/><text x="${x+w/2}" y="${H-8}" text-anchor="middle">${i===6?'Today':d}</text>`;});
  c+='</svg>';
  return `<div class="stats">${stat('Total donations',BASE.don+posts.length)}${stat('Total food redistributed',red.toLocaleString('en-IN')+' meals')}${stat('Food saved from wastage',Math.round(red*.45).toLocaleString('en-IN')+' kg')}${stat('People served',red.toLocaleString('en-IN'))}${stat('Active institutions',INST.filter(n=>reqs.some(r=>r.inst===n.id&&r.rem>0)).length)}${stat('Active donors',new Set(posts.filter(p=>p.status!=='Delivered').map(p=>p.donor)).size)}${stat('Active volunteers',VOL.length)}</div>
  <div class="cols" style="margin-top:0"><div class="card"><h3>Veg vs Non-Veg</h3><p style="margin-top:10px">${vn('Veg')} <b class="mono">${vm.toLocaleString('en-IN')}</b> meals &nbsp; ${vn('Non-Veg')} <b class="mono">${nm.toLocaleString('en-IN')}</b> meals</p>${split(vm,nm)}<p class="note">Sample history plus every post made here.</p>
  <h3 style="margin-top:20px">Donations and distribution, last 7 days</h3><div class="chartbox" style="margin-top:8px">${c}</div><div class="legend"><span><i style="background:var(--leaf)"></i>Veg</span><span><i style="background:var(--crit)"></i>Non-Veg</span></div></div>
  <div class="card"><h3>Map-based activity</h3><p class="note" style="margin-bottom:10px">Red rings are unmet requirements. Dashed lines are accepted donations on their way.</p>${mapSvg(ents(),{mini:true})}</div></div>`;
}
function renderDash(){
  $('#fbTabs').innerHTML=[['donor','Donor'],['inst','Institute / NGO'],['admin','Admin']].map(([k,l])=>`<button role="tab" data-fbtab="${k}" aria-selected="${fb.tab===k}">${l}</button>`).join('');
  $('#fbDashBody').innerHTML=fb.tab==='donor'?dashDonor():fb.tab==='inst'?dashInst():dashAdmin();
}
function renderChips(){
  $$('.fb-vt').forEach(el=>el.innerHTML=[['All','All food'],['Veg','Veg'],['Non-Veg','Non-Veg']].map(([v,l])=>`<button class="chip" data-fbvt="${v}" aria-pressed="${fb.vt===v}">${l}</button>`).join(' '));
  $$('.fb-rad').forEach(el=>el.innerHTML=[1,3,5,10].map(v=>`<button class="chip" data-fbrad="${v}" aria-pressed="${fb.rad===v}">${v} km</button>`).join(' '));
  $('#fbLayers').innerHTML=[['All','All'],['Hotels','Nearby Hotels'],['Restaurants','Restaurants'],['NGOs','NGOs'],['Institutes','Institutes'],['Centers','Sun Cart Centers'],['Available food','Available Food'],['Donors','Food Donors'],['Volunteers','Volunteers']].map(([v,l])=>`<button class="chip" data-fblayer="${v}" aria-pressed="${fb.layer===v}">${l}</button>`).join(' ');
}
function renderAll(){renderChips();renderAlerts();renderFood();renderResult();renderNeeds();renderMap();renderDash();}

/* ---------- markup ---------- */
const opt=a=>a.map(x=>`<option>${x}</option>`).join('');
const MARKUP=`
<div class="alt"><main class="wrap"><section id="fb-food">
  <h2>Surplus food, Veg and Non-Veg</h2>
  <p class="lead">Post what is left with its food type, quantity and safe-to-eat time. Veg and Non-Veg stay apart everywhere, and food close to its safe limit raises an urgent alert.</p>
  <div id="fbAlerts"></div>
  <div class="cols"><div class="card"><form class="f" id="fbForm" novalidate>
    <div class="fld full"><label for="fbDonor">Donor name</label><input id="fbDonor"></div>
    <div class="fld"><label for="fbType">Food type</label><select id="fbType"><option>Veg</option><option>Non-Veg</option></select></div>
    <div class="fld"><label for="fbCat">Food category</label><select id="fbCat">${opt(['Cooked meals','Bakery','Snacks','Sweets','Packed food','Beverages'])}</select></div>
    <div class="fld full"><label for="fbName">Food name</label><input id="fbName"></div>
    <div class="fld"><label for="fbQty">Quantity</label><input id="fbQty" type="number" min="1"></div>
    <div class="fld"><label for="fbUnit">Unit</label><select id="fbUnit">${opt(['kg','litres','packets'])}</select></div>
    <div class="fld full"><label for="fbServ">Number of servings / plates</label><input id="fbServ" type="number" min="1"></div>
    <div class="fld"><label for="fbPrep">Prepared at</label><input id="fbPrep" type="time"></div>
    <div class="fld"><label for="fbSafe">Safe to consume until</label><input id="fbSafe" type="time"></div>
    <div class="fld"><label for="fbPick">Pickup time</label><input id="fbPick" type="time"></div>
    <div class="fld"><label for="fbArea">Pickup area</label><select id="fbArea"></select></div>
    <div class="fld full"><label for="fbAddr">Pickup location</label><input id="fbAddr"></div>
    <div class="fld full"><label for="fbImg">Food image</label><input id="fbImg" type="file" accept="image/*"><div class="thumbs" id="fbThumb"></div></div>
    <label class="opt" style="grid-column:1/-1"><input type="checkbox" id="fbUrg"><span><b>Mark as urgent</b><br><span class="note">Food within 60 minutes of its safe limit is flagged automatically.</span></span></label>
    <div class="fld full"><button class="btn primary" type="submit">Post food and find recipients</button><p class="note">Example values shown. Change them and post.</p></div>
  </form></div><div class="card" id="fbResult" aria-live="polite"></div></div>
  <div class="tools" style="margin-top:32px"><span class="label">Show</span><div class="fb-vt" role="group" aria-label="Food type filter"></div></div>
  <div id="fbFood"></div>
</section></main></div>

<main class="wrap"><section id="fb-needs">
  <h2>What institutes need</h2>
  <p class="lead">Orphanages, old-age homes, schools, colleges and NGOs post what they need. Nearby donors see it, and suitable food is picked out automatically.</p>
  <div class="cols"><div class="card"><form class="f" id="fbReqForm" novalidate>
    <div class="fld full"><label for="fbIName">Institute name</label><input id="fbIName" list="fbInstList" value="Little Hearts Orphanage"><datalist id="fbInstList"></datalist></div>
    <div class="fld"><label for="fbIKind">Institute type</label><select id="fbIKind">${opt(['Orphanage','Old-age home','School','College','NGO','Other institute'])}</select></div>
    <div class="fld"><label for="fbIArea">Area</label><select id="fbIArea"></select></div>
    <div class="fld full"><label for="fbIAddr">Location</label><input id="fbIAddr" value="14 Mount Road, Guindy, Chennai"></div>
    <div class="fld"><label for="fbRType">Required food type</label><select id="fbRType"><option>Veg</option><option>Non-Veg</option></select></div>
    <div class="fld"><label for="fbRQty">Required quantity (meals)</label><input id="fbRQty" type="number" min="1" value="100"></div>
    <div class="fld"><label for="fbRPeople">Number of people</label><input id="fbRPeople" type="number" min="1" value="100"></div>
    <div class="fld"><label for="fbRWho">Adults / Children</label><select id="fbRWho">${opt(['Children','Adults','Adults and children'])}</select></div>
    <div class="fld"><label for="fbRBy">Required by (time)</label><input id="fbRBy" type="time" value="19:00"></div>
    <div class="fld"><label for="fbRUrg">Urgency level</label><select id="fbRUrg">${opt(['High','Medium','Low'])}</select></div>
    <div class="fld full"><p class="alertbox" id="fbReqLine" style="margin:0"></p></div>
    <div class="fld full"><button class="btn primary" type="submit">Post requirement</button></div>
  </form></div>
  <div class="card"><h3>Nearby requirements</h3>
    <div class="fbtools"><div class="fb-vt" role="group" aria-label="Food type filter"></div></div>
    <div class="fbtools"><span class="label">Within</span><div class="fb-rad" role="group" aria-label="Search radius"></div></div>
    <div class="fbreqs" id="fbNeeds"></div></div></div>
</section></main>

<div class="alt"><main class="wrap"><section id="fb-map">
  <h2>Nearby food map</h2>
  <p class="lead">Find hotels, restaurants, donors, institutes, Sun Cart Centers and volunteers around you. Tap a marker for quantities, pickup time and directions.</p>
  <div class="card" style="margin-top:24px">
    <div class="fbtools" style="margin-top:0"><div id="fbLayers" role="group" aria-label="Map layers"></div></div>
    <div class="fbtools"><div class="fb-vt" role="group" aria-label="Food type filter"></div><div class="fb-rad" role="group" aria-label="Search radius"></div></div>
    <div class="fbtools"><label class="label" for="fbMe">My location</label><select id="fbMe"></select><input class="search" id="fbQ" type="search" placeholder="Search by name or address" aria-label="Search the map"></div>
    <div class="fbcols"><div><div id="fbMap"></div>
      <div class="legend"><span><i style="background:var(--sun);border-radius:50%"></i>Hotel (H) / Restaurant (R)</span><span><i style="background:var(--leaf);border-radius:50%"></i>Food donor (D)</span><span><i style="background:var(--ink)"></i>NGO (N) / Institute (I)</span><span><i style="background:var(--leaf)"></i>Sun Cart Center (C)</span><span><i style="background:var(--blue);transform:rotate(45deg) scale(.85)"></i>Volunteer (V)</span></div></div>
      <div><div id="fbDetail"></div><div id="fbList"></div></div></div>
    <div id="fbRoute" style="margin-top:24px"></div>
  </div>
</section></main></div>

<main class="wrap"><section id="fb-dash">
  <h2>FoodBridge dashboards</h2>
  <p class="lead">Donors track pickups and impact, institutes track what they need and receive, and admins see the whole network.</p>
  <div class="tabs" role="tablist" id="fbTabs"></div><div id="fbDashBody" role="tabpanel"></div>
</section></main>`;

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-fbvt],[data-fbrad],[data-fblayer],[data-fbtab],[data-fbfind],[data-fbadv],[data-fbacc],[data-fbmk]');if(!b)return;const d=b.dataset;
  if(d.fbvt){fb.vt=d.fbvt;renderChips();renderFood();renderNeeds();renderMap();}
  else if(d.fbrad){fb.rad=+d.fbrad;renderChips();renderNeeds();renderMap();}
  else if(d.fblayer){fb.layer=d.fblayer;renderChips();renderMap();}
  else if(d.fbtab){fb.tab=d.fbtab;renderDash();}
  else if(d.fbfind){fb.res=d.fbfind;renderResult();$('#fbResult').scrollIntoView({behavior:'smooth',block:'start'});}
  else if(d.fbacc){const p=PO(d.fbacc);if(p)accept(p);}
  else if(d.fbadv){const p=PO(d.fbadv);if(p&&p.status!=='Delivered'){p.status=STATUS[STATUS.indexOf(p.status)+1];if(p.status==='Delivered')toast(p.id+' delivered. Thank you, '+p.donor+'.');renderAll();}}
  else if(d.fbmk){fb.sel=d.fbmk;renderMap();}
});
document.addEventListener('keydown',e=>{const g=e.target.closest&&e.target.closest('g[data-fbmk]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();fb.sel=g.dataset.fbmk;renderMap();}});
document.addEventListener('change',e=>{
  const id=e.target.id;
  if(id==='fbRouteSel'){fb.route=e.target.value;renderMap();}
  else if(id==='fbVia'){fb.viaCtr=e.target.checked;renderMap();}
  else if(id==='fbMe'){fb.me=e.target.value;renderNeeds();renderFood();renderAlerts();renderMap();}
  else if(id==='fbDonorSel'){fb.donor=e.target.value;renderDash();}
  else if(id==='fbInstSel'){fb.inst=e.target.value;renderDash();}
  else if(id==='fbImg'){const f=e.target.files[0];fb.img=f?URL.createObjectURL(f):null;$('#fbThumb').innerHTML=fb.img?`<div class="thumb"><img src="${fb.img}" alt="Food photo preview"></div>`:'';}
});
document.addEventListener('input',e=>{if(e.target.id==='fbQ'){fb.q=e.target.value;renderMap();}else if(e.target.closest&&e.target.closest('#fbReqForm'))reqLine();});

function init(){
  const anchor=$('#dashboards');if(!anchor)return;
  anchor.closest('main').insertAdjacentHTML('beforebegin',MARKUP);
  $('.nav').insertAdjacentHTML('beforeend','<a href="#fb-food">Food posts</a><a href="#fb-needs">Requirements</a><a href="#fb-map">Food map</a><a href="#fb-dash">FoodBridge dashboards</a>');
  const areas=Object.keys(AREAS).map(a=>`<option>${a}</option>`).join('');
  ['#fbArea','#fbIArea','#fbMe'].forEach(s=>{$(s).innerHTML=areas;$(s).value='Guindy';});
  $('#fbInstList').innerHTML=INST.map(i=>`<option value="${esc(i.name)}">`).join('');
  $('#fbDonor').value='Grand Residency Hotel';$('#fbName').value='Veg meals: rice, dal, vegetable curry';$('#fbQty').value=48;$('#fbServ').value=120;
  $('#fbPrep').value=hhmm(inMin(-60));$('#fbSafe').value=hhmm(inMin(180));$('#fbPick').value=hhmm(inMin(30));$('#fbAddr').value='12 Mount Road, Guindy, Chennai';
  $('#fbForm').addEventListener('submit',ev=>{
    ev.preventDefault();
    const donor=$('#fbDonor').value.trim(),name=$('#fbName').value.trim(),qty=+$('#fbQty').value,serv=+$('#fbServ').value;
    if(!donor||!name||!(qty>0)||!(serv>0))return toast('Add donor, food name, quantity and servings');
    if(!$('#fbSafe').value||!$('#fbPick').value||!$('#fbPrep').value)return toast('Add prepared, safe-until and pickup times');
    const safeAt=atTime($('#fbSafe').value),pickAt=atTime($('#fbPick').value);
    if(safeAt<=now())return toast('That safe-to-consume time has already passed');
    const area=$('#fbArea').value,src=SRC.find(s=>s.name.toLowerCase()===donor.toLowerCase());
    const p=mkP({donor,pos:src?[src.pos[0]+1.6,src.pos[1]+1.6]:jit(AREAS[area],hash(donor)),area,addr:$('#fbAddr').value.trim()||area+', Chennai',type:$('#fbType').value,cat:$('#fbCat').value,name,qty,unit:$('#fbUnit').value,serv,prepAt:atTime($('#fbPrep').value,1),safeAt,pickAt,urgent:$('#fbUrg').checked,img:fb.img});
    posts.unshift(p);fb.donor=donor;fb.res=p.id;fb.img=null;$('#fbThumb').innerHTML='';$('#fbImg').value='';$('#fbUrg').checked=false;
    renderAll();$('#fbResult').scrollIntoView({behavior:'smooth',block:'start'});
    if(urgent(p)){const ms=rank(p).length,vs=VOL.filter(v=>dist(v.pos,p.pos)<=5).length;toast(`Urgent alert sent to ${ms} institute${ms===1?'':'s'} and ${vs} volunteer${vs===1?'':'s'}`);}else toast('Food posted');
  });
  $('#fbReqForm').addEventListener('submit',ev=>{
    ev.preventDefault();
    const name=$('#fbIName').value.trim(),qty=+$('#fbRQty').value,people=+$('#fbRPeople').value,by=$('#fbRBy').value;
    if(!name||!(qty>0)||!(people>0)||!by)return toast('Add institute, quantity, people and time');
    let inst=INST.find(i=>i.name.toLowerCase()===name.toLowerCase());
    if(!inst){const area=$('#fbIArea').value,h=hash(name);inst={id:'I'+(INST.length+1),name,k:$('#fbIKind').value,pos:jit(AREAS[area],h),addr:$('#fbIAddr').value.trim()||area+', Chennai',ph:'+91 98410 23'+String(h%900+100)};INST.push(inst);$('#fbInstList').insertAdjacentHTML('beforeend',`<option value="${esc(name)}">`);}
    reqs.unshift(mkR({inst:inst.id,type:$('#fbRType').value,qty,people,who:$('#fbRWho').value,byAt:atTime(by),urg:$('#fbRUrg').value}));
    fb.inst=inst.id;renderAll();toast('Requirement posted. Nearby donors can see it now.');
  });
  fb.res='FP-2';reqLine();renderAll();
  setInterval(()=>{renderAlerts();renderFood();renderNeeds();},30000);
}
init();
})();
