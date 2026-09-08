const CROPS={wheat:{name:'قمح',icon:'🌾',seed:12,sell:28,grow:36000,xp:9},carrot:{name:'جزر',icon:'🥕',seed:20,sell:48,grow:48000,xp:12},tomato:{name:'طماطم',icon:'🍅',seed:35,sell:82,grow:62000,xp:16},strawberry:{name:'فراولة',icon:'🍓',seed:55,sell:128,grow:78000,xp:22}};
const SAVE_KEY='raed_farm_v1';
const defaults={coins:1250,gems:18,level:1,xp:32,energy:92,water:76,day:3,hour:8.5,night:false,weather:'مشمس',selectedTool:'plant',selectedCrop:'wheat',inventory:{wheat:2,carrot:0,tomato:0,strawberry:0},stats:{planted:0,watered:0,harvested:0,earned:0},missions:{plant:0,water:0,harvest:0},plots:Array.from({length:12},()=>({crop:null,plantedAt:null,watered:false,wateredAt:null}))};
let state=loadState();
let toastTimer=null;
let tickTimer=null;
let farmerBusy=false;
function clone(o){return JSON.parse(JSON.stringify(o))}
function loadState(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return clone(defaults);const saved=JSON.parse(raw);const merged={...clone(defaults),...saved,inventory:{...defaults.inventory,...(saved.inventory||{})},stats:{...defaults.stats,...(saved.stats||{})},missions:{...defaults.missions,...(saved.missions||{})}};if(!Array.isArray(saved.plots)||saved.plots.length!==12)merged.plots=clone(defaults.plots);return merged}catch(e){return clone(defaults)}}
function saveState(){localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function fmtTime(h){let hour=Math.floor(h)%24;const min=Math.floor((h-hour)*60);const suffix=hour>=12?'م':'ص';let display=hour%12||12;return `${display}:${String(min).padStart(2,'0')} ${suffix}`}
function weatherIcon(){return state.night?'🌙':state.weather==='ممطر'?'🌦️':state.weather==='غائم'?'⛅':'☀️'}
function xpNeed(){return 100+((state.level-1)*45)}
function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function showToast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
function renderStats(){
 $('#coinCount').textContent=state.coins.toLocaleString('ar-SA');$('#gemCount').textContent=state.gems;$('#levelNum').textContent=state.level;$('#xpText').textContent=`${state.xp}/${xpNeed()}`;$('#xpFill').style.width=`${Math.min(100,(state.xp/xpNeed())*100)}%`;
 $('#dayNum').textContent=state.day;$('#clock').textContent=fmtTime(state.hour);$('#weatherIcon').textContent=weatherIcon();$('#weatherText').textContent=state.night?'ليلة هادئة':state.weather;
 $('#energyValue').textContent=`${state.energy}%`;$('#energyFill').style.width=`${state.energy}%`;$('#waterValue').textContent=`${state.water}%`;$('#waterFill').style.width=`${state.water}%`;
 $('#gameShell').classList.toggle('night',state.night);$('#dayToggle').textContent=state.night?'☀️':'🌙';
}
function plotProgress(plot){if(!plot.crop||!plot.plantedAt)return 0;const crop=CROPS[plot.crop];const target=crop.grow*(plot.watered ? 0.66 : 1);return clamp((Date.now()-plot.plantedAt)/target,0,1)}
function stageEmoji(plot,progress){if(!plot.crop)return '';if(progress<.2)return '🌱';if(progress<.58)return plot.crop==='wheat'?'🌿':'🌱';return CROPS[plot.crop].icon}
function renderPlots(){const wrap=$('#plots');wrap.innerHTML='';state.plots.forEach((plot,i)=>{const progress=plotProgress(plot);const b=document.createElement('button');b.className=`plot${plot.watered?' watered':''}`;b.dataset.index=i;b.setAttribute('aria-label',`حوض ${i+1}`);if(plot.crop){const sprite=document.createElement('div');sprite.className=`crop-sprite stage-${progress>=1?3:progress>.42?2:1}`;sprite.textContent=stageEmoji(plot,progress);b.appendChild(sprite);const track=document.createElement('div');track.className='plot-progress';track.innerHTML=`<span style="width:${Math.round(progress*100)}%"></span>`;b.appendChild(track);const badge=document.createElement('span');badge.className='plot-badge';badge.textContent=progress>=1?'جاهز!':`${Math.round(progress*100)}%`;b.appendChild(badge)}wrap.appendChild(b)});
 $$('.plot').forEach(p=>p.addEventListener('click',()=>handlePlot(Number(p.dataset.index),p)))}
function renderTools(){$$('.tool-btn[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===state.selectedTool));$$('.crop-choice').forEach(b=>b.classList.toggle('active',b.dataset.crop===state.selectedCrop));}
function renderMissions(){
 const defs=[['plant','ازرع 6 محاصيل',6,state.missions.plant,'🪙 160'],['water','اسقِ 5 أحواض',5,state.missions.water,'💎 2'],['harvest','احصد 4 محاصيل',4,state.missions.harvest,'🪙 240']];
 const box=$('#missions');box.innerHTML=defs.map(([key,title,target,value,reward])=>`<div class="mission"><div class="mission-head"><b>${title}</b><small>${Math.min(value,target)}/${target}</small></div><div class="mini-track"><span style="width:${Math.min(100,(value/target)*100)}%"></span></div><div class="reward"><span>المكافأة</span><b>${reward}</b></div></div>`).join('');
}
function renderInventory(){const box=$('#inventoryGrid');if(!box)return;box.innerHTML=Object.entries(CROPS).map(([k,c])=>`<div class="inventory-item"><span>${c.icon}</span><b>${c.name}</b><small>× ${state.inventory[k]||0}</small></div>`).join('')}
function renderMarket(){const el=$('#marketList');if(!el)return;el.innerHTML=Object.entries(CROPS).map(([k,c],i)=>`<div class="market-row"><div><b>${c.icon} ${c.name}</b><div style="font-size:10px;color:var(--muted)">سعر البيع</div></div><strong class="${i%3===2?'price-down':'price-up'}">${c.sell} 🪙</strong></div>`).join('')}
function renderAll(){renderStats();renderPlots();renderTools();renderMissions();renderInventory();renderMarket();saveState()}
function addXp(amount){state.xp+=amount;let need=xpNeed();while(state.xp>=need){state.xp-=need;state.level++;state.gems+=2;state.energy=100;showToast(`🎉 وصلت للمستوى ${state.level}! +2 جوهرة`);need=xpNeed()}}
function spendEnergy(v){if(state.energy<v){showToast('⚡ طاقتك منخفضة، نم إلى اليوم التالي');return false}state.energy-=v;return true}
function moveFarmerTo(plotEl,action,after){farmerBusy=true;const world=$('#farmWorld'),farmer=$('#farmer');const pr=plotEl.getBoundingClientRect(),wr=world.getBoundingClientRect();const x=pr.left-wr.left+pr.width/2-35;const y=pr.top-wr.top+pr.height-94;farmer.style.transform=`translate(${x}px,${y}px)`;setTimeout(()=>{if(action==='water'){farmer.classList.add('watering');setTimeout(()=>farmer.classList.remove('watering'),900)}after&&after();setTimeout(()=>farmerBusy=false,650)},650)}
function handlePlot(i,el){if(farmerBusy){showToast('🚶 المزارع يتحرك الآن');return}const plot=state.plots[i];const progress=plotProgress(plot);const tool=state.selectedTool;
 if(tool==='plant'){if(plot.crop){showToast(progress>=1?'🌾 المحصول جاهز، استخدم أداة الحصاد':'هذا الحوض مزروع بالفعل');return}const crop=CROPS[state.selectedCrop];if(state.coins<crop.seed){showToast('🪙 العملات غير كافية للبذور');return}if(!spendEnergy(4))return;moveFarmerTo(el,'plant',()=>{state.coins-=crop.seed;state.plots[i]={crop:state.selectedCrop,plantedAt:Date.now(),watered:false,wateredAt:null};state.stats.planted++;state.missions.plant++;addXp(3);checkMissionRewards();showToast(`🌱 زرعت ${crop.name}`);renderAll()})}
 else if(tool==='water'){if(!plot.crop){showToast('ازرع الحوض أولًا 🌱');return}if(plot.watered){showToast('💧 هذا الحوض مروي');return}if(state.water<8){showToast('💧 خزان الماء فارغ تقريبًا');return}if(!spendEnergy(2))return;moveFarmerTo(el,'water',()=>{plot.watered=true;plot.wateredAt=Date.now();state.water-=8;state.stats.watered++;state.missions.water++;addXp(2);checkMissionRewards();showToast('💦 تم ري المحصول — النمو أسرع الآن');renderAll()})}
 else if(tool==='harvest'){if(!plot.crop){showToast('لا يوجد محصول للحصاد');return}if(progress<1){showToast(`⏳ المحصول ما زال ينمو (${Math.round(progress*100)}%)`);return}if(!spendEnergy(3))return;moveFarmerTo(el,'harvest',()=>{const crop=CROPS[plot.crop],cropKey=plot.crop;state.coins+=crop.sell;state.stats.earned+=crop.sell;state.stats.harvested++;state.missions.harvest++;state.inventory[cropKey]=(state.inventory[cropKey]||0)+1;state.plots[i]={crop:null,plantedAt:null,watered:false,wateredAt:null};addXp(crop.xp);coinPop(el,`+${crop.sell} 🪙`);checkMissionRewards();showToast(`🧺 حصاد ${crop.name} ناجح`);renderAll()})}
 else{showToast(plot.crop?`${CROPS[plot.crop].name} — ${Math.round(progress*100)}% نمو`:'حوض فارغ وجاهز للزراعة')}}
function checkMissionRewards(){if(state.missions.plant===6){state.coins+=160;showToast('🎯 أنجزت مهمة الزراعة +160 عملة')}if(state.missions.water===5){state.gems+=2;showToast('🎯 أنجزت مهمة الري +2 جوهرة')}if(state.missions.harvest===4){state.coins+=240;showToast('🎯 أنجزت مهمة الحصاد +240 عملة')}}
function coinPop(el,text){const world=$('#farmWorld'),r=el.getBoundingClientRect(),w=world.getBoundingClientRect(),p=document.createElement('div');p.className='coin-pop';p.textContent=text;p.style.left=`${r.left-w.left+r.width/2}px`;p.style.top=`${r.top-w.top}px`;world.appendChild(p);setTimeout(()=>p.remove(),1200)}
function chooseTool(tool){state.selectedTool=tool;renderTools();saveState();const names={plant:'🌱 اختر المحصول واضغط على حوض فارغ',water:'💧 اضغط على المحصول لسقيه',harvest:'🧺 اضغط على محصول مكتمل النمو',inspect:'👀 اضغط على أي حوض لمعرفة حالته'};showToast(names[tool])}
function sleepNextDay(){state.day++;state.hour=7;state.energy=100;state.water=100;state.night=false;const w=['مشمس','مشمس','غائم','ممطر'];state.weather=w[Math.floor(Math.random()*w.length)];if(state.weather==='ممطر'){state.plots.forEach(p=>{if(p.crop)p.watered=true});showToast('🌧️ يوم جديد ممطر — تم ري المزروعات تلقائيًا')}else showToast(`🌅 صباح اليوم ${state.day} — طاقتك تجددت`);renderAll()}
function toggleDay(){state.night=!state.night;state.hour=state.night?20:9;renderAll()}
function refillWater(){if(state.coins<80){showToast('تحتاج 80 عملة لتعبئة الخزان');return}state.coins-=80;state.water=100;renderAll();showToast('💧 تم تعبئة خزان الماء')}
function sellInventory(){let total=0,count=0;Object.entries(state.inventory).forEach(([k,v])=>{if(v>0){total+=v*CROPS[k].sell;count+=v;state.inventory[k]=0}});if(!count){showToast('المخزن فارغ حاليًا');return}state.coins+=total;state.stats.earned+=total;renderAll();showToast(`🧺 بعت ${count} محصولًا مقابل ${total} عملة`)}
function resetFarm(){if(!confirm('هل تريد بدء مزرعة جديدة؟ سيتم حذف الحفظ الحالي.'))return;state=clone(defaults);renderAll();closeModal();showToast('🌱 بدأت مزرعة جديدة')}
function openModal(id){$$('.modal-backdrop').forEach(m=>m.classList.add('hidden'));$(id).classList.remove('hidden');if(id==='#inventoryModal')renderInventory()}
function closeModal(){$$('.modal-backdrop').forEach(m=>m.classList.add('hidden'))}
function tick(){state.hour+=0.015;if(state.hour>=24){state.hour=0;state.day++}state.night=state.hour>=19||state.hour<6;renderStats();renderPlots();saveState()}
function init(){
 renderAll();
 $$('.tool-btn[data-tool]').forEach(b=>b.addEventListener('click',()=>chooseTool(b.dataset.tool)));
 $$('.crop-choice').forEach(b=>b.addEventListener('click',()=>{state.selectedCrop=b.dataset.crop;state.selectedTool='plant';renderTools();saveState();showToast(`${CROPS[b.dataset.crop].icon} تم اختيار ${CROPS[b.dataset.crop].name}`)}));
 $('#dayToggle').addEventListener('click',toggleDay);$('#sleepBtn').addEventListener('click',sleepNextDay);$('#shopBtn').addEventListener('click',()=>openModal('#shopModal'));$('#inventoryBtn').addEventListener('click',()=>openModal('#inventoryModal'));$('#barnBtn').addEventListener('click',()=>openModal('#barnModal'));$('#settingsBtn').addEventListener('click',()=>openModal('#settingsModal'));$('#waterRefill').addEventListener('click',refillWater);$('#sellAllBtn').addEventListener('click',sellInventory);$('#resetBtn').addEventListener('click',resetFarm);
 $$('.close-btn,.modal-backdrop').forEach(el=>el.addEventListener('click',e=>{if(e.target===el||el.classList.contains('close-btn'))closeModal()}));
 $$('.shop-seed').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.crop;state.selectedCrop=k;state.selectedTool='plant';closeModal();renderTools();saveState();showToast(`${CROPS[k].icon} اختر حوضًا لزراعة ${CROPS[k].name}`)}));
 $('#soundBtn').addEventListener('click',e=>{e.currentTarget.classList.toggle('muted');e.currentTarget.textContent=e.currentTarget.classList.contains('muted')?'🔇':'🔊';showToast(e.currentTarget.classList.contains('muted')?'تم كتم أصوات الواجهة':'تم تشغيل أصوات الواجهة')});
 window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(['1','2','3'].includes(e.key))chooseTool({1:'plant',2:'water',3:'harvest'}[e.key])});
 tickTimer=setInterval(tick,1500);
 showToast('🌾 أهلاً بك في مزرعة رائد — ازرع واسقِ واحصد!');
}
document.addEventListener('DOMContentLoaded',init);