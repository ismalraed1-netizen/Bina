const CROPS={
  wheat:{name:'قمح',icon:'🌾',seed:12,sell:28,grow:36000,xp:9},
  carrot:{name:'جزر',icon:'🥕',seed:20,sell:48,grow:48000,xp:12},
  tomato:{name:'طماطم',icon:'🍅',seed:35,sell:82,grow:62000,xp:16},
  strawberry:{name:'فراولة',icon:'🍓',seed:55,sell:128,grow:78000,xp:22}
};
const PRODUCTS={
  egg:{name:'بيض',icon:'🥚',sell:22},
  milk:{name:'حليب',icon:'🥛',sell:95},
  wool:{name:'صوف',icon:'🧶',sell:145}
};
const ANIMALS={
  chicken:{name:'دجاج',icon:'🐔',cost:450,level:1,product:'egg',yield:2},
  cow:{name:'بقر',icon:'🐄',cost:1800,level:3,product:'milk',yield:1},
  sheep:{name:'غنم',icon:'🐑',cost:2400,level:5,product:'wool',yield:1}
};

const WORLD_W=1500;
const WORLD_H=950;
const SAVE_KEY='raed_farm_world_v2';
const OLD_SAVE='raed_farm_v1';
const emptyPlot=()=>({crop:null,plantedAt:null,watered:false,wateredAt:null});

const defaults={
  coins:1250,gems:18,level:1,xp:32,energy:92,water:76,day:3,hour:8.5,
  night:false,weather:'مشمس',selectedTool:'plant',selectedCrop:'wheat',
  inventory:{wheat:2,carrot:0,tomato:0,strawberry:0,egg:0,milk:0,wool:0},
  stats:{planted:0,watered:0,harvested:0,earned:0},
  missions:{plant:0,water:0,harvest:0},
  missionClaimed:{plant:false,water:false,harvest:false},
  plots:Array.from({length:36},emptyPlot),
  land:{north:false,valley:false},
  animals:{chicken:2,cow:0,sheep:0,lastProducedDay:3},
  tractor:{owned:false,fuel:100},
  story:{chapter:0,talked:{}},
  farmer:{x:610,y:425},
  camera:{x:260,y:220}
};

const STORY=[
  {title:'بداية جديدة',text:'ساعد العم سالم وأعد الأرض للحياة بزراعة 3 محاصيل.',icon:'🌱',target:3,value:s=>s.stats.planted,reward:{coins:220}},
  {title:'أول حصاد',text:'أثبت أنك مزارع حقيقي واحصد محصولين مكتملين.',icon:'🧺',target:2,value:s=>s.stats.harvested,reward:{coins:350,gems:1}},
  {title:'أرض جديدة',text:'وسّع المزرعة وافتح أرض التوسع الشمالية.',icon:'🗺️',target:1,value:s=>s.land.north?1:0,reward:{coins:500}},
  {title:'حياة في الحظيرة',text:'اشترِ أول بقرة وابدأ إنتاج الحليب.',icon:'🐄',target:1,value:s=>s.animals.cow>0?1:0,reward:{gems:3}},
  {title:'رائد القرية',text:'حقق 1,500 عملة من بيع منتجات مزرعتك.',icon:'🏆',target:1500,value:s=>s.stats.earned,reward:{coins:1000,gems:5}}
];

let state=loadState();
let toastTimer=null;
let tickTimer=null;
let farmerBusy=false;
let walkTimer=null;
let actionTimer=null;
let movementRaf=null;
let dpadDirection=null;
const keysDown=new Set();

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const clone=o=>JSON.parse(JSON.stringify(o));
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function loadState(){
  try{
    const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem(OLD_SAVE);
    if(!raw)return clone(defaults);
    const old=JSON.parse(raw),d=clone(defaults);
    const merged={
      ...d,...old,
      inventory:{...d.inventory,...(old.inventory||{})},
      stats:{...d.stats,...(old.stats||{})},
      missions:{...d.missions,...(old.missions||{})},
      missionClaimed:{...d.missionClaimed,...(old.missionClaimed||{})},
      land:{...d.land,...(old.land||{})},
      animals:{...d.animals,...(old.animals||{})},
      tractor:{...d.tractor,...(old.tractor||{})},
      story:{...d.story,...(old.story||{}),talked:{...(old.story?.talked||{})}},
      farmer:{...d.farmer,...(old.farmer||{})},
      camera:{...d.camera,...(old.camera||{})}
    };
    const oldPlots=Array.isArray(old.plots)?old.plots:[];
    merged.plots=Array.from({length:36},(_,i)=>oldPlots[i]?{...emptyPlot(),...oldPlots[i]}:emptyPlot());
    merged.farmer.x=Number.isFinite(+merged.farmer.x)?+merged.farmer.x:d.farmer.x;
    merged.farmer.y=Number.isFinite(+merged.farmer.y)?+merged.farmer.y:d.farmer.y;
    merged.camera.x=Number.isFinite(+merged.camera.x)?+merged.camera.x:d.camera.x;
    merged.camera.y=Number.isFinite(+merged.camera.y)?+merged.camera.y:d.camera.y;
    return merged;
  }catch(e){
    console.warn('تعذر قراءة الحفظ، سيتم استخدام القيم الافتراضية.',e);
    return clone(defaults);
  }
}
function saveState(){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch(e){console.warn('تعذر حفظ اللعبة.',e)}
}
function showToast(msg){
  const el=$('#toast'); if(!el)return;
  el.textContent=msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),2400);
}
function fmtTime(h){
  const hour=Math.floor(h)%24,min=Math.floor((h-Math.floor(h))*60),suffix=hour>=12?'م':'ص';
  return `${hour%12||12}:${String(min).padStart(2,'0')} ${suffix}`;
}
function xpNeed(){return 100+(state.level-1)*45}
function weatherIcon(){return state.night?'🌙':state.weather==='ممطر'?'🌦️':state.weather==='غائم'?'⛅':'☀️'}
function addXp(amount){
  state.xp+=amount;
  let need=xpNeed();
  while(state.xp>=need){
    state.xp-=need; state.level++; state.gems+=2; state.energy=100;
    showToast(`🎉 وصلت للمستوى ${state.level}! +2 جوهرة`);
    need=xpNeed();
  }
}
function spendEnergy(v){
  if(state.energy<v){showToast('⚡ طاقتك منخفضة، نم لليوم التالي');return false}
  state.energy-=v; return true;
}
function isPlotUnlocked(i){return i<12||(i<24&&state.land.north)||(i>=24&&state.land.valley)}

function renderStats(){
  const set=(id,value)=>{const el=$(id);if(el)el.textContent=value};
  set('#coinCount',state.coins.toLocaleString('ar-SA'));
  set('#gemCount',state.gems);
  set('#levelNum',state.level);
  set('#xpText',`${state.xp}/${xpNeed()}`);
  const xp=$('#xpFill'); if(xp)xp.style.width=`${Math.min(100,state.xp/xpNeed()*100)}%`;
  set('#dayNum',state.day); set('#clock',fmtTime(state.hour)); set('#weatherIcon',weatherIcon());
  set('#weatherText',state.night?'ليلة هادئة':state.weather);
  set('#energyValue',`${state.energy}%`); set('#waterValue',`${state.water}%`);
  const ef=$('#energyFill'); if(ef)ef.style.width=`${state.energy}%`;
  const wf=$('#waterFill'); if(wf)wf.style.width=`${state.water}%`;
  $('#gameShell')?.classList.toggle('night',state.night);
  const dt=$('#dayToggle'); if(dt)dt.textContent=state.night?'☀️':'🌙';
}
function plotProgress(plot){
  if(!plot.crop||!plot.plantedAt)return 0;
  const c=CROPS[plot.crop],target=c.grow*(plot.watered?0.66:1);
  return clamp((Date.now()-plot.plantedAt)/target,0,1);
}
function stageEmoji(plot,p){
  if(!plot.crop)return '';
  if(p<.2)return'🌱';
  if(p<.58)return plot.crop==='wheat'?'🌿':'🌱';
  return CROPS[plot.crop].icon;
}
function makePlot(i){
  const plot=state.plots[i],p=plotProgress(plot),b=document.createElement('button');
  b.className=`plot${plot.watered?' watered':''}`;
  b.dataset.index=i; b.title=`حوض ${i+1}`;
  if(plot.crop){
    const crop=document.createElement('div');
    crop.className=`crop-sprite stage-${p>=1?3:p>.42?2:1}`;
    crop.textContent=stageEmoji(plot,p); b.appendChild(crop);
    const prog=document.createElement('div');
    prog.className='plot-progress'; prog.innerHTML=`<span style="width:${Math.round(p*100)}%"></span>`; b.appendChild(prog);
    const badge=document.createElement('span');
    badge.className='plot-badge'; badge.textContent=p>=1?'جاهز!':`${Math.round(p*100)}%`; b.appendChild(badge);
  }
  b.addEventListener('click',e=>{e.stopPropagation();handlePlot(i,b)});
  return b;
}
function renderPlots(){
  const groups=[[$('#plots'),0,12],[$('#plotsNorth'),12,24],[$('#plotsValley'),24,36]];
  groups.forEach(([box,a,z])=>{
    if(!box)return; box.innerHTML='';
    for(let i=a;i<z;i++)box.appendChild(makePlot(i));
  });
  $('#fieldB')?.classList.toggle('land-open',state.land.north);
  $('#fieldC')?.classList.toggle('land-open',state.land.valley);
}
function renderTools(){
  $$('.tool-btn[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===state.selectedTool));
  $$('.crop-choice').forEach(b=>b.classList.toggle('active',b.dataset.crop===state.selectedCrop));
}
function missionDefs(){
  return[
    ['plant','ازرع 6 محاصيل',6,state.missions.plant,'🪙 160'],
    ['water','اسقِ 5 أحواض',5,state.missions.water,'💎 2'],
    ['harvest','احصد 4 محاصيل',4,state.missions.harvest,'🪙 240']
  ];
}
function renderMissions(){
  const box=$('#missions'); if(!box)return;
  box.innerHTML=missionDefs().map(([k,t,target,v,r])=>
    `<div class="mission"><div class="mission-head"><b>${state.missionClaimed[k]?'✅ ':''}${t}</b><small>${Math.min(v,target)}/${target}</small></div><div class="mini-track"><span style="width:${Math.min(100,v/target*100)}%"></span></div><div class="reward"><span>المكافأة</span><b>${r}</b></div></div>`
  ).join('');
}
function renderMarket(){
  const el=$('#marketList'); if(!el)return;
  el.innerHTML=Object.entries(CROPS).slice(0,3).map(([k,c],i)=>
    `<div class="market-row"><span>${c.icon} ${c.name}</span><strong class="${i===2?'price-down':'price-up'}">${c.sell} 🪙</strong></div>`
  ).join('')+`<div class="market-row"><span>🥛 حليب</span><strong class="price-up">95 🪙</strong></div>`;
}
function renderInventory(){
  const box=$('#inventoryGrid'); if(!box)return;
  const items=[...Object.entries(CROPS),...Object.entries(PRODUCTS)];
  box.innerHTML=items.map(([k,v])=>`<div class="inventory-item"><span>${v.icon}</span><b>${v.name}</b><small>× ${state.inventory[k]||0}</small></div>`).join('');
}
function renderAnimals(){
  const layer=$('#animalLayer'); if(!layer)return;
  layer.innerHTML='';
  const zones={chicken:{x:115,y:640},cow:{x:290,y:650},sheep:{x:1230,y:655}};
  Object.entries(ANIMALS).forEach(([k,a])=>{
    const n=Math.min(state.animals[k]||0,8),z=zones[k];
    for(let i=0;i<n;i++){
      const el=document.createElement('div');
      el.className='animal';
      el.style.left=`${z.x+(i%4)*34}px`;
      el.style.top=`${z.y+Math.floor(i/4)*34}px`;
      el.innerHTML=`${a.icon}${i===0?`<small>${state.animals[k]}</small>`:''}`;
      layer.appendChild(el);
    }
  });
  $('#tractorSprite')?.classList.toggle('hidden',!state.tractor.owned);
}
function renderAnimalShop(){
  const box=$('#animalShop'); if(!box)return;
  box.innerHTML=Object.entries(ANIMALS).map(([k,a])=>{
    const locked=state.level<a.level;
    return `<div class="shop-item"><div class="shop-icon">${a.icon}</div><div><h4>${a.name} <small>× ${state.animals[k]||0}</small></h4><p>إنتاج يومي: ${a.yield} ${PRODUCTS[a.product].name} لكل حيوان</p></div><button class="buy-btn animal-buy" data-animal="${k}" ${locked?'disabled':''}>${locked?`🔒 مستوى ${a.level}`:`${a.cost.toLocaleString('ar-SA')} 🪙`}</button></div>`;
  }).join('');
  $$('.animal-buy').forEach(b=>b.addEventListener('click',()=>buyAnimal(b.dataset.animal)));
}
function renderTractor(){
  const box=$('#tractorPanel'); if(!box)return;
  if(!state.tractor.owned){
    box.innerHTML=`<div class="animal-stat"><span>🚜 الجرار غير مملوك</span><b>2,500 🪙</b></div><button class="wide-action" id="goShopFromTractor">اذهب للمتجر</button>`;
    $('#goShopFromTractor').onclick=()=>openModal('#shopModal');
    return;
  }
  box.innerHTML=`<div class="animal-stat"><span>⛽ الوقود</span><b>${state.tractor.fuel}%</b></div><div class="tractor-actions"><button id="tractorWater" class="tractor-action">💦 ري كل المزروعات</button><button id="tractorHarvest" class="tractor-action">🧺 حصاد الجاهز</button><button id="tractorFuel" class="tractor-action">⛽ تعبئة الوقود<br><small>250 🪙</small></button><button id="tractorFind" class="tractor-action">📍 عرض الجرار</button></div>`;
  $('#tractorWater').onclick=tractorWaterAll;
  $('#tractorHarvest').onclick=tractorHarvestAll;
  $('#tractorFuel').onclick=refuelTractor;
  $('#tractorFind').onclick=()=>{closeModal();moveFarmerAbsolute(1210,470,true);showToast('🚜 الجرار عند الورشة')};
}
function renderStory(){
  const idx=state.story.chapter,done=idx>=STORY.length,current=done?STORY[STORY.length-1]:STORY[idx];
  const title=$('#chapterTitle'),text=$('#chapterText'),fill=$('#storyFill'),prog=$('#storyProgressText');
  if(title)title.textContent=done?'رائد القرية 👑':current.title;
  if(text)text.textContent=done?'أصبحت مزرعتك من أشهر مزارع القرية. استمر في التوسع!':current.text;
  const val=done?1:Math.min(current.target,current.value(state)),target=done?1:current.target;
  if(fill)fill.style.width=`${val/target*100}%`;
  if(prog)prog.textContent=done?'اكتملت القصة الحالية':`${val} / ${target}`;
  const timeline=$('#storyTimeline');
  if(timeline)timeline.innerHTML=STORY.map((c,i)=>`<div class="story-step ${i<idx?'done':i===idx?'current':''}"><span>${i<idx?'✅':c.icon}</span><div><h4>${c.title}</h4><p>${c.text}</p></div><strong>${i<idx?'مكتمل':i===idx?'الحالي':'🔒'}</strong></div>`).join('');
}
function applyStoryRewards(r){if(r.coins)state.coins+=r.coins;if(r.gems)state.gems+=r.gems}
function checkStory(){
  let advanced=false;
  while(state.story.chapter<STORY.length){
    const c=STORY[state.story.chapter];
    if(c.value(state)<c.target)break;
    applyStoryRewards(c.reward); state.story.chapter++; advanced=true;
    showToast(`📜 اكتمل فصل: ${c.title}`);
  }
  if(advanced){addXp(20);saveState()}
  renderStory();
}
function checkMissionRewards(){
  if(state.missions.plant>=6&&!state.missionClaimed.plant){state.missionClaimed.plant=true;state.coins+=160;showToast('🎯 مهمة الزراعة +160 عملة')}
  if(state.missions.water>=5&&!state.missionClaimed.water){state.missionClaimed.water=true;state.gems+=2;showToast('🎯 مهمة الري +2 جوهرة')}
  if(state.missions.harvest>=4&&!state.missionClaimed.harvest){state.missionClaimed.harvest=true;state.coins+=240;showToast('🎯 مهمة الحصاد +240 عملة')}
}

function renderAll(){
  renderStats();renderPlots();renderTools();renderMissions();renderMarket();renderInventory();
  renderAnimals();renderAnimalShop();renderTractor();renderStory();
  updateFarmer(false);updateCamera(false,false);saveState();
}
function chooseTool(tool){
  state.selectedTool=tool;renderTools();saveState();
  const m={plant:'🌱 اختر المحصول ثم اضغط على حوض فارغ',water:'💧 اضغط على المحصول لسقيه',harvest:'🧺 اضغط على المحصول الجاهز',inspect:'👀 افحص حالة أي حوض'};
  showToast(m[tool]);
}
function coinPop(el,text){
  const p=document.createElement('div'),world=$('#farmWorld');
  if(!world)return;
  const r=el.getBoundingClientRect(),wr=world.getBoundingClientRect();
  p.className='coin-pop';p.textContent=text;
  p.style.left=`${r.left-wr.left+r.width/2}px`;p.style.top=`${r.top-wr.top}px`;
  world.appendChild(p);setTimeout(()=>p.remove(),1200);
}
function plotWorldTarget(el){
  const r=el.getBoundingClientRect(),wr=$('#farmWorld').getBoundingClientRect();
  return{x:r.left-wr.left+r.width/2-35,y:r.top-wr.top+r.height-105};
}
function moveForAction(el,action,after){
  if(farmerBusy){showToast('🚶 رائد يتحرك الآن');return}
  farmerBusy=true; stopManualMovement();
  const target=plotWorldTarget(el);
  moveFarmerAbsolute(target.x,target.y,true);
  clearTimeout(actionTimer);
  actionTimer=setTimeout(()=>{
    const farmer=$('#farmer');
    if(action==='water'&&farmer){
      farmer.classList.add('watering');
      setTimeout(()=>farmer.classList.remove('watering'),850);
    }
    after?.();
    setTimeout(()=>farmerBusy=false,350);
  },650);
}
function handlePlot(i,el){
  if(!isPlotUnlocked(i)){showToast('🔒 افتح هذه الأرض أولًا');return}
  const plot=state.plots[i],p=plotProgress(plot),tool=state.selectedTool;
  if(tool==='plant'){
    if(plot.crop){showToast(p>=1?'🌾 جاهز للحصاد':'هذا الحوض مزروع');return}
    const c=CROPS[state.selectedCrop];
    if(state.coins<c.seed){showToast('🪙 العملات غير كافية');return}
    if(!spendEnergy(4))return;
    moveForAction(el,'plant',()=>{
      state.coins-=c.seed;
      state.plots[i]={crop:state.selectedCrop,plantedAt:Date.now(),watered:false,wateredAt:null};
      state.stats.planted++;state.missions.plant++;addXp(3);checkMissionRewards();checkStory();renderAll();showToast(`🌱 زرعت ${c.name}`);
    });
  }else if(tool==='water'){
    if(!plot.crop){showToast('ازرع الحوض أولًا');return}
    if(plot.watered){showToast('💧 الحوض مروي بالفعل');return}
    if(state.water<8){showToast('💧 خزان الماء منخفض');return}
    if(!spendEnergy(2))return;
    moveForAction(el,'water',()=>{
      plot.watered=true;plot.wateredAt=Date.now();state.water-=8;state.stats.watered++;state.missions.water++;
      addXp(2);checkMissionRewards();renderAll();showToast('💦 تم ري المحصول');
    });
  }else if(tool==='harvest'){
    if(!plot.crop){showToast('الحوض فارغ');return}
    if(p<1){showToast(`⏳ النمو ${Math.round(p*100)}%`);return}
    if(!spendEnergy(3))return;
    moveForAction(el,'harvest',()=>{
      const k=plot.crop,c=CROPS[k];
      state.inventory[k]=(state.inventory[k]||0)+1;state.plots[i]=emptyPlot();
      state.stats.harvested++;state.missions.harvest++;addXp(c.xp);coinPop(el,`+1 ${c.icon}`);
      checkMissionRewards();checkStory();renderAll();showToast(`🧺 حصدت ${c.name}`);
    });
  }else{
    showToast(plot.crop?`${CROPS[plot.crop].name} — نمو ${Math.round(p*100)}%`:'🌱 الحوض فارغ وجاهز');
  }
}
function unlockLand(which){
  const data={north:{cost:1800,label:'أرض التوسع الشمالية'},valley:{cost:3500,label:'أرض الوادي'}},d=data[which];
  if(!d||state.land[which])return;
  if(state.coins<d.cost){showToast(`🪙 تحتاج ${d.cost.toLocaleString('ar-SA')} عملة`);return}
  state.coins-=d.cost;state.land[which]=true;addXp(35);checkStory();renderAll();showToast(`🗺️ تم فتح ${d.label}!`);
}
function buyAnimal(k){
  const a=ANIMALS[k];if(!a)return;
  if(state.level<a.level){showToast(`🔒 تحتاج المستوى ${a.level}`);return}
  if(state.coins<a.cost){showToast('🪙 العملات غير كافية');return}
  state.coins-=a.cost;state.animals[k]++;addXp(12);checkStory();renderAll();showToast(`${a.icon} تمت إضافة ${a.name} للمزرعة`);
}
function produceAnimals(){
  const parts=[];
  Object.entries(ANIMALS).forEach(([k,a])=>{
    const count=state.animals[k]||0;if(!count)return;
    const qty=count*a.yield;
    state.inventory[a.product]=(state.inventory[a.product]||0)+qty;
    parts.push(`${PRODUCTS[a.product].icon} ${qty}`);
  });
  state.animals.lastProducedDay=state.day;
  if(parts.length)showToast(`🐄 إنتاج اليوم: ${parts.join(' • ')}`);
}
function buyTractor(){
  if(state.tractor.owned){showToast('🚜 الجرار موجود عندك');return}
  if(state.coins<2500){showToast('🪙 تحتاج 2,500 عملة');return}
  state.coins-=2500;state.tractor.owned=true;state.tractor.fuel=100;addXp(40);renderAll();closeModal();showToast('🚜 مبروك! أصبح الجرار في الورشة');
}
function tractorWaterAll(){
  const targets=state.plots.map((p,i)=>({p,i})).filter(({p,i})=>isPlotUnlocked(i)&&p.crop&&!p.watered);
  if(!targets.length){showToast('💧 لا توجد مزروعات تحتاج ري');return}
  const fuel=Math.min(40,targets.length*4),water=Math.min(60,targets.length*3);
  if(state.tractor.fuel<fuel){showToast('⛽ وقود الجرار منخفض');return}
  if(state.water<water){showToast('💧 الماء غير كافٍ للعملية');return}
  targets.forEach(({p})=>{p.watered=true;p.wateredAt=Date.now()});
  state.tractor.fuel-=fuel;state.water-=water;state.stats.watered+=targets.length;state.missions.water+=targets.length;
  checkMissionRewards();renderAll();showToast(`🚜 تم ري ${targets.length} حوضًا`);
}
function tractorHarvestAll(){
  const targets=state.plots.map((p,i)=>({p,i})).filter(({p,i})=>isPlotUnlocked(i)&&p.crop&&plotProgress(p)>=1);
  if(!targets.length){showToast('🧺 لا توجد محاصيل جاهزة');return}
  const fuel=Math.min(50,targets.length*5);
  if(state.tractor.fuel<fuel){showToast('⛽ وقود الجرار منخفض');return}
  targets.forEach(({p,i})=>{
    const k=p.crop;state.inventory[k]=(state.inventory[k]||0)+1;state.plots[i]=emptyPlot();
    state.stats.harvested++;state.missions.harvest++;addXp(CROPS[k].xp);
  });
  state.tractor.fuel-=fuel;checkMissionRewards();checkStory();renderAll();showToast(`🚜 تم حصاد ${targets.length} محصولًا`);
}
function refuelTractor(){
  if(state.coins<250){showToast('🪙 تحتاج 250 عملة');return}
  state.coins-=250;state.tractor.fuel=100;renderAll();showToast('⛽ تم تعبئة وقود الجرار');
}
function refillWater(){
  if(state.coins<80){showToast('🪙 تحتاج 80 عملة');return}
  state.coins-=80;state.water=100;renderAll();showToast('💧 تم تعبئة خزان الماء');
}
function sellInventory(){
  let total=0,count=0;
  Object.entries(state.inventory).forEach(([k,v])=>{
    if(v<=0)return;
    const item=CROPS[k]||PRODUCTS[k];if(!item)return;
    total+=v*item.sell;count+=v;state.inventory[k]=0;
  });
  if(!count){showToast('المخزن فارغ');return}
  state.coins+=total;state.stats.earned+=total;addXp(Math.min(30,Math.floor(total/100)));
  checkStory();renderAll();showToast(`💰 بعت ${count} منتجًا مقابل ${total.toLocaleString('ar-SA')} عملة`);
}
function sleepNextDay(){
  state.day++;state.hour=7;state.energy=100;state.water=100;state.night=false;
  state.missions={plant:0,water:0,harvest:0};state.missionClaimed={plant:false,water:false,harvest:false};
  const w=['مشمس','مشمس','غائم','ممطر'];state.weather=w[Math.floor(Math.random()*w.length)];
  produceAnimals();
  if(state.weather==='ممطر')state.plots.forEach((p,i)=>{if(isPlotUnlocked(i)&&p.crop)p.watered=true});
  renderAll();showToast(state.weather==='ممطر'?'🌧️ صباح ممطر — المزروعات رُويت تلقائيًا':`🌅 صباح اليوم ${state.day}`);
}
function toggleDay(){state.night=!state.night;state.hour=state.night?20:9;renderStats();saveState()}
function openModal(id){
  $$('.modal-backdrop').forEach(m=>m.classList.add('hidden'));
  const modal=$(id);if(!modal){console.warn('Modal not found',id);return}
  stopManualMovement();
  modal.classList.remove('hidden');
  if(id==='#inventoryModal')renderInventory();
  if(id==='#barnModal')renderAnimalShop();
  if(id==='#storyModal')renderStory();
  if(id==='#tractorModal')renderTractor();
}
function closeModal(){$$('.modal-backdrop').forEach(m=>m.classList.add('hidden'))}
function showNpc(npc){
  const data={
    salem:{avatar:'👨🏻‍🌾',name:'العم سالم',role:'جار المزرعة',text:state.story.chapter<1?'يا رائد، الأرض ممتازة. ابدأ بثلاث زراعات وخلك صبور على أول محصول.':'ما شاء الله عليك، المزرعة بدأت ترجع للحياة. وسّعها ولا توقف.'},
    noura:{avatar:'👩🏻‍🌾',name:'نورة',role:'تاجرة القرية',text:'أنا أشتري محاصيلك ومنتجات الحيوانات. كل ما تنوّع إنتاجك، أرباحك تصير أفضل.'},
    fahad:{avatar:'🧑🏻‍🔧',name:'فهد',role:'ميكانيكي القرية',text:state.tractor.owned?'جرارك جاهز في الورشة. حافظ على الوقود واستخدمه للأعمال الكبيرة.':'إذا جمعت 2,500 عملة، عندي جرار بيختصر عليك الري والحصاد.'}
  };
  const d=data[npc];if(!d)return;
  $('#dialogAvatar').textContent=d.avatar;$('#dialogName').textContent=d.name;$('#dialogRole').textContent=d.role;$('#dialogText').textContent=d.text;
  const action=$('#dialogAction');
  action.textContent=state.story.talked[npc]?'تمام':'خذ هديتي';
  action.onclick=()=>{
    if(!state.story.talked[npc]){
      state.story.talked[npc]=true;state.coins+=npc==='salem'?100:50;saveState();renderStats();showToast('🎁 هدية ترحيبية من أهل القرية');
    }
    closeModal();
  };
  openModal('#dialogModal');
}
function poiAction(poi){
  if(poi==='market')openModal('#inventoryModal');
  else if(poi==='barn'||poi==='coop'||poi==='cows'||poi==='sheep')openModal('#barnModal');
  else if(poi==='workshop')openModal('#tractorModal');
  else if(poi==='farmhouse')showToast('🏡 بيت رائد — نم لاستعادة الطاقة');
}

/* =========================
   نظام الحركة والكاميرا V2.1
   ========================= */
function modalOpen(){return !!document.querySelector('.modal-backdrop:not(.hidden)')}
function updateFarmer(walking=true){
  const f=$('#farmer');if(!f)return;
  f.style.left=`${state.farmer.x}px`;f.style.top=`${state.farmer.y}px`;
  if(walking){
    f.classList.add('walking');
    clearTimeout(walkTimer);
    walkTimer=setTimeout(()=>f.classList.remove('walking'),180);
  }
  const dot=$('#miniDot');
  if(dot){
    const x=state.farmer.x/WORLD_W*108,y=state.farmer.y/WORLD_H*62;
    dot.style.left=`${clamp(x,2,108)}px`;dot.style.top=`${clamp(y,2,62)}px`;
  }
  updateAreaLabel();
}
function updateAreaLabel(){
  const{x,y}=state.farmer;let a='منطقة البيت';
  if(x>950&&y<520)a='سوق القرية';
  else if(y>680)a='ضفة الوادي';
  else if(x>1050&&y>520)a='مراعي المزرعة';
  else if(x>450&&x<1000&&y>480)a='حقول رائد';
  const el=$('#areaLabel');if(el)el.textContent=a;
}
function cameraBounds(){
  const v=$('#farmViewport');
  if(!v)return{vw:0,vh:0,maxX:0,maxY:0};
  const vw=v.clientWidth,vh=v.clientHeight;
  return{vw,vh,maxX:Math.max(0,WORLD_W-vw),maxY:Math.max(0,WORLD_H-vh)};
}
function updateCamera(smooth=true,forceCenter=false){
  const v=$('#farmViewport'),w=$('#farmWorld');if(!v||!w)return;
  const {vw,vh,maxX,maxY}=cameraBounds();
  let cx=clamp(state.camera.x||0,0,maxX),cy=clamp(state.camera.y||0,0,maxY);

  if(forceCenter){
    cx=clamp(state.farmer.x-vw*.5,0,maxX);
    cy=clamp(state.farmer.y-vh*.52,0,maxY);
  }else{
    const leftEdge=vw*.30,rightEdge=vw*.70,topEdge=vh*.28,bottomEdge=vh*.70;
    const sx=state.farmer.x-cx,sy=state.farmer.y-cy;
    if(sx<leftEdge)cx-=leftEdge-sx;
    if(sx>rightEdge)cx+=sx-rightEdge;
    if(sy<topEdge)cy-=topEdge-sy;
    if(sy>bottomEdge)cy+=sy-bottomEdge;
    cx=clamp(cx,0,maxX);cy=clamp(cy,0,maxY);
  }
  state.camera.x=cx;state.camera.y=cy;
  w.style.transition=smooth?'transform .12s linear':'none';
  w.style.transform=`translate3d(${-cx}px,${-cy}px,0)`;
}
function setFacing(dx,dy){
  const f=$('#farmer');if(!f)return;
  if(Math.abs(dx)>Math.abs(dy)&&dx!==0)f.dataset.facing=dx>0?'right':'left';
  else if(dy!==0)f.dataset.facing=dy>0?'down':'up';
}
function moveBy(dx,dy,save=true){
  if(farmerBusy||modalOpen())return false;
  const oldX=state.farmer.x,oldY=state.farmer.y;
  state.farmer.x=clamp(oldX+dx,15,WORLD_W-80);
  state.farmer.y=clamp(oldY+dy,260,WORLD_H-120);
  if(state.farmer.x===oldX&&state.farmer.y===oldY)return false;
  setFacing(dx,dy);updateFarmer(true);updateCamera(true,false);
  if(save)saveState();
  return true;
}
function moveFarmerAbsolute(x,y,smooth=true){
  if(!Number.isFinite(x)||!Number.isFinite(y))return;
  stopManualMovement();
  state.farmer.x=clamp(x,15,WORLD_W-80);state.farmer.y=clamp(y,260,WORLD_H-120);
  const f=$('#farmer');
  if(f)f.style.transition=smooth?'left .55s cubic-bezier(.22,.8,.25,1),top .55s cubic-bezier(.22,.8,.25,1)':'left .12s linear,top .12s linear';
  updateFarmer(true);updateCamera(true,false);saveState();
  if(f&&smooth)setTimeout(()=>{f.style.transition='left .12s linear,top .12s linear'},580);
}
function clickMove(e){
  if(farmerBusy||modalOpen())return;
  if(e.target.closest('.plot,.poi,.npc,.locked-land,.tractor-sprite,.dpad,.mini-map,.world-hud'))return;
  const r=$('#farmViewport')?.getBoundingClientRect();if(!r)return;
  const clientX=e.clientX??e.changedTouches?.[0]?.clientX;
  const clientY=e.clientY??e.changedTouches?.[0]?.clientY;
  if(!Number.isFinite(clientX)||!Number.isFinite(clientY))return;
  moveFarmerAbsolute(clientX-r.left+state.camera.x-35,clientY-r.top+state.camera.y-70,true);
}
function movementVector(){
  let dx=0,dy=0;
  if(keysDown.has('a')||keysDown.has('arrowleft'))dx-=1;
  if(keysDown.has('d')||keysDown.has('arrowright'))dx+=1;
  if(keysDown.has('w')||keysDown.has('arrowup'))dy-=1;
  if(keysDown.has('s')||keysDown.has('arrowdown'))dy+=1;
  if(dpadDirection==='left')dx-=1;
  if(dpadDirection==='right')dx+=1;
  if(dpadDirection==='up')dy-=1;
  if(dpadDirection==='down')dy+=1;
  if(dx&&dy){const n=Math.SQRT1_2;dx*=n;dy*=n}
  return{dx,dy};
}
function movementLoop(){
  const{dx,dy}=movementVector();
  if((dx||dy)&&!farmerBusy&&!modalOpen())moveBy(dx*5.2,dy*5.2,false);
  movementRaf=requestAnimationFrame(movementLoop);
}
function stopManualMovement(){
  keysDown.clear();dpadDirection=null;
}
function bindKeyboard(){
  const movementKeys=new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright']);
  document.addEventListener('keydown',e=>{
    const k=e.key.toLowerCase();
    if(!movementKeys.has(k))return;
    if(modalOpen())return;
    e.preventDefault();keysDown.add(k);
  },{passive:false});
  document.addEventListener('keyup',e=>{
    const k=e.key.toLowerCase();
    if(movementKeys.has(k)){e.preventDefault();keysDown.delete(k);saveState()}
  },{passive:false});
  window.addEventListener('blur',()=>{stopManualMovement();saveState()});
}
function bindDpad(){
  $$('[data-move]').forEach(btn=>{
    btn.style.touchAction='none';
    const start=e=>{
      if(modalOpen()||farmerBusy)return;
      e.preventDefault();e.stopPropagation();
      dpadDirection=btn.dataset.move;
      const d=dpadDirection,step=16;
      moveBy(d==='left'?-step:d==='right'?step:0,d==='up'?-step:d==='down'?step:0,false);
      btn.setPointerCapture?.(e.pointerId);
    };
    const stop=e=>{
      if(e){e.preventDefault();e.stopPropagation()}
      dpadDirection=null;saveState();
    };
    btn.addEventListener('pointerdown',start,{passive:false});
    btn.addEventListener('pointerup',stop,{passive:false});
    btn.addEventListener('pointercancel',stop,{passive:false});
    btn.addEventListener('lostpointercapture',()=>{dpadDirection=null;saveState()});
    btn.addEventListener('contextmenu',e=>e.preventDefault());
  });
}
function bindWorldMovement(){
  const viewport=$('#farmViewport'),world=$('#farmWorld');
  if(viewport)viewport.style.touchAction='none';
  if(world){
    let startX=0,startY=0,moved=false;
    world.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;moved=false},{passive:true});
    world.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-startX,e.clientY-startY)>10)moved=true},{passive:true});
    world.addEventListener('pointerup',e=>{if(!moved)clickMove(e)},{passive:true});
  }
}
function resetCamera(){
  updateCamera(false,true);
  saveState();
}

function resetFarm(){
  if(!confirm('هل تريد بدء مزرعة جديدة؟ سيتم حذف التقدم الحالي.'))return;
  stopManualMovement();state=clone(defaults);
  try{localStorage.removeItem(SAVE_KEY)}catch(e){}
  renderAll();resetCamera();closeModal();showToast('🌱 بدأت مزرعة جديدة');
}
function tick(){
  state.hour+=.012;if(state.hour>=24){state.hour=0;state.day++}
  state.night=state.hour>=19||state.hour<6;renderStats();renderPlots();saveState();
}
function init(){
  try{
    renderAll();
    resetCamera();

    $$('.tool-btn[data-tool]').forEach(b=>b.onclick=()=>chooseTool(b.dataset.tool));
    $$('.crop-choice').forEach(b=>b.onclick=()=>{
      state.selectedCrop=b.dataset.crop;state.selectedTool='plant';renderTools();saveState();
      showToast(`${CROPS[b.dataset.crop].icon} تم اختيار ${CROPS[b.dataset.crop].name}`);
    });
    $$('[data-land]').forEach(b=>b.onclick=e=>{e.stopPropagation();unlockLand(b.dataset.land)});
    $$('.npc').forEach(b=>b.onclick=e=>{e.stopPropagation();showNpc(b.dataset.npc)});
    $$('.poi').forEach(b=>b.onclick=e=>{e.stopPropagation();poiAction(b.dataset.poi)});

    const dayToggle=$('#dayToggle'),sleepBtn=$('#sleepBtn'),shopBtn=$('#shopBtn'),inventoryBtn=$('#inventoryBtn');
    const barnBtn=$('#barnBtn'),storyBtn=$('#storyBtn'),tractorBtn=$('#tractorBtn'),settingsBtn=$('#settingsBtn');
    const waterRefill=$('#waterRefill'),sellAllBtn=$('#sellAllBtn'),resetBtn=$('#resetBtn'),buyTractorBtn=$('#buyTractorBtn');
    const tractorSprite=$('#tractorSprite'),soundBtn=$('#soundBtn');

    if(dayToggle)dayToggle.onclick=toggleDay;
    if(sleepBtn)sleepBtn.onclick=sleepNextDay;
    if(shopBtn)shopBtn.onclick=()=>openModal('#shopModal');
    if(inventoryBtn)inventoryBtn.onclick=()=>openModal('#inventoryModal');
    if(barnBtn)barnBtn.onclick=()=>openModal('#barnModal');
    if(storyBtn)storyBtn.onclick=()=>openModal('#storyModal');
    if(tractorBtn)tractorBtn.onclick=()=>openModal('#tractorModal');
    if(settingsBtn)settingsBtn.onclick=()=>openModal('#settingsModal');
    if(waterRefill)waterRefill.onclick=refillWater;
    if(sellAllBtn)sellAllBtn.onclick=sellInventory;
    if(resetBtn)resetBtn.onclick=resetFarm;
    if(buyTractorBtn)buyTractorBtn.onclick=buyTractor;
    if(tractorSprite)tractorSprite.onclick=e=>{e.stopPropagation();openModal('#tractorModal')};

    $$('.shop-seed').forEach(b=>b.onclick=()=>{
      state.selectedCrop=b.dataset.crop;state.selectedTool='plant';closeModal();renderTools();saveState();
      showToast(`${CROPS[b.dataset.crop].icon} اختر حوضًا لزراعة ${CROPS[b.dataset.crop].name}`);
    });
    $$('.close-btn,.modal-backdrop').forEach(el=>el.addEventListener('click',e=>{
      if(e.target===el||el.classList.contains('close-btn'))closeModal();
    }));
    if(soundBtn)soundBtn.onclick=e=>{
      e.currentTarget.classList.toggle('muted');
      e.currentTarget.textContent=e.currentTarget.classList.contains('muted')?'🔇':'🔊';
    };

    bindKeyboard();bindDpad();bindWorldMovement();
    window.addEventListener('resize',()=>updateCamera(false,true));
    checkStory();
    tickTimer=setInterval(tick,1500);
    if(!movementRaf)movementRaf=requestAnimationFrame(movementLoop);
    showToast('🎮 الحركة جاهزة: اضغط باستمرار على الأسهم أو استخدم WASD');
  }catch(err){
    console.error('تعذر تشغيل اللعبة:',err);
    showToast('⚠️ حدث خطأ أثناء تشغيل اللعبة. حدّث الصفحة.');
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
