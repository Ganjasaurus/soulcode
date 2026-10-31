var Wn={grass:{name:"Meadow",color:"#378e68",light:"#67b87d",dark:"#267655"},brick:{name:"Brick",color:"#b26d59",light:"#de9e7e",dark:"#704b4b"},stone:{name:"Stone",color:"#718997",light:"#a0b4bf",dark:"#536875"},sand:{name:"Sand",color:"#c5a475",light:"#e3c795",dark:"#ac8c5f"},wood:{name:"Wood",color:"#98724f",light:"#c49c6a",dark:"#6b4c36"},ice:{name:"Ice",color:"#79b7cc",light:"#c3edf3",dark:"#4f8fae"},metal:{name:"Neon",color:"#263e50",light:"#61dff3",dark:"#1a2d3e"}},xn={cube:{name:"Block",height:1},slab:{name:"Platform",height:.3},pillar:{name:"Pillar",height:1}},ss=4096,Yd=(i,e,t)=>Math.max(e,Math.min(t,i)),Pi=(i,e,t,n)=>Number.isFinite(Number(i))?Yd(Number(i),t,n):e,Rn=i=>({width:18,depth:12,base:!0,tileset:i==="sand"?"sand":i==="space"||i==="race"?"metal":i==="night"?"stone":"grass",tiles:[],blocks:[],decorated:!0});function vh(i,e="forest"){let t={...Rn(e),...i||{}};t.width=Math.round(Pi(t.width,18,8,64)/2)*2,t.depth=Math.round(Pi(t.depth,12,4,64)/2)*2,t.base=t.base!==!1,t.decorated=t.decorated!==!1,t.tileset=Wn[t.tileset]?t.tileset:"grass";let n=new Map,s=new Map;for(let r of(Array.isArray(t.tiles)?t.tiles:[]).slice(0,4096)){if(!r)continue;let a=Math.floor(Pi(r.x,0,-t.width/2,t.width/2-1)),o=Math.floor(Pi(r.z,0,-t.depth/2,t.depth/2-1));(Wn[r.tile]||r.tile==="void")&&n.set(`${a},${o}`,{x:a,z:o,tile:r.tile})}for(let r of(Array.isArray(t.blocks)?t.blocks:[]).slice(0,ss)){if(!r)continue;let a=Math.floor(Pi(r.x,0,-t.width/2,t.width/2-1)),o=Math.floor(Pi(r.z,0,-t.depth/2,t.depth/2-1)),l=Math.floor(Pi(r.y,0,0,15));s.set(`${a},${l},${o}`,{x:a,y:l,z:o,shape:xn[r.shape]?r.shape:"cube",tile:Wn[r.tile]?r.tile:t.tileset})}return{width:t.width,depth:t.depth,base:t.base,tileset:t.tileset,decorated:t.decorated,tiles:[...n.values()],blocks:[...s.values()]}}function rn(i,e=.35){let t=i.map||Rn(i.theme);return{minX:-t.width/2+e,maxX:t.width/2-e,minZ:-t.depth/2+e,maxZ:t.depth/2-e}}function yh(i,e,t){let n=Math.floor(e.x),s=Math.floor(e.z),r=Math.max(0,Math.min(15,Math.floor(e.y||0)));if(n<-i.width/2||n>=i.width/2||s<-i.depth/2||s>=i.depth/2)return!1;if(t.tool==="floor"){let o=i.tiles.find(c=>c.x===n&&c.z===s),l=t.erase?"void":t.tile;return o?.tile===l?!1:(i.tiles=i.tiles.filter(c=>c.x!==n||c.z!==s),i.tiles.push({x:n,z:s,tile:l}),i.decorated=!1,!0)}if(t.erase){let o=i.blocks.length;return i.blocks=i.blocks.filter(l=>l.x!==n||l.z!==s||l.y!==r),o!==i.blocks.length}let a=!1;for(let o=0;o<(t.tool==="wall"?3:1);o++){let l=r+o;if(l>15)break;let c=i.blocks.find(u=>u.x===n&&u.z===s&&u.y===l),h=t.tool==="wall"?"cube":t.shape||"cube";if(!(c&&c.tile===t.tile&&c.shape===h)){if(!c&&i.blocks.length>=ss)break;i.blocks=i.blocks.filter(u=>u!==c),i.blocks.push({x:n,y:l,z:s,shape:h,tile:t.tile}),a=!0}}return i.decorated=!1,a}function _h(i,e,t){let n=i.map,s=[...n.blocks,...n.tiles,...i.objects.map(o=>({x:o.x,z:o.z}))],r=Math.max(8,...s.map(o=>2*Math.ceil(Math.abs(o.x+.5)+.5))),a=Math.max(4,...s.map(o=>2*Math.ceil(Math.abs(o.z+.5)+.5)));return n.width=Math.max(Math.min(64,e),Math.min(64,r)),n.depth=Math.max(Math.min(64,t),Math.min(64,a)),{width:n.width,depth:n.depth}}var is=class{constructor(e){this.map=e.map||Rn(e.theme),this.columns=new Map,this.tiles=new Map(this.map.tiles.map(t=>[`${t.x},${t.z}`,t.tile]));for(let t of this.map.blocks){let n=`${t.x},${t.z}`;this.columns.has(n)||this.columns.set(n,[]),this.columns.get(n).push(t)}this.lastChecks=0}nearby(e,t,n=.32){this.lastChecks=0;let s=[];for(let r=Math.floor(e-n);r<=Math.floor(e+n);r++)for(let a=Math.floor(t-n);a<=Math.floor(t+n);a++){this.lastChecks++;for(let o of this.columns.get(`${r},${a}`)||[])s.push(o)}return s}baseAt(e,t){let n=this.tiles.get(`${Math.floor(e)},${Math.floor(t)}`);return n==="void"?!1:!!(this.map.base||n)}floor(e,t,n=0,s=.28){let r=this.baseAt(e,t)?0:-1/0;for(let a of this.nearby(e,t,s)){let o=a.y+xn[a.shape].height;o<=n+.12&&o>r&&(r=o)}return r}blocked(e,t,n,s=1.1,r=.28){return this.nearby(e,t,r).some(a=>e+r>a.x&&e-r<a.x+1&&t+r>a.z&&t-r<a.z+1&&n<a.y+xn[a.shape].height-.03&&n+s>a.y+.04)}ceiling(e,t,n,s,r=.28){let a=1/0;for(let o of this.nearby(e,t,r))o.y>=n-.001&&o.y<=s&&(a=Math.min(a,o.y));return a}};function bh(i){let e=Wn[i]||Wn.grass,t=document.createElement("canvas");t.width=t.height=32;let n=t.getContext("2d");if(n.fillStyle=e.color,n.fillRect(0,0,32,32),n.strokeStyle=e.dark,n.lineWidth=1,i==="brick"||i==="stone")for(let s=0;s<32;s+=8){n.beginPath(),n.moveTo(0,s),n.lineTo(32,s),n.stroke();for(let r=s%16?0:8;r<32;r+=16)n.beginPath(),n.moveTo(r,s),n.lineTo(r,s+8),n.stroke()}else if(i==="wood")for(let s=0;s<32;s+=8)n.fillStyle=e.dark,n.fillRect(0,s,32,1),n.fillStyle=e.light,n.fillRect(s*7%25,s+3,10,1);else if(i==="metal")n.strokeStyle=e.light,n.globalAlpha=.35,n.strokeRect(.5,.5,31,31),n.fillStyle=e.light,n.fillRect(3,3,2,2),n.fillRect(27,27,2,2),n.globalAlpha=1;else{for(let s=0;s<24;s++)n.fillStyle=s%3===0?e.dark:e.light,n.globalAlpha=.4,n.fillRect(s*13%32,s*23%32,1+s%3,1);n.globalAlpha=1,i==="ice"&&(n.strokeStyle=e.light,n.beginPath(),n.moveTo(2,25),n.lineTo(25,2),n.stroke())}return t}var _n=i=>JSON.parse(JSON.stringify(i)),Qt=()=>Math.random().toString(36).slice(2,10),ot=(i,e,t)=>Math.min(t,Math.max(e,i)),Zd=["hero","tree","crystal","rock","slime","portal","crate","car","ship","npc","flower","sparkles","button","image"],ci={control:{name:"You control it",icon:"gamepad",hint:"Arrow keys or WASD",speed:4.2},jump:{name:"Jump",icon:"jump",hint:"Press Space",power:6},collect:{name:"Collect me",icon:"diamond",hint:"Touch to earn a point"},follow:{name:"Follow",icon:"follow",hint:"Follow the player",speed:1.6},patrol:{name:"Follow a path",icon:"route",hint:"Visit each path point",speed:2},wander:{name:"Wander",icon:"shuffle",hint:"Explore on your own",speed:1.2},spin:{name:"Spin",icon:"rotate",hint:"Round and round",speed:1.5},bounce:{name:"Float",icon:"waves",hint:"A little up and down",speed:2},solid:{name:"Solid",icon:"box",hint:"Players cannot walk through"},hazard:{name:"Watch out!",icon:"bolt",hint:"Bumps cost one heart"},shoot:{name:"Shoot stars",icon:"sparkles",hint:"Space or tap to shoot",speed:8},drive:{name:"Drive",icon:"flag",hint:"\u2191 go \xB7 \u2190 \u2192 steer",speed:6},goal:{name:"Next scene",icon:"door",hint:"Touch to open the next scene"},talk:{name:"Tell a story",icon:"message",hint:"Get close and press E"},particles:{name:"Sparkle",icon:"sparkles",hint:"A little everyday magic",speed:2}},Zs=[["hero","Orbit","Characters","#41d9f2"],["slime","Jelly","Characters","#ab8cff"],["npc","A friend","Characters","#ffca76"],["tree","Pine tree","Nature","#45b891"],["flower","Moonflower","Nature","#eca3dc"],["rock","Rock","Nature","#8b9eac"],["crystal","Crystal","Objects","#50e9e5"],["portal","Portal","Objects","#9b82ff"],["crate","Crate","Objects","#dc9e5c"],["car","Speedster","Characters","#ff8065"],["ship","Starship","Characters","#83b7ff"],["sparkles","Stardust","Effects","#6beaff"],["button","Story button","UI","#48d8e8"]].map(([i,e,t,n])=>({kind:i,name:e,category:t,color:n}));function Ve(i,e=0,t=0,n={}){let s=Zs.find(a=>a.kind===i)||{name:"My image",color:"#69dfef"},r={hero:["control","jump"],tree:["solid"],rock:["solid"],crate:["solid"],crystal:["collect","spin","bounce"],slime:["wander","hazard"],portal:["goal","particles"],car:["drive"],ship:["control","shoot"],npc:["talk"],sparkles:["particles"],button:["talk"]};return{id:Qt(),kind:i,name:s.name,x:e,z:t,y:0,scale:1,rotation:0,color:s.color,visible:!0,billboard:"upright",behaviors:(r[i]||[]).map(a=>({type:a,enabled:!0,...Object.fromEntries(Object.entries(ci[a]).filter(([o])=>["speed","power"].includes(o)))})),...n}}function vn(i="A new world",e="forest",t=[]){return{id:Qt(),name:i,theme:e,map:Rn(e),objects:t,transition:"fade",story:{title:i,text:"Your story starts here. What happens next?",choices:[{text:"Keep exploring",target:"close"}]}}}var Ys=[{id:"quest",name:"Crystal Quest",tag:"Explore & collect",icon:"diamond",color:"#51dbb7",mode:"3d"},{id:"shooter",name:"Star Patrol",tag:"Space shooter",icon:"rocket",color:"#a89bff",mode:"2d"},{id:"racing",name:"Neon Rally",tag:"Race to the finish",icon:"flag",color:"#ffaf77",mode:"3d"},{id:"story",name:"The Moon Door",tag:"Choose your adventure",icon:"book",color:"#e69fdc",mode:"2d"},{id:"platformer",name:"Sky Steps",tag:"Jump & run",icon:"jump",color:"#8dd5a4",mode:"2d"},{id:"blank",name:"Your next big idea",tag:"An empty playground",icon:"plus",color:"#59d8f0",mode:"3d"}];function wo(i="quest"){let e=Ys.find(n=>n.id===i)||Ys[0],t={format:"soulcode",version:1,id:Qt(),name:e.name,genre:i,mode:e.mode,scenes:[],assets:[],rules:{lives:3,timeLimit:0,targetScore:i==="blank"?0:5},camera:yn(e.mode==="2d"?"flat":"iso"),sound:!0,music:null,updated:Date.now()};if(i==="quest"){let n=[Ve("hero",-2.8,2.2),Ve("portal",5,-3.7),Ve("npc",-5,-3.7),Ve("slime",4,2.5,{behaviors:[{type:"patrol",enabled:!0,speed:1.4},{type:"hazard",enabled:!0}],path:[{x:3,z:1.5},{x:5,z:1.5},{x:5,z:3.5},{x:3,z:3.5}]})];[[-6,-1,1.15],[-6.5,3.6,.9],[-3.3,-4.2,1],[-1.4,-4.8,.85],[6,-.5,1.1],[6.6,3.4,.8],[2.3,-4.8,.7]].forEach(([s,r,a])=>n.push(Ve("tree",s,r,{scale:a}))),[[-1,1.3],[.5,-.5],[2,-2],[3.6,-3.5],[-3.8,-1.6]].forEach(([s,r])=>n.push(Ve("crystal",s,r))),[[-4.5,3.7,.9],[4.8,-1.7,.65],[-.4,-3.8,.6]].forEach(([s,r,a])=>n.push(Ve("rock",s,r,{scale:a}))),[[-4,2.8],[1,3.8],[4.4,-4.5],[-2,-3.3]].forEach(([s,r])=>n.push(Ve("flower",s,r,{scale:.7}))),t.scenes=[vn("The little forest","forest",n),vn("Beyond the portal","night",[Ve("hero",-4,0),Ve("npc",0,-2),Ve("crystal",-1,1),Ve("crystal",2,-1),Ve("crystal",4,2),Ve("portal",5,-3),Ve("tree",-5,-4),Ve("tree",5,4)])],t.scenes[0].story={title:"Hello, explorer!",text:"These crystals power the moon door. Find five, then step into the glowing portal.",choices:[{text:"Let\u2019s explore!",target:"close"}]}}else if(i==="shooter")t.rules.targetScore=6,t.scenes=[vn("The star field","space",[Ve("ship",0,4.2),...[-5,-3,-1,1,3,5].map((n,s)=>Ve("slime",n,-3+s%2,{name:"Space jelly",color:"#bd97ff",behaviors:[{type:"patrol",enabled:!0,speed:1.4},{type:"hazard",enabled:!0}],path:[{x:n-1,z:-3},{x:n+1,z:-3},{x:n+1,z:0}]}))])];else if(i==="racing")t.rules.targetScore=4,t.rules.timeLimit=90,t.scenes=[vn("Cyan circuit","race",[Ve("car",-5,3,{rotation:Math.PI/2}),...[[0,3],[5,0],[0,-3],[-5,0]].map(([n,s],r)=>Ve("crystal",n,s,{name:`Checkpoint ${r+1}`,scale:1.2})),...[-2,0,2].map(n=>Ve("tree",n,0,{scale:.8})),Ve("rock",-1,1,{scale:.8})])];else if(i==="story"){t.rules.targetScore=0;let n=vn("A mysterious door","night",[Ve("hero",-3,2),Ve("npc",-1,-1),Ve("portal",4,-2),Ve("tree",-5,-3),Ve("tree",5,3)]),s=vn("The moon garden","forest",[Ve("hero",-4,2),Ve("npc",0,0),Ve("flower",-2,-2),Ve("flower",2,2),Ve("crystal",4,-3)]),r=vn("A sea of stars","space",[Ve("hero",-3,0),Ve("npc",1,-1),Ve("sparkles",3,2)]);n.story={title:"The Moon Door",text:"A tiny voice whispers: \u201COne door leads to the moon garden. The other leads to the stars.\u201D Which will you choose?",choices:[{text:"\u{1F319} The moon garden",target:s.id},{text:"\u2726 Follow the stars",target:r.id}]},s.story={title:"A garden in the sky",text:"The moonflowers begin to glow. A small friend gives you a crystal. You have found a place to call home.",choices:[{text:"Play again",target:n.id},{text:"Explore the garden",target:"close"}]},r.story={title:"A sea of stars",text:"You leap from star to star, leaving a trail of light. The universe is bigger than you imagined. Your adventure has just begun.",choices:[{text:"Try the other door",target:n.id},{text:"Keep exploring",target:"close"}]},t.scenes=[n,s,r]}else if(i==="platformer"){t.camera=yn("side"),t.rules.targetScore=4;let n=vn("A hop into the sky","forest",[Ve("hero",-17,.5,{y:1,behaviors:[{type:"control",speed:4.2,enabled:!0},{type:"jump",power:8,enabled:!0}]}),...[-12,-4,5,13].map((s,r)=>Ve("crystal",s,.5,{y:r%2?3:2})),Ve("portal",17,.5,{y:1})]);n.map={...Rn("forest"),width:40,depth:8,base:!1,decorated:!1};for(let s=-20;s<20;s++)s>-10&&s<-7||s>2&&s<5||n.map.blocks.push({x:s,y:0,z:0,shape:"cube",tile:"grass"});for(let s of[-5,-4,-3,12,13,14])n.map.blocks.push({x:s,y:2,z:0,shape:"slab",tile:"brick"});t.scenes=[n]}else t.scenes=[vn("My first world","forest",[Ve("hero",0,0)])];return i==="shooter"&&(t.scenes[0].story={title:"Welcome to Star Patrol",text:"Fly through the star field and clear the six space jellies.",choices:[{text:"Ready for takeoff",target:"close"}]}),i==="racing"&&(t.scenes[0].story={title:"Welcome to Neon Rally",text:"Collect four checkpoints before the timer ends.",choices:[{text:"Let\u2019s race",target:"close"}]}),t}var js={flat:{name:"2D \xB7 top down",mode:"2d"},side:{name:"2D \xB7 platformer",mode:"2d"},iso:{name:"Isometric",mode:"3d"},first:{name:"First person",mode:"3d"},third:{name:"Third person",mode:"3d"}};function yn(i="iso"){return{preset:i,height:i==="first"?1.35:5,distance:8,angle:i==="first"?0:35,yaw:0,follow:i!=="flat"}}function jd(i,e="3d"){let t=js[i?.preset]?i.preset:e==="2d"?"flat":"iso";return{...yn(t),height:Pt(i?.height,t==="first"?1.35:5,.5,15),distance:Pt(i?.distance,8,2,24),angle:Pt(i?.angle,t==="first"?0:35,-60,80),yaw:Pt(i?.yaw,0,-180,180),follow:i?.follow===void 0?yn(t).follow:i.follow!==!1}}var Pt=(i,e,t,n)=>Number.isFinite(Number(i))?ot(Number(i),t,n):e;function Wr(i){if(!i||i.format!=="soulcode"||i.version!==1||!Array.isArray(i.scenes)||!i.scenes.length||i.scenes.length>30)throw new Error("Choose a Soulcode project file with 1\u201330 scenes.");let e=_n(i);e.id=typeof e.id=="string"?e.id:Qt(),e.name=String(e.name||"My game").slice(0,60),e.mode=e.mode==="2d"?"2d":"3d",e.genre=["quest","shooter","racing","story","blank","platformer"].includes(e.genre)?e.genre:"blank",e.camera=jd(e.camera,e.mode),e.mode=js[e.camera.preset].mode,e.assets=(Array.isArray(e.assets)?e.assets:[]).filter(s=>s&&typeof s.src=="string"&&/^(data:image\/(png|jpeg|webp|gif);base64,|data:audio\/[a-z0-9.+-]+;base64,)/.test(s.src)).slice(0,60).map(s=>({id:String(s.id||Qt()),name:String(s.name||"My asset").slice(0,60),kind:s.src.startsWith("data:image/")?"image":"audio",src:s.src,width:Pt(s.width,1,1,4096),height:Pt(s.height,1,1,4096),pixelArt:s.pixelArt===!0})),e.sound=e.sound!==!1,e.music=typeof e.music=="string"?e.music:null,e.rules={lives:Math.round(Pt(e.rules?.lives,3,1,10)),timeLimit:Pt(e.rules?.timeLimit,0,0,600),targetScore:Pt(e.rules?.targetScore,5,0,100)};let t=new Set,n=new Set;return e.scenes=e.scenes.map(s=>{if(!s||!Array.isArray(s.objects)||s.objects.length>200)throw new Error("Each scene can hold up to 200 objects.");let r=vh(s.map,s.theme),a=rn({map:r},.1),o=typeof s.id=="string"&&!t.has(s.id)?s.id:Qt();return t.add(o),{id:o,map:r,name:String(s.name||"My world").slice(0,50),theme:["forest","night","space","race","sand"].includes(s.theme)?s.theme:"forest",transition:["fade","slide","none"].includes(s.transition)?s.transition:"fade",story:{title:String(s.story?.title||"Hello!").slice(0,100),text:String(s.story?.text||"Your story starts here.").slice(0,1500),choices:(Array.isArray(s.story?.choices)?s.story.choices:[{text:"Explore",target:"close"}]).slice(0,4).map(l=>({text:String(l.text||"Continue").slice(0,80),target:String(l.target||"close")}))},objects:s.objects.filter(l=>l&&Zd.includes(l.kind)).map(l=>{let c=typeof l.id=="string"&&!n.has(l.id)?l.id:Qt();return n.add(c),{...Ve(l.kind),id:c,name:String(l.name||l.kind).slice(0,50),x:Pt(l.x,0,a.minX,a.maxX),z:Pt(l.z,0,a.minZ,a.maxZ),y:Pt(l.y,0,0,20),scale:Pt(l.scale,1,.2,3),rotation:Pt(l.rotation,0,-100,100),color:/^#[0-9a-f]{6}$/i.test(l.color)?l.color:"#50ddeb",visible:l.visible!==!1,billboard:l.billboard==="screen"?"screen":"upright",assetId:String(l.assetId||""),soundId:String(l.soundId||""),path:(Array.isArray(l.path)?l.path:[]).slice(0,40).map(h=>({x:Pt(h.x,0,a.minX,a.maxX),z:Pt(h.z,0,a.minZ,a.maxZ),y:Pt(h.y,0,0,20)})),behaviors:(Array.isArray(l.behaviors)?l.behaviors:[]).filter(h=>h&&ci[h.type]).slice(0,14).map(h=>({type:h.type,enabled:h.enabled!==!1,...h.speed!==void 0?{speed:Pt(h.speed,2,.1,12)}:{},...h.power!==void 0?{power:Pt(h.power,6,2,12)}:{}}))}})}}),e}function ht(i,e){return i.behaviors?.some(t=>t.type===e&&t.enabled!==!1)}function In(i,e){return i.behaviors?.find(t=>t.type===e&&t.enabled!==!1)}var Mh={plus:"M12 5v14M5 12h14",minus:"M5 12h14",close:"m6 6 12 12M6 18 18 6",chevron:"m9 5 7 7-7 7",down:"m6 9 6 6 6-6",search:"m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",play:"m8 5 11 7-11 7Z",pause:"M8 5v14M16 5v14",stop:"M6 6h12v12H6Z",box:"m12 3 9 5v9l-9 5-9-5V8Zm0 10v9M3 8l9 5 9-5M7.5 5.5l9 5",diamond:"m12 3 8 9-8 9-8-9ZM4 12h16M12 3l-3 9 3 9 3-9Z",bolt:"m13 2-9 12h7l-1 8 10-12h-7Z",image:"M4 4h16v16H4ZM4 17l6-6 4 4 3-3 3 3M16 8h.01",music:"M9 18V5l11-2v13M9 7l11-2M9 18a3 3 0 1 1-3-3h3M20 16a3 3 0 1 1-3-3h3",layers:"m12 3 10 6-10 6L2 9Zm-10 11 10 6 10-6M2 19l10 6 10-6",upload:"M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",download:"M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5",undo:"M3 10h11a6 6 0 1 1 0 12M3 10l6-6M3 10l6 6",redo:"M21 10H10a6 6 0 1 0 0 12M21 10l-6-6M21 10l-6 6",expand:"M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",grid:"M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",mouse:"m4 3 7 18 2-8 8-2Z",hand:"M8 11V5a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v9a7 7 0 0 1-13 4l-4-6a2 2 0 0 1 3-2l2 2",move:"M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4m12-8 4 4-4 4",rotate:"M20 7A9 9 0 1 0 21 15M20 2v5h-5",copy:"M8 8h13v13H8ZM16 8V3H3v13h5",trash:"M3 6h18M5 6l1 15h12l1-15M9 6V3h6v3M10 10v7m4-7v7",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0",settings:"M4 7h16M4 17h16M8 4v6m8 4v6",help:"M9 9a3 3 0 1 1 4 3v2m-1 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",check:"m5 12 4 4 10-10",folder:"M3 5h6l2 3h10v12H3Z",cloud:"M7 18a5 5 0 1 1 1-10 6 6 0 0 1 11 3 3.5 3.5 0 0 1-1 7Z",heart:"M12 21 3 12a5 5 0 0 1 9-6 5 5 0 0 1 9 6Z",sparkles:"m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3ZM3 3v4M1 5h4m15 14v4m-2-2h4",gamepad:"M7 7h10l4 11c1 3-3 4-5 0l-1-1H9l-1 1c-2 4-6 3-5 0ZM7 10v6m-3-3h6m6-2h.01m2 3h.01",jump:"M5 19c0-11 14-11 14 0M5 19v-5m0 5h5M12 3v4",follow:"M4 18a3 3 0 1 1 6 0M7 15V4m-3 3 3-3 3 3M14 6h5v13m-3-3 3 3 3-3",route:"M5 5a2 2 0 1 1 0 .01M5 7v10a3 3 0 0 0 6 0V7a4 4 0 0 1 8 0v10m-3-3 3 3 3-3",shuffle:"M3 5h3c6 0 6 14 12 14h3m-4-4 4 4-4 4M3 19h3c6 0 6-14 12-14h3m-4-4 4 4-4 4",waves:"M2 8c4-8 6 8 10 0s6 8 10 0M2 16c4-8 6 8 10 0s6 8 10 0",flag:"M5 22V3h14l-3 5 3 5H5",door:"M5 21V3h14v18M3 21h18M14 12h.01",message:"M3 3h18v14H8l-5 4ZM7 8h10M7 12h6",rocket:"m14 3 7-1-1 7-9 9-5-5ZM6 13H2l5-7h4m0 12v4l7-5v-4M4 17l-2 5 5-2",book:"M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v16",volume:"M3 9h4l5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",sun:"M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",screen:"M3 3h18v14H3ZM8 21h8m-4-4v4",save:"M4 3h13l4 4v14H3V3Zm3 0v6h9V3M7 21v-8h10v8",star:"m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",world:"M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c-6 7-6 13 0 20 6-7 6-13 0-20",edit:"m4 16 12-12 4 4L8 20H4Zm9-9 4 4"};function oe(i,e=""){return`<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${Mh[i]||Mh.box}"/></svg>`}function Ge(i){return String(i??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Xn(i,e="#5cdeed"){let t="";return["hero","npc"].includes(i)?t=`<ellipse cx="40" cy="68" rx="18" ry="5" fill="#000" opacity=".2"/><rect x="27" y="42" width="26" height="21" rx="9" fill="${e}"/><rect x="18" y="16" width="44" height="33" rx="13" fill="${e}"/><rect x="24" y="25" width="32" height="15" rx="7" fill="#153748"/><rect x="30" y="29" width="5" height="7" rx="2" fill="#dbffff"/><rect x="45" y="29" width="5" height="7" rx="2" fill="#dbffff"/><path d="M22 49v7m36-7v7M31 62v5m18-5v5" stroke="${e}" stroke-width="8" stroke-linecap="round"/><path d="M40 16V9" stroke="${e}" stroke-width="3"/><circle cx="40" cy="8" r="4" fill="#e3fcff"/>`:i==="tree"?t=`<ellipse cx="40" cy="70" rx="24" ry="5" fill="#000" opacity=".2"/><path d="M36 53h8v16h-8" fill="#9c7b5a"/><path d="m40 19 26 38H14Z" fill="${e}"/><path d="m40 7 21 34H19Z" fill="${e}"/><path d="m40 7 21 34H40Zm0 34v16h26Z" fill="#173c40" opacity=".25"/>`:i==="crystal"?t=`<ellipse cx="40" cy="70" rx="16" ry="4" fill="${e}" opacity=".12"/><path d="m40 10 20 22v18L40 68 20 50V32Z" fill="${e}"/><path d="M40 10 31 34l9 34 20-18V32Z" fill="#c2ffff" opacity=".35"/><path d="m20 32 11 2 9 34-20-18Z" fill="#126b87" opacity=".4"/><path d="m40 10 7 23-16 1Z" fill="#eaffff" opacity=".6"/>`:i==="slime"?t=`<ellipse cx="40" cy="64" rx="27" ry="6" fill="#000" opacity=".2"/><path d="M13 53c0-49 54-49 54 0 0 17-12 8-18 12-7 4-10-3-16-1-12 5-20 0-20-11Z" fill="${e}"/><ellipse cx="29" cy="44" rx="4" ry="6" fill="#24243f"/><ellipse cx="49" cy="44" rx="4" ry="6" fill="#24243f"/><path d="M35 54q5 5 10 0" fill="none" stroke="#493d65" stroke-width="2"/><ellipse cx="26" cy="28" rx="8" ry="4" fill="white" opacity=".3" transform="rotate(-30 26 28)"/>`:i==="portal"?t=`<ellipse cx="40" cy="69" rx="28" ry="6" fill="${e}" opacity=".2"/><path d="M17 65V33a23 23 0 0 1 46 0v32" fill="#302b56" stroke="${e}" stroke-width="7"/><path d="M26 64V34a14 14 0 0 1 28 0v30" fill="${e}" opacity=".25"/><path d="m40 28 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#c7c7ff"/>`:i==="rock"?t=`<path d="m13 55 8-26 25-8 20 23-7 18-32 4Z" fill="${e}"/><path d="m21 29 17 18 8-26Z" fill="white" opacity=".2"/><path d="m38 47 28-3-7 18-32 4Z" fill="black" opacity=".17"/>`:i==="crate"?t=`<path d="m15 25 25-12 25 12v34L40 71 15 59Z" fill="${e}"/><path d="m40 37 25-12v34L40 71Z" fill="black" opacity=".2"/><path d="m15 25 25 12 25-12M40 37v34M20 31l15 31m0-24L20 55m25-13 15 13m0-23L45 62" fill="none" stroke="#764a33" stroke-width="3"/>`:i==="car"?t=`<rect x="14" y="30" width="10" height="17" rx="4" fill="#172333"/><rect x="56" y="30" width="10" height="17" rx="4" fill="#172333"/><rect x="14" y="53" width="10" height="17" rx="4" fill="#172333"/><rect x="56" y="53" width="10" height="17" rx="4" fill="#172333"/><rect x="23" y="12" width="34" height="59" rx="12" fill="${e}"/><path d="M28 30h24l-3 18H31Z" fill="#b1f0ff"/><path d="M27 60h26M31 19h4m11 0h4" stroke="#fff0c6" stroke-width="5" stroke-linecap="round"/>`:i==="ship"?t=`<path d="m40 8 8 25 20 27-20-4-8 11-8-11-20 4 20-27Z" fill="${e}"/><path d="m40 8 8 25-8 18-8-18Z" fill="#d4f7ff"/><path d="m33 61 7 15 7-15" fill="#ffc27b"/><path d="m19 52 10-11m32 11L51 41" stroke="#476cbd" stroke-width="4"/>`:i==="flower"?t=`<path d="M40 38v30m0-10q-17 2-18-10 14-2 18 10m0-7q17-1 18-12-14 0-18 12" fill="#4dad86" stroke="#4dad86" stroke-width="3"/>${[0,60,120,180,240,300].map(n=>`<ellipse cx="40" cy="23" rx="8" ry="12" fill="${e}" transform="rotate(${n} 40 35)"/>`).join("")}<circle cx="40" cy="35" r="8" fill="#ffe3a1"/>`:i==="button"?t=`<rect x="9" y="25" width="62" height="34" rx="10" fill="${e}"/><path d="m35 35 12 7-12 7Z" fill="#173440"/>`:t=`<path d="m40 8 8 23 24 9-24 8-8 24-8-24-24-8 24-9Z" fill="${e}"/><circle cx="62" cy="16" r="4" fill="#fff"/><circle cx="15" cy="62" r="3" fill="${e}"/>`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" class="asset-art" aria-hidden="true">${t}</svg>`}function Sh(i){let{project:e,scene:t,brush:n,libraryShell:s,change:r,render:a,renderer:o,slider:l,bindSlider:c}=i,h=t.map;s("Build a world","Paint a floor. Stack a little adventure.",`<div class="build-modes">${[["floor","grid","Floor"],["block","box","Blocks"],["wall","layers","Wall"]].map(([f,g,x])=>`<button data-build-tool="${f}" class="${n.tool===f?"active":""}">${oe(g)}${x}</button>`).join("")}</div><div class="section-label" style="margin-top:19px">YOUR TILESET</div><div class="tile-palette">${Object.entries(Wn).map(([f,g])=>`<button data-tile="${f}" class="${n.tile===f?"active":""}" style="--tile:${g.color};--tile-light:${g.light};--tile-dark:${g.dark}"><span class="tile-sample tile-${f}"></span><span>${g.name}</span></button>`).join("")}</div>${n.tool!=="floor"?`<label class="field-label" for="build-shape">Shape</label><select id="build-shape">${Object.entries(xn).map(([f,g])=>`<option value="${f}" ${n.shape===f?"selected":""}>${g.name}</option>`).join("")}</select>${l("build-layer","Build layer",n.layer,0,15,1)}<p class="build-note">Layer 0 stacks onto a face. Higher layers draw at that height. Side view uses the place you tap.</p>`:`<button id="apply-floor" class="button wide-button">${oe("grid")}Use for whole floor</button>`}<div class="build-actions"><button id="build-erase" class="toggle" aria-pressed="${n.erase}"><i></i>Eraser</button><button id="finish-build" class="quiet-button">${oe("check")}Done</button></div><details class="build-map-settings"><summary>Map size & ground ${oe("down")}</summary><div class="transform-row" style="margin-top:15px"><label class="number-field"><span>W</span><input id="map-width" type="number" min="8" max="64" step="2" value="${h.width}" aria-label="Map width"></label><label class="number-field"><span>D</span><input id="map-depth" type="number" min="4" max="64" step="2" value="${h.depth}" aria-label="Map depth"></label></div><button id="resize-map" class="button wide-button">${oe("expand")}Resize map</button><button id="map-base" class="toggle" style="margin-top:16px" aria-pressed="${h.base}"><i></i>Solid ground underneath</button><p class="build-note">Turn ground off to make floating platforms and gaps. Shrinking keeps your existing work inside.</p></details><div class="build-meter"><span>${h.blocks.length.toLocaleString()} blocks</span><span>${h.width} \xD7 ${h.depth}</span><i style="--used:${h.blocks.length/ss*100}%"></i></div>`,`<div class="pill-note">${oe("hand")}Two fingers to pan. Pinch to zoom.</div>`);let u=document.querySelector("#library"),d=f=>u.querySelector(f);if(u.querySelectorAll("[data-build-tool]").forEach(f=>f.onclick=()=>{n.tool=f.dataset.buildTool,i.start(),a()}),u.querySelectorAll("[data-tile]").forEach(f=>f.onclick=()=>{n.tile=f.dataset.tile,i.start(),a()}),d("#build-shape")&&(d("#build-shape").onchange=f=>{n.shape=f.target.value,n.tool="block",i.start()}),d("#build-layer")){let f=d("#build-layer");f.oninput=()=>{n.layer=Number(f.value),d("#build-layer-value").textContent=f.value,i.start()}}d("#build-erase").onclick=()=>{n.erase=!n.erase,i.start(),a()},d("#finish-build").onclick=()=>{i.finish()},d("#apply-floor")&&(d("#apply-floor").onclick=()=>{r(()=>{h.tileset=n.tile,h.decorated=!1,h.tiles=h.tiles.filter(f=>f.tile==="void")},"terrain"),a()}),d("#resize-map").onclick=()=>{let f=Math.round(Number(d("#map-width").value)/2)*2,g=Math.round(Number(d("#map-depth").value)/2)*2;!Number.isFinite(f)||!Number.isFinite(g)||(r(()=>_h(t,Math.max(8,f),Math.max(4,g)),"terrain"),o.reset(),i.toast(`Your world is ${h.width} \xD7 ${h.depth}.`),a())},d("#map-base").onclick=()=>{r(()=>{h.base=!h.base,h.decorated=!1},"terrain"),a()}}function wh(i){let{project:e,showModal:t,change:n,slider:s,bindSlider:r}=i,a=e.camera;function o(){let l=a.preset,c=l==="first"||l==="third";t("A NEW WAY TO SEE YOUR WORLD",`<h2>Pick your point of view.</h2><p class="subtitle">Your game camera comes alive when you press Play.</p><div class="camera-presets">${Object.entries(js).map(([h,u])=>`<button data-camera-preset="${h}" class="${l===h?"active":""}"><span class="camera-illustration ${h}">${oe(h==="first"?"eye":h==="third"?"gamepad":h==="side"?"jump":h==="iso"?"box":"grid")}</span><strong>${u.name}</strong></button>`).join("")}</div><div class="camera-settings">${l==="flat"||l==="side"?`<div class="pill-note">${oe("hand")}${l==="side"?"Left and right to run. Space to jump. The camera follows you.":"A clear view from above. Switch on Follow for a larger world."}</div>${l==="flat"?`<button id="camera-follow" class="toggle" aria-pressed="${a.follow}" style="margin-top:16px"><i></i>Follow the player</button>`:""}`:`${s("camera-height",l==="first"?"Eye height":"Camera height",a.height,.5,l==="first"?3:12,.1)}${l!=="first"?s("camera-distance","Distance",a.distance,2,24,.5):""}${s("camera-angle","Look angle",a.angle,l==="first"?-60:0,l==="first"?60:75,1,"\xB0")}${s("camera-yaw","Starting direction",a.yaw,-180,180,5,"\xB0")}<div class="pill-note">${oe("waves")}Smooth following is on. ${c?"Drag the game view to look around. Q / R also turn.":"The camera gently follows your player."}</div>`}</div><div class="modal-actions"><button id="camera-done" class="button primary">${oe("check")}Looks good</button></div>`),document.querySelectorAll("[data-camera-preset]").forEach(h=>h.onclick=()=>{n(()=>{e.camera=yn(h.dataset.cameraPreset),e.mode=js[h.dataset.cameraPreset].mode},!1),a=e.camera,i.refresh(),o()}),document.querySelector("#camera-follow")&&(document.querySelector("#camera-follow").onclick=()=>{n(()=>a.follow=!a.follow,!1),o()});for(let h of["height","distance","angle","yaw"])document.querySelector("#camera-"+h)&&r("camera-"+h,u=>{a[h]=u},["angle","yaw"].includes(h)?"\xB0":"");document.querySelector("#camera-done").onclick=()=>{i.refresh(),document.querySelector("#modal").close()}}o()}var Li=class{constructor(e=32,t=e,n){this.width=e,this.height=t,this.data=n?new Uint8ClampedArray(n):new Uint8ClampedArray(e*t*4)}snapshot(){return new Uint8ClampedArray(this.data)}restore(e){this.data.set(e)}pixel(e,t,n,s=1){let r=Math.floor((s-1)/2);for(let a=0;a<s;a++)for(let o=0;o<s;o++){let l=Math.round(e)+o-r,c=Math.round(t)+a-r;l>=0&&c>=0&&l<this.width&&c<this.height&&this.data.set(n,(c*this.width+l)*4)}}line(e,t,n,s,r,a=1){e=Math.round(e),t=Math.round(t),n=Math.round(n),s=Math.round(s);let o=Math.abs(n-e),l=e<n?1:-1,c=-Math.abs(s-t),h=t<s?1:-1,u=o+c;for(;this.pixel(e,t,r,a),!(e===n&&t===s);){let d=2*u;d>=c&&(u+=c,e+=l),d<=o&&(u+=o,t+=h)}}rect(e,t,n,s,r,a=!0){let o=Math.min(e,n),l=Math.max(e,n),c=Math.min(t,s),h=Math.max(t,s);for(let u=c;u<=h;u++)for(let d=o;d<=l;d++)(a||d===o||d===l||u===c||u===h)&&this.pixel(d,u,r)}ellipse(e,t,n,s,r,a=!0){let o=(e+n)/2,l=(t+s)/2,c=Math.max(.5,Math.abs(n-e)/2),h=Math.max(.5,Math.abs(s-t)/2);for(let u=Math.min(t,s);u<=Math.max(t,s);u++)for(let d=Math.min(e,n);d<=Math.max(e,n);d++)((d-o)/c)**2+((u-l)/h)**2<=1.2&&(a||((d-o)/Math.max(.1,c-1))**2+((u-l)/Math.max(.1,h-1))**2>=1)&&this.pixel(d,u,r)}fill(e,t,n){if(e<0||t<0||e>=this.width||t>=this.height)return;let s=(t*this.width+e)*4,r=this.data.slice(s,s+4);if(r.every((l,c)=>l===n[c]))return;let a=[t*this.width+e],o=new Uint8Array(this.width*this.height);for(;a.length;){let l=a.pop();if(o[l])continue;o[l]=1;let c=l*4;if(!r.every((d,f)=>this.data[c+f]===d))continue;this.data.set(n,c);let h=l%this.width,u=Math.floor(l/this.width);h>0&&a.push(l-1),h<this.width-1&&a.push(l+1),u>0&&a.push(l-this.width),u<this.height-1&&a.push(l+this.width)}}};function Xr(i){return[parseInt(i.slice(1,3),16),parseInt(i.slice(3,5),16),parseInt(i.slice(5,7),16),255]}var $r;async function Eh(){return $r||new Promise((i,e)=>{let t=indexedDB.open("soulcode-studio",1);t.onupgradeneeded=()=>t.result.createObjectStore("projects",{keyPath:"id"}),t.onsuccess=()=>{$r=t.result,i($r)},t.onerror=()=>e(t.error)})}async function Eo(i){let e=await Eh();return new Promise((t,n)=>{let s=e.transaction("projects","readwrite");s.objectStore("projects").put(i),s.oncomplete=()=>{try{localStorage.setItem("soulcode-last",i.id)}catch{}t()},s.onerror=()=>n(s.error),s.onabort=()=>n(s.error||new Error("Saving was interrupted"))})}async function To(){let i=await Eh();return new Promise((e,t)=>{let n=i.transaction("projects").objectStore("projects").getAll();n.onsuccess=()=>e(n.result.sort((s,r)=>r.updated-s.updated)),n.onerror=()=>t(n.error)})}function Di(i,e){let t=URL.createObjectURL(i),n=document.createElement("a");n.href=t,n.download=e,n.click(),setTimeout(()=>URL.revokeObjectURL(t),3e4)}function Th({showModal:i,onSave:e,asset:t=null}){let n=new Li(32),s="pencil",r="#60ddf2",a=1,o=!0,l="#ffffff",c=!0,h=[],u=[],d=null,f=!1;i("A LITTLE PIXEL MAGIC",`<h2>Make a little somebody.</h2><p class="subtitle">Draw, erase, fill. Your next game asset starts here.</p><div class="sprite-toolbar"><div class="sprite-tools">${[["pencil","edit","Draw"],["eraser","close","Erase"],["fill","waves","Fill"],["line","route","Line"],["rect","box","Box"],["ellipse","sun","Circle"]].map(([T,y,v])=>`<button class="sprite-tool ${T==="pencil"?"active":""}" data-pixel-tool="${T}" title="${v}" aria-label="${v}">${oe(y)}<span>${v}</span></button>`).join("")}</div><div class="sprite-history"><button class="icon-button" id="pixel-undo" aria-label="Undo drawing">${oe("undo")}</button><button class="icon-button" id="pixel-redo" aria-label="Redo drawing">${oe("redo")}</button></div></div><div class="sprite-workspace"><div class="sprite-paper checkerboard"><canvas id="pixel-canvas" width="32" height="32" aria-label="Sprite drawing canvas" tabindex="0"></canvas></div><aside class="sprite-options"><div class="pixel-field pixel-color-field"><label class="field-label" for="pixel-color">Your color</label><input id="pixel-color" type="color" value="${r}" aria-label="Drawing color"><div class="pixel-swatches">${["#60ddf2","#ab8cff","#ffca76","#45b891","#ff8198","#ffffff","#172837","#000000"].map(T=>`<button data-pixel-color="${T}" style="--swatch:${T}" aria-label="Draw with ${T}"></button>`).join("")}</div></div><div class="pixel-field"><label class="field-label" for="pixel-brush">Brush size</label><input id="pixel-brush" type="range" min="1" max="8" value="1" aria-label="Brush size"></div><div class="pixel-field"><label class="field-label" for="pixel-size">Canvas size</label><select id="pixel-size">${[16,32,64,128].map(T=>`<option ${T===32?"selected":""} value="${T}">${T} \xD7 ${T}</option>`).join("")}</select></div><button id="pixel-filled" class="toggle" aria-pressed="true"><i></i>Filled shapes</button><button id="pixel-transparent" class="toggle" aria-pressed="true"><i></i>Transparent</button><div class="pixel-field"><label class="field-label" for="pixel-background">Background color</label><input id="pixel-background" type="color" value="#ffffff" aria-label="Background color"></div><button id="pixel-clear" class="quiet-button">${oe("trash")}Clear drawing</button></aside></div><label class="field-label" for="pixel-name">Give it a name</label><input id="pixel-name" class="text-input" value="${Ge(t?.name||"My little sprite")}" maxlength="60"><div class="modal-actions"><button id="pixel-download" class="button">${oe("download")}PNG</button><button id="pixel-save" class="button primary">${oe("plus")}${t?"Save sprite":"Add to my assets"}</button></div><p class="dialog-note">Checkerboard means see-through. In 3D, your sprite stands up and faces the camera.</p>`);let g=document.querySelector("#modal-content"),x=g.querySelector("#pixel-canvas"),m=x.getContext("2d"),p=g.querySelector(".sprite-paper"),w=T=>g.querySelector(T),M=()=>{x.width=n.width,x.height=n.height,m.putImageData(new ImageData(n.data,n.width,n.height),0,0),x.style.background=o?"transparent":l,p.classList.toggle("checkerboard",o),w("#pixel-undo").disabled=!h.length,w("#pixel-redo").disabled=!u.length},_=()=>{h.push({w:n.width,h:n.height,data:n.snapshot()}),h.length>32&&h.shift(),u=[]},D=(T,y)=>{if(!T.length)return;y.push({w:n.width,h:n.height,data:n.snapshot()});let v=T.pop();n=new Li(v.w,v.h,v.data),w("#pixel-size").value=String(v.w),M()},C=T=>{let y=x.getBoundingClientRect();return{x:Math.max(0,Math.min(n.width-1,Math.floor((T.clientX-y.left)/y.width*n.width))),y:Math.max(0,Math.min(n.height-1,Math.floor((T.clientY-y.top)/y.height*n.height)))}};g.querySelectorAll("[data-pixel-tool]").forEach(T=>T.onclick=()=>{s=T.dataset.pixelTool,g.querySelectorAll("[data-pixel-tool]").forEach(y=>{y.classList.toggle("active",y===T),y.setAttribute("aria-pressed",y===T)})}),g.querySelectorAll("[data-pixel-color]").forEach(T=>T.onclick=()=>{r=T.dataset.pixelColor,w("#pixel-color").value=r}),w("#pixel-color").oninput=T=>r=T.target.value,w("#pixel-brush").oninput=T=>a=Number(T.target.value),w("#pixel-filled").onclick=()=>{c=!c,w("#pixel-filled").setAttribute("aria-pressed",c)},w("#pixel-transparent").onclick=()=>{o=!o,w("#pixel-transparent").setAttribute("aria-pressed",o),M()},w("#pixel-background").oninput=T=>{l=T.target.value,o=!1,w("#pixel-transparent").setAttribute("aria-pressed",!1),M()},x.onpointerdown=T=>{T.preventDefault(),x.setPointerCapture(T.pointerId),_();let y=C(T);d={start:y,last:y,before:n.snapshot()},s==="fill"?(n.fill(y.x,y.y,Xr(r)),d=null):n.pixel(y.x,y.y,s==="eraser"?[0,0,0,0]:Xr(r),["pencil","eraser","line"].includes(s)?a:1),M()},x.onpointermove=T=>{if(!d)return;let y=C(T),v=Xr(r);s==="pencil"||s==="eraser"?n.line(d.last.x,d.last.y,y.x,y.y,s==="eraser"?[0,0,0,0]:v,a):(n.restore(d.before),s==="rect"?n.rect(d.start.x,d.start.y,y.x,y.y,v,c):s==="ellipse"?n.ellipse(d.start.x,d.start.y,y.x,y.y,v,c):n.line(d.start.x,d.start.y,y.x,y.y,v,a)),d.last=y,M()},x.onpointerup=x.onpointercancel=()=>{d=null},w("#pixel-undo").onclick=()=>D(h,u),w("#pixel-redo").onclick=()=>D(u,h),w("#pixel-clear").onclick=()=>{_(),n.data.fill(0),M()},w("#pixel-size").onchange=T=>{_();let y=Number(T.target.value),v=document.createElement("canvas");v.width=v.height=y;let R=v.getContext("2d");R.imageSmoothingEnabled=!1,R.drawImage(x,0,0,y,y),n=new Li(y,y,R.getImageData(0,0,y,y).data),M()};function I(){let T=document.createElement("canvas");T.width=n.width,T.height=n.height;let y=T.getContext("2d");return o||(y.fillStyle=l,y.fillRect(0,0,T.width,T.height)),y.drawImage(x,0,0),T}if(w("#pixel-download").onclick=()=>I().toBlob(T=>Di(T,(w("#pixel-name").value.trim()||"my-sprite").replace(/[^a-z0-9-]/gi,"-")+".png"),"image/png"),w("#pixel-save").onclick=()=>{e({id:t?.id,name:w("#pixel-name").value.trim()||"My little sprite",kind:"image",src:I().toDataURL("image/png"),width:n.width,height:n.height,pixelArt:!0})},t){g.setAttribute("aria-busy","true"),g.querySelectorAll("button,input,select").forEach(y=>y.disabled=!0),x.style.pointerEvents="none";let T=new Image;T.onload=()=>{if(!x.isConnected)return;g.removeAttribute("aria-busy"),g.querySelectorAll("button,input,select").forEach(O=>O.disabled=!1),x.style.pointerEvents="";let y=[16,32,64,128].find(O=>O>=Math.max(T.width,T.height))||128,v=document.createElement("canvas");v.width=v.height=y;let R=v.getContext("2d");R.imageSmoothingEnabled=!1;let z=Math.min(y/T.width,y/T.height);R.drawImage(T,(y-T.width*z)/2,(y-T.height*z)/2,T.width*z,T.height*z),n=new Li(y,y,R.getImageData(0,0,y,y).data),w("#pixel-size").value=String(y),M()},T.onerror=()=>{x.isConnected&&(g.removeAttribute("aria-busy"),w(".dialog-note").textContent="This image could not open. Close this window and choose another image.")},T.src=t.src}M()}var kc="170";var Jd=0,Ah=1,Kd=2;var Xu=1,Bc=2,Jn=3,_i=0,tn=1,en=2,vi=0,Ts=1,Ch=2,Rh=3,Ih=4,Qd=5,Hi=100,ef=101,tf=102,nf=103,sf=104,rf=200,af=201,of=202,lf=203,cl=204,hl=205,cf=206,hf=207,uf=208,df=209,ff=210,pf=211,mf=212,gf=213,xf=214,ul=0,dl=1,fl=2,Is=3,pl=4,ml=5,gl=6,xl=7,$u=0,vf=1,yf=2,yi=0,_f=1,bf=2,Mf=3,zc=4,Sf=5,wf=6,Ef=7;var qu=300,Ps=301,Ls=302,vl=303,yl=304,po=306,_l=1e3,Gi=1001,bl=1002,Xt=1003,Tf=1004;var qr=1005;var un=1006,Ao=1007;var Wi=1008;var ti=1009,Yu=1010,Zu=1011,fr=1012,Hc=1013,Xi=1014,Dn=1015,Lr=1016,Vc=1017,Gc=1018,Ds=1020,ju=35902,Ju=1021,Ku=1022,wn=1023,Qu=1024,ed=1025,As=1026,Us=1027,Wc=1028,Xc=1029,td=1030,$c=1031;var qc=1033,Ta=33776,Aa=33777,Ca=33778,Ra=33779,Ml=35840,Sl=35841,wl=35842,El=35843,Tl=36196,Al=37492,Cl=37496,Rl=37808,Il=37809,Pl=37810,Ll=37811,Dl=37812,Ul=37813,Nl=37814,Fl=37815,Ol=37816,kl=37817,Bl=37818,zl=37819,Hl=37820,Vl=37821,Ia=36492,Gl=36494,Wl=36495,nd=36283,Xl=36284,$l=36285,ql=36286;var Pa=2300,Yl=2301,Co=2302,Ph=2400,Lh=2401,Dh=2402;var Af=3200,Cf=3201;var id=0,Rf=1,gi="",Gt="srgb",Hs="srgb-linear",mo="linear",ut="srgb";var rs=7680;var Uh=519,If=512,Pf=513,Lf=514,sd=515,Df=516,Uf=517,Nf=518,Ff=519,Zl=35044;var Nh="300 es",Kn=2e3,La=2001,bi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ro=Math.PI/180,jl=180/Math.PI;function Qn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toLowerCase()}function Wt(i,e,t){return Math.max(e,Math.min(t,i))}function Of(i,e){return(i%e+e)%e}function Io(i,e,t){return(1-t)*i+t*e}function Ln(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function dt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var ae=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},qe=class i{constructor(e,t,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],x=s[0],m=s[3],p=s[6],w=s[1],M=s[4],_=s[7],D=s[2],C=s[5],I=s[8];return r[0]=a*x+o*w+l*D,r[3]=a*m+o*M+l*C,r[6]=a*p+o*_+l*I,r[1]=c*x+h*w+u*D,r[4]=c*m+h*M+u*C,r[7]=c*p+h*_+u*I,r[2]=d*x+f*w+g*D,r[5]=d*m+f*M+g*C,r[8]=d*p+f*_+g*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=u*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Po.makeScale(e,t)),this}rotate(e){return this.premultiply(Po.makeRotation(-e)),this}translate(e,t){return this.premultiply(Po.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Po=new qe;function rd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function kf(){let i=pr("canvas");return i.style.display="block",i}var Fh={};function or(i){i in Fh||(Fh[i]=!0,console.warn(i))}function Bf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function zf(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Hf(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var tt={enabled:!0,workingColorSpace:Hs,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ut&&(i.r=ei(i.r),i.g=ei(i.g),i.b=ei(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ut&&(i.r=Cs(i.r),i.g=Cs(i.g),i.b=Cs(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===gi?mo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Cs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Oh=[.64,.33,.3,.6,.15,.06],kh=[.2126,.7152,.0722],Bh=[.3127,.329],zh=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hh=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);tt.define({[Hs]:{primaries:Oh,whitePoint:Bh,transfer:mo,toXYZ:zh,fromXYZ:Hh,luminanceCoefficients:kh,workingColorSpaceConfig:{unpackColorSpace:Gt},outputColorSpaceConfig:{drawingBufferColorSpace:Gt}},[Gt]:{primaries:Oh,whitePoint:Bh,transfer:ut,toXYZ:zh,fromXYZ:Hh,luminanceCoefficients:kh,outputColorSpaceConfig:{drawingBufferColorSpace:Gt}}});var as,Jl=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{as===void 0&&(as=pr("canvas")),as.width=e.width,as.height=e.height;let n=as.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=as}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=pr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ei(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ei(t[n]/255)*255):t[n]=ei(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Vf=0,Da=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=Qn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Lo(s[a].image)):r.push(Lo(s[a]))}else r=Lo(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Lo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Jl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Gf=0,jt=class i extends bi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Gi,s=Gi,r=un,a=Wi,o=wn,l=ti,c=i.DEFAULT_ANISOTROPY,h=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=Qn(),this.name="",this.source=new Da(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==qu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _l:e.x=e.x-Math.floor(e.x);break;case Gi:e.x=e.x<0?0:1;break;case bl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _l:e.y=e.y-Math.floor(e.y);break;case Gi:e.y=e.y<0?0:1;break;case bl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};jt.DEFAULT_IMAGE=null;jt.DEFAULT_MAPPING=qu;jt.DEFAULT_ANISOTROPY=1;var wt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,_=(f+1)/2,D=(p+1)/2,C=(h+d)/4,I=(u+x)/4,T=(g+m)/4;return M>_&&M>D?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=C/n,r=I/n):_>D?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=C/s,r=T/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=I/r,s=T/r),this.set(n,s,r,t),this}let w=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(w)<.001&&(w=1),this.x=(m-g)/w,this.y=(u-x)/w,this.z=(d-h)/w,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Kl=class extends bi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new wt(0,0,e,t),this.scissorTest=!1,this.viewport=new wt(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new jt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Da(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ni=class extends Kl{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ua=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ql=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Mi=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],g=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=x;return}if(u!==x||l!==d||c!==f||h!==g){let m=1-o,p=l*d+c*f+h*g+u*x,w=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){let D=Math.sqrt(M),C=Math.atan2(D,p*w);m=Math.sin(m*C)/D,o=Math.sin(o*C)/D}let _=o*w;if(l=l*m+d*_,c=c*m+f*_,h=h*m+g*_,u=u*m+x*_,m===1-o){let D=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=D,c*=D,h*=D,u*=D}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Wt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Do.copy(this).projectOnVector(e),this.sub(Do)}reflect(e){return this.sub(Do.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Do=new P,Vh=new Mi,dn=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(bn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(bn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=bn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,bn):bn.fromBufferAttribute(r,a),bn.applyMatrix4(e.matrixWorld),this.expandByPoint(bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Yr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Yr.copy(n.boundingBox)),Yr.applyMatrix4(e.matrixWorld),this.union(Yr)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,bn),bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Js),Zr.subVectors(this.max,Js),os.subVectors(e.a,Js),ls.subVectors(e.b,Js),cs.subVectors(e.c,Js),hi.subVectors(ls,os),ui.subVectors(cs,ls),Ui.subVectors(os,cs);let t=[0,-hi.z,hi.y,0,-ui.z,ui.y,0,-Ui.z,Ui.y,hi.z,0,-hi.x,ui.z,0,-ui.x,Ui.z,0,-Ui.x,-hi.y,hi.x,0,-ui.y,ui.x,0,-Ui.y,Ui.x,0];return!Uo(t,os,ls,cs,Zr)||(t=[1,0,0,0,1,0,0,0,1],!Uo(t,os,ls,cs,Zr))?!1:(jr.crossVectors(hi,ui),t=[jr.x,jr.y,jr.z],Uo(t,os,ls,cs,Zr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},$n=[new P,new P,new P,new P,new P,new P,new P,new P],bn=new P,Yr=new dn,os=new P,ls=new P,cs=new P,hi=new P,ui=new P,Ui=new P,Js=new P,Zr=new P,jr=new P,Ni=new P;function Uo(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ni.fromArray(i,r);let o=s.x*Math.abs(Ni.x)+s.y*Math.abs(Ni.y)+s.z*Math.abs(Ni.z),l=e.dot(Ni),c=t.dot(Ni),h=n.dot(Ni);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Wf=new dn,Ks=new P,No=new P,ii=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Wf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ks.subVectors(e,this.center);let t=Ks.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ks,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(No.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ks.copy(e.center).add(No)),this.expandByPoint(Ks.copy(e.center).sub(No))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},qn=new P,Fo=new P,Jr=new P,di=new P,Oo=new P,Kr=new P,ko=new P,Ns=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=qn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qn.copy(this.origin).addScaledVector(this.direction,t),qn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Fo.copy(e).add(t).multiplyScalar(.5),Jr.copy(t).sub(e).normalize(),di.copy(this.origin).sub(Fo);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Jr),o=di.dot(this.direction),l=-di.dot(Jr),c=di.lengthSq(),h=Math.abs(1-a*a),u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Fo).addScaledVector(Jr,d),f}intersectSphere(e,t){qn.subVectors(e.center,this.origin);let n=qn.dot(this.direction),s=qn.dot(qn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,qn)!==null}intersectTriangle(e,t,n,s,r){Oo.subVectors(t,e),Kr.subVectors(n,e),ko.crossVectors(Oo,Kr);let a=this.direction.dot(ko),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;di.subVectors(this.origin,e);let l=o*this.direction.dot(Kr.crossVectors(di,Kr));if(l<0)return null;let c=o*this.direction.dot(Oo.cross(di));if(c<0||l+c>a)return null;let h=-o*di.dot(ko);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},it=class i{constructor(e,t,n,s,r,a,o,l,c,h,u,d,f,g,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,x,m)}set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,x,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/hs.setFromMatrixColumn(e,0).length(),r=1/hs.setFromMatrixColumn(e,1).length(),a=1/hs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,g=o*h,x=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,g=c*h,x=c*u;t[0]=d+x*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,g=c*h,x=c*u;t[0]=d-x*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,f=a*u,g=o*h,x=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,g=o*l,x=o*c;t[0]=l*h,t[4]=x-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*l,f=a*c,g=o*l,x=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xf,e,$f)}lookAt(e,t,n){let s=this.elements;return an.subVectors(e,t),an.lengthSq()===0&&(an.z=1),an.normalize(),fi.crossVectors(n,an),fi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),fi.crossVectors(n,an)),fi.normalize(),Qr.crossVectors(an,fi),s[0]=fi.x,s[4]=Qr.x,s[8]=an.x,s[1]=fi.y,s[5]=Qr.y,s[9]=an.y,s[2]=fi.z,s[6]=Qr.z,s[10]=an.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],w=n[3],M=n[7],_=n[11],D=n[15],C=s[0],I=s[4],T=s[8],y=s[12],v=s[1],R=s[5],z=s[9],O=s[13],V=s[2],Z=s[6],G=s[10],ne=s[14],W=s[3],he=s[7],xe=s[11],we=s[15];return r[0]=a*C+o*v+l*V+c*W,r[4]=a*I+o*R+l*Z+c*he,r[8]=a*T+o*z+l*G+c*xe,r[12]=a*y+o*O+l*ne+c*we,r[1]=h*C+u*v+d*V+f*W,r[5]=h*I+u*R+d*Z+f*he,r[9]=h*T+u*z+d*G+f*xe,r[13]=h*y+u*O+d*ne+f*we,r[2]=g*C+x*v+m*V+p*W,r[6]=g*I+x*R+m*Z+p*he,r[10]=g*T+x*z+m*G+p*xe,r[14]=g*y+x*O+m*ne+p*we,r[3]=w*C+M*v+_*V+D*W,r[7]=w*I+M*R+_*Z+D*he,r[11]=w*T+M*z+_*G+D*xe,r[15]=w*y+M*O+_*ne+D*we,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+r*l*u-s*c*u-r*o*d+n*c*d+s*o*f-n*l*f)+x*(+t*l*f-t*c*d+r*a*d-s*a*f+s*c*h-r*l*h)+m*(+t*c*u-t*o*f-r*a*u+n*a*f+r*o*h-n*c*h)+p*(-s*o*h-t*l*u+t*o*d+s*a*u-n*a*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],w=u*m*c-x*d*c+x*l*f-o*m*f-u*l*p+o*d*p,M=g*d*c-h*m*c-g*l*f+a*m*f+h*l*p-a*d*p,_=h*x*c-g*u*c+g*o*f-a*x*f-h*o*p+a*u*p,D=g*u*l-h*x*l-g*o*d+a*x*d+h*o*m-a*u*m,C=t*w+n*M+s*_+r*D;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/C;return e[0]=w*I,e[1]=(x*d*r-u*m*r-x*s*f+n*m*f+u*s*p-n*d*p)*I,e[2]=(o*m*r-x*l*r+x*s*c-n*m*c-o*s*p+n*l*p)*I,e[3]=(u*l*r-o*d*r-u*s*c+n*d*c+o*s*f-n*l*f)*I,e[4]=M*I,e[5]=(h*m*r-g*d*r+g*s*f-t*m*f-h*s*p+t*d*p)*I,e[6]=(g*l*r-a*m*r-g*s*c+t*m*c+a*s*p-t*l*p)*I,e[7]=(a*d*r-h*l*r+h*s*c-t*d*c-a*s*f+t*l*f)*I,e[8]=_*I,e[9]=(g*u*r-h*x*r-g*n*f+t*x*f+h*n*p-t*u*p)*I,e[10]=(a*x*r-g*o*r+g*n*c-t*x*c-a*n*p+t*o*p)*I,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*f-t*o*f)*I,e[12]=D*I,e[13]=(h*x*s-g*u*s+g*n*d-t*x*d-h*n*m+t*u*m)*I,e[14]=(g*o*s-a*x*s-g*n*l+t*x*l+a*n*m-t*o*m)*I,e[15]=(a*u*s-h*o*s+h*n*l-t*u*l-a*n*d+t*o*d)*I,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,x=a*h,m=a*u,p=o*u,w=l*c,M=l*h,_=l*u,D=n.x,C=n.y,I=n.z;return s[0]=(1-(x+p))*D,s[1]=(f+_)*D,s[2]=(g-M)*D,s[3]=0,s[4]=(f-_)*C,s[5]=(1-(d+p))*C,s[6]=(m+w)*C,s[7]=0,s[8]=(g+M)*I,s[9]=(m-w)*I,s[10]=(1-(d+x))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=hs.set(s[0],s[1],s[2]).length(),a=hs.set(s[4],s[5],s[6]).length(),o=hs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Mn.copy(this);let c=1/r,h=1/a,u=1/o;return Mn.elements[0]*=c,Mn.elements[1]*=c,Mn.elements[2]*=c,Mn.elements[4]*=h,Mn.elements[5]*=h,Mn.elements[6]*=h,Mn.elements[8]*=u,Mn.elements[9]*=u,Mn.elements[10]*=u,t.setFromRotationMatrix(Mn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Kn){let l=this.elements,c=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s),f,g;if(o===Kn)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===La)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Kn){let l=this.elements,c=1/(t-e),h=1/(n-s),u=1/(a-r),d=(t+e)*c,f=(n+s)*h,g,x;if(o===Kn)g=(a+r)*u,x=-2*u;else if(o===La)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},hs=new P,Mn=new it,Xf=new P(0,0,0),$f=new P(1,1,1),fi=new P,Qr=new P,an=new P,Gh=new it,Wh=new Mi,Un=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Wt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Gh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wh.setFromEuler(this),this.setFromQuaternion(Wh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Un.DEFAULT_ORDER="XYZ";var mr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},qf=0,Xh=new P,us=new Mi,Yn=new it,ea=new P,Qs=new P,Yf=new P,Zf=new Mi,$h=new P(1,0,0),qh=new P(0,1,0),Yh=new P(0,0,1),Zh={type:"added"},jf={type:"removed"},ds={type:"childadded",child:null},Bo={type:"childremoved",child:null},Nt=class i extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=Qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new Un,n=new Mi,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new it},normalMatrix:{value:new qe}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new mr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.multiply(us),this}rotateOnWorldAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.premultiply(us),this}rotateX(e){return this.rotateOnAxis($h,e)}rotateY(e){return this.rotateOnAxis(qh,e)}rotateZ(e){return this.rotateOnAxis(Yh,e)}translateOnAxis(e,t){return Xh.copy(e).applyQuaternion(this.quaternion),this.position.add(Xh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($h,e)}translateY(e){return this.translateOnAxis(qh,e)}translateZ(e){return this.translateOnAxis(Yh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ea.copy(e):ea.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yn.lookAt(Qs,ea,this.up):Yn.lookAt(ea,Qs,this.up),this.quaternion.setFromRotationMatrix(Yn),s&&(Yn.extractRotation(s.matrixWorld),us.setFromRotationMatrix(Yn),this.quaternion.premultiply(us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Zh),ds.child=e,this.dispatchEvent(ds),ds.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jf),Bo.child=e,this.dispatchEvent(Bo),Bo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Zh),ds.child=e,this.dispatchEvent(ds),ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,e,Yf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,Zf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Nt.DEFAULT_UP=new P(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Sn=new P,Zn=new P,zo=new P,jn=new P,fs=new P,ps=new P,jh=new P,Ho=new P,Vo=new P,Go=new P,Wo=new wt,Xo=new wt,$o=new wt,xi=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Sn.subVectors(e,t),s.cross(Sn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Sn.subVectors(s,t),Zn.subVectors(n,t),zo.subVectors(e,t);let a=Sn.dot(Sn),o=Sn.dot(Zn),l=Sn.dot(zo),c=Zn.dot(Zn),h=Zn.dot(zo),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,jn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,jn.x),l.addScaledVector(a,jn.y),l.addScaledVector(o,jn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Wo.setScalar(0),Xo.setScalar(0),$o.setScalar(0),Wo.fromBufferAttribute(e,t),Xo.fromBufferAttribute(e,n),$o.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Wo,r.x),a.addScaledVector(Xo,r.y),a.addScaledVector($o,r.z),a}static isFrontFacing(e,t,n,s){return Sn.subVectors(n,t),Zn.subVectors(e,t),Sn.cross(Zn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Sn.subVectors(this.c,this.b),Zn.subVectors(this.a,this.b),Sn.cross(Zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;fs.subVectors(s,n),ps.subVectors(r,n),Ho.subVectors(e,n);let l=fs.dot(Ho),c=ps.dot(Ho);if(l<=0&&c<=0)return t.copy(n);Vo.subVectors(e,s);let h=fs.dot(Vo),u=ps.dot(Vo);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(fs,a);Go.subVectors(e,r);let f=fs.dot(Go),g=ps.dot(Go);if(g>=0&&f<=g)return t.copy(r);let x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ps,o);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return jh.subVectors(r,s),o=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(jh,o);let p=1/(m+x+d);return a=x*p,o=d*p,t.copy(n).addScaledVector(fs,a).addScaledVector(ps,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ad={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pi={h:0,s:0,l:0},ta={h:0,s:0,l:0};function qo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Je=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=Of(e,1),t=Wt(t,0,1),n=Wt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=qo(a,r,e+1/3),this.g=qo(a,r,e),this.b=qo(a,r,e-1/3)}return tt.toWorkingColorSpace(this,s),this}setStyle(e,t=Gt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gt){let n=ad[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ei(e.r),this.g=ei(e.g),this.b=ei(e.b),this}copyLinearToSRGB(e){return this.r=Cs(e.r),this.g=Cs(e.g),this.b=Cs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gt){return tt.fromWorkingColorSpace(Vt.copy(this),e),Math.round(Wt(Vt.r*255,0,255))*65536+Math.round(Wt(Vt.g*255,0,255))*256+Math.round(Wt(Vt.b*255,0,255))}getHexString(e=Gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(Vt.copy(this),t);let n=Vt.r,s=Vt.g,r=Vt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=Gt){tt.fromWorkingColorSpace(Vt.copy(this),e);let t=Vt.r,n=Vt.g,s=Vt.b;return e!==Gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(pi),this.setHSL(pi.h+e,pi.s+t,pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(pi),e.getHSL(ta);let n=Io(pi.h,ta.h,t),s=Io(pi.s,ta.s,t),r=Io(pi.l,ta.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Vt=new Je;Je.NAMES=ad;var Jf=0,Nn=class extends bi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=Qn(),this.name="",this.blending=Ts,this.side=_i,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=cl,this.blendDst=hl,this.blendEquation=Hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Je(0,0,0),this.blendAlpha=0,this.depthFunc=Is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ts&&(n.blending=this.blending),this.side!==_i&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==cl&&(n.blendSrc=this.blendSrc),this.blendDst!==hl&&(n.blendDst=this.blendDst),this.blendEquation!==Hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Is&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Fs=class extends Nn{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=$u,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Rt=new P,na=new ae,kt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Zl,this.updateRanges=[],this.gpuType=Dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)na.fromBufferAttribute(this,t),na.applyMatrix3(e),this.setXY(t,na.x,na.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ln(t,this.array)),t}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ln(t,this.array)),t}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ln(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ln(t,this.array)),t}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),s=dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),s=dt(s,this.array),r=dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Zl&&(e.usage=this.usage),e}};var Na=class extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Fa=class extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ft=class extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Kf=0,cn=new it,Yo=new Nt,ms=new P,on=new dn,er=new dn,Ut=new P,It=class i extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=Qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(rd(e)?Fa:Na)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return cn.makeRotationFromQuaternion(e),this.applyMatrix4(cn),this}rotateX(e){return cn.makeRotationX(e),this.applyMatrix4(cn),this}rotateY(e){return cn.makeRotationY(e),this.applyMatrix4(cn),this}rotateZ(e){return cn.makeRotationZ(e),this.applyMatrix4(cn),this}translate(e,t,n){return cn.makeTranslation(e,t,n),this.applyMatrix4(cn),this}scale(e,t,n){return cn.makeScale(e,t,n),this.applyMatrix4(cn),this}lookAt(e){return Yo.lookAt(e),Yo.updateMatrix(),this.applyMatrix4(Yo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ms).negate(),this.translate(ms.x,ms.y,ms.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ft(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(on.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];er.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(on.min,er.min),on.expandByPoint(Ut),Ut.addVectors(on.max,er.max),on.expandByPoint(Ut)):(on.expandByPoint(er.min),on.expandByPoint(er.max))}on.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Ut.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ut));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ut.fromBufferAttribute(o,c),l&&(ms.fromBufferAttribute(e,c),Ut.add(ms)),s=Math.max(s,n.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let T=0;T<n.count;T++)o[T]=new P,l[T]=new P;let c=new P,h=new P,u=new P,d=new ae,f=new ae,g=new ae,x=new P,m=new P;function p(T,y,v){c.fromBufferAttribute(n,T),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,T),f.fromBufferAttribute(r,y),g.fromBufferAttribute(r,v),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(R),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(R),o[T].add(x),o[y].add(x),o[v].add(x),l[T].add(m),l[y].add(m),l[v].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let T=0,y=w.length;T<y;++T){let v=w[T],R=v.start,z=v.count;for(let O=R,V=R+z;O<V;O+=3)p(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let M=new P,_=new P,D=new P,C=new P;function I(T){D.fromBufferAttribute(s,T),C.copy(D);let y=o[T];M.copy(y),M.sub(D.multiplyScalar(D.dot(y))).normalize(),_.crossVectors(C,y);let R=_.dot(l[T])<0?-1:1;a.setXYZW(T,M.x,M.y,M.z,R)}for(let T=0,y=w.length;T<y;++T){let v=w[T],R=v.start,z=v.count;for(let O=R,V=R+z;O<V;O+=3)I(e.getX(O+0)),I(e.getX(O+1)),I(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new kt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Jh=new it,Fi=new Ns,ia=new ii,Kh=new P,sa=new P,ra=new P,aa=new P,Zo=new P,oa=new P,Qh=new P,la=new P,Ot=class extends Nt{constructor(e=new It,t=new Fs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){oa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(Zo.fromBufferAttribute(u,e),a?oa.addScaledVector(Zo,h):oa.addScaledVector(Zo.sub(t),h))}t.add(oa)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ia.copy(n.boundingSphere),ia.applyMatrix4(r),Fi.copy(e.ray).recast(e.near),!(ia.containsPoint(Fi.origin)===!1&&(Fi.intersectSphere(ia,Kh)===null||Fi.origin.distanceToSquared(Kh)>(e.far-e.near)**2))&&(Jh.copy(r).invert(),Fi.copy(e.ray).applyMatrix4(Jh),!(n.boundingBox!==null&&Fi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Fi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=a[m.materialIndex],w=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=w,D=M;_<D;_+=3){let C=o.getX(_),I=o.getX(_+1),T=o.getX(_+2);s=ca(this,p,e,n,c,h,u,C,I,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let w=o.getX(m),M=o.getX(m+1),_=o.getX(m+2);s=ca(this,a,e,n,c,h,u,w,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=a[m.materialIndex],w=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=w,D=M;_<D;_+=3){let C=_,I=_+1,T=_+2;s=ca(this,p,e,n,c,h,u,C,I,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let w=m,M=m+1,_=m+2;s=ca(this,a,e,n,c,h,u,w,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Qf(i,e,t,n,s,r,a,o){let l;if(e.side===tn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===_i,o),l===null)return null;la.copy(o),la.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(la);return c<t.near||c>t.far?null:{distance:c,point:la.clone(),object:i}}function ca(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,sa),i.getVertexPosition(l,ra),i.getVertexPosition(c,aa);let h=Qf(i,e,t,n,sa,ra,aa,Qh);if(h){let u=new P;xi.getBarycoord(Qh,sa,ra,aa,u),s&&(h.uv=xi.getInterpolatedAttribute(s,o,l,c,u,new ae)),r&&(h.uv1=xi.getInterpolatedAttribute(r,o,l,c,u,new ae)),a&&(h.normal=xi.getInterpolatedAttribute(a,o,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new P,materialIndex:0};xi.getNormal(sa,ra,aa,d.normal),h.face=d,h.barycoord=u}return h}var Si=class i extends It{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(h,3)),this.setAttribute("uv",new ft(u,2));function g(x,m,p,w,M,_,D,C,I,T,y){let v=_/I,R=D/T,z=_/2,O=D/2,V=C/2,Z=I+1,G=T+1,ne=0,W=0,he=new P;for(let xe=0;xe<G;xe++){let we=xe*R-O;for(let We=0;We<Z;We++){let st=We*v-z;he[x]=st*w,he[m]=we*M,he[p]=V,c.push(he.x,he.y,he.z),he[x]=0,he[m]=0,he[p]=C>0?1:-1,h.push(he.x,he.y,he.z),u.push(We/I),u.push(1-xe/T),ne+=1}}for(let xe=0;xe<T;xe++)for(let we=0;we<I;we++){let We=d+we+Z*xe,st=d+we+Z*(xe+1),Y=d+(we+1)+Z*(xe+1),se=d+(we+1)+Z*xe;l.push(We,st,se),l.push(st,Y,se),W+=6}o.addGroup(f,W,y),f+=W,d+=ne}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Os(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Yt(i){let e={};for(let t=0;t<i.length;t++){let n=Os(i[t]);for(let s in n)e[s]=n[s]}return e}function ep(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function od(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var tp={clone:Os,merge:Yt},np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Fn=class extends Nn{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=np,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=ep(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Oa=class extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=Kn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},mi=new P,eu=new ae,tu=new ae,Zt=class extends Oa{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=jl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ro*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return jl*2*Math.atan(Math.tan(Ro*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(mi.x,mi.y).multiplyScalar(-e/mi.z),mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(mi.x,mi.y).multiplyScalar(-e/mi.z)}getViewSize(e,t){return this.getViewBounds(e,eu,tu),t.subVectors(tu,eu)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ro*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},gs=-90,xs=1,ec=class extends Nt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Zt(gs,xs,e,t);s.layers=this.layers,this.add(s);let r=new Zt(gs,xs,e,t);r.layers=this.layers,this.add(r);let a=new Zt(gs,xs,e,t);a.layers=this.layers,this.add(a);let o=new Zt(gs,xs,e,t);o.layers=this.layers,this.add(o);let l=new Zt(gs,xs,e,t);l.layers=this.layers,this.add(l);let c=new Zt(gs,xs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===La)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},ka=class extends jt{constructor(e,t,n,s,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ps,super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},tc=class extends ni{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ka(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:un}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Si(5,5,5),r=new Fn({name:"CubemapFromEquirect",uniforms:Os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:tn,blending:vi});r.uniforms.tEquirect.value=t;let a=new Ot(s,r),o=t.minFilter;return t.minFilter===Wi&&(t.minFilter=un),new ec(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},jo=new P,sp=new P,rp=new qe,hn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=jo.subVectors(n,t).cross(sp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(jo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||rp.getNormalMatrix(e),s=this.coplanarPoint(jo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Oi=new ii,ha=new P,gr=class{constructor(e=new hn,t=new hn,n=new hn,s=new hn,r=new hn,a=new hn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Kn){let n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],x=s[10],m=s[11],p=s[12],w=s[13],M=s[14],_=s[15];if(n[0].setComponents(l-r,d-c,m-f,_-p).normalize(),n[1].setComponents(l+r,d+c,m+f,_+p).normalize(),n[2].setComponents(l+a,d+h,m+g,_+w).normalize(),n[3].setComponents(l-a,d-h,m-g,_-w).normalize(),n[4].setComponents(l-o,d-u,m-x,_-M).normalize(),t===Kn)n[5].setComponents(l+o,d+u,m+x,_+M).normalize();else if(t===La)n[5].setComponents(o,u,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Oi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Oi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Oi)}intersectsSprite(e){return Oi.center.set(0,0,0),Oi.radius=.7071067811865476,Oi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Oi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ha.x=s.normal.x>0?e.max.x:e.min.x,ha.y=s.normal.y>0?e.max.y:e.min.y,ha.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ha)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ld(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ap(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],x=u[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let x=u[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var $i=class i extends It{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let w=p*d-a;for(let M=0;M<c;M++){let _=M*u-r;g.push(_,-w,0),x.push(0,0,1),m.push(M/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let w=0;w<o;w++){let M=w+c*p,_=w+c*(p+1),D=w+1+c*(p+1),C=w+1+c*p;f.push(M,_,C),f.push(_,D,C)}this.setIndex(f),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(x,3)),this.setAttribute("uv",new ft(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},op=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,cp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,up=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,pp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,gp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_p=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Tp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ap=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Ip=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Pp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Lp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Up=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Fp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Op="gl_FragColor = linearToOutputTexel( gl_FragColor );",kp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Wp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$p=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Zp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Qp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,em=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,im=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,am=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,om=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,um=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ym=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_m=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,bm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Sm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Em=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Im=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Um=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Fm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,km=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$m=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ym=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,eg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ag=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,og=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,fg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,pg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,mg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_g=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Eg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ag=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Cg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ig=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Pg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ug=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ng=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Og=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,kg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Bg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:op,alphahash_pars_fragment:lp,alphamap_fragment:cp,alphamap_pars_fragment:hp,alphatest_fragment:up,alphatest_pars_fragment:dp,aomap_fragment:fp,aomap_pars_fragment:pp,batching_pars_vertex:mp,batching_vertex:gp,begin_vertex:xp,beginnormal_vertex:vp,bsdfs:yp,iridescence_fragment:_p,bumpmap_pars_fragment:bp,clipping_planes_fragment:Mp,clipping_planes_pars_fragment:Sp,clipping_planes_pars_vertex:wp,clipping_planes_vertex:Ep,color_fragment:Tp,color_pars_fragment:Ap,color_pars_vertex:Cp,color_vertex:Rp,common:Ip,cube_uv_reflection_fragment:Pp,defaultnormal_vertex:Lp,displacementmap_pars_vertex:Dp,displacementmap_vertex:Up,emissivemap_fragment:Np,emissivemap_pars_fragment:Fp,colorspace_fragment:Op,colorspace_pars_fragment:kp,envmap_fragment:Bp,envmap_common_pars_fragment:zp,envmap_pars_fragment:Hp,envmap_pars_vertex:Vp,envmap_physical_pars_fragment:Qp,envmap_vertex:Gp,fog_vertex:Wp,fog_pars_vertex:Xp,fog_fragment:$p,fog_pars_fragment:qp,gradientmap_pars_fragment:Yp,lightmap_pars_fragment:Zp,lights_lambert_fragment:jp,lights_lambert_pars_fragment:Jp,lights_pars_begin:Kp,lights_toon_fragment:em,lights_toon_pars_fragment:tm,lights_phong_fragment:nm,lights_phong_pars_fragment:im,lights_physical_fragment:sm,lights_physical_pars_fragment:rm,lights_fragment_begin:am,lights_fragment_maps:om,lights_fragment_end:lm,logdepthbuf_fragment:cm,logdepthbuf_pars_fragment:hm,logdepthbuf_pars_vertex:um,logdepthbuf_vertex:dm,map_fragment:fm,map_pars_fragment:pm,map_particle_fragment:mm,map_particle_pars_fragment:gm,metalnessmap_fragment:xm,metalnessmap_pars_fragment:vm,morphinstance_vertex:ym,morphcolor_vertex:_m,morphnormal_vertex:bm,morphtarget_pars_vertex:Mm,morphtarget_vertex:Sm,normal_fragment_begin:wm,normal_fragment_maps:Em,normal_pars_fragment:Tm,normal_pars_vertex:Am,normal_vertex:Cm,normalmap_pars_fragment:Rm,clearcoat_normal_fragment_begin:Im,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Lm,iridescence_pars_fragment:Dm,opaque_fragment:Um,packing:Nm,premultiplied_alpha_fragment:Fm,project_vertex:Om,dithering_fragment:km,dithering_pars_fragment:Bm,roughnessmap_fragment:zm,roughnessmap_pars_fragment:Hm,shadowmap_pars_fragment:Vm,shadowmap_pars_vertex:Gm,shadowmap_vertex:Wm,shadowmask_pars_fragment:Xm,skinbase_vertex:$m,skinning_pars_vertex:qm,skinning_vertex:Ym,skinnormal_vertex:Zm,specularmap_fragment:jm,specularmap_pars_fragment:Jm,tonemapping_fragment:Km,tonemapping_pars_fragment:Qm,transmission_fragment:eg,transmission_pars_fragment:tg,uv_pars_fragment:ng,uv_pars_vertex:ig,uv_vertex:sg,worldpos_vertex:rg,background_vert:ag,background_frag:og,backgroundCube_vert:lg,backgroundCube_frag:cg,cube_vert:hg,cube_frag:ug,depth_vert:dg,depth_frag:fg,distanceRGBA_vert:pg,distanceRGBA_frag:mg,equirect_vert:gg,equirect_frag:xg,linedashed_vert:vg,linedashed_frag:yg,meshbasic_vert:_g,meshbasic_frag:bg,meshlambert_vert:Mg,meshlambert_frag:Sg,meshmatcap_vert:wg,meshmatcap_frag:Eg,meshnormal_vert:Tg,meshnormal_frag:Ag,meshphong_vert:Cg,meshphong_frag:Rg,meshphysical_vert:Ig,meshphysical_frag:Pg,meshtoon_vert:Lg,meshtoon_frag:Dg,points_vert:Ug,points_frag:Ng,shadow_vert:Fg,shadow_frag:Og,sprite_vert:kg,sprite_frag:Bg},ue={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Pn={basic:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Je(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Yt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Yt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Je(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Yt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Yt([ue.points,ue.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Yt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Yt([ue.common,ue.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Yt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Yt([ue.sprite,ue.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:Yt([ue.common,ue.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:Yt([ue.lights,ue.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};Pn.physical={uniforms:Yt([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};var ua={r:0,b:0,g:0},ki=new Un,zg=new it;function Hg(i,e,t,n,s,r,a){let o=new Je(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(w){let M=w.isScene===!0?w.background:null;return M&&M.isTexture&&(M=(w.backgroundBlurriness>0?t:e).get(M)),M}function x(w){let M=!1,_=g(w);_===null?p(o,l):_&&_.isColor&&(p(_,1),M=!0);let D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(w,M){let _=g(M);_&&(_.isCubeTexture||_.mapping===po)?(h===void 0&&(h=new Ot(new Si(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:Os(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ki.copy(M.backgroundRotation),ki.x*=-1,ki.y*=-1,ki.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(ki.y*=-1,ki.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(zg.makeRotationFromEuler(ki)),h.material.toneMapped=tt.getTransfer(_.colorSpace)!==ut,(u!==_||d!==_.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,f=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new Ot(new $i(2,2),new Fn({name:"BackgroundMaterial",uniforms:Os(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=tt.getTransfer(_.colorSpace)!==ut,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=_,d=_.version,f=i.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function p(w,M){w.getRGB(ua,od(i)),n.buffers.color.setClear(ua.r,ua.g,ua.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(w,M=1){o.set(w),l=M,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,p(o,l)},render:x,addToRenderList:m}}function Vg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(v,R,z,O,V){let Z=!1,G=u(O,z,R);r!==G&&(r=G,c(r.object)),Z=f(v,O,z,V),Z&&g(v,O,z,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,_(v,R,z,O),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,R,z){let O=z.wireframe===!0,V=n[v.id];V===void 0&&(V={},n[v.id]=V);let Z=V[R.id];Z===void 0&&(Z={},V[R.id]=Z);let G=Z[O];return G===void 0&&(G=d(l()),Z[O]=G),G}function d(v){let R=[],z=[],O=[];for(let V=0;V<t;V++)R[V]=0,z[V]=0,O[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:z,attributeDivisors:O,object:v,attributes:{},index:null}}function f(v,R,z,O){let V=r.attributes,Z=R.attributes,G=0,ne=z.getAttributes();for(let W in ne)if(ne[W].location>=0){let xe=V[W],we=Z[W];if(we===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(we=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(we=v.instanceColor)),xe===void 0||xe.attribute!==we||we&&xe.data!==we.data)return!0;G++}return r.attributesNum!==G||r.index!==O}function g(v,R,z,O){let V={},Z=R.attributes,G=0,ne=z.getAttributes();for(let W in ne)if(ne[W].location>=0){let xe=Z[W];xe===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(xe=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(xe=v.instanceColor));let we={};we.attribute=xe,xe&&xe.data&&(we.data=xe.data),V[W]=we,G++}r.attributes=V,r.attributesNum=G,r.index=O}function x(){let v=r.newAttributes;for(let R=0,z=v.length;R<z;R++)v[R]=0}function m(v){p(v,0)}function p(v,R){let z=r.newAttributes,O=r.enabledAttributes,V=r.attributeDivisors;z[v]=1,O[v]===0&&(i.enableVertexAttribArray(v),O[v]=1),V[v]!==R&&(i.vertexAttribDivisor(v,R),V[v]=R)}function w(){let v=r.newAttributes,R=r.enabledAttributes;for(let z=0,O=R.length;z<O;z++)R[z]!==v[z]&&(i.disableVertexAttribArray(z),R[z]=0)}function M(v,R,z,O,V,Z,G){G===!0?i.vertexAttribIPointer(v,R,z,V,Z):i.vertexAttribPointer(v,R,z,O,V,Z)}function _(v,R,z,O){x();let V=O.attributes,Z=z.getAttributes(),G=R.defaultAttributeValues;for(let ne in Z){let W=Z[ne];if(W.location>=0){let he=V[ne];if(he===void 0&&(ne==="instanceMatrix"&&v.instanceMatrix&&(he=v.instanceMatrix),ne==="instanceColor"&&v.instanceColor&&(he=v.instanceColor)),he!==void 0){let xe=he.normalized,we=he.itemSize,We=e.get(he);if(We===void 0)continue;let st=We.buffer,Y=We.type,se=We.bytesPerElement,Ee=Y===i.INT||Y===i.UNSIGNED_INT||he.gpuType===Hc;if(he.isInterleavedBufferAttribute){let le=he.data,De=le.stride,ze=he.offset;if(le.isInstancedInterleavedBuffer){for(let Oe=0;Oe<W.locationSize;Oe++)p(W.location+Oe,le.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let Oe=0;Oe<W.locationSize;Oe++)m(W.location+Oe);i.bindBuffer(i.ARRAY_BUFFER,st);for(let Oe=0;Oe<W.locationSize;Oe++)M(W.location+Oe,we/W.locationSize,Y,xe,De*se,(ze+we/W.locationSize*Oe)*se,Ee)}else{if(he.isInstancedBufferAttribute){for(let le=0;le<W.locationSize;le++)p(W.location+le,he.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let le=0;le<W.locationSize;le++)m(W.location+le);i.bindBuffer(i.ARRAY_BUFFER,st);for(let le=0;le<W.locationSize;le++)M(W.location+le,we/W.locationSize,Y,xe,we*se,we/W.locationSize*le*se,Ee)}}else if(G!==void 0){let xe=G[ne];if(xe!==void 0)switch(xe.length){case 2:i.vertexAttrib2fv(W.location,xe);break;case 3:i.vertexAttrib3fv(W.location,xe);break;case 4:i.vertexAttrib4fv(W.location,xe);break;default:i.vertexAttrib1fv(W.location,xe)}}}}w()}function D(){T();for(let v in n){let R=n[v];for(let z in R){let O=R[z];for(let V in O)h(O[V].object),delete O[V];delete R[z]}delete n[v]}}function C(v){if(n[v.id]===void 0)return;let R=n[v.id];for(let z in R){let O=R[z];for(let V in O)h(O[V].object),delete O[V];delete R[z]}delete n[v.id]}function I(v){for(let R in n){let z=n[R];if(z[v.id]===void 0)continue;let O=z[v.id];for(let V in O)h(O[V].object),delete O[V];delete z[v.id]}}function T(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:y,dispose:D,releaseStatesOfGeometry:C,releaseStatesOfProgram:I,initAttributes:x,enableAttribute:m,disableUnusedAttributes:w}}function Gg(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*d[x];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Wg(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let I=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==wn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let T=I===Lr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==ti&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==Dn&&!T)}function l(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:w,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:D,maxSamples:C}}function Xg(i){let e=this,t=null,n=0,s=!1,r=!1,a=new hn,o=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let w=r?0:n,M=w*4,_=p.clippingState||null;l.value=_,_=h(g,d,M,f);for(let D=0;D!==M;++D)_[D]=t[D];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=f+x*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,_=f;M!==x;++M,_+=4)a.copy(u[M]).applyMatrix4(w,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function $g(i){let e=new WeakMap;function t(a,o){return o===vl?a.mapping=Ps:o===yl&&(a.mapping=Ls),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===vl||o===yl)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new tc(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var ks=class extends Oa{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ws=4,nu=[.125,.215,.35,.446,.526,.582],Vi=20,Jo=new ks,iu=new Je,Ko=null,Qo=0,el=0,tl=!1,zi=(1+Math.sqrt(5))/2,vs=1/zi,su=[new P(-zi,vs,0),new P(zi,vs,0),new P(-vs,0,zi),new P(vs,0,zi),new P(0,zi,-vs),new P(0,zi,vs),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],Ba=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Ko=this._renderer.getRenderTarget(),Qo=this._renderer.getActiveCubeFace(),el=this._renderer.getActiveMipmapLevel(),tl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ou(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=au(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ko,Qo,el),this._renderer.xr.enabled=tl,e.scissorTest=!1,da(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ps||e.mapping===Ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ko=this._renderer.getRenderTarget(),Qo=this._renderer.getActiveCubeFace(),el=this._renderer.getActiveMipmapLevel(),tl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:un,minFilter:un,generateMipmaps:!1,type:Lr,format:wn,colorSpace:Hs,depthBuffer:!1},s=ru(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ru(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qg(r)),this._blurMaterial=Yg(r,e,t)}return s}_compileMaterial(e){let t=new Ot(this._lodPlanes[0],e);this._renderer.compile(t,Jo)}_sceneToCubeUV(e,t,n,s){let o=new Zt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(iu),h.toneMapping=yi,h.autoClear=!1;let f=new Fs({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1}),g=new Ot(new Si,f),x=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,x=!0):(f.color.copy(iu),x=!0);for(let p=0;p<6;p++){let w=p%3;w===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):w===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));let M=this._cubeSize;da(s,w*M,p>2?M:0,M,M),h.setRenderTarget(s),x&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ps||e.mapping===Ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ou()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=au());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ot(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;da(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Jo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=su[(s-r-1)%su.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Ot(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Vi-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):Vi;m>Vi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Vi}`);let p=[],w=0;for(let I=0;I<Vi;++I){let T=I/x,y=Math.exp(-T*T/2);p.push(y),I===0?w+=y:I<m&&(w+=2*y)}for(let I=0;I<p.length;I++)p[I]=p[I]/w;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;let _=this._sizeLods[s],D=3*_*(s>M-ws?s-M+ws:0),C=4*(this._cubeSize-_);da(t,D,C,3*_,2*_),l.setRenderTarget(t),l.render(u,Jo)}};function qg(i){let e=[],t=[],n=[],s=i,r=i-ws+1+nu.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>i-ws?l=nu[a-i+ws-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,x=3,m=2,p=1,w=new Float32Array(x*g*f),M=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let C=0;C<f;C++){let I=C%3*2/3-1,T=C>2?0:-1,y=[I,T,0,I+2/3,T,0,I+2/3,T+1,0,I,T,0,I+2/3,T+1,0,I,T+1,0];w.set(y,x*g*C),M.set(d,m*g*C);let v=[C,C,C,C,C,C];_.set(v,p*g*C)}let D=new It;D.setAttribute("position",new kt(w,x)),D.setAttribute("uv",new kt(M,m)),D.setAttribute("faceIndex",new kt(_,p)),e.push(D),s>ws&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ru(i,e,t){let n=new ni(i,e,t);return n.texture.mapping=po,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function da(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Yg(i,e,t){let n=new Float32Array(Vi),s=new P(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:Vi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function au(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function ou(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Yc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Zg(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===vl||l===yl,h=l===Ps||l===Ls;if(c||h){let u=e.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Ba(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Ba(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function jg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&or("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Jg(i,e,t,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);for(let g in d.morphAttributes){let x=d.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)e.remove(x[m])}d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let g in d)e.update(d[g],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let g in f){let x=f[g];for(let m=0,p=x.length;m<p;m++)e.update(x[m],i.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,g=u.attributes.position,x=0;if(f!==null){let w=f.array;x=f.version;for(let M=0,_=w.length;M<_;M+=3){let D=w[M+0],C=w[M+1],I=w[M+2];d.push(D,C,C,I,I,D)}}else if(g!==void 0){let w=g.array;x=g.version;for(let M=0,_=w.length/3-1;M<_;M+=3){let D=M+0,C=M+1,I=M+2;d.push(D,C,C,I,I,D)}}else return;let m=new(rd(d)?Fa:Na)(d,1);m.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Kg(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*a),t.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*a,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function u(d,f,g,x){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,x,0,g);let p=0;for(let w=0;w<g;w++)p+=f[w]*x[w];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Qg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function e0(i,e,t){let n=new WeakMap,s=new wt;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let y=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",y)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],w=o.morphAttributes.color||[],M=0;f===!0&&(M=1),g===!0&&(M=2),x===!0&&(M=3);let _=o.attributes.position.count*M,D=1;_>e.maxTextureSize&&(D=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let C=new Float32Array(_*D*4*u),I=new Ua(C,_,D,u);I.type=Dn,I.needsUpdate=!0;let T=M*4;for(let v=0;v<u;v++){let R=m[v],z=p[v],O=w[v],V=_*D*4*v;for(let Z=0;Z<R.count;Z++){let G=Z*T;f===!0&&(s.fromBufferAttribute(R,Z),C[V+G+0]=s.x,C[V+G+1]=s.y,C[V+G+2]=s.z,C[V+G+3]=0),g===!0&&(s.fromBufferAttribute(z,Z),C[V+G+4]=s.x,C[V+G+5]=s.y,C[V+G+6]=s.z,C[V+G+7]=0),x===!0&&(s.fromBufferAttribute(O,Z),C[V+G+8]=s.x,C[V+G+9]=s.y,C[V+G+10]=s.z,C[V+G+11]=O.itemSize===4?s.w:1)}}d={count:u,texture:I,size:new ae(_,D)},n.set(o,d),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function t0(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}var za=class extends jt{constructor(e,t,n,s,r,a,o,l,c,h=As){if(h!==As&&h!==Us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===As&&(n=Xi),n===void 0&&h===Us&&(n=Ds),super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Xt,this.minFilter=l!==void 0?l:Xt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},cd=new jt,lu=new za(1,1),hd=new Ua,ud=new Ql,dd=new ka,cu=[],hu=[],uu=new Float32Array(16),du=new Float32Array(9),fu=new Float32Array(4);function Vs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=cu[s];if(r===void 0&&(r=new Float32Array(s),cu[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Lt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Dt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function go(i,e){let t=hu[e];t===void 0&&(t=new Int32Array(e),hu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function n0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function i0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2fv(this.addr,e),Dt(t,e)}}function s0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;i.uniform3fv(this.addr,e),Dt(t,e)}}function r0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4fv(this.addr,e),Dt(t,e)}}function a0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;fu.set(n),i.uniformMatrix2fv(this.addr,!1,fu),Dt(t,n)}}function o0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;du.set(n),i.uniformMatrix3fv(this.addr,!1,du),Dt(t,n)}}function l0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;uu.set(n),i.uniformMatrix4fv(this.addr,!1,uu),Dt(t,n)}}function c0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function h0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2iv(this.addr,e),Dt(t,e)}}function u0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3iv(this.addr,e),Dt(t,e)}}function d0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4iv(this.addr,e),Dt(t,e)}}function f0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function p0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2uiv(this.addr,e),Dt(t,e)}}function m0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3uiv(this.addr,e),Dt(t,e)}}function g0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4uiv(this.addr,e),Dt(t,e)}}function x0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(lu.compareFunction=sd,r=lu):r=cd,t.setTexture2D(e||r,s)}function v0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ud,s)}function y0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||dd,s)}function _0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||hd,s)}function b0(i){switch(i){case 5126:return n0;case 35664:return i0;case 35665:return s0;case 35666:return r0;case 35674:return a0;case 35675:return o0;case 35676:return l0;case 5124:case 35670:return c0;case 35667:case 35671:return h0;case 35668:case 35672:return u0;case 35669:case 35673:return d0;case 5125:return f0;case 36294:return p0;case 36295:return m0;case 36296:return g0;case 35678:case 36198:case 36298:case 36306:case 35682:return x0;case 35679:case 36299:case 36307:return v0;case 35680:case 36300:case 36308:case 36293:return y0;case 36289:case 36303:case 36311:case 36292:return _0}}function M0(i,e){i.uniform1fv(this.addr,e)}function S0(i,e){let t=Vs(e,this.size,2);i.uniform2fv(this.addr,t)}function w0(i,e){let t=Vs(e,this.size,3);i.uniform3fv(this.addr,t)}function E0(i,e){let t=Vs(e,this.size,4);i.uniform4fv(this.addr,t)}function T0(i,e){let t=Vs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function A0(i,e){let t=Vs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function C0(i,e){let t=Vs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function R0(i,e){i.uniform1iv(this.addr,e)}function I0(i,e){i.uniform2iv(this.addr,e)}function P0(i,e){i.uniform3iv(this.addr,e)}function L0(i,e){i.uniform4iv(this.addr,e)}function D0(i,e){i.uniform1uiv(this.addr,e)}function U0(i,e){i.uniform2uiv(this.addr,e)}function N0(i,e){i.uniform3uiv(this.addr,e)}function F0(i,e){i.uniform4uiv(this.addr,e)}function O0(i,e,t){let n=this.cache,s=e.length,r=go(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||cd,r[a])}function k0(i,e,t){let n=this.cache,s=e.length,r=go(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ud,r[a])}function B0(i,e,t){let n=this.cache,s=e.length,r=go(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||dd,r[a])}function z0(i,e,t){let n=this.cache,s=e.length,r=go(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||hd,r[a])}function H0(i){switch(i){case 5126:return M0;case 35664:return S0;case 35665:return w0;case 35666:return E0;case 35674:return T0;case 35675:return A0;case 35676:return C0;case 5124:case 35670:return R0;case 35667:case 35671:return I0;case 35668:case 35672:return P0;case 35669:case 35673:return L0;case 5125:return D0;case 36294:return U0;case 36295:return N0;case 36296:return F0;case 35678:case 36198:case 36298:case 36306:case 35682:return O0;case 35679:case 36299:case 36307:return k0;case 35680:case 36300:case 36308:case 36293:return B0;case 36289:case 36303:case 36311:case 36292:return z0}}var nc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=b0(t.type)}},ic=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=H0(t.type)}},sc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},nl=/(\w+)(\])?(\[|\.)?/g;function pu(i,e){i.seq.push(e),i.map[e.id]=e}function V0(i,e,t){let n=i.name,s=n.length;for(nl.lastIndex=0;;){let r=nl.exec(n),a=nl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){pu(t,c===void 0?new nc(o,i,e):new ic(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new sc(o),pu(t,u)),t=u}}}var Rs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);V0(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function mu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var G0=37297,W0=0;function X0(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var gu=new qe;function $0(i){tt._getMatrix(gu,tt.workingColorSpace,i);let e=`mat3( ${gu.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case mo:return[e,"LinearTransferOETF"];case ut:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function xu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+X0(i.getShaderSource(e),a)}else return s}function q0(i,e){let t=$0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Y0(i,e){let t;switch(e){case _f:t="Linear";break;case bf:t="Reinhard";break;case Mf:t="Cineon";break;case zc:t="ACESFilmic";break;case wf:t="AgX";break;case Ef:t="Neutral";break;case Sf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var fa=new P;function Z0(){tt.getLuminanceCoefficients(fa);let i=fa.x.toFixed(4),e=fa.y.toFixed(4),t=fa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function j0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(lr).join(`
`)}function J0(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function K0(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function lr(i){return i!==""}function vu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function yu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Q0=/^[ \t]*#include +<([\w\d./]+)>/gm;function rc(i){return i.replace(Q0,tx)}var ex=new Map;function tx(i,e){let t=je[e];if(t===void 0){let n=ex.get(e);if(n!==void 0)t=je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return rc(t)}var nx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _u(i){return i.replace(nx,ix)}function ix(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function bu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function sx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xu?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Bc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Jn&&(e="SHADOWMAP_TYPE_VSM"),e}function rx(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ps:case Ls:e="ENVMAP_TYPE_CUBE";break;case po:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ax(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ls:e="ENVMAP_MODE_REFRACTION";break}return e}function ox(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case $u:e="ENVMAP_BLENDING_MULTIPLY";break;case vf:e="ENVMAP_BLENDING_MIX";break;case yf:e="ENVMAP_BLENDING_ADD";break}return e}function lx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function cx(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=sx(t),c=rx(t),h=ax(t),u=ox(t),d=lx(t),f=j0(t),g=J0(r),x=s.createProgram(),m,p,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(lr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(lr).join(`
`),p.length>0&&(p+=`
`)):(m=[bu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(lr).join(`
`),p=[bu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yi?"#define TONE_MAPPING":"",t.toneMapping!==yi?je.tonemapping_pars_fragment:"",t.toneMapping!==yi?Y0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,q0("linearToOutputTexel",t.outputColorSpace),Z0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(lr).join(`
`)),a=rc(a),a=vu(a,t),a=yu(a,t),o=rc(o),o=vu(o,t),o=yu(o,t),a=_u(a),o=_u(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=w+m+a,_=w+p+o,D=mu(s,s.VERTEX_SHADER,M),C=mu(s,s.FRAGMENT_SHADER,_);s.attachShader(x,D),s.attachShader(x,C),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function I(R){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(x).trim(),O=s.getShaderInfoLog(D).trim(),V=s.getShaderInfoLog(C).trim(),Z=!0,G=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,D,C);else{let ne=xu(s,D,"vertex"),W=xu(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+z+`
`+ne+`
`+W)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(O===""||V==="")&&(G=!1);G&&(R.diagnostics={runnable:Z,programLog:z,vertexShader:{log:O,prefix:m},fragmentShader:{log:V,prefix:p}})}s.deleteShader(D),s.deleteShader(C),T=new Rs(s,x),y=K0(s,x)}let T;this.getUniforms=function(){return T===void 0&&I(this),T};let y;this.getAttributes=function(){return y===void 0&&I(this),y};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(x,G0)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=W0++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=D,this.fragmentShader=C,this}var hx=0,ac=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new oc(e),t.set(e,n)),n}},oc=class{constructor(e){this.id=hx++,this.code=e,this.usedTimes=0}};function ux(i,e,t,n,s,r,a){let o=new mr,l=new ac,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,v,R,z,O){let V=z.fog,Z=O.geometry,G=y.isMeshStandardMaterial?z.environment:null,ne=(y.isMeshStandardMaterial?t:e).get(y.envMap||G),W=ne&&ne.mapping===po?ne.image.height:null,he=g[y.type];y.precision!==null&&(f=s.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));let xe=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,we=xe!==void 0?xe.length:0,We=0;Z.morphAttributes.position!==void 0&&(We=1),Z.morphAttributes.normal!==void 0&&(We=2),Z.morphAttributes.color!==void 0&&(We=3);let st,Y,se,Ee;if(he){let lt=Pn[he];st=lt.vertexShader,Y=lt.fragmentShader}else st=y.vertexShader,Y=y.fragmentShader,l.update(y),se=l.getVertexShaderID(y),Ee=l.getFragmentShaderID(y);let le=i.getRenderTarget(),De=i.state.buffers.depth.getReversed(),ze=O.isInstancedMesh===!0,Oe=O.isBatchedMesh===!0,et=!!y.map,J=!!y.matcap,ie=!!ne,A=!!y.aoMap,Ie=!!y.lightMap,ee=!!y.bumpMap,be=!!y.normalMap,ce=!!y.displacementMap,Ne=!!y.emissiveMap,ve=!!y.metalnessMap,E=!!y.roughnessMap,b=y.anisotropy>0,F=y.clearcoat>0,$=y.dispersion>0,K=y.iridescence>0,q=y.sheen>0,Te=y.transmission>0,de=b&&!!y.anisotropyMap,ye=F&&!!y.clearcoatMap,Ke=F&&!!y.clearcoatNormalMap,te=F&&!!y.clearcoatRoughnessMap,Me=K&&!!y.iridescenceMap,Fe=K&&!!y.iridescenceThicknessMap,ke=q&&!!y.sheenColorMap,Se=q&&!!y.sheenRoughnessMap,Qe=!!y.specularMap,Ze=!!y.specularColorMap,gt=!!y.specularIntensityMap,L=Te&&!!y.transmissionMap,fe=Te&&!!y.thicknessMap,X=!!y.gradientMap,j=!!y.alphaMap,ge=y.alphaTest>0,pe=!!y.alphaHash,Xe=!!y.extensions,St=yi;y.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(St=i.toneMapping);let zt={shaderID:he,shaderType:y.type,shaderName:y.name,vertexShader:st,fragmentShader:Y,defines:y.defines,customVertexShaderID:se,customFragmentShaderID:Ee,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Oe,batchingColor:Oe&&O._colorsTexture!==null,instancing:ze,instancingColor:ze&&O.instanceColor!==null,instancingMorph:ze&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:le===null?i.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:Hs,alphaToCoverage:!!y.alphaToCoverage,map:et,matcap:J,envMap:ie,envMapMode:ie&&ne.mapping,envMapCubeUVHeight:W,aoMap:A,lightMap:Ie,bumpMap:ee,normalMap:be,displacementMap:d&&ce,emissiveMap:Ne,normalMapObjectSpace:be&&y.normalMapType===Rf,normalMapTangentSpace:be&&y.normalMapType===id,metalnessMap:ve,roughnessMap:E,anisotropy:b,anisotropyMap:de,clearcoat:F,clearcoatMap:ye,clearcoatNormalMap:Ke,clearcoatRoughnessMap:te,dispersion:$,iridescence:K,iridescenceMap:Me,iridescenceThicknessMap:Fe,sheen:q,sheenColorMap:ke,sheenRoughnessMap:Se,specularMap:Qe,specularColorMap:Ze,specularIntensityMap:gt,transmission:Te,transmissionMap:L,thicknessMap:fe,gradientMap:X,opaque:y.transparent===!1&&y.blending===Ts&&y.alphaToCoverage===!1,alphaMap:j,alphaTest:ge,alphaHash:pe,combine:y.combine,mapUv:et&&x(y.map.channel),aoMapUv:A&&x(y.aoMap.channel),lightMapUv:Ie&&x(y.lightMap.channel),bumpMapUv:ee&&x(y.bumpMap.channel),normalMapUv:be&&x(y.normalMap.channel),displacementMapUv:ce&&x(y.displacementMap.channel),emissiveMapUv:Ne&&x(y.emissiveMap.channel),metalnessMapUv:ve&&x(y.metalnessMap.channel),roughnessMapUv:E&&x(y.roughnessMap.channel),anisotropyMapUv:de&&x(y.anisotropyMap.channel),clearcoatMapUv:ye&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:Ke&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:Fe&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Se&&x(y.sheenRoughnessMap.channel),specularMapUv:Qe&&x(y.specularMap.channel),specularColorMapUv:Ze&&x(y.specularColorMap.channel),specularIntensityMapUv:gt&&x(y.specularIntensityMap.channel),transmissionMapUv:L&&x(y.transmissionMap.channel),thicknessMapUv:fe&&x(y.thicknessMap.channel),alphaMapUv:j&&x(y.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(be||b),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!Z.attributes.uv&&(et||j),fog:!!V,useFog:y.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:De,skinning:O.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:We,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:St,decodeVideoTexture:et&&y.map.isVideoTexture===!0&&tt.getTransfer(y.map.colorSpace)===ut,decodeVideoTextureEmissive:Ne&&y.emissiveMap.isVideoTexture===!0&&tt.getTransfer(y.emissiveMap.colorSpace)===ut,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===en,flipSided:y.side===tn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Xe&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&y.extensions.multiDraw===!0||Oe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return zt.vertexUv1s=c.has(1),zt.vertexUv2s=c.has(2),zt.vertexUv3s=c.has(3),c.clear(),zt}function p(y){let v=[];if(y.shaderID?v.push(y.shaderID):(v.push(y.customVertexShaderID),v.push(y.customFragmentShaderID)),y.defines!==void 0)for(let R in y.defines)v.push(R),v.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(w(v,y),M(v,y),v.push(i.outputColorSpace)),v.push(y.customProgramCacheKey),v.join()}function w(y,v){y.push(v.precision),y.push(v.outputColorSpace),y.push(v.envMapMode),y.push(v.envMapCubeUVHeight),y.push(v.mapUv),y.push(v.alphaMapUv),y.push(v.lightMapUv),y.push(v.aoMapUv),y.push(v.bumpMapUv),y.push(v.normalMapUv),y.push(v.displacementMapUv),y.push(v.emissiveMapUv),y.push(v.metalnessMapUv),y.push(v.roughnessMapUv),y.push(v.anisotropyMapUv),y.push(v.clearcoatMapUv),y.push(v.clearcoatNormalMapUv),y.push(v.clearcoatRoughnessMapUv),y.push(v.iridescenceMapUv),y.push(v.iridescenceThicknessMapUv),y.push(v.sheenColorMapUv),y.push(v.sheenRoughnessMapUv),y.push(v.specularMapUv),y.push(v.specularColorMapUv),y.push(v.specularIntensityMapUv),y.push(v.transmissionMapUv),y.push(v.thicknessMapUv),y.push(v.combine),y.push(v.fogExp2),y.push(v.sizeAttenuation),y.push(v.morphTargetsCount),y.push(v.morphAttributeCount),y.push(v.numDirLights),y.push(v.numPointLights),y.push(v.numSpotLights),y.push(v.numSpotLightMaps),y.push(v.numHemiLights),y.push(v.numRectAreaLights),y.push(v.numDirLightShadows),y.push(v.numPointLightShadows),y.push(v.numSpotLightShadows),y.push(v.numSpotLightShadowsWithMaps),y.push(v.numLightProbes),y.push(v.shadowMapType),y.push(v.toneMapping),y.push(v.numClippingPlanes),y.push(v.numClipIntersection),y.push(v.depthPacking)}function M(y,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),y.push(o.mask)}function _(y){let v=g[y.type],R;if(v){let z=Pn[v];R=tp.clone(z.uniforms)}else R=y.uniforms;return R}function D(y,v){let R;for(let z=0,O=h.length;z<O;z++){let V=h[z];if(V.cacheKey===v){R=V,++R.usedTimes;break}}return R===void 0&&(R=new cx(i,v,y,r),h.push(R)),R}function C(y){if(--y.usedTimes===0){let v=h.indexOf(y);h[v]=h[h.length-1],h.pop(),y.destroy()}}function I(y){l.remove(y)}function T(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:D,releaseProgram:C,releaseShaderCache:I,programs:h,dispose:T}}function dx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function fx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Mu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Su(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,d,f,g,x,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),e++,p}function o(u,d,f,g,x,m){let p=a(u,d,f,g,x,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(u,d,f,g,x,m){let p=a(u,d,f,g,x,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,d){t.length>1&&t.sort(u||fx),n.length>1&&n.sort(d||Mu),s.length>1&&s.sort(d||Mu)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function px(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Su,i.set(n,[a])):s>=r.length?(a=new Su,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function mx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Je};break;case"SpotLight":t={position:new P,direction:new P,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":t={color:new Je,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function gx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var xx=0;function vx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function yx(i){let e=new mx,t=gx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new it,a=new it;function o(c){let h=0,u=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,w=0,M=0,_=0,D=0,C=0,I=0;c.sort(vx);for(let y=0,v=c.length;y<v;y++){let R=c[y],z=R.color,O=R.intensity,V=R.distance,Z=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=z.r*O,u+=z.g*O,d+=z.b*O;else if(R.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(R.sh.coefficients[G],O);I++}else if(R.isDirectionalLight){let G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let ne=R.shadow,W=t.get(R);W.shadowIntensity=ne.intensity,W.shadowBias=ne.bias,W.shadowNormalBias=ne.normalBias,W.shadowRadius=ne.radius,W.shadowMapSize=ne.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=Z,n.directionalShadowMatrix[f]=R.shadow.matrix,w++}n.directional[f]=G,f++}else if(R.isSpotLight){let G=e.get(R);G.position.setFromMatrixPosition(R.matrixWorld),G.color.copy(z).multiplyScalar(O),G.distance=V,G.coneCos=Math.cos(R.angle),G.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),G.decay=R.decay,n.spot[x]=G;let ne=R.shadow;if(R.map&&(n.spotLightMap[D]=R.map,D++,ne.updateMatrices(R),R.castShadow&&C++),n.spotLightMatrix[x]=ne.matrix,R.castShadow){let W=t.get(R);W.shadowIntensity=ne.intensity,W.shadowBias=ne.bias,W.shadowNormalBias=ne.normalBias,W.shadowRadius=ne.radius,W.shadowMapSize=ne.mapSize,n.spotShadow[x]=W,n.spotShadowMap[x]=Z,_++}x++}else if(R.isRectAreaLight){let G=e.get(R);G.color.copy(z).multiplyScalar(O),G.halfWidth.set(R.width*.5,0,0),G.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=G,m++}else if(R.isPointLight){let G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),G.distance=R.distance,G.decay=R.decay,R.castShadow){let ne=R.shadow,W=t.get(R);W.shadowIntensity=ne.intensity,W.shadowBias=ne.bias,W.shadowNormalBias=ne.normalBias,W.shadowRadius=ne.radius,W.shadowMapSize=ne.mapSize,W.shadowCameraNear=ne.camera.near,W.shadowCameraFar=ne.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=Z,n.pointShadowMatrix[g]=R.shadow.matrix,M++}n.point[g]=G,g++}else if(R.isHemisphereLight){let G=e.get(R);G.skyColor.copy(R.color).multiplyScalar(O),G.groundColor.copy(R.groundColor).multiplyScalar(O),n.hemi[p]=G,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let T=n.hash;(T.directionalLength!==f||T.pointLength!==g||T.spotLength!==x||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==w||T.numPointShadows!==M||T.numSpotShadows!==_||T.numSpotMaps!==D||T.numLightProbes!==I)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+D-C,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=I,T.directionalLength=f,T.pointLength=g,T.spotLength=x,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=w,T.numPointShadows=M,T.numSpotShadows=_,T.numSpotMaps=D,T.numLightProbes=I,n.version=xx++)}function l(c,h){let u=0,d=0,f=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,w=c.length;p<w;p++){let M=c[p];if(M.isDirectionalLight){let _=n.directional[u];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(M.isSpotLight){let _=n.spot[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),f++}else if(M.isRectAreaLight){let _=n.rectArea[g];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){let _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){let _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(m),x++}}}return{setup:o,setupView:l,state:n}}function wu(i){let e=new yx(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function _x(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new wu(i),e.set(s,[o])):r>=a.length?(o=new wu(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var lc=class extends Nn{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},cc=class extends Nn{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},bx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Sx(i,e,t){let n=new gr,s=new ae,r=new ae,a=new wt,o=new lc({depthPacking:Cf}),l=new cc,c={},h=t.maxTextureSize,u={[_i]:tn,[tn]:_i,[en]:en},d=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:bx,fragmentShader:Mx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new It;g.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Ot(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xu;let p=this.type;this.render=function(C,I,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;let y=i.getRenderTarget(),v=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),z=i.state;z.setBlending(vi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let O=p!==Jn&&this.type===Jn,V=p===Jn&&this.type!==Jn;for(let Z=0,G=C.length;Z<G;Z++){let ne=C[Z],W=ne.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let he=W.getFrameExtents();if(s.multiply(he),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/he.x),s.x=r.x*he.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/he.y),s.y=r.y*he.y,W.mapSize.y=r.y)),W.map===null||O===!0||V===!0){let we=this.type!==Jn?{minFilter:Xt,magFilter:Xt}:{};W.map!==null&&W.map.dispose(),W.map=new ni(s.x,s.y,we),W.map.texture.name=ne.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();let xe=W.getViewportCount();for(let we=0;we<xe;we++){let We=W.getViewport(we);a.set(r.x*We.x,r.y*We.y,r.x*We.z,r.y*We.w),z.viewport(a),W.updateMatrices(ne,we),n=W.getFrustum(),_(I,T,W.camera,ne,this.type)}W.isPointLightShadow!==!0&&this.type===Jn&&w(W,T),W.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(y,v,R)};function w(C,I){let T=e.update(x);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new ni(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(I,null,T,d,x,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(I,null,T,f,x,null)}function M(C,I,T,y){let v=null,R=T.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(R!==void 0)v=R;else if(v=T.isPointLight===!0?l:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){let z=v.uuid,O=I.uuid,V=c[z];V===void 0&&(V={},c[z]=V);let Z=V[O];Z===void 0&&(Z=v.clone(),V[O]=Z,I.addEventListener("dispose",D)),v=Z}if(v.visible=I.visible,v.wireframe=I.wireframe,y===Jn?v.side=I.shadowSide!==null?I.shadowSide:I.side:v.side=I.shadowSide!==null?I.shadowSide:u[I.side],v.alphaMap=I.alphaMap,v.alphaTest=I.alphaTest,v.map=I.map,v.clipShadows=I.clipShadows,v.clippingPlanes=I.clippingPlanes,v.clipIntersection=I.clipIntersection,v.displacementMap=I.displacementMap,v.displacementScale=I.displacementScale,v.displacementBias=I.displacementBias,v.wireframeLinewidth=I.wireframeLinewidth,v.linewidth=I.linewidth,T.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let z=i.properties.get(v);z.light=T}return v}function _(C,I,T,y,v){if(C.visible===!1)return;if(C.layers.test(I.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&v===Jn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,C.matrixWorld);let O=e.update(C),V=C.material;if(Array.isArray(V)){let Z=O.groups;for(let G=0,ne=Z.length;G<ne;G++){let W=Z[G],he=V[W.materialIndex];if(he&&he.visible){let xe=M(C,he,y,v);C.onBeforeShadow(i,C,I,T,O,xe,W),i.renderBufferDirect(T,null,O,xe,C,W),C.onAfterShadow(i,C,I,T,O,xe,W)}}}else if(V.visible){let Z=M(C,V,y,v);C.onBeforeShadow(i,C,I,T,O,Z,null),i.renderBufferDirect(T,null,O,Z,C,null),C.onAfterShadow(i,C,I,T,O,Z,null)}}let z=C.children;for(let O=0,V=z.length;O<V;O++)_(z[O],I,T,y,v)}function D(C){C.target.removeEventListener("dispose",D);for(let T in c){let y=c[T],v=C.target.uuid;v in y&&(y[v].dispose(),delete y[v])}}}var wx={[ul]:dl,[fl]:gl,[pl]:xl,[Is]:ml,[dl]:ul,[gl]:fl,[xl]:pl,[ml]:Is};function Ex(i,e){function t(){let L=!1,fe=new wt,X=null,j=new wt(0,0,0,0);return{setMask:function(ge){X!==ge&&!L&&(i.colorMask(ge,ge,ge,ge),X=ge)},setLocked:function(ge){L=ge},setClear:function(ge,pe,Xe,St,zt){zt===!0&&(ge*=St,pe*=St,Xe*=St),fe.set(ge,pe,Xe,St),j.equals(fe)===!1&&(i.clearColor(ge,pe,Xe,St),j.copy(fe))},reset:function(){L=!1,X=null,j.set(-1,0,0,0)}}}function n(){let L=!1,fe=!1,X=null,j=null,ge=null;return{setReversed:function(pe){if(fe!==pe){let Xe=e.get("EXT_clip_control");fe?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT);let St=ge;ge=null,this.setClear(St)}fe=pe},getReversed:function(){return fe},setTest:function(pe){pe?le(i.DEPTH_TEST):De(i.DEPTH_TEST)},setMask:function(pe){X!==pe&&!L&&(i.depthMask(pe),X=pe)},setFunc:function(pe){if(fe&&(pe=wx[pe]),j!==pe){switch(pe){case ul:i.depthFunc(i.NEVER);break;case dl:i.depthFunc(i.ALWAYS);break;case fl:i.depthFunc(i.LESS);break;case Is:i.depthFunc(i.LEQUAL);break;case pl:i.depthFunc(i.EQUAL);break;case ml:i.depthFunc(i.GEQUAL);break;case gl:i.depthFunc(i.GREATER);break;case xl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}j=pe}},setLocked:function(pe){L=pe},setClear:function(pe){ge!==pe&&(fe&&(pe=1-pe),i.clearDepth(pe),ge=pe)},reset:function(){L=!1,X=null,j=null,ge=null,fe=!1}}}function s(){let L=!1,fe=null,X=null,j=null,ge=null,pe=null,Xe=null,St=null,zt=null;return{setTest:function(lt){L||(lt?le(i.STENCIL_TEST):De(i.STENCIL_TEST))},setMask:function(lt){fe!==lt&&!L&&(i.stencilMask(lt),fe=lt)},setFunc:function(lt,mn,Vn){(X!==lt||j!==mn||ge!==Vn)&&(i.stencilFunc(lt,mn,Vn),X=lt,j=mn,ge=Vn)},setOp:function(lt,mn,Vn){(pe!==lt||Xe!==mn||St!==Vn)&&(i.stencilOp(lt,mn,Vn),pe=lt,Xe=mn,St=Vn)},setLocked:function(lt){L=lt},setClear:function(lt){zt!==lt&&(i.clearStencil(lt),zt=lt)},reset:function(){L=!1,fe=null,X=null,j=null,ge=null,pe=null,Xe=null,St=null,zt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],g=null,x=!1,m=null,p=null,w=null,M=null,_=null,D=null,C=null,I=new Je(0,0,0),T=0,y=!1,v=null,R=null,z=null,O=null,V=null,Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,ne=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(W)[1]),G=ne>=1):W.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),G=ne>=2);let he=null,xe={},we=i.getParameter(i.SCISSOR_BOX),We=i.getParameter(i.VIEWPORT),st=new wt().fromArray(we),Y=new wt().fromArray(We);function se(L,fe,X,j){let ge=new Uint8Array(4),pe=i.createTexture();i.bindTexture(L,pe),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Xe=0;Xe<X;Xe++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,j,0,i.RGBA,i.UNSIGNED_BYTE,ge):i.texImage2D(fe+Xe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ge);return pe}let Ee={};Ee[i.TEXTURE_2D]=se(i.TEXTURE_2D,i.TEXTURE_2D,1),Ee[i.TEXTURE_CUBE_MAP]=se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ee[i.TEXTURE_2D_ARRAY]=se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ee[i.TEXTURE_3D]=se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),le(i.DEPTH_TEST),a.setFunc(Is),ee(!1),be(Ah),le(i.CULL_FACE),A(vi);function le(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function De(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function ze(L,fe){return u[L]!==fe?(i.bindFramebuffer(L,fe),u[L]=fe,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=fe),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function Oe(L,fe){let X=f,j=!1;if(L){X=d.get(fe),X===void 0&&(X=[],d.set(fe,X));let ge=L.textures;if(X.length!==ge.length||X[0]!==i.COLOR_ATTACHMENT0){for(let pe=0,Xe=ge.length;pe<Xe;pe++)X[pe]=i.COLOR_ATTACHMENT0+pe;X.length=ge.length,j=!0}}else X[0]!==i.BACK&&(X[0]=i.BACK,j=!0);j&&i.drawBuffers(X)}function et(L){return g!==L?(i.useProgram(L),g=L,!0):!1}let J={[Hi]:i.FUNC_ADD,[ef]:i.FUNC_SUBTRACT,[tf]:i.FUNC_REVERSE_SUBTRACT};J[nf]=i.MIN,J[sf]=i.MAX;let ie={[rf]:i.ZERO,[af]:i.ONE,[of]:i.SRC_COLOR,[cl]:i.SRC_ALPHA,[ff]:i.SRC_ALPHA_SATURATE,[uf]:i.DST_COLOR,[cf]:i.DST_ALPHA,[lf]:i.ONE_MINUS_SRC_COLOR,[hl]:i.ONE_MINUS_SRC_ALPHA,[df]:i.ONE_MINUS_DST_COLOR,[hf]:i.ONE_MINUS_DST_ALPHA,[pf]:i.CONSTANT_COLOR,[mf]:i.ONE_MINUS_CONSTANT_COLOR,[gf]:i.CONSTANT_ALPHA,[xf]:i.ONE_MINUS_CONSTANT_ALPHA};function A(L,fe,X,j,ge,pe,Xe,St,zt,lt){if(L===vi){x===!0&&(De(i.BLEND),x=!1);return}if(x===!1&&(le(i.BLEND),x=!0),L!==Qd){if(L!==m||lt!==y){if((p!==Hi||_!==Hi)&&(i.blendEquation(i.FUNC_ADD),p=Hi,_=Hi),lt)switch(L){case Ts:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ch:i.blendFunc(i.ONE,i.ONE);break;case Rh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ih:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Ts:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ch:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Rh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ih:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}w=null,M=null,D=null,C=null,I.set(0,0,0),T=0,m=L,y=lt}return}ge=ge||fe,pe=pe||X,Xe=Xe||j,(fe!==p||ge!==_)&&(i.blendEquationSeparate(J[fe],J[ge]),p=fe,_=ge),(X!==w||j!==M||pe!==D||Xe!==C)&&(i.blendFuncSeparate(ie[X],ie[j],ie[pe],ie[Xe]),w=X,M=j,D=pe,C=Xe),(St.equals(I)===!1||zt!==T)&&(i.blendColor(St.r,St.g,St.b,zt),I.copy(St),T=zt),m=L,y=!1}function Ie(L,fe){L.side===en?De(i.CULL_FACE):le(i.CULL_FACE);let X=L.side===tn;fe&&(X=!X),ee(X),L.blending===Ts&&L.transparent===!1?A(vi):A(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);let j=L.stencilWrite;o.setTest(j),j&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Ne(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?le(i.SAMPLE_ALPHA_TO_COVERAGE):De(i.SAMPLE_ALPHA_TO_COVERAGE)}function ee(L){v!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),v=L)}function be(L){L!==Jd?(le(i.CULL_FACE),L!==R&&(L===Ah?i.cullFace(i.BACK):L===Kd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):De(i.CULL_FACE),R=L}function ce(L){L!==z&&(G&&i.lineWidth(L),z=L)}function Ne(L,fe,X){L?(le(i.POLYGON_OFFSET_FILL),(O!==fe||V!==X)&&(i.polygonOffset(fe,X),O=fe,V=X)):De(i.POLYGON_OFFSET_FILL)}function ve(L){L?le(i.SCISSOR_TEST):De(i.SCISSOR_TEST)}function E(L){L===void 0&&(L=i.TEXTURE0+Z-1),he!==L&&(i.activeTexture(L),he=L)}function b(L,fe,X){X===void 0&&(he===null?X=i.TEXTURE0+Z-1:X=he);let j=xe[X];j===void 0&&(j={type:void 0,texture:void 0},xe[X]=j),(j.type!==L||j.texture!==fe)&&(he!==X&&(i.activeTexture(X),he=X),i.bindTexture(L,fe||Ee[L]),j.type=L,j.texture=fe)}function F(){let L=xe[he];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function K(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Te(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function de(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ke(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function te(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Me(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Fe(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ke(L){st.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),st.copy(L))}function Se(L){Y.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function Qe(L,fe){let X=c.get(fe);X===void 0&&(X=new WeakMap,c.set(fe,X));let j=X.get(L);j===void 0&&(j=i.getUniformBlockIndex(fe,L.name),X.set(L,j))}function Ze(L,fe){let j=c.get(fe).get(L);l.get(fe)!==j&&(i.uniformBlockBinding(fe,j,L.__bindingPointIndex),l.set(fe,j))}function gt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},he=null,xe={},u={},d=new WeakMap,f=[],g=null,x=!1,m=null,p=null,w=null,M=null,_=null,D=null,C=null,I=new Je(0,0,0),T=0,y=!1,v=null,R=null,z=null,O=null,V=null,st.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:le,disable:De,bindFramebuffer:ze,drawBuffers:Oe,useProgram:et,setBlending:A,setMaterial:Ie,setFlipSided:ee,setCullFace:be,setLineWidth:ce,setPolygonOffset:Ne,setScissorTest:ve,activeTexture:E,bindTexture:b,unbindTexture:F,compressedTexImage2D:$,compressedTexImage3D:K,texImage2D:Me,texImage3D:Fe,updateUBOMapping:Qe,uniformBlockBinding:Ze,texStorage2D:Ke,texStorage3D:te,texSubImage2D:q,texSubImage3D:Te,compressedTexSubImage2D:de,compressedTexSubImage3D:ye,scissor:ke,viewport:Se,reset:gt}}function Eu(i,e,t,n){let s=Tx(n);switch(t){case Ju:return i*e;case Qu:return i*e;case ed:return i*e*2;case Wc:return i*e/s.components*s.byteLength;case Xc:return i*e/s.components*s.byteLength;case td:return i*e*2/s.components*s.byteLength;case $c:return i*e*2/s.components*s.byteLength;case Ku:return i*e*3/s.components*s.byteLength;case wn:return i*e*4/s.components*s.byteLength;case qc:return i*e*4/s.components*s.byteLength;case Ta:case Aa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ca:case Ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Sl:case El:return Math.max(i,16)*Math.max(e,8)/4;case Ml:case wl:return Math.max(i,8)*Math.max(e,8)/2;case Tl:case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Il:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case kl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case zl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Hl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Vl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ia:case Gl:case Wl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case nd:case Xl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case $l:case ql:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Tx(i){switch(i){case ti:case Yu:return{byteLength:1,components:1};case fr:case Zu:case Lr:return{byteLength:2,components:1};case Vc:case Gc:return{byteLength:2,components:4};case Xi:case Hc:case Dn:return{byteLength:4,components:1};case ju:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Ax(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ae,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,b){return f?new OffscreenCanvas(E,b):pr("canvas")}function x(E,b,F){let $=1,K=ve(E);if((K.width>F||K.height>F)&&($=F/Math.max(K.width,K.height)),$<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let q=Math.floor($*K.width),Te=Math.floor($*K.height);u===void 0&&(u=g(q,Te));let de=b?g(q,Te):u;return de.width=q,de.height=Te,de.getContext("2d").drawImage(E,0,0,q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+q+"x"+Te+")."),de}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),E;return E}function m(E){return E.generateMipmaps}function p(E){i.generateMipmap(E)}function w(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(E,b,F,$,K=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let q=b;if(b===i.RED&&(F===i.FLOAT&&(q=i.R32F),F===i.HALF_FLOAT&&(q=i.R16F),F===i.UNSIGNED_BYTE&&(q=i.R8)),b===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.R8UI),F===i.UNSIGNED_SHORT&&(q=i.R16UI),F===i.UNSIGNED_INT&&(q=i.R32UI),F===i.BYTE&&(q=i.R8I),F===i.SHORT&&(q=i.R16I),F===i.INT&&(q=i.R32I)),b===i.RG&&(F===i.FLOAT&&(q=i.RG32F),F===i.HALF_FLOAT&&(q=i.RG16F),F===i.UNSIGNED_BYTE&&(q=i.RG8)),b===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RG8UI),F===i.UNSIGNED_SHORT&&(q=i.RG16UI),F===i.UNSIGNED_INT&&(q=i.RG32UI),F===i.BYTE&&(q=i.RG8I),F===i.SHORT&&(q=i.RG16I),F===i.INT&&(q=i.RG32I)),b===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RGB8UI),F===i.UNSIGNED_SHORT&&(q=i.RGB16UI),F===i.UNSIGNED_INT&&(q=i.RGB32UI),F===i.BYTE&&(q=i.RGB8I),F===i.SHORT&&(q=i.RGB16I),F===i.INT&&(q=i.RGB32I)),b===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),F===i.UNSIGNED_INT&&(q=i.RGBA32UI),F===i.BYTE&&(q=i.RGBA8I),F===i.SHORT&&(q=i.RGBA16I),F===i.INT&&(q=i.RGBA32I)),b===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),b===i.RGBA){let Te=K?mo:tt.getTransfer($);F===i.FLOAT&&(q=i.RGBA32F),F===i.HALF_FLOAT&&(q=i.RGBA16F),F===i.UNSIGNED_BYTE&&(q=Te===ut?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function _(E,b){let F;return E?b===null||b===Xi||b===Ds?F=i.DEPTH24_STENCIL8:b===Dn?F=i.DEPTH32F_STENCIL8:b===fr&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Xi||b===Ds?F=i.DEPTH_COMPONENT24:b===Dn?F=i.DEPTH_COMPONENT32F:b===fr&&(F=i.DEPTH_COMPONENT16),F}function D(E,b){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==Xt&&E.minFilter!==un?Math.log2(Math.max(b.width,b.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?b.mipmaps.length:1}function C(E){let b=E.target;b.removeEventListener("dispose",C),T(b),b.isVideoTexture&&h.delete(b)}function I(E){let b=E.target;b.removeEventListener("dispose",I),v(b)}function T(E){let b=n.get(E);if(b.__webglInit===void 0)return;let F=E.source,$=d.get(F);if($){let K=$[b.__cacheKey];K.usedTimes--,K.usedTimes===0&&y(E),Object.keys($).length===0&&d.delete(F)}n.remove(E)}function y(E){let b=n.get(E);i.deleteTexture(b.__webglTexture);let F=E.source,$=d.get(F);delete $[b.__cacheKey],a.memory.textures--}function v(E){let b=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(b.__webglFramebuffer[$]))for(let K=0;K<b.__webglFramebuffer[$].length;K++)i.deleteFramebuffer(b.__webglFramebuffer[$][K]);else i.deleteFramebuffer(b.__webglFramebuffer[$]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[$])}else{if(Array.isArray(b.__webglFramebuffer))for(let $=0;$<b.__webglFramebuffer.length;$++)i.deleteFramebuffer(b.__webglFramebuffer[$]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let $=0;$<b.__webglColorRenderbuffer.length;$++)b.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[$]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let F=E.textures;for(let $=0,K=F.length;$<K;$++){let q=n.get(F[$]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),a.memory.textures--),n.remove(F[$])}n.remove(E)}let R=0;function z(){R=0}function O(){let E=R;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),R+=1,E}function V(E){let b=[];return b.push(E.wrapS),b.push(E.wrapT),b.push(E.wrapR||0),b.push(E.magFilter),b.push(E.minFilter),b.push(E.anisotropy),b.push(E.internalFormat),b.push(E.format),b.push(E.type),b.push(E.generateMipmaps),b.push(E.premultiplyAlpha),b.push(E.flipY),b.push(E.unpackAlignment),b.push(E.colorSpace),b.join()}function Z(E,b){let F=n.get(E);if(E.isVideoTexture&&ce(E),E.isRenderTargetTexture===!1&&E.version>0&&F.__version!==E.version){let $=E.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(F,E,b);return}}t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+b)}function G(E,b){let F=n.get(E);if(E.version>0&&F.__version!==E.version){Y(F,E,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+b)}function ne(E,b){let F=n.get(E);if(E.version>0&&F.__version!==E.version){Y(F,E,b);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+b)}function W(E,b){let F=n.get(E);if(E.version>0&&F.__version!==E.version){se(F,E,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+b)}let he={[_l]:i.REPEAT,[Gi]:i.CLAMP_TO_EDGE,[bl]:i.MIRRORED_REPEAT},xe={[Xt]:i.NEAREST,[Tf]:i.NEAREST_MIPMAP_NEAREST,[qr]:i.NEAREST_MIPMAP_LINEAR,[un]:i.LINEAR,[Ao]:i.LINEAR_MIPMAP_NEAREST,[Wi]:i.LINEAR_MIPMAP_LINEAR},we={[If]:i.NEVER,[Ff]:i.ALWAYS,[Pf]:i.LESS,[sd]:i.LEQUAL,[Lf]:i.EQUAL,[Nf]:i.GEQUAL,[Df]:i.GREATER,[Uf]:i.NOTEQUAL};function We(E,b){if(b.type===Dn&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===un||b.magFilter===Ao||b.magFilter===qr||b.magFilter===Wi||b.minFilter===un||b.minFilter===Ao||b.minFilter===qr||b.minFilter===Wi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,he[b.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,he[b.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,he[b.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,xe[b.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,xe[b.minFilter]),b.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,we[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Xt||b.minFilter!==qr&&b.minFilter!==Wi||b.type===Dn&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function st(E,b){let F=!1;E.__webglInit===void 0&&(E.__webglInit=!0,b.addEventListener("dispose",C));let $=b.source,K=d.get($);K===void 0&&(K={},d.set($,K));let q=V(b);if(q!==E.__cacheKey){K[q]===void 0&&(K[q]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),K[q].usedTimes++;let Te=K[E.__cacheKey];Te!==void 0&&(K[E.__cacheKey].usedTimes--,Te.usedTimes===0&&y(b)),E.__cacheKey=q,E.__webglTexture=K[q].texture}return F}function Y(E,b,F){let $=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&($=i.TEXTURE_3D);let K=st(E,b),q=b.source;t.bindTexture($,E.__webglTexture,i.TEXTURE0+F);let Te=n.get(q);if(q.version!==Te.__version||K===!0){t.activeTexture(i.TEXTURE0+F);let de=tt.getPrimaries(tt.workingColorSpace),ye=b.colorSpace===gi?null:tt.getPrimaries(b.colorSpace),Ke=b.colorSpace===gi||de===ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let te=x(b.image,!1,s.maxTextureSize);te=Ne(b,te);let Me=r.convert(b.format,b.colorSpace),Fe=r.convert(b.type),ke=M(b.internalFormat,Me,Fe,b.colorSpace,b.isVideoTexture);We($,b);let Se,Qe=b.mipmaps,Ze=b.isVideoTexture!==!0,gt=Te.__version===void 0||K===!0,L=q.dataReady,fe=D(b,te);if(b.isDepthTexture)ke=_(b.format===Us,b.type),gt&&(Ze?t.texStorage2D(i.TEXTURE_2D,1,ke,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,ke,te.width,te.height,0,Me,Fe,null));else if(b.isDataTexture)if(Qe.length>0){Ze&&gt&&t.texStorage2D(i.TEXTURE_2D,fe,ke,Qe[0].width,Qe[0].height);for(let X=0,j=Qe.length;X<j;X++)Se=Qe[X],Ze?L&&t.texSubImage2D(i.TEXTURE_2D,X,0,0,Se.width,Se.height,Me,Fe,Se.data):t.texImage2D(i.TEXTURE_2D,X,ke,Se.width,Se.height,0,Me,Fe,Se.data);b.generateMipmaps=!1}else Ze?(gt&&t.texStorage2D(i.TEXTURE_2D,fe,ke,te.width,te.height),L&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,te.width,te.height,Me,Fe,te.data)):t.texImage2D(i.TEXTURE_2D,0,ke,te.width,te.height,0,Me,Fe,te.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Ze&&gt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,ke,Qe[0].width,Qe[0].height,te.depth);for(let X=0,j=Qe.length;X<j;X++)if(Se=Qe[X],b.format!==wn)if(Me!==null)if(Ze){if(L)if(b.layerUpdates.size>0){let ge=Eu(Se.width,Se.height,b.format,b.type);for(let pe of b.layerUpdates){let Xe=Se.data.subarray(pe*ge/Se.data.BYTES_PER_ELEMENT,(pe+1)*ge/Se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,pe,Se.width,Se.height,1,Me,Xe)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,Se.width,Se.height,te.depth,Me,Se.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,X,ke,Se.width,Se.height,te.depth,0,Se.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ze?L&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,Se.width,Se.height,te.depth,Me,Fe,Se.data):t.texImage3D(i.TEXTURE_2D_ARRAY,X,ke,Se.width,Se.height,te.depth,0,Me,Fe,Se.data)}else{Ze&&gt&&t.texStorage2D(i.TEXTURE_2D,fe,ke,Qe[0].width,Qe[0].height);for(let X=0,j=Qe.length;X<j;X++)Se=Qe[X],b.format!==wn?Me!==null?Ze?L&&t.compressedTexSubImage2D(i.TEXTURE_2D,X,0,0,Se.width,Se.height,Me,Se.data):t.compressedTexImage2D(i.TEXTURE_2D,X,ke,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ze?L&&t.texSubImage2D(i.TEXTURE_2D,X,0,0,Se.width,Se.height,Me,Fe,Se.data):t.texImage2D(i.TEXTURE_2D,X,ke,Se.width,Se.height,0,Me,Fe,Se.data)}else if(b.isDataArrayTexture)if(Ze){if(gt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,ke,te.width,te.height,te.depth),L)if(b.layerUpdates.size>0){let X=Eu(te.width,te.height,b.format,b.type);for(let j of b.layerUpdates){let ge=te.data.subarray(j*X/te.data.BYTES_PER_ELEMENT,(j+1)*X/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,te.width,te.height,1,Me,Fe,ge)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,Me,Fe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ke,te.width,te.height,te.depth,0,Me,Fe,te.data);else if(b.isData3DTexture)Ze?(gt&&t.texStorage3D(i.TEXTURE_3D,fe,ke,te.width,te.height,te.depth),L&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,Me,Fe,te.data)):t.texImage3D(i.TEXTURE_3D,0,ke,te.width,te.height,te.depth,0,Me,Fe,te.data);else if(b.isFramebufferTexture){if(gt)if(Ze)t.texStorage2D(i.TEXTURE_2D,fe,ke,te.width,te.height);else{let X=te.width,j=te.height;for(let ge=0;ge<fe;ge++)t.texImage2D(i.TEXTURE_2D,ge,ke,X,j,0,Me,Fe,null),X>>=1,j>>=1}}else if(Qe.length>0){if(Ze&&gt){let X=ve(Qe[0]);t.texStorage2D(i.TEXTURE_2D,fe,ke,X.width,X.height)}for(let X=0,j=Qe.length;X<j;X++)Se=Qe[X],Ze?L&&t.texSubImage2D(i.TEXTURE_2D,X,0,0,Me,Fe,Se):t.texImage2D(i.TEXTURE_2D,X,ke,Me,Fe,Se);b.generateMipmaps=!1}else if(Ze){if(gt){let X=ve(te);t.texStorage2D(i.TEXTURE_2D,fe,ke,X.width,X.height)}L&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Me,Fe,te)}else t.texImage2D(i.TEXTURE_2D,0,ke,Me,Fe,te);m(b)&&p($),Te.__version=q.version,b.onUpdate&&b.onUpdate(b)}E.__version=b.version}function se(E,b,F){if(b.image.length!==6)return;let $=st(E,b),K=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+F);let q=n.get(K);if(K.version!==q.__version||$===!0){t.activeTexture(i.TEXTURE0+F);let Te=tt.getPrimaries(tt.workingColorSpace),de=b.colorSpace===gi?null:tt.getPrimaries(b.colorSpace),ye=b.colorSpace===gi||Te===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let Ke=b.isCompressedTexture||b.image[0].isCompressedTexture,te=b.image[0]&&b.image[0].isDataTexture,Me=[];for(let j=0;j<6;j++)!Ke&&!te?Me[j]=x(b.image[j],!0,s.maxCubemapSize):Me[j]=te?b.image[j].image:b.image[j],Me[j]=Ne(b,Me[j]);let Fe=Me[0],ke=r.convert(b.format,b.colorSpace),Se=r.convert(b.type),Qe=M(b.internalFormat,ke,Se,b.colorSpace),Ze=b.isVideoTexture!==!0,gt=q.__version===void 0||$===!0,L=K.dataReady,fe=D(b,Fe);We(i.TEXTURE_CUBE_MAP,b);let X;if(Ke){Ze&&gt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Qe,Fe.width,Fe.height);for(let j=0;j<6;j++){X=Me[j].mipmaps;for(let ge=0;ge<X.length;ge++){let pe=X[ge];b.format!==wn?ke!==null?Ze?L&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge,0,0,pe.width,pe.height,ke,pe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge,Qe,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ze?L&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge,0,0,pe.width,pe.height,ke,Se,pe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge,Qe,pe.width,pe.height,0,ke,Se,pe.data)}}}else{if(X=b.mipmaps,Ze&&gt){X.length>0&&fe++;let j=ve(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Qe,j.width,j.height)}for(let j=0;j<6;j++)if(te){Ze?L&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Me[j].width,Me[j].height,ke,Se,Me[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Qe,Me[j].width,Me[j].height,0,ke,Se,Me[j].data);for(let ge=0;ge<X.length;ge++){let Xe=X[ge].image[j].image;Ze?L&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge+1,0,0,Xe.width,Xe.height,ke,Se,Xe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge+1,Qe,Xe.width,Xe.height,0,ke,Se,Xe.data)}}else{Ze?L&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ke,Se,Me[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Qe,ke,Se,Me[j]);for(let ge=0;ge<X.length;ge++){let pe=X[ge];Ze?L&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge+1,0,0,ke,Se,pe.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ge+1,Qe,ke,Se,pe.image[j])}}}m(b)&&p(i.TEXTURE_CUBE_MAP),q.__version=K.version,b.onUpdate&&b.onUpdate(b)}E.__version=b.version}function Ee(E,b,F,$,K,q){let Te=r.convert(F.format,F.colorSpace),de=r.convert(F.type),ye=M(F.internalFormat,Te,de,F.colorSpace),Ke=n.get(b),te=n.get(F);if(te.__renderTarget=b,!Ke.__hasExternalTextures){let Me=Math.max(1,b.width>>q),Fe=Math.max(1,b.height>>q);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,q,ye,Me,Fe,b.depth,0,Te,de,null):t.texImage2D(K,q,ye,Me,Fe,0,Te,de,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),be(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,K,te.__webglTexture,0,ee(b)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,K,te.__webglTexture,q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function le(E,b,F){if(i.bindRenderbuffer(i.RENDERBUFFER,E),b.depthBuffer){let $=b.depthTexture,K=$&&$.isDepthTexture?$.type:null,q=_(b.stencilBuffer,K),Te=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=ee(b);be(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,de,q,b.width,b.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,de,q,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,q,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Te,i.RENDERBUFFER,E)}else{let $=b.textures;for(let K=0;K<$.length;K++){let q=$[K],Te=r.convert(q.format,q.colorSpace),de=r.convert(q.type),ye=M(q.internalFormat,Te,de,q.colorSpace),Ke=ee(b);F&&be(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ke,ye,b.width,b.height):be(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ke,ye,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ye,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function De(E,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let $=n.get(b.depthTexture);$.__renderTarget=b,(!$.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),Z(b.depthTexture,0);let K=$.__webglTexture,q=ee(b);if(b.depthTexture.format===As)be(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(b.depthTexture.format===Us)be(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function ze(E){let b=n.get(E),F=E.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==E.depthTexture){let $=E.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),$){let K=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,$.removeEventListener("dispose",K)};$.addEventListener("dispose",K),b.__depthDisposeCallback=K}b.__boundDepthTexture=$}if(E.depthTexture&&!b.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");De(b.__webglFramebuffer,E)}else if(F){b.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[$]),b.__webglDepthbuffer[$]===void 0)b.__webglDepthbuffer[$]=i.createRenderbuffer(),le(b.__webglDepthbuffer[$],E,!1);else{let K=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=b.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,q)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),le(b.__webglDepthbuffer,E,!1);else{let $=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,K)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(E,b,F){let $=n.get(E);b!==void 0&&Ee($.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&ze(E)}function et(E){let b=E.texture,F=n.get(E),$=n.get(b);E.addEventListener("dispose",I);let K=E.textures,q=E.isWebGLCubeRenderTarget===!0,Te=K.length>1;if(Te||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=b.version,a.memory.textures++),q){F.__webglFramebuffer=[];for(let de=0;de<6;de++)if(b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer[de]=[];for(let ye=0;ye<b.mipmaps.length;ye++)F.__webglFramebuffer[de][ye]=i.createFramebuffer()}else F.__webglFramebuffer[de]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer=[];for(let de=0;de<b.mipmaps.length;de++)F.__webglFramebuffer[de]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Te)for(let de=0,ye=K.length;de<ye;de++){let Ke=n.get(K[de]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&be(E)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let de=0;de<K.length;de++){let ye=K[de];F.__webglColorRenderbuffer[de]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[de]);let Ke=r.convert(ye.format,ye.colorSpace),te=r.convert(ye.type),Me=M(ye.internalFormat,Ke,te,ye.colorSpace,E.isXRRenderTarget===!0),Fe=ee(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Fe,Me,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,F.__webglColorRenderbuffer[de])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),le(F.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),We(i.TEXTURE_CUBE_MAP,b);for(let de=0;de<6;de++)if(b.mipmaps&&b.mipmaps.length>0)for(let ye=0;ye<b.mipmaps.length;ye++)Ee(F.__webglFramebuffer[de][ye],E,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,ye);else Ee(F.__webglFramebuffer[de],E,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(b)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let de=0,ye=K.length;de<ye;de++){let Ke=K[de],te=n.get(Ke);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),We(i.TEXTURE_2D,Ke),Ee(F.__webglFramebuffer,E,Ke,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,0),m(Ke)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let de=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(de=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(de,$.__webglTexture),We(de,b),b.mipmaps&&b.mipmaps.length>0)for(let ye=0;ye<b.mipmaps.length;ye++)Ee(F.__webglFramebuffer[ye],E,b,i.COLOR_ATTACHMENT0,de,ye);else Ee(F.__webglFramebuffer,E,b,i.COLOR_ATTACHMENT0,de,0);m(b)&&p(de),t.unbindTexture()}E.depthBuffer&&ze(E)}function J(E){let b=E.textures;for(let F=0,$=b.length;F<$;F++){let K=b[F];if(m(K)){let q=w(E),Te=n.get(K).__webglTexture;t.bindTexture(q,Te),p(q),t.unbindTexture()}}}let ie=[],A=[];function Ie(E){if(E.samples>0){if(be(E)===!1){let b=E.textures,F=E.width,$=E.height,K=i.COLOR_BUFFER_BIT,q=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Te=n.get(E),de=b.length>1;if(de)for(let ye=0;ye<b.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ye=0;ye<b.length;ye++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),de){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);let Ke=n.get(b[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ke,0)}i.blitFramebuffer(0,0,F,$,0,0,F,$,K,i.NEAREST),l===!0&&(ie.length=0,A.length=0,ie.push(i.COLOR_ATTACHMENT0+ye),E.depthBuffer&&E.resolveDepthBuffer===!1&&(ie.push(q),A.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,A)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ie))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),de)for(let ye=0;ye<b.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);let Ke=n.get(b[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,Ke,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){let b=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function ee(E){return Math.min(s.maxSamples,E.samples)}function be(E){let b=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ce(E){let b=a.render.frame;h.get(E)!==b&&(h.set(E,b),E.update())}function Ne(E,b){let F=E.colorSpace,$=E.format,K=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||F!==Hs&&F!==gi&&(tt.getTransfer(F)===ut?($!==wn||K!==ti)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),b}function ve(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=z,this.setTexture2D=Z,this.setTexture2DArray=G,this.setTexture3D=ne,this.setTextureCube=W,this.rebindTextures=Oe,this.setupRenderTarget=et,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=Ie,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=be}function Cx(i,e){function t(n,s=gi){let r,a=tt.getTransfer(s);if(n===ti)return i.UNSIGNED_BYTE;if(n===Vc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Gc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ju)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Yu)return i.BYTE;if(n===Zu)return i.SHORT;if(n===fr)return i.UNSIGNED_SHORT;if(n===Hc)return i.INT;if(n===Xi)return i.UNSIGNED_INT;if(n===Dn)return i.FLOAT;if(n===Lr)return i.HALF_FLOAT;if(n===Ju)return i.ALPHA;if(n===Ku)return i.RGB;if(n===wn)return i.RGBA;if(n===Qu)return i.LUMINANCE;if(n===ed)return i.LUMINANCE_ALPHA;if(n===As)return i.DEPTH_COMPONENT;if(n===Us)return i.DEPTH_STENCIL;if(n===Wc)return i.RED;if(n===Xc)return i.RED_INTEGER;if(n===td)return i.RG;if(n===$c)return i.RG_INTEGER;if(n===qc)return i.RGBA_INTEGER;if(n===Ta||n===Aa||n===Ca||n===Ra)if(a===ut)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ta)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ca)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ta)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ca)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ml||n===Sl||n===wl||n===El)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Tl||n===Al||n===Cl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Tl||n===Al)return a===ut?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Cl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Rl||n===Il||n===Pl||n===Ll||n===Dl||n===Ul||n===Nl||n===Fl||n===Ol||n===kl||n===Bl||n===zl||n===Hl||n===Vl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Rl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Il)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ll)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Dl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ul)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Nl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ol)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===kl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Bl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===zl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Hl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ia||n===Gl||n===Wl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ia)return a===ut?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Gl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Wl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nd||n===Xl||n===$l||n===ql)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ia)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Xl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$l)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ql)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ds?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var hc=class extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},En=class extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Rx={type:"move"},cr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new En,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new En,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new En,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Rx)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new En;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ix=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Px=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,uc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new jt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Fn({vertexShader:Ix,fragmentShader:Px,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ot(new $i(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},dc=class extends bi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,x=new uc,m=t.getContextAttributes(),p=null,w=null,M=[],_=[],D=new ae,C=null,I=new Zt;I.viewport=new wt;let T=new Zt;T.viewport=new wt;let y=[I,T],v=new hc,R=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let se=M[Y];return se===void 0&&(se=new cr,M[Y]=se),se.getTargetRaySpace()},this.getControllerGrip=function(Y){let se=M[Y];return se===void 0&&(se=new cr,M[Y]=se),se.getGripSpace()},this.getHand=function(Y){let se=M[Y];return se===void 0&&(se=new cr,M[Y]=se),se.getHandSpace()};function O(Y){let se=_.indexOf(Y.inputSource);if(se===-1)return;let Ee=M[se];Ee!==void 0&&(Ee.update(Y.inputSource,Y.frame,c||a),Ee.dispatchEvent({type:Y.type,data:Y.inputSource}))}function V(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",Z);for(let Y=0;Y<M.length;Y++){let se=_[Y];se!==null&&(_[Y]=null,M[Y].disconnect(se))}R=null,z=null,x.reset(),e.setRenderTarget(p),f=null,d=null,u=null,s=null,w=null,st.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",V),s.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(D),s.renderState.layers===void 0){let se={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,se),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new ni(f.framebufferWidth,f.framebufferHeight,{format:wn,type:ti,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let se=null,Ee=null,le=null;m.depth&&(le=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=m.stencil?Us:As,Ee=m.stencil?Ds:Xi);let De={colorFormat:t.RGBA8,depthFormat:le,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(De),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),w=new ni(d.textureWidth,d.textureHeight,{format:wn,type:ti,depthTexture:new za(d.textureWidth,d.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),st.setContext(s),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function Z(Y){for(let se=0;se<Y.removed.length;se++){let Ee=Y.removed[se],le=_.indexOf(Ee);le>=0&&(_[le]=null,M[le].disconnect(Ee))}for(let se=0;se<Y.added.length;se++){let Ee=Y.added[se],le=_.indexOf(Ee);if(le===-1){for(let ze=0;ze<M.length;ze++)if(ze>=_.length){_.push(Ee),le=ze;break}else if(_[ze]===null){_[ze]=Ee,le=ze;break}if(le===-1)break}let De=M[le];De&&De.connect(Ee)}}let G=new P,ne=new P;function W(Y,se,Ee){G.setFromMatrixPosition(se.matrixWorld),ne.setFromMatrixPosition(Ee.matrixWorld);let le=G.distanceTo(ne),De=se.projectionMatrix.elements,ze=Ee.projectionMatrix.elements,Oe=De[14]/(De[10]-1),et=De[14]/(De[10]+1),J=(De[9]+1)/De[5],ie=(De[9]-1)/De[5],A=(De[8]-1)/De[0],Ie=(ze[8]+1)/ze[0],ee=Oe*A,be=Oe*Ie,ce=le/(-A+Ie),Ne=ce*-A;if(se.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ne),Y.translateZ(ce),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),De[10]===-1)Y.projectionMatrix.copy(se.projectionMatrix),Y.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{let ve=Oe+ce,E=et+ce,b=ee-Ne,F=be+(le-Ne),$=J*et/E*ve,K=ie*et/E*ve;Y.projectionMatrix.makePerspective(b,F,$,K,ve,E),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function he(Y,se){se===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(se.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let se=Y.near,Ee=Y.far;x.texture!==null&&(x.depthNear>0&&(se=x.depthNear),x.depthFar>0&&(Ee=x.depthFar)),v.near=T.near=I.near=se,v.far=T.far=I.far=Ee,(R!==v.near||z!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),R=v.near,z=v.far),I.layers.mask=Y.layers.mask|2,T.layers.mask=Y.layers.mask|4,v.layers.mask=I.layers.mask|T.layers.mask;let le=Y.parent,De=v.cameras;he(v,le);for(let ze=0;ze<De.length;ze++)he(De[ze],le);De.length===2?W(v,I,T):v.projectionMatrix.copy(I.projectionMatrix),xe(Y,v,le)};function xe(Y,se,Ee){Ee===null?Y.matrix.copy(se.matrixWorld):(Y.matrix.copy(Ee.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(se.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(se.projectionMatrix),Y.projectionMatrixInverse.copy(se.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=jl*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(v)};let we=null;function We(Y,se){if(h=se.getViewerPose(c||a),g=se,h!==null){let Ee=h.views;f!==null&&(e.setRenderTargetFramebuffer(w,f.framebuffer),e.setRenderTarget(w));let le=!1;Ee.length!==v.cameras.length&&(v.cameras.length=0,le=!0);for(let ze=0;ze<Ee.length;ze++){let Oe=Ee[ze],et=null;if(f!==null)et=f.getViewport(Oe);else{let ie=u.getViewSubImage(d,Oe);et=ie.viewport,ze===0&&(e.setRenderTargetTextures(w,ie.colorTexture,d.ignoreDepthValues?void 0:ie.depthStencilTexture),e.setRenderTarget(w))}let J=y[ze];J===void 0&&(J=new Zt,J.layers.enable(ze),J.viewport=new wt,y[ze]=J),J.matrix.fromArray(Oe.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Oe.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(et.x,et.y,et.width,et.height),ze===0&&(v.matrix.copy(J.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),le===!0&&v.cameras.push(J)}let De=s.enabledFeatures;if(De&&De.includes("depth-sensing")){let ze=u.getDepthInformation(Ee[0]);ze&&ze.isValid&&ze.texture&&x.init(e,ze,s.renderState)}}for(let Ee=0;Ee<M.length;Ee++){let le=_[Ee],De=M[Ee];le!==null&&De!==void 0&&De.update(le,se,c||a)}we&&we(Y,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),g=null}let st=new ld;st.setAnimationLoop(We),this.setAnimationLoop=function(Y){we=Y},this.dispose=function(){}}},Bi=new Un,Lx=new it;function Dx(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,od(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,w,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,w,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===tn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===tn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let w=e.get(p),M=w.envMap,_=w.envMapRotation;M&&(m.envMap.value=M,Bi.copy(_),Bi.x*=-1,Bi.y*=-1,Bi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Bi.y*=-1,Bi.z*=-1),m.envMapRotation.value.setFromMatrix4(Lx.makeRotationFromEuler(Bi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,w,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*w,m.scale.value=M*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,w){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===tn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let w=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Ux(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,M){let _=M.program;n.uniformBlockBinding(w,_)}function c(w,M){let _=s[w.id];_===void 0&&(g(w),_=h(w),s[w.id]=_,w.addEventListener("dispose",m));let D=M.program;n.updateUBOMapping(w,D);let C=e.render.frame;r[w.id]!==C&&(d(w),r[w.id]=C)}function h(w){let M=u();w.__bindingPointIndex=M;let _=i.createBuffer(),D=w.__size,C=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,D,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function u(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){let M=s[w.id],_=w.uniforms,D=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let C=0,I=_.length;C<I;C++){let T=Array.isArray(_[C])?_[C]:[_[C]];for(let y=0,v=T.length;y<v;y++){let R=T[y];if(f(R,C,y,D)===!0){let z=R.__offset,O=Array.isArray(R.value)?R.value:[R.value],V=0;for(let Z=0;Z<O.length;Z++){let G=O[Z],ne=x(G);typeof G=="number"||typeof G=="boolean"?(R.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,z+V,R.__data)):G.isMatrix3?(R.__data[0]=G.elements[0],R.__data[1]=G.elements[1],R.__data[2]=G.elements[2],R.__data[3]=0,R.__data[4]=G.elements[3],R.__data[5]=G.elements[4],R.__data[6]=G.elements[5],R.__data[7]=0,R.__data[8]=G.elements[6],R.__data[9]=G.elements[7],R.__data[10]=G.elements[8],R.__data[11]=0):(G.toArray(R.__data,V),V+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(w,M,_,D){let C=w.value,I=M+"_"+_;if(D[I]===void 0)return typeof C=="number"||typeof C=="boolean"?D[I]=C:D[I]=C.clone(),!0;{let T=D[I];if(typeof C=="number"||typeof C=="boolean"){if(T!==C)return D[I]=C,!0}else if(T.equals(C)===!1)return T.copy(C),!0}return!1}function g(w){let M=w.uniforms,_=0,D=16;for(let I=0,T=M.length;I<T;I++){let y=Array.isArray(M[I])?M[I]:[M[I]];for(let v=0,R=y.length;v<R;v++){let z=y[v],O=Array.isArray(z.value)?z.value:[z.value];for(let V=0,Z=O.length;V<Z;V++){let G=O[V],ne=x(G),W=_%D,he=W%ne.boundary,xe=W+he;_+=he,xe!==0&&D-xe<ne.storage&&(_+=D-xe),z.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=_,_+=ne.storage}}}let C=_%D;return C>0&&(_+=D-C),w.__size=_,w.__cache={},this}function x(w){let M={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(M.boundary=4,M.storage=4):w.isVector2?(M.boundary=8,M.storage=8):w.isVector3||w.isColor?(M.boundary=16,M.storage=12):w.isVector4?(M.boundary=16,M.storage=16):w.isMatrix3?(M.boundary=48,M.storage=48):w.isMatrix4?(M.boundary=64,M.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),M}function m(w){let M=w.target;M.removeEventListener("dispose",m);let _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(let w in s)i.deleteBuffer(s[w]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}var xr=class{constructor(e={}){let{canvas:t=kf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;let g=new Uint32Array(4),x=new Int32Array(4),m=null,p=null,w=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Gt,this.toneMapping=yi,this.toneMappingExposure=1;let _=this,D=!1,C=0,I=0,T=null,y=-1,v=null,R=new wt,z=new wt,O=null,V=new Je(0),Z=0,G=t.width,ne=t.height,W=1,he=null,xe=null,we=new wt(0,0,G,ne),We=new wt(0,0,G,ne),st=!1,Y=new gr,se=!1,Ee=!1,le=new it,De=new it,ze=new P,Oe=new wt,et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},J=!1;function ie(){return T===null?W:1}let A=n;function Ie(S,U){return t.getContext(S,U)}try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${kc}`),t.addEventListener("webglcontextlost",j,!1),t.addEventListener("webglcontextrestored",ge,!1),t.addEventListener("webglcontextcreationerror",pe,!1),A===null){let U="webgl2";if(A=Ie(U,S),A===null)throw Ie(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let ee,be,ce,Ne,ve,E,b,F,$,K,q,Te,de,ye,Ke,te,Me,Fe,ke,Se,Qe,Ze,gt,L;function fe(){ee=new jg(A),ee.init(),Ze=new Cx(A,ee),be=new Wg(A,ee,e,Ze),ce=new Ex(A,ee),be.reverseDepthBuffer&&d&&ce.buffers.depth.setReversed(!0),Ne=new Qg(A),ve=new dx,E=new Ax(A,ee,ce,ve,be,Ze,Ne),b=new $g(_),F=new Zg(_),$=new ap(A),gt=new Vg(A,$),K=new Jg(A,$,Ne,gt),q=new t0(A,K,$,Ne),ke=new e0(A,be,E),te=new Xg(ve),Te=new ux(_,b,F,ee,be,gt,te),de=new Dx(_,ve),ye=new px,Ke=new _x(ee),Fe=new Hg(_,b,F,ce,q,f,l),Me=new Sx(_,q,be),L=new Ux(A,Ne,be,ce),Se=new Gg(A,ee,Ne),Qe=new Kg(A,ee,Ne),Ne.programs=Te.programs,_.capabilities=be,_.extensions=ee,_.properties=ve,_.renderLists=ye,_.shadowMap=Me,_.state=ce,_.info=Ne}fe();let X=new dc(_,A);this.xr=X,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){let S=ee.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=ee.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(S){S!==void 0&&(W=S,this.setSize(G,ne,!1))},this.getSize=function(S){return S.set(G,ne)},this.setSize=function(S,U,B=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=S,ne=U,t.width=Math.floor(S*W),t.height=Math.floor(U*W),B===!0&&(t.style.width=S+"px",t.style.height=U+"px"),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(G*W,ne*W).floor()},this.setDrawingBufferSize=function(S,U,B){G=S,ne=U,W=B,t.width=Math.floor(S*B),t.height=Math.floor(U*B),this.setViewport(0,0,S,U)},this.getCurrentViewport=function(S){return S.copy(R)},this.getViewport=function(S){return S.copy(we)},this.setViewport=function(S,U,B,H){S.isVector4?we.set(S.x,S.y,S.z,S.w):we.set(S,U,B,H),ce.viewport(R.copy(we).multiplyScalar(W).round())},this.getScissor=function(S){return S.copy(We)},this.setScissor=function(S,U,B,H){S.isVector4?We.set(S.x,S.y,S.z,S.w):We.set(S,U,B,H),ce.scissor(z.copy(We).multiplyScalar(W).round())},this.getScissorTest=function(){return st},this.setScissorTest=function(S){ce.setScissorTest(st=S)},this.setOpaqueSort=function(S){he=S},this.setTransparentSort=function(S){xe=S},this.getClearColor=function(S){return S.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor.apply(Fe,arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha.apply(Fe,arguments)},this.clear=function(S=!0,U=!0,B=!0){let H=0;if(S){let N=!1;if(T!==null){let re=T.texture.format;N=re===qc||re===$c||re===Xc}if(N){let re=T.texture.type,me=re===ti||re===Xi||re===fr||re===Ds||re===Vc||re===Gc,Ae=Fe.getClearColor(),Ce=Fe.getClearAlpha(),He=Ae.r,$e=Ae.g,Re=Ae.b;me?(g[0]=He,g[1]=$e,g[2]=Re,g[3]=Ce,A.clearBufferuiv(A.COLOR,0,g)):(x[0]=He,x[1]=$e,x[2]=Re,x[3]=Ce,A.clearBufferiv(A.COLOR,0,x))}else H|=A.COLOR_BUFFER_BIT}U&&(H|=A.DEPTH_BUFFER_BIT),B&&(H|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",j,!1),t.removeEventListener("webglcontextrestored",ge,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),ye.dispose(),Ke.dispose(),ve.dispose(),b.dispose(),F.dispose(),q.dispose(),gt.dispose(),L.dispose(),Te.dispose(),X.dispose(),X.removeEventListener("sessionstart",hh),X.removeEventListener("sessionend",uh),Ii.stop()};function j(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;let S=Ne.autoReset,U=Me.enabled,B=Me.autoUpdate,H=Me.needsUpdate,N=Me.type;fe(),Ne.autoReset=S,Me.enabled=U,Me.autoUpdate=B,Me.needsUpdate=H,Me.type=N}function pe(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Xe(S){let U=S.target;U.removeEventListener("dispose",Xe),St(U)}function St(S){zt(S),ve.remove(S)}function zt(S){let U=ve.get(S).programs;U!==void 0&&(U.forEach(function(B){Te.releaseProgram(B)}),S.isShaderMaterial&&Te.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,B,H,N,re){U===null&&(U=et);let me=N.isMesh&&N.matrixWorld.determinant()<0,Ae=Xd(S,U,B,H,N);ce.setMaterial(H,me);let Ce=B.index,He=1;if(H.wireframe===!0){if(Ce=K.getWireframeAttribute(B),Ce===void 0)return;He=2}let $e=B.drawRange,Re=B.attributes.position,nt=$e.start*He,xt=($e.start+$e.count)*He;re!==null&&(nt=Math.max(nt,re.start*He),xt=Math.min(xt,(re.start+re.count)*He)),Ce!==null?(nt=Math.max(nt,0),xt=Math.min(xt,Ce.count)):Re!=null&&(nt=Math.max(nt,0),xt=Math.min(xt,Re.count));let vt=xt-nt;if(vt<0||vt===1/0)return;gt.setup(N,H,Ae,B,Ce);let Kt,rt=Se;if(Ce!==null&&(Kt=$.get(Ce),rt=Qe,rt.setIndex(Kt)),N.isMesh)H.wireframe===!0?(ce.setLineWidth(H.wireframeLinewidth*ie()),rt.setMode(A.LINES)):rt.setMode(A.TRIANGLES);else if(N.isLine){let Pe=H.linewidth;Pe===void 0&&(Pe=1),ce.setLineWidth(Pe*ie()),N.isLineSegments?rt.setMode(A.LINES):N.isLineLoop?rt.setMode(A.LINE_LOOP):rt.setMode(A.LINE_STRIP)}else N.isPoints?rt.setMode(A.POINTS):N.isSprite&&rt.setMode(A.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)rt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(ee.get("WEBGL_multi_draw"))rt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let Pe=N._multiDrawStarts,Gn=N._multiDrawCounts,at=N._multiDrawCount,gn=Ce?$.get(Ce).bytesPerElement:1,ns=ve.get(H).currentProgram.getUniforms();for(let sn=0;sn<at;sn++)ns.setValue(A,"_gl_DrawID",sn),rt.render(Pe[sn]/gn,Gn[sn])}else if(N.isInstancedMesh)rt.renderInstances(nt,vt,N.count);else if(B.isInstancedBufferGeometry){let Pe=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Gn=Math.min(B.instanceCount,Pe);rt.renderInstances(nt,vt,Gn)}else rt.render(nt,vt)};function lt(S,U,B){S.transparent===!0&&S.side===en&&S.forceSinglePass===!1?(S.side=tn,S.needsUpdate=!0,Gr(S,U,B),S.side=_i,S.needsUpdate=!0,Gr(S,U,B),S.side=en):Gr(S,U,B)}this.compile=function(S,U,B=null){B===null&&(B=S),p=Ke.get(B),p.init(U),M.push(p),B.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),S!==B&&S.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();let H=new Set;return S.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let re=N.material;if(re)if(Array.isArray(re))for(let me=0;me<re.length;me++){let Ae=re[me];lt(Ae,B,N),H.add(Ae)}else lt(re,B,N),H.add(re)}),M.pop(),p=null,H},this.compileAsync=function(S,U,B=null){let H=this.compile(S,U,B);return new Promise(N=>{function re(){if(H.forEach(function(me){ve.get(me).currentProgram.isReady()&&H.delete(me)}),H.size===0){N(S);return}setTimeout(re,10)}ee.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let mn=null;function Vn(S){mn&&mn(S)}function hh(){Ii.stop()}function uh(){Ii.start()}let Ii=new ld;Ii.setAnimationLoop(Vn),typeof self<"u"&&Ii.setContext(self),this.setAnimationLoop=function(S){mn=S,X.setAnimationLoop(S),S===null?Ii.stop():Ii.start()},X.addEventListener("sessionstart",hh),X.addEventListener("sessionend",uh),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(U),U=X.getCamera()),S.isScene===!0&&S.onBeforeRender(_,S,U,T),p=Ke.get(S,M.length),p.init(U),M.push(p),De.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Y.setFromProjectionMatrix(De),Ee=this.localClippingEnabled,se=te.init(this.clippingPlanes,Ee),m=ye.get(S,w.length),m.init(),w.push(m),X.enabled===!0&&X.isPresenting===!0){let re=_.xr.getDepthSensingMesh();re!==null&&So(re,U,-1/0,_.sortObjects)}So(S,U,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(he,xe),J=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,J&&Fe.addToRenderList(m,S),this.info.render.frame++,se===!0&&te.beginShadows();let B=p.state.shadowsArray;Me.render(B,S,U),se===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();let H=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){let re=U.cameras;if(N.length>0)for(let me=0,Ae=re.length;me<Ae;me++){let Ce=re[me];fh(H,N,S,Ce)}J&&Fe.render(S);for(let me=0,Ae=re.length;me<Ae;me++){let Ce=re[me];dh(m,S,Ce,Ce.viewport)}}else N.length>0&&fh(H,N,S,U),J&&Fe.render(S),dh(m,S,U);T!==null&&(E.updateMultisampleRenderTarget(T),E.updateRenderTargetMipmap(T)),S.isScene===!0&&S.onAfterRender(_,S,U),gt.resetDefaultState(),y=-1,v=null,M.pop(),M.length>0?(p=M[M.length-1],se===!0&&te.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function So(S,U,B,H){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)B=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Y.intersectsSprite(S)){H&&Oe.setFromMatrixPosition(S.matrixWorld).applyMatrix4(De);let me=q.update(S),Ae=S.material;Ae.visible&&m.push(S,me,Ae,B,Oe.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Y.intersectsObject(S))){let me=q.update(S),Ae=S.material;if(H&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Oe.copy(S.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),Oe.copy(me.boundingSphere.center)),Oe.applyMatrix4(S.matrixWorld).applyMatrix4(De)),Array.isArray(Ae)){let Ce=me.groups;for(let He=0,$e=Ce.length;He<$e;He++){let Re=Ce[He],nt=Ae[Re.materialIndex];nt&&nt.visible&&m.push(S,me,nt,B,Oe.z,Re)}}else Ae.visible&&m.push(S,me,Ae,B,Oe.z,null)}}let re=S.children;for(let me=0,Ae=re.length;me<Ae;me++)So(re[me],U,B,H)}function dh(S,U,B,H){let N=S.opaque,re=S.transmissive,me=S.transparent;p.setupLightsView(B),se===!0&&te.setGlobalState(_.clippingPlanes,B),H&&ce.viewport(R.copy(H)),N.length>0&&Vr(N,U,B),re.length>0&&Vr(re,U,B),me.length>0&&Vr(me,U,B),ce.buffers.depth.setTest(!0),ce.buffers.depth.setMask(!0),ce.buffers.color.setMask(!0),ce.setPolygonOffset(!1)}function fh(S,U,B,H){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[H.id]===void 0&&(p.state.transmissionRenderTarget[H.id]=new ni(1,1,{generateMipmaps:!0,type:ee.has("EXT_color_buffer_half_float")||ee.has("EXT_color_buffer_float")?Lr:ti,minFilter:Wi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let re=p.state.transmissionRenderTarget[H.id],me=H.viewport||R;re.setSize(me.z,me.w);let Ae=_.getRenderTarget();_.setRenderTarget(re),_.getClearColor(V),Z=_.getClearAlpha(),Z<1&&_.setClearColor(16777215,.5),_.clear(),J&&Fe.render(B);let Ce=_.toneMapping;_.toneMapping=yi;let He=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),p.setupLightsView(H),se===!0&&te.setGlobalState(_.clippingPlanes,H),Vr(S,B,H),E.updateMultisampleRenderTarget(re),E.updateRenderTargetMipmap(re),ee.has("WEBGL_multisampled_render_to_texture")===!1){let $e=!1;for(let Re=0,nt=U.length;Re<nt;Re++){let xt=U[Re],vt=xt.object,Kt=xt.geometry,rt=xt.material,Pe=xt.group;if(rt.side===en&&vt.layers.test(H.layers)){let Gn=rt.side;rt.side=tn,rt.needsUpdate=!0,ph(vt,B,H,Kt,rt,Pe),rt.side=Gn,rt.needsUpdate=!0,$e=!0}}$e===!0&&(E.updateMultisampleRenderTarget(re),E.updateRenderTargetMipmap(re))}_.setRenderTarget(Ae),_.setClearColor(V,Z),He!==void 0&&(H.viewport=He),_.toneMapping=Ce}function Vr(S,U,B){let H=U.isScene===!0?U.overrideMaterial:null;for(let N=0,re=S.length;N<re;N++){let me=S[N],Ae=me.object,Ce=me.geometry,He=H===null?me.material:H,$e=me.group;Ae.layers.test(B.layers)&&ph(Ae,U,B,Ce,He,$e)}}function ph(S,U,B,H,N,re){S.onBeforeRender(_,U,B,H,N,re),S.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),N.onBeforeRender(_,U,B,H,S,re),N.transparent===!0&&N.side===en&&N.forceSinglePass===!1?(N.side=tn,N.needsUpdate=!0,_.renderBufferDirect(B,U,H,N,S,re),N.side=_i,N.needsUpdate=!0,_.renderBufferDirect(B,U,H,N,S,re),N.side=en):_.renderBufferDirect(B,U,H,N,S,re),S.onAfterRender(_,U,B,H,N,re)}function Gr(S,U,B){U.isScene!==!0&&(U=et);let H=ve.get(S),N=p.state.lights,re=p.state.shadowsArray,me=N.state.version,Ae=Te.getParameters(S,N.state,re,U,B),Ce=Te.getProgramCacheKey(Ae),He=H.programs;H.environment=S.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(S.isMeshStandardMaterial?F:b).get(S.envMap||H.environment),H.envMapRotation=H.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,He===void 0&&(S.addEventListener("dispose",Xe),He=new Map,H.programs=He);let $e=He.get(Ce);if($e!==void 0){if(H.currentProgram===$e&&H.lightsStateVersion===me)return gh(S,Ae),$e}else Ae.uniforms=Te.getUniforms(S),S.onBeforeCompile(Ae,_),$e=Te.acquireProgram(Ae,Ce),He.set(Ce,$e),H.uniforms=Ae.uniforms;let Re=H.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Re.clippingPlanes=te.uniform),gh(S,Ae),H.needsLights=qd(S),H.lightsStateVersion=me,H.needsLights&&(Re.ambientLightColor.value=N.state.ambient,Re.lightProbe.value=N.state.probe,Re.directionalLights.value=N.state.directional,Re.directionalLightShadows.value=N.state.directionalShadow,Re.spotLights.value=N.state.spot,Re.spotLightShadows.value=N.state.spotShadow,Re.rectAreaLights.value=N.state.rectArea,Re.ltc_1.value=N.state.rectAreaLTC1,Re.ltc_2.value=N.state.rectAreaLTC2,Re.pointLights.value=N.state.point,Re.pointLightShadows.value=N.state.pointShadow,Re.hemisphereLights.value=N.state.hemi,Re.directionalShadowMap.value=N.state.directionalShadowMap,Re.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Re.spotShadowMap.value=N.state.spotShadowMap,Re.spotLightMatrix.value=N.state.spotLightMatrix,Re.spotLightMap.value=N.state.spotLightMap,Re.pointShadowMap.value=N.state.pointShadowMap,Re.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=$e,H.uniformsList=null,$e}function mh(S){if(S.uniformsList===null){let U=S.currentProgram.getUniforms();S.uniformsList=Rs.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function gh(S,U){let B=ve.get(S);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.batchingColor=U.batchingColor,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.instancingMorph=U.instancingMorph,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Xd(S,U,B,H,N){U.isScene!==!0&&(U=et),E.resetTextureUnits();let re=U.fog,me=H.isMeshStandardMaterial?U.environment:null,Ae=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Hs,Ce=(H.isMeshStandardMaterial?F:b).get(H.envMap||me),He=H.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,$e=!!B.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Re=!!B.morphAttributes.position,nt=!!B.morphAttributes.normal,xt=!!B.morphAttributes.color,vt=yi;H.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(vt=_.toneMapping);let Kt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,rt=Kt!==void 0?Kt.length:0,Pe=ve.get(H),Gn=p.state.lights;if(se===!0&&(Ee===!0||S!==v)){let ln=S===v&&H.id===y;te.setState(H,S,ln)}let at=!1;H.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==Gn.state.version||Pe.outputColorSpace!==Ae||N.isBatchedMesh&&Pe.batching===!1||!N.isBatchedMesh&&Pe.batching===!0||N.isBatchedMesh&&Pe.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Pe.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Pe.instancing===!1||!N.isInstancedMesh&&Pe.instancing===!0||N.isSkinnedMesh&&Pe.skinning===!1||!N.isSkinnedMesh&&Pe.skinning===!0||N.isInstancedMesh&&Pe.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Pe.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Pe.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Pe.instancingMorph===!1&&N.morphTexture!==null||Pe.envMap!==Ce||H.fog===!0&&Pe.fog!==re||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==te.numPlanes||Pe.numIntersection!==te.numIntersection)||Pe.vertexAlphas!==He||Pe.vertexTangents!==$e||Pe.morphTargets!==Re||Pe.morphNormals!==nt||Pe.morphColors!==xt||Pe.toneMapping!==vt||Pe.morphTargetsCount!==rt)&&(at=!0):(at=!0,Pe.__version=H.version);let gn=Pe.currentProgram;at===!0&&(gn=Gr(H,U,N));let ns=!1,sn=!1,$s=!1,yt=gn.getUniforms(),Cn=Pe.uniforms;if(ce.useProgram(gn.program)&&(ns=!0,sn=!0,$s=!0),H.id!==y&&(y=H.id,sn=!0),ns||v!==S){ce.buffers.depth.getReversed()?(le.copy(S.projectionMatrix),zf(le),Hf(le),yt.setValue(A,"projectionMatrix",le)):yt.setValue(A,"projectionMatrix",S.projectionMatrix),yt.setValue(A,"viewMatrix",S.matrixWorldInverse);let oi=yt.map.cameraPosition;oi!==void 0&&oi.setValue(A,ze.setFromMatrixPosition(S.matrixWorld)),be.logarithmicDepthBuffer&&yt.setValue(A,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&yt.setValue(A,"isOrthographic",S.isOrthographicCamera===!0),v!==S&&(v=S,sn=!0,$s=!0)}if(N.isSkinnedMesh){yt.setOptional(A,N,"bindMatrix"),yt.setOptional(A,N,"bindMatrixInverse");let ln=N.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),yt.setValue(A,"boneTexture",ln.boneTexture,E))}N.isBatchedMesh&&(yt.setOptional(A,N,"batchingTexture"),yt.setValue(A,"batchingTexture",N._matricesTexture,E),yt.setOptional(A,N,"batchingIdTexture"),yt.setValue(A,"batchingIdTexture",N._indirectTexture,E),yt.setOptional(A,N,"batchingColorTexture"),N._colorsTexture!==null&&yt.setValue(A,"batchingColorTexture",N._colorsTexture,E));let qs=B.morphAttributes;if((qs.position!==void 0||qs.normal!==void 0||qs.color!==void 0)&&ke.update(N,B,gn),(sn||Pe.receiveShadow!==N.receiveShadow)&&(Pe.receiveShadow=N.receiveShadow,yt.setValue(A,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Cn.envMap.value=Ce,Cn.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(Cn.envMapIntensity.value=U.environmentIntensity),sn&&(yt.setValue(A,"toneMappingExposure",_.toneMappingExposure),Pe.needsLights&&$d(Cn,$s),re&&H.fog===!0&&de.refreshFogUniforms(Cn,re),de.refreshMaterialUniforms(Cn,H,W,ne,p.state.transmissionRenderTarget[S.id]),Rs.upload(A,mh(Pe),Cn,E)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Rs.upload(A,mh(Pe),Cn,E),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&yt.setValue(A,"center",N.center),yt.setValue(A,"modelViewMatrix",N.modelViewMatrix),yt.setValue(A,"normalMatrix",N.normalMatrix),yt.setValue(A,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let ln=H.uniformsGroups;for(let oi=0,li=ln.length;oi<li;oi++){let xh=ln[oi];L.update(xh,gn),L.bind(xh,gn)}}return gn}function $d(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function qd(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(S,U,B){ve.get(S.texture).__webglTexture=U,ve.get(S.depthTexture).__webglTexture=B;let H=ve.get(S);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=B===void 0,H.__autoAllocateDepthBuffer||ee.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,U){let B=ve.get(S);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,B=0){T=S,C=U,I=B;let H=!0,N=null,re=!1,me=!1;if(S){let Ce=ve.get(S);if(Ce.__useDefaultFramebuffer!==void 0)ce.bindFramebuffer(A.FRAMEBUFFER,null),H=!1;else if(Ce.__webglFramebuffer===void 0)E.setupRenderTarget(S);else if(Ce.__hasExternalTextures)E.rebindTextures(S,ve.get(S.texture).__webglTexture,ve.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Re=S.depthTexture;if(Ce.__boundDepthTexture!==Re){if(Re!==null&&ve.has(Re)&&(S.width!==Re.image.width||S.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(S)}}let He=S.texture;(He.isData3DTexture||He.isDataArrayTexture||He.isCompressedArrayTexture)&&(me=!0);let $e=ve.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray($e[U])?N=$e[U][B]:N=$e[U],re=!0):S.samples>0&&E.useMultisampledRTT(S)===!1?N=ve.get(S).__webglMultisampledFramebuffer:Array.isArray($e)?N=$e[B]:N=$e,R.copy(S.viewport),z.copy(S.scissor),O=S.scissorTest}else R.copy(we).multiplyScalar(W).floor(),z.copy(We).multiplyScalar(W).floor(),O=st;if(ce.bindFramebuffer(A.FRAMEBUFFER,N)&&H&&ce.drawBuffers(S,N),ce.viewport(R),ce.scissor(z),ce.setScissorTest(O),re){let Ce=ve.get(S.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+U,Ce.__webglTexture,B)}else if(me){let Ce=ve.get(S.texture),He=U||0;A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,Ce.__webglTexture,B||0,He)}y=-1},this.readRenderTargetPixels=function(S,U,B,H,N,re,me){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=ve.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&me!==void 0&&(Ae=Ae[me]),Ae){ce.bindFramebuffer(A.FRAMEBUFFER,Ae);try{let Ce=S.texture,He=Ce.format,$e=Ce.type;if(!be.textureFormatReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!be.textureTypeReadable($e)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-H&&B>=0&&B<=S.height-N&&A.readPixels(U,B,H,N,Ze.convert(He),Ze.convert($e),re)}finally{let Ce=T!==null?ve.get(T).__webglFramebuffer:null;ce.bindFramebuffer(A.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(S,U,B,H,N,re,me){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=ve.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&me!==void 0&&(Ae=Ae[me]),Ae){let Ce=S.texture,He=Ce.format,$e=Ce.type;if(!be.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!be.textureTypeReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=S.width-H&&B>=0&&B<=S.height-N){ce.bindFramebuffer(A.FRAMEBUFFER,Ae);let Re=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Re),A.bufferData(A.PIXEL_PACK_BUFFER,re.byteLength,A.STREAM_READ),A.readPixels(U,B,H,N,Ze.convert(He),Ze.convert($e),0);let nt=T!==null?ve.get(T).__webglFramebuffer:null;ce.bindFramebuffer(A.FRAMEBUFFER,nt);let xt=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await Bf(A,xt,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Re),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,re),A.deleteBuffer(Re),A.deleteSync(xt),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,U=null,B=0){S.isTexture!==!0&&(or("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,S=arguments[1]);let H=Math.pow(2,-B),N=Math.floor(S.image.width*H),re=Math.floor(S.image.height*H),me=U!==null?U.x:0,Ae=U!==null?U.y:0;E.setTexture2D(S,0),A.copyTexSubImage2D(A.TEXTURE_2D,B,0,0,me,Ae,N,re),ce.unbindTexture()},this.copyTextureToTexture=function(S,U,B=null,H=null,N=0){S.isTexture!==!0&&(or("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,S=arguments[1],U=arguments[2],N=arguments[3]||0,B=null);let re,me,Ae,Ce,He,$e,Re,nt,xt,vt=S.isCompressedTexture?S.mipmaps[N]:S.image;B!==null?(re=B.max.x-B.min.x,me=B.max.y-B.min.y,Ae=B.isBox3?B.max.z-B.min.z:1,Ce=B.min.x,He=B.min.y,$e=B.isBox3?B.min.z:0):(re=vt.width,me=vt.height,Ae=vt.depth||1,Ce=0,He=0,$e=0),H!==null?(Re=H.x,nt=H.y,xt=H.z):(Re=0,nt=0,xt=0);let Kt=Ze.convert(U.format),rt=Ze.convert(U.type),Pe;U.isData3DTexture?(E.setTexture3D(U,0),Pe=A.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(E.setTexture2DArray(U,0),Pe=A.TEXTURE_2D_ARRAY):(E.setTexture2D(U,0),Pe=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,U.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,U.unpackAlignment);let Gn=A.getParameter(A.UNPACK_ROW_LENGTH),at=A.getParameter(A.UNPACK_IMAGE_HEIGHT),gn=A.getParameter(A.UNPACK_SKIP_PIXELS),ns=A.getParameter(A.UNPACK_SKIP_ROWS),sn=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,vt.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,vt.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Ce),A.pixelStorei(A.UNPACK_SKIP_ROWS,He),A.pixelStorei(A.UNPACK_SKIP_IMAGES,$e);let $s=S.isDataArrayTexture||S.isData3DTexture,yt=U.isDataArrayTexture||U.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){let Cn=ve.get(S),qs=ve.get(U),ln=ve.get(Cn.__renderTarget),oi=ve.get(qs.__renderTarget);ce.bindFramebuffer(A.READ_FRAMEBUFFER,ln.__webglFramebuffer),ce.bindFramebuffer(A.DRAW_FRAMEBUFFER,oi.__webglFramebuffer);for(let li=0;li<Ae;li++)$s&&A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,ve.get(S).__webglTexture,N,$e+li),S.isDepthTexture?(yt&&A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,ve.get(U).__webglTexture,N,xt+li),A.blitFramebuffer(Ce,He,re,me,Re,nt,re,me,A.DEPTH_BUFFER_BIT,A.NEAREST)):yt?A.copyTexSubImage3D(Pe,N,Re,nt,xt+li,Ce,He,re,me):A.copyTexSubImage2D(Pe,N,Re,nt,xt+li,Ce,He,re,me);ce.bindFramebuffer(A.READ_FRAMEBUFFER,null),ce.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else yt?S.isDataTexture||S.isData3DTexture?A.texSubImage3D(Pe,N,Re,nt,xt,re,me,Ae,Kt,rt,vt.data):U.isCompressedArrayTexture?A.compressedTexSubImage3D(Pe,N,Re,nt,xt,re,me,Ae,Kt,vt.data):A.texSubImage3D(Pe,N,Re,nt,xt,re,me,Ae,Kt,rt,vt):S.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,N,Re,nt,re,me,Kt,rt,vt.data):S.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,N,Re,nt,vt.width,vt.height,Kt,vt.data):A.texSubImage2D(A.TEXTURE_2D,N,Re,nt,re,me,Kt,rt,vt);A.pixelStorei(A.UNPACK_ROW_LENGTH,Gn),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,at),A.pixelStorei(A.UNPACK_SKIP_PIXELS,gn),A.pixelStorei(A.UNPACK_SKIP_ROWS,ns),A.pixelStorei(A.UNPACK_SKIP_IMAGES,sn),N===0&&U.generateMipmaps&&A.generateMipmap(Pe),ce.unbindTexture()},this.copyTextureToTexture3D=function(S,U,B=null,H=null,N=0){return S.isTexture!==!0&&(or("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,H=arguments[1]||null,S=arguments[2],U=arguments[3],N=arguments[4]||0),or('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,U,B,H,N)},this.initRenderTarget=function(S){ve.get(S).__webglFramebuffer===void 0&&E.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?E.setTextureCube(S,0):S.isData3DTexture?E.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?E.setTexture2DArray(S,0):E.setTexture2D(S,0),ce.unbindTexture()},this.resetState=function(){C=0,I=0,T=null,ce.reset(),gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var Ha=class extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},fc=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Zl,this.updateRanges=[],this.version=0,this.uuid=Qn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},qt=new P,Va=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=dt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ln(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ln(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ln(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ln(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),s=dt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),s=dt(s,this.array),r=dt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},vr=class extends Nn{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new Je(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ys,tr=new P,_s=new P,bs=new P,Ms=new ae,nr=new ae,fd=new it,pa=new P,ir=new P,ma=new P,Tu=new ae,il=new ae,Au=new ae,Ga=class extends Nt{constructor(e=new vr){if(super(),this.isSprite=!0,this.type="Sprite",ys===void 0){ys=new It;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new fc(t,5);ys.setIndex([0,1,2,0,2,3]),ys.setAttribute("position",new Va(n,3,0,!1)),ys.setAttribute("uv",new Va(n,2,3,!1))}this.geometry=ys,this.material=e,this.center=new ae(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_s.setFromMatrixScale(this.matrixWorld),fd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),bs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_s.multiplyScalar(-bs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;ga(pa.set(-.5,-.5,0),bs,a,_s,s,r),ga(ir.set(.5,-.5,0),bs,a,_s,s,r),ga(ma.set(.5,.5,0),bs,a,_s,s,r),Tu.set(0,0),il.set(1,0),Au.set(1,1);let o=e.ray.intersectTriangle(pa,ir,ma,!1,tr);if(o===null&&(ga(ir.set(-.5,.5,0),bs,a,_s,s,r),il.set(0,1),o=e.ray.intersectTriangle(pa,ma,ir,!1,tr),o===null))return;let l=e.ray.origin.distanceTo(tr);l<e.near||l>e.far||t.push({distance:l,point:tr.clone(),uv:xi.getInterpolation(tr,pa,ir,ma,Tu,il,Au,new ae),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ga(i,e,t,n,s,r){Ms.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(nr.x=r*Ms.x-s*Ms.y,nr.y=s*Ms.x+r*Ms.y):nr.copy(Ms),i.copy(e),i.x+=nr.x,i.y+=nr.y,i.applyMatrix4(fd)}var pc=class extends jt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Xt,h=Xt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wa=class extends kt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ss=new it,Cu=new it,xa=[],Ru=new dn,Nx=new it,sr=new Ot,rr=new ii,Xa=class extends Ot{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Wa(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Nx)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new dn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ss),Ru.copy(e.boundingBox).applyMatrix4(Ss),this.boundingBox.union(Ru)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ss),rr.copy(e.boundingSphere).applyMatrix4(Ss),this.boundingSphere.union(rr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(sr.geometry=this.geometry,sr.material=this.material,sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rr.copy(this.boundingSphere),rr.applyMatrix4(n),e.ray.intersectsSphere(rr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ss),Cu.multiplyMatrices(n,Ss),sr.matrixWorld=Cu,sr.raycast(e,xa);for(let a=0,o=xa.length;a<o;a++){let l=xa[a];l.instanceId=r,l.object=this,t.push(l)}xa.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Wa(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new pc(new Float32Array(s*this.count),s,this.count,Wc,Dn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Bs=class extends Nn{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},$a=new P,qa=new P,Iu=new it,ar=new Ns,va=new ii,sl=new P,Pu=new P,yr=class extends Nt{constructor(e=new It,t=new Bs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)$a.fromBufferAttribute(t,s-1),qa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=$a.distanceTo(qa);e.setAttribute("lineDistance",new ft(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),va.copy(n.boundingSphere),va.applyMatrix4(s),va.radius+=r,e.ray.intersectsSphere(va)===!1)return;Iu.copy(s).invert(),ar.copy(e.ray).applyMatrix4(Iu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let x=f,m=g-1;x<m;x+=c){let p=h.getX(x),w=h.getX(x+1),M=ya(this,e,ar,l,p,w);M&&t.push(M)}if(this.isLineLoop){let x=h.getX(g-1),m=h.getX(f),p=ya(this,e,ar,l,x,m);p&&t.push(p)}}else{let f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let x=f,m=g-1;x<m;x+=c){let p=ya(this,e,ar,l,x,x+1);p&&t.push(p)}if(this.isLineLoop){let x=ya(this,e,ar,l,g-1,f);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function ya(i,e,t,n,s,r){let a=i.geometry.attributes.position;if($a.fromBufferAttribute(a,s),qa.fromBufferAttribute(a,r),t.distanceSqToSegment($a,qa,sl,Pu)>n)return;sl.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(sl);if(!(l<e.near||l>e.far))return{distance:l,point:Pu.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var Lu=new P,Du=new P,Ya=class extends yr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Lu.fromBufferAttribute(t,s),Du.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Lu.distanceTo(Du);e.setAttribute("lineDistance",new ft(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var _r=class extends Nn{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Je(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Uu=new it,mc=new Ns,_a=new ii,ba=new P,Za=class extends Nt{constructor(e=new It,t=new _r){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),_a.copy(n.boundingSphere),_a.applyMatrix4(s),_a.radius+=r,e.ray.intersectsSphere(_a)===!1)return;Uu.copy(s).invert(),mc.copy(e.ray).applyMatrix4(Uu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,x=f;g<x;g++){let m=c.getX(g);ba.fromBufferAttribute(u,m),Nu(ba,m,l,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,x=f;g<x;g++)ba.fromBufferAttribute(u,g),Nu(ba,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Nu(i,e,t,n,s,r,a){let o=mc.distanceSqToPoint(i);if(o<t){let l=new P;mc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var ja=class extends jt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},fn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new ae:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new P,s=[],r=[],a=[],o=new P,l=new it;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Wt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Wt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},br=class extends fn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ae){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},gc=class extends br{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Zc(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Ma=new P,rl=new Zc,al=new Zc,ol=new Zc,xc=class extends fn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Ma.subVectors(s[0],s[1]).add(s[0]),c=Ma);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Ma.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ma),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),rl.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,x,m),al.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,x,m),ol.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(rl.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),al.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),ol.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(rl.calc(l),al.calc(l),ol.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Fu(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Fx(i,e){let t=1-i;return t*t*e}function Ox(i,e){return 2*(1-i)*i*e}function kx(i,e){return i*i*e}function hr(i,e,t,n){return Fx(i,e)+Ox(i,t)+kx(i,n)}function Bx(i,e){let t=1-i;return t*t*t*e}function zx(i,e){let t=1-i;return 3*t*t*i*e}function Hx(i,e){return 3*(1-i)*i*i*e}function Vx(i,e){return i*i*i*e}function ur(i,e,t,n,s){return Bx(i,e)+zx(i,t)+Hx(i,n)+Vx(i,s)}var Ja=class extends fn{constructor(e=new ae,t=new ae,n=new ae,s=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ae){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ur(e,s.x,r.x,a.x,o.x),ur(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},vc=class extends fn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ur(e,s.x,r.x,a.x,o.x),ur(e,s.y,r.y,a.y,o.y),ur(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ka=class extends fn{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yc=class extends fn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qa=class extends fn{constructor(e=new ae,t=new ae,n=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ae){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(hr(e,s.x,r.x,a.x),hr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_c=class extends fn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(hr(e,s.x,r.x,a.x),hr(e,s.y,r.y,a.y),hr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},eo=class extends fn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Fu(o,l.x,c.x,h.x,u.x),Fu(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ae().fromArray(s))}return this}},bc=Object.freeze({__proto__:null,ArcCurve:gc,CatmullRomCurve3:xc,CubicBezierCurve:Ja,CubicBezierCurve3:vc,EllipseCurve:br,LineCurve:Ka,LineCurve3:yc,QuadraticBezierCurve:Qa,QuadraticBezierCurve3:_c,SplineCurve:eo}),Mc=class extends fn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bc[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new bc[s.type]().fromJSON(s))}return this}},to=class extends Mc{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ka(this.currentPoint.clone(),new ae(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Qa(this.currentPoint.clone(),new ae(e,t),new ae(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new Ja(this.currentPoint.clone(),new ae(e,t),new ae(n,s),new ae(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new eo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new br(e,t,n,s,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}};var si=class i extends It{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,x=[],m=n/2,p=0;w(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new ft(u,3)),this.setAttribute("normal",new ft(d,3)),this.setAttribute("uv",new ft(f,2));function w(){let _=new P,D=new P,C=0,I=(t-e)/n;for(let T=0;T<=r;T++){let y=[],v=T/r,R=v*(t-e)+e;for(let z=0;z<=s;z++){let O=z/s,V=O*l+o,Z=Math.sin(V),G=Math.cos(V);D.x=R*Z,D.y=-v*n+m,D.z=R*G,u.push(D.x,D.y,D.z),_.set(Z,I,G).normalize(),d.push(_.x,_.y,_.z),f.push(O,1-v),y.push(g++)}x.push(y)}for(let T=0;T<s;T++)for(let y=0;y<r;y++){let v=x[y][T],R=x[y+1][T],z=x[y+1][T+1],O=x[y][T+1];(e>0||y!==0)&&(h.push(v,R,O),C+=3),(t>0||y!==r-1)&&(h.push(R,z,O),C+=3)}c.addGroup(p,C,0),p+=C}function M(_){let D=g,C=new ae,I=new P,T=0,y=_===!0?e:t,v=_===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,m*v,0),d.push(0,v,0),f.push(.5,.5),g++;let R=g;for(let z=0;z<=s;z++){let V=z/s*l+o,Z=Math.cos(V),G=Math.sin(V);I.x=y*G,I.y=m*v,I.z=y*Z,u.push(I.x,I.y,I.z),d.push(0,v,0),C.x=Z*.5+.5,C.y=G*.5*v+.5,f.push(C.x,C.y),g++}for(let z=0;z<s;z++){let O=D+z,V=R+z;_===!0?h.push(V,V+1,O):h.push(V+1,V,O),T+=3}c.addGroup(p,T,_===!0?1:2),p+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},wi=class i extends si{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},no=class i extends It{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new ft(r,3)),this.setAttribute("normal",new ft(r.slice(),3)),this.setAttribute("uv",new ft(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(w){let M=new P,_=new P,D=new P;for(let C=0;C<t.length;C+=3)f(t[C+0],M),f(t[C+1],_),f(t[C+2],D),l(M,_,D,w)}function l(w,M,_,D){let C=D+1,I=[];for(let T=0;T<=C;T++){I[T]=[];let y=w.clone().lerp(_,T/C),v=M.clone().lerp(_,T/C),R=C-T;for(let z=0;z<=R;z++)z===0&&T===C?I[T][z]=y:I[T][z]=y.clone().lerp(v,z/R)}for(let T=0;T<C;T++)for(let y=0;y<2*(C-T)-1;y++){let v=Math.floor(y/2);y%2===0?(d(I[T][v+1]),d(I[T+1][v]),d(I[T][v])):(d(I[T][v+1]),d(I[T+1][v+1]),d(I[T+1][v]))}}function c(w){let M=new P;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(w),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function h(){let w=new P;for(let M=0;M<r.length;M+=3){w.x=r[M+0],w.y=r[M+1],w.z=r[M+2];let _=m(w)/2/Math.PI+.5,D=p(w)/Math.PI+.5;a.push(_,1-D)}g(),u()}function u(){for(let w=0;w<a.length;w+=6){let M=a[w+0],_=a[w+2],D=a[w+4],C=Math.max(M,_,D),I=Math.min(M,_,D);C>.9&&I<.1&&(M<.2&&(a[w+0]+=1),_<.2&&(a[w+2]+=1),D<.2&&(a[w+4]+=1))}}function d(w){r.push(w.x,w.y,w.z)}function f(w,M){let _=w*3;M.x=e[_+0],M.y=e[_+1],M.z=e[_+2]}function g(){let w=new P,M=new P,_=new P,D=new P,C=new ae,I=new ae,T=new ae;for(let y=0,v=0;y<r.length;y+=9,v+=6){w.set(r[y+0],r[y+1],r[y+2]),M.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),C.set(a[v+0],a[v+1]),I.set(a[v+2],a[v+3]),T.set(a[v+4],a[v+5]),D.copy(w).add(M).add(_).divideScalar(3);let R=m(D);x(C,v+0,w,R),x(I,v+2,M,R),x(T,v+4,_,R)}}function x(w,M,_,D){D<0&&w.x===1&&(a[M]=w.x-1),_.x===0&&_.z===0&&(a[M]=D/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function p(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}},io=class i extends no{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Mr=class extends to{constructor(e){super(e),this.uuid=Qn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new to().fromJSON(s))}return this}},Gx={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=pd(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c,h,u,d,f;if(n&&(r=Yx(i,e,r,t)),i.length>80*t){o=c=i[0],l=h=i[1];for(let g=t;g<s;g+=t)u=i[g],d=i[g+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-o,h-l),f=f!==0?32767/f:0}return Sr(r,a,t,o,l,f,0),a}};function pd(i,e,t,n,s){let r,a;if(s===rv(i,e,t,n)>0)for(r=e;r<t;r+=n)a=Ou(r,i[r],i[r+1],a);else for(r=t-n;r>=e;r-=n)a=Ou(r,i[r],i[r+1],a);return a&&xo(a,a.next)&&(Er(a),a=a.next),a}function qi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(xo(t,t.next)||bt(t.prev,t,t.next)===0)){if(Er(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Sr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Qx(i,n,s,r);let o=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Xx(i,n,s,r):Wx(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),Er(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=$x(qi(i),e,t),Sr(i,e,t,n,s,r,2)):a===2&&qx(i,e,t,n,s,r):Sr(qi(i),e,t,n,s,r,1);break}}}function Wx(i){let e=i.prev,t=i,n=i.next;if(bt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=s<r?s<a?s:a:r<a?r:a,u=o<l?o<c?o:c:l<c?l:c,d=s>r?s>a?s:a:r>a?r:a,f=o>l?o>c?o:c:l>c?l:c,g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Es(s,o,r,l,a,c,g.x,g.y)&&bt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Xx(i,e,t,n){let s=i.prev,r=i,a=i.next;if(bt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,f=o<l?o<c?o:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,x=o>l?o>c?o:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,p=Sc(f,g,e,t,n),w=Sc(x,m,e,t,n),M=i.prevZ,_=i.nextZ;for(;M&&M.z>=p&&_&&_.z<=w;){if(M.x>=f&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Es(o,h,l,u,c,d,M.x,M.y)&&bt(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=f&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&Es(o,h,l,u,c,d,_.x,_.y)&&bt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=f&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Es(o,h,l,u,c,d,M.x,M.y)&&bt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=w;){if(_.x>=f&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&Es(o,h,l,u,c,d,_.x,_.y)&&bt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function $x(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!xo(s,r)&&md(s,n,n.next,r)&&wr(s,r)&&wr(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Er(n),Er(n.next),n=i=r),n=n.next}while(n!==i);return qi(n)}function qx(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&nv(a,o)){let l=gd(a,o);a=qi(a,a.next),l=qi(l,l.next),Sr(a,e,t,n,s,r,0),Sr(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Yx(i,e,t,n){let s=[],r,a,o,l,c;for(r=0,a=e.length;r<a;r++)o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=pd(i,o,l,n,!1),c===c.next&&(c.steiner=!0),s.push(tv(c));for(s.sort(Zx),r=0;r<s.length;r++)t=jx(s[r],t);return t}function Zx(i,e){return i.x-e.x}function jx(i,e){let t=Jx(i,e);if(!t)return e;let n=gd(t,i);return qi(n,n.next),qi(t,t.next)}function Jx(i,e){let t=e,n=-1/0,s,r=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){let d=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;let o=s,l=s.x,c=s.y,h=1/0,u;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&Es(a<c?r:n,a,l,c,a<c?n:r,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(r-t.x),wr(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&Kx(s,t)))&&(s=t,h=u)),t=t.next;while(t!==o);return s}function Kx(i,e){return bt(i.prev,i,e.prev)<0&&bt(e.next,i,i.next)<0}function Qx(i,e,t,n){let s=i;do s.z===0&&(s.z=Sc(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,ev(s)}function ev(i){let e,t,n,s,r,a,o,l,c=1;do{for(t=i,i=null,r=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,o--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(a>1);return i}function Sc(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function tv(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Es(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function nv(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!iv(i,e)&&(wr(i,e)&&wr(e,i)&&sv(i,e)&&(bt(i.prev,i,e.prev)||bt(i,e.prev,e))||xo(i,e)&&bt(i.prev,i,i.next)>0&&bt(e.prev,e,e.next)>0)}function bt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function xo(i,e){return i.x===e.x&&i.y===e.y}function md(i,e,t,n){let s=wa(bt(i,e,t)),r=wa(bt(i,e,n)),a=wa(bt(t,n,i)),o=wa(bt(t,n,e));return!!(s!==r&&a!==o||s===0&&Sa(i,t,e)||r===0&&Sa(i,n,e)||a===0&&Sa(t,i,n)||o===0&&Sa(t,e,n))}function Sa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function wa(i){return i>0?1:i<0?-1:0}function iv(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&md(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function wr(i,e){return bt(i.prev,i,i.next)<0?bt(i,e,i.next)>=0&&bt(i,i.prev,e)>=0:bt(i,e,i.prev)<0||bt(i,i.next,e)<0}function sv(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function gd(i,e){let t=new wc(i.i,i.x,i.y),n=new wc(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Ou(i,e,t,n){let s=new wc(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Er(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function wc(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function rv(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var dr=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];ku(e),Bu(n,e);let a=e.length;t.forEach(ku);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Bu(n,t[l]);let o=Gx.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function ku(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Bu(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var so=class i extends It{constructor(e=new Mr([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new ft(s,3)),this.setAttribute("uv",new ft(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,w=t.UVGenerator!==void 0?t.UVGenerator:av,M,_=!1,D,C,I,T;p&&(M=p.getSpacedPoints(h),_=!0,d=!1,D=p.computeFrenetFrames(h,!1),C=new P,I=new P,T=new P),d||(m=0,f=0,g=0,x=0);let y=o.extractPoints(c),v=y.shape,R=y.holes;if(!dr.isClockWise(v)){v=v.reverse();for(let J=0,ie=R.length;J<ie;J++){let A=R[J];dr.isClockWise(A)&&(R[J]=A.reverse())}}let O=dr.triangulateShape(v,R),V=v;for(let J=0,ie=R.length;J<ie;J++){let A=R[J];v=v.concat(A)}function Z(J,ie,A){return ie||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(ie,A)}let G=v.length,ne=O.length;function W(J,ie,A){let Ie,ee,be,ce=J.x-ie.x,Ne=J.y-ie.y,ve=A.x-J.x,E=A.y-J.y,b=ce*ce+Ne*Ne,F=ce*E-Ne*ve;if(Math.abs(F)>Number.EPSILON){let $=Math.sqrt(b),K=Math.sqrt(ve*ve+E*E),q=ie.x-Ne/$,Te=ie.y+ce/$,de=A.x-E/K,ye=A.y+ve/K,Ke=((de-q)*E-(ye-Te)*ve)/(ce*E-Ne*ve);Ie=q+ce*Ke-J.x,ee=Te+Ne*Ke-J.y;let te=Ie*Ie+ee*ee;if(te<=2)return new ae(Ie,ee);be=Math.sqrt(te/2)}else{let $=!1;ce>Number.EPSILON?ve>Number.EPSILON&&($=!0):ce<-Number.EPSILON?ve<-Number.EPSILON&&($=!0):Math.sign(Ne)===Math.sign(E)&&($=!0),$?(Ie=-Ne,ee=ce,be=Math.sqrt(b)):(Ie=ce,ee=Ne,be=Math.sqrt(b/2))}return new ae(Ie/be,ee/be)}let he=[];for(let J=0,ie=V.length,A=ie-1,Ie=J+1;J<ie;J++,A++,Ie++)A===ie&&(A=0),Ie===ie&&(Ie=0),he[J]=W(V[J],V[A],V[Ie]);let xe=[],we,We=he.concat();for(let J=0,ie=R.length;J<ie;J++){let A=R[J];we=[];for(let Ie=0,ee=A.length,be=ee-1,ce=Ie+1;Ie<ee;Ie++,be++,ce++)be===ee&&(be=0),ce===ee&&(ce=0),we[Ie]=W(A[Ie],A[be],A[ce]);xe.push(we),We=We.concat(we)}for(let J=0;J<m;J++){let ie=J/m,A=f*Math.cos(ie*Math.PI/2),Ie=g*Math.sin(ie*Math.PI/2)+x;for(let ee=0,be=V.length;ee<be;ee++){let ce=Z(V[ee],he[ee],Ie);le(ce.x,ce.y,-A)}for(let ee=0,be=R.length;ee<be;ee++){let ce=R[ee];we=xe[ee];for(let Ne=0,ve=ce.length;Ne<ve;Ne++){let E=Z(ce[Ne],we[Ne],Ie);le(E.x,E.y,-A)}}}let st=g+x;for(let J=0;J<G;J++){let ie=d?Z(v[J],We[J],st):v[J];_?(I.copy(D.normals[0]).multiplyScalar(ie.x),C.copy(D.binormals[0]).multiplyScalar(ie.y),T.copy(M[0]).add(I).add(C),le(T.x,T.y,T.z)):le(ie.x,ie.y,0)}for(let J=1;J<=h;J++)for(let ie=0;ie<G;ie++){let A=d?Z(v[ie],We[ie],st):v[ie];_?(I.copy(D.normals[J]).multiplyScalar(A.x),C.copy(D.binormals[J]).multiplyScalar(A.y),T.copy(M[J]).add(I).add(C),le(T.x,T.y,T.z)):le(A.x,A.y,u/h*J)}for(let J=m-1;J>=0;J--){let ie=J/m,A=f*Math.cos(ie*Math.PI/2),Ie=g*Math.sin(ie*Math.PI/2)+x;for(let ee=0,be=V.length;ee<be;ee++){let ce=Z(V[ee],he[ee],Ie);le(ce.x,ce.y,u+A)}for(let ee=0,be=R.length;ee<be;ee++){let ce=R[ee];we=xe[ee];for(let Ne=0,ve=ce.length;Ne<ve;Ne++){let E=Z(ce[Ne],we[Ne],Ie);_?le(E.x,E.y+M[h-1].y,M[h-1].x+A):le(E.x,E.y,u+A)}}}Y(),se();function Y(){let J=s.length/3;if(d){let ie=0,A=G*ie;for(let Ie=0;Ie<ne;Ie++){let ee=O[Ie];De(ee[2]+A,ee[1]+A,ee[0]+A)}ie=h+m*2,A=G*ie;for(let Ie=0;Ie<ne;Ie++){let ee=O[Ie];De(ee[0]+A,ee[1]+A,ee[2]+A)}}else{for(let ie=0;ie<ne;ie++){let A=O[ie];De(A[2],A[1],A[0])}for(let ie=0;ie<ne;ie++){let A=O[ie];De(A[0]+G*h,A[1]+G*h,A[2]+G*h)}}n.addGroup(J,s.length/3-J,0)}function se(){let J=s.length/3,ie=0;Ee(V,ie),ie+=V.length;for(let A=0,Ie=R.length;A<Ie;A++){let ee=R[A];Ee(ee,ie),ie+=ee.length}n.addGroup(J,s.length/3-J,1)}function Ee(J,ie){let A=J.length;for(;--A>=0;){let Ie=A,ee=A-1;ee<0&&(ee=J.length-1);for(let be=0,ce=h+m*2;be<ce;be++){let Ne=G*be,ve=G*(be+1),E=ie+Ie+Ne,b=ie+ee+Ne,F=ie+ee+ve,$=ie+Ie+ve;ze(E,b,F,$)}}}function le(J,ie,A){l.push(J),l.push(ie),l.push(A)}function De(J,ie,A){Oe(J),Oe(ie),Oe(A);let Ie=s.length/3,ee=w.generateTopUV(n,s,Ie-3,Ie-2,Ie-1);et(ee[0]),et(ee[1]),et(ee[2])}function ze(J,ie,A,Ie){Oe(J),Oe(ie),Oe(Ie),Oe(ie),Oe(A),Oe(Ie);let ee=s.length/3,be=w.generateSideWallUV(n,s,ee-6,ee-3,ee-2,ee-1);et(be[0]),et(be[1]),et(be[3]),et(be[1]),et(be[2]),et(be[3])}function Oe(J){s.push(l[J*3+0]),s.push(l[J*3+1]),s.push(l[J*3+2])}function et(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return ov(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new bc[s.type]().fromJSON(s)),new i(n,e.options)}},av={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new ae(r,a),new ae(o,l),new ae(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],x=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ae(a,1-l),new ae(c,1-u),new ae(d,1-g),new ae(x,1-p)]:[new ae(o,1-l),new ae(h,1-u),new ae(f,1-g),new ae(m,1-p)]}};function ov(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Tr=class i extends no{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},Ar=class i extends It{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/s,f=new P,g=new ae;for(let x=0;x<=s;x++){for(let m=0;m<=n;m++){let p=r+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let x=0;x<s;x++){let m=x*(n+1);for(let p=0;p<n;p++){let w=p+m,M=w,_=w+n+1,D=w+n+2,C=w+1;o.push(M,_,C),o.push(_,D,C)}}this.setIndex(o),this.setAttribute("position",new ft(l,3)),this.setAttribute("normal",new ft(c,3)),this.setAttribute("uv",new ft(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var ro=class i extends It{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new P,d=new P,f=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){let w=[],M=p/n,_=0;p===0&&a===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let D=0;D<=t;D++){let C=D/t;u.x=-e*Math.cos(s+C*r)*Math.sin(a+M*o),u.y=e*Math.cos(a+M*o),u.z=e*Math.sin(s+C*r)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(C+_,1-M),w.push(c++)}h.push(w)}for(let p=0;p<n;p++)for(let w=0;w<t;w++){let M=h[p][w+1],_=h[p][w],D=h[p+1][w],C=h[p+1][w+1];(p!==0||a>0)&&f.push(M,_,C),(p!==n-1||l<Math.PI)&&f.push(_,D,C)}this.setIndex(f),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(x,3)),this.setAttribute("uv",new ft(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Cr=class extends Nn{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=id,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var ao=class extends Bs{static get type(){return"LineDashedMaterial"}constructor(e){super(),this.isLineDashedMaterial=!0,this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Ea(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function lv(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var zs=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ec=class extends zs{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ph,endingEnd:Ph}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Lh:r=e,o=2*t-n;break;case Dh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Lh:a=e,l=2*n-t;break;case Dh:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),x=g*g,m=x*g,p=-d*m+2*d*x-d*g,w=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*g+1,M=(-1-f)*m+(1.5+f)*x+.5*g,_=f*m-f*x;for(let D=0;D!==o;++D)r[D]=p*a[h+D]+w*a[c+D]+M*a[l+D]+_*a[u+D];return r}},Tc=class extends zs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},Ac=class extends zs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Tn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ea(t,this.TimeBufferType),this.values=Ea(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ea(e.times,Array),values:Ea(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ac(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Tc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ec(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Pa:t=this.InterpolantFactoryMethodDiscrete;break;case Yl:t=this.InterpolantFactoryMethodLinear;break;case Co:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pa;case this.InterpolantFactoryMethodLinear:return Yl;case this.InterpolantFactoryMethodSmooth:return Co}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&lv(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Co,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let x=t[u+g];if(x!==t[d+g]||x!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Tn.prototype.TimeBufferType=Float32Array;Tn.prototype.ValueBufferType=Float32Array;Tn.prototype.DefaultInterpolation=Yl;var Yi=class extends Tn{constructor(e,t,n){super(e,t,n)}};Yi.prototype.ValueTypeName="bool";Yi.prototype.ValueBufferType=Array;Yi.prototype.DefaultInterpolation=Pa;Yi.prototype.InterpolantFactoryMethodLinear=void 0;Yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Cc=class extends Tn{};Cc.prototype.ValueTypeName="color";var Rc=class extends Tn{};Rc.prototype.ValueTypeName="number";var Ic=class extends zs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Mi.slerpFlat(r,0,a,c-o,a,c,l);return r}},oo=class extends Tn{InterpolantFactoryMethodLinear(e){return new Ic(this.times,this.values,this.getValueSize(),e)}};oo.prototype.ValueTypeName="quaternion";oo.prototype.InterpolantFactoryMethodSmooth=void 0;var Zi=class extends Tn{constructor(e,t,n){super(e,t,n)}};Zi.prototype.ValueTypeName="string";Zi.prototype.ValueBufferType=Array;Zi.prototype.DefaultInterpolation=Pa;Zi.prototype.InterpolantFactoryMethodLinear=void 0;Zi.prototype.InterpolantFactoryMethodSmooth=void 0;var Pc=class extends Tn{};Pc.prototype.ValueTypeName="vector";var zu={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},Lc=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}},cv=new Lc,Rr=class{constructor(e){this.manager=e!==void 0?e:cv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Rr.DEFAULT_MATERIAL_NAME="__DEFAULT";var Dc=class extends Rr{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=zu.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;let o=pr("img");function l(){h(),zu.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}};var lo=class extends Rr{constructor(e){super(e)}load(e,t,n,s){let r=new jt,a=new Dc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},co=class extends Nt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ho=class extends co{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},ll=new it,Hu=new P,Vu=new P,Uc=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gr,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Hu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Hu),Vu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vu),t.updateMatrixWorld(),ll.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ll),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ll)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Nc=class extends Uc{constructor(){super(new ks(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ir=class extends co{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new Nc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var jc="\\[\\]\\.:\\/",hv=new RegExp("["+jc+"]","g"),Jc="[^"+jc+"]",uv="[^"+jc.replace("\\.","")+"]",dv=/((?:WC+[\/:])*)/.source.replace("WC",Jc),fv=/(WCOD+)?/.source.replace("WCOD",uv),pv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Jc),mv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Jc),gv=new RegExp("^"+dv+fv+pv+mv+"$"),xv=["material","materials","bones","map"],Fc=class{constructor(e,t,n){let s=n||_t.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},_t=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(hv,"")}static parseTrackName(e){let t=gv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);xv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_t.Composite=Fc;_t.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_t.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_t.prototype.GetterByBindingType=[_t.prototype._getValue_direct,_t.prototype._getValue_array,_t.prototype._getValue_arrayElement,_t.prototype._getValue_toArray];_t.prototype.SetterByBindingTypeAndVersioning=[[_t.prototype._setValue_direct,_t.prototype._setValue_direct_setNeedsUpdate,_t.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_array,_t.prototype._setValue_array_setNeedsUpdate,_t.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_arrayElement,_t.prototype._setValue_arrayElement_setNeedsUpdate,_t.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_fromArray,_t.prototype._setValue_fromArray_setNeedsUpdate,_t.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ny=new Float32Array(1);var Gu=new it,uo=class{constructor(e,t,n=0,s=1/0){this.ray=new Ns(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new mr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Gu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gu),this}intersectObject(e,t=!0,n=[]){return Oc(e,this,n,t),n.sort(Wu),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Oc(e[s],this,n,t);return n.sort(Wu),n}};function Wu(i,e){return i.distance-e.distance}function Oc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)Oc(r[a],e,t,!0)}}var fo=class extends Ya{constructor(e=10,t=10,n=4473924,s=8947848){n=new Je(n),s=new Je(s);let r=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,g=-o;d<=t;d++,g+=a){l.push(-o,0,g,o,0,g),l.push(g,0,-o,g,0,o);let x=d===r?n:s;x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3}let h=new It;h.setAttribute("position",new ft(l,3)),h.setAttribute("color",new ft(c,3));let u=new Bs({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var Pr=class extends Ya{constructor(e,t=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new It;r.setIndex(new kt(n,1)),r.setAttribute("position",new ft(s,3)),super(r,new Bs({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:kc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=kc);var xd="__consoleKit1",Le=globalThis[xd]||(globalThis[xd]={console:void 0,started:!1,opts:{},pads:0,firstPress:!1,audios:new Set,prev:[],state:null,subs:new Set,menus:[],loop:0,card:null,cardTimer:0,repeat:{}}),iy=Object.freeze({maxDraws:300,pixelRatio:1,msaa:!1,shadows:!1,pointLights:!1,bloom:!1,maxTexture:2048}),yv=["a","b","x","y","lb","rb","lt","rt","view","menu","ls","rs","up","down","left","right","home"];function _v(){try{return sessionStorage}catch{return null}}function Ei(){if(Le.console!==void 0)return Le.console;let i=_v(),e=typeof location<"u"&&/[?&]console=([01])\b/.exec(location.search);if(e)try{i&&i.setItem("consoleKit.force",e[1])}catch{}let t=e?e[1]:i&&i.getItem("consoleKit.force");if(t==="1"||t==="0")return Le.console=t==="1";let n=i&&i.getItem("consoleKit.gpu");if(n==="1"||n==="0")return Le.console=n==="1";Le.console=!1;let s=typeof navigator<"u"?navigator.userAgent:"";if(/Windows NT/.test(s)&&/\bEdg\//.test(s)&&typeof document<"u")try{let r=document.createElement("canvas"),a=r.getContext("webgl2")||r.getContext("webgl");if(a){let o=a.getExtension("WEBGL_debug_renderer_info"),l=String(a.getParameter(o?o.UNMASKED_RENDERER_WEBGL:a.RENDERER)||"");Le.console=/SraKmd/i.test(l);let c=a.getExtension("WEBGL_lose_context");c&&c.loseContext()}}catch{}try{i&&i.setItem("consoleKit.gpu",Le.console?"1":"0")}catch{}return Le.console}function vd(){return Ei()}function yd(i={}){Object.assign(Le.opts,i),!Le.started&&(Le.started=!0,addEventListener("gamepadconnected",()=>{Kc()}),addEventListener("gamepaddisconnected",()=>{Kc()}),Kc(),Ei()&&(document.documentElement.classList.add("console-kit"),Md(),Le.opts.card!==!1&&!Le.pads&&eh()))}function Kc(){let i=Le.pads;Le.pads=_d().length,Le.pads&&!Le.loop&&(Le.loop=requestAnimationFrame(bd)),Le.pads&&Le.card&&Iv(),!Le.pads&&i&&Ei()&&Le.opts.card!==!1&&eh(),i>0!=Le.pads>0&&Le.opts.onPadChange&&Le.opts.onPadChange(Le.pads>0)}function _d(){return(typeof navigator<"u"&&navigator.getGamepads?Array.from(navigator.getGamepads()):[]).filter(e=>e&&e.connected!==!1)}function bv(){let i=_d(),e=i.find(s=>s.mapping==="standard")||i[0];if(!e)return null;let t={id:e.id,mapping:e.mapping,held:{},pressed:{},released:{}};yv.forEach((s,r)=>{let a=e.buttons[r],o=a?typeof a=="object"?a.pressed||a.value>.5:a>.5:!1,l=!!Le.prev[r];t.held[s]=o,t.pressed[s]=o&&!l,t.released[s]=!o&&l,Le.prev[r]=o});let n=s=>Math.abs(s||0)<.2?0:s;return t.lx=n(e.axes[0]),t.ly=n(e.axes[1]),t.rx=n(e.axes[2]),t.ry=n(e.axes[3]),t.any=Object.values(t.pressed).some(Boolean),t}function bd(){if(Le.loop=0,!Le.pads){Le.state=null;return}let i=Le.state=bv();if(i&&i.any&&!Le.firstPress&&Mv(),i){for(let e of Le.subs)try{e(i)}catch(t){console.error(t)}Av(i)}Le.loop=requestAnimationFrame(bd)}function Mv(){Le.firstPress=!0;for(let i of Le.audios)i.state==="suspended"&&i.resume().catch(()=>{});if(Ei()&&Le.opts.fullscreen!==!1&&!document.fullscreenElement&&document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen({navigationUI:"hide"}).catch(()=>{}),Le.opts.onFirstPress)try{Le.opts.onFirstPress()}catch(i){console.error(i)}}var Sv='button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"]), [data-pad-focus]';function wv(i){return(typeof i.root=="function"?i.root():i.root)||document.body}function Ev(i){if(i.disabled||i.closest('[inert], [aria-hidden="true"]'))return!1;let e=i.getBoundingClientRect();if(e.width<2||e.height<2)return!1;let t=getComputedStyle(i);return t.visibility!=="hidden"&&t.display!=="none"&&Number(t.opacity)>.05}function Tv(i){let e={up:i.held.up||i.ly<-.5,down:i.held.down||i.ly>.5,left:i.held.left||i.lx<-.5,right:i.held.right||i.lx>.5},t=performance.now();for(let n of Object.keys(e)){if(!e[n]){delete Le.repeat[n];continue}let s=Le.repeat[n];if(s===void 0)return Le.repeat[n]=t+380,n;if(t>=s)return Le.repeat[n]=t+140,n}return null}function Av(i){let e=[...Le.menus].reverse().find(a=>{try{return a.enabled()}catch{return!1}});if(!e)return;let t=wv(e),n=Array.from(t.querySelectorAll(Sv)).filter(Ev);if(!n.length)return;let s=n.includes(document.activeElement)?document.activeElement:null,r=Tv(i);if(r){if(!s)return Qc(n[0]);if(Cv(s,r))return;let a=Rv(s,n,r);a&&Qc(a);return}if(i.pressed.a){if(!s)return Qc(n[0]);document.documentElement.classList.add("ck-pad"),s.matches("input[type=checkbox], input[type=radio]")?s.click():s.matches("input:not([type=range]), textarea, select")?s.focus():s.click()}else i.pressed.b&&(e.back?e.back():document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",code:"Escape",keyCode:27,bubbles:!0})))}function Qc(i){document.documentElement.classList.add("ck-pad"),i.focus({preventScroll:!0}),i.scrollIntoView({block:"nearest",inline:"nearest"})}function Cv(i,e){if(e!=="left"&&e!=="right")return!1;let t=e==="right"?1:-1;if(i.matches("input[type=range]"))t>0?i.stepUp():i.stepDown();else if(i.matches("select")){let n=Math.max(0,Math.min(i.options.length-1,i.selectedIndex+t));if(n===i.selectedIndex)return!0;i.selectedIndex=n}else return!1;return i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),!0}function Rv(i,e,t){let n=i.getBoundingClientRect(),s=n.left+n.width/2,r=n.top+n.height/2,a=null,o=1/0;for(let l of e){if(l===i)continue;let c=l.getBoundingClientRect(),h=c.left+c.width/2,u=c.top+c.height/2,d=h-s,f=u-r,g=t==="up"?-f:t==="down"?f:t==="left"?-d:d,x=Math.abs(t==="up"||t==="down"?d:f);if(g<=1)continue;let m=g+x*2.5;m<o&&(o=m,a=l)}return a}function Md(){if(document.getElementById("console-kit-style"))return;let i=document.createElement("style");i.id="console-kit-style",i.textContent=`
.ck-card{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:2147483000;pointer-events:none;
  max-width:min(92vw,760px);padding:14px 24px;border-radius:16px;background:rgba(10,10,14,.86);color:#fff;
  border:2px solid rgba(255,255,255,.28);box-shadow:0 8px 30px rgba(0,0,0,.45);text-align:center;
  font:600 22px/1.35 system-ui,'Segoe UI',sans-serif;transition:opacity .4s,transform .4s}
.ck-card small{display:block;margin-top:4px;font-weight:500;font-size:17px;opacity:.82}
.ck-card.ck-small{left:auto;right:14px;transform:none;padding:8px 14px;font-size:16px}
.ck-card.ck-small small{display:none}
.ck-card.ck-ready{background:rgba(20,110,60,.92)}
.ck-card.ck-gone{opacity:0}
html.ck-pad :focus{outline:4px solid #ffd54a !important;outline-offset:3px !important}`,(document.head||document.documentElement).appendChild(i)}function eh(){if(Le.card)return;if(!document.body){addEventListener("DOMContentLoaded",()=>{Le.pads||eh()},{once:!0});return}Md();let i=document.createElement("div");i.className="ck-card",i.setAttribute("role","status"),i.innerHTML=Le.opts.cardText||"\u{1F3AE} To play with the controller, hold \u2630 and choose <b>Use game controls</b><small>or select the controller icon right of the address bar</small>",document.body.appendChild(i),Le.card=i,clearTimeout(Le.cardTimer),Le.cardTimer=setTimeout(()=>{Le.card===i&&i.classList.add("ck-small")},12e3)}function Iv(){let i=Le.card;i&&(Le.card=null,clearTimeout(Le.cardTimer),i.classList.remove("ck-small"),i.classList.add("ck-ready"),i.textContent="\u{1F3AE} Controller ready",setTimeout(()=>i.classList.add("ck-gone"),1400),setTimeout(()=>i.remove(),2e3))}var Sd={forest:{top:"#347c65",side:"#203f3b",path:"#78a184",fog:"#142529"},night:{top:"#39445f",side:"#242b43",path:"#6a7191",fog:"#1b2034"},space:{top:"#28384a",side:"#192338",path:"#465b73",fog:"#101727"},race:{top:"#32675d",side:"#233e3e",path:"#364451",fog:"#15292d"},sand:{top:"#c5a87b",side:"#816e55",path:"#e3cba3",fog:"#2d2923"}},wd=(i,e={})=>new Cr({color:i,roughness:.75,...e});function Bt(i,e,t,n=0,s=0,r=0,a={}){let o=new Ot(i,wd(e,a));return o.position.set(n,s,r),o.castShadow=!0,o.receiveShadow=!0,t.add(o),o}var Ft=(i,e,t,n,s,r=0,a=0,o=0)=>Bt(new Si(i,e,t),n,s,r,a,o),pn=(i,e,t,n=0,s=0,r=0)=>Bt(new ro(i,16,12),e,t,n,s,r);function Pv(i,e){let t=new En,n=i.color;if(["hero","npc"].includes(i.kind))Ft(.53,.56,.42,n,t,0,.63),Ft(.83,.58,.57,n,t,0,1.19),Ft(.64,.29,.05,"#153649",t,0,1.23,.302),Ft(.1,.14,.04,"#d8ffff",t,-.18,1.24,.335),Ft(.1,.14,.04,"#d8ffff",t,.18,1.24,.335),pn(.12,n,t,-.4,.7),pn(.12,n,t,.4,.7),Ft(.18,.24,.28,"#264650",t,-.17,.19,.03),Ft(.18,.24,.28,"#264650",t,.17,.19,.03),Bt(new si(.025,.025,.2,6),n,t,0,1.58),pn(.07,"#d9ffff",t,0,1.71);else if(i.kind==="tree")Bt(new si(.13,.19,1,7),"#8c7258",t,0,.5),Bt(new wi(.98,1.55,7),n,t,0,1.25),Bt(new wi(.78,1.4,7),n,t,0,1.9),Bt(new wi(.55,1.2,7),"#62c99e",t,0,2.45);else if(i.kind==="crystal"){Bt(new Tr(.43),n,t,0,.8,0,{metalness:.25,roughness:.25,emissive:n,emissiveIntensity:.17}).scale.set(.73,1.35,.73);let r=Bt(new Ar(.28,.38,32),n,t,0,.025,0,{transparent:!0,opacity:.2,side:en});r.rotation.x=-Math.PI/2}else if(i.kind==="slime"){let s=pn(.58,n,t,0,.48);s.scale.y=.78,pn(.075,"#252844",t,-.2,.58,.48),pn(.075,"#252844",t,.2,.58,.48),pn(.13,n,t,-.35,.13,.23),pn(.13,n,t,.35,.13,.23)}else if(i.kind==="rock"){let s=Bt(new io(.66),n,t,0,.38);s.scale.set(1,.75,.8),s.rotation.set(.2,.4,.1)}else if(i.kind==="crate"){Ft(.9,.85,.9,n,t,0,.425);for(let s of[-.34,.34])Ft(.12,.95,.98,"#875b3a",t,s,.44);for(let s of[.1,.73])Ft(.97,.1,.96,"#ba874c",t,0,s)}else if(i.kind==="portal"){let s=new Mr;s.moveTo(-.85,0),s.lineTo(-.85,1.35),s.absarc(0,1.35,.85,Math.PI,0,!0),s.lineTo(.85,0),s.lineTo(.59,0),s.lineTo(.59,1.35),s.absarc(0,1.35,.59,0,Math.PI,!1),s.lineTo(-.59,0),Bt(new so(s,{depth:.3,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:2,steps:1}),n,t,0,0,0,{emissive:n,emissiveIntensity:.45}),Bt(new $i(1.15,1.6),"#9e87ff",t,0,.86,.12,{transparent:!0,opacity:.35,side:en,emissive:"#9e87ff",emissiveIntensity:.7}),Ft(2,.15,.8,"#62698f",t,0,.08,.15)}else if(i.kind==="car"){Ft(.8,.28,1.3,n,t,0,.37),Ft(.65,.3,.65,n,t,0,.62,-.1),Ft(.58,.24,.04,"#b8e8f4",t,0,.64,.245);for(let s of[-.45,.45])for(let r of[-.42,.42]){let a=Bt(new si(.21,.21,.16,12),"#19242a",t,s,.23,r);a.rotation.z=Math.PI/2}Ft(.17,.1,.04,"#fff6c8",t,-.23,.38,.67),Ft(.17,.1,.04,"#fff6c8",t,.23,.38,.67)}else if(i.kind==="ship"){let s=Bt(new wi(.4,1.4,4),n,t,0,.4);s.rotation.x=-Math.PI/2,Ft(1.4,.12,.45,n,t,0,.32,.18),pn(.2,"#c4f3ff",t,0,.55,-.1)}else if(i.kind==="flower"){Bt(new si(.025,.035,.5,5),"#71b886",t,0,.25);for(let s=0;s<5;s++){let r=s*Math.PI*2/5,a=pn(.13,n,t,Math.cos(r)*.15,.53,Math.sin(r)*.15);a.scale.y=.5}pn(.09,"#fff3ac",t,0,.56)}else if(i.kind==="image"){let s=e.find(r=>r.id===i.assetId);if(s){let r,a=new lo().load(s.src,o=>{if(r){let l=o.image.width/o.image.height;r.scale.x=1.5*l}});a.colorSpace=Gt,a.magFilter=Xt,a.minFilter=un,i.billboard==="screen"?r=new Ga(new vr({map:a,transparent:!0,alphaTest:.1})):(r=new Ot(new $i(1,1),new Fs({map:a,transparent:!0,alphaTest:.1,side:en})),r.userData.upright=!0),r.scale.set(1.5*(s.width||1)/(s.height||1),1.5,1),r.position.y=.75,t.add(r)}}else if(i.kind==="button"){Ft(1.5,.25,.75,n,t,0,.2);let s=Bt(new wi(.18,.4,3),"#164655",t,0,.38);s.rotation.z=-Math.PI/2}else for(let s=0;s<8;s++){let r=s*2.4,a=Bt(new Tr(.07),n,t,Math.cos(r)*.6,.3+s*.17,Math.sin(r)*.6,{emissive:n,emissiveIntensity:.7});a.rotation.z=r}return t.traverse(s=>{s.userData.objectId=i.id}),t}var Ti=class{constructor(e,t="3d"){if(this.host=e,this.mode=t,this.zoom=1,this.angle=.62,this.elevation=.78,this.showGrid=!1,this.selected=null,this.path=[],this.meshes=new Map,this.images=new Map,this.assetSources=new Map,this.assets=[],this.map=Rn(),this.pan={x:0,y:0,z:0},this.camConfig=yn(t==="3d"?"iso":"flat"),this.followPoint=new P,this.canvas=document.createElement("canvas"),this.canvas.setAttribute("aria-label",t==="3d"?"3D game world":"2D game world"),e.prepend(this.canvas),this.selectionLabel=document.createElement("div"),this.selectionLabel.className="selection-tag",this.selectionLabel.hidden=!0,e.append(this.selectionLabel),this.tiles=new Map(Object.keys(Wn).map(n=>[n,bh(n)])),t==="3d"){let n=Ei();try{this.renderer=new xr({canvas:this.canvas,antialias:!n,alpha:!0,powerPreference:"high-performance"})}catch{this.renderer=new xr({canvas:this.canvas,antialias:!1,alpha:!0,powerPreference:"default"})}this.renderer.setPixelRatio(Math.min(devicePixelRatio,n?1:2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Bc,this.renderer.outputColorSpace=Gt,this.renderer.toneMapping=zc,this.renderer.toneMappingExposure=1.1,this.world=new Ha,this.ortho=new ks(-12,12,8,-8,.1,250),this.perspective=new Zt(65,1,.07,200),this.camera=this.ortho,this.world.add(new ho("#c0e6f0","#243d3e",1.8));let s=new Ir("#fff6e1",2.5);s.position.set(-7,15,8),s.castShadow=!0,s.shadow.mapSize.set(1024,1024),Object.assign(s.shadow.camera,{left:-20,right:20,top:20,bottom:-20}),s.shadow.bias=-8e-4,s.shadow.normalBias=.03,this.world.add(s),this.sun=s;let r=new Ir("#73bdff",.85);r.position.set(8,5,-6),this.world.add(r),this.content=new En,this.world.add(this.content),this.terrainGroup=new En,this.world.add(this.terrainGroup),this.ray=new uo,this.groundPlane=new hn(new P(0,1,0),0),this.v=new ae,this.selectionBox=new dn,this.selection=new Pr(this.selectionBox,"#80eaff"),this.selection.material.depthTest=!1,this.selection.material.depthWrite=!1,this.selection.material.transparent=!0,this.selection.material.opacity=.95,this.selection.renderOrder=999,this.selection.visible=!1,this.world.add(this.selection),this.brushPreview=new Pr(new dn,"#8ff5cd"),this.brushPreview.material.depthTest=!1,this.brushPreview.material.depthWrite=!1,this.brushPreview.renderOrder=998,this.brushPreview.visible=!1,this.world.add(this.brushPreview),this.particleGeo=new It,this.particleGeo.setAttribute("position",new kt(new Float32Array(340*3),3)),this.particlePoints=new Za(this.particleGeo,new _r({color:"#a7f4ff",size:.11,transparent:!0,opacity:.9})),this.world.add(this.particlePoints)}else this.ctx=this.canvas.getContext("2d");this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.resize()}get side(){return this.camConfig.preset==="side"}configure(e){this.camConfig={...yn(this.mode==="3d"?"iso":"flat"),...e},this.sideCenter=4,this.scene&&this.cacheTerrain2d()}resize(){this.w=this.host.clientWidth||800,this.h=this.host.clientHeight||600,this.renderer?(this.renderer.setSize(this.w,this.h,!1),this.perspective.aspect=this.w/this.h,this.perspective.updateProjectionMatrix(),this.updateCamera()):(this.canvas.width=this.w*Math.min(devicePixelRatio,2),this.canvas.height=this.h*Math.min(devicePixelRatio,2),this.ctx.setTransform(Math.min(devicePixelRatio,2),0,0,Math.min(devicePixelRatio,2),0,0))}updateCamera(){if(!this.ortho||this.playing)return;this.camera=this.ortho;let e=this.w/this.h,t=Math.max(8.2,this.map.depth*.65,this.map.width/e*.6)/this.zoom;this.camera.left=-t*e,this.camera.right=t*e,this.camera.top=t,this.camera.bottom=-t,this.camera.position.set(this.pan.x+Math.sin(this.angle)*70*Math.cos(this.elevation),this.pan.y+Math.sin(this.elevation)*70,this.pan.z+Math.cos(this.angle)*70*Math.cos(this.elevation)),this.camera.lookAt(this.pan.x,this.pan.y+.2,this.pan.z),this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld()}orbit(e,t){this.angle+=e*.008,this.elevation=ot(this.elevation+t*.005,.2,1.5),this.updateCamera()}panPixels(e,t){if(this.renderer){let n=(this.ortho.top-this.ortho.bottom)/this.h;this.pan.x-=e*n*Math.cos(this.angle)+t*n*Math.sin(this.angle)/Math.max(.25,Math.sin(this.elevation)),this.pan.z+=e*n*Math.sin(this.angle)-t*n*Math.cos(this.angle)/Math.max(.25,Math.sin(this.elevation))}else{let n=this.scale2d();this.pan.x-=e/n,this.side?this.pan.y+=t/n:this.pan.z-=t/n}this.updateCamera()}setZoom(e){this.zoom=ot(e,.3,5),this.updateCamera()}reset(){this.angle=.62,this.elevation=.78,this.pan={x:0,y:0,z:0},this.setZoom(1)}beginPlay(e,t){this.configure(e),this.playing||(this.savedView={pan:{...this.pan},zoom:this.zoom}),this.playing=!0,this.followPoint.set(t?.x||0,t?.y||0,t?.z||0),this.cameraYaw=(e.yaw||0)*Math.PI/180,this.cameraPitch=(e.angle||0)*Math.PI/180,this.cameraReady=!1}endPlay(){this.playing=!1,this.savedView&&(this.pan=this.savedView.pan,this.zoom=this.savedView.zoom),this.camera=this.ortho,this.updateCamera()}updatePlayCamera(e,t){if(!e)return;let n=this.camConfig,s=1-Math.exp(-8*t),r=new P(e.x,e.y,e.z);if(n.follow||n.preset==="first"||n.preset==="third"||n.preset==="side"?this.followPoint.lerp(r,s):this.followPoint.set(0,0,0),!!this.renderer){if(n.preset==="first"||n.preset==="third"){this.camera=this.perspective;let a=this.followPoint,o=this.cameraYaw,l=this.cameraPitch,c,h;if(n.preset==="first")c=new P(a.x,a.y+n.height,a.z),h=c.clone().add(new P(-Math.sin(o)*Math.cos(l),-Math.sin(l),-Math.cos(o)*Math.cos(l)));else{h=new P(a.x,a.y+.9,a.z),c=new P(a.x+Math.sin(o)*n.distance*Math.cos(l),Math.max(a.y+.25,a.y+n.height+Math.sin(l)*n.distance*.45),a.z+Math.cos(o)*n.distance*Math.cos(l));let u=c.clone().sub(h),d=u.length();u.normalize();for(let f=.5;f<d;f+=.2){let g=h.clone().addScaledVector(u,f);if(this.terrainIndex.blocked(g.x,g.z,g.y,.15,.12)){c=h.clone().addScaledVector(u,Math.max(.4,f-.3));break}}}this.cameraReady?(this.camera.position.lerp(c,s),this.lookAtPoint.lerp(h,s)):(this.camera.position.copy(c),this.lookAtPoint=h.clone(),this.cameraReady=!0),this.camera.lookAt(this.lookAtPoint)}else{this.camera=this.ortho;let a=this.w/this.h,o=n.distance*.95;Object.assign(this.ortho,{left:-o*a,right:o*a,top:o,bottom:-o});let l=this.followPoint;this.camera.position.set(l.x+Math.sin(.62+this.cameraYaw)*n.distance*3,l.y+n.height+Math.sin(n.angle*Math.PI/180)*n.distance*3,l.z+Math.cos(.62+this.cameraYaw)*n.distance*3),this.camera.lookAt(l.x,l.y+.3,l.z),this.camera.updateProjectionMatrix()}this.camera.updateMatrixWorld()}}disposeTree(e){let t=new Set,n=new Set,s=new Set;e.traverse(r=>{r.geometry&&t.add(r.geometry);for(let a of r.material?Array.isArray(r.material)?r.material:[r.material]:[])n.add(a),a.map&&s.add(a.map)}),t.forEach(r=>r.dispose()),n.forEach(r=>r.dispose()),s.forEach(r=>r.dispose())}setScene(e,t=[]){this.scene=e,this.map=e.map||Rn(e.theme),this.assets=t,this.palette=Sd[e.theme]||Sd.forest,this.host.dataset.theme=e.theme;for(let n of t)if(this.assetSources.get(n.id)!==n.src){for(let s of this.images.keys())s.endsWith(n.id)&&this.images.delete(s);this.assetSources.set(n.id,n.src)}if(this.setTerrain(e),!!this.renderer){this.disposeTree(this.content),this.content.clear(),this.meshes.clear();for(let n of e.objects){let s=Pv(n,t);this.content.add(s),this.meshes.set(n.id,s)}this.updateCamera()}}setTerrain(e){if(this.scene=e,this.map=e.map||Rn(e.theme),this.terrainIndex=new is(e),this.cacheTerrain2d(),!this.renderer)return;this.disposeTree(this.terrainGroup),this.terrainGroup.clear();let t=this.map,n=new Map,s=new Map(t.tiles.map(c=>[`${c.x},${c.z}`,c.tile])),r=(c,h,u)=>{let d=c+":"+h;n.has(d)||n.set(d,{tile:c,shape:h,cells:[]}),n.get(d).cells.push(u)};for(let c=-t.width/2;c<t.width/2;c++)for(let h=-t.depth/2;h<t.depth/2;h++){let u=s.get(`${c},${h}`);u==="void"||!t.base&&!u||r(u||t.tileset,"floor",{x:c,y:-.3,z:h})}for(let c of t.blocks)r(c.tile,c.shape,c);let a=new Map,o=new Map;for(let{tile:c,shape:h,cells:u}of n.values()){if(!a.has(c)){let m=new ja(this.tiles.get(c));m.colorSpace=Gt,m.magFilter=Xt,a.set(c,m),o.set(c,new Cr({map:m,roughness:.85}))}let d=h==="floor"?.3:xn[h].height,f=h==="pillar"?new si(.48,.48,d,12):new Si(1,d,1),g=new Xa(f,o.get(c),u.length),x=new it;u.forEach((m,p)=>{x.makeTranslation(m.x+.5,m.y+d/2,m.z+.5),g.setMatrixAt(p,x)}),g.castShadow=h!=="floor",g.receiveShadow=!0,g.userData.terrain=!0,g.userData.shape=h,g.userData.cells=u,g.computeBoundingSphere(),this.terrainGroup.add(g)}if(t.decorated&&t.base&&e.theme==="race"){let c=new Ot(new Ar(2.9,5.1,4,1,Math.PI/4),wd("#344653",{side:en}));c.rotation.x=-Math.PI/2,c.position.y=.018,c.scale.set(1.35,.9,1),this.terrainGroup.add(c)}this.grid&&(this.world.remove(this.grid),this.disposeTree(this.grid)),this.grid=new fo(Math.max(t.width,t.depth),Math.max(t.width,t.depth),"#86dfde","#87bcc0"),this.grid.position.y=.025,this.grid.material.transparent=!0,this.grid.material.opacity=.15,this.world.add(this.grid);let l=Math.max(t.width,t.depth)*.65;Object.assign(this.sun.shadow.camera,{left:-l,right:l,top:l,bottom:-l}),this.sun.shadow.camera.updateProjectionMatrix(),this.updateCamera()}cacheTerrain2d(){if(this.renderer||!this.scene)return;let e=this.map,t=document.createElement("canvas"),n=32;t.width=e.width*n,t.height=(this.side?20:e.depth)*n;let s=t.getContext("2d"),r=new Map(e.tiles.map(a=>[`${a.x},${a.z}`,a.tile]));if(this.side){for(let a=-e.width/2;a<e.width/2;a++){let o=r.get(`${a},0`);o==="void"||!e.base&&!o||(s.fillStyle=this.palette?.side||"#24564d",s.fillRect((a+e.width/2)*n,16*n,n,4*n),s.drawImage(this.tiles.get(o||e.tileset),(a+e.width/2)*n,16*n,n,n))}for(let a of[...e.blocks].sort((o,l)=>l.z-o.z)){let o=xn[a.shape].height;s.drawImage(this.tiles.get(a.tile),(a.x+e.width/2)*n,(16-a.y-o)*n,n,o*n)}}else{for(let a=-e.width/2;a<e.width/2;a++)for(let o=-e.depth/2;o<e.depth/2;o++){let l=r.get(`${a},${o}`);l==="void"||!e.base&&!l||s.drawImage(this.tiles.get(l||e.tileset),(a+e.width/2)*n,(o+e.depth/2)*n,n,n)}for(let a of[...e.blocks].sort((o,l)=>o.y-l.y)){let o=(a.x+e.width/2)*n,l=(a.z+e.depth/2)*n;s.drawImage(this.tiles.get(a.tile),o,l,n,n),s.fillStyle="#0004",s.fillRect(o,l+n-3,n,3),s.strokeStyle="#d4f6ff55",s.strokeRect(o+1,l+1,n-2,n-2)}}this.terrainCanvas=t}rayAt(e,t){let n=this.canvas.getBoundingClientRect();this.v.set((e-n.left)/this.w*2-1,-(t-n.top)/this.h*2+1),this.camera.updateMatrixWorld(),this.world.updateMatrixWorld(!0),this.ray.setFromCamera(this.v,this.camera)}screenToWorld(e,t,n=0){let s=this.canvas.getBoundingClientRect(),r=e-s.left,a=t-s.top,o=rn(this.scene||{map:this.map},.1);if(this.renderer){this.rayAt(e,t);let h=new hn(new P(0,1,0),-n),u=new P;return this.ray.ray.intersectPlane(h,u)?{x:ot(u.x,o.minX,o.maxX),y:n,z:ot(u.z,o.minZ,o.maxZ)}:{x:0,y:n,z:0}}let l=this.scale2d(),c=this.center2d();return this.side?{x:ot((r-this.w/2)/l+c.x,o.minX,o.maxX),y:ot(c.y-(a-this.h/2)/l,0,20),z:.5}:{x:ot((r-this.w/2)/l+c.x,o.minX,o.maxX),y:n,z:ot((a-this.h/2)/l+c.z+n,o.minZ,o.maxZ)}}placementPoint(e,t){if(!this.renderer)return this.screenToWorld(e,t);this.rayAt(e,t);let n=this.ray.intersectObjects(this.terrainGroup.children,!0).find(s=>s.object.userData.terrain);return n&&n.face.normal.y>.5?{x:n.point.x,y:Math.max(0,n.point.y),z:n.point.z}:this.screenToWorld(e,t)}terrainCell(e,t,n){if(!this.renderer){let r=this.screenToWorld(e,t);return{x:Math.floor(r.x),y:this.side?Math.floor(r.y):n.layer||0,z:this.side?0:Math.floor(r.z)}}if(this.rayAt(e,t),n.tool!=="floor"&&n.layer===0){let r=this.ray.intersectObjects(this.terrainGroup.children,!0).find(a=>a.object.userData.terrain);if(r){let a=r.point.clone().addScaledVector(r.face.normal,n.erase?-.015:.015);return{x:Math.floor(a.x),y:Math.max(0,Math.floor(a.y)),z:Math.floor(a.z)}}}let s=this.screenToWorld(e,t,n.tool==="floor"?0:n.layer||0);return{x:Math.floor(s.x),y:n.layer||0,z:Math.floor(s.z)}}hit(e,t,n){if(this.renderer){this.rayAt(e,t);let c=new Set(n.filter(u=>u.visible!==!1&&!u.removed).map(u=>u.id));return this.ray.intersectObjects([...this.meshes].filter(([u])=>c.has(u)).map(([,u])=>u),!0)[0]?.object.userData.objectId||null}let s=this.canvas.getBoundingClientRect(),r=this.scale2d(),a=this.center2d(),o=e-s.left,l=t-s.top;return[...n].sort((c,h)=>this.side?c.z-h.z:h.z-c.z).find(c=>{if(c.visible===!1||c.removed)return!1;let h=this.w/2+(c.x-a.x)*r,u=this.h/2+(this.side?a.y-c.y-.8*c.scale:c.z-a.z-c.y)*r,d=r*1.8*c.scale,f=this.getImage(c),g=c.kind==="image"&&f.naturalHeight?f.naturalWidth/f.naturalHeight:1;return Math.abs(o-h)<d*g*.5&&Math.abs(l-u)<d*.5})?.id||null}scale2d(){return this.playing&&(this.camConfig.follow||this.side)?Math.min(this.w/20,this.h/13):Math.min(this.w/(this.map.width+2),this.h/(this.side?13:this.map.depth+2))*this.zoom}center2d(){return this.playing&&(this.camConfig.follow||this.side)?{x:this.followPoint.x,y:this.followPoint.y+3,z:this.followPoint.z}:{x:this.pan.x,y:(this.sideCenter||4)+this.pan.y,z:this.pan.z}}getImage(e){let t=e.kind+e.color+(e.assetId||"");if(!this.images.has(t)){let n=new Image;n.src=e.kind==="image"?this.assets.find(s=>s.id===e.assetId)?.src||"":"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(Xn(e.kind,e.color)),this.images.set(t,n)}return this.images.get(t)}showSelection(e,t,n){this.selectionLabel.hidden=!e||this.playing,!(!e||this.playing)&&(this.selectionLabel.textContent=e.name+(e.visible===!1?" \xB7 hidden":""),this.selectionLabel.style.left=ot(t,45,this.w-45)+"px",this.selectionLabel.style.top=ot(n,26,this.h-30)+"px",this.canvas.dataset.selectedId=e.id)}draw(e,t=0,n=null){if(!this.scene)return;let s=Math.min(.05,Math.max(.001,t-(this.lastDrawTime||t)));this.lastDrawTime=t,n&&this.updatePlayCamera(n.player,s);let r=e.find(a=>a.id===this.selected);if(r||(delete this.canvas.dataset.selectedId,this.selectionLabel.hidden=!0),this.renderer){for(let l of e){let c=this.meshes.get(l.id);c&&(c.visible=l.visible!==!1&&!l.removed&&!(n?.player===l&&this.camConfig.preset==="first"),c.position.set(l.x,l.y||0,l.z),c.scale.setScalar(l.scale),c.rotation.y=l.angle??l.rotation??0,l.kind==="crystal"&&!n&&(c.position.y+=Math.sin(t*1.6+l.x)*.12,c.rotation.y+=t*.4),l.kind==="slime"&&(c.scale.y=l.scale*(1+Math.sin(t*3+l.x)*.04)),l.kind==="image"&&c.children.forEach(h=>{h.userData.upright&&(h.rotation.y=Math.atan2(this.camera.position.x-l.x,this.camera.position.z-l.z)-c.rotation.y)}))}if(this.world.updateMatrixWorld(!0),this.selection.visible=!!r&&!n,this.selectionLabel.hidden=!!n||!r,r&&!n){let l=this.meshes.get(r.id);this.selectionBox.setFromObject(l).expandByScalar(.07);let c=new P;this.selectionBox.getCenter(c),c.y=this.selectionBox.max.y+.2,c.project(this.camera),this.showSelection(r,(c.x+1)*this.w/2,(1-c.y)*this.h/2)}if(this.brushCell&&!n){let l=this.brushCell;this.brushPreview.visible=!0,this.brushPreview.box.min.set(l.x,l.y,l.z),this.brushPreview.box.max.set(l.x+1,l.y+(this.brushHeight||1),l.z+1)}else this.brushPreview.visible=!1;this.grid&&(this.grid.visible=this.showGrid&&!n);let a=[...n?.particles||[],...n?.bullets||[]].slice(0,340),o=this.particleGeo.attributes.position;a.forEach((l,c)=>o.setXYZ(c,l.x,l.y,l.z)),o.needsUpdate=!0,this.particleGeo.setDrawRange(0,a.length),this.drawPath3d(),this.renderer.render(this.world,this.camera)}else this.draw2d(e,t,n,r)}drawPath3d(){let e=JSON.stringify(this.path);if(e===this.lastPath||(this.lastPath=e,this.pathGroup&&(this.disposeTree(this.pathGroup),this.world.remove(this.pathGroup)),this.pathGroup=new En,this.world.add(this.pathGroup),!this.path.length))return;let t=this.path.map(s=>new P(s.x,(s.y||0)+.12,s.z));t.length>1&&t.push(t[0].clone());let n=new yr(new It().setFromPoints(t),new ao({color:"#8beaff",dashSize:.2,gapSize:.13,depthTest:!1}));n.computeLineDistances(),this.pathGroup.add(n);for(let s of this.path)pn(.1,"#abf5ff",this.pathGroup,s.x,(s.y||0)+.12,s.z)}draw2d(e,t,n,s){let r=this.ctx,a=this.scale2d(),o=this.map,l=this.center2d();if(r.clearRect(0,0,this.w,this.h),r.save(),r.translate(this.w/2-l.x*a,this.h/2+(this.side?l.y*a:-l.z*a)),r.imageSmoothingEnabled=!1,this.terrainCanvas&&r.drawImage(this.terrainCanvas,-o.width/2*a,this.side?-16*a:-o.depth/2*a,o.width*a,(this.side?20:o.depth)*a),o.decorated&&this.scene.theme==="race"&&!this.side&&(r.strokeStyle="#344453",r.lineWidth=a*2.2,r.strokeRect(-a*4.6,-a*2.8,a*9.2,a*5.6),r.strokeStyle="#d3dbb9",r.lineWidth=1,r.setLineDash([10,10]),r.strokeRect(-a*4.6,-a*2.8,a*9.2,a*5.6),r.setLineDash([])),this.showGrid&&!n){r.strokeStyle="#9bc7bb33",r.lineWidth=1;for(let c=-o.width/2;c<=o.width/2;c++)r.beginPath(),r.moveTo(c*a,this.side?-16*a:-o.depth/2*a),r.lineTo(c*a,this.side?0:o.depth/2*a),r.stroke();for(let c=this.side?-16:-o.depth/2;c<=(this.side?0:o.depth/2);c++)r.beginPath(),r.moveTo(-o.width/2*a,c*a),r.lineTo(o.width/2*a,c*a),r.stroke()}this.path.length&&!n&&(r.strokeStyle="#85ecff",r.lineWidth=2,r.setLineDash([5,5]),r.beginPath(),this.path.forEach((c,h)=>{let u=c.x*a,d=(this.side?-(c.y||0):c.z)*a;h?r.lineTo(u,d):r.moveTo(u,d)}),r.closePath(),r.stroke(),r.setLineDash([]));for(let c of[...e].sort((h,u)=>this.side?u.z-h.z:h.z-u.z)){if(c.removed||c.visible===!1)continue;let h=this.getImage(c),u=a*1.8*c.scale,d=c.kind==="image"&&h.naturalWidth?h.naturalWidth/h.naturalHeight:1;r.save(),r.translate(c.x*a,(this.side?-c.y-.8*c.scale:c.z-c.y)*a),["car","ship"].includes(c.kind)&&r.rotate(-(c.angle??c.rotation)+Math.PI),h.complete&&h.naturalWidth&&r.drawImage(h,-u*d/2,-u/2,u*d,u),r.restore()}if(s&&!n){let c=a*1.8*s.scale,h=this.getImage(s),u=s.kind==="image"&&h.naturalHeight?h.naturalWidth/h.naturalHeight:1,d=s.x*a,f=(this.side?-s.y-.8*s.scale:s.z-s.y)*a;r.strokeStyle="#8decff",r.lineWidth=2,r.setLineDash([5,3]),r.strokeRect(d-c*u*.55,f-c*.55,c*u*1.1,c*1.1),r.setLineDash([]);for(let[g,x]of[[-1,-1],[-1,1],[1,-1],[1,1]])r.fillStyle="#c7f7ff",r.fillRect(d+g*c*u*.55-3,f+x*c*.55-3,6,6);this.showSelection(s,this.w/2+(s.x-l.x)*a,this.h/2+(this.side?l.y-s.y-.8*s.scale:s.z-s.y-l.z)*a-c*.6)}if(this.brushCell&&!n){let c=this.brushCell;r.strokeStyle="#a4f3c4",r.lineWidth=2,r.strokeRect(c.x*a,(this.side?-c.y-1:c.z)*a,a,this.side?a*(this.brushHeight||1):a)}for(let c of n?.particles||[])r.globalAlpha=Math.min(1,c.life),r.fillStyle=c.color,r.fillRect(c.x*a,(this.side?-c.y:c.z-c.y)*a,4,4);r.globalAlpha=1;for(let c of n?.bullets||[])r.fillStyle="#e3ffbc",r.fillRect(c.x*a-2,(this.side?-c.y:c.z-c.y)*a-5,5,10);r.restore()}destroy(){this.ro.disconnect(),this.world&&this.disposeTree(this.world),this.renderer?.dispose(),this.canvas.remove(),this.selectionLabel.remove()}};var vo=class{constructor(e,t=0,n=()=>{}){this.project=e,this.onEvent=n,this.score=0,this.lives=e.rules.lives,this.time=0,this.won=!1,this.lost=!1,this.particles=[],this.bullets=[],this.side=e.camera?.preset==="side",this.load(t)}load(e){this.sceneIndex=ot(e,0,this.project.scenes.length-1),this.scene=this.project.scenes[this.sceneIndex],this.terrain=new is(this.scene),this.limits=rn(this.scene),this.objects=_n(this.scene.objects).filter(t=>t.visible!==!1),this.player=this.objects.find(t=>ht(t,"control")||ht(t,"drive")),this.objects.forEach(t=>{t.home={x:t.x,z:t.z,y:t.y},t.angle=t.rotation||0,t.vy=0,t.target=0,t.cooldown=0,t.grounded=!1}),this.bullets=[],this.invincible=0,this.talkCooldown=1,this.actionWasDown=!1,this.onEvent({type:"scene",index:this.sceneIndex})}emit(e,t){this.onEvent({type:e,object:t})}burst(e,t,n="#68edff",s=18,r=.5){for(let a=0;a<s&&this.particles.length<240;a++)this.particles.push({x:e,z:t,y:r,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,vy:Math.random()*3,life:.6+Math.random()*.6,color:n})}next(e="next"){if(e!=="close")if(e==="next")this.sceneIndex+1<this.project.scenes.length?this.load(this.sceneIndex+1):this.win();else{let t=this.project.scenes.findIndex(n=>n.id===e);t>=0&&this.load(t)}}win(){this.won||(this.won=!0,this.emit("win"))}hit(){this.invincible>0||this.won||this.lost||(this.lives--,this.invincible=2,this.emit("hurt"),this.player&&(this.burst(this.player.x,this.player.z,"#ff929c",18,this.player.y+.5),Object.assign(this.player,this.player.home,{vy:0,velocity:0})),this.lives<=0&&(this.lost=!0,this.emit("lose")))}blocked(e,t,n){let s=.3*e.scale,r=1.15*e.scale;return this.terrain.blocked(t,n,e.y,r,s)?!0:e!==this.player?!1:this.objects.some(a=>a!==e&&ht(a,"solid")&&!a.removed&&Math.hypot(t-a.x,n-a.z)<.48*(e.scale+a.scale)&&e.y<a.y+(a.kind==="tree"?2:1)*a.scale&&e.y+r>a.y+.1)}move(e,t,n){let s=this.limits,r=ot(e.x+t,s.minX,s.maxX),a=ot(e.z+n,s.minZ,s.maxZ);this.blocked(e,r,e.z)||(e.x=r),this.blocked(e,e.x,a)||(e.z=a)}vertical(e,t,n){let s=e.y,r=1.15*e.scale,a=this.terrain.floor(e.x,e.z,e.y+.08,.28*e.scale);e.grounded=Number.isFinite(a)&&Math.abs(e.y-a)<.13&&e.vy<=0,e.grounded&&(e.y=a,e.vy=0),n&&e.grounded&&(e.vy=In(e,"jump")?.power||6,e.grounded=!1,this.emit("jump",e)),e.vy-=16*t;let o=e.y+e.vy*t;if(e.vy>0){let l=this.terrain.ceiling(e.x,e.z,s+r-.01,o+r,.28*e.scale);Number.isFinite(l)&&(o=l-r,e.vy=0)}e.vy<=0&&(a=this.terrain.floor(e.x,e.z,s+.04,.28*e.scale),Number.isFinite(a)&&o<=a&&s>=a-.1&&(o=a,e.vy=0,e.grounded=!0)),e.y=o,e.y<-6&&(e===this.player?this.hit():Object.assign(e,e.home,{vy:0}))}update(e,t={}){if(e=ot(e,0,.05),this.invincible=Math.max(0,this.invincible-e),this.talkCooldown=Math.max(0,this.talkCooldown-e),this.particles=this.particles.filter(r=>(r.life-=e,r.x+=r.vx*e,r.z+=r.vz*e,r.y+=r.vy*e,r.vy-=6*e,r.life>0)),this.won||this.lost)return;if(this.time+=e,this.project.rules.timeLimit&&this.time>=this.project.rules.timeLimit){this.lost=!0,this.emit("lose");return}let n=t.action&&!this.actionWasDown;this.actionWasDown=!!t.action;for(let r of this.objects){if(r.removed)continue;if(r.cooldown=Math.max(0,r.cooldown-e),ht(r,"control")){let d=(t.right?1:0)-(t.left?1:0),f=this.side?0:(t.down?1:0)-(t.up?1:0),g=Math.hypot(d,f)||1,x=t.moveYaw||0,m=(d*Math.cos(x)+f*Math.sin(x))/g,p=(f*Math.cos(x)-d*Math.sin(x))/g,w=In(r,"control").speed||4;this.move(r,m*w*e,p*w*e),(d||f)&&(r.angle=Math.atan2(m,p),d&&(r.facing=Math.sign(d)))}if(ht(r,"drive")){let d=In(r,"drive").speed||6;r.velocity=(r.velocity||0)+((t.up?6:0)-(t.down?7:0))*e,r.velocity*=Math.pow(.72,e),r.velocity=ot(r.velocity,-d*.45,d),r.angle+=((t.left?1:0)-(t.right?1:0))*e*2*Math.sign(r.velocity||1),this.move(r,Math.sin(r.angle)*r.velocity*e,Math.cos(r.angle)*r.velocity*e)}if(ht(r,"shoot")&&t.action&&r.cooldown<=0&&this.bullets.length<100){let d=t.moveYaw||0,f=this.side?0:t.lookPitch||0,g=this.side?r.facing||1:-Math.sin(d)*Math.cos(f),x=this.side?0:-Math.cos(d)*Math.cos(f),m=this.side?0:-Math.sin(f);this.bullets.push({x:r.x+g*.5,z:r.z+x*.5,y:r.y+(this.project.camera?.preset==="first"?this.project.camera.height:.65),dx:g,dz:x,dy:m,life:3,speed:In(r,"shoot").speed||8}),r.cooldown=.23,this.emit("shoot",r)}let a=In(r,"follow"),o=In(r,"patrol"),l=In(r,"wander"),c=null,h=0;if(a&&this.player&&r!==this.player)c=this.player,h=a.speed||1.6;else if(o){let d=r.path?.length?r.path:[{x:r.home.x-1.4,z:r.home.z},{x:r.home.x+1.4,z:r.home.z}];r.target%=d.length,c=d[r.target],h=o.speed||2,Math.hypot(r.x-c.x,r.z-c.z)<.15&&(r.target=(r.target+1)%d.length)}else l&&((!r.wanderTo||Math.hypot(r.x-r.wanderTo.x,r.z-r.wanderTo.z)<.2)&&(r.wanderTo={x:ot(r.home.x+(Math.random()-.5)*5,this.limits.minX,this.limits.maxX),z:this.side?r.home.z:ot(r.home.z+(Math.random()-.5)*5,this.limits.minZ,this.limits.maxZ)}),c=r.wanderTo,h=l.speed||1.2);if(c){let d=c.x-r.x,f=this.side?0:c.z-r.z,g=Math.hypot(d,f);g>.15&&(this.move(r,d/g*Math.min(h*e,g),f/g*Math.min(h*e,g)),r.angle=Math.atan2(d,f))}let u=ht(r,"jump")||ht(r,"control")||ht(r,"drive")||a||l||o;u&&this.vertical(r,e,ht(r,"jump")&&n),ht(r,"spin")&&(r.angle+=e*(In(r,"spin").speed||1.5)),ht(r,"bounce")&&!u&&(r.y=r.home.y+.2+Math.sin(this.time*(In(r,"bounce").speed||2))*.2),ht(r,"particles")&&Math.random()<e*6&&this.burst(r.x,r.z,r.color,1,r.y+.5)}let s=this.player;if(s)for(let r of this.objects){if(r===s||r.removed)continue;let a=Math.hypot(s.x-r.x,s.z-r.z),o=Math.abs(s.y-r.y),l=a<.6*(s.scale+r.scale)&&o<1.2*(s.scale+r.scale)/2;if(l&&ht(r,"collect")&&(r.removed=!0,this.score++,this.burst(r.x,r.z,r.color,18,r.y+.5),this.emit("collect",r),this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&["racing","shooter"].includes(this.project.genre)&&this.win()),l&&ht(r,"hazard")&&o<.7&&this.hit(),l&&ht(r,"goal"))if(this.score>=this.project.rules.targetScore){this.next();return}else this.talkCooldown<=0&&(this.emit("locked",r),this.talkCooldown=2);ht(r,"talk")&&a<2&&o<2&&t.interact&&this.talkCooldown<=0&&(this.emit("talk",r),this.talkCooldown=1)}for(let r of this.bullets)if(r.x+=(r.dx||0)*r.speed*e,r.z+=(r.dz??-1)*r.speed*e,r.y+=(r.dy||0)*r.speed*e,r.life-=e,this.terrain.blocked(r.x,r.z,r.y,.1,.08)&&(r.life=0),!(r.life<=0)){for(let a of this.objects)if(!a.removed&&ht(a,"hazard")&&Math.hypot(r.x-a.x,r.z-a.z)<.7*a.scale&&Math.abs(r.y-(a.y+.5))<.8*a.scale){a.removed=!0,r.life=0,this.score++,this.burst(a.x,a.z,a.color,18,a.y+.5),this.emit("collect",a),this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&this.win();break}}this.bullets=this.bullets.filter(r=>r.life>0&&Math.abs(r.x)<this.terrain.map.width/2&&Math.abs(r.z)<this.terrain.map.depth/2)}};var Ed=".game-hud{position:absolute;inset:20px 20px auto;display:flex;gap:10px;pointer-events:none;z-index:8;align-items:center;font:600 13px system-ui;color:#ecfbff}.hud-pill{padding:10px 15px;border:1px solid #5bbcc52b;border-radius:12px;background:#101e2bd9;backdrop-filter:blur(10px)}.hud-spacer{flex:1}.game-hint{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 18px;color:#d5eaf0;font:12px system-ui;background:#12202bd9;border:1px solid #ffffff15;border-radius:10px;white-space:nowrap;z-index:8}.game-overlay{position:absolute;inset:0;display:grid;place-items:center;z-index:12;background:#0b132c75;backdrop-filter:blur(6px)}.game-overlay[hidden]{display:none}.game-card{width:min(440px,90%);padding:32px;background:#15222ef2;border:1px solid #6de0ef55;border-radius:22px;box-shadow:0 25px 100px #0008;text-align:center;color:#f0fbff;font:14px system-ui}.game-card h2{font-size:28px;letter-spacing:-1px;margin:12px 0}.game-card p{line-height:1.7;color:#adc3ce}.game-card .game-big{font-size:42px}.game-card button{display:block;background:#4cdef1;border:0;border-radius:10px;padding:13px 18px;width:100%;color:#10313b;font:700 14px system-ui;cursor:pointer;margin-top:10px}.game-card button.secondary{background:#263847;color:#d4eff6}.touch-controls{position:absolute;bottom:30px;left:24px;right:24px;display:flex;justify-content:space-between;pointer-events:none;z-index:10}.touch-controls .dpad{display:grid;grid-template-columns:repeat(3,42px);grid-template-rows:repeat(2,40px);gap:4px}.touch-controls button{pointer-events:auto;background:#223848c9;border:1px solid #88d9e85c;color:#effaff;font:700 20px system-ui;border-radius:10px;touch-action:none;user-select:none}.touch-controls .touch-action{height:62px;width:62px;align-self:flex-end}.touch-controls .touch-interact{height:42px;width:42px;align-self:flex-end;margin-right:8px}.touch-controls .up{grid-column:2}.touch-controls .left{grid-row:2}.touch-controls .down{grid-row:2}.touch-controls .right{grid-row:2}.touch-controls .actions{display:flex}.game-note{position:absolute;left:50%;top:80px;transform:translateX(-50%);background:#172d3e;color:#c1f5ff;padding:12px 18px;border:1px solid #54cddb66;border-radius:12px;z-index:11;font:13px system-ui;text-align:center}.touch-controls{opacity:.55}.touch-controls:hover{opacity:1}@media(pointer:fine) and (min-width:900px){.touch-controls{display:none}}@media(max-width:600px){.game-hint{bottom:8px;font-size:10px}.game-hud{inset:12px 12px auto}.hud-pill{padding:8px}}",yo=class{constructor({host:e,project:t,sceneIndex:n=0,renderer:s=null,onStop:r=()=>{}}){if(this.host=e,this.project=t,this.startIndex=n,this.onStop=r,this.ownsRenderer=!s,s)this.renderer=s;else try{this.renderer=new Ti(e,t.mode)}catch{e.querySelectorAll("canvas").forEach(o=>o.remove()),this.renderer=new Ti(e,"2d")}this.renderer.configure(t.camera),this.input={},this.paused=!1,this.muted=!t.sound,this.audioCtx=null,this.activeAudio=new Set,this.destroyed=!1,this.ui=document.createElement("div"),this.ui.className="player-ui",this.ui.innerHTML=`<div class="game-hud"><div class="hud-pill hud-title"></div><div class="hud-spacer"></div><div class="hud-pill hud-score"></div><div class="hud-pill hud-hearts"></div><div class="hud-pill hud-time"></div></div><div class="game-hint">${t.genre==="racing"?"\u2191 Accelerate &nbsp; \u2190 \u2192 Steer &nbsp; \u2193 Brake":t.genre==="shooter"?"Arrow keys / WASD to move &nbsp; \xB7 &nbsp; Space to shoot":"Arrow keys / WASD to move &nbsp; \xB7 &nbsp; Space to jump &nbsp; \xB7 &nbsp; E to talk"}</div><div class="touch-controls"><div class="dpad"><button class="up" data-key="up" aria-label="Move up">\u2191</button><button class="left" data-key="left" aria-label="Move left">\u2190</button><button class="down" data-key="down" aria-label="Move down">\u2193</button><button class="right" data-key="right" aria-label="Move right">\u2192</button></div><div class="actions"><button class="touch-interact" data-key="interact" aria-label="Talk">E</button><button class="touch-action" data-key="action" aria-label="Jump or shoot">\u2726</button></div></div><div class="game-overlay" hidden></div><div class="game-note" hidden></div>`,e.append(this.ui),this.overlay=this.ui.querySelector(".game-overlay");let a=t.camera?.preset;a==="side"?this.ui.querySelector(".game-hint").textContent="\u2190 \u2192 / A D to run \xB7 Space to jump \xB7 E to talk":(a==="first"||a==="third")&&(this.ui.querySelector(".game-hint").textContent="WASD / arrows to move \xB7 Drag to look \xB7 Q / R turn \xB7 Space \xB7 E talk"),this.keymap={q:"turnLeft",Q:"turnLeft",r:"turnRight",R:"turnRight",ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"," ":"action",e:"interact",E:"interact"},this.keydown=o=>{if(o.key==="Escape"){this.onStop();return}let l=this.keymap[o.key];l&&(o.preventDefault(),this.input[l]=!0)},this.keyup=o=>{let l=this.keymap[o.key];l&&(o.preventDefault(),this.input[l]=!1)},this.blur=()=>{this.input={}},window.addEventListener("keydown",this.keydown),window.addEventListener("keyup",this.keyup),window.addEventListener("blur",this.blur),this.ui.querySelectorAll("[data-key]").forEach(o=>{o.onpointerdown=l=>{l.preventDefault(),o.setPointerCapture(l.pointerId),this.input[o.dataset.key]=!0},o.onpointerup=o.onpointercancel=()=>{this.input[o.dataset.key]=!1}}),this.worldClick=o=>{if(this.paused||!this.sim||this.lookMoved||o.target!==this.renderer.canvas)return;let l=this.renderer.hit(o.clientX,o.clientY,this.sim.objects),c=this.sim.objects.find(h=>h.id===l);c&&ht(c,"talk")&&(c.kind==="button"||this.sim.player&&Math.hypot(c.x-this.sim.player.x,c.z-this.sim.player.z)<2)&&(this.playSound(c.soundId),this.showStory())},e.addEventListener("pointerup",this.worldClick),this.lookDown=o=>{this.paused||!["first","third"].includes(this.project.camera?.preset)||o.target!==this.renderer.canvas||(this.lookDrag={id:o.pointerId,x:o.clientX,y:o.clientY},this.lookMoved=!1,this.host.setPointerCapture(o.pointerId))},this.lookMove=o=>{if(!this.lookDrag||this.lookDrag.id!==o.pointerId)return;let l=o.clientX-this.lookDrag.x,c=o.clientY-this.lookDrag.y;Math.abs(l)+Math.abs(c)>2&&(this.lookMoved=!0),this.renderer.cameraYaw-=l*.005,this.renderer.cameraPitch=ot(this.renderer.cameraPitch+c*.004,-1.2,1.2),this.lookDrag.x=o.clientX,this.lookDrag.y=o.clientY},this.lookUp=()=>{this.lookDrag=null},e.addEventListener("pointerdown",this.lookDown),e.addEventListener("pointermove",this.lookMove),e.addEventListener("pointerup",this.lookUp),e.addEventListener("pointercancel",this.lookUp),this.reset(),this.playMusic(),this.last=performance.now(),this.frame=requestAnimationFrame(o=>this.loop(o))}reset(){this.paused=!1,this.overlay.hidden=!0,this.input={},this.sim=new vo(this.project,this.startIndex,e=>this.event(e)),this.renderer.selected=null,this.renderer.path=[],this.renderer.setScene(this.sim.scene,this.project.assets),this.renderer.beginPlay(this.project.camera,this.sim.player),this.hudCache=null,this.updateHud(),this.project.genre==="story"&&this.showStory()}event(e){if(e.type==="scene"){let t=this.project.scenes[e.index];this.renderer.setScene(t,this.project.assets),this.ui.querySelector(".hud-title").textContent=t.name,this.sim&&(this.renderer.followPoint.set(this.sim.player?.x||0,this.sim.player?.y||0,this.sim.player?.z||0),this.renderer.cameraReady=!1,this.host.classList.remove("scene-fade","scene-slide"),this.host.offsetWidth,t.transition!=="none"&&this.host.classList.add("scene-"+t.transition),this.project.genre==="story"&&queueMicrotask(()=>this.showStory()))}e.type==="collect"&&(this.tone(660,.13,"sine"),setTimeout(()=>this.tone(990,.15,"sine"),70),this.playSound(e.object?.soundId)),e.type==="shoot"&&this.tone(300,.07,"triangle",100),e.type==="hurt"&&this.tone(140,.18,"triangle",80),e.type==="locked"&&this.note(`Find ${Math.max(0,this.project.rules.targetScore-this.sim.score)} more crystals to open the portal.`),e.type==="talk"&&(this.playSound(e.object?.soundId),this.showStory()),e.type==="win"&&(this.tone(880,.3),this.showCard("\u2726","You made it!",`${this.sim.score} points. A whole world of possibilities.`,[{label:"Play again",action:()=>this.reset()},{label:"Back to creating",action:this.onStop,secondary:!0}])),e.type==="lose"&&this.showCard("\u2661","One more adventure?","Every great game takes a little practice.",[{label:"Try again",action:()=>this.reset()},{label:"Back to creating",action:this.onStop,secondary:!0}])}showCard(e,t,n,s){this.paused=!0,this.input={},this.overlay.hidden=!1,this.overlay.innerHTML=`<div class="game-card"><span class="game-big">${Ge(e)}</span><h2>${Ge(t)}</h2><p>${Ge(n)}</p>${s.map((r,a)=>`<button class="${r.secondary?"secondary":""}" data-choice="${a}">${Ge(r.label)}</button>`).join("")}</div>`,this.overlay.querySelectorAll("button").forEach(r=>r.onclick=()=>{this.overlay.hidden=!0,this.paused=!1,s[Number(r.dataset.choice)].action()})}showStory(){let e=this.sim.scene.story;this.showCard("\u263E",e.title,e.text,e.choices.map(t=>({label:t.text,action:()=>{this.sim.next(t.target)}})))}note(e){let t=this.ui.querySelector(".game-note");t.textContent=e,t.hidden=!1,clearTimeout(this.noteTimer),this.noteTimer=setTimeout(()=>t.hidden=!0,2400)}updateHud(){if(!this.sim)return;let e=[this.sim.sceneIndex,this.sim.score,this.sim.lives,Math.ceil(this.sim.time)].join(":");if(e===this.hudCache)return;this.hudCache=e,this.ui.querySelector(".hud-title").textContent=this.sim.scene.name,this.ui.querySelector(".hud-score").textContent=`\u25C6 ${this.sim.score}${this.project.rules.targetScore?" / "+this.project.rules.targetScore:""}`,this.ui.querySelector(".hud-hearts").textContent="\u2665 ".repeat(Math.max(0,this.sim.lives));let t=this.ui.querySelector(".hud-time");t.hidden=!this.project.rules.timeLimit,t.textContent=`\u25F7 ${Math.max(0,Math.ceil(this.project.rules.timeLimit-this.sim.time))}s`}togglePause(){if(this.overlay.hidden)return this.paused=!this.paused,this.input={},this.note(this.paused?"Paused. Take your time.":"Let\u2019s play!"),this.paused}loop(e){if(this.destroyed)return;let t=Math.min((e-this.last)/1e3,.05);this.last=e;let n=Array.from(navigator.getGamepads?.()||[]).find(s=>s&&s.connected);if(n){let s=n.axes[0]||0,r=n.axes[1]||0,a=n.axes[2]||0;this.input.left=s<-.25||!!n.buttons[14]?.pressed,this.input.right=s>.25||!!n.buttons[15]?.pressed,this.input.up=r<-.25||!!n.buttons[12]?.pressed,this.input.down=r>.25||!!n.buttons[13]?.pressed,this.input.turnLeft=a<-.25||!!n.buttons[4]?.pressed,this.input.turnRight=a>.25||!!n.buttons[5]?.pressed,this.input.action=!!(n.buttons[0]?.pressed||n.buttons[7]?.pressed),this.input.interact=!!(n.buttons[2]?.pressed||n.buttons[3]?.pressed)}this.paused||(["first","third"].includes(this.project.camera?.preset)&&(this.renderer.cameraYaw+=((this.input.turnLeft?1:0)-(this.input.turnRight?1:0))*t*1.7,this.input.moveYaw=this.renderer.cameraYaw,this.input.lookPitch=this.renderer.cameraPitch),this.sim.update(t,this.input)),this.renderer.draw(this.sim.objects,e/1e3,this.sim),this.updateHud(),this.frame=requestAnimationFrame(s=>this.loop(s))}tone(e,t=.1,n="sine",s=e){if(!(this.muted||this.destroyed))try{this.audioCtx??=new(window.AudioContext||window.webkitAudioContext),this.audioCtx.resume();let r=this.audioCtx.createOscillator(),a=this.audioCtx.createGain(),o=this.audioCtx.currentTime;r.type=n,r.frequency.setValueAtTime(e,o),r.frequency.exponentialRampToValueAtTime(s,o+t),a.gain.setValueAtTime(.065,o),a.gain.exponentialRampToValueAtTime(.001,o+t),r.connect(a),a.connect(this.audioCtx.destination),r.start(o),r.stop(o+t)}catch{}}playSound(e){if(this.muted||!e)return;let t=this.project.assets.find(s=>s.id===e&&s.kind==="audio");if(!t)return;let n=new Audio(t.src);n.volume=.4,this.activeAudio.add(n),n.onended=()=>this.activeAudio.delete(n),n.play().catch(()=>{})}playMusic(){let e=this.project.assets.find(t=>t.id===this.project.music&&t.kind==="audio");e&&(this.music=new Audio(e.src),this.music.loop=!0,this.music.volume=.2,this.music.muted=this.muted,this.music.play().catch(()=>{}))}setMuted(e){this.muted=e,this.music&&(this.music.muted=e);for(let t of this.activeAudio)t.muted=e}destroy(){this.destroyed=!0,cancelAnimationFrame(this.frame),clearTimeout(this.noteTimer),window.removeEventListener("keydown",this.keydown),window.removeEventListener("keyup",this.keyup),window.removeEventListener("blur",this.blur),this.host.removeEventListener("pointerup",this.worldClick),this.host.removeEventListener("pointerdown",this.lookDown),this.host.removeEventListener("pointermove",this.lookMove),this.host.removeEventListener("pointerup",this.lookUp),this.host.removeEventListener("pointercancel",this.lookUp),this.renderer.endPlay(),this.music?.pause();for(let e of this.activeAudio)e.pause();this.audioCtx?.close(),this.ui.remove(),this.ownsRenderer&&this.renderer.destroy()}};var k=i=>document.querySelector(i),mt=i=>[...document.querySelectorAll(i)],Q=wo(),Jt=0,Mt=Q.scenes[0].objects[0].id,_e,pt=null,At="assets",ri="library",ji="All",Ki="",zn="select",Br=!1,Ai=[],Ur=[],bo,Td,Ji,Mo=0,Xs=!1,th=!1,nn={tool:"floor",shape:"cube",tile:"grass",layer:0,erase:!1},Ct=k("#viewport"),Tt=k("#modal"),Rd=document.createElement("style");Rd.textContent=Ed;document.head.append(Rd);var Ye=()=>Q.scenes[Jt],Et=()=>Ye().objects.find(i=>i.id===Mt);function Id(i=document){i.querySelectorAll("[data-icon]").forEach(e=>{e.innerHTML=oe(e.dataset.icon)})}function Be(i){k("#toast").textContent=i,k("#toast").classList.add("show"),clearTimeout(Td),Td=setTimeout(()=>k("#toast").classList.remove("show"),3e3)}function Pd(){return{..._n({...Q,assets:[]}),assets:Q.assets.slice()}}function Nr(){Ai.push({project:Pd(),sceneIndex:Jt,selectedId:Mt}),Ai.length>35&&Ai.shift(),Ur=[],Ld()}function ct(i,e=!0){pt||(Nr(),i(),ih(e))}function ih(i=!0){Q.updated=Date.now(),i==="terrain"?_e.setTerrain(Ye()):i&&_e.setScene(Ye(),Q.assets),_e.selected=Mt,_e.path=Et()?.path||[],Ws(),kd(),zr()}function zr(){clearTimeout(bo);let i=++Mo;k("#save-state").innerHTML="<i></i>Saving\u2026",bo=setTimeout(async()=>{try{await Eo(_n(Q)),i===Mo&&(k("#save-state").innerHTML="<i></i>Saved on this device")}catch{k("#save-state").textContent="Download to keep your work",Be("Device storage is full or unavailable. Export your project to keep it.")}},500)}async function Fr(){clearTimeout(bo),Mo++;try{return await Eo(_n(Q)),k("#save-state").innerHTML="<i></i>Saved on this device",!0}catch{return Be("Could not save on this device. Download a project backup before leaving."),!1}}function Ld(){k("#undo-button").disabled=!Ai.length,k("#redo-button").disabled=!Ur.length}function _o(i){if(pt)return;let e=i==="undo"?Ai:Ur,t=i==="undo"?Ur:Ai;if(!e.length)return;t.push({project:Pd(),sceneIndex:Jt,selectedId:Mt});let n=e.pop();Q=n.project,Jt=n.sceneIndex,Mt=n.selectedId,Gs(),An(),zr()}function Gs(){if(_e?.mode!==Q.mode){_e?.destroy();try{_e=new Ti(Ct,Q.mode)}catch{Q.mode="2d",Ct.querySelectorAll("canvas").forEach(e=>e.remove()),_e=new Ti(Ct,"2d"),Be("This browser is using 2D. Try another browser for 3D.")}}_e.configure(Q.camera),_e.setScene(Ye(),Q.assets),_e.selected=Mt,_e.path=Et()?.path||[]}function Ws(){k("#project-label").textContent=Q.name,k("#scene-heading").textContent=Ye().name,k("#object-count").textContent=`${Ye().objects.length} objects`,mt("[data-mode]").forEach(e=>{e.classList.toggle("active",e.dataset.mode===Q.mode),e.setAttribute("aria-pressed",e.dataset.mode===Q.mode)});let i=Et();k("#pos-x").textContent=i?.x.toFixed(1)||"0",k("#pos-z").textContent=i?.z.toFixed(1)||"0",k("#sound-toggle").innerHTML=oe("volume")+`<span>Sound ${Q.sound?"on":"off"}</span>`,k("#sound-toggle").setAttribute("aria-pressed",!!Q.sound),Ld()}function An(){mt("[data-panel]").forEach(i=>{i.classList.toggle("active",i.dataset.panel===At)}),Ws(),Ci(),$t(),kd(),Id()}function Dd(i){i!=="build"?ai(!1):(Xs=!0,zn="select",mt("[data-tool]").forEach(e=>e.classList.toggle("active",e.dataset.tool===zn)),es(),_e.showGrid=!0),At===i&&matchMedia("(max-width:600px)").matches?k("#library").classList.toggle("mobile-open"):k("#library").classList.add("mobile-open"),At=i,mt("[data-panel]").forEach(e=>{e.classList.toggle("active",e.dataset.panel===At),e.setAttribute("aria-pressed",e.dataset.panel===At)}),Ci()}function Dr(i,e,t,n=""){k("#library").innerHTML=`<div class="library-header"><div class="panel-heading"><h2>${i}</h2><button class="icon-button" id="library-close" aria-label="Close tool shelf">${oe("close")}</button></div><p class="panel-subtitle">${e}</p>${["assets","behaviors"].includes(At)?`<label class="search-field">${oe("search")}<input id="asset-search" aria-label="Search ${At}" placeholder="Search ${At}\u2026" value="${Ge(Ki)}"></label>`:""}</div>${At==="assets"?`<div class="library-tabs"><button data-lib-tab="library" class="${ri==="library"?"active":""}">Library</button><button data-lib-tab="scene" class="${ri==="scene"?"active":""}">In scene <span class="count">${Ye().objects.length}</span></button></div>`:""}<div class="library-scroll" id="library-scroll">${t}</div>${n?`<div class="library-footer">${n}</div>`:""}`,k("#library-close").onclick=()=>{matchMedia("(max-width:600px)").matches?k("#library").classList.remove("mobile-open"):(document.body.classList.toggle("shelf-hidden"),k("#library").style.display="none")};let s=k("#asset-search");s&&(s.oninput=r=>{Ki=r.target.value,Hn()}),mt("[data-lib-tab]").forEach(r=>r.onclick=()=>{ri=r.dataset.libTab,Ci()})}function Ci(){At==="assets"?(Dr("Your assets","Little pieces. Endless possibilities.","",`<button class="upload-zone" id="upload-assets">${oe("upload")}<span>Drop files or upload</span><small>Images, music & sound effects</small></button><button class="quiet-button" id="new-sprite-inline" style="width:100%;justify-content:center;margin-top:8px">${oe("edit")}Draw a sprite</button>`),k("#upload-assets").onclick=()=>k("#asset-input").click(),k("#new-sprite-inline").onclick=()=>lh(),Hn()):At==="behaviors"?(Dr("Make it move",Et()?`Give ${Ge(Et().name)} a little magic.`:"Choose an object, then a behavior.","",`<div class="pill-note">${oe("mouse")}Drag a behavior onto any object.</div>`),Hn()):At==="sounds"?(Dr("A little atmosphere","Every world has a sound.",`<div class="section-label">GAME SOUNDS</div><button id="sound-library-toggle" class="toggle" aria-pressed="${!!Q.sound}"><i></i>Built-in sound effects</button><label class="field-label" for="music-select">Background music</label><select id="music-select"><option value="">Quiet for now</option>${Q.assets.filter(e=>e.kind==="audio").map(e=>`<option value="${Ge(e.id)}" ${Q.music===e.id?"selected":""}>${Ge(e.name)}</option>`).join("")}</select><p class="dialog-note">Upload a song, then pick it here. It loops while your game plays.</p><div class="section-label" style="margin-top:25px">YOUR SOUNDS</div>${Q.assets.filter(e=>e.kind==="audio").map(e=>`<div class="audio-row"><button class="icon-button" data-audio="${Ge(e.id)}" aria-label="Preview ${Ge(e.name)}">${oe("play")}</button><div><strong>${Ge(e.name)}</strong><div class="waveform">${Array.from({length:22},(t,n)=>`<i style="--h:${5+Math.sin(n*2.3)**2*14}px"></i>`).join("")}</div></div><button class="icon-button" data-download-asset="${Ge(e.id)}" aria-label="Download sound">${oe("download")}</button></div>`).join("")||`<div class="empty-state">${oe("music")}A soundtrack starts with a sound.<br>Drop an audio file here.</div>`}`,`<button class="upload-zone" id="upload-assets">${oe("upload")}<span>Add sounds</span><small>MP3, WAV, OGG, M4A</small></button>`),k("#upload-assets").onclick=()=>k("#asset-input").click(),k("#sound-library-toggle").onclick=()=>{ct(()=>Q.sound=!Q.sound,!1),Ci()},k("#music-select").onchange=e=>ct(()=>Q.music=e.target.value||null,!1),mt("[data-audio]").forEach(e=>e.onclick=()=>{Ji?.pause();let t=Q.assets.find(n=>n.id===e.dataset.audio);Ji=new Audio(t.src),Ji.volume=.4,Ji.play().catch(()=>Be("This audio format cannot play in this browser."))}),Lv()):At==="build"?Sh({project:Q,scene:Ye(),brush:nn,libraryShell:Dr,change:ct,render:Ci,renderer:_e,slider:kn,bindSlider:Bn,start:()=>{Xs=!0,zn="select",_e.showGrid=!0},finish:()=>ai(),toast:Be}):At==="world"&&(Dr("Your world","Make the rules. Set the mood.",`<div class="section-label">ATMOSPHERE</div><div class="world-colors">${[["forest","Forest","#3f8c72"],["night","Moonlight","#635f93"],["space","Space","#3f527e"],["race","Circuit","#2f6970"],["sand","Sandy","#af9468"]].map(([e,t,n])=>`<button class="theme-card ${Ye().theme===e?"active":""}" style="--theme:${n}" data-theme-choice="${e}">${t}</button>`).join("")}</div><div class="section-label" style="margin-top:25px">GAME RULES</div>${kn("target-score","Points to win",Q.rules.targetScore,0,30,1)}${kn("lives","Hearts",Q.rules.lives,1,10,1)}${kn("time-limit","Time limit",Q.rules.timeLimit,0,300,15,"s")}<p class="dialog-note">Set time to 0 for endless play. Portals open when you reach your point goal.</p><button class="button wide-button" id="world-story">${oe("book")}Edit scene story</button>`),mt("[data-theme-choice]").forEach(e=>e.onclick=()=>{ct(()=>Ye().theme=e.dataset.themeChoice),Ci()}),Bn("target-score",e=>Q.rules.targetScore=e),Bn("lives",e=>Q.rules.lives=e),Bn("time-limit",e=>Q.rules.timeLimit=e,"s"),k("#world-story").onclick=zd);let i=k("#library");i.ondragover=e=>{e.dataTransfer.types.includes("Files")&&(e.preventDefault(),i.classList.add("drop-highlight"))},i.ondragleave=()=>i.classList.remove("drop-highlight"),i.ondrop=e=>{i.classList.remove("drop-highlight"),e.dataTransfer.files.length&&(e.preventDefault(),ah(e.dataTransfer.files))}}function Hn(){let i=k("#library-scroll");if(!i)return;if(At==="behaviors"){i.innerHTML=`<div class="behavior-palette">${Object.entries(ci).filter(([t,n])=>n.name.toLowerCase().includes(Ki.toLowerCase())).map(([t,n])=>`<button class="palette-item" draggable="true" data-add-behavior="${t}">${oe(n.icon)}<span><strong>${n.name}</strong><small>${n.hint}</small></span><span class="plus">+</span></button>`).join("")}</div>`,Ud(i);return}if(ri==="scene"){i.innerHTML=Ye().objects.filter(t=>t.name.toLowerCase().includes(Ki.toLowerCase())).map(t=>`<div class="audio-row ${t.id===Mt?"selected-row":""}" style="${t.id===Mt?"border-color:#5caec5":""}"><button data-select-object="${Ge(t.id)}" style="display:flex;align-items:center;gap:8px;background:none;border:0;flex:1;text-align:left;min-width:0;padding:0"><span style="width:28px;height:28px;flex-shrink:0">${Xn(t.kind,t.color)}</span><strong>${Ge(t.name)}</strong></button><button class="icon-button" data-visibility="${Ge(t.id)}" aria-label="${t.visible?"Hide":"Show"} ${Ge(t.name)}" style="opacity:${t.visible?1:.35}">${oe("eye")}</button></div>`).join("")||'<div class="empty-state">No objects found.</div>',mt("[data-select-object]").forEach(t=>t.onclick=()=>Hr(t.dataset.selectObject,!0)),mt("[data-visibility]").forEach(t=>t.onclick=()=>{ct(()=>{let n=Ye().objects.find(s=>s.id===t.dataset.visibility);n.visible=!n.visible},!1),Hn()});return}let e=[...Zs,...Q.assets.filter(t=>t.kind==="image").map(t=>({...t,category:"Yours",color:"#62d8eb"}))].filter(t=>(ji==="All"||t.category===ji)&&t.name.toLowerCase().includes(Ki.toLowerCase()));i.innerHTML=`<div class="category-chips">${["All","Nature","Objects","Yours"].map(t=>`<button data-category="${t}" class="${ji===t?"active":""}">${t}</button>`).join("")}</div>${["Characters","Nature","Objects","Effects","UI","Yours"].map(t=>{let n=e.filter(s=>s.category===t);return n.length?`<div class="asset-section-title"><span>${t.toUpperCase()}</span><span>${n.length}</span></div><div class="asset-grid">${n.map(s=>`<button class="asset-card" draggable="true" data-asset="${Ge(s.id||s.kind)}" title="Add ${Ge(s.name)} \u2014 click or drag">${s.src?`<img alt="" src="${Ge(s.src)}">`:Xn(s.kind,s.color)}<span class="asset-name">${Ge(s.name)}</span></button>`).join("")}</div>`:""}).join("")}${e.length?"":'<div class="empty-state">Nothing here yet.<br>Try a new search or upload an image.</div>'}`,mt("[data-category]").forEach(t=>t.onclick=()=>{ji=t.dataset.category,Hn()}),mt("[data-asset]").forEach(t=>{t.onclick=()=>Nd(t.dataset.asset),t.ondragstart=n=>{n.dataTransfer.setData("application/soulcode",JSON.stringify({type:"asset",id:t.dataset.asset})),n.dataTransfer.effectAllowed="copy"}})}function Ud(i){i.querySelectorAll("[data-add-behavior]").forEach(e=>{e.onclick=()=>sh(e.dataset.addBehavior),e.ondragstart=t=>{t.dataTransfer.setData("application/soulcode",JSON.stringify({type:"behavior",id:e.dataset.addBehavior})),t.dataTransfer.effectAllowed="copy"}})}function Lv(){mt("[data-download-asset]").forEach(i=>i.onclick=()=>{let e=Q.assets.find(t=>t.id===i.dataset.downloadAsset);e&&fetch(e.src).then(t=>t.blob()).then(t=>Di(t,e.name))})}function Nd(i,e){if(pt)return;if(Ye().objects.length>=200){Be("This scene is full. Add another scene to keep creating.");return}let t=Zs.find(s=>s.kind===i)||Q.assets.find(s=>s.id===i);if(!t)return;let n=e||{x:Math.round((Math.random()-.5)*5*2)/2,z:Math.round((Math.random()-.5)*3*2)/2};ct(()=>{let s=Ve(t.kind,n.x,Q.camera.preset==="side"?.5:n.z,{y:n.y||0,name:t.name,...t.src?{assetId:t.id}:{}});Ye().objects.push(s),Mt=s.id}),$t(),Hn(),k("#library").classList.remove("mobile-open"),Be(`${t.name} joined your world`)}function sh(i){let e=Et();if(!e){Be("Pick an object in your world first.");return}if(e.behaviors.some(t=>t.type===i)){Be(`${e.name} already has that behavior.`);return}ct(()=>{let t=ci[i];e.behaviors.push({type:i,enabled:!0,...t.speed?{speed:t.speed}:{},...t.power?{power:t.power}:{}})},!1),$t(),Tt.close(),Be(`${ci[i].name} added`)}function kn(i,e,t,n,s,r=1,a=""){return`<div class="range-row"><div class="range-label"><label for="${i}">${e}</label><output id="${i}-value">${Number(t).toFixed(r<1?1:0)}${a}</output></div><input type="range" id="${i}" min="${n}" max="${s}" step="${r}" value="${t}" style="--fill:${(t-n)/(s-n)*100}%" aria-label="${e}"></div>`}function Bn(i,e,t="",n=!1){let s=k("#"+i);s&&(s.onpointerdown=()=>Nr(),s.onkeydown=r=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(r.key)&&Nr()},s.oninput=()=>{let r=Number(s.value);e(r),s.style.setProperty("--fill",`${(r-s.min)/(s.max-s.min)*100}%`),k("#"+i+"-value").textContent=r.toFixed(Number(s.step)<1?1:0)+t,ih(n)})}function Hr(i,e=!1){pt||(Mt=i,_e.selected=i,_e.path=Et()?.path||[],Ws(),$t(),ri==="scene"&&Hn(),At==="behaviors"&&Ci(),e&&i&&k("#inspector").classList.add("mobile-open"))}function $t(){let i=Et(),e=rn(Ye(),.1),t=Q.camera.preset==="side",n=k("#inspector");if(!i){n.innerHTML=`<div class="inspector-top"><span>${oe("settings")}Inspector</span></div><div class="empty-state">${oe("mouse")}Pick a little piece of your world.<br>Let\u2019s make it do something.</div><div class="mini-tip">${oe("sparkles")}Drop an asset, add a behavior, and press <strong>Play</strong>.</div>`;return}n.innerHTML=`<div class="inspector-top"><span>${oe("settings")}Inspector</span><div class="inline-row"><button class="icon-button" id="duplicate-object" title="Duplicate object \xB7 Ctrl D" aria-label="Duplicate object">${oe("copy")}</button><button class="icon-button" id="delete-object" title="Delete object" aria-label="Delete object">${oe("trash")}</button><button class="icon-button" id="close-inspector" aria-label="Close inspector">${oe("close")}</button></div></div><div class="object-identity"><div class="object-portrait">${i.kind==="image"?`<img style="width:40px;height:40px;object-fit:contain" src="${Ge(Q.assets.find(s=>s.id===i.assetId)?.src||"")}" alt="">`:Xn(i.kind,i.color)}</div><div><input id="object-name" class="object-name" value="${Ge(i.name)}" maxlength="50" aria-label="Object name"><div class="object-role">${ht(i,"control")||ht(i,"drive")?"PLAYER CHARACTER":ht(i,"collect")?"COLLECTIBLE":ht(i,"hazard")?"LITTLE CHALLENGE":"WORLD OBJECT"}</div></div></div>
 <section class="inspector-section"><div class="section-label">TRANSFORM ${oe("move")}</div><div class="transform-row"><label class="number-field"><span>X</span><input id="object-x" type="number" step=".1" min="${e.minX}" max="${e.maxX}" value="${i.x.toFixed(1)}" aria-label="Horizontal position"></label><label class="number-field z"><span>Y</span><input id="object-z" type="number" step=".1" min="${t?0:e.minZ}" max="${t?20:e.maxZ}" value="${(t?i.y:i.z).toFixed(1)}" aria-label="Vertical position"></label></div>${kn("object-size","Size",i.scale,.2,3,.1,"\xD7")}<div class="color-row">${["#41d9f2","#ab8cff","#ffca76","#45b891","#f08d9f","#f1f5f2"].map(s=>`<button class="swatch ${i.color===s?"active":""}" style="--swatch:${s}" data-color="${s}" aria-label="Color ${s}"></button>`).join("")}<label class="custom-color" title="Pick any color">${oe("plus")}<input id="custom-color" type="color" value="${Ge(i.color)}" aria-label="Custom object color"></label></div></section>
 <section class="inspector-section"><div class="section-label">BEHAVIORS <span class="count">${i.behaviors.length}</span></div>${i.behaviors.map((s,r)=>{let a=ci[s.type];return`<details class="behavior-card" ${r===0?"open":""}><summary><span class="behavior-symbol">${oe(a.icon)}</span><span class="behavior-title">${a.name}<small>${a.hint}</small></span><span class="behavior-chevron">${oe("chevron")}</span></summary><div class="behavior-settings">${s.speed!==void 0?kn("behavior-"+r,"Speed",s.speed,.2,10,.2):s.power!==void 0?kn("behavior-"+r,"Jump height",s.power,2,12,.5):""}${s.type==="patrol"?`<button class="button wide-button" id="draw-path" style="height:30px;font-size:9px">${oe("route")}${i.path?.length?"Edit path \xB7 "+i.path.length+" points":"Draw a path"}</button><button class="quiet-button" id="clear-path">Clear path</button>`:""}<div class="behavior-actions"><button class="toggle" data-toggle-behavior="${r}" aria-pressed="${s.enabled!==!1}"><i></i>${s.enabled!==!1?"On":"Off"}</button><button class="behavior-remove" data-remove-behavior="${r}">Remove</button></div></div></details>`}).join("")}<button class="add-behavior" id="add-behavior">${oe("plus")}Add a behavior</button></section>
 <details class="inspector-details"><summary>${oe("settings")}A little more control ${oe("chevron")}</summary><div>${kn("object-rotation","Turn",Math.round(i.rotation*180/Math.PI),0,360,1,"\xB0")}${kn("object-lift","Lift",i.y,0,20,.1)}<button class="toggle" id="object-visible" aria-pressed="${i.visible}"><i></i>Visible in game</button></div></details>
 <details class="inspector-details"><summary>${oe("music")}Sound on touch ${oe("chevron")}</summary><div><select class="sound-select" id="object-sound" aria-label="Object sound"><option value="">Built-in sound</option>${Q.assets.filter(s=>s.kind==="audio").map(s=>`<option value="${Ge(s.id)}" ${i.soundId===s.id?"selected":""}>${Ge(s.name)}</option>`).join("")}</select><p class="dialog-note">Plays when collected or talked to.</p></div></details>
 ${i.kind==="image"?`<section class="inspector-section sprite-inspector"><div class="section-label">YOUR SPRITE</div><select id="sprite-facing" aria-label="Sprite facing"><option value="upright" ${i.billboard!=="screen"?"selected":""}>Stand up \xB7 face the camera</option><option value="screen" ${i.billboard==="screen"?"selected":""}>Always face the screen</option></select><button id="edit-sprite" class="button wide-button">${oe("edit")}Edit sprite</button><p class="build-note">Artwork stays flat in 3D. Add Follow and Watch out! to make it an enemy.</p></section>`:""}<div class="mini-tip">${oe("sparkles")}A tiny change can make a big adventure. <strong>Try it, then play it.</strong></div>`,i.kind==="image"&&(k("#edit-sprite").onclick=()=>lh(Q.assets.find(s=>s.id===i.assetId)),k("#sprite-facing").onchange=s=>{ct(()=>i.billboard=s.target.value)}),k("#object-name").onchange=s=>{ct(()=>i.name=s.target.value.trim()||"Little object",!1),$t(),ri==="scene"&&Hn()};for(let s of["x","z"])k("#object-"+s).onchange=r=>{let a=Number(r.target.value);Number.isFinite(a)&&(ct(()=>{let o=s==="z"&&t?"y":s;i[o]=ot(a,s==="x"?e.minX:t?0:e.minZ,s==="x"?e.maxX:t?20:e.maxZ)},!1),$t())};Bn("object-size",s=>i.scale=s,"\xD7"),Bn("object-rotation",s=>i.rotation=s*Math.PI/180,"\xB0"),Bn("object-lift",s=>i.y=s),mt("[data-color]").forEach(s=>s.onclick=()=>{ct(()=>i.color=s.dataset.color),$t()}),k("#custom-color").onchange=s=>{ct(()=>i.color=s.target.value),$t()},k("#object-visible").onclick=()=>{ct(()=>i.visible=!i.visible,!1),$t()},k("#object-sound").onchange=s=>ct(()=>i.soundId=s.target.value,!1),i.behaviors.forEach((s,r)=>{s.speed!==void 0?Bn("behavior-"+r,a=>s.speed=a):s.power!==void 0&&Bn("behavior-"+r,a=>s.power=a)}),mt("[data-toggle-behavior]").forEach(s=>s.onclick=()=>{ct(()=>{let r=i.behaviors[Number(s.dataset.toggleBehavior)];r.enabled=r.enabled===!1},!1),$t()}),mt("[data-remove-behavior]").forEach(s=>s.onclick=()=>{ct(()=>i.behaviors.splice(Number(s.dataset.removeBehavior),1),!1),$t()}),k("#add-behavior").onclick=Dv,k("#duplicate-object").onclick=Fd,k("#delete-object").onclick=Od,k("#close-inspector").onclick=()=>{matchMedia("(max-width:800px)").matches?n.classList.remove("mobile-open"):Hr(null)},k("#draw-path")&&(k("#draw-path").onclick=()=>Uv()),k("#clear-path")&&(k("#clear-path").onclick=()=>{ct(()=>i.path=[],!1),$t()}),n.ondragover=s=>{s.dataTransfer.types.includes("application/soulcode")&&(s.preventDefault(),n.classList.add("drop-highlight"))},n.ondragleave=()=>n.classList.remove("drop-highlight"),n.ondrop=s=>{s.preventDefault(),n.classList.remove("drop-highlight");try{let r=JSON.parse(s.dataTransfer.getData("application/soulcode"));r.type==="behavior"&&sh(r.id)}catch{}}}function Fd(){let i=Et();!i||Ye().objects.length>=200||(ct(()=>{let e=_n(i);e.id=Qt(),e.name=i.name+" copy",e.x=ot(i.x+1,rn(Ye()).minX,rn(Ye()).maxX),e.z=ot(i.z+.5,rn(Ye()).minZ,rn(Ye()).maxZ),Ye().objects.push(e),Mt=e.id}),$t(),Hn(),Be("A little more of a good thing."))}function Od(){let i=Et();i&&(ct(()=>{Ye().objects=Ye().objects.filter(e=>e.id!==i.id),Mt=null}),$t(),Hn(),Be("Object removed. Undo brings it back."))}function Dv(){if(!Et()){Be("Choose an object first.");return}Ri("A little bit of magic",`<h2>What should ${Ge(Et().name)} do?</h2><p class="subtitle">Pick a behavior. Make it your own with the sliders.</p><div class="template-grid behavior-palette">${Object.entries(ci).filter(([i])=>!Et().behaviors.some(e=>e.type===i)).map(([i,e])=>`<button class="palette-item" data-add-behavior="${i}">${oe(e.icon)}<span><strong>${e.name}</strong><small>${e.hint}</small></span></button>`).join("")}</div>`),Ud(k("#modal-content"))}function Uv(){Et()&&(ai(!1),Br=!0,zn="select",k("#path-done").hidden=!1,k("#canvas-hint").textContent="Click the ground to add path points",k("#inspector").classList.remove("mobile-open"),Be("Click places in your world, then press Done."))}function es(){Br=!1,k("#path-done").hidden=!0,k("#canvas-hint").innerHTML=oe("mouse")+"Two fingers to pan <b>\xB7</b> Right-drag to orbit",$t()}function kd(){k("#scene-count").textContent=Q.scenes.length,k("#scene-strip").innerHTML=Q.scenes.map((i,e)=>`<button class="scene-card ${e===Jt?"active":""}" data-scene="${e}" title="Open ${Ge(i.name)}">${e===Jt?'<span class="scene-active-dot"></span>':""}<div class="scene-thumb ${i.theme}">${i.objects.filter(t=>t.visible).slice(0,3).map(t=>Xn(t.kind,t.color)).join("")}</div><div class="scene-caption"><b>${String(e+1).padStart(2,"0")}</b>${Ge(i.name)}</div></button>`).join("")+`<button id="add-scene" class="new-scene">${oe("plus")}New scene</button>`,mt("[data-scene]").forEach(i=>i.onclick=()=>{pt||(es(),ai(!1),Jt=Number(i.dataset.scene),Mt=Ye().objects[0]?.id||null,_e.configure(Q.camera),_e.setScene(Ye(),Q.assets),_e.selected=Mt,_e.path=Et()?.path||[],An())}),k("#add-scene").onclick=()=>{if(Q.scenes.length>=30){Be("This project has reached 30 scenes.");return}ct(()=>{Q.scenes.push(vn("A new world","forest",[Ve("hero",-3,2)])),Jt=Q.scenes.length-1,Mt=Ye().objects[0].id}),An(),Be("A new chapter begins.")}}function Ri(i,e){k("#modal-eyebrow").textContent=i,k("#modal-content").innerHTML=e,Tt.open||Tt.showModal()}function Bd(){Ri("A SMALL START. A BIG ADVENTURE.",`<h2>What will you make?</h2><p class="subtitle">Start with a tiny game. Change everything. Make it yours.</p><div class="template-grid">${Ys.map(i=>`<button class="template-card" data-template="${i.id}"><div class="template-art" style="--template-color:${i.color}44">${(i.id==="quest"?["tree","hero","crystal"]:i.id==="shooter"?["ship","slime"]:i.id==="racing"?["car","crystal"]:i.id==="story"?["npc","portal"]:i.id==="platformer"?["hero","crystal"]:["sparkles"]).map(e=>Xn(e,Zs.find(t=>t.kind===e)?.color||i.color)).join("")}</div><div class="template-content"><span><strong>${i.name}</strong><small>${i.tag} \xB7 ${i.mode.toUpperCase()}</small></span>${oe("chevron")}</div></button>`).join("")}</div><p class="dialog-note">Your current project stays in My projects.</p>`),mt("[data-template]").forEach(i=>i.onclick=async()=>{if(!th){th=!0,mt("[data-template]").forEach(e=>e.disabled=!0);try{if(!await Fr())return;oh(wo(i.dataset.template)),Tt.close(),Be("Fresh game, fresh rules. Press Play!")}finally{th=!1,mt("[data-template]").forEach(e=>e.disabled=!1)}}})}async function nh(){await Fr();let i=[];try{i=await To()}catch{}Ri("YOUR LITTLE COLLECTION",`<h2>My projects</h2><label class="field-label" for="project-name">This project\u2019s name</label><div class="inline-row"><input id="project-name" class="text-input" value="${Ge(Q.name)}" maxlength="60"><button id="rename-project" class="button">${oe("check")}Save</button></div><div style="margin-top:20px">${i.map(e=>`<button class="project-row" data-open-project="${Ge(e.id)}">${oe(Ys.find(t=>t.id===e.genre)?.icon||"gamepad")}<span><strong>${Ge(e.name)}</strong><small>${e.scenes.length} scene${e.scenes.length===1?"":"s"} \xB7 ${e.mode.toUpperCase()} \xB7 ${new Date(e.updated).toLocaleDateString()}</small></span>${oe("chevron","chev")}</button>`).join("")}</div><div class="modal-actions"><button id="import-project-modal" class="button">${oe("download")}Open project file</button><button id="new-project-modal" class="button primary">${oe("plus")}New game</button></div><p class="dialog-note">Projects are saved in this browser. Export a project file to keep a backup or move it to another device.</p>`),k("#rename-project").onclick=()=>{let e=k("#project-name").value.trim();e&&(ct(()=>Q.name=e,!1),Be("Project renamed"),nh())},mt("[data-open-project]").forEach(e=>e.onclick=()=>{let t=i.find(n=>n.id===e.dataset.openProject);t&&(oh(Wr(t)),Tt.close())}),k("#import-project-modal").onclick=()=>k("#project-input").click(),k("#new-project-modal").onclick=Bd}function zd(){let i=Ye();Ri("EVERY WORLD HAS A STORY",`<h2>Your scene</h2><div class="scene-settings-grid"><div><label class="field-label" for="scene-name">Scene name</label><input id="scene-name" class="text-input" value="${Ge(i.name)}" maxlength="50"></div><div><label class="field-label" for="scene-transition">Enter with</label><select id="scene-transition"><option value="fade" ${i.transition==="fade"?"selected":""}>A gentle fade</option><option value="slide" ${i.transition==="slide"?"selected":""}>A little slide</option><option value="none" ${i.transition==="none"?"selected":""}>Straight in</option></select></div></div><label class="field-label" for="story-title">Story title</label><input id="story-title" class="text-input" value="${Ge(i.story.title)}" maxlength="100"><label class="field-label" for="story-text">What happens here?</label><textarea id="story-text" maxlength="1500">${Ge(i.story.text)}</textarea><label class="field-label">Choices \u2192 where they go</label><div id="story-choices"></div><button id="add-story-choice" class="quiet-button">${oe("plus")}Add a choice</button><p class="dialog-note">Friends and story buttons open this story. In an adventure starter, it opens when the scene begins.</p><div class="modal-actions"><button id="duplicate-scene" class="button">${oe("copy")}Duplicate</button><button id="delete-scene" class="button danger" ${Q.scenes.length<2?"disabled":""}>${oe("trash")}Delete</button><button id="save-scene-settings" class="button primary">${oe("check")}Done</button></div>`);let e=_n(i.story.choices),t=()=>{e=mt("#story-choices .choice-editor").map(s=>({text:s.querySelector("input").value||"Continue",target:s.querySelector("select").value}))};function n(){k("#story-choices").innerHTML=e.map((s,r)=>`<div class="choice-editor"><input class="text-input" aria-label="Choice ${r+1} text" value="${Ge(s.text)}" maxlength="80"><select aria-label="Choice ${r+1} destination">${[{id:"close",name:"Keep exploring"},{id:"next",name:"Next scene"},...Q.scenes].map(a=>`<option value="${Ge(a.id)}" ${s.target===a.id?"selected":""}>${Ge(a.name)}</option>`).join("")}</select><button class="icon-button" data-remove-choice="${r}" aria-label="Remove choice ${r+1}">${oe("close")}</button></div>`).join(""),mt("[data-remove-choice]").forEach(s=>s.onclick=()=>{t(),e.length>1&&e.splice(Number(s.dataset.removeChoice),1),n()}),k("#add-story-choice").disabled=e.length>=4}n(),k("#add-story-choice").onclick=()=>{t(),e.length<4&&e.push({text:"A new possibility",target:"close"}),n()},k("#save-scene-settings").onclick=()=>{t(),ct(()=>{i.name=k("#scene-name").value.trim()||"My world",i.transition=k("#scene-transition").value,i.story={title:k("#story-title").value||"My story",text:k("#story-text").value,choices:e}},!1),Tt.close(),Be("Your story is ready to play.")},k("#duplicate-scene").onclick=()=>{Q.scenes.length>=30||(ct(()=>{let s=_n(i);s.id=Qt(),s.name=i.name+" copy",s.objects.forEach(r=>r.id=Qt()),Q.scenes.push(s),Jt=Q.scenes.length-1,Mt=s.objects[0]?.id||null}),An(),Tt.close())},k("#delete-scene").onclick=()=>{Q.scenes.length<2||(ct(()=>{let s=i.id;Q.scenes.splice(Jt,1),Q.scenes.forEach(r=>r.story.choices.forEach(a=>{a.target===s&&(a.target="next")})),Jt=ot(Jt,0,Q.scenes.length-1),Mt=Ye().objects[0]?.id||null}),An(),Tt.close(),Be("Scene removed. Undo brings it back."))}}function Nv(){Ri("BIG IDEAS START WITH A LITTLE PLAY",`<h2>Your first game, in three little steps.</h2><div class="help-steps"><div class="help-step">${oe("box")}<div><strong>1. Drop something in.</strong><p>Drag an asset into your world. Or click one to add it. Your own images work too.</p></div></div><div class="help-step">${oe("bolt")}<div><strong>2. Give it a little magic.</strong><p>Pick an object, then add a behavior. Make it follow, wander, sparkle, or do what you say.</p></div></div><div class="help-step">${oe("play")}<div><strong>3. Play your idea.</strong><p>Press Play. Move with arrows or WASD. Space jumps or shoots. E talks to a friend.</p></div></div></div><div class="pill-note">${oe("heart")}Every idea is worth trying. Undo is always here for you.</div><p class="dialog-note">Drag objects to move them. Two fingers or H to pan. Pinch to zoom. Right-drag to orbit in 3D.<br>Ctrl/\u2318 Z: undo \xB7 Ctrl/\u2318 D: duplicate \xB7 Delete: remove \xB7 Enter: play \xB7 Esc: stop.<br>On a small screen, tap an object again to open its settings.</p><button id="help-start" class="button primary wide-button">Let\u2019s make something ${oe("sparkles")}</button>`),k("#help-start").onclick=()=>Tt.close()}function Fv(){Ri("MADE BY YOU. READY TO PLAY.",`<h2>Let your game out into the world.</h2><p class="subtitle">A little file. Your whole imagination inside.</p><button class="export-card" id="export-html">${oe("gamepad")}<span><strong>Playable game</strong><small>One HTML file. Open it in a browser.<br>Includes every scene, image, sound, and behavior.</small></span>${oe("chevron","chev")}</button><button class="export-card" id="export-project">${oe("folder")}<span><strong>Editable project</strong><small>Keep a backup, move devices, or keep creating later.</small></span>${oe("chevron","chev")}</button>${Et()?`<button class="export-card" id="export-asset">${oe("image")}<span><strong>Save ${Ge(Et().name)} as an image</strong><small>A PNG for your next idea.</small></span>${oe("chevron","chev")}</button>`:""}<p class="dialog-note">Games run in a browser, including offline. This exports a browser game, not a phone app or console game.</p>`),k("#export-project").onclick=()=>{Di(new Blob([JSON.stringify(Q,null,2)],{type:"application/json"}),rh(Q.name)+".soulcode"),Be("Project backup downloaded.")},k("#export-html").onclick=Ov,k("#export-asset")&&(k("#export-asset").onclick=kv)}var rh=i=>i.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"my-game";async function Ov(){let i=k("#export-html");i.disabled=!0;try{let e=await fetch("./player.js");if(!e.ok)throw Error("Player file is missing");let t=(await e.text()).replace(/<\/script/gi,"<\\/script"),n=JSON.stringify(Q).replace(/</g,"\\u003c"),s=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${Ge(Q.name)} \xB7 Soulcode</title><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;font-family:system-ui;color:#e5f7ff;background:#101e28}#game{position:absolute;inset:0;background:radial-gradient(ellipse,#27444d,#101b26);touch-action:none}canvas{display:block;width:100%;height:100%}#start-screen{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 40%,#234557,#0f1b28)}#start-screen[hidden]{display:none}.welcome{max-width:480px;text-align:center;padding:32px}.welcome .spark{font-size:64px;color:#74e4ff}.welcome h1{font-size:44px;letter-spacing:-2px;margin:20px 0}.welcome p{color:#a0bdcc;font-size:14px;line-height:1.7}button{cursor:pointer;background:#64dff4;border:0;border-radius:12px;color:#153c4b;font:700 16px system-ui;padding:14px 35px}#mute-game{position:fixed;right:20px;bottom:14px;padding:7px 10px;background:#193744c9;color:#abd9e8;font-size:10px;z-index:30}.credit{position:absolute;left:20px;bottom:18px;color:#7092a8;font-size:10px;z-index:20}.scene-fade canvas{animation:fade .7s}.scene-slide canvas{animation:slide .7s}@keyframes fade{from{opacity:0}to{opacity:1}}@keyframes slide{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:none}}</style></head><body><main id="game"></main><div id="start-screen"><div class="welcome"><span class="spark">\u2726</span><h1 id="game-name">${Ge(Q.name)}</h1><p>A little world, made with Soulcode.</p><button id="start-play">Let\u2019s play \u2192</button><p>Arrow keys / WASD \xB7 Space \xB7 E<br>Touch controls on phones and tablets</p></div></div><span class="credit">made with soulcode.</span><button id="mute-game">Sound ${Q.sound?"on":"off"}</button><script type="application/json" id="soulcode-project">${n}<\/script><script>${t}<\/script></body></html>`;Di(new Blob([s],{type:"text/html"}),rh(Q.name)+".html"),Be("Your game is ready. Open the downloaded HTML file to play.")}catch(e){Be("Could not export the game. "+e.message)}finally{i.disabled=!1}}async function kv(){let i=Et();if(!i)return;let e=new Image;e.src=i.kind==="image"?Q.assets.find(t=>t.id===i.assetId)?.src||"":"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(Xn(i.kind,i.color));try{await e.decode();let t=document.createElement("canvas");t.width=i.kind==="image"?e.naturalWidth:512,t.height=i.kind==="image"?e.naturalHeight:512,t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toBlob(n=>{n&&(Di(n,rh(i.name)+".png"),Be("Your asset is ready."))},"image/png")}catch{Be("This image could not be exported.")}}async function Ad(i){return new Promise((e,t)=>{let n=new FileReader;n.onload=()=>e(n.result),n.onerror=()=>t(n.error),n.readAsDataURL(i)})}async function ah(i,e){if(pt){Be("Stop playing to add assets.");return}let t=[...i];if(t.length===1&&/\.(soulcode|json)$/i.test(t[0].name)){await Hd(t[0]);return}let n=[];for(let s of t){if(Q.assets.length+n.length>=60){Be("You can keep up to 60 uploaded assets in a project.");break}if(s.size>8*1024*1024){Be(`${s.name} is too large. Try a file smaller than 8 MB.`);continue}let r,a,o=1,l=1;try{if(/^image\/(png|jpeg|webp|gif)$/.test(s.type)){r="image";let h=await Ad(s),u=new Image;u.src=h,await u.decode();let d=document.createElement("canvas"),f=Math.min(1,1024/Math.max(u.width,u.height));d.width=Math.max(1,Math.round(u.width*f)),d.height=Math.max(1,Math.round(u.height*f)),d.getContext("2d").drawImage(u,0,0,d.width,d.height),a=d.toDataURL("image/png"),o=d.width,l=d.height}else if(/^audio\//.test(s.type)||/\.(mp3|wav|ogg|m4a)$/i.test(s.name)){if(r="audio",a=await Ad(s),!a.startsWith("data:audio/")){let u=s.name.split(".").pop().toLowerCase();a=a.replace(/^data:[^;,]*;/,`data:audio/${{mp3:"mpeg",wav:"wav",ogg:"ogg",m4a:"mp4"}[u]||"mpeg"};`)}let h=new Audio;s.type&&!h.canPlayType(s.type)&&Be(`${s.name}: this browser may not play that audio format.`)}else{Be("Try a PNG, JPG, WebP, GIF, MP3, WAV, OGG, or M4A file.");continue}if([...Q.assets,...n].reduce((h,u)=>h+u.src.length,0)+a.length>28*1024*1024){Be("This project\u2019s assets are full. Try smaller image or sound files.");continue}n.push({id:Qt(),kind:r,name:s.name.slice(0,60),src:a,width:o,height:l})}catch{Be(`Could not open ${s.name}. Try another file.`)}}n.length&&(ai(!1),es(),ct(()=>{if(Q.assets.push(...n),e){let s=n.find(r=>r.kind==="image");if(s&&Ye().objects.length<200){let r=Ve("image",e.x,Q.camera.preset==="side"?.5:e.z,{y:e.y||0,assetId:s.id,name:s.name});Ye().objects.push(r),Mt=r.id}}}),n.some(s=>s.kind==="image")?(ji="Yours",At="assets",ri="library"):At="sounds",An(),Be(`${n.length} ${n.length===1?"asset":"assets"} added. Yours to play with.`))}async function Hd(i){if(i.size>64*1024*1024){Be("Choose a project file smaller than 64 MB.");return}try{let e=Wr(JSON.parse(await i.text()));if(!await Fr())return;e.id=Qt(),e.updated=Date.now(),oh(e),Tt.close(),Be("Welcome back to your world.")}catch(e){Be(e.message||"This project could not be opened.")}}function Cd(){if(pt){Or();return}if(!Ye().objects.some(i=>i.visible&&(ht(i,"control")||ht(i,"drive")))){Be("Add a character with \u201CYou control it\u201D or \u201CDrive\u201D to play.");return}es(),ai(!1),Ji?.pause(),Tt.close(),document.body.classList.add("playing"),k("#library").inert=!0,k("#inspector").inert=!0,k(".tool-rail").inert=!0,k(".scenes-panel").inert=!0,k("#play-button").innerHTML=oe("stop")+"<span>Stop</span>",k("#pause-button").hidden=!1,k("#stop-button").hidden=!1,k("#status-text").textContent="Your world is alive. Go explore.",pt=new yo({host:Ct,project:_n(Q),sceneIndex:Jt,renderer:_e,onStop:Or}),k("#viewport").focus()}function Or(){pt&&(pt.destroy(),pt=null,document.body.classList.remove("playing"),k("#library").inert=!1,k("#inspector").inert=!1,k(".tool-rail").inert=!1,k(".scenes-panel").inert=!1,k("#play-button").innerHTML=oe("play")+"<span>Play</span><kbd>\u21B5</kbd>",k("#pause-button").hidden=!0,k("#stop-button").hidden=!0,k("#pause-button").innerHTML=oe("pause"),k("#status-text").textContent="A little studio for big imaginations",_e.setScene(Ye(),Q.assets),_e.selected=Mt,_e.path=Et()?.path||[])}function oh(i){Or(),Ji?.pause(),clearTimeout(bo),Mo++,Q=i,Jt=0,Mt=Ye().objects[0]?.id||null,Ai=[],Ur=[],mt("[data-tool]").forEach(e=>e.classList.toggle("active",e.dataset.tool==="select")),Ct.style.cursor="default",At="assets",ri="library",ji="All",Ki="",Br=!1,Xs=!1,zn="select",kr=!1,Ue=null,ts.clear(),On=null,Object.assign(nn,{tool:"floor",shape:"cube",tile:Ye().map.tileset,layer:0,erase:!1}),k("#path-done").hidden=!0,document.body.classList.remove("focus","shelf-hidden"),k("#library").style.display="",k("#library").classList.remove("mobile-open"),k("#inspector").classList.remove("mobile-open"),_e?.destroy(),_e=null,Gs(),An(),Qi(),zr()}function ai(i=!0){Xs=!1,_e&&(_e.brushCell=null),k("#canvas-hint").innerHTML=oe("hand")+"Two fingers to pan <b>\xB7</b> Right-drag to orbit",i&&(Dd("assets"),Be("Back to your characters."))}function lh(i=null){pt||Th({showModal:Ri,asset:i,onSave:e=>{if(!e.id&&Q.assets.length>=60){Be("Your asset shelf is full.");return}if(Q.assets.filter(n=>n.id!==e.id).reduce((n,s)=>n+s.src.length,0)+e.src.length>28*1024*1024){Be("Your asset shelf is full. Export a backup and use smaller files.");return}ct(()=>{if(e.id){let n=Q.assets.findIndex(s=>s.id===e.id);Q.assets[n]=e}else e.id=Qt(),Q.assets.push(e)}),ai(!1),es(),At="assets",ri="library",ji="Yours",Ki="",An(),Tt.close(),Be("Your sprite is ready. Drop it into your world.")}})}var Ue=null,On=null,kr=!1,ts=new Map;function Vd(){return[...ts.values()].filter(i=>i.type==="touch").slice(0,2)}function Gd(){let i=Vd();return i.length<2?null:{x:(i[0].x+i[1].x)/2,y:(i[0].y+i[1].y)/2,d:Math.max(5,Math.hypot(i[0].x-i[1].x,i[0].y-i[1].y))}}function ch(i){let e=_e.terrainCell(i.clientX,i.clientY,nn);if(_e.brushCell=e,_e.brushHeight=nn.tool==="wall"?3:nn.tool==="floor"?.05:xn[nn.shape].height,!Ue)return;let t=`${e.x},${e.y},${e.z}`;if(Ue.cell===t)return;let n=_e.mode==="3d"&&nn.layer===0&&nn.tool!=="floor"?`${e.x},${e.z}`:t;if(Ue.visited??=new Set,Ue.visited.has(n))return;Ue.visited.add(n),Ue.mutated||(Nr(),Ue.mutated=!0);let s=Ue.lastCell||e,r=Math.min(80,Math.max(Math.abs(e.x-s.x),Math.abs(e.z-s.z),Math.abs(e.y-s.y))),a=!1;for(let o=0;o<=r;o++){let l=r?o/r:1;a=yh(Ye().map,{x:Math.round(s.x+(e.x-s.x)*l),z:Math.round(s.z+(e.z-s.z)*l),y:Math.round(s.y+(e.y-s.y)*l)},nn)||a}a?kr=!0:Ye().map.blocks.length>=ss&&!nn.erase&&Be("4,096 blocks in this scene. A new scene gives you more room."),Ue.cell=t,Ue.lastCell=e}Ct.addEventListener("contextmenu",i=>{vd()||i.preventDefault()});Ct.addEventListener("pointerdown",i=>{if(pt||i.target.closest("button"))return;if(i.preventDefault(),Ct.focus(),ts.set(i.pointerId,{x:i.clientX,y:i.clientY,type:i.pointerType}),Ct.setPointerCapture(i.pointerId),Vd().length===2){if(Ue?.mutated){let n=Ai.pop();n&&(Q=n.project,Jt=n.sceneIndex,Mt=n.selectedId,Gs(),An())}Ue=null,kr=!1,On=Gd(),_e.brushCell=null;return}let e=_e.hit(i.clientX,i.clientY,Ye().objects),t=i.button===1||zn==="pan"||i.shiftKey?"pan":i.button===2||zn==="orbit"||i.altKey?"orbit":Xs?"build":Br?"path":"select";if(Ue={id:t==="select"?e:null,action:t,startX:i.clientX,startY:i.clientY,lastX:i.clientX,lastY:i.clientY,moved:!1,mutated:!1,oldSelected:Mt,time:performance.now(),touch:i.pointerType==="touch"},e&&t==="select"){Hr(e);let n=Et(),s=_e.screenToWorld(i.clientX,i.clientY,n.y);Ue.offset={x:n.x-s.x,y:n.y-s.y,z:n.z-s.z}}t==="build"&&!Ue.touch&&ch(i)});Ct.addEventListener("pointermove",i=>{if(pt)return;ts.has(i.pointerId)&&ts.set(i.pointerId,{x:i.clientX,y:i.clientY,type:i.pointerType});let e=Gd();if(e){On&&(_e.panPixels(e.x-On.x,e.y-On.y),_e.setZoom(_e.zoom*e.d/On.d),Qi()),On=e;return}if(Xs&&!Ue&&(_e.brushCell=_e.terrainCell(i.clientX,i.clientY,nn),_e.brushHeight=nn.tool==="wall"?3:nn.tool==="floor"?.05:xn[nn.shape].height),!Ue||On)return;let t=i.clientX-Ue.lastX,n=i.clientY-Ue.lastY;if(!(Ue.touch&&performance.now()-Ue.time<100)){if(!Ue.moved&&Math.hypot(i.clientX-Ue.startX,i.clientY-Ue.startY)>4&&(Ue.moved=!0,Ue.id&&!Ue.mutated&&(Nr(),Ue.mutated=!0)),Ue.moved){if(Ue.action==="orbit")_e.orbit(t,n);else if(Ue.action==="pan")_e.panPixels(t,n);else if(Ue.action==="build")ch(i);else if(Ue.id){let s=Et(),r=_e.screenToWorld(i.clientX,i.clientY,s.y),a=rn(Ye(),.1);s.x=ot(r.x+Ue.offset.x,a.minX,a.maxX),Q.camera.preset==="side"?s.y=ot(r.y+Ue.offset.y,0,20):s.z=ot(r.z+Ue.offset.z,a.minZ,a.maxZ),Ws()}}Ue.lastX=i.clientX,Ue.lastY=i.clientY}});function Wd(i,e=!1){if(ts.delete(i.pointerId),On){ts.size||(On=null),Ue=null;return}if(Ue){if(!e&&!Ue.moved)if(Ue.action==="build")ch(i);else if(Ue.action==="path"){let t=_e.screenToWorld(i.clientX,i.clientY);ct(()=>{let n=Et();n&&(n.path??=[],n.path.length<40&&n.path.push(t))},!1)}else Ue.action==="select"&&(Ue.id&&Ue.oldSelected===Ue.id?k("#inspector").classList.add("mobile-open"):Ue.id||Hr(null));Ue.mutated&&(ih(!1),$t(),At==="build"&&Ci()),Ue=null}}Ct.addEventListener("pointerup",i=>Wd(i));Ct.addEventListener("pointercancel",i=>Wd(i,!0));Ct.addEventListener("pointerleave",()=>{Ue||(_e.brushCell=null)});Ct.addEventListener("wheel",i=>{pt||(i.preventDefault(),i.ctrlKey||i.metaKey?(_e.setZoom(_e.zoom*Math.exp(-i.deltaY*.007)),Qi()):i.shiftKey||Math.abs(i.deltaX)>1||i.deltaMode===0&&Math.abs(i.deltaY)<50?_e.panPixels(-i.deltaX,-i.deltaY):(_e.setZoom(_e.zoom*(i.deltaY>0?.94:1.06)),Qi()))},{passive:!1});Ct.addEventListener("dragover",i=>{pt||(i.preventDefault(),Ct.classList.add("drop-highlight"),i.dataTransfer.dropEffect="copy")});Ct.addEventListener("dragleave",()=>Ct.classList.remove("drop-highlight"));Ct.addEventListener("drop",i=>{if(i.preventDefault(),Ct.classList.remove("drop-highlight"),pt)return;let e=_e.placementPoint(i.clientX,i.clientY);if(i.dataTransfer.files.length){ah(i.dataTransfer.files,e);return}try{let t=JSON.parse(i.dataTransfer.getData("application/soulcode"));if(t.type==="asset")ai(!1),Nd(t.id,e);else if(t.type==="behavior"){let n=_e.hit(i.clientX,i.clientY,Ye().objects);n&&Hr(n),sh(t.id)}}catch{}});function Qi(){k("#zoom-reset").innerHTML=Math.round(_e.zoom*100)+"<span>%</span>"}function Bv(){Id(),mt("[data-panel]").forEach(i=>i.onclick=()=>{pt||(k("#library").style.display="",Dd(i.dataset.panel))}),k("#modal-close").onclick=()=>Tt.close(),Tt.addEventListener("click",i=>{if(i.target===Tt){let e=Tt.getBoundingClientRect();(i.clientX<e.left||i.clientX>e.right||i.clientY<e.top||i.clientY>e.bottom)&&Tt.close()}}),k("#templates-button").onclick=Bd,k("#sprite-button").onclick=()=>lh(),k("#camera-button").onclick=()=>{pt||wh({project:Q,showModal:Ri,change:ct,slider:kn,bindSlider:Bn,refresh:()=>{Gs(),An()}})},k("#project-menu").onclick=nh,k("#projects-button").onclick=nh,k("#export-button").onclick=()=>{Or(),Fv()},k("#help-button").onclick=Nv,k("#play-button").onclick=Cd,k("#stop-button").onclick=Or,k("#pause-button").onclick=()=>{if(pt){let i=pt.togglePause();k("#pause-button").innerHTML=oe(i?"play":"pause"),k("#pause-button").setAttribute("aria-label",i?"Resume preview":"Pause preview")}},k("#scene-settings").onclick=zd,k("#path-done").onclick=es,k("#undo-button").onclick=()=>_o("undo"),k("#redo-button").onclick=()=>_o("redo"),mt("[data-mode]").forEach(i=>i.onclick=()=>{pt||Q.mode===i.dataset.mode||(ct(()=>{Q.mode=i.dataset.mode,Q.camera=yn(Q.mode==="2d"?"flat":"iso")},!1),Gs(),Ws(),Be(`${Q.mode.toUpperCase()} \u2014 same world, a new perspective.`))}),mt("[data-tool]").forEach(i=>i.onclick=()=>{ai(!1),zn=i.dataset.tool,mt("[data-tool]").forEach(e=>e.classList.toggle("active",e===i)),Ct.style.cursor=zn==="orbit"||zn==="pan"?"grab":"default"}),k("#grid-button").onclick=()=>{_e.showGrid=!_e.showGrid,k("#grid-button").classList.toggle("active",_e.showGrid),k("#grid-button").setAttribute("aria-pressed",_e.showGrid)},k("#focus-button").onclick=()=>{document.body.classList.toggle("focus"),k("#focus-button").setAttribute("aria-pressed",document.body.classList.contains("focus"))},k("#zoom-in").onclick=()=>{_e.setZoom(_e.zoom+.1),Qi()},k("#zoom-out").onclick=()=>{_e.setZoom(_e.zoom-.1),Qi()},k("#zoom-reset").onclick=()=>{_e.reset(),Qi()},k("#sound-toggle").onclick=()=>{Q.sound=!Q.sound,pt?.setMuted(!Q.sound),Ws(),zr()},k("#asset-input").onchange=i=>{ah(i.target.files),i.target.value=""},k("#project-input").onchange=i=>{i.target.files[0]&&Hd(i.target.files[0]),i.target.value=""},window.addEventListener("keydown",i=>{if(pt||Tt.open||i.target.matches("input,textarea,select"))return;let e=i.ctrlKey||i.metaKey;e&&i.key.toLowerCase()==="z"?(i.preventDefault(),_o(i.shiftKey?"redo":"undo")):e&&i.key.toLowerCase()==="y"?(i.preventDefault(),_o("redo")):e&&i.key.toLowerCase()==="d"?(i.preventDefault(),Fd()):e&&i.key.toLowerCase()==="s"?(i.preventDefault(),Fr().then(t=>t&&Be("Saved on this device."))):i.key==="Delete"||i.key==="Backspace"?(i.preventDefault(),Od()):i.key==="Enter"?(i.preventDefault(),Cd()):i.key==="Escape"?(es(),k("#inspector").classList.remove("mobile-open"),k("#library").classList.remove("mobile-open")):i.key.toLowerCase()==="h"?k('[data-tool="pan"]').click():i.key.toLowerCase()==="v"&&k('[data-tool="select"]').click()}),window.addEventListener("dragover",i=>{i.dataTransfer.types.includes("Files")&&i.preventDefault()}),window.addEventListener("drop",i=>{i.dataTransfer.files.length&&i.preventDefault()}),document.addEventListener("visibilitychange",()=>{document.hidden&&(Fr(),Ji?.pause())})}async function zv(){try{let e=await To(),t;try{t=localStorage.getItem("soulcode-last")}catch{}let n=e.find(s=>s.id===t);n&&(Q=Wr(n),Mt=Q.scenes[0].objects[0]?.id||null)}catch{}Gs(),Bv(),An(),zr();function i(e){kr&&(kr=!1,_e.setTerrain(Ye())),pt||_e.draw(Ye().objects,e/1e3),requestAnimationFrame(i)}requestAnimationFrame(i)}Ei()&&(yd({card:!1}),Hv(),window.addEventListener("keydown",i=>{i.key!=="Escape"||!(pt||Tt.open||Br)||(i.preventDefault(),Tt.open&&!pt&&Tt.close())},!0));function Hv(){try{if(localStorage.getItem("soulcode-console-note"))return}catch{}let i=document.createElement("div");i.className="console-note",i.setAttribute("role","note");let e=document.createElement("span");e.textContent="Soulcode works here, but it is at its best on a computer with a mouse and keyboard.";let t=document.createElement("button");t.type="button",t.textContent="Got it",t.onclick=()=>{i.remove();try{localStorage.setItem("soulcode-console-note","1")}catch{}},i.append(e,t),document.body.append(i)}zv().catch(i=>{console.error(i),Be("The studio could not start. Reload to try again.")});
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
