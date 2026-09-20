import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import {terrainHeight,floorHeight,WORDS} from './state.js';
const palette={grass:0x6c8651,dark:0x294c36,wood:0x694c36,trunk:0x6d5841,rock:0x92958b,cream:0xd8cba8,roof:0x465a4c,gold:0xefc36a};
let seed=72;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
export function createWorld(scene,{low=false}={}){
 const obstacles=[],animated=[],markers=[],trees=[],clouds=[];const mats=new Map();
 const mat=(color,extra={})=>{if(Object.keys(extra).length)return new THREE.MeshStandardMaterial({color,roughness:.92,...extra});if(!mats.has(color))mats.set(color,new THREE.MeshStandardMaterial({color,roughness:.9}));return mats.get(color);};
 function mesh(g,c,parent=scene){const m=new THREE.Mesh(g,typeof c==='object'?c:mat(c));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,c,x,y,z,parent=scene){const m=mesh(new THREE.BoxGeometry(w,h,d),c,parent);m.position.set(x,y,z);return m;}
 function cylinder(a,b,h,c,x,y,z,parent=scene,n=8){const m=mesh(new THREE.CylinderGeometry(a,b,h,n),c,parent);m.position.set(x,y,z);return m;}
 function ball(r,c,x,y,z,parent=scene){const m=mesh(new THREE.SphereGeometry(r,low?7:12,low?5:8),c,parent);m.position.set(x,y,z);return m;}
 function groundShadow(x,z,r,parent=scene){const m=mesh(new THREE.CircleGeometry(r,16),mat(0x172d21,{transparent:true,opacity:.15,depthWrite:false}),parent);m.rotation.x=-Math.PI/2;m.position.set(x,terrainHeight(x,z)+.03,z);m.castShadow=false;return m;}
 function addCircle(x,z,r){obstacles.push({kind:'circle',x,z,r});}
 function pine(x,z,s=1){const g=new THREE.Group();g.position.set(x,terrainHeight(x,z),z);g.scale.setScalar(s);g.rotation.y=random()*6.28;scene.add(g);cylinder(.14,.3,4.2,palette.trunk,0,2.1,0,g);for(let i=0;i<3;i++){const m=mesh(new THREE.ConeGeometry(1.65-i*.32,3.1,low?6:9),mat(i===0?0x355b3d:i===1?0x426c44:0x547c4c,{flatShading:true}),g);m.position.y=3.1+i*1.25;}addCircle(x,z,.38*s);trees.push(g);return g;}
 function rock(x,z,s=1){const m=mesh(new THREE.IcosahedronGeometry(1,1),mat(palette.rock,{flatShading:true}));m.position.set(x,terrainHeight(x,z)+s*.48,z);m.rotation.set(random()*.4,random()*6,.1);m.scale.set(1.3*s,.83*s,.93*s);addCircle(x,z,s*.92);return m;}
 const landGeo=new THREE.PlaneGeometry(300,300,low?66:120,low?66:120);landGeo.rotateX(-Math.PI/2);const pos=landGeo.attributes.position,colors=[];
 const peaks=[[-66,-77,38,23],[-34,-105,46,29],[4,-119,57,34],[45,-96,49,28],[81,-68,45,26],[-111,-18,38,31],[114,11,35,29],[-110,87,32,35],[92,96,29,30]];
 function mountainHeight(x,z){let h=terrainHeight(x,z);const border=Math.max(Math.abs(x),Math.abs(z));if(border<70)return h;let peak=0;for(const [px,pz,ht,width]of peaks)peak+=ht*Math.exp(-((x-px)**2+(z-pz)**2)/(width*width));const jag=(Math.sin(x*.23+z*.09)+Math.cos(z*.26-x*.13))*2.5;return Math.max(h*.24,peak+jag)*Math.min(1,(border-61)/20);}
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),h=mountainHeight(x,z);pos.setY(i,h);const noise=Math.sin(x*3.2+z*2.17)*.026;const c=new THREE.Color(h>38?0xe0dfcd:h>24?0x7e8270:h>12?0x798065:palette.grass);c.offsetHSL(noise,.01,noise);if(Math.abs(z-8)<8&&Math.abs(x)<70)c.set(0x9a9b72);colors.push(c.r,c.g,c.b);}
 landGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));landGeo.computeVertexNormals();const terrain=mesh(landGeo,mat(0xffffff,{vertexColors:true}));terrain.castShadow=false;
 // Ground paths follow the actual elevation of the terrain.
 function path(points,width,color){const verts=[],inds=[];for(let i=0;i<points.length;i++){let [x,z]=points[i],next=points[Math.min(points.length-1,i+1)],prev=points[Math.max(0,i-1)],dx=next[0]-prev[0],dz=next[1]-prev[1],n=Math.hypot(dx,dz)||1;for(const side of [-1,1]){const px=x-dz/n*width*.5*side,pz=z+dx/n*width*.5*side;verts.push(px,terrainHeight(px,pz)+.055,pz);}if(i<points.length-1){const a=i*2;inds.push(a,a+2,a+1,a+1,a+2,a+3);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(inds);g.computeVertexNormals();const m=mesh(g,mat(color,{side:THREE.DoubleSide}));m.castShadow=false;}
 const mainPath=[];for(let z=66;z>=-64;z-=2)mainPath.push([Math.sin(z*.04)*.9,z]);path(mainPath,4.5,0xbeb090);path([[0,-12],[6,-13],[13,-12],[20,-13],[20,-17]],3.1,0xb5a586);path([[0,-15],[-7,-17],[-16,-17],[-21,-22]],2.8,0xb5a586);
 // Animated water, kept below the bridge deck.
 const waterGeo=new THREE.PlaneGeometry(140,11,low?20:60,4);waterGeo.rotateX(-Math.PI/2);const water=mesh(waterGeo,mat(0x508e99,{roughness:.26,metalness:.2,transparent:true,opacity:.92}));water.position.set(0,-.22,8);water.castShadow=false;const waveBase=water.geometry.attributes.position.array.slice();animated.push(t=>{const a=water.geometry.attributes.position;for(let i=0;i<a.count;i++)a.setY(i,Math.sin(waveBase[i*3]*.29+t*1.3+waveBase[i*3+2])*.07);a.needsUpdate=true;});
 for(let j=0;j<18;j++){const x=-65+j*7.5;const m=box(2.5,.025,.07,0xa6d0c4,x,.02,4+random()*8);m.material=mat(0xc3e2d5,{transparent:true,opacity:.43});m.castShadow=false;animated.push(t=>m.position.x=x+Math.sin(t*.4+j)*1.3);}
 // Timber bridge with planks, supports and handrails.
 for(let i=0;i<22;i++)box(6.4,.25,.7,i%2?0x987553:0xa88259,0,.58,-.3+i*.77);
 for(const x of [-3.02,3.02]){for(let z=0;z<=16;z+=4)box(.2,1.9,.24,0x604f39,x,1.4,z);box(.22,.19,17,0x796145,x,2.2,8);box(.18,.14,17,0x796145,x,1.25,8);obstacles.push({kind:'box',x1:x-.05,x2:x+.05,z1:0,z2:16});}
 for(let i=0;i<100;i++){const x=(random()-.5)*129,z=(random()-.5)*132;if(Math.abs(x)<8||Math.abs(z-8)<10||Math.hypot(x-20,z+22)<15||Math.hypot(x+20,z+20)<12)continue;pine(x,z,.7+random()*.7);}
 pine(11,29,1.2);pine(-16,37,1.12);pine(28,-36,1.05);rock(-9,30,1.5);for(let i=0;i<27;i++){const x=(random()-.5)*126,z=(random()-.5)*129;if(Math.abs(x)<9||Math.abs(z-8)<10||Math.hypot(x-20,z+22)<15||Math.hypot(x+20,z+20)<13)continue;rock(x,z,.5+random());}
 // Flowers use real stems and petals rather than icons.
 function flower(x,z,s=1){const y=terrainHeight(x,z);cylinder(.035,.035,.65*s,0x4a6534,x,y+.3*s,z);const head=ball(.13*s,0xd8a34f,x,y+.72*s,z);for(let i=0;i<5;i++)ball(.15*s,0xf2d285,x+Math.sin(i*1.256)*.15*s,y+.7*s,z+Math.cos(i*1.256)*.15*s);return head;}
 for(let i=0;i<12;i++)flower(7+(random()-.5)*2.5,42+(random()-.5)*2,1.1);
 // Trail signs.
 function sign(x,z,text){const y=terrainHeight(x,z);box(.16,2.2,.16,palette.wood,x,y+1.1,z);box(2.25,.7,.15,0x725b41,x,y+2.2,z);const cvs=document.createElement('canvas');cvs.width=512;cvs.height=160;const ctx=cvs.getContext('2d');ctx.fillStyle='#725b41';ctx.fillRect(0,0,512,160);ctx.fillStyle='#efe0bd';ctx.textAlign='center';ctx.font='600 42px sans-serif';ctx.fillText(text,256,98);const tx=new THREE.CanvasTexture(cvs);tx.colorSpace=THREE.SRGBColorSpace;const m=mesh(new THREE.PlaneGeometry(2.2,.68),mat(0xffffff,{map:tx,side:THREE.DoubleSide}));m.position.set(x,y+2.2,z+.081);addCircle(x,z,.3);}
 sign(3,37,'VALLEY TRAIL ↑');sign(4,-12,'CAFE →');sign(2,-49,'SUMMIT VIEW');
 // Campsite with a canvas tent, log seats, and a softly animated fire.
 const tent=new THREE.Group();scene.add(tent);tent.position.set(-21,terrainHeight(-21,-23),-23);
 for(const side of [-1,1]){const wall=box(2.5,.09,4,0xca9860,side*.98,1.15,0,tent);wall.rotation.z=side*1.06;}box(4,.1,4,0x78613e,0,.1,0,tent);const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.Float32BufferAttribute([-2,0,-2,2,0,-2,0,2.25,-2],3));tg.computeVertexNormals();mesh(tg,mat(0x94704c,{side:THREE.DoubleSide}),tent);addCircle(-21,-23,1.7);
 const fireY=terrainHeight(-15,-17);for(let i=0;i<8;i++){const a=i*Math.PI/4;const m=mesh(new THREE.DodecahedronGeometry(.28),palette.rock);m.position.set(-15+Math.sin(a)*.85,fireY+.16,-17+Math.cos(a)*.85);}for(let i=0;i<3;i++){const m=box(1.4,.19,.2,palette.wood,-15,fireY+.18+i*.08,-17);m.rotation.y=i*1.047;}
 const flame=mesh(new THREE.ConeGeometry(.42,1.15,7),new THREE.MeshBasicMaterial({color:0xf5bd61,transparent:true,opacity:.85}));flame.position.set(-15,fireY+.85,-17);animated.push(t=>{flame.scale.set(1+Math.sin(t*7)*.1,1+Math.sin(t*9)*.13,1);flame.rotation.y=t*.8;});addCircle(-15,-17,.85);
 function bench(x,z){const y=terrainHeight(x,z);for(const dx of [-1,1]){box(.17,.9,.6,palette.wood,x+dx,y+.45,z);box(.14,1.7,.14,palette.wood,x+dx,y+.85,z-.35);}box(2.7,.15,.8,0x92744f,x,y+.92,z);box(2.7,.45,.12,0x92744f,x,y+1.5,z-.35);obstacles.push({kind:'box',x1:x-1.3,x2:x+1.3,z1:z-.45,z2:z+.4});}
 bench(-7,-37);bench(-12,-19);
 // Restaurant is in the valley itself, with a walk-through entrance.
 const house=new THREE.Group();scene.add(house);house.position.set(20,.05,-22);
 box(15,.24,14,0xa99a7a,0,.08,0,house);box(15,5.8,.32,palette.cream,0,3,-7,house);box(.32,5.8,14,palette.cream,-7.5,3,0,house);box(.32,5.8,14,palette.cream,7.5,3,0,house);
 for(const sx of [-1,1]){box(5.4,5.8,.32,palette.cream,sx*4.8,3,7,house);box(3.1,2,.13,0x638b82,sx*4.8,3.1,7.19,house);box(3.4,.14,.26,0x756648,sx*4.8,2.02,7.25,house);box(.12,2,.2,0xe5dabb,sx*4.8,3.1,7.26,house);}
 box(4.5,1.9,.3,palette.cream,0,5,7,house);box(2.7,.15,1,0x8f7d5b,0,.16,7.4,house);
 const roof=new THREE.Group();house.add(roof);for(const side of [-1,1]){const m=box(8.6,.22,15.5,palette.roof,side*3.9,7,0,roof);m.rotation.z=-side*.4;for(let i=-7;i<=7;i++){const rib=box(8.5,.12,.09,0x596c56,side*3.9,7.17,i,roof);rib.rotation.z=-side*.4;}}
 box(.18,2.7,.18,palette.wood,-2.3,1.6,8.2,house);box(.18,2.7,.18,palette.wood,2.3,1.6,8.2,house);box(6,.17,2.2,0x9b7f58,0,3.15,7.7,house);sign(20,-13,'VALLEY CAFE');
 obstacles.push({kind:'box',x1:12.2,x2:12.6,z1:-29,z2:-15},{kind:'box',x1:27.4,x2:27.8,z1:-29,z2:-15},{kind:'box',x1:12.5,x2:27.5,z1:-29.2,z2:-28.8},{kind:'box',x1:12.5,x2:17.7,z1:-15.2,z2:-14.8},{kind:'box',x1:22.3,x2:27.5,z1:-15.2,z2:-14.8});
 function chair(x,z){box(.85,.14,.9,0x7b6244,x,.92,z);box(.85,.8,.12,0x7b6244,x,1.45,z-.43);for(const dx of [-.32,.32])for(const dz of [-.33,.33])box(.1,.65,.1,0x4f4b37,x+dx,.53,z+dz);addCircle(x,z,.35);}
 function table(x,z){box(2.4,.16,1.7,0x916e46,x,1.57,z);for(const dx of [-.85,.85])for(const dz of [-.55,.55])box(.12,1.3,.12,0x5a4e37,x+dx,.86,z+dz);obstacles.push({kind:'box',x1:x-1.2,x2:x+1.2,z1:z-.85,z2:z+.85});}
 table(16,-24);table(23,-24);chair(16,-22.5);chair(24,-22.5);chair(14.5,-24);chair(25,-24);
 for(const x of [16,23]){cylinder(.2,.16,.37,0xd8d8bb,x,1.88,-24,scene,12);const handle=mesh(new THREE.TorusGeometry(.13,.04,5,10),0xd8d8bb);handle.position.set(x+.22,1.91,-24);cylinder(.29,.29,.045,0xc5c9ae,x,1.69,-24);}
 const spoon=mesh(new THREE.SphereGeometry(.13,8,5),mat(0xbabfb4,{metalness:.7,roughness:.25}));spoon.scale.set(.8,.18,1.4);spoon.position.set(22.4,1.7,-24);box(.055,.035,.5,0xbabfb4,22.4,1.7,-23.65);
 box(3.5,1.65,1.2,0x6e6c4c,24,1.08,-27.4);addCircle(24,-27.4,1.2);
 // Articulated hiking character.
 function person(x,z,npc=false){const root=new THREE.Group();root.position.set(x,floorHeight(x,z),z);scene.add(root);const torso=new THREE.Group();root.add(torso);const jacket=npc?0xdad7ba:0xb46e48,pants=0x39453d,skin=0xc69b75;
 const body=cylinder(.32,.3,.8,jacket,0,1.27,0,torso,10);body.scale.z=.66;ball(.23,jacket,0,1.67,0,torso).scale.set(1.25,.6,.85);
 cylinder(.105,.1,.17,skin,0,1.88,0,torso);const head=ball(.245,skin,0,2.13,0,torso);head.scale.set(.82,1.12,.83);const hair=ball(.249,0x483b2a,0,2.27,.025,torso);hair.scale.set(.84,.61,.89);ball(.065,skin,0,2.11,-.205,torso).scale.z=.9;
 for(const sx of [-1,1])ball(.022,0x302a24,sx*.079,2.18,-.175,torso);
 const limbs=[];for(const sx of [-1,1]){const leg=new THREE.Group();leg.position.set(sx*.17,.93,0);torso.add(leg);cylinder(.12,.105,.65,pants,0,-.29,0,leg);box(.23,.18,.42,0x34352e,0,-.72,-.08,leg);limbs.push(leg);const arm=new THREE.Group();arm.position.set(sx*.4,1.63,0);torso.add(arm);cylinder(.105,.085,.55,jacket,0,-.23,0,arm);ball(.085,skin,0,-.56,0,arm);limbs.push(arm);}
 if(!npc){const pack=box(.58,.66,.27,0x355d59,0,1.36,.26,torso);box(.4,.29,.1,0x25433d,0,1.3,.43,torso);for(const sx of [-1,1])box(.07,.67,.055,0xc6b582,sx*.21,1.36,-.18,torso);cylinder(.075,.075,.42,0xc7c6a2,.37,1.24,.27,torso);}
 else{box(.5,.62,.04,0x465a41,0,1.23,-.245,torso);cylinder(.27,.24,.19,0xe5dfc5,0,2.43,0,torso);}
 const shadow=mesh(new THREE.CircleGeometry(.48,14),mat(0x11231b,{transparent:true,opacity:.25,depthWrite:false}),root);shadow.rotation.x=-Math.PI/2;shadow.position.y=.045;shadow.castShadow=false;
 return {root,torso,limbs,shadow};}
 const player=person(0,34);const npc=person(24,-26,true);npc.root.rotation.y=Math.PI;addCircle(24,-26,.45);
 // Discovery markers are anchored to world coordinates.
 for(const word of WORDS){const g=new THREE.Group();g.position.set(word.x,floorHeight(word.x,word.z)+(word.indoor?2.9:word.id==='tree'?5.5:2.5),word.z);const orb=mesh(new THREE.OctahedronGeometry(.19),new THREE.MeshBasicMaterial({color:palette.gold}),g);const ring=mesh(new THREE.TorusGeometry(.37,.023,5,18),new THREE.MeshBasicMaterial({color:palette.gold,transparent:true,opacity:.8}),g);ring.rotation.x=.22;scene.add(g);markers.push({group:g,baseY:g.position.y,word,orb});}
 // Distant drifting clouds and birds give the valley movement.
 for(let i=0;i<8;i++){const g=new THREE.Group();scene.add(g);g.position.set((random()-.5)*220,40+random()*13,-70-random()*50);for(let j=0;j<3;j++){const c=ball(3+random()*2,mat(0xe8e4d0,{flatShading:false}),j*3,Math.sin(j)*1.2,0,g);c.scale.set(1.5,.43,.7);c.castShadow=false;}clouds.push(g);}
 const birds=[];for(let i=0;i<6;i++){const g=new THREE.Group();scene.add(g);for(const sx of [-1,1]){const wing=box(.85,.03,.24,0x455951,sx*.4,0,0,g);wing.rotation.z=sx*.2;}birds.push(g);}
 function animate(t,moving,speed,inRestaurant){water.visible=true;for(const f of animated)f(t);clouds.forEach((c,i)=>c.position.x+=Math.sin(i+1)*.003);birds.forEach((b,i)=>{b.position.set(Math.sin(t*.12+i)*35,18+i*.8,Math.cos(t*.12+i)*24-34);b.rotation.y=t*.12+i;for(let j=0;j<2;j++)b.children[j].rotation.z=(j===0?-1:1)*Math.sin(t*4+i)*.45;});const stride=moving?Math.sin(t*(speed>7?12:8))*.62:Math.sin(t)*.025;player.limbs.forEach((l,i)=>l.rotation.x=stride*(i<2?1:-1)*(i%2===0?1:-1));player.torso.position.y=moving?Math.abs(Math.sin(t*(speed>7?12:8)))*.04:Math.sin(t*1.7)*.012;roof.visible=!inRestaurant;}
 return {player,npc,obstacles,markers,animate,roof,terrain,water};
}
