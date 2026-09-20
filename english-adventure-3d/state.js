export const SAVE_KEY = 'ea3d-save';
export const WORDS = [
  {id:'rock',word:'Rock',ar:'صخرة',choices:['Rock','Tree','Road','Chair'],sentence:'This is a rock.',x:-9,z:30,r:4},
  {id:'tree',word:'Tree',ar:'شجرة',choices:['Tree','Rock','River','House'],sentence:'The tree is tall.',x:11,z:29,r:4.5},
  {id:'river',word:'River',ar:'نهر',choices:['River','Bridge','Mountain','Road'],sentence:'The river flows through the valley.',x:-5,z:16,r:4},
  {id:'bridge',word:'Bridge',ar:'جسر',choices:['Bridge','River','Restaurant','Tree'],sentence:'Let us cross the bridge.',x:0,z:8,r:3.5},
  {id:'mountain',word:'Mountain',ar:'جبل',choices:['Mountain','Forest','School','Market'],sentence:'I can see a mountain.',x:0,z:-49,r:5},
  {id:'tent',word:'Tent',ar:'خيمة',choices:['Tent','House','Boat','Window'],sentence:'We sleep in a tent.',x:-21,z:-23,r:4},
  {id:'campfire',word:'Campfire',ar:'نار المخيم',choices:['Campfire','River','Flower','Road'],sentence:'The campfire is warm.',x:-15,z:-17,r:3},
  {id:'flower',word:'Flower',ar:'زهرة',choices:['Flower','Tree','Grass','Rock'],sentence:'This flower is yellow.',x:7,z:42,r:3},
  {id:'bench',word:'Bench',ar:'مقعد',choices:['Bench','Bridge','Door','Table'],sentence:'I sit on the bench.',x:-7,z:-37,r:3},
  {id:'sign',word:'Sign',ar:'لافتة',choices:['Sign','Window','Door','Road'],sentence:'Read the sign.',x:3,z:37,r:3},
  {id:'chair',word:'Chair',ar:'كرسي',choices:['Chair','Table','Door','Window'],sentence:'This chair is comfortable.',x:16,z:-22,r:3,indoor:true},
  {id:'table',word:'Table',ar:'طاولة',choices:['Table','Chair','Spoon','Window'],sentence:'The cup is on the table.',x:22,z:-23,r:3,indoor:true},
  {id:'spoon',word:'Spoon',ar:'ملعقة',choices:['Spoon','Fork','Plate','Knife'],sentence:'I need a spoon, please.',x:22,z:-24,r:2.8,indoor:true},
  {id:'cup',word:'Cup',ar:'كوب',choices:['Cup','Plate','Bottle','Fork'],sentence:'A cup of tea, please.',x:16,z:-24,r:2.8,indoor:true}
];
export function readSave(storage) {
  let raw; try { raw=JSON.parse(storage.getItem(SAVE_KEY)||'null'); } catch {}
  const ids=new Set(WORDS.map(w=>w.id)); ids.add('restaurant');
  return {found:Array.isArray(raw?.found)?[...new Set(raw.found.filter(id=>ids.has(id)))]:[],restaurant:raw?.restaurant===true};
}
export function points(found) { return [...found].reduce((n,id)=>n+(id==='restaurant'?25:10),0); }
export function writeSave(storage,found,restaurant) {try {storage.setItem(SAVE_KEY,JSON.stringify({found:[...found],restaurant,xp:points(found)}));return true;}catch{return false;}}
export function shuffle(array,random=Math.random) {const out=[...array];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function terrainHeight(x,z) {
  if(z>2.3&&z<13.7&&Math.abs(x)<72)return -.9;
  const edge=Math.max(0,(Math.abs(x)-26)/35);
  const ridge=Math.max(0,(-z-54)/40);
  const ripple=Math.sin(x*.075+z*.021)*Math.cos(z*.07)*1.8+Math.sin(x*.19+z*.13)*.35;
  const valley=(Math.min(1,Math.abs(x)/13)*Math.min(1,Math.abs(z-8)/13));
  return Math.max(-1.4,ripple*valley+edge*edge*8+ridge*ridge*9);
}
export function floorHeight(x,z) {
  if(Math.abs(x)<3.25&&z>-0.5&&z<16.5)return .7;
  if(x>12.5&&x<27.5&&z>-29&&z<-15)return .28;
  return terrainHeight(x,z);
}
export function canStand(x,z,obstacles=[]) {
  if(Math.abs(x)>66||z<-65||z>66)return false;
  if(z>2.3&&z<13.7&&Math.abs(x)>2.65)return false;
  for(const o of obstacles){if(o.kind==='circle'){if(Math.hypot(x-o.x,z-o.z)<o.r+.36)return false;}else if(x>o.x1-.35&&x<o.x2+.35&&z>o.z1-.35&&z<o.z2+.35)return false;}
  return true;
}
