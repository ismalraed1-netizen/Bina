import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const el=id=>document.getElementById(id);
const UI={startScreen:el("startScreen"),startBtn:el("startBtn"),hud:el("hud"),mission:el("mission"),missionTitle:el("missionTitle"),missionText:el("missionText"),missionBar:el("missionBar"),xp:el("xp"),found:el("found"),zone:el("zone"),prompt:el("prompt"),promptText:el("promptText"),joystick:el("joystick"),knob:el("knob"),interact:el("interactBtn"),quiz:el("quiz"),emoji:el("emoji"),answers:el("answers"),feedback:el("feedback"),listen:el("listen"),closeQuiz:el("closeQuiz"),dialogue:el("dialogue"),dialogueEn:el("dialogueEn"),dialogueAr:el("dialogueAr"),dialogueListen:el("dialogueListen"),dialogueNext:el("dialogueNext"),closeDialogue:el("closeDialogue"),toast:el("toast")};

const saved=JSON.parse(localStorage.getItem("ea3d-save")||"null")||{xp:0,found:[],restaurant:false};
const found=new Set(saved.found||[]);
function save(){saved.found=[...found];localStorage.setItem("ea3d-save",JSON.stringify(saved));updateHud()}
function toast(t){UI.toast.textContent=t;UI.toast.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>UI.toast.classList.remove("show"),2100)}
function speak(t){if(!("speechSynthesis" in window))return;const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.8;speechSynthesis.cancel();speechSynthesis.speak(u)}

let scene,camera,renderer,clock,player,yaw=0,started=false,modal=false,inside=false,nearest=null,activeQuiz=null;
const keys={},touch={x:0,y:0},items=[],markers=[];
const C={grass:0x5c8b49,dirt:0xaa845d,water:0x3d9dca,wood:0x745039,leaf:0x4b7e43,leaf2:0x6c9d54,rock:0x747a7d,cream:0xe1cfa7,roof:0x8a402f,skin:0xe2b58b,blue:0x3d79a8};

function material(color,opt={}){return new THREE.MeshStandardMaterial({color,roughness:.82,metalness:.02,...opt})}
function box(w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color));m.castShadow=m.receiveShadow=true;return m}
function sphere(r,color){const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),material(color));m.castShadow=m.receiveShadow=true;return m}
function cyl(r1,r2,h,color){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,12),material(color));m.castShadow=m.receiveShadow=true;return m}
function marker(x,y,z,color=0xffd166){const g=new THREE.Group(),ring=new THREE.Mesh(new THREE.TorusGeometry(.5,.08,8,22),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9}));ring.rotation.x=Math.PI/2;g.add(ring);g.position.set(x,y,z);scene.add(g);markers.push(g);return g}
function tree(x,z,s=1){const g=new THREE.Group();const trunk=cyl(.3,.42,3.1,C.wood);trunk.position.y=1.55;const a=sphere(1.35,C.leaf);a.position.y=3.45;const b=sphere(1,C.leaf2);b.position.set(.7,3.7,.1);const c=sphere(.95,C.leaf);c.position.set(-.7,3.6,-.2);g.add(trunk,a,b,c);g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g}
function rock(x,z,s=1){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(1.05),material(C.rock));m.scale.set(1.45,.9,1);m.scale.multiplyScalar(s);m.position.set(x,.82*s,z);m.rotation.set(.15,.5,.1);m.castShadow=m.receiveShadow=true;scene.add(m);return m}
function mountain(x,z,s,h){const m=new THREE.Mesh(new THREE.ConeGeometry(s,h,7,2),material(0x68766d));m.position.set(x,h/2-1,z);m.castShadow=m.receiveShadow=true;scene.add(m);const cap=new THREE.Mesh(new THREE.ConeGeometry(s*.4,h*.23,7),material(0xdfe5e1));cap.position.set(x,h*.87-1,z);cap.castShadow=true;scene.add(cap)}

function buildBridge(){const g=new THREE.Group();for(let i=0;i<13;i++){const p=box(6.3,.26,.78,0x8c6543);p.position.set(0,.43,-4.8+i*.8);g.add(p)}[-3.1,3.1].forEach(x=>{for(let i=0;i<5;i++){const p=box(.2,1.2,.2,0x5e402c);p.position.set(x,1,-4.3+i*2);g.add(p)}});g.position.z=8;scene.add(g)}
function buildRestaurant(){const g=new THREE.Group();const body=box(15,6.5,12,C.cream);body.position.y=3.3;const roofA=box(9,.65,14,C.roof);roofA.position.set(-3.8,7,0);roofA.rotation.z=.5;const roofB=box(9,.65,14,C.roof);roofB.position.set(3.8,7,0);roofB.rotation.z=-.5;const door=box(2.1,3.6,.35,0x493629);door.position.set(0,1.9,6.18);const w1=box(3.1,2,.18,0x8fd2e8);w1.position.set(-4.3,3.3,6.2);const w2=w1.clone();w2.position.x=4.3;const awn=box(5,.3,2,0xd3604b);awn.position.set(0,5,6.9);g.add(body,roofA,roofB,door,w1,w2,awn);g.position.set(18,0,-24);scene.add(g)}

function makePlayer(){const g=new THREE.Group();const body=box(1.15,1.65,.7,C.blue);body.position.y=2;const head=sphere(.6,C.skin);head.position.y=3.3;const hair=sphere(.62,0x49362c);hair.scale.y=.5;hair.position.y=3.65;const l=box(.35,1.1,.38,0x26384d);l.position.set(-.3,.82,0);const r=l.clone();r.position.x=.3;const pack=box(.95,1.2,.34,0x244e72);pack.position.set(0,2.05,.5);g.add(body,head,hair,l,r,pack);g.position.set(0,0,34);scene.add(g);return g}
function makeNpc(x,z){const g=new THREE.Group();const body=box(1,1.55,.65,0xf2efe8);body.position.y=1.85;const apron=box(.8,1.15,.08,0x313b42);apron.position.set(0,1.7,-.36);const head=sphere(.53,C.skin);head.position.y=3.02;const hair=sphere(.55,0x3f302a);hair.scale.y=.55;hair.position.y=3.35;g.add(body,apron,head,hair);g.position.set(x,0,z);scene.add(g)}

function addItem(obj){items.push(obj);return obj}
function buildInterior(){
  const floor=box(22,.4,18,0x805b3e);floor.position.set(0,.18,-120);scene.add(floor);
  const back=box(22,6,.4,0xd8c4a0);back.position.set(0,3,-129);scene.add(back);
  const left=box(.4,6,18,0xd8c4a0);left.position.set(-11,3,-120);scene.add(left);
  const right=left.clone();right.position.x=11;scene.add(right);
  const f1=box(8.5,6,.4,0xd8c4a0);f1.position.set(-6.75,3,-111);scene.add(f1);const f2=f1.clone();f2.position.x=6.75;scene.add(f2);
  const table=box(5,.32,3,0x704b32);table.position.set(0,1.6,-120);scene.add(table);
  [[-2,-118.7],[2,-118.7],[-2,-121.5],[2,-121.5]].forEach(p=>{const c=box(1.1,1.2,1,0x725038);c.position.set(p[0],.65,p[1]);scene.add(c)});
  makeNpc(5,-124.2);
  addItem({id:"chair",mode:"in",type:"quiz",label:"الكرسي",word:"Chair",ar:"كرسي",emoji:"🪑",choices:["Chair","Table","Door","Window"],p:new THREE.Vector3(-2,0,-118.7),r:2.5,m:marker(-2,2.1,-118.7,0x7ee081)});
  addItem({id:"spoon",mode:"in",type:"quiz",label:"الملعقة",word:"Spoon",ar:"ملعقة",emoji:"🥄",choices:["Spoon","Fork","Plate","Knife"],p:new THREE.Vector3(.7,0,-120),r:2.5,m:marker(.7,2.25,-120,0xffd166)});
  addItem({id:"waiter",mode:"in",type:"talk",label:"تحدث مع الموظف",p:new THREE.Vector3(5,0,-124.2),r:3,m:marker(5,4,-124.2,0x55c7ff)});
  addItem({id:"exit",mode:"in",type:"exit",label:"اخرج من المطعم",p:new THREE.Vector3(0,0,-111.5),r:2.6,m:marker(0,2,-111.4,0xffffff)});
}

function buildWorld(){
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,180),material(C.grass));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const path=new THREE.Mesh(new THREE.PlaneGeometry(9,130),material(C.dirt));path.rotation.x=-Math.PI/2;path.position.set(0,.03,-7);scene.add(path);
  const river=new THREE.Mesh(new THREE.PlaneGeometry(160,11),material(C.water,{roughness:.25,transparent:true,opacity:.9}));river.rotation.x=-Math.PI/2;river.position.set(0,.08,8);scene.add(river);
  buildBridge();buildRestaurant();
  [[-17,31,1.2],[13,29,1.1],[-24,20,1.2],[23,17,1],[-30,2,1.15],[28,-3,1.15],[-22,-21,1.15],[33,-28,1.2],[-35,-37,1.35],[27,-48,1.2],[-10,-54,1],[12,-51,1.1]].forEach(p=>tree(...p));
  rock(-11,25);rock(17,13,.8);rock(-18,-18,1.1);rock(8,-45,.85);
  mountain(-48,-68,19,33);mountain(-23,-73,15,28);mountain(5,-78,21,38);mountain(34,-72,17,31);mountain(57,-66,14,25);
  addItem({id:"rock",mode:"out",type:"quiz",label:"الصخرة",word:"Rock",ar:"صخرة",emoji:"🪨",choices:["Rock","Tree","Road","Chair"],p:new THREE.Vector3(-11,0,25),r:3.1,m:marker(-11,2.4,25)});
  addItem({id:"tree",mode:"out",type:"quiz",label:"الشجرة",word:"Tree",ar:"شجرة",emoji:"🌳",choices:["Tree","Rock","River","House"],p:new THREE.Vector3(13,0,29),r:3.2,m:marker(13,5.4,29,0x7ee081)});
  addItem({id:"river",mode:"out",type:"quiz",label:"النهر",word:"River",ar:"نهر",emoji:"🌊",choices:["River","Bridge","Mountain","Road"],p:new THREE.Vector3(-7,0,8),r:3.7,m:marker(-7,1.1,8,0x55c7ff)});
  addItem({id:"bridge",mode:"out",type:"quiz",label:"الجسر",word:"Bridge",ar:"جسر",emoji:"🌉",choices:["Bridge","River","Restaurant","Tree"],p:new THREE.Vector3(0,0,8),r:3.4,m:marker(0,2,8)});
  addItem({id:"mountain",mode:"out",type:"quiz",label:"الجبل",word:"Mountain",ar:"جبل",emoji:"⛰️",choices:["Mountain","Forest","School","Market"],p:new THREE.Vector3(0,0,-43),r:4,m:marker(0,2.4,-43,0xffffff)});
  addItem({id:"restaurant",mode:"out",type:"enter",label:"ادخل المطعم",p:new THREE.Vector3(18,0,-16.7),r:4,m:marker(18,4,-16.7,0xff8d72)});
  buildInterior();
}
function init(){
  scene=new THREE.Scene();scene.background=new THREE.Color(0x8fc9e0);scene.fog=new THREE.Fog(0x8fc9e0,55,130);
  camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,250);
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;el("game").appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xd8f2ff,0x41513b,2.1));const sun=new THREE.DirectionalLight(0xffefd2,3);sun.position.set(34,50,24);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;scene.add(sun);
  buildWorld();player=makePlayer();clock=new THREE.Clock();setupLook();setupJoystick();updateHud();resize();renderer.setAnimationLoop(loop);
}
function updateHud(){UI.xp.textContent=saved.xp||0;UI.found.textContent=found.size;const a=Math.min(found.size,3),b=saved.restaurant?1:0;UI.missionBar.style.width=((a+b)/4*100)+"%";if(found.size<3){UI.missionTitle.textContent="استكشف الوادي";UI.missionText.textContent="اكتشف "+(3-found.size)+" أشياء جديدة، ثم ابحث عن المطعم."}else if(!saved.restaurant){UI.missionTitle.textContent="اعبر الجسر";UI.missionText.textContent="أحسنت! اتجه إلى المطعم وادخل إليه."}else{UI.missionTitle.textContent="استكشف بحرية";UI.missionText.textContent="جرّب بقية الكلمات داخل وخارج المطعم."}}
function markerVisibility(){items.forEach(i=>{if(!i.m)return;const rightMode=inside?i.mode==="in":i.mode==="out";i.m.visible=rightMode&&!found.has(i.id);if(i.type==="enter")i.m.visible=!inside;if(i.type==="exit"||i.type==="talk")i.m.visible=inside})}
function interactionCheck(){if(!player||modal)return;let best=null,d=1e9,mode=inside?"in":"out";for(const i of items){if(i.mode!==mode)continue;const x=player.position.distanceTo(i.p);if(x<i.r&&x<d){d=x;best=i}}nearest=best;if(best){UI.prompt.classList.remove("hidden");UI.promptText.textContent=best.label;if(innerWidth<=760)UI.interact.classList.remove("hidden")}else{UI.prompt.classList.add("hidden")}}
function interact(){if(modal||!nearest)return;if(nearest.type==="quiz")openQuiz(nearest);else if(nearest.type==="enter")enterRestaurant();else if(nearest.type==="exit")exitRestaurant();else if(nearest.type==="talk")openDialogue()}
function enterRestaurant(){inside=true;saved.restaurant=true;if(!found.has("restaurant")){found.add("restaurant");saved.xp+=25;toast("دخلت المطعم! +25 XP")}player.position.set(0,0,-114.5);yaw=Math.PI;scene.fog.near=22;scene.fog.far=65;UI.zone.textContent="🍽️ Riverside Restaurant";save()}
function exitRestaurant(){inside=false;player.position.set(18,0,-12.5);yaw=0;scene.fog.near=55;scene.fog.far=130;UI.zone.textContent="⛰️ Mountain Valley";toast("رجعت إلى الوادي")}
function openQuiz(i){activeQuiz=i;modal=true;UI.quiz.classList.remove("hidden");UI.emoji.textContent=i.emoji;UI.feedback.textContent="";UI.answers.innerHTML="";const a=[...i.choices].sort(()=>Math.random()-.5);a.forEach(c=>{const b=document.createElement("button");b.className="answer";b.textContent=c;b.onclick=()=>answer(b,c,i);UI.answers.appendChild(b)})}
function answer(btn,c,i){const bs=[...UI.answers.querySelectorAll(".answer")];bs.forEach(b=>b.disabled=true);if(c===i.word){btn.classList.add("correct");if(!found.has(i.id)){found.add(i.id);saved.xp+=10;save()}UI.feedback.textContent="✅ Correct! "+i.word+" = "+i.ar+" • +10 XP";speak(i.word);setTimeout(closeQuiz,1200)}else{btn.classList.add("wrong");const ok=bs.find(b=>b.textContent===i.word);if(ok)ok.classList.add("correct");UI.feedback.textContent="الإجابة الصحيحة: "+i.word;speak(i.word);setTimeout(()=>{bs.forEach(b=>{b.disabled=false;b.classList.remove("wrong","correct")});UI.feedback.textContent="حاول مرة ثانية"},1300)}}
function closeQuiz(){modal=false;UI.quiz.classList.add("hidden");activeQuiz=null}
function openDialogue(){modal=true;UI.dialogue.classList.remove("hidden");UI.dialogueEn.textContent="Hello! Welcome to the restaurant.";UI.dialogueAr.textContent="مرحبًا! أهلًا بك في المطعم."}
function closeDialogue(){modal=false;UI.dialogue.classList.add("hidden")}
function canMove(p){if(inside)return p.x>-10&&p.x<10&&p.z>-128&&p.z<-111.4;if(p.x<-78||p.x>78||p.z<-78||p.z>78)return false;if(p.z>2.2&&p.z<13.8&&Math.abs(p.x)>3.8)return false;return true}
function move(dt){if(!started||modal)return;let f=0,r=0;if(keys.KeyW||keys.ArrowUp)f++;if(keys.KeyS||keys.ArrowDown)f--;if(keys.KeyD||keys.ArrowRight)r++;if(keys.KeyA||keys.ArrowLeft)r--;f+=touch.y;r+=touch.x;const len=Math.hypot(f,r);if(len>.04){f/=Math.max(1,len);r/=Math.max(1,len);const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),dir=forward.multiplyScalar(f).add(right.multiplyScalar(r)).normalize();const n=player.position.clone().addScaledVector(dir,(inside?5:7)*dt);if(canMove(n))player.position.copy(n);player.rotation.y=Math.atan2(-dir.x,-dir.z)}}
function follow(){const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),target=player.position.clone().add(new THREE.Vector3(0,2.2,0)).addScaledVector(f,2),pos=player.position.clone().add(new THREE.Vector3(0,5,0)).addScaledVector(f,-8.3);camera.position.lerp(pos,.13);camera.lookAt(target)}
function loop(){const dt=Math.min(clock.getDelta(),.04);move(dt);follow();interactionCheck();markerVisibility();const t=performance.now()*.001;markers.forEach((m,i)=>{m.rotation.y+=.013;m.position.y+=Math.sin(t*2+i)*.0012});renderer.render(scene,camera)}
function setupLook(){let drag=false,last=0;renderer.domElement.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"){drag=true;last=e.clientX}});addEventListener("pointermove",e=>{if(drag&&e.pointerType==="mouse"){const dx=e.clientX-last;last=e.clientX;yaw-=dx*.006}});addEventListener("pointerup",()=>drag=false);let tid=null,tx=0;renderer.domElement.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"&&e.clientX>innerWidth*.35&&e.clientX<innerWidth*.88){tid=e.pointerId;tx=e.clientX}});renderer.domElement.addEventListener("pointermove",e=>{if(e.pointerId===tid){const dx=e.clientX-tx;tx=e.clientX;yaw-=dx*.009}});renderer.domElement.addEventListener("pointerup",e=>{if(e.pointerId===tid)tid=null})}
function setupJoystick(){let id=null;const update=e=>{const r=UI.joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=41;let dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy)||1;if(d>max){dx=dx/d*max;dy=dy/d*max}UI.knob.style.transform="translate("+dx+"px,"+dy+"px)";touch.x=dx/max;touch.y=-dy/max};UI.joystick.addEventListener("pointerdown",e=>{id=e.pointerId;UI.joystick.setPointerCapture(id);update(e)});UI.joystick.addEventListener("pointermove",e=>{if(e.pointerId===id)update(e)});const end=e=>{if(e.pointerId===id){id=null;touch.x=touch.y=0;UI.knob.style.transform="translate(0,0)"}};UI.joystick.addEventListener("pointerup",end);UI.joystick.addEventListener("pointercancel",end);UI.interact.addEventListener("pointerdown",e=>{e.preventDefault();interact()})}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}
addEventListener("resize",resize);addEventListener("keydown",e=>{keys[e.code]=true;if(e.code==="KeyE"||e.code==="Space"){e.preventDefault();interact()}if(e.code==="Escape"){closeQuiz();closeDialogue()}});addEventListener("keyup",e=>keys[e.code]=false);
UI.startBtn.onclick=()=>{started=true;UI.startScreen.classList.add("hidden");UI.hud.classList.remove("hidden");UI.mission.classList.remove("hidden");UI.zone.classList.remove("hidden");if(innerWidth<=760){UI.joystick.classList.remove("hidden");UI.interact.classList.remove("hidden")}toast("ابدأ بالصخرة أو الشجرة القريبة 👀")};
UI.listen.onclick=()=>activeQuiz&&speak(activeQuiz.word);UI.closeQuiz.onclick=closeQuiz;UI.closeDialogue.onclick=closeDialogue;UI.dialogueListen.onclick=()=>speak(UI.dialogueEn.textContent);UI.dialogueNext.onclick=()=>{UI.dialogueEn.textContent="Would you like some water?";UI.dialogueAr.textContent="هل ترغب في بعض الماء؟";speak(UI.dialogueEn.textContent)};
init();