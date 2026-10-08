(function(){
const $=(s,el=document)=>el.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inr=n=>'₹'+Number(n).toLocaleString('en-IN');

/* ---------- data (sample) ---------- */
const PRODUCTS=[
 {id:1,cat:'food',type:'Rice',img:'biryaniV',photo:'biryani',name:'Veg Dum Biryani',store:'Saravana Kitchen',price:180},
 {id:2,cat:'food',type:'Rice',img:'biryaniC',photo:'biryani',name:'Chicken Biryani',store:'Malabar Pot',price:240},
 {id:3,cat:'food',type:'Tiffin',img:'dosa',photo:'dosa',name:'Masala Dosa Combo',store:'Murugan Tiffins',price:120},
 {id:4,cat:'food',type:'Curries',img:'paneer',photo:'paneerButterMasala',name:'Paneer Butter Masala + Naan',store:'Punjab Rasoi',price:260},
 {id:5,cat:'food',type:'Bakery & drinks',img:'bread',name:'Wheat Bread Loaf',store:'Hot Breads Bakery',price:55},
 {id:20,cat:'food',type:'Tiffin',img:'idli',name:'Idli Sambar, 4 pcs',store:'Murugan Tiffins',price:90},
 {id:21,cat:'food',type:'Street food',img:'samosa',photo:'samosa',name:'Veg Samosa, 4 pcs',store:'Punjab Rasoi',price:60},
 {id:22,cat:'food',type:'Bakery & drinks',img:'lassi',name:'Mango Lassi, 300 ml',store:'Malabar Pot',price:80},
 {id:23,cat:'food',type:'Curries',photo:'butterChicken',name:'Butter Chicken with Naan and Rice',store:'Punjab Rasoi',price:320},
 {id:24,cat:'food',type:'Street food',photo:'burger',name:'Double Cheese Burger',store:'Burger Barn',price:210},
 {id:25,cat:'food',type:'Rice',photo:'platter',name:'Rice and Grill Platter',store:'Banana Leaf Kitchen',price:380},
 {id:26,cat:'food',type:'Curries',photo:'palakPaneer',name:'Palak Paneer',store:'Punjab Rasoi',price:230},
 {id:27,cat:'food',type:'Curries',photo:'dalMakhani',name:'Dal Makhani',store:'Punjab Rasoi',price:190},
 {id:28,cat:'food',type:'Curries',photo:'mixedVeg',name:'Mixed Veg Curry',store:'Saravana Kitchen',price:160},
 {id:29,cat:'food',type:'Tiffin',photo:'alooParatha',name:'Aloo Paratha with Curd',store:'Murugan Tiffins',price:110},
 {id:30,cat:'food',type:'Grill',photo:'tandoori',name:'Tandoori Chicken, 2 pcs',store:'Malabar Pot',price:280},
 {id:31,cat:'food',type:'Street food',photo:'paniPuri',name:'Pani Puri, 6 pcs',store:'Chaat Corner',price:70},
 {id:32,cat:'food',type:'Street food',photo:'vadaPav',name:'Vada Pav',store:'Chaat Corner',price:40},
 {id:33,cat:'food',type:'Street food',photo:'pavBhaji',name:'Pav Bhaji',store:'Chaat Corner',price:140},
 {id:34,cat:'food',type:'Street food',photo:'bhelPuri',name:'Bhel Puri',store:'Chaat Corner',price:80},
 {id:35,cat:'food',type:'Street food',photo:'choleBhature',name:'Chole Bhature',store:'Punjab Rasoi',price:150},
 {id:36,cat:'food',type:'Street food',photo:'alooTikki',name:'Aloo Tikki, 2 pcs',store:'Chaat Corner',price:90},
 {id:37,cat:'food',type:'Street food',photo:'kachori',name:'Kachori with Chutney, 2 pcs',store:'Chaat Corner',price:60},
 {id:6,cat:'groceries',name:'Basmati Rice, 5 kg',store:'Daily Fresh Mart',price:560},
 {id:7,cat:'groceries',name:'Toor Dal, 1 kg',store:'Daily Fresh Mart',price:165},
 {id:8,cat:'groceries',name:'Tomatoes, 1 kg',store:'Green Basket',price:38},
 {id:9,cat:'groceries',name:'Full Cream Milk, 1 L',store:'Green Basket',price:68},
 {id:10,cat:'groceries',name:'Eggs, tray of 12',store:'Daily Fresh Mart',price:84},
 {id:11,cat:'medicines',name:'Paracetamol 500 mg, strip of 15',store:'City Care Pharmacy',price:32},
 {id:12,cat:'medicines',name:'ORS Sachets, pack of 5',store:'City Care Pharmacy',price:60},
 {id:13,cat:'medicines',name:'Cetirizine 10 mg, strip of 10',store:'Lifeline Medicals',price:28},
 {id:14,cat:'medicines',name:'Amoxicillin 500 mg, strip of 10',store:'Lifeline Medicals',price:120,rx:true},
 {id:15,cat:'medicines',name:'Digital Thermometer',store:'Lifeline Medicals',price:210},
 {id:16,cat:'essentials',name:'Dishwash Liquid, 500 ml',store:'Home Needs',price:110},
 {id:17,cat:'essentials',name:'Laundry Detergent, 1 kg',store:'Home Needs',price:135},
 {id:18,cat:'essentials',name:'Bath Soap, pack of 4',store:'Home Needs',price:120},
 {id:19,cat:'essentials',name:'Hand Sanitiser, 500 ml',store:'Home Needs',price:145}
];
const CATS=[['food','Food'],['groceries','Groceries'],['medicines','Medicines'],['essentials','Essentials']];
const AREAS={'Adyar':[28,66],'Anna Nagar':[34,24],'Guindy':[44,64],'T. Nagar':[46,48],'Tambaram':[42,92],'Velachery':[58,74]};
const centers=[
 {id:'adyar',name:'Adyar Center',pos:[30,72],cap:400,load:250,need:6,open:true,benef:'Orphanage, 62 children',partners:14},
 {id:'tnagar',name:'T. Nagar Center',pos:[48,44],cap:300,load:285,need:4,open:true,benef:'Night shelter, 90 people',partners:9},
 {id:'annanagar',name:'Anna Nagar Center',pos:[36,20],cap:350,load:120,need:8,open:true,benef:'Old-age home, 38 residents',partners:11},
 {id:'velachery',name:'Velachery Center',pos:[60,78],cap:450,load:140,need:7,open:true,benef:'Orphanage, 48 children',partners:12},
 {id:'tambaram',name:'Tambaram Center',pos:[40,95],cap:250,load:60,need:9,open:false,benef:'Shelter, 70 people',partners:6}
];
const drivers=['Karthik R','Meena S','Imran K','Divya P'];
let donations=[
 {id:'D-311',donor:'Hot Breads Bakery',meals:60,center:'Adyar Center',status:0,benef:'Orphanage, 62 children'},
 {id:'D-310',donor:'Grand Residency Hotel',meals:140,center:'Velachery Center',status:1,benef:'Orphanage, 48 children'},
 {id:'D-309',donor:'Fresh Basket Supermarket',meals:85,center:'Anna Nagar Center',status:2,benef:'Old-age home, 38 residents'}
];
const STATUS=['Pickup assigned','Received','Verified','Distributed'];
let st={type:'All',imgStyle:'photo',photos:[],cat:'food',q:'',cart:{},roundUp:true,rescued:1284,donors:46,rx:false,role:'customer',last:null,driverIx:0,orderN:4199};
let orders=[{id:'SC-4198',items:3,total:486,step:2,sample:true}];
const STEPS=['Confirmed','Packed','Picked up','On the way','Delivered'];

/* ---------- toasts ---------- */
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),3200);}

/* ---------- shop ---------- */
function renderCats(){
  $('#cats').innerHTML=CATS.map(([k,l])=>`<button class="chip" data-cat="${k}" aria-pressed="${st.cat===k}">${l}</button>`).join(' ');
}
/* ---------- food illustrations: one drawing, four styles ---------- */
const PLATE=[['ellipse','cx="60" cy="68" rx="52" ry="15"','#E4DFD2','l'],['ellipse','cx="60" cy="65" rx="44" ry="11"','#F7F4EC','l']];
const bowl=(x,y,inner,tone)=>[['ellipse',`cx="${x}" cy="${y}" rx="12" ry="6"`,'#D9D3C4','l'],['ellipse',`cx="${x}" cy="${y-1}" rx="9" ry="3.8"`,inner,tone]];
const dots=(pts,c,r=2.4)=>pts.map(([x,y])=>['circle',`cx="${x}" cy="${y}" r="${r}"`,c,'d']);
const biryani=chicken=>[...PLATE,
  ['path','d="M22 62 Q60 6 98 62 Q60 76 22 62Z"','#E8B04A','m'],
  ...dots([[44,46],[58,34],[74,46],[52,56],[70,58],[86,56]],'#C9782B'),
  ...(chicken?[['ellipse','cx="46" cy="40" rx="9" ry="6" transform="rotate(-20 46 40)"','#9A5A2B','d'],['ellipse','cx="76" cy="42" rx="9" ry="6" transform="rotate(15 76 42)"','#8A4B22','d']]:[['circle','cx="50" cy="30" r="4.5"','#D64A3A','d']]),
  ['ellipse','cx="62" cy="24" rx="7" ry="4" transform="rotate(-30 62 24)"','#3E9B5C','d'],
  ['ellipse','cx="72" cy="27" rx="7" ry="4" transform="rotate(25 72 27)"','#2F8A4E','d']];
/* Sample photos live in the images folder. To replace one, save a better file with the same name (for example images/dosa.webp). */
const PHOTOS=Object.fromEntries(["burger", "platter", "butterChicken", "paneerButterMasala", "palakPaneer", "alooParatha", "tandoori", "mixedVeg", "dalMakhani", "biryani", "paniPuri", "samosa", "vadaPav", "pavBhaji", "bhelPuri", "choleBhature", "dosa", "alooTikki", "kachori"].map(k=>[k,'images/'+k+'.webp']));
const IMG={
  biryaniV:biryani(false),
  biryaniC:biryani(true),
  dosa:[...PLATE,
    ['path','d="M10 58 Q56 12 112 44 Q70 68 10 58Z"','#E2A64F','m'],
    ...dots([[34,52],[52,40],[72,42],[92,46],[60,54]],'#C98A34',2.2),
    ...bowl(24,76,'#F6F3EA','l'),...bowl(60,80,'#5BAA5E','d'),...bowl(96,76,'#C5622B','d')],
  paneer:[
    ['ellipse','cx="60" cy="78" rx="50" ry="8"','#E4DFD2','l'],
    ['path','d="M82 40 Q110 28 114 62 Q94 76 80 66Z"','#EBCB93','l'],
    ...dots([[92,50],[102,58],[96,64]],'#B07A3A',2),
    ['path','d="M12 42 H80 Q78 74 46 76 Q14 74 12 42Z"','#D8D1C2','l'],
    ['ellipse','cx="46" cy="42" rx="34" ry="9"','#E07A33','m'],
    ['rect','x="26" y="36" width="11" height="8" rx="2" transform="rotate(-12 31 40)"','#F6E6B9','l'],
    ['rect','x="52" y="34" width="11" height="8" rx="2" transform="rotate(10 57 38)"','#F6E6B9','l'],
    ['ellipse','cx="44" cy="43" rx="11" ry="3" ','#FFF4DD','l'],
    ...dots([[36,46],[62,45],[48,38]],'#3E9B5C',1.8)],
  bread:[
    ['ellipse','cx="60" cy="78" rx="52" ry="8"','#E4DFD2','l'],
    ['path','d="M14 54 Q14 24 58 24 Q102 24 102 54 L102 68 Q102 74 96 74 H20 Q14 74 14 68Z"','#C98A47','m'],
    ['path','d="M24 50 Q28 32 58 32 Q88 32 92 50"','#E0A862','l'],
    ['ellipse','cx="40" cy="42" rx="9" ry="3" transform="rotate(-25 40 42)"','#F2D49C','l'],
    ['ellipse','cx="60" cy="38" rx="9" ry="3" transform="rotate(-25 60 38)"','#F2D49C','l'],
    ['ellipse','cx="80" cy="42" rx="9" ry="3" transform="rotate(-25 80 42)"','#F2D49C','l'],
    ['rect','x="88" y="52" width="26" height="24" rx="4"','#F1DDB0','l'],
    ['rect','x="92" y="56" width="18" height="16" rx="3"','#F8EBC9','l']],
  idli:[...PLATE,
    ['path','d="M36 56 Q36 28 54 28 Q72 28 72 56Z"','#FAF7EE','l'],
    ['path','d="M16 66 Q16 40 34 40 Q52 40 52 66Z"','#F5F1E4','l'],
    ['path','d="M50 68 Q50 42 68 42 Q86 42 86 68Z"','#FAF7EE','l'],
    ['ellipse','cx="28" cy="48" rx="5" ry="2.4"','#E3DCC8','d'],['ellipse','cx="62" cy="50" rx="5" ry="2.4"','#E3DCC8','d'],['ellipse','cx="54" cy="36" rx="5" ry="2.4"','#E3DCC8','d'],
    ...bowl(100,66,'#C5622B','d'),...bowl(100,48,'#6BB36B','d')],
  samosa:[...PLATE,
    ['path','d="M12 70 L46 22 L80 70Z"','#D9983F','m'],
    ['path','d="M50 74 L82 30 L112 74Z"','#C98630','m'],
    ...dots([[46,46],[40,58],[54,60],[82,52],[74,64],[92,64]],'#A86A22',2.2),
    ...bowl(100,22,'#5BAA5E','d')],
  lassi:[
    ['ellipse','cx="60" cy="82" rx="30" ry="5"','#E4DFD2','l'],
    ['rect','x="63" y="2" width="5" height="40" rx="2" transform="rotate(12 65 22)"','#3E9B5C','d'],
    ['path','d="M38 18 H82 L75 76 Q74 82 69 82 H51 Q46 82 45 76Z"','#F9D56E','m'],
    ['ellipse','cx="60" cy="18" rx="22" ry="5" ','#FCEFC4','l'],
    ['ellipse','cx="60" cy="19" rx="17" ry="3" ','#FFF8E0','l'],
    ['path','d="M84 62 Q102 54 106 72 Q90 80 84 62Z"','#F2A01A','m'],
    ['ellipse','cx="30" cy="70" rx="8" ry="4" transform="rotate(-30 30 70)"','#3E9B5C','d']]
};
const DUO={l:'var(--surface)',m:'var(--sun)',d:'var(--leaf)'};
function art(key,style){
  const body=IMG[key].map(([tag,a,c,t])=>{
    let s;
    if(style==='line')s='style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5;stroke-linejoin:round"';
    else if(style==='sticker')s=`style="fill:${c};stroke:var(--ink);stroke-width:1.8;stroke-linejoin:round"`;
    else if(style==='duo')s=`style="fill:${DUO[t]}"`;
    else s=`style="fill:${c}"`;
    return `<${tag} ${a} ${s}/>`;}).join('');
  return `<svg viewBox="0 0 120 90" aria-hidden="true">${body}</svg>`;
}
const IMG_STYLES=[['photo','Sample photos'],['flat','Flat'],['sticker','Sticker'],['line','Line art'],['duo','Duotone']];
const TYPES=['All','Curries','Rice','Tiffin','Street food','Grill','Bakery & drinks'];
function renderTypes(){
  $('#types').innerHTML=TYPES.map(t=>`<button class="chip" data-type="${esc(t)}" aria-pressed="${st.type===t}">${esc(t)}</button>`).join(' ');
}
function renderStyles(){
  $('#styles').innerHTML=IMG_STYLES.map(([k,l])=>`<button class="chip" data-style="${k}" aria-pressed="${st.imgStyle===k}">${l}</button>`).join(' ');
}
function renderProducts(){
  const q=st.q.trim().toLowerCase();
  $('#styleRow').hidden=!(st.cat==='food'||q);
  $('#typeRow').hidden=!(st.cat==='food'&&!q);
  const list=PRODUCTS.filter(p=>(q?true:p.cat===st.cat)&&(!q||(p.name+' '+p.store).toLowerCase().includes(q))&&(q||st.cat!=='food'||st.type==='All'||p.type===st.type));
  $('#products').innerHTML=list.length?list.map(p=>`
    <article class="prod">
      ${p.photo&&PHOTOS[p.photo]&&(!p.img||st.imgStyle==='photo')?`<div class="tile photo"><img src="${PHOTOS[p.photo]}" data-id="${p.id}" alt="${esc(p.name)}" loading="lazy" decoding="async"></div>`:p.img&&IMG[p.img]?`<div class="tile art s-${st.imgStyle}">${art(p.img,st.imgStyle)}</div>`:`<div class="tile ${p.cat}" aria-hidden="true">${esc(p.name[0])}</div>`}
      <div class="b">
        <h3>${esc(p.name)}</h3>
        <div class="s">${esc(p.store)}</div>
        ${p.rx?'<div><span class="pill warn">Prescription required</span></div>':''}
        <div class="row"><span class="price">${inr(p.price)}</span><button class="btn primary small" data-add="${p.id}">Add</button></div>
      </div>
    </article>`).join(''):'<div class="empty">Nothing matches that search. Try a store name or a different item.</div>';
  document.querySelectorAll('.tile.photo img').forEach(img=>{
    const fix=()=>{const p=PRODUCTS.find(x=>x.id==img.dataset.id),t=img.closest('.tile');if(!p||!t)return;
      if(p.img&&IMG[p.img]){const sty=st.imgStyle==='photo'?'flat':st.imgStyle;t.className='tile art s-'+sty;t.innerHTML=art(p.img,sty);}
      else{t.className='tile '+p.cat;t.textContent=p.name[0];}};
    img.addEventListener('error',fix);
    if(img.complete&&!img.naturalWidth)fix();
  });
}
const cartCount=()=>Object.values(st.cart).reduce((a,b)=>a+b,0);
const cartItems=()=>Object.entries(st.cart).map(([id,q])=>({p:PRODUCTS.find(x=>x.id==id),q}));
function totals(){
  const sub=cartItems().reduce((a,{p,q})=>a+p.price*q,0);
  const fee=sub===0?0:(sub>=299?0:30);
  const don=st.roundUp&&sub>0?10:0;
  return {sub,fee,don,total:sub+fee+don};
}
function renderCart(){
  $('#cartN').textContent=cartCount();
  const items=cartItems();
  $('#cartList').innerHTML=items.length?items.map(({p,q})=>`
    <div class="line-item"><div><b>${esc(p.name)}</b><div class="note" style="margin:0">${esc(p.store)}</div></div>
    <span class="price">${inr(p.price*q)}</span>
    <div class="qty"><button data-dec="${p.id}" aria-label="Remove one ${esc(p.name)}">-</button><span>${q}</span><button data-inc="${p.id}" aria-label="Add one ${esc(p.name)}">+</button></div>
    <button class="btn small" style="background:none;color:var(--muted);justify-self:end;padding:4px 0" data-del="${p.id}">Remove</button></div>`).join('')
    :'<div class="empty">Your cart is empty. Add something from the shop.</div>';
  const needRx=items.some(({p})=>p.rx);
  $('#rxBlock').hidden=!needRx;
  const t=totals();
  $('#sum').innerHTML=`<div><span>Items</span><span class="price">${inr(t.sub)}</span></div>
    <div><span>Delivery ${t.sub>=299?'(free over ₹299)':''}</span><span class="price">${inr(t.fee)}</span></div>
    <div><span>Sun Cart meals</span><span class="price">${inr(t.don)}</span></div>
    <div class="tot"><span>Total</span><span class="price">${inr(t.total)}</span></div>`;
  $('#payBtn').disabled=!items.length||(needRx&&!st.rx);
}
function openCart(o){
  $('#drawer').classList.toggle('open',o);$('#veil').classList.toggle('open',o);
  $('#drawer').setAttribute('aria-hidden',String(!o));
  if(o)$('#closeCart').focus(); else $('#openCart').focus();
}
function placeOrder(){
  const items=cartItems(),t=totals();
  const method=($('input[name=pay]:checked')||{}).value||'UPI';
  orders.unshift({id:'SC-'+(++st.orderN),items:cartCount(),total:t.total,step:0,pay:method});
  st.cart={};st.rx=false;$('#rx').value='';
  renderCart();renderOrders();openCart(false);
  toast('Order placed. Paid by '+method+'.');
  $('#orders').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderOrders(){
  $('#orderList').innerHTML=orders.map(o=>`
    <div class="order"><div class="h"><div><b class="mono">${o.id}</b> <span class="note">${o.items} items, ${inr(o.total)}${o.sample?' (sample order)':''}</span></div>
    <span class="pill ${o.step===4?'good':'warn'}">${o.step===4?'Delivered':STEPS[o.step]}</span></div>
    <div class="steps">${STEPS.map((s,i)=>`<span class="${i<=o.step?'on':''} ${i===o.step&&o.step<4?'now':''}">${s}</span>`).join('')}</div>
    <p class="note">${o.step===4?'Thanks for ordering. Rate your delivery from the Customer dashboard.':'Arriving in about '+Math.max(5,(4-o.step)*9)+' minutes.'}</p></div>`).join('');
}
setInterval(()=>{let ch=false;orders.forEach(o=>{if(o.step<4){o.step++;ch=true;if(o.step===4)toast('Order '+o.id+' delivered');}});if(ch){renderOrders();if(st.role==='customer')renderDash();}},6000);

/* ---------- AI matching ---------- */
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])*0.3;
function match(donor){
  const from=AREAS[donor.area];
  return centers.map(c=>{
    const d=dist(from,c.pos),eta=Math.round(d/20*60+12);
    const left=donor.safe-donor.cooked-eta/60;
    const free=c.cap-c.load;
    const feasible=left>=0.5&&c.open;
    let s=100-d*5+Math.min(1,free/donor.meals)*30+c.need*2;
    if(!c.open)s-=40; if(left<0.5)s-=100;
    return {c,d,eta,left,free,feasible,score:Math.max(0,Math.round(s))};
  }).sort((a,b)=>(b.feasible-a.feasible)||(b.score-a.score));
}
function runMatch(){
  const donor={name:$('#dName').value.trim()||'Anonymous donor',type:$('#dType').value,area:$('#dArea').value,food:$('#dFood').value.trim(),
    meals:Math.max(1,+$('#dMeals').value||1),cooked:Math.max(0,+$('#dCooked').value||0),safe:Math.max(1,+$('#dSafe').value||1)};
  const ranked=match(donor);
  const ok=ranked.filter(r=>r.feasible);
  let alloc=[];
  if(ok.length){
    let rest=donor.meals;
    for(const r of ok){ if(rest<=0)break; const n=Math.min(rest,r.free); if(n>0){alloc.push({r,n});rest-=n;} }
    if(rest>0&&alloc.length)alloc[alloc.length-1].n+=rest; // overflow goes to last center, staff can reroute
  }
  st.last={donor,ranked,alloc};
  renderResult();
}
function mapSvg(){
  const {donor,ranked,alloc}=st.last;const from=AREAS[donor.area];
  const sel=alloc.map(a=>a.r.c.id);
  let s='<svg class="map" viewBox="0 0 100 100" role="img" aria-label="Schematic map of donor and Sun Cart Centers">';
  for(let i=10;i<100;i+=20)s+=`<line class="grid-l" x1="${i}" y1="0" x2="${i}" y2="100"/><line class="grid-l" x1="0" y1="${i}" x2="100" y2="${i}"/>`;
  alloc.forEach(a=>{s+=`<line class="route" x1="${from[0]}" y1="${from[1]}" x2="${a.r.c.pos[0]}" y2="${a.r.c.pos[1]}"/>`;});
  centers.forEach(c=>{s+=`<rect class="ctr ${sel.includes(c.id)?'sel':''}" x="${c.pos[0]-2.2}" y="${c.pos[1]-2.2}" width="4.4" height="4.4" rx=".8"/><text x="${c.pos[0]+3.5}" y="${c.pos[1]+1.2}">${esc(c.name.replace(' Center',''))}</text>`;});
  s+=`<circle class="donor" cx="${from[0]}" cy="${from[1]}" r="3"/><text x="${from[0]-3}" y="${from[1]-4.5}">Pickup: ${esc(donor.area)}</text></svg>`;
  return s;
}
function renderResult(){
  const el=$('#result');
  if(!st.last){el.innerHTML='<div class="empty">Matches appear here. Fill in the form and press Find best center.</div>';return;}
  const {donor,ranked,alloc}=st.last;
  let h=`<h3>Ranked centers for ${donor.meals} meals</h3><div class="match" style="margin-top:12px">`;
  ranked.slice(0,3).forEach((r,i)=>{
    h+=`<div class="cand ${i===0&&r.feasible?'best':''}"><div class="rank">${i+1}</div><div><b>${esc(r.c.name)}</b>
      <small>${r.d.toFixed(1)} km, about ${r.eta} min. ${r.c.open?(r.free+' meals of space free'):'Closed right now'}.</small>
      <small>${r.feasible?'Fresh on arrival: '+Math.max(0,r.left).toFixed(1)+' h of safe time left':(r.c.open?'Would arrive past the safe window':'Not accepting donations')}</small></div>
      <div class="score">${r.score}<small>match</small></div></div>`;
  });
  h+='</div>'+mapSvg();
  if(!alloc.length){
    h+='<div class="alertbox crit"><b>No center can take this batch in time.</b> Food has too little safe time left for the drive. Contact the nearest center by phone, or list a smaller batch you can hand over sooner.</div>';
  } else {
    const split=alloc.length>1;
    h+=`<div class="alertbox good"><b>${split?'Split across '+alloc.length+' centers':'Best match: '+esc(alloc[0].r.c.name)}</b><br>`+
      alloc.map(a=>`${a.n} meals to ${esc(a.r.c.name)} (${a.r.eta} min) for ${esc(a.r.c.benef)}`).join('<br>')+'</div>';
    h+='<p style="margin-top:12px"><button class="btn primary" id="confirmDon">Confirm pickup</button></p>';
  }
  el.innerHTML=h;
}
function confirmDonation(){
  const {donor,alloc}=st.last;
  const drv=drivers[st.driverIx++%drivers.length];
  alloc.forEach((a,i)=>{
    a.r.c.load+=a.n;
    donations.unshift({id:'D-'+(312+donations.length),donor:donor.name,meals:a.n,center:a.r.c.name,status:0,benef:a.r.c.benef,driver:drv,photos:i===0?st.photos.slice():[]});
    st.rescued+=a.n;
  });
  st.donors++;st.photos=[];renderThumbs();
  $('#rescued').textContent=st.rescued.toLocaleString('en-IN');
  $('#sDonors').textContent=st.donors;
  $('#result').innerHTML=`<div class="alertbox good"><b>Pickup confirmed.</b><br>${esc(drv)} is heading to ${esc(donor.name)} and will arrive in about ${alloc[0].r.eta} minutes. Keep the food covered and ready at the gate.</div>
    <p style="margin-top:12px"><button class="btn line" id="again">List another batch</button></p>`;
  st.last=null;
  renderCenters();renderDash();
  toast('Pickup assigned to '+drv);
}

/* ---------- centers ---------- */
function renderCenters(){
  $('#ccards').innerHTML=centers.map(c=>{
    const pct=Math.round(c.load/c.cap*100),hi=pct>=90;
    return `<article class="card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:start"><h3>${esc(c.name)}</h3>
      <span class="pill ${!c.open?'plain':hi?'warn':'good'}">${!c.open?'Opens 18:00':hi?'Near capacity':'Open'}</span></div>
      <div class="bar" role="img" aria-label="${pct} percent full"><i class="${hi?'hi':''}" style="width:${pct}%"></i></div>
      <div class="note" style="margin:6px 0 10px">${c.load} of ${c.cap} meals held</div>
      <div class="kv"><span>Serves</span><span>${esc(c.benef)}</span></div>
      <div class="kv"><span>Donor partners</span><span class="mono">${c.partners}</span></div>
      <div class="kv"><span>Beneficiary need</span><span class="mono">${c.need}/10</span></div></article>`;
  }).join('');
  $('#sCenters').textContent=centers.length;
}

/* ---------- chart ---------- */
function renderChart(){
  const hours=[10,11,12,13,14,15,16,17,18,19,20,21,22];
  const v=[22,48,96,118,84,46,38,52,74,102,96,64,30];
  const W=640,H=260,L=40,R=8,T=14,B=30,max=120;
  const pw=W-L-R,ph=H-T-B,bw=pw/v.length;
  const y=n=>T+ph-(n/max)*ph;
  const peak=[...v].sort((a,b)=>b-a).slice(0,3);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart of predicted orders per hour from 10:00 to 22:00. Orders peak at 13:00 with 118 and at 19:00 with 102, and dip between 15:00 and 17:00.">`;
  s+=`<rect x="${L+bw*5}" y="${T}" width="${bw*3}" height="${ph}" fill="var(--sun-soft)"/>`;
  [0,40,80,120].forEach(t=>{s+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}"/><text x="${L-6}" y="${y(t)+4}" text-anchor="end">${t}</text>`;});
  v.forEach((n,i)=>{
    const x=L+i*bw+bw*.18,w=bw*.64,isP=peak.includes(n);
    s+=`<rect x="${x}" y="${y(n)}" width="${w}" height="${y(0)-y(n)}" rx="2" fill="${isP?'var(--sun)':'var(--leaf)'}"/>`;
    s+=`<text x="${x+w/2}" y="${H-10}" text-anchor="middle">${hours[i]}</text>`;
  });
  s+='</svg>';
  $('#chart').innerHTML=s;
}

/* ---------- dashboards ---------- */
const ROLES=[['customer','Customer'],['restaurant','Restaurant'],['store','Grocery and medical'],['delivery','Delivery partner'],['center','Center staff'],['admin','Admin']];
const STOCK=[
 {name:'Veg Dum Biryani',left:42,type:'cooked',store:'Saravana Kitchen'},
 {name:'Curd Rice',left:30,type:'cooked',store:'Saravana Kitchen'},
 {name:'Chapati',left:64,type:'cooked',store:'Saravana Kitchen'}
];
const INV=[
 {name:'Full Cream Milk, 1 L',stock:48,days:2,kind:'grocery'},
 {name:'Whole Wheat Bread',stock:20,days:1,kind:'grocery'},
 {name:'Toor Dal, 1 kg',stock:6,days:200,kind:'grocery'},
 {name:'ORS Sachets, pack of 5',stock:9,days:90,kind:'medical'},
 {name:'Paracetamol 500 mg',stock:4,days:20,kind:'medical'}
];
function table(head,rows){return `<div class="tbl"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;}
function renderTabs(){
  $('#tabs').innerHTML=ROLES.map(([k,l])=>`<button role="tab" data-role="${k}" aria-selected="${st.role===k}">${l}</button>`).join('');
}
function renderDash(){
  const r=st.role,el=$('#dashBody');let h='';
  if(r==='customer'){
    const mine=orders.length;
    h=`<div class="stats"><div class="stat"><span class="label">Orders</span><b>${mine+6}</b></div><div class="stat"><span class="label">Meals you funded</span><b>${14+(st.roundUp?0:0)}</b></div><div class="stat"><span class="label">Saved addresses</span><b>2</b></div></div>`+
      table(['Order','Items','Total','Status'],orders.map(o=>`<tr><td class="mono">${o.id}</td><td class="num">${o.items}</td><td class="num">${inr(o.total)}</td><td><span class="pill ${o.step===4?'good':'warn'}">${o.step===4?'Delivered':STEPS[o.step]}</span></td></tr>`));
  } else if(r==='restaurant'){
    h=`<div class="stats"><div class="stat"><span class="label">Orders today</span><b>128</b></div><div class="stat"><span class="label">Meals donated this month</span><b>${340}</b></div><div class="stat"><span class="label">Rating</span><b>4.6</b></div></div>
    <p class="note" style="margin-bottom:10px">Cooked stock at close of lunch. Flag leftovers to fill the donation form.</p>`+
    table(['Item','Portions left','Action'],STOCK.map((s,i)=>`<tr><td>${esc(s.name)}</td><td class="num">${s.left}</td><td><button class="btn primary small" data-flag="${i}">Flag as surplus</button></td></tr>`));
  } else if(r==='store'){
    h=`<p class="note" style="margin-bottom:10px">Groceries close to expiry can be donated if still safe. Medicines are never donated; return them to the supplier.</p>`+
    table(['Item','Stock','Days to expiry','Status','Action'],INV.map((s,i)=>{
      const near=s.days<=2,low=s.stock<=6;
      return `<tr><td>${esc(s.name)}</td><td class="num">${s.stock}</td><td class="num">${s.days}</td>
        <td><span class="pill ${near?'warn':low?'crit':'good'}">${near?'Near expiry':low?'Reorder':'OK'}</span></td>
        <td>${near?(s.kind==='grocery'?`<button class="btn primary small" data-inv="${i}">Flag for donation</button>`:'Return to supplier'):low?'Reorder':'None'}</td></tr>`;}));
  } else if(r==='delivery'){
    const jobs=donations.filter(d=>d.status===0);
    h=`<div class="stats"><div class="stat"><span class="label">Stops today</span><b>${9+jobs.length}</b></div><div class="stat"><span class="label">Distance saved</span><b>5.5 km</b></div><div class="stat"><span class="label">Donation pickups</span><b>${jobs.length}</b></div></div>
    <p class="note" style="margin-bottom:10px">Stops are ordered by the route optimizer. Sample deliveries plus any donation pickups you confirmed.</p>`+
    table(['Stop','Type','From','To','Distance'],[
      '<tr><td class="num">1</td><td><span class="pill plain">Order</span></td><td>Saravana Kitchen</td><td>Besant Nagar</td><td class="num">2.1 km</td></tr>',
      '<tr><td class="num">2</td><td><span class="pill plain">Order</span></td><td>City Care Pharmacy</td><td>Adyar</td><td class="num">1.4 km</td></tr>',
      ...jobs.map((d,i)=>`<tr><td class="num">${3+i}</td><td><span class="pill good">Donation</span></td><td>${esc(d.donor)}</td><td>${esc(d.center)}</td><td class="num">${(2.5+i*1.3).toFixed(1)} km</td></tr>`)
    ]);
  } else if(r==='center'){
    h=`<p class="note" style="margin-bottom:10px">Move each batch forward as you check it. Quality checks: temperature, time since cooking, packing, smell and look.</p>`+
    table(['Batch','Donor','Photos','Meals','Center','Status','Action'],donations.map((d,i)=>`<tr><td class="mono">${d.id}</td><td>${esc(d.donor)}</td><td>${(d.photos&&d.photos.length)?`<div class="mini-th">${d.photos.slice(0,3).map(u=>`<img src="${u}" alt="Donation photo">`).join('')}</div>`:'<span class="note">None</span>'}</td><td class="num">${d.meals}</td><td>${esc(d.center)}</td>
      <td><span class="pill ${d.status===3?'good':d.status===2?'warn':'plain'}">${STATUS[d.status]}</span></td>
      <td>${d.status<3?`<button class="btn small ${d.status===1?'primary':'line'}" data-adv="${i}">${['Mark received','Mark verified','Send to '+esc(d.benef.split(',')[0].toLowerCase())][d.status]}</button>`:'Done'}</td></tr>`));
  } else {
    const total=donations.reduce((a,d)=>a+d.meals,0);
    h=`<div class="stats"><div class="stat"><span class="label">Active users</span><b>8,420</b></div><div class="stat"><span class="label">Orders today</span><b>${612+orders.length}</b></div><div class="stat"><span class="label">Logged donations</span><b>${donations.length}</b></div><div class="stat"><span class="label">Meals in log</span><b>${total}</b></div></div>`+
    table(['Batch','Donor','Meals','Center','Status'],donations.map(d=>`<tr><td class="mono">${d.id}</td><td>${esc(d.donor)}</td><td class="num">${d.meals}</td><td>${esc(d.center)}</td><td><span class="pill ${d.status===3?'good':'plain'}">${STATUS[d.status]}</span></td></tr>`));
  }
  el.innerHTML=h;
}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('button,a');if(!t)return;
  const d=t.dataset;
  if(d.type){st.type=d.type;renderTypes();renderProducts();}
  else if(d.style){st.imgStyle=d.style;renderStyles();renderProducts();}
  else if(d.rmph!==undefined){st.photos.splice(+d.rmph,1);renderThumbs();}
  else if(d.cat){st.cat=d.cat;st.q='';$('#q').value='';renderCats();renderProducts();}
  else if(d.add){st.cart[d.add]=(st.cart[d.add]||0)+1;renderCart();toast('Added to cart');}
  else if(d.inc){st.cart[d.inc]++;renderCart();}
  else if(d.dec){if(--st.cart[d.dec]<=0)delete st.cart[d.dec];renderCart();}
  else if(d.del){delete st.cart[d.del];renderCart();}
  else if(d.role){st.role=d.role;renderTabs();renderDash();}
  else if(d.flag!==undefined){const s=STOCK[d.flag];$('#dName').value=s.store;$('#dType').value='Restaurant';$('#dFood').value=s.name;$('#dMeals').value=s.left;$('#dCooked').value=1;$('#dSafe').value=4;toast('Form filled. Check the details and match.');$('#donate').scrollIntoView({behavior:'smooth'});}
  else if(d.inv!==undefined){const s=INV[d.inv];$('#dName').value='Daily Fresh Mart';$('#dType').value='Supermarket';$('#dFood').value=s.name;$('#dMeals').value=s.stock;$('#dCooked').value=0;$('#dSafe').value=24;toast('Form filled. Check the details and match.');$('#donate').scrollIntoView({behavior:'smooth'});}
  else if(d.adv!==undefined){const x=donations[d.adv];x.status++;if(x.status===3){toast('Batch '+x.id+' sent to '+x.benef.split(',')[0].toLowerCase());}renderDash();}
  else if(t.id==='openCart')openCart(true);
  else if(t.id==='closeCart')openCart(false);
  else if(t.id==='payBtn')placeOrder();
  else if(t.id==='confirmDon')confirmDonation();
  else if(t.id==='again'){st.last=null;renderResult();$('#dName').focus();}
});
$('#veil').addEventListener('click',()=>openCart(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false);});
$('#q').addEventListener('input',e=>{st.q=e.target.value;renderProducts();});
$('#roundUp').addEventListener('change',e=>{st.roundUp=e.target.checked;renderCart();});
$('#rx').addEventListener('change',e=>{st.rx=!!e.target.files.length;renderCart();});
function renderThumbs(){
  $('#thumbs').innerHTML=st.photos.map((u,i)=>`<div class="thumb"><img src="${u}" alt="Food photo ${i+1}"><button type="button" data-rmph="${i}" aria-label="Remove photo ${i+1}">x</button></div>`).join('');
}
$('#dPhotos').addEventListener('change',e=>{
  const room=4-st.photos.length;
  [...e.target.files].filter(f=>f.type.startsWith('image/')).slice(0,Math.max(0,room)).forEach(f=>st.photos.push(URL.createObjectURL(f)));
  if(e.target.files.length>room)toast('Up to 4 photos per donation');
  e.target.value='';renderThumbs();
});
$('#donForm').addEventListener('submit',e=>{e.preventDefault();runMatch();});

/* ---------- init ---------- */
$('#dArea').innerHTML=Object.keys(AREAS).map(a=>`<option${a==='Guindy'?' selected':''}>${a}</option>`).join('');
renderCats();renderTypes();renderStyles();renderProducts();renderCart();renderOrders();renderCenters();renderChart();renderTabs();renderDash();
runMatch();
})();
