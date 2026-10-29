var Ii={grass:{name:"Meadow",color:"#378e68",light:"#67b87d",dark:"#267655"},brick:{name:"Brick",color:"#b26d59",light:"#de9e7e",dark:"#704b4b"},stone:{name:"Stone",color:"#718997",light:"#a0b4bf",dark:"#536875"},sand:{name:"Sand",color:"#c5a475",light:"#e3c795",dark:"#ac8c5f"},wood:{name:"Wood",color:"#98724f",light:"#c49c6a",dark:"#6b4c36"},ice:{name:"Ice",color:"#79b7cc",light:"#c3edf3",dark:"#4f8fae"},metal:{name:"Neon",color:"#263e50",light:"#61dff3",dark:"#1a2d3e"}},ni={cube:{name:"Block",height:1},slab:{name:"Platform",height:.3},pillar:{name:"Pillar",height:1}},Xn=4096,zd=(r,e,t)=>Math.max(e,Math.min(t,r)),_n=(r,e,t,i)=>Number.isFinite(Number(r))?zd(Number(r),t,i):e,fi=r=>({width:18,depth:12,base:!0,tileset:r==="sand"?"sand":r==="space"||r==="race"?"metal":r==="night"?"stone":"grass",tiles:[],blocks:[],decorated:!0});function Gc(r,e="forest"){let t={...fi(e),...r||{}};t.width=Math.round(_n(t.width,18,8,64)/2)*2,t.depth=Math.round(_n(t.depth,12,4,64)/2)*2,t.base=t.base!==!1,t.decorated=t.decorated!==!1,t.tileset=Ii[t.tileset]?t.tileset:"grass";let i=new Map,n=new Map;for(let s of(Array.isArray(t.tiles)?t.tiles:[]).slice(0,4096)){if(!s)continue;let a=Math.floor(_n(s.x,0,-t.width/2,t.width/2-1)),o=Math.floor(_n(s.z,0,-t.depth/2,t.depth/2-1));(Ii[s.tile]||s.tile==="void")&&i.set(`${a},${o}`,{x:a,z:o,tile:s.tile})}for(let s of(Array.isArray(t.blocks)?t.blocks:[]).slice(0,Xn)){if(!s)continue;let a=Math.floor(_n(s.x,0,-t.width/2,t.width/2-1)),o=Math.floor(_n(s.z,0,-t.depth/2,t.depth/2-1)),l=Math.floor(_n(s.y,0,0,15));n.set(`${a},${l},${o}`,{x:a,y:l,z:o,shape:ni[s.shape]?s.shape:"cube",tile:Ii[s.tile]?s.tile:t.tileset})}return{width:t.width,depth:t.depth,base:t.base,tileset:t.tileset,decorated:t.decorated,tiles:[...i.values()],blocks:[...n.values()]}}function Vt(r,e=.35){let t=r.map||fi(r.theme);return{minX:-t.width/2+e,maxX:t.width/2-e,minZ:-t.depth/2+e,maxZ:t.depth/2-e}}function Vc(r,e,t){let i=Math.floor(e.x),n=Math.floor(e.z),s=Math.max(0,Math.min(15,Math.floor(e.y||0)));if(i<-r.width/2||i>=r.width/2||n<-r.depth/2||n>=r.depth/2)return!1;if(t.tool==="floor"){let o=r.tiles.find(c=>c.x===i&&c.z===n),l=t.erase?"void":t.tile;return o?.tile===l?!1:(r.tiles=r.tiles.filter(c=>c.x!==i||c.z!==n),r.tiles.push({x:i,z:n,tile:l}),r.decorated=!1,!0)}if(t.erase){let o=r.blocks.length;return r.blocks=r.blocks.filter(l=>l.x!==i||l.z!==n||l.y!==s),o!==r.blocks.length}let a=!1;for(let o=0;o<(t.tool==="wall"?3:1);o++){let l=s+o;if(l>15)break;let c=r.blocks.find(d=>d.x===i&&d.z===n&&d.y===l),h=t.tool==="wall"?"cube":t.shape||"cube";if(!(c&&c.tile===t.tile&&c.shape===h)){if(!c&&r.blocks.length>=Xn)break;r.blocks=r.blocks.filter(d=>d!==c),r.blocks.push({x:i,y:l,z:n,shape:h,tile:t.tile}),a=!0}}return r.decorated=!1,a}function Wc(r,e,t){let i=r.map,n=[...i.blocks,...i.tiles,...r.objects.map(o=>({x:o.x,z:o.z}))],s=Math.max(8,...n.map(o=>2*Math.ceil(Math.abs(o.x+.5)+.5))),a=Math.max(4,...n.map(o=>2*Math.ceil(Math.abs(o.z+.5)+.5)));return i.width=Math.max(Math.min(64,e),Math.min(64,s)),i.depth=Math.max(Math.min(64,t),Math.min(64,a)),{width:i.width,depth:i.depth}}var jn=class{constructor(e){this.map=e.map||fi(e.theme),this.columns=new Map,this.tiles=new Map(this.map.tiles.map(t=>[`${t.x},${t.z}`,t.tile]));for(let t of this.map.blocks){let i=`${t.x},${t.z}`;this.columns.has(i)||this.columns.set(i,[]),this.columns.get(i).push(t)}this.lastChecks=0}nearby(e,t,i=.32){this.lastChecks=0;let n=[];for(let s=Math.floor(e-i);s<=Math.floor(e+i);s++)for(let a=Math.floor(t-i);a<=Math.floor(t+i);a++){this.lastChecks++;for(let o of this.columns.get(`${s},${a}`)||[])n.push(o)}return n}baseAt(e,t){let i=this.tiles.get(`${Math.floor(e)},${Math.floor(t)}`);return i==="void"?!1:!!(this.map.base||i)}floor(e,t,i=0,n=.28){let s=this.baseAt(e,t)?0:-1/0;for(let a of this.nearby(e,t,n)){let o=a.y+ni[a.shape].height;o<=i+.12&&o>s&&(s=o)}return s}blocked(e,t,i,n=1.1,s=.28){return this.nearby(e,t,s).some(a=>e+s>a.x&&e-s<a.x+1&&t+s>a.z&&t-s<a.z+1&&i<a.y+ni[a.shape].height-.03&&i+n>a.y+.04)}ceiling(e,t,i,n,s=.28){let a=1/0;for(let o of this.nearby(e,t,s))o.y>=i-.001&&o.y<=n&&(a=Math.min(a,o.y));return a}};function jc(r){let e=Ii[r]||Ii.grass,t=document.createElement("canvas");t.width=t.height=32;let i=t.getContext("2d");if(i.fillStyle=e.color,i.fillRect(0,0,32,32),i.strokeStyle=e.dark,i.lineWidth=1,r==="brick"||r==="stone")for(let n=0;n<32;n+=8){i.beginPath(),i.moveTo(0,n),i.lineTo(32,n),i.stroke();for(let s=n%16?0:8;s<32;s+=16)i.beginPath(),i.moveTo(s,n),i.lineTo(s,n+8),i.stroke()}else if(r==="wood")for(let n=0;n<32;n+=8)i.fillStyle=e.dark,i.fillRect(0,n,32,1),i.fillStyle=e.light,i.fillRect(n*7%25,n+3,10,1);else if(r==="metal")i.strokeStyle=e.light,i.globalAlpha=.35,i.strokeRect(.5,.5,31,31),i.fillStyle=e.light,i.fillRect(3,3,2,2),i.fillRect(27,27,2,2),i.globalAlpha=1;else{for(let n=0;n<24;n++)i.fillStyle=n%3===0?e.dark:e.light,i.globalAlpha=.4,i.fillRect(n*13%32,n*23%32,1+n%3,1);i.globalAlpha=1,r==="ice"&&(i.strokeStyle=e.light,i.beginPath(),i.moveTo(2,25),i.lineTo(25,2),i.stroke())}return t}var ai=r=>JSON.parse(JSON.stringify(r)),zt=()=>Math.random().toString(36).slice(2,10),We=(r,e,t)=>Math.min(t,Math.max(e,r)),Fd=["hero","tree","crystal","rock","slime","portal","crate","car","ship","npc","flower","sparkles","button","image"],Yi={control:{name:"You control it",icon:"gamepad",hint:"Arrow keys or WASD",speed:4.2},jump:{name:"Jump",icon:"jump",hint:"Press Space",power:6},collect:{name:"Collect me",icon:"diamond",hint:"Touch to earn a point"},follow:{name:"Follow",icon:"follow",hint:"Follow the player",speed:1.6},patrol:{name:"Follow a path",icon:"route",hint:"Visit each path point",speed:2},wander:{name:"Wander",icon:"shuffle",hint:"Explore on your own",speed:1.2},spin:{name:"Spin",icon:"rotate",hint:"Round and round",speed:1.5},bounce:{name:"Float",icon:"waves",hint:"A little up and down",speed:2},solid:{name:"Solid",icon:"box",hint:"Players cannot walk through"},hazard:{name:"Watch out!",icon:"bolt",hint:"Bumps cost one heart"},shoot:{name:"Shoot stars",icon:"sparkles",hint:"Space or tap to shoot",speed:8},drive:{name:"Drive",icon:"flag",hint:"\u2191 go \xB7 \u2190 \u2192 steer",speed:6},goal:{name:"Next scene",icon:"door",hint:"Touch to open the next scene"},talk:{name:"Tell a story",icon:"message",hint:"Get close and press E"},particles:{name:"Sparkle",icon:"sparkles",hint:"A little everyday magic",speed:2}},Hr=[["hero","Orbit","Characters","#41d9f2"],["slime","Jelly","Characters","#ab8cff"],["npc","A friend","Characters","#ffca76"],["tree","Pine tree","Nature","#45b891"],["flower","Moonflower","Nature","#eca3dc"],["rock","Rock","Nature","#8b9eac"],["crystal","Crystal","Objects","#50e9e5"],["portal","Portal","Objects","#9b82ff"],["crate","Crate","Objects","#dc9e5c"],["car","Speedster","Characters","#ff8065"],["ship","Starship","Characters","#83b7ff"],["sparkles","Stardust","Effects","#6beaff"],["button","Story button","UI","#48d8e8"]].map(([r,e,t,i])=>({kind:r,name:e,category:t,color:i}));function Ae(r,e=0,t=0,i={}){let n=Hr.find(a=>a.kind===r)||{name:"My image",color:"#69dfef"},s={hero:["control","jump"],tree:["solid"],rock:["solid"],crate:["solid"],crystal:["collect","spin","bounce"],slime:["wander","hazard"],portal:["goal","particles"],car:["drive"],ship:["control","shoot"],npc:["talk"],sparkles:["particles"],button:["talk"]};return{id:zt(),kind:r,name:n.name,x:e,z:t,y:0,scale:1,rotation:0,color:n.color,visible:!0,billboard:"upright",behaviors:(s[r]||[]).map(a=>({type:a,enabled:!0,...Object.fromEntries(Object.entries(Yi[a]).filter(([o])=>["speed","power"].includes(o)))})),...i}}function ri(r="A new world",e="forest",t=[]){return{id:zt(),name:r,theme:e,map:fi(e),objects:t,transition:"fade",story:{title:r,text:"Your story starts here. What happens next?",choices:[{text:"Keep exploring",target:"close"}]}}}var Br=[{id:"quest",name:"Crystal Quest",tag:"Explore & collect",icon:"diamond",color:"#51dbb7",mode:"3d"},{id:"shooter",name:"Star Patrol",tag:"Space shooter",icon:"rocket",color:"#a89bff",mode:"2d"},{id:"racing",name:"Neon Rally",tag:"Race to the finish",icon:"flag",color:"#ffaf77",mode:"3d"},{id:"story",name:"The Moon Door",tag:"Choose your adventure",icon:"book",color:"#e69fdc",mode:"2d"},{id:"platformer",name:"Sky Steps",tag:"Jump & run",icon:"jump",color:"#8dd5a4",mode:"2d"},{id:"blank",name:"Your next big idea",tag:"An empty playground",icon:"plus",color:"#59d8f0",mode:"3d"}];function go(r="quest"){let e=Br.find(i=>i.id===r)||Br[0],t={format:"soulcode",version:1,id:zt(),name:e.name,genre:r,mode:e.mode,scenes:[],assets:[],rules:{lives:3,timeLimit:0,targetScore:r==="blank"?0:5},camera:si(e.mode==="2d"?"flat":"iso"),sound:!0,music:null,updated:Date.now()};if(r==="quest"){let i=[Ae("hero",-2.8,2.2),Ae("portal",5,-3.7),Ae("npc",-5,-3.7),Ae("slime",4,2.5,{behaviors:[{type:"patrol",enabled:!0,speed:1.4},{type:"hazard",enabled:!0}],path:[{x:3,z:1.5},{x:5,z:1.5},{x:5,z:3.5},{x:3,z:3.5}]})];[[-6,-1,1.15],[-6.5,3.6,.9],[-3.3,-4.2,1],[-1.4,-4.8,.85],[6,-.5,1.1],[6.6,3.4,.8],[2.3,-4.8,.7]].forEach(([n,s,a])=>i.push(Ae("tree",n,s,{scale:a}))),[[-1,1.3],[.5,-.5],[2,-2],[3.6,-3.5],[-3.8,-1.6]].forEach(([n,s])=>i.push(Ae("crystal",n,s))),[[-4.5,3.7,.9],[4.8,-1.7,.65],[-.4,-3.8,.6]].forEach(([n,s,a])=>i.push(Ae("rock",n,s,{scale:a}))),[[-4,2.8],[1,3.8],[4.4,-4.5],[-2,-3.3]].forEach(([n,s])=>i.push(Ae("flower",n,s,{scale:.7}))),t.scenes=[ri("The little forest","forest",i),ri("Beyond the portal","night",[Ae("hero",-4,0),Ae("npc",0,-2),Ae("crystal",-1,1),Ae("crystal",2,-1),Ae("crystal",4,2),Ae("portal",5,-3),Ae("tree",-5,-4),Ae("tree",5,4)])],t.scenes[0].story={title:"Hello, explorer!",text:"These crystals power the moon door. Find five, then step into the glowing portal.",choices:[{text:"Let\u2019s explore!",target:"close"}]}}else if(r==="shooter")t.rules.targetScore=6,t.scenes=[ri("The star field","space",[Ae("ship",0,4.2),...[-5,-3,-1,1,3,5].map((i,n)=>Ae("slime",i,-3+n%2,{name:"Space jelly",color:"#bd97ff",behaviors:[{type:"patrol",enabled:!0,speed:1.4},{type:"hazard",enabled:!0}],path:[{x:i-1,z:-3},{x:i+1,z:-3},{x:i+1,z:0}]}))])];else if(r==="racing")t.rules.targetScore=4,t.rules.timeLimit=90,t.scenes=[ri("Cyan circuit","race",[Ae("car",-5,3,{rotation:Math.PI/2}),...[[0,3],[5,0],[0,-3],[-5,0]].map(([i,n],s)=>Ae("crystal",i,n,{name:`Checkpoint ${s+1}`,scale:1.2})),...[-2,0,2].map(i=>Ae("tree",i,0,{scale:.8})),Ae("rock",-1,1,{scale:.8})])];else if(r==="story"){t.rules.targetScore=0;let i=ri("A mysterious door","night",[Ae("hero",-3,2),Ae("npc",-1,-1),Ae("portal",4,-2),Ae("tree",-5,-3),Ae("tree",5,3)]),n=ri("The moon garden","forest",[Ae("hero",-4,2),Ae("npc",0,0),Ae("flower",-2,-2),Ae("flower",2,2),Ae("crystal",4,-3)]),s=ri("A sea of stars","space",[Ae("hero",-3,0),Ae("npc",1,-1),Ae("sparkles",3,2)]);i.story={title:"The Moon Door",text:"A tiny voice whispers: \u201COne door leads to the moon garden. The other leads to the stars.\u201D Which will you choose?",choices:[{text:"\u{1F319} The moon garden",target:n.id},{text:"\u2726 Follow the stars",target:s.id}]},n.story={title:"A garden in the sky",text:"The moonflowers begin to glow. A small friend gives you a crystal. You have found a place to call home.",choices:[{text:"Play again",target:i.id},{text:"Explore the garden",target:"close"}]},s.story={title:"A sea of stars",text:"You leap from star to star, leaving a trail of light. The universe is bigger than you imagined. Your adventure has just begun.",choices:[{text:"Try the other door",target:i.id},{text:"Keep exploring",target:"close"}]},t.scenes=[i,n,s]}else if(r==="platformer"){t.camera=si("side"),t.rules.targetScore=4;let i=ri("A hop into the sky","forest",[Ae("hero",-17,.5,{y:1,behaviors:[{type:"control",speed:4.2,enabled:!0},{type:"jump",power:8,enabled:!0}]}),...[-12,-4,5,13].map((n,s)=>Ae("crystal",n,.5,{y:s%2?3:2})),Ae("portal",17,.5,{y:1})]);i.map={...fi("forest"),width:40,depth:8,base:!1,decorated:!1};for(let n=-20;n<20;n++)n>-10&&n<-7||n>2&&n<5||i.map.blocks.push({x:n,y:0,z:0,shape:"cube",tile:"grass"});for(let n of[-5,-4,-3,12,13,14])i.map.blocks.push({x:n,y:2,z:0,shape:"slab",tile:"brick"});t.scenes=[i]}else t.scenes=[ri("My first world","forest",[Ae("hero",0,0)])];return r==="shooter"&&(t.scenes[0].story={title:"Welcome to Star Patrol",text:"Fly through the star field and clear the six space jellies.",choices:[{text:"Ready for takeoff",target:"close"}]}),r==="racing"&&(t.scenes[0].story={title:"Welcome to Neon Rally",text:"Collect four checkpoints before the timer ends.",choices:[{text:"Let\u2019s race",target:"close"}]}),t}var Gr={flat:{name:"2D \xB7 top down",mode:"2d"},side:{name:"2D \xB7 platformer",mode:"2d"},iso:{name:"Isometric",mode:"3d"},first:{name:"First person",mode:"3d"},third:{name:"Third person",mode:"3d"}};function si(r="iso"){return{preset:r,height:r==="first"?1.35:5,distance:8,angle:r==="first"?0:35,yaw:0,follow:r!=="flat"}}function kd(r,e="3d"){let t=Gr[r?.preset]?r.preset:e==="2d"?"flat":"iso";return{...si(t),height:mt(r?.height,t==="first"?1.35:5,.5,15),distance:mt(r?.distance,8,2,24),angle:mt(r?.angle,t==="first"?0:35,-60,80),yaw:mt(r?.yaw,0,-180,180),follow:r?.follow===void 0?si(t).follow:r.follow!==!1}}var mt=(r,e,t,i)=>Number.isFinite(Number(r))?We(Number(r),t,i):e;function Ns(r){if(!r||r.format!=="soulcode"||r.version!==1||!Array.isArray(r.scenes)||!r.scenes.length||r.scenes.length>30)throw new Error("Choose a Soulcode project file with 1\u201330 scenes.");let e=ai(r);e.id=typeof e.id=="string"?e.id:zt(),e.name=String(e.name||"My game").slice(0,60),e.mode=e.mode==="2d"?"2d":"3d",e.genre=["quest","shooter","racing","story","blank","platformer"].includes(e.genre)?e.genre:"blank",e.camera=kd(e.camera,e.mode),e.mode=Gr[e.camera.preset].mode,e.assets=(Array.isArray(e.assets)?e.assets:[]).filter(n=>n&&typeof n.src=="string"&&/^(data:image\/(png|jpeg|webp|gif);base64,|data:audio\/[a-z0-9.+-]+;base64,)/.test(n.src)).slice(0,60).map(n=>({id:String(n.id||zt()),name:String(n.name||"My asset").slice(0,60),kind:n.src.startsWith("data:image/")?"image":"audio",src:n.src,width:mt(n.width,1,1,4096),height:mt(n.height,1,1,4096),pixelArt:n.pixelArt===!0})),e.sound=e.sound!==!1,e.music=typeof e.music=="string"?e.music:null,e.rules={lives:Math.round(mt(e.rules?.lives,3,1,10)),timeLimit:mt(e.rules?.timeLimit,0,0,600),targetScore:mt(e.rules?.targetScore,5,0,100)};let t=new Set,i=new Set;return e.scenes=e.scenes.map(n=>{if(!n||!Array.isArray(n.objects)||n.objects.length>200)throw new Error("Each scene can hold up to 200 objects.");let s=Gc(n.map,n.theme),a=Vt({map:s},.1),o=typeof n.id=="string"&&!t.has(n.id)?n.id:zt();return t.add(o),{id:o,map:s,name:String(n.name||"My world").slice(0,50),theme:["forest","night","space","race","sand"].includes(n.theme)?n.theme:"forest",transition:["fade","slide","none"].includes(n.transition)?n.transition:"fade",story:{title:String(n.story?.title||"Hello!").slice(0,100),text:String(n.story?.text||"Your story starts here.").slice(0,1500),choices:(Array.isArray(n.story?.choices)?n.story.choices:[{text:"Explore",target:"close"}]).slice(0,4).map(l=>({text:String(l.text||"Continue").slice(0,80),target:String(l.target||"close")}))},objects:n.objects.filter(l=>l&&Fd.includes(l.kind)).map(l=>{let c=typeof l.id=="string"&&!i.has(l.id)?l.id:zt();return i.add(c),{...Ae(l.kind),id:c,name:String(l.name||l.kind).slice(0,50),x:mt(l.x,0,a.minX,a.maxX),z:mt(l.z,0,a.minZ,a.maxZ),y:mt(l.y,0,0,20),scale:mt(l.scale,1,.2,3),rotation:mt(l.rotation,0,-100,100),color:/^#[0-9a-f]{6}$/i.test(l.color)?l.color:"#50ddeb",visible:l.visible!==!1,billboard:l.billboard==="screen"?"screen":"upright",assetId:String(l.assetId||""),soundId:String(l.soundId||""),path:(Array.isArray(l.path)?l.path:[]).slice(0,40).map(h=>({x:mt(h.x,0,a.minX,a.maxX),z:mt(h.z,0,a.minZ,a.maxZ),y:mt(h.y,0,0,20)})),behaviors:(Array.isArray(l.behaviors)?l.behaviors:[]).filter(h=>h&&Yi[h.type]).slice(0,14).map(h=>({type:h.type,enabled:h.enabled!==!1,...h.speed!==void 0?{speed:mt(h.speed,2,.1,12)}:{},...h.power!==void 0?{power:mt(h.power,6,2,12)}:{}}))}})}}),e}function $e(r,e){return r.behaviors?.some(t=>t.type===e&&t.enabled!==!1)}function gi(r,e){return r.behaviors?.find(t=>t.type===e&&t.enabled!==!1)}var Xc={plus:"M12 5v14M5 12h14",minus:"M5 12h14",close:"m6 6 12 12M6 18 18 6",chevron:"m9 5 7 7-7 7",down:"m6 9 6 6 6-6",search:"m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",play:"m8 5 11 7-11 7Z",pause:"M8 5v14M16 5v14",stop:"M6 6h12v12H6Z",box:"m12 3 9 5v9l-9 5-9-5V8Zm0 10v9M3 8l9 5 9-5M7.5 5.5l9 5",diamond:"m12 3 8 9-8 9-8-9ZM4 12h16M12 3l-3 9 3 9 3-9Z",bolt:"m13 2-9 12h7l-1 8 10-12h-7Z",image:"M4 4h16v16H4ZM4 17l6-6 4 4 3-3 3 3M16 8h.01",music:"M9 18V5l11-2v13M9 7l11-2M9 18a3 3 0 1 1-3-3h3M20 16a3 3 0 1 1-3-3h3",layers:"m12 3 10 6-10 6L2 9Zm-10 11 10 6 10-6M2 19l10 6 10-6",upload:"M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",download:"M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5",undo:"M3 10h11a6 6 0 1 1 0 12M3 10l6-6M3 10l6 6",redo:"M21 10H10a6 6 0 1 0 0 12M21 10l-6-6M21 10l-6 6",expand:"M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",grid:"M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",mouse:"m4 3 7 18 2-8 8-2Z",hand:"M8 11V5a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v9a7 7 0 0 1-13 4l-4-6a2 2 0 0 1 3-2l2 2",move:"M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4m12-8 4 4-4 4",rotate:"M20 7A9 9 0 1 0 21 15M20 2v5h-5",copy:"M8 8h13v13H8ZM16 8V3H3v13h5",trash:"M3 6h18M5 6l1 15h12l1-15M9 6V3h6v3M10 10v7m4-7v7",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0",settings:"M4 7h16M4 17h16M8 4v6m8 4v6",help:"M9 9a3 3 0 1 1 4 3v2m-1 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",check:"m5 12 4 4 10-10",folder:"M3 5h6l2 3h10v12H3Z",cloud:"M7 18a5 5 0 1 1 1-10 6 6 0 0 1 11 3 3.5 3.5 0 0 1-1 7Z",heart:"M12 21 3 12a5 5 0 0 1 9-6 5 5 0 0 1 9 6Z",sparkles:"m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3ZM3 3v4M1 5h4m15 14v4m-2-2h4",gamepad:"M7 7h10l4 11c1 3-3 4-5 0l-1-1H9l-1 1c-2 4-6 3-5 0ZM7 10v6m-3-3h6m6-2h.01m2 3h.01",jump:"M5 19c0-11 14-11 14 0M5 19v-5m0 5h5M12 3v4",follow:"M4 18a3 3 0 1 1 6 0M7 15V4m-3 3 3-3 3 3M14 6h5v13m-3-3 3 3 3-3",route:"M5 5a2 2 0 1 1 0 .01M5 7v10a3 3 0 0 0 6 0V7a4 4 0 0 1 8 0v10m-3-3 3 3 3-3",shuffle:"M3 5h3c6 0 6 14 12 14h3m-4-4 4 4-4 4M3 19h3c6 0 6-14 12-14h3m-4-4 4 4-4 4",waves:"M2 8c4-8 6 8 10 0s6 8 10 0M2 16c4-8 6 8 10 0s6 8 10 0",flag:"M5 22V3h14l-3 5 3 5H5",door:"M5 21V3h14v18M3 21h18M14 12h.01",message:"M3 3h18v14H8l-5 4ZM7 8h10M7 12h6",rocket:"m14 3 7-1-1 7-9 9-5-5ZM6 13H2l5-7h4m0 12v4l7-5v-4M4 17l-2 5 5-2",book:"M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v16",volume:"M3 9h4l5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",sun:"M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",screen:"M3 3h18v14H3ZM8 21h8m-4-4v4",save:"M4 3h13l4 4v14H3V3Zm3 0v6h9V3M7 21v-8h10v8",star:"m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",world:"M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c-6 7-6 13 0 20 6-7 6-13 0-20",edit:"m4 16 12-12 4 4L8 20H4Zm9-9 4 4"};function ce(r,e=""){return`<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${Xc[r]||Xc.box}"/></svg>`}function Re(r){return String(r??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Di(r,e="#5cdeed"){let t="";return["hero","npc"].includes(r)?t=`<ellipse cx="40" cy="68" rx="18" ry="5" fill="#000" opacity=".2"/><rect x="27" y="42" width="26" height="21" rx="9" fill="${e}"/><rect x="18" y="16" width="44" height="33" rx="13" fill="${e}"/><rect x="24" y="25" width="32" height="15" rx="7" fill="#153748"/><rect x="30" y="29" width="5" height="7" rx="2" fill="#dbffff"/><rect x="45" y="29" width="5" height="7" rx="2" fill="#dbffff"/><path d="M22 49v7m36-7v7M31 62v5m18-5v5" stroke="${e}" stroke-width="8" stroke-linecap="round"/><path d="M40 16V9" stroke="${e}" stroke-width="3"/><circle cx="40" cy="8" r="4" fill="#e3fcff"/>`:r==="tree"?t=`<ellipse cx="40" cy="70" rx="24" ry="5" fill="#000" opacity=".2"/><path d="M36 53h8v16h-8" fill="#9c7b5a"/><path d="m40 19 26 38H14Z" fill="${e}"/><path d="m40 7 21 34H19Z" fill="${e}"/><path d="m40 7 21 34H40Zm0 34v16h26Z" fill="#173c40" opacity=".25"/>`:r==="crystal"?t=`<ellipse cx="40" cy="70" rx="16" ry="4" fill="${e}" opacity=".12"/><path d="m40 10 20 22v18L40 68 20 50V32Z" fill="${e}"/><path d="M40 10 31 34l9 34 20-18V32Z" fill="#c2ffff" opacity=".35"/><path d="m20 32 11 2 9 34-20-18Z" fill="#126b87" opacity=".4"/><path d="m40 10 7 23-16 1Z" fill="#eaffff" opacity=".6"/>`:r==="slime"?t=`<ellipse cx="40" cy="64" rx="27" ry="6" fill="#000" opacity=".2"/><path d="M13 53c0-49 54-49 54 0 0 17-12 8-18 12-7 4-10-3-16-1-12 5-20 0-20-11Z" fill="${e}"/><ellipse cx="29" cy="44" rx="4" ry="6" fill="#24243f"/><ellipse cx="49" cy="44" rx="4" ry="6" fill="#24243f"/><path d="M35 54q5 5 10 0" fill="none" stroke="#493d65" stroke-width="2"/><ellipse cx="26" cy="28" rx="8" ry="4" fill="white" opacity=".3" transform="rotate(-30 26 28)"/>`:r==="portal"?t=`<ellipse cx="40" cy="69" rx="28" ry="6" fill="${e}" opacity=".2"/><path d="M17 65V33a23 23 0 0 1 46 0v32" fill="#302b56" stroke="${e}" stroke-width="7"/><path d="M26 64V34a14 14 0 0 1 28 0v30" fill="${e}" opacity=".25"/><path d="m40 28 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#c7c7ff"/>`:r==="rock"?t=`<path d="m13 55 8-26 25-8 20 23-7 18-32 4Z" fill="${e}"/><path d="m21 29 17 18 8-26Z" fill="white" opacity=".2"/><path d="m38 47 28-3-7 18-32 4Z" fill="black" opacity=".17"/>`:r==="crate"?t=`<path d="m15 25 25-12 25 12v34L40 71 15 59Z" fill="${e}"/><path d="m40 37 25-12v34L40 71Z" fill="black" opacity=".2"/><path d="m15 25 25 12 25-12M40 37v34M20 31l15 31m0-24L20 55m25-13 15 13m0-23L45 62" fill="none" stroke="#764a33" stroke-width="3"/>`:r==="car"?t=`<rect x="14" y="30" width="10" height="17" rx="4" fill="#172333"/><rect x="56" y="30" width="10" height="17" rx="4" fill="#172333"/><rect x="14" y="53" width="10" height="17" rx="4" fill="#172333"/><rect x="56" y="53" width="10" height="17" rx="4" fill="#172333"/><rect x="23" y="12" width="34" height="59" rx="12" fill="${e}"/><path d="M28 30h24l-3 18H31Z" fill="#b1f0ff"/><path d="M27 60h26M31 19h4m11 0h4" stroke="#fff0c6" stroke-width="5" stroke-linecap="round"/>`:r==="ship"?t=`<path d="m40 8 8 25 20 27-20-4-8 11-8-11-20 4 20-27Z" fill="${e}"/><path d="m40 8 8 25-8 18-8-18Z" fill="#d4f7ff"/><path d="m33 61 7 15 7-15" fill="#ffc27b"/><path d="m19 52 10-11m32 11L51 41" stroke="#476cbd" stroke-width="4"/>`:r==="flower"?t=`<path d="M40 38v30m0-10q-17 2-18-10 14-2 18 10m0-7q17-1 18-12-14 0-18 12" fill="#4dad86" stroke="#4dad86" stroke-width="3"/>${[0,60,120,180,240,300].map(i=>`<ellipse cx="40" cy="23" rx="8" ry="12" fill="${e}" transform="rotate(${i} 40 35)"/>`).join("")}<circle cx="40" cy="35" r="8" fill="#ffe3a1"/>`:r==="button"?t=`<rect x="9" y="25" width="62" height="34" rx="10" fill="${e}"/><path d="m35 35 12 7-12 7Z" fill="#173440"/>`:t=`<path d="m40 8 8 23 24 9-24 8-8 24-8-24-24-8 24-9Z" fill="${e}"/><circle cx="62" cy="16" r="4" fill="#fff"/><circle cx="15" cy="62" r="3" fill="${e}"/>`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" class="asset-art" aria-hidden="true">${t}</svg>`}function $c(r){let{project:e,scene:t,brush:i,libraryShell:n,change:s,render:a,renderer:o,slider:l,bindSlider:c}=r,h=t.map;n("Build a world","Paint a floor. Stack a little adventure.",`<div class="build-modes">${[["floor","grid","Floor"],["block","box","Blocks"],["wall","layers","Wall"]].map(([p,m,y])=>`<button data-build-tool="${p}" class="${i.tool===p?"active":""}">${ce(m)}${y}</button>`).join("")}</div><div class="section-label" style="margin-top:19px">YOUR TILESET</div><div class="tile-palette">${Object.entries(Ii).map(([p,m])=>`<button data-tile="${p}" class="${i.tile===p?"active":""}" style="--tile:${m.color};--tile-light:${m.light};--tile-dark:${m.dark}"><span class="tile-sample tile-${p}"></span><span>${m.name}</span></button>`).join("")}</div>${i.tool!=="floor"?`<label class="field-label" for="build-shape">Shape</label><select id="build-shape">${Object.entries(ni).map(([p,m])=>`<option value="${p}" ${i.shape===p?"selected":""}>${m.name}</option>`).join("")}</select>${l("build-layer","Build layer",i.layer,0,15,1)}<p class="build-note">Layer 0 stacks onto a face. Higher layers draw at that height. Side view uses the place you tap.</p>`:`<button id="apply-floor" class="button wide-button">${ce("grid")}Use for whole floor</button>`}<div class="build-actions"><button id="build-erase" class="toggle" aria-pressed="${i.erase}"><i></i>Eraser</button><button id="finish-build" class="quiet-button">${ce("check")}Done</button></div><details class="build-map-settings"><summary>Map size & ground ${ce("down")}</summary><div class="transform-row" style="margin-top:15px"><label class="number-field"><span>W</span><input id="map-width" type="number" min="8" max="64" step="2" value="${h.width}" aria-label="Map width"></label><label class="number-field"><span>D</span><input id="map-depth" type="number" min="4" max="64" step="2" value="${h.depth}" aria-label="Map depth"></label></div><button id="resize-map" class="button wide-button">${ce("expand")}Resize map</button><button id="map-base" class="toggle" style="margin-top:16px" aria-pressed="${h.base}"><i></i>Solid ground underneath</button><p class="build-note">Turn ground off to make floating platforms and gaps. Shrinking keeps your existing work inside.</p></details><div class="build-meter"><span>${h.blocks.length.toLocaleString()} blocks</span><span>${h.width} \xD7 ${h.depth}</span><i style="--used:${h.blocks.length/Xn*100}%"></i></div>`,`<div class="pill-note">${ce("hand")}Two fingers to pan. Pinch to zoom.</div>`);let d=document.querySelector("#library"),u=p=>d.querySelector(p);if(d.querySelectorAll("[data-build-tool]").forEach(p=>p.onclick=()=>{i.tool=p.dataset.buildTool,r.start(),a()}),d.querySelectorAll("[data-tile]").forEach(p=>p.onclick=()=>{i.tile=p.dataset.tile,r.start(),a()}),u("#build-shape")&&(u("#build-shape").onchange=p=>{i.shape=p.target.value,i.tool="block",r.start()}),u("#build-layer")){let p=u("#build-layer");p.oninput=()=>{i.layer=Number(p.value),u("#build-layer-value").textContent=p.value,r.start()}}u("#build-erase").onclick=()=>{i.erase=!i.erase,r.start(),a()},u("#finish-build").onclick=()=>{r.finish()},u("#apply-floor")&&(u("#apply-floor").onclick=()=>{s(()=>{h.tileset=i.tile,h.decorated=!1,h.tiles=h.tiles.filter(p=>p.tile==="void")},"terrain"),a()}),u("#resize-map").onclick=()=>{let p=Math.round(Number(u("#map-width").value)/2)*2,m=Math.round(Number(u("#map-depth").value)/2)*2;!Number.isFinite(p)||!Number.isFinite(m)||(s(()=>Wc(t,Math.max(8,p),Math.max(4,m)),"terrain"),o.reset(),r.toast(`Your world is ${h.width} \xD7 ${h.depth}.`),a())},u("#map-base").onclick=()=>{s(()=>{h.base=!h.base,h.decorated=!1},"terrain"),a()}}function qc(r){let{project:e,showModal:t,change:i,slider:n,bindSlider:s}=r,a=e.camera;function o(){let l=a.preset,c=l==="first"||l==="third";t("A NEW WAY TO SEE YOUR WORLD",`<h2>Pick your point of view.</h2><p class="subtitle">Your game camera comes alive when you press Play.</p><div class="camera-presets">${Object.entries(Gr).map(([h,d])=>`<button data-camera-preset="${h}" class="${l===h?"active":""}"><span class="camera-illustration ${h}">${ce(h==="first"?"eye":h==="third"?"gamepad":h==="side"?"jump":h==="iso"?"box":"grid")}</span><strong>${d.name}</strong></button>`).join("")}</div><div class="camera-settings">${l==="flat"||l==="side"?`<div class="pill-note">${ce("hand")}${l==="side"?"Left and right to run. Space to jump. The camera follows you.":"A clear view from above. Switch on Follow for a larger world."}</div>${l==="flat"?`<button id="camera-follow" class="toggle" aria-pressed="${a.follow}" style="margin-top:16px"><i></i>Follow the player</button>`:""}`:`${n("camera-height",l==="first"?"Eye height":"Camera height",a.height,.5,l==="first"?3:12,.1)}${l!=="first"?n("camera-distance","Distance",a.distance,2,24,.5):""}${n("camera-angle","Look angle",a.angle,l==="first"?-60:0,l==="first"?60:75,1,"\xB0")}${n("camera-yaw","Starting direction",a.yaw,-180,180,5,"\xB0")}<div class="pill-note">${ce("waves")}Smooth following is on. ${c?"Drag the game view to look around. Q / R also turn.":"The camera gently follows your player."}</div>`}</div><div class="modal-actions"><button id="camera-done" class="button primary">${ce("check")}Looks good</button></div>`),document.querySelectorAll("[data-camera-preset]").forEach(h=>h.onclick=()=>{i(()=>{e.camera=si(h.dataset.cameraPreset),e.mode=Gr[h.dataset.cameraPreset].mode},!1),a=e.camera,r.refresh(),o()}),document.querySelector("#camera-follow")&&(document.querySelector("#camera-follow").onclick=()=>{i(()=>a.follow=!a.follow,!1),o()});for(let h of["height","distance","angle","yaw"])document.querySelector("#camera-"+h)&&s("camera-"+h,d=>{a[h]=d},["angle","yaw"].includes(h)?"\xB0":"");document.querySelector("#camera-done").onclick=()=>{r.refresh(),document.querySelector("#modal").close()}}o()}var bn=class{constructor(e=32,t=e,i){this.width=e,this.height=t,this.data=i?new Uint8ClampedArray(i):new Uint8ClampedArray(e*t*4)}snapshot(){return new Uint8ClampedArray(this.data)}restore(e){this.data.set(e)}pixel(e,t,i,n=1){let s=Math.floor((n-1)/2);for(let a=0;a<n;a++)for(let o=0;o<n;o++){let l=Math.round(e)+o-s,c=Math.round(t)+a-s;l>=0&&c>=0&&l<this.width&&c<this.height&&this.data.set(i,(c*this.width+l)*4)}}line(e,t,i,n,s,a=1){e=Math.round(e),t=Math.round(t),i=Math.round(i),n=Math.round(n);let o=Math.abs(i-e),l=e<i?1:-1,c=-Math.abs(n-t),h=t<n?1:-1,d=o+c;for(;this.pixel(e,t,s,a),!(e===i&&t===n);){let u=2*d;u>=c&&(d+=c,e+=l),u<=o&&(d+=o,t+=h)}}rect(e,t,i,n,s,a=!0){let o=Math.min(e,i),l=Math.max(e,i),c=Math.min(t,n),h=Math.max(t,n);for(let d=c;d<=h;d++)for(let u=o;u<=l;u++)(a||u===o||u===l||d===c||d===h)&&this.pixel(u,d,s)}ellipse(e,t,i,n,s,a=!0){let o=(e+i)/2,l=(t+n)/2,c=Math.max(.5,Math.abs(i-e)/2),h=Math.max(.5,Math.abs(n-t)/2);for(let d=Math.min(t,n);d<=Math.max(t,n);d++)for(let u=Math.min(e,i);u<=Math.max(e,i);u++)((u-o)/c)**2+((d-l)/h)**2<=1.2&&(a||((u-o)/Math.max(.1,c-1))**2+((d-l)/Math.max(.1,h-1))**2>=1)&&this.pixel(u,d,s)}fill(e,t,i){if(e<0||t<0||e>=this.width||t>=this.height)return;let n=(t*this.width+e)*4,s=this.data.slice(n,n+4);if(s.every((l,c)=>l===i[c]))return;let a=[t*this.width+e],o=new Uint8Array(this.width*this.height);for(;a.length;){let l=a.pop();if(o[l])continue;o[l]=1;let c=l*4;if(!s.every((u,p)=>this.data[c+p]===u))continue;this.data.set(i,c);let h=l%this.width,d=Math.floor(l/this.width);h>0&&a.push(l-1),h<this.width-1&&a.push(l+1),d>0&&a.push(l-this.width),d<this.height-1&&a.push(l+this.width)}}};function Os(r){return[parseInt(r.slice(1,3),16),parseInt(r.slice(3,5),16),parseInt(r.slice(5,7),16),255]}var zs;async function Yc(){return zs||new Promise((r,e)=>{let t=indexedDB.open("soulcode-studio",1);t.onupgradeneeded=()=>t.result.createObjectStore("projects",{keyPath:"id"}),t.onsuccess=()=>{zs=t.result,r(zs)},t.onerror=()=>e(t.error)})}async function vo(r){let e=await Yc();return new Promise((t,i)=>{let n=e.transaction("projects","readwrite");n.objectStore("projects").put(r),n.oncomplete=()=>{try{localStorage.setItem("soulcode-last",r.id)}catch{}t()},n.onerror=()=>i(n.error),n.onabort=()=>i(n.error||new Error("Saving was interrupted"))})}async function yo(){let r=await Yc();return new Promise((e,t)=>{let i=r.transaction("projects").objectStore("projects").getAll();i.onsuccess=()=>e(i.result.sort((n,s)=>s.updated-n.updated)),i.onerror=()=>t(i.error)})}function Mn(r,e){let t=URL.createObjectURL(r),i=document.createElement("a");i.href=t,i.download=e,i.click(),setTimeout(()=>URL.revokeObjectURL(t),3e4)}function Zc({showModal:r,onSave:e,asset:t=null}){let i=new bn(32),n="pencil",s="#60ddf2",a=1,o=!0,l="#ffffff",c=!0,h=[],d=[],u=null,p=!1;r("A LITTLE PIXEL MAGIC",`<h2>Make a little somebody.</h2><p class="subtitle">Draw, erase, fill. Your next game asset starts here.</p><div class="sprite-toolbar"><div class="sprite-tools">${[["pencil","edit","Draw"],["eraser","close","Erase"],["fill","waves","Fill"],["line","route","Line"],["rect","box","Box"],["ellipse","sun","Circle"]].map(([T,I,U])=>`<button class="sprite-tool ${T==="pencil"?"active":""}" data-pixel-tool="${T}" title="${U}" aria-label="${U}">${ce(I)}<span>${U}</span></button>`).join("")}</div><div class="sprite-history"><button class="icon-button" id="pixel-undo" aria-label="Undo drawing">${ce("undo")}</button><button class="icon-button" id="pixel-redo" aria-label="Redo drawing">${ce("redo")}</button></div></div><div class="sprite-workspace"><div class="sprite-paper checkerboard"><canvas id="pixel-canvas" width="32" height="32" aria-label="Sprite drawing canvas" tabindex="0"></canvas></div><aside class="sprite-options"><div class="pixel-field pixel-color-field"><label class="field-label" for="pixel-color">Your color</label><input id="pixel-color" type="color" value="${s}" aria-label="Drawing color"><div class="pixel-swatches">${["#60ddf2","#ab8cff","#ffca76","#45b891","#ff8198","#ffffff","#172837","#000000"].map(T=>`<button data-pixel-color="${T}" style="--swatch:${T}" aria-label="Draw with ${T}"></button>`).join("")}</div></div><div class="pixel-field"><label class="field-label" for="pixel-brush">Brush size</label><input id="pixel-brush" type="range" min="1" max="8" value="1" aria-label="Brush size"></div><div class="pixel-field"><label class="field-label" for="pixel-size">Canvas size</label><select id="pixel-size">${[16,32,64,128].map(T=>`<option ${T===32?"selected":""} value="${T}">${T} \xD7 ${T}</option>`).join("")}</select></div><button id="pixel-filled" class="toggle" aria-pressed="true"><i></i>Filled shapes</button><button id="pixel-transparent" class="toggle" aria-pressed="true"><i></i>Transparent</button><div class="pixel-field"><label class="field-label" for="pixel-background">Background color</label><input id="pixel-background" type="color" value="#ffffff" aria-label="Background color"></div><button id="pixel-clear" class="quiet-button">${ce("trash")}Clear drawing</button></aside></div><label class="field-label" for="pixel-name">Give it a name</label><input id="pixel-name" class="text-input" value="${Re(t?.name||"My little sprite")}" maxlength="60"><div class="modal-actions"><button id="pixel-download" class="button">${ce("download")}PNG</button><button id="pixel-save" class="button primary">${ce("plus")}${t?"Save sprite":"Add to my assets"}</button></div><p class="dialog-note">Checkerboard means see-through. In 3D, your sprite stands up and faces the camera.</p>`);let m=document.querySelector("#modal-content"),y=m.querySelector("#pixel-canvas"),g=y.getContext("2d"),f=m.querySelector(".sprite-paper"),v=T=>m.querySelector(T),x=()=>{y.width=i.width,y.height=i.height,g.putImageData(new ImageData(i.data,i.width,i.height),0,0),y.style.background=o?"transparent":l,f.classList.toggle("checkerboard",o),v("#pixel-undo").disabled=!h.length,v("#pixel-redo").disabled=!d.length},_=()=>{h.push({w:i.width,h:i.height,data:i.snapshot()}),h.length>32&&h.shift(),d=[]},R=(T,I)=>{if(!T.length)return;I.push({w:i.width,h:i.height,data:i.snapshot()});let U=T.pop();i=new bn(U.w,U.h,U.data),v("#pixel-size").value=String(U.w),x()},E=T=>{let I=y.getBoundingClientRect();return{x:Math.max(0,Math.min(i.width-1,Math.floor((T.clientX-I.left)/I.width*i.width))),y:Math.max(0,Math.min(i.height-1,Math.floor((T.clientY-I.top)/I.height*i.height)))}};m.querySelectorAll("[data-pixel-tool]").forEach(T=>T.onclick=()=>{n=T.dataset.pixelTool,m.querySelectorAll("[data-pixel-tool]").forEach(I=>{I.classList.toggle("active",I===T),I.setAttribute("aria-pressed",I===T)})}),m.querySelectorAll("[data-pixel-color]").forEach(T=>T.onclick=()=>{s=T.dataset.pixelColor,v("#pixel-color").value=s}),v("#pixel-color").oninput=T=>s=T.target.value,v("#pixel-brush").oninput=T=>a=Number(T.target.value),v("#pixel-filled").onclick=()=>{c=!c,v("#pixel-filled").setAttribute("aria-pressed",c)},v("#pixel-transparent").onclick=()=>{o=!o,v("#pixel-transparent").setAttribute("aria-pressed",o),x()},v("#pixel-background").oninput=T=>{l=T.target.value,o=!1,v("#pixel-transparent").setAttribute("aria-pressed",!1),x()},y.onpointerdown=T=>{T.preventDefault(),y.setPointerCapture(T.pointerId),_();let I=E(T);u={start:I,last:I,before:i.snapshot()},n==="fill"?(i.fill(I.x,I.y,Os(s)),u=null):i.pixel(I.x,I.y,n==="eraser"?[0,0,0,0]:Os(s),["pencil","eraser","line"].includes(n)?a:1),x()},y.onpointermove=T=>{if(!u)return;let I=E(T),U=Os(s);n==="pencil"||n==="eraser"?i.line(u.last.x,u.last.y,I.x,I.y,n==="eraser"?[0,0,0,0]:U,a):(i.restore(u.before),n==="rect"?i.rect(u.start.x,u.start.y,I.x,I.y,U,c):n==="ellipse"?i.ellipse(u.start.x,u.start.y,I.x,I.y,U,c):i.line(u.start.x,u.start.y,I.x,I.y,U,a)),u.last=I,x()},y.onpointerup=y.onpointercancel=()=>{u=null},v("#pixel-undo").onclick=()=>R(h,d),v("#pixel-redo").onclick=()=>R(d,h),v("#pixel-clear").onclick=()=>{_(),i.data.fill(0),x()},v("#pixel-size").onchange=T=>{_();let I=Number(T.target.value),U=document.createElement("canvas");U.width=U.height=I;let j=U.getContext("2d");j.imageSmoothingEnabled=!1,j.drawImage(y,0,0,I,I),i=new bn(I,I,j.getImageData(0,0,I,I).data),x()};function S(){let T=document.createElement("canvas");T.width=i.width,T.height=i.height;let I=T.getContext("2d");return o||(I.fillStyle=l,I.fillRect(0,0,T.width,T.height)),I.drawImage(y,0,0),T}if(v("#pixel-download").onclick=()=>S().toBlob(T=>Mn(T,(v("#pixel-name").value.trim()||"my-sprite").replace(/[^a-z0-9-]/gi,"-")+".png"),"image/png"),v("#pixel-save").onclick=()=>{e({id:t?.id,name:v("#pixel-name").value.trim()||"My little sprite",kind:"image",src:S().toDataURL("image/png"),width:i.width,height:i.height,pixelArt:!0})},t){m.setAttribute("aria-busy","true"),m.querySelectorAll("button,input,select").forEach(I=>I.disabled=!0),y.style.pointerEvents="none";let T=new Image;T.onload=()=>{if(!y.isConnected)return;m.removeAttribute("aria-busy"),m.querySelectorAll("button,input,select").forEach(H=>H.disabled=!1),y.style.pointerEvents="";let I=[16,32,64,128].find(H=>H>=Math.max(T.width,T.height))||128,U=document.createElement("canvas");U.width=U.height=I;let j=U.getContext("2d");j.imageSmoothingEnabled=!1;let P=Math.min(I/T.width,I/T.height);j.drawImage(T,(I-T.width*P)/2,(I-T.height*P)/2,T.width*P,T.height*P),i=new bn(I,I,j.getImageData(0,0,I,I).data),v("#pixel-size").value=String(I),x()},T.onerror=()=>{y.isConnected&&(m.removeAttribute("aria-busy"),v(".dialog-note").textContent="This image could not open. Close this window and choose another image.")},T.src=t.src}x()}var sl="162";var Nu=1,hc=2,ki=3,on=0,Bt=1,Ss=2;var Ln=100;var al=204,ol=205;var Ou=0,Bd=1,Hd=2,sn=0,Gd=1,Vd=2,Wd=3,uc=4,jd=5,Xd=6,$d=7;var zu=300,xr=301,_r=302,ll=303,cl=304,eo=306,hl=1e3,Bi=1001,ul=1002,yt=1003,Jc=1004;var Vr=1005;var Ft=1006,xo=1007;var fr=1008;var Dn=1009;var dc=1012,Fu=1013,nn=1014,yi=1015,rs=1016,ku=1017,Bu=1018,Un=1020;var Gi=1023;var Nn=1026,br=1027,Hu=1028,Gu=1029;var Vu=1031,Wu=1033,_o=33776,bo=33777,Mo=33778,So=33779,Kc=35840,Qc=35841,eh=35842,th=35843,ju=36196,ih=37492,nh=37496,rh=37808,sh=37809,ah=37810,oh=37811,lh=37812,ch=37813,hh=37814,uh=37815,dh=37816,ph=37817,mh=37818,fh=37819,gh=37820,vh=37821,wo=36492,yh=36494,xh=36495;var _h=36284,bh=36285,Mh=36286;var _a=2300,ba=2301,Eo=2302,Sh=2400,wh=2401,Eh=2402;var mr="",kt="srgb",hn="srgb-linear",pc="display-p3",to="display-p3-linear",Ma="linear",Ke="srgb",Sa="rec709",wa="p3";var $n=7680;var dl=35044;var Th="300 es",Xu=1035,Mr=2e3,Ea=2001,ln=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let n=i.indexOf(t);n!==-1&&i.splice(n,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let i=t.slice(0);for(let n=0,s=i.length;n<s;n++)i[n].call(this,e);e.target=null}}},Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var xa=Math.PI/180,pl=180/Math.PI;function Vi(){let r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,i=4294967295*Math.random()|0;return(Rt[255&r]+Rt[r>>8&255]+Rt[r>>16&255]+Rt[r>>24&255]+"-"+Rt[255&e]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[63&t|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[255&i]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]).toLowerCase()}function St(r,e,t){return Math.max(e,Math.min(t,r))}function qd(r,e){return(r%e+e)%e}function To(r,e,t){return(1-t)*r+t*e}function Ah(r){return(r&r-1)==0&&r!==0}function ml(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function xi(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function qe(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}var ne=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(St(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*n+e.x,this.y=s*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ue=class r{constructor(e,t,i,n,s,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c)}set(e,t,i,n,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],p=i[5],m=i[8],y=n[0],g=n[3],f=n[6],v=n[1],x=n[4],_=n[7],R=n[2],E=n[5],S=n[8];return s[0]=a*y+o*v+l*R,s[3]=a*g+o*x+l*E,s[6]=a*f+o*_+l*S,s[1]=c*y+h*v+d*R,s[4]=c*g+h*x+d*E,s[7]=c*f+h*_+d*S,s[2]=u*y+p*v+m*R,s[5]=u*g+p*x+m*E,s[8]=u*f+p*_+m*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*s,p=c*s-a*l,m=t*d+i*u+n*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return e[0]=d*y,e[1]=(n*c-h*i)*y,e[2]=(o*i-n*a)*y,e[3]=u*y,e[4]=(h*t-n*l)*y,e[5]=(n*s-o*t)*y,e[6]=p*y,e[7]=(i*l-c*t)*y,e[8]=(a*t-i*s)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ao.makeScale(e,t)),this}rotate(e){return this.premultiply(Ao.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ao.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ao=new Ue;function $u(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function ss(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Yd(){let r=ss("canvas");return r.style.display="block",r}var Rh={};function qu(r){r in Rh||(Rh[r]=!0,console.warn(r))}var Ch=new Ue().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Lh=new Ue().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Fs={[hn]:{transfer:Ma,primaries:Sa,toReference:r=>r,fromReference:r=>r},[kt]:{transfer:Ke,primaries:Sa,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[to]:{transfer:Ma,primaries:wa,toReference:r=>r.applyMatrix3(Lh),fromReference:r=>r.applyMatrix3(Ch)},[pc]:{transfer:Ke,primaries:wa,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Lh),fromReference:r=>r.applyMatrix3(Ch).convertLinearToSRGB()}},Zd=new Set([hn,to]),Ye={enabled:!0,_workingColorSpace:hn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!Zd.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;let i=Fs[e].toReference;return(0,Fs[t].fromReference)(i(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return Fs[r].primaries},getTransfer:function(r){return r===mr?Ma:Fs[r].transfer}};function vr(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function Ro(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}var qn,Hi=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{qn===void 0&&(qn=ss("canvas")),qn.width=e.width,qn.height=e.height;let i=qn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=qn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ss("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=255*vr(s[a]/255);return i.putImageData(n,0,0),t}if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(255*vr(t[i]/255)):t[i]=vr(t[i]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Jd=0,Ta=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jd++}),this.uuid=Vi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(Co(n[a].image)):s.push(Co(n[a]))}else s=Co(n);i.url=s}return t||(e.images[this.uuid]=i),i}};function Co(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Hi.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Kd=0,Ut=class r extends ln{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,i=1001,n=1001,s=1006,a=1008,o=1023,l=1009,c=r.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=Vi(),this.name="",this.source=new Ta(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ne(0,0),this.repeat=new ne(1,1),this.center=new ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==zu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case hl:e.x=e.x-Math.floor(e.x);break;case Bi:e.x=e.x<0?0:1;break;case ul:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case hl:e.y=e.y-Math.floor(e.y);break;case Bi:e.y=e.y<0?0:1;break;case ul:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}};Ut.DEFAULT_IMAGE=null,Ut.DEFAULT_MAPPING=zu,Ut.DEFAULT_ANISOTROPY=1;var dt=class r{constructor(e=0,t=0,i=0,n=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],m=l[9],y=l[2],g=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+y)<.1&&Math.abs(m+g)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,_=(p+1)/2,R=(f+1)/2,E=(h+u)/4,S=(d+y)/4,T=(m+g)/4;return x>_&&x>R?x<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(x),n=E/i,s=S/i):_>R?_<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(_),i=E/n,s=T/n):R<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(R),i=S/s,n=T/s),this.set(i,n,s,t),this}let v=Math.sqrt((g-m)*(g-m)+(d-y)*(d-y)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(d-y)/v,this.z=(u-h)/v,this.w=Math.acos((c+p+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},fl=class extends ln{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t);let n={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ft,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0,count:1},i);let s=new Ut(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,n=e.textures.length;i<n;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ta(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Wi=class extends fl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Aa=class extends Ut{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=yt,this.minFilter=yt,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var gl=class extends Ut{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=yt,this.minFilter=yt,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _i=class{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],d=i[n+3],u=s[a+0],p=s[a+1],m=s[a+2],y=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=d);if(o===1)return e[t+0]=u,e[t+1]=p,e[t+2]=m,void(e[t+3]=y);if(d!==y||l!==u||c!==p||h!==m){let g=1-o,f=l*u+c*p+h*m+d*y,v=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){let R=Math.sqrt(x),E=Math.atan2(R,f*v);g=Math.sin(g*E)/R,o=Math.sin(o*E)/R}let _=o*v;if(l=l*g+u*_,c=c*g+p*_,h=h*g+m*_,d=d*g+y*_,g===1-o){let R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,n,s,a){let o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],d=s[a],u=s[a+1],p=s[a+2],m=s[a+3];return e[t]=o*m+h*d+l*p-c*u,e[t+1]=l*m+h*u+c*d-o*p,e[t+2]=c*m+h*p+o*u-l*d,e[t+3]=h*m-o*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,n=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),d=o(s/2),u=l(i/2),p=l(n/2),m=l(s/2);switch(a){case"XYZ":this._x=u*h*d+c*p*m,this._y=c*p*d-u*h*m,this._z=c*h*m+u*p*d,this._w=c*h*d-u*p*m;break;case"YXZ":this._x=u*h*d+c*p*m,this._y=c*p*d-u*h*m,this._z=c*h*m-u*p*d,this._w=c*h*d+u*p*m;break;case"ZXY":this._x=u*h*d-c*p*m,this._y=c*p*d+u*h*m,this._z=c*h*m+u*p*d,this._w=c*h*d-u*p*m;break;case"ZYX":this._x=u*h*d-c*p*m,this._y=c*p*d+u*h*m,this._z=c*h*m-u*p*d,this._w=c*h*d+u*p*m;break;case"YZX":this._x=u*h*d+c*p*m,this._y=c*p*d+u*h*m,this._z=c*h*m-u*p*d,this._w=c*h*d-u*p*m;break;case"XZY":this._x=u*h*d-c*p*m,this._y=c*p*d-u*h*m,this._z=c*h*m+u*p*d,this._w=c*h*d+u*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],n=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=i+o+d;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-n)*p}else if(i>o&&i>d){let p=2*Math.sqrt(1+i-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(n+a)/p,this._z=(s+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-i-d);this._w=(s-c)/p,this._x=(n+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+d-i-o);this._w=(a-n)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(St(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,n=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,n=this._y,s=this._z,a=this._w,o=a*e._w+i*e._x+n*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*n+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=a*d+this._w*u,this._x=i*d+this._x*u,this._y=n*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},w=class r{constructor(e=0,t=0,i=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ph.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ph.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,n=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),h=2*(o*t-s*n),d=2*(s*i-a*t);return this.x=t+l*c+a*d-o*h,this.y=i+l*h+o*c-s*d,this.z=n+l*d+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,n=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Lo.copy(this).projectOnVector(e),this.sub(Lo)}reflect(e){return this.sub(Lo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(St(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Lo=new w,Ph=new _i,Ht=class{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(oi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(oi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=oi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,oi):oi.fromBufferAttribute(s,a),oi.applyMatrix4(e.matrixWorld),this.expandByPoint(oi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ks.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ks.copy(i.boundingBox)),ks.applyMatrix4(e.matrixWorld),this.union(ks)}let n=e.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,oi),oi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wr),Bs.subVectors(this.max,Wr),Yn.subVectors(e.a,Wr),Zn.subVectors(e.b,Wr),Jn.subVectors(e.c,Wr),Zi.subVectors(Zn,Yn),Ji.subVectors(Jn,Zn),Sn.subVectors(Yn,Jn);let t=[0,-Zi.z,Zi.y,0,-Ji.z,Ji.y,0,-Sn.z,Sn.y,Zi.z,0,-Zi.x,Ji.z,0,-Ji.x,Sn.z,0,-Sn.x,-Zi.y,Zi.x,0,-Ji.y,Ji.x,0,-Sn.y,Sn.x,0];return!!Po(t,Yn,Zn,Jn,Bs)&&(t=[1,0,0,0,1,0,0,0,1],!!Po(t,Yn,Zn,Jn,Bs)&&(Hs.crossVectors(Zi,Ji),t=[Hs.x,Hs.y,Hs.z],Po(t,Yn,Zn,Jn,Bs)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,oi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(oi).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ui)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Ui=[new w,new w,new w,new w,new w,new w,new w,new w],oi=new w,ks=new Ht,Yn=new w,Zn=new w,Jn=new w,Zi=new w,Ji=new w,Sn=new w,Wr=new w,Bs=new w,Hs=new w,wn=new w;function Po(r,e,t,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){wn.fromArray(r,s);let o=n.x*Math.abs(wn.x)+n.y*Math.abs(wn.y)+n.z*Math.abs(wn.z),l=e.dot(wn),c=t.dot(wn),h=i.dot(wn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Qd=new Ht,jr=new w,Io=new w,di=class{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Qd.setFromPoints(e).getCenter(i);let n=0;for(let s=0,a=e.length;s<a;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;jr.subVectors(e,this.center);let t=jr.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),n=.5*(i-this.radius);this.center.addScaledVector(jr,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Io.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(jr.copy(e.center).add(Io)),this.expandByPoint(jr.copy(e.center).sub(Io))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Ni=new w,Do=new w,Gs=new w,Ki=new w,Uo=new w,Vs=new w,No=new w,On=class{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ni)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ni.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ni.copy(this.origin).addScaledVector(this.direction,t),Ni.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Do.copy(e).add(t).multiplyScalar(.5),Gs.copy(t).sub(e).normalize(),Ki.copy(this.origin).sub(Do);let s=.5*e.distanceTo(t),a=-this.direction.dot(Gs),o=Ki.dot(this.direction),l=-Ki.dot(Gs),c=Ki.lengthSq(),h=Math.abs(1-a*a),d,u,p,m;if(h>0)if(d=a*l-o,u=a*o-l,m=s*h,d>=0)if(u>=-m)if(u<=m){let y=1/h;d*=y,u*=y,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-m?(d=Math.max(0,-(-a*s+o)),u=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c):u<=m?(d=0,u=Math.min(Math.max(-s,-l),s),p=u*(u+2*l)+c):(d=Math.max(0,-(a*s+o)),u=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c);else u=a>0?-s:s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),n&&n.copy(Do).addScaledVector(Gs,u),p}intersectSphere(e,t){Ni.subVectors(e.center,this.origin);let i=Ni.dot(this.direction),n=Ni.dot(Ni)-i*i,s=e.radius*e.radius;if(n>s)return null;let a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,n=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,n=(e.min.x-u.x)*c),h>=0?(s=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||s>n?null:((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),i>l||o>n?null:((o>i||i!=i)&&(i=o),(l<n||n!=n)&&(n=l),n<0?null:this.at(i>=0?i:n,t)))}intersectsBox(e){return this.intersectBox(e,Ni)!==null}intersectTriangle(e,t,i,n,s){Uo.subVectors(t,e),Vs.subVectors(i,e),No.crossVectors(Uo,Vs);let a,o=this.direction.dot(No);if(o>0){if(n)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}Ki.subVectors(this.origin,e);let l=a*this.direction.dot(Vs.crossVectors(Ki,Vs));if(l<0)return null;let c=a*this.direction.dot(Uo.cross(Ki));if(c<0||l+c>o)return null;let h=-a*Ki.dot(No);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Le=class r{constructor(e,t,i,n,s,a,o,l,c,h,d,u,p,m,y,g){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c,h,d,u,p,m,y,g)}set(e,t,i,n,s,a,o,l,c,h,d,u,p,m,y,g){let f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=n,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=m,f[11]=y,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,n=1/Kn.setFromMatrixColumn(e,0).length(),s=1/Kn.setFromMatrixColumn(e,1).length(),a=1/Kn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,n=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let u=a*h,p=a*d,m=o*h,y=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+m*c,t[5]=u-y*c,t[9]=-o*l,t[2]=y-u*c,t[6]=m+p*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,p=l*d,m=c*h,y=c*d;t[0]=u+y*o,t[4]=m*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=p*o-m,t[6]=y+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,p=l*d,m=c*h,y=c*d;t[0]=u-y*o,t[4]=-a*d,t[8]=m+p*o,t[1]=p+m*o,t[5]=a*h,t[9]=y-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,p=a*d,m=o*h,y=o*d;t[0]=l*h,t[4]=m*c-p,t[8]=u*c+y,t[1]=l*d,t[5]=y*c+u,t[9]=p*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,p=a*c,m=o*l,y=o*c;t[0]=l*h,t[4]=y-u*d,t[8]=m*d+p,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*d+m,t[10]=u-y*d}else if(e.order==="XZY"){let u=a*l,p=a*c,m=o*l,y=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+y,t[5]=a*h,t[9]=p*d-m,t[2]=m*d-p,t[6]=o*h,t[10]=y*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ep,e,tp)}lookAt(e,t,i){let n=this.elements;return Wt.subVectors(e,t),Wt.lengthSq()===0&&(Wt.z=1),Wt.normalize(),Qi.crossVectors(i,Wt),Qi.lengthSq()===0&&(Math.abs(i.z)===1?Wt.x+=1e-4:Wt.z+=1e-4,Wt.normalize(),Qi.crossVectors(i,Wt)),Qi.normalize(),Ws.crossVectors(Wt,Qi),n[0]=Qi.x,n[4]=Ws.x,n[8]=Wt.x,n[1]=Qi.y,n[5]=Ws.y,n[9]=Wt.y,n[2]=Qi.z,n[6]=Ws.z,n[10]=Wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],p=i[13],m=i[2],y=i[6],g=i[10],f=i[14],v=i[3],x=i[7],_=i[11],R=i[15],E=n[0],S=n[4],T=n[8],I=n[12],U=n[1],j=n[5],P=n[9],H=n[13],J=n[2],se=n[6],de=n[10],K=n[14],X=n[3],Q=n[7],he=n[11],q=n[15];return s[0]=a*E+o*U+l*J+c*X,s[4]=a*S+o*j+l*se+c*Q,s[8]=a*T+o*P+l*de+c*he,s[12]=a*I+o*H+l*K+c*q,s[1]=h*E+d*U+u*J+p*X,s[5]=h*S+d*j+u*se+p*Q,s[9]=h*T+d*P+u*de+p*he,s[13]=h*I+d*H+u*K+p*q,s[2]=m*E+y*U+g*J+f*X,s[6]=m*S+y*j+g*se+f*Q,s[10]=m*T+y*P+g*de+f*he,s[14]=m*I+y*H+g*K+f*q,s[3]=v*E+x*U+_*J+R*X,s[7]=v*S+x*j+_*se+R*Q,s[11]=v*T+x*P+_*de+R*he,s[15]=v*I+x*H+_*K+R*q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14];return e[3]*(+s*l*d-n*c*d-s*o*u+i*c*u+n*o*p-i*l*p)+e[7]*(+t*l*p-t*c*u+s*a*u-n*a*p+n*c*h-s*l*h)+e[11]*(+t*c*d-t*o*p-s*a*d+i*a*p+s*o*h-i*c*h)+e[15]*(-n*o*h-t*l*d+t*o*u+n*a*d-i*a*u+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],m=e[12],y=e[13],g=e[14],f=e[15],v=d*g*c-y*u*c+y*l*p-o*g*p-d*l*f+o*u*f,x=m*u*c-h*g*c-m*l*p+a*g*p+h*l*f-a*u*f,_=h*y*c-m*d*c+m*o*p-a*y*p-h*o*f+a*d*f,R=m*d*l-h*y*l-m*o*u+a*y*u+h*o*g-a*d*g,E=t*v+i*x+n*_+s*R;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/E;return e[0]=v*S,e[1]=(y*u*s-d*g*s-y*n*p+i*g*p+d*n*f-i*u*f)*S,e[2]=(o*g*s-y*l*s+y*n*c-i*g*c-o*n*f+i*l*f)*S,e[3]=(d*l*s-o*u*s-d*n*c+i*u*c+o*n*p-i*l*p)*S,e[4]=x*S,e[5]=(h*g*s-m*u*s+m*n*p-t*g*p-h*n*f+t*u*f)*S,e[6]=(m*l*s-a*g*s-m*n*c+t*g*c+a*n*f-t*l*f)*S,e[7]=(a*u*s-h*l*s+h*n*c-t*u*c-a*n*p+t*l*p)*S,e[8]=_*S,e[9]=(m*d*s-h*y*s-m*i*p+t*y*p+h*i*f-t*d*f)*S,e[10]=(a*y*s-m*o*s+m*i*c-t*y*c-a*i*f+t*o*f)*S,e[11]=(h*o*s-a*d*s-h*i*c+t*d*c+a*i*p-t*o*p)*S,e[12]=R*S,e[13]=(h*y*n-m*d*n+m*i*u-t*y*u-h*i*g+t*d*g)*S,e[14]=(m*o*n-a*y*n-m*i*l+t*y*l+a*i*g-t*o*g)*S,e[15]=(a*d*n-h*o*n+h*i*l-t*d*l-a*i*u+t*o*u)*S,this}scale(e){let t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),n=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,a){return this.set(1,i,s,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){let n=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,d=o+o,u=s*c,p=s*h,m=s*d,y=a*h,g=a*d,f=o*d,v=l*c,x=l*h,_=l*d,R=i.x,E=i.y,S=i.z;return n[0]=(1-(y+f))*R,n[1]=(p+_)*R,n[2]=(m-x)*R,n[3]=0,n[4]=(p-_)*E,n[5]=(1-(u+f))*E,n[6]=(g+v)*E,n[7]=0,n[8]=(m+x)*S,n[9]=(g-v)*S,n[10]=(1-(u+y))*S,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){let n=this.elements,s=Kn.set(n[0],n[1],n[2]).length(),a=Kn.set(n[4],n[5],n[6]).length(),o=Kn.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),e.x=n[12],e.y=n[13],e.z=n[14],li.copy(this);let l=1/s,c=1/a,h=1/o;return li.elements[0]*=l,li.elements[1]*=l,li.elements[2]*=l,li.elements[4]*=c,li.elements[5]*=c,li.elements[6]*=c,li.elements[8]*=h,li.elements[9]*=h,li.elements[10]*=h,t.setFromRotationMatrix(li),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,n,s,a,o=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(i-n),d=(t+e)/(t-e),u=(i+n)/(i-n),p,m;if(o===Mr)p=-(a+s)/(a-s),m=-2*a*s/(a-s);else{if(o!==Ea)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);p=-a/(a-s),m=-a*s/(a-s)}return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,n,s,a,o=2e3){let l=this.elements,c=1/(t-e),h=1/(i-n),d=1/(a-s),u=(t+e)*c,p=(i+n)*h,m,y;if(o===Mr)m=(a+s)*d,y=-2*d;else{if(o!==Ea)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);m=s*d,y=-1*d}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=y,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Kn=new w,li=new Le,ep=new w(0,0,0),tp=new w(1,1,1),Qi=new w,Ws=new w,Wt=new w,Ih=new Le,Dh=new _i,bi=class r{constructor(e=0,t=0,i=0,n=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let n=e.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],d=n[2],u=n[6],p=n[10];switch(t){case"XYZ":this._y=Math.asin(St(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-St(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(St(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-St(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(St(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-St(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ih.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ih,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Dh.setFromEuler(this),this.setFromQuaternion(Dh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};bi.DEFAULT_ORDER="XYZ";var as=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},ip=0,Uh=new w,Qn=new _i,Oi=new Le,js=new w,Xr=new w,np=new w,rp=new _i,Nh=new w(1,0,0),Oh=new w(0,1,0),zh=new w(0,0,1),sp={type:"added"},ap={type:"removed"},Oo={type:"childadded",child:null},zo={type:"childremoved",child:null},_t=class r extends ln{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=Vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new w,t=new bi,i=new _i,n=new w(1,1,1);t._onChange(function(){i.setFromEuler(t,!1)}),i._onChange(function(){t.setFromQuaternion(i,void 0,!1)}),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Le},normalMatrix:{value:new Ue}}),this.matrix=new Le,this.matrixWorld=new Le,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new as,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qn.setFromAxisAngle(e,t),this.quaternion.multiply(Qn),this}rotateOnWorldAxis(e,t){return Qn.setFromAxisAngle(e,t),this.quaternion.premultiply(Qn),this}rotateX(e){return this.rotateOnAxis(Nh,e)}rotateY(e){return this.rotateOnAxis(Oh,e)}rotateZ(e){return this.rotateOnAxis(zh,e)}translateOnAxis(e,t){return Uh.copy(e).applyQuaternion(this.quaternion),this.position.add(Uh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nh,e)}translateY(e){return this.translateOnAxis(Oh,e)}translateZ(e){return this.translateOnAxis(zh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Oi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?js.copy(e):js.set(e,t,i);let n=this.parent;this.updateWorldMatrix(!0,!1),Xr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Oi.lookAt(Xr,js,this.up):Oi.lookAt(js,Xr,this.up),this.quaternion.setFromRotationMatrix(Oi),n&&(Oi.extractRotation(n.matrixWorld),Qn.setFromRotationMatrix(Oi),this.quaternion.premultiply(Qn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(sp),Oo.child=e,this.dispatchEvent(Oo),Oo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ap),zo.child=e,this.dispatchEvent(zo),zo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Oi),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){let s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xr,e,np),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xr,rp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,n=t.length;i<n;i++){let s=t[i];s.matrixWorldAutoUpdate!==!0&&e!==!0||s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let n=this.children;for(let s=0,a=n.length;s<a;s++){let o=n[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let n={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxGeometryCount=this._maxGeometryCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];n.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let n=e.children[i];this.add(n.clone())}return this}};_t.DEFAULT_UP=new w(0,1,0),_t.DEFAULT_MATRIX_AUTO_UPDATE=!0,_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ci=new w,zi=new w,Fo=new w,Fi=new w,er=new w,tr=new w,Fh=new w,ko=new w,Bo=new w,Ho=new w,rn=class r{constructor(e=new w,t=new w,i=new w){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),ci.subVectors(e,t),n.cross(ci);let s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){ci.subVectors(n,t),zi.subVectors(i,t),Fo.subVectors(e,t);let a=ci.dot(ci),o=ci.dot(zi),l=ci.dot(Fo),c=zi.dot(zi),h=zi.dot(Fo),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;let u=1/d,p=(c*l-o*h)*u,m=(a*h-o*l)*u;return s.set(1-p-m,m,p)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Fi)!==null&&Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,i,n,s,a,o,l){return this.getBarycoord(e,t,i,n,Fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Fi.x),l.addScaledVector(a,Fi.y),l.addScaledVector(o,Fi.z),l)}static isFrontFacing(e,t,i,n){return ci.subVectors(i,t),zi.subVectors(e,t),ci.cross(zi).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ci.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),.5*ci.cross(zi).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,s){return r.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,n=this.b,s=this.c,a,o;er.subVectors(n,i),tr.subVectors(s,i),ko.subVectors(e,i);let l=er.dot(ko),c=tr.dot(ko);if(l<=0&&c<=0)return t.copy(i);Bo.subVectors(e,n);let h=er.dot(Bo),d=tr.dot(Bo);if(h>=0&&d<=h)return t.copy(n);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(er,a);Ho.subVectors(e,s);let p=er.dot(Ho),m=tr.dot(Ho);if(m>=0&&p<=m)return t.copy(s);let y=p*c-l*m;if(y<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(tr,o);let g=h*m-p*d;if(g<=0&&d-h>=0&&p-m>=0)return Fh.subVectors(s,n),o=(d-h)/(d-h+(p-m)),t.copy(n).addScaledVector(Fh,o);let f=1/(g+y+u);return a=y*f,o=u*f,t.copy(i).addScaledVector(er,a).addScaledVector(tr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Yu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},en={h:0,s:0,l:0},Xs={h:0,s:0,l:0};function Go(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}var Pe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Ye.toWorkingColorSpace(this,t),this}setRGB(e,t,i,n=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ye.toWorkingColorSpace(this,n),this}setHSL(e,t,i,n=Ye.workingColorSpace){if(e=qd(e,1),t=St(t,0,1),i=St(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Go(a,s,e+1/3),this.g=Go(a,s,e),this.b=Go(a,s,e-1/3)}return Ye.toWorkingColorSpace(this,n),this}setStyle(e,t=kt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){let i=Yu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vr(e.r),this.g=vr(e.g),this.b=vr(e.b),this}copyLinearToSRGB(e){return this.r=Ro(e.r),this.g=Ro(e.g),this.b=Ro(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return Ye.fromWorkingColorSpace(Ct.copy(this),e),65536*Math.round(St(255*Ct.r,0,255))+256*Math.round(St(255*Ct.g,0,255))+Math.round(St(255*Ct.b,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.fromWorkingColorSpace(Ct.copy(this),t);let i=Ct.r,n=Ct.g,s=Ct.b,a=Math.max(i,n,s),o=Math.min(i,n,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(n-s)/d+(n<s?6:0);break;case n:l=(s-i)/d+2;break;case s:l=(i-n)/d+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.fromWorkingColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=kt){Ye.fromWorkingColorSpace(Ct.copy(this),e);let t=Ct.r,i=Ct.g,n=Ct.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*i)},${Math.round(255*n)})`}offsetHSL(e,t,i){return this.getHSL(en),this.setHSL(en.h+e,en.s+t,en.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(en),e.getHSL(Xs);let i=To(en.h,Xs.h,t),n=To(en.s,Xs.s,t),s=To(en.l,Xs.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ct=new Pe;Pe.NAMES=Yu;var op=0,Mi=class extends ln{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:op++}),this.uuid=Vi(),this.name="",this.type="Material",this.blending=1,this.side=on,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=al,this.blendDst=ol,this.blendEquation=Ln,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$n,this.stencilZFail=$n,this.stencilZPass=$n,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let n=this[t];n!==void 0?n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function n(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==on&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==al&&(i.blendSrc=this.blendSrc),this.blendDst!==ol&&(i.blendDst=this.blendDst),this.blendEquation!==Ln&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$n&&(i.stencilFail=this.stencilFail),this.stencilZFail!==$n&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==$n&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData),t){let s=n(e.textures),a=n(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Sr=class extends Mi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=Ou,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Df=lp();function lp(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),i=new Uint32Array(512),n=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[256|l]=32768,n[l]=24,n[256|l]=24):c<-14?(i[l]=1024>>-c-14,i[256|l]=1024>>-c-14|32768,n[l]=-c-1,n[256|l]=-c-1):c<=15?(i[l]=c+15<<10,i[256|l]=c+15<<10|32768,n[l]=13,n[256|l]=13):c<128?(i[l]=31744,i[256|l]=64512,n[l]=24,n[256|l]=24):(i[l]=31744,i[256|l]=64512,n[l]=13,n[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(8388608&c)==0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:n,mantissaTable:s,exponentTable:a,offsetTable:o}}var ut=new w,$s=new ne,wt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=dl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return qu("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)$s.fromBufferAttribute(this,t),$s.applyMatrix3(e),this.setXY(t,$s.x,$s.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix3(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix4(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.applyNormalMatrix(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.transformDirection(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qe(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),i=qe(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),i=qe(i,this.array),n=qe(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),i=qe(i,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==dl&&(e.usage=this.usage),e}};var Ra=class extends wt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Ca=class extends wt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Se=class extends wt{constructor(e,t,i){super(new Float32Array(e),t,i)}},cp=0,Yt=new Le,Vo=new _t,ir=new w,jt=new Ht,$r=new Ht,vt=new w,Ze=class r extends ln{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=Vi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($u(e)?Ca:Ra)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Ue().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,i){return Yt.makeTranslation(e,t,i),this.applyMatrix4(Yt),this}scale(e,t,i){return Yt.makeScale(e,t,i),this.applyMatrix4(Yt),this}lookAt(e){return Vo.lookAt(e),Vo.updateMatrix(),this.applyMatrix4(Vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ir).negate(),this.translate(ir.x,ir.y,ir.z),this}setFromPoints(e){let t=[];for(let i=0,n=e.length;i<n;i++){let s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Se(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ht);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){let s=t[i];jt.setFromBufferAttribute(s),this.morphTargetsRelative?(vt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(vt),vt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(vt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new w,1/0);if(e){let i=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];$r.setFromBufferAttribute(o),this.morphTargetsRelative?(vt.addVectors(jt.min,$r.min),jt.expandByPoint(vt),vt.addVectors(jt.max,$r.max),jt.expandByPoint(vt)):(jt.expandByPoint($r.min),jt.expandByPoint($r.max))}jt.getCenter(i);let n=0;for(let s=0,a=e.count;s<a;s++)vt.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(vt));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)vt.fromBufferAttribute(o,c),l&&(ir.fromBufferAttribute(e,c),vt.add(ir)),n=Math.max(n,i.distanceToSquared(vt))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let i=t.position,n=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wt(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let T=0;T<i.count;T++)o[T]=new w,l[T]=new w;let c=new w,h=new w,d=new w,u=new ne,p=new ne,m=new ne,y=new w,g=new w;function f(T,I,U){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,I),d.fromBufferAttribute(i,U),u.fromBufferAttribute(s,T),p.fromBufferAttribute(s,I),m.fromBufferAttribute(s,U),h.sub(c),d.sub(c),p.sub(u),m.sub(u);let j=1/(p.x*m.y-m.x*p.y);isFinite(j)&&(y.copy(h).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(j),g.copy(d).multiplyScalar(p.x).addScaledVector(h,-m.x).multiplyScalar(j),o[T].add(y),o[I].add(y),o[U].add(y),l[T].add(g),l[I].add(g),l[U].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let T=0,I=v.length;T<I;++T){let U=v[T],j=U.start;for(let P=j,H=j+U.count;P<H;P+=3)f(e.getX(P+0),e.getX(P+1),e.getX(P+2))}let x=new w,_=new w,R=new w,E=new w;function S(T){R.fromBufferAttribute(n,T),E.copy(R);let I=o[T];x.copy(I),x.sub(R.multiplyScalar(R.dot(I))).normalize(),_.crossVectors(E,I);let U=_.dot(l[T])<0?-1:1;a.setXYZW(T,x.x,x.y,x.z,U)}for(let T=0,I=v.length;T<I;++T){let U=v[T],j=U.start;for(let P=j,H=j+U.count;P<H;P+=3)S(e.getX(P+0)),S(e.getX(P+1)),S(e.getX(P+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wt(new Float32Array(3*t.count),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);let n=new w,s=new w,a=new w,o=new w,l=new w,c=new w,h=new w,d=new w;if(e)for(let u=0,p=e.count;u<p;u+=3){let m=e.getX(u+0),y=e.getX(u+1),g=e.getX(u+2);n.fromBufferAttribute(t,m),s.fromBufferAttribute(t,y),a.fromBufferAttribute(t,g),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)n.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)vt.fromBufferAttribute(e,t),vt.normalize(),e.setXYZ(t,vt.x,vt.y,vt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),p=0,m=0;for(let y=0,g=l.length;y<g;y++){p=o.isInterleavedBufferAttribute?l[y]*o.data.stride+o.offset:l[y]*h;for(let f=0;f<h;f++)u[m++]=c[p++]}return new wt(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,i=this.index.array,n=this.attributes;for(let o in n){let l=e(n[o],i);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){let u=e(c[h],i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let n={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(n[l]=h,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let n=e.attributes;for(let c in n){let h=n[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],d=s[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},kh=new Le,En=new On,qs=new di,Bh=new w,nr=new w,rr=new w,sr=new w,Wo=new w,Ys=new w,Zs=new ne,Js=new ne,Ks=new ne,Hh=new w,Gh=new w,Vh=new w,Qs=new w,ea=new w,xt=class extends _t{constructor(e=new Ze,t=new Sr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}getVertexPosition(e,t){let i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);let o=this.morphTargetInfluences;if(s&&o){Ys.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],d=s[l];h!==0&&(Wo.fromBufferAttribute(d,e),a?Ys.addScaledVector(Wo,h):Ys.addScaledVector(Wo.sub(t),h))}t.add(Ys)}return t}raycast(e,t){let i=this.geometry,n=this.material,s=this.matrixWorld;if(n!==void 0){if(i.boundingSphere===null&&i.computeBoundingSphere(),qs.copy(i.boundingSphere),qs.applyMatrix4(s),En.copy(e.ray).recast(e.near),qs.containsPoint(En.origin)===!1&&(En.intersectSphere(qs,Bh)===null||En.origin.distanceToSquared(Bh)>(e.far-e.near)**2))return;kh.copy(s).invert(),En.copy(e.ray).applyMatrix4(kh),i.boundingBox!==null&&En.intersectsBox(i.boundingBox)===!1||this._computeIntersections(e,t,En)}}_computeIntersections(e,t,i){let n,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,y=u.length;m<y;m++){let g=u[m],f=a[g.materialIndex];for(let v=Math.max(g.start,p.start),x=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));v<x;v+=3)n=ta(this,f,e,i,c,h,d,o.getX(v),o.getX(v+1),o.getX(v+2)),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=g.materialIndex,t.push(n))}else for(let m=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);m<y;m+=3)n=ta(this,a,e,i,c,h,d,o.getX(m),o.getX(m+1),o.getX(m+2)),n&&(n.faceIndex=Math.floor(m/3),t.push(n));else if(l!==void 0)if(Array.isArray(a))for(let m=0,y=u.length;m<y;m++){let g=u[m],f=a[g.materialIndex];for(let v=Math.max(g.start,p.start),x=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));v<x;v+=3)n=ta(this,f,e,i,c,h,d,v,v+1,v+2),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=g.materialIndex,t.push(n))}else for(let m=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);m<y;m+=3)n=ta(this,a,e,i,c,h,d,m,m+1,m+2),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}};function ta(r,e,t,i,n,s,a,o,l,c){r.getVertexPosition(o,nr),r.getVertexPosition(l,rr),r.getVertexPosition(c,sr);let h=function(d,u,p,m,y,g,f,v){let x;if(x=u.side===Bt?m.intersectTriangle(f,g,y,!0,v):m.intersectTriangle(y,g,f,u.side===on,v),x===null)return null;ea.copy(v),ea.applyMatrix4(d.matrixWorld);let _=p.ray.origin.distanceTo(ea);return _<p.near||_>p.far?null:{distance:_,point:ea.clone(),object:d}}(r,e,t,i,nr,rr,sr,Qs);if(h){n&&(Zs.fromBufferAttribute(n,o),Js.fromBufferAttribute(n,l),Ks.fromBufferAttribute(n,c),h.uv=rn.getInterpolation(Qs,nr,rr,sr,Zs,Js,Ks,new ne)),s&&(Zs.fromBufferAttribute(s,o),Js.fromBufferAttribute(s,l),Ks.fromBufferAttribute(s,c),h.uv1=rn.getInterpolation(Qs,nr,rr,sr,Zs,Js,Ks,new ne)),a&&(Hh.fromBufferAttribute(a,o),Gh.fromBufferAttribute(a,l),Vh.fromBufferAttribute(a,c),h.normal=rn.getInterpolation(Qs,nr,rr,sr,Hh,Gh,Vh,new w),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new w,materialIndex:0};rn.getNormal(nr,rr,sr,d.normal),h.face=d}return h}var ji=class r extends Ze{constructor(e=1,t=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};let o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,p=0;function m(y,g,f,v,x,_,R,E,S,T,I){let U=_/S,j=R/T,P=_/2,H=R/2,J=E/2,se=S+1,de=T+1,K=0,X=0,Q=new w;for(let he=0;he<de;he++){let q=he*j-H;for(let te=0;te<se;te++){let _e=te*U-P;Q[y]=_e*v,Q[g]=q*x,Q[f]=J,c.push(Q.x,Q.y,Q.z),Q[y]=0,Q[g]=0,Q[f]=E>0?1:-1,h.push(Q.x,Q.y,Q.z),d.push(te/S),d.push(1-he/T),K+=1}}for(let he=0;he<T;he++)for(let q=0;q<S;q++){let te=u+q+se*he,_e=u+q+se*(he+1),le=u+(q+1)+se*(he+1),C=u+(q+1)+se*he;l.push(te,_e,C),l.push(_e,le,C),X+=6}o.addGroup(p,X,I),p+=X,u+=K}m("z","y","x",-1,-1,i,t,e,a,s,0),m("z","y","x",1,-1,i,t,-e,a,s,1),m("x","z","y",1,1,e,i,t,n,a,2),m("x","z","y",1,-1,e,i,-t,n,a,3),m("x","y","z",1,-1,e,t,i,n,s,4),m("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(h,3)),this.setAttribute("uv",new Se(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function wr(r){let e={};for(let t in r){e[t]={};for(let i in r[t]){let n=r[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function It(r){let e={};for(let t=0;t<r.length;t++){let i=wr(r[t]);for(let n in i)e[n]=i[n]}return e}function Zu(r){return r.getRenderTarget()===null?r.outputColorSpace:Ye.workingColorSpace}var hp={clone:wr,merge:It},Si=class extends Mi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=wr(e.uniforms),this.uniformsGroups=function(t){let i=[];for(let n=0;n<t.length;n++)i.push(t[n].clone());return i}(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let s=this.uniforms[n].value;s&&s.isTexture?t.uniforms[n]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[n]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[n]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[n]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[n]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[n]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[n]={type:"m4",value:s.toArray()}:t.uniforms[n]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},os=class extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Le,this.projectionMatrix=new Le,this.projectionMatrixInverse=new Le,this.coordinateSystem=Mr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},tn=new w,Wh=new ne,jh=new ne,Dt=class extends os{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*pl*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*xa*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*pl*Math.atan(Math.tan(.5*xa*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){tn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(tn.x,tn.y).multiplyScalar(-e/tn.z),tn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(tn.x,tn.y).multiplyScalar(-e/tn.z)}getViewSize(e,t){return this.getViewBounds(e,Wh,jh),t.subVectors(jh,Wh)}setViewOffset(e,t,i,n,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*xa*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ar=-90,vl=class extends _t{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new Dt(ar,1,e,t);n.layers=this.layers,this.add(n);let s=new Dt(ar,1,e,t);s.layers=this.layers,this.add(s);let a=new Dt(ar,1,e,t);a.layers=this.layers,this.add(a);let o=new Dt(ar,1,e,t);o.layers=this.layers,this.add(o);let l=new Dt(ar,1,e,t);l.layers=this.layers,this.add(l);let c=new Dt(ar,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,n,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===Mr)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==Ea)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,s),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,l),e.setRenderTarget(i,4,n),e.render(t,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,n),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},La=class extends Ut{constructor(e,t,i,n,s,a,o,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:xr,i,n,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},yl=class extends Wi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new La(n,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ft}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new ji(5,5,5),s=new Si({name:"CubemapFromEquirect",uniforms:wr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bt,blending:0});s.uniforms.tEquirect.value=t;let a=new xt(n,s),o=t.minFilter;return t.minFilter===fr&&(t.minFilter=Ft),new vl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,n){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(s)}},jo=new w,up=new w,dp=new Ue,Zt=class{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let n=jo.subVectors(i,t).cross(up.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(jo),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||dp.getNormalMatrix(e),n=this.coplanarPoint(jo).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Tn=new di,ia=new w,Er=class{constructor(e=new Zt,t=new Zt,i=new Zt,n=new Zt,s=new Zt,a=new Zt){this.planes=[e,t,i,n,s,a]}set(e,t,i,n,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3){let i=this.planes,n=e.elements,s=n[0],a=n[1],o=n[2],l=n[3],c=n[4],h=n[5],d=n[6],u=n[7],p=n[8],m=n[9],y=n[10],g=n[11],f=n[12],v=n[13],x=n[14],_=n[15];if(i[0].setComponents(l-s,u-c,g-p,_-f).normalize(),i[1].setComponents(l+s,u+c,g+p,_+f).normalize(),i[2].setComponents(l+a,u+h,g+m,_+v).normalize(),i[3].setComponents(l-a,u-h,g-m,_-v).normalize(),i[4].setComponents(l-o,u-d,g-y,_-x).normalize(),t===Mr)i[5].setComponents(l+o,u+d,g+y,_+x).normalize();else{if(t!==Ea)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);i[5].setComponents(o,d,y,x).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Tn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Tn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Tn)}intersectsSprite(e){return Tn.center.set(0,0,0),Tn.radius=.7071067811865476,Tn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Tn)}intersectsSphere(e){let t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let n=t[i];if(ia.x=n.normal.x>0?e.max.x:e.min.x,ia.y=n.normal.y>0?e.max.y:e.min.y,ia.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(ia)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Ju(){let r=null,e=!1,t=null,i=null;function n(s,a){t(s,a),i=r.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(n),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function pp(r,e){let t=e.isWebGL2,i=new WeakMap;return{get:function(n){return n.isInterleavedBufferAttribute&&(n=n.data),i.get(n)},remove:function(n){n.isInterleavedBufferAttribute&&(n=n.data);let s=i.get(n);s&&(r.deleteBuffer(s.buffer),i.delete(n))},update:function(n,s){if(n.isGLBufferAttribute){let o=i.get(n);return void((!o||o.version<n.version)&&i.set(n,{buffer:n.buffer,type:n.type,bytesPerElement:n.elementSize,version:n.version}))}n.isInterleavedBufferAttribute&&(n=n.data);let a=i.get(n);if(a===void 0)i.set(n,function(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=r.createBuffer(),p;if(r.bindBuffer(l,u),r.bufferData(l,c,h),o.onUploadCallback(),c instanceof Float32Array)p=r.FLOAT;else if(c instanceof Uint16Array)if(o.isFloat16BufferAttribute){if(!t)throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");p=r.HALF_FLOAT}else p=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=r.SHORT;else if(c instanceof Uint32Array)p=r.UNSIGNED_INT;else if(c instanceof Int32Array)p=r.INT;else if(c instanceof Int8Array)p=r.BYTE;else if(c instanceof Uint8Array)p=r.UNSIGNED_BYTE;else{if(!(c instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);p=r.UNSIGNED_BYTE}return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}(n,s));else if(a.version<n.version){if(a.size!==n.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(o,l,c){let h=l.array,d=l._updateRange,u=l.updateRanges;if(r.bindBuffer(c,o),d.count===-1&&u.length===0&&r.bufferSubData(c,0,h),u.length!==0){for(let p=0,m=u.length;p<m;p++){let y=u[p];t?r.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count):r.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h.subarray(y.start,y.start+y.count))}l.clearUpdateRanges()}d.count!==-1&&(t?r.bufferSubData(c,d.offset*h.BYTES_PER_ELEMENT,h,d.offset,d.count):r.bufferSubData(c,d.offset*h.BYTES_PER_ELEMENT,h.subarray(d.offset,d.offset+d.count)),d.count=-1),l.onUploadCallback()})(a.buffer,n,s),a.version=n.version}}}}var cn=class r extends Ze{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};let s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,d=e/o,u=t/l,p=[],m=[],y=[],g=[];for(let f=0;f<h;f++){let v=f*u-a;for(let x=0;x<c;x++){let _=x*d-s;m.push(_,-v,0),y.push(0,0,1),g.push(x/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let v=0;v<o;v++){let x=v+c*f,_=v+c*(f+1),R=v+1+c*(f+1),E=v+1+c*f;p.push(x,_,E),p.push(_,R,E)}this.setIndex(p),this.setAttribute("position",new Se(m,3)),this.setAttribute("normal",new Se(y,3)),this.setAttribute("uv",new Se(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Ce={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
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
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
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
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
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
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
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
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
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
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
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
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,common:`#define PI 3.141592653589793
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
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
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
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
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
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,envmap_fragment:`#ifdef USE_ENVMAP
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
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
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
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
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
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
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
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
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
}`,lightmap_fragment:`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
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
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
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
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
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
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
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
}`,lights_fragment_begin:`
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
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
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
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
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
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
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
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
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
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
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
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
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
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
		return shadow;
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
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
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
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
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
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
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
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
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
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
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
vec3 OptimizedCineonToneMapping( vec3 color ) {
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
	float startCompression = 0.8 - 0.04;
	float desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min(color.r, min(color.g, color.b));
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max(color.r, max(color.g, color.b));
	if (peak < startCompression) return color;
	float d = 1. - startCompression;
	float newPeak = 1. - d * d / (peak + d - startCompression);
	color *= newPeak / peak;
	float g = 1. - 1. / (desaturation * (peak - newPeak) + 1.);
	return mix(color, vec3(1, 1, 1), g);
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
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
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
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
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
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
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
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
}`,depth_frag:`#if DEPTH_PACKING == 3200
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
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
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
}`,distanceRGBA_frag:`#define DISTANCE
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
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
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
}`,linedashed_frag:`uniform vec3 diffuse;
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
}`,meshbasic_vert:`#include <common>
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
}`,meshbasic_frag:`uniform vec3 diffuse;
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
}`,meshlambert_vert:`#define LAMBERT
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
}`,meshlambert_frag:`#define LAMBERT
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
}`,meshmatcap_vert:`#define MATCAP
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
}`,meshmatcap_frag:`#define MATCAP
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
}`,meshnormal_vert:`#define NORMAL
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
}`,meshnormal_frag:`#define NORMAL
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
}`,meshphong_vert:`#define PHONG
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
}`,meshphong_frag:`#define PHONG
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
}`,meshphysical_vert:`#define STANDARD
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
}`,meshphysical_frag:`#define STANDARD
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
}`,meshtoon_vert:`#define TOON
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
}`,meshtoon_frag:`#define TOON
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
}`,points_vert:`uniform float size;
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
}`,points_frag:`uniform vec3 diffuse;
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
}`,shadow_vert:`#include <common>
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
}`,shadow_frag:`uniform vec3 color;
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
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
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
}`,sprite_frag:`uniform vec3 diffuse;
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
}`},ue={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},vi={basic:{uniforms:It([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ce.meshbasic_vert,fragmentShader:Ce.meshbasic_frag},lambert:{uniforms:It([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ce.meshlambert_vert,fragmentShader:Ce.meshlambert_frag},phong:{uniforms:It([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Ce.meshphong_vert,fragmentShader:Ce.meshphong_frag},standard:{uniforms:It([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag},toon:{uniforms:It([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ce.meshtoon_vert,fragmentShader:Ce.meshtoon_frag},matcap:{uniforms:It([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ce.meshmatcap_vert,fragmentShader:Ce.meshmatcap_frag},points:{uniforms:It([ue.points,ue.fog]),vertexShader:Ce.points_vert,fragmentShader:Ce.points_frag},dashed:{uniforms:It([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ce.linedashed_vert,fragmentShader:Ce.linedashed_frag},depth:{uniforms:It([ue.common,ue.displacementmap]),vertexShader:Ce.depth_vert,fragmentShader:Ce.depth_frag},normal:{uniforms:It([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ce.meshnormal_vert,fragmentShader:Ce.meshnormal_frag},sprite:{uniforms:It([ue.sprite,ue.fog]),vertexShader:Ce.sprite_vert,fragmentShader:Ce.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ce.background_vert,fragmentShader:Ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Ce.backgroundCube_vert,fragmentShader:Ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ce.cube_vert,fragmentShader:Ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ce.equirect_vert,fragmentShader:Ce.equirect_frag},distanceRGBA:{uniforms:It([ue.common,ue.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ce.distanceRGBA_vert,fragmentShader:Ce.distanceRGBA_frag},shadow:{uniforms:It([ue.lights,ue.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Ce.shadow_vert,fragmentShader:Ce.shadow_frag}};vi.physical={uniforms:It([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag};var na={r:0,b:0,g:0},An=new bi,mp=new Le;function fp(r,e,t,i,n,s,a){let o=new Pe(0),l,c,h=s===!0?0:1,d=null,u=0,p=null;function m(y,g){y.getRGB(na,Zu(r)),i.buffers.color.setClear(na.r,na.g,na.b,g,a)}return{getClearColor:function(){return o},setClearColor:function(y,g=1){o.set(y),h=g,m(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(y){h=y,m(o,h)},render:function(y,g){let f=!1,v=g.isScene===!0?g.background:null;v&&v.isTexture&&(v=(g.backgroundBlurriness>0?t:e).get(v)),v===null?m(o,h):v&&v.isColor&&(m(v,1),f=!0);let x=r.xr.getEnvironmentBlendMode();x==="additive"?i.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||f)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),v&&(v.isCubeTexture||v.mapping===eo)?(c===void 0&&(c=new xt(new ji(1,1,1),new Si({name:"BackgroundCubeMaterial",uniforms:wr(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:Bt,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(_,R,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),An.copy(g.backgroundRotation),An.x*=-1,An.y*=-1,An.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(An.y*=-1,An.z*=-1),c.material.uniforms.envMap.value=v,c.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(mp.makeRotationFromEuler(An)),c.material.toneMapped=Ye.getTransfer(v.colorSpace)!==Ke,d===v&&u===v.version&&p===r.toneMapping||(c.material.needsUpdate=!0,d=v,u=v.version,p=r.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new xt(new cn(2,2),new Si({name:"BackgroundMaterial",uniforms:wr(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(v.colorSpace)!==Ke,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),d===v&&u===v.version&&p===r.toneMapping||(l.material.needsUpdate=!0,d=v,u=v.version,p=r.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}}}function gp(r,e,t,i){let n=r.getParameter(r.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},l=p(null),c=l,h=!1;function d(R){return i.isWebGL2?r.bindVertexArray(R):s.bindVertexArrayOES(R)}function u(R){return i.isWebGL2?r.deleteVertexArray(R):s.deleteVertexArrayOES(R)}function p(R){let E=[],S=[],T=[];for(let I=0;I<n;I++)E[I]=0,S[I]=0,T[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:S,attributeDivisors:T,object:R,attributes:{},index:null}}function m(){let R=c.newAttributes;for(let E=0,S=R.length;E<S;E++)R[E]=0}function y(R){g(R,0)}function g(R,E){let S=c.newAttributes,T=c.enabledAttributes,I=c.attributeDivisors;S[R]=1,T[R]===0&&(r.enableVertexAttribArray(R),T[R]=1),I[R]!==E&&((i.isWebGL2?r:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,E),I[R]=E)}function f(){let R=c.newAttributes,E=c.enabledAttributes;for(let S=0,T=E.length;S<T;S++)E[S]!==R[S]&&(r.disableVertexAttribArray(S),E[S]=0)}function v(R,E,S,T,I,U,j){j===!0?r.vertexAttribIPointer(R,E,S,I,U):r.vertexAttribPointer(R,E,S,T,I,U)}function x(){_(),h=!0,c!==l&&(c=l,d(c.object))}function _(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:function(R,E,S,T,I){let U=!1;if(a){let j=function(P,H,J){let se=J.wireframe===!0,de=o[P.id];de===void 0&&(de={},o[P.id]=de);let K=de[H.id];K===void 0&&(K={},de[H.id]=K);let X=K[se];return X===void 0&&(X=p(i.isWebGL2?r.createVertexArray():s.createVertexArrayOES()),K[se]=X),X}(T,S,E);c!==j&&(c=j,d(c.object)),U=function(P,H,J,se){let de=c.attributes,K=H.attributes,X=0,Q=J.getAttributes();for(let he in Q)if(Q[he].location>=0){let q=de[he],te=K[he];if(te===void 0&&(he==="instanceMatrix"&&P.instanceMatrix&&(te=P.instanceMatrix),he==="instanceColor"&&P.instanceColor&&(te=P.instanceColor)),q===void 0||q.attribute!==te||te&&q.data!==te.data)return!0;X++}return c.attributesNum!==X||c.index!==se}(R,T,S,I),U&&function(P,H,J,se){let de={},K=H.attributes,X=0,Q=J.getAttributes();for(let he in Q)if(Q[he].location>=0){let q=K[he];q===void 0&&(he==="instanceMatrix"&&P.instanceMatrix&&(q=P.instanceMatrix),he==="instanceColor"&&P.instanceColor&&(q=P.instanceColor));let te={};te.attribute=q,q&&q.data&&(te.data=q.data),de[he]=te,X++}c.attributes=de,c.attributesNum=X,c.index=se}(R,T,S,I)}else{let j=E.wireframe===!0;c.geometry===T.id&&c.program===S.id&&c.wireframe===j||(c.geometry=T.id,c.program=S.id,c.wireframe=j,U=!0)}I!==null&&t.update(I,r.ELEMENT_ARRAY_BUFFER),(U||h)&&(h=!1,function(j,P,H,J){if(i.isWebGL2===!1&&(j.isInstancedMesh||J.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;m();let se=J.attributes,de=H.getAttributes(),K=P.defaultAttributeValues;for(let X in de){let Q=de[X];if(Q.location>=0){let he=se[X];if(he===void 0&&(X==="instanceMatrix"&&j.instanceMatrix&&(he=j.instanceMatrix),X==="instanceColor"&&j.instanceColor&&(he=j.instanceColor)),he!==void 0){let q=he.normalized,te=he.itemSize,_e=t.get(he);if(_e===void 0)continue;let le=_e.buffer,C=_e.type,b=_e.bytesPerElement,F=i.isWebGL2===!0&&(C===r.INT||C===r.UNSIGNED_INT||he.gpuType===Fu);if(he.isInterleavedBufferAttribute){let O=he.data,L=O.stride,D=he.offset;if(O.isInstancedInterleavedBuffer){for(let k=0;k<Q.locationSize;k++)g(Q.location+k,O.meshPerAttribute);j.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let k=0;k<Q.locationSize;k++)y(Q.location+k);r.bindBuffer(r.ARRAY_BUFFER,le);for(let k=0;k<Q.locationSize;k++)v(Q.location+k,te/Q.locationSize,C,q,L*b,(D+te/Q.locationSize*k)*b,F)}else{if(he.isInstancedBufferAttribute){for(let O=0;O<Q.locationSize;O++)g(Q.location+O,he.meshPerAttribute);j.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let O=0;O<Q.locationSize;O++)y(Q.location+O);r.bindBuffer(r.ARRAY_BUFFER,le);for(let O=0;O<Q.locationSize;O++)v(Q.location+O,te/Q.locationSize,C,q,te*b,te/Q.locationSize*O*b,F)}}else if(K!==void 0){let q=K[X];if(q!==void 0)switch(q.length){case 2:r.vertexAttrib2fv(Q.location,q);break;case 3:r.vertexAttrib3fv(Q.location,q);break;case 4:r.vertexAttrib4fv(Q.location,q);break;default:r.vertexAttrib1fv(Q.location,q)}}}}f()}(R,E,S,T),I!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))},reset:x,resetDefaultState:_,dispose:function(){x();for(let R in o){let E=o[R];for(let S in E){let T=E[S];for(let I in T)u(T[I].object),delete T[I];delete E[S]}delete o[R]}},releaseStatesOfGeometry:function(R){if(o[R.id]===void 0)return;let E=o[R.id];for(let S in E){let T=E[S];for(let I in T)u(T[I].object),delete T[I];delete E[S]}delete o[R.id]},releaseStatesOfProgram:function(R){for(let E in o){let S=o[E];if(S[R.id]===void 0)continue;let T=S[R.id];for(let I in T)u(T[I].object),delete T[I];delete S[R.id]}},initAttributes:m,enableAttribute:y,disableUnusedAttributes:f}}function vp(r,e,t,i){let n=i.isWebGL2,s;this.setMode=function(a){s=a},this.render=function(a,o){r.drawArrays(s,a,o),t.update(o,s,1)},this.renderInstances=function(a,o,l){if(l===0)return;let c,h;if(n)c=r,h="drawArraysInstanced";else if(c=e.get("ANGLE_instanced_arrays"),h="drawArraysInstancedANGLE",c===null)return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");c[h](s,a,o,l),t.update(o,s,l)},this.renderMultiDraw=function(a,o,l){if(l===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<l;h++)this.render(a[h],o[h]);else{c.multiDrawArraysWEBGL(s,a,0,o,0,l);let h=0;for(let d=0;d<l;d++)h+=o[d];t.update(h,s,1)}}}function yp(r,e,t){let i;function n(_){if(_==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let s=typeof WebGL2RenderingContext<"u"&&r.constructor.name==="WebGL2RenderingContext",a=t.precision!==void 0?t.precision:"highp",o=n(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=s||e.has("WEBGL_draw_buffers"),c=t.logarithmicDepthBuffer===!0,h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),d=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),u=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),g=r.getParameter(r.MAX_VARYING_VECTORS),f=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),v=d>0,x=s||e.has("OES_texture_float");return{isWebGL2:s,drawBuffers:l,getMaxAnisotropy:function(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let _=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i},getMaxPrecision:n,precision:a,logarithmicDepthBuffer:c,maxTextures:h,maxVertexTextures:d,maxTextureSize:u,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:y,maxVaryings:g,maxFragmentUniforms:f,vertexTextures:v,floatFragmentTextures:x,floatVertexTextures:v&&x,maxSamples:s?r.getParameter(r.MAX_SAMPLES):0}}function xp(r){let e=this,t=null,i=0,n=!1,s=!1,a=new Zt,o=new Ue,l={value:null,needsUpdate:!1};function c(h,d,u,p){let m=h!==null?h.length:0,y=null;if(m!==0){if(y=l.value,p!==!0||y===null){let g=u+4*m,f=d.matrixWorldInverse;o.getNormalMatrix(f),(y===null||y.length<g)&&(y=new Float32Array(g));for(let v=0,x=u;v!==m;++v,x+=4)a.copy(h[v]).applyMatrix4(f,o),a.normal.toArray(y,x),y[x+3]=a.constant}l.value=y,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,y}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let u=h.length!==0||d||i!==0||n;return n=d,i=h.length,u},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=c(h,d,0)},this.setState=function(h,d,u){let p=h.clippingPlanes,m=h.clipIntersection,y=h.clipShadows,g=r.get(h);if(!n||p===null||p.length===0||s&&!y)s?c(null):function(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}();else{let f=s?0:i,v=4*f,x=g.clippingState||null;l.value=x,x=c(p,d,v,u);for(let _=0;_!==v;++_)x[_]=t[_];g.clippingState=x,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=f}}}function _p(r){let e=new WeakMap;function t(n,s){return s===ll?n.mapping=xr:s===cl&&(n.mapping=_r),n}function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping;if(s===ll||s===cl){if(e.has(n))return t(e.get(n).texture,n.mapping);{let a=n.image;if(a&&a.height>0){let o=new yl(a.height);return o.fromEquirectangularTexture(r,n),e.set(n,o),n.addEventListener("dispose",i),t(o.texture,n.mapping)}return null}}}return n},dispose:function(){e=new WeakMap}}}var Tr=class extends os{constructor(e=-1,t=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,s=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Xh=[.125,.215,.35,.446,.526,.582],qr=20,Xo=new Tr,$h=new Pe,$o=null,qo=0,Yo=0,Cn=(1+Math.sqrt(5))/2,or=1/Cn,qh=[new w(1,1,1),new w(-1,1,1),new w(1,1,-1),new w(-1,1,-1),new w(0,Cn,or),new w(0,Cn,-or),new w(or,0,Cn),new w(-or,0,Cn),new w(Cn,or,0),new w(-Cn,or,0)],Pa=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100){$o=this._renderer.getRenderTarget(),qo=this._renderer.getActiveCubeFace(),Yo=this._renderer.getActiveMipmapLevel(),this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,n,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget($o,qo,Yo),e.scissorTest=!1,ra(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===xr||e.mapping===_r?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$o=this._renderer.getRenderTarget(),qo=this._renderer.getActiveCubeFace(),Yo=this._renderer.getActiveMipmapLevel();let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Ft,minFilter:Ft,generateMipmaps:!1,type:rs,format:Gi,colorSpace:hn,depthBuffer:!1},n=Yh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Yh(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=function(a){let o=[],l=[],c=[],h=a,d=a-4+1+Xh.length;for(let u=0;u<d;u++){let p=Math.pow(2,h);l.push(p);let m=1/p;u>a-4?m=Xh[u-a+4-1]:u===0&&(m=0),c.push(m);let y=1/(p-2),g=-y,f=1+y,v=[g,g,f,g,f,f,g,g,f,f,g,f],x=6,_=6,R=3,E=2,S=1,T=new Float32Array(R*_*x),I=new Float32Array(E*_*x),U=new Float32Array(S*_*x);for(let P=0;P<x;P++){let H=P%3*2/3-1,J=P>2?0:-1,se=[H,J,0,H+2/3,J,0,H+2/3,J+1,0,H,J,0,H+2/3,J+1,0,H,J+1,0];T.set(se,R*_*P),I.set(v,E*_*P);let de=[P,P,P,P,P,P];U.set(de,S*_*P)}let j=new Ze;j.setAttribute("position",new wt(T,R)),j.setAttribute("uv",new wt(I,E)),j.setAttribute("faceIndex",new wt(U,S)),o.push(j),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}}(s)),this._blurMaterial=function(a,o,l){let c=new Float32Array(qr),h=new w(0,1,0);return new Si({name:"SphericalGaussianBlur",defines:{n:qr,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:mc(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}(s,e,t)}return n}_compileMaterial(e){let t=new xt(this._lodPlanes[0],e);this._renderer.compile(t,Xo)}_sceneToCubeUV(e,t,i,n){let s=new Dt(90,1,t,i),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor($h),l.toneMapping=sn,l.autoClear=!1;let d=new Sr({name:"PMREM.Background",side:Bt,depthWrite:!1,depthTest:!1}),u=new xt(new ji,d),p=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,p=!0):(d.color.copy($h),p=!0);for(let y=0;y<6;y++){let g=y%3;g===0?(s.up.set(0,a[y],0),s.lookAt(o[y],0,0)):g===1?(s.up.set(0,0,a[y]),s.lookAt(0,o[y],0)):(s.up.set(0,a[y],0),s.lookAt(0,0,o[y]));let f=this._cubeSize;ra(n,g*f,y>2?f:0,f,f),l.setRenderTarget(n),p&&l.render(u,s),l.render(e,s)}u.geometry.dispose(),u.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,n=e.mapping===xr||e.mapping===_r;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zh());let s=n?this._cubemapMaterial:this._equirectMaterial,a=new xt(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;ra(t,0,0,3*o,2*o),i.setRenderTarget(t),i.render(a,Xo)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let n=1;n<this._lodPlanes.length;n++){let s=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),a=qh[(n-1)%qh.length];this._blur(e,n-1,n,s,a)}t.autoClear=i}_blur(e,t,i,n,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",s),this._halfBlur(a,e,i,i,n,"longitudinal",s)}_halfBlur(e,t,i,n,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new xt(this._lodPlanes[n],c),d=c.uniforms,u=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*u):2*Math.PI/39,m=s/p,y=isFinite(s)?1+Math.floor(3*m):qr;y>qr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${y} samples when the maximum is set to 20`);let g=[],f=0;for(let _=0;_<qr;++_){let R=_/m,E=Math.exp(-R*R/2);g.push(E),_===0?f+=E:_<y&&(f+=2*E)}for(let _=0;_<g.length;_++)g[_]=g[_]/f;d.envMap.value=e.texture,d.samples.value=y,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:v}=this;d.dTheta.value=p,d.mipInt.value=v-i;let x=this._sizeLods[n];ra(t,3*x*(n>v-4?n-v+4:0),4*(this._cubeSize-x),3*x,2*x),l.setRenderTarget(t),l.render(h,Xo)}};function Yh(r,e,t){let i=new Wi(r,e,t);return i.texture.mapping=eo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ra(r,e,t,i,n){r.viewport.set(e,t,i,n),r.scissor.set(e,t,i,n)}function Zh(){return new Si({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Jh(){return new Si({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function mc(){return`

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
	`}function bp(r){let e=new WeakMap,t=null;function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping,a=s===ll||s===cl,o=s===xr||s===_r;if(a||o){if(n.isRenderTargetTexture&&n.needsPMREMUpdate===!0){n.needsPMREMUpdate=!1;let l=e.get(n);return t===null&&(t=new Pa(r)),l=a?t.fromEquirectangular(n,l):t.fromCubemap(n,l),e.set(n,l),l.texture}if(e.has(n))return e.get(n).texture;{let l=n.image;if(a&&l&&l.height>0||o&&l&&function(c){let h=0,d=6;for(let u=0;u<d;u++)c[u]!==void 0&&h++;return h===d}(l)){t===null&&(t=new Pa(r));let c=a?t.fromEquirectangular(n):t.fromCubemap(n);return e.set(n,c),n.addEventListener("dispose",i),c.texture}return null}}}return n},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function Mp(r){let e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){let n=t(i);return n===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function Sp(r,e,t,i){let n={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let d in c.attributes)e.remove(c.attributes[d]);for(let d in c.morphAttributes){let u=c.morphAttributes[d];for(let p=0,m=u.length;p<m;p++)e.remove(u[p])}c.removeEventListener("dispose",a),delete n[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),i.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,d=l.attributes.position,u=0;if(h!==null){let y=h.array;u=h.version;for(let g=0,f=y.length;g<f;g+=3){let v=y[g+0],x=y[g+1],_=y[g+2];c.push(v,x,x,_,_,v)}}else{if(d===void 0)return;{let y=d.array;u=d.version;for(let g=0,f=y.length/3-1;g<f;g+=3){let v=g+0,x=g+1,_=g+2;c.push(v,x,x,_,_,v)}}}let p=new($u(c)?Ca:Ra)(c,1);p.version=u;let m=s.get(l);m&&e.remove(m),s.set(l,p)}return{get:function(l,c){return n[c.id]===!0||(c.addEventListener("dispose",a),n[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let d in c)e.update(c[d],r.ARRAY_BUFFER);let h=l.morphAttributes;for(let d in h){let u=h[d];for(let p=0,m=u.length;p<m;p++)e.update(u[p],r.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function wp(r,e,t,i){let n=i.isWebGL2,s,a,o;this.setMode=function(l){s=l},this.setIndex=function(l){a=l.type,o=l.bytesPerElement},this.render=function(l,c){r.drawElements(s,c,a,l*o),t.update(c,s,1)},this.renderInstances=function(l,c,h){if(h===0)return;let d,u;if(n)d=r,u="drawElementsInstanced";else if(d=e.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",d===null)return void console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");d[u](s,c,a,l*o,h),t.update(c,s,h)},this.renderMultiDraw=function(l,c,h){if(h===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let u=0;u<h;u++)this.render(l[u]/o,c[u]);else{d.multiDrawElementsWEBGL(s,c,0,a,l,0,h);let u=0;for(let p=0;p<h;p++)u+=c[p];t.update(u,s,1)}}}function Ep(r){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,i,n){switch(e.calls++,i){case r.TRIANGLES:e.triangles+=n*(t/3);break;case r.LINES:e.lines+=n*(t/2);break;case r.LINE_STRIP:e.lines+=n*(t-1);break;case r.LINE_LOOP:e.lines+=n*t;break;case r.POINTS:e.points+=n*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",i)}}}}function Tp(r,e){return r[0]-e[0]}function Ap(r,e){return Math.abs(e[1])-Math.abs(r[1])}function Rp(r,e,t){let i={},n=new Float32Array(8),s=new WeakMap,a=new dt,o=[];for(let l=0;l<8;l++)o[l]=[l,0];return{update:function(l,c,h){let d=l.morphTargetInfluences;if(e.isWebGL2===!0){let u=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,p=u!==void 0?u.length:0,m=s.get(c);if(m===void 0||m.count!==p){let j=function(){I.dispose(),s.delete(c),c.removeEventListener("dispose",j)};m!==void 0&&m.texture.dispose();let y=c.morphAttributes.position!==void 0,g=c.morphAttributes.normal!==void 0,f=c.morphAttributes.color!==void 0,v=c.morphAttributes.position||[],x=c.morphAttributes.normal||[],_=c.morphAttributes.color||[],R=0;y===!0&&(R=1),g===!0&&(R=2),f===!0&&(R=3);let E=c.attributes.position.count*R,S=1;E>e.maxTextureSize&&(S=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);let T=new Float32Array(E*S*4*p),I=new Aa(T,E,S,p);I.type=yi,I.needsUpdate=!0;let U=4*R;for(let P=0;P<p;P++){let H=v[P],J=x[P],se=_[P],de=E*S*4*P;for(let K=0;K<H.count;K++){let X=K*U;y===!0&&(a.fromBufferAttribute(H,K),T[de+X+0]=a.x,T[de+X+1]=a.y,T[de+X+2]=a.z,T[de+X+3]=0),g===!0&&(a.fromBufferAttribute(J,K),T[de+X+4]=a.x,T[de+X+5]=a.y,T[de+X+6]=a.z,T[de+X+7]=0),f===!0&&(a.fromBufferAttribute(se,K),T[de+X+8]=a.x,T[de+X+9]=a.y,T[de+X+10]=a.z,T[de+X+11]=se.itemSize===4?a.w:1)}}m={count:p,texture:I,size:new ne(E,S)},s.set(c,m),c.addEventListener("dispose",j)}if(l.isInstancedMesh===!0&&l.morphTexture!==null)h.getUniforms().setValue(r,"morphTexture",l.morphTexture,t);else{let y=0;for(let f=0;f<d.length;f++)y+=d[f];let g=c.morphTargetsRelative?1:1-y;h.getUniforms().setValue(r,"morphTargetBaseInfluence",g),h.getUniforms().setValue(r,"morphTargetInfluences",d)}h.getUniforms().setValue(r,"morphTargetsTexture",m.texture,t),h.getUniforms().setValue(r,"morphTargetsTextureSize",m.size)}else{let u=d===void 0?0:d.length,p=i[c.id];if(p===void 0||p.length!==u){p=[];for(let v=0;v<u;v++)p[v]=[v,0];i[c.id]=p}for(let v=0;v<u;v++){let x=p[v];x[0]=v,x[1]=d[v]}p.sort(Ap);for(let v=0;v<8;v++)v<u&&p[v][1]?(o[v][0]=p[v][0],o[v][1]=p[v][1]):(o[v][0]=Number.MAX_SAFE_INTEGER,o[v][1]=0);o.sort(Tp);let m=c.morphAttributes.position,y=c.morphAttributes.normal,g=0;for(let v=0;v<8;v++){let x=o[v],_=x[0],R=x[1];_!==Number.MAX_SAFE_INTEGER&&R?(m&&c.getAttribute("morphTarget"+v)!==m[_]&&c.setAttribute("morphTarget"+v,m[_]),y&&c.getAttribute("morphNormal"+v)!==y[_]&&c.setAttribute("morphNormal"+v,y[_]),n[v]=R,g+=R):(m&&c.hasAttribute("morphTarget"+v)===!0&&c.deleteAttribute("morphTarget"+v),y&&c.hasAttribute("morphNormal"+v)===!0&&c.deleteAttribute("morphNormal"+v),n[v]=0)}let f=c.morphTargetsRelative?1:1-g;h.getUniforms().setValue(r,"morphTargetBaseInfluence",f),h.getUniforms().setValue(r,"morphTargetInfluences",n)}}}}function Cp(r,e,t,i){let n=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=i.render.frame,l=a.geometry,c=e.get(a,l);if(n.get(c)!==o&&(e.update(c),n.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),n.get(a)!==o&&(t.update(a.instanceMatrix,r.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,r.ARRAY_BUFFER),n.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;n.get(h)!==o&&(h.update(),n.set(h,o))}return c},dispose:function(){n=new WeakMap}}}var Ia=class extends Ut{constructor(e,t,i,n,s,a,o,l,c,h){if((h=h!==void 0?h:Nn)!==Nn&&h!==br)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Nn&&(i=nn),i===void 0&&h===br&&(i=Un),super(null,n,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:yt,this.minFilter=l!==void 0?l:yt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ku=new Ut,Qu=new Ia(1,1);Qu.compareFunction=515;var ed=new Aa,td=new gl,id=new La,Kh=[],Qh=[],eu=new Float32Array(16),tu=new Float32Array(9),iu=new Float32Array(4);function Dr(r,e,t){let i=r[0];if(i<=0||i>0)return r;let n=e*t,s=Kh[n];if(s===void 0&&(s=new Float32Array(n),Kh[n]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function ft(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function gt(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function io(r,e){let t=Qh[e];t===void 0&&(t=new Int32Array(e),Qh[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function Lp(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Pp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;r.uniform2fv(this.addr,e),gt(t,e)}}function Ip(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ft(t,e))return;r.uniform3fv(this.addr,e),gt(t,e)}}function Dp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;r.uniform4fv(this.addr,e),gt(t,e)}}function Up(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(ft(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),gt(t,e)}else{if(ft(t,i))return;iu.set(i),r.uniformMatrix2fv(this.addr,!1,iu),gt(t,i)}}function Np(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(ft(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),gt(t,e)}else{if(ft(t,i))return;tu.set(i),r.uniformMatrix3fv(this.addr,!1,tu),gt(t,i)}}function Op(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(ft(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),gt(t,e)}else{if(ft(t,i))return;eu.set(i),r.uniformMatrix4fv(this.addr,!1,eu),gt(t,i)}}function zp(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Fp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;r.uniform2iv(this.addr,e),gt(t,e)}}function kp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;r.uniform3iv(this.addr,e),gt(t,e)}}function Bp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;r.uniform4iv(this.addr,e),gt(t,e)}}function Hp(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Gp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;r.uniform2uiv(this.addr,e),gt(t,e)}}function Vp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;r.uniform3uiv(this.addr,e),gt(t,e)}}function Wp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;r.uniform4uiv(this.addr,e),gt(t,e)}}function jp(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s=this.type===r.SAMPLER_2D_SHADOW?Qu:Ku;t.setTexture2D(e||s,n)}function Xp(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||td,n)}function $p(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||id,n)}function qp(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||ed,n)}function Yp(r,e){r.uniform1fv(this.addr,e)}function Zp(r,e){let t=Dr(e,this.size,2);r.uniform2fv(this.addr,t)}function Jp(r,e){let t=Dr(e,this.size,3);r.uniform3fv(this.addr,t)}function Kp(r,e){let t=Dr(e,this.size,4);r.uniform4fv(this.addr,t)}function Qp(r,e){let t=Dr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function em(r,e){let t=Dr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function tm(r,e){let t=Dr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function im(r,e){r.uniform1iv(this.addr,e)}function nm(r,e){r.uniform2iv(this.addr,e)}function rm(r,e){r.uniform3iv(this.addr,e)}function sm(r,e){r.uniform4iv(this.addr,e)}function am(r,e){r.uniform1uiv(this.addr,e)}function om(r,e){r.uniform2uiv(this.addr,e)}function lm(r,e){r.uniform3uiv(this.addr,e)}function cm(r,e){r.uniform4uiv(this.addr,e)}function hm(r,e,t){let i=this.cache,n=e.length,s=io(t,n);ft(i,s)||(r.uniform1iv(this.addr,s),gt(i,s));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||Ku,s[a])}function um(r,e,t){let i=this.cache,n=e.length,s=io(t,n);ft(i,s)||(r.uniform1iv(this.addr,s),gt(i,s));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||td,s[a])}function dm(r,e,t){let i=this.cache,n=e.length,s=io(t,n);ft(i,s)||(r.uniform1iv(this.addr,s),gt(i,s));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||id,s[a])}function pm(r,e,t){let i=this.cache,n=e.length,s=io(t,n);ft(i,s)||(r.uniform1iv(this.addr,s),gt(i,s));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||ed,s[a])}var xl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=function(n){switch(n){case 5126:return Lp;case 35664:return Pp;case 35665:return Ip;case 35666:return Dp;case 35674:return Up;case 35675:return Np;case 35676:return Op;case 5124:case 35670:return zp;case 35667:case 35671:return Fp;case 35668:case 35672:return kp;case 35669:case 35673:return Bp;case 5125:return Hp;case 36294:return Gp;case 36295:return Vp;case 36296:return Wp;case 35678:case 36198:case 36298:case 36306:case 35682:return jp;case 35679:case 36299:case 36307:return Xp;case 35680:case 36300:case 36308:case 36293:return $p;case 36289:case 36303:case 36311:case 36292:return qp}}(t.type)}},_l=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=function(n){switch(n){case 5126:return Yp;case 35664:return Zp;case 35665:return Jp;case 35666:return Kp;case 35674:return Qp;case 35675:return em;case 35676:return tm;case 5124:case 35670:return im;case 35667:case 35671:return nm;case 35668:case 35672:return rm;case 35669:case 35673:return sm;case 5125:return am;case 36294:return om;case 36295:return lm;case 36296:return cm;case 35678:case 36198:case 36298:case 36306:case 35682:return hm;case 35679:case 36299:case 36307:return um;case 35680:case 36300:case 36308:case 36293:return dm;case 36289:case 36303:case 36311:case 36292:return pm}}(t.type)}},bl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let n=this.seq;for(let s=0,a=n.length;s!==a;++s){let o=n[s];o.setValue(e,t[o.id],i)}}},Zo=/(\w+)(\])?(\[|\.)?/g;function nu(r,e){r.seq.push(e),r.map[e.id]=e}function mm(r,e,t){let i=r.name,n=i.length;for(Zo.lastIndex=0;;){let s=Zo.exec(i),a=Zo.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===n){nu(t,c===void 0?new xl(o,r,e):new _l(o,r,e));break}{let h=t.map[o];h===void 0&&(h=new bl(o),nu(t,h)),t=h}}}var yr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n);mm(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,i,n){let s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){let n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){let i=[];for(let n=0,s=e.length;n!==s;++n){let a=e[n];a.id in t&&i.push(a)}return i}};function ru(r,e,t){let i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}var fm=37297,gm=0;function su(r,e,t){let i=r.getShaderParameter(e,r.COMPILE_STATUS),n=r.getShaderInfoLog(e).trim();if(i&&n==="")return"";let s=/ERROR: 0:(\d+)/.exec(n);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+n+`

`+function(o,l){let c=o.split(`
`),h=[],d=Math.max(l-6,0),u=Math.min(l+6,c.length);for(let p=d;p<u;p++){let m=p+1;h.push(`${m===l?">":" "} ${m}: ${c[p]}`)}return h.join(`
`)}(r.getShaderSource(e),a)}return n}function vm(r,e){let t=function(i){let n=Ye.getPrimaries(Ye.workingColorSpace),s=Ye.getPrimaries(i),a;switch(n===s?a="":n===wa&&s===Sa?a="LinearDisplayP3ToLinearSRGB":n===Sa&&s===wa&&(a="LinearSRGBToLinearDisplayP3"),i){case hn:case to:return[a,"LinearTransferOETF"];case kt:case pc:return[a,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[a,"LinearTransferOETF"]}}(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function ym(r,e){let t;switch(e){case Gd:t="Linear";break;case Vd:t="Reinhard";break;case Wd:t="OptimizedCineon";break;case uc:t="ACESFilmic";break;case Xd:t="AgX";break;case $d:t="Neutral";break;case jd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function lr(r){return r!==""}function au(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ou(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var xm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ml(r){return r.replace(xm,bm)}var _m=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function bm(r,e){let t=Ce[e];if(t===void 0){let i=_m.get(e);if(i===void 0)throw new Error("Can not resolve #include <"+e+">");t=Ce[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i)}return Ml(t)}var Mm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function lu(r){return r.replace(Mm,Sm)}function Sm(r,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function cu(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	`;return r.isWebGL2&&(e+=`precision ${r.precision} sampler3D;
		precision ${r.precision} sampler2DArray;
		precision ${r.precision} sampler2DShadow;
		precision ${r.precision} samplerCubeShadow;
		precision ${r.precision} sampler2DArrayShadow;
		precision ${r.precision} isampler2D;
		precision ${r.precision} isampler3D;
		precision ${r.precision} isamplerCube;
		precision ${r.precision} isampler2DArray;
		precision ${r.precision} usampler2D;
		precision ${r.precision} usampler3D;
		precision ${r.precision} usamplerCube;
		precision ${r.precision} usampler2DArray;
		`),r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function wm(r,e,t,i){let n=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=function(P){let H="SHADOWMAP_TYPE_BASIC";return P.shadowMapType===Nu?H="SHADOWMAP_TYPE_PCF":P.shadowMapType===hc?H="SHADOWMAP_TYPE_PCF_SOFT":P.shadowMapType===ki&&(H="SHADOWMAP_TYPE_VSM"),H}(t),c=function(P){let H="ENVMAP_TYPE_CUBE";if(P.envMap)switch(P.envMapMode){case xr:case _r:H="ENVMAP_TYPE_CUBE";break;case eo:H="ENVMAP_TYPE_CUBE_UV"}return H}(t),h=function(P){let H="ENVMAP_MODE_REFLECTION";return P.envMap&&P.envMapMode===_r&&(H="ENVMAP_MODE_REFRACTION"),H}(t),d=function(P){let H="ENVMAP_BLENDING_NONE";if(P.envMap)switch(P.combine){case Ou:H="ENVMAP_BLENDING_MULTIPLY";break;case Bd:H="ENVMAP_BLENDING_MIX";break;case Hd:H="ENVMAP_BLENDING_ADD"}return H}(t),u=function(P){let H=P.envMapCubeUVHeight;if(H===null)return null;let J=Math.log2(H)-2,se=1/H;return{texelWidth:1/(3*Math.max(Math.pow(2,J),112)),texelHeight:se,maxMip:J}}(t),p=t.isWebGL2?"":function(P){return[P.extensionDerivatives||P.envMapCubeUVHeight||P.bumpMap||P.normalMapTangentSpace||P.clearcoatNormalMap||P.flatShading||P.alphaToCoverage||P.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(P.extensionFragDepth||P.logarithmicDepthBuffer)&&P.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",P.extensionDrawBuffers&&P.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(P.extensionShaderTextureLOD||P.envMap||P.transmission)&&P.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(lr).join(`
`)}(t),m=function(P){return[P.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",P.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(lr).join(`
`)}(t),y=function(P){let H=[];for(let J in P){let se=P[J];se!==!1&&H.push("#define "+J+" "+se)}return H.join(`
`)}(s),g=n.createProgram(),f,v,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(lr).join(`
`),f.length>0&&(f+=`
`),v=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(lr).join(`
`),v.length>0&&(v+=`
`)):(f=[cu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(lr).join(`
`),v=[p,cu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==sn?"#define TONE_MAPPING":"",t.toneMapping!==sn?Ce.tonemapping_pars_fragment:"",t.toneMapping!==sn?ym("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ce.colorspace_pars_fragment,vm("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(lr).join(`
`)),a=Ml(a),a=au(a,t),a=ou(a,t),o=Ml(o),o=au(o,t),o=ou(o,t),a=lu(a),o=lu(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,v=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Th?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let _=x+f+a,R=x+v+o,E=ru(n,n.VERTEX_SHADER,_),S=ru(n,n.FRAGMENT_SHADER,R);function T(P){if(r.debug.checkShaderErrors){let H=n.getProgramInfoLog(g).trim(),J=n.getShaderInfoLog(E).trim(),se=n.getShaderInfoLog(S).trim(),de=!0,K=!0;if(n.getProgramParameter(g,n.LINK_STATUS)===!1)if(de=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,g,E,S);else{let X=su(n,E,"vertex"),Q=su(n,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(g,n.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+X+`
`+Q)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):J!==""&&se!==""||(K=!1);K&&(P.diagnostics={runnable:de,programLog:H,vertexShader:{log:J,prefix:f},fragmentShader:{log:se,prefix:v}})}n.deleteShader(E),n.deleteShader(S),I=new yr(n,g),U=function(H,J){let se={},de=H.getProgramParameter(J,H.ACTIVE_ATTRIBUTES);for(let K=0;K<de;K++){let X=H.getActiveAttrib(J,K),Q=X.name,he=1;X.type===H.FLOAT_MAT2&&(he=2),X.type===H.FLOAT_MAT3&&(he=3),X.type===H.FLOAT_MAT4&&(he=4),se[Q]={type:X.type,location:H.getAttribLocation(J,Q),locationSize:he}}return se}(n,g)}let I,U;n.attachShader(g,E),n.attachShader(g,S),t.index0AttributeName!==void 0?n.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(g,0,"position"),n.linkProgram(g),this.getUniforms=function(){return I===void 0&&T(this),I},this.getAttributes=function(){return U===void 0&&T(this),U};let j=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return j===!1&&(j=n.getProgramParameter(g,fm)),j},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=gm++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=E,this.fragmentShader=S,this}var Em=0,Sl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new wl(e),t.set(e,i)),i}},wl=class{constructor(e){this.id=Em++,this.code=e,this.usedTimes=0}};function Tm(r,e,t,i,n,s,a){let o=new as,l=new Sl,c=new Set,h=[],d=n.isWebGL2,u=n.logarithmicDepthBuffer,p=n.vertexTextures,m=n.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshStandardNodeMaterial:"physical",MeshBasicNodeMaterial:"basic",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(f){return c.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,v,x,_,R){let E=_.fog,S=R.geometry,T=f.isMeshStandardMaterial?_.environment:null,I=(f.isMeshStandardMaterial?t:e).get(f.envMap||T),U=I&&I.mapping===eo?I.image.height:null,j=y[f.type];f.precision!==null&&(m=n.getMaxPrecision(f.precision),m!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",m,"instead."));let P=S.morphAttributes.position||S.morphAttributes.normal||S.morphAttributes.color,H=P!==void 0?P.length:0,J,se,de,K,X=0;if(S.morphAttributes.position!==void 0&&(X=1),S.morphAttributes.normal!==void 0&&(X=2),S.morphAttributes.color!==void 0&&(X=3),j){let zr=vi[j];J=zr.vertexShader,se=zr.fragmentShader}else J=f.vertexShader,se=f.fragmentShader,l.update(f),de=l.getVertexShaderID(f),K=l.getFragmentShaderID(f);let Q=r.getRenderTarget(),he=R.isInstancedMesh===!0,q=R.isBatchedMesh===!0,te=!!f.map,_e=!!f.matcap,le=!!I,C=!!f.aoMap,b=!!f.lightMap,F=!!f.bumpMap,O=!!f.normalMap,L=!!f.displacementMap,D=!!f.emissiveMap,k=!!f.metalnessMap,V=!!f.roughnessMap,z=f.anisotropy>0,M=f.clearcoat>0,Y=f.iridescence>0,N=f.sheen>0,re=f.transmission>0,ee=z&&!!f.anisotropyMap,oe=M&&!!f.clearcoatMap,ye=M&&!!f.clearcoatNormalMap,fe=M&&!!f.clearcoatRoughnessMap,xe=Y&&!!f.iridescenceMap,me=Y&&!!f.iridescenceThicknessMap,Ne=N&&!!f.sheenColorMap,De=N&&!!f.sheenRoughnessMap,et=!!f.specularMap,ve=!!f.specularColorMap,Be=!!f.specularIntensityMap,lt=re&&!!f.transmissionMap,we=re&&!!f.thicknessMap,tt=!!f.gradientMap,je=!!f.alphaMap,Xt=f.alphaTest>0,Li=!!f.alphaHash,Qt=!!f.extensions,W=sn;f.toneMapped&&(Q!==null&&Q.isXRRenderTarget!==!0||(W=r.toneMapping));let fn={isWebGL2:d,shaderID:j,shaderType:f.type,shaderName:f.name,vertexShader:J,fragmentShader:se,defines:f.defines,customVertexShaderID:de,customFragmentShaderID:K,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:m,batching:q,instancing:he,instancingColor:he&&R.instanceColor!==null,instancingMorph:he&&R.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Q===null?r.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:hn,alphaToCoverage:!!f.alphaToCoverage,map:te,matcap:_e,envMap:le,envMapMode:le&&I.mapping,envMapCubeUVHeight:U,aoMap:C,lightMap:b,bumpMap:F,normalMap:O,displacementMap:p&&L,emissiveMap:D,normalMapObjectSpace:O&&f.normalMapType===1,normalMapTangentSpace:O&&f.normalMapType===0,metalnessMap:k,roughnessMap:V,anisotropy:z,anisotropyMap:ee,clearcoat:M,clearcoatMap:oe,clearcoatNormalMap:ye,clearcoatRoughnessMap:fe,iridescence:Y,iridescenceMap:xe,iridescenceThicknessMap:me,sheen:N,sheenColorMap:Ne,sheenRoughnessMap:De,specularMap:et,specularColorMap:ve,specularIntensityMap:Be,transmission:re,transmissionMap:lt,thicknessMap:we,gradientMap:tt,opaque:f.transparent===!1&&f.blending===1&&f.alphaToCoverage===!1,alphaMap:je,alphaTest:Xt,alphaHash:Li,combine:f.combine,mapUv:te&&g(f.map.channel),aoMapUv:C&&g(f.aoMap.channel),lightMapUv:b&&g(f.lightMap.channel),bumpMapUv:F&&g(f.bumpMap.channel),normalMapUv:O&&g(f.normalMap.channel),displacementMapUv:L&&g(f.displacementMap.channel),emissiveMapUv:D&&g(f.emissiveMap.channel),metalnessMapUv:k&&g(f.metalnessMap.channel),roughnessMapUv:V&&g(f.roughnessMap.channel),anisotropyMapUv:ee&&g(f.anisotropyMap.channel),clearcoatMapUv:oe&&g(f.clearcoatMap.channel),clearcoatNormalMapUv:ye&&g(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&g(f.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&g(f.iridescenceMap.channel),iridescenceThicknessMapUv:me&&g(f.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&g(f.sheenColorMap.channel),sheenRoughnessMapUv:De&&g(f.sheenRoughnessMap.channel),specularMapUv:et&&g(f.specularMap.channel),specularColorMapUv:ve&&g(f.specularColorMap.channel),specularIntensityMapUv:Be&&g(f.specularIntensityMap.channel),transmissionMapUv:lt&&g(f.transmissionMap.channel),thicknessMapUv:we&&g(f.thicknessMap.channel),alphaMapUv:je&&g(f.alphaMap.channel),vertexTangents:!!S.attributes.tangent&&(O||z),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!S.attributes.color&&S.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!S.attributes.uv&&(te||je),fog:!!E,useFog:f.fog===!0,fogExp2:!!E&&E.isFogExp2,flatShading:f.flatShading===!0,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:R.isSkinnedMesh===!0,morphTargets:S.morphAttributes.position!==void 0,morphNormals:S.morphAttributes.normal!==void 0,morphColors:S.morphAttributes.color!==void 0,morphTargetsCount:H,morphTextureStride:X,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:r.shadowMap.enabled&&x.length>0,shadowMapType:r.shadowMap.type,toneMapping:W,useLegacyLights:r._useLegacyLights,decodeVideoTexture:te&&f.map.isVideoTexture===!0&&Ye.getTransfer(f.map.colorSpace)===Ke,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===2,flipSided:f.side===Bt,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionDerivatives:Qt&&f.extensions.derivatives===!0,extensionFragDepth:Qt&&f.extensions.fragDepth===!0,extensionDrawBuffers:Qt&&f.extensions.drawBuffers===!0,extensionShaderTextureLOD:Qt&&f.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Qt&&f.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Qt&&f.extensions.multiDraw===!0&&i.has("WEBGL_multi_draw"),rendererExtensionFragDepth:d||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return fn.vertexUv1s=c.has(1),fn.vertexUv2s=c.has(2),fn.vertexUv3s=c.has(3),c.clear(),fn},getProgramCacheKey:function(f){let v=[];if(f.shaderID?v.push(f.shaderID):(v.push(f.customVertexShaderID),v.push(f.customFragmentShaderID)),f.defines!==void 0)for(let x in f.defines)v.push(x),v.push(f.defines[x]);return f.isRawShaderMaterial===!1&&(function(x,_){x.push(_.precision),x.push(_.outputColorSpace),x.push(_.envMapMode),x.push(_.envMapCubeUVHeight),x.push(_.mapUv),x.push(_.alphaMapUv),x.push(_.lightMapUv),x.push(_.aoMapUv),x.push(_.bumpMapUv),x.push(_.normalMapUv),x.push(_.displacementMapUv),x.push(_.emissiveMapUv),x.push(_.metalnessMapUv),x.push(_.roughnessMapUv),x.push(_.anisotropyMapUv),x.push(_.clearcoatMapUv),x.push(_.clearcoatNormalMapUv),x.push(_.clearcoatRoughnessMapUv),x.push(_.iridescenceMapUv),x.push(_.iridescenceThicknessMapUv),x.push(_.sheenColorMapUv),x.push(_.sheenRoughnessMapUv),x.push(_.specularMapUv),x.push(_.specularColorMapUv),x.push(_.specularIntensityMapUv),x.push(_.transmissionMapUv),x.push(_.thicknessMapUv),x.push(_.combine),x.push(_.fogExp2),x.push(_.sizeAttenuation),x.push(_.morphTargetsCount),x.push(_.morphAttributeCount),x.push(_.numDirLights),x.push(_.numPointLights),x.push(_.numSpotLights),x.push(_.numSpotLightMaps),x.push(_.numHemiLights),x.push(_.numRectAreaLights),x.push(_.numDirLightShadows),x.push(_.numPointLightShadows),x.push(_.numSpotLightShadows),x.push(_.numSpotLightShadowsWithMaps),x.push(_.numLightProbes),x.push(_.shadowMapType),x.push(_.toneMapping),x.push(_.numClippingPlanes),x.push(_.numClipIntersection),x.push(_.depthPacking)}(v,f),function(x,_){o.disableAll(),_.isWebGL2&&o.enable(0),_.supportsVertexTextures&&o.enable(1),_.instancing&&o.enable(2),_.instancingColor&&o.enable(3),_.instancingMorph&&o.enable(4),_.matcap&&o.enable(5),_.envMap&&o.enable(6),_.normalMapObjectSpace&&o.enable(7),_.normalMapTangentSpace&&o.enable(8),_.clearcoat&&o.enable(9),_.iridescence&&o.enable(10),_.alphaTest&&o.enable(11),_.vertexColors&&o.enable(12),_.vertexAlphas&&o.enable(13),_.vertexUv1s&&o.enable(14),_.vertexUv2s&&o.enable(15),_.vertexUv3s&&o.enable(16),_.vertexTangents&&o.enable(17),_.anisotropy&&o.enable(18),_.alphaHash&&o.enable(19),_.batching&&o.enable(20),x.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.skinning&&o.enable(4),_.morphTargets&&o.enable(5),_.morphNormals&&o.enable(6),_.morphColors&&o.enable(7),_.premultipliedAlpha&&o.enable(8),_.shadowMapEnabled&&o.enable(9),_.useLegacyLights&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.alphaToCoverage&&o.enable(20),x.push(o.mask)}(v,f),v.push(r.outputColorSpace)),v.push(f.customProgramCacheKey),v.join()},getUniforms:function(f){let v=y[f.type],x;if(v){let _=vi[v];x=hp.clone(_.uniforms)}else x=f.uniforms;return x},acquireProgram:function(f,v){let x;for(let _=0,R=h.length;_<R;_++){let E=h[_];if(E.cacheKey===v){x=E,++x.usedTimes;break}}return x===void 0&&(x=new wm(r,v,f,s),h.push(x)),x},releaseProgram:function(f){if(--f.usedTimes==0){let v=h.indexOf(f);h[v]=h[h.length-1],h.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:h,dispose:function(){l.dispose()}}}function Am(){let r=new WeakMap;return{get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,i){r.get(e)[t]=i},dispose:function(){r=new WeakMap}}}function Rm(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function hu(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function uu(){let r=[],e=0,t=[],i=[],n=[];function s(a,o,l,c,h,d){let u=r[e];return u===void 0?(u={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:d},r[e]=u):(u.id=a.id,u.object=a,u.geometry=o,u.material=l,u.groupOrder=c,u.renderOrder=a.renderOrder,u.z=h,u.group=d),e++,u}return{opaque:t,transmissive:i,transparent:n,init:function(){e=0,t.length=0,i.length=0,n.length=0},push:function(a,o,l,c,h,d){let u=s(a,o,l,c,h,d);l.transmission>0?i.push(u):l.transparent===!0?n.push(u):t.push(u)},unshift:function(a,o,l,c,h,d){let u=s(a,o,l,c,h,d);l.transmission>0?i.unshift(u):l.transparent===!0?n.unshift(u):t.unshift(u)},finish:function(){for(let a=e,o=r.length;a<o;a++){let l=r[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||Rm),i.length>1&&i.sort(o||hu),n.length>1&&n.sort(o||hu)}}}function Cm(){let r=new WeakMap;return{get:function(e,t){let i=r.get(e),n;return i===void 0?(n=new uu,r.set(e,[n])):t>=i.length?(n=new uu,i.push(n)):n=i[t],n},dispose:function(){r=new WeakMap}}}function Lm(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new Pe};break;case"SpotLight":t={position:new w,direction:new w,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new w,halfWidth:new w,halfHeight:new w}}return r[e.id]=t,t}}}var Pm=0;function Im(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function Dm(r,e){let t=new Lm,i=function(){let l={};return{get:function(c){if(l[c.id]!==void 0)return l[c.id];let h;switch(c.type){case"DirectionalLight":case"SpotLight":h={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne};break;case"PointLight":h={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne,shadowCameraNear:1,shadowCameraFar:1e3}}return l[c.id]=h,h}}}(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new w);let s=new w,a=new Le,o=new Le;return{setup:function(l,c){let h=0,d=0,u=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let p=0,m=0,y=0,g=0,f=0,v=0,x=0,_=0,R=0,E=0,S=0;l.sort(Im);let T=c===!0?Math.PI:1;for(let U=0,j=l.length;U<j;U++){let P=l[U],H=P.color,J=P.intensity,se=P.distance,de=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=H.r*J*T,d+=H.g*J*T,u+=H.b*J*T;else if(P.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(P.sh.coefficients[K],J);S++}else if(P.isDirectionalLight){let K=t.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity*T),P.castShadow){let X=P.shadow,Q=i.get(P);Q.shadowBias=X.bias,Q.shadowNormalBias=X.normalBias,Q.shadowRadius=X.radius,Q.shadowMapSize=X.mapSize,n.directionalShadow[p]=Q,n.directionalShadowMap[p]=de,n.directionalShadowMatrix[p]=P.shadow.matrix,v++}n.directional[p]=K,p++}else if(P.isSpotLight){let K=t.get(P);K.position.setFromMatrixPosition(P.matrixWorld),K.color.copy(H).multiplyScalar(J*T),K.distance=se,K.coneCos=Math.cos(P.angle),K.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),K.decay=P.decay,n.spot[y]=K;let X=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,X.updateMatrices(P),P.castShadow&&E++),n.spotLightMatrix[y]=X.matrix,P.castShadow){let Q=i.get(P);Q.shadowBias=X.bias,Q.shadowNormalBias=X.normalBias,Q.shadowRadius=X.radius,Q.shadowMapSize=X.mapSize,n.spotShadow[y]=Q,n.spotShadowMap[y]=de,_++}y++}else if(P.isRectAreaLight){let K=t.get(P);K.color.copy(H).multiplyScalar(J),K.halfWidth.set(.5*P.width,0,0),K.halfHeight.set(0,.5*P.height,0),n.rectArea[g]=K,g++}else if(P.isPointLight){let K=t.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity*T),K.distance=P.distance,K.decay=P.decay,P.castShadow){let X=P.shadow,Q=i.get(P);Q.shadowBias=X.bias,Q.shadowNormalBias=X.normalBias,Q.shadowRadius=X.radius,Q.shadowMapSize=X.mapSize,Q.shadowCameraNear=X.camera.near,Q.shadowCameraFar=X.camera.far,n.pointShadow[m]=Q,n.pointShadowMap[m]=de,n.pointShadowMatrix[m]=P.shadow.matrix,x++}n.point[m]=K,m++}else if(P.isHemisphereLight){let K=t.get(P);K.skyColor.copy(P.color).multiplyScalar(J*T),K.groundColor.copy(P.groundColor).multiplyScalar(J*T),n.hemi[f]=K,f++}}g>0&&(e.isWebGL2?r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2):r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let I=n.hash;I.directionalLength===p&&I.pointLength===m&&I.spotLength===y&&I.rectAreaLength===g&&I.hemiLength===f&&I.numDirectionalShadows===v&&I.numPointShadows===x&&I.numSpotShadows===_&&I.numSpotMaps===R&&I.numLightProbes===S||(n.directional.length=p,n.spot.length=y,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=_+R-E,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=S,I.directionalLength=p,I.pointLength=m,I.spotLength=y,I.rectAreaLength=g,I.hemiLength=f,I.numDirectionalShadows=v,I.numPointShadows=x,I.numSpotShadows=_,I.numSpotMaps=R,I.numLightProbes=S,n.version=Pm++)},setupView:function(l,c){let h=0,d=0,u=0,p=0,m=0,y=c.matrixWorldInverse;for(let g=0,f=l.length;g<f;g++){let v=l[g];if(v.isDirectionalLight){let x=n.directional[h];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(y),h++}else if(v.isSpotLight){let x=n.spot[u];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(y),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(y),u++}else if(v.isRectAreaLight){let x=n.rectArea[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(y),o.identity(),a.copy(v.matrixWorld),a.premultiply(y),o.extractRotation(a),x.halfWidth.set(.5*v.width,0,0),x.halfHeight.set(0,.5*v.height,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),p++}else if(v.isPointLight){let x=n.point[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(y),d++}else if(v.isHemisphereLight){let x=n.hemi[m];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(y),m++}}},state:n}}function du(r,e){let t=new Dm(r,e),i=[],n=[];return{init:function(){i.length=0,n.length=0},state:{lightsArray:i,shadowsArray:n,lights:t},setupLights:function(s){t.setup(i,s)},setupLightsView:function(s){t.setupView(i,s)},pushLight:function(s){i.push(s)},pushShadow:function(s){n.push(s)}}}function Um(r,e){let t=new WeakMap;return{get:function(i,n=0){let s=t.get(i),a;return s===void 0?(a=new du(r,e),t.set(i,[a])):n>=s.length?(a=new du(r,e),s.push(a)):a=s[n],a},dispose:function(){t=new WeakMap}}}var El=class extends Mi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Tl=class extends Mi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Nm(r,e,t){let i=new Er,n=new ne,s=new ne,a=new dt,o=new El({depthPacking:3201}),l=new Tl,c={},h=t.maxTextureSize,d={[on]:Bt,[Bt]:on,2:2},u=new Si({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ne},radius:{value:4}},vertexShader:`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragmentShader:`uniform sampler2D shadow_pass;
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
}`}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let m=new Ze;m.setAttribute("position",new wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new xt(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nu;let f=this.type;function v(E,S){let T=e.update(y);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Wi(n.x,n.y)),u.uniforms.shadow_pass.value=E.map.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,r.setRenderTarget(E.mapPass),r.clear(),r.renderBufferDirect(S,null,T,u,y,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,r.setRenderTarget(E.map),r.clear(),r.renderBufferDirect(S,null,T,p,y,null)}function x(E,S,T,I){let U=null,j=T.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(j!==void 0)U=j;else if(U=T.isPointLight===!0?l:o,r.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){let P=U.uuid,H=S.uuid,J=c[P];J===void 0&&(J={},c[P]=J);let se=J[H];se===void 0&&(se=U.clone(),J[H]=se,S.addEventListener("dispose",R)),U=se}return U.visible=S.visible,U.wireframe=S.wireframe,U.side=I===ki?S.shadowSide!==null?S.shadowSide:S.side:S.shadowSide!==null?S.shadowSide:d[S.side],U.alphaMap=S.alphaMap,U.alphaTest=S.alphaTest,U.map=S.map,U.clipShadows=S.clipShadows,U.clippingPlanes=S.clippingPlanes,U.clipIntersection=S.clipIntersection,U.displacementMap=S.displacementMap,U.displacementScale=S.displacementScale,U.displacementBias=S.displacementBias,U.wireframeLinewidth=S.wireframeLinewidth,U.linewidth=S.linewidth,T.isPointLight===!0&&U.isMeshDistanceMaterial===!0&&(r.properties.get(U).light=T),U}function _(E,S,T,I,U){if(E.visible===!1)return;if(E.layers.test(S.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&U===ki)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,E.matrixWorld);let P=e.update(E),H=E.material;if(Array.isArray(H)){let J=P.groups;for(let se=0,de=J.length;se<de;se++){let K=J[se],X=H[K.materialIndex];if(X&&X.visible){let Q=x(E,X,I,U);E.onBeforeShadow(r,E,S,T,P,Q,K),r.renderBufferDirect(T,null,P,Q,E,K),E.onAfterShadow(r,E,S,T,P,Q,K)}}}else if(H.visible){let J=x(E,H,I,U);E.onBeforeShadow(r,E,S,T,P,J,null),r.renderBufferDirect(T,null,P,J,E,null),E.onAfterShadow(r,E,S,T,P,J,null)}}let j=E.children;for(let P=0,H=j.length;P<H;P++)_(j[P],S,T,I,U)}function R(E){E.target.removeEventListener("dispose",R);for(let S in c){let T=c[S],I=E.target.uuid;I in T&&(T[I].dispose(),delete T[I])}}this.render=function(E,S,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;let I=r.getRenderTarget(),U=r.getActiveCubeFace(),j=r.getActiveMipmapLevel(),P=r.state;P.setBlending(0),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let H=f!==ki&&this.type===ki,J=f===ki&&this.type!==ki;for(let se=0,de=E.length;se<de;se++){let K=E[se],X=K.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;n.copy(X.mapSize);let Q=X.getFrameExtents();if(n.multiply(Q),s.copy(X.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/Q.x),n.x=s.x*Q.x,X.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/Q.y),n.y=s.y*Q.y,X.mapSize.y=s.y)),X.map===null||H===!0||J===!0){let q=this.type!==ki?{minFilter:yt,magFilter:yt}:{};X.map!==null&&X.map.dispose(),X.map=new Wi(n.x,n.y,q),X.map.texture.name=K.name+".shadowMap",X.camera.updateProjectionMatrix()}r.setRenderTarget(X.map),r.clear();let he=X.getViewportCount();for(let q=0;q<he;q++){let te=X.getViewport(q);a.set(s.x*te.x,s.y*te.y,s.x*te.z,s.y*te.w),P.viewport(a),X.updateMatrices(K,q),i=X.getFrustum(),_(S,T,X.camera,K,this.type)}X.isPointLightShadow!==!0&&this.type===ki&&v(X,T),X.needsUpdate=!1}f=this.type,g.needsUpdate=!1,r.setRenderTarget(I,U,j)}}function Om(r,e,t){let i=t.isWebGL2,n=new function(){let M=!1,Y=new dt,N=null,re=new dt(0,0,0,0);return{setMask:function(ee){N===ee||M||(r.colorMask(ee,ee,ee,ee),N=ee)},setLocked:function(ee){M=ee},setClear:function(ee,oe,ye,fe,xe){xe===!0&&(ee*=fe,oe*=fe,ye*=fe),Y.set(ee,oe,ye,fe),re.equals(Y)===!1&&(r.clearColor(ee,oe,ye,fe),re.copy(Y))},reset:function(){M=!1,N=null,re.set(-1,0,0,0)}}},s=new function(){let M=!1,Y=null,N=null,re=null;return{setTest:function(ee){ee?b(r.DEPTH_TEST):F(r.DEPTH_TEST)},setMask:function(ee){Y===ee||M||(r.depthMask(ee),Y=ee)},setFunc:function(ee){if(N!==ee){switch(ee){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:default:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL)}N=ee}},setLocked:function(ee){M=ee},setClear:function(ee){re!==ee&&(r.clearDepth(ee),re=ee)},reset:function(){M=!1,Y=null,N=null,re=null}}},a=new function(){let M=!1,Y=null,N=null,re=null,ee=null,oe=null,ye=null,fe=null,xe=null;return{setTest:function(me){M||(me?b(r.STENCIL_TEST):F(r.STENCIL_TEST))},setMask:function(me){Y===me||M||(r.stencilMask(me),Y=me)},setFunc:function(me,Ne,De){N===me&&re===Ne&&ee===De||(r.stencilFunc(me,Ne,De),N=me,re=Ne,ee=De)},setOp:function(me,Ne,De){oe===me&&ye===Ne&&fe===De||(r.stencilOp(me,Ne,De),oe=me,ye=Ne,fe=De)},setLocked:function(me){M=me},setClear:function(me){xe!==me&&(r.clearStencil(me),xe=me)},reset:function(){M=!1,Y=null,N=null,re=null,ee=null,oe=null,ye=null,fe=null,xe=null}}},o=new WeakMap,l=new WeakMap,c={},h={},d=new WeakMap,u=[],p=null,m=!1,y=null,g=null,f=null,v=null,x=null,_=null,R=null,E=new Pe(0,0,0),S=0,T=!1,I=null,U=null,j=null,P=null,H=null,J=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),se=!1,de=0,K=r.getParameter(r.VERSION);K.indexOf("WebGL")!==-1?(de=parseFloat(/^WebGL (\d)/.exec(K)[1]),se=de>=1):K.indexOf("OpenGL ES")!==-1&&(de=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),se=de>=2);let X=null,Q={},he=r.getParameter(r.SCISSOR_BOX),q=r.getParameter(r.VIEWPORT),te=new dt().fromArray(he),_e=new dt().fromArray(q);function le(M,Y,N,re){let ee=new Uint8Array(4),oe=r.createTexture();r.bindTexture(M,oe),r.texParameteri(M,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(M,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ye=0;ye<N;ye++)!i||M!==r.TEXTURE_3D&&M!==r.TEXTURE_2D_ARRAY?r.texImage2D(Y+ye,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ee):r.texImage3D(Y,0,r.RGBA,1,1,re,0,r.RGBA,r.UNSIGNED_BYTE,ee);return oe}let C={};function b(M){c[M]!==!0&&(r.enable(M),c[M]=!0)}function F(M){c[M]!==!1&&(r.disable(M),c[M]=!1)}C[r.TEXTURE_2D]=le(r.TEXTURE_2D,r.TEXTURE_2D,1),C[r.TEXTURE_CUBE_MAP]=le(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(C[r.TEXTURE_2D_ARRAY]=le(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),C[r.TEXTURE_3D]=le(r.TEXTURE_3D,r.TEXTURE_3D,1,1)),n.setClear(0,0,0,1),s.setClear(1),a.setClear(0),b(r.DEPTH_TEST),s.setFunc(3),k(!1),V(1),b(r.CULL_FACE),D(0);let O={[Ln]:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};if(i)O[103]=r.MIN,O[104]=r.MAX;else{let M=e.get("EXT_blend_minmax");M!==null&&(O[103]=M.MIN_EXT,O[104]=M.MAX_EXT)}let L={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,[al]:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,[ol]:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function D(M,Y,N,re,ee,oe,ye,fe,xe,me){if(M!==0){if(m===!1&&(b(r.BLEND),m=!0),M===5)ee=ee||Y,oe=oe||N,ye=ye||re,Y===g&&ee===x||(r.blendEquationSeparate(O[Y],O[ee]),g=Y,x=ee),N===f&&re===v&&oe===_&&ye===R||(r.blendFuncSeparate(L[N],L[re],L[oe],L[ye]),f=N,v=re,_=oe,R=ye),fe.equals(E)!==!1&&xe===S||(r.blendColor(fe.r,fe.g,fe.b,xe),E.copy(fe),S=xe),y=M,T=!1;else if(M!==y||me!==T){if(g===Ln&&x===Ln||(r.blendEquation(r.FUNC_ADD),g=Ln,x=Ln),me)switch(M){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}else switch(M){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}f=null,v=null,_=null,R=null,E.set(0,0,0),S=0,y=M,T=me}}else m===!0&&(F(r.BLEND),m=!1)}function k(M){I!==M&&(M?r.frontFace(r.CW):r.frontFace(r.CCW),I=M)}function V(M){M!==0?(b(r.CULL_FACE),M!==U&&(M===1?r.cullFace(r.BACK):M===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):F(r.CULL_FACE),U=M}function z(M,Y,N){M?(b(r.POLYGON_OFFSET_FILL),P===Y&&H===N||(r.polygonOffset(Y,N),P=Y,H=N)):F(r.POLYGON_OFFSET_FILL)}return{buffers:{color:n,depth:s,stencil:a},enable:b,disable:F,bindFramebuffer:function(M,Y){return h[M]!==Y&&(r.bindFramebuffer(M,Y),h[M]=Y,i&&(M===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=Y),M===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=Y)),!0)},drawBuffers:function(M,Y){let N=u,re=!1;if(M){N=d.get(Y),N===void 0&&(N=[],d.set(Y,N));let ee=M.textures;if(N.length!==ee.length||N[0]!==r.COLOR_ATTACHMENT0){for(let oe=0,ye=ee.length;oe<ye;oe++)N[oe]=r.COLOR_ATTACHMENT0+oe;N.length=ee.length,re=!0}}else N[0]!==r.BACK&&(N[0]=r.BACK,re=!0);if(re)if(t.isWebGL2)r.drawBuffers(N);else{if(e.has("WEBGL_draw_buffers")!==!0)throw new Error("THREE.WebGLState: Usage of gl.drawBuffers() require WebGL2 or WEBGL_draw_buffers extension");e.get("WEBGL_draw_buffers").drawBuffersWEBGL(N)}},useProgram:function(M){return p!==M&&(r.useProgram(M),p=M,!0)},setBlending:D,setMaterial:function(M,Y){M.side===2?F(r.CULL_FACE):b(r.CULL_FACE);let N=M.side===Bt;Y&&(N=!N),k(N),M.blending===1&&M.transparent===!1?D(0):D(M.blending,M.blendEquation,M.blendSrc,M.blendDst,M.blendEquationAlpha,M.blendSrcAlpha,M.blendDstAlpha,M.blendColor,M.blendAlpha,M.premultipliedAlpha),s.setFunc(M.depthFunc),s.setTest(M.depthTest),s.setMask(M.depthWrite),n.setMask(M.colorWrite);let re=M.stencilWrite;a.setTest(re),re&&(a.setMask(M.stencilWriteMask),a.setFunc(M.stencilFunc,M.stencilRef,M.stencilFuncMask),a.setOp(M.stencilFail,M.stencilZFail,M.stencilZPass)),z(M.polygonOffset,M.polygonOffsetFactor,M.polygonOffsetUnits),M.alphaToCoverage===!0?b(r.SAMPLE_ALPHA_TO_COVERAGE):F(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:k,setCullFace:V,setLineWidth:function(M){M!==j&&(se&&r.lineWidth(M),j=M)},setPolygonOffset:z,setScissorTest:function(M){M?b(r.SCISSOR_TEST):F(r.SCISSOR_TEST)},activeTexture:function(M){M===void 0&&(M=r.TEXTURE0+J-1),X!==M&&(r.activeTexture(M),X=M)},bindTexture:function(M,Y,N){N===void 0&&(N=X===null?r.TEXTURE0+J-1:X);let re=Q[N];re===void 0&&(re={type:void 0,texture:void 0},Q[N]=re),re.type===M&&re.texture===Y||(X!==N&&(r.activeTexture(N),X=N),r.bindTexture(M,Y||C[M]),re.type=M,re.texture=Y)},unbindTexture:function(){let M=Q[X];M!==void 0&&M.type!==void 0&&(r.bindTexture(M.type,null),M.type=void 0,M.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexImage3D:function(){try{r.compressedTexImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage2D:function(){try{r.texImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage3D:function(){try{r.texImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},updateUBOMapping:function(M,Y){let N=l.get(Y);N===void 0&&(N=new WeakMap,l.set(Y,N));let re=N.get(M);re===void 0&&(re=r.getUniformBlockIndex(Y,M.name),N.set(M,re))},uniformBlockBinding:function(M,Y){let N=l.get(Y).get(M);o.get(Y)!==N&&(r.uniformBlockBinding(Y,N,M.__bindingPointIndex),o.set(Y,N))},texStorage2D:function(){try{r.texStorage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texStorage3D:function(){try{r.texStorage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage2D:function(){try{r.texSubImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage3D:function(){try{r.texSubImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},scissor:function(M){te.equals(M)===!1&&(r.scissor(M.x,M.y,M.z,M.w),te.copy(M))},viewport:function(M){_e.equals(M)===!1&&(r.viewport(M.x,M.y,M.z,M.w),_e.copy(M))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),i===!0&&(r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),c={},X=null,Q={},h={},d=new WeakMap,u=[],p=null,m=!1,y=null,g=null,f=null,v=null,x=null,_=null,R=null,E=new Pe(0,0,0),S=0,T=!1,I=null,U=null,j=null,P=null,H=null,te.set(0,0,r.canvas.width,r.canvas.height),_e.set(0,0,r.canvas.width,r.canvas.height),n.reset(),s.reset(),a.reset()}}}function zm(r,e,t,i,n,s,a){let o=n.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),h=new ne,d=new WeakMap,u,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(C,b){return m?new OffscreenCanvas(C,b):ss("canvas")}function g(C,b,F,O){let L=1,D=le(C);if((D.width>O||D.height>O)&&(L=O/Math.max(D.width,D.height)),L<1||b===!0){if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let k=b?ml:Math.floor,V=k(L*D.width),z=k(L*D.height);u===void 0&&(u=y(V,z));let M=F?y(V,z):u;return M.width=V,M.height=z,M.getContext("2d").drawImage(C,0,0,V,z),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+D.width+"x"+D.height+") to ("+V+"x"+z+")."),M}return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+D.width+"x"+D.height+")."),C}return C}function f(C){let b=le(C);return Ah(b.width)&&Ah(b.height)}function v(C,b){return C.generateMipmaps&&b&&C.minFilter!==yt&&C.minFilter!==Ft}function x(C){r.generateMipmap(C)}function _(C,b,F,O,L=!1){if(o===!1)return b;if(C!==null){if(r[C]!==void 0)return r[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let D=b;if(b===r.RED&&(F===r.FLOAT&&(D=r.R32F),F===r.HALF_FLOAT&&(D=r.R16F),F===r.UNSIGNED_BYTE&&(D=r.R8)),b===r.RED_INTEGER&&(F===r.UNSIGNED_BYTE&&(D=r.R8UI),F===r.UNSIGNED_SHORT&&(D=r.R16UI),F===r.UNSIGNED_INT&&(D=r.R32UI),F===r.BYTE&&(D=r.R8I),F===r.SHORT&&(D=r.R16I),F===r.INT&&(D=r.R32I)),b===r.RG&&(F===r.FLOAT&&(D=r.RG32F),F===r.HALF_FLOAT&&(D=r.RG16F),F===r.UNSIGNED_BYTE&&(D=r.RG8)),b===r.RG_INTEGER&&(F===r.UNSIGNED_BYTE&&(D=r.RG8UI),F===r.UNSIGNED_SHORT&&(D=r.RG16UI),F===r.UNSIGNED_INT&&(D=r.RG32UI),F===r.BYTE&&(D=r.RG8I),F===r.SHORT&&(D=r.RG16I),F===r.INT&&(D=r.RG32I)),b===r.RGBA){let k=L?Ma:Ye.getTransfer(O);F===r.FLOAT&&(D=r.RGBA32F),F===r.HALF_FLOAT&&(D=r.RGBA16F),F===r.UNSIGNED_BYTE&&(D=k===Ke?r.SRGB8_ALPHA8:r.RGBA8),F===r.UNSIGNED_SHORT_4_4_4_4&&(D=r.RGBA4),F===r.UNSIGNED_SHORT_5_5_5_1&&(D=r.RGB5_A1)}return D!==r.R16F&&D!==r.R32F&&D!==r.RG16F&&D!==r.RG32F&&D!==r.RGBA16F&&D!==r.RGBA32F||e.get("EXT_color_buffer_float"),D}function R(C,b,F){return v(C,F)===!0||C.isFramebufferTexture&&C.minFilter!==yt&&C.minFilter!==Ft?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function E(C){return C===yt||C===Jc||C===Vr?r.NEAREST:r.LINEAR}function S(C){let b=C.target;b.removeEventListener("dispose",S),function(F){let O=i.get(F);if(O.__webglInit===void 0)return;let L=F.source,D=p.get(L);if(D){let k=D[O.__cacheKey];k.usedTimes--,k.usedTimes===0&&I(F),Object.keys(D).length===0&&p.delete(L)}i.remove(F)}(b),b.isVideoTexture&&d.delete(b)}function T(C){let b=C.target;b.removeEventListener("dispose",T),function(F){let O=i.get(F);if(F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let D=0;D<6;D++){if(Array.isArray(O.__webglFramebuffer[D]))for(let k=0;k<O.__webglFramebuffer[D].length;k++)r.deleteFramebuffer(O.__webglFramebuffer[D][k]);else r.deleteFramebuffer(O.__webglFramebuffer[D]);O.__webglDepthbuffer&&r.deleteRenderbuffer(O.__webglDepthbuffer[D])}else{if(Array.isArray(O.__webglFramebuffer))for(let D=0;D<O.__webglFramebuffer.length;D++)r.deleteFramebuffer(O.__webglFramebuffer[D]);else r.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&r.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&r.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let D=0;D<O.__webglColorRenderbuffer.length;D++)O.__webglColorRenderbuffer[D]&&r.deleteRenderbuffer(O.__webglColorRenderbuffer[D]);O.__webglDepthRenderbuffer&&r.deleteRenderbuffer(O.__webglDepthRenderbuffer)}let L=F.textures;for(let D=0,k=L.length;D<k;D++){let V=i.get(L[D]);V.__webglTexture&&(r.deleteTexture(V.__webglTexture),a.memory.textures--),i.remove(L[D])}i.remove(F)}(b)}function I(C){let b=i.get(C);r.deleteTexture(b.__webglTexture);let F=C.source;delete p.get(F)[b.__cacheKey],a.memory.textures--}let U=0;function j(C,b){let F=i.get(C);if(C.isVideoTexture&&function(O){let L=a.render.frame;d.get(O)!==L&&(d.set(O,L),O.update())}(C),C.isRenderTargetTexture===!1&&C.version>0&&F.__version!==C.version){let O=C.image;if(O===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(O.complete!==!1)return void K(F,C,b);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(r.TEXTURE_2D,F.__webglTexture,r.TEXTURE0+b)}let P={[hl]:r.REPEAT,[Bi]:r.CLAMP_TO_EDGE,[ul]:r.MIRRORED_REPEAT},H={[yt]:r.NEAREST,[Jc]:r.NEAREST_MIPMAP_NEAREST,[Vr]:r.NEAREST_MIPMAP_LINEAR,[Ft]:r.LINEAR,[xo]:r.LINEAR_MIPMAP_NEAREST,[fr]:r.LINEAR_MIPMAP_LINEAR},J={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function se(C,b,F){if(b.type!==yi||e.has("OES_texture_float_linear")!==!1||b.magFilter!==Ft&&b.magFilter!==xo&&b.magFilter!==Vr&&b.magFilter!==fr&&b.minFilter!==Ft&&b.minFilter!==xo&&b.minFilter!==Vr&&b.minFilter!==fr||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),F?(r.texParameteri(C,r.TEXTURE_WRAP_S,P[b.wrapS]),r.texParameteri(C,r.TEXTURE_WRAP_T,P[b.wrapT]),C!==r.TEXTURE_3D&&C!==r.TEXTURE_2D_ARRAY||r.texParameteri(C,r.TEXTURE_WRAP_R,P[b.wrapR]),r.texParameteri(C,r.TEXTURE_MAG_FILTER,H[b.magFilter]),r.texParameteri(C,r.TEXTURE_MIN_FILTER,H[b.minFilter])):(r.texParameteri(C,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(C,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),C!==r.TEXTURE_3D&&C!==r.TEXTURE_2D_ARRAY||r.texParameteri(C,r.TEXTURE_WRAP_R,r.CLAMP_TO_EDGE),b.wrapS===Bi&&b.wrapT===Bi||console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(C,r.TEXTURE_MAG_FILTER,E(b.magFilter)),r.texParameteri(C,r.TEXTURE_MIN_FILTER,E(b.minFilter)),b.minFilter!==yt&&b.minFilter!==Ft&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(r.texParameteri(C,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(C,r.TEXTURE_COMPARE_FUNC,J[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===yt||b.minFilter!==Vr&&b.minFilter!==fr||b.type===yi&&e.has("OES_texture_float_linear")===!1||o===!1&&b.type===rs&&e.has("OES_texture_half_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");r.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,n.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function de(C,b){let F=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",S));let O=b.source,L=p.get(O);L===void 0&&(L={},p.set(O,L));let D=function(k){let V=[];return V.push(k.wrapS),V.push(k.wrapT),V.push(k.wrapR||0),V.push(k.magFilter),V.push(k.minFilter),V.push(k.anisotropy),V.push(k.internalFormat),V.push(k.format),V.push(k.type),V.push(k.generateMipmaps),V.push(k.premultiplyAlpha),V.push(k.flipY),V.push(k.unpackAlignment),V.push(k.colorSpace),V.join()}(b);if(D!==C.__cacheKey){L[D]===void 0&&(L[D]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,F=!0),L[D].usedTimes++;let k=L[C.__cacheKey];k!==void 0&&(L[C.__cacheKey].usedTimes--,k.usedTimes===0&&I(b)),C.__cacheKey=D,C.__webglTexture=L[D].texture}return F}function K(C,b,F){let O=r.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(O=r.TEXTURE_2D_ARRAY),b.isData3DTexture&&(O=r.TEXTURE_3D);let L=de(C,b),D=b.source;t.bindTexture(O,C.__webglTexture,r.TEXTURE0+F);let k=i.get(D);if(D.version!==k.__version||L===!0){t.activeTexture(r.TEXTURE0+F);let V=Ye.getPrimaries(Ye.workingColorSpace),z=b.colorSpace===mr?null:Ye.getPrimaries(b.colorSpace),M=b.colorSpace===mr||V===z?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,M);let Y=function(ve){return!o&&(ve.wrapS!==Bi||ve.wrapT!==Bi||ve.minFilter!==yt&&ve.minFilter!==Ft)}(b)&&f(b.image)===!1,N=g(b.image,Y,!1,n.maxTextureSize);N=_e(b,N);let re=f(N)||o,ee=s.convert(b.format,b.colorSpace),oe,ye=s.convert(b.type),fe=_(b.internalFormat,ee,ye,b.colorSpace,b.isVideoTexture);se(O,b,re);let xe=b.mipmaps,me=o&&b.isVideoTexture!==!0&&fe!==ju,Ne=k.__version===void 0||L===!0,De=D.dataReady,et=R(b,N,re);if(b.isDepthTexture)fe=r.DEPTH_COMPONENT,o?fe=b.type===yi?r.DEPTH_COMPONENT32F:b.type===nn?r.DEPTH_COMPONENT24:b.type===Un?r.DEPTH24_STENCIL8:r.DEPTH_COMPONENT16:b.type===yi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===Nn&&fe===r.DEPTH_COMPONENT&&b.type!==dc&&b.type!==nn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=nn,ye=s.convert(b.type)),b.format===br&&fe===r.DEPTH_COMPONENT&&(fe=r.DEPTH_STENCIL,b.type!==Un&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=Un,ye=s.convert(b.type))),Ne&&(me?t.texStorage2D(r.TEXTURE_2D,1,fe,N.width,N.height):t.texImage2D(r.TEXTURE_2D,0,fe,N.width,N.height,0,ee,ye,null));else if(b.isDataTexture)if(xe.length>0&&re){me&&Ne&&t.texStorage2D(r.TEXTURE_2D,et,fe,xe[0].width,xe[0].height);for(let ve=0,Be=xe.length;ve<Be;ve++)oe=xe[ve],me?De&&t.texSubImage2D(r.TEXTURE_2D,ve,0,0,oe.width,oe.height,ee,ye,oe.data):t.texImage2D(r.TEXTURE_2D,ve,fe,oe.width,oe.height,0,ee,ye,oe.data);b.generateMipmaps=!1}else me?(Ne&&t.texStorage2D(r.TEXTURE_2D,et,fe,N.width,N.height),De&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,N.width,N.height,ee,ye,N.data)):t.texImage2D(r.TEXTURE_2D,0,fe,N.width,N.height,0,ee,ye,N.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){me&&Ne&&t.texStorage3D(r.TEXTURE_2D_ARRAY,et,fe,xe[0].width,xe[0].height,N.depth);for(let ve=0,Be=xe.length;ve<Be;ve++)oe=xe[ve],b.format!==Gi?ee!==null?me?De&&t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ve,0,0,0,oe.width,oe.height,N.depth,ee,oe.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ve,fe,oe.width,oe.height,N.depth,0,oe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):me?De&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ve,0,0,0,oe.width,oe.height,N.depth,ee,ye,oe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ve,fe,oe.width,oe.height,N.depth,0,ee,ye,oe.data)}else{me&&Ne&&t.texStorage2D(r.TEXTURE_2D,et,fe,xe[0].width,xe[0].height);for(let ve=0,Be=xe.length;ve<Be;ve++)oe=xe[ve],b.format!==Gi?ee!==null?me?De&&t.compressedTexSubImage2D(r.TEXTURE_2D,ve,0,0,oe.width,oe.height,ee,oe.data):t.compressedTexImage2D(r.TEXTURE_2D,ve,fe,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):me?De&&t.texSubImage2D(r.TEXTURE_2D,ve,0,0,oe.width,oe.height,ee,ye,oe.data):t.texImage2D(r.TEXTURE_2D,ve,fe,oe.width,oe.height,0,ee,ye,oe.data)}else if(b.isDataArrayTexture)me?(Ne&&t.texStorage3D(r.TEXTURE_2D_ARRAY,et,fe,N.width,N.height,N.depth),De&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,N.width,N.height,N.depth,ee,ye,N.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,fe,N.width,N.height,N.depth,0,ee,ye,N.data);else if(b.isData3DTexture)me?(Ne&&t.texStorage3D(r.TEXTURE_3D,et,fe,N.width,N.height,N.depth),De&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,N.width,N.height,N.depth,ee,ye,N.data)):t.texImage3D(r.TEXTURE_3D,0,fe,N.width,N.height,N.depth,0,ee,ye,N.data);else if(b.isFramebufferTexture){if(Ne)if(me)t.texStorage2D(r.TEXTURE_2D,et,fe,N.width,N.height);else{let ve=N.width,Be=N.height;for(let lt=0;lt<et;lt++)t.texImage2D(r.TEXTURE_2D,lt,fe,ve,Be,0,ee,ye,null),ve>>=1,Be>>=1}}else if(xe.length>0&&re){if(me&&Ne){let ve=le(xe[0]);t.texStorage2D(r.TEXTURE_2D,et,fe,ve.width,ve.height)}for(let ve=0,Be=xe.length;ve<Be;ve++)oe=xe[ve],me?De&&t.texSubImage2D(r.TEXTURE_2D,ve,0,0,ee,ye,oe):t.texImage2D(r.TEXTURE_2D,ve,fe,ee,ye,oe);b.generateMipmaps=!1}else if(me){if(Ne){let ve=le(N);t.texStorage2D(r.TEXTURE_2D,et,fe,ve.width,ve.height)}De&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ee,ye,N)}else t.texImage2D(r.TEXTURE_2D,0,fe,ee,ye,N);v(b,re)&&x(O),k.__version=D.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function X(C,b,F,O,L,D){let k=s.convert(F.format,F.colorSpace),V=s.convert(F.type),z=_(F.internalFormat,k,V,F.colorSpace);if(!i.get(b).__hasExternalTextures){let M=Math.max(1,b.width>>D),Y=Math.max(1,b.height>>D);L===r.TEXTURE_3D||L===r.TEXTURE_2D_ARRAY?t.texImage3D(L,D,z,M,Y,b.depth,0,k,V,null):t.texImage2D(L,D,z,M,Y,0,k,V,null)}t.bindFramebuffer(r.FRAMEBUFFER,C),te(b)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,O,L,i.get(F).__webglTexture,0,q(b)):(L===r.TEXTURE_2D||L>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&L<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,O,L,i.get(F).__webglTexture,D),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Q(C,b,F){if(r.bindRenderbuffer(r.RENDERBUFFER,C),b.depthBuffer&&!b.stencilBuffer){let O=o===!0?r.DEPTH_COMPONENT24:r.DEPTH_COMPONENT16;if(F||te(b)){let L=b.depthTexture;L&&L.isDepthTexture&&(L.type===yi?O=r.DEPTH_COMPONENT32F:L.type===nn&&(O=r.DEPTH_COMPONENT24));let D=q(b);te(b)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,D,O,b.width,b.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,D,O,b.width,b.height)}else r.renderbufferStorage(r.RENDERBUFFER,O,b.width,b.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,C)}else if(b.depthBuffer&&b.stencilBuffer){let O=q(b);F&&te(b)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,O,r.DEPTH24_STENCIL8,b.width,b.height):te(b)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,O,r.DEPTH24_STENCIL8,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,C)}else{let O=b.textures;for(let L=0;L<O.length;L++){let D=O[L],k=s.convert(D.format,D.colorSpace),V=s.convert(D.type),z=_(D.internalFormat,k,V,D.colorSpace),M=q(b);F&&te(b)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,M,z,b.width,b.height):te(b)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,M,z,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,z,b.width,b.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function he(C){let b=i.get(C),F=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");(function(O,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,O),!L.depthTexture||!L.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");i.get(L.depthTexture).__webglTexture&&L.depthTexture.image.width===L.width&&L.depthTexture.image.height===L.height||(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),j(L.depthTexture,0);let D=i.get(L.depthTexture).__webglTexture,k=q(L);if(L.depthTexture.format===Nn)te(L)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,D,0,k):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,D,0);else{if(L.depthTexture.format!==br)throw new Error("Unknown depthTexture format");te(L)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,D,0,k):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,D,0)}})(b.__webglFramebuffer,C)}else if(F){b.__webglDepthbuffer=[];for(let O=0;O<6;O++)t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[O]),b.__webglDepthbuffer[O]=r.createRenderbuffer(),Q(b.__webglDepthbuffer[O],C,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=r.createRenderbuffer(),Q(b.__webglDepthbuffer,C,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function q(C){return Math.min(n.maxSamples,C.samples)}function te(C){let b=i.get(C);return o&&C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function _e(C,b){let F=C.colorSpace,O=C.format,L=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===Xu||F!==hn&&F!==mr&&(Ye.getTransfer(F)===Ke?o===!1?b=Hi.sRGBToLinear(b):O===Gi&&L===Dn||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),b}function le(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(h.width=C.naturalWidth||C.width,h.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(h.width=C.displayWidth,h.height=C.displayHeight):(h.width=C.width,h.height=C.height),h}this.allocateTextureUnit=function(){let C=U;return C>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+n.maxTextures),U+=1,C},this.resetTextureUnits=function(){U=0},this.setTexture2D=j,this.setTexture2DArray=function(C,b){let F=i.get(C);C.version>0&&F.__version!==C.version?K(F,C,b):t.bindTexture(r.TEXTURE_2D_ARRAY,F.__webglTexture,r.TEXTURE0+b)},this.setTexture3D=function(C,b){let F=i.get(C);C.version>0&&F.__version!==C.version?K(F,C,b):t.bindTexture(r.TEXTURE_3D,F.__webglTexture,r.TEXTURE0+b)},this.setTextureCube=function(C,b){let F=i.get(C);C.version>0&&F.__version!==C.version?function(O,L,D){if(L.image.length!==6)return;let k=de(O,L),V=L.source;t.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture,r.TEXTURE0+D);let z=i.get(V);if(V.version!==z.__version||k===!0){t.activeTexture(r.TEXTURE0+D);let M=Ye.getPrimaries(Ye.workingColorSpace),Y=L.colorSpace===mr?null:Ye.getPrimaries(L.colorSpace),N=L.colorSpace===mr||M===Y?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,L.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,L.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,N);let re=L.isCompressedTexture||L.image[0].isCompressedTexture,ee=L.image[0]&&L.image[0].isDataTexture,oe=[];for(let we=0;we<6;we++)oe[we]=re||ee?ee?L.image[we].image:L.image[we]:g(L.image[we],!1,!0,n.maxCubemapSize),oe[we]=_e(L,oe[we]);let ye=oe[0],fe=f(ye)||o,xe=s.convert(L.format,L.colorSpace),me=s.convert(L.type),Ne=_(L.internalFormat,xe,me,L.colorSpace),De=o&&L.isVideoTexture!==!0,et=z.__version===void 0||k===!0,ve=V.dataReady,Be,lt=R(L,ye,fe);if(se(r.TEXTURE_CUBE_MAP,L,fe),re){De&&et&&t.texStorage2D(r.TEXTURE_CUBE_MAP,lt,Ne,ye.width,ye.height);for(let we=0;we<6;we++){Be=oe[we].mipmaps;for(let tt=0;tt<Be.length;tt++){let je=Be[tt];L.format!==Gi?xe!==null?De?ve&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt,0,0,je.width,je.height,xe,je.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt,Ne,je.width,je.height,0,je.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?ve&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt,0,0,je.width,je.height,xe,me,je.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt,Ne,je.width,je.height,0,xe,me,je.data)}}}else{if(Be=L.mipmaps,De&&et){Be.length>0&&lt++;let we=le(oe[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,lt,Ne,we.width,we.height)}for(let we=0;we<6;we++)if(ee){De?ve&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,0,0,oe[we].width,oe[we].height,xe,me,oe[we].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,Ne,oe[we].width,oe[we].height,0,xe,me,oe[we].data);for(let tt=0;tt<Be.length;tt++){let je=Be[tt].image[we].image;De?ve&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt+1,0,0,je.width,je.height,xe,me,je.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt+1,Ne,je.width,je.height,0,xe,me,je.data)}}else{De?ve&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,0,0,xe,me,oe[we]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,Ne,xe,me,oe[we]);for(let tt=0;tt<Be.length;tt++){let je=Be[tt];De?ve&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt+1,0,0,xe,me,je.image[we]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+we,tt+1,Ne,xe,me,je.image[we])}}}v(L,fe)&&x(r.TEXTURE_CUBE_MAP),z.__version=V.version,L.onUpdate&&L.onUpdate(L)}O.__version=L.version}(F,C,b):t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+b)},this.rebindTextures=function(C,b,F){let O=i.get(C);b!==void 0&&X(O.__webglFramebuffer,C,C.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),F!==void 0&&he(C)},this.setupRenderTarget=function(C){let b=C.texture,F=i.get(C),O=i.get(b);C.addEventListener("dispose",T);let L=C.textures,D=C.isWebGLCubeRenderTarget===!0,k=L.length>1,V=f(C)||o;if(k||(O.__webglTexture===void 0&&(O.__webglTexture=r.createTexture()),O.__version=b.version,a.memory.textures++),D){F.__webglFramebuffer=[];for(let z=0;z<6;z++)if(o&&b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer[z]=[];for(let M=0;M<b.mipmaps.length;M++)F.__webglFramebuffer[z][M]=r.createFramebuffer()}else F.__webglFramebuffer[z]=r.createFramebuffer()}else{if(o&&b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer=[];for(let z=0;z<b.mipmaps.length;z++)F.__webglFramebuffer[z]=r.createFramebuffer()}else F.__webglFramebuffer=r.createFramebuffer();if(k)if(n.drawBuffers)for(let z=0,M=L.length;z<M;z++){let Y=i.get(L[z]);Y.__webglTexture===void 0&&(Y.__webglTexture=r.createTexture(),a.memory.textures++)}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&C.samples>0&&te(C)===!1){F.__webglMultisampledFramebuffer=r.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let z=0;z<L.length;z++){let M=L[z];F.__webglColorRenderbuffer[z]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,F.__webglColorRenderbuffer[z]);let Y=s.convert(M.format,M.colorSpace),N=s.convert(M.type),re=_(M.internalFormat,Y,N,M.colorSpace,C.isXRRenderTarget===!0),ee=q(C);r.renderbufferStorageMultisample(r.RENDERBUFFER,ee,re,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+z,r.RENDERBUFFER,F.__webglColorRenderbuffer[z])}r.bindRenderbuffer(r.RENDERBUFFER,null),C.depthBuffer&&(F.__webglDepthRenderbuffer=r.createRenderbuffer(),Q(F.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(D){t.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture),se(r.TEXTURE_CUBE_MAP,b,V);for(let z=0;z<6;z++)if(o&&b.mipmaps&&b.mipmaps.length>0)for(let M=0;M<b.mipmaps.length;M++)X(F.__webglFramebuffer[z][M],C,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+z,M);else X(F.__webglFramebuffer[z],C,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+z,0);v(b,V)&&x(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(k){for(let z=0,M=L.length;z<M;z++){let Y=L[z],N=i.get(Y);t.bindTexture(r.TEXTURE_2D,N.__webglTexture),se(r.TEXTURE_2D,Y,V),X(F.__webglFramebuffer,C,Y,r.COLOR_ATTACHMENT0+z,r.TEXTURE_2D,0),v(Y,V)&&x(r.TEXTURE_2D)}t.unbindTexture()}else{let z=r.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(o?z=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(z,O.__webglTexture),se(z,b,V),o&&b.mipmaps&&b.mipmaps.length>0)for(let M=0;M<b.mipmaps.length;M++)X(F.__webglFramebuffer[M],C,b,r.COLOR_ATTACHMENT0,z,M);else X(F.__webglFramebuffer,C,b,r.COLOR_ATTACHMENT0,z,0);v(b,V)&&x(z),t.unbindTexture()}C.depthBuffer&&he(C)},this.updateRenderTargetMipmap=function(C){let b=f(C)||o,F=C.textures;for(let O=0,L=F.length;O<L;O++){let D=F[O];if(v(D,b)){let k=C.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,V=i.get(D).__webglTexture;t.bindTexture(k,V),x(k),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(C){if(o&&C.samples>0&&te(C)===!1){let b=C.textures,F=C.width,O=C.height,L=r.COLOR_BUFFER_BIT,D=[],k=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,V=i.get(C),z=b.length>1;if(z)for(let M=0;M<b.length;M++)t.bindFramebuffer(r.FRAMEBUFFER,V.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+M,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,V.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+M,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,V.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,V.__webglFramebuffer);for(let M=0;M<b.length;M++){D.push(r.COLOR_ATTACHMENT0+M),C.depthBuffer&&D.push(k);let Y=V.__ignoreDepthValues!==void 0&&V.__ignoreDepthValues;if(Y===!1&&(C.depthBuffer&&(L|=r.DEPTH_BUFFER_BIT),C.stencilBuffer&&(L|=r.STENCIL_BUFFER_BIT)),z&&r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,V.__webglColorRenderbuffer[M]),Y===!0&&(r.invalidateFramebuffer(r.READ_FRAMEBUFFER,[k]),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[k])),z){let N=i.get(b[M]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,N,0)}r.blitFramebuffer(0,0,F,O,0,0,F,O,L,r.NEAREST),c&&r.invalidateFramebuffer(r.READ_FRAMEBUFFER,D)}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),z)for(let M=0;M<b.length;M++){t.bindFramebuffer(r.FRAMEBUFFER,V.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+M,r.RENDERBUFFER,V.__webglColorRenderbuffer[M]);let Y=i.get(b[M]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,V.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+M,r.TEXTURE_2D,Y,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,V.__webglMultisampledFramebuffer)}},this.setupDepthRenderbuffer=he,this.setupFrameBufferTexture=X,this.useMultisampledRTT=te}function Fm(r,e,t){let i=t.isWebGL2;return{convert:function(n,s=""){let a,o=Ye.getTransfer(s);if(n===Dn)return r.UNSIGNED_BYTE;if(n===ku)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Bu)return r.UNSIGNED_SHORT_5_5_5_1;if(n===1010)return r.BYTE;if(n===1011)return r.SHORT;if(n===dc)return r.UNSIGNED_SHORT;if(n===Fu)return r.INT;if(n===nn)return r.UNSIGNED_INT;if(n===yi)return r.FLOAT;if(n===rs)return i?r.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(n===1021)return r.ALPHA;if(n===Gi)return r.RGBA;if(n===1024)return r.LUMINANCE;if(n===1025)return r.LUMINANCE_ALPHA;if(n===Nn)return r.DEPTH_COMPONENT;if(n===br)return r.DEPTH_STENCIL;if(n===Xu)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(n===Hu)return r.RED;if(n===Gu)return r.RED_INTEGER;if(n===1030)return r.RG;if(n===Vu)return r.RG_INTEGER;if(n===Wu)return r.RGBA_INTEGER;if(n===_o||n===bo||n===Mo||n===So)if(o===Ke){if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a===null)return null;if(n===_o)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===bo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Mo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===So)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(a=e.get("WEBGL_compressed_texture_s3tc"),a===null)return null;if(n===_o)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===bo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Mo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===So)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(n===Kc||n===Qc||n===eh||n===th){if(a=e.get("WEBGL_compressed_texture_pvrtc"),a===null)return null;if(n===Kc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===eh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===th)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(n===ju)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(n===ih||n===nh){if(a=e.get("WEBGL_compressed_texture_etc"),a===null)return null;if(n===ih)return o===Ke?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===nh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}if(n===rh||n===sh||n===ah||n===oh||n===lh||n===ch||n===hh||n===uh||n===dh||n===ph||n===mh||n===fh||n===gh||n===vh){if(a=e.get("WEBGL_compressed_texture_astc"),a===null)return null;if(n===rh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===sh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ah)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===oh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===lh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ch)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===hh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===uh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===dh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ph)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===mh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===gh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===vh)return o===Ke?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}if(n===wo||n===yh||n===xh){if(a=e.get("EXT_texture_compression_bptc"),a===null)return null;if(n===wo)return o===Ke?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===yh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(n===36283||n===_h||n===bh||n===Mh){if(a=e.get("EXT_texture_compression_rgtc"),a===null)return null;if(n===wo)return a.COMPRESSED_RED_RGTC1_EXT;if(n===_h)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Mh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return n===Un?i?r.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):r[n]!==void 0?r[n]:null}}}var Al=class extends Dt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},hi=class extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}},km={type:"move"},es=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let y of e.hand.values()){let g=t.getJointPose(y,i),f=this._getHandJoint(c,y);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,m=.005;c.inputState.pinching&&u>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(km)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new hi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},Rl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let n=new Ut;e.properties.get(n).__webglTexture=t.texture,t.depthNear==i.depthNear&&t.depthFar==i.depthFar||(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}render(e,t){if(this.texture!==null){if(this.mesh===null){let i=t.cameras[0].viewport,n=new Si({extensions:{fragDepth:!0},vertexShader:`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fragmentShader:`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new xt(new cn(20,20),n)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}},Cl=class extends ln{constructor(e,t){super();let i=this,n=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,m=null,y=new Rl,g=t.getContextAttributes(),f=null,v=null,x=[],_=[],R=new ne,E=null,S=new Dt;S.layers.enable(1),S.viewport=new dt;let T=new Dt;T.layers.enable(2),T.viewport=new dt;let I=[S,T],U=new Al;U.layers.enable(1),U.layers.enable(2);let j=null,P=null;function H(q){let te=_.indexOf(q.inputSource);if(te===-1)return;let _e=x[te];_e!==void 0&&(_e.update(q.inputSource,q.frame,c||a),_e.dispatchEvent({type:q.type,data:q.inputSource}))}function J(){n.removeEventListener("select",H),n.removeEventListener("selectstart",H),n.removeEventListener("selectend",H),n.removeEventListener("squeeze",H),n.removeEventListener("squeezestart",H),n.removeEventListener("squeezeend",H),n.removeEventListener("end",J),n.removeEventListener("inputsourceschange",se);for(let q=0;q<x.length;q++){let te=_[q];te!==null&&(_[q]=null,x[q].disconnect(te))}j=null,P=null,y.reset(),e.setRenderTarget(f),p=null,u=null,d=null,n=null,v=null,he.stop(),i.isPresenting=!1,e.setPixelRatio(E),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}function se(q){for(let te=0;te<q.removed.length;te++){let _e=q.removed[te],le=_.indexOf(_e);le>=0&&(_[le]=null,x[le].disconnect(_e))}for(let te=0;te<q.added.length;te++){let _e=q.added[te],le=_.indexOf(_e);if(le===-1){for(let b=0;b<x.length;b++){if(b>=_.length){_.push(_e),le=b;break}if(_[b]===null){_[b]=_e,le=b;break}}if(le===-1)break}let C=x[le];C&&C.connect(_e)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let te=x[q];return te===void 0&&(te=new es,x[q]=te),te.getTargetRaySpace()},this.getControllerGrip=function(q){let te=x[q];return te===void 0&&(te=new es,x[q]=te),te.getGripSpace()},this.getHand=function(q){let te=x[q];return te===void 0&&(te=new es,x[q]=te),te.getHandSpace()},this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(q){if(n=q,n!==null){if(f=e.getRenderTarget(),n.addEventListener("select",H),n.addEventListener("selectstart",H),n.addEventListener("selectend",H),n.addEventListener("squeeze",H),n.addEventListener("squeezestart",H),n.addEventListener("squeezeend",H),n.addEventListener("end",J),n.addEventListener("inputsourceschange",se),g.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(R),n.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let te={antialias:n.renderState.layers!==void 0||g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(n,t,te),n.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new Wi(p.framebufferWidth,p.framebufferHeight,{format:Gi,type:Dn,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let te=null,_e=null,le=null;g.depth&&(le=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=g.stencil?br:Nn,_e=g.stencil?Un:nn);let C={colorFormat:t.RGBA8,depthFormat:le,scaleFactor:s};d=new XRWebGLBinding(n,t),u=d.createProjectionLayer(C),n.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),v=new Wi(u.textureWidth,u.textureHeight,{format:Gi,type:Dn,depthTexture:new Ia(u.textureWidth,u.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0}),e.properties.get(v).__ignoreDepthValues=u.ignoreDepthValues}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),he.setContext(n),he.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode};let de=new w,K=new w;function X(q,te){te===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(te.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(n===null)return;y.texture!==null&&(q.near=y.depthNear,q.far=y.depthFar),U.near=T.near=S.near=q.near,U.far=T.far=S.far=q.far,j===U.near&&P===U.far||(n.updateRenderState({depthNear:U.near,depthFar:U.far}),j=U.near,P=U.far,S.near=j,S.far=P,T.near=j,T.far=P,S.updateProjectionMatrix(),T.updateProjectionMatrix(),q.updateProjectionMatrix());let te=q.parent,_e=U.cameras;X(U,te);for(let le=0;le<_e.length;le++)X(_e[le],te);_e.length===2?function(le,C,b){de.setFromMatrixPosition(C.matrixWorld),K.setFromMatrixPosition(b.matrixWorld);let F=de.distanceTo(K),O=C.projectionMatrix.elements,L=b.projectionMatrix.elements,D=O[14]/(O[10]-1),k=O[14]/(O[10]+1),V=(O[9]+1)/O[5],z=(O[9]-1)/O[5],M=(O[8]-1)/O[0],Y=(L[8]+1)/L[0],N=D*M,re=D*Y,ee=F/(-M+Y),oe=ee*-M;C.matrixWorld.decompose(le.position,le.quaternion,le.scale),le.translateX(oe),le.translateZ(ee),le.matrixWorld.compose(le.position,le.quaternion,le.scale),le.matrixWorldInverse.copy(le.matrixWorld).invert();let ye=D+ee,fe=k+ee,xe=N-oe,me=re+(F-oe),Ne=V*k/fe*ye,De=z*k/fe*ye;le.projectionMatrix.makePerspective(xe,me,Ne,De,ye,fe),le.projectionMatrixInverse.copy(le.projectionMatrix).invert()}(U,S,T):U.projectionMatrix.copy(S.projectionMatrix),function(le,C,b){b===null?le.matrix.copy(C.matrixWorld):(le.matrix.copy(b.matrixWorld),le.matrix.invert(),le.matrix.multiply(C.matrixWorld)),le.matrix.decompose(le.position,le.quaternion,le.scale),le.updateMatrixWorld(!0),le.projectionMatrix.copy(C.projectionMatrix),le.projectionMatrixInverse.copy(C.projectionMatrixInverse),le.isPerspectiveCamera&&(le.fov=2*pl*Math.atan(1/le.projectionMatrix.elements[5]),le.zoom=1)}(q,U,te)},this.getCamera=function(){return U},this.getFoveation=function(){if(u!==null||p!==null)return l},this.setFoveation=function(q){l=q,u!==null&&(u.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return y.texture!==null};let Q=null,he=new Ju;he.setAnimationLoop(function(q,te){if(h=te.getViewerPose(c||a),m=te,h!==null){let _e=h.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let le=!1;_e.length!==U.cameras.length&&(U.cameras.length=0,le=!0);for(let b=0;b<_e.length;b++){let F=_e[b],O=null;if(p!==null)O=p.getViewport(F);else{let D=d.getViewSubImage(u,F);O=D.viewport,b===0&&(e.setRenderTargetTextures(v,D.colorTexture,u.ignoreDepthValues?void 0:D.depthStencilTexture),e.setRenderTarget(v))}let L=I[b];L===void 0&&(L=new Dt,L.layers.enable(b),L.viewport=new dt,I[b]=L),L.matrix.fromArray(F.transform.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale),L.projectionMatrix.fromArray(F.projectionMatrix),L.projectionMatrixInverse.copy(L.projectionMatrix).invert(),L.viewport.set(O.x,O.y,O.width,O.height),b===0&&(U.matrix.copy(L.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),le===!0&&U.cameras.push(L)}let C=n.enabledFeatures;if(C&&C.includes("depth-sensing")){let b=d.getDepthInformation(_e[0]);b&&b.isValid&&b.texture&&y.init(e,b,n.renderState)}}for(let _e=0;_e<x.length;_e++){let le=_[_e],C=x[_e];le!==null&&C!==void 0&&C.update(le,te,c||a)}y.render(e,U),Q&&Q(q,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),m=null}),this.setAnimationLoop=function(q){Q=q},this.dispose=function(){}}},Rn=new bi,Bm=new Le;function Hm(r,e){function t(n,s){n.matrixAutoUpdate===!0&&n.updateMatrix(),s.value.copy(n.matrix)}function i(n,s){n.opacity.value=s.opacity,s.color&&n.diffuse.value.copy(s.color),s.emissive&&n.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(n.map.value=s.map,t(s.map,n.mapTransform)),s.alphaMap&&(n.alphaMap.value=s.alphaMap,t(s.alphaMap,n.alphaMapTransform)),s.bumpMap&&(n.bumpMap.value=s.bumpMap,t(s.bumpMap,n.bumpMapTransform),n.bumpScale.value=s.bumpScale,s.side===Bt&&(n.bumpScale.value*=-1)),s.normalMap&&(n.normalMap.value=s.normalMap,t(s.normalMap,n.normalMapTransform),n.normalScale.value.copy(s.normalScale),s.side===Bt&&n.normalScale.value.negate()),s.displacementMap&&(n.displacementMap.value=s.displacementMap,t(s.displacementMap,n.displacementMapTransform),n.displacementScale.value=s.displacementScale,n.displacementBias.value=s.displacementBias),s.emissiveMap&&(n.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,n.emissiveMapTransform)),s.specularMap&&(n.specularMap.value=s.specularMap,t(s.specularMap,n.specularMapTransform)),s.alphaTest>0&&(n.alphaTest.value=s.alphaTest);let a=e.get(s),o=a.envMap,l=a.envMapRotation;if(o&&(n.envMap.value=o,Rn.copy(l),Rn.x*=-1,Rn.y*=-1,Rn.z*=-1,o.isCubeTexture&&o.isRenderTargetTexture===!1&&(Rn.y*=-1,Rn.z*=-1),n.envMapRotation.value.setFromMatrix4(Bm.makeRotationFromEuler(Rn)),n.flipEnvMap.value=o.isCubeTexture&&o.isRenderTargetTexture===!1?-1:1,n.reflectivity.value=s.reflectivity,n.ior.value=s.ior,n.refractionRatio.value=s.refractionRatio),s.lightMap){n.lightMap.value=s.lightMap;let c=r._useLegacyLights===!0?Math.PI:1;n.lightMapIntensity.value=s.lightMapIntensity*c,t(s.lightMap,n.lightMapTransform)}s.aoMap&&(n.aoMap.value=s.aoMap,n.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,n.aoMapTransform))}return{refreshFogUniforms:function(n,s){s.color.getRGB(n.fogColor.value,Zu(r)),s.isFog?(n.fogNear.value=s.near,n.fogFar.value=s.far):s.isFogExp2&&(n.fogDensity.value=s.density)},refreshMaterialUniforms:function(n,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?i(n,s):s.isMeshToonMaterial?(i(n,s),function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)}(n,s)):s.isMeshPhongMaterial?(i(n,s),function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)}(n,s)):s.isMeshStandardMaterial?(i(n,s),function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),e.get(h).envMap&&(c.envMapIntensity.value=h.envMapIntensity)}(n,s),s.isMeshPhysicalMaterial&&function(c,h,d){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Bt&&c.clearcoatNormalScale.value.negate())),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=d.texture,c.transmissionSamplerSize.value.set(d.width,d.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))}(n,s,l)):s.isMeshMatcapMaterial?(i(n,s),function(c,h){h.matcap&&(c.matcap.value=h.matcap)}(n,s)):s.isMeshDepthMaterial?i(n,s):s.isMeshDistanceMaterial?(i(n,s),function(c,h){let d=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(d.matrixWorld),c.nearDistance.value=d.shadow.camera.near,c.farDistance.value=d.shadow.camera.far}(n,s)):s.isMeshNormalMaterial?i(n,s):s.isLineBasicMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))}(n,s),s.isLineDashedMaterial&&function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale}(n,s)):s.isPointsMaterial?function(c,h,d,u){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*d,c.scale.value=.5*u,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)}(n,s,a,o):s.isSpriteMaterial?function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)}(n,s):s.isShadowMaterial?(n.color.value.copy(s.color),n.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function Gm(r,e,t,i){let n={},s={},a=[],o=t.isWebGL2?r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(d,u,p,m){let y=d.value,g=u+"_"+p;if(m[g]===void 0)return m[g]=typeof y=="number"||typeof y=="boolean"?y:y.clone(),!0;{let f=m[g];if(typeof y=="number"||typeof y=="boolean"){if(f!==y)return m[g]=y,!0}else if(f.equals(y)===!1)return f.copy(y),!0}return!1}function c(d){let u={boundary:0,storage:0};return typeof d=="number"||typeof d=="boolean"?(u.boundary=4,u.storage=4):d.isVector2?(u.boundary=8,u.storage=8):d.isVector3||d.isColor?(u.boundary=16,u.storage=12):d.isVector4?(u.boundary=16,u.storage=16):d.isMatrix3?(u.boundary=48,u.storage=48):d.isMatrix4?(u.boundary=64,u.storage=64):d.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",d),u}function h(d){let u=d.target;u.removeEventListener("dispose",h);let p=a.indexOf(u.__bindingPointIndex);a.splice(p,1),r.deleteBuffer(n[u.id]),delete n[u.id],delete s[u.id]}return{bind:function(d,u){let p=u.program;i.uniformBlockBinding(d,p)},update:function(d,u){let p=n[d.id];p===void 0&&(function(g){let f=g.uniforms,v=0,x=16;for(let R=0,E=f.length;R<E;R++){let S=Array.isArray(f[R])?f[R]:[f[R]];for(let T=0,I=S.length;T<I;T++){let U=S[T],j=Array.isArray(U.value)?U.value:[U.value];for(let P=0,H=j.length;P<H;P++){let J=c(j[P]),se=v%x;se!==0&&x-se<J.boundary&&(v+=x-se),U.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=v,v+=J.storage}}}let _=v%x;_>0&&(v+=x-_),g.__size=v,g.__cache={}}(d),p=function(g){let f=function(){for(let R=0;R<o;R++)if(a.indexOf(R)===-1)return a.push(R),R;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}();g.__bindingPointIndex=f;let v=r.createBuffer(),x=g.__size,_=g.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,x,_),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,f,v),v}(d),n[d.id]=p,d.addEventListener("dispose",h));let m=u.program;i.updateUBOMapping(d,m);let y=e.render.frame;s[d.id]!==y&&(function(g){let f=n[g.id],v=g.uniforms,x=g.__cache;r.bindBuffer(r.UNIFORM_BUFFER,f);for(let _=0,R=v.length;_<R;_++){let E=Array.isArray(v[_])?v[_]:[v[_]];for(let S=0,T=E.length;S<T;S++){let I=E[S];if(l(I,_,S,x)===!0){let U=I.__offset,j=Array.isArray(I.value)?I.value:[I.value],P=0;for(let H=0;H<j.length;H++){let J=j[H],se=c(J);typeof J=="number"||typeof J=="boolean"?(I.__data[0]=J,r.bufferSubData(r.UNIFORM_BUFFER,U+P,I.__data)):J.isMatrix3?(I.__data[0]=J.elements[0],I.__data[1]=J.elements[1],I.__data[2]=J.elements[2],I.__data[3]=0,I.__data[4]=J.elements[3],I.__data[5]=J.elements[4],I.__data[6]=J.elements[5],I.__data[7]=0,I.__data[8]=J.elements[6],I.__data[9]=J.elements[7],I.__data[10]=J.elements[8],I.__data[11]=0):(J.toArray(I.__data,P),P+=se.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,U,I.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}(d),s[d.id]=y)},dispose:function(){for(let d in n)r.deleteBuffer(n[d]);a=[],n={},s={}}}}var Ar=class{constructor(e={}){let{canvas:t=Yd(),context:i=null,depth:n=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e,u;this.isWebGLRenderer=!0,u=i!==null?i.getContextAttributes().alpha:a;let p=new Uint32Array(4),m=new Int32Array(4),y=null,g=null,f=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kt,this._useLegacyLights=!1,this.toneMapping=sn,this.toneMappingExposure=1;let x=this,_=!1,R=0,E=0,S=null,T=-1,I=null,U=new dt,j=new dt,P=null,H=new Pe(0),J=0,se=t.width,de=t.height,K=1,X=null,Q=null,he=new dt(0,0,se,de),q=new dt(0,0,se,de),te=!1,_e=new Er,le=!1,C=!1,b=null,F=new Le,O=new ne,L=new w,D={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function k(){return S===null?K:1}let V,z,M,Y,N,re,ee,oe,ye,fe,xe,me,Ne,De,et,ve,Be,lt,we,tt,je,Xt,Li,Qt,W=i;function fn(A,G){for(let $=0;$<A.length;$++){let ie=A[$],Z=t.getContext(ie,G);if(Z!==null)return Z}return null}try{let A={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${sl}`),t.addEventListener("webglcontextlost",Tc,!1),t.addEventListener("webglcontextrestored",Ac,!1),t.addEventListener("webglcontextcreationerror",Rc,!1),W===null){let G=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&G.shift(),W=fn(G,A),W===null)throw fn(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}function zr(){V=new Mp(W),z=new yp(W,V,e),V.init(z),Xt=new Fm(W,V,z),M=new Om(W,V,z),Y=new Ep(W),N=new Am,re=new zm(W,V,M,N,z,Xt,Y),ee=new _p(x),oe=new bp(x),ye=new pp(W,z),Li=new gp(W,V,ye,z),fe=new Sp(W,ye,Y,Li),xe=new Cp(W,fe,ye,Y),we=new Rp(W,z,re),ve=new xp(N),me=new Tm(x,ee,oe,V,z,Li,ve),Ne=new Hm(x,N),De=new Cm,et=new Um(V,z),lt=new fp(x,ee,oe,M,xe,u,l),Be=new Nm(x,xe,z),Qt=new Gm(W,Y,z,M),tt=new vp(W,V,Y,z),je=new wp(W,V,Y,z),Y.programs=me.programs,x.capabilities=z,x.extensions=V,x.properties=N,x.renderLists=De,x.shadowMap=Be,x.state=M,x.info=Y}zr();let Tt=new Cl(x,W);function Tc(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function Ac(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;let A=Y.autoReset,G=Be.enabled,$=Be.autoUpdate,ie=Be.needsUpdate,Z=Be.type;zr(),Y.autoReset=A,Be.enabled=G,Be.autoUpdate=$,Be.needsUpdate=ie,Be.type=Z}function Rc(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Cc(A){let G=A.target;G.removeEventListener("dispose",Cc),function($){(function(ie){let Z=N.get(ie).programs;Z!==void 0&&(Z.forEach(function(pe){me.releaseProgram(pe)}),ie.isShaderMaterial&&me.releaseShaderCache(ie))})($),N.remove($)}(G)}function Lc(A,G,$){A.transparent===!0&&A.side===2&&A.forceSinglePass===!1?(A.side=Bt,A.needsUpdate=!0,Ds(A,G,$),A.side=on,A.needsUpdate=!0,Ds(A,G,$),A.side=2):Ds(A,G,$)}this.xr=Tt,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){let A=V.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=V.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(A){A!==void 0&&(K=A,this.setSize(se,de,!1))},this.getSize=function(A){return A.set(se,de)},this.setSize=function(A,G,$=!0){Tt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(se=A,de=G,t.width=Math.floor(A*K),t.height=Math.floor(G*K),$===!0&&(t.style.width=A+"px",t.style.height=G+"px"),this.setViewport(0,0,A,G))},this.getDrawingBufferSize=function(A){return A.set(se*K,de*K).floor()},this.setDrawingBufferSize=function(A,G,$){se=A,de=G,K=$,t.width=Math.floor(A*$),t.height=Math.floor(G*$),this.setViewport(0,0,A,G)},this.getCurrentViewport=function(A){return A.copy(U)},this.getViewport=function(A){return A.copy(he)},this.setViewport=function(A,G,$,ie){A.isVector4?he.set(A.x,A.y,A.z,A.w):he.set(A,G,$,ie),M.viewport(U.copy(he).multiplyScalar(K).round())},this.getScissor=function(A){return A.copy(q)},this.setScissor=function(A,G,$,ie){A.isVector4?q.set(A.x,A.y,A.z,A.w):q.set(A,G,$,ie),M.scissor(j.copy(q).multiplyScalar(K).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(A){M.setScissorTest(te=A)},this.setOpaqueSort=function(A){X=A},this.setTransparentSort=function(A){Q=A},this.getClearColor=function(A){return A.copy(lt.getClearColor())},this.setClearColor=function(){lt.setClearColor.apply(lt,arguments)},this.getClearAlpha=function(){return lt.getClearAlpha()},this.setClearAlpha=function(){lt.setClearAlpha.apply(lt,arguments)},this.clear=function(A=!0,G=!0,$=!0){let ie=0;if(A){let Z=!1;if(S!==null){let pe=S.texture.format;Z=pe===Wu||pe===Vu||pe===Gu}if(Z){let pe=S.texture.type,Me=pe===Dn||pe===nn||pe===dc||pe===Un||pe===ku||pe===Bu,Ee=lt.getClearColor(),Oe=lt.getClearAlpha(),Fe=Ee.r,ke=Ee.g,He=Ee.b;Me?(p[0]=Fe,p[1]=ke,p[2]=He,p[3]=Oe,W.clearBufferuiv(W.COLOR,0,p)):(m[0]=Fe,m[1]=ke,m[2]=He,m[3]=Oe,W.clearBufferiv(W.COLOR,0,m))}else ie|=W.COLOR_BUFFER_BIT}G&&(ie|=W.DEPTH_BUFFER_BIT),$&&(ie|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Tc,!1),t.removeEventListener("webglcontextrestored",Ac,!1),t.removeEventListener("webglcontextcreationerror",Rc,!1),De.dispose(),et.dispose(),N.dispose(),ee.dispose(),oe.dispose(),xe.dispose(),Li.dispose(),Qt.dispose(),me.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",Pc),Tt.removeEventListener("sessionend",Ic),b&&(b.dispose(),b=null),gn.stop()},this.renderBufferDirect=function(A,G,$,ie,Z,pe){G===null&&(G=D);let Me=Z.isMesh&&Z.matrixWorld.determinant()<0,Ee=function(pt,$t,Ot,Ge,ze){$t.isScene!==!0&&($t=D),re.resetTextureUnits();let Fr=$t.fog,uo=Ge.isMeshStandardMaterial?$t.environment:null,Rd=S===null?x.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:hn,Us=(Ge.isMeshStandardMaterial?oe:ee).get(Ge.envMap||uo),Cd=Ge.vertexColors===!0&&!!Ot.attributes.color&&Ot.attributes.color.itemSize===4,Ld=!!Ot.attributes.tangent&&(!!Ge.normalMap||Ge.anisotropy>0),Pd=!!Ot.morphAttributes.position,Id=!!Ot.morphAttributes.normal,Dd=!!Ot.morphAttributes.color,Fc=sn;Ge.toneMapped&&(S!==null&&S.isXRRenderTarget!==!0||(Fc=x.toneMapping));let kc=Ot.morphAttributes.position||Ot.morphAttributes.normal||Ot.morphAttributes.color,Ud=kc!==void 0?kc.length:0,Ve=N.get(Ge),Nd=g.state.lights;if(le===!0&&(C===!0||pt!==I)){let qt=pt===I&&Ge.id===T;ve.setState(Ge,pt,qt)}let ti=!1;Ge.version===Ve.__version?Ve.needsLights&&Ve.lightsStateVersion!==Nd.state.version||Ve.outputColorSpace!==Rd||ze.isBatchedMesh&&Ve.batching===!1?ti=!0:ze.isBatchedMesh||Ve.batching!==!0?ze.isInstancedMesh&&Ve.instancing===!1?ti=!0:ze.isInstancedMesh||Ve.instancing!==!0?ze.isSkinnedMesh&&Ve.skinning===!1?ti=!0:ze.isSkinnedMesh||Ve.skinning!==!0?ze.isInstancedMesh&&Ve.instancingColor===!0&&ze.instanceColor===null||ze.isInstancedMesh&&Ve.instancingColor===!1&&ze.instanceColor!==null||ze.isInstancedMesh&&Ve.instancingMorph===!0&&ze.morphTexture===null||ze.isInstancedMesh&&Ve.instancingMorph===!1&&ze.morphTexture!==null||Ve.envMap!==Us||Ge.fog===!0&&Ve.fog!==Fr?ti=!0:Ve.numClippingPlanes===void 0||Ve.numClippingPlanes===ve.numPlanes&&Ve.numIntersection===ve.numIntersection?(Ve.vertexAlphas!==Cd||Ve.vertexTangents!==Ld||Ve.morphTargets!==Pd||Ve.morphNormals!==Id||Ve.morphColors!==Dd||Ve.toneMapping!==Fc||z.isWebGL2===!0&&Ve.morphTargetsCount!==Ud)&&(ti=!0):ti=!0:ti=!0:ti=!0:ti=!0:(ti=!0,Ve.__version=Ge.version);let yn=Ve.currentProgram;ti===!0&&(yn=Ds(Ge,$t,ze));let Bc=!1,kr=!1,po=!1,At=yn.getUniforms(),xn=Ve.uniforms;if(M.useProgram(yn.program)&&(Bc=!0,kr=!0,po=!0),Ge.id!==T&&(T=Ge.id,kr=!0),Bc||I!==pt){At.setValue(W,"projectionMatrix",pt.projectionMatrix),At.setValue(W,"viewMatrix",pt.matrixWorldInverse);let qt=At.map.cameraPosition;qt!==void 0&&qt.setValue(W,L.setFromMatrixPosition(pt.matrixWorld)),z.logarithmicDepthBuffer&&At.setValue(W,"logDepthBufFC",2/(Math.log(pt.far+1)/Math.LN2)),(Ge.isMeshPhongMaterial||Ge.isMeshToonMaterial||Ge.isMeshLambertMaterial||Ge.isMeshBasicMaterial||Ge.isMeshStandardMaterial||Ge.isShaderMaterial)&&At.setValue(W,"isOrthographic",pt.isOrthographicCamera===!0),I!==pt&&(I=pt,kr=!0,po=!0)}if(ze.isSkinnedMesh){At.setOptional(W,ze,"bindMatrix"),At.setOptional(W,ze,"bindMatrixInverse");let qt=ze.skeleton;qt&&(z.floatVertexTextures?(qt.boneTexture===null&&qt.computeBoneTexture(),At.setValue(W,"boneTexture",qt.boneTexture,re)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}ze.isBatchedMesh&&(At.setOptional(W,ze,"batchingTexture"),At.setValue(W,"batchingTexture",ze._matricesTexture,re));let mo=Ot.morphAttributes;(mo.position!==void 0||mo.normal!==void 0||mo.color!==void 0&&z.isWebGL2===!0)&&we.update(ze,Ot,yn),(kr||Ve.receiveShadow!==ze.receiveShadow)&&(Ve.receiveShadow=ze.receiveShadow,At.setValue(W,"receiveShadow",ze.receiveShadow)),Ge.isMeshGouraudMaterial&&Ge.envMap!==null&&(xn.envMap.value=Us,xn.flipEnvMap.value=Us.isCubeTexture&&Us.isRenderTargetTexture===!1?-1:1),kr&&(At.setValue(W,"toneMappingExposure",x.toneMappingExposure),Ve.needsLights&&(ii=po,(mi=xn).ambientLightColor.needsUpdate=ii,mi.lightProbe.needsUpdate=ii,mi.directionalLights.needsUpdate=ii,mi.directionalLightShadows.needsUpdate=ii,mi.pointLights.needsUpdate=ii,mi.pointLightShadows.needsUpdate=ii,mi.spotLights.needsUpdate=ii,mi.spotLightShadows.needsUpdate=ii,mi.rectAreaLights.needsUpdate=ii,mi.hemisphereLights.needsUpdate=ii),Fr&&Ge.fog===!0&&Ne.refreshFogUniforms(xn,Fr),Ne.refreshMaterialUniforms(xn,Ge,K,de,b),yr.upload(W,Oc(Ve),xn,re));var mi,ii;if(Ge.isShaderMaterial&&Ge.uniformsNeedUpdate===!0&&(yr.upload(W,Oc(Ve),xn,re),Ge.uniformsNeedUpdate=!1),Ge.isSpriteMaterial&&At.setValue(W,"center",ze.center),At.setValue(W,"modelViewMatrix",ze.modelViewMatrix),At.setValue(W,"normalMatrix",ze.normalMatrix),At.setValue(W,"modelMatrix",ze.matrixWorld),Ge.isShaderMaterial||Ge.isRawShaderMaterial){let qt=Ge.uniformsGroups;for(let fo=0,Od=qt.length;fo<Od;fo++)if(z.isWebGL2){let Hc=qt[fo];Qt.update(Hc,yn),Qt.bind(Hc,yn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return yn}(A,G,$,ie,Z);M.setMaterial(ie,Me);let Oe=$.index,Fe=1;if(ie.wireframe===!0){if(Oe=fe.getWireframeAttribute($),Oe===void 0)return;Fe=2}let ke=$.drawRange,He=$.attributes.position,nt=ke.start*Fe,ei=(ke.start+ke.count)*Fe;pe!==null&&(nt=Math.max(nt,pe.start*Fe),ei=Math.min(ei,(pe.start+pe.count)*Fe)),Oe!==null?(nt=Math.max(nt,0),ei=Math.min(ei,Oe.count)):He!=null&&(nt=Math.max(nt,0),ei=Math.min(ei,He.count));let Pi=ei-nt;if(Pi<0||Pi===1/0)return;let vn;Li.setup(Z,ie,Ee,$,Oe);let rt=tt;if(Oe!==null&&(vn=ye.get(Oe),rt=je,rt.setIndex(vn)),Z.isMesh)ie.wireframe===!0?(M.setLineWidth(ie.wireframeLinewidth*k()),rt.setMode(W.LINES)):rt.setMode(W.TRIANGLES);else if(Z.isLine){let pt=ie.linewidth;pt===void 0&&(pt=1),M.setLineWidth(pt*k()),Z.isLineSegments?rt.setMode(W.LINES):Z.isLineLoop?rt.setMode(W.LINE_LOOP):rt.setMode(W.LINE_STRIP)}else Z.isPoints?rt.setMode(W.POINTS):Z.isSprite&&rt.setMode(W.TRIANGLES);if(Z.isBatchedMesh)rt.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else if(Z.isInstancedMesh)rt.renderInstances(nt,Pi,Z.count);else if($.isInstancedBufferGeometry){let pt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,$t=Math.min($.instanceCount,pt);rt.renderInstances(nt,Pi,$t)}else rt.render(nt,Pi)},this.compile=function(A,G,$=null){$===null&&($=A),g=et.get($),g.init(),v.push(g),$.traverseVisible(function(Z){Z.isLight&&Z.layers.test(G.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),A!==$&&A.traverseVisible(function(Z){Z.isLight&&Z.layers.test(G.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),g.setupLights(x._useLegacyLights);let ie=new Set;return A.traverse(function(Z){let pe=Z.material;if(pe)if(Array.isArray(pe))for(let Me=0;Me<pe.length;Me++){let Ee=pe[Me];Lc(Ee,$,Z),ie.add(Ee)}else Lc(pe,$,Z),ie.add(pe)}),v.pop(),g=null,ie},this.compileAsync=function(A,G,$=null){let ie=this.compile(A,G,$);return new Promise(Z=>{function pe(){ie.forEach(function(Me){N.get(Me).currentProgram.isReady()&&ie.delete(Me)}),ie.size!==0?setTimeout(pe,10):Z(A)}V.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let ho=null;function Pc(){gn.stop()}function Ic(){gn.start()}let gn=new Ju;function Dc(A,G,$,ie){if(A.visible===!1)return;if(A.layers.test(G.layers)){if(A.isGroup)$=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(G);else if(A.isLight)g.pushLight(A),A.castShadow&&g.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||_e.intersectsSprite(A)){ie&&L.setFromMatrixPosition(A.matrixWorld).applyMatrix4(F);let pe=xe.update(A),Me=A.material;Me.visible&&y.push(A,pe,Me,$,L.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||_e.intersectsObject(A))){let pe=xe.update(A),Me=A.material;if(ie&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),L.copy(A.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),L.copy(pe.boundingSphere.center)),L.applyMatrix4(A.matrixWorld).applyMatrix4(F)),Array.isArray(Me)){let Ee=pe.groups;for(let Oe=0,Fe=Ee.length;Oe<Fe;Oe++){let ke=Ee[Oe],He=Me[ke.materialIndex];He&&He.visible&&y.push(A,pe,He,$,L.z,ke)}}else Me.visible&&y.push(A,pe,Me,$,L.z,null)}}let Z=A.children;for(let pe=0,Me=Z.length;pe<Me;pe++)Dc(Z[pe],G,$,ie)}function Uc(A,G,$,ie){let Z=A.opaque,pe=A.transmissive,Me=A.transparent;g.setupLightsView($),le===!0&&ve.setGlobalState(x.clippingPlanes,$),pe.length>0&&function(Ee,Oe,Fe,ke){if((Fe.isScene===!0?Fe.overrideMaterial:null)!==null)return;let nt=z.isWebGL2;b===null&&(b=new Wi(1,1,{generateMipmaps:!0,type:V.has("EXT_color_buffer_half_float")?rs:Dn,minFilter:fr,samples:nt?4:0})),x.getDrawingBufferSize(O),nt?b.setSize(O.x,O.y):b.setSize(ml(O.x),ml(O.y));let ei=x.getRenderTarget();x.setRenderTarget(b),x.getClearColor(H),J=x.getClearAlpha(),J<1&&x.setClearColor(16777215,.5),x.clear();let Pi=x.toneMapping;x.toneMapping=sn,Is(Ee,Fe,ke),re.updateMultisampleRenderTarget(b),re.updateRenderTargetMipmap(b);let vn=!1;for(let rt=0,pt=Oe.length;rt<pt;rt++){let $t=Oe[rt],Ot=$t.object,Ge=$t.geometry,ze=$t.material,Fr=$t.group;if(ze.side===2&&Ot.layers.test(ke.layers)){let uo=ze.side;ze.side=Bt,ze.needsUpdate=!0,Nc(Ot,Fe,ke,Ge,ze,Fr),ze.side=uo,ze.needsUpdate=!0,vn=!0}}vn===!0&&(re.updateMultisampleRenderTarget(b),re.updateRenderTargetMipmap(b)),x.setRenderTarget(ei),x.setClearColor(H,J),x.toneMapping=Pi}(Z,pe,G,$),ie&&M.viewport(U.copy(ie)),Z.length>0&&Is(Z,G,$),pe.length>0&&Is(pe,G,$),Me.length>0&&Is(Me,G,$),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Is(A,G,$){let ie=G.isScene===!0?G.overrideMaterial:null;for(let Z=0,pe=A.length;Z<pe;Z++){let Me=A[Z],Ee=Me.object,Oe=Me.geometry,Fe=ie===null?Me.material:ie,ke=Me.group;Ee.layers.test($.layers)&&Nc(Ee,G,$,Oe,Fe,ke)}}function Nc(A,G,$,ie,Z,pe){A.onBeforeRender(x,G,$,ie,Z,pe),A.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Z.onBeforeRender(x,G,$,ie,A,pe),Z.transparent===!0&&Z.side===2&&Z.forceSinglePass===!1?(Z.side=Bt,Z.needsUpdate=!0,x.renderBufferDirect($,G,ie,Z,A,pe),Z.side=on,Z.needsUpdate=!0,x.renderBufferDirect($,G,ie,Z,A,pe),Z.side=2):x.renderBufferDirect($,G,ie,Z,A,pe),A.onAfterRender(x,G,$,ie,Z,pe)}function Ds(A,G,$){G.isScene!==!0&&(G=D);let ie=N.get(A),Z=g.state.lights,pe=g.state.shadowsArray,Me=Z.state.version,Ee=me.getParameters(A,Z.state,pe,G,$),Oe=me.getProgramCacheKey(Ee),Fe=ie.programs;ie.environment=A.isMeshStandardMaterial?G.environment:null,ie.fog=G.fog,ie.envMap=(A.isMeshStandardMaterial?oe:ee).get(A.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&A.envMap===null?G.environmentRotation:A.envMapRotation,Fe===void 0&&(A.addEventListener("dispose",Cc),Fe=new Map,ie.programs=Fe);let ke=Fe.get(Oe);if(ke!==void 0){if(ie.currentProgram===ke&&ie.lightsStateVersion===Me)return zc(A,Ee),ke}else Ee.uniforms=me.getUniforms(A),A.onBuild($,Ee,x),A.onBeforeCompile(Ee,x),ke=me.acquireProgram(Ee,Oe),Fe.set(Oe,ke),ie.uniforms=Ee.uniforms;let He=ie.uniforms;return(A.isShaderMaterial||A.isRawShaderMaterial)&&A.clipping!==!0||(He.clippingPlanes=ve.uniform),zc(A,Ee),ie.needsLights=function(nt){return nt.isMeshLambertMaterial||nt.isMeshToonMaterial||nt.isMeshPhongMaterial||nt.isMeshStandardMaterial||nt.isShadowMaterial||nt.isShaderMaterial&&nt.lights===!0}(A),ie.lightsStateVersion=Me,ie.needsLights&&(He.ambientLightColor.value=Z.state.ambient,He.lightProbe.value=Z.state.probe,He.directionalLights.value=Z.state.directional,He.directionalLightShadows.value=Z.state.directionalShadow,He.spotLights.value=Z.state.spot,He.spotLightShadows.value=Z.state.spotShadow,He.rectAreaLights.value=Z.state.rectArea,He.ltc_1.value=Z.state.rectAreaLTC1,He.ltc_2.value=Z.state.rectAreaLTC2,He.pointLights.value=Z.state.point,He.pointLightShadows.value=Z.state.pointShadow,He.hemisphereLights.value=Z.state.hemi,He.directionalShadowMap.value=Z.state.directionalShadowMap,He.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,He.spotShadowMap.value=Z.state.spotShadowMap,He.spotLightMatrix.value=Z.state.spotLightMatrix,He.spotLightMap.value=Z.state.spotLightMap,He.pointShadowMap.value=Z.state.pointShadowMap,He.pointShadowMatrix.value=Z.state.pointShadowMatrix),ie.currentProgram=ke,ie.uniformsList=null,ke}function Oc(A){if(A.uniformsList===null){let G=A.currentProgram.getUniforms();A.uniformsList=yr.seqWithValue(G.seq,A.uniforms)}return A.uniformsList}function zc(A,G){let $=N.get(A);$.outputColorSpace=G.outputColorSpace,$.batching=G.batching,$.instancing=G.instancing,$.instancingColor=G.instancingColor,$.instancingMorph=G.instancingMorph,$.skinning=G.skinning,$.morphTargets=G.morphTargets,$.morphNormals=G.morphNormals,$.morphColors=G.morphColors,$.morphTargetsCount=G.morphTargetsCount,$.numClippingPlanes=G.numClippingPlanes,$.numIntersection=G.numClipIntersection,$.vertexAlphas=G.vertexAlphas,$.vertexTangents=G.vertexTangents,$.toneMapping=G.toneMapping}gn.setAnimationLoop(function(A){ho&&ho(A)}),typeof self<"u"&&gn.setContext(self),this.setAnimationLoop=function(A){ho=A,Tt.setAnimationLoop(A),A===null?gn.stop():gn.start()},Tt.addEventListener("sessionstart",Pc),Tt.addEventListener("sessionend",Ic),this.render=function(A,G){if(G!==void 0&&G.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(_===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(G),G=Tt.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,G,S),g=et.get(A,v.length),g.init(),v.push(g),F.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),_e.setFromProjectionMatrix(F),C=this.localClippingEnabled,le=ve.init(this.clippingPlanes,C),y=De.get(A,f.length),y.init(),f.push(y),Dc(A,G,0,x.sortObjects),y.finish(),x.sortObjects===!0&&y.sort(X,Q),this.info.render.frame++,le===!0&&ve.beginShadows();let $=g.state.shadowsArray;if(Be.render($,A,G),le===!0&&ve.endShadows(),this.info.autoReset===!0&&this.info.reset(),Tt.enabled!==!1&&Tt.isPresenting!==!1&&Tt.hasDepthSensing()!==!1||lt.render(y,A),g.setupLights(x._useLegacyLights),G.isArrayCamera){let ie=G.cameras;for(let Z=0,pe=ie.length;Z<pe;Z++){let Me=ie[Z];Uc(y,A,Me,Me.viewport)}}else Uc(y,A,G);S!==null&&(re.updateMultisampleRenderTarget(S),re.updateRenderTargetMipmap(S)),A.isScene===!0&&A.onAfterRender(x,A,G),Li.resetDefaultState(),T=-1,I=null,v.pop(),g=v.length>0?v[v.length-1]:null,f.pop(),y=f.length>0?f[f.length-1]:null},this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(A,G,$){N.get(A.texture).__webglTexture=G,N.get(A.depthTexture).__webglTexture=$;let ie=N.get(A);ie.__hasExternalTextures=!0,ie.__autoAllocateDepthBuffer=$===void 0,ie.__autoAllocateDepthBuffer||V.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ie.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,G){let $=N.get(A);$.__webglFramebuffer=G,$.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(A,G=0,$=0){S=A,R=G,E=$;let ie=!0,Z=null,pe=!1,Me=!1;if(A){let Ee=N.get(A);Ee.__useDefaultFramebuffer!==void 0?(M.bindFramebuffer(W.FRAMEBUFFER,null),ie=!1):Ee.__webglFramebuffer===void 0?re.setupRenderTarget(A):Ee.__hasExternalTextures&&re.rebindTextures(A,N.get(A.texture).__webglTexture,N.get(A.depthTexture).__webglTexture);let Oe=A.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(Me=!0);let Fe=N.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Z=Array.isArray(Fe[G])?Fe[G][$]:Fe[G],pe=!0):Z=z.isWebGL2&&A.samples>0&&re.useMultisampledRTT(A)===!1?N.get(A).__webglMultisampledFramebuffer:Array.isArray(Fe)?Fe[$]:Fe,U.copy(A.viewport),j.copy(A.scissor),P=A.scissorTest}else U.copy(he).multiplyScalar(K).floor(),j.copy(q).multiplyScalar(K).floor(),P=te;if(M.bindFramebuffer(W.FRAMEBUFFER,Z)&&z.drawBuffers&&ie&&M.drawBuffers(A,Z),M.viewport(U),M.scissor(j),M.setScissorTest(P),pe){let Ee=N.get(A.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ee.__webglTexture,$)}else if(Me){let Ee=N.get(A.texture),Oe=G||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,Ee.__webglTexture,$||0,Oe)}T=-1},this.readRenderTargetPixels=function(A,G,$,ie,Z,pe,Me){if(!A||!A.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=N.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Me!==void 0&&(Ee=Ee[Me]),Ee){M.bindFramebuffer(W.FRAMEBUFFER,Ee);try{let Oe=A.texture,Fe=Oe.format,ke=Oe.type;if(Fe!==Gi&&Xt.convert(Fe)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");let He=ke===rs&&(V.has("EXT_color_buffer_half_float")||z.isWebGL2&&V.has("EXT_color_buffer_float"));if(!(ke===Dn||Xt.convert(ke)===W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)||ke===yi&&(z.isWebGL2||V.has("OES_texture_float")||V.has("WEBGL_color_buffer_float"))||He))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");G>=0&&G<=A.width-ie&&$>=0&&$<=A.height-Z&&W.readPixels(G,$,ie,Z,Xt.convert(Fe),Xt.convert(ke),pe)}finally{let Oe=S!==null?N.get(S).__webglFramebuffer:null;M.bindFramebuffer(W.FRAMEBUFFER,Oe)}}},this.copyFramebufferToTexture=function(A,G,$=0){let ie=Math.pow(2,-$),Z=Math.floor(G.image.width*ie),pe=Math.floor(G.image.height*ie);re.setTexture2D(G,0),W.copyTexSubImage2D(W.TEXTURE_2D,$,0,0,A.x,A.y,Z,pe),M.unbindTexture()},this.copyTextureToTexture=function(A,G,$,ie=0){let Z=G.image.width,pe=G.image.height,Me=Xt.convert($.format),Ee=Xt.convert($.type);re.setTexture2D($,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,$.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,$.unpackAlignment),G.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,ie,A.x,A.y,Z,pe,Me,Ee,G.image.data):G.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,ie,A.x,A.y,G.mipmaps[0].width,G.mipmaps[0].height,Me,G.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,ie,A.x,A.y,Me,Ee,G.image),ie===0&&$.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),M.unbindTexture()},this.copyTextureToTexture3D=function(A,G,$,ie,Z=0){if(x.isWebGL1Renderer)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");let pe=Math.round(A.max.x-A.min.x),Me=Math.round(A.max.y-A.min.y),Ee=A.max.z-A.min.z+1,Oe=Xt.convert(ie.format),Fe=Xt.convert(ie.type),ke;if(ie.isData3DTexture)re.setTexture3D(ie,0),ke=W.TEXTURE_3D;else{if(!ie.isDataArrayTexture&&!ie.isCompressedArrayTexture)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");re.setTexture2DArray(ie,0),ke=W.TEXTURE_2D_ARRAY}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,ie.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ie.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,ie.unpackAlignment);let He=W.getParameter(W.UNPACK_ROW_LENGTH),nt=W.getParameter(W.UNPACK_IMAGE_HEIGHT),ei=W.getParameter(W.UNPACK_SKIP_PIXELS),Pi=W.getParameter(W.UNPACK_SKIP_ROWS),vn=W.getParameter(W.UNPACK_SKIP_IMAGES),rt=$.isCompressedTexture?$.mipmaps[Z]:$.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,rt.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,rt.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,A.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,A.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,A.min.z),$.isDataTexture||$.isData3DTexture?W.texSubImage3D(ke,Z,G.x,G.y,G.z,pe,Me,Ee,Oe,Fe,rt.data):ie.isCompressedArrayTexture?W.compressedTexSubImage3D(ke,Z,G.x,G.y,G.z,pe,Me,Ee,Oe,rt.data):W.texSubImage3D(ke,Z,G.x,G.y,G.z,pe,Me,Ee,Oe,Fe,rt),W.pixelStorei(W.UNPACK_ROW_LENGTH,He),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,nt),W.pixelStorei(W.UNPACK_SKIP_PIXELS,ei),W.pixelStorei(W.UNPACK_SKIP_ROWS,Pi),W.pixelStorei(W.UNPACK_SKIP_IMAGES,vn),Z===0&&ie.generateMipmaps&&W.generateMipmap(ke),M.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?re.setTextureCube(A,0):A.isData3DTexture?re.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?re.setTexture2DArray(A,0):re.setTexture2D(A,0),M.unbindTexture()},this.resetState=function(){R=0,E=0,S=null,M.reset(),Li.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===pc?"display-p3":"srgb",t.unpackColorSpace=Ye.workingColorSpace===to?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}},Ll=class extends Ar{};Ll.prototype.isWebGL1Renderer=!0;var Da=class extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Pl=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=dl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Vi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return qu("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,s=this.stride;n<s;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Pt=new w,Ua=class r{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qe(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=xi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=xi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=xi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=xi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=qe(t,this.array),i=qe(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=qe(t,this.array),i=qe(i,this.array),n=qe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=qe(t,this.array),i=qe(i,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return new wt(new this.array.constructor(t),this.itemSize,this.normalized)}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ls=class extends Mi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},cr,Yr=new w,hr=new w,ur=new w,dr=new ne,Zr=new ne,nd=new Le,sa=new w,Jr=new w,aa=new w,pu=new ne,Jo=new ne,mu=new ne,Na=class extends _t{constructor(e=new ls){if(super(),this.isSprite=!0,this.type="Sprite",cr===void 0){cr=new Ze;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Pl(t,5);cr.setIndex([0,1,2,0,2,3]),cr.setAttribute("position",new Ua(i,3,0,!1)),cr.setAttribute("uv",new Ua(i,2,3,!1))}this.geometry=cr,this.material=e,this.center=new ne(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),hr.setFromMatrixScale(this.matrixWorld),nd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ur.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&hr.multiplyScalar(-ur.z);let i=this.material.rotation,n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));let a=this.center;oa(sa.set(-.5,-.5,0),ur,a,hr,n,s),oa(Jr.set(.5,-.5,0),ur,a,hr,n,s),oa(aa.set(.5,.5,0),ur,a,hr,n,s),pu.set(0,0),Jo.set(1,0),mu.set(1,1);let o=e.ray.intersectTriangle(sa,Jr,aa,!1,Yr);if(o===null&&(oa(Jr.set(-.5,.5,0),ur,a,hr,n,s),Jo.set(0,1),o=e.ray.intersectTriangle(sa,aa,Jr,!1,Yr),o===null))return;let l=e.ray.origin.distanceTo(Yr);l<e.near||l>e.far||t.push({distance:l,point:Yr.clone(),uv:rn.getInterpolation(Yr,sa,Jr,aa,pu,Jo,mu,new ne),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function oa(r,e,t,i,n,s){dr.subVectors(r,t).addScalar(.5).multiply(i),n!==void 0?(Zr.x=s*dr.x-n*dr.y,Zr.y=n*dr.x+s*dr.y):Zr.copy(dr),r.copy(e),r.x+=Zr.x,r.y+=Zr.y,r.applyMatrix4(nd)}var Uf=new w,Nf=new w;var Of=new w,zf=new dt,Ff=new dt,kf=new w,Bf=new Le,Hf=new w,Gf=new di,Vf=new Le,Wf=new On;var Il=class extends Ut{constructor(e=null,t=1,i=1,n,s,a,o,l,c=1003,h=1003,d,u){super(null,a,o,l,c,h,n,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},jf=new Le,Xf=new Le;var Oa=class extends wt{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},pr=new Le,fu=new Le,la=[],gu=new Ht,Vm=new Le,Kr=new xt,Qr=new di,za=class extends xt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Oa(new Float32Array(16*i),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,Vm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ht),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,pr),gu.copy(e.boundingBox).applyMatrix4(pr),this.boundingBox.union(gu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new di),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,pr),Qr.copy(e.boundingSphere).applyMatrix4(pr),this.boundingSphere.union(Qr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,3*e)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,16*e)}getMorphAt(e,t){let i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,s=e*(i.length+1)+1;for(let a=0;a<i.length;a++)i[a]=n[s+a]}raycast(e,t){let i=this.matrixWorld,n=this.count;if(Kr.geometry=this.geometry,Kr.material=this.material,Kr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qr.copy(this.boundingSphere),Qr.applyMatrix4(i),e.ray.intersectsSphere(Qr)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,pr),fu.multiplyMatrices(i,pr),Kr.matrixWorld=fu,Kr.raycast(e,la);for(let a=0,o=la.length;a<o;a++){let l=la[a];l.instanceId=s,l.object=this,t.push(l)}la.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Oa(new Float32Array(3*this.instanceMatrix.count),3)),t.toArray(this.instanceColor.array,3*e)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,16*e)}setMorphAt(e,t){let i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Il(new Float32Array(n*this.count),n,this.count,Hu,yi));let s=this.morphTexture.source.data.data,a=0;for(let c=0;c<i.length;c++)a+=i[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=n*e;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Dl=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t){let i=this.pool,n=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1});let s=i[this.index];n.push(s),this.index++,s.start=e.start,s.count=e.count,s.z=t}reset(){this.list.length=0,this.index=0}};var $f=new Le,qf=new Le,Yf=new Le,Zf=new Le,Jf=new Er,Kf=new Ht,Qf=new di,eg=new w,tg=new Dl,ig=new xt;var Rr=class extends Mi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},vu=new w,yu=new w,xu=new Le,Ko=new On,ca=new di,cs=class extends _t{constructor(e=new Ze,t=new Rr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let n=1,s=t.count;n<s;n++)vu.fromBufferAttribute(t,n-1),yu.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=vu.distanceTo(yu);e.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ca.copy(i.boundingSphere),ca.applyMatrix4(n),ca.radius+=s,e.ray.intersectsSphere(ca)===!1)return;xu.copy(n).invert(),Ko.copy(e.ray).applyMatrix4(xu);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new w,h=new w,d=new w,u=new w,p=this.isLineSegments?2:1,m=i.index,y=i.attributes.position;if(m!==null)for(let g=Math.max(0,a.start),f=Math.min(m.count,a.start+a.count)-1;g<f;g+=p){let v=m.getX(g),x=m.getX(g+1);if(c.fromBufferAttribute(y,v),h.fromBufferAttribute(y,x),Ko.distanceSqToSegment(c,h,u,d)>l)continue;u.applyMatrix4(this.matrixWorld);let _=e.ray.origin.distanceTo(u);_<e.near||_>e.far||t.push({distance:_,point:d.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}else for(let g=Math.max(0,a.start),f=Math.min(y.count,a.start+a.count)-1;g<f;g+=p){if(c.fromBufferAttribute(y,g),h.fromBufferAttribute(y,g+1),Ko.distanceSqToSegment(c,h,u,d)>l)continue;u.applyMatrix4(this.matrixWorld);let v=e.ray.origin.distanceTo(u);v<e.near||v>e.far||t.push({distance:v,point:d.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}},_u=new w,bu=new w,Fa=class extends cs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let n=0,s=t.count;n<s;n+=2)_u.fromBufferAttribute(t,n),bu.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+_u.distanceTo(bu);e.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var hs=class extends Mi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Mu=new Le,Ul=new On,ha=new di,ua=new w,ka=class extends _t{constructor(e=new Ze,t=new hs){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ha.copy(i.boundingSphere),ha.applyMatrix4(n),ha.radius+=s,e.ray.intersectsSphere(ha)===!1)return;Mu.copy(n).invert(),Ul.copy(e.ray).applyMatrix4(Mu);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null)for(let d=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);d<u;d++){let p=c.getX(d);ua.fromBufferAttribute(h,p),Su(ua,p,l,n,e,t,this)}else for(let d=Math.max(0,a.start),u=Math.min(h.count,a.start+a.count);d<u;d++)ua.fromBufferAttribute(h,d),Su(ua,d,l,n,e,t,this)}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}};function Su(r,e,t,i,n,s,a){let o=Ul.distanceSqToPoint(r);if(o<t){let l=new w;Ul.closestPointToPoint(r,l),l.applyMatrix4(i);let c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}var Ba=class extends Ut{constructor(e,t,i,n,s,a,o,l,c){super(e,t,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Jt=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,n=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(n),t.push(s),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),n=0,s=i.length,a;a=t||e*i[s-1];let o,l=0,c=s-1;for(;l<=c;)if(n=Math.floor(l+(c-l)/2),o=i[n]-a,o<0)l=n+1;else{if(!(o>0)){c=n;break}c=n-1}if(n=c,i[n]===a)return n/(s-1);let h=i[n];return(n+(a-h)/(i[n+1]-h))/(s-1)}getTangent(e,t){let n=e-1e-4,s=e+1e-4;n<0&&(n=0),s>1&&(s=1);let a=this.getPoint(n),o=this.getPoint(s),l=t||(a.isVector2?new ne:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new w,n=[],s=[],a=[],o=new w,l=new Le;for(let p=0;p<=e;p++){let m=p/e;n[p]=this.getTangentAt(m,new w)}s[0]=new w,a[0]=new w;let c=Number.MAX_VALUE,h=Math.abs(n[0].x),d=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(n[p-1],n[p]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(St(n[p-1].dot(n[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,m))}a[p].crossVectors(n[p],s[p])}if(t===!0){let p=Math.acos(St(s[0].dot(s[e]),-1,1));p/=e,n[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(n[m],p*m)),a[m].crossVectors(n[m],s[m])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},us=class extends Jt{constructor(e=0,t=0,i=1,n=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ne){let i=t,n=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(s=a?0:n),this.aClockwise!==!0||a||(s===n?s=-n:s-=n);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,p=c-this.aY;l=u*h-p*d+this.aX,c=u*d+p*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Nl=class extends us{constructor(e,t,i,n,s,a){super(e,t,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function fc(){let r=0,e=0,t=0,i=0;function n(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){n(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,d){let u=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,p*=h,n(a,o,u,p)},calc:function(s){let a=s*s;return r+e*s+t*a+i*(a*s)}}}var da=new w,Qo=new fc,el=new fc,tl=new fc,Ol=class extends Jt{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new w){let i=t,n=this.points,s=n.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=n[(c-1)%s]:(da.subVectors(n[0],n[1]).add(n[0]),o=da);let d=n[c%s],u=n[(c+1)%s];if(this.closed||c+2<s?l=n[(c+2)%s]:(da.subVectors(n[s-1],n[s-2]).add(n[s-1]),l=da),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(o.distanceToSquared(d),p),y=Math.pow(d.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(l),p);y<1e-4&&(y=1),m<1e-4&&(m=y),g<1e-4&&(g=y),Qo.initNonuniformCatmullRom(o.x,d.x,u.x,l.x,m,y,g),el.initNonuniformCatmullRom(o.y,d.y,u.y,l.y,m,y,g),tl.initNonuniformCatmullRom(o.z,d.z,u.z,l.z,m,y,g)}else this.curveType==="catmullrom"&&(Qo.initCatmullRom(o.x,d.x,u.x,l.x,this.tension),el.initCatmullRom(o.y,d.y,u.y,l.y,this.tension),tl.initCatmullRom(o.z,d.z,u.z,l.z,this.tension));return i.set(Qo.calc(h),el.calc(h),tl.calc(h)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new w().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function wu(r,e,t,i,n){let s=.5*(i-e),a=.5*(n-t),o=r*r;return(2*t-2*i+s+a)*(r*o)+(-3*t+3*i-2*s-a)*o+s*r+t}function ts(r,e,t,i){return function(n,s){let a=1-n;return a*a*s}(r,e)+function(n,s){return 2*(1-n)*n*s}(r,t)+function(n,s){return n*n*s}(r,i)}function is(r,e,t,i,n){return function(s,a){let o=1-s;return o*o*o*a}(r,e)+function(s,a){let o=1-s;return 3*o*o*s*a}(r,t)+function(s,a){return 3*(1-s)*s*s*a}(r,i)+function(s,a){return s*s*s*a}(r,n)}var Ha=class extends Jt{constructor(e=new ne,t=new ne,i=new ne,n=new ne){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new ne){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(is(e,n.x,s.x,a.x,o.x),is(e,n.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zl=class extends Jt{constructor(e=new w,t=new w,i=new w,n=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new w){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(is(e,n.x,s.x,a.x,o.x),is(e,n.y,s.y,a.y,o.y),is(e,n.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ga=class extends Jt{constructor(e=new ne,t=new ne){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ne){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ne){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Fl=class extends Jt{constructor(e=new w,t=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new w){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new w){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Va=class extends Jt{constructor(e=new ne,t=new ne,i=new ne){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ne){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(ts(e,n.x,s.x,a.x),ts(e,n.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wa=class extends Jt{constructor(e=new w,t=new w,i=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new w){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(ts(e,n.x,s.x,a.x),ts(e,n.y,s.y,a.y),ts(e,n.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ja=class extends Jt{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ne){let i=t,n=this.points,s=(n.length-1)*e,a=Math.floor(s),o=s-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],d=n[a>n.length-3?n.length-1:a+2];return i.set(wu(o,l.x,c.x,h.x,d.x),wu(o,l.y,c.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new ne().fromArray(n))}return this}},Xa=Object.freeze({__proto__:null,ArcCurve:Nl,CatmullRomCurve3:Ol,CubicBezierCurve:Ha,CubicBezierCurve3:zl,EllipseCurve:us,LineCurve:Ga,LineCurve3:Fl,QuadraticBezierCurve:Va,QuadraticBezierCurve3:Wa,SplineCurve:ja}),kl=class extends Jt{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xa[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),n=this.getCurveLengths(),s=0;for(;s<n.length;){if(n[s]>=i){let a=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let n=0,s=this.curves;n<s.length;n++){let a=s[n],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(new Xa[n.type]().fromJSON(n))}return this}},ds=class extends kl{constructor(e){super(),this.type="Path",this.currentPoint=new ne,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new Ga(this.currentPoint.clone(),new ne(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){let s=new Va(this.currentPoint.clone(),new ne(e,t),new ne(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,s,a){let o=new Ha(this.currentPoint.clone(),new ne(e,t),new ne(i,n),new ne(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new ja(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,n,s,a),this}absarc(e,t,i,n,s,a){return this.absellipse(e,t,i,i,n,s,a),this}ellipse(e,t,i,n,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,n,s,a,o,l),this}absellipse(e,t,i,n,s,a,o,l){let c=new us(e,t,i,n,s,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},$a=class r extends Ze{constructor(e=[new ne(0,-.5),new ne(.5,0),new ne(0,.5)],t=12,i=0,n=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=St(n,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,d=new w,u=new ne,p=new w,m=new w,y=new w,g=0,f=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,f=e[v+1].y-e[v].y,p.x=1*f,p.y=-g,p.z=0*f,y.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(y.x,y.y,y.z);break;default:g=e[v+1].x-e[v].x,f=e[v+1].y-e[v].y,p.x=1*f,p.y=-g,p.z=0*f,m.copy(p),p.x+=y.x,p.y+=y.y,p.z+=y.z,p.normalize(),l.push(p.x,p.y,p.z),y.copy(m)}for(let v=0;v<=t;v++){let x=i+v*h*n,_=Math.sin(x),R=Math.cos(x);for(let E=0;E<=e.length-1;E++){d.x=e[E].x*_,d.y=e[E].y,d.z=e[E].x*R,a.push(d.x,d.y,d.z),u.x=v/t,u.y=E/(e.length-1),o.push(u.x,u.y);let S=l[3*E+0]*_,T=l[3*E+1],I=l[3*E+0]*R;c.push(S,T,I)}}for(let v=0;v<t;v++)for(let x=0;x<e.length-1;x++){let _=x+v*e.length,R=_,E=_+e.length,S=_+e.length+1,T=_+1;s.push(R,E,T),s.push(S,T,E)}this.setIndex(s),this.setAttribute("position",new Se(a,3)),this.setAttribute("uv",new Se(o,2)),this.setAttribute("normal",new Se(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},Bl=class r extends $a{constructor(e=1,t=1,i=4,n=8){let s=new ds;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(i),n),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:n}}static fromJSON(e){return new r(e.radius,e.length,e.capSegments,e.radialSegments)}},Hl=class r extends Ze{constructor(e=1,t=32,i=0,n=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new w,h=new ne;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){let p=i+d/t*n;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new Se(a,3)),this.setAttribute("normal",new Se(o,3)),this.setAttribute("uv",new Se(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},wi=class r extends Ze{constructor(e=1,t=1,i=1,n=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),s=Math.floor(s);let h=[],d=[],u=[],p=[],m=0,y=[],g=i/2,f=0;function v(x){let _=m,R=new ne,E=new w,S=0,T=x===!0?e:t,I=x===!0?1:-1;for(let j=1;j<=n;j++)d.push(0,g*I,0),u.push(0,I,0),p.push(.5,.5),m++;let U=m;for(let j=0;j<=n;j++){let P=j/n*l+o,H=Math.cos(P),J=Math.sin(P);E.x=T*J,E.y=g*I,E.z=T*H,d.push(E.x,E.y,E.z),u.push(0,I,0),R.x=.5*H+.5,R.y=.5*J*I+.5,p.push(R.x,R.y),m++}for(let j=0;j<n;j++){let P=_+j,H=U+j;x===!0?h.push(H,H+1,P):h.push(H+1,H,P),S+=3}c.addGroup(f,S,x===!0?1:2),f+=S}(function(){let x=new w,_=new w,R=0,E=(t-e)/i;for(let S=0;S<=s;S++){let T=[],I=S/s,U=I*(t-e)+e;for(let j=0;j<=n;j++){let P=j/n,H=P*l+o,J=Math.sin(H),se=Math.cos(H);_.x=U*J,_.y=-I*i+g,_.z=U*se,d.push(_.x,_.y,_.z),x.set(J,E,se).normalize(),u.push(x.x,x.y,x.z),p.push(P,1-I),T.push(m++)}y.push(T)}for(let S=0;S<n;S++)for(let T=0;T<s;T++){let I=y[T][S],U=y[T+1][S],j=y[T+1][S+1],P=y[T][S+1];h.push(I,U,P),h.push(U,j,P),R+=6}c.addGroup(f,R,0),f+=R})(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Se(d,3)),this.setAttribute("normal",new Se(u,3)),this.setAttribute("uv",new Se(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Xi=class r extends wi{constructor(e=1,t=1,i=32,n=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},zn=class r extends Ze{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};let s=[],a=[];function o(u,p,m,y){let g=y+1,f=[];for(let v=0;v<=g;v++){f[v]=[];let x=u.clone().lerp(m,v/g),_=p.clone().lerp(m,v/g),R=g-v;for(let E=0;E<=R;E++)f[v][E]=E===0&&v===g?x:x.clone().lerp(_,E/R)}for(let v=0;v<g;v++)for(let x=0;x<2*(g-v)-1;x++){let _=Math.floor(x/2);x%2==0?(l(f[v][_+1]),l(f[v+1][_]),l(f[v][_])):(l(f[v][_+1]),l(f[v+1][_+1]),l(f[v+1][_]))}}function l(u){s.push(u.x,u.y,u.z)}function c(u,p){let m=3*u;p.x=e[m+0],p.y=e[m+1],p.z=e[m+2]}function h(u,p,m,y){y<0&&u.x===1&&(a[p]=u.x-1),m.x===0&&m.z===0&&(a[p]=y/2/Math.PI+.5)}function d(u){return Math.atan2(u.z,-u.x)}(function(u){let p=new w,m=new w,y=new w;for(let g=0;g<t.length;g+=3)c(t[g+0],p),c(t[g+1],m),c(t[g+2],y),o(p,m,y,u)})(n),function(u){let p=new w;for(let m=0;m<s.length;m+=3)p.x=s[m+0],p.y=s[m+1],p.z=s[m+2],p.normalize().multiplyScalar(u),s[m+0]=p.x,s[m+1]=p.y,s[m+2]=p.z}(i),function(){let u=new w;for(let m=0;m<s.length;m+=3){u.x=s[m+0],u.y=s[m+1],u.z=s[m+2];let y=d(u)/2/Math.PI+.5,g=(p=u,Math.atan2(-p.y,Math.sqrt(p.x*p.x+p.z*p.z))/Math.PI+.5);a.push(y,1-g)}var p;(function(){let m=new w,y=new w,g=new w,f=new w,v=new ne,x=new ne,_=new ne;for(let R=0,E=0;R<s.length;R+=9,E+=6){m.set(s[R+0],s[R+1],s[R+2]),y.set(s[R+3],s[R+4],s[R+5]),g.set(s[R+6],s[R+7],s[R+8]),v.set(a[E+0],a[E+1]),x.set(a[E+2],a[E+3]),_.set(a[E+4],a[E+5]),f.copy(m).add(y).add(g).divideScalar(3);let S=d(f);h(v,E+0,m,S),h(x,E+2,y,S),h(_,E+4,g,S)}})(),function(){for(let m=0;m<a.length;m+=6){let y=a[m+0],g=a[m+2],f=a[m+4],v=Math.max(y,g,f),x=Math.min(y,g,f);v>.9&&x<.1&&(y<.2&&(a[m+0]+=1),g<.2&&(a[m+2]+=1),f<.2&&(a[m+4]+=1))}}()}(),this.setAttribute("position",new Se(s,3)),this.setAttribute("normal",new Se(s.slice(),3)),this.setAttribute("uv",new Se(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},ps=class r extends zn{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,n=1/i;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},pa=new w,ma=new w,il=new w,fa=new rn,Gl=class extends Ze{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=Math.pow(10,4),s=Math.cos(xa*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),u={},p=[];for(let m=0;m<l;m+=3){a?(c[0]=a.getX(m),c[1]=a.getX(m+1),c[2]=a.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:y,b:g,c:f}=fa;if(y.fromBufferAttribute(o,c[0]),g.fromBufferAttribute(o,c[1]),f.fromBufferAttribute(o,c[2]),fa.getNormal(il),d[0]=`${Math.round(y.x*n)},${Math.round(y.y*n)},${Math.round(y.z*n)}`,d[1]=`${Math.round(g.x*n)},${Math.round(g.y*n)},${Math.round(g.z*n)}`,d[2]=`${Math.round(f.x*n)},${Math.round(f.y*n)},${Math.round(f.z*n)}`,d[0]!==d[1]&&d[1]!==d[2]&&d[2]!==d[0])for(let v=0;v<3;v++){let x=(v+1)%3,_=d[v],R=d[x],E=fa[h[v]],S=fa[h[x]],T=`${_}_${R}`,I=`${R}_${_}`;I in u&&u[I]?(il.dot(u[I].normal)<=s&&(p.push(E.x,E.y,E.z),p.push(S.x,S.y,S.z)),u[I]=null):T in u||(u[T]={index0:c[v],index1:c[x],normal:il.clone()})}}for(let m in u)if(u[m]){let{index0:y,index1:g}=u[m];pa.fromBufferAttribute(o,y),ma.fromBufferAttribute(o,g),p.push(pa.x,pa.y,pa.z),p.push(ma.x,ma.y,ma.z)}this.setAttribute("position",new Se(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Cr=class extends ds{constructor(e){super(e),this.uuid=Vi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(new ds().fromJSON(n))}return this}},Wm=function(r,e,t=2){let i=e&&e.length,n=i?e[0]*t:r.length,s=Eu(r,0,n,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,d,u,p;if(i&&(s=function(m,y,g,f){let v=[],x,_,R,E,S;for(x=0,_=y.length;x<_;x++)R=y[x]*f,E=x<_-1?y[x+1]*f:m.length,S=Eu(m,R,E,f,!1),S===S.next&&(S.steiner=!0),v.push(Km(S));for(v.sort(Ym),x=0;x<v.length;x++)g=Zm(v[x],g);return g}(r,e,s,t)),r.length>80*t){o=c=r[0],l=h=r[1];for(let m=t;m<n;m+=t)d=r[m],u=r[m+1],d<o&&(o=d),u<l&&(l=u),d>c&&(c=d),u>h&&(h=u);p=Math.max(c-o,h-l),p=p!==0?32767/p:0}return ms(s,a,t,o,l,p,0),a};function Eu(r,e,t,i,n){let s,a;if(n===function(o,l,c,h){let d=0;for(let u=l,p=c-h;u<c;u+=h)d+=(o[p]-o[u])*(o[u+1]+o[p+1]),p=u;return d}(r,e,t,i)>0)for(s=e;s<t;s+=i)a=Tu(s,r[s],r[s+1],a);else for(s=t-i;s>=e;s-=i)a=Tu(s,r[s],r[s+1],a);return a&&no(a,a.next)&&(gs(a),a=a.next),a}function Fn(r,e){if(!r)return r;e||(e=r);let t,i=r;do if(t=!1,i.steiner||!no(i,i.next)&&st(i.prev,i,i.next)!==0)i=i.next;else{if(gs(i),i=e=i.prev,i===i.next)break;t=!0}while(t||i!==e);return e}function ms(r,e,t,i,n,s,a){if(!r)return;!a&&s&&function(h,d,u,p){let m=h;do m.z===0&&(m.z=Vl(m.x,m.y,d,u,p)),m.prevZ=m.prev,m.nextZ=m.next,m=m.next;while(m!==h);m.prevZ.nextZ=null,m.prevZ=null,function(y){let g,f,v,x,_,R,E,S,T=1;do{for(f=y,y=null,_=null,R=0;f;){for(R++,v=f,E=0,g=0;g<T&&(E++,v=v.nextZ,v);g++);for(S=T;E>0||S>0&&v;)E!==0&&(S===0||!v||f.z<=v.z)?(x=f,f=f.nextZ,E--):(x=v,v=v.nextZ,S--),_?_.nextZ=x:y=x,x.prevZ=_,_=x;f=v}_.nextZ=null,T*=2}while(R>1)}(m)}(r,i,n,s);let o,l,c=r;for(;r.prev!==r.next;)if(o=r.prev,l=r.next,s?Xm(r,i,n,s):jm(r))e.push(o.i/t|0),e.push(r.i/t|0),e.push(l.i/t|0),gs(r),r=l.next,c=l.next;else if((r=l)===c){a?a===1?ms(r=$m(Fn(r),e,t),e,t,i,n,s,2):a===2&&qm(r,e,t,i,n,s):ms(Fn(r),e,t,i,n,s,1);break}}function jm(r){let e=r.prev,t=r,i=r.next;if(st(e,t,i)>=0)return!1;let n=e.x,s=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=n<s?n<a?n:a:s<a?s:a,d=o<l?o<c?o:c:l<c?l:c,u=n>s?n>a?n:a:s>a?s:a,p=o>l?o>c?o:c:l>c?l:c,m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=u&&m.y>=d&&m.y<=p&&gr(n,o,s,l,a,c,m.x,m.y)&&st(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Xm(r,e,t,i){let n=r.prev,s=r,a=r.next;if(st(n,s,a)>=0)return!1;let o=n.x,l=s.x,c=a.x,h=n.y,d=s.y,u=a.y,p=o<l?o<c?o:c:l<c?l:c,m=h<d?h<u?h:u:d<u?d:u,y=o>l?o>c?o:c:l>c?l:c,g=h>d?h>u?h:u:d>u?d:u,f=Vl(p,m,e,t,i),v=Vl(y,g,e,t,i),x=r.prevZ,_=r.nextZ;for(;x&&x.z>=f&&_&&_.z<=v;){if(x.x>=p&&x.x<=y&&x.y>=m&&x.y<=g&&x!==n&&x!==a&&gr(o,h,l,d,c,u,x.x,x.y)&&st(x.prev,x,x.next)>=0||(x=x.prevZ,_.x>=p&&_.x<=y&&_.y>=m&&_.y<=g&&_!==n&&_!==a&&gr(o,h,l,d,c,u,_.x,_.y)&&st(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;x&&x.z>=f;){if(x.x>=p&&x.x<=y&&x.y>=m&&x.y<=g&&x!==n&&x!==a&&gr(o,h,l,d,c,u,x.x,x.y)&&st(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;_&&_.z<=v;){if(_.x>=p&&_.x<=y&&_.y>=m&&_.y<=g&&_!==n&&_!==a&&gr(o,h,l,d,c,u,_.x,_.y)&&st(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function $m(r,e,t){let i=r;do{let n=i.prev,s=i.next.next;!no(n,s)&&rd(n,i,i.next,s)&&fs(n,s)&&fs(s,n)&&(e.push(n.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),gs(i),gs(i.next),i=r=s),i=i.next}while(i!==r);return Fn(i)}function qm(r,e,t,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Qm(a,o)){let l=sd(a,o);return a=Fn(a,a.next),l=Fn(l,l.next),ms(a,e,t,i,n,s,0),void ms(l,e,t,i,n,s,0)}o=o.next}a=a.next}while(a!==r)}function Ym(r,e){return r.x-e.x}function Zm(r,e){let t=function(n,s){let a,o=s,l=-1/0,c=n.x,h=n.y;do{if(h<=o.y&&h>=o.next.y&&o.next.y!==o.y){let g=o.x+(h-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(g<=c&&g>l&&(l=g,a=o.x<o.next.x?o:o.next,g===c))return a}o=o.next}while(o!==s);if(!a)return null;let d=a,u=a.x,p=a.y,m,y=1/0;o=a;do c>=o.x&&o.x>=u&&c!==o.x&&gr(h<p?c:l,h,u,p,h<p?l:c,h,o.x,o.y)&&(m=Math.abs(h-o.y)/(c-o.x),fs(o,n)&&(m<y||m===y&&(o.x>a.x||o.x===a.x&&Jm(a,o)))&&(a=o,y=m)),o=o.next;while(o!==d);return a}(r,e);if(!t)return e;let i=sd(t,r);return Fn(i,i.next),Fn(t,t.next)}function Jm(r,e){return st(r.prev,r,e.prev)<0&&st(e.next,r,r.next)<0}function Vl(r,e,t,i,n){return(r=1431655765&((r=858993459&((r=252645135&((r=16711935&((r=(r-t)*n|0)|r<<8))|r<<4))|r<<2))|r<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-i)*n|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function Km(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function gr(r,e,t,i,n,s,a,o){return(n-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(n-a)*(i-o)}function Qm(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!function(t,i){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==i.i&&n.next.i!==i.i&&rd(n,n.next,t,i))return!0;n=n.next}while(n!==t);return!1}(r,e)&&(fs(r,e)&&fs(e,r)&&function(t,i){let n=t,s=!1,a=(t.x+i.x)/2,o=(t.y+i.y)/2;do n.y>o!=n.next.y>o&&n.next.y!==n.y&&a<(n.next.x-n.x)*(o-n.y)/(n.next.y-n.y)+n.x&&(s=!s),n=n.next;while(n!==t);return s}(r,e)&&(st(r.prev,r,e.prev)||st(r,e.prev,e))||no(r,e)&&st(r.prev,r,r.next)>0&&st(e.prev,e,e.next)>0)}function st(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function no(r,e){return r.x===e.x&&r.y===e.y}function rd(r,e,t,i){let n=va(st(r,e,t)),s=va(st(r,e,i)),a=va(st(t,i,r)),o=va(st(t,i,e));return n!==s&&a!==o||!(n!==0||!ga(r,t,e))||!(s!==0||!ga(r,i,e))||!(a!==0||!ga(t,r,i))||!(o!==0||!ga(t,e,i))}function ga(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function va(r){return r>0?1:r<0?-1:0}function fs(r,e){return st(r.prev,r,r.next)<0?st(r,e,r.next)>=0&&st(r,r.prev,e)>=0:st(r,e,r.prev)<0||st(r,r.next,e)<0}function sd(r,e){let t=new Wl(r.i,r.x,r.y),i=new Wl(e.i,e.x,e.y),n=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=n,n.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Tu(r,e,t,i){let n=new Wl(r,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function gs(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Wl(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var an=class r{static area(e){let t=e.length,i=0;for(let n=t-1,s=0;s<t;n=s++)i+=e[n].x*e[s].y-e[s].x*e[n].y;return .5*i}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let i=[],n=[],s=[];Au(e),Ru(i,e);let a=e.length;t.forEach(Au);for(let l=0;l<t.length;l++)n.push(a),a+=t[l].length,Ru(i,t[l]);let o=Wm(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function Au(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Ru(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var vs=class r extends Ze{constructor(e=new Cr([new ne(.5,.5),new ne(-.5,.5),new ne(-.5,-.5),new ne(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,n=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,u=t.bevelEnabled===void 0||t.bevelEnabled,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,f=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:ef,x,_,R,E,S,T=!1;f&&(x=f.getSpacedPoints(h),T=!0,u=!1,_=f.computeFrenetFrames(h,!1),R=new w,E=new w,S=new w),u||(g=0,p=0,m=0,y=0);let I=o.extractPoints(c),U=I.shape,j=I.holes;if(!an.isClockWise(U)){U=U.reverse();for(let L=0,D=j.length;L<D;L++){let k=j[L];an.isClockWise(k)&&(j[L]=k.reverse())}}let P=an.triangulateShape(U,j),H=U;for(let L=0,D=j.length;L<D;L++){let k=j[L];U=U.concat(k)}function J(L,D,k){return D||console.error("THREE.ExtrudeGeometry: vec does not exist"),L.clone().addScaledVector(D,k)}let se=U.length,de=P.length;function K(L,D,k){let V,z,M,Y=L.x-D.x,N=L.y-D.y,re=k.x-L.x,ee=k.y-L.y,oe=Y*Y+N*N,ye=Y*ee-N*re;if(Math.abs(ye)>Number.EPSILON){let fe=Math.sqrt(oe),xe=Math.sqrt(re*re+ee*ee),me=D.x-N/fe,Ne=D.y+Y/fe,De=((k.x-ee/xe-me)*ee-(k.y+re/xe-Ne)*re)/(Y*ee-N*re);V=me+Y*De-L.x,z=Ne+N*De-L.y;let et=V*V+z*z;if(et<=2)return new ne(V,z);M=Math.sqrt(et/2)}else{let fe=!1;Y>Number.EPSILON?re>Number.EPSILON&&(fe=!0):Y<-Number.EPSILON?re<-Number.EPSILON&&(fe=!0):Math.sign(N)===Math.sign(ee)&&(fe=!0),fe?(V=-N,z=Y,M=Math.sqrt(oe)):(V=Y,z=N,M=Math.sqrt(oe/2))}return new ne(V/M,z/M)}let X=[];for(let L=0,D=H.length,k=D-1,V=L+1;L<D;L++,k++,V++)k===D&&(k=0),V===D&&(V=0),X[L]=K(H[L],H[k],H[V]);let Q=[],he,q=X.concat();for(let L=0,D=j.length;L<D;L++){let k=j[L];he=[];for(let V=0,z=k.length,M=z-1,Y=V+1;V<z;V++,M++,Y++)M===z&&(M=0),Y===z&&(Y=0),he[V]=K(k[V],k[M],k[Y]);Q.push(he),q=q.concat(he)}for(let L=0;L<g;L++){let D=L/g,k=p*Math.cos(D*Math.PI/2),V=m*Math.sin(D*Math.PI/2)+y;for(let z=0,M=H.length;z<M;z++){let Y=J(H[z],X[z],V);le(Y.x,Y.y,-k)}for(let z=0,M=j.length;z<M;z++){let Y=j[z];he=Q[z];for(let N=0,re=Y.length;N<re;N++){let ee=J(Y[N],he[N],V);le(ee.x,ee.y,-k)}}}let te=m+y;for(let L=0;L<se;L++){let D=u?J(U[L],q[L],te):U[L];T?(E.copy(_.normals[0]).multiplyScalar(D.x),R.copy(_.binormals[0]).multiplyScalar(D.y),S.copy(x[0]).add(E).add(R),le(S.x,S.y,S.z)):le(D.x,D.y,0)}for(let L=1;L<=h;L++)for(let D=0;D<se;D++){let k=u?J(U[D],q[D],te):U[D];T?(E.copy(_.normals[L]).multiplyScalar(k.x),R.copy(_.binormals[L]).multiplyScalar(k.y),S.copy(x[L]).add(E).add(R),le(S.x,S.y,S.z)):le(k.x,k.y,d/h*L)}for(let L=g-1;L>=0;L--){let D=L/g,k=p*Math.cos(D*Math.PI/2),V=m*Math.sin(D*Math.PI/2)+y;for(let z=0,M=H.length;z<M;z++){let Y=J(H[z],X[z],V);le(Y.x,Y.y,d+k)}for(let z=0,M=j.length;z<M;z++){let Y=j[z];he=Q[z];for(let N=0,re=Y.length;N<re;N++){let ee=J(Y[N],he[N],V);T?le(ee.x,ee.y+x[h-1].y,x[h-1].x+k):le(ee.x,ee.y,d+k)}}}function _e(L,D){let k=L.length;for(;--k>=0;){let V=k,z=k-1;z<0&&(z=L.length-1);for(let M=0,Y=h+2*g;M<Y;M++){let N=se*M,re=se*(M+1);b(D+V+N,D+z+N,D+z+re,D+V+re)}}}function le(L,D,k){l.push(L),l.push(D),l.push(k)}function C(L,D,k){F(L),F(D),F(k);let V=n.length/3,z=v.generateTopUV(i,n,V-3,V-2,V-1);O(z[0]),O(z[1]),O(z[2])}function b(L,D,k,V){F(L),F(D),F(V),F(D),F(k),F(V);let z=n.length/3,M=v.generateSideWallUV(i,n,z-6,z-3,z-2,z-1);O(M[0]),O(M[1]),O(M[3]),O(M[1]),O(M[2]),O(M[3])}function F(L){n.push(l[3*L+0]),n.push(l[3*L+1]),n.push(l[3*L+2])}function O(L){s.push(L.x),s.push(L.y)}(function(){let L=n.length/3;if(u){let D=0,k=se*D;for(let V=0;V<de;V++){let z=P[V];C(z[2]+k,z[1]+k,z[0]+k)}D=h+2*g,k=se*D;for(let V=0;V<de;V++){let z=P[V];C(z[0]+k,z[1]+k,z[2]+k)}}else{for(let D=0;D<de;D++){let k=P[D];C(k[2],k[1],k[0])}for(let D=0;D<de;D++){let k=P[D];C(k[0]+se*h,k[1]+se*h,k[2]+se*h)}}i.addGroup(L,n.length/3-L,0)})(),function(){let L=n.length/3,D=0;_e(H,D),D+=H.length;for(let k=0,V=j.length;k<V;k++){let z=j[k];_e(z,D),D+=z.length}i.addGroup(L,n.length/3-L,1)}()}this.setAttribute("position",new Se(n,3)),this.setAttribute("uv",new Se(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i,n){if(n.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];n.shapes.push(o.uuid)}else n.shapes.push(t.uuid);return n.options=Object.assign({},i),i.extrudePath!==void 0&&(n.options.extrudePath=i.extrudePath.toJSON()),n}(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let i=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];i.push(o)}let n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new Xa[n.type]().fromJSON(n)),new r(i,e.options)}},ef={generateTopUV:function(r,e,t,i,n){let s=e[3*t],a=e[3*t+1],o=e[3*i],l=e[3*i+1],c=e[3*n],h=e[3*n+1];return[new ne(s,a),new ne(o,l),new ne(c,h)]},generateSideWallUV:function(r,e,t,i,n,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*i],h=e[3*i+1],d=e[3*i+2],u=e[3*n],p=e[3*n+1],m=e[3*n+2],y=e[3*s],g=e[3*s+1],f=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new ne(a,1-l),new ne(c,1-d),new ne(u,1-m),new ne(y,1-f)]:[new ne(o,1-l),new ne(h,1-d),new ne(p,1-m),new ne(g,1-f)]}},jl=class r extends zn{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2;super([-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Lr=class r extends zn{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Pr=class r extends Ze{constructor(e=.5,t=1,i=32,n=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i);let o=[],l=[],c=[],h=[],d=e,u=(t-e)/(n=Math.max(1,n)),p=new w,m=new ne;for(let y=0;y<=n;y++){for(let g=0;g<=i;g++){let f=s+g/i*a;p.x=d*Math.cos(f),p.y=d*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,h.push(m.x,m.y)}d+=u}for(let y=0;y<n;y++){let g=y*(i+1);for(let f=0;f<i;f++){let v=f+g,x=v,_=v+i+1,R=v+i+2,E=v+1;o.push(x,_,E),o.push(_,R,E)}}this.setIndex(o),this.setAttribute("position",new Se(l,3)),this.setAttribute("normal",new Se(c,3)),this.setAttribute("uv",new Se(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Xl=class r extends Ze{constructor(e=new Cr([new ne(0,.5),new ne(-.5,-.5),new ne(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],n=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let d=n.length/3,u=h.extractPoints(t),p=u.shape,m=u.holes;an.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,f=m.length;g<f;g++){let v=m[g];an.isClockWise(v)===!0&&(m[g]=v.reverse())}let y=an.triangulateShape(p,m);for(let g=0,f=m.length;g<f;g++){let v=m[g];p=p.concat(v)}for(let g=0,f=p.length;g<f;g++){let v=p[g];n.push(v.x,v.y,0),s.push(0,0,1),a.push(v.x,v.y)}for(let g=0,f=y.length;g<f;g++){let v=y[g],x=v[0]+d,_=v[1]+d,R=v[2]+d;i.push(x,_,R),l+=3}}this.setIndex(i),this.setAttribute("position",new Se(n,3)),this.setAttribute("normal",new Se(s,3)),this.setAttribute("uv",new Se(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i){if(i.shapes=[],Array.isArray(t))for(let n=0,s=t.length;n<s;n++){let a=t[n];i.shapes.push(a.uuid)}else i.shapes.push(t.uuid);return i}(this.parameters.shapes,e)}static fromJSON(e,t){let i=[];for(let n=0,s=e.shapes.length;n<s;n++){let a=t[e.shapes[n]];i.push(a)}return new r(i,e.curveSegments)}},ys=class r extends Ze{constructor(e=1,t=32,i=16,n=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new w,u=new w,p=[],m=[],y=[],g=[];for(let f=0;f<=i;f++){let v=[],x=f/i,_=0;f===0&&a===0?_=.5/t:f===i&&l===Math.PI&&(_=-.5/t);for(let R=0;R<=t;R++){let E=R/t;d.x=-e*Math.cos(n+E*s)*Math.sin(a+x*o),d.y=e*Math.cos(a+x*o),d.z=e*Math.sin(n+E*s)*Math.sin(a+x*o),m.push(d.x,d.y,d.z),u.copy(d).normalize(),y.push(u.x,u.y,u.z),g.push(E+_,1-x),v.push(c++)}h.push(v)}for(let f=0;f<i;f++)for(let v=0;v<t;v++){let x=h[f][v+1],_=h[f][v],R=h[f+1][v],E=h[f+1][v+1];(f!==0||a>0)&&p.push(x,_,E),(f!==i-1||l<Math.PI)&&p.push(_,R,E)}this.setIndex(p),this.setAttribute("position",new Se(m,3)),this.setAttribute("normal",new Se(y,3)),this.setAttribute("uv",new Se(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},$l=class r extends zn{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},ql=class r extends Ze{constructor(e=1,t=.4,i=12,n=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);let a=[],o=[],l=[],c=[],h=new w,d=new w,u=new w;for(let p=0;p<=i;p++)for(let m=0;m<=n;m++){let y=m/n*s,g=p/i*Math.PI*2;d.x=(e+t*Math.cos(g))*Math.cos(y),d.y=(e+t*Math.cos(g))*Math.sin(y),d.z=t*Math.sin(g),o.push(d.x,d.y,d.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(m/n),c.push(p/i)}for(let p=1;p<=i;p++)for(let m=1;m<=n;m++){let y=(n+1)*p+m-1,g=(n+1)*(p-1)+m-1,f=(n+1)*(p-1)+m,v=(n+1)*p+m;a.push(y,g,v),a.push(g,f,v)}this.setIndex(a),this.setAttribute("position",new Se(o,3)),this.setAttribute("normal",new Se(l,3)),this.setAttribute("uv",new Se(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},Yl=class r extends Ze{constructor(e=1,t=.4,i=64,n=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:n,p:s,q:a},i=Math.floor(i),n=Math.floor(n);let o=[],l=[],c=[],h=[],d=new w,u=new w,p=new w,m=new w,y=new w,g=new w,f=new w;for(let x=0;x<=i;++x){let _=x/i*s*Math.PI*2;v(_,s,a,e,p),v(_+.01,s,a,e,m),g.subVectors(m,p),f.addVectors(m,p),y.crossVectors(g,f),f.crossVectors(y,g),y.normalize(),f.normalize();for(let R=0;R<=n;++R){let E=R/n*Math.PI*2,S=-t*Math.cos(E),T=t*Math.sin(E);d.x=p.x+(S*f.x+T*y.x),d.y=p.y+(S*f.y+T*y.y),d.z=p.z+(S*f.z+T*y.z),l.push(d.x,d.y,d.z),u.subVectors(d,p).normalize(),c.push(u.x,u.y,u.z),h.push(x/i),h.push(R/n)}}for(let x=1;x<=i;x++)for(let _=1;_<=n;_++){let R=(n+1)*(x-1)+(_-1),E=(n+1)*x+(_-1),S=(n+1)*x+_,T=(n+1)*(x-1)+_;o.push(R,E,T),o.push(E,S,T)}function v(x,_,R,E,S){let T=Math.cos(x),I=Math.sin(x),U=R/_*x,j=Math.cos(U);S.x=E*(2+j)*.5*T,S.y=E*(2+j)*I*.5,S.z=E*Math.sin(U)*.5}this.setIndex(o),this.setAttribute("position",new Se(l,3)),this.setAttribute("normal",new Se(c,3)),this.setAttribute("uv",new Se(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},Zl=class r extends Ze{constructor(e=new Wa(new w(-1,-1,0),new w(-1,1,0),new w(1,1,0)),t=64,i=1,n=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:n,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new w,l=new w,c=new ne,h=new w,d=[],u=[],p=[],m=[];function y(g){h=e.getPointAt(g/t,h);let f=a.normals[g],v=a.binormals[g];for(let x=0;x<=n;x++){let _=x/n*Math.PI*2,R=Math.sin(_),E=-Math.cos(_);l.x=E*f.x+R*v.x,l.y=E*f.y+R*v.y,l.z=E*f.z+R*v.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,d.push(o.x,o.y,o.z)}}(function(){for(let g=0;g<t;g++)y(g);y(s===!1?t:0),function(){for(let g=0;g<=t;g++)for(let f=0;f<=n;f++)c.x=g/t,c.y=f/n,p.push(c.x,c.y)}(),function(){for(let g=1;g<=t;g++)for(let f=1;f<=n;f++){let v=(n+1)*(g-1)+(f-1),x=(n+1)*g+(f-1),_=(n+1)*g+f,R=(n+1)*(g-1)+f;m.push(v,x,R),m.push(x,_,R)}}()})(),this.setIndex(m),this.setAttribute("position",new Se(d,3)),this.setAttribute("normal",new Se(u,3)),this.setAttribute("uv",new Se(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new Xa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Jl=class extends Ze{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,n=new w,s=new w;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let d=l[c],u=d.start;for(let p=u,m=u+d.count;p<m;p+=3)for(let y=0;y<3;y++){let g=o.getX(p+y),f=o.getX(p+(y+1)%3);n.fromBufferAttribute(a,g),s.fromBufferAttribute(a,f),Cu(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,d=3*o+(c+1)%3;n.fromBufferAttribute(a,h),s.fromBufferAttribute(a,d),Cu(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new Se(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Cu(r,e,t){let i=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,n=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(i)!==!0&&t.has(n)!==!0&&(t.add(i),t.add(n),!0)}var ng=Object.freeze({__proto__:null,BoxGeometry:ji,CapsuleGeometry:Bl,CircleGeometry:Hl,ConeGeometry:Xi,CylinderGeometry:wi,DodecahedronGeometry:ps,EdgesGeometry:Gl,ExtrudeGeometry:vs,IcosahedronGeometry:jl,LatheGeometry:$a,OctahedronGeometry:Lr,PlaneGeometry:cn,PolyhedronGeometry:zn,RingGeometry:Pr,ShapeGeometry:Xl,SphereGeometry:ys,TetrahedronGeometry:$l,TorusGeometry:ql,TorusKnotGeometry:Yl,TubeGeometry:Zl,WireframeGeometry:Jl});var xs=class extends Mi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var qa=class extends Rr{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function ya(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function tf(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var Ir=class{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,n=t[i],s=t[i-1];t:{e:{let a;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<s)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=t[++i],e<n)break e}a=t.length;break i}if(e>=s)break t;{let o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=s,s=t[--i-1],e>=s)break e}a=i,i=0}}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n;for(let a=0;a!==n;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Kl=class extends Ir{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Sh,endingEnd:Sh}}intervalChanged_(e,t,i){let n=this.parameterPositions,s=e-2,a=e+1,o=n[s],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case wh:s=e,o=2*t-i;break;case Eh:s=n.length-2,o=t+n[s]-n[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case wh:a=e,l=2*i-t;break;case Eh:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}let c=.5*(i-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,m=(i-t)/(n-t),y=m*m,g=y*m,f=-u*g+2*u*y-u*m,v=(1+u)*g+(-1.5-2*u)*y+(-.5+u)*m+1,x=(-1-p)*g+(1.5+p)*y+.5*m,_=p*g-p*y;for(let R=0;R!==o;++R)s[R]=f*a[h+R]+v*a[c+R]+x*a[l+R]+_*a[d+R];return s}},Ql=class extends Ir{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(n-t),d=1-h;for(let u=0;u!==o;++u)s[u]=a[c+u]*d+a[l+u]*h;return s}},ec=class extends Ir{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}},ui=class{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ya(t,this.TimeBufferType),this.values=ya(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ya(e.times,Array),values:ya(e.values,Array)};let n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new ec(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ql(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Kl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case _a:t=this.InterpolantFactoryMethodDiscrete;break;case ba:t=this.InterpolantFactoryMethodLinear;break;case Eo:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(i);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return _a;case this.InterpolantFactoryMethodLinear:return ba;case this.InterpolantFactoryMethodSmooth:return Eo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){let i=this.times,n=i.length,s=0,a=n-1;for(;s!==n&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==n){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,n=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&tf(n))for(let o=0,l=n.length;o!==l;++o){let c=n[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===Eo,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(n)l=!0;else{let h=o*i,d=h-i,u=h+i;for(let p=0;p!==i;++p){let m=t[h+p];if(m!==t[d+p]||m!==t[u+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*i,d=a*i;for(let u=0;u!==i;++u)t[d+u]=t[h+u]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};ui.prototype.TimeBufferType=Float32Array,ui.prototype.ValueBufferType=Float32Array,ui.prototype.DefaultInterpolation=ba;var Pn=class extends ui{};Pn.prototype.ValueTypeName="bool",Pn.prototype.ValueBufferType=Array,Pn.prototype.DefaultInterpolation=_a,Pn.prototype.InterpolantFactoryMethodLinear=void 0,Pn.prototype.InterpolantFactoryMethodSmooth=void 0;var tc=class extends ui{};tc.prototype.ValueTypeName="color";var ic=class extends ui{};ic.prototype.ValueTypeName="number";var nc=class extends Ir{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t),c=e*o;for(let h=c+o;c!==h;c+=4)_i.slerpFlat(s,0,a,c-o,a,c,l);return s}},ns=class extends ui{InterpolantFactoryMethodLinear(e){return new nc(this.times,this.values,this.getValueSize(),e)}};ns.prototype.ValueTypeName="quaternion",ns.prototype.DefaultInterpolation=ba,ns.prototype.InterpolantFactoryMethodSmooth=void 0;var In=class extends ui{};In.prototype.ValueTypeName="string",In.prototype.ValueBufferType=Array,In.prototype.DefaultInterpolation=_a,In.prototype.InterpolantFactoryMethodLinear=void 0,In.prototype.InterpolantFactoryMethodSmooth=void 0;var rc=class extends ui{};rc.prototype.ValueTypeName="vector";var Lu={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},sc=class{constructor(e,t,i){let n=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){l++,a===!1&&n.onStart!==void 0&&n.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,n.onProgress!==void 0&&n.onProgress(h,o,l),o===l&&(a=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let p=c[d],m=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return m}return null}}},nf=new sc,_s=class{constructor(e){this.manager=e!==void 0?e:nf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(n,s){i.load(e,n,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};_s.DEFAULT_MATERIAL_NAME="__DEFAULT";var ac=class extends _s{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Lu.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;let o=ss("img");function l(){h(),Lu.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(d){h(),n&&n(d),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}};var Ya=class extends _s{constructor(e){super(e)}load(e,t,i,n){let s=new Ut,a=new ac(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,n),s}},Za=class extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}},Ja=class extends Za{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},nl=new Le,Pu=new w,Iu=new w,oc=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ne(512,512),this.map=null,this.mapPass=null,this.matrix=new Le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Er,this._frameExtents=new ne(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Pu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Pu),Iu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Iu),t.updateMatrixWorld(),nl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(nl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var rg=new Le,sg=new w,ag=new w;var lc=class extends oc{constructor(){super(new Tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},bs=class extends Za{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new lc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var og=new Le,lg=new Le,cg=new Le;var hg=new w,ug=new _i,dg=new w,pg=new w;var mg=new w,fg=new _i,gg=new w,vg=new w;var gc="\\[\\]\\.:\\/",rf=new RegExp("["+gc+"]","g"),rl="[^"+gc+"]",sf="[^"+gc.replace("\\.","")+"]",af=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",rl)+/(WCOD+)?/.source.replace("WCOD",sf)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",rl)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",rl)+"$"),of=["material","materials","bones","map"],it=class r{constructor(e,t,i){this.path=t,this.parsedPath=i||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,i):new r(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(rf,"")}static parseTrackName(e){let t=af.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let s=i.nodeName.substring(n+1);of.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,n=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[i]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[i]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[n];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};it.Composite=class{constructor(r,e,t){let i=t||it.parseTrackName(e);this._targetGroup=r,this._bindings=r.subscribe_(e,i)}getValue(r,e){this.bind();let t=this._targetGroup.nCachedObjects_,i=this._bindings[t];i!==void 0&&i.getValue(r,e)}setValue(r,e){let t=this._bindings;for(let i=this._targetGroup.nCachedObjects_,n=t.length;i!==n;++i)t[i].setValue(r,e)}bind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].bind()}unbind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].unbind()}},it.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},it.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},it.prototype.GetterByBindingType=[it.prototype._getValue_direct,it.prototype._getValue_array,it.prototype._getValue_arrayElement,it.prototype._getValue_toArray],it.prototype.SetterByBindingTypeAndVersioning=[[it.prototype._setValue_direct,it.prototype._setValue_direct_setNeedsUpdate,it.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[it.prototype._setValue_array,it.prototype._setValue_array_setNeedsUpdate,it.prototype._setValue_array_setMatrixWorldNeedsUpdate],[it.prototype._setValue_arrayElement,it.prototype._setValue_arrayElement_setNeedsUpdate,it.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[it.prototype._setValue_fromArray,it.prototype._setValue_fromArray_setNeedsUpdate,it.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var yg=new Float32Array(1);var Du=new Le,Ka=class{constructor(e,t,i=0,n=1/0){this.ray=new On(e,t),this.near=i,this.far=n,this.camera=null,this.layers=new as,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Du.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Du),this}intersectObject(e,t=!0,i=[]){return cc(e,this,i,t),i.sort(Uu),i}intersectObjects(e,t=!0,i=[]){for(let n=0,s=e.length;n<s;n++)cc(e[n],this,i,t);return i.sort(Uu),i}};function Uu(r,e){return r.distance-e.distance}function cc(r,e,t,i){if(r.layers.test(e.layers)&&r.raycast(e,t),i===!0){let n=r.children;for(let s=0,a=n.length;s<a;s++)cc(n[s],e,t,!0)}}var xg=new ne;var _g=new w,bg=new w;var Mg=new w;var Sg=new w,wg=new Le,Eg=new Le;var Tg=new w,Ag=new Pe,Rg=new Pe;var Qa=class extends Fa{constructor(e=10,t=10,i=4473924,n=8947848){i=new Pe(i),n=new Pe(n);let s=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,u=0,p=-o;d<=t;d++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);let m=d===s?i:n;m.toArray(c,u),u+=3,m.toArray(c,u),u+=3,m.toArray(c,u),u+=3,m.toArray(c,u),u+=3}let h=new Ze;h.setAttribute("position",new Se(l,3)),h.setAttribute("color",new Se(c,3)),super(h,new Rr({vertexColors:!0,toneMapped:!1})),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var Cg=new w,Lg=new w,Pg=new w;var Ig=new w,Dg=new os;var Ug=new Ht;var Ms=class extends Fa{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),n=new Ze;n.setIndex(new wt(i,1)),n.setAttribute("position",new Se([1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],3)),super(n,new Rr({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}};var Ng=new w;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sl}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sl);(()=>{if(Ce&&typeof Ce.envmap_physical_pars_fragment=="string"&&(Ce.envmap_physical_pars_fragment=Ce.envmap_physical_pars_fragment.replaceAll(" * envMapIntensity","")),Hi&&typeof Hi.sRGBToLinear=="function"){let r=new Uint8Array(256);for(let t=0;t<256;t++){let i=t/255;r[t]=Math.round(255*(i<=.04045?i/12.92:((i+.055)/1.055)**2.4))}let e=Hi.sRGBToLinear.bind(Hi);Hi.sRGBToLinear=t=>{if(typeof document>"u"||!t||!(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap||typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas))return e(t);let n=document.createElement("canvas");n.width=t.width,n.height=t.height;let s=n.getContext("2d",{willReadFrequently:!0});if(!s)return e(t);s.drawImage(t,0,0);let a=s.getImageData(0,0,n.width,n.height),o=a.data;for(let l=0;l<o.length;l+=4)o[l]=r[o[l]],o[l+1]=r[o[l+1]],o[l+2]=r[o[l+2]];return s.putImageData(a,0,0),n}}})();var ad={forest:{top:"#347c65",side:"#203f3b",path:"#78a184",fog:"#142529"},night:{top:"#39445f",side:"#242b43",path:"#6a7191",fog:"#1b2034"},space:{top:"#28384a",side:"#192338",path:"#465b73",fog:"#101727"},race:{top:"#32675d",side:"#233e3e",path:"#364451",fog:"#15292d"},sand:{top:"#c5a87b",side:"#816e55",path:"#e3cba3",fog:"#2d2923"}},od=(r,e={})=>new xs({color:r,roughness:.75,...e});function Et(r,e,t,i=0,n=0,s=0,a={}){let o=new xt(r,od(e,a));return o.position.set(i,n,s),o.castShadow=!0,o.receiveShadow=!0,t.add(o),o}var bt=(r,e,t,i,n,s=0,a=0,o=0)=>Et(new ji(r,e,t),i,n,s,a,o),Kt=(r,e,t,i=0,n=0,s=0)=>Et(new ys(r,16,12),e,t,i,n,s);function cf(r,e){let t=new hi,i=r.color;if(["hero","npc"].includes(r.kind))bt(.53,.56,.42,i,t,0,.63),bt(.83,.58,.57,i,t,0,1.19),bt(.64,.29,.05,"#153649",t,0,1.23,.302),bt(.1,.14,.04,"#d8ffff",t,-.18,1.24,.335),bt(.1,.14,.04,"#d8ffff",t,.18,1.24,.335),Kt(.12,i,t,-.4,.7),Kt(.12,i,t,.4,.7),bt(.18,.24,.28,"#264650",t,-.17,.19,.03),bt(.18,.24,.28,"#264650",t,.17,.19,.03),Et(new wi(.025,.025,.2,6),i,t,0,1.58),Kt(.07,"#d9ffff",t,0,1.71);else if(r.kind==="tree")Et(new wi(.13,.19,1,7),"#8c7258",t,0,.5),Et(new Xi(.98,1.55,7),i,t,0,1.25),Et(new Xi(.78,1.4,7),i,t,0,1.9),Et(new Xi(.55,1.2,7),"#62c99e",t,0,2.45);else if(r.kind==="crystal"){Et(new Lr(.43),i,t,0,.8,0,{metalness:.25,roughness:.25,emissive:i,emissiveIntensity:.17}).scale.set(.73,1.35,.73);let s=Et(new Pr(.28,.38,32),i,t,0,.025,0,{transparent:!0,opacity:.2,side:Ss});s.rotation.x=-Math.PI/2}else if(r.kind==="slime"){let n=Kt(.58,i,t,0,.48);n.scale.y=.78,Kt(.075,"#252844",t,-.2,.58,.48),Kt(.075,"#252844",t,.2,.58,.48),Kt(.13,i,t,-.35,.13,.23),Kt(.13,i,t,.35,.13,.23)}else if(r.kind==="rock"){let n=Et(new ps(.66),i,t,0,.38);n.scale.set(1,.75,.8),n.rotation.set(.2,.4,.1)}else if(r.kind==="crate"){bt(.9,.85,.9,i,t,0,.425);for(let n of[-.34,.34])bt(.12,.95,.98,"#875b3a",t,n,.44);for(let n of[.1,.73])bt(.97,.1,.96,"#ba874c",t,0,n)}else if(r.kind==="portal"){let n=new Cr;n.moveTo(-.85,0),n.lineTo(-.85,1.35),n.absarc(0,1.35,.85,Math.PI,0,!0),n.lineTo(.85,0),n.lineTo(.59,0),n.lineTo(.59,1.35),n.absarc(0,1.35,.59,0,Math.PI,!1),n.lineTo(-.59,0),Et(new vs(n,{depth:.3,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:2,steps:1}),i,t,0,0,0,{emissive:i,emissiveIntensity:.45}),Et(new cn(1.15,1.6),"#9e87ff",t,0,.86,.12,{transparent:!0,opacity:.35,side:Ss,emissive:"#9e87ff",emissiveIntensity:.7}),bt(2,.15,.8,"#62698f",t,0,.08,.15)}else if(r.kind==="car"){bt(.8,.28,1.3,i,t,0,.37),bt(.65,.3,.65,i,t,0,.62,-.1),bt(.58,.24,.04,"#b8e8f4",t,0,.64,.245);for(let n of[-.45,.45])for(let s of[-.42,.42]){let a=Et(new wi(.21,.21,.16,12),"#19242a",t,n,.23,s);a.rotation.z=Math.PI/2}bt(.17,.1,.04,"#fff6c8",t,-.23,.38,.67),bt(.17,.1,.04,"#fff6c8",t,.23,.38,.67)}else if(r.kind==="ship"){let n=Et(new Xi(.4,1.4,4),i,t,0,.4);n.rotation.x=-Math.PI/2,bt(1.4,.12,.45,i,t,0,.32,.18),Kt(.2,"#c4f3ff",t,0,.55,-.1)}else if(r.kind==="flower"){Et(new wi(.025,.035,.5,5),"#71b886",t,0,.25);for(let n=0;n<5;n++){let s=n*Math.PI*2/5,a=Kt(.13,i,t,Math.cos(s)*.15,.53,Math.sin(s)*.15);a.scale.y=.5}Kt(.09,"#fff3ac",t,0,.56)}else if(r.kind==="image"){let n=e.find(s=>s.id===r.assetId);if(n){let s,a=new Ya().load(n.src,o=>{if(s){let l=o.image.width/o.image.height;s.scale.x=1.5*l}});a.colorSpace=kt,a.magFilter=yt,a.minFilter=Ft,r.billboard==="screen"?s=new Na(new ls({map:a,transparent:!0,alphaTest:.1})):(s=new xt(new cn(1,1),new Sr({map:a,transparent:!0,alphaTest:.1,side:Ss})),s.userData.upright=!0),s.scale.set(1.5*(n.width||1)/(n.height||1),1.5,1),s.position.y=.75,t.add(s)}}else if(r.kind==="button"){bt(1.5,.25,.75,i,t,0,.2);let n=Et(new Xi(.18,.4,3),"#164655",t,0,.38);n.rotation.z=-Math.PI/2}else for(let n=0;n<8;n++){let s=n*2.4,a=Et(new Lr(.07),i,t,Math.cos(s)*.6,.3+n*.17,Math.sin(s)*.6,{emissive:i,emissiveIntensity:.7});a.rotation.z=s}return t.traverse(n=>{n.userData.objectId=r.id}),t}var un=class{constructor(e,t="3d"){if(this.host=e,this.mode=t,this.zoom=1,this.angle=.62,this.elevation=.78,this.showGrid=!1,this.selected=null,this.path=[],this.meshes=new Map,this.images=new Map,this.assetSources=new Map,this.assets=[],this.map=fi(),this.pan={x:0,y:0,z:0},this.camConfig=si(t==="3d"?"iso":"flat"),this.followPoint=new w,this.canvas=document.createElement("canvas"),this.canvas.setAttribute("aria-label",t==="3d"?"3D game world":"2D game world"),e.prepend(this.canvas),this.selectionLabel=document.createElement("div"),this.selectionLabel.className="selection-tag",this.selectionLabel.hidden=!0,e.append(this.selectionLabel),this.tiles=new Map(Object.keys(Ii).map(i=>[i,jc(i)])),t==="3d"){let i=/Xbox/i.test(navigator.userAgent);try{this.renderer=new Ar({canvas:this.canvas,antialias:!i,alpha:!0,powerPreference:"high-performance"})}catch{this.renderer=new Ar({canvas:this.canvas,antialias:!1,alpha:!0,powerPreference:"default"})}this.renderer.setPixelRatio(Math.min(devicePixelRatio,i?1:2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=hc,this.renderer.outputColorSpace=kt,this.renderer.toneMapping=uc,this.renderer.toneMappingExposure=1.1,this.world=new Da,this.ortho=new Tr(-12,12,8,-8,.1,250),this.perspective=new Dt(65,1,.07,200),this.camera=this.ortho,this.world.add(new Ja("#c0e6f0","#243d3e",1.8));let n=new bs("#fff6e1",2.5);n.position.set(-7,15,8),n.castShadow=!0,n.shadow.mapSize.set(1024,1024),Object.assign(n.shadow.camera,{left:-20,right:20,top:20,bottom:-20}),n.shadow.bias=-8e-4,n.shadow.normalBias=.03,this.world.add(n),this.sun=n;let s=new bs("#73bdff",.85);s.position.set(8,5,-6),this.world.add(s),this.content=new hi,this.world.add(this.content),this.terrainGroup=new hi,this.world.add(this.terrainGroup),this.ray=new Ka,this.groundPlane=new Zt(new w(0,1,0),0),this.v=new ne,this.selectionBox=new Ht,this.selection=new Ms(this.selectionBox,"#80eaff"),this.selection.material.depthTest=!1,this.selection.material.depthWrite=!1,this.selection.material.transparent=!0,this.selection.material.opacity=.95,this.selection.renderOrder=999,this.selection.visible=!1,this.world.add(this.selection),this.brushPreview=new Ms(new Ht,"#8ff5cd"),this.brushPreview.material.depthTest=!1,this.brushPreview.material.depthWrite=!1,this.brushPreview.renderOrder=998,this.brushPreview.visible=!1,this.world.add(this.brushPreview),this.particleGeo=new Ze,this.particleGeo.setAttribute("position",new wt(new Float32Array(340*3),3)),this.particlePoints=new ka(this.particleGeo,new hs({color:"#a7f4ff",size:.11,transparent:!0,opacity:.9})),this.world.add(this.particlePoints)}else this.ctx=this.canvas.getContext("2d");this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.resize()}get side(){return this.camConfig.preset==="side"}configure(e){this.camConfig={...si(this.mode==="3d"?"iso":"flat"),...e},this.sideCenter=4,this.scene&&this.cacheTerrain2d()}resize(){this.w=this.host.clientWidth||800,this.h=this.host.clientHeight||600,this.renderer?(this.renderer.setSize(this.w,this.h,!1),this.perspective.aspect=this.w/this.h,this.perspective.updateProjectionMatrix(),this.updateCamera()):(this.canvas.width=this.w*Math.min(devicePixelRatio,2),this.canvas.height=this.h*Math.min(devicePixelRatio,2),this.ctx.setTransform(Math.min(devicePixelRatio,2),0,0,Math.min(devicePixelRatio,2),0,0))}updateCamera(){if(!this.ortho||this.playing)return;this.camera=this.ortho;let e=this.w/this.h,t=Math.max(8.2,this.map.depth*.65,this.map.width/e*.6)/this.zoom;this.camera.left=-t*e,this.camera.right=t*e,this.camera.top=t,this.camera.bottom=-t,this.camera.position.set(this.pan.x+Math.sin(this.angle)*70*Math.cos(this.elevation),this.pan.y+Math.sin(this.elevation)*70,this.pan.z+Math.cos(this.angle)*70*Math.cos(this.elevation)),this.camera.lookAt(this.pan.x,this.pan.y+.2,this.pan.z),this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld()}orbit(e,t){this.angle+=e*.008,this.elevation=We(this.elevation+t*.005,.2,1.5),this.updateCamera()}panPixels(e,t){if(this.renderer){let i=(this.ortho.top-this.ortho.bottom)/this.h;this.pan.x-=e*i*Math.cos(this.angle)+t*i*Math.sin(this.angle)/Math.max(.25,Math.sin(this.elevation)),this.pan.z+=e*i*Math.sin(this.angle)-t*i*Math.cos(this.angle)/Math.max(.25,Math.sin(this.elevation))}else{let i=this.scale2d();this.pan.x-=e/i,this.side?this.pan.y+=t/i:this.pan.z-=t/i}this.updateCamera()}setZoom(e){this.zoom=We(e,.3,5),this.updateCamera()}reset(){this.angle=.62,this.elevation=.78,this.pan={x:0,y:0,z:0},this.setZoom(1)}beginPlay(e,t){this.configure(e),this.playing||(this.savedView={pan:{...this.pan},zoom:this.zoom}),this.playing=!0,this.followPoint.set(t?.x||0,t?.y||0,t?.z||0),this.cameraYaw=(e.yaw||0)*Math.PI/180,this.cameraPitch=(e.angle||0)*Math.PI/180,this.cameraReady=!1}endPlay(){this.playing=!1,this.savedView&&(this.pan=this.savedView.pan,this.zoom=this.savedView.zoom),this.camera=this.ortho,this.updateCamera()}updatePlayCamera(e,t){if(!e)return;let i=this.camConfig,n=1-Math.exp(-8*t),s=new w(e.x,e.y,e.z);if(i.follow||i.preset==="first"||i.preset==="third"||i.preset==="side"?this.followPoint.lerp(s,n):this.followPoint.set(0,0,0),!!this.renderer){if(i.preset==="first"||i.preset==="third"){this.camera=this.perspective;let a=this.followPoint,o=this.cameraYaw,l=this.cameraPitch,c,h;if(i.preset==="first")c=new w(a.x,a.y+i.height,a.z),h=c.clone().add(new w(-Math.sin(o)*Math.cos(l),-Math.sin(l),-Math.cos(o)*Math.cos(l)));else{h=new w(a.x,a.y+.9,a.z),c=new w(a.x+Math.sin(o)*i.distance*Math.cos(l),Math.max(a.y+.25,a.y+i.height+Math.sin(l)*i.distance*.45),a.z+Math.cos(o)*i.distance*Math.cos(l));let d=c.clone().sub(h),u=d.length();d.normalize();for(let p=.5;p<u;p+=.2){let m=h.clone().addScaledVector(d,p);if(this.terrainIndex.blocked(m.x,m.z,m.y,.15,.12)){c=h.clone().addScaledVector(d,Math.max(.4,p-.3));break}}}this.cameraReady?(this.camera.position.lerp(c,n),this.lookAtPoint.lerp(h,n)):(this.camera.position.copy(c),this.lookAtPoint=h.clone(),this.cameraReady=!0),this.camera.lookAt(this.lookAtPoint)}else{this.camera=this.ortho;let a=this.w/this.h,o=i.distance*.95;Object.assign(this.ortho,{left:-o*a,right:o*a,top:o,bottom:-o});let l=this.followPoint;this.camera.position.set(l.x+Math.sin(.62+this.cameraYaw)*i.distance*3,l.y+i.height+Math.sin(i.angle*Math.PI/180)*i.distance*3,l.z+Math.cos(.62+this.cameraYaw)*i.distance*3),this.camera.lookAt(l.x,l.y+.3,l.z),this.camera.updateProjectionMatrix()}this.camera.updateMatrixWorld()}}disposeTree(e){let t=new Set,i=new Set,n=new Set;e.traverse(s=>{s.geometry&&t.add(s.geometry);for(let a of s.material?Array.isArray(s.material)?s.material:[s.material]:[])i.add(a),a.map&&n.add(a.map)}),t.forEach(s=>s.dispose()),i.forEach(s=>s.dispose()),n.forEach(s=>s.dispose())}setScene(e,t=[]){this.scene=e,this.map=e.map||fi(e.theme),this.assets=t,this.palette=ad[e.theme]||ad.forest,this.host.dataset.theme=e.theme;for(let i of t)if(this.assetSources.get(i.id)!==i.src){for(let n of this.images.keys())n.endsWith(i.id)&&this.images.delete(n);this.assetSources.set(i.id,i.src)}if(this.setTerrain(e),!!this.renderer){this.disposeTree(this.content),this.content.clear(),this.meshes.clear();for(let i of e.objects){let n=cf(i,t);this.content.add(n),this.meshes.set(i.id,n)}this.updateCamera()}}setTerrain(e){if(this.scene=e,this.map=e.map||fi(e.theme),this.terrainIndex=new jn(e),this.cacheTerrain2d(),!this.renderer)return;this.disposeTree(this.terrainGroup),this.terrainGroup.clear();let t=this.map,i=new Map,n=new Map(t.tiles.map(c=>[`${c.x},${c.z}`,c.tile])),s=(c,h,d)=>{let u=c+":"+h;i.has(u)||i.set(u,{tile:c,shape:h,cells:[]}),i.get(u).cells.push(d)};for(let c=-t.width/2;c<t.width/2;c++)for(let h=-t.depth/2;h<t.depth/2;h++){let d=n.get(`${c},${h}`);d==="void"||!t.base&&!d||s(d||t.tileset,"floor",{x:c,y:-.3,z:h})}for(let c of t.blocks)s(c.tile,c.shape,c);let a=new Map,o=new Map;for(let{tile:c,shape:h,cells:d}of i.values()){if(!a.has(c)){let g=new Ba(this.tiles.get(c));g.colorSpace=kt,g.magFilter=yt,a.set(c,g),o.set(c,new xs({map:g,roughness:.85}))}let u=h==="floor"?.3:ni[h].height,p=h==="pillar"?new wi(.48,.48,u,12):new ji(1,u,1),m=new za(p,o.get(c),d.length),y=new Le;d.forEach((g,f)=>{y.makeTranslation(g.x+.5,g.y+u/2,g.z+.5),m.setMatrixAt(f,y)}),m.castShadow=h!=="floor",m.receiveShadow=!0,m.userData.terrain=!0,m.userData.shape=h,m.userData.cells=d,m.computeBoundingSphere(),this.terrainGroup.add(m)}if(t.decorated&&t.base&&e.theme==="race"){let c=new xt(new Pr(2.9,5.1,4,1,Math.PI/4),od("#344653",{side:Ss}));c.rotation.x=-Math.PI/2,c.position.y=.018,c.scale.set(1.35,.9,1),this.terrainGroup.add(c)}this.grid&&(this.world.remove(this.grid),this.disposeTree(this.grid)),this.grid=new Qa(Math.max(t.width,t.depth),Math.max(t.width,t.depth),"#86dfde","#87bcc0"),this.grid.position.y=.025,this.grid.material.transparent=!0,this.grid.material.opacity=.15,this.world.add(this.grid);let l=Math.max(t.width,t.depth)*.65;Object.assign(this.sun.shadow.camera,{left:-l,right:l,top:l,bottom:-l}),this.sun.shadow.camera.updateProjectionMatrix(),this.updateCamera()}cacheTerrain2d(){if(this.renderer||!this.scene)return;let e=this.map,t=document.createElement("canvas"),i=32;t.width=e.width*i,t.height=(this.side?20:e.depth)*i;let n=t.getContext("2d"),s=new Map(e.tiles.map(a=>[`${a.x},${a.z}`,a.tile]));if(this.side){for(let a=-e.width/2;a<e.width/2;a++){let o=s.get(`${a},0`);o==="void"||!e.base&&!o||(n.fillStyle=this.palette?.side||"#24564d",n.fillRect((a+e.width/2)*i,16*i,i,4*i),n.drawImage(this.tiles.get(o||e.tileset),(a+e.width/2)*i,16*i,i,i))}for(let a of[...e.blocks].sort((o,l)=>l.z-o.z)){let o=ni[a.shape].height;n.drawImage(this.tiles.get(a.tile),(a.x+e.width/2)*i,(16-a.y-o)*i,i,o*i)}}else{for(let a=-e.width/2;a<e.width/2;a++)for(let o=-e.depth/2;o<e.depth/2;o++){let l=s.get(`${a},${o}`);l==="void"||!e.base&&!l||n.drawImage(this.tiles.get(l||e.tileset),(a+e.width/2)*i,(o+e.depth/2)*i,i,i)}for(let a of[...e.blocks].sort((o,l)=>o.y-l.y)){let o=(a.x+e.width/2)*i,l=(a.z+e.depth/2)*i;n.drawImage(this.tiles.get(a.tile),o,l,i,i),n.fillStyle="#0004",n.fillRect(o,l+i-3,i,3),n.strokeStyle="#d4f6ff55",n.strokeRect(o+1,l+1,i-2,i-2)}}this.terrainCanvas=t}rayAt(e,t){let i=this.canvas.getBoundingClientRect();this.v.set((e-i.left)/this.w*2-1,-(t-i.top)/this.h*2+1),this.camera.updateMatrixWorld(),this.world.updateMatrixWorld(!0),this.ray.setFromCamera(this.v,this.camera)}screenToWorld(e,t,i=0){let n=this.canvas.getBoundingClientRect(),s=e-n.left,a=t-n.top,o=Vt(this.scene||{map:this.map},.1);if(this.renderer){this.rayAt(e,t);let h=new Zt(new w(0,1,0),-i),d=new w;return this.ray.ray.intersectPlane(h,d)?{x:We(d.x,o.minX,o.maxX),y:i,z:We(d.z,o.minZ,o.maxZ)}:{x:0,y:i,z:0}}let l=this.scale2d(),c=this.center2d();return this.side?{x:We((s-this.w/2)/l+c.x,o.minX,o.maxX),y:We(c.y-(a-this.h/2)/l,0,20),z:.5}:{x:We((s-this.w/2)/l+c.x,o.minX,o.maxX),y:i,z:We((a-this.h/2)/l+c.z+i,o.minZ,o.maxZ)}}placementPoint(e,t){if(!this.renderer)return this.screenToWorld(e,t);this.rayAt(e,t);let i=this.ray.intersectObjects(this.terrainGroup.children,!0).find(n=>n.object.userData.terrain);return i&&i.face.normal.y>.5?{x:i.point.x,y:Math.max(0,i.point.y),z:i.point.z}:this.screenToWorld(e,t)}terrainCell(e,t,i){if(!this.renderer){let s=this.screenToWorld(e,t);return{x:Math.floor(s.x),y:this.side?Math.floor(s.y):i.layer||0,z:this.side?0:Math.floor(s.z)}}if(this.rayAt(e,t),i.tool!=="floor"&&i.layer===0){let s=this.ray.intersectObjects(this.terrainGroup.children,!0).find(a=>a.object.userData.terrain);if(s){let a=s.point.clone().addScaledVector(s.face.normal,i.erase?-.015:.015);return{x:Math.floor(a.x),y:Math.max(0,Math.floor(a.y)),z:Math.floor(a.z)}}}let n=this.screenToWorld(e,t,i.tool==="floor"?0:i.layer||0);return{x:Math.floor(n.x),y:i.layer||0,z:Math.floor(n.z)}}hit(e,t,i){if(this.renderer){this.rayAt(e,t);let c=new Set(i.filter(d=>d.visible!==!1&&!d.removed).map(d=>d.id));return this.ray.intersectObjects([...this.meshes].filter(([d])=>c.has(d)).map(([,d])=>d),!0)[0]?.object.userData.objectId||null}let n=this.canvas.getBoundingClientRect(),s=this.scale2d(),a=this.center2d(),o=e-n.left,l=t-n.top;return[...i].sort((c,h)=>this.side?c.z-h.z:h.z-c.z).find(c=>{if(c.visible===!1||c.removed)return!1;let h=this.w/2+(c.x-a.x)*s,d=this.h/2+(this.side?a.y-c.y-.8*c.scale:c.z-a.z-c.y)*s,u=s*1.8*c.scale,p=this.getImage(c),m=c.kind==="image"&&p.naturalHeight?p.naturalWidth/p.naturalHeight:1;return Math.abs(o-h)<u*m*.5&&Math.abs(l-d)<u*.5})?.id||null}scale2d(){return this.playing&&(this.camConfig.follow||this.side)?Math.min(this.w/20,this.h/13):Math.min(this.w/(this.map.width+2),this.h/(this.side?13:this.map.depth+2))*this.zoom}center2d(){return this.playing&&(this.camConfig.follow||this.side)?{x:this.followPoint.x,y:this.followPoint.y+3,z:this.followPoint.z}:{x:this.pan.x,y:(this.sideCenter||4)+this.pan.y,z:this.pan.z}}getImage(e){let t=e.kind+e.color+(e.assetId||"");if(!this.images.has(t)){let i=new Image;i.src=e.kind==="image"?this.assets.find(n=>n.id===e.assetId)?.src||"":"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(Di(e.kind,e.color)),this.images.set(t,i)}return this.images.get(t)}showSelection(e,t,i){this.selectionLabel.hidden=!e||this.playing,!(!e||this.playing)&&(this.selectionLabel.textContent=e.name+(e.visible===!1?" \xB7 hidden":""),this.selectionLabel.style.left=We(t,45,this.w-45)+"px",this.selectionLabel.style.top=We(i,26,this.h-30)+"px",this.canvas.dataset.selectedId=e.id)}draw(e,t=0,i=null){if(!this.scene)return;let n=Math.min(.05,Math.max(.001,t-(this.lastDrawTime||t)));this.lastDrawTime=t,i&&this.updatePlayCamera(i.player,n);let s=e.find(a=>a.id===this.selected);if(s||(delete this.canvas.dataset.selectedId,this.selectionLabel.hidden=!0),this.renderer){for(let l of e){let c=this.meshes.get(l.id);c&&(c.visible=l.visible!==!1&&!l.removed&&!(i?.player===l&&this.camConfig.preset==="first"),c.position.set(l.x,l.y||0,l.z),c.scale.setScalar(l.scale),c.rotation.y=l.angle??l.rotation??0,l.kind==="crystal"&&!i&&(c.position.y+=Math.sin(t*1.6+l.x)*.12,c.rotation.y+=t*.4),l.kind==="slime"&&(c.scale.y=l.scale*(1+Math.sin(t*3+l.x)*.04)),l.kind==="image"&&c.children.forEach(h=>{h.userData.upright&&(h.rotation.y=Math.atan2(this.camera.position.x-l.x,this.camera.position.z-l.z)-c.rotation.y)}))}if(this.world.updateMatrixWorld(!0),this.selection.visible=!!s&&!i,this.selectionLabel.hidden=!!i||!s,s&&!i){let l=this.meshes.get(s.id);this.selectionBox.setFromObject(l).expandByScalar(.07);let c=new w;this.selectionBox.getCenter(c),c.y=this.selectionBox.max.y+.2,c.project(this.camera),this.showSelection(s,(c.x+1)*this.w/2,(1-c.y)*this.h/2)}if(this.brushCell&&!i){let l=this.brushCell;this.brushPreview.visible=!0,this.brushPreview.box.min.set(l.x,l.y,l.z),this.brushPreview.box.max.set(l.x+1,l.y+(this.brushHeight||1),l.z+1)}else this.brushPreview.visible=!1;this.grid&&(this.grid.visible=this.showGrid&&!i);let a=[...i?.particles||[],...i?.bullets||[]].slice(0,340),o=this.particleGeo.attributes.position;a.forEach((l,c)=>o.setXYZ(c,l.x,l.y,l.z)),o.needsUpdate=!0,this.particleGeo.setDrawRange(0,a.length),this.drawPath3d(),this.renderer.render(this.world,this.camera)}else this.draw2d(e,t,i,s)}drawPath3d(){let e=JSON.stringify(this.path);if(e===this.lastPath||(this.lastPath=e,this.pathGroup&&(this.disposeTree(this.pathGroup),this.world.remove(this.pathGroup)),this.pathGroup=new hi,this.world.add(this.pathGroup),!this.path.length))return;let t=this.path.map(n=>new w(n.x,(n.y||0)+.12,n.z));t.length>1&&t.push(t[0].clone());let i=new cs(new Ze().setFromPoints(t),new qa({color:"#8beaff",dashSize:.2,gapSize:.13,depthTest:!1}));i.computeLineDistances(),this.pathGroup.add(i);for(let n of this.path)Kt(.1,"#abf5ff",this.pathGroup,n.x,(n.y||0)+.12,n.z)}draw2d(e,t,i,n){let s=this.ctx,a=this.scale2d(),o=this.map,l=this.center2d();if(s.clearRect(0,0,this.w,this.h),s.save(),s.translate(this.w/2-l.x*a,this.h/2+(this.side?l.y*a:-l.z*a)),s.imageSmoothingEnabled=!1,this.terrainCanvas&&s.drawImage(this.terrainCanvas,-o.width/2*a,this.side?-16*a:-o.depth/2*a,o.width*a,(this.side?20:o.depth)*a),o.decorated&&this.scene.theme==="race"&&!this.side&&(s.strokeStyle="#344453",s.lineWidth=a*2.2,s.strokeRect(-a*4.6,-a*2.8,a*9.2,a*5.6),s.strokeStyle="#d3dbb9",s.lineWidth=1,s.setLineDash([10,10]),s.strokeRect(-a*4.6,-a*2.8,a*9.2,a*5.6),s.setLineDash([])),this.showGrid&&!i){s.strokeStyle="#9bc7bb33",s.lineWidth=1;for(let c=-o.width/2;c<=o.width/2;c++)s.beginPath(),s.moveTo(c*a,this.side?-16*a:-o.depth/2*a),s.lineTo(c*a,this.side?0:o.depth/2*a),s.stroke();for(let c=this.side?-16:-o.depth/2;c<=(this.side?0:o.depth/2);c++)s.beginPath(),s.moveTo(-o.width/2*a,c*a),s.lineTo(o.width/2*a,c*a),s.stroke()}this.path.length&&!i&&(s.strokeStyle="#85ecff",s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),this.path.forEach((c,h)=>{let d=c.x*a,u=(this.side?-(c.y||0):c.z)*a;h?s.lineTo(d,u):s.moveTo(d,u)}),s.closePath(),s.stroke(),s.setLineDash([]));for(let c of[...e].sort((h,d)=>this.side?d.z-h.z:h.z-d.z)){if(c.removed||c.visible===!1)continue;let h=this.getImage(c),d=a*1.8*c.scale,u=c.kind==="image"&&h.naturalWidth?h.naturalWidth/h.naturalHeight:1;s.save(),s.translate(c.x*a,(this.side?-c.y-.8*c.scale:c.z-c.y)*a),["car","ship"].includes(c.kind)&&s.rotate(-(c.angle??c.rotation)+Math.PI),h.complete&&h.naturalWidth&&s.drawImage(h,-d*u/2,-d/2,d*u,d),s.restore()}if(n&&!i){let c=a*1.8*n.scale,h=this.getImage(n),d=n.kind==="image"&&h.naturalHeight?h.naturalWidth/h.naturalHeight:1,u=n.x*a,p=(this.side?-n.y-.8*n.scale:n.z-n.y)*a;s.strokeStyle="#8decff",s.lineWidth=2,s.setLineDash([5,3]),s.strokeRect(u-c*d*.55,p-c*.55,c*d*1.1,c*1.1),s.setLineDash([]);for(let[m,y]of[[-1,-1],[-1,1],[1,-1],[1,1]])s.fillStyle="#c7f7ff",s.fillRect(u+m*c*d*.55-3,p+y*c*.55-3,6,6);this.showSelection(n,this.w/2+(n.x-l.x)*a,this.h/2+(this.side?l.y-n.y-.8*n.scale:n.z-n.y-l.z)*a-c*.6)}if(this.brushCell&&!i){let c=this.brushCell;s.strokeStyle="#a4f3c4",s.lineWidth=2,s.strokeRect(c.x*a,(this.side?-c.y-1:c.z)*a,a,this.side?a*(this.brushHeight||1):a)}for(let c of i?.particles||[])s.globalAlpha=Math.min(1,c.life),s.fillStyle=c.color,s.fillRect(c.x*a,(this.side?-c.y:c.z-c.y)*a,4,4);s.globalAlpha=1;for(let c of i?.bullets||[])s.fillStyle="#e3ffbc",s.fillRect(c.x*a-2,(this.side?-c.y:c.z-c.y)*a-5,5,10);s.restore()}destroy(){this.ro.disconnect(),this.world&&this.disposeTree(this.world),this.renderer?.dispose(),this.canvas.remove(),this.selectionLabel.remove()}};var ro=class{constructor(e,t=0,i=()=>{}){this.project=e,this.onEvent=i,this.score=0,this.lives=e.rules.lives,this.time=0,this.won=!1,this.lost=!1,this.particles=[],this.bullets=[],this.side=e.camera?.preset==="side",this.load(t)}load(e){this.sceneIndex=We(e,0,this.project.scenes.length-1),this.scene=this.project.scenes[this.sceneIndex],this.terrain=new jn(this.scene),this.limits=Vt(this.scene),this.objects=ai(this.scene.objects).filter(t=>t.visible!==!1),this.player=this.objects.find(t=>$e(t,"control")||$e(t,"drive")),this.objects.forEach(t=>{t.home={x:t.x,z:t.z,y:t.y},t.angle=t.rotation||0,t.vy=0,t.target=0,t.cooldown=0,t.grounded=!1}),this.bullets=[],this.invincible=0,this.talkCooldown=1,this.actionWasDown=!1,this.onEvent({type:"scene",index:this.sceneIndex})}emit(e,t){this.onEvent({type:e,object:t})}burst(e,t,i="#68edff",n=18,s=.5){for(let a=0;a<n&&this.particles.length<240;a++)this.particles.push({x:e,z:t,y:s,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,vy:Math.random()*3,life:.6+Math.random()*.6,color:i})}next(e="next"){if(e!=="close")if(e==="next")this.sceneIndex+1<this.project.scenes.length?this.load(this.sceneIndex+1):this.win();else{let t=this.project.scenes.findIndex(i=>i.id===e);t>=0&&this.load(t)}}win(){this.won||(this.won=!0,this.emit("win"))}hit(){this.invincible>0||this.won||this.lost||(this.lives--,this.invincible=2,this.emit("hurt"),this.player&&(this.burst(this.player.x,this.player.z,"#ff929c",18,this.player.y+.5),Object.assign(this.player,this.player.home,{vy:0,velocity:0})),this.lives<=0&&(this.lost=!0,this.emit("lose")))}blocked(e,t,i){let n=.3*e.scale,s=1.15*e.scale;return this.terrain.blocked(t,i,e.y,s,n)?!0:e!==this.player?!1:this.objects.some(a=>a!==e&&$e(a,"solid")&&!a.removed&&Math.hypot(t-a.x,i-a.z)<.48*(e.scale+a.scale)&&e.y<a.y+(a.kind==="tree"?2:1)*a.scale&&e.y+s>a.y+.1)}move(e,t,i){let n=this.limits,s=We(e.x+t,n.minX,n.maxX),a=We(e.z+i,n.minZ,n.maxZ);this.blocked(e,s,e.z)||(e.x=s),this.blocked(e,e.x,a)||(e.z=a)}vertical(e,t,i){let n=e.y,s=1.15*e.scale,a=this.terrain.floor(e.x,e.z,e.y+.08,.28*e.scale);e.grounded=Number.isFinite(a)&&Math.abs(e.y-a)<.13&&e.vy<=0,e.grounded&&(e.y=a,e.vy=0),i&&e.grounded&&(e.vy=gi(e,"jump")?.power||6,e.grounded=!1,this.emit("jump",e)),e.vy-=16*t;let o=e.y+e.vy*t;if(e.vy>0){let l=this.terrain.ceiling(e.x,e.z,n+s-.01,o+s,.28*e.scale);Number.isFinite(l)&&(o=l-s,e.vy=0)}e.vy<=0&&(a=this.terrain.floor(e.x,e.z,n+.04,.28*e.scale),Number.isFinite(a)&&o<=a&&n>=a-.1&&(o=a,e.vy=0,e.grounded=!0)),e.y=o,e.y<-6&&(e===this.player?this.hit():Object.assign(e,e.home,{vy:0}))}update(e,t={}){if(e=We(e,0,.05),this.invincible=Math.max(0,this.invincible-e),this.talkCooldown=Math.max(0,this.talkCooldown-e),this.particles=this.particles.filter(s=>(s.life-=e,s.x+=s.vx*e,s.z+=s.vz*e,s.y+=s.vy*e,s.vy-=6*e,s.life>0)),this.won||this.lost)return;if(this.time+=e,this.project.rules.timeLimit&&this.time>=this.project.rules.timeLimit){this.lost=!0,this.emit("lose");return}let i=t.action&&!this.actionWasDown;this.actionWasDown=!!t.action;for(let s of this.objects){if(s.removed)continue;if(s.cooldown=Math.max(0,s.cooldown-e),$e(s,"control")){let u=(t.right?1:0)-(t.left?1:0),p=this.side?0:(t.down?1:0)-(t.up?1:0),m=Math.hypot(u,p)||1,y=t.moveYaw||0,g=(u*Math.cos(y)+p*Math.sin(y))/m,f=(p*Math.cos(y)-u*Math.sin(y))/m,v=gi(s,"control").speed||4;this.move(s,g*v*e,f*v*e),(u||p)&&(s.angle=Math.atan2(g,f),u&&(s.facing=Math.sign(u)))}if($e(s,"drive")){let u=gi(s,"drive").speed||6;s.velocity=(s.velocity||0)+((t.up?6:0)-(t.down?7:0))*e,s.velocity*=Math.pow(.72,e),s.velocity=We(s.velocity,-u*.45,u),s.angle+=((t.left?1:0)-(t.right?1:0))*e*2*Math.sign(s.velocity||1),this.move(s,Math.sin(s.angle)*s.velocity*e,Math.cos(s.angle)*s.velocity*e)}if($e(s,"shoot")&&t.action&&s.cooldown<=0&&this.bullets.length<100){let u=t.moveYaw||0,p=this.side?0:t.lookPitch||0,m=this.side?s.facing||1:-Math.sin(u)*Math.cos(p),y=this.side?0:-Math.cos(u)*Math.cos(p),g=this.side?0:-Math.sin(p);this.bullets.push({x:s.x+m*.5,z:s.z+y*.5,y:s.y+(this.project.camera?.preset==="first"?this.project.camera.height:.65),dx:m,dz:y,dy:g,life:3,speed:gi(s,"shoot").speed||8}),s.cooldown=.23,this.emit("shoot",s)}let a=gi(s,"follow"),o=gi(s,"patrol"),l=gi(s,"wander"),c=null,h=0;if(a&&this.player&&s!==this.player)c=this.player,h=a.speed||1.6;else if(o){let u=s.path?.length?s.path:[{x:s.home.x-1.4,z:s.home.z},{x:s.home.x+1.4,z:s.home.z}];s.target%=u.length,c=u[s.target],h=o.speed||2,Math.hypot(s.x-c.x,s.z-c.z)<.15&&(s.target=(s.target+1)%u.length)}else l&&((!s.wanderTo||Math.hypot(s.x-s.wanderTo.x,s.z-s.wanderTo.z)<.2)&&(s.wanderTo={x:We(s.home.x+(Math.random()-.5)*5,this.limits.minX,this.limits.maxX),z:this.side?s.home.z:We(s.home.z+(Math.random()-.5)*5,this.limits.minZ,this.limits.maxZ)}),c=s.wanderTo,h=l.speed||1.2);if(c){let u=c.x-s.x,p=this.side?0:c.z-s.z,m=Math.hypot(u,p);m>.15&&(this.move(s,u/m*Math.min(h*e,m),p/m*Math.min(h*e,m)),s.angle=Math.atan2(u,p))}let d=$e(s,"jump")||$e(s,"control")||$e(s,"drive")||a||l||o;d&&this.vertical(s,e,$e(s,"jump")&&i),$e(s,"spin")&&(s.angle+=e*(gi(s,"spin").speed||1.5)),$e(s,"bounce")&&!d&&(s.y=s.home.y+.2+Math.sin(this.time*(gi(s,"bounce").speed||2))*.2),$e(s,"particles")&&Math.random()<e*6&&this.burst(s.x,s.z,s.color,1,s.y+.5)}let n=this.player;if(n)for(let s of this.objects){if(s===n||s.removed)continue;let a=Math.hypot(n.x-s.x,n.z-s.z),o=Math.abs(n.y-s.y),l=a<.6*(n.scale+s.scale)&&o<1.2*(n.scale+s.scale)/2;if(l&&$e(s,"collect")&&(s.removed=!0,this.score++,this.burst(s.x,s.z,s.color,18,s.y+.5),this.emit("collect",s),this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&["racing","shooter"].includes(this.project.genre)&&this.win()),l&&$e(s,"hazard")&&o<.7&&this.hit(),l&&$e(s,"goal"))if(this.score>=this.project.rules.targetScore){this.next();return}else this.talkCooldown<=0&&(this.emit("locked",s),this.talkCooldown=2);$e(s,"talk")&&a<2&&o<2&&t.interact&&this.talkCooldown<=0&&(this.emit("talk",s),this.talkCooldown=1)}for(let s of this.bullets)if(s.x+=(s.dx||0)*s.speed*e,s.z+=(s.dz??-1)*s.speed*e,s.y+=(s.dy||0)*s.speed*e,s.life-=e,this.terrain.blocked(s.x,s.z,s.y,.1,.08)&&(s.life=0),!(s.life<=0)){for(let a of this.objects)if(!a.removed&&$e(a,"hazard")&&Math.hypot(s.x-a.x,s.z-a.z)<.7*a.scale&&Math.abs(s.y-(a.y+.5))<.8*a.scale){a.removed=!0,s.life=0,this.score++,this.burst(a.x,a.z,a.color,18,a.y+.5),this.emit("collect",a),this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&this.win();break}}this.bullets=this.bullets.filter(s=>s.life>0&&Math.abs(s.x)<this.terrain.map.width/2&&Math.abs(s.z)<this.terrain.map.depth/2)}};var ld=".game-hud{position:absolute;inset:20px 20px auto;display:flex;gap:10px;pointer-events:none;z-index:8;align-items:center;font:600 13px system-ui;color:#ecfbff}.hud-pill{padding:10px 15px;border:1px solid #5bbcc52b;border-radius:12px;background:#101e2bd9;backdrop-filter:blur(10px)}.hud-spacer{flex:1}.game-hint{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 18px;color:#d5eaf0;font:12px system-ui;background:#12202bd9;border:1px solid #ffffff15;border-radius:10px;white-space:nowrap;z-index:8}.game-overlay{position:absolute;inset:0;display:grid;place-items:center;z-index:12;background:#0b132c75;backdrop-filter:blur(6px)}.game-overlay[hidden]{display:none}.game-card{width:min(440px,90%);padding:32px;background:#15222ef2;border:1px solid #6de0ef55;border-radius:22px;box-shadow:0 25px 100px #0008;text-align:center;color:#f0fbff;font:14px system-ui}.game-card h2{font-size:28px;letter-spacing:-1px;margin:12px 0}.game-card p{line-height:1.7;color:#adc3ce}.game-card .game-big{font-size:42px}.game-card button{display:block;background:#4cdef1;border:0;border-radius:10px;padding:13px 18px;width:100%;color:#10313b;font:700 14px system-ui;cursor:pointer;margin-top:10px}.game-card button.secondary{background:#263847;color:#d4eff6}.touch-controls{position:absolute;bottom:30px;left:24px;right:24px;display:flex;justify-content:space-between;pointer-events:none;z-index:10}.touch-controls .dpad{display:grid;grid-template-columns:repeat(3,42px);grid-template-rows:repeat(2,40px);gap:4px}.touch-controls button{pointer-events:auto;background:#223848c9;border:1px solid #88d9e85c;color:#effaff;font:700 20px system-ui;border-radius:10px;touch-action:none;user-select:none}.touch-controls .touch-action{height:62px;width:62px;align-self:flex-end}.touch-controls .touch-interact{height:42px;width:42px;align-self:flex-end;margin-right:8px}.touch-controls .up{grid-column:2}.touch-controls .left{grid-row:2}.touch-controls .down{grid-row:2}.touch-controls .right{grid-row:2}.touch-controls .actions{display:flex}.game-note{position:absolute;left:50%;top:80px;transform:translateX(-50%);background:#172d3e;color:#c1f5ff;padding:12px 18px;border:1px solid #54cddb66;border-radius:12px;z-index:11;font:13px system-ui;text-align:center}.touch-controls{opacity:.55}.touch-controls:hover{opacity:1}@media(pointer:fine) and (min-width:900px){.touch-controls{display:none}}@media(max-width:600px){.game-hint{bottom:8px;font-size:10px}.game-hud{inset:12px 12px auto}.hud-pill{padding:8px}}",so=class{constructor({host:e,project:t,sceneIndex:i=0,renderer:n=null,onStop:s=()=>{}}){if(this.host=e,this.project=t,this.startIndex=i,this.onStop=s,this.ownsRenderer=!n,n)this.renderer=n;else try{this.renderer=new un(e,t.mode)}catch{e.querySelectorAll("canvas").forEach(o=>o.remove()),this.renderer=new un(e,"2d")}this.renderer.configure(t.camera),this.input={},this.paused=!1,this.muted=!t.sound,this.audioCtx=null,this.activeAudio=new Set,this.destroyed=!1,this.ui=document.createElement("div"),this.ui.className="player-ui",this.ui.innerHTML=`<div class="game-hud"><div class="hud-pill hud-title"></div><div class="hud-spacer"></div><div class="hud-pill hud-score"></div><div class="hud-pill hud-hearts"></div><div class="hud-pill hud-time"></div></div><div class="game-hint">${t.genre==="racing"?"\u2191 Accelerate &nbsp; \u2190 \u2192 Steer &nbsp; \u2193 Brake":t.genre==="shooter"?"Arrow keys / WASD to move &nbsp; \xB7 &nbsp; Space to shoot":"Arrow keys / WASD to move &nbsp; \xB7 &nbsp; Space to jump &nbsp; \xB7 &nbsp; E to talk"}</div><div class="touch-controls"><div class="dpad"><button class="up" data-key="up" aria-label="Move up">\u2191</button><button class="left" data-key="left" aria-label="Move left">\u2190</button><button class="down" data-key="down" aria-label="Move down">\u2193</button><button class="right" data-key="right" aria-label="Move right">\u2192</button></div><div class="actions"><button class="touch-interact" data-key="interact" aria-label="Talk">E</button><button class="touch-action" data-key="action" aria-label="Jump or shoot">\u2726</button></div></div><div class="game-overlay" hidden></div><div class="game-note" hidden></div>`,e.append(this.ui),this.overlay=this.ui.querySelector(".game-overlay");let a=t.camera?.preset;a==="side"?this.ui.querySelector(".game-hint").textContent="\u2190 \u2192 / A D to run \xB7 Space to jump \xB7 E to talk":(a==="first"||a==="third")&&(this.ui.querySelector(".game-hint").textContent="WASD / arrows to move \xB7 Drag to look \xB7 Q / R turn \xB7 Space \xB7 E talk"),this.keymap={q:"turnLeft",Q:"turnLeft",r:"turnRight",R:"turnRight",ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"," ":"action",e:"interact",E:"interact"},this.keydown=o=>{if(o.key==="Escape"){this.onStop();return}let l=this.keymap[o.key];l&&(o.preventDefault(),this.input[l]=!0)},this.keyup=o=>{let l=this.keymap[o.key];l&&(o.preventDefault(),this.input[l]=!1)},this.blur=()=>{this.input={}},window.addEventListener("keydown",this.keydown),window.addEventListener("keyup",this.keyup),window.addEventListener("blur",this.blur),this.ui.querySelectorAll("[data-key]").forEach(o=>{o.onpointerdown=l=>{l.preventDefault(),o.setPointerCapture(l.pointerId),this.input[o.dataset.key]=!0},o.onpointerup=o.onpointercancel=()=>{this.input[o.dataset.key]=!1}}),this.worldClick=o=>{if(this.paused||!this.sim||this.lookMoved||o.target!==this.renderer.canvas)return;let l=this.renderer.hit(o.clientX,o.clientY,this.sim.objects),c=this.sim.objects.find(h=>h.id===l);c&&$e(c,"talk")&&(c.kind==="button"||this.sim.player&&Math.hypot(c.x-this.sim.player.x,c.z-this.sim.player.z)<2)&&(this.playSound(c.soundId),this.showStory())},e.addEventListener("pointerup",this.worldClick),this.lookDown=o=>{this.paused||!["first","third"].includes(this.project.camera?.preset)||o.target!==this.renderer.canvas||(this.lookDrag={id:o.pointerId,x:o.clientX,y:o.clientY},this.lookMoved=!1,this.host.setPointerCapture(o.pointerId))},this.lookMove=o=>{if(!this.lookDrag||this.lookDrag.id!==o.pointerId)return;let l=o.clientX-this.lookDrag.x,c=o.clientY-this.lookDrag.y;Math.abs(l)+Math.abs(c)>2&&(this.lookMoved=!0),this.renderer.cameraYaw-=l*.005,this.renderer.cameraPitch=We(this.renderer.cameraPitch+c*.004,-1.2,1.2),this.lookDrag.x=o.clientX,this.lookDrag.y=o.clientY},this.lookUp=()=>{this.lookDrag=null},e.addEventListener("pointerdown",this.lookDown),e.addEventListener("pointermove",this.lookMove),e.addEventListener("pointerup",this.lookUp),e.addEventListener("pointercancel",this.lookUp),this.reset(),this.playMusic(),this.last=performance.now(),this.frame=requestAnimationFrame(o=>this.loop(o))}reset(){this.paused=!1,this.overlay.hidden=!0,this.input={},this.sim=new ro(this.project,this.startIndex,e=>this.event(e)),this.renderer.selected=null,this.renderer.path=[],this.renderer.setScene(this.sim.scene,this.project.assets),this.renderer.beginPlay(this.project.camera,this.sim.player),this.hudCache=null,this.updateHud(),this.project.genre==="story"&&this.showStory()}event(e){if(e.type==="scene"){let t=this.project.scenes[e.index];this.renderer.setScene(t,this.project.assets),this.ui.querySelector(".hud-title").textContent=t.name,this.sim&&(this.renderer.followPoint.set(this.sim.player?.x||0,this.sim.player?.y||0,this.sim.player?.z||0),this.renderer.cameraReady=!1,this.host.classList.remove("scene-fade","scene-slide"),this.host.offsetWidth,t.transition!=="none"&&this.host.classList.add("scene-"+t.transition),this.project.genre==="story"&&queueMicrotask(()=>this.showStory()))}e.type==="collect"&&(this.tone(660,.13,"sine"),setTimeout(()=>this.tone(990,.15,"sine"),70),this.playSound(e.object?.soundId)),e.type==="shoot"&&this.tone(300,.07,"triangle",100),e.type==="hurt"&&this.tone(140,.18,"triangle",80),e.type==="locked"&&this.note(`Find ${Math.max(0,this.project.rules.targetScore-this.sim.score)} more crystals to open the portal.`),e.type==="talk"&&(this.playSound(e.object?.soundId),this.showStory()),e.type==="win"&&(this.tone(880,.3),this.showCard("\u2726","You made it!",`${this.sim.score} points. A whole world of possibilities.`,[{label:"Play again",action:()=>this.reset()},{label:"Back to creating",action:this.onStop,secondary:!0}])),e.type==="lose"&&this.showCard("\u2661","One more adventure?","Every great game takes a little practice.",[{label:"Try again",action:()=>this.reset()},{label:"Back to creating",action:this.onStop,secondary:!0}])}showCard(e,t,i,n){this.paused=!0,this.input={},this.overlay.hidden=!1,this.overlay.innerHTML=`<div class="game-card"><span class="game-big">${Re(e)}</span><h2>${Re(t)}</h2><p>${Re(i)}</p>${n.map((s,a)=>`<button class="${s.secondary?"secondary":""}" data-choice="${a}">${Re(s.label)}</button>`).join("")}</div>`,this.overlay.querySelectorAll("button").forEach(s=>s.onclick=()=>{this.overlay.hidden=!0,this.paused=!1,n[Number(s.dataset.choice)].action()})}showStory(){let e=this.sim.scene.story;this.showCard("\u263E",e.title,e.text,e.choices.map(t=>({label:t.text,action:()=>{this.sim.next(t.target)}})))}note(e){let t=this.ui.querySelector(".game-note");t.textContent=e,t.hidden=!1,clearTimeout(this.noteTimer),this.noteTimer=setTimeout(()=>t.hidden=!0,2400)}updateHud(){if(!this.sim)return;let e=[this.sim.sceneIndex,this.sim.score,this.sim.lives,Math.ceil(this.sim.time)].join(":");if(e===this.hudCache)return;this.hudCache=e,this.ui.querySelector(".hud-title").textContent=this.sim.scene.name,this.ui.querySelector(".hud-score").textContent=`\u25C6 ${this.sim.score}${this.project.rules.targetScore?" / "+this.project.rules.targetScore:""}`,this.ui.querySelector(".hud-hearts").textContent="\u2665 ".repeat(Math.max(0,this.sim.lives));let t=this.ui.querySelector(".hud-time");t.hidden=!this.project.rules.timeLimit,t.textContent=`\u25F7 ${Math.max(0,Math.ceil(this.project.rules.timeLimit-this.sim.time))}s`}togglePause(){if(this.overlay.hidden)return this.paused=!this.paused,this.input={},this.note(this.paused?"Paused. Take your time.":"Let\u2019s play!"),this.paused}loop(e){if(this.destroyed)return;let t=Math.min((e-this.last)/1e3,.05);this.last=e;let i=Array.from(navigator.getGamepads?.()||[]).find(n=>n&&n.connected);if(i){let n=i.axes[0]||0,s=i.axes[1]||0,a=i.axes[2]||0;this.input.left=n<-.25||!!i.buttons[14]?.pressed,this.input.right=n>.25||!!i.buttons[15]?.pressed,this.input.up=s<-.25||!!i.buttons[12]?.pressed,this.input.down=s>.25||!!i.buttons[13]?.pressed,this.input.turnLeft=a<-.25||!!i.buttons[4]?.pressed,this.input.turnRight=a>.25||!!i.buttons[5]?.pressed,this.input.action=!!(i.buttons[0]?.pressed||i.buttons[7]?.pressed),this.input.interact=!!(i.buttons[2]?.pressed||i.buttons[3]?.pressed)}this.paused||(["first","third"].includes(this.project.camera?.preset)&&(this.renderer.cameraYaw+=((this.input.turnLeft?1:0)-(this.input.turnRight?1:0))*t*1.7,this.input.moveYaw=this.renderer.cameraYaw,this.input.lookPitch=this.renderer.cameraPitch),this.sim.update(t,this.input)),this.renderer.draw(this.sim.objects,e/1e3,this.sim),this.updateHud(),this.frame=requestAnimationFrame(n=>this.loop(n))}tone(e,t=.1,i="sine",n=e){if(!(this.muted||this.destroyed))try{this.audioCtx??=new(window.AudioContext||window.webkitAudioContext),this.audioCtx.resume();let s=this.audioCtx.createOscillator(),a=this.audioCtx.createGain(),o=this.audioCtx.currentTime;s.type=i,s.frequency.setValueAtTime(e,o),s.frequency.exponentialRampToValueAtTime(n,o+t),a.gain.setValueAtTime(.065,o),a.gain.exponentialRampToValueAtTime(.001,o+t),s.connect(a),a.connect(this.audioCtx.destination),s.start(o),s.stop(o+t)}catch{}}playSound(e){if(this.muted||!e)return;let t=this.project.assets.find(n=>n.id===e&&n.kind==="audio");if(!t)return;let i=new Audio(t.src);i.volume=.4,this.activeAudio.add(i),i.onended=()=>this.activeAudio.delete(i),i.play().catch(()=>{})}playMusic(){let e=this.project.assets.find(t=>t.id===this.project.music&&t.kind==="audio");e&&(this.music=new Audio(e.src),this.music.loop=!0,this.music.volume=.2,this.music.muted=this.muted,this.music.play().catch(()=>{}))}setMuted(e){this.muted=e,this.music&&(this.music.muted=e);for(let t of this.activeAudio)t.muted=e}destroy(){this.destroyed=!0,cancelAnimationFrame(this.frame),clearTimeout(this.noteTimer),window.removeEventListener("keydown",this.keydown),window.removeEventListener("keyup",this.keyup),window.removeEventListener("blur",this.blur),this.host.removeEventListener("pointerup",this.worldClick),this.host.removeEventListener("pointerdown",this.lookDown),this.host.removeEventListener("pointermove",this.lookMove),this.host.removeEventListener("pointerup",this.lookUp),this.host.removeEventListener("pointercancel",this.lookUp),this.renderer.endPlay(),this.music?.pause();for(let e of this.activeAudio)e.pause();this.audioCtx?.close(),this.ui.remove(),this.ownsRenderer&&this.renderer.destroy()}};var B=r=>document.querySelector(r),Je=r=>[...document.querySelectorAll(r)],ae=go(),Nt=0,at=ae.scenes[0].objects[0].id,ge,Qe=null,ct="assets",$i="library",kn="All",Hn="",Ri="select",co=!1,dn=[],Es=[],oo,cd,Bn,lo=0,Or=!1,vc=!1,Gt={tool:"floor",shape:"cube",tile:"grass",layer:0,erase:!1},ht=B("#viewport"),Mt=B("#modal"),dd=document.createElement("style");dd.textContent=ld;document.head.append(dd);var Ie=()=>ae.scenes[Nt],ot=()=>Ie().objects.find(r=>r.id===at);function pd(r=document){r.querySelectorAll("[data-icon]").forEach(e=>{e.innerHTML=ce(e.dataset.icon)})}function Te(r){B("#toast").textContent=r,B("#toast").classList.add("show"),clearTimeout(cd),cd=setTimeout(()=>B("#toast").classList.remove("show"),3e3)}function md(){return{...ai({...ae,assets:[]}),assets:ae.assets.slice()}}function Ts(){dn.push({project:md(),sceneIndex:Nt,selectedId:at}),dn.length>35&&dn.shift(),Es=[],fd()}function Xe(r,e=!0){Qe||(Ts(),r(),xc(e))}function xc(r=!0){ae.updated=Date.now(),r==="terrain"?ge.setTerrain(Ie()):r&&ge.setScene(Ie(),ae.assets),ge.selected=at,ge.path=ot()?.path||[],Nr(),bd(),Ls()}function Ls(){clearTimeout(oo);let r=++lo;B("#save-state").innerHTML="<i></i>Saving\u2026",oo=setTimeout(async()=>{try{await vo(ai(ae)),r===lo&&(B("#save-state").innerHTML="<i></i>Saved on this device")}catch{B("#save-state").textContent="Download to keep your work",Te("Device storage is full or unavailable. Export your project to keep it.")}},500)}async function As(){clearTimeout(oo),lo++;try{return await vo(ai(ae)),B("#save-state").innerHTML="<i></i>Saved on this device",!0}catch{return Te("Could not save on this device. Download a project backup before leaving."),!1}}function fd(){B("#undo-button").disabled=!dn.length,B("#redo-button").disabled=!Es.length}function ao(r){if(Qe)return;let e=r==="undo"?dn:Es,t=r==="undo"?Es:dn;if(!e.length)return;t.push({project:md(),sceneIndex:Nt,selectedId:at});let i=e.pop();ae=i.project,Nt=i.sceneIndex,at=i.selectedId,Ur(),pi(),Ls()}function Ur(){if(ge?.mode!==ae.mode){ge?.destroy();try{ge=new un(ht,ae.mode)}catch{ae.mode="2d",ht.querySelectorAll("canvas").forEach(e=>e.remove()),ge=new un(ht,"2d"),Te("This browser is using 2D. Try another browser for 3D.")}}ge.configure(ae.camera),ge.setScene(Ie(),ae.assets),ge.selected=at,ge.path=ot()?.path||[]}function Nr(){B("#project-label").textContent=ae.name,B("#scene-heading").textContent=Ie().name,B("#object-count").textContent=`${Ie().objects.length} objects`,Je("[data-mode]").forEach(e=>{e.classList.toggle("active",e.dataset.mode===ae.mode),e.setAttribute("aria-pressed",e.dataset.mode===ae.mode)});let r=ot();B("#pos-x").textContent=r?.x.toFixed(1)||"0",B("#pos-z").textContent=r?.z.toFixed(1)||"0",B("#sound-toggle").innerHTML=ce("volume")+`<span>Sound ${ae.sound?"on":"off"}</span>`,B("#sound-toggle").setAttribute("aria-pressed",!!ae.sound),fd()}function pi(){Je("[data-panel]").forEach(r=>{r.classList.toggle("active",r.dataset.panel===ct)}),Nr(),pn(),Lt(),bd(),pd()}function gd(r){r!=="build"?qi(!1):(Or=!0,Ri="select",Je("[data-tool]").forEach(e=>e.classList.toggle("active",e.dataset.tool===Ri)),Vn(),ge.showGrid=!0),ct===r&&matchMedia("(max-width:600px)").matches?B("#library").classList.toggle("mobile-open"):B("#library").classList.add("mobile-open"),ct=r,Je("[data-panel]").forEach(e=>{e.classList.toggle("active",e.dataset.panel===ct),e.setAttribute("aria-pressed",e.dataset.panel===ct)}),pn()}function ws(r,e,t,i=""){B("#library").innerHTML=`<div class="library-header"><div class="panel-heading"><h2>${r}</h2><button class="icon-button" id="library-close" aria-label="Close tool shelf">${ce("close")}</button></div><p class="panel-subtitle">${e}</p>${["assets","behaviors"].includes(ct)?`<label class="search-field">${ce("search")}<input id="asset-search" aria-label="Search ${ct}" placeholder="Search ${ct}\u2026" value="${Re(Hn)}"></label>`:""}</div>${ct==="assets"?`<div class="library-tabs"><button data-lib-tab="library" class="${$i==="library"?"active":""}">Library</button><button data-lib-tab="scene" class="${$i==="scene"?"active":""}">In scene <span class="count">${Ie().objects.length}</span></button></div>`:""}<div class="library-scroll" id="library-scroll">${t}</div>${i?`<div class="library-footer">${i}</div>`:""}`,B("#library-close").onclick=()=>{matchMedia("(max-width:600px)").matches?B("#library").classList.remove("mobile-open"):(document.body.classList.toggle("shelf-hidden"),B("#library").style.display="none")};let n=B("#asset-search");n&&(n.oninput=s=>{Hn=s.target.value,Ci()}),Je("[data-lib-tab]").forEach(s=>s.onclick=()=>{$i=s.dataset.libTab,pn()})}function pn(){ct==="assets"?(ws("Your assets","Little pieces. Endless possibilities.","",`<button class="upload-zone" id="upload-assets">${ce("upload")}<span>Drop files or upload</span><small>Images, music & sound effects</small></button><button class="quiet-button" id="new-sprite-inline" style="width:100%;justify-content:center;margin-top:8px">${ce("edit")}Draw a sprite</button>`),B("#upload-assets").onclick=()=>B("#asset-input").click(),B("#new-sprite-inline").onclick=()=>wc(),Ci()):ct==="behaviors"?(ws("Make it move",ot()?`Give ${Re(ot().name)} a little magic.`:"Choose an object, then a behavior.","",`<div class="pill-note">${ce("mouse")}Drag a behavior onto any object.</div>`),Ci()):ct==="sounds"?(ws("A little atmosphere","Every world has a sound.",`<div class="section-label">GAME SOUNDS</div><button id="sound-library-toggle" class="toggle" aria-pressed="${!!ae.sound}"><i></i>Built-in sound effects</button><label class="field-label" for="music-select">Background music</label><select id="music-select"><option value="">Quiet for now</option>${ae.assets.filter(e=>e.kind==="audio").map(e=>`<option value="${Re(e.id)}" ${ae.music===e.id?"selected":""}>${Re(e.name)}</option>`).join("")}</select><p class="dialog-note">Upload a song, then pick it here. It loops while your game plays.</p><div class="section-label" style="margin-top:25px">YOUR SOUNDS</div>${ae.assets.filter(e=>e.kind==="audio").map(e=>`<div class="audio-row"><button class="icon-button" data-audio="${Re(e.id)}" aria-label="Preview ${Re(e.name)}">${ce("play")}</button><div><strong>${Re(e.name)}</strong><div class="waveform">${Array.from({length:22},(t,i)=>`<i style="--h:${5+Math.sin(i*2.3)**2*14}px"></i>`).join("")}</div></div><button class="icon-button" data-download-asset="${Re(e.id)}" aria-label="Download sound">${ce("download")}</button></div>`).join("")||`<div class="empty-state">${ce("music")}A soundtrack starts with a sound.<br>Drop an audio file here.</div>`}`,`<button class="upload-zone" id="upload-assets">${ce("upload")}<span>Add sounds</span><small>MP3, WAV, OGG, M4A</small></button>`),B("#upload-assets").onclick=()=>B("#asset-input").click(),B("#sound-library-toggle").onclick=()=>{Xe(()=>ae.sound=!ae.sound,!1),pn()},B("#music-select").onchange=e=>Xe(()=>ae.music=e.target.value||null,!1),Je("[data-audio]").forEach(e=>e.onclick=()=>{Bn?.pause();let t=ae.assets.find(i=>i.id===e.dataset.audio);Bn=new Audio(t.src),Bn.volume=.4,Bn.play().catch(()=>Te("This audio format cannot play in this browser."))}),hf()):ct==="build"?$c({project:ae,scene:Ie(),brush:Gt,libraryShell:ws,change:Xe,render:pn,renderer:ge,slider:Ti,bindSlider:Ai,start:()=>{Or=!0,Ri="select",ge.showGrid=!0},finish:()=>qi(),toast:Te}):ct==="world"&&(ws("Your world","Make the rules. Set the mood.",`<div class="section-label">ATMOSPHERE</div><div class="world-colors">${[["forest","Forest","#3f8c72"],["night","Moonlight","#635f93"],["space","Space","#3f527e"],["race","Circuit","#2f6970"],["sand","Sandy","#af9468"]].map(([e,t,i])=>`<button class="theme-card ${Ie().theme===e?"active":""}" style="--theme:${i}" data-theme-choice="${e}">${t}</button>`).join("")}</div><div class="section-label" style="margin-top:25px">GAME RULES</div>${Ti("target-score","Points to win",ae.rules.targetScore,0,30,1)}${Ti("lives","Hearts",ae.rules.lives,1,10,1)}${Ti("time-limit","Time limit",ae.rules.timeLimit,0,300,15,"s")}<p class="dialog-note">Set time to 0 for endless play. Portals open when you reach your point goal.</p><button class="button wide-button" id="world-story">${ce("book")}Edit scene story</button>`),Je("[data-theme-choice]").forEach(e=>e.onclick=()=>{Xe(()=>Ie().theme=e.dataset.themeChoice),pn()}),Ai("target-score",e=>ae.rules.targetScore=e),Ai("lives",e=>ae.rules.lives=e),Ai("time-limit",e=>ae.rules.timeLimit=e,"s"),B("#world-story").onclick=Sd);let r=B("#library");r.ondragover=e=>{e.dataTransfer.types.includes("Files")&&(e.preventDefault(),r.classList.add("drop-highlight"))},r.ondragleave=()=>r.classList.remove("drop-highlight"),r.ondrop=e=>{r.classList.remove("drop-highlight"),e.dataTransfer.files.length&&(e.preventDefault(),Mc(e.dataTransfer.files))}}function Ci(){let r=B("#library-scroll");if(!r)return;if(ct==="behaviors"){r.innerHTML=`<div class="behavior-palette">${Object.entries(Yi).filter(([t,i])=>i.name.toLowerCase().includes(Hn.toLowerCase())).map(([t,i])=>`<button class="palette-item" draggable="true" data-add-behavior="${t}">${ce(i.icon)}<span><strong>${i.name}</strong><small>${i.hint}</small></span><span class="plus">+</span></button>`).join("")}</div>`,vd(r);return}if($i==="scene"){r.innerHTML=Ie().objects.filter(t=>t.name.toLowerCase().includes(Hn.toLowerCase())).map(t=>`<div class="audio-row ${t.id===at?"selected-row":""}" style="${t.id===at?"border-color:#5caec5":""}"><button data-select-object="${Re(t.id)}" style="display:flex;align-items:center;gap:8px;background:none;border:0;flex:1;text-align:left;min-width:0;padding:0"><span style="width:28px;height:28px;flex-shrink:0">${Di(t.kind,t.color)}</span><strong>${Re(t.name)}</strong></button><button class="icon-button" data-visibility="${Re(t.id)}" aria-label="${t.visible?"Hide":"Show"} ${Re(t.name)}" style="opacity:${t.visible?1:.35}">${ce("eye")}</button></div>`).join("")||'<div class="empty-state">No objects found.</div>',Je("[data-select-object]").forEach(t=>t.onclick=()=>Ps(t.dataset.selectObject,!0)),Je("[data-visibility]").forEach(t=>t.onclick=()=>{Xe(()=>{let i=Ie().objects.find(n=>n.id===t.dataset.visibility);i.visible=!i.visible},!1),Ci()});return}let e=[...Hr,...ae.assets.filter(t=>t.kind==="image").map(t=>({...t,category:"Yours",color:"#62d8eb"}))].filter(t=>(kn==="All"||t.category===kn)&&t.name.toLowerCase().includes(Hn.toLowerCase()));r.innerHTML=`<div class="category-chips">${["All","Nature","Objects","Yours"].map(t=>`<button data-category="${t}" class="${kn===t?"active":""}">${t}</button>`).join("")}</div>${["Characters","Nature","Objects","Effects","UI","Yours"].map(t=>{let i=e.filter(n=>n.category===t);return i.length?`<div class="asset-section-title"><span>${t.toUpperCase()}</span><span>${i.length}</span></div><div class="asset-grid">${i.map(n=>`<button class="asset-card" draggable="true" data-asset="${Re(n.id||n.kind)}" title="Add ${Re(n.name)} \u2014 click or drag">${n.src?`<img alt="" src="${Re(n.src)}">`:Di(n.kind,n.color)}<span class="asset-name">${Re(n.name)}</span></button>`).join("")}</div>`:""}).join("")}${e.length?"":'<div class="empty-state">Nothing here yet.<br>Try a new search or upload an image.</div>'}`,Je("[data-category]").forEach(t=>t.onclick=()=>{kn=t.dataset.category,Ci()}),Je("[data-asset]").forEach(t=>{t.onclick=()=>yd(t.dataset.asset),t.ondragstart=i=>{i.dataTransfer.setData("application/soulcode",JSON.stringify({type:"asset",id:t.dataset.asset})),i.dataTransfer.effectAllowed="copy"}})}function vd(r){r.querySelectorAll("[data-add-behavior]").forEach(e=>{e.onclick=()=>_c(e.dataset.addBehavior),e.ondragstart=t=>{t.dataTransfer.setData("application/soulcode",JSON.stringify({type:"behavior",id:e.dataset.addBehavior})),t.dataTransfer.effectAllowed="copy"}})}function hf(){Je("[data-download-asset]").forEach(r=>r.onclick=()=>{let e=ae.assets.find(t=>t.id===r.dataset.downloadAsset);e&&fetch(e.src).then(t=>t.blob()).then(t=>Mn(t,e.name))})}function yd(r,e){if(Qe)return;if(Ie().objects.length>=200){Te("This scene is full. Add another scene to keep creating.");return}let t=Hr.find(n=>n.kind===r)||ae.assets.find(n=>n.id===r);if(!t)return;let i=e||{x:Math.round((Math.random()-.5)*5*2)/2,z:Math.round((Math.random()-.5)*3*2)/2};Xe(()=>{let n=Ae(t.kind,i.x,ae.camera.preset==="side"?.5:i.z,{y:i.y||0,name:t.name,...t.src?{assetId:t.id}:{}});Ie().objects.push(n),at=n.id}),Lt(),Ci(),B("#library").classList.remove("mobile-open"),Te(`${t.name} joined your world`)}function _c(r){let e=ot();if(!e){Te("Pick an object in your world first.");return}if(e.behaviors.some(t=>t.type===r)){Te(`${e.name} already has that behavior.`);return}Xe(()=>{let t=Yi[r];e.behaviors.push({type:r,enabled:!0,...t.speed?{speed:t.speed}:{},...t.power?{power:t.power}:{}})},!1),Lt(),Mt.close(),Te(`${Yi[r].name} added`)}function Ti(r,e,t,i,n,s=1,a=""){return`<div class="range-row"><div class="range-label"><label for="${r}">${e}</label><output id="${r}-value">${Number(t).toFixed(s<1?1:0)}${a}</output></div><input type="range" id="${r}" min="${i}" max="${n}" step="${s}" value="${t}" style="--fill:${(t-i)/(n-i)*100}%" aria-label="${e}"></div>`}function Ai(r,e,t="",i=!1){let n=B("#"+r);n&&(n.onpointerdown=()=>Ts(),n.onkeydown=s=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(s.key)&&Ts()},n.oninput=()=>{let s=Number(n.value);e(s),n.style.setProperty("--fill",`${(s-n.min)/(n.max-n.min)*100}%`),B("#"+r+"-value").textContent=s.toFixed(Number(n.step)<1?1:0)+t,xc(i)})}function Ps(r,e=!1){Qe||(at=r,ge.selected=r,ge.path=ot()?.path||[],Nr(),Lt(),$i==="scene"&&Ci(),ct==="behaviors"&&pn(),e&&r&&B("#inspector").classList.add("mobile-open"))}function Lt(){let r=ot(),e=Vt(Ie(),.1),t=ae.camera.preset==="side",i=B("#inspector");if(!r){i.innerHTML=`<div class="inspector-top"><span>${ce("settings")}Inspector</span></div><div class="empty-state">${ce("mouse")}Pick a little piece of your world.<br>Let\u2019s make it do something.</div><div class="mini-tip">${ce("sparkles")}Drop an asset, add a behavior, and press <strong>Play</strong>.</div>`;return}i.innerHTML=`<div class="inspector-top"><span>${ce("settings")}Inspector</span><div class="inline-row"><button class="icon-button" id="duplicate-object" title="Duplicate object \xB7 Ctrl D" aria-label="Duplicate object">${ce("copy")}</button><button class="icon-button" id="delete-object" title="Delete object" aria-label="Delete object">${ce("trash")}</button><button class="icon-button" id="close-inspector" aria-label="Close inspector">${ce("close")}</button></div></div><div class="object-identity"><div class="object-portrait">${r.kind==="image"?`<img style="width:40px;height:40px;object-fit:contain" src="${Re(ae.assets.find(n=>n.id===r.assetId)?.src||"")}" alt="">`:Di(r.kind,r.color)}</div><div><input id="object-name" class="object-name" value="${Re(r.name)}" maxlength="50" aria-label="Object name"><div class="object-role">${$e(r,"control")||$e(r,"drive")?"PLAYER CHARACTER":$e(r,"collect")?"COLLECTIBLE":$e(r,"hazard")?"LITTLE CHALLENGE":"WORLD OBJECT"}</div></div></div>
 <section class="inspector-section"><div class="section-label">TRANSFORM ${ce("move")}</div><div class="transform-row"><label class="number-field"><span>X</span><input id="object-x" type="number" step=".1" min="${e.minX}" max="${e.maxX}" value="${r.x.toFixed(1)}" aria-label="Horizontal position"></label><label class="number-field z"><span>Y</span><input id="object-z" type="number" step=".1" min="${t?0:e.minZ}" max="${t?20:e.maxZ}" value="${(t?r.y:r.z).toFixed(1)}" aria-label="Vertical position"></label></div>${Ti("object-size","Size",r.scale,.2,3,.1,"\xD7")}<div class="color-row">${["#41d9f2","#ab8cff","#ffca76","#45b891","#f08d9f","#f1f5f2"].map(n=>`<button class="swatch ${r.color===n?"active":""}" style="--swatch:${n}" data-color="${n}" aria-label="Color ${n}"></button>`).join("")}<label class="custom-color" title="Pick any color">${ce("plus")}<input id="custom-color" type="color" value="${Re(r.color)}" aria-label="Custom object color"></label></div></section>
 <section class="inspector-section"><div class="section-label">BEHAVIORS <span class="count">${r.behaviors.length}</span></div>${r.behaviors.map((n,s)=>{let a=Yi[n.type];return`<details class="behavior-card" ${s===0?"open":""}><summary><span class="behavior-symbol">${ce(a.icon)}</span><span class="behavior-title">${a.name}<small>${a.hint}</small></span><span class="behavior-chevron">${ce("chevron")}</span></summary><div class="behavior-settings">${n.speed!==void 0?Ti("behavior-"+s,"Speed",n.speed,.2,10,.2):n.power!==void 0?Ti("behavior-"+s,"Jump height",n.power,2,12,.5):""}${n.type==="patrol"?`<button class="button wide-button" id="draw-path" style="height:30px;font-size:9px">${ce("route")}${r.path?.length?"Edit path \xB7 "+r.path.length+" points":"Draw a path"}</button><button class="quiet-button" id="clear-path">Clear path</button>`:""}<div class="behavior-actions"><button class="toggle" data-toggle-behavior="${s}" aria-pressed="${n.enabled!==!1}"><i></i>${n.enabled!==!1?"On":"Off"}</button><button class="behavior-remove" data-remove-behavior="${s}">Remove</button></div></div></details>`}).join("")}<button class="add-behavior" id="add-behavior">${ce("plus")}Add a behavior</button></section>
 <details class="inspector-details"><summary>${ce("settings")}A little more control ${ce("chevron")}</summary><div>${Ti("object-rotation","Turn",Math.round(r.rotation*180/Math.PI),0,360,1,"\xB0")}${Ti("object-lift","Lift",r.y,0,20,.1)}<button class="toggle" id="object-visible" aria-pressed="${r.visible}"><i></i>Visible in game</button></div></details>
 <details class="inspector-details"><summary>${ce("music")}Sound on touch ${ce("chevron")}</summary><div><select class="sound-select" id="object-sound" aria-label="Object sound"><option value="">Built-in sound</option>${ae.assets.filter(n=>n.kind==="audio").map(n=>`<option value="${Re(n.id)}" ${r.soundId===n.id?"selected":""}>${Re(n.name)}</option>`).join("")}</select><p class="dialog-note">Plays when collected or talked to.</p></div></details>
 ${r.kind==="image"?`<section class="inspector-section sprite-inspector"><div class="section-label">YOUR SPRITE</div><select id="sprite-facing" aria-label="Sprite facing"><option value="upright" ${r.billboard!=="screen"?"selected":""}>Stand up \xB7 face the camera</option><option value="screen" ${r.billboard==="screen"?"selected":""}>Always face the screen</option></select><button id="edit-sprite" class="button wide-button">${ce("edit")}Edit sprite</button><p class="build-note">Artwork stays flat in 3D. Add Follow and Watch out! to make it an enemy.</p></section>`:""}<div class="mini-tip">${ce("sparkles")}A tiny change can make a big adventure. <strong>Try it, then play it.</strong></div>`,r.kind==="image"&&(B("#edit-sprite").onclick=()=>wc(ae.assets.find(n=>n.id===r.assetId)),B("#sprite-facing").onchange=n=>{Xe(()=>r.billboard=n.target.value)}),B("#object-name").onchange=n=>{Xe(()=>r.name=n.target.value.trim()||"Little object",!1),Lt(),$i==="scene"&&Ci()};for(let n of["x","z"])B("#object-"+n).onchange=s=>{let a=Number(s.target.value);Number.isFinite(a)&&(Xe(()=>{let o=n==="z"&&t?"y":n;r[o]=We(a,n==="x"?e.minX:t?0:e.minZ,n==="x"?e.maxX:t?20:e.maxZ)},!1),Lt())};Ai("object-size",n=>r.scale=n,"\xD7"),Ai("object-rotation",n=>r.rotation=n*Math.PI/180,"\xB0"),Ai("object-lift",n=>r.y=n),Je("[data-color]").forEach(n=>n.onclick=()=>{Xe(()=>r.color=n.dataset.color),Lt()}),B("#custom-color").onchange=n=>{Xe(()=>r.color=n.target.value),Lt()},B("#object-visible").onclick=()=>{Xe(()=>r.visible=!r.visible,!1),Lt()},B("#object-sound").onchange=n=>Xe(()=>r.soundId=n.target.value,!1),r.behaviors.forEach((n,s)=>{n.speed!==void 0?Ai("behavior-"+s,a=>n.speed=a):n.power!==void 0&&Ai("behavior-"+s,a=>n.power=a)}),Je("[data-toggle-behavior]").forEach(n=>n.onclick=()=>{Xe(()=>{let s=r.behaviors[Number(n.dataset.toggleBehavior)];s.enabled=s.enabled===!1},!1),Lt()}),Je("[data-remove-behavior]").forEach(n=>n.onclick=()=>{Xe(()=>r.behaviors.splice(Number(n.dataset.removeBehavior),1),!1),Lt()}),B("#add-behavior").onclick=uf,B("#duplicate-object").onclick=xd,B("#delete-object").onclick=_d,B("#close-inspector").onclick=()=>{matchMedia("(max-width:800px)").matches?i.classList.remove("mobile-open"):Ps(null)},B("#draw-path")&&(B("#draw-path").onclick=()=>df()),B("#clear-path")&&(B("#clear-path").onclick=()=>{Xe(()=>r.path=[],!1),Lt()}),i.ondragover=n=>{n.dataTransfer.types.includes("application/soulcode")&&(n.preventDefault(),i.classList.add("drop-highlight"))},i.ondragleave=()=>i.classList.remove("drop-highlight"),i.ondrop=n=>{n.preventDefault(),i.classList.remove("drop-highlight");try{let s=JSON.parse(n.dataTransfer.getData("application/soulcode"));s.type==="behavior"&&_c(s.id)}catch{}}}function xd(){let r=ot();!r||Ie().objects.length>=200||(Xe(()=>{let e=ai(r);e.id=zt(),e.name=r.name+" copy",e.x=We(r.x+1,Vt(Ie()).minX,Vt(Ie()).maxX),e.z=We(r.z+.5,Vt(Ie()).minZ,Vt(Ie()).maxZ),Ie().objects.push(e),at=e.id}),Lt(),Ci(),Te("A little more of a good thing."))}function _d(){let r=ot();r&&(Xe(()=>{Ie().objects=Ie().objects.filter(e=>e.id!==r.id),at=null}),Lt(),Ci(),Te("Object removed. Undo brings it back."))}function uf(){if(!ot()){Te("Choose an object first.");return}mn("A little bit of magic",`<h2>What should ${Re(ot().name)} do?</h2><p class="subtitle">Pick a behavior. Make it your own with the sliders.</p><div class="template-grid behavior-palette">${Object.entries(Yi).filter(([r])=>!ot().behaviors.some(e=>e.type===r)).map(([r,e])=>`<button class="palette-item" data-add-behavior="${r}">${ce(e.icon)}<span><strong>${e.name}</strong><small>${e.hint}</small></span></button>`).join("")}</div>`),vd(B("#modal-content"))}function df(){ot()&&(qi(!1),co=!0,Ri="select",B("#path-done").hidden=!1,B("#canvas-hint").textContent="Click the ground to add path points",B("#inspector").classList.remove("mobile-open"),Te("Click places in your world, then press Done."))}function Vn(){co=!1,B("#path-done").hidden=!0,B("#canvas-hint").innerHTML=ce("mouse")+"Two fingers to pan <b>\xB7</b> Right-drag to orbit",Lt()}function bd(){B("#scene-count").textContent=ae.scenes.length,B("#scene-strip").innerHTML=ae.scenes.map((r,e)=>`<button class="scene-card ${e===Nt?"active":""}" data-scene="${e}" title="Open ${Re(r.name)}">${e===Nt?'<span class="scene-active-dot"></span>':""}<div class="scene-thumb ${r.theme}">${r.objects.filter(t=>t.visible).slice(0,3).map(t=>Di(t.kind,t.color)).join("")}</div><div class="scene-caption"><b>${String(e+1).padStart(2,"0")}</b>${Re(r.name)}</div></button>`).join("")+`<button id="add-scene" class="new-scene">${ce("plus")}New scene</button>`,Je("[data-scene]").forEach(r=>r.onclick=()=>{Qe||(Vn(),qi(!1),Nt=Number(r.dataset.scene),at=Ie().objects[0]?.id||null,ge.configure(ae.camera),ge.setScene(Ie(),ae.assets),ge.selected=at,ge.path=ot()?.path||[],pi())}),B("#add-scene").onclick=()=>{if(ae.scenes.length>=30){Te("This project has reached 30 scenes.");return}Xe(()=>{ae.scenes.push(ri("A new world","forest",[Ae("hero",-3,2)])),Nt=ae.scenes.length-1,at=Ie().objects[0].id}),pi(),Te("A new chapter begins.")}}function mn(r,e){B("#modal-eyebrow").textContent=r,B("#modal-content").innerHTML=e,Mt.open||Mt.showModal()}function Md(){mn("A SMALL START. A BIG ADVENTURE.",`<h2>What will you make?</h2><p class="subtitle">Start with a tiny game. Change everything. Make it yours.</p><div class="template-grid">${Br.map(r=>`<button class="template-card" data-template="${r.id}"><div class="template-art" style="--template-color:${r.color}44">${(r.id==="quest"?["tree","hero","crystal"]:r.id==="shooter"?["ship","slime"]:r.id==="racing"?["car","crystal"]:r.id==="story"?["npc","portal"]:r.id==="platformer"?["hero","crystal"]:["sparkles"]).map(e=>Di(e,Hr.find(t=>t.kind===e)?.color||r.color)).join("")}</div><div class="template-content"><span><strong>${r.name}</strong><small>${r.tag} \xB7 ${r.mode.toUpperCase()}</small></span>${ce("chevron")}</div></button>`).join("")}</div><p class="dialog-note">Your current project stays in My projects.</p>`),Je("[data-template]").forEach(r=>r.onclick=async()=>{if(!vc){vc=!0,Je("[data-template]").forEach(e=>e.disabled=!0);try{if(!await As())return;Sc(go(r.dataset.template)),Mt.close(),Te("Fresh game, fresh rules. Press Play!")}finally{vc=!1,Je("[data-template]").forEach(e=>e.disabled=!1)}}})}async function yc(){await As();let r=[];try{r=await yo()}catch{}mn("YOUR LITTLE COLLECTION",`<h2>My projects</h2><label class="field-label" for="project-name">This project\u2019s name</label><div class="inline-row"><input id="project-name" class="text-input" value="${Re(ae.name)}" maxlength="60"><button id="rename-project" class="button">${ce("check")}Save</button></div><div style="margin-top:20px">${r.map(e=>`<button class="project-row" data-open-project="${Re(e.id)}">${ce(Br.find(t=>t.id===e.genre)?.icon||"gamepad")}<span><strong>${Re(e.name)}</strong><small>${e.scenes.length} scene${e.scenes.length===1?"":"s"} \xB7 ${e.mode.toUpperCase()} \xB7 ${new Date(e.updated).toLocaleDateString()}</small></span>${ce("chevron","chev")}</button>`).join("")}</div><div class="modal-actions"><button id="import-project-modal" class="button">${ce("download")}Open project file</button><button id="new-project-modal" class="button primary">${ce("plus")}New game</button></div><p class="dialog-note">Projects are saved in this browser. Export a project file to keep a backup or move it to another device.</p>`),B("#rename-project").onclick=()=>{let e=B("#project-name").value.trim();e&&(Xe(()=>ae.name=e,!1),Te("Project renamed"),yc())},Je("[data-open-project]").forEach(e=>e.onclick=()=>{let t=r.find(i=>i.id===e.dataset.openProject);t&&(Sc(Ns(t)),Mt.close())}),B("#import-project-modal").onclick=()=>B("#project-input").click(),B("#new-project-modal").onclick=Md}function Sd(){let r=Ie();mn("EVERY WORLD HAS A STORY",`<h2>Your scene</h2><div class="scene-settings-grid"><div><label class="field-label" for="scene-name">Scene name</label><input id="scene-name" class="text-input" value="${Re(r.name)}" maxlength="50"></div><div><label class="field-label" for="scene-transition">Enter with</label><select id="scene-transition"><option value="fade" ${r.transition==="fade"?"selected":""}>A gentle fade</option><option value="slide" ${r.transition==="slide"?"selected":""}>A little slide</option><option value="none" ${r.transition==="none"?"selected":""}>Straight in</option></select></div></div><label class="field-label" for="story-title">Story title</label><input id="story-title" class="text-input" value="${Re(r.story.title)}" maxlength="100"><label class="field-label" for="story-text">What happens here?</label><textarea id="story-text" maxlength="1500">${Re(r.story.text)}</textarea><label class="field-label">Choices \u2192 where they go</label><div id="story-choices"></div><button id="add-story-choice" class="quiet-button">${ce("plus")}Add a choice</button><p class="dialog-note">Friends and story buttons open this story. In an adventure starter, it opens when the scene begins.</p><div class="modal-actions"><button id="duplicate-scene" class="button">${ce("copy")}Duplicate</button><button id="delete-scene" class="button danger" ${ae.scenes.length<2?"disabled":""}>${ce("trash")}Delete</button><button id="save-scene-settings" class="button primary">${ce("check")}Done</button></div>`);let e=ai(r.story.choices),t=()=>{e=Je("#story-choices .choice-editor").map(n=>({text:n.querySelector("input").value||"Continue",target:n.querySelector("select").value}))};function i(){B("#story-choices").innerHTML=e.map((n,s)=>`<div class="choice-editor"><input class="text-input" aria-label="Choice ${s+1} text" value="${Re(n.text)}" maxlength="80"><select aria-label="Choice ${s+1} destination">${[{id:"close",name:"Keep exploring"},{id:"next",name:"Next scene"},...ae.scenes].map(a=>`<option value="${Re(a.id)}" ${n.target===a.id?"selected":""}>${Re(a.name)}</option>`).join("")}</select><button class="icon-button" data-remove-choice="${s}" aria-label="Remove choice ${s+1}">${ce("close")}</button></div>`).join(""),Je("[data-remove-choice]").forEach(n=>n.onclick=()=>{t(),e.length>1&&e.splice(Number(n.dataset.removeChoice),1),i()}),B("#add-story-choice").disabled=e.length>=4}i(),B("#add-story-choice").onclick=()=>{t(),e.length<4&&e.push({text:"A new possibility",target:"close"}),i()},B("#save-scene-settings").onclick=()=>{t(),Xe(()=>{r.name=B("#scene-name").value.trim()||"My world",r.transition=B("#scene-transition").value,r.story={title:B("#story-title").value||"My story",text:B("#story-text").value,choices:e}},!1),Mt.close(),Te("Your story is ready to play.")},B("#duplicate-scene").onclick=()=>{ae.scenes.length>=30||(Xe(()=>{let n=ai(r);n.id=zt(),n.name=r.name+" copy",n.objects.forEach(s=>s.id=zt()),ae.scenes.push(n),Nt=ae.scenes.length-1,at=n.objects[0]?.id||null}),pi(),Mt.close())},B("#delete-scene").onclick=()=>{ae.scenes.length<2||(Xe(()=>{let n=r.id;ae.scenes.splice(Nt,1),ae.scenes.forEach(s=>s.story.choices.forEach(a=>{a.target===n&&(a.target="next")})),Nt=We(Nt,0,ae.scenes.length-1),at=Ie().objects[0]?.id||null}),pi(),Mt.close(),Te("Scene removed. Undo brings it back."))}}function pf(){mn("BIG IDEAS START WITH A LITTLE PLAY",`<h2>Your first game, in three little steps.</h2><div class="help-steps"><div class="help-step">${ce("box")}<div><strong>1. Drop something in.</strong><p>Drag an asset into your world. Or click one to add it. Your own images work too.</p></div></div><div class="help-step">${ce("bolt")}<div><strong>2. Give it a little magic.</strong><p>Pick an object, then add a behavior. Make it follow, wander, sparkle, or do what you say.</p></div></div><div class="help-step">${ce("play")}<div><strong>3. Play your idea.</strong><p>Press Play. Move with arrows or WASD. Space jumps or shoots. E talks to a friend.</p></div></div></div><div class="pill-note">${ce("heart")}Every idea is worth trying. Undo is always here for you.</div><p class="dialog-note">Drag objects to move them. Two fingers or H to pan. Pinch to zoom. Right-drag to orbit in 3D.<br>Ctrl/\u2318 Z: undo \xB7 Ctrl/\u2318 D: duplicate \xB7 Delete: remove \xB7 Enter: play \xB7 Esc: stop.<br>On a small screen, tap an object again to open its settings.</p><button id="help-start" class="button primary wide-button">Let\u2019s make something ${ce("sparkles")}</button>`),B("#help-start").onclick=()=>Mt.close()}function mf(){mn("MADE BY YOU. READY TO PLAY.",`<h2>Let your game out into the world.</h2><p class="subtitle">A little file. Your whole imagination inside.</p><button class="export-card" id="export-html">${ce("gamepad")}<span><strong>Playable game</strong><small>One HTML file. Open it in a browser.<br>Includes every scene, image, sound, and behavior.</small></span>${ce("chevron","chev")}</button><button class="export-card" id="export-project">${ce("folder")}<span><strong>Editable project</strong><small>Keep a backup, move devices, or keep creating later.</small></span>${ce("chevron","chev")}</button>${ot()?`<button class="export-card" id="export-asset">${ce("image")}<span><strong>Save ${Re(ot().name)} as an image</strong><small>A PNG for your next idea.</small></span>${ce("chevron","chev")}</button>`:""}<p class="dialog-note">Games run in a browser, including offline. This exports a browser game, not a phone app or console game.</p>`),B("#export-project").onclick=()=>{Mn(new Blob([JSON.stringify(ae,null,2)],{type:"application/json"}),bc(ae.name)+".soulcode"),Te("Project backup downloaded.")},B("#export-html").onclick=ff,B("#export-asset")&&(B("#export-asset").onclick=gf)}var bc=r=>r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"my-game";async function ff(){let r=B("#export-html");r.disabled=!0;try{let e=await fetch("./player.js");if(!e.ok)throw Error("Player file is missing");let t=(await e.text()).replace(/<\/script/gi,"<\\/script"),i=JSON.stringify(ae).replace(/</g,"\\u003c"),n=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${Re(ae.name)} \xB7 Soulcode</title><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;font-family:system-ui;color:#e5f7ff;background:#101e28}#game{position:absolute;inset:0;background:radial-gradient(ellipse,#27444d,#101b26);touch-action:none}canvas{display:block;width:100%;height:100%}#start-screen{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 40%,#234557,#0f1b28)}#start-screen[hidden]{display:none}.welcome{max-width:480px;text-align:center;padding:32px}.welcome .spark{font-size:64px;color:#74e4ff}.welcome h1{font-size:44px;letter-spacing:-2px;margin:20px 0}.welcome p{color:#a0bdcc;font-size:14px;line-height:1.7}button{cursor:pointer;background:#64dff4;border:0;border-radius:12px;color:#153c4b;font:700 16px system-ui;padding:14px 35px}#mute-game{position:fixed;right:20px;bottom:14px;padding:7px 10px;background:#193744c9;color:#abd9e8;font-size:10px;z-index:30}.credit{position:absolute;left:20px;bottom:18px;color:#7092a8;font-size:10px;z-index:20}.scene-fade canvas{animation:fade .7s}.scene-slide canvas{animation:slide .7s}@keyframes fade{from{opacity:0}to{opacity:1}}@keyframes slide{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:none}}</style></head><body><main id="game"></main><div id="start-screen"><div class="welcome"><span class="spark">\u2726</span><h1 id="game-name">${Re(ae.name)}</h1><p>A little world, made with Soulcode.</p><button id="start-play">Let\u2019s play \u2192</button><p>Arrow keys / WASD \xB7 Space \xB7 E<br>Touch controls on phones and tablets</p></div></div><span class="credit">made with soulcode.</span><button id="mute-game">Sound ${ae.sound?"on":"off"}</button><script type="application/json" id="soulcode-project">${i}<\/script><script>${t}<\/script></body></html>`;Mn(new Blob([n],{type:"text/html"}),bc(ae.name)+".html"),Te("Your game is ready. Open the downloaded HTML file to play.")}catch(e){Te("Could not export the game. "+e.message)}finally{r.disabled=!1}}async function gf(){let r=ot();if(!r)return;let e=new Image;e.src=r.kind==="image"?ae.assets.find(t=>t.id===r.assetId)?.src||"":"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(Di(r.kind,r.color));try{await e.decode();let t=document.createElement("canvas");t.width=r.kind==="image"?e.naturalWidth:512,t.height=r.kind==="image"?e.naturalHeight:512,t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toBlob(i=>{i&&(Mn(i,bc(r.name)+".png"),Te("Your asset is ready."))},"image/png")}catch{Te("This image could not be exported.")}}async function hd(r){return new Promise((e,t)=>{let i=new FileReader;i.onload=()=>e(i.result),i.onerror=()=>t(i.error),i.readAsDataURL(r)})}async function Mc(r,e){if(Qe){Te("Stop playing to add assets.");return}let t=[...r];if(t.length===1&&/\.(soulcode|json)$/i.test(t[0].name)){await wd(t[0]);return}let i=[];for(let n of t){if(ae.assets.length+i.length>=60){Te("You can keep up to 60 uploaded assets in a project.");break}if(n.size>8*1024*1024){Te(`${n.name} is too large. Try a file smaller than 8 MB.`);continue}let s,a,o=1,l=1;try{if(/^image\/(png|jpeg|webp|gif)$/.test(n.type)){s="image";let h=await hd(n),d=new Image;d.src=h,await d.decode();let u=document.createElement("canvas"),p=Math.min(1,1024/Math.max(d.width,d.height));u.width=Math.max(1,Math.round(d.width*p)),u.height=Math.max(1,Math.round(d.height*p)),u.getContext("2d").drawImage(d,0,0,u.width,u.height),a=u.toDataURL("image/png"),o=u.width,l=u.height}else if(/^audio\//.test(n.type)||/\.(mp3|wav|ogg|m4a)$/i.test(n.name)){if(s="audio",a=await hd(n),!a.startsWith("data:audio/")){let d=n.name.split(".").pop().toLowerCase();a=a.replace(/^data:[^;,]*;/,`data:audio/${{mp3:"mpeg",wav:"wav",ogg:"ogg",m4a:"mp4"}[d]||"mpeg"};`)}let h=new Audio;n.type&&!h.canPlayType(n.type)&&Te(`${n.name}: this browser may not play that audio format.`)}else{Te("Try a PNG, JPG, WebP, GIF, MP3, WAV, OGG, or M4A file.");continue}if([...ae.assets,...i].reduce((h,d)=>h+d.src.length,0)+a.length>28*1024*1024){Te("This project\u2019s assets are full. Try smaller image or sound files.");continue}i.push({id:zt(),kind:s,name:n.name.slice(0,60),src:a,width:o,height:l})}catch{Te(`Could not open ${n.name}. Try another file.`)}}i.length&&(qi(!1),Vn(),Xe(()=>{if(ae.assets.push(...i),e){let n=i.find(s=>s.kind==="image");if(n&&Ie().objects.length<200){let s=Ae("image",e.x,ae.camera.preset==="side"?.5:e.z,{y:e.y||0,assetId:n.id,name:n.name});Ie().objects.push(s),at=s.id}}}),i.some(n=>n.kind==="image")?(kn="Yours",ct="assets",$i="library"):ct="sounds",pi(),Te(`${i.length} ${i.length===1?"asset":"assets"} added. Yours to play with.`))}async function wd(r){if(r.size>64*1024*1024){Te("Choose a project file smaller than 64 MB.");return}try{let e=Ns(JSON.parse(await r.text()));if(!await As())return;e.id=zt(),e.updated=Date.now(),Sc(e),Mt.close(),Te("Welcome back to your world.")}catch(e){Te(e.message||"This project could not be opened.")}}function ud(){if(Qe){Rs();return}if(!Ie().objects.some(r=>r.visible&&($e(r,"control")||$e(r,"drive")))){Te("Add a character with \u201CYou control it\u201D or \u201CDrive\u201D to play.");return}Vn(),qi(!1),Bn?.pause(),Mt.close(),document.body.classList.add("playing"),B("#library").inert=!0,B("#inspector").inert=!0,B(".tool-rail").inert=!0,B(".scenes-panel").inert=!0,B("#play-button").innerHTML=ce("stop")+"<span>Stop</span>",B("#pause-button").hidden=!1,B("#stop-button").hidden=!1,B("#status-text").textContent="Your world is alive. Go explore.",Qe=new so({host:ht,project:ai(ae),sceneIndex:Nt,renderer:ge,onStop:Rs}),B("#viewport").focus()}function Rs(){Qe&&(Qe.destroy(),Qe=null,document.body.classList.remove("playing"),B("#library").inert=!1,B("#inspector").inert=!1,B(".tool-rail").inert=!1,B(".scenes-panel").inert=!1,B("#play-button").innerHTML=ce("play")+"<span>Play</span><kbd>\u21B5</kbd>",B("#pause-button").hidden=!0,B("#stop-button").hidden=!0,B("#pause-button").innerHTML=ce("pause"),B("#status-text").textContent="A little studio for big imaginations",ge.setScene(Ie(),ae.assets),ge.selected=at,ge.path=ot()?.path||[])}function Sc(r){Rs(),Bn?.pause(),clearTimeout(oo),lo++,ae=r,Nt=0,at=Ie().objects[0]?.id||null,dn=[],Es=[],Je("[data-tool]").forEach(e=>e.classList.toggle("active",e.dataset.tool==="select")),ht.style.cursor="default",ct="assets",$i="library",kn="All",Hn="",co=!1,Or=!1,Ri="select",Cs=!1,be=null,Wn.clear(),Ei=null,Object.assign(Gt,{tool:"floor",shape:"cube",tile:Ie().map.tileset,layer:0,erase:!1}),B("#path-done").hidden=!0,document.body.classList.remove("focus","shelf-hidden"),B("#library").style.display="",B("#library").classList.remove("mobile-open"),B("#inspector").classList.remove("mobile-open"),ge?.destroy(),ge=null,Ur(),pi(),Gn(),Ls()}function qi(r=!0){Or=!1,ge&&(ge.brushCell=null),B("#canvas-hint").innerHTML=ce("hand")+"Two fingers to pan <b>\xB7</b> Right-drag to orbit",r&&(gd("assets"),Te("Back to your characters."))}function wc(r=null){Qe||Zc({showModal:mn,asset:r,onSave:e=>{if(!e.id&&ae.assets.length>=60){Te("Your asset shelf is full.");return}if(ae.assets.filter(i=>i.id!==e.id).reduce((i,n)=>i+n.src.length,0)+e.src.length>28*1024*1024){Te("Your asset shelf is full. Export a backup and use smaller files.");return}Xe(()=>{if(e.id){let i=ae.assets.findIndex(n=>n.id===e.id);ae.assets[i]=e}else e.id=zt(),ae.assets.push(e)}),qi(!1),Vn(),ct="assets",$i="library",kn="Yours",Hn="",pi(),Mt.close(),Te("Your sprite is ready. Drop it into your world.")}})}var be=null,Ei=null,Cs=!1,Wn=new Map;function Ed(){return[...Wn.values()].filter(r=>r.type==="touch").slice(0,2)}function Td(){let r=Ed();return r.length<2?null:{x:(r[0].x+r[1].x)/2,y:(r[0].y+r[1].y)/2,d:Math.max(5,Math.hypot(r[0].x-r[1].x,r[0].y-r[1].y))}}function Ec(r){let e=ge.terrainCell(r.clientX,r.clientY,Gt);if(ge.brushCell=e,ge.brushHeight=Gt.tool==="wall"?3:Gt.tool==="floor"?.05:ni[Gt.shape].height,!be)return;let t=`${e.x},${e.y},${e.z}`;if(be.cell===t)return;let i=ge.mode==="3d"&&Gt.layer===0&&Gt.tool!=="floor"?`${e.x},${e.z}`:t;if(be.visited??=new Set,be.visited.has(i))return;be.visited.add(i),be.mutated||(Ts(),be.mutated=!0);let n=be.lastCell||e,s=Math.min(80,Math.max(Math.abs(e.x-n.x),Math.abs(e.z-n.z),Math.abs(e.y-n.y))),a=!1;for(let o=0;o<=s;o++){let l=s?o/s:1;a=Vc(Ie().map,{x:Math.round(n.x+(e.x-n.x)*l),z:Math.round(n.z+(e.z-n.z)*l),y:Math.round(n.y+(e.y-n.y)*l)},Gt)||a}a?Cs=!0:Ie().map.blocks.length>=Xn&&!Gt.erase&&Te("4,096 blocks in this scene. A new scene gives you more room."),be.cell=t,be.lastCell=e}ht.addEventListener("contextmenu",r=>r.preventDefault());ht.addEventListener("pointerdown",r=>{if(Qe||r.target.closest("button"))return;if(r.preventDefault(),ht.focus(),Wn.set(r.pointerId,{x:r.clientX,y:r.clientY,type:r.pointerType}),ht.setPointerCapture(r.pointerId),Ed().length===2){if(be?.mutated){let i=dn.pop();i&&(ae=i.project,Nt=i.sceneIndex,at=i.selectedId,Ur(),pi())}be=null,Cs=!1,Ei=Td(),ge.brushCell=null;return}let e=ge.hit(r.clientX,r.clientY,Ie().objects),t=r.button===1||Ri==="pan"||r.shiftKey?"pan":r.button===2||Ri==="orbit"||r.altKey?"orbit":Or?"build":co?"path":"select";if(be={id:t==="select"?e:null,action:t,startX:r.clientX,startY:r.clientY,lastX:r.clientX,lastY:r.clientY,moved:!1,mutated:!1,oldSelected:at,time:performance.now(),touch:r.pointerType==="touch"},e&&t==="select"){Ps(e);let i=ot(),n=ge.screenToWorld(r.clientX,r.clientY,i.y);be.offset={x:i.x-n.x,y:i.y-n.y,z:i.z-n.z}}t==="build"&&!be.touch&&Ec(r)});ht.addEventListener("pointermove",r=>{if(Qe)return;Wn.has(r.pointerId)&&Wn.set(r.pointerId,{x:r.clientX,y:r.clientY,type:r.pointerType});let e=Td();if(e){Ei&&(ge.panPixels(e.x-Ei.x,e.y-Ei.y),ge.setZoom(ge.zoom*e.d/Ei.d),Gn()),Ei=e;return}if(Or&&!be&&(ge.brushCell=ge.terrainCell(r.clientX,r.clientY,Gt),ge.brushHeight=Gt.tool==="wall"?3:Gt.tool==="floor"?.05:ni[Gt.shape].height),!be||Ei)return;let t=r.clientX-be.lastX,i=r.clientY-be.lastY;if(!(be.touch&&performance.now()-be.time<100)){if(!be.moved&&Math.hypot(r.clientX-be.startX,r.clientY-be.startY)>4&&(be.moved=!0,be.id&&!be.mutated&&(Ts(),be.mutated=!0)),be.moved){if(be.action==="orbit")ge.orbit(t,i);else if(be.action==="pan")ge.panPixels(t,i);else if(be.action==="build")Ec(r);else if(be.id){let n=ot(),s=ge.screenToWorld(r.clientX,r.clientY,n.y),a=Vt(Ie(),.1);n.x=We(s.x+be.offset.x,a.minX,a.maxX),ae.camera.preset==="side"?n.y=We(s.y+be.offset.y,0,20):n.z=We(s.z+be.offset.z,a.minZ,a.maxZ),Nr()}}be.lastX=r.clientX,be.lastY=r.clientY}});function Ad(r,e=!1){if(Wn.delete(r.pointerId),Ei){Wn.size||(Ei=null),be=null;return}if(be){if(!e&&!be.moved)if(be.action==="build")Ec(r);else if(be.action==="path"){let t=ge.screenToWorld(r.clientX,r.clientY);Xe(()=>{let i=ot();i&&(i.path??=[],i.path.length<40&&i.path.push(t))},!1)}else be.action==="select"&&(be.id&&be.oldSelected===be.id?B("#inspector").classList.add("mobile-open"):be.id||Ps(null));be.mutated&&(xc(!1),Lt(),ct==="build"&&pn()),be=null}}ht.addEventListener("pointerup",r=>Ad(r));ht.addEventListener("pointercancel",r=>Ad(r,!0));ht.addEventListener("pointerleave",()=>{be||(ge.brushCell=null)});ht.addEventListener("wheel",r=>{Qe||(r.preventDefault(),r.ctrlKey||r.metaKey?(ge.setZoom(ge.zoom*Math.exp(-r.deltaY*.007)),Gn()):r.shiftKey||Math.abs(r.deltaX)>1||r.deltaMode===0&&Math.abs(r.deltaY)<50?ge.panPixels(-r.deltaX,-r.deltaY):(ge.setZoom(ge.zoom*(r.deltaY>0?.94:1.06)),Gn()))},{passive:!1});ht.addEventListener("dragover",r=>{Qe||(r.preventDefault(),ht.classList.add("drop-highlight"),r.dataTransfer.dropEffect="copy")});ht.addEventListener("dragleave",()=>ht.classList.remove("drop-highlight"));ht.addEventListener("drop",r=>{if(r.preventDefault(),ht.classList.remove("drop-highlight"),Qe)return;let e=ge.placementPoint(r.clientX,r.clientY);if(r.dataTransfer.files.length){Mc(r.dataTransfer.files,e);return}try{let t=JSON.parse(r.dataTransfer.getData("application/soulcode"));if(t.type==="asset")qi(!1),yd(t.id,e);else if(t.type==="behavior"){let i=ge.hit(r.clientX,r.clientY,Ie().objects);i&&Ps(i),_c(t.id)}}catch{}});function Gn(){B("#zoom-reset").innerHTML=Math.round(ge.zoom*100)+"<span>%</span>"}function vf(){pd(),Je("[data-panel]").forEach(r=>r.onclick=()=>{Qe||(B("#library").style.display="",gd(r.dataset.panel))}),B("#modal-close").onclick=()=>Mt.close(),Mt.addEventListener("click",r=>{if(r.target===Mt){let e=Mt.getBoundingClientRect();(r.clientX<e.left||r.clientX>e.right||r.clientY<e.top||r.clientY>e.bottom)&&Mt.close()}}),B("#templates-button").onclick=Md,B("#sprite-button").onclick=()=>wc(),B("#camera-button").onclick=()=>{Qe||qc({project:ae,showModal:mn,change:Xe,slider:Ti,bindSlider:Ai,refresh:()=>{Ur(),pi()}})},B("#project-menu").onclick=yc,B("#projects-button").onclick=yc,B("#export-button").onclick=()=>{Rs(),mf()},B("#help-button").onclick=pf,B("#play-button").onclick=ud,B("#stop-button").onclick=Rs,B("#pause-button").onclick=()=>{if(Qe){let r=Qe.togglePause();B("#pause-button").innerHTML=ce(r?"play":"pause"),B("#pause-button").setAttribute("aria-label",r?"Resume preview":"Pause preview")}},B("#scene-settings").onclick=Sd,B("#path-done").onclick=Vn,B("#undo-button").onclick=()=>ao("undo"),B("#redo-button").onclick=()=>ao("redo"),Je("[data-mode]").forEach(r=>r.onclick=()=>{Qe||ae.mode===r.dataset.mode||(Xe(()=>{ae.mode=r.dataset.mode,ae.camera=si(ae.mode==="2d"?"flat":"iso")},!1),Ur(),Nr(),Te(`${ae.mode.toUpperCase()} \u2014 same world, a new perspective.`))}),Je("[data-tool]").forEach(r=>r.onclick=()=>{qi(!1),Ri=r.dataset.tool,Je("[data-tool]").forEach(e=>e.classList.toggle("active",e===r)),ht.style.cursor=Ri==="orbit"||Ri==="pan"?"grab":"default"}),B("#grid-button").onclick=()=>{ge.showGrid=!ge.showGrid,B("#grid-button").classList.toggle("active",ge.showGrid),B("#grid-button").setAttribute("aria-pressed",ge.showGrid)},B("#focus-button").onclick=()=>{document.body.classList.toggle("focus"),B("#focus-button").setAttribute("aria-pressed",document.body.classList.contains("focus"))},B("#zoom-in").onclick=()=>{ge.setZoom(ge.zoom+.1),Gn()},B("#zoom-out").onclick=()=>{ge.setZoom(ge.zoom-.1),Gn()},B("#zoom-reset").onclick=()=>{ge.reset(),Gn()},B("#sound-toggle").onclick=()=>{ae.sound=!ae.sound,Qe?.setMuted(!ae.sound),Nr(),Ls()},B("#asset-input").onchange=r=>{Mc(r.target.files),r.target.value=""},B("#project-input").onchange=r=>{r.target.files[0]&&wd(r.target.files[0]),r.target.value=""},window.addEventListener("keydown",r=>{if(Qe||Mt.open||r.target.matches("input,textarea,select"))return;let e=r.ctrlKey||r.metaKey;e&&r.key.toLowerCase()==="z"?(r.preventDefault(),ao(r.shiftKey?"redo":"undo")):e&&r.key.toLowerCase()==="y"?(r.preventDefault(),ao("redo")):e&&r.key.toLowerCase()==="d"?(r.preventDefault(),xd()):e&&r.key.toLowerCase()==="s"?(r.preventDefault(),As().then(t=>t&&Te("Saved on this device."))):r.key==="Delete"||r.key==="Backspace"?(r.preventDefault(),_d()):r.key==="Enter"?(r.preventDefault(),ud()):r.key==="Escape"?(Vn(),B("#inspector").classList.remove("mobile-open"),B("#library").classList.remove("mobile-open")):r.key.toLowerCase()==="h"?B('[data-tool="pan"]').click():r.key.toLowerCase()==="v"&&B('[data-tool="select"]').click()}),window.addEventListener("dragover",r=>{r.dataTransfer.types.includes("Files")&&r.preventDefault()}),window.addEventListener("drop",r=>{r.dataTransfer.files.length&&r.preventDefault()}),document.addEventListener("visibilitychange",()=>{document.hidden&&(As(),Bn?.pause())})}async function yf(){try{let e=await yo(),t;try{t=localStorage.getItem("soulcode-last")}catch{}let i=e.find(n=>n.id===t);i&&(ae=Ns(i),at=ae.scenes[0].objects[0]?.id||null)}catch{}Ur(),vf(),pi(),Ls();function r(e){Cs&&(Cs=!1,ge.setTerrain(Ie())),Qe||ge.draw(Ie().objects,e/1e3),requestAnimationFrame(r)}requestAnimationFrame(r)}yf().catch(r=>{console.error(r),Te("The studio could not start. Reload to try again.")});
/*! @license three.js r162 MIT License https://github.com/mrdoob/three.js/blob/dev/LICENSE */
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
