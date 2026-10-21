import {defaultMap,normalizeMap,bounds} from './terrain.js';
export const clone = v => JSON.parse(JSON.stringify(v));
export const uid = () => Math.random().toString(36).slice(2, 10);
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const KINDS = ['hero','tree','crystal','rock','slime','portal','crate','car','ship','npc','flower','sparkles','button','image'];
export const BEHAVIORS = {
 control:{name:'You control it',icon:'gamepad',hint:'Arrow keys or WASD',speed:4.2},
 jump:{name:'Jump',icon:'jump',hint:'Press Space',power:6},
 collect:{name:'Collect me',icon:'diamond',hint:'Touch to earn a point'},
 follow:{name:'Follow',icon:'follow',hint:'Follow the player',speed:1.6},
 patrol:{name:'Follow a path',icon:'route',hint:'Visit each path point',speed:2},
 wander:{name:'Wander',icon:'shuffle',hint:'Explore on your own',speed:1.2},
 spin:{name:'Spin',icon:'rotate',hint:'Round and round',speed:1.5},
 bounce:{name:'Float',icon:'waves',hint:'A little up and down',speed:2},
 solid:{name:'Solid',icon:'box',hint:'Players cannot walk through'},
 hazard:{name:'Watch out!',icon:'bolt',hint:'Bumps cost one heart'},
 shoot:{name:'Shoot stars',icon:'sparkles',hint:'Space or tap to shoot',speed:8},
 drive:{name:'Drive',icon:'flag',hint:'↑ go · ← → steer',speed:6},
 goal:{name:'Next scene',icon:'door',hint:'Touch to open the next scene'},
 talk:{name:'Tell a story',icon:'message',hint:'Get close and press E'},
 particles:{name:'Sparkle',icon:'sparkles',hint:'A little everyday magic',speed:2}
};
export const ASSETS = [
 ['hero','Orbit','Characters','#41d9f2'],['slime','Jelly','Characters','#ab8cff'],['npc','A friend','Characters','#ffca76'],
 ['tree','Pine tree','Nature','#45b891'],['flower','Moonflower','Nature','#eca3dc'],['rock','Rock','Nature','#8b9eac'],
 ['crystal','Crystal','Objects','#50e9e5'],['portal','Portal','Objects','#9b82ff'],['crate','Crate','Objects','#dc9e5c'],
 ['car','Speedster','Characters','#ff8065'],['ship','Starship','Characters','#83b7ff'],['sparkles','Stardust','Effects','#6beaff'],['button','Story button','UI','#48d8e8']
].map(([kind,name,category,color])=>({kind,name,category,color}));
export function object(kind,x=0,z=0,extra={}) {
 const asset=ASSETS.find(a=>a.kind===kind)||{name:'My image',color:'#69dfef'};
 const defaults={hero:['control','jump'],tree:['solid'],rock:['solid'],crate:['solid'],crystal:['collect','spin','bounce'],slime:['wander','hazard'],portal:['goal','particles'],car:['drive'],ship:['control','shoot'],npc:['talk'],sparkles:['particles'],button:['talk']};
 return {id:uid(),kind,name:asset.name,x,z,y:0,scale:1,rotation:0,color:asset.color,visible:true,billboard:'upright',behaviors:(defaults[kind]||[]).map(type=>({type,enabled:true,...Object.fromEntries(Object.entries(BEHAVIORS[type]).filter(([k])=>['speed','power'].includes(k)))})),...extra};
}
export function scene(name='A new world', theme='forest',objects=[]) { return {id:uid(),name,theme,map:defaultMap(theme),objects,transition:'fade',story:{title:name,text:'Your story starts here. What happens next?',choices:[{text:'Keep exploring',target:'close'}]}}; }
export const TEMPLATES=[
 {id:'quest',name:'Crystal Quest',tag:'Explore & collect',icon:'diamond',color:'#51dbb7',mode:'3d'},
 {id:'shooter',name:'Star Patrol',tag:'Space shooter',icon:'rocket',color:'#a89bff',mode:'2d'},
 {id:'racing',name:'Neon Rally',tag:'Race to the finish',icon:'flag',color:'#ffaf77',mode:'3d'},
 {id:'story',name:'The Moon Door',tag:'Choose your adventure',icon:'book',color:'#e69fdc',mode:'2d'},
 {id:'platformer',name:'Sky Steps',tag:'Jump & run',icon:'jump',color:'#8dd5a4',mode:'2d'},
 {id:'blank',name:'Your next big idea',tag:'An empty playground',icon:'plus',color:'#59d8f0',mode:'3d'}
];
export function makeProject(type='quest') {
 const t=TEMPLATES.find(t=>t.id===type)||TEMPLATES[0];
 const p={format:'soulcode',version:1,id:uid(),name:t.name,genre:type,mode:t.mode,scenes:[],assets:[],rules:{lives:3,timeLimit:0,targetScore:type==='blank'?0:5},camera:cameraDefaults(t.mode==='2d'?'flat':'iso'),sound:true,music:null,updated:Date.now()};
 if(type==='quest'){
 const objs=[object('hero',-2.8,2.2),object('portal',5,-3.7),object('npc',-5,-3.7),object('slime',4,2.5,{behaviors:[{type:'patrol',enabled:true,speed:1.4},{type:'hazard',enabled:true}],path:[{x:3,z:1.5},{x:5,z:1.5},{x:5,z:3.5},{x:3,z:3.5}]})];
 [[-6,-1,1.15],[-6.5,3.6,.9],[-3.3,-4.2,1],[-1.4,-4.8,.85],[6,-.5,1.1],[6.6,3.4,.8],[2.3,-4.8,.7]].forEach(([x,z,scale])=>objs.push(object('tree',x,z,{scale})));
 [[-1,1.3],[.5,-.5],[2,-2],[3.6,-3.5],[-3.8,-1.6]].forEach(([x,z])=>objs.push(object('crystal',x,z)));
 [[-4.5,3.7,.9],[4.8,-1.7,.65],[-.4,-3.8,.6]].forEach(([x,z,scale])=>objs.push(object('rock',x,z,{scale})));
 [[-4,2.8],[1,3.8],[4.4,-4.5],[-2,-3.3]].forEach(([x,z])=>objs.push(object('flower',x,z,{scale:.7})));
 p.scenes=[scene('The little forest','forest',objs),scene('Beyond the portal','night',[object('hero',-4,0),object('npc',0,-2),object('crystal',-1,1),object('crystal',2,-1),object('crystal',4,2),object('portal',5,-3),object('tree',-5,-4),object('tree',5,4)])];
 p.scenes[0].story={title:'Hello, explorer!',text:'These crystals power the moon door. Find five, then step into the glowing portal.',choices:[{text:'Let’s explore!',target:'close'}]};
 }else if(type==='shooter'){
 p.rules.targetScore=6;
 p.scenes=[scene('The star field','space',[object('ship',0,4.2),...[-5,-3,-1,1,3,5].map((x,i)=>object('slime',x,-3+(i%2),{name:'Space jelly',color:'#bd97ff',behaviors:[{type:'patrol',enabled:true,speed:1.4},{type:'hazard',enabled:true}],path:[{x:x-1,z:-3},{x:x+1,z:-3},{x:x+1,z:0}]}))])];
 }else if(type==='racing'){
 p.rules.targetScore=4;p.rules.timeLimit=90;
 p.scenes=[scene('Cyan circuit','race',[object('car',-5,3,{rotation:Math.PI/2}),...[[0,3],[5,0],[0,-3],[-5,0]].map(([x,z],i)=>object('crystal',x,z,{name:`Checkpoint ${i+1}`,scale:1.2})),...[-2,0,2].map(x=>object('tree',x,0,{scale:.8})),object('rock',-1,1,{scale:.8})])];
 }else if(type==='story'){
 p.rules.targetScore=0;
 const a=scene('A mysterious door','night',[object('hero',-3,2),object('npc',-1,-1),object('portal',4,-2),object('tree',-5,-3),object('tree',5,3)]);
 const b=scene('The moon garden','forest',[object('hero',-4,2),object('npc',0,0),object('flower',-2,-2),object('flower',2,2),object('crystal',4,-3)]);
 const c=scene('A sea of stars','space',[object('hero',-3,0),object('npc',1,-1),object('sparkles',3,2)]);
 a.story={title:'The Moon Door',text:'A tiny voice whispers: “One door leads to the moon garden. The other leads to the stars.” Which will you choose?',choices:[{text:'🌙 The moon garden',target:b.id},{text:'✦ Follow the stars',target:c.id}]};
 b.story={title:'A garden in the sky',text:'The moonflowers begin to glow. A small friend gives you a crystal. You have found a place to call home.',choices:[{text:'Play again',target:a.id},{text:'Explore the garden',target:'close'}]};
 c.story={title:'A sea of stars',text:'You leap from star to star, leaving a trail of light. The universe is bigger than you imagined. Your adventure has just begun.',choices:[{text:'Try the other door',target:a.id},{text:'Keep exploring',target:'close'}]};p.scenes=[a,b,c];
 }else if(type==='platformer'){
 p.camera=cameraDefaults('side');p.rules.targetScore=4;const s=scene('A hop into the sky','forest',[object('hero',-17,.5,{y:1,behaviors:[{type:'control',speed:4.2,enabled:true},{type:'jump',power:8,enabled:true}]}),...[-12,-4,5,13].map((x,i)=>object('crystal',x,.5,{y:i%2?3:2})),object('portal',17,.5,{y:1})]);s.map={...defaultMap('forest'),width:40,depth:8,base:false,decorated:false};for(let x=-20;x<20;x++){if((x>-10&&x< -7)||(x>2&&x<5))continue;s.map.blocks.push({x,y:0,z:0,shape:'cube',tile:'grass'});}for(const x of [-5,-4,-3,12,13,14])s.map.blocks.push({x,y:2,z:0,shape:'slab',tile:'brick'});p.scenes=[s];
 }else p.scenes=[scene('My first world','forest',[object('hero',0,0)])];
 if(type==='shooter')p.scenes[0].story={title:'Welcome to Star Patrol',text:'Fly through the star field and clear the six space jellies.',choices:[{text:'Ready for takeoff',target:'close'}]};
 if(type==='racing')p.scenes[0].story={title:'Welcome to Neon Rally',text:'Collect four checkpoints before the timer ends.',choices:[{text:'Let’s race',target:'close'}]};
 return p;
}
export const CAMERA_PRESETS={flat:{name:'2D · top down',mode:'2d'},side:{name:'2D · platformer',mode:'2d'},iso:{name:'Isometric',mode:'3d'},first:{name:'First person',mode:'3d'},third:{name:'Third person',mode:'3d'}};
export function cameraDefaults(preset='iso'){return {preset,height:preset==='first'?1.35:5,distance:8,angle:preset==='first'?0:35,yaw:0,follow:preset!=='flat'};}
export function normalizeCamera(c,mode='3d'){const preset=CAMERA_PRESETS[c?.preset]?c.preset:mode==='2d'?'flat':'iso';return {...cameraDefaults(preset),height:num(c?.height,preset==='first'?1.35:5,.5,15),distance:num(c?.distance,8,2,24),angle:num(c?.angle,preset==='first'?0:35,-60,80),yaw:num(c?.yaw,0,-180,180),follow:c?.follow===undefined?cameraDefaults(preset).follow:c.follow!==false};}
const num=(v,def,a,b)=>Number.isFinite(Number(v))?clamp(Number(v),a,b):def;
export function validateProject(raw){
 if(!raw||raw.format!=='soulcode'||raw.version!==1||!Array.isArray(raw.scenes)||!raw.scenes.length||raw.scenes.length>30)throw new Error('Choose a Soulcode project file with 1–30 scenes.');
 const p=clone(raw);p.id=typeof p.id==='string'?p.id:uid();p.name=String(p.name||'My game').slice(0,60);p.mode=p.mode==='2d'?'2d':'3d';p.genre=['quest','shooter','racing','story','blank','platformer'].includes(p.genre)?p.genre:'blank';
 p.camera=normalizeCamera(p.camera,p.mode);p.mode=CAMERA_PRESETS[p.camera.preset].mode;
 p.assets=(Array.isArray(p.assets)?p.assets:[]).filter(a=>a&&typeof a.src==='string'&&/^(data:image\/(png|jpeg|webp|gif);base64,|data:audio\/[a-z0-9.+-]+;base64,)/.test(a.src)).slice(0,60).map(a=>({id:String(a.id||uid()),name:String(a.name||'My asset').slice(0,60),kind:a.src.startsWith('data:image/')?'image':'audio',src:a.src,width:num(a.width,1,1,4096),height:num(a.height,1,1,4096),pixelArt:a.pixelArt===true}));
 p.sound=p.sound!==false;p.music=typeof p.music==='string'?p.music:null;
 p.rules={lives:Math.round(num(p.rules?.lives,3,1,10)),timeLimit:num(p.rules?.timeLimit,0,0,600),targetScore:num(p.rules?.targetScore,5,0,100)};
 const sceneIds=new Set(),objectIds=new Set();
 p.scenes=p.scenes.map(s=>{
 if(!s||!Array.isArray(s.objects)||s.objects.length>200)throw new Error('Each scene can hold up to 200 objects.');
 const map=normalizeMap(s.map,s.theme),limit=bounds({map},.1);
 const id=typeof s.id==='string'&&!sceneIds.has(s.id)?s.id:uid();sceneIds.add(id);
 return {id,map,name:String(s.name||'My world').slice(0,50),theme:['forest','night','space','race','sand'].includes(s.theme)?s.theme:'forest',transition:['fade','slide','none'].includes(s.transition)?s.transition:'fade',story:{title:String(s.story?.title||'Hello!').slice(0,100),text:String(s.story?.text||'Your story starts here.').slice(0,1500),choices:(Array.isArray(s.story?.choices)?s.story.choices:[{text:'Explore',target:'close'}]).slice(0,4).map(c=>({text:String(c.text||'Continue').slice(0,80),target:String(c.target||'close')}))},objects:s.objects.filter(o=>o&&KINDS.includes(o.kind)).map(o=>{
 const oid=typeof o.id==='string'&&!objectIds.has(o.id)?o.id:uid();objectIds.add(oid);
 return {...object(o.kind),id:oid,name:String(o.name||o.kind).slice(0,50),x:num(o.x,0,limit.minX,limit.maxX),z:num(o.z,0,limit.minZ,limit.maxZ),y:num(o.y,0,0,20),scale:num(o.scale,1,.2,3),rotation:num(o.rotation,0,-100,100),color:/^#[0-9a-f]{6}$/i.test(o.color)?o.color:'#50ddeb',visible:o.visible!==false,billboard:o.billboard==='screen'?'screen':'upright',assetId:String(o.assetId||''),soundId:String(o.soundId||''),path:(Array.isArray(o.path)?o.path:[]).slice(0,40).map(pt=>({x:num(pt.x,0,limit.minX,limit.maxX),z:num(pt.z,0,limit.minZ,limit.maxZ),y:num(pt.y,0,0,20)})),behaviors:(Array.isArray(o.behaviors)?o.behaviors:[]).filter(b=>b&&BEHAVIORS[b.type]).slice(0,14).map(b=>({type:b.type,enabled:b.enabled!==false,...(b.speed!==undefined?{speed:num(b.speed,2,.1,12)}:{}),...(b.power!==undefined?{power:num(b.power,6,2,12)}:{})}))};})};
 });return p;
}
export function has(o,type){return o.behaviors?.some(b=>b.type===type&&b.enabled!==false);}
export function behavior(o,type){return o.behaviors?.find(b=>b.type===type&&b.enabled!==false);}
