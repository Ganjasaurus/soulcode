(()=>{var Di={grass:{name:"Meadow",color:"#378e68",light:"#67b87d",dark:"#267655"},brick:{name:"Brick",color:"#b26d59",light:"#de9e7e",dark:"#704b4b"},stone:{name:"Stone",color:"#718997",light:"#a0b4bf",dark:"#536875"},sand:{name:"Sand",color:"#c5a475",light:"#e3c795",dark:"#ac8c5f"},wood:{name:"Wood",color:"#98724f",light:"#c49c6a",dark:"#6b4c36"},ice:{name:"Ice",color:"#79b7cc",light:"#c3edf3",dark:"#4f8fae"},metal:{name:"Neon",color:"#263e50",light:"#61dff3",dark:"#1a2d3e"}},Ki={cube:{name:"Block",height:1},slab:{name:"Platform",height:.3},pillar:{name:"Pillar",height:1}},Kc=4096,$c=(r,e,t)=>Math.max(e,Math.min(t,r)),Ui=(r,e,t,i)=>Number.isFinite(Number(r))?$c(Number(r),t,i):e,di=r=>({width:18,depth:12,base:!0,tileset:r==="sand"?"sand":r==="space"||r==="race"?"metal":r==="night"?"stone":"grass",tiles:[],blocks:[],decorated:!0});function bl(r,e="forest"){let t={...di(e),...r||{}};t.width=Math.round(Ui(t.width,18,8,64)/2)*2,t.depth=Math.round(Ui(t.depth,12,4,64)/2)*2,t.base=t.base!==!1,t.decorated=t.decorated!==!1,t.tileset=Di[t.tileset]?t.tileset:"grass";let i=new Map,n=new Map;for(let s of(Array.isArray(t.tiles)?t.tiles:[]).slice(0,4096)){if(!s)continue;let a=Math.floor(Ui(s.x,0,-t.width/2,t.width/2-1)),o=Math.floor(Ui(s.z,0,-t.depth/2,t.depth/2-1));(Di[s.tile]||s.tile==="void")&&i.set(`${a},${o}`,{x:a,z:o,tile:s.tile})}for(let s of(Array.isArray(t.blocks)?t.blocks:[]).slice(0,Kc)){if(!s)continue;let a=Math.floor(Ui(s.x,0,-t.width/2,t.width/2-1)),o=Math.floor(Ui(s.z,0,-t.depth/2,t.depth/2-1)),h=Math.floor(Ui(s.y,0,0,15));n.set(`${a},${h},${o}`,{x:a,y:h,z:o,shape:Ki[s.shape]?s.shape:"cube",tile:Di[s.tile]?s.tile:t.tileset})}return{width:t.width,depth:t.depth,base:t.base,tileset:t.tileset,decorated:t.decorated,tiles:[...i.values()],blocks:[...n.values()]}}function Qi(r,e=.35){let t=r.map||di(r.theme);return{minX:-t.width/2+e,maxX:t.width/2-e,minZ:-t.depth/2+e,maxZ:t.depth/2-e}}var $i=class{constructor(e){this.map=e.map||di(e.theme),this.columns=new Map,this.tiles=new Map(this.map.tiles.map(t=>[`${t.x},${t.z}`,t.tile]));for(let t of this.map.blocks){let i=`${t.x},${t.z}`;this.columns.has(i)||this.columns.set(i,[]),this.columns.get(i).push(t)}this.lastChecks=0}nearby(e,t,i=.32){this.lastChecks=0;let n=[];for(let s=Math.floor(e-i);s<=Math.floor(e+i);s++)for(let a=Math.floor(t-i);a<=Math.floor(t+i);a++){this.lastChecks++;for(let o of this.columns.get(`${s},${a}`)||[])n.push(o)}return n}baseAt(e,t){let i=this.tiles.get(`${Math.floor(e)},${Math.floor(t)}`);return i==="void"?!1:!!(this.map.base||i)}floor(e,t,i=0,n=.28){let s=this.baseAt(e,t)?0:-1/0;for(let a of this.nearby(e,t,n)){let o=a.y+Ki[a.shape].height;o<=i+.12&&o>s&&(s=o)}return s}blocked(e,t,i,n=1.1,s=.28){return this.nearby(e,t,s).some(a=>e+s>a.x&&e-s<a.x+1&&t+s>a.z&&t-s<a.z+1&&i<a.y+Ki[a.shape].height-.03&&i+n>a.y+.04)}ceiling(e,t,i,n,s=.28){let a=1/0;for(let o of this.nearby(e,t,s))o.y>=i-.001&&o.y<=n&&(a=Math.min(a,o.y));return a}};function Sl(r){let e=Di[r]||Di.grass,t=document.createElement("canvas");t.width=t.height=32;let i=t.getContext("2d");if(i.fillStyle=e.color,i.fillRect(0,0,32,32),i.strokeStyle=e.dark,i.lineWidth=1,r==="brick"||r==="stone")for(let n=0;n<32;n+=8){i.beginPath(),i.moveTo(0,n),i.lineTo(32,n),i.stroke();for(let s=n%16?0:8;s<32;s+=16)i.beginPath(),i.moveTo(s,n),i.lineTo(s,n+8),i.stroke()}else if(r==="wood")for(let n=0;n<32;n+=8)i.fillStyle=e.dark,i.fillRect(0,n,32,1),i.fillStyle=e.light,i.fillRect(n*7%25,n+3,10,1);else if(r==="metal")i.strokeStyle=e.light,i.globalAlpha=.35,i.strokeRect(.5,.5,31,31),i.fillStyle=e.light,i.fillRect(3,3,2,2),i.fillRect(27,27,2,2),i.globalAlpha=1;else{for(let n=0;n<24;n++)i.fillStyle=n%3===0?e.dark:e.light,i.globalAlpha=.4,i.fillRect(n*13%32,n*23%32,1+n%3,1);i.globalAlpha=1,r==="ice"&&(i.strokeStyle=e.light,i.beginPath(),i.moveTo(2,25),i.lineTo(25,2),i.stroke())}return t}var aa=r=>JSON.parse(JSON.stringify(r)),Xn=()=>Math.random().toString(36).slice(2,10),je=(r,e,t)=>Math.min(t,Math.max(e,r)),Qc=["hero","tree","crystal","rock","slime","portal","crate","car","ship","npc","flower","sparkles","button","image"],wl={control:{name:"You control it",icon:"gamepad",hint:"Arrow keys or WASD",speed:4.2},jump:{name:"Jump",icon:"jump",hint:"Press Space",power:6},collect:{name:"Collect me",icon:"diamond",hint:"Touch to earn a point"},follow:{name:"Follow",icon:"follow",hint:"Follow the player",speed:1.6},patrol:{name:"Follow a path",icon:"route",hint:"Visit each path point",speed:2},wander:{name:"Wander",icon:"shuffle",hint:"Explore on your own",speed:1.2},spin:{name:"Spin",icon:"rotate",hint:"Round and round",speed:1.5},bounce:{name:"Float",icon:"waves",hint:"A little up and down",speed:2},solid:{name:"Solid",icon:"box",hint:"Players cannot walk through"},hazard:{name:"Watch out!",icon:"bolt",hint:"Bumps cost one heart"},shoot:{name:"Shoot stars",icon:"sparkles",hint:"Space or tap to shoot",speed:8},drive:{name:"Drive",icon:"flag",hint:"\u2191 go \xB7 \u2190 \u2192 steer",speed:6},goal:{name:"Next scene",icon:"door",hint:"Touch to open the next scene"},talk:{name:"Tell a story",icon:"message",hint:"Get close and press E"},particles:{name:"Sparkle",icon:"sparkles",hint:"A little everyday magic",speed:2}},eu=[["hero","Orbit","Characters","#41d9f2"],["slime","Jelly","Characters","#ab8cff"],["npc","A friend","Characters","#ffca76"],["tree","Pine tree","Nature","#45b891"],["flower","Moonflower","Nature","#eca3dc"],["rock","Rock","Nature","#8b9eac"],["crystal","Crystal","Objects","#50e9e5"],["portal","Portal","Objects","#9b82ff"],["crate","Crate","Objects","#dc9e5c"],["car","Speedster","Characters","#ff8065"],["ship","Starship","Characters","#83b7ff"],["sparkles","Stardust","Effects","#6beaff"],["button","Story button","UI","#48d8e8"]].map(([r,e,t,i])=>({kind:r,name:e,category:t,color:i}));function tu(r,e=0,t=0,i={}){let n=eu.find(a=>a.kind===r)||{name:"My image",color:"#69dfef"},s={hero:["control","jump"],tree:["solid"],rock:["solid"],crate:["solid"],crystal:["collect","spin","bounce"],slime:["wander","hazard"],portal:["goal","particles"],car:["drive"],ship:["control","shoot"],npc:["talk"],sparkles:["particles"],button:["talk"]};return{id:Xn(),kind:r,name:n.name,x:e,z:t,y:0,scale:1,rotation:0,color:n.color,visible:!0,billboard:"upright",behaviors:(s[r]||[]).map(a=>({type:a,enabled:!0,...Object.fromEntries(Object.entries(wl[a]).filter(([o])=>["speed","power"].includes(o)))})),...i}}var El={flat:{name:"2D \xB7 top down",mode:"2d"},side:{name:"2D \xB7 platformer",mode:"2d"},iso:{name:"Isometric",mode:"3d"},first:{name:"First person",mode:"3d"},third:{name:"Third person",mode:"3d"}};function jn(r="iso"){return{preset:r,height:r==="first"?1.35:5,distance:8,angle:r==="first"?0:35,yaw:0,follow:r!=="flat"}}function iu(r,e="3d"){let t=El[r?.preset]?r.preset:e==="2d"?"flat":"iso";return{...jn(t),height:$e(r?.height,t==="first"?1.35:5,.5,15),distance:$e(r?.distance,8,2,24),angle:$e(r?.angle,t==="first"?0:35,-60,80),yaw:$e(r?.yaw,0,-180,180),follow:r?.follow===void 0?jn(t).follow:r.follow!==!1}}var $e=(r,e,t,i)=>Number.isFinite(Number(r))?je(Number(r),t,i):e;function Tl(r){if(!r||r.format!=="soulcode"||r.version!==1||!Array.isArray(r.scenes)||!r.scenes.length||r.scenes.length>30)throw new Error("Choose a Soulcode project file with 1\u201330 scenes.");let e=aa(r);e.id=typeof e.id=="string"?e.id:Xn(),e.name=String(e.name||"My game").slice(0,60),e.mode=e.mode==="2d"?"2d":"3d",e.genre=["quest","shooter","racing","story","blank","platformer"].includes(e.genre)?e.genre:"blank",e.camera=iu(e.camera,e.mode),e.mode=El[e.camera.preset].mode,e.assets=(Array.isArray(e.assets)?e.assets:[]).filter(n=>n&&typeof n.src=="string"&&/^(data:image\/(png|jpeg|webp|gif);base64,|data:audio\/[a-z0-9.+-]+;base64,)/.test(n.src)).slice(0,60).map(n=>({id:String(n.id||Xn()),name:String(n.name||"My asset").slice(0,60),kind:n.src.startsWith("data:image/")?"image":"audio",src:n.src,width:$e(n.width,1,1,4096),height:$e(n.height,1,1,4096),pixelArt:n.pixelArt===!0})),e.sound=e.sound!==!1,e.music=typeof e.music=="string"?e.music:null,e.rules={lives:Math.round($e(e.rules?.lives,3,1,10)),timeLimit:$e(e.rules?.timeLimit,0,0,600),targetScore:$e(e.rules?.targetScore,5,0,100)};let t=new Set,i=new Set;return e.scenes=e.scenes.map(n=>{if(!n||!Array.isArray(n.objects)||n.objects.length>200)throw new Error("Each scene can hold up to 200 objects.");let s=bl(n.map,n.theme),a=Qi({map:s},.1),o=typeof n.id=="string"&&!t.has(n.id)?n.id:Xn();return t.add(o),{id:o,map:s,name:String(n.name||"My world").slice(0,50),theme:["forest","night","space","race","sand"].includes(n.theme)?n.theme:"forest",transition:["fade","slide","none"].includes(n.transition)?n.transition:"fade",story:{title:String(n.story?.title||"Hello!").slice(0,100),text:String(n.story?.text||"Your story starts here.").slice(0,1500),choices:(Array.isArray(n.story?.choices)?n.story.choices:[{text:"Explore",target:"close"}]).slice(0,4).map(h=>({text:String(h.text||"Continue").slice(0,80),target:String(h.target||"close")}))},objects:n.objects.filter(h=>h&&Qc.includes(h.kind)).map(h=>{let l=typeof h.id=="string"&&!i.has(h.id)?h.id:Xn();return i.add(l),{...tu(h.kind),id:l,name:String(h.name||h.kind).slice(0,50),x:$e(h.x,0,a.minX,a.maxX),z:$e(h.z,0,a.minZ,a.maxZ),y:$e(h.y,0,0,20),scale:$e(h.scale,1,.2,3),rotation:$e(h.rotation,0,-100,100),color:/^#[0-9a-f]{6}$/i.test(h.color)?h.color:"#50ddeb",visible:h.visible!==!1,billboard:h.billboard==="screen"?"screen":"upright",assetId:String(h.assetId||""),soundId:String(h.soundId||""),path:(Array.isArray(h.path)?h.path:[]).slice(0,40).map(c=>({x:$e(c.x,0,a.minX,a.maxX),z:$e(c.z,0,a.minZ,a.maxZ),y:$e(c.y,0,0,20)})),behaviors:(Array.isArray(h.behaviors)?h.behaviors:[]).filter(c=>c&&wl[c.type]).slice(0,14).map(c=>({type:c.type,enabled:c.enabled!==!1,...c.speed!==void 0?{speed:$e(c.speed,2,.1,12)}:{},...c.power!==void 0?{power:$e(c.power,6,2,12)}:{}}))}})}}),e}function Ye(r,e){return r.behaviors?.some(t=>t.type===e&&t.enabled!==!1)}function Gt(r,e){return r.behaviors?.find(t=>t.type===e&&t.enabled!==!1)}var Ur=class{constructor(e,t=0,i=()=>{}){this.project=e,this.onEvent=i,this.score=0,this.lives=e.rules.lives,this.time=0,this.won=!1,this.lost=!1,this.particles=[],this.bullets=[],this.side=e.camera?.preset==="side",this.load(t)}load(e){this.sceneIndex=je(e,0,this.project.scenes.length-1),this.scene=this.project.scenes[this.sceneIndex],this.terrain=new $i(this.scene),this.limits=Qi(this.scene),this.objects=aa(this.scene.objects).filter(t=>t.visible!==!1),this.player=this.objects.find(t=>Ye(t,"control")||Ye(t,"drive")),this.objects.forEach(t=>{t.home={x:t.x,z:t.z,y:t.y},t.angle=t.rotation||0,t.vy=0,t.target=0,t.cooldown=0,t.grounded=!1}),this.bullets=[],this.invincible=0,this.talkCooldown=1,this.actionWasDown=!1,this.onEvent({type:"scene",index:this.sceneIndex})}emit(e,t){this.onEvent({type:e,object:t})}burst(e,t,i="#68edff",n=18,s=.5){for(let a=0;a<n&&this.particles.length<240;a++)this.particles.push({x:e,z:t,y:s,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,vy:Math.random()*3,life:.6+Math.random()*.6,color:i})}next(e="next"){if(e!=="close")if(e==="next")this.sceneIndex+1<this.project.scenes.length?this.load(this.sceneIndex+1):this.win();else{let t=this.project.scenes.findIndex(i=>i.id===e);t>=0&&this.load(t)}}win(){this.won||(this.won=!0,this.emit("win"))}hit(){this.invincible>0||this.won||this.lost||(this.lives--,this.invincible=2,this.emit("hurt"),this.player&&(this.burst(this.player.x,this.player.z,"#ff929c",18,this.player.y+.5),Object.assign(this.player,this.player.home,{vy:0,velocity:0})),this.lives<=0&&(this.lost=!0,this.emit("lose")))}blocked(e,t,i){let n=.3*e.scale,s=1.15*e.scale;return this.terrain.blocked(t,i,e.y,s,n)?!0:e!==this.player?!1:this.objects.some(a=>a!==e&&Ye(a,"solid")&&!a.removed&&Math.hypot(t-a.x,i-a.z)<.48*(e.scale+a.scale)&&e.y<a.y+(a.kind==="tree"?2:1)*a.scale&&e.y+s>a.y+.1)}move(e,t,i){let n=this.limits,s=je(e.x+t,n.minX,n.maxX),a=je(e.z+i,n.minZ,n.maxZ);this.blocked(e,s,e.z)||(e.x=s),this.blocked(e,e.x,a)||(e.z=a)}vertical(e,t,i){let n=e.y,s=1.15*e.scale,a=this.terrain.floor(e.x,e.z,e.y+.08,.28*e.scale);e.grounded=Number.isFinite(a)&&Math.abs(e.y-a)<.13&&e.vy<=0,e.grounded&&(e.y=a,e.vy=0),i&&e.grounded&&(e.vy=Gt(e,"jump")?.power||6,e.grounded=!1,this.emit("jump",e)),e.vy-=16*t;let o=e.y+e.vy*t;if(e.vy>0){let h=this.terrain.ceiling(e.x,e.z,n+s-.01,o+s,.28*e.scale);Number.isFinite(h)&&(o=h-s,e.vy=0)}e.vy<=0&&(a=this.terrain.floor(e.x,e.z,n+.04,.28*e.scale),Number.isFinite(a)&&o<=a&&n>=a-.1&&(o=a,e.vy=0,e.grounded=!0)),e.y=o,e.y<-6&&(e===this.player?this.hit():Object.assign(e,e.home,{vy:0}))}update(e,t={}){if(e=je(e,0,.05),this.invincible=Math.max(0,this.invincible-e),this.talkCooldown=Math.max(0,this.talkCooldown-e),this.particles=this.particles.filter(s=>(s.life-=e,s.x+=s.vx*e,s.z+=s.vz*e,s.y+=s.vy*e,s.vy-=6*e,s.life>0)),this.won||this.lost)return;if(this.time+=e,this.project.rules.timeLimit&&this.time>=this.project.rules.timeLimit){this.lost=!0,this.emit("lose");return}let i=t.action&&!this.actionWasDown;this.actionWasDown=!!t.action;for(let s of this.objects){if(s.removed)continue;if(s.cooldown=Math.max(0,s.cooldown-e),Ye(s,"control")){let d=(t.right?1:0)-(t.left?1:0),p=this.side?0:(t.down?1:0)-(t.up?1:0),m=Math.hypot(d,p)||1,y=t.moveYaw||0,g=(d*Math.cos(y)+p*Math.sin(y))/m,f=(p*Math.cos(y)-d*Math.sin(y))/m,_=Gt(s,"control").speed||4;this.move(s,g*_*e,f*_*e),(d||p)&&(s.angle=Math.atan2(g,f),d&&(s.facing=Math.sign(d)))}if(Ye(s,"drive")){let d=Gt(s,"drive").speed||6;s.velocity=(s.velocity||0)+((t.up?6:0)-(t.down?7:0))*e,s.velocity*=Math.pow(.72,e),s.velocity=je(s.velocity,-d*.45,d),s.angle+=((t.left?1:0)-(t.right?1:0))*e*2*Math.sign(s.velocity||1),this.move(s,Math.sin(s.angle)*s.velocity*e,Math.cos(s.angle)*s.velocity*e)}if(Ye(s,"shoot")&&t.action&&s.cooldown<=0&&this.bullets.length<100){let d=t.moveYaw||0,p=this.side?0:t.lookPitch||0,m=this.side?s.facing||1:-Math.sin(d)*Math.cos(p),y=this.side?0:-Math.cos(d)*Math.cos(p),g=this.side?0:-Math.sin(p);this.bullets.push({x:s.x+m*.5,z:s.z+y*.5,y:s.y+(this.project.camera?.preset==="first"?this.project.camera.height:.65),dx:m,dz:y,dy:g,life:3,speed:Gt(s,"shoot").speed||8}),s.cooldown=.23,this.emit("shoot",s)}let a=Gt(s,"follow"),o=Gt(s,"patrol"),h=Gt(s,"wander"),l=null,c=0;if(a&&this.player&&s!==this.player)l=this.player,c=a.speed||1.6;else if(o){let d=s.path?.length?s.path:[{x:s.home.x-1.4,z:s.home.z},{x:s.home.x+1.4,z:s.home.z}];s.target%=d.length,l=d[s.target],c=o.speed||2,Math.hypot(s.x-l.x,s.z-l.z)<.15&&(s.target=(s.target+1)%d.length)}else h&&((!s.wanderTo||Math.hypot(s.x-s.wanderTo.x,s.z-s.wanderTo.z)<.2)&&(s.wanderTo={x:je(s.home.x+(Math.random()-.5)*5,this.limits.minX,this.limits.maxX),z:this.side?s.home.z:je(s.home.z+(Math.random()-.5)*5,this.limits.minZ,this.limits.maxZ)}),l=s.wanderTo,c=h.speed||1.2);if(l){let d=l.x-s.x,p=this.side?0:l.z-s.z,m=Math.hypot(d,p);m>.15&&(this.move(s,d/m*Math.min(c*e,m),p/m*Math.min(c*e,m)),s.angle=Math.atan2(d,p))}let u=Ye(s,"jump")||Ye(s,"control")||Ye(s,"drive")||a||h||o;u&&this.vertical(s,e,Ye(s,"jump")&&i),Ye(s,"spin")&&(s.angle+=e*(Gt(s,"spin").speed||1.5)),Ye(s,"bounce")&&!u&&(s.y=s.home.y+.2+Math.sin(this.time*(Gt(s,"bounce").speed||2))*.2),Ye(s,"particles")&&Math.random()<e*6&&this.burst(s.x,s.z,s.color,1,s.y+.5)}let n=this.player;if(n)for(let s of this.objects){if(s===n||s.removed)continue;let a=Math.hypot(n.x-s.x,n.z-s.z),o=Math.abs(n.y-s.y),h=a<.6*(n.scale+s.scale)&&o<1.2*(n.scale+s.scale)/2;if(h&&Ye(s,"collect")&&(s.removed=!0,this.score++,this.burst(s.x,s.z,s.color,18,s.y+.5),this.emit("collect",s),this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&["racing","shooter"].includes(this.project.genre)&&this.win()),h&&Ye(s,"hazard")&&o<.7&&this.hit(),h&&Ye(s,"goal"))if(this.score>=this.project.rules.targetScore){this.next();return}else this.talkCooldown<=0&&(this.emit("locked",s),this.talkCooldown=2);Ye(s,"talk")&&a<2&&o<2&&t.interact&&this.talkCooldown<=0&&(this.emit("talk",s),this.talkCooldown=1)}for(let s of this.bullets)if(s.x+=(s.dx||0)*s.speed*e,s.z+=(s.dz??-1)*s.speed*e,s.y+=(s.dy||0)*s.speed*e,s.life-=e,this.terrain.blocked(s.x,s.z,s.y,.1,.08)&&(s.life=0),!(s.life<=0)){for(let a of this.objects)if(!a.removed&&Ye(a,"hazard")&&Math.hypot(s.x-a.x,s.z-a.z)<.7*a.scale&&Math.abs(s.y-(a.y+.5))<.8*a.scale){a.removed=!0,s.life=0,this.score++,this.burst(a.x,a.z,a.color,18,a.y+.5),this.emit("collect",a),this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&this.win();break}}this.bullets=this.bullets.filter(s=>s.life>0&&Math.abs(s.x)<this.terrain.map.width/2&&Math.abs(s.z)<this.terrain.map.depth/2)}};var qa="162";var uc=1,Qo=2,ri=3,Si=0,xt=1,Ar=2;var Gi=100;var Ya=204,Za=205;var dc=0,nu=1,ru=2,Mi=0,su=1,au=2,ou=3,el=4,lu=5,hu=6,cu=7;var pc=300,An=301,Rn=302,Ja=303,Ka=304,Js=306,$a=1e3,si=1001,Qa=1002,it=1003,Al=1004;var qn=1005;var _t=1006,oa=1007;var Sn=1008;var Xi=1009;var tl=1012,mc=1013,yi=1014,Wt=1015,lr=1016,fc=1017,gc=1018,ji=1020;var oi=1023;var qi=1026,Cn=1027,vc=1028,_c=1029;var yc=1031,xc=1033,la=33776,ha=33777,ca=33778,ua=33779,Rl=35840,Cl=35841,Pl=35842,Ll=35843,Mc=36196,Il=37492,Ul=37496,Dl=37808,Nl=37809,Ol=37810,Fl=37811,zl=37812,Bl=37813,kl=37814,Hl=37815,Gl=37816,Vl=37817,Wl=37818,Xl=37819,jl=37820,ql=37821,da=36492,Yl=36494,Zl=36495;var Jl=36284,Kl=36285,$l=36286;var gs=2300,vs=2301,pa=2302,Ql=2400,eh=2401,th=2402;var bn="",yt="srgb",Ti="srgb-linear",il="display-p3",Ks="display-p3-linear",_s="linear",Be="srgb",ys="rec709",xs="p3";var en=7680;var eo=35044;var ih="300 es",bc=1035,Pn=2e3,Ms=2001,wi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let n=i.indexOf(t);n!==-1&&i.splice(n,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let i=t.slice(0);for(let n=0,s=i.length;n<s;n++)i[n].call(this,e);e.target=null}}},ut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var fs=Math.PI/180,to=180/Math.PI;function li(){let r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,i=4294967295*Math.random()|0;return(ut[255&r]+ut[r>>8&255]+ut[r>>16&255]+ut[r>>24&255]+"-"+ut[255&e]+ut[e>>8&255]+"-"+ut[e>>16&15|64]+ut[e>>24&255]+"-"+ut[63&t|128]+ut[t>>8&255]+"-"+ut[t>>16&255]+ut[t>>24&255]+ut[255&i]+ut[i>>8&255]+ut[i>>16&255]+ut[i>>24&255]).toLowerCase()}function at(r,e,t){return Math.max(e,Math.min(t,r))}function uu(r,e){return(r%e+e)%e}function ma(r,e,t){return(1-t)*r+t*e}function nh(r){return(r&r-1)==0&&r!==0}function io(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Xt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Oe(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}var ie=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*n+e.x,this.y=s*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ee=class r{constructor(e,t,i,n,s,a,o,h,l){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,h,l)}set(e,t,i,n,s,a,o,h,l){let c=this.elements;return c[0]=e,c[1]=n,c[2]=o,c[3]=t,c[4]=s,c[5]=h,c[6]=i,c[7]=a,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[3],h=i[6],l=i[1],c=i[4],u=i[7],d=i[2],p=i[5],m=i[8],y=n[0],g=n[3],f=n[6],_=n[1],v=n[4],x=n[7],R=n[2],T=n[5],S=n[8];return s[0]=a*y+o*_+h*R,s[3]=a*g+o*v+h*T,s[6]=a*f+o*x+h*S,s[1]=l*y+c*_+u*R,s[4]=l*g+c*v+u*T,s[7]=l*f+c*x+u*S,s[2]=d*y+p*_+m*R,s[5]=d*g+p*v+m*T,s[8]=d*f+p*x+m*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],l=e[7],c=e[8];return t*a*c-t*o*l-i*s*c+i*o*h+n*s*l-n*a*h}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],l=e[7],c=e[8],u=c*a-o*l,d=o*h-c*s,p=l*s-a*h,m=t*u+i*d+n*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return e[0]=u*y,e[1]=(n*l-c*i)*y,e[2]=(o*i-n*a)*y,e[3]=d*y,e[4]=(c*t-n*h)*y,e[5]=(n*s-o*t)*y,e[6]=p*y,e[7]=(i*h-l*t)*y,e[8]=(a*t-i*s)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,a,o){let h=Math.cos(s),l=Math.sin(s);return this.set(i*h,i*l,-i*(h*a+l*o)+a+e,-n*l,n*h,-n*(-l*a+h*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(fa.makeScale(e,t)),this}rotate(e){return this.premultiply(fa.makeRotation(-e)),this}translate(e,t){return this.premultiply(fa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},fa=new Ee;function Sc(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function hr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function du(){let r=hr("canvas");return r.style.display="block",r}var rh={};function wc(r){r in rh||(rh[r]=!0,console.warn(r))}var sh=new Ee().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ah=new Ee().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Dr={[Ti]:{transfer:_s,primaries:ys,toReference:r=>r,fromReference:r=>r},[yt]:{transfer:Be,primaries:ys,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[Ks]:{transfer:_s,primaries:xs,toReference:r=>r.applyMatrix3(ah),fromReference:r=>r.applyMatrix3(sh)},[il]:{transfer:Be,primaries:xs,toReference:r=>r.convertSRGBToLinear().applyMatrix3(ah),fromReference:r=>r.applyMatrix3(sh).convertLinearToSRGB()}},pu=new Set([Ti,Ks]),Fe={enabled:!0,_workingColorSpace:Ti,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!pu.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;let i=Dr[e].toReference;return(0,Dr[t].fromReference)(i(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return Dr[r].primaries},getTransfer:function(r){return r===bn?_s:Dr[r].transfer}};function En(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function ga(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}var tn,ai=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{tn===void 0&&(tn=hr("canvas")),tn.width=e.width,tn.height=e.height;let i=tn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=tn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=hr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=255*En(s[a]/255);return i.putImageData(n,0,0),t}if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(255*En(t[i]/255)):t[i]=En(t[i]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},mu=0,bs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=li(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(va(n[a].image)):s.push(va(n[a]))}else s=va(n);i.url=s}return t||(e.images[this.uuid]=i),i}};function va(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?ai.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var fu=0,gt=class r extends wi{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,i=1001,n=1001,s=1006,a=1008,o=1023,h=1009,l=r.DEFAULT_ANISOTROPY,c=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fu++}),this.uuid=li(),this.name="",this.source=new bs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=h,this.offset=new ie(0,0),this.repeat=new ie(1,1),this.center=new ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $a:e.x=e.x-Math.floor(e.x);break;case si:e.x=e.x<0?0:1;break;case Qa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case $a:e.y=e.y-Math.floor(e.y);break;case si:e.y=e.y<0?0:1;break;case Qa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}};gt.DEFAULT_IMAGE=null,gt.DEFAULT_MAPPING=pc,gt.DEFAULT_ANISOTROPY=1;var Je=class r{constructor(e=0,t=0,i=0,n=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s,h=e.elements,l=h[0],c=h[4],u=h[8],d=h[1],p=h[5],m=h[9],y=h[2],g=h[6],f=h[10];if(Math.abs(c-d)<.01&&Math.abs(u-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(c+d)<.1&&Math.abs(u+y)<.1&&Math.abs(m+g)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(l+1)/2,x=(p+1)/2,R=(f+1)/2,T=(c+d)/4,S=(u+y)/4,I=(m+g)/4;return v>x&&v>R?v<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(v),n=T/i,s=S/i):x>R?x<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(x),i=T/n,s=I/n):R<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(R),i=S/s,n=I/s),this.set(i,n,s,t),this}let _=Math.sqrt((g-m)*(g-m)+(u-y)*(u-y)+(d-c)*(d-c));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-y)/_,this.z=(d-c)/_,this.w=Math.acos((l+p+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},no=class extends wi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Je(0,0,e,t),this.scissorTest=!1,this.viewport=new Je(0,0,e,t);let n={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_t,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0,count:1},i);let s=new gt(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,n=e.textures.length;i<n;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new bs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},hi=class extends no{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Ss=class extends gt{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=it,this.minFilter=it,this.wrapR=si,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ro=class extends gt{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=it,this.minFilter=it,this.wrapR=si,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var jt=class{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,a,o){let h=i[n+0],l=i[n+1],c=i[n+2],u=i[n+3],d=s[a+0],p=s[a+1],m=s[a+2],y=s[a+3];if(o===0)return e[t+0]=h,e[t+1]=l,e[t+2]=c,void(e[t+3]=u);if(o===1)return e[t+0]=d,e[t+1]=p,e[t+2]=m,void(e[t+3]=y);if(u!==y||h!==d||l!==p||c!==m){let g=1-o,f=h*d+l*p+c*m+u*y,_=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){let R=Math.sqrt(v),T=Math.atan2(R,f*_);g=Math.sin(g*T)/R,o=Math.sin(o*T)/R}let x=o*_;if(h=h*g+d*x,l=l*g+p*x,c=c*g+m*x,u=u*g+y*x,g===1-o){let R=1/Math.sqrt(h*h+l*l+c*c+u*u);h*=R,l*=R,c*=R,u*=R}}e[t]=h,e[t+1]=l,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,n,s,a){let o=i[n],h=i[n+1],l=i[n+2],c=i[n+3],u=s[a],d=s[a+1],p=s[a+2],m=s[a+3];return e[t]=o*m+c*u+h*p-l*d,e[t+1]=h*m+c*d+l*u-o*p,e[t+2]=l*m+c*p+o*d-h*u,e[t+3]=c*m-o*u-h*d-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,n=e._y,s=e._z,a=e._order,o=Math.cos,h=Math.sin,l=o(i/2),c=o(n/2),u=o(s/2),d=h(i/2),p=h(n/2),m=h(s/2);switch(a){case"XYZ":this._x=d*c*u+l*p*m,this._y=l*p*u-d*c*m,this._z=l*c*m+d*p*u,this._w=l*c*u-d*p*m;break;case"YXZ":this._x=d*c*u+l*p*m,this._y=l*p*u-d*c*m,this._z=l*c*m-d*p*u,this._w=l*c*u+d*p*m;break;case"ZXY":this._x=d*c*u-l*p*m,this._y=l*p*u+d*c*m,this._z=l*c*m+d*p*u,this._w=l*c*u-d*p*m;break;case"ZYX":this._x=d*c*u-l*p*m,this._y=l*p*u+d*c*m,this._z=l*c*m-d*p*u,this._w=l*c*u+d*p*m;break;case"YZX":this._x=d*c*u+l*p*m,this._y=l*p*u+d*c*m,this._z=l*c*m-d*p*u,this._w=l*c*u-d*p*m;break;case"XZY":this._x=d*c*u-l*p*m,this._y=l*p*u-d*c*m,this._z=l*c*m+d*p*u,this._w=l*c*u+d*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],n=t[4],s=t[8],a=t[1],o=t[5],h=t[9],l=t[2],c=t[6],u=t[10],d=i+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(c-h)*p,this._y=(s-l)*p,this._z=(a-n)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(c-h)/p,this._x=.25*p,this._y=(n+a)/p,this._z=(s+l)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(s-l)/p,this._x=(n+a)/p,this._y=.25*p,this._z=(h+c)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-n)/p,this._x=(s+l)/p,this._y=(h+c)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(at(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,n=e._y,s=e._z,a=e._w,o=t._x,h=t._y,l=t._z,c=t._w;return this._x=i*c+a*o+n*l-s*h,this._y=n*c+a*h+s*o-i*l,this._z=s*c+a*l+i*h-n*o,this._w=a*c-i*o-n*h-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,n=this._y,s=this._z,a=this._w,o=a*e._w+i*e._x+n*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;let h=1-o*o;if(h<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*n+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let l=Math.sqrt(h),c=Math.atan2(l,o),u=Math.sin((1-t)*c)/l,d=Math.sin(t*c)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=n*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},w=class r{constructor(e=0,t=0,i=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(oh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(oh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,n=this.z,s=e.x,a=e.y,o=e.z,h=e.w,l=2*(a*n-o*i),c=2*(o*t-s*n),u=2*(s*i-a*t);return this.x=t+h*l+a*u-o*c,this.y=i+h*c+o*l-s*u,this.z=n+h*u+s*c-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,n=e.y,s=e.z,a=t.x,o=t.y,h=t.z;return this.x=n*h-s*o,this.y=s*a-i*h,this.z=i*o-n*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return _a.copy(this).projectOnVector(e),this.sub(_a)}reflect(e){return this.sub(_a.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},_a=new w,oh=new jt,Mt=class{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Nt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Nt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Nt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Nt):Nt.fromBufferAttribute(s,a),Nt.applyMatrix4(e.matrixWorld),this.expandByPoint(Nt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Nr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Nr.copy(i.boundingBox)),Nr.applyMatrix4(e.matrixWorld),this.union(Nr)}let n=e.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Nt),Nt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Yn),Or.subVectors(this.max,Yn),nn.subVectors(e.a,Yn),rn.subVectors(e.b,Yn),sn.subVectors(e.c,Yn),pi.subVectors(rn,nn),mi.subVectors(sn,rn),Ni.subVectors(nn,sn);let t=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Ni.z,Ni.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Ni.z,0,-Ni.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Ni.y,Ni.x,0];return!!ya(t,nn,rn,sn,Or)&&(t=[1,0,0,0,1,0,0,0,1],!!ya(t,nn,rn,sn,Or)&&(Fr.crossVectors(pi,mi),t=[Fr.x,Fr.y,Fr.z],ya(t,nn,rn,sn,Or)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Nt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Nt).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Qt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qt)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Qt=[new w,new w,new w,new w,new w,new w,new w,new w],Nt=new w,Nr=new Mt,nn=new w,rn=new w,sn=new w,pi=new w,mi=new w,Ni=new w,Yn=new w,Or=new w,Fr=new w,Oi=new w;function ya(r,e,t,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){Oi.fromArray(r,s);let o=n.x*Math.abs(Oi.x)+n.y*Math.abs(Oi.y)+n.z*Math.abs(Oi.z),h=e.dot(Oi),l=t.dot(Oi),c=i.dot(Oi);if(Math.max(-Math.max(h,l,c),Math.min(h,l,c))>o)return!1}return!0}var gu=new Mt,Zn=new w,xa=new w,kt=class{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):gu.setFromPoints(e).getCenter(i);let n=0;for(let s=0,a=e.length;s<a;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zn.subVectors(e,this.center);let t=Zn.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),n=.5*(i-this.radius);this.center.addScaledVector(Zn,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zn.copy(e.center).add(xa)),this.expandByPoint(Zn.copy(e.center).sub(xa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},ei=new w,Ma=new w,zr=new w,fi=new w,ba=new w,Br=new w,Sa=new w,Yi=class{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Ma.copy(e).add(t).multiplyScalar(.5),zr.copy(t).sub(e).normalize(),fi.copy(this.origin).sub(Ma);let s=.5*e.distanceTo(t),a=-this.direction.dot(zr),o=fi.dot(this.direction),h=-fi.dot(zr),l=fi.lengthSq(),c=Math.abs(1-a*a),u,d,p,m;if(c>0)if(u=a*h-o,d=a*o-h,m=s*c,u>=0)if(d>=-m)if(d<=m){let y=1/c;u*=y,d*=y,p=u*(u+a*d+2*o)+d*(a*u+d+2*h)+l}else d=s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*h)+l;else d=-s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*h)+l;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-h),s),p=-u*u+d*(d+2*h)+l):d<=m?(u=0,d=Math.min(Math.max(-s,-h),s),p=d*(d+2*h)+l):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-h),s),p=-u*u+d*(d+2*h)+l);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*h)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(Ma).addScaledVector(zr,d),p}intersectSphere(e,t){ei.subVectors(e.center,this.origin);let i=ei.dot(this.direction),n=ei.dot(ei)-i*i,s=e.radius*e.radius;if(n>s)return null;let a=Math.sqrt(s-n),o=i-a,h=i+a;return h<0?null:o<0?this.at(h,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,a,o,h,l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,n=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,n=(e.min.x-d.x)*l),c>=0?(s=(e.min.y-d.y)*c,a=(e.max.y-d.y)*c):(s=(e.max.y-d.y)*c,a=(e.min.y-d.y)*c),i>a||s>n?null:((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),u>=0?(o=(e.min.z-d.z)*u,h=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,h=(e.min.z-d.z)*u),i>h||o>n?null:((o>i||i!=i)&&(i=o),(h<n||n!=n)&&(n=h),n<0?null:this.at(i>=0?i:n,t)))}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,i,n,s){ba.subVectors(t,e),Br.subVectors(i,e),Sa.crossVectors(ba,Br);let a,o=this.direction.dot(Sa);if(o>0){if(n)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}fi.subVectors(this.origin,e);let h=a*this.direction.dot(Br.crossVectors(fi,Br));if(h<0)return null;let l=a*this.direction.dot(ba.cross(fi));if(l<0||h+l>o)return null;let c=-a*fi.dot(Sa);return c<0?null:this.at(c/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},be=class r{constructor(e,t,i,n,s,a,o,h,l,c,u,d,p,m,y,g){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,h,l,c,u,d,p,m,y,g)}set(e,t,i,n,s,a,o,h,l,c,u,d,p,m,y,g){let f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=n,f[1]=s,f[5]=a,f[9]=o,f[13]=h,f[2]=l,f[6]=c,f[10]=u,f[14]=d,f[3]=p,f[7]=m,f[11]=y,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,n=1/an.setFromMatrixColumn(e,0).length(),s=1/an.setFromMatrixColumn(e,1).length(),a=1/an.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,n=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),h=Math.cos(n),l=Math.sin(n),c=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*c,p=a*u,m=o*c,y=o*u;t[0]=h*c,t[4]=-h*u,t[8]=l,t[1]=p+m*l,t[5]=d-y*l,t[9]=-o*h,t[2]=y-d*l,t[6]=m+p*l,t[10]=a*h}else if(e.order==="YXZ"){let d=h*c,p=h*u,m=l*c,y=l*u;t[0]=d+y*o,t[4]=m*o-p,t[8]=a*l,t[1]=a*u,t[5]=a*c,t[9]=-o,t[2]=p*o-m,t[6]=y+d*o,t[10]=a*h}else if(e.order==="ZXY"){let d=h*c,p=h*u,m=l*c,y=l*u;t[0]=d-y*o,t[4]=-a*u,t[8]=m+p*o,t[1]=p+m*o,t[5]=a*c,t[9]=y-d*o,t[2]=-a*l,t[6]=o,t[10]=a*h}else if(e.order==="ZYX"){let d=a*c,p=a*u,m=o*c,y=o*u;t[0]=h*c,t[4]=m*l-p,t[8]=d*l+y,t[1]=h*u,t[5]=y*l+d,t[9]=p*l-m,t[2]=-l,t[6]=o*h,t[10]=a*h}else if(e.order==="YZX"){let d=a*h,p=a*l,m=o*h,y=o*l;t[0]=h*c,t[4]=y-d*u,t[8]=m*u+p,t[1]=u,t[5]=a*c,t[9]=-o*c,t[2]=-l*c,t[6]=p*u+m,t[10]=d-y*u}else if(e.order==="XZY"){let d=a*h,p=a*l,m=o*h,y=o*l;t[0]=h*c,t[4]=-u,t[8]=l*c,t[1]=d*u+y,t[5]=a*c,t[9]=p*u-m,t[2]=m*u-p,t[6]=o*c,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(vu,e,_u)}lookAt(e,t,i){let n=this.elements;return bt.subVectors(e,t),bt.lengthSq()===0&&(bt.z=1),bt.normalize(),gi.crossVectors(i,bt),gi.lengthSq()===0&&(Math.abs(i.z)===1?bt.x+=1e-4:bt.z+=1e-4,bt.normalize(),gi.crossVectors(i,bt)),gi.normalize(),kr.crossVectors(bt,gi),n[0]=gi.x,n[4]=kr.x,n[8]=bt.x,n[1]=gi.y,n[5]=kr.y,n[9]=bt.y,n[2]=gi.z,n[6]=kr.z,n[10]=bt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[4],h=i[8],l=i[12],c=i[1],u=i[5],d=i[9],p=i[13],m=i[2],y=i[6],g=i[10],f=i[14],_=i[3],v=i[7],x=i[11],R=i[15],T=n[0],S=n[4],I=n[8],D=n[12],z=n[1],q=n[5],P=n[9],H=n[13],J=n[2],re=n[6],he=n[10],K=n[14],W=n[3],$=n[7],oe=n[11],j=n[15];return s[0]=a*T+o*z+h*J+l*W,s[4]=a*S+o*q+h*re+l*$,s[8]=a*I+o*P+h*he+l*oe,s[12]=a*D+o*H+h*K+l*j,s[1]=c*T+u*z+d*J+p*W,s[5]=c*S+u*q+d*re+p*$,s[9]=c*I+u*P+d*he+p*oe,s[13]=c*D+u*H+d*K+p*j,s[2]=m*T+y*z+g*J+f*W,s[6]=m*S+y*q+g*re+f*$,s[10]=m*I+y*P+g*he+f*oe,s[14]=m*D+y*H+g*K+f*j,s[3]=_*T+v*z+x*J+R*W,s[7]=_*S+v*q+x*re+R*$,s[11]=_*I+v*P+x*he+R*oe,s[15]=_*D+v*H+x*K+R*j,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],a=e[1],o=e[5],h=e[9],l=e[13],c=e[2],u=e[6],d=e[10],p=e[14];return e[3]*(+s*h*u-n*l*u-s*o*d+i*l*d+n*o*p-i*h*p)+e[7]*(+t*h*p-t*l*d+s*a*d-n*a*p+n*l*c-s*h*c)+e[11]*(+t*l*u-t*o*p-s*a*u+i*a*p+s*o*c-i*l*c)+e[15]*(-n*o*c-t*h*u+t*o*d+n*a*u-i*a*d+i*h*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],l=e[7],c=e[8],u=e[9],d=e[10],p=e[11],m=e[12],y=e[13],g=e[14],f=e[15],_=u*g*l-y*d*l+y*h*p-o*g*p-u*h*f+o*d*f,v=m*d*l-c*g*l-m*h*p+a*g*p+c*h*f-a*d*f,x=c*y*l-m*u*l+m*o*p-a*y*p-c*o*f+a*u*f,R=m*u*h-c*y*h-m*o*d+a*y*d+c*o*g-a*u*g,T=t*_+i*v+n*x+s*R;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/T;return e[0]=_*S,e[1]=(y*d*s-u*g*s-y*n*p+i*g*p+u*n*f-i*d*f)*S,e[2]=(o*g*s-y*h*s+y*n*l-i*g*l-o*n*f+i*h*f)*S,e[3]=(u*h*s-o*d*s-u*n*l+i*d*l+o*n*p-i*h*p)*S,e[4]=v*S,e[5]=(c*g*s-m*d*s+m*n*p-t*g*p-c*n*f+t*d*f)*S,e[6]=(m*h*s-a*g*s-m*n*l+t*g*l+a*n*f-t*h*f)*S,e[7]=(a*d*s-c*h*s+c*n*l-t*d*l-a*n*p+t*h*p)*S,e[8]=x*S,e[9]=(m*u*s-c*y*s-m*i*p+t*y*p+c*i*f-t*u*f)*S,e[10]=(a*y*s-m*o*s+m*i*l-t*y*l-a*i*f+t*o*f)*S,e[11]=(c*o*s-a*u*s-c*i*l+t*u*l+a*i*p-t*o*p)*S,e[12]=R*S,e[13]=(c*y*n-m*u*n+m*i*d-t*y*d-c*i*g+t*u*g)*S,e[14]=(m*o*n-a*y*n-m*i*h+t*y*h+a*i*g-t*o*g)*S,e[15]=(a*u*n-c*o*n+c*i*h-t*u*h-a*i*d+t*o*d)*S,this}scale(e){let t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),n=Math.sin(t),s=1-i,a=e.x,o=e.y,h=e.z,l=s*a,c=s*o;return this.set(l*a+i,l*o-n*h,l*h+n*o,0,l*o+n*h,c*o+i,c*h-n*a,0,l*h-n*o,c*h+n*a,s*h*h+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,a){return this.set(1,i,s,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){let n=this.elements,s=t._x,a=t._y,o=t._z,h=t._w,l=s+s,c=a+a,u=o+o,d=s*l,p=s*c,m=s*u,y=a*c,g=a*u,f=o*u,_=h*l,v=h*c,x=h*u,R=i.x,T=i.y,S=i.z;return n[0]=(1-(y+f))*R,n[1]=(p+x)*R,n[2]=(m-v)*R,n[3]=0,n[4]=(p-x)*T,n[5]=(1-(d+f))*T,n[6]=(g+_)*T,n[7]=0,n[8]=(m+v)*S,n[9]=(g-_)*S,n[10]=(1-(d+y))*S,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){let n=this.elements,s=an.set(n[0],n[1],n[2]).length(),a=an.set(n[4],n[5],n[6]).length(),o=an.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),e.x=n[12],e.y=n[13],e.z=n[14],Ot.copy(this);let h=1/s,l=1/a,c=1/o;return Ot.elements[0]*=h,Ot.elements[1]*=h,Ot.elements[2]*=h,Ot.elements[4]*=l,Ot.elements[5]*=l,Ot.elements[6]*=l,Ot.elements[8]*=c,Ot.elements[9]*=c,Ot.elements[10]*=c,t.setFromRotationMatrix(Ot),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,n,s,a,o=2e3){let h=this.elements,l=2*s/(t-e),c=2*s/(i-n),u=(t+e)/(t-e),d=(i+n)/(i-n),p,m;if(o===Pn)p=-(a+s)/(a-s),m=-2*a*s/(a-s);else{if(o!==Ms)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);p=-a/(a-s),m=-a*s/(a-s)}return h[0]=l,h[4]=0,h[8]=u,h[12]=0,h[1]=0,h[5]=c,h[9]=d,h[13]=0,h[2]=0,h[6]=0,h[10]=p,h[14]=m,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,n,s,a,o=2e3){let h=this.elements,l=1/(t-e),c=1/(i-n),u=1/(a-s),d=(t+e)*l,p=(i+n)*c,m,y;if(o===Pn)m=(a+s)*u,y=-2*u;else{if(o!==Ms)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);m=s*u,y=-1*u}return h[0]=2*l,h[4]=0,h[8]=0,h[12]=-d,h[1]=0,h[5]=2*c,h[9]=0,h[13]=-p,h[2]=0,h[6]=0,h[10]=y,h[14]=-m,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},an=new w,Ot=new be,vu=new w(0,0,0),_u=new w(1,1,1),gi=new w,kr=new w,bt=new w,lh=new be,hh=new jt,qt=class r{constructor(e=0,t=0,i=0,n=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let n=e.elements,s=n[0],a=n[4],o=n[8],h=n[1],l=n[5],c=n[9],u=n[2],d=n[6],p=n[10];switch(t){case"XYZ":this._y=Math.asin(at(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-at(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(h,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(at(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(h,s));break;case"ZYX":this._y=Math.asin(-at(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(h,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(at(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-c,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-at(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-c,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return lh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(lh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return hh.setFromEuler(this),this.setFromQuaternion(hh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};qt.DEFAULT_ORDER="XYZ";var cr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},yu=0,ch=new w,on=new jt,ti=new be,Hr=new w,Jn=new w,xu=new w,Mu=new jt,uh=new w(1,0,0),dh=new w(0,1,0),ph=new w(0,0,1),bu={type:"added"},Su={type:"removed"},wa={type:"childadded",child:null},Ea={type:"childremoved",child:null},rt=class r extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=li(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new w,t=new qt,i=new jt,n=new w(1,1,1);t._onChange(function(){i.setFromEuler(t,!1)}),i._onChange(function(){t.setFromQuaternion(i,void 0,!1)}),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new be},normalMatrix:{value:new Ee}}),this.matrix=new be,this.matrixWorld=new be,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return on.setFromAxisAngle(e,t),this.quaternion.multiply(on),this}rotateOnWorldAxis(e,t){return on.setFromAxisAngle(e,t),this.quaternion.premultiply(on),this}rotateX(e){return this.rotateOnAxis(uh,e)}rotateY(e){return this.rotateOnAxis(dh,e)}rotateZ(e){return this.rotateOnAxis(ph,e)}translateOnAxis(e,t){return ch.copy(e).applyQuaternion(this.quaternion),this.position.add(ch.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(uh,e)}translateY(e){return this.translateOnAxis(dh,e)}translateZ(e){return this.translateOnAxis(ph,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ti.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Hr.copy(e):Hr.set(e,t,i);let n=this.parent;this.updateWorldMatrix(!0,!1),Jn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ti.lookAt(Jn,Hr,this.up):ti.lookAt(Hr,Jn,this.up),this.quaternion.setFromRotationMatrix(ti),n&&(ti.extractRotation(n.matrixWorld),on.setFromRotationMatrix(ti),this.quaternion.premultiply(on.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(bu),wa.child=e,this.dispatchEvent(wa),wa.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Su),Ea.child=e,this.dispatchEvent(Ea),Ea.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ti.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ti.multiply(e.parent.matrixWorld)),e.applyMatrix4(ti),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){let s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jn,e,xu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jn,Mu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,n=t.length;i<n;i++){let s=t[i];s.matrixWorldAutoUpdate!==!0&&e!==!0||s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let n=this.children;for(let s=0,a=n.length;s<a;s++){let o=n[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let n={};function s(o,h){return o[h.uuid]===void 0&&(o[h.uuid]=h.toJSON(e)),h.uuid}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxGeometryCount=this._maxGeometryCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let h=o.shapes;if(Array.isArray(h))for(let l=0,c=h.length;l<c;l++){let u=h[l];s(e.shapes,u)}else s(e.shapes,h)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let h=0,l=this.material.length;h<l;h++)o.push(s(e.materials,this.material[h]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let h=this.animations[o];n.animations.push(s(e.animations,h))}}if(t){let o=a(e.geometries),h=a(e.materials),l=a(e.textures),c=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),h.length>0&&(i.materials=h),l.length>0&&(i.textures=l),c.length>0&&(i.images=c),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){let h=[];for(let l in o){let c=o[l];delete c.metadata,h.push(c)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let n=e.children[i];this.add(n.clone())}return this}};rt.DEFAULT_UP=new w(0,1,0),rt.DEFAULT_MATRIX_AUTO_UPDATE=!0,rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ft=new w,ii=new w,Ta=new w,ni=new w,ln=new w,hn=new w,mh=new w,Aa=new w,Ra=new w,Ca=new w,xi=class r{constructor(e=new w,t=new w,i=new w){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),Ft.subVectors(e,t),n.cross(Ft);let s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){Ft.subVectors(n,t),ii.subVectors(i,t),Ta.subVectors(e,t);let a=Ft.dot(Ft),o=Ft.dot(ii),h=Ft.dot(Ta),l=ii.dot(ii),c=ii.dot(Ta),u=a*l-o*o;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(l*h-o*c)*d,m=(a*c-o*h)*d;return s.set(1-p-m,m,p)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,ni)!==null&&ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,t,i,n,s,a,o,h){return this.getBarycoord(e,t,i,n,ni)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(s,ni.x),h.addScaledVector(a,ni.y),h.addScaledVector(o,ni.z),h)}static isFrontFacing(e,t,i,n){return Ft.subVectors(i,t),ii.subVectors(e,t),Ft.cross(ii).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ft.subVectors(this.c,this.b),ii.subVectors(this.a,this.b),.5*Ft.cross(ii).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,s){return r.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,n=this.b,s=this.c,a,o;ln.subVectors(n,i),hn.subVectors(s,i),Aa.subVectors(e,i);let h=ln.dot(Aa),l=hn.dot(Aa);if(h<=0&&l<=0)return t.copy(i);Ra.subVectors(e,n);let c=ln.dot(Ra),u=hn.dot(Ra);if(c>=0&&u<=c)return t.copy(n);let d=h*u-c*l;if(d<=0&&h>=0&&c<=0)return a=h/(h-c),t.copy(i).addScaledVector(ln,a);Ca.subVectors(e,s);let p=ln.dot(Ca),m=hn.dot(Ca);if(m>=0&&p<=m)return t.copy(s);let y=p*l-h*m;if(y<=0&&l>=0&&m<=0)return o=l/(l-m),t.copy(i).addScaledVector(hn,o);let g=c*m-p*u;if(g<=0&&u-c>=0&&p-m>=0)return mh.subVectors(s,n),o=(u-c)/(u-c+(p-m)),t.copy(n).addScaledVector(mh,o);let f=1/(g+y+d);return a=y*f,o=d*f,t.copy(i).addScaledVector(ln,a).addScaledVector(hn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ec={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vi={h:0,s:0,l:0},Gr={h:0,s:0,l:0};function Pa(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}var Se=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Fe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,n=Fe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Fe.toWorkingColorSpace(this,n),this}setHSL(e,t,i,n=Fe.workingColorSpace){if(e=uu(e,1),t=at(t,0,1),i=at(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Pa(a,s,e+1/3),this.g=Pa(a,s,e),this.b=Pa(a,s,e-1/3)}return Fe.toWorkingColorSpace(this,n),this}setStyle(e,t=yt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=yt){let i=Ec[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=En(e.r),this.g=En(e.g),this.b=En(e.b),this}copyLinearToSRGB(e){return this.r=ga(e.r),this.g=ga(e.g),this.b=ga(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=yt){return Fe.fromWorkingColorSpace(dt.copy(this),e),65536*Math.round(at(255*dt.r,0,255))+256*Math.round(at(255*dt.g,0,255))+Math.round(at(255*dt.b,0,255))}getHexString(e=yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Fe.workingColorSpace){Fe.fromWorkingColorSpace(dt.copy(this),t);let i=dt.r,n=dt.g,s=dt.b,a=Math.max(i,n,s),o=Math.min(i,n,s),h,l,c=(o+a)/2;if(o===a)h=0,l=0;else{let u=a-o;switch(l=c<=.5?u/(a+o):u/(2-a-o),a){case i:h=(n-s)/u+(n<s?6:0);break;case n:h=(s-i)/u+2;break;case s:h=(i-n)/u+4}h/=6}return e.h=h,e.s=l,e.l=c,e}getRGB(e,t=Fe.workingColorSpace){return Fe.fromWorkingColorSpace(dt.copy(this),t),e.r=dt.r,e.g=dt.g,e.b=dt.b,e}getStyle(e=yt){Fe.fromWorkingColorSpace(dt.copy(this),e);let t=dt.r,i=dt.g,n=dt.b;return e!==yt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*i)},${Math.round(255*n)})`}offsetHSL(e,t,i){return this.getHSL(vi),this.setHSL(vi.h+e,vi.s+t,vi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(vi),e.getHSL(Gr);let i=ma(vi.h,Gr.h,t),n=ma(vi.s,Gr.s,t),s=ma(vi.l,Gr.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},dt=new Se;Se.NAMES=Ec;var wu=0,Yt=class extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=li(),this.name="",this.type="Material",this.blending=1,this.side=Si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ya,this.blendDst=Za,this.blendEquation=Gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Se(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=en,this.stencilZFail=en,this.stencilZPass=en,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let n=this[t];n!==void 0?n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function n(s){let a=[];for(let o in s){let h=s[o];delete h.metadata,a.push(h)}return a}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==Si&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ya&&(i.blendSrc=this.blendSrc),this.blendDst!==Za&&(i.blendDst=this.blendDst),this.blendEquation!==Gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==en&&(i.stencilFail=this.stencilFail),this.stencilZFail!==en&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==en&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData),t){let s=n(e.textures),a=n(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ln=class extends Yt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qt,this.combine=dc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Np=Eu();function Eu(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),i=new Uint32Array(512),n=new Uint32Array(512);for(let h=0;h<256;++h){let l=h-127;l<-27?(i[h]=0,i[256|h]=32768,n[h]=24,n[256|h]=24):l<-14?(i[h]=1024>>-l-14,i[256|h]=1024>>-l-14|32768,n[h]=-l-1,n[256|h]=-l-1):l<=15?(i[h]=l+15<<10,i[256|h]=l+15<<10|32768,n[h]=13,n[256|h]=13):l<128?(i[h]=31744,i[256|h]=64512,n[h]=24,n[256|h]=24):(i[h]=31744,i[256|h]=64512,n[h]=13,n[256|h]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let h=1;h<1024;++h){let l=h<<13,c=0;for(;(8388608&l)==0;)l<<=1,c-=8388608;l&=-8388609,c+=947912704,s[h]=l|c}for(let h=1024;h<2048;++h)s[h]=939524096+(h-1024<<13);for(let h=1;h<31;++h)a[h]=h<<23;a[31]=1199570944,a[32]=2147483648;for(let h=33;h<63;++h)a[h]=2147483648+(h-32<<23);a[63]=3347054592;for(let h=1;h<64;++h)h!==32&&(o[h]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:n,mantissaTable:s,exponentTable:a,offsetTable:o}}var Ze=new w,Vr=new ie,ot=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=eo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Wt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return wc("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Vr.fromBufferAttribute(this,t),Vr.applyMatrix3(e),this.setXY(t,Vr.x,Vr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ze.fromBufferAttribute(this,t),Ze.applyMatrix3(e),this.setXYZ(t,Ze.x,Ze.y,Ze.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ze.fromBufferAttribute(this,t),Ze.applyMatrix4(e),this.setXYZ(t,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ze.fromBufferAttribute(this,t),Ze.applyNormalMatrix(e),this.setXYZ(t,Ze.x,Ze.y,Ze.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ze.fromBufferAttribute(this,t),Ze.transformDirection(e),this.setXYZ(t,Ze.x,Ze.y,Ze.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Xt(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Oe(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Oe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Oe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Oe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Oe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Oe(t,this.array),i=Oe(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Oe(t,this.array),i=Oe(i,this.array),n=Oe(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=Oe(t,this.array),i=Oe(i,this.array),n=Oe(n,this.array),s=Oe(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==eo&&(e.usage=this.usage),e}};var ws=class extends ot{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Es=class extends ot{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var _e=class extends ot{constructor(e,t,i){super(new Float32Array(e),t,i)}},Tu=0,At=new be,La=new rt,cn=new w,St=new Mt,Kn=new Mt,tt=new w,ze=class r extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tu++}),this.uuid=li(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sc(e)?Es:ws)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Ee().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return At.makeRotationFromQuaternion(e),this.applyMatrix4(At),this}rotateX(e){return At.makeRotationX(e),this.applyMatrix4(At),this}rotateY(e){return At.makeRotationY(e),this.applyMatrix4(At),this}rotateZ(e){return At.makeRotationZ(e),this.applyMatrix4(At),this}translate(e,t,i){return At.makeTranslation(e,t,i),this.applyMatrix4(At),this}scale(e,t,i){return At.makeScale(e,t,i),this.applyMatrix4(At),this}lookAt(e){return La.lookAt(e),La.updateMatrix(),this.applyMatrix4(La.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cn).negate(),this.translate(cn.x,cn.y,cn.z),this}setFromPoints(e){let t=[];for(let i=0,n=e.length;i<n;i++){let s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new _e(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){let s=t[i];St.setFromBufferAttribute(s),this.morphTargetsRelative?(tt.addVectors(this.boundingBox.min,St.min),this.boundingBox.expandByPoint(tt),tt.addVectors(this.boundingBox.max,St.max),this.boundingBox.expandByPoint(tt)):(this.boundingBox.expandByPoint(St.min),this.boundingBox.expandByPoint(St.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new w,1/0);if(e){let i=this.boundingSphere.center;if(St.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];Kn.setFromBufferAttribute(o),this.morphTargetsRelative?(tt.addVectors(St.min,Kn.min),St.expandByPoint(tt),tt.addVectors(St.max,Kn.max),St.expandByPoint(tt)):(St.expandByPoint(Kn.min),St.expandByPoint(Kn.max))}St.getCenter(i);let n=0;for(let s=0,a=e.count;s<a;s++)tt.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(tt));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],h=this.morphTargetsRelative;for(let l=0,c=o.count;l<c;l++)tt.fromBufferAttribute(o,l),h&&(cn.fromBufferAttribute(e,l),tt.add(cn)),n=Math.max(n,i.distanceToSquared(tt))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let i=t.position,n=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ot(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],h=[];for(let I=0;I<i.count;I++)o[I]=new w,h[I]=new w;let l=new w,c=new w,u=new w,d=new ie,p=new ie,m=new ie,y=new w,g=new w;function f(I,D,z){l.fromBufferAttribute(i,I),c.fromBufferAttribute(i,D),u.fromBufferAttribute(i,z),d.fromBufferAttribute(s,I),p.fromBufferAttribute(s,D),m.fromBufferAttribute(s,z),c.sub(l),u.sub(l),p.sub(d),m.sub(d);let q=1/(p.x*m.y-m.x*p.y);isFinite(q)&&(y.copy(c).multiplyScalar(m.y).addScaledVector(u,-p.y).multiplyScalar(q),g.copy(u).multiplyScalar(p.x).addScaledVector(c,-m.x).multiplyScalar(q),o[I].add(y),o[D].add(y),o[z].add(y),h[I].add(g),h[D].add(g),h[z].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let I=0,D=_.length;I<D;++I){let z=_[I],q=z.start;for(let P=q,H=q+z.count;P<H;P+=3)f(e.getX(P+0),e.getX(P+1),e.getX(P+2))}let v=new w,x=new w,R=new w,T=new w;function S(I){R.fromBufferAttribute(n,I),T.copy(R);let D=o[I];v.copy(D),v.sub(R.multiplyScalar(R.dot(D))).normalize(),x.crossVectors(T,D);let z=x.dot(h[I])<0?-1:1;a.setXYZW(I,v.x,v.y,v.z,z)}for(let I=0,D=_.length;I<D;++I){let z=_[I],q=z.start;for(let P=q,H=q+z.count;P<H;P+=3)S(e.getX(P+0)),S(e.getX(P+1)),S(e.getX(P+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ot(new Float32Array(3*t.count),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let n=new w,s=new w,a=new w,o=new w,h=new w,l=new w,c=new w,u=new w;if(e)for(let d=0,p=e.count;d<p;d+=3){let m=e.getX(d+0),y=e.getX(d+1),g=e.getX(d+2);n.fromBufferAttribute(t,m),s.fromBufferAttribute(t,y),a.fromBufferAttribute(t,g),c.subVectors(a,s),u.subVectors(n,s),c.cross(u),o.fromBufferAttribute(i,m),h.fromBufferAttribute(i,y),l.fromBufferAttribute(i,g),o.add(c),h.add(c),l.add(c),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(y,h.x,h.y,h.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,p=t.count;d<p;d+=3)n.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),c.subVectors(a,s),u.subVectors(n,s),c.cross(u),i.setXYZ(d+0,c.x,c.y,c.z),i.setXYZ(d+1,c.x,c.y,c.z),i.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)tt.fromBufferAttribute(e,t),tt.normalize(),e.setXYZ(t,tt.x,tt.y,tt.z)}toNonIndexed(){function e(o,h){let l=o.array,c=o.itemSize,u=o.normalized,d=new l.constructor(h.length*c),p=0,m=0;for(let y=0,g=h.length;y<g;y++){p=o.isInterleavedBufferAttribute?h[y]*o.data.stride+o.offset:h[y]*c;for(let f=0;f<c;f++)d[m++]=l[p++]}return new ot(d,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,i=this.index.array,n=this.attributes;for(let o in n){let h=e(n[o],i);t.setAttribute(o,h)}let s=this.morphAttributes;for(let o in s){let h=[],l=s[o];for(let c=0,u=l.length;c<u;c++){let d=e(l[c],i);h.push(d)}t.morphAttributes[o]=h}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,h=a.length;o<h;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let h=this.parameters;for(let l in h)h[l]!==void 0&&(e[l]=h[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let h in i){let l=i[h];e.data.attributes[h]=l.toJSON(e.data)}let n={},s=!1;for(let h in this.morphAttributes){let l=this.morphAttributes[h],c=[];for(let u=0,d=l.length;u<d;u++){let p=l[u];c.push(p.toJSON(e.data))}c.length>0&&(n[h]=c,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let n=e.attributes;for(let l in n){let c=n[l];this.setAttribute(l,c.clone(t))}let s=e.morphAttributes;for(let l in s){let c=[],u=s[l];for(let d=0,p=u.length;d<p;d++)c.push(u[d].clone(t));this.morphAttributes[l]=c}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,c=a.length;l<c;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},fh=new be,Fi=new Yi,Wr=new kt,gh=new w,un=new w,dn=new w,pn=new w,Ia=new w,Xr=new w,jr=new ie,qr=new ie,Yr=new ie,vh=new w,_h=new w,yh=new w,Zr=new w,Jr=new w,nt=class extends rt{constructor(e=new ze,t=new Ln){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}getVertexPosition(e,t){let i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);let o=this.morphTargetInfluences;if(s&&o){Xr.set(0,0,0);for(let h=0,l=s.length;h<l;h++){let c=o[h],u=s[h];c!==0&&(Ia.fromBufferAttribute(u,e),a?Xr.addScaledVector(Ia,c):Xr.addScaledVector(Ia.sub(t),c))}t.add(Xr)}return t}raycast(e,t){let i=this.geometry,n=this.material,s=this.matrixWorld;if(n!==void 0){if(i.boundingSphere===null&&i.computeBoundingSphere(),Wr.copy(i.boundingSphere),Wr.applyMatrix4(s),Fi.copy(e.ray).recast(e.near),Wr.containsPoint(Fi.origin)===!1&&(Fi.intersectSphere(Wr,gh)===null||Fi.origin.distanceToSquared(gh)>(e.far-e.near)**2))return;fh.copy(s).invert(),Fi.copy(e.ray).applyMatrix4(fh),i.boundingBox!==null&&Fi.intersectsBox(i.boundingBox)===!1||this._computeIntersections(e,t,Fi)}}_computeIntersections(e,t,i){let n,s=this.geometry,a=this.material,o=s.index,h=s.attributes.position,l=s.attributes.uv,c=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,y=d.length;m<y;m++){let g=d[m],f=a[g.materialIndex];for(let _=Math.max(g.start,p.start),v=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));_<v;_+=3)n=Kr(this,f,e,i,l,c,u,o.getX(_),o.getX(_+1),o.getX(_+2)),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=g.materialIndex,t.push(n))}else for(let m=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);m<y;m+=3)n=Kr(this,a,e,i,l,c,u,o.getX(m),o.getX(m+1),o.getX(m+2)),n&&(n.faceIndex=Math.floor(m/3),t.push(n));else if(h!==void 0)if(Array.isArray(a))for(let m=0,y=d.length;m<y;m++){let g=d[m],f=a[g.materialIndex];for(let _=Math.max(g.start,p.start),v=Math.min(h.count,Math.min(g.start+g.count,p.start+p.count));_<v;_+=3)n=Kr(this,f,e,i,l,c,u,_,_+1,_+2),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=g.materialIndex,t.push(n))}else for(let m=Math.max(0,p.start),y=Math.min(h.count,p.start+p.count);m<y;m+=3)n=Kr(this,a,e,i,l,c,u,m,m+1,m+2),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}};function Kr(r,e,t,i,n,s,a,o,h,l){r.getVertexPosition(o,un),r.getVertexPosition(h,dn),r.getVertexPosition(l,pn);let c=function(u,d,p,m,y,g,f,_){let v;if(v=d.side===xt?m.intersectTriangle(f,g,y,!0,_):m.intersectTriangle(y,g,f,d.side===Si,_),v===null)return null;Jr.copy(_),Jr.applyMatrix4(u.matrixWorld);let x=p.ray.origin.distanceTo(Jr);return x<p.near||x>p.far?null:{distance:x,point:Jr.clone(),object:u}}(r,e,t,i,un,dn,pn,Zr);if(c){n&&(jr.fromBufferAttribute(n,o),qr.fromBufferAttribute(n,h),Yr.fromBufferAttribute(n,l),c.uv=xi.getInterpolation(Zr,un,dn,pn,jr,qr,Yr,new ie)),s&&(jr.fromBufferAttribute(s,o),qr.fromBufferAttribute(s,h),Yr.fromBufferAttribute(s,l),c.uv1=xi.getInterpolation(Zr,un,dn,pn,jr,qr,Yr,new ie)),a&&(vh.fromBufferAttribute(a,o),_h.fromBufferAttribute(a,h),yh.fromBufferAttribute(a,l),c.normal=xi.getInterpolation(Zr,un,dn,pn,vh,_h,yh,new w),c.normal.dot(i.direction)>0&&c.normal.multiplyScalar(-1));let u={a:o,b:h,c:l,normal:new w,materialIndex:0};xi.getNormal(un,dn,pn,u.normal),c.face=u}return c}var ci=class r extends ze{constructor(e=1,t=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};let o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);let h=[],l=[],c=[],u=[],d=0,p=0;function m(y,g,f,_,v,x,R,T,S,I,D){let z=x/S,q=R/I,P=x/2,H=R/2,J=T/2,re=S+1,he=I+1,K=0,W=0,$=new w;for(let oe=0;oe<he;oe++){let j=oe*q-H;for(let ee=0;ee<re;ee++){let ge=ee*z-P;$[y]=ge*_,$[g]=j*v,$[f]=J,l.push($.x,$.y,$.z),$[y]=0,$[g]=0,$[f]=T>0?1:-1,c.push($.x,$.y,$.z),u.push(ee/S),u.push(1-oe/I),K+=1}}for(let oe=0;oe<I;oe++)for(let j=0;j<S;j++){let ee=d+j+re*oe,ge=d+j+re*(oe+1),ae=d+(j+1)+re*(oe+1),A=d+(j+1)+re*oe;h.push(ee,ge,A),h.push(ge,ae,A),W+=6}o.addGroup(p,W,D),p+=W,d+=K}m("z","y","x",-1,-1,i,t,e,a,s,0),m("z","y","x",1,-1,i,t,-e,a,s,1),m("x","z","y",1,1,e,i,t,n,a,2),m("x","z","y",1,-1,e,i,-t,n,a,3),m("x","y","z",1,-1,e,t,i,n,s,4),m("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(h),this.setAttribute("position",new _e(l,3)),this.setAttribute("normal",new _e(c,3)),this.setAttribute("uv",new _e(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function In(r){let e={};for(let t in r){e[t]={};for(let i in r[t]){let n=r[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function mt(r){let e={};for(let t=0;t<r.length;t++){let i=In(r[t]);for(let n in i)e[n]=i[n]}return e}function Tc(r){return r.getRenderTarget()===null?r.outputColorSpace:Fe.workingColorSpace}var Au={clone:In,merge:mt},Zt=class extends Yt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=In(e.uniforms),this.uniformsGroups=function(t){let i=[];for(let n=0;n<t.length;n++)i.push(t[n].clone());return i}(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let s=this.uniforms[n].value;s&&s.isTexture?t.uniforms[n]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[n]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[n]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[n]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[n]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[n]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[n]={type:"m4",value:s.toArray()}:t.uniforms[n]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},ur=class extends rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new be,this.projectionMatrix=new be,this.projectionMatrixInverse=new be,this.coordinateSystem=Pn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},_i=new w,xh=new ie,Mh=new ie,ft=class extends ur{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*to*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*fs*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*to*Math.atan(Math.tan(.5*fs*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){_i.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(_i.x,_i.y).multiplyScalar(-e/_i.z),_i.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(_i.x,_i.y).multiplyScalar(-e/_i.z)}getViewSize(e,t){return this.getViewBounds(e,xh,Mh),t.subVectors(Mh,xh)}setViewOffset(e,t,i,n,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*fs*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n,a=this.view;if(this.view!==null&&this.view.enabled){let h=a.fullWidth,l=a.fullHeight;s+=a.offsetX*n/h,t-=a.offsetY*i/l,n*=a.width/h,i*=a.height/l}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},mn=-90,so=class extends rt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new ft(mn,1,e,t);n.layers=this.layers,this.add(n);let s=new ft(mn,1,e,t);s.layers=this.layers,this.add(s);let a=new ft(mn,1,e,t);a.layers=this.layers,this.add(a);let o=new ft(mn,1,e,t);o.layers=this.layers,this.add(o);let h=new ft(mn,1,e,t);h.layers=this.layers,this.add(h);let l=new ft(mn,1,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,n,s,a,o,h]=t;for(let l of t)this.remove(l);if(e===Pn)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else{if(e!==Ms)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1)}for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,h,l,c]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,s),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,h),e.setRenderTarget(i,4,n),e.render(t,l),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,n),e.render(t,c),e.setRenderTarget(u,d,p),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Ts=class extends gt{constructor(e,t,i,n,s,a,o,h,l,c){super(e=e!==void 0?e:[],t=t!==void 0?t:An,i,n,s,a,o,h,l,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ao=class extends hi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new Ts(n,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:_t}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new ci(5,5,5),s=new Zt({name:"CubemapFromEquirect",uniforms:In(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:xt,blending:0});s.uniforms.tEquirect.value=t;let a=new nt(n,s),o=t.minFilter;return t.minFilter===Sn&&(t.minFilter=_t),new so(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,n){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(s)}},Ua=new w,Ru=new w,Cu=new Ee,Rt=class{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let n=Ua.subVectors(i,t).cross(Ru.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Ua),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Cu.getNormalMatrix(e),n=this.coplanarPoint(Ua).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},zi=new kt,$r=new w,Un=class{constructor(e=new Rt,t=new Rt,i=new Rt,n=new Rt,s=new Rt,a=new Rt){this.planes=[e,t,i,n,s,a]}set(e,t,i,n,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3){let i=this.planes,n=e.elements,s=n[0],a=n[1],o=n[2],h=n[3],l=n[4],c=n[5],u=n[6],d=n[7],p=n[8],m=n[9],y=n[10],g=n[11],f=n[12],_=n[13],v=n[14],x=n[15];if(i[0].setComponents(h-s,d-l,g-p,x-f).normalize(),i[1].setComponents(h+s,d+l,g+p,x+f).normalize(),i[2].setComponents(h+a,d+c,g+m,x+_).normalize(),i[3].setComponents(h-a,d-c,g-m,x-_).normalize(),i[4].setComponents(h-o,d-u,g-y,x-v).normalize(),t===Pn)i[5].setComponents(h+o,d+u,g+y,x+v).normalize();else{if(t!==Ms)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);i[5].setComponents(o,u,y,v).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zi)}intersectsSprite(e){return zi.center.set(0,0,0),zi.radius=.7071067811865476,zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(zi)}intersectsSphere(e){let t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let n=t[i];if($r.x=n.normal.x>0?e.max.x:e.min.x,$r.y=n.normal.y>0?e.max.y:e.min.y,$r.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint($r)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Ac(){let r=null,e=!1,t=null,i=null;function n(s,a){t(s,a),i=r.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(n),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Pu(r,e){let t=e.isWebGL2,i=new WeakMap;return{get:function(n){return n.isInterleavedBufferAttribute&&(n=n.data),i.get(n)},remove:function(n){n.isInterleavedBufferAttribute&&(n=n.data);let s=i.get(n);s&&(r.deleteBuffer(s.buffer),i.delete(n))},update:function(n,s){if(n.isGLBufferAttribute){let o=i.get(n);return void((!o||o.version<n.version)&&i.set(n,{buffer:n.buffer,type:n.type,bytesPerElement:n.elementSize,version:n.version}))}n.isInterleavedBufferAttribute&&(n=n.data);let a=i.get(n);if(a===void 0)i.set(n,function(o,h){let l=o.array,c=o.usage,u=l.byteLength,d=r.createBuffer(),p;if(r.bindBuffer(h,d),r.bufferData(h,l,c),o.onUploadCallback(),l instanceof Float32Array)p=r.FLOAT;else if(l instanceof Uint16Array)if(o.isFloat16BufferAttribute){if(!t)throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");p=r.HALF_FLOAT}else p=r.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=r.SHORT;else if(l instanceof Uint32Array)p=r.UNSIGNED_INT;else if(l instanceof Int32Array)p=r.INT;else if(l instanceof Int8Array)p=r.BYTE;else if(l instanceof Uint8Array)p=r.UNSIGNED_BYTE;else{if(!(l instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);p=r.UNSIGNED_BYTE}return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}(n,s));else if(a.version<n.version){if(a.size!==n.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(o,h,l){let c=h.array,u=h._updateRange,d=h.updateRanges;if(r.bindBuffer(l,o),u.count===-1&&d.length===0&&r.bufferSubData(l,0,c),d.length!==0){for(let p=0,m=d.length;p<m;p++){let y=d[p];t?r.bufferSubData(l,y.start*c.BYTES_PER_ELEMENT,c,y.start,y.count):r.bufferSubData(l,y.start*c.BYTES_PER_ELEMENT,c.subarray(y.start,y.start+y.count))}h.clearUpdateRanges()}u.count!==-1&&(t?r.bufferSubData(l,u.offset*c.BYTES_PER_ELEMENT,c,u.offset,u.count):r.bufferSubData(l,u.offset*c.BYTES_PER_ELEMENT,c.subarray(u.offset,u.offset+u.count)),u.count=-1),h.onUploadCallback()})(a.buffer,n,s),a.version=n.version}}}}var Ei=class r extends ze{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};let s=e/2,a=t/2,o=Math.floor(i),h=Math.floor(n),l=o+1,c=h+1,u=e/o,d=t/h,p=[],m=[],y=[],g=[];for(let f=0;f<c;f++){let _=f*d-a;for(let v=0;v<l;v++){let x=v*u-s;m.push(x,-_,0),y.push(0,0,1),g.push(v/o),g.push(1-f/h)}}for(let f=0;f<h;f++)for(let _=0;_<o;_++){let v=_+l*f,x=_+l*(f+1),R=_+1+l*(f+1),T=_+1+l*f;p.push(v,x,T),p.push(x,R,T)}this.setIndex(p),this.setAttribute("position",new _e(m,3)),this.setAttribute("normal",new _e(y,3)),this.setAttribute("uv",new _e(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Me={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},le={common:{diffuse:{value:new Se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ee},alphaMap:{value:null},alphaMapTransform:{value:new Ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ee}},envmap:{envMap:{value:null},envMapRotation:{value:new Ee},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ee},normalScale:{value:new ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ee},alphaTest:{value:0},uvTransform:{value:new Ee}},sprite:{diffuse:{value:new Se(16777215)},opacity:{value:1},center:{value:new ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ee},alphaMap:{value:null},alphaMapTransform:{value:new Ee},alphaTest:{value:0}}},Vt={basic:{uniforms:mt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Me.meshbasic_vert,fragmentShader:Me.meshbasic_frag},lambert:{uniforms:mt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Se(0)}}]),vertexShader:Me.meshlambert_vert,fragmentShader:Me.meshlambert_frag},phong:{uniforms:mt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Se(0)},specular:{value:new Se(1118481)},shininess:{value:30}}]),vertexShader:Me.meshphong_vert,fragmentShader:Me.meshphong_frag},standard:{uniforms:mt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Me.meshphysical_vert,fragmentShader:Me.meshphysical_frag},toon:{uniforms:mt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Se(0)}}]),vertexShader:Me.meshtoon_vert,fragmentShader:Me.meshtoon_frag},matcap:{uniforms:mt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Me.meshmatcap_vert,fragmentShader:Me.meshmatcap_frag},points:{uniforms:mt([le.points,le.fog]),vertexShader:Me.points_vert,fragmentShader:Me.points_frag},dashed:{uniforms:mt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Me.linedashed_vert,fragmentShader:Me.linedashed_frag},depth:{uniforms:mt([le.common,le.displacementmap]),vertexShader:Me.depth_vert,fragmentShader:Me.depth_frag},normal:{uniforms:mt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Me.meshnormal_vert,fragmentShader:Me.meshnormal_frag},sprite:{uniforms:mt([le.sprite,le.fog]),vertexShader:Me.sprite_vert,fragmentShader:Me.sprite_frag},background:{uniforms:{uvTransform:{value:new Ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Me.background_vert,fragmentShader:Me.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ee}},vertexShader:Me.backgroundCube_vert,fragmentShader:Me.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Me.cube_vert,fragmentShader:Me.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Me.equirect_vert,fragmentShader:Me.equirect_frag},distanceRGBA:{uniforms:mt([le.common,le.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Me.distanceRGBA_vert,fragmentShader:Me.distanceRGBA_frag},shadow:{uniforms:mt([le.lights,le.fog,{color:{value:new Se(0)},opacity:{value:1}}]),vertexShader:Me.shadow_vert,fragmentShader:Me.shadow_frag}};Vt.physical={uniforms:mt([Vt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ee},clearcoatNormalScale:{value:new ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ee},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ee},sheen:{value:0},sheenColor:{value:new Se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ee},transmissionSamplerSize:{value:new ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ee},attenuationDistance:{value:0},attenuationColor:{value:new Se(0)},specularColor:{value:new Se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ee},anisotropyVector:{value:new ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ee}}]),vertexShader:Me.meshphysical_vert,fragmentShader:Me.meshphysical_frag};var Qr={r:0,b:0,g:0},Bi=new qt,Lu=new be;function Iu(r,e,t,i,n,s,a){let o=new Se(0),h,l,c=s===!0?0:1,u=null,d=0,p=null;function m(y,g){y.getRGB(Qr,Tc(r)),i.buffers.color.setClear(Qr.r,Qr.g,Qr.b,g,a)}return{getClearColor:function(){return o},setClearColor:function(y,g=1){o.set(y),c=g,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,m(o,c)},render:function(y,g){let f=!1,_=g.isScene===!0?g.background:null;_&&_.isTexture&&(_=(g.backgroundBlurriness>0?t:e).get(_)),_===null?m(o,c):_&&_.isColor&&(m(_,1),f=!0);let v=r.xr.getEnvironmentBlendMode();v==="additive"?i.buffers.color.setClear(0,0,0,1,a):v==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||f)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Js)?(l===void 0&&(l=new nt(new ci(1,1,1),new Zt({name:"BackgroundCubeMaterial",uniforms:In(Vt.backgroundCube.uniforms),vertexShader:Vt.backgroundCube.vertexShader,fragmentShader:Vt.backgroundCube.fragmentShader,side:xt,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(x,R,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),Bi.copy(g.backgroundRotation),Bi.x*=-1,Bi.y*=-1,Bi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Bi.y*=-1,Bi.z*=-1),l.material.uniforms.envMap.value=_,l.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Lu.makeRotationFromEuler(Bi)),l.material.toneMapped=Fe.getTransfer(_.colorSpace)!==Be,u===_&&d===_.version&&p===r.toneMapping||(l.material.needsUpdate=!0,u=_,d=_.version,p=r.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):_&&_.isTexture&&(h===void 0&&(h=new nt(new Ei(2,2),new Zt({name:"BackgroundMaterial",uniforms:In(Vt.background.uniforms),vertexShader:Vt.background.vertexShader,fragmentShader:Vt.background.fragmentShader,side:Si,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(h)),h.material.uniforms.t2D.value=_,h.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,h.material.toneMapped=Fe.getTransfer(_.colorSpace)!==Be,_.matrixAutoUpdate===!0&&_.updateMatrix(),h.material.uniforms.uvTransform.value.copy(_.matrix),u===_&&d===_.version&&p===r.toneMapping||(h.material.needsUpdate=!0,u=_,d=_.version,p=r.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null))}}}function Uu(r,e,t,i){let n=r.getParameter(r.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},h=p(null),l=h,c=!1;function u(R){return i.isWebGL2?r.bindVertexArray(R):s.bindVertexArrayOES(R)}function d(R){return i.isWebGL2?r.deleteVertexArray(R):s.deleteVertexArrayOES(R)}function p(R){let T=[],S=[],I=[];for(let D=0;D<n;D++)T[D]=0,S[D]=0,I[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:S,attributeDivisors:I,object:R,attributes:{},index:null}}function m(){let R=l.newAttributes;for(let T=0,S=R.length;T<S;T++)R[T]=0}function y(R){g(R,0)}function g(R,T){let S=l.newAttributes,I=l.enabledAttributes,D=l.attributeDivisors;S[R]=1,I[R]===0&&(r.enableVertexAttribArray(R),I[R]=1),D[R]!==T&&((i.isWebGL2?r:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,T),D[R]=T)}function f(){let R=l.newAttributes,T=l.enabledAttributes;for(let S=0,I=T.length;S<I;S++)T[S]!==R[S]&&(r.disableVertexAttribArray(S),T[S]=0)}function _(R,T,S,I,D,z,q){q===!0?r.vertexAttribIPointer(R,T,S,D,z):r.vertexAttribPointer(R,T,S,I,D,z)}function v(){x(),c=!0,l!==h&&(l=h,u(l.object))}function x(){h.geometry=null,h.program=null,h.wireframe=!1}return{setup:function(R,T,S,I,D){let z=!1;if(a){let q=function(P,H,J){let re=J.wireframe===!0,he=o[P.id];he===void 0&&(he={},o[P.id]=he);let K=he[H.id];K===void 0&&(K={},he[H.id]=K);let W=K[re];return W===void 0&&(W=p(i.isWebGL2?r.createVertexArray():s.createVertexArrayOES()),K[re]=W),W}(I,S,T);l!==q&&(l=q,u(l.object)),z=function(P,H,J,re){let he=l.attributes,K=H.attributes,W=0,$=J.getAttributes();for(let oe in $)if($[oe].location>=0){let j=he[oe],ee=K[oe];if(ee===void 0&&(oe==="instanceMatrix"&&P.instanceMatrix&&(ee=P.instanceMatrix),oe==="instanceColor"&&P.instanceColor&&(ee=P.instanceColor)),j===void 0||j.attribute!==ee||ee&&j.data!==ee.data)return!0;W++}return l.attributesNum!==W||l.index!==re}(R,I,S,D),z&&function(P,H,J,re){let he={},K=H.attributes,W=0,$=J.getAttributes();for(let oe in $)if($[oe].location>=0){let j=K[oe];j===void 0&&(oe==="instanceMatrix"&&P.instanceMatrix&&(j=P.instanceMatrix),oe==="instanceColor"&&P.instanceColor&&(j=P.instanceColor));let ee={};ee.attribute=j,j&&j.data&&(ee.data=j.data),he[oe]=ee,W++}l.attributes=he,l.attributesNum=W,l.index=re}(R,I,S,D)}else{let q=T.wireframe===!0;l.geometry===I.id&&l.program===S.id&&l.wireframe===q||(l.geometry=I.id,l.program=S.id,l.wireframe=q,z=!0)}D!==null&&t.update(D,r.ELEMENT_ARRAY_BUFFER),(z||c)&&(c=!1,function(q,P,H,J){if(i.isWebGL2===!1&&(q.isInstancedMesh||J.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;m();let re=J.attributes,he=H.getAttributes(),K=P.defaultAttributeValues;for(let W in he){let $=he[W];if($.location>=0){let oe=re[W];if(oe===void 0&&(W==="instanceMatrix"&&q.instanceMatrix&&(oe=q.instanceMatrix),W==="instanceColor"&&q.instanceColor&&(oe=q.instanceColor)),oe!==void 0){let j=oe.normalized,ee=oe.itemSize,ge=t.get(oe);if(ge===void 0)continue;let ae=ge.buffer,A=ge.type,M=ge.bytesPerElement,F=i.isWebGL2===!0&&(A===r.INT||A===r.UNSIGNED_INT||oe.gpuType===mc);if(oe.isInterleavedBufferAttribute){let N=oe.data,C=N.stride,L=oe.offset;if(N.isInstancedInterleavedBuffer){for(let B=0;B<$.locationSize;B++)g($.location+B,N.meshPerAttribute);q.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=N.meshPerAttribute*N.count)}else for(let B=0;B<$.locationSize;B++)y($.location+B);r.bindBuffer(r.ARRAY_BUFFER,ae);for(let B=0;B<$.locationSize;B++)_($.location+B,ee/$.locationSize,A,j,C*M,(L+ee/$.locationSize*B)*M,F)}else{if(oe.isInstancedBufferAttribute){for(let N=0;N<$.locationSize;N++)g($.location+N,oe.meshPerAttribute);q.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let N=0;N<$.locationSize;N++)y($.location+N);r.bindBuffer(r.ARRAY_BUFFER,ae);for(let N=0;N<$.locationSize;N++)_($.location+N,ee/$.locationSize,A,j,ee*M,ee/$.locationSize*N*M,F)}}else if(K!==void 0){let j=K[W];if(j!==void 0)switch(j.length){case 2:r.vertexAttrib2fv($.location,j);break;case 3:r.vertexAttrib3fv($.location,j);break;case 4:r.vertexAttrib4fv($.location,j);break;default:r.vertexAttrib1fv($.location,j)}}}}f()}(R,T,S,I),D!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))},reset:v,resetDefaultState:x,dispose:function(){v();for(let R in o){let T=o[R];for(let S in T){let I=T[S];for(let D in I)d(I[D].object),delete I[D];delete T[S]}delete o[R]}},releaseStatesOfGeometry:function(R){if(o[R.id]===void 0)return;let T=o[R.id];for(let S in T){let I=T[S];for(let D in I)d(I[D].object),delete I[D];delete T[S]}delete o[R.id]},releaseStatesOfProgram:function(R){for(let T in o){let S=o[T];if(S[R.id]===void 0)continue;let I=S[R.id];for(let D in I)d(I[D].object),delete I[D];delete S[R.id]}},initAttributes:m,enableAttribute:y,disableUnusedAttributes:f}}function Du(r,e,t,i){let n=i.isWebGL2,s;this.setMode=function(a){s=a},this.render=function(a,o){r.drawArrays(s,a,o),t.update(o,s,1)},this.renderInstances=function(a,o,h){if(h===0)return;let l,c;if(n)l=r,c="drawArraysInstanced";else if(l=e.get("ANGLE_instanced_arrays"),c="drawArraysInstancedANGLE",l===null)return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");l[c](s,a,o,h),t.update(o,s,h)},this.renderMultiDraw=function(a,o,h){if(h===0)return;let l=e.get("WEBGL_multi_draw");if(l===null)for(let c=0;c<h;c++)this.render(a[c],o[c]);else{l.multiDrawArraysWEBGL(s,a,0,o,0,h);let c=0;for(let u=0;u<h;u++)c+=o[u];t.update(c,s,1)}}}function Nu(r,e,t){let i;function n(x){if(x==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";x="mediump"}return x==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let s=typeof WebGL2RenderingContext<"u"&&r.constructor.name==="WebGL2RenderingContext",a=t.precision!==void 0?t.precision:"highp",o=n(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let h=s||e.has("WEBGL_draw_buffers"),l=t.logarithmicDepthBuffer===!0,c=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),u=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),g=r.getParameter(r.MAX_VARYING_VECTORS),f=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),_=u>0,v=s||e.has("OES_texture_float");return{isWebGL2:s,drawBuffers:h,getMaxAnisotropy:function(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let x=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i},getMaxPrecision:n,precision:a,logarithmicDepthBuffer:l,maxTextures:c,maxVertexTextures:u,maxTextureSize:d,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:y,maxVaryings:g,maxFragmentUniforms:f,vertexTextures:_,floatFragmentTextures:v,floatVertexTextures:_&&v,maxSamples:s?r.getParameter(r.MAX_SAMPLES):0}}function Ou(r){let e=this,t=null,i=0,n=!1,s=!1,a=new Rt,o=new Ee,h={value:null,needsUpdate:!1};function l(c,u,d,p){let m=c!==null?c.length:0,y=null;if(m!==0){if(y=h.value,p!==!0||y===null){let g=d+4*m,f=u.matrixWorldInverse;o.getNormalMatrix(f),(y===null||y.length<g)&&(y=new Float32Array(g));for(let _=0,v=d;_!==m;++_,v+=4)a.copy(c[_]).applyMatrix4(f,o),a.normal.toArray(y,v),y[v+3]=a.constant}h.value=y,h.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,y}this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(c,u){let d=c.length!==0||u||i!==0||n;return n=u,i=c.length,d},this.beginShadows=function(){s=!0,l(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(c,u){t=l(c,u,0)},this.setState=function(c,u,d){let p=c.clippingPlanes,m=c.clipIntersection,y=c.clipShadows,g=r.get(c);if(!n||p===null||p.length===0||s&&!y)s?l(null):function(){h.value!==t&&(h.value=t,h.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}();else{let f=s?0:i,_=4*f,v=g.clippingState||null;h.value=v,v=l(p,u,_,d);for(let x=0;x!==_;++x)v[x]=t[x];g.clippingState=v,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=f}}}function Fu(r){let e=new WeakMap;function t(n,s){return s===Ja?n.mapping=An:s===Ka&&(n.mapping=Rn),n}function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping;if(s===Ja||s===Ka){if(e.has(n))return t(e.get(n).texture,n.mapping);{let a=n.image;if(a&&a.height>0){let o=new ao(a.height);return o.fromEquirectangularTexture(r,n),e.set(n,o),n.addEventListener("dispose",i),t(o.texture,n.mapping)}return null}}}return n},dispose:function(){e=new WeakMap}}}var Dn=class extends ur{constructor(e=-1,t=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,s=i-e,a=i+e,o=n+t,h=n-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=c*this.view.offsetY,h=o-c*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,h,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},bh=[.125,.215,.35,.446,.526,.582],$n=20,Da=new Dn,Sh=new Se,Na=null,Oa=0,Fa=0,Hi=(1+Math.sqrt(5))/2,fn=1/Hi,wh=[new w(1,1,1),new w(-1,1,1),new w(1,1,-1),new w(-1,1,-1),new w(0,Hi,fn),new w(0,Hi,-fn),new w(fn,0,Hi),new w(-fn,0,Hi),new w(Hi,fn,0),new w(-Hi,fn,0)],As=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100){Na=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),Fa=this._renderer.getActiveMipmapLevel(),this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,n,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ah(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Th(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Na,Oa,Fa),e.scissorTest=!1,es(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===An||e.mapping===Rn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Na=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),Fa=this._renderer.getActiveMipmapLevel();let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:_t,minFilter:_t,generateMipmaps:!1,type:lr,format:oi,colorSpace:Ti,depthBuffer:!1},n=Eh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Eh(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=function(a){let o=[],h=[],l=[],c=a,u=a-4+1+bh.length;for(let d=0;d<u;d++){let p=Math.pow(2,c);h.push(p);let m=1/p;d>a-4?m=bh[d-a+4-1]:d===0&&(m=0),l.push(m);let y=1/(p-2),g=-y,f=1+y,_=[g,g,f,g,f,f,g,g,f,f,g,f],v=6,x=6,R=3,T=2,S=1,I=new Float32Array(R*x*v),D=new Float32Array(T*x*v),z=new Float32Array(S*x*v);for(let P=0;P<v;P++){let H=P%3*2/3-1,J=P>2?0:-1,re=[H,J,0,H+2/3,J,0,H+2/3,J+1,0,H,J,0,H+2/3,J+1,0,H,J+1,0];I.set(re,R*x*P),D.set(_,T*x*P);let he=[P,P,P,P,P,P];z.set(he,S*x*P)}let q=new ze;q.setAttribute("position",new ot(I,R)),q.setAttribute("uv",new ot(D,T)),q.setAttribute("faceIndex",new ot(z,S)),o.push(q),c>4&&c--}return{lodPlanes:o,sizeLods:h,sigmas:l}}(s)),this._blurMaterial=function(a,o,h){let l=new Float32Array($n),c=new w(0,1,0);return new Zt({name:"SphericalGaussianBlur",defines:{n:$n,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/h,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:l},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:c}},vertexShader:nl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}(s,e,t)}return n}_compileMaterial(e){let t=new nt(this._lodPlanes[0],e);this._renderer.compile(t,Da)}_sceneToCubeUV(e,t,i,n){let s=new ft(90,1,t,i),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],h=this._renderer,l=h.autoClear,c=h.toneMapping;h.getClearColor(Sh),h.toneMapping=Mi,h.autoClear=!1;let u=new Ln({name:"PMREM.Background",side:xt,depthWrite:!1,depthTest:!1}),d=new nt(new ci,u),p=!1,m=e.background;m?m.isColor&&(u.color.copy(m),e.background=null,p=!0):(u.color.copy(Sh),p=!0);for(let y=0;y<6;y++){let g=y%3;g===0?(s.up.set(0,a[y],0),s.lookAt(o[y],0,0)):g===1?(s.up.set(0,0,a[y]),s.lookAt(0,o[y],0)):(s.up.set(0,a[y],0),s.lookAt(0,0,o[y]));let f=this._cubeSize;es(n,g*f,y>2?f:0,f,f),h.setRenderTarget(n),p&&h.render(d,s),h.render(e,s)}d.geometry.dispose(),d.material.dispose(),h.toneMapping=c,h.autoClear=l,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,n=e.mapping===An||e.mapping===Rn;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ah()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Th());let s=n?this._cubemapMaterial:this._equirectMaterial,a=new nt(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;es(t,0,0,3*o,2*o),i.setRenderTarget(t),i.render(a,Da)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let n=1;n<this._lodPlanes.length;n++){let s=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),a=wh[(n-1)%wh.length];this._blur(e,n-1,n,s,a)}t.autoClear=i}_blur(e,t,i,n,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",s),this._halfBlur(a,e,i,i,n,"longitudinal",s)}_halfBlur(e,t,i,n,s,a,o){let h=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let c=new nt(this._lodPlanes[n],l),u=l.uniforms,d=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/39,m=s/p,y=isFinite(s)?1+Math.floor(3*m):$n;y>$n&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${y} samples when the maximum is set to 20`);let g=[],f=0;for(let x=0;x<$n;++x){let R=x/m,T=Math.exp(-R*R/2);g.push(T),x===0?f+=T:x<y&&(f+=2*T)}for(let x=0;x<g.length;x++)g[x]=g[x]/f;u.envMap.value=e.texture,u.samples.value=y,u.weights.value=g,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=p,u.mipInt.value=_-i;let v=this._sizeLods[n];es(t,3*v*(n>_-4?n-_+4:0),4*(this._cubeSize-v),3*v,2*v),h.setRenderTarget(t),h.render(c,Da)}};function Eh(r,e,t){let i=new hi(r,e,t);return i.texture.mapping=Js,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function es(r,e,t,i,n){r.viewport.set(e,t,i,n),r.scissor.set(e,t,i,n)}function Th(){return new Zt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ah(){return new Zt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function nl(){return`

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
	`}function zu(r){let e=new WeakMap,t=null;function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping,a=s===Ja||s===Ka,o=s===An||s===Rn;if(a||o){if(n.isRenderTargetTexture&&n.needsPMREMUpdate===!0){n.needsPMREMUpdate=!1;let h=e.get(n);return t===null&&(t=new As(r)),h=a?t.fromEquirectangular(n,h):t.fromCubemap(n,h),e.set(n,h),h.texture}if(e.has(n))return e.get(n).texture;{let h=n.image;if(a&&h&&h.height>0||o&&h&&function(l){let c=0,u=6;for(let d=0;d<u;d++)l[d]!==void 0&&c++;return c===u}(h)){t===null&&(t=new As(r));let l=a?t.fromEquirectangular(n):t.fromCubemap(n);return e.set(n,l),n.addEventListener("dispose",i),l.texture}return null}}}return n},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function Bu(r){let e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){let n=t(i);return n===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function ku(r,e,t,i){let n={},s=new WeakMap;function a(h){let l=h.target;l.index!==null&&e.remove(l.index);for(let u in l.attributes)e.remove(l.attributes[u]);for(let u in l.morphAttributes){let d=l.morphAttributes[u];for(let p=0,m=d.length;p<m;p++)e.remove(d[p])}l.removeEventListener("dispose",a),delete n[l.id];let c=s.get(l);c&&(e.remove(c),s.delete(l)),i.releaseStatesOfGeometry(l),l.isInstancedBufferGeometry===!0&&delete l._maxInstanceCount,t.memory.geometries--}function o(h){let l=[],c=h.index,u=h.attributes.position,d=0;if(c!==null){let y=c.array;d=c.version;for(let g=0,f=y.length;g<f;g+=3){let _=y[g+0],v=y[g+1],x=y[g+2];l.push(_,v,v,x,x,_)}}else{if(u===void 0)return;{let y=u.array;d=u.version;for(let g=0,f=y.length/3-1;g<f;g+=3){let _=g+0,v=g+1,x=g+2;l.push(_,v,v,x,x,_)}}}let p=new(Sc(l)?Es:ws)(l,1);p.version=d;let m=s.get(h);m&&e.remove(m),s.set(h,p)}return{get:function(h,l){return n[l.id]===!0||(l.addEventListener("dispose",a),n[l.id]=!0,t.memory.geometries++),l},update:function(h){let l=h.attributes;for(let u in l)e.update(l[u],r.ARRAY_BUFFER);let c=h.morphAttributes;for(let u in c){let d=c[u];for(let p=0,m=d.length;p<m;p++)e.update(d[p],r.ARRAY_BUFFER)}},getWireframeAttribute:function(h){let l=s.get(h);if(l){let c=h.index;c!==null&&l.version<c.version&&o(h)}else o(h);return s.get(h)}}}function Hu(r,e,t,i){let n=i.isWebGL2,s,a,o;this.setMode=function(h){s=h},this.setIndex=function(h){a=h.type,o=h.bytesPerElement},this.render=function(h,l){r.drawElements(s,l,a,h*o),t.update(l,s,1)},this.renderInstances=function(h,l,c){if(c===0)return;let u,d;if(n)u=r,d="drawElementsInstanced";else if(u=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",u===null)return void console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");u[d](s,l,a,h*o,c),t.update(l,s,c)},this.renderMultiDraw=function(h,l,c){if(c===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<c;d++)this.render(h[d]/o,l[d]);else{u.multiDrawElementsWEBGL(s,l,0,a,h,0,c);let d=0;for(let p=0;p<c;p++)d+=l[p];t.update(d,s,1)}}}function Gu(r){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,i,n){switch(e.calls++,i){case r.TRIANGLES:e.triangles+=n*(t/3);break;case r.LINES:e.lines+=n*(t/2);break;case r.LINE_STRIP:e.lines+=n*(t-1);break;case r.LINE_LOOP:e.lines+=n*t;break;case r.POINTS:e.points+=n*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",i)}}}}function Vu(r,e){return r[0]-e[0]}function Wu(r,e){return Math.abs(e[1])-Math.abs(r[1])}function Xu(r,e,t){let i={},n=new Float32Array(8),s=new WeakMap,a=new Je,o=[];for(let h=0;h<8;h++)o[h]=[h,0];return{update:function(h,l,c){let u=h.morphTargetInfluences;if(e.isWebGL2===!0){let d=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,p=d!==void 0?d.length:0,m=s.get(l);if(m===void 0||m.count!==p){let q=function(){D.dispose(),s.delete(l),l.removeEventListener("dispose",q)};m!==void 0&&m.texture.dispose();let y=l.morphAttributes.position!==void 0,g=l.morphAttributes.normal!==void 0,f=l.morphAttributes.color!==void 0,_=l.morphAttributes.position||[],v=l.morphAttributes.normal||[],x=l.morphAttributes.color||[],R=0;y===!0&&(R=1),g===!0&&(R=2),f===!0&&(R=3);let T=l.attributes.position.count*R,S=1;T>e.maxTextureSize&&(S=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);let I=new Float32Array(T*S*4*p),D=new Ss(I,T,S,p);D.type=Wt,D.needsUpdate=!0;let z=4*R;for(let P=0;P<p;P++){let H=_[P],J=v[P],re=x[P],he=T*S*4*P;for(let K=0;K<H.count;K++){let W=K*z;y===!0&&(a.fromBufferAttribute(H,K),I[he+W+0]=a.x,I[he+W+1]=a.y,I[he+W+2]=a.z,I[he+W+3]=0),g===!0&&(a.fromBufferAttribute(J,K),I[he+W+4]=a.x,I[he+W+5]=a.y,I[he+W+6]=a.z,I[he+W+7]=0),f===!0&&(a.fromBufferAttribute(re,K),I[he+W+8]=a.x,I[he+W+9]=a.y,I[he+W+10]=a.z,I[he+W+11]=re.itemSize===4?a.w:1)}}m={count:p,texture:D,size:new ie(T,S)},s.set(l,m),l.addEventListener("dispose",q)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)c.getUniforms().setValue(r,"morphTexture",h.morphTexture,t);else{let y=0;for(let f=0;f<u.length;f++)y+=u[f];let g=l.morphTargetsRelative?1:1-y;c.getUniforms().setValue(r,"morphTargetBaseInfluence",g),c.getUniforms().setValue(r,"morphTargetInfluences",u)}c.getUniforms().setValue(r,"morphTargetsTexture",m.texture,t),c.getUniforms().setValue(r,"morphTargetsTextureSize",m.size)}else{let d=u===void 0?0:u.length,p=i[l.id];if(p===void 0||p.length!==d){p=[];for(let _=0;_<d;_++)p[_]=[_,0];i[l.id]=p}for(let _=0;_<d;_++){let v=p[_];v[0]=_,v[1]=u[_]}p.sort(Wu);for(let _=0;_<8;_++)_<d&&p[_][1]?(o[_][0]=p[_][0],o[_][1]=p[_][1]):(o[_][0]=Number.MAX_SAFE_INTEGER,o[_][1]=0);o.sort(Vu);let m=l.morphAttributes.position,y=l.morphAttributes.normal,g=0;for(let _=0;_<8;_++){let v=o[_],x=v[0],R=v[1];x!==Number.MAX_SAFE_INTEGER&&R?(m&&l.getAttribute("morphTarget"+_)!==m[x]&&l.setAttribute("morphTarget"+_,m[x]),y&&l.getAttribute("morphNormal"+_)!==y[x]&&l.setAttribute("morphNormal"+_,y[x]),n[_]=R,g+=R):(m&&l.hasAttribute("morphTarget"+_)===!0&&l.deleteAttribute("morphTarget"+_),y&&l.hasAttribute("morphNormal"+_)===!0&&l.deleteAttribute("morphNormal"+_),n[_]=0)}let f=l.morphTargetsRelative?1:1-g;c.getUniforms().setValue(r,"morphTargetBaseInfluence",f),c.getUniforms().setValue(r,"morphTargetInfluences",n)}}}}function ju(r,e,t,i){let n=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=i.render.frame,h=a.geometry,l=e.get(a,h);if(n.get(l)!==o&&(e.update(l),n.set(l,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),n.get(a)!==o&&(t.update(a.instanceMatrix,r.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,r.ARRAY_BUFFER),n.set(a,o))),a.isSkinnedMesh){let c=a.skeleton;n.get(c)!==o&&(c.update(),n.set(c,o))}return l},dispose:function(){n=new WeakMap}}}var Rs=class extends gt{constructor(e,t,i,n,s,a,o,h,l,c){if((c=c!==void 0?c:qi)!==qi&&c!==Cn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&c===qi&&(i=yi),i===void 0&&c===Cn&&(i=ji),super(null,n,s,a,o,h,c,i,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:it,this.minFilter=h!==void 0?h:it,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Rc=new gt,Cc=new Rs(1,1);Cc.compareFunction=515;var Pc=new Ss,Lc=new ro,Ic=new Ts,Rh=[],Ch=[],Ph=new Float32Array(16),Lh=new Float32Array(9),Ih=new Float32Array(4);function Hn(r,e,t){let i=r[0];if(i<=0||i>0)return r;let n=e*t,s=Rh[n];if(s===void 0&&(s=new Float32Array(n),Rh[n]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Qe(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function et(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function $s(r,e){let t=Ch[e];t===void 0&&(t=new Int32Array(e),Ch[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function qu(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Yu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qe(t,e))return;r.uniform2fv(this.addr,e),et(t,e)}}function Zu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Qe(t,e))return;r.uniform3fv(this.addr,e),et(t,e)}}function Ju(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qe(t,e))return;r.uniform4fv(this.addr,e),et(t,e)}}function Ku(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Qe(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),et(t,e)}else{if(Qe(t,i))return;Ih.set(i),r.uniformMatrix2fv(this.addr,!1,Ih),et(t,i)}}function $u(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Qe(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),et(t,e)}else{if(Qe(t,i))return;Lh.set(i),r.uniformMatrix3fv(this.addr,!1,Lh),et(t,i)}}function Qu(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Qe(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),et(t,e)}else{if(Qe(t,i))return;Ph.set(i),r.uniformMatrix4fv(this.addr,!1,Ph),et(t,i)}}function ed(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function td(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qe(t,e))return;r.uniform2iv(this.addr,e),et(t,e)}}function id(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qe(t,e))return;r.uniform3iv(this.addr,e),et(t,e)}}function nd(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qe(t,e))return;r.uniform4iv(this.addr,e),et(t,e)}}function rd(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function sd(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qe(t,e))return;r.uniform2uiv(this.addr,e),et(t,e)}}function ad(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qe(t,e))return;r.uniform3uiv(this.addr,e),et(t,e)}}function od(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qe(t,e))return;r.uniform4uiv(this.addr,e),et(t,e)}}function ld(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s=this.type===r.SAMPLER_2D_SHADOW?Cc:Rc;t.setTexture2D(e||s,n)}function hd(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||Lc,n)}function cd(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||Ic,n)}function ud(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||Pc,n)}function dd(r,e){r.uniform1fv(this.addr,e)}function pd(r,e){let t=Hn(e,this.size,2);r.uniform2fv(this.addr,t)}function md(r,e){let t=Hn(e,this.size,3);r.uniform3fv(this.addr,t)}function fd(r,e){let t=Hn(e,this.size,4);r.uniform4fv(this.addr,t)}function gd(r,e){let t=Hn(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function vd(r,e){let t=Hn(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function _d(r,e){let t=Hn(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function yd(r,e){r.uniform1iv(this.addr,e)}function xd(r,e){r.uniform2iv(this.addr,e)}function Md(r,e){r.uniform3iv(this.addr,e)}function bd(r,e){r.uniform4iv(this.addr,e)}function Sd(r,e){r.uniform1uiv(this.addr,e)}function wd(r,e){r.uniform2uiv(this.addr,e)}function Ed(r,e){r.uniform3uiv(this.addr,e)}function Td(r,e){r.uniform4uiv(this.addr,e)}function Ad(r,e,t){let i=this.cache,n=e.length,s=$s(t,n);Qe(i,s)||(r.uniform1iv(this.addr,s),et(i,s));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||Rc,s[a])}function Rd(r,e,t){let i=this.cache,n=e.length,s=$s(t,n);Qe(i,s)||(r.uniform1iv(this.addr,s),et(i,s));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||Lc,s[a])}function Cd(r,e,t){let i=this.cache,n=e.length,s=$s(t,n);Qe(i,s)||(r.uniform1iv(this.addr,s),et(i,s));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||Ic,s[a])}function Pd(r,e,t){let i=this.cache,n=e.length,s=$s(t,n);Qe(i,s)||(r.uniform1iv(this.addr,s),et(i,s));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||Pc,s[a])}var oo=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=function(n){switch(n){case 5126:return qu;case 35664:return Yu;case 35665:return Zu;case 35666:return Ju;case 35674:return Ku;case 35675:return $u;case 35676:return Qu;case 5124:case 35670:return ed;case 35667:case 35671:return td;case 35668:case 35672:return id;case 35669:case 35673:return nd;case 5125:return rd;case 36294:return sd;case 36295:return ad;case 36296:return od;case 35678:case 36198:case 36298:case 36306:case 35682:return ld;case 35679:case 36299:case 36307:return hd;case 35680:case 36300:case 36308:case 36293:return cd;case 36289:case 36303:case 36311:case 36292:return ud}}(t.type)}},lo=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=function(n){switch(n){case 5126:return dd;case 35664:return pd;case 35665:return md;case 35666:return fd;case 35674:return gd;case 35675:return vd;case 35676:return _d;case 5124:case 35670:return yd;case 35667:case 35671:return xd;case 35668:case 35672:return Md;case 35669:case 35673:return bd;case 5125:return Sd;case 36294:return wd;case 36295:return Ed;case 36296:return Td;case 35678:case 36198:case 36298:case 36306:case 35682:return Ad;case 35679:case 36299:case 36307:return Rd;case 35680:case 36300:case 36308:case 36293:return Cd;case 36289:case 36303:case 36311:case 36292:return Pd}}(t.type)}},ho=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let n=this.seq;for(let s=0,a=n.length;s!==a;++s){let o=n[s];o.setValue(e,t[o.id],i)}}},za=/(\w+)(\])?(\[|\.)?/g;function Uh(r,e){r.seq.push(e),r.map[e.id]=e}function Ld(r,e,t){let i=r.name,n=i.length;for(za.lastIndex=0;;){let s=za.exec(i),a=za.lastIndex,o=s[1],h=s[2]==="]",l=s[3];if(h&&(o|=0),l===void 0||l==="["&&a+2===n){Uh(t,l===void 0?new oo(o,r,e):new lo(o,r,e));break}{let c=t.map[o];c===void 0&&(c=new ho(o),Uh(t,c)),t=c}}}var Tn=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n);Ld(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,i,n){let s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){let n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,a=t.length;s!==a;++s){let o=t[s],h=i[o.id];h.needsUpdate!==!1&&o.setValue(e,h.value,n)}}static seqWithValue(e,t){let i=[];for(let n=0,s=e.length;n!==s;++n){let a=e[n];a.id in t&&i.push(a)}return i}};function Dh(r,e,t){let i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}var Id=37297,Ud=0;function Nh(r,e,t){let i=r.getShaderParameter(e,r.COMPILE_STATUS),n=r.getShaderInfoLog(e).trim();if(i&&n==="")return"";let s=/ERROR: 0:(\d+)/.exec(n);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+n+`

`+function(o,h){let l=o.split(`
`),c=[],u=Math.max(h-6,0),d=Math.min(h+6,l.length);for(let p=u;p<d;p++){let m=p+1;c.push(`${m===h?">":" "} ${m}: ${l[p]}`)}return c.join(`
`)}(r.getShaderSource(e),a)}return n}function Dd(r,e){let t=function(i){let n=Fe.getPrimaries(Fe.workingColorSpace),s=Fe.getPrimaries(i),a;switch(n===s?a="":n===xs&&s===ys?a="LinearDisplayP3ToLinearSRGB":n===ys&&s===xs&&(a="LinearSRGBToLinearDisplayP3"),i){case Ti:case Ks:return[a,"LinearTransferOETF"];case yt:case il:return[a,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[a,"LinearTransferOETF"]}}(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Nd(r,e){let t;switch(e){case su:t="Linear";break;case au:t="Reinhard";break;case ou:t="OptimizedCineon";break;case el:t="ACESFilmic";break;case hu:t="AgX";break;case cu:t="Neutral";break;case lu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function gn(r){return r!==""}function Oh(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fh(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Od=/^[ \t]*#include +<([\w\d./]+)>/gm;function co(r){return r.replace(Od,zd)}var Fd=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function zd(r,e){let t=Me[e];if(t===void 0){let i=Fd.get(e);if(i===void 0)throw new Error("Can not resolve #include <"+e+">");t=Me[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i)}return co(t)}var Bd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zh(r){return r.replace(Bd,kd)}function kd(r,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function Bh(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}function Hd(r,e,t,i){let n=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,h=function(P){let H="SHADOWMAP_TYPE_BASIC";return P.shadowMapType===uc?H="SHADOWMAP_TYPE_PCF":P.shadowMapType===Qo?H="SHADOWMAP_TYPE_PCF_SOFT":P.shadowMapType===ri&&(H="SHADOWMAP_TYPE_VSM"),H}(t),l=function(P){let H="ENVMAP_TYPE_CUBE";if(P.envMap)switch(P.envMapMode){case An:case Rn:H="ENVMAP_TYPE_CUBE";break;case Js:H="ENVMAP_TYPE_CUBE_UV"}return H}(t),c=function(P){let H="ENVMAP_MODE_REFLECTION";return P.envMap&&P.envMapMode===Rn&&(H="ENVMAP_MODE_REFRACTION"),H}(t),u=function(P){let H="ENVMAP_BLENDING_NONE";if(P.envMap)switch(P.combine){case dc:H="ENVMAP_BLENDING_MULTIPLY";break;case nu:H="ENVMAP_BLENDING_MIX";break;case ru:H="ENVMAP_BLENDING_ADD"}return H}(t),d=function(P){let H=P.envMapCubeUVHeight;if(H===null)return null;let J=Math.log2(H)-2,re=1/H;return{texelWidth:1/(3*Math.max(Math.pow(2,J),112)),texelHeight:re,maxMip:J}}(t),p=t.isWebGL2?"":function(P){return[P.extensionDerivatives||P.envMapCubeUVHeight||P.bumpMap||P.normalMapTangentSpace||P.clearcoatNormalMap||P.flatShading||P.alphaToCoverage||P.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(P.extensionFragDepth||P.logarithmicDepthBuffer)&&P.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",P.extensionDrawBuffers&&P.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(P.extensionShaderTextureLOD||P.envMap||P.transmission)&&P.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(gn).join(`
`)}(t),m=function(P){return[P.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",P.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(gn).join(`
`)}(t),y=function(P){let H=[];for(let J in P){let re=P[J];re!==!1&&H.push("#define "+J+" "+re)}return H.join(`
`)}(s),g=n.createProgram(),f,_,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(gn).join(`
`),f.length>0&&(f+=`
`),_=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(gn).join(`
`),_.length>0&&(_+=`
`)):(f=[Bh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(gn).join(`
`),_=[p,Bh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Mi?"#define TONE_MAPPING":"",t.toneMapping!==Mi?Me.tonemapping_pars_fragment:"",t.toneMapping!==Mi?Nd("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Me.colorspace_pars_fragment,Dd("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(gn).join(`
`)),a=co(a),a=Oh(a,t),a=Fh(a,t),o=co(o),o=Oh(o,t),o=Fh(o,t),a=zh(a),o=zh(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,f=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,_=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===ih?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ih?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);let x=v+f+a,R=v+_+o,T=Dh(n,n.VERTEX_SHADER,x),S=Dh(n,n.FRAGMENT_SHADER,R);function I(P){if(r.debug.checkShaderErrors){let H=n.getProgramInfoLog(g).trim(),J=n.getShaderInfoLog(T).trim(),re=n.getShaderInfoLog(S).trim(),he=!0,K=!0;if(n.getProgramParameter(g,n.LINK_STATUS)===!1)if(he=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,g,T,S);else{let W=Nh(n,T,"vertex"),$=Nh(n,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(g,n.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+W+`
`+$)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):J!==""&&re!==""||(K=!1);K&&(P.diagnostics={runnable:he,programLog:H,vertexShader:{log:J,prefix:f},fragmentShader:{log:re,prefix:_}})}n.deleteShader(T),n.deleteShader(S),D=new Tn(n,g),z=function(H,J){let re={},he=H.getProgramParameter(J,H.ACTIVE_ATTRIBUTES);for(let K=0;K<he;K++){let W=H.getActiveAttrib(J,K),$=W.name,oe=1;W.type===H.FLOAT_MAT2&&(oe=2),W.type===H.FLOAT_MAT3&&(oe=3),W.type===H.FLOAT_MAT4&&(oe=4),re[$]={type:W.type,location:H.getAttribLocation(J,$),locationSize:oe}}return re}(n,g)}let D,z;n.attachShader(g,T),n.attachShader(g,S),t.index0AttributeName!==void 0?n.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(g,0,"position"),n.linkProgram(g),this.getUniforms=function(){return D===void 0&&I(this),D},this.getAttributes=function(){return z===void 0&&I(this),z};let q=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return q===!1&&(q=n.getProgramParameter(g,Id)),q},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ud++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=T,this.fragmentShader=S,this}var Gd=0,uo=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new po(e),t.set(e,i)),i}},po=class{constructor(e){this.id=Gd++,this.code=e,this.usedTimes=0}};function Vd(r,e,t,i,n,s,a){let o=new cr,h=new uo,l=new Set,c=[],u=n.isWebGL2,d=n.logarithmicDepthBuffer,p=n.vertexTextures,m=n.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshStandardNodeMaterial:"physical",MeshBasicNodeMaterial:"basic",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(f){return l.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,_,v,x,R){let T=x.fog,S=R.geometry,I=f.isMeshStandardMaterial?x.environment:null,D=(f.isMeshStandardMaterial?t:e).get(f.envMap||I),z=D&&D.mapping===Js?D.image.height:null,q=y[f.type];f.precision!==null&&(m=n.getMaxPrecision(f.precision),m!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",m,"instead."));let P=S.morphAttributes.position||S.morphAttributes.normal||S.morphAttributes.color,H=P!==void 0?P.length:0,J,re,he,K,W=0;if(S.morphAttributes.position!==void 0&&(W=1),S.morphAttributes.normal!==void 0&&(W=2),S.morphAttributes.color!==void 0&&(W=3),q){let Gn=Vt[q];J=Gn.vertexShader,re=Gn.fragmentShader}else J=f.vertexShader,re=f.fragmentShader,h.update(f),he=h.getVertexShaderID(f),K=h.getFragmentShaderID(f);let $=r.getRenderTarget(),oe=R.isInstancedMesh===!0,j=R.isBatchedMesh===!0,ee=!!f.map,ge=!!f.matcap,ae=!!D,A=!!f.aoMap,M=!!f.lightMap,F=!!f.bumpMap,N=!!f.normalMap,C=!!f.displacementMap,L=!!f.emissiveMap,B=!!f.metalnessMap,G=!!f.roughnessMap,O=f.anisotropy>0,b=f.clearcoat>0,Y=f.iridescence>0,U=f.sheen>0,ne=f.transmission>0,Q=O&&!!f.anisotropyMap,se=b&&!!f.clearcoatMap,me=b&&!!f.clearcoatNormalMap,de=b&&!!f.clearcoatRoughnessMap,fe=Y&&!!f.iridescenceMap,ue=Y&&!!f.iridescenceThicknessMap,Te=U&&!!f.sheenColorMap,we=U&&!!f.sheenRoughnessMap,ke=!!f.specularMap,pe=!!f.specularColorMap,Le=!!f.specularIntensityMap,qe=ne&&!!f.transmissionMap,ye=ne&&!!f.thicknessMap,He=!!f.gradientMap,Ne=!!f.alphaMap,wt=f.alphaTest>0,Kt=!!f.alphaHash,Lt=!!f.extensions,V=Mi;f.toneMapped&&($!==null&&$.isXRRenderTarget!==!0||(V=r.toneMapping));let Ri={isWebGL2:u,shaderID:q,shaderType:f.type,shaderName:f.name,vertexShader:J,fragmentShader:re,defines:f.defines,customVertexShaderID:he,customFragmentShaderID:K,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:m,batching:j,instancing:oe,instancingColor:oe&&R.instanceColor!==null,instancingMorph:oe&&R.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:$===null?r.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Ti,alphaToCoverage:!!f.alphaToCoverage,map:ee,matcap:ge,envMap:ae,envMapMode:ae&&D.mapping,envMapCubeUVHeight:z,aoMap:A,lightMap:M,bumpMap:F,normalMap:N,displacementMap:p&&C,emissiveMap:L,normalMapObjectSpace:N&&f.normalMapType===1,normalMapTangentSpace:N&&f.normalMapType===0,metalnessMap:B,roughnessMap:G,anisotropy:O,anisotropyMap:Q,clearcoat:b,clearcoatMap:se,clearcoatNormalMap:me,clearcoatRoughnessMap:de,iridescence:Y,iridescenceMap:fe,iridescenceThicknessMap:ue,sheen:U,sheenColorMap:Te,sheenRoughnessMap:we,specularMap:ke,specularColorMap:pe,specularIntensityMap:Le,transmission:ne,transmissionMap:qe,thicknessMap:ye,gradientMap:He,opaque:f.transparent===!1&&f.blending===1&&f.alphaToCoverage===!1,alphaMap:Ne,alphaTest:wt,alphaHash:Kt,combine:f.combine,mapUv:ee&&g(f.map.channel),aoMapUv:A&&g(f.aoMap.channel),lightMapUv:M&&g(f.lightMap.channel),bumpMapUv:F&&g(f.bumpMap.channel),normalMapUv:N&&g(f.normalMap.channel),displacementMapUv:C&&g(f.displacementMap.channel),emissiveMapUv:L&&g(f.emissiveMap.channel),metalnessMapUv:B&&g(f.metalnessMap.channel),roughnessMapUv:G&&g(f.roughnessMap.channel),anisotropyMapUv:Q&&g(f.anisotropyMap.channel),clearcoatMapUv:se&&g(f.clearcoatMap.channel),clearcoatNormalMapUv:me&&g(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&g(f.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&g(f.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&g(f.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&g(f.sheenColorMap.channel),sheenRoughnessMapUv:we&&g(f.sheenRoughnessMap.channel),specularMapUv:ke&&g(f.specularMap.channel),specularColorMapUv:pe&&g(f.specularColorMap.channel),specularIntensityMapUv:Le&&g(f.specularIntensityMap.channel),transmissionMapUv:qe&&g(f.transmissionMap.channel),thicknessMapUv:ye&&g(f.thicknessMap.channel),alphaMapUv:Ne&&g(f.alphaMap.channel),vertexTangents:!!S.attributes.tangent&&(N||O),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!S.attributes.color&&S.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!S.attributes.uv&&(ee||Ne),fog:!!T,useFog:f.fog===!0,fogExp2:!!T&&T.isFogExp2,flatShading:f.flatShading===!0,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:R.isSkinnedMesh===!0,morphTargets:S.morphAttributes.position!==void 0,morphNormals:S.morphAttributes.normal!==void 0,morphColors:S.morphAttributes.color!==void 0,morphTargetsCount:H,morphTextureStride:W,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:r.shadowMap.enabled&&v.length>0,shadowMapType:r.shadowMap.type,toneMapping:V,useLegacyLights:r._useLegacyLights,decodeVideoTexture:ee&&f.map.isVideoTexture===!0&&Fe.getTransfer(f.map.colorSpace)===Be,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===2,flipSided:f.side===xt,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionDerivatives:Lt&&f.extensions.derivatives===!0,extensionFragDepth:Lt&&f.extensions.fragDepth===!0,extensionDrawBuffers:Lt&&f.extensions.drawBuffers===!0,extensionShaderTextureLOD:Lt&&f.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Lt&&f.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Lt&&f.extensions.multiDraw===!0&&i.has("WEBGL_multi_draw"),rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return Ri.vertexUv1s=l.has(1),Ri.vertexUv2s=l.has(2),Ri.vertexUv3s=l.has(3),l.clear(),Ri},getProgramCacheKey:function(f){let _=[];if(f.shaderID?_.push(f.shaderID):(_.push(f.customVertexShaderID),_.push(f.customFragmentShaderID)),f.defines!==void 0)for(let v in f.defines)_.push(v),_.push(f.defines[v]);return f.isRawShaderMaterial===!1&&(function(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)}(_,f),function(v,x){o.disableAll(),x.isWebGL2&&o.enable(0),x.supportsVertexTextures&&o.enable(1),x.instancing&&o.enable(2),x.instancingColor&&o.enable(3),x.instancingMorph&&o.enable(4),x.matcap&&o.enable(5),x.envMap&&o.enable(6),x.normalMapObjectSpace&&o.enable(7),x.normalMapTangentSpace&&o.enable(8),x.clearcoat&&o.enable(9),x.iridescence&&o.enable(10),x.alphaTest&&o.enable(11),x.vertexColors&&o.enable(12),x.vertexAlphas&&o.enable(13),x.vertexUv1s&&o.enable(14),x.vertexUv2s&&o.enable(15),x.vertexUv3s&&o.enable(16),x.vertexTangents&&o.enable(17),x.anisotropy&&o.enable(18),x.alphaHash&&o.enable(19),x.batching&&o.enable(20),v.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.skinning&&o.enable(4),x.morphTargets&&o.enable(5),x.morphNormals&&o.enable(6),x.morphColors&&o.enable(7),x.premultipliedAlpha&&o.enable(8),x.shadowMapEnabled&&o.enable(9),x.useLegacyLights&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.alphaToCoverage&&o.enable(20),v.push(o.mask)}(_,f),_.push(r.outputColorSpace)),_.push(f.customProgramCacheKey),_.join()},getUniforms:function(f){let _=y[f.type],v;if(_){let x=Vt[_];v=Au.clone(x.uniforms)}else v=f.uniforms;return v},acquireProgram:function(f,_){let v;for(let x=0,R=c.length;x<R;x++){let T=c[x];if(T.cacheKey===_){v=T,++v.usedTimes;break}}return v===void 0&&(v=new Hd(r,_,f,s),c.push(v)),v},releaseProgram:function(f){if(--f.usedTimes==0){let _=c.indexOf(f);c[_]=c[c.length-1],c.pop(),f.destroy()}},releaseShaderCache:function(f){h.remove(f)},programs:c,dispose:function(){h.dispose()}}}function Wd(){let r=new WeakMap;return{get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,i){r.get(e)[t]=i},dispose:function(){r=new WeakMap}}}function Xd(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function kh(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Hh(){let r=[],e=0,t=[],i=[],n=[];function s(a,o,h,l,c,u){let d=r[e];return d===void 0?(d={id:a.id,object:a,geometry:o,material:h,groupOrder:l,renderOrder:a.renderOrder,z:c,group:u},r[e]=d):(d.id=a.id,d.object=a,d.geometry=o,d.material=h,d.groupOrder=l,d.renderOrder=a.renderOrder,d.z=c,d.group=u),e++,d}return{opaque:t,transmissive:i,transparent:n,init:function(){e=0,t.length=0,i.length=0,n.length=0},push:function(a,o,h,l,c,u){let d=s(a,o,h,l,c,u);h.transmission>0?i.push(d):h.transparent===!0?n.push(d):t.push(d)},unshift:function(a,o,h,l,c,u){let d=s(a,o,h,l,c,u);h.transmission>0?i.unshift(d):h.transparent===!0?n.unshift(d):t.unshift(d)},finish:function(){for(let a=e,o=r.length;a<o;a++){let h=r[a];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}},sort:function(a,o){t.length>1&&t.sort(a||Xd),i.length>1&&i.sort(o||kh),n.length>1&&n.sort(o||kh)}}}function jd(){let r=new WeakMap;return{get:function(e,t){let i=r.get(e),n;return i===void 0?(n=new Hh,r.set(e,[n])):t>=i.length?(n=new Hh,i.push(n)):n=i[t],n},dispose:function(){r=new WeakMap}}}function qd(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new Se};break;case"SpotLight":t={position:new w,direction:new w,color:new Se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new Se,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new Se,groundColor:new Se};break;case"RectAreaLight":t={color:new Se,position:new w,halfWidth:new w,halfHeight:new w}}return r[e.id]=t,t}}}var Yd=0;function Zd(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function Jd(r,e){let t=new qd,i=function(){let h={};return{get:function(l){if(h[l.id]!==void 0)return h[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"PointLight":c={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie,shadowCameraNear:1,shadowCameraFar:1e3}}return h[l.id]=c,c}}}(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new w);let s=new w,a=new be,o=new be;return{setup:function(h,l){let c=0,u=0,d=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let p=0,m=0,y=0,g=0,f=0,_=0,v=0,x=0,R=0,T=0,S=0;h.sort(Zd);let I=l===!0?Math.PI:1;for(let z=0,q=h.length;z<q;z++){let P=h[z],H=P.color,J=P.intensity,re=P.distance,he=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)c+=H.r*J*I,u+=H.g*J*I,d+=H.b*J*I;else if(P.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(P.sh.coefficients[K],J);S++}else if(P.isDirectionalLight){let K=t.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity*I),P.castShadow){let W=P.shadow,$=i.get(P);$.shadowBias=W.bias,$.shadowNormalBias=W.normalBias,$.shadowRadius=W.radius,$.shadowMapSize=W.mapSize,n.directionalShadow[p]=$,n.directionalShadowMap[p]=he,n.directionalShadowMatrix[p]=P.shadow.matrix,_++}n.directional[p]=K,p++}else if(P.isSpotLight){let K=t.get(P);K.position.setFromMatrixPosition(P.matrixWorld),K.color.copy(H).multiplyScalar(J*I),K.distance=re,K.coneCos=Math.cos(P.angle),K.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),K.decay=P.decay,n.spot[y]=K;let W=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,W.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[y]=W.matrix,P.castShadow){let $=i.get(P);$.shadowBias=W.bias,$.shadowNormalBias=W.normalBias,$.shadowRadius=W.radius,$.shadowMapSize=W.mapSize,n.spotShadow[y]=$,n.spotShadowMap[y]=he,x++}y++}else if(P.isRectAreaLight){let K=t.get(P);K.color.copy(H).multiplyScalar(J),K.halfWidth.set(.5*P.width,0,0),K.halfHeight.set(0,.5*P.height,0),n.rectArea[g]=K,g++}else if(P.isPointLight){let K=t.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity*I),K.distance=P.distance,K.decay=P.decay,P.castShadow){let W=P.shadow,$=i.get(P);$.shadowBias=W.bias,$.shadowNormalBias=W.normalBias,$.shadowRadius=W.radius,$.shadowMapSize=W.mapSize,$.shadowCameraNear=W.camera.near,$.shadowCameraFar=W.camera.far,n.pointShadow[m]=$,n.pointShadowMap[m]=he,n.pointShadowMatrix[m]=P.shadow.matrix,v++}n.point[m]=K,m++}else if(P.isHemisphereLight){let K=t.get(P);K.skyColor.copy(P.color).multiplyScalar(J*I),K.groundColor.copy(P.groundColor).multiplyScalar(J*I),n.hemi[f]=K,f++}}g>0&&(e.isWebGL2?r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=le.LTC_FLOAT_1,n.rectAreaLTC2=le.LTC_FLOAT_2):(n.rectAreaLTC1=le.LTC_HALF_1,n.rectAreaLTC2=le.LTC_HALF_2):r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=le.LTC_FLOAT_1,n.rectAreaLTC2=le.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(n.rectAreaLTC1=le.LTC_HALF_1,n.rectAreaLTC2=le.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),n.ambient[0]=c,n.ambient[1]=u,n.ambient[2]=d;let D=n.hash;D.directionalLength===p&&D.pointLength===m&&D.spotLength===y&&D.rectAreaLength===g&&D.hemiLength===f&&D.numDirectionalShadows===_&&D.numPointShadows===v&&D.numSpotShadows===x&&D.numSpotMaps===R&&D.numLightProbes===S||(n.directional.length=p,n.spot.length=y,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+R-T,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=S,D.directionalLength=p,D.pointLength=m,D.spotLength=y,D.rectAreaLength=g,D.hemiLength=f,D.numDirectionalShadows=_,D.numPointShadows=v,D.numSpotShadows=x,D.numSpotMaps=R,D.numLightProbes=S,n.version=Yd++)},setupView:function(h,l){let c=0,u=0,d=0,p=0,m=0,y=l.matrixWorldInverse;for(let g=0,f=h.length;g<f;g++){let _=h[g];if(_.isDirectionalLight){let v=n.directional[c];v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(y),c++}else if(_.isSpotLight){let v=n.spot[d];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(y),v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(y),d++}else if(_.isRectAreaLight){let v=n.rectArea[p];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(y),o.identity(),a.copy(_.matrixWorld),a.premultiply(y),o.extractRotation(a),v.halfWidth.set(.5*_.width,0,0),v.halfHeight.set(0,.5*_.height,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(_.isPointLight){let v=n.point[u];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(y),u++}else if(_.isHemisphereLight){let v=n.hemi[m];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(y),m++}}},state:n}}function Gh(r,e){let t=new Jd(r,e),i=[],n=[];return{init:function(){i.length=0,n.length=0},state:{lightsArray:i,shadowsArray:n,lights:t},setupLights:function(s){t.setup(i,s)},setupLightsView:function(s){t.setupView(i,s)},pushLight:function(s){i.push(s)},pushShadow:function(s){n.push(s)}}}function Kd(r,e){let t=new WeakMap;return{get:function(i,n=0){let s=t.get(i),a;return s===void 0?(a=new Gh(r,e),t.set(i,[a])):n>=s.length?(a=new Gh(r,e),s.push(a)):a=s[n],a},dispose:function(){t=new WeakMap}}}var mo=class extends Yt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},fo=class extends Yt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function $d(r,e,t){let i=new Un,n=new ie,s=new ie,a=new Je,o=new mo({depthPacking:3201}),h=new fo,l={},c=t.maxTextureSize,u={[Si]:xt,[xt]:Si,2:2},d=new Zt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ie},radius:{value:4}},vertexShader:`void main() {
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
}`}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let m=new ze;m.setAttribute("position",new ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new nt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=uc;let f=this.type;function _(T,S){let I=e.update(y);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new hi(n.x,n.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,r.setRenderTarget(T.mapPass),r.clear(),r.renderBufferDirect(S,null,I,d,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,r.setRenderTarget(T.map),r.clear(),r.renderBufferDirect(S,null,I,p,y,null)}function v(T,S,I,D){let z=null,q=I.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(q!==void 0)z=q;else if(z=I.isPointLight===!0?h:o,r.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){let P=z.uuid,H=S.uuid,J=l[P];J===void 0&&(J={},l[P]=J);let re=J[H];re===void 0&&(re=z.clone(),J[H]=re,S.addEventListener("dispose",R)),z=re}return z.visible=S.visible,z.wireframe=S.wireframe,z.side=D===ri?S.shadowSide!==null?S.shadowSide:S.side:S.shadowSide!==null?S.shadowSide:u[S.side],z.alphaMap=S.alphaMap,z.alphaTest=S.alphaTest,z.map=S.map,z.clipShadows=S.clipShadows,z.clippingPlanes=S.clippingPlanes,z.clipIntersection=S.clipIntersection,z.displacementMap=S.displacementMap,z.displacementScale=S.displacementScale,z.displacementBias=S.displacementBias,z.wireframeLinewidth=S.wireframeLinewidth,z.linewidth=S.linewidth,I.isPointLight===!0&&z.isMeshDistanceMaterial===!0&&(r.properties.get(z).light=I),z}function x(T,S,I,D,z){if(T.visible===!1)return;if(T.layers.test(S.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&z===ri)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,T.matrixWorld);let P=e.update(T),H=T.material;if(Array.isArray(H)){let J=P.groups;for(let re=0,he=J.length;re<he;re++){let K=J[re],W=H[K.materialIndex];if(W&&W.visible){let $=v(T,W,D,z);T.onBeforeShadow(r,T,S,I,P,$,K),r.renderBufferDirect(I,null,P,$,T,K),T.onAfterShadow(r,T,S,I,P,$,K)}}}else if(H.visible){let J=v(T,H,D,z);T.onBeforeShadow(r,T,S,I,P,J,null),r.renderBufferDirect(I,null,P,J,T,null),T.onAfterShadow(r,T,S,I,P,J,null)}}let q=T.children;for(let P=0,H=q.length;P<H;P++)x(q[P],S,I,D,z)}function R(T){T.target.removeEventListener("dispose",R);for(let S in l){let I=l[S],D=T.target.uuid;D in I&&(I[D].dispose(),delete I[D])}}this.render=function(T,S,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let D=r.getRenderTarget(),z=r.getActiveCubeFace(),q=r.getActiveMipmapLevel(),P=r.state;P.setBlending(0),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let H=f!==ri&&this.type===ri,J=f===ri&&this.type!==ri;for(let re=0,he=T.length;re<he;re++){let K=T[re],W=K.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;n.copy(W.mapSize);let $=W.getFrameExtents();if(n.multiply($),s.copy(W.mapSize),(n.x>c||n.y>c)&&(n.x>c&&(s.x=Math.floor(c/$.x),n.x=s.x*$.x,W.mapSize.x=s.x),n.y>c&&(s.y=Math.floor(c/$.y),n.y=s.y*$.y,W.mapSize.y=s.y)),W.map===null||H===!0||J===!0){let j=this.type!==ri?{minFilter:it,magFilter:it}:{};W.map!==null&&W.map.dispose(),W.map=new hi(n.x,n.y,j),W.map.texture.name=K.name+".shadowMap",W.camera.updateProjectionMatrix()}r.setRenderTarget(W.map),r.clear();let oe=W.getViewportCount();for(let j=0;j<oe;j++){let ee=W.getViewport(j);a.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),P.viewport(a),W.updateMatrices(K,j),i=W.getFrustum(),x(S,I,W.camera,K,this.type)}W.isPointLightShadow!==!0&&this.type===ri&&_(W,I),W.needsUpdate=!1}f=this.type,g.needsUpdate=!1,r.setRenderTarget(D,z,q)}}function Qd(r,e,t){let i=t.isWebGL2,n=new function(){let b=!1,Y=new Je,U=null,ne=new Je(0,0,0,0);return{setMask:function(Q){U===Q||b||(r.colorMask(Q,Q,Q,Q),U=Q)},setLocked:function(Q){b=Q},setClear:function(Q,se,me,de,fe){fe===!0&&(Q*=de,se*=de,me*=de),Y.set(Q,se,me,de),ne.equals(Y)===!1&&(r.clearColor(Q,se,me,de),ne.copy(Y))},reset:function(){b=!1,U=null,ne.set(-1,0,0,0)}}},s=new function(){let b=!1,Y=null,U=null,ne=null;return{setTest:function(Q){Q?M(r.DEPTH_TEST):F(r.DEPTH_TEST)},setMask:function(Q){Y===Q||b||(r.depthMask(Q),Y=Q)},setFunc:function(Q){if(U!==Q){switch(Q){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:default:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL)}U=Q}},setLocked:function(Q){b=Q},setClear:function(Q){ne!==Q&&(r.clearDepth(Q),ne=Q)},reset:function(){b=!1,Y=null,U=null,ne=null}}},a=new function(){let b=!1,Y=null,U=null,ne=null,Q=null,se=null,me=null,de=null,fe=null;return{setTest:function(ue){b||(ue?M(r.STENCIL_TEST):F(r.STENCIL_TEST))},setMask:function(ue){Y===ue||b||(r.stencilMask(ue),Y=ue)},setFunc:function(ue,Te,we){U===ue&&ne===Te&&Q===we||(r.stencilFunc(ue,Te,we),U=ue,ne=Te,Q=we)},setOp:function(ue,Te,we){se===ue&&me===Te&&de===we||(r.stencilOp(ue,Te,we),se=ue,me=Te,de=we)},setLocked:function(ue){b=ue},setClear:function(ue){fe!==ue&&(r.clearStencil(ue),fe=ue)},reset:function(){b=!1,Y=null,U=null,ne=null,Q=null,se=null,me=null,de=null,fe=null}}},o=new WeakMap,h=new WeakMap,l={},c={},u=new WeakMap,d=[],p=null,m=!1,y=null,g=null,f=null,_=null,v=null,x=null,R=null,T=new Se(0,0,0),S=0,I=!1,D=null,z=null,q=null,P=null,H=null,J=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),re=!1,he=0,K=r.getParameter(r.VERSION);K.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(K)[1]),re=he>=1):K.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),re=he>=2);let W=null,$={},oe=r.getParameter(r.SCISSOR_BOX),j=r.getParameter(r.VIEWPORT),ee=new Je().fromArray(oe),ge=new Je().fromArray(j);function ae(b,Y,U,ne){let Q=new Uint8Array(4),se=r.createTexture();r.bindTexture(b,se),r.texParameteri(b,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(b,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let me=0;me<U;me++)!i||b!==r.TEXTURE_3D&&b!==r.TEXTURE_2D_ARRAY?r.texImage2D(Y+me,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Q):r.texImage3D(Y,0,r.RGBA,1,1,ne,0,r.RGBA,r.UNSIGNED_BYTE,Q);return se}let A={};function M(b){l[b]!==!0&&(r.enable(b),l[b]=!0)}function F(b){l[b]!==!1&&(r.disable(b),l[b]=!1)}A[r.TEXTURE_2D]=ae(r.TEXTURE_2D,r.TEXTURE_2D,1),A[r.TEXTURE_CUBE_MAP]=ae(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(A[r.TEXTURE_2D_ARRAY]=ae(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),A[r.TEXTURE_3D]=ae(r.TEXTURE_3D,r.TEXTURE_3D,1,1)),n.setClear(0,0,0,1),s.setClear(1),a.setClear(0),M(r.DEPTH_TEST),s.setFunc(3),B(!1),G(1),M(r.CULL_FACE),L(0);let N={[Gi]:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};if(i)N[103]=r.MIN,N[104]=r.MAX;else{let b=e.get("EXT_blend_minmax");b!==null&&(N[103]=b.MIN_EXT,N[104]=b.MAX_EXT)}let C={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,[Ya]:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,[Za]:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function L(b,Y,U,ne,Q,se,me,de,fe,ue){if(b!==0){if(m===!1&&(M(r.BLEND),m=!0),b===5)Q=Q||Y,se=se||U,me=me||ne,Y===g&&Q===v||(r.blendEquationSeparate(N[Y],N[Q]),g=Y,v=Q),U===f&&ne===_&&se===x&&me===R||(r.blendFuncSeparate(C[U],C[ne],C[se],C[me]),f=U,_=ne,x=se,R=me),de.equals(T)!==!1&&fe===S||(r.blendColor(de.r,de.g,de.b,fe),T.copy(de),S=fe),y=b,I=!1;else if(b!==y||ue!==I){if(g===Gi&&v===Gi||(r.blendEquation(r.FUNC_ADD),g=Gi,v=Gi),ue)switch(b){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",b)}else switch(b){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",b)}f=null,_=null,x=null,R=null,T.set(0,0,0),S=0,y=b,I=ue}}else m===!0&&(F(r.BLEND),m=!1)}function B(b){D!==b&&(b?r.frontFace(r.CW):r.frontFace(r.CCW),D=b)}function G(b){b!==0?(M(r.CULL_FACE),b!==z&&(b===1?r.cullFace(r.BACK):b===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):F(r.CULL_FACE),z=b}function O(b,Y,U){b?(M(r.POLYGON_OFFSET_FILL),P===Y&&H===U||(r.polygonOffset(Y,U),P=Y,H=U)):F(r.POLYGON_OFFSET_FILL)}return{buffers:{color:n,depth:s,stencil:a},enable:M,disable:F,bindFramebuffer:function(b,Y){return c[b]!==Y&&(r.bindFramebuffer(b,Y),c[b]=Y,i&&(b===r.DRAW_FRAMEBUFFER&&(c[r.FRAMEBUFFER]=Y),b===r.FRAMEBUFFER&&(c[r.DRAW_FRAMEBUFFER]=Y)),!0)},drawBuffers:function(b,Y){let U=d,ne=!1;if(b){U=u.get(Y),U===void 0&&(U=[],u.set(Y,U));let Q=b.textures;if(U.length!==Q.length||U[0]!==r.COLOR_ATTACHMENT0){for(let se=0,me=Q.length;se<me;se++)U[se]=r.COLOR_ATTACHMENT0+se;U.length=Q.length,ne=!0}}else U[0]!==r.BACK&&(U[0]=r.BACK,ne=!0);if(ne)if(t.isWebGL2)r.drawBuffers(U);else{if(e.has("WEBGL_draw_buffers")!==!0)throw new Error("THREE.WebGLState: Usage of gl.drawBuffers() require WebGL2 or WEBGL_draw_buffers extension");e.get("WEBGL_draw_buffers").drawBuffersWEBGL(U)}},useProgram:function(b){return p!==b&&(r.useProgram(b),p=b,!0)},setBlending:L,setMaterial:function(b,Y){b.side===2?F(r.CULL_FACE):M(r.CULL_FACE);let U=b.side===xt;Y&&(U=!U),B(U),b.blending===1&&b.transparent===!1?L(0):L(b.blending,b.blendEquation,b.blendSrc,b.blendDst,b.blendEquationAlpha,b.blendSrcAlpha,b.blendDstAlpha,b.blendColor,b.blendAlpha,b.premultipliedAlpha),s.setFunc(b.depthFunc),s.setTest(b.depthTest),s.setMask(b.depthWrite),n.setMask(b.colorWrite);let ne=b.stencilWrite;a.setTest(ne),ne&&(a.setMask(b.stencilWriteMask),a.setFunc(b.stencilFunc,b.stencilRef,b.stencilFuncMask),a.setOp(b.stencilFail,b.stencilZFail,b.stencilZPass)),O(b.polygonOffset,b.polygonOffsetFactor,b.polygonOffsetUnits),b.alphaToCoverage===!0?M(r.SAMPLE_ALPHA_TO_COVERAGE):F(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:B,setCullFace:G,setLineWidth:function(b){b!==q&&(re&&r.lineWidth(b),q=b)},setPolygonOffset:O,setScissorTest:function(b){b?M(r.SCISSOR_TEST):F(r.SCISSOR_TEST)},activeTexture:function(b){b===void 0&&(b=r.TEXTURE0+J-1),W!==b&&(r.activeTexture(b),W=b)},bindTexture:function(b,Y,U){U===void 0&&(U=W===null?r.TEXTURE0+J-1:W);let ne=$[U];ne===void 0&&(ne={type:void 0,texture:void 0},$[U]=ne),ne.type===b&&ne.texture===Y||(W!==U&&(r.activeTexture(U),W=U),r.bindTexture(b,Y||A[b]),ne.type=b,ne.texture=Y)},unbindTexture:function(){let b=$[W];b!==void 0&&b.type!==void 0&&(r.bindTexture(b.type,null),b.type=void 0,b.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},compressedTexImage3D:function(){try{r.compressedTexImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},texImage2D:function(){try{r.texImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},texImage3D:function(){try{r.texImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},updateUBOMapping:function(b,Y){let U=h.get(Y);U===void 0&&(U=new WeakMap,h.set(Y,U));let ne=U.get(b);ne===void 0&&(ne=r.getUniformBlockIndex(Y,b.name),U.set(b,ne))},uniformBlockBinding:function(b,Y){let U=h.get(Y).get(b);o.get(Y)!==U&&(r.uniformBlockBinding(Y,U,b.__bindingPointIndex),o.set(Y,U))},texStorage2D:function(){try{r.texStorage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},texStorage3D:function(){try{r.texStorage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},texSubImage2D:function(){try{r.texSubImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},texSubImage3D:function(){try{r.texSubImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(b){console.error("THREE.WebGLState:",b)}},scissor:function(b){ee.equals(b)===!1&&(r.scissor(b.x,b.y,b.z,b.w),ee.copy(b))},viewport:function(b){ge.equals(b)===!1&&(r.viewport(b.x,b.y,b.z,b.w),ge.copy(b))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),i===!0&&(r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),l={},W=null,$={},c={},u=new WeakMap,d=[],p=null,m=!1,y=null,g=null,f=null,_=null,v=null,x=null,R=null,T=new Se(0,0,0),S=0,I=!1,D=null,z=null,q=null,P=null,H=null,ee.set(0,0,r.canvas.width,r.canvas.height),ge.set(0,0,r.canvas.width,r.canvas.height),n.reset(),s.reset(),a.reset()}}}function ep(r,e,t,i,n,s,a){let o=n.isWebGL2,h=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new ie,u=new WeakMap,d,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(A,M){return m?new OffscreenCanvas(A,M):hr("canvas")}function g(A,M,F,N){let C=1,L=ae(A);if((L.width>N||L.height>N)&&(C=N/Math.max(L.width,L.height)),C<1||M===!0){if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let B=M?io:Math.floor,G=B(C*L.width),O=B(C*L.height);d===void 0&&(d=y(G,O));let b=F?y(G,O):d;return b.width=G,b.height=O,b.getContext("2d").drawImage(A,0,0,G,O),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+G+"x"+O+")."),b}return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),A}return A}function f(A){let M=ae(A);return nh(M.width)&&nh(M.height)}function _(A,M){return A.generateMipmaps&&M&&A.minFilter!==it&&A.minFilter!==_t}function v(A){r.generateMipmap(A)}function x(A,M,F,N,C=!1){if(o===!1)return M;if(A!==null){if(r[A]!==void 0)return r[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let L=M;if(M===r.RED&&(F===r.FLOAT&&(L=r.R32F),F===r.HALF_FLOAT&&(L=r.R16F),F===r.UNSIGNED_BYTE&&(L=r.R8)),M===r.RED_INTEGER&&(F===r.UNSIGNED_BYTE&&(L=r.R8UI),F===r.UNSIGNED_SHORT&&(L=r.R16UI),F===r.UNSIGNED_INT&&(L=r.R32UI),F===r.BYTE&&(L=r.R8I),F===r.SHORT&&(L=r.R16I),F===r.INT&&(L=r.R32I)),M===r.RG&&(F===r.FLOAT&&(L=r.RG32F),F===r.HALF_FLOAT&&(L=r.RG16F),F===r.UNSIGNED_BYTE&&(L=r.RG8)),M===r.RG_INTEGER&&(F===r.UNSIGNED_BYTE&&(L=r.RG8UI),F===r.UNSIGNED_SHORT&&(L=r.RG16UI),F===r.UNSIGNED_INT&&(L=r.RG32UI),F===r.BYTE&&(L=r.RG8I),F===r.SHORT&&(L=r.RG16I),F===r.INT&&(L=r.RG32I)),M===r.RGBA){let B=C?_s:Fe.getTransfer(N);F===r.FLOAT&&(L=r.RGBA32F),F===r.HALF_FLOAT&&(L=r.RGBA16F),F===r.UNSIGNED_BYTE&&(L=B===Be?r.SRGB8_ALPHA8:r.RGBA8),F===r.UNSIGNED_SHORT_4_4_4_4&&(L=r.RGBA4),F===r.UNSIGNED_SHORT_5_5_5_1&&(L=r.RGB5_A1)}return L!==r.R16F&&L!==r.R32F&&L!==r.RG16F&&L!==r.RG32F&&L!==r.RGBA16F&&L!==r.RGBA32F||e.get("EXT_color_buffer_float"),L}function R(A,M,F){return _(A,F)===!0||A.isFramebufferTexture&&A.minFilter!==it&&A.minFilter!==_t?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function T(A){return A===it||A===Al||A===qn?r.NEAREST:r.LINEAR}function S(A){let M=A.target;M.removeEventListener("dispose",S),function(F){let N=i.get(F);if(N.__webglInit===void 0)return;let C=F.source,L=p.get(C);if(L){let B=L[N.__cacheKey];B.usedTimes--,B.usedTimes===0&&D(F),Object.keys(L).length===0&&p.delete(C)}i.remove(F)}(M),M.isVideoTexture&&u.delete(M)}function I(A){let M=A.target;M.removeEventListener("dispose",I),function(F){let N=i.get(F);if(F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let L=0;L<6;L++){if(Array.isArray(N.__webglFramebuffer[L]))for(let B=0;B<N.__webglFramebuffer[L].length;B++)r.deleteFramebuffer(N.__webglFramebuffer[L][B]);else r.deleteFramebuffer(N.__webglFramebuffer[L]);N.__webglDepthbuffer&&r.deleteRenderbuffer(N.__webglDepthbuffer[L])}else{if(Array.isArray(N.__webglFramebuffer))for(let L=0;L<N.__webglFramebuffer.length;L++)r.deleteFramebuffer(N.__webglFramebuffer[L]);else r.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer&&r.deleteRenderbuffer(N.__webglDepthbuffer),N.__webglMultisampledFramebuffer&&r.deleteFramebuffer(N.__webglMultisampledFramebuffer),N.__webglColorRenderbuffer)for(let L=0;L<N.__webglColorRenderbuffer.length;L++)N.__webglColorRenderbuffer[L]&&r.deleteRenderbuffer(N.__webglColorRenderbuffer[L]);N.__webglDepthRenderbuffer&&r.deleteRenderbuffer(N.__webglDepthRenderbuffer)}let C=F.textures;for(let L=0,B=C.length;L<B;L++){let G=i.get(C[L]);G.__webglTexture&&(r.deleteTexture(G.__webglTexture),a.memory.textures--),i.remove(C[L])}i.remove(F)}(M)}function D(A){let M=i.get(A);r.deleteTexture(M.__webglTexture);let F=A.source;delete p.get(F)[M.__cacheKey],a.memory.textures--}let z=0;function q(A,M){let F=i.get(A);if(A.isVideoTexture&&function(N){let C=a.render.frame;u.get(N)!==C&&(u.set(N,C),N.update())}(A),A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){let N=A.image;if(N===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(N.complete!==!1)return void K(F,A,M);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(r.TEXTURE_2D,F.__webglTexture,r.TEXTURE0+M)}let P={[$a]:r.REPEAT,[si]:r.CLAMP_TO_EDGE,[Qa]:r.MIRRORED_REPEAT},H={[it]:r.NEAREST,[Al]:r.NEAREST_MIPMAP_NEAREST,[qn]:r.NEAREST_MIPMAP_LINEAR,[_t]:r.LINEAR,[oa]:r.LINEAR_MIPMAP_NEAREST,[Sn]:r.LINEAR_MIPMAP_LINEAR},J={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function re(A,M,F){if(M.type!==Wt||e.has("OES_texture_float_linear")!==!1||M.magFilter!==_t&&M.magFilter!==oa&&M.magFilter!==qn&&M.magFilter!==Sn&&M.minFilter!==_t&&M.minFilter!==oa&&M.minFilter!==qn&&M.minFilter!==Sn||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),F?(r.texParameteri(A,r.TEXTURE_WRAP_S,P[M.wrapS]),r.texParameteri(A,r.TEXTURE_WRAP_T,P[M.wrapT]),A!==r.TEXTURE_3D&&A!==r.TEXTURE_2D_ARRAY||r.texParameteri(A,r.TEXTURE_WRAP_R,P[M.wrapR]),r.texParameteri(A,r.TEXTURE_MAG_FILTER,H[M.magFilter]),r.texParameteri(A,r.TEXTURE_MIN_FILTER,H[M.minFilter])):(r.texParameteri(A,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(A,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),A!==r.TEXTURE_3D&&A!==r.TEXTURE_2D_ARRAY||r.texParameteri(A,r.TEXTURE_WRAP_R,r.CLAMP_TO_EDGE),M.wrapS===si&&M.wrapT===si||console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(A,r.TEXTURE_MAG_FILTER,T(M.magFilter)),r.texParameteri(A,r.TEXTURE_MIN_FILTER,T(M.minFilter)),M.minFilter!==it&&M.minFilter!==_t&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),M.compareFunction&&(r.texParameteri(A,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(A,r.TEXTURE_COMPARE_FUNC,J[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===it||M.minFilter!==qn&&M.minFilter!==Sn||M.type===Wt&&e.has("OES_texture_float_linear")===!1||o===!1&&M.type===lr&&e.has("OES_texture_half_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");r.texParameterf(A,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,n.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function he(A,M){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",S));let N=M.source,C=p.get(N);C===void 0&&(C={},p.set(N,C));let L=function(B){let G=[];return G.push(B.wrapS),G.push(B.wrapT),G.push(B.wrapR||0),G.push(B.magFilter),G.push(B.minFilter),G.push(B.anisotropy),G.push(B.internalFormat),G.push(B.format),G.push(B.type),G.push(B.generateMipmaps),G.push(B.premultiplyAlpha),G.push(B.flipY),G.push(B.unpackAlignment),G.push(B.colorSpace),G.join()}(M);if(L!==A.__cacheKey){C[L]===void 0&&(C[L]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,F=!0),C[L].usedTimes++;let B=C[A.__cacheKey];B!==void 0&&(C[A.__cacheKey].usedTimes--,B.usedTimes===0&&D(M)),A.__cacheKey=L,A.__webglTexture=C[L].texture}return F}function K(A,M,F){let N=r.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(N=r.TEXTURE_2D_ARRAY),M.isData3DTexture&&(N=r.TEXTURE_3D);let C=he(A,M),L=M.source;t.bindTexture(N,A.__webglTexture,r.TEXTURE0+F);let B=i.get(L);if(L.version!==B.__version||C===!0){t.activeTexture(r.TEXTURE0+F);let G=Fe.getPrimaries(Fe.workingColorSpace),O=M.colorSpace===bn?null:Fe.getPrimaries(M.colorSpace),b=M.colorSpace===bn||G===O?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,M.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,M.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,b);let Y=function(pe){return!o&&(pe.wrapS!==si||pe.wrapT!==si||pe.minFilter!==it&&pe.minFilter!==_t)}(M)&&f(M.image)===!1,U=g(M.image,Y,!1,n.maxTextureSize);U=ge(M,U);let ne=f(U)||o,Q=s.convert(M.format,M.colorSpace),se,me=s.convert(M.type),de=x(M.internalFormat,Q,me,M.colorSpace,M.isVideoTexture);re(N,M,ne);let fe=M.mipmaps,ue=o&&M.isVideoTexture!==!0&&de!==Mc,Te=B.__version===void 0||C===!0,we=L.dataReady,ke=R(M,U,ne);if(M.isDepthTexture)de=r.DEPTH_COMPONENT,o?de=M.type===Wt?r.DEPTH_COMPONENT32F:M.type===yi?r.DEPTH_COMPONENT24:M.type===ji?r.DEPTH24_STENCIL8:r.DEPTH_COMPONENT16:M.type===Wt&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),M.format===qi&&de===r.DEPTH_COMPONENT&&M.type!==tl&&M.type!==yi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),M.type=yi,me=s.convert(M.type)),M.format===Cn&&de===r.DEPTH_COMPONENT&&(de=r.DEPTH_STENCIL,M.type!==ji&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),M.type=ji,me=s.convert(M.type))),Te&&(ue?t.texStorage2D(r.TEXTURE_2D,1,de,U.width,U.height):t.texImage2D(r.TEXTURE_2D,0,de,U.width,U.height,0,Q,me,null));else if(M.isDataTexture)if(fe.length>0&&ne){ue&&Te&&t.texStorage2D(r.TEXTURE_2D,ke,de,fe[0].width,fe[0].height);for(let pe=0,Le=fe.length;pe<Le;pe++)se=fe[pe],ue?we&&t.texSubImage2D(r.TEXTURE_2D,pe,0,0,se.width,se.height,Q,me,se.data):t.texImage2D(r.TEXTURE_2D,pe,de,se.width,se.height,0,Q,me,se.data);M.generateMipmaps=!1}else ue?(Te&&t.texStorage2D(r.TEXTURE_2D,ke,de,U.width,U.height),we&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,U.width,U.height,Q,me,U.data)):t.texImage2D(r.TEXTURE_2D,0,de,U.width,U.height,0,Q,me,U.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){ue&&Te&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ke,de,fe[0].width,fe[0].height,U.depth);for(let pe=0,Le=fe.length;pe<Le;pe++)se=fe[pe],M.format!==oi?Q!==null?ue?we&&t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,pe,0,0,0,se.width,se.height,U.depth,Q,se.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,pe,de,se.width,se.height,U.depth,0,se.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ue?we&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,pe,0,0,0,se.width,se.height,U.depth,Q,me,se.data):t.texImage3D(r.TEXTURE_2D_ARRAY,pe,de,se.width,se.height,U.depth,0,Q,me,se.data)}else{ue&&Te&&t.texStorage2D(r.TEXTURE_2D,ke,de,fe[0].width,fe[0].height);for(let pe=0,Le=fe.length;pe<Le;pe++)se=fe[pe],M.format!==oi?Q!==null?ue?we&&t.compressedTexSubImage2D(r.TEXTURE_2D,pe,0,0,se.width,se.height,Q,se.data):t.compressedTexImage2D(r.TEXTURE_2D,pe,de,se.width,se.height,0,se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ue?we&&t.texSubImage2D(r.TEXTURE_2D,pe,0,0,se.width,se.height,Q,me,se.data):t.texImage2D(r.TEXTURE_2D,pe,de,se.width,se.height,0,Q,me,se.data)}else if(M.isDataArrayTexture)ue?(Te&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ke,de,U.width,U.height,U.depth),we&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,U.width,U.height,U.depth,Q,me,U.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,de,U.width,U.height,U.depth,0,Q,me,U.data);else if(M.isData3DTexture)ue?(Te&&t.texStorage3D(r.TEXTURE_3D,ke,de,U.width,U.height,U.depth),we&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,U.width,U.height,U.depth,Q,me,U.data)):t.texImage3D(r.TEXTURE_3D,0,de,U.width,U.height,U.depth,0,Q,me,U.data);else if(M.isFramebufferTexture){if(Te)if(ue)t.texStorage2D(r.TEXTURE_2D,ke,de,U.width,U.height);else{let pe=U.width,Le=U.height;for(let qe=0;qe<ke;qe++)t.texImage2D(r.TEXTURE_2D,qe,de,pe,Le,0,Q,me,null),pe>>=1,Le>>=1}}else if(fe.length>0&&ne){if(ue&&Te){let pe=ae(fe[0]);t.texStorage2D(r.TEXTURE_2D,ke,de,pe.width,pe.height)}for(let pe=0,Le=fe.length;pe<Le;pe++)se=fe[pe],ue?we&&t.texSubImage2D(r.TEXTURE_2D,pe,0,0,Q,me,se):t.texImage2D(r.TEXTURE_2D,pe,de,Q,me,se);M.generateMipmaps=!1}else if(ue){if(Te){let pe=ae(U);t.texStorage2D(r.TEXTURE_2D,ke,de,pe.width,pe.height)}we&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Q,me,U)}else t.texImage2D(r.TEXTURE_2D,0,de,Q,me,U);_(M,ne)&&v(N),B.__version=L.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function W(A,M,F,N,C,L){let B=s.convert(F.format,F.colorSpace),G=s.convert(F.type),O=x(F.internalFormat,B,G,F.colorSpace);if(!i.get(M).__hasExternalTextures){let b=Math.max(1,M.width>>L),Y=Math.max(1,M.height>>L);C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY?t.texImage3D(C,L,O,b,Y,M.depth,0,B,G,null):t.texImage2D(C,L,O,b,Y,0,B,G,null)}t.bindFramebuffer(r.FRAMEBUFFER,A),ee(M)?h.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,N,C,i.get(F).__webglTexture,0,j(M)):(C===r.TEXTURE_2D||C>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&C<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,N,C,i.get(F).__webglTexture,L),t.bindFramebuffer(r.FRAMEBUFFER,null)}function $(A,M,F){if(r.bindRenderbuffer(r.RENDERBUFFER,A),M.depthBuffer&&!M.stencilBuffer){let N=o===!0?r.DEPTH_COMPONENT24:r.DEPTH_COMPONENT16;if(F||ee(M)){let C=M.depthTexture;C&&C.isDepthTexture&&(C.type===Wt?N=r.DEPTH_COMPONENT32F:C.type===yi&&(N=r.DEPTH_COMPONENT24));let L=j(M);ee(M)?h.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,L,N,M.width,M.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,L,N,M.width,M.height)}else r.renderbufferStorage(r.RENDERBUFFER,N,M.width,M.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,A)}else if(M.depthBuffer&&M.stencilBuffer){let N=j(M);F&&ee(M)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,N,r.DEPTH24_STENCIL8,M.width,M.height):ee(M)?h.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,N,r.DEPTH24_STENCIL8,M.width,M.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,M.width,M.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,A)}else{let N=M.textures;for(let C=0;C<N.length;C++){let L=N[C],B=s.convert(L.format,L.colorSpace),G=s.convert(L.type),O=x(L.internalFormat,B,G,L.colorSpace),b=j(M);F&&ee(M)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,b,O,M.width,M.height):ee(M)?h.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,b,O,M.width,M.height):r.renderbufferStorage(r.RENDERBUFFER,O,M.width,M.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function oe(A){let M=i.get(A),F=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!M.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");(function(N,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,N),!C.depthTexture||!C.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");i.get(C.depthTexture).__webglTexture&&C.depthTexture.image.width===C.width&&C.depthTexture.image.height===C.height||(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),q(C.depthTexture,0);let L=i.get(C.depthTexture).__webglTexture,B=j(C);if(C.depthTexture.format===qi)ee(C)?h.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,L,0,B):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,L,0);else{if(C.depthTexture.format!==Cn)throw new Error("Unknown depthTexture format");ee(C)?h.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,L,0,B):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,L,0)}})(M.__webglFramebuffer,A)}else if(F){M.__webglDepthbuffer=[];for(let N=0;N<6;N++)t.bindFramebuffer(r.FRAMEBUFFER,M.__webglFramebuffer[N]),M.__webglDepthbuffer[N]=r.createRenderbuffer(),$(M.__webglDepthbuffer[N],A,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=r.createRenderbuffer(),$(M.__webglDepthbuffer,A,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function j(A){return Math.min(n.maxSamples,A.samples)}function ee(A){let M=i.get(A);return o&&A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ge(A,M){let F=A.colorSpace,N=A.format,C=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===bc||F!==Ti&&F!==bn&&(Fe.getTransfer(F)===Be?o===!1?M=ai.sRGBToLinear(M):N===oi&&C===Xi||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),M}function ae(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=function(){let A=z;return A>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+n.maxTextures),z+=1,A},this.resetTextureUnits=function(){z=0},this.setTexture2D=q,this.setTexture2DArray=function(A,M){let F=i.get(A);A.version>0&&F.__version!==A.version?K(F,A,M):t.bindTexture(r.TEXTURE_2D_ARRAY,F.__webglTexture,r.TEXTURE0+M)},this.setTexture3D=function(A,M){let F=i.get(A);A.version>0&&F.__version!==A.version?K(F,A,M):t.bindTexture(r.TEXTURE_3D,F.__webglTexture,r.TEXTURE0+M)},this.setTextureCube=function(A,M){let F=i.get(A);A.version>0&&F.__version!==A.version?function(N,C,L){if(C.image.length!==6)return;let B=he(N,C),G=C.source;t.bindTexture(r.TEXTURE_CUBE_MAP,N.__webglTexture,r.TEXTURE0+L);let O=i.get(G);if(G.version!==O.__version||B===!0){t.activeTexture(r.TEXTURE0+L);let b=Fe.getPrimaries(Fe.workingColorSpace),Y=C.colorSpace===bn?null:Fe.getPrimaries(C.colorSpace),U=C.colorSpace===bn||b===Y?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,C.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,C.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,U);let ne=C.isCompressedTexture||C.image[0].isCompressedTexture,Q=C.image[0]&&C.image[0].isDataTexture,se=[];for(let ye=0;ye<6;ye++)se[ye]=ne||Q?Q?C.image[ye].image:C.image[ye]:g(C.image[ye],!1,!0,n.maxCubemapSize),se[ye]=ge(C,se[ye]);let me=se[0],de=f(me)||o,fe=s.convert(C.format,C.colorSpace),ue=s.convert(C.type),Te=x(C.internalFormat,fe,ue,C.colorSpace),we=o&&C.isVideoTexture!==!0,ke=O.__version===void 0||B===!0,pe=G.dataReady,Le,qe=R(C,me,de);if(re(r.TEXTURE_CUBE_MAP,C,de),ne){we&&ke&&t.texStorage2D(r.TEXTURE_CUBE_MAP,qe,Te,me.width,me.height);for(let ye=0;ye<6;ye++){Le=se[ye].mipmaps;for(let He=0;He<Le.length;He++){let Ne=Le[He];C.format!==oi?fe!==null?we?pe&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He,0,0,Ne.width,Ne.height,fe,Ne.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He,Te,Ne.width,Ne.height,0,Ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):we?pe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He,0,0,Ne.width,Ne.height,fe,ue,Ne.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He,Te,Ne.width,Ne.height,0,fe,ue,Ne.data)}}}else{if(Le=C.mipmaps,we&&ke){Le.length>0&&qe++;let ye=ae(se[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,qe,Te,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(Q){we?pe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,se[ye].width,se[ye].height,fe,ue,se[ye].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Te,se[ye].width,se[ye].height,0,fe,ue,se[ye].data);for(let He=0;He<Le.length;He++){let Ne=Le[He].image[ye].image;we?pe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He+1,0,0,Ne.width,Ne.height,fe,ue,Ne.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He+1,Te,Ne.width,Ne.height,0,fe,ue,Ne.data)}}else{we?pe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,fe,ue,se[ye]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Te,fe,ue,se[ye]);for(let He=0;He<Le.length;He++){let Ne=Le[He];we?pe&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He+1,0,0,fe,ue,Ne.image[ye]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,He+1,Te,fe,ue,Ne.image[ye])}}}_(C,de)&&v(r.TEXTURE_CUBE_MAP),O.__version=G.version,C.onUpdate&&C.onUpdate(C)}N.__version=C.version}(F,A,M):t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+M)},this.rebindTextures=function(A,M,F){let N=i.get(A);M!==void 0&&W(N.__webglFramebuffer,A,A.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),F!==void 0&&oe(A)},this.setupRenderTarget=function(A){let M=A.texture,F=i.get(A),N=i.get(M);A.addEventListener("dispose",I);let C=A.textures,L=A.isWebGLCubeRenderTarget===!0,B=C.length>1,G=f(A)||o;if(B||(N.__webglTexture===void 0&&(N.__webglTexture=r.createTexture()),N.__version=M.version,a.memory.textures++),L){F.__webglFramebuffer=[];for(let O=0;O<6;O++)if(o&&M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer[O]=[];for(let b=0;b<M.mipmaps.length;b++)F.__webglFramebuffer[O][b]=r.createFramebuffer()}else F.__webglFramebuffer[O]=r.createFramebuffer()}else{if(o&&M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer=[];for(let O=0;O<M.mipmaps.length;O++)F.__webglFramebuffer[O]=r.createFramebuffer()}else F.__webglFramebuffer=r.createFramebuffer();if(B)if(n.drawBuffers)for(let O=0,b=C.length;O<b;O++){let Y=i.get(C[O]);Y.__webglTexture===void 0&&(Y.__webglTexture=r.createTexture(),a.memory.textures++)}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&A.samples>0&&ee(A)===!1){F.__webglMultisampledFramebuffer=r.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let O=0;O<C.length;O++){let b=C[O];F.__webglColorRenderbuffer[O]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,F.__webglColorRenderbuffer[O]);let Y=s.convert(b.format,b.colorSpace),U=s.convert(b.type),ne=x(b.internalFormat,Y,U,b.colorSpace,A.isXRRenderTarget===!0),Q=j(A);r.renderbufferStorageMultisample(r.RENDERBUFFER,Q,ne,A.width,A.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+O,r.RENDERBUFFER,F.__webglColorRenderbuffer[O])}r.bindRenderbuffer(r.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=r.createRenderbuffer(),$(F.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(L){t.bindTexture(r.TEXTURE_CUBE_MAP,N.__webglTexture),re(r.TEXTURE_CUBE_MAP,M,G);for(let O=0;O<6;O++)if(o&&M.mipmaps&&M.mipmaps.length>0)for(let b=0;b<M.mipmaps.length;b++)W(F.__webglFramebuffer[O][b],A,M,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+O,b);else W(F.__webglFramebuffer[O],A,M,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+O,0);_(M,G)&&v(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(B){for(let O=0,b=C.length;O<b;O++){let Y=C[O],U=i.get(Y);t.bindTexture(r.TEXTURE_2D,U.__webglTexture),re(r.TEXTURE_2D,Y,G),W(F.__webglFramebuffer,A,Y,r.COLOR_ATTACHMENT0+O,r.TEXTURE_2D,0),_(Y,G)&&v(r.TEXTURE_2D)}t.unbindTexture()}else{let O=r.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(o?O=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(O,N.__webglTexture),re(O,M,G),o&&M.mipmaps&&M.mipmaps.length>0)for(let b=0;b<M.mipmaps.length;b++)W(F.__webglFramebuffer[b],A,M,r.COLOR_ATTACHMENT0,O,b);else W(F.__webglFramebuffer,A,M,r.COLOR_ATTACHMENT0,O,0);_(M,G)&&v(O),t.unbindTexture()}A.depthBuffer&&oe(A)},this.updateRenderTargetMipmap=function(A){let M=f(A)||o,F=A.textures;for(let N=0,C=F.length;N<C;N++){let L=F[N];if(_(L,M)){let B=A.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,G=i.get(L).__webglTexture;t.bindTexture(B,G),v(B),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(A){if(o&&A.samples>0&&ee(A)===!1){let M=A.textures,F=A.width,N=A.height,C=r.COLOR_BUFFER_BIT,L=[],B=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,G=i.get(A),O=M.length>1;if(O)for(let b=0;b<M.length;b++)t.bindFramebuffer(r.FRAMEBUFFER,G.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+b,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,G.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+b,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,G.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,G.__webglFramebuffer);for(let b=0;b<M.length;b++){L.push(r.COLOR_ATTACHMENT0+b),A.depthBuffer&&L.push(B);let Y=G.__ignoreDepthValues!==void 0&&G.__ignoreDepthValues;if(Y===!1&&(A.depthBuffer&&(C|=r.DEPTH_BUFFER_BIT),A.stencilBuffer&&(C|=r.STENCIL_BUFFER_BIT)),O&&r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,G.__webglColorRenderbuffer[b]),Y===!0&&(r.invalidateFramebuffer(r.READ_FRAMEBUFFER,[B]),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[B])),O){let U=i.get(M[b]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,U,0)}r.blitFramebuffer(0,0,F,N,0,0,F,N,C,r.NEAREST),l&&r.invalidateFramebuffer(r.READ_FRAMEBUFFER,L)}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),O)for(let b=0;b<M.length;b++){t.bindFramebuffer(r.FRAMEBUFFER,G.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+b,r.RENDERBUFFER,G.__webglColorRenderbuffer[b]);let Y=i.get(M[b]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,G.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+b,r.TEXTURE_2D,Y,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,G.__webglMultisampledFramebuffer)}},this.setupDepthRenderbuffer=oe,this.setupFrameBufferTexture=W,this.useMultisampledRTT=ee}function tp(r,e,t){let i=t.isWebGL2;return{convert:function(n,s=""){let a,o=Fe.getTransfer(s);if(n===Xi)return r.UNSIGNED_BYTE;if(n===fc)return r.UNSIGNED_SHORT_4_4_4_4;if(n===gc)return r.UNSIGNED_SHORT_5_5_5_1;if(n===1010)return r.BYTE;if(n===1011)return r.SHORT;if(n===tl)return r.UNSIGNED_SHORT;if(n===mc)return r.INT;if(n===yi)return r.UNSIGNED_INT;if(n===Wt)return r.FLOAT;if(n===lr)return i?r.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(n===1021)return r.ALPHA;if(n===oi)return r.RGBA;if(n===1024)return r.LUMINANCE;if(n===1025)return r.LUMINANCE_ALPHA;if(n===qi)return r.DEPTH_COMPONENT;if(n===Cn)return r.DEPTH_STENCIL;if(n===bc)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(n===vc)return r.RED;if(n===_c)return r.RED_INTEGER;if(n===1030)return r.RG;if(n===yc)return r.RG_INTEGER;if(n===xc)return r.RGBA_INTEGER;if(n===la||n===ha||n===ca||n===ua)if(o===Be){if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a===null)return null;if(n===la)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ha)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ca)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ua)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(a=e.get("WEBGL_compressed_texture_s3tc"),a===null)return null;if(n===la)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ha)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ca)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ua)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(n===Rl||n===Cl||n===Pl||n===Ll){if(a=e.get("WEBGL_compressed_texture_pvrtc"),a===null)return null;if(n===Rl)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Cl)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Pl)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ll)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(n===Mc)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(n===Il||n===Ul){if(a=e.get("WEBGL_compressed_texture_etc"),a===null)return null;if(n===Il)return o===Be?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Ul)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}if(n===Dl||n===Nl||n===Ol||n===Fl||n===zl||n===Bl||n===kl||n===Hl||n===Gl||n===Vl||n===Wl||n===Xl||n===jl||n===ql){if(a=e.get("WEBGL_compressed_texture_astc"),a===null)return null;if(n===Dl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Nl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ol)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Fl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===zl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Bl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===kl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Hl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Gl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Vl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Wl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Xl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jl)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ql)return o===Be?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}if(n===da||n===Yl||n===Zl){if(a=e.get("EXT_texture_compression_bptc"),a===null)return null;if(n===da)return o===Be?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Yl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zl)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(n===36283||n===Jl||n===Kl||n===$l){if(a=e.get("EXT_texture_compression_rgtc"),a===null)return null;if(n===da)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Jl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Kl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===$l)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return n===ji?i?r.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):r[n]!==void 0?r[n]:null}}}var go=class extends ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},zt=class extends rt{constructor(){super(),this.isGroup=!0,this.type="Group"}},ip={type:"move"},rr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,a=null,o=this._targetRay,h=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let y of e.hand.values()){let g=t.getJointPose(y,i),f=this._getHandJoint(l,y);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let c=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=c.position.distanceTo(u.position),p=.02,m=.005;l.inputState.pinching&&d>p+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=p-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(h.matrix.fromArray(s.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,s.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(s.linearVelocity)):h.hasLinearVelocity=!1,s.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(s.angularVelocity)):h.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ip)))}return o!==null&&(o.visible=n!==null),h!==null&&(h.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new zt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},vo=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let n=new gt;e.properties.get(n).__webglTexture=t.texture,t.depthNear==i.depthNear&&t.depthFar==i.depthFar||(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}render(e,t){if(this.texture!==null){if(this.mesh===null){let i=t.cameras[0].viewport,n=new Zt({extensions:{fragDepth:!0},vertexShader:`
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

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new nt(new Ei(20,20),n)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}},_o=class extends wi{constructor(e,t){super();let i=this,n=null,s=1,a=null,o="local-floor",h=1,l=null,c=null,u=null,d=null,p=null,m=null,y=new vo,g=t.getContextAttributes(),f=null,_=null,v=[],x=[],R=new ie,T=null,S=new ft;S.layers.enable(1),S.viewport=new Je;let I=new ft;I.layers.enable(2),I.viewport=new Je;let D=[S,I],z=new go;z.layers.enable(1),z.layers.enable(2);let q=null,P=null;function H(j){let ee=x.indexOf(j.inputSource);if(ee===-1)return;let ge=v[ee];ge!==void 0&&(ge.update(j.inputSource,j.frame,l||a),ge.dispatchEvent({type:j.type,data:j.inputSource}))}function J(){n.removeEventListener("select",H),n.removeEventListener("selectstart",H),n.removeEventListener("selectend",H),n.removeEventListener("squeeze",H),n.removeEventListener("squeezestart",H),n.removeEventListener("squeezeend",H),n.removeEventListener("end",J),n.removeEventListener("inputsourceschange",re);for(let j=0;j<v.length;j++){let ee=x[j];ee!==null&&(x[j]=null,v[j].disconnect(ee))}q=null,P=null,y.reset(),e.setRenderTarget(f),p=null,d=null,u=null,n=null,_=null,oe.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}function re(j){for(let ee=0;ee<j.removed.length;ee++){let ge=j.removed[ee],ae=x.indexOf(ge);ae>=0&&(x[ae]=null,v[ae].disconnect(ge))}for(let ee=0;ee<j.added.length;ee++){let ge=j.added[ee],ae=x.indexOf(ge);if(ae===-1){for(let M=0;M<v.length;M++){if(M>=x.length){x.push(ge),ae=M;break}if(x[M]===null){x[M]=ge,ae=M;break}}if(ae===-1)break}let A=v[ae];A&&A.connect(ge)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ee=v[j];return ee===void 0&&(ee=new rr,v[j]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(j){let ee=v[j];return ee===void 0&&(ee=new rr,v[j]=ee),ee.getGripSpace()},this.getHand=function(j){let ee=v[j];return ee===void 0&&(ee=new rr,v[j]=ee),ee.getHandSpace()},this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(j){if(n=j,n!==null){if(f=e.getRenderTarget(),n.addEventListener("select",H),n.addEventListener("selectstart",H),n.addEventListener("selectend",H),n.addEventListener("squeeze",H),n.addEventListener("squeezestart",H),n.addEventListener("squeezeend",H),n.addEventListener("end",J),n.addEventListener("inputsourceschange",re),g.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(R),n.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let ee={antialias:n.renderState.layers!==void 0||g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(n,t,ee),n.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new hi(p.framebufferWidth,p.framebufferHeight,{format:oi,type:Xi,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ee=null,ge=null,ae=null;g.depth&&(ae=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=g.stencil?Cn:qi,ge=g.stencil?ji:yi);let A={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:s};u=new XRWebGLBinding(n,t),d=u.createProjectionLayer(A),n.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),_=new hi(d.textureWidth,d.textureHeight,{format:oi,type:Xi,depthTexture:new Rs(d.textureWidth,d.textureHeight,ge,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0}),e.properties.get(_).__ignoreDepthValues=d.ignoreDepthValues}_.isXRRenderTarget=!0,this.setFoveation(h),l=null,a=await n.requestReferenceSpace(o),oe.setContext(n),oe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode};let he=new w,K=new w;function W(j,ee){ee===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ee.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(n===null)return;y.texture!==null&&(j.near=y.depthNear,j.far=y.depthFar),z.near=I.near=S.near=j.near,z.far=I.far=S.far=j.far,q===z.near&&P===z.far||(n.updateRenderState({depthNear:z.near,depthFar:z.far}),q=z.near,P=z.far,S.near=q,S.far=P,I.near=q,I.far=P,S.updateProjectionMatrix(),I.updateProjectionMatrix(),j.updateProjectionMatrix());let ee=j.parent,ge=z.cameras;W(z,ee);for(let ae=0;ae<ge.length;ae++)W(ge[ae],ee);ge.length===2?function(ae,A,M){he.setFromMatrixPosition(A.matrixWorld),K.setFromMatrixPosition(M.matrixWorld);let F=he.distanceTo(K),N=A.projectionMatrix.elements,C=M.projectionMatrix.elements,L=N[14]/(N[10]-1),B=N[14]/(N[10]+1),G=(N[9]+1)/N[5],O=(N[9]-1)/N[5],b=(N[8]-1)/N[0],Y=(C[8]+1)/C[0],U=L*b,ne=L*Y,Q=F/(-b+Y),se=Q*-b;A.matrixWorld.decompose(ae.position,ae.quaternion,ae.scale),ae.translateX(se),ae.translateZ(Q),ae.matrixWorld.compose(ae.position,ae.quaternion,ae.scale),ae.matrixWorldInverse.copy(ae.matrixWorld).invert();let me=L+Q,de=B+Q,fe=U-se,ue=ne+(F-se),Te=G*B/de*me,we=O*B/de*me;ae.projectionMatrix.makePerspective(fe,ue,Te,we,me,de),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert()}(z,S,I):z.projectionMatrix.copy(S.projectionMatrix),function(ae,A,M){M===null?ae.matrix.copy(A.matrixWorld):(ae.matrix.copy(M.matrixWorld),ae.matrix.invert(),ae.matrix.multiply(A.matrixWorld)),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.updateMatrixWorld(!0),ae.projectionMatrix.copy(A.projectionMatrix),ae.projectionMatrixInverse.copy(A.projectionMatrixInverse),ae.isPerspectiveCamera&&(ae.fov=2*to*Math.atan(1/ae.projectionMatrix.elements[5]),ae.zoom=1)}(j,z,ee)},this.getCamera=function(){return z},this.getFoveation=function(){if(d!==null||p!==null)return h},this.setFoveation=function(j){h=j,d!==null&&(d.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return y.texture!==null};let $=null,oe=new Ac;oe.setAnimationLoop(function(j,ee){if(c=ee.getViewerPose(l||a),m=ee,c!==null){let ge=c.views;p!==null&&(e.setRenderTargetFramebuffer(_,p.framebuffer),e.setRenderTarget(_));let ae=!1;ge.length!==z.cameras.length&&(z.cameras.length=0,ae=!0);for(let M=0;M<ge.length;M++){let F=ge[M],N=null;if(p!==null)N=p.getViewport(F);else{let L=u.getViewSubImage(d,F);N=L.viewport,M===0&&(e.setRenderTargetTextures(_,L.colorTexture,d.ignoreDepthValues?void 0:L.depthStencilTexture),e.setRenderTarget(_))}let C=D[M];C===void 0&&(C=new ft,C.layers.enable(M),C.viewport=new Je,D[M]=C),C.matrix.fromArray(F.transform.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale),C.projectionMatrix.fromArray(F.projectionMatrix),C.projectionMatrixInverse.copy(C.projectionMatrix).invert(),C.viewport.set(N.x,N.y,N.width,N.height),M===0&&(z.matrix.copy(C.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),ae===!0&&z.cameras.push(C)}let A=n.enabledFeatures;if(A&&A.includes("depth-sensing")){let M=u.getDepthInformation(ge[0]);M&&M.isValid&&M.texture&&y.init(e,M,n.renderState)}}for(let ge=0;ge<v.length;ge++){let ae=x[ge],A=v[ge];ae!==null&&A!==void 0&&A.update(ae,ee,l||a)}y.render(e,z),$&&$(j,ee),ee.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ee}),m=null}),this.setAnimationLoop=function(j){$=j},this.dispose=function(){}}},ki=new qt,np=new be;function rp(r,e){function t(n,s){n.matrixAutoUpdate===!0&&n.updateMatrix(),s.value.copy(n.matrix)}function i(n,s){n.opacity.value=s.opacity,s.color&&n.diffuse.value.copy(s.color),s.emissive&&n.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(n.map.value=s.map,t(s.map,n.mapTransform)),s.alphaMap&&(n.alphaMap.value=s.alphaMap,t(s.alphaMap,n.alphaMapTransform)),s.bumpMap&&(n.bumpMap.value=s.bumpMap,t(s.bumpMap,n.bumpMapTransform),n.bumpScale.value=s.bumpScale,s.side===xt&&(n.bumpScale.value*=-1)),s.normalMap&&(n.normalMap.value=s.normalMap,t(s.normalMap,n.normalMapTransform),n.normalScale.value.copy(s.normalScale),s.side===xt&&n.normalScale.value.negate()),s.displacementMap&&(n.displacementMap.value=s.displacementMap,t(s.displacementMap,n.displacementMapTransform),n.displacementScale.value=s.displacementScale,n.displacementBias.value=s.displacementBias),s.emissiveMap&&(n.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,n.emissiveMapTransform)),s.specularMap&&(n.specularMap.value=s.specularMap,t(s.specularMap,n.specularMapTransform)),s.alphaTest>0&&(n.alphaTest.value=s.alphaTest);let a=e.get(s),o=a.envMap,h=a.envMapRotation;if(o&&(n.envMap.value=o,ki.copy(h),ki.x*=-1,ki.y*=-1,ki.z*=-1,o.isCubeTexture&&o.isRenderTargetTexture===!1&&(ki.y*=-1,ki.z*=-1),n.envMapRotation.value.setFromMatrix4(np.makeRotationFromEuler(ki)),n.flipEnvMap.value=o.isCubeTexture&&o.isRenderTargetTexture===!1?-1:1,n.reflectivity.value=s.reflectivity,n.ior.value=s.ior,n.refractionRatio.value=s.refractionRatio),s.lightMap){n.lightMap.value=s.lightMap;let l=r._useLegacyLights===!0?Math.PI:1;n.lightMapIntensity.value=s.lightMapIntensity*l,t(s.lightMap,n.lightMapTransform)}s.aoMap&&(n.aoMap.value=s.aoMap,n.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,n.aoMapTransform))}return{refreshFogUniforms:function(n,s){s.color.getRGB(n.fogColor.value,Tc(r)),s.isFog?(n.fogNear.value=s.near,n.fogFar.value=s.far):s.isFogExp2&&(n.fogDensity.value=s.density)},refreshMaterialUniforms:function(n,s,a,o,h){s.isMeshBasicMaterial||s.isMeshLambertMaterial?i(n,s):s.isMeshToonMaterial?(i(n,s),function(l,c){c.gradientMap&&(l.gradientMap.value=c.gradientMap)}(n,s)):s.isMeshPhongMaterial?(i(n,s),function(l,c){l.specular.value.copy(c.specular),l.shininess.value=Math.max(c.shininess,1e-4)}(n,s)):s.isMeshStandardMaterial?(i(n,s),function(l,c){l.metalness.value=c.metalness,c.metalnessMap&&(l.metalnessMap.value=c.metalnessMap,t(c.metalnessMap,l.metalnessMapTransform)),l.roughness.value=c.roughness,c.roughnessMap&&(l.roughnessMap.value=c.roughnessMap,t(c.roughnessMap,l.roughnessMapTransform)),e.get(c).envMap&&(l.envMapIntensity.value=c.envMapIntensity)}(n,s),s.isMeshPhysicalMaterial&&function(l,c,u){l.ior.value=c.ior,c.sheen>0&&(l.sheenColor.value.copy(c.sheenColor).multiplyScalar(c.sheen),l.sheenRoughness.value=c.sheenRoughness,c.sheenColorMap&&(l.sheenColorMap.value=c.sheenColorMap,t(c.sheenColorMap,l.sheenColorMapTransform)),c.sheenRoughnessMap&&(l.sheenRoughnessMap.value=c.sheenRoughnessMap,t(c.sheenRoughnessMap,l.sheenRoughnessMapTransform))),c.clearcoat>0&&(l.clearcoat.value=c.clearcoat,l.clearcoatRoughness.value=c.clearcoatRoughness,c.clearcoatMap&&(l.clearcoatMap.value=c.clearcoatMap,t(c.clearcoatMap,l.clearcoatMapTransform)),c.clearcoatRoughnessMap&&(l.clearcoatRoughnessMap.value=c.clearcoatRoughnessMap,t(c.clearcoatRoughnessMap,l.clearcoatRoughnessMapTransform)),c.clearcoatNormalMap&&(l.clearcoatNormalMap.value=c.clearcoatNormalMap,t(c.clearcoatNormalMap,l.clearcoatNormalMapTransform),l.clearcoatNormalScale.value.copy(c.clearcoatNormalScale),c.side===xt&&l.clearcoatNormalScale.value.negate())),c.iridescence>0&&(l.iridescence.value=c.iridescence,l.iridescenceIOR.value=c.iridescenceIOR,l.iridescenceThicknessMinimum.value=c.iridescenceThicknessRange[0],l.iridescenceThicknessMaximum.value=c.iridescenceThicknessRange[1],c.iridescenceMap&&(l.iridescenceMap.value=c.iridescenceMap,t(c.iridescenceMap,l.iridescenceMapTransform)),c.iridescenceThicknessMap&&(l.iridescenceThicknessMap.value=c.iridescenceThicknessMap,t(c.iridescenceThicknessMap,l.iridescenceThicknessMapTransform))),c.transmission>0&&(l.transmission.value=c.transmission,l.transmissionSamplerMap.value=u.texture,l.transmissionSamplerSize.value.set(u.width,u.height),c.transmissionMap&&(l.transmissionMap.value=c.transmissionMap,t(c.transmissionMap,l.transmissionMapTransform)),l.thickness.value=c.thickness,c.thicknessMap&&(l.thicknessMap.value=c.thicknessMap,t(c.thicknessMap,l.thicknessMapTransform)),l.attenuationDistance.value=c.attenuationDistance,l.attenuationColor.value.copy(c.attenuationColor)),c.anisotropy>0&&(l.anisotropyVector.value.set(c.anisotropy*Math.cos(c.anisotropyRotation),c.anisotropy*Math.sin(c.anisotropyRotation)),c.anisotropyMap&&(l.anisotropyMap.value=c.anisotropyMap,t(c.anisotropyMap,l.anisotropyMapTransform))),l.specularIntensity.value=c.specularIntensity,l.specularColor.value.copy(c.specularColor),c.specularColorMap&&(l.specularColorMap.value=c.specularColorMap,t(c.specularColorMap,l.specularColorMapTransform)),c.specularIntensityMap&&(l.specularIntensityMap.value=c.specularIntensityMap,t(c.specularIntensityMap,l.specularIntensityMapTransform))}(n,s,h)):s.isMeshMatcapMaterial?(i(n,s),function(l,c){c.matcap&&(l.matcap.value=c.matcap)}(n,s)):s.isMeshDepthMaterial?i(n,s):s.isMeshDistanceMaterial?(i(n,s),function(l,c){let u=e.get(c).light;l.referencePosition.value.setFromMatrixPosition(u.matrixWorld),l.nearDistance.value=u.shadow.camera.near,l.farDistance.value=u.shadow.camera.far}(n,s)):s.isMeshNormalMaterial?i(n,s):s.isLineBasicMaterial?(function(l,c){l.diffuse.value.copy(c.color),l.opacity.value=c.opacity,c.map&&(l.map.value=c.map,t(c.map,l.mapTransform))}(n,s),s.isLineDashedMaterial&&function(l,c){l.dashSize.value=c.dashSize,l.totalSize.value=c.dashSize+c.gapSize,l.scale.value=c.scale}(n,s)):s.isPointsMaterial?function(l,c,u,d){l.diffuse.value.copy(c.color),l.opacity.value=c.opacity,l.size.value=c.size*u,l.scale.value=.5*d,c.map&&(l.map.value=c.map,t(c.map,l.uvTransform)),c.alphaMap&&(l.alphaMap.value=c.alphaMap,t(c.alphaMap,l.alphaMapTransform)),c.alphaTest>0&&(l.alphaTest.value=c.alphaTest)}(n,s,a,o):s.isSpriteMaterial?function(l,c){l.diffuse.value.copy(c.color),l.opacity.value=c.opacity,l.rotation.value=c.rotation,c.map&&(l.map.value=c.map,t(c.map,l.mapTransform)),c.alphaMap&&(l.alphaMap.value=c.alphaMap,t(c.alphaMap,l.alphaMapTransform)),c.alphaTest>0&&(l.alphaTest.value=c.alphaTest)}(n,s):s.isShadowMaterial?(n.color.value.copy(s.color),n.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function sp(r,e,t,i){let n={},s={},a=[],o=t.isWebGL2?r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS):0;function h(u,d,p,m){let y=u.value,g=d+"_"+p;if(m[g]===void 0)return m[g]=typeof y=="number"||typeof y=="boolean"?y:y.clone(),!0;{let f=m[g];if(typeof y=="number"||typeof y=="boolean"){if(f!==y)return m[g]=y,!0}else if(f.equals(y)===!1)return f.copy(y),!0}return!1}function l(u){let d={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(d.boundary=4,d.storage=4):u.isVector2?(d.boundary=8,d.storage=8):u.isVector3||u.isColor?(d.boundary=16,d.storage=12):u.isVector4?(d.boundary=16,d.storage=16):u.isMatrix3?(d.boundary=48,d.storage=48):u.isMatrix4?(d.boundary=64,d.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),d}function c(u){let d=u.target;d.removeEventListener("dispose",c);let p=a.indexOf(d.__bindingPointIndex);a.splice(p,1),r.deleteBuffer(n[d.id]),delete n[d.id],delete s[d.id]}return{bind:function(u,d){let p=d.program;i.uniformBlockBinding(u,p)},update:function(u,d){let p=n[u.id];p===void 0&&(function(g){let f=g.uniforms,_=0,v=16;for(let R=0,T=f.length;R<T;R++){let S=Array.isArray(f[R])?f[R]:[f[R]];for(let I=0,D=S.length;I<D;I++){let z=S[I],q=Array.isArray(z.value)?z.value:[z.value];for(let P=0,H=q.length;P<H;P++){let J=l(q[P]),re=_%v;re!==0&&v-re<J.boundary&&(_+=v-re),z.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=_,_+=J.storage}}}let x=_%v;x>0&&(_+=v-x),g.__size=_,g.__cache={}}(u),p=function(g){let f=function(){for(let R=0;R<o;R++)if(a.indexOf(R)===-1)return a.push(R),R;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}();g.__bindingPointIndex=f;let _=r.createBuffer(),v=g.__size,x=g.usage;return r.bindBuffer(r.UNIFORM_BUFFER,_),r.bufferData(r.UNIFORM_BUFFER,v,x),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,f,_),_}(u),n[u.id]=p,u.addEventListener("dispose",c));let m=d.program;i.updateUBOMapping(u,m);let y=e.render.frame;s[u.id]!==y&&(function(g){let f=n[g.id],_=g.uniforms,v=g.__cache;r.bindBuffer(r.UNIFORM_BUFFER,f);for(let x=0,R=_.length;x<R;x++){let T=Array.isArray(_[x])?_[x]:[_[x]];for(let S=0,I=T.length;S<I;S++){let D=T[S];if(h(D,x,S,v)===!0){let z=D.__offset,q=Array.isArray(D.value)?D.value:[D.value],P=0;for(let H=0;H<q.length;H++){let J=q[H],re=l(J);typeof J=="number"||typeof J=="boolean"?(D.__data[0]=J,r.bufferSubData(r.UNIFORM_BUFFER,z+P,D.__data)):J.isMatrix3?(D.__data[0]=J.elements[0],D.__data[1]=J.elements[1],D.__data[2]=J.elements[2],D.__data[3]=0,D.__data[4]=J.elements[3],D.__data[5]=J.elements[4],D.__data[6]=J.elements[5],D.__data[7]=0,D.__data[8]=J.elements[6],D.__data[9]=J.elements[7],D.__data[10]=J.elements[8],D.__data[11]=0):(J.toArray(D.__data,P),P+=re.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,z,D.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}(u),s[u.id]=y)},dispose:function(){for(let u in n)r.deleteBuffer(n[u]);a=[],n={},s={}}}}var Nn=class{constructor(e={}){let{canvas:t=du(),context:i=null,depth:n=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1}=e,d;this.isWebGLRenderer=!0,d=i!==null?i.getContextAttributes().alpha:a;let p=new Uint32Array(4),m=new Int32Array(4),y=null,g=null,f=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=yt,this._useLegacyLights=!1,this.toneMapping=Mi,this.toneMappingExposure=1;let v=this,x=!1,R=0,T=0,S=null,I=-1,D=null,z=new Je,q=new Je,P=null,H=new Se(0),J=0,re=t.width,he=t.height,K=1,W=null,$=null,oe=new Je(0,0,re,he),j=new Je(0,0,re,he),ee=!1,ge=new Un,ae=!1,A=!1,M=null,F=new be,N=new ie,C=new w,L={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function B(){return S===null?K:1}let G,O,b,Y,U,ne,Q,se,me,de,fe,ue,Te,we,ke,pe,Le,qe,ye,He,Ne,wt,Kt,Lt,V=i;function Ri(E,k){for(let X=0;X<E.length;X++){let te=E[X],Z=t.getContext(te,k);if(Z!==null)return Z}return null}try{let E={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:h,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qa}`),t.addEventListener("webglcontextlost",al,!1),t.addEventListener("webglcontextrestored",ol,!1),t.addEventListener("webglcontextcreationerror",ll,!1),V===null){let k=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&k.shift(),V=Ri(k,E),V===null)throw Ri(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&V instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),V.getShaderPrecisionFormat===void 0&&(V.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}function Gn(){G=new Bu(V),O=new Nu(V,G,e),G.init(O),wt=new tp(V,G,O),b=new Qd(V,G,O),Y=new Gu(V),U=new Wd,ne=new ep(V,G,b,U,O,wt,Y),Q=new Fu(v),se=new zu(v),me=new Pu(V,O),Kt=new Uu(V,G,me,O),de=new ku(V,me,Y,Kt),fe=new ju(V,de,me,Y),ye=new Xu(V,O,ne),pe=new Ou(U),ue=new Vd(v,Q,se,G,O,Kt,pe),Te=new rp(v,U),we=new jd,ke=new Kd(G,O),qe=new Iu(v,Q,se,b,fe,d,h),Le=new $d(v,fe,O),Lt=new sp(V,Y,O,b),He=new Du(V,G,Y,O),Ne=new Hu(V,G,Y,O),Y.programs=ue.programs,v.capabilities=O,v.extensions=G,v.properties=U,v.renderLists=we,v.shadowMap=Le,v.state=b,v.info=Y}Gn();let ht=new _o(v,V);function al(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function ol(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;let E=Y.autoReset,k=Le.enabled,X=Le.autoUpdate,te=Le.needsUpdate,Z=Le.type;Gn(),Y.autoReset=E,Le.enabled=k,Le.autoUpdate=X,Le.needsUpdate=te,Le.type=Z}function ll(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function hl(E){let k=E.target;k.removeEventListener("dispose",hl),function(X){(function(te){let Z=U.get(te).programs;Z!==void 0&&(Z.forEach(function(ce){ue.releaseProgram(ce)}),te.isShaderMaterial&&ue.releaseShaderCache(te))})(X),U.remove(X)}(k)}function cl(E,k,X){E.transparent===!0&&E.side===2&&E.forceSinglePass===!1?(E.side=xt,E.needsUpdate=!0,Lr(E,k,X),E.side=Si,E.needsUpdate=!0,Lr(E,k,X),E.side=2):Lr(E,k,X)}this.xr=ht,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){let E=G.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=G.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(E){E!==void 0&&(K=E,this.setSize(re,he,!1))},this.getSize=function(E){return E.set(re,he)},this.setSize=function(E,k,X=!0){ht.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(re=E,he=k,t.width=Math.floor(E*K),t.height=Math.floor(k*K),X===!0&&(t.style.width=E+"px",t.style.height=k+"px"),this.setViewport(0,0,E,k))},this.getDrawingBufferSize=function(E){return E.set(re*K,he*K).floor()},this.setDrawingBufferSize=function(E,k,X){re=E,he=k,K=X,t.width=Math.floor(E*X),t.height=Math.floor(k*X),this.setViewport(0,0,E,k)},this.getCurrentViewport=function(E){return E.copy(z)},this.getViewport=function(E){return E.copy(oe)},this.setViewport=function(E,k,X,te){E.isVector4?oe.set(E.x,E.y,E.z,E.w):oe.set(E,k,X,te),b.viewport(z.copy(oe).multiplyScalar(K).round())},this.getScissor=function(E){return E.copy(j)},this.setScissor=function(E,k,X,te){E.isVector4?j.set(E.x,E.y,E.z,E.w):j.set(E,k,X,te),b.scissor(q.copy(j).multiplyScalar(K).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(E){b.setScissorTest(ee=E)},this.setOpaqueSort=function(E){W=E},this.setTransparentSort=function(E){$=E},this.getClearColor=function(E){return E.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor.apply(qe,arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha.apply(qe,arguments)},this.clear=function(E=!0,k=!0,X=!0){let te=0;if(E){let Z=!1;if(S!==null){let ce=S.texture.format;Z=ce===xc||ce===yc||ce===_c}if(Z){let ce=S.texture.type,ve=ce===Xi||ce===yi||ce===tl||ce===ji||ce===fc||ce===gc,xe=qe.getClearColor(),Ae=qe.getClearAlpha(),Ce=xe.r,Pe=xe.g,Ie=xe.b;ve?(p[0]=Ce,p[1]=Pe,p[2]=Ie,p[3]=Ae,V.clearBufferuiv(V.COLOR,0,p)):(m[0]=Ce,m[1]=Pe,m[2]=Ie,m[3]=Ae,V.clearBufferiv(V.COLOR,0,m))}else te|=V.COLOR_BUFFER_BIT}k&&(te|=V.DEPTH_BUFFER_BIT),X&&(te|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",al,!1),t.removeEventListener("webglcontextrestored",ol,!1),t.removeEventListener("webglcontextcreationerror",ll,!1),we.dispose(),ke.dispose(),U.dispose(),Q.dispose(),se.dispose(),fe.dispose(),Kt.dispose(),Lt.dispose(),ue.dispose(),ht.dispose(),ht.removeEventListener("sessionstart",ul),ht.removeEventListener("sessionend",dl),M&&(M.dispose(),M=null),Ci.stop()},this.renderBufferDirect=function(E,k,X,te,Z,ce){k===null&&(k=L);let ve=Z.isMesh&&Z.matrixWorld.determinant()<0,xe=function(Ke,Et,vt,Ue,Re){Et.isScene!==!0&&(Et=L),ne.resetTextureUnits();let Vn=Et.fog,ia=Ue.isMeshStandardMaterial?Et.environment:null,Gc=S===null?v.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Ti,Ir=(Ue.isMeshStandardMaterial?se:Q).get(Ue.envMap||ia),Vc=Ue.vertexColors===!0&&!!vt.attributes.color&&vt.attributes.color.itemSize===4,Wc=!!vt.attributes.tangent&&(!!Ue.normalMap||Ue.anisotropy>0),Xc=!!vt.morphAttributes.position,jc=!!vt.morphAttributes.normal,qc=!!vt.morphAttributes.color,_l=Mi;Ue.toneMapped&&(S!==null&&S.isXRRenderTarget!==!0||(_l=v.toneMapping));let yl=vt.morphAttributes.position||vt.morphAttributes.normal||vt.morphAttributes.color,Yc=yl!==void 0?yl.length:0,De=U.get(Ue),Zc=g.state.lights;if(ae===!0&&(A===!0||Ke!==D)){let Tt=Ke===D&&Ue.id===I;pe.setState(Ue,Ke,Tt)}let Ut=!1;Ue.version===De.__version?De.needsLights&&De.lightsStateVersion!==Zc.state.version||De.outputColorSpace!==Gc||Re.isBatchedMesh&&De.batching===!1?Ut=!0:Re.isBatchedMesh||De.batching!==!0?Re.isInstancedMesh&&De.instancing===!1?Ut=!0:Re.isInstancedMesh||De.instancing!==!0?Re.isSkinnedMesh&&De.skinning===!1?Ut=!0:Re.isSkinnedMesh||De.skinning!==!0?Re.isInstancedMesh&&De.instancingColor===!0&&Re.instanceColor===null||Re.isInstancedMesh&&De.instancingColor===!1&&Re.instanceColor!==null||Re.isInstancedMesh&&De.instancingMorph===!0&&Re.morphTexture===null||Re.isInstancedMesh&&De.instancingMorph===!1&&Re.morphTexture!==null||De.envMap!==Ir||Ue.fog===!0&&De.fog!==Vn?Ut=!0:De.numClippingPlanes===void 0||De.numClippingPlanes===pe.numPlanes&&De.numIntersection===pe.numIntersection?(De.vertexAlphas!==Vc||De.vertexTangents!==Wc||De.morphTargets!==Xc||De.morphNormals!==jc||De.morphColors!==qc||De.toneMapping!==_l||O.isWebGL2===!0&&De.morphTargetsCount!==Yc)&&(Ut=!0):Ut=!0:Ut=!0:Ut=!0:Ut=!0:(Ut=!0,De.__version=Ue.version);let Li=De.currentProgram;Ut===!0&&(Li=Lr(Ue,Et,Re));let xl=!1,Wn=!1,na=!1,ct=Li.getUniforms(),Ii=De.uniforms;if(b.useProgram(Li.program)&&(xl=!0,Wn=!0,na=!0),Ue.id!==I&&(I=Ue.id,Wn=!0),xl||D!==Ke){ct.setValue(V,"projectionMatrix",Ke.projectionMatrix),ct.setValue(V,"viewMatrix",Ke.matrixWorldInverse);let Tt=ct.map.cameraPosition;Tt!==void 0&&Tt.setValue(V,C.setFromMatrixPosition(Ke.matrixWorld)),O.logarithmicDepthBuffer&&ct.setValue(V,"logDepthBufFC",2/(Math.log(Ke.far+1)/Math.LN2)),(Ue.isMeshPhongMaterial||Ue.isMeshToonMaterial||Ue.isMeshLambertMaterial||Ue.isMeshBasicMaterial||Ue.isMeshStandardMaterial||Ue.isShaderMaterial)&&ct.setValue(V,"isOrthographic",Ke.isOrthographicCamera===!0),D!==Ke&&(D=Ke,Wn=!0,na=!0)}if(Re.isSkinnedMesh){ct.setOptional(V,Re,"bindMatrix"),ct.setOptional(V,Re,"bindMatrixInverse");let Tt=Re.skeleton;Tt&&(O.floatVertexTextures?(Tt.boneTexture===null&&Tt.computeBoneTexture(),ct.setValue(V,"boneTexture",Tt.boneTexture,ne)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Re.isBatchedMesh&&(ct.setOptional(V,Re,"batchingTexture"),ct.setValue(V,"batchingTexture",Re._matricesTexture,ne));let ra=vt.morphAttributes;(ra.position!==void 0||ra.normal!==void 0||ra.color!==void 0&&O.isWebGL2===!0)&&ye.update(Re,vt,Li),(Wn||De.receiveShadow!==Re.receiveShadow)&&(De.receiveShadow=Re.receiveShadow,ct.setValue(V,"receiveShadow",Re.receiveShadow)),Ue.isMeshGouraudMaterial&&Ue.envMap!==null&&(Ii.envMap.value=Ir,Ii.flipEnvMap.value=Ir.isCubeTexture&&Ir.isRenderTargetTexture===!1?-1:1),Wn&&(ct.setValue(V,"toneMappingExposure",v.toneMappingExposure),De.needsLights&&(Dt=na,(Ht=Ii).ambientLightColor.needsUpdate=Dt,Ht.lightProbe.needsUpdate=Dt,Ht.directionalLights.needsUpdate=Dt,Ht.directionalLightShadows.needsUpdate=Dt,Ht.pointLights.needsUpdate=Dt,Ht.pointLightShadows.needsUpdate=Dt,Ht.spotLights.needsUpdate=Dt,Ht.spotLightShadows.needsUpdate=Dt,Ht.rectAreaLights.needsUpdate=Dt,Ht.hemisphereLights.needsUpdate=Dt),Vn&&Ue.fog===!0&&Te.refreshFogUniforms(Ii,Vn),Te.refreshMaterialUniforms(Ii,Ue,K,he,M),Tn.upload(V,gl(De),Ii,ne));var Ht,Dt;if(Ue.isShaderMaterial&&Ue.uniformsNeedUpdate===!0&&(Tn.upload(V,gl(De),Ii,ne),Ue.uniformsNeedUpdate=!1),Ue.isSpriteMaterial&&ct.setValue(V,"center",Re.center),ct.setValue(V,"modelViewMatrix",Re.modelViewMatrix),ct.setValue(V,"normalMatrix",Re.normalMatrix),ct.setValue(V,"modelMatrix",Re.matrixWorld),Ue.isShaderMaterial||Ue.isRawShaderMaterial){let Tt=Ue.uniformsGroups;for(let sa=0,Jc=Tt.length;sa<Jc;sa++)if(O.isWebGL2){let Ml=Tt[sa];Lt.update(Ml,Li),Lt.bind(Ml,Li)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Li}(E,k,X,te,Z);b.setMaterial(te,ve);let Ae=X.index,Ce=1;if(te.wireframe===!0){if(Ae=de.getWireframeAttribute(X),Ae===void 0)return;Ce=2}let Pe=X.drawRange,Ie=X.attributes.position,Ve=Pe.start*Ce,It=(Pe.start+Pe.count)*Ce;ce!==null&&(Ve=Math.max(Ve,ce.start*Ce),It=Math.min(It,(ce.start+ce.count)*Ce)),Ae!==null?(Ve=Math.max(Ve,0),It=Math.min(It,Ae.count)):Ie!=null&&(Ve=Math.max(Ve,0),It=Math.min(It,Ie.count));let $t=It-Ve;if($t<0||$t===1/0)return;let Pi;Kt.setup(Z,te,xe,X,Ae);let We=He;if(Ae!==null&&(Pi=me.get(Ae),We=Ne,We.setIndex(Pi)),Z.isMesh)te.wireframe===!0?(b.setLineWidth(te.wireframeLinewidth*B()),We.setMode(V.LINES)):We.setMode(V.TRIANGLES);else if(Z.isLine){let Ke=te.linewidth;Ke===void 0&&(Ke=1),b.setLineWidth(Ke*B()),Z.isLineSegments?We.setMode(V.LINES):Z.isLineLoop?We.setMode(V.LINE_LOOP):We.setMode(V.LINE_STRIP)}else Z.isPoints?We.setMode(V.POINTS):Z.isSprite&&We.setMode(V.TRIANGLES);if(Z.isBatchedMesh)We.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else if(Z.isInstancedMesh)We.renderInstances(Ve,$t,Z.count);else if(X.isInstancedBufferGeometry){let Ke=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Et=Math.min(X.instanceCount,Ke);We.renderInstances(Ve,$t,Et)}else We.render(Ve,$t)},this.compile=function(E,k,X=null){X===null&&(X=E),g=ke.get(X),g.init(),_.push(g),X.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),E!==X&&E.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),g.setupLights(v._useLegacyLights);let te=new Set;return E.traverse(function(Z){let ce=Z.material;if(ce)if(Array.isArray(ce))for(let ve=0;ve<ce.length;ve++){let xe=ce[ve];cl(xe,X,Z),te.add(xe)}else cl(ce,X,Z),te.add(ce)}),_.pop(),g=null,te},this.compileAsync=function(E,k,X=null){let te=this.compile(E,k,X);return new Promise(Z=>{function ce(){te.forEach(function(ve){U.get(ve).currentProgram.isReady()&&te.delete(ve)}),te.size!==0?setTimeout(ce,10):Z(E)}G.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let ta=null;function ul(){Ci.stop()}function dl(){Ci.start()}let Ci=new Ac;function pl(E,k,X,te){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)g.pushLight(E),E.castShadow&&g.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ge.intersectsSprite(E)){te&&C.setFromMatrixPosition(E.matrixWorld).applyMatrix4(F);let ce=fe.update(E),ve=E.material;ve.visible&&y.push(E,ce,ve,X,C.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ge.intersectsObject(E))){let ce=fe.update(E),ve=E.material;if(te&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),C.copy(E.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),C.copy(ce.boundingSphere.center)),C.applyMatrix4(E.matrixWorld).applyMatrix4(F)),Array.isArray(ve)){let xe=ce.groups;for(let Ae=0,Ce=xe.length;Ae<Ce;Ae++){let Pe=xe[Ae],Ie=ve[Pe.materialIndex];Ie&&Ie.visible&&y.push(E,ce,Ie,X,C.z,Pe)}}else ve.visible&&y.push(E,ce,ve,X,C.z,null)}}let Z=E.children;for(let ce=0,ve=Z.length;ce<ve;ce++)pl(Z[ce],k,X,te)}function ml(E,k,X,te){let Z=E.opaque,ce=E.transmissive,ve=E.transparent;g.setupLightsView(X),ae===!0&&pe.setGlobalState(v.clippingPlanes,X),ce.length>0&&function(xe,Ae,Ce,Pe){if((Ce.isScene===!0?Ce.overrideMaterial:null)!==null)return;let Ve=O.isWebGL2;M===null&&(M=new hi(1,1,{generateMipmaps:!0,type:G.has("EXT_color_buffer_half_float")?lr:Xi,minFilter:Sn,samples:Ve?4:0})),v.getDrawingBufferSize(N),Ve?M.setSize(N.x,N.y):M.setSize(io(N.x),io(N.y));let It=v.getRenderTarget();v.setRenderTarget(M),v.getClearColor(H),J=v.getClearAlpha(),J<1&&v.setClearColor(16777215,.5),v.clear();let $t=v.toneMapping;v.toneMapping=Mi,Pr(xe,Ce,Pe),ne.updateMultisampleRenderTarget(M),ne.updateRenderTargetMipmap(M);let Pi=!1;for(let We=0,Ke=Ae.length;We<Ke;We++){let Et=Ae[We],vt=Et.object,Ue=Et.geometry,Re=Et.material,Vn=Et.group;if(Re.side===2&&vt.layers.test(Pe.layers)){let ia=Re.side;Re.side=xt,Re.needsUpdate=!0,fl(vt,Ce,Pe,Ue,Re,Vn),Re.side=ia,Re.needsUpdate=!0,Pi=!0}}Pi===!0&&(ne.updateMultisampleRenderTarget(M),ne.updateRenderTargetMipmap(M)),v.setRenderTarget(It),v.setClearColor(H,J),v.toneMapping=$t}(Z,ce,k,X),te&&b.viewport(z.copy(te)),Z.length>0&&Pr(Z,k,X),ce.length>0&&Pr(ce,k,X),ve.length>0&&Pr(ve,k,X),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function Pr(E,k,X){let te=k.isScene===!0?k.overrideMaterial:null;for(let Z=0,ce=E.length;Z<ce;Z++){let ve=E[Z],xe=ve.object,Ae=ve.geometry,Ce=te===null?ve.material:te,Pe=ve.group;xe.layers.test(X.layers)&&fl(xe,k,X,Ae,Ce,Pe)}}function fl(E,k,X,te,Z,ce){E.onBeforeRender(v,k,X,te,Z,ce),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),Z.onBeforeRender(v,k,X,te,E,ce),Z.transparent===!0&&Z.side===2&&Z.forceSinglePass===!1?(Z.side=xt,Z.needsUpdate=!0,v.renderBufferDirect(X,k,te,Z,E,ce),Z.side=Si,Z.needsUpdate=!0,v.renderBufferDirect(X,k,te,Z,E,ce),Z.side=2):v.renderBufferDirect(X,k,te,Z,E,ce),E.onAfterRender(v,k,X,te,Z,ce)}function Lr(E,k,X){k.isScene!==!0&&(k=L);let te=U.get(E),Z=g.state.lights,ce=g.state.shadowsArray,ve=Z.state.version,xe=ue.getParameters(E,Z.state,ce,k,X),Ae=ue.getProgramCacheKey(xe),Ce=te.programs;te.environment=E.isMeshStandardMaterial?k.environment:null,te.fog=k.fog,te.envMap=(E.isMeshStandardMaterial?se:Q).get(E.envMap||te.environment),te.envMapRotation=te.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Ce===void 0&&(E.addEventListener("dispose",hl),Ce=new Map,te.programs=Ce);let Pe=Ce.get(Ae);if(Pe!==void 0){if(te.currentProgram===Pe&&te.lightsStateVersion===ve)return vl(E,xe),Pe}else xe.uniforms=ue.getUniforms(E),E.onBuild(X,xe,v),E.onBeforeCompile(xe,v),Pe=ue.acquireProgram(xe,Ae),Ce.set(Ae,Pe),te.uniforms=xe.uniforms;let Ie=te.uniforms;return(E.isShaderMaterial||E.isRawShaderMaterial)&&E.clipping!==!0||(Ie.clippingPlanes=pe.uniform),vl(E,xe),te.needsLights=function(Ve){return Ve.isMeshLambertMaterial||Ve.isMeshToonMaterial||Ve.isMeshPhongMaterial||Ve.isMeshStandardMaterial||Ve.isShadowMaterial||Ve.isShaderMaterial&&Ve.lights===!0}(E),te.lightsStateVersion=ve,te.needsLights&&(Ie.ambientLightColor.value=Z.state.ambient,Ie.lightProbe.value=Z.state.probe,Ie.directionalLights.value=Z.state.directional,Ie.directionalLightShadows.value=Z.state.directionalShadow,Ie.spotLights.value=Z.state.spot,Ie.spotLightShadows.value=Z.state.spotShadow,Ie.rectAreaLights.value=Z.state.rectArea,Ie.ltc_1.value=Z.state.rectAreaLTC1,Ie.ltc_2.value=Z.state.rectAreaLTC2,Ie.pointLights.value=Z.state.point,Ie.pointLightShadows.value=Z.state.pointShadow,Ie.hemisphereLights.value=Z.state.hemi,Ie.directionalShadowMap.value=Z.state.directionalShadowMap,Ie.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Ie.spotShadowMap.value=Z.state.spotShadowMap,Ie.spotLightMatrix.value=Z.state.spotLightMatrix,Ie.spotLightMap.value=Z.state.spotLightMap,Ie.pointShadowMap.value=Z.state.pointShadowMap,Ie.pointShadowMatrix.value=Z.state.pointShadowMatrix),te.currentProgram=Pe,te.uniformsList=null,Pe}function gl(E){if(E.uniformsList===null){let k=E.currentProgram.getUniforms();E.uniformsList=Tn.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function vl(E,k){let X=U.get(E);X.outputColorSpace=k.outputColorSpace,X.batching=k.batching,X.instancing=k.instancing,X.instancingColor=k.instancingColor,X.instancingMorph=k.instancingMorph,X.skinning=k.skinning,X.morphTargets=k.morphTargets,X.morphNormals=k.morphNormals,X.morphColors=k.morphColors,X.morphTargetsCount=k.morphTargetsCount,X.numClippingPlanes=k.numClippingPlanes,X.numIntersection=k.numClipIntersection,X.vertexAlphas=k.vertexAlphas,X.vertexTangents=k.vertexTangents,X.toneMapping=k.toneMapping}Ci.setAnimationLoop(function(E){ta&&ta(E)}),typeof self<"u"&&Ci.setContext(self),this.setAnimationLoop=function(E){ta=E,ht.setAnimationLoop(E),E===null?Ci.stop():Ci.start()},ht.addEventListener("sessionstart",ul),ht.addEventListener("sessionend",dl),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(x===!0)return;E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ht.enabled===!0&&ht.isPresenting===!0&&(ht.cameraAutoUpdate===!0&&ht.updateCamera(k),k=ht.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,k,S),g=ke.get(E,_.length),g.init(),_.push(g),F.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),ge.setFromProjectionMatrix(F),A=this.localClippingEnabled,ae=pe.init(this.clippingPlanes,A),y=we.get(E,f.length),y.init(),f.push(y),pl(E,k,0,v.sortObjects),y.finish(),v.sortObjects===!0&&y.sort(W,$),this.info.render.frame++,ae===!0&&pe.beginShadows();let X=g.state.shadowsArray;if(Le.render(X,E,k),ae===!0&&pe.endShadows(),this.info.autoReset===!0&&this.info.reset(),ht.enabled!==!1&&ht.isPresenting!==!1&&ht.hasDepthSensing()!==!1||qe.render(y,E),g.setupLights(v._useLegacyLights),k.isArrayCamera){let te=k.cameras;for(let Z=0,ce=te.length;Z<ce;Z++){let ve=te[Z];ml(y,E,ve,ve.viewport)}}else ml(y,E,k);S!==null&&(ne.updateMultisampleRenderTarget(S),ne.updateRenderTargetMipmap(S)),E.isScene===!0&&E.onAfterRender(v,E,k),Kt.resetDefaultState(),I=-1,D=null,_.pop(),g=_.length>0?_[_.length-1]:null,f.pop(),y=f.length>0?f[f.length-1]:null},this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(E,k,X){U.get(E.texture).__webglTexture=k,U.get(E.depthTexture).__webglTexture=X;let te=U.get(E);te.__hasExternalTextures=!0,te.__autoAllocateDepthBuffer=X===void 0,te.__autoAllocateDepthBuffer||G.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),te.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,k){let X=U.get(E);X.__webglFramebuffer=k,X.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,X=0){S=E,R=k,T=X;let te=!0,Z=null,ce=!1,ve=!1;if(E){let xe=U.get(E);xe.__useDefaultFramebuffer!==void 0?(b.bindFramebuffer(V.FRAMEBUFFER,null),te=!1):xe.__webglFramebuffer===void 0?ne.setupRenderTarget(E):xe.__hasExternalTextures&&ne.rebindTextures(E,U.get(E.texture).__webglTexture,U.get(E.depthTexture).__webglTexture);let Ae=E.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(ve=!0);let Ce=U.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Z=Array.isArray(Ce[k])?Ce[k][X]:Ce[k],ce=!0):Z=O.isWebGL2&&E.samples>0&&ne.useMultisampledRTT(E)===!1?U.get(E).__webglMultisampledFramebuffer:Array.isArray(Ce)?Ce[X]:Ce,z.copy(E.viewport),q.copy(E.scissor),P=E.scissorTest}else z.copy(oe).multiplyScalar(K).floor(),q.copy(j).multiplyScalar(K).floor(),P=ee;if(b.bindFramebuffer(V.FRAMEBUFFER,Z)&&O.drawBuffers&&te&&b.drawBuffers(E,Z),b.viewport(z),b.scissor(q),b.setScissorTest(P),ce){let xe=U.get(E.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+k,xe.__webglTexture,X)}else if(ve){let xe=U.get(E.texture),Ae=k||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,xe.__webglTexture,X||0,Ae)}I=-1},this.readRenderTargetPixels=function(E,k,X,te,Z,ce,ve){if(!E||!E.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=U.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ve!==void 0&&(xe=xe[ve]),xe){b.bindFramebuffer(V.FRAMEBUFFER,xe);try{let Ae=E.texture,Ce=Ae.format,Pe=Ae.type;if(Ce!==oi&&wt.convert(Ce)!==V.getParameter(V.IMPLEMENTATION_COLOR_READ_FORMAT))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");let Ie=Pe===lr&&(G.has("EXT_color_buffer_half_float")||O.isWebGL2&&G.has("EXT_color_buffer_float"));if(!(Pe===Xi||wt.convert(Pe)===V.getParameter(V.IMPLEMENTATION_COLOR_READ_TYPE)||Pe===Wt&&(O.isWebGL2||G.has("OES_texture_float")||G.has("WEBGL_color_buffer_float"))||Ie))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");k>=0&&k<=E.width-te&&X>=0&&X<=E.height-Z&&V.readPixels(k,X,te,Z,wt.convert(Ce),wt.convert(Pe),ce)}finally{let Ae=S!==null?U.get(S).__webglFramebuffer:null;b.bindFramebuffer(V.FRAMEBUFFER,Ae)}}},this.copyFramebufferToTexture=function(E,k,X=0){let te=Math.pow(2,-X),Z=Math.floor(k.image.width*te),ce=Math.floor(k.image.height*te);ne.setTexture2D(k,0),V.copyTexSubImage2D(V.TEXTURE_2D,X,0,0,E.x,E.y,Z,ce),b.unbindTexture()},this.copyTextureToTexture=function(E,k,X,te=0){let Z=k.image.width,ce=k.image.height,ve=wt.convert(X.format),xe=wt.convert(X.type);ne.setTexture2D(X,0),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,X.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,X.unpackAlignment),k.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,te,E.x,E.y,Z,ce,ve,xe,k.image.data):k.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,te,E.x,E.y,k.mipmaps[0].width,k.mipmaps[0].height,ve,k.mipmaps[0].data):V.texSubImage2D(V.TEXTURE_2D,te,E.x,E.y,ve,xe,k.image),te===0&&X.generateMipmaps&&V.generateMipmap(V.TEXTURE_2D),b.unbindTexture()},this.copyTextureToTexture3D=function(E,k,X,te,Z=0){if(v.isWebGL1Renderer)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");let ce=Math.round(E.max.x-E.min.x),ve=Math.round(E.max.y-E.min.y),xe=E.max.z-E.min.z+1,Ae=wt.convert(te.format),Ce=wt.convert(te.type),Pe;if(te.isData3DTexture)ne.setTexture3D(te,0),Pe=V.TEXTURE_3D;else{if(!te.isDataArrayTexture&&!te.isCompressedArrayTexture)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");ne.setTexture2DArray(te,0),Pe=V.TEXTURE_2D_ARRAY}V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,te.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,te.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,te.unpackAlignment);let Ie=V.getParameter(V.UNPACK_ROW_LENGTH),Ve=V.getParameter(V.UNPACK_IMAGE_HEIGHT),It=V.getParameter(V.UNPACK_SKIP_PIXELS),$t=V.getParameter(V.UNPACK_SKIP_ROWS),Pi=V.getParameter(V.UNPACK_SKIP_IMAGES),We=X.isCompressedTexture?X.mipmaps[Z]:X.image;V.pixelStorei(V.UNPACK_ROW_LENGTH,We.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,We.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,E.min.x),V.pixelStorei(V.UNPACK_SKIP_ROWS,E.min.y),V.pixelStorei(V.UNPACK_SKIP_IMAGES,E.min.z),X.isDataTexture||X.isData3DTexture?V.texSubImage3D(Pe,Z,k.x,k.y,k.z,ce,ve,xe,Ae,Ce,We.data):te.isCompressedArrayTexture?V.compressedTexSubImage3D(Pe,Z,k.x,k.y,k.z,ce,ve,xe,Ae,We.data):V.texSubImage3D(Pe,Z,k.x,k.y,k.z,ce,ve,xe,Ae,Ce,We),V.pixelStorei(V.UNPACK_ROW_LENGTH,Ie),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Ve),V.pixelStorei(V.UNPACK_SKIP_PIXELS,It),V.pixelStorei(V.UNPACK_SKIP_ROWS,$t),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Pi),Z===0&&te.generateMipmaps&&V.generateMipmap(Pe),b.unbindTexture()},this.initTexture=function(E){E.isCubeTexture?ne.setTextureCube(E,0):E.isData3DTexture?ne.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?ne.setTexture2DArray(E,0):ne.setTexture2D(E,0),b.unbindTexture()},this.resetState=function(){R=0,T=0,S=null,b.reset(),Kt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===il?"display-p3":"srgb",t.unpackColorSpace=Fe.workingColorSpace===Ks?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}},yo=class extends Nn{};yo.prototype.isWebGL1Renderer=!0;var Cs=class extends rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qt,this.environmentRotation=new qt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentRotation=this.environmentRotation.toArray(),t}},xo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=eo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=li()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return wc("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,s=this.stride;n<s;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=li()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=li()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},pt=new w,Ps=class r{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Xt(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Oe(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Oe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Oe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Oe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Oe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Xt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Xt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Xt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Xt(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Oe(t,this.array),i=Oe(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Oe(t,this.array),i=Oe(i,this.array),n=Oe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Oe(t,this.array),i=Oe(i,this.array),n=Oe(n,this.array),s=Oe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return new ot(new this.array.constructor(t),this.itemSize,this.normalized)}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},dr=class extends Yt{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Se(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},vn,Qn=new w,_n=new w,yn=new w,xn=new ie,er=new ie,Uc=new be,ts=new w,tr=new w,is=new w,Vh=new ie,Ba=new ie,Wh=new ie,Ls=class extends rt{constructor(e=new dr){if(super(),this.isSprite=!0,this.type="Sprite",vn===void 0){vn=new ze;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new xo(t,5);vn.setIndex([0,1,2,0,2,3]),vn.setAttribute("position",new Ps(i,3,0,!1)),vn.setAttribute("uv",new Ps(i,2,3,!1))}this.geometry=vn,this.material=e,this.center=new ie(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_n.setFromMatrixScale(this.matrixWorld),Uc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),yn.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_n.multiplyScalar(-yn.z);let i=this.material.rotation,n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));let a=this.center;ns(ts.set(-.5,-.5,0),yn,a,_n,n,s),ns(tr.set(.5,-.5,0),yn,a,_n,n,s),ns(is.set(.5,.5,0),yn,a,_n,n,s),Vh.set(0,0),Ba.set(1,0),Wh.set(1,1);let o=e.ray.intersectTriangle(ts,tr,is,!1,Qn);if(o===null&&(ns(tr.set(-.5,.5,0),yn,a,_n,n,s),Ba.set(0,1),o=e.ray.intersectTriangle(ts,is,tr,!1,Qn),o===null))return;let h=e.ray.origin.distanceTo(Qn);h<e.near||h>e.far||t.push({distance:h,point:Qn.clone(),uv:xi.getInterpolation(Qn,ts,tr,is,Vh,Ba,Wh,new ie),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ns(r,e,t,i,n,s){xn.subVectors(r,t).addScalar(.5).multiply(i),n!==void 0?(er.x=s*xn.x-n*xn.y,er.y=n*xn.x+s*xn.y):er.copy(xn),r.copy(e),r.x+=er.x,r.y+=er.y,r.applyMatrix4(Uc)}var Op=new w,Fp=new w;var zp=new w,Bp=new Je,kp=new Je,Hp=new w,Gp=new be,Vp=new w,Wp=new kt,Xp=new be,jp=new Yi;var Mo=class extends gt{constructor(e=null,t=1,i=1,n,s,a,o,h,l=1003,c=1003,u,d){super(null,a,o,h,l,c,n,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},qp=new be,Yp=new be;var Is=class extends ot{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Mn=new be,Xh=new be,rs=[],jh=new Mt,ap=new be,ir=new nt,nr=new kt,Us=class extends nt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Is(new Float32Array(16*i),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,ap)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Mt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Mn),jh.copy(e.boundingBox).applyMatrix4(Mn),this.boundingBox.union(jh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new kt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Mn),nr.copy(e.boundingSphere).applyMatrix4(Mn),this.boundingSphere.union(nr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,3*e)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,16*e)}getMorphAt(e,t){let i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,s=e*(i.length+1)+1;for(let a=0;a<i.length;a++)i[a]=n[s+a]}raycast(e,t){let i=this.matrixWorld,n=this.count;if(ir.geometry=this.geometry,ir.material=this.material,ir.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),nr.copy(this.boundingSphere),nr.applyMatrix4(i),e.ray.intersectsSphere(nr)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,Mn),Xh.multiplyMatrices(i,Mn),ir.matrixWorld=Xh,ir.raycast(e,rs);for(let a=0,o=rs.length;a<o;a++){let h=rs[a];h.instanceId=s,h.object=this,t.push(h)}rs.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Is(new Float32Array(3*this.instanceMatrix.count),3)),t.toArray(this.instanceColor.array,3*e)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,16*e)}setMorphAt(e,t){let i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Mo(new Float32Array(n*this.count),n,this.count,vc,Wt));let s=this.morphTexture.source.data.data,a=0;for(let l=0;l<i.length;l++)a+=i[l];let o=this.geometry.morphTargetsRelative?1:1-a,h=n*e;s[h]=o,s.set(i,h+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var bo=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t){let i=this.pool,n=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1});let s=i[this.index];n.push(s),this.index++,s.start=e.start,s.count=e.count,s.z=t}reset(){this.list.length=0,this.index=0}};var Zp=new be,Jp=new be,Kp=new be,$p=new be,Qp=new Un,em=new Mt,tm=new kt,im=new w,nm=new bo,rm=new nt;var On=class extends Yt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Se(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},qh=new w,Yh=new w,Zh=new be,ka=new Yi,ss=new kt,pr=class extends rt{constructor(e=new ze,t=new On){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let n=1,s=t.count;n<s;n++)qh.fromBufferAttribute(t,n-1),Yh.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=qh.distanceTo(Yh);e.setAttribute("lineDistance",new _e(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ss.copy(i.boundingSphere),ss.applyMatrix4(n),ss.radius+=s,e.ray.intersectsSphere(ss)===!1)return;Zh.copy(n).invert(),ka.copy(e.ray).applyMatrix4(Zh);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),h=o*o,l=new w,c=new w,u=new w,d=new w,p=this.isLineSegments?2:1,m=i.index,y=i.attributes.position;if(m!==null)for(let g=Math.max(0,a.start),f=Math.min(m.count,a.start+a.count)-1;g<f;g+=p){let _=m.getX(g),v=m.getX(g+1);if(l.fromBufferAttribute(y,_),c.fromBufferAttribute(y,v),ka.distanceSqToSegment(l,c,d,u)>h)continue;d.applyMatrix4(this.matrixWorld);let x=e.ray.origin.distanceTo(d);x<e.near||x>e.far||t.push({distance:x,point:u.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}else for(let g=Math.max(0,a.start),f=Math.min(y.count,a.start+a.count)-1;g<f;g+=p){if(l.fromBufferAttribute(y,g),c.fromBufferAttribute(y,g+1),ka.distanceSqToSegment(l,c,d,u)>h)continue;d.applyMatrix4(this.matrixWorld);let _=e.ray.origin.distanceTo(d);_<e.near||_>e.far||t.push({distance:_,point:u.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}},Jh=new w,Kh=new w,Ds=class extends pr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let n=0,s=t.count;n<s;n+=2)Jh.fromBufferAttribute(t,n),Kh.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+Jh.distanceTo(Kh);e.setAttribute("lineDistance",new _e(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var mr=class extends Yt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Se(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},$h=new be,So=new Yi,as=new kt,os=new w,Ns=class extends rt{constructor(e=new ze,t=new mr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),as.copy(i.boundingSphere),as.applyMatrix4(n),as.radius+=s,e.ray.intersectsSphere(as)===!1)return;$h.copy(n).invert(),So.copy(e.ray).applyMatrix4($h);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),h=o*o,l=i.index,c=i.attributes.position;if(l!==null)for(let u=Math.max(0,a.start),d=Math.min(l.count,a.start+a.count);u<d;u++){let p=l.getX(u);os.fromBufferAttribute(c,p),Qh(os,p,h,n,e,t,this)}else for(let u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);u<d;u++)os.fromBufferAttribute(c,u),Qh(os,u,h,n,e,t,this)}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}};function Qh(r,e,t,i,n,s,a){let o=So.distanceSqToPoint(r);if(o<t){let h=new w;So.closestPointToPoint(r,h),h.applyMatrix4(i);let l=n.ray.origin.distanceTo(h);if(l<n.near||l>n.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:h,index:e,face:null,object:a})}}var Os=class extends gt{constructor(e,t,i,n,s,a,o,h,l){super(e,t,i,n,s,a,o,h,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ct=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,n=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(n),t.push(s),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),n=0,s=i.length,a;a=t||e*i[s-1];let o,h=0,l=s-1;for(;h<=l;)if(n=Math.floor(h+(l-h)/2),o=i[n]-a,o<0)h=n+1;else{if(!(o>0)){l=n;break}l=n-1}if(n=l,i[n]===a)return n/(s-1);let c=i[n];return(n+(a-c)/(i[n+1]-c))/(s-1)}getTangent(e,t){let n=e-1e-4,s=e+1e-4;n<0&&(n=0),s>1&&(s=1);let a=this.getPoint(n),o=this.getPoint(s),h=t||(a.isVector2?new ie:new w);return h.copy(o).sub(a).normalize(),h}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new w,n=[],s=[],a=[],o=new w,h=new be;for(let p=0;p<=e;p++){let m=p/e;n[p]=this.getTangentAt(m,new w)}s[0]=new w,a[0]=new w;let l=Number.MAX_VALUE,c=Math.abs(n[0].x),u=Math.abs(n[0].y),d=Math.abs(n[0].z);c<=l&&(l=c,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(n[p-1],n[p]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(at(n[p-1].dot(n[p]),-1,1));s[p].applyMatrix4(h.makeRotationAxis(o,m))}a[p].crossVectors(n[p],s[p])}if(t===!0){let p=Math.acos(at(s[0].dot(s[e]),-1,1));p/=e,n[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let m=1;m<=e;m++)s[m].applyMatrix4(h.makeRotationAxis(n[m],p*m)),a[m].crossVectors(n[m],s[m])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},fr=class extends Ct{constructor(e=0,t=0,i=1,n=1,s=0,a=2*Math.PI,o=!1,h=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=h}getPoint(e,t=new ie){let i=t,n=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(s=a?0:n),this.aClockwise!==!0||a||(s===n?s=-n:s-=n);let o=this.aStartAngle+e*s,h=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let c=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=h-this.aX,p=l-this.aY;h=d*c-p*u+this.aX,l=d*u+p*c+this.aY}return i.set(h,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},wo=class extends fr{constructor(e,t,i,n,s,a){super(e,t,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function rl(){let r=0,e=0,t=0,i=0;function n(s,a,o,h){r=s,e=o,t=-3*s+3*a-2*o-h,i=2*s-2*a+o+h}return{initCatmullRom:function(s,a,o,h,l){n(a,o,l*(o-s),l*(h-a))},initNonuniformCatmullRom:function(s,a,o,h,l,c,u){let d=(a-s)/l-(o-s)/(l+c)+(o-a)/c,p=(o-a)/c-(h-a)/(c+u)+(h-o)/u;d*=c,p*=c,n(a,o,d,p)},calc:function(s){let a=s*s;return r+e*s+t*a+i*(a*s)}}}var ls=new w,Ha=new rl,Ga=new rl,Va=new rl,Eo=class extends Ct{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new w){let i=t,n=this.points,s=n.length,a=(s-(this.closed?0:1))*e,o,h,l=Math.floor(a),c=a-l;this.closed?l+=l>0?0:(Math.floor(Math.abs(l)/s)+1)*s:c===0&&l===s-1&&(l=s-2,c=1),this.closed||l>0?o=n[(l-1)%s]:(ls.subVectors(n[0],n[1]).add(n[0]),o=ls);let u=n[l%s],d=n[(l+1)%s];if(this.closed||l+2<s?h=n[(l+2)%s]:(ls.subVectors(n[s-1],n[s-2]).add(n[s-1]),h=ls),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(o.distanceToSquared(u),p),y=Math.pow(u.distanceToSquared(d),p),g=Math.pow(d.distanceToSquared(h),p);y<1e-4&&(y=1),m<1e-4&&(m=y),g<1e-4&&(g=y),Ha.initNonuniformCatmullRom(o.x,u.x,d.x,h.x,m,y,g),Ga.initNonuniformCatmullRom(o.y,u.y,d.y,h.y,m,y,g),Va.initNonuniformCatmullRom(o.z,u.z,d.z,h.z,m,y,g)}else this.curveType==="catmullrom"&&(Ha.initCatmullRom(o.x,u.x,d.x,h.x,this.tension),Ga.initCatmullRom(o.y,u.y,d.y,h.y,this.tension),Va.initCatmullRom(o.z,u.z,d.z,h.z,this.tension));return i.set(Ha.calc(c),Ga.calc(c),Va.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new w().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function ec(r,e,t,i,n){let s=.5*(i-e),a=.5*(n-t),o=r*r;return(2*t-2*i+s+a)*(r*o)+(-3*t+3*i-2*s-a)*o+s*r+t}function sr(r,e,t,i){return function(n,s){let a=1-n;return a*a*s}(r,e)+function(n,s){return 2*(1-n)*n*s}(r,t)+function(n,s){return n*n*s}(r,i)}function ar(r,e,t,i,n){return function(s,a){let o=1-s;return o*o*o*a}(r,e)+function(s,a){let o=1-s;return 3*o*o*s*a}(r,t)+function(s,a){return 3*(1-s)*s*s*a}(r,i)+function(s,a){return s*s*s*a}(r,n)}var Fs=class extends Ct{constructor(e=new ie,t=new ie,i=new ie,n=new ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new ie){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(ar(e,n.x,s.x,a.x,o.x),ar(e,n.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},To=class extends Ct{constructor(e=new w,t=new w,i=new w,n=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new w){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(ar(e,n.x,s.x,a.x,o.x),ar(e,n.y,s.y,a.y,o.y),ar(e,n.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zs=class extends Ct{constructor(e=new ie,t=new ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ie){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ao=class extends Ct{constructor(e=new w,t=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new w){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new w){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Bs=class extends Ct{constructor(e=new ie,t=new ie,i=new ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ie){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(sr(e,n.x,s.x,a.x),sr(e,n.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ks=class extends Ct{constructor(e=new w,t=new w,i=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new w){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(sr(e,n.x,s.x,a.x),sr(e,n.y,s.y,a.y),sr(e,n.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Hs=class extends Ct{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ie){let i=t,n=this.points,s=(n.length-1)*e,a=Math.floor(s),o=s-a,h=n[a===0?a:a-1],l=n[a],c=n[a>n.length-2?n.length-1:a+1],u=n[a>n.length-3?n.length-1:a+2];return i.set(ec(o,h.x,l.x,c.x,u.x),ec(o,h.y,l.y,c.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new ie().fromArray(n))}return this}},Gs=Object.freeze({__proto__:null,ArcCurve:wo,CatmullRomCurve3:Eo,CubicBezierCurve:Fs,CubicBezierCurve3:To,EllipseCurve:fr,LineCurve:zs,LineCurve3:Ao,QuadraticBezierCurve:Bs,QuadraticBezierCurve3:ks,SplineCurve:Hs}),Ro=class extends Ct{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Gs[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),n=this.getCurveLengths(),s=0;for(;s<n.length;){if(n[s]>=i){let a=n[s]-i,o=this.curves[s],h=o.getLength(),l=h===0?0:1-a/h;return o.getPointAt(l,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let n=0,s=this.curves;n<s.length;n++){let a=s[n],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,h=a.getPoints(o);for(let l=0;l<h.length;l++){let c=h[l];i&&i.equals(c)||(t.push(c),i=c)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(new Gs[n.type]().fromJSON(n))}return this}},gr=class extends Ro{constructor(e){super(),this.type="Path",this.currentPoint=new ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new zs(this.currentPoint.clone(),new ie(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){let s=new Bs(this.currentPoint.clone(),new ie(e,t),new ie(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,s,a){let o=new Fs(this.currentPoint.clone(),new ie(e,t),new ie(i,n),new ie(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Hs(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,s,a){let o=this.currentPoint.x,h=this.currentPoint.y;return this.absarc(e+o,t+h,i,n,s,a),this}absarc(e,t,i,n,s,a){return this.absellipse(e,t,i,i,n,s,a),this}ellipse(e,t,i,n,s,a,o,h){let l=this.currentPoint.x,c=this.currentPoint.y;return this.absellipse(e+l,t+c,i,n,s,a,o,h),this}absellipse(e,t,i,n,s,a,o,h){let l=new fr(e,t,i,n,s,a,o,h);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let c=l.getPoint(1);return this.currentPoint.copy(c),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Vs=class r extends ze{constructor(e=[new ie(0,-.5),new ie(.5,0),new ie(0,.5)],t=12,i=0,n=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=at(n,0,2*Math.PI);let s=[],a=[],o=[],h=[],l=[],c=1/t,u=new w,d=new ie,p=new w,m=new w,y=new w,g=0,f=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:g=e[_+1].x-e[_].x,f=e[_+1].y-e[_].y,p.x=1*f,p.y=-g,p.z=0*f,y.copy(p),p.normalize(),h.push(p.x,p.y,p.z);break;case e.length-1:h.push(y.x,y.y,y.z);break;default:g=e[_+1].x-e[_].x,f=e[_+1].y-e[_].y,p.x=1*f,p.y=-g,p.z=0*f,m.copy(p),p.x+=y.x,p.y+=y.y,p.z+=y.z,p.normalize(),h.push(p.x,p.y,p.z),y.copy(m)}for(let _=0;_<=t;_++){let v=i+_*c*n,x=Math.sin(v),R=Math.cos(v);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*x,u.y=e[T].y,u.z=e[T].x*R,a.push(u.x,u.y,u.z),d.x=_/t,d.y=T/(e.length-1),o.push(d.x,d.y);let S=h[3*T+0]*x,I=h[3*T+1],D=h[3*T+0]*R;l.push(S,I,D)}}for(let _=0;_<t;_++)for(let v=0;v<e.length-1;v++){let x=v+_*e.length,R=x,T=x+e.length,S=x+e.length+1,I=x+1;s.push(R,T,I),s.push(S,I,T)}this.setIndex(s),this.setAttribute("position",new _e(a,3)),this.setAttribute("uv",new _e(o,2)),this.setAttribute("normal",new _e(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},Co=class r extends Vs{constructor(e=1,t=1,i=4,n=8){let s=new gr;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(i),n),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:n}}static fromJSON(e){return new r(e.radius,e.length,e.capSegments,e.radialSegments)}},Po=class r extends ze{constructor(e=1,t=32,i=0,n=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);let s=[],a=[],o=[],h=[],l=new w,c=new ie;a.push(0,0,0),o.push(0,0,1),h.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=i+u/t*n;l.x=e*Math.cos(p),l.y=e*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),c.x=(a[d]/e+1)/2,c.y=(a[d+1]/e+1)/2,h.push(c.x,c.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new _e(a,3)),this.setAttribute("normal",new _e(o,3)),this.setAttribute("uv",new _e(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Jt=class r extends ze{constructor(e=1,t=1,i=1,n=32,s=1,a=!1,o=0,h=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:h};let l=this;n=Math.floor(n),s=Math.floor(s);let c=[],u=[],d=[],p=[],m=0,y=[],g=i/2,f=0;function _(v){let x=m,R=new ie,T=new w,S=0,I=v===!0?e:t,D=v===!0?1:-1;for(let q=1;q<=n;q++)u.push(0,g*D,0),d.push(0,D,0),p.push(.5,.5),m++;let z=m;for(let q=0;q<=n;q++){let P=q/n*h+o,H=Math.cos(P),J=Math.sin(P);T.x=I*J,T.y=g*D,T.z=I*H,u.push(T.x,T.y,T.z),d.push(0,D,0),R.x=.5*H+.5,R.y=.5*J*D+.5,p.push(R.x,R.y),m++}for(let q=0;q<n;q++){let P=x+q,H=z+q;v===!0?c.push(H,H+1,P):c.push(H+1,H,P),S+=3}l.addGroup(f,S,v===!0?1:2),f+=S}(function(){let v=new w,x=new w,R=0,T=(t-e)/i;for(let S=0;S<=s;S++){let I=[],D=S/s,z=D*(t-e)+e;for(let q=0;q<=n;q++){let P=q/n,H=P*h+o,J=Math.sin(H),re=Math.cos(H);x.x=z*J,x.y=-D*i+g,x.z=z*re,u.push(x.x,x.y,x.z),v.set(J,T,re).normalize(),d.push(v.x,v.y,v.z),p.push(P,1-D),I.push(m++)}y.push(I)}for(let S=0;S<n;S++)for(let I=0;I<s;I++){let D=y[I][S],z=y[I+1][S],q=y[I+1][S+1],P=y[I][S+1];c.push(D,z,P),c.push(z,q,P),R+=6}l.addGroup(f,R,0),f+=R})(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(c),this.setAttribute("position",new _e(u,3)),this.setAttribute("normal",new _e(d,3)),this.setAttribute("uv",new _e(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ui=class r extends Jt{constructor(e=1,t=1,i=32,n=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Zi=class r extends ze{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};let s=[],a=[];function o(d,p,m,y){let g=y+1,f=[];for(let _=0;_<=g;_++){f[_]=[];let v=d.clone().lerp(m,_/g),x=p.clone().lerp(m,_/g),R=g-_;for(let T=0;T<=R;T++)f[_][T]=T===0&&_===g?v:v.clone().lerp(x,T/R)}for(let _=0;_<g;_++)for(let v=0;v<2*(g-_)-1;v++){let x=Math.floor(v/2);v%2==0?(h(f[_][x+1]),h(f[_+1][x]),h(f[_][x])):(h(f[_][x+1]),h(f[_+1][x+1]),h(f[_+1][x]))}}function h(d){s.push(d.x,d.y,d.z)}function l(d,p){let m=3*d;p.x=e[m+0],p.y=e[m+1],p.z=e[m+2]}function c(d,p,m,y){y<0&&d.x===1&&(a[p]=d.x-1),m.x===0&&m.z===0&&(a[p]=y/2/Math.PI+.5)}function u(d){return Math.atan2(d.z,-d.x)}(function(d){let p=new w,m=new w,y=new w;for(let g=0;g<t.length;g+=3)l(t[g+0],p),l(t[g+1],m),l(t[g+2],y),o(p,m,y,d)})(n),function(d){let p=new w;for(let m=0;m<s.length;m+=3)p.x=s[m+0],p.y=s[m+1],p.z=s[m+2],p.normalize().multiplyScalar(d),s[m+0]=p.x,s[m+1]=p.y,s[m+2]=p.z}(i),function(){let d=new w;for(let m=0;m<s.length;m+=3){d.x=s[m+0],d.y=s[m+1],d.z=s[m+2];let y=u(d)/2/Math.PI+.5,g=(p=d,Math.atan2(-p.y,Math.sqrt(p.x*p.x+p.z*p.z))/Math.PI+.5);a.push(y,1-g)}var p;(function(){let m=new w,y=new w,g=new w,f=new w,_=new ie,v=new ie,x=new ie;for(let R=0,T=0;R<s.length;R+=9,T+=6){m.set(s[R+0],s[R+1],s[R+2]),y.set(s[R+3],s[R+4],s[R+5]),g.set(s[R+6],s[R+7],s[R+8]),_.set(a[T+0],a[T+1]),v.set(a[T+2],a[T+3]),x.set(a[T+4],a[T+5]),f.copy(m).add(y).add(g).divideScalar(3);let S=u(f);c(_,T+0,m,S),c(v,T+2,y,S),c(x,T+4,g,S)}})(),function(){for(let m=0;m<a.length;m+=6){let y=a[m+0],g=a[m+2],f=a[m+4],_=Math.max(y,g,f),v=Math.min(y,g,f);_>.9&&v<.1&&(y<.2&&(a[m+0]+=1),g<.2&&(a[m+2]+=1),f<.2&&(a[m+4]+=1))}}()}(),this.setAttribute("position",new _e(s,3)),this.setAttribute("normal",new _e(s.slice(),3)),this.setAttribute("uv",new _e(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},vr=class r extends Zi{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,n=1/i;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},hs=new w,cs=new w,Wa=new w,us=new xi,Lo=class extends ze{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=Math.pow(10,4),s=Math.cos(fs*t),a=e.getIndex(),o=e.getAttribute("position"),h=a?a.count:o.count,l=[0,0,0],c=["a","b","c"],u=new Array(3),d={},p=[];for(let m=0;m<h;m+=3){a?(l[0]=a.getX(m),l[1]=a.getX(m+1),l[2]=a.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);let{a:y,b:g,c:f}=us;if(y.fromBufferAttribute(o,l[0]),g.fromBufferAttribute(o,l[1]),f.fromBufferAttribute(o,l[2]),us.getNormal(Wa),u[0]=`${Math.round(y.x*n)},${Math.round(y.y*n)},${Math.round(y.z*n)}`,u[1]=`${Math.round(g.x*n)},${Math.round(g.y*n)},${Math.round(g.z*n)}`,u[2]=`${Math.round(f.x*n)},${Math.round(f.y*n)},${Math.round(f.z*n)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let _=0;_<3;_++){let v=(_+1)%3,x=u[_],R=u[v],T=us[c[_]],S=us[c[v]],I=`${x}_${R}`,D=`${R}_${x}`;D in d&&d[D]?(Wa.dot(d[D].normal)<=s&&(p.push(T.x,T.y,T.z),p.push(S.x,S.y,S.z)),d[D]=null):I in d||(d[I]={index0:l[_],index1:l[v],normal:Wa.clone()})}}for(let m in d)if(d[m]){let{index0:y,index1:g}=d[m];hs.fromBufferAttribute(o,y),cs.fromBufferAttribute(o,g),p.push(hs.x,hs.y,hs.z),p.push(cs.x,cs.y,cs.z)}this.setAttribute("position",new _e(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Fn=class extends gr{constructor(e){super(e),this.uuid=li(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(new gr().fromJSON(n))}return this}},op=function(r,e,t=2){let i=e&&e.length,n=i?e[0]*t:r.length,s=tc(r,0,n,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,h,l,c,u,d,p;if(i&&(s=function(m,y,g,f){let _=[],v,x,R,T,S;for(v=0,x=y.length;v<x;v++)R=y[v]*f,T=v<x-1?y[v+1]*f:m.length,S=tc(m,R,T,f,!1),S===S.next&&(S.steiner=!0),_.push(fp(S));for(_.sort(dp),v=0;v<_.length;v++)g=pp(_[v],g);return g}(r,e,s,t)),r.length>80*t){o=l=r[0],h=c=r[1];for(let m=t;m<n;m+=t)u=r[m],d=r[m+1],u<o&&(o=u),d<h&&(h=d),u>l&&(l=u),d>c&&(c=d);p=Math.max(l-o,c-h),p=p!==0?32767/p:0}return _r(s,a,t,o,h,p,0),a};function tc(r,e,t,i,n){let s,a;if(n===function(o,h,l,c){let u=0;for(let d=h,p=l-c;d<l;d+=c)u+=(o[p]-o[d])*(o[d+1]+o[p+1]),p=d;return u}(r,e,t,i)>0)for(s=e;s<t;s+=i)a=ic(s,r[s],r[s+1],a);else for(s=t-i;s>=e;s-=i)a=ic(s,r[s],r[s+1],a);return a&&Qs(a,a.next)&&(xr(a),a=a.next),a}function Ji(r,e){if(!r)return r;e||(e=r);let t,i=r;do if(t=!1,i.steiner||!Qs(i,i.next)&&Xe(i.prev,i,i.next)!==0)i=i.next;else{if(xr(i),i=e=i.prev,i===i.next)break;t=!0}while(t||i!==e);return e}function _r(r,e,t,i,n,s,a){if(!r)return;!a&&s&&function(c,u,d,p){let m=c;do m.z===0&&(m.z=Io(m.x,m.y,u,d,p)),m.prevZ=m.prev,m.nextZ=m.next,m=m.next;while(m!==c);m.prevZ.nextZ=null,m.prevZ=null,function(y){let g,f,_,v,x,R,T,S,I=1;do{for(f=y,y=null,x=null,R=0;f;){for(R++,_=f,T=0,g=0;g<I&&(T++,_=_.nextZ,_);g++);for(S=I;T>0||S>0&&_;)T!==0&&(S===0||!_||f.z<=_.z)?(v=f,f=f.nextZ,T--):(v=_,_=_.nextZ,S--),x?x.nextZ=v:y=v,v.prevZ=x,x=v;f=_}x.nextZ=null,I*=2}while(R>1)}(m)}(r,i,n,s);let o,h,l=r;for(;r.prev!==r.next;)if(o=r.prev,h=r.next,s?hp(r,i,n,s):lp(r))e.push(o.i/t|0),e.push(r.i/t|0),e.push(h.i/t|0),xr(r),r=h.next,l=h.next;else if((r=h)===l){a?a===1?_r(r=cp(Ji(r),e,t),e,t,i,n,s,2):a===2&&up(r,e,t,i,n,s):_r(Ji(r),e,t,i,n,s,1);break}}function lp(r){let e=r.prev,t=r,i=r.next;if(Xe(e,t,i)>=0)return!1;let n=e.x,s=t.x,a=i.x,o=e.y,h=t.y,l=i.y,c=n<s?n<a?n:a:s<a?s:a,u=o<h?o<l?o:l:h<l?h:l,d=n>s?n>a?n:a:s>a?s:a,p=o>h?o>l?o:l:h>l?h:l,m=i.next;for(;m!==e;){if(m.x>=c&&m.x<=d&&m.y>=u&&m.y<=p&&wn(n,o,s,h,a,l,m.x,m.y)&&Xe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function hp(r,e,t,i){let n=r.prev,s=r,a=r.next;if(Xe(n,s,a)>=0)return!1;let o=n.x,h=s.x,l=a.x,c=n.y,u=s.y,d=a.y,p=o<h?o<l?o:l:h<l?h:l,m=c<u?c<d?c:d:u<d?u:d,y=o>h?o>l?o:l:h>l?h:l,g=c>u?c>d?c:d:u>d?u:d,f=Io(p,m,e,t,i),_=Io(y,g,e,t,i),v=r.prevZ,x=r.nextZ;for(;v&&v.z>=f&&x&&x.z<=_;){if(v.x>=p&&v.x<=y&&v.y>=m&&v.y<=g&&v!==n&&v!==a&&wn(o,c,h,u,l,d,v.x,v.y)&&Xe(v.prev,v,v.next)>=0||(v=v.prevZ,x.x>=p&&x.x<=y&&x.y>=m&&x.y<=g&&x!==n&&x!==a&&wn(o,c,h,u,l,d,x.x,x.y)&&Xe(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=y&&v.y>=m&&v.y<=g&&v!==n&&v!==a&&wn(o,c,h,u,l,d,v.x,v.y)&&Xe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;x&&x.z<=_;){if(x.x>=p&&x.x<=y&&x.y>=m&&x.y<=g&&x!==n&&x!==a&&wn(o,c,h,u,l,d,x.x,x.y)&&Xe(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function cp(r,e,t){let i=r;do{let n=i.prev,s=i.next.next;!Qs(n,s)&&Dc(n,i,i.next,s)&&yr(n,s)&&yr(s,n)&&(e.push(n.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),xr(i),xr(i.next),i=r=s),i=i.next}while(i!==r);return Ji(i)}function up(r,e,t,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&gp(a,o)){let h=Nc(a,o);return a=Ji(a,a.next),h=Ji(h,h.next),_r(a,e,t,i,n,s,0),void _r(h,e,t,i,n,s,0)}o=o.next}a=a.next}while(a!==r)}function dp(r,e){return r.x-e.x}function pp(r,e){let t=function(n,s){let a,o=s,h=-1/0,l=n.x,c=n.y;do{if(c<=o.y&&c>=o.next.y&&o.next.y!==o.y){let g=o.x+(c-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(g<=l&&g>h&&(h=g,a=o.x<o.next.x?o:o.next,g===l))return a}o=o.next}while(o!==s);if(!a)return null;let u=a,d=a.x,p=a.y,m,y=1/0;o=a;do l>=o.x&&o.x>=d&&l!==o.x&&wn(c<p?l:h,c,d,p,c<p?h:l,c,o.x,o.y)&&(m=Math.abs(c-o.y)/(l-o.x),yr(o,n)&&(m<y||m===y&&(o.x>a.x||o.x===a.x&&mp(a,o)))&&(a=o,y=m)),o=o.next;while(o!==u);return a}(r,e);if(!t)return e;let i=Nc(t,r);return Ji(i,i.next),Ji(t,t.next)}function mp(r,e){return Xe(r.prev,r,e.prev)<0&&Xe(e.next,r,r.next)<0}function Io(r,e,t,i,n){return(r=1431655765&((r=858993459&((r=252645135&((r=16711935&((r=(r-t)*n|0)|r<<8))|r<<4))|r<<2))|r<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-i)*n|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function fp(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function wn(r,e,t,i,n,s,a,o){return(n-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(n-a)*(i-o)}function gp(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!function(t,i){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==i.i&&n.next.i!==i.i&&Dc(n,n.next,t,i))return!0;n=n.next}while(n!==t);return!1}(r,e)&&(yr(r,e)&&yr(e,r)&&function(t,i){let n=t,s=!1,a=(t.x+i.x)/2,o=(t.y+i.y)/2;do n.y>o!=n.next.y>o&&n.next.y!==n.y&&a<(n.next.x-n.x)*(o-n.y)/(n.next.y-n.y)+n.x&&(s=!s),n=n.next;while(n!==t);return s}(r,e)&&(Xe(r.prev,r,e.prev)||Xe(r,e.prev,e))||Qs(r,e)&&Xe(r.prev,r,r.next)>0&&Xe(e.prev,e,e.next)>0)}function Xe(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Qs(r,e){return r.x===e.x&&r.y===e.y}function Dc(r,e,t,i){let n=ps(Xe(r,e,t)),s=ps(Xe(r,e,i)),a=ps(Xe(t,i,r)),o=ps(Xe(t,i,e));return n!==s&&a!==o||!(n!==0||!ds(r,t,e))||!(s!==0||!ds(r,i,e))||!(a!==0||!ds(t,r,i))||!(o!==0||!ds(t,e,i))}function ds(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function ps(r){return r>0?1:r<0?-1:0}function yr(r,e){return Xe(r.prev,r,r.next)<0?Xe(r,e,r.next)>=0&&Xe(r,r.prev,e)>=0:Xe(r,e,r.prev)<0||Xe(r,r.next,e)<0}function Nc(r,e){let t=new Uo(r.i,r.x,r.y),i=new Uo(e.i,e.x,e.y),n=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=n,n.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function ic(r,e,t,i){let n=new Uo(r,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function xr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Uo(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var bi=class r{static area(e){let t=e.length,i=0;for(let n=t-1,s=0;s<t;n=s++)i+=e[n].x*e[s].y-e[s].x*e[n].y;return .5*i}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let i=[],n=[],s=[];nc(e),rc(i,e);let a=e.length;t.forEach(nc);for(let h=0;h<t.length;h++)n.push(a),a+=t[h].length,rc(i,t[h]);let o=op(i,n);for(let h=0;h<o.length;h+=3)s.push(o.slice(h,h+3));return s}};function nc(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function rc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var Mr=class r extends ze{constructor(e=new Fn([new ie(.5,.5),new ie(-.5,.5),new ie(-.5,-.5),new ie(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,n=[],s=[];for(let o=0,h=e.length;o<h;o++)a(e[o]);function a(o){let h=[],l=t.curveSegments!==void 0?t.curveSegments:12,c=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled===void 0||t.bevelEnabled,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,f=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:vp,v,x,R,T,S,I=!1;f&&(v=f.getSpacedPoints(c),I=!0,d=!1,x=f.computeFrenetFrames(c,!1),R=new w,T=new w,S=new w),d||(g=0,p=0,m=0,y=0);let D=o.extractPoints(l),z=D.shape,q=D.holes;if(!bi.isClockWise(z)){z=z.reverse();for(let C=0,L=q.length;C<L;C++){let B=q[C];bi.isClockWise(B)&&(q[C]=B.reverse())}}let P=bi.triangulateShape(z,q),H=z;for(let C=0,L=q.length;C<L;C++){let B=q[C];z=z.concat(B)}function J(C,L,B){return L||console.error("THREE.ExtrudeGeometry: vec does not exist"),C.clone().addScaledVector(L,B)}let re=z.length,he=P.length;function K(C,L,B){let G,O,b,Y=C.x-L.x,U=C.y-L.y,ne=B.x-C.x,Q=B.y-C.y,se=Y*Y+U*U,me=Y*Q-U*ne;if(Math.abs(me)>Number.EPSILON){let de=Math.sqrt(se),fe=Math.sqrt(ne*ne+Q*Q),ue=L.x-U/de,Te=L.y+Y/de,we=((B.x-Q/fe-ue)*Q-(B.y+ne/fe-Te)*ne)/(Y*Q-U*ne);G=ue+Y*we-C.x,O=Te+U*we-C.y;let ke=G*G+O*O;if(ke<=2)return new ie(G,O);b=Math.sqrt(ke/2)}else{let de=!1;Y>Number.EPSILON?ne>Number.EPSILON&&(de=!0):Y<-Number.EPSILON?ne<-Number.EPSILON&&(de=!0):Math.sign(U)===Math.sign(Q)&&(de=!0),de?(G=-U,O=Y,b=Math.sqrt(se)):(G=Y,O=U,b=Math.sqrt(se/2))}return new ie(G/b,O/b)}let W=[];for(let C=0,L=H.length,B=L-1,G=C+1;C<L;C++,B++,G++)B===L&&(B=0),G===L&&(G=0),W[C]=K(H[C],H[B],H[G]);let $=[],oe,j=W.concat();for(let C=0,L=q.length;C<L;C++){let B=q[C];oe=[];for(let G=0,O=B.length,b=O-1,Y=G+1;G<O;G++,b++,Y++)b===O&&(b=0),Y===O&&(Y=0),oe[G]=K(B[G],B[b],B[Y]);$.push(oe),j=j.concat(oe)}for(let C=0;C<g;C++){let L=C/g,B=p*Math.cos(L*Math.PI/2),G=m*Math.sin(L*Math.PI/2)+y;for(let O=0,b=H.length;O<b;O++){let Y=J(H[O],W[O],G);ae(Y.x,Y.y,-B)}for(let O=0,b=q.length;O<b;O++){let Y=q[O];oe=$[O];for(let U=0,ne=Y.length;U<ne;U++){let Q=J(Y[U],oe[U],G);ae(Q.x,Q.y,-B)}}}let ee=m+y;for(let C=0;C<re;C++){let L=d?J(z[C],j[C],ee):z[C];I?(T.copy(x.normals[0]).multiplyScalar(L.x),R.copy(x.binormals[0]).multiplyScalar(L.y),S.copy(v[0]).add(T).add(R),ae(S.x,S.y,S.z)):ae(L.x,L.y,0)}for(let C=1;C<=c;C++)for(let L=0;L<re;L++){let B=d?J(z[L],j[L],ee):z[L];I?(T.copy(x.normals[C]).multiplyScalar(B.x),R.copy(x.binormals[C]).multiplyScalar(B.y),S.copy(v[C]).add(T).add(R),ae(S.x,S.y,S.z)):ae(B.x,B.y,u/c*C)}for(let C=g-1;C>=0;C--){let L=C/g,B=p*Math.cos(L*Math.PI/2),G=m*Math.sin(L*Math.PI/2)+y;for(let O=0,b=H.length;O<b;O++){let Y=J(H[O],W[O],G);ae(Y.x,Y.y,u+B)}for(let O=0,b=q.length;O<b;O++){let Y=q[O];oe=$[O];for(let U=0,ne=Y.length;U<ne;U++){let Q=J(Y[U],oe[U],G);I?ae(Q.x,Q.y+v[c-1].y,v[c-1].x+B):ae(Q.x,Q.y,u+B)}}}function ge(C,L){let B=C.length;for(;--B>=0;){let G=B,O=B-1;O<0&&(O=C.length-1);for(let b=0,Y=c+2*g;b<Y;b++){let U=re*b,ne=re*(b+1);M(L+G+U,L+O+U,L+O+ne,L+G+ne)}}}function ae(C,L,B){h.push(C),h.push(L),h.push(B)}function A(C,L,B){F(C),F(L),F(B);let G=n.length/3,O=_.generateTopUV(i,n,G-3,G-2,G-1);N(O[0]),N(O[1]),N(O[2])}function M(C,L,B,G){F(C),F(L),F(G),F(L),F(B),F(G);let O=n.length/3,b=_.generateSideWallUV(i,n,O-6,O-3,O-2,O-1);N(b[0]),N(b[1]),N(b[3]),N(b[1]),N(b[2]),N(b[3])}function F(C){n.push(h[3*C+0]),n.push(h[3*C+1]),n.push(h[3*C+2])}function N(C){s.push(C.x),s.push(C.y)}(function(){let C=n.length/3;if(d){let L=0,B=re*L;for(let G=0;G<he;G++){let O=P[G];A(O[2]+B,O[1]+B,O[0]+B)}L=c+2*g,B=re*L;for(let G=0;G<he;G++){let O=P[G];A(O[0]+B,O[1]+B,O[2]+B)}}else{for(let L=0;L<he;L++){let B=P[L];A(B[2],B[1],B[0])}for(let L=0;L<he;L++){let B=P[L];A(B[0]+re*c,B[1]+re*c,B[2]+re*c)}}i.addGroup(C,n.length/3-C,0)})(),function(){let C=n.length/3,L=0;ge(H,L),L+=H.length;for(let B=0,G=q.length;B<G;B++){let O=q[B];ge(O,L),L+=O.length}i.addGroup(C,n.length/3-C,1)}()}this.setAttribute("position",new _e(n,3)),this.setAttribute("uv",new _e(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i,n){if(n.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];n.shapes.push(o.uuid)}else n.shapes.push(t.uuid);return n.options=Object.assign({},i),i.extrudePath!==void 0&&(n.options.extrudePath=i.extrudePath.toJSON()),n}(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let i=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];i.push(o)}let n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new Gs[n.type]().fromJSON(n)),new r(i,e.options)}},vp={generateTopUV:function(r,e,t,i,n){let s=e[3*t],a=e[3*t+1],o=e[3*i],h=e[3*i+1],l=e[3*n],c=e[3*n+1];return[new ie(s,a),new ie(o,h),new ie(l,c)]},generateSideWallUV:function(r,e,t,i,n,s){let a=e[3*t],o=e[3*t+1],h=e[3*t+2],l=e[3*i],c=e[3*i+1],u=e[3*i+2],d=e[3*n],p=e[3*n+1],m=e[3*n+2],y=e[3*s],g=e[3*s+1],f=e[3*s+2];return Math.abs(o-c)<Math.abs(a-l)?[new ie(a,1-h),new ie(l,1-u),new ie(d,1-m),new ie(y,1-f)]:[new ie(o,1-h),new ie(c,1-u),new ie(p,1-m),new ie(g,1-f)]}},Do=class r extends Zi{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2;super([-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},zn=class r extends Zi{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Bn=class r extends ze{constructor(e=.5,t=1,i=32,n=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i);let o=[],h=[],l=[],c=[],u=e,d=(t-e)/(n=Math.max(1,n)),p=new w,m=new ie;for(let y=0;y<=n;y++){for(let g=0;g<=i;g++){let f=s+g/i*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),h.push(p.x,p.y,p.z),l.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,c.push(m.x,m.y)}u+=d}for(let y=0;y<n;y++){let g=y*(i+1);for(let f=0;f<i;f++){let _=f+g,v=_,x=_+i+1,R=_+i+2,T=_+1;o.push(v,x,T),o.push(x,R,T)}}this.setIndex(o),this.setAttribute("position",new _e(h,3)),this.setAttribute("normal",new _e(l,3)),this.setAttribute("uv",new _e(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},No=class r extends ze{constructor(e=new Fn([new ie(0,.5),new ie(-.5,-.5),new ie(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],n=[],s=[],a=[],o=0,h=0;if(Array.isArray(e)===!1)l(e);else for(let c=0;c<e.length;c++)l(e[c]),this.addGroup(o,h,c),o+=h,h=0;function l(c){let u=n.length/3,d=c.extractPoints(t),p=d.shape,m=d.holes;bi.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,f=m.length;g<f;g++){let _=m[g];bi.isClockWise(_)===!0&&(m[g]=_.reverse())}let y=bi.triangulateShape(p,m);for(let g=0,f=m.length;g<f;g++){let _=m[g];p=p.concat(_)}for(let g=0,f=p.length;g<f;g++){let _=p[g];n.push(_.x,_.y,0),s.push(0,0,1),a.push(_.x,_.y)}for(let g=0,f=y.length;g<f;g++){let _=y[g],v=_[0]+u,x=_[1]+u,R=_[2]+u;i.push(v,x,R),h+=3}}this.setIndex(i),this.setAttribute("position",new _e(n,3)),this.setAttribute("normal",new _e(s,3)),this.setAttribute("uv",new _e(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i){if(i.shapes=[],Array.isArray(t))for(let n=0,s=t.length;n<s;n++){let a=t[n];i.shapes.push(a.uuid)}else i.shapes.push(t.uuid);return i}(this.parameters.shapes,e)}static fromJSON(e,t){let i=[];for(let n=0,s=e.shapes.length;n<s;n++){let a=t[e.shapes[n]];i.push(a)}return new r(i,e.curveSegments)}},br=class r extends ze{constructor(e=1,t=32,i=16,n=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let h=Math.min(a+o,Math.PI),l=0,c=[],u=new w,d=new w,p=[],m=[],y=[],g=[];for(let f=0;f<=i;f++){let _=[],v=f/i,x=0;f===0&&a===0?x=.5/t:f===i&&h===Math.PI&&(x=-.5/t);for(let R=0;R<=t;R++){let T=R/t;u.x=-e*Math.cos(n+T*s)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(n+T*s)*Math.sin(a+v*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),g.push(T+x,1-v),_.push(l++)}c.push(_)}for(let f=0;f<i;f++)for(let _=0;_<t;_++){let v=c[f][_+1],x=c[f][_],R=c[f+1][_],T=c[f+1][_+1];(f!==0||a>0)&&p.push(v,x,T),(f!==i-1||h<Math.PI)&&p.push(x,R,T)}this.setIndex(p),this.setAttribute("position",new _e(m,3)),this.setAttribute("normal",new _e(y,3)),this.setAttribute("uv",new _e(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Oo=class r extends Zi{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Fo=class r extends ze{constructor(e=1,t=.4,i=12,n=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);let a=[],o=[],h=[],l=[],c=new w,u=new w,d=new w;for(let p=0;p<=i;p++)for(let m=0;m<=n;m++){let y=m/n*s,g=p/i*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(y),u.y=(e+t*Math.cos(g))*Math.sin(y),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),c.x=e*Math.cos(y),c.y=e*Math.sin(y),d.subVectors(u,c).normalize(),h.push(d.x,d.y,d.z),l.push(m/n),l.push(p/i)}for(let p=1;p<=i;p++)for(let m=1;m<=n;m++){let y=(n+1)*p+m-1,g=(n+1)*(p-1)+m-1,f=(n+1)*(p-1)+m,_=(n+1)*p+m;a.push(y,g,_),a.push(g,f,_)}this.setIndex(a),this.setAttribute("position",new _e(o,3)),this.setAttribute("normal",new _e(h,3)),this.setAttribute("uv",new _e(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},zo=class r extends ze{constructor(e=1,t=.4,i=64,n=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:n,p:s,q:a},i=Math.floor(i),n=Math.floor(n);let o=[],h=[],l=[],c=[],u=new w,d=new w,p=new w,m=new w,y=new w,g=new w,f=new w;for(let v=0;v<=i;++v){let x=v/i*s*Math.PI*2;_(x,s,a,e,p),_(x+.01,s,a,e,m),g.subVectors(m,p),f.addVectors(m,p),y.crossVectors(g,f),f.crossVectors(y,g),y.normalize(),f.normalize();for(let R=0;R<=n;++R){let T=R/n*Math.PI*2,S=-t*Math.cos(T),I=t*Math.sin(T);u.x=p.x+(S*f.x+I*y.x),u.y=p.y+(S*f.y+I*y.y),u.z=p.z+(S*f.z+I*y.z),h.push(u.x,u.y,u.z),d.subVectors(u,p).normalize(),l.push(d.x,d.y,d.z),c.push(v/i),c.push(R/n)}}for(let v=1;v<=i;v++)for(let x=1;x<=n;x++){let R=(n+1)*(v-1)+(x-1),T=(n+1)*v+(x-1),S=(n+1)*v+x,I=(n+1)*(v-1)+x;o.push(R,T,I),o.push(T,S,I)}function _(v,x,R,T,S){let I=Math.cos(v),D=Math.sin(v),z=R/x*v,q=Math.cos(z);S.x=T*(2+q)*.5*I,S.y=T*(2+q)*D*.5,S.z=T*Math.sin(z)*.5}this.setIndex(o),this.setAttribute("position",new _e(h,3)),this.setAttribute("normal",new _e(l,3)),this.setAttribute("uv",new _e(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},Bo=class r extends ze{constructor(e=new ks(new w(-1,-1,0),new w(-1,1,0),new w(1,1,0)),t=64,i=1,n=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:n,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new w,h=new w,l=new ie,c=new w,u=[],d=[],p=[],m=[];function y(g){c=e.getPointAt(g/t,c);let f=a.normals[g],_=a.binormals[g];for(let v=0;v<=n;v++){let x=v/n*Math.PI*2,R=Math.sin(x),T=-Math.cos(x);h.x=T*f.x+R*_.x,h.y=T*f.y+R*_.y,h.z=T*f.z+R*_.z,h.normalize(),d.push(h.x,h.y,h.z),o.x=c.x+i*h.x,o.y=c.y+i*h.y,o.z=c.z+i*h.z,u.push(o.x,o.y,o.z)}}(function(){for(let g=0;g<t;g++)y(g);y(s===!1?t:0),function(){for(let g=0;g<=t;g++)for(let f=0;f<=n;f++)l.x=g/t,l.y=f/n,p.push(l.x,l.y)}(),function(){for(let g=1;g<=t;g++)for(let f=1;f<=n;f++){let _=(n+1)*(g-1)+(f-1),v=(n+1)*g+(f-1),x=(n+1)*g+f,R=(n+1)*(g-1)+f;m.push(_,v,R),m.push(v,x,R)}}()})(),this.setIndex(m),this.setAttribute("position",new _e(u,3)),this.setAttribute("normal",new _e(d,3)),this.setAttribute("uv",new _e(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new Gs[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},ko=class extends ze{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,n=new w,s=new w;if(e.index!==null){let a=e.attributes.position,o=e.index,h=e.groups;h.length===0&&(h=[{start:0,count:o.count,materialIndex:0}]);for(let l=0,c=h.length;l<c;++l){let u=h[l],d=u.start;for(let p=d,m=d+u.count;p<m;p+=3)for(let y=0;y<3;y++){let g=o.getX(p+y),f=o.getX(p+(y+1)%3);n.fromBufferAttribute(a,g),s.fromBufferAttribute(a,f),sc(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,h=a.count/3;o<h;o++)for(let l=0;l<3;l++){let c=3*o+l,u=3*o+(l+1)%3;n.fromBufferAttribute(a,c),s.fromBufferAttribute(a,u),sc(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new _e(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function sc(r,e,t){let i=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,n=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(i)!==!0&&t.has(n)!==!0&&(t.add(i),t.add(n),!0)}var sm=Object.freeze({__proto__:null,BoxGeometry:ci,CapsuleGeometry:Co,CircleGeometry:Po,ConeGeometry:ui,CylinderGeometry:Jt,DodecahedronGeometry:vr,EdgesGeometry:Lo,ExtrudeGeometry:Mr,IcosahedronGeometry:Do,LatheGeometry:Vs,OctahedronGeometry:zn,PlaneGeometry:Ei,PolyhedronGeometry:Zi,RingGeometry:Bn,ShapeGeometry:No,SphereGeometry:br,TetrahedronGeometry:Oo,TorusGeometry:Fo,TorusKnotGeometry:zo,TubeGeometry:Bo,WireframeGeometry:ko});var Sr=class extends Yt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Se(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Ws=class extends On{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function ms(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function _p(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var kn=class{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,n=t[i],s=t[i-1];t:{e:{let a;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<s)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=t[++i],e<n)break e}a=t.length;break i}if(e>=s)break t;{let o=t[1];e<o&&(i=2,s=o);for(let h=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===h)break;if(n=s,s=t[--i-1],e>=s)break e}a=i,i=0}}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n;for(let a=0;a!==n;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ho=class extends kn{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ql,endingEnd:Ql}}intervalChanged_(e,t,i){let n=this.parameterPositions,s=e-2,a=e+1,o=n[s],h=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case eh:s=e,o=2*t-i;break;case th:s=n.length-2,o=t+n[s]-n[s+1];break;default:s=e,o=i}if(h===void 0)switch(this.getSettings_().endingEnd){case eh:a=e,h=2*i-t;break;case th:a=1,h=i+n[1]-n[0];break;default:a=e-1,h=t}let l=.5*(i-t),c=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(h-i),this._offsetPrev=s*c,this._offsetNext=a*c}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,h=e*o,l=h-o,c=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,m=(i-t)/(n-t),y=m*m,g=y*m,f=-d*g+2*d*y-d*m,_=(1+d)*g+(-1.5-2*d)*y+(-.5+d)*m+1,v=(-1-p)*g+(1.5+p)*y+.5*m,x=p*g-p*y;for(let R=0;R!==o;++R)s[R]=f*a[c+R]+_*a[l+R]+v*a[h+R]+x*a[u+R];return s}},Go=class extends kn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,h=e*o,l=h-o,c=(i-t)/(n-t),u=1-c;for(let d=0;d!==o;++d)s[d]=a[l+d]*u+a[h+d]*c;return s}},Vo=class extends kn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}},Bt=class{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ms(t,this.TimeBufferType),this.values=ms(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ms(e.times,Array),values:ms(e.values,Array)};let n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Vo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Go(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ho(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case gs:t=this.InterpolantFactoryMethodDiscrete;break;case vs:t=this.InterpolantFactoryMethodLinear;break;case pa:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(i);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return gs;case this.InterpolantFactoryMethodLinear:return vs;case this.InterpolantFactoryMethodSmooth:return pa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){let i=this.times,n=i.length,s=0,a=n-1;for(;s!==n&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==n){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,n=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let h=i[o];if(typeof h=="number"&&isNaN(h)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,h),e=!1;break}if(a!==null&&a>h){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,h,a),e=!1;break}a=h}if(n!==void 0&&_p(n))for(let o=0,h=n.length;o!==h;++o){let l=n[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===pa,s=e.length-1,a=1;for(let o=1;o<s;++o){let h=!1,l=e[o];if(l!==e[o+1]&&(o!==1||l!==e[0]))if(n)h=!0;else{let c=o*i,u=c-i,d=c+i;for(let p=0;p!==i;++p){let m=t[c+p];if(m!==t[u+p]||m!==t[d+p]){h=!0;break}}}if(h){if(o!==a){e[a]=e[o];let c=o*i,u=a*i;for(let d=0;d!==i;++d)t[u+d]=t[c+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,h=a*i,l=0;l!==i;++l)t[h+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Bt.prototype.TimeBufferType=Float32Array,Bt.prototype.ValueBufferType=Float32Array,Bt.prototype.DefaultInterpolation=vs;var Vi=class extends Bt{};Vi.prototype.ValueTypeName="bool",Vi.prototype.ValueBufferType=Array,Vi.prototype.DefaultInterpolation=gs,Vi.prototype.InterpolantFactoryMethodLinear=void 0,Vi.prototype.InterpolantFactoryMethodSmooth=void 0;var Wo=class extends Bt{};Wo.prototype.ValueTypeName="color";var Xo=class extends Bt{};Xo.prototype.ValueTypeName="number";var jo=class extends kn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,h=(i-t)/(n-t),l=e*o;for(let c=l+o;l!==c;l+=4)jt.slerpFlat(s,0,a,l-o,a,l,h);return s}},or=class extends Bt{InterpolantFactoryMethodLinear(e){return new jo(this.times,this.values,this.getValueSize(),e)}};or.prototype.ValueTypeName="quaternion",or.prototype.DefaultInterpolation=vs,or.prototype.InterpolantFactoryMethodSmooth=void 0;var Wi=class extends Bt{};Wi.prototype.ValueTypeName="string",Wi.prototype.ValueBufferType=Array,Wi.prototype.DefaultInterpolation=gs,Wi.prototype.InterpolantFactoryMethodLinear=void 0,Wi.prototype.InterpolantFactoryMethodSmooth=void 0;var qo=class extends Bt{};qo.prototype.ValueTypeName="vector";var ac={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},Yo=class{constructor(e,t,i){let n=this,s,a=!1,o=0,h=0,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(c){h++,a===!1&&n.onStart!==void 0&&n.onStart(c,o,h),a=!0},this.itemEnd=function(c){o++,n.onProgress!==void 0&&n.onProgress(c,o,h),o===h&&(a=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(c){n.onError!==void 0&&n.onError(c)},this.resolveURL=function(c){return s?s(c):c},this.setURLModifier=function(c){return s=c,this},this.addHandler=function(c,u){return l.push(c,u),this},this.removeHandler=function(c){let u=l.indexOf(c);return u!==-1&&l.splice(u,2),this},this.getHandler=function(c){for(let u=0,d=l.length;u<d;u+=2){let p=l[u],m=l[u+1];if(p.global&&(p.lastIndex=0),p.test(c))return m}return null}}},yp=new Yo,wr=class{constructor(e){this.manager=e!==void 0?e:yp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(n,s){i.load(e,n,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};wr.DEFAULT_MATERIAL_NAME="__DEFAULT";var Zo=class extends wr{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=ac.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;let o=hr("img");function h(){c(),ac.add(e,this),t&&t(this),s.manager.itemEnd(e)}function l(u){c(),n&&n(u),s.manager.itemError(e),s.manager.itemEnd(e)}function c(){o.removeEventListener("load",h,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",h,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}};var Xs=class extends wr{constructor(e){super(e)}load(e,t,i,n){let s=new gt,a=new Zo(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,n),s}},js=class extends rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Se(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}},qs=class extends js{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Se(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Xa=new be,oc=new w,lc=new w,Jo=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ie(512,512),this.map=null,this.mapPass=null,this.matrix=new be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Un,this._frameExtents=new ie(1,1),this._viewportCount=1,this._viewports=[new Je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;oc.setFromMatrixPosition(e.matrixWorld),t.position.copy(oc),lc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(lc),t.updateMatrixWorld(),Xa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xa),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Xa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var am=new be,om=new w,lm=new w;var Ko=class extends Jo{constructor(){super(new Dn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Er=class extends js{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.target=new rt,this.shadow=new Ko}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var hm=new be,cm=new be,um=new be;var dm=new w,pm=new jt,mm=new w,fm=new w;var gm=new w,vm=new jt,_m=new w,ym=new w;var sl="\\[\\]\\.:\\/",xp=new RegExp("["+sl+"]","g"),ja="[^"+sl+"]",Mp="[^"+sl.replace("\\.","")+"]",bp=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",ja)+/(WCOD+)?/.source.replace("WCOD",Mp)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ja)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ja)+"$"),Sp=["material","materials","bones","map"],Ge=class r{constructor(e,t,i){this.path=t,this.parsedPath=i||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,i):new r(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(xp,"")}static parseTrackName(e){let t=bp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let s=i.nodeName.substring(n+1);Sp.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let h=i(o.children);if(h)return h}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,n=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let c=0;c<e.length;c++)if(e[c].name===l){l=c;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[i]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[i]}if(l!==void 0){if(e[l]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[l]}}let a=e[n];if(a===void 0){let l=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+n+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let h=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}h=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(h=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(h=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[h],this.setValue=this.SetterByBindingTypeAndVersioning[h][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ge.Composite=class{constructor(r,e,t){let i=t||Ge.parseTrackName(e);this._targetGroup=r,this._bindings=r.subscribe_(e,i)}getValue(r,e){this.bind();let t=this._targetGroup.nCachedObjects_,i=this._bindings[t];i!==void 0&&i.getValue(r,e)}setValue(r,e){let t=this._bindings;for(let i=this._targetGroup.nCachedObjects_,n=t.length;i!==n;++i)t[i].setValue(r,e)}bind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].bind()}unbind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].unbind()}},Ge.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Ge.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Ge.prototype.GetterByBindingType=[Ge.prototype._getValue_direct,Ge.prototype._getValue_array,Ge.prototype._getValue_arrayElement,Ge.prototype._getValue_toArray],Ge.prototype.SetterByBindingTypeAndVersioning=[[Ge.prototype._setValue_direct,Ge.prototype._setValue_direct_setNeedsUpdate,Ge.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ge.prototype._setValue_array,Ge.prototype._setValue_array_setNeedsUpdate,Ge.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ge.prototype._setValue_arrayElement,Ge.prototype._setValue_arrayElement_setNeedsUpdate,Ge.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ge.prototype._setValue_fromArray,Ge.prototype._setValue_fromArray_setNeedsUpdate,Ge.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var xm=new Float32Array(1);var hc=new be,Ys=class{constructor(e,t,i=0,n=1/0){this.ray=new Yi(e,t),this.near=i,this.far=n,this.camera=null,this.layers=new cr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return hc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(hc),this}intersectObject(e,t=!0,i=[]){return $o(e,this,i,t),i.sort(cc),i}intersectObjects(e,t=!0,i=[]){for(let n=0,s=e.length;n<s;n++)$o(e[n],this,i,t);return i.sort(cc),i}};function cc(r,e){return r.distance-e.distance}function $o(r,e,t,i){if(r.layers.test(e.layers)&&r.raycast(e,t),i===!0){let n=r.children;for(let s=0,a=n.length;s<a;s++)$o(n[s],e,t,!0)}}var Mm=new ie;var bm=new w,Sm=new w;var wm=new w;var Em=new w,Tm=new be,Am=new be;var Rm=new w,Cm=new Se,Pm=new Se;var Zs=class extends Ds{constructor(e=10,t=10,i=4473924,n=8947848){i=new Se(i),n=new Se(n);let s=t/2,a=e/t,o=e/2,h=[],l=[];for(let u=0,d=0,p=-o;u<=t;u++,p+=a){h.push(-o,0,p,o,0,p),h.push(p,0,-o,p,0,o);let m=u===s?i:n;m.toArray(l,d),d+=3,m.toArray(l,d),d+=3,m.toArray(l,d),d+=3,m.toArray(l,d),d+=3}let c=new ze;c.setAttribute("position",new _e(h,3)),c.setAttribute("color",new _e(l,3)),super(c,new On({vertexColors:!0,toneMapped:!1})),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var Lm=new w,Im=new w,Um=new w;var Dm=new w,Nm=new ur;var Om=new Mt;var Tr=class extends Ds{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),n=new ze;n.setIndex(new ot(i,1)),n.setAttribute("position",new _e([1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],3)),super(n,new On({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}};var Fm=new w;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qa}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qa);(()=>{if(Me&&typeof Me.envmap_physical_pars_fragment=="string"&&(Me.envmap_physical_pars_fragment=Me.envmap_physical_pars_fragment.replaceAll(" * envMapIntensity","")),ai&&typeof ai.sRGBToLinear=="function"){let r=new Uint8Array(256);for(let t=0;t<256;t++){let i=t/255;r[t]=Math.round(255*(i<=.04045?i/12.92:((i+.055)/1.055)**2.4))}let e=ai.sRGBToLinear.bind(ai);ai.sRGBToLinear=t=>{if(typeof document>"u"||!t||!(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap||typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas))return e(t);let n=document.createElement("canvas");n.width=t.width,n.height=t.height;let s=n.getContext("2d",{willReadFrequently:!0});if(!s)return e(t);s.drawImage(t,0,0);let a=s.getImageData(0,0,n.width,n.height),o=a.data;for(let h=0;h<o.length;h+=4)o[h]=r[o[h]],o[h+1]=r[o[h+1]],o[h+2]=r[o[h+2]];return s.putImageData(a,0,0),n}}})();function Rr(r){return String(r??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Oc(r,e="#5cdeed"){let t="";return["hero","npc"].includes(r)?t=`<ellipse cx="40" cy="68" rx="18" ry="5" fill="#000" opacity=".2"/><rect x="27" y="42" width="26" height="21" rx="9" fill="${e}"/><rect x="18" y="16" width="44" height="33" rx="13" fill="${e}"/><rect x="24" y="25" width="32" height="15" rx="7" fill="#153748"/><rect x="30" y="29" width="5" height="7" rx="2" fill="#dbffff"/><rect x="45" y="29" width="5" height="7" rx="2" fill="#dbffff"/><path d="M22 49v7m36-7v7M31 62v5m18-5v5" stroke="${e}" stroke-width="8" stroke-linecap="round"/><path d="M40 16V9" stroke="${e}" stroke-width="3"/><circle cx="40" cy="8" r="4" fill="#e3fcff"/>`:r==="tree"?t=`<ellipse cx="40" cy="70" rx="24" ry="5" fill="#000" opacity=".2"/><path d="M36 53h8v16h-8" fill="#9c7b5a"/><path d="m40 19 26 38H14Z" fill="${e}"/><path d="m40 7 21 34H19Z" fill="${e}"/><path d="m40 7 21 34H40Zm0 34v16h26Z" fill="#173c40" opacity=".25"/>`:r==="crystal"?t=`<ellipse cx="40" cy="70" rx="16" ry="4" fill="${e}" opacity=".12"/><path d="m40 10 20 22v18L40 68 20 50V32Z" fill="${e}"/><path d="M40 10 31 34l9 34 20-18V32Z" fill="#c2ffff" opacity=".35"/><path d="m20 32 11 2 9 34-20-18Z" fill="#126b87" opacity=".4"/><path d="m40 10 7 23-16 1Z" fill="#eaffff" opacity=".6"/>`:r==="slime"?t=`<ellipse cx="40" cy="64" rx="27" ry="6" fill="#000" opacity=".2"/><path d="M13 53c0-49 54-49 54 0 0 17-12 8-18 12-7 4-10-3-16-1-12 5-20 0-20-11Z" fill="${e}"/><ellipse cx="29" cy="44" rx="4" ry="6" fill="#24243f"/><ellipse cx="49" cy="44" rx="4" ry="6" fill="#24243f"/><path d="M35 54q5 5 10 0" fill="none" stroke="#493d65" stroke-width="2"/><ellipse cx="26" cy="28" rx="8" ry="4" fill="white" opacity=".3" transform="rotate(-30 26 28)"/>`:r==="portal"?t=`<ellipse cx="40" cy="69" rx="28" ry="6" fill="${e}" opacity=".2"/><path d="M17 65V33a23 23 0 0 1 46 0v32" fill="#302b56" stroke="${e}" stroke-width="7"/><path d="M26 64V34a14 14 0 0 1 28 0v30" fill="${e}" opacity=".25"/><path d="m40 28 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#c7c7ff"/>`:r==="rock"?t=`<path d="m13 55 8-26 25-8 20 23-7 18-32 4Z" fill="${e}"/><path d="m21 29 17 18 8-26Z" fill="white" opacity=".2"/><path d="m38 47 28-3-7 18-32 4Z" fill="black" opacity=".17"/>`:r==="crate"?t=`<path d="m15 25 25-12 25 12v34L40 71 15 59Z" fill="${e}"/><path d="m40 37 25-12v34L40 71Z" fill="black" opacity=".2"/><path d="m15 25 25 12 25-12M40 37v34M20 31l15 31m0-24L20 55m25-13 15 13m0-23L45 62" fill="none" stroke="#764a33" stroke-width="3"/>`:r==="car"?t=`<rect x="14" y="30" width="10" height="17" rx="4" fill="#172333"/><rect x="56" y="30" width="10" height="17" rx="4" fill="#172333"/><rect x="14" y="53" width="10" height="17" rx="4" fill="#172333"/><rect x="56" y="53" width="10" height="17" rx="4" fill="#172333"/><rect x="23" y="12" width="34" height="59" rx="12" fill="${e}"/><path d="M28 30h24l-3 18H31Z" fill="#b1f0ff"/><path d="M27 60h26M31 19h4m11 0h4" stroke="#fff0c6" stroke-width="5" stroke-linecap="round"/>`:r==="ship"?t=`<path d="m40 8 8 25 20 27-20-4-8 11-8-11-20 4 20-27Z" fill="${e}"/><path d="m40 8 8 25-8 18-8-18Z" fill="#d4f7ff"/><path d="m33 61 7 15 7-15" fill="#ffc27b"/><path d="m19 52 10-11m32 11L51 41" stroke="#476cbd" stroke-width="4"/>`:r==="flower"?t=`<path d="M40 38v30m0-10q-17 2-18-10 14-2 18 10m0-7q17-1 18-12-14 0-18 12" fill="#4dad86" stroke="#4dad86" stroke-width="3"/>${[0,60,120,180,240,300].map(i=>`<ellipse cx="40" cy="23" rx="8" ry="12" fill="${e}" transform="rotate(${i} 40 35)"/>`).join("")}<circle cx="40" cy="35" r="8" fill="#ffe3a1"/>`:r==="button"?t=`<rect x="9" y="25" width="62" height="34" rx="10" fill="${e}"/><path d="m35 35 12 7-12 7Z" fill="#173440"/>`:t=`<path d="m40 8 8 23 24 9-24 8-8 24-8-24-24-8 24-9Z" fill="${e}"/><circle cx="62" cy="16" r="4" fill="#fff"/><circle cx="15" cy="62" r="3" fill="${e}"/>`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" class="asset-art" aria-hidden="true">${t}</svg>`}var Fc={forest:{top:"#347c65",side:"#203f3b",path:"#78a184",fog:"#142529"},night:{top:"#39445f",side:"#242b43",path:"#6a7191",fog:"#1b2034"},space:{top:"#28384a",side:"#192338",path:"#465b73",fog:"#101727"},race:{top:"#32675d",side:"#233e3e",path:"#364451",fog:"#15292d"},sand:{top:"#c5a87b",side:"#816e55",path:"#e3cba3",fog:"#2d2923"}},zc=(r,e={})=>new Sr({color:r,roughness:.75,...e});function lt(r,e,t,i=0,n=0,s=0,a={}){let o=new nt(r,zc(e,a));return o.position.set(i,n,s),o.castShadow=!0,o.receiveShadow=!0,t.add(o),o}var st=(r,e,t,i,n,s=0,a=0,o=0)=>lt(new ci(r,e,t),i,n,s,a,o),Pt=(r,e,t,i=0,n=0,s=0)=>lt(new br(r,16,12),e,t,i,n,s);function Ep(r,e){let t=new zt,i=r.color;if(["hero","npc"].includes(r.kind))st(.53,.56,.42,i,t,0,.63),st(.83,.58,.57,i,t,0,1.19),st(.64,.29,.05,"#153649",t,0,1.23,.302),st(.1,.14,.04,"#d8ffff",t,-.18,1.24,.335),st(.1,.14,.04,"#d8ffff",t,.18,1.24,.335),Pt(.12,i,t,-.4,.7),Pt(.12,i,t,.4,.7),st(.18,.24,.28,"#264650",t,-.17,.19,.03),st(.18,.24,.28,"#264650",t,.17,.19,.03),lt(new Jt(.025,.025,.2,6),i,t,0,1.58),Pt(.07,"#d9ffff",t,0,1.71);else if(r.kind==="tree")lt(new Jt(.13,.19,1,7),"#8c7258",t,0,.5),lt(new ui(.98,1.55,7),i,t,0,1.25),lt(new ui(.78,1.4,7),i,t,0,1.9),lt(new ui(.55,1.2,7),"#62c99e",t,0,2.45);else if(r.kind==="crystal"){lt(new zn(.43),i,t,0,.8,0,{metalness:.25,roughness:.25,emissive:i,emissiveIntensity:.17}).scale.set(.73,1.35,.73);let s=lt(new Bn(.28,.38,32),i,t,0,.025,0,{transparent:!0,opacity:.2,side:Ar});s.rotation.x=-Math.PI/2}else if(r.kind==="slime"){let n=Pt(.58,i,t,0,.48);n.scale.y=.78,Pt(.075,"#252844",t,-.2,.58,.48),Pt(.075,"#252844",t,.2,.58,.48),Pt(.13,i,t,-.35,.13,.23),Pt(.13,i,t,.35,.13,.23)}else if(r.kind==="rock"){let n=lt(new vr(.66),i,t,0,.38);n.scale.set(1,.75,.8),n.rotation.set(.2,.4,.1)}else if(r.kind==="crate"){st(.9,.85,.9,i,t,0,.425);for(let n of[-.34,.34])st(.12,.95,.98,"#875b3a",t,n,.44);for(let n of[.1,.73])st(.97,.1,.96,"#ba874c",t,0,n)}else if(r.kind==="portal"){let n=new Fn;n.moveTo(-.85,0),n.lineTo(-.85,1.35),n.absarc(0,1.35,.85,Math.PI,0,!0),n.lineTo(.85,0),n.lineTo(.59,0),n.lineTo(.59,1.35),n.absarc(0,1.35,.59,0,Math.PI,!1),n.lineTo(-.59,0),lt(new Mr(n,{depth:.3,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:2,steps:1}),i,t,0,0,0,{emissive:i,emissiveIntensity:.45}),lt(new Ei(1.15,1.6),"#9e87ff",t,0,.86,.12,{transparent:!0,opacity:.35,side:Ar,emissive:"#9e87ff",emissiveIntensity:.7}),st(2,.15,.8,"#62698f",t,0,.08,.15)}else if(r.kind==="car"){st(.8,.28,1.3,i,t,0,.37),st(.65,.3,.65,i,t,0,.62,-.1),st(.58,.24,.04,"#b8e8f4",t,0,.64,.245);for(let n of[-.45,.45])for(let s of[-.42,.42]){let a=lt(new Jt(.21,.21,.16,12),"#19242a",t,n,.23,s);a.rotation.z=Math.PI/2}st(.17,.1,.04,"#fff6c8",t,-.23,.38,.67),st(.17,.1,.04,"#fff6c8",t,.23,.38,.67)}else if(r.kind==="ship"){let n=lt(new ui(.4,1.4,4),i,t,0,.4);n.rotation.x=-Math.PI/2,st(1.4,.12,.45,i,t,0,.32,.18),Pt(.2,"#c4f3ff",t,0,.55,-.1)}else if(r.kind==="flower"){lt(new Jt(.025,.035,.5,5),"#71b886",t,0,.25);for(let n=0;n<5;n++){let s=n*Math.PI*2/5,a=Pt(.13,i,t,Math.cos(s)*.15,.53,Math.sin(s)*.15);a.scale.y=.5}Pt(.09,"#fff3ac",t,0,.56)}else if(r.kind==="image"){let n=e.find(s=>s.id===r.assetId);if(n){let s,a=new Xs().load(n.src,o=>{if(s){let h=o.image.width/o.image.height;s.scale.x=1.5*h}});a.colorSpace=yt,a.magFilter=it,a.minFilter=_t,r.billboard==="screen"?s=new Ls(new dr({map:a,transparent:!0,alphaTest:.1})):(s=new nt(new Ei(1,1),new Ln({map:a,transparent:!0,alphaTest:.1,side:Ar})),s.userData.upright=!0),s.scale.set(1.5*(n.width||1)/(n.height||1),1.5,1),s.position.y=.75,t.add(s)}}else if(r.kind==="button"){st(1.5,.25,.75,i,t,0,.2);let n=lt(new ui(.18,.4,3),"#164655",t,0,.38);n.rotation.z=-Math.PI/2}else for(let n=0;n<8;n++){let s=n*2.4,a=lt(new zn(.07),i,t,Math.cos(s)*.6,.3+n*.17,Math.sin(s)*.6,{emissive:i,emissiveIntensity:.7});a.rotation.z=s}return t.traverse(n=>{n.userData.objectId=r.id}),t}var Cr=class{constructor(e,t="3d"){if(this.host=e,this.mode=t,this.zoom=1,this.angle=.62,this.elevation=.78,this.showGrid=!1,this.selected=null,this.path=[],this.meshes=new Map,this.images=new Map,this.assetSources=new Map,this.assets=[],this.map=di(),this.pan={x:0,y:0,z:0},this.camConfig=jn(t==="3d"?"iso":"flat"),this.followPoint=new w,this.canvas=document.createElement("canvas"),this.canvas.setAttribute("aria-label",t==="3d"?"3D game world":"2D game world"),e.prepend(this.canvas),this.selectionLabel=document.createElement("div"),this.selectionLabel.className="selection-tag",this.selectionLabel.hidden=!0,e.append(this.selectionLabel),this.tiles=new Map(Object.keys(Di).map(i=>[i,Sl(i)])),t==="3d"){let i=/Xbox/i.test(navigator.userAgent);try{this.renderer=new Nn({canvas:this.canvas,antialias:!i,alpha:!0,powerPreference:"high-performance"})}catch{this.renderer=new Nn({canvas:this.canvas,antialias:!1,alpha:!0,powerPreference:"default"})}this.renderer.setPixelRatio(Math.min(devicePixelRatio,i?1:2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Qo,this.renderer.outputColorSpace=yt,this.renderer.toneMapping=el,this.renderer.toneMappingExposure=1.1,this.world=new Cs,this.ortho=new Dn(-12,12,8,-8,.1,250),this.perspective=new ft(65,1,.07,200),this.camera=this.ortho,this.world.add(new qs("#c0e6f0","#243d3e",1.8));let n=new Er("#fff6e1",2.5);n.position.set(-7,15,8),n.castShadow=!0,n.shadow.mapSize.set(1024,1024),Object.assign(n.shadow.camera,{left:-20,right:20,top:20,bottom:-20}),n.shadow.bias=-8e-4,n.shadow.normalBias=.03,this.world.add(n),this.sun=n;let s=new Er("#73bdff",.85);s.position.set(8,5,-6),this.world.add(s),this.content=new zt,this.world.add(this.content),this.terrainGroup=new zt,this.world.add(this.terrainGroup),this.ray=new Ys,this.groundPlane=new Rt(new w(0,1,0),0),this.v=new ie,this.selectionBox=new Mt,this.selection=new Tr(this.selectionBox,"#80eaff"),this.selection.material.depthTest=!1,this.selection.material.depthWrite=!1,this.selection.material.transparent=!0,this.selection.material.opacity=.95,this.selection.renderOrder=999,this.selection.visible=!1,this.world.add(this.selection),this.brushPreview=new Tr(new Mt,"#8ff5cd"),this.brushPreview.material.depthTest=!1,this.brushPreview.material.depthWrite=!1,this.brushPreview.renderOrder=998,this.brushPreview.visible=!1,this.world.add(this.brushPreview),this.particleGeo=new ze,this.particleGeo.setAttribute("position",new ot(new Float32Array(340*3),3)),this.particlePoints=new Ns(this.particleGeo,new mr({color:"#a7f4ff",size:.11,transparent:!0,opacity:.9})),this.world.add(this.particlePoints)}else this.ctx=this.canvas.getContext("2d");this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.resize()}get side(){return this.camConfig.preset==="side"}configure(e){this.camConfig={...jn(this.mode==="3d"?"iso":"flat"),...e},this.sideCenter=4,this.scene&&this.cacheTerrain2d()}resize(){this.w=this.host.clientWidth||800,this.h=this.host.clientHeight||600,this.renderer?(this.renderer.setSize(this.w,this.h,!1),this.perspective.aspect=this.w/this.h,this.perspective.updateProjectionMatrix(),this.updateCamera()):(this.canvas.width=this.w*Math.min(devicePixelRatio,2),this.canvas.height=this.h*Math.min(devicePixelRatio,2),this.ctx.setTransform(Math.min(devicePixelRatio,2),0,0,Math.min(devicePixelRatio,2),0,0))}updateCamera(){if(!this.ortho||this.playing)return;this.camera=this.ortho;let e=this.w/this.h,t=Math.max(8.2,this.map.depth*.65,this.map.width/e*.6)/this.zoom;this.camera.left=-t*e,this.camera.right=t*e,this.camera.top=t,this.camera.bottom=-t,this.camera.position.set(this.pan.x+Math.sin(this.angle)*70*Math.cos(this.elevation),this.pan.y+Math.sin(this.elevation)*70,this.pan.z+Math.cos(this.angle)*70*Math.cos(this.elevation)),this.camera.lookAt(this.pan.x,this.pan.y+.2,this.pan.z),this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld()}orbit(e,t){this.angle+=e*.008,this.elevation=je(this.elevation+t*.005,.2,1.5),this.updateCamera()}panPixels(e,t){if(this.renderer){let i=(this.ortho.top-this.ortho.bottom)/this.h;this.pan.x-=e*i*Math.cos(this.angle)+t*i*Math.sin(this.angle)/Math.max(.25,Math.sin(this.elevation)),this.pan.z+=e*i*Math.sin(this.angle)-t*i*Math.cos(this.angle)/Math.max(.25,Math.sin(this.elevation))}else{let i=this.scale2d();this.pan.x-=e/i,this.side?this.pan.y+=t/i:this.pan.z-=t/i}this.updateCamera()}setZoom(e){this.zoom=je(e,.3,5),this.updateCamera()}reset(){this.angle=.62,this.elevation=.78,this.pan={x:0,y:0,z:0},this.setZoom(1)}beginPlay(e,t){this.configure(e),this.playing||(this.savedView={pan:{...this.pan},zoom:this.zoom}),this.playing=!0,this.followPoint.set(t?.x||0,t?.y||0,t?.z||0),this.cameraYaw=(e.yaw||0)*Math.PI/180,this.cameraPitch=(e.angle||0)*Math.PI/180,this.cameraReady=!1}endPlay(){this.playing=!1,this.savedView&&(this.pan=this.savedView.pan,this.zoom=this.savedView.zoom),this.camera=this.ortho,this.updateCamera()}updatePlayCamera(e,t){if(!e)return;let i=this.camConfig,n=1-Math.exp(-8*t),s=new w(e.x,e.y,e.z);if(i.follow||i.preset==="first"||i.preset==="third"||i.preset==="side"?this.followPoint.lerp(s,n):this.followPoint.set(0,0,0),!!this.renderer){if(i.preset==="first"||i.preset==="third"){this.camera=this.perspective;let a=this.followPoint,o=this.cameraYaw,h=this.cameraPitch,l,c;if(i.preset==="first")l=new w(a.x,a.y+i.height,a.z),c=l.clone().add(new w(-Math.sin(o)*Math.cos(h),-Math.sin(h),-Math.cos(o)*Math.cos(h)));else{c=new w(a.x,a.y+.9,a.z),l=new w(a.x+Math.sin(o)*i.distance*Math.cos(h),Math.max(a.y+.25,a.y+i.height+Math.sin(h)*i.distance*.45),a.z+Math.cos(o)*i.distance*Math.cos(h));let u=l.clone().sub(c),d=u.length();u.normalize();for(let p=.5;p<d;p+=.2){let m=c.clone().addScaledVector(u,p);if(this.terrainIndex.blocked(m.x,m.z,m.y,.15,.12)){l=c.clone().addScaledVector(u,Math.max(.4,p-.3));break}}}this.cameraReady?(this.camera.position.lerp(l,n),this.lookAtPoint.lerp(c,n)):(this.camera.position.copy(l),this.lookAtPoint=c.clone(),this.cameraReady=!0),this.camera.lookAt(this.lookAtPoint)}else{this.camera=this.ortho;let a=this.w/this.h,o=i.distance*.95;Object.assign(this.ortho,{left:-o*a,right:o*a,top:o,bottom:-o});let h=this.followPoint;this.camera.position.set(h.x+Math.sin(.62+this.cameraYaw)*i.distance*3,h.y+i.height+Math.sin(i.angle*Math.PI/180)*i.distance*3,h.z+Math.cos(.62+this.cameraYaw)*i.distance*3),this.camera.lookAt(h.x,h.y+.3,h.z),this.camera.updateProjectionMatrix()}this.camera.updateMatrixWorld()}}disposeTree(e){let t=new Set,i=new Set,n=new Set;e.traverse(s=>{s.geometry&&t.add(s.geometry);for(let a of s.material?Array.isArray(s.material)?s.material:[s.material]:[])i.add(a),a.map&&n.add(a.map)}),t.forEach(s=>s.dispose()),i.forEach(s=>s.dispose()),n.forEach(s=>s.dispose())}setScene(e,t=[]){this.scene=e,this.map=e.map||di(e.theme),this.assets=t,this.palette=Fc[e.theme]||Fc.forest,this.host.dataset.theme=e.theme;for(let i of t)if(this.assetSources.get(i.id)!==i.src){for(let n of this.images.keys())n.endsWith(i.id)&&this.images.delete(n);this.assetSources.set(i.id,i.src)}if(this.setTerrain(e),!!this.renderer){this.disposeTree(this.content),this.content.clear(),this.meshes.clear();for(let i of e.objects){let n=Ep(i,t);this.content.add(n),this.meshes.set(i.id,n)}this.updateCamera()}}setTerrain(e){if(this.scene=e,this.map=e.map||di(e.theme),this.terrainIndex=new $i(e),this.cacheTerrain2d(),!this.renderer)return;this.disposeTree(this.terrainGroup),this.terrainGroup.clear();let t=this.map,i=new Map,n=new Map(t.tiles.map(l=>[`${l.x},${l.z}`,l.tile])),s=(l,c,u)=>{let d=l+":"+c;i.has(d)||i.set(d,{tile:l,shape:c,cells:[]}),i.get(d).cells.push(u)};for(let l=-t.width/2;l<t.width/2;l++)for(let c=-t.depth/2;c<t.depth/2;c++){let u=n.get(`${l},${c}`);u==="void"||!t.base&&!u||s(u||t.tileset,"floor",{x:l,y:-.3,z:c})}for(let l of t.blocks)s(l.tile,l.shape,l);let a=new Map,o=new Map;for(let{tile:l,shape:c,cells:u}of i.values()){if(!a.has(l)){let g=new Os(this.tiles.get(l));g.colorSpace=yt,g.magFilter=it,a.set(l,g),o.set(l,new Sr({map:g,roughness:.85}))}let d=c==="floor"?.3:Ki[c].height,p=c==="pillar"?new Jt(.48,.48,d,12):new ci(1,d,1),m=new Us(p,o.get(l),u.length),y=new be;u.forEach((g,f)=>{y.makeTranslation(g.x+.5,g.y+d/2,g.z+.5),m.setMatrixAt(f,y)}),m.castShadow=c!=="floor",m.receiveShadow=!0,m.userData.terrain=!0,m.userData.shape=c,m.userData.cells=u,m.computeBoundingSphere(),this.terrainGroup.add(m)}if(t.decorated&&t.base&&e.theme==="race"){let l=new nt(new Bn(2.9,5.1,4,1,Math.PI/4),zc("#344653",{side:Ar}));l.rotation.x=-Math.PI/2,l.position.y=.018,l.scale.set(1.35,.9,1),this.terrainGroup.add(l)}this.grid&&(this.world.remove(this.grid),this.disposeTree(this.grid)),this.grid=new Zs(Math.max(t.width,t.depth),Math.max(t.width,t.depth),"#86dfde","#87bcc0"),this.grid.position.y=.025,this.grid.material.transparent=!0,this.grid.material.opacity=.15,this.world.add(this.grid);let h=Math.max(t.width,t.depth)*.65;Object.assign(this.sun.shadow.camera,{left:-h,right:h,top:h,bottom:-h}),this.sun.shadow.camera.updateProjectionMatrix(),this.updateCamera()}cacheTerrain2d(){if(this.renderer||!this.scene)return;let e=this.map,t=document.createElement("canvas"),i=32;t.width=e.width*i,t.height=(this.side?20:e.depth)*i;let n=t.getContext("2d"),s=new Map(e.tiles.map(a=>[`${a.x},${a.z}`,a.tile]));if(this.side){for(let a=-e.width/2;a<e.width/2;a++){let o=s.get(`${a},0`);o==="void"||!e.base&&!o||(n.fillStyle=this.palette?.side||"#24564d",n.fillRect((a+e.width/2)*i,16*i,i,4*i),n.drawImage(this.tiles.get(o||e.tileset),(a+e.width/2)*i,16*i,i,i))}for(let a of[...e.blocks].sort((o,h)=>h.z-o.z)){let o=Ki[a.shape].height;n.drawImage(this.tiles.get(a.tile),(a.x+e.width/2)*i,(16-a.y-o)*i,i,o*i)}}else{for(let a=-e.width/2;a<e.width/2;a++)for(let o=-e.depth/2;o<e.depth/2;o++){let h=s.get(`${a},${o}`);h==="void"||!e.base&&!h||n.drawImage(this.tiles.get(h||e.tileset),(a+e.width/2)*i,(o+e.depth/2)*i,i,i)}for(let a of[...e.blocks].sort((o,h)=>o.y-h.y)){let o=(a.x+e.width/2)*i,h=(a.z+e.depth/2)*i;n.drawImage(this.tiles.get(a.tile),o,h,i,i),n.fillStyle="#0004",n.fillRect(o,h+i-3,i,3),n.strokeStyle="#d4f6ff55",n.strokeRect(o+1,h+1,i-2,i-2)}}this.terrainCanvas=t}rayAt(e,t){let i=this.canvas.getBoundingClientRect();this.v.set((e-i.left)/this.w*2-1,-(t-i.top)/this.h*2+1),this.camera.updateMatrixWorld(),this.world.updateMatrixWorld(!0),this.ray.setFromCamera(this.v,this.camera)}screenToWorld(e,t,i=0){let n=this.canvas.getBoundingClientRect(),s=e-n.left,a=t-n.top,o=Qi(this.scene||{map:this.map},.1);if(this.renderer){this.rayAt(e,t);let c=new Rt(new w(0,1,0),-i),u=new w;return this.ray.ray.intersectPlane(c,u)?{x:je(u.x,o.minX,o.maxX),y:i,z:je(u.z,o.minZ,o.maxZ)}:{x:0,y:i,z:0}}let h=this.scale2d(),l=this.center2d();return this.side?{x:je((s-this.w/2)/h+l.x,o.minX,o.maxX),y:je(l.y-(a-this.h/2)/h,0,20),z:.5}:{x:je((s-this.w/2)/h+l.x,o.minX,o.maxX),y:i,z:je((a-this.h/2)/h+l.z+i,o.minZ,o.maxZ)}}placementPoint(e,t){if(!this.renderer)return this.screenToWorld(e,t);this.rayAt(e,t);let i=this.ray.intersectObjects(this.terrainGroup.children,!0).find(n=>n.object.userData.terrain);return i&&i.face.normal.y>.5?{x:i.point.x,y:Math.max(0,i.point.y),z:i.point.z}:this.screenToWorld(e,t)}terrainCell(e,t,i){if(!this.renderer){let s=this.screenToWorld(e,t);return{x:Math.floor(s.x),y:this.side?Math.floor(s.y):i.layer||0,z:this.side?0:Math.floor(s.z)}}if(this.rayAt(e,t),i.tool!=="floor"&&i.layer===0){let s=this.ray.intersectObjects(this.terrainGroup.children,!0).find(a=>a.object.userData.terrain);if(s){let a=s.point.clone().addScaledVector(s.face.normal,i.erase?-.015:.015);return{x:Math.floor(a.x),y:Math.max(0,Math.floor(a.y)),z:Math.floor(a.z)}}}let n=this.screenToWorld(e,t,i.tool==="floor"?0:i.layer||0);return{x:Math.floor(n.x),y:i.layer||0,z:Math.floor(n.z)}}hit(e,t,i){if(this.renderer){this.rayAt(e,t);let l=new Set(i.filter(u=>u.visible!==!1&&!u.removed).map(u=>u.id));return this.ray.intersectObjects([...this.meshes].filter(([u])=>l.has(u)).map(([,u])=>u),!0)[0]?.object.userData.objectId||null}let n=this.canvas.getBoundingClientRect(),s=this.scale2d(),a=this.center2d(),o=e-n.left,h=t-n.top;return[...i].sort((l,c)=>this.side?l.z-c.z:c.z-l.z).find(l=>{if(l.visible===!1||l.removed)return!1;let c=this.w/2+(l.x-a.x)*s,u=this.h/2+(this.side?a.y-l.y-.8*l.scale:l.z-a.z-l.y)*s,d=s*1.8*l.scale,p=this.getImage(l),m=l.kind==="image"&&p.naturalHeight?p.naturalWidth/p.naturalHeight:1;return Math.abs(o-c)<d*m*.5&&Math.abs(h-u)<d*.5})?.id||null}scale2d(){return this.playing&&(this.camConfig.follow||this.side)?Math.min(this.w/20,this.h/13):Math.min(this.w/(this.map.width+2),this.h/(this.side?13:this.map.depth+2))*this.zoom}center2d(){return this.playing&&(this.camConfig.follow||this.side)?{x:this.followPoint.x,y:this.followPoint.y+3,z:this.followPoint.z}:{x:this.pan.x,y:(this.sideCenter||4)+this.pan.y,z:this.pan.z}}getImage(e){let t=e.kind+e.color+(e.assetId||"");if(!this.images.has(t)){let i=new Image;i.src=e.kind==="image"?this.assets.find(n=>n.id===e.assetId)?.src||"":"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(Oc(e.kind,e.color)),this.images.set(t,i)}return this.images.get(t)}showSelection(e,t,i){this.selectionLabel.hidden=!e||this.playing,!(!e||this.playing)&&(this.selectionLabel.textContent=e.name+(e.visible===!1?" \xB7 hidden":""),this.selectionLabel.style.left=je(t,45,this.w-45)+"px",this.selectionLabel.style.top=je(i,26,this.h-30)+"px",this.canvas.dataset.selectedId=e.id)}draw(e,t=0,i=null){if(!this.scene)return;let n=Math.min(.05,Math.max(.001,t-(this.lastDrawTime||t)));this.lastDrawTime=t,i&&this.updatePlayCamera(i.player,n);let s=e.find(a=>a.id===this.selected);if(s||(delete this.canvas.dataset.selectedId,this.selectionLabel.hidden=!0),this.renderer){for(let h of e){let l=this.meshes.get(h.id);l&&(l.visible=h.visible!==!1&&!h.removed&&!(i?.player===h&&this.camConfig.preset==="first"),l.position.set(h.x,h.y||0,h.z),l.scale.setScalar(h.scale),l.rotation.y=h.angle??h.rotation??0,h.kind==="crystal"&&!i&&(l.position.y+=Math.sin(t*1.6+h.x)*.12,l.rotation.y+=t*.4),h.kind==="slime"&&(l.scale.y=h.scale*(1+Math.sin(t*3+h.x)*.04)),h.kind==="image"&&l.children.forEach(c=>{c.userData.upright&&(c.rotation.y=Math.atan2(this.camera.position.x-h.x,this.camera.position.z-h.z)-l.rotation.y)}))}if(this.world.updateMatrixWorld(!0),this.selection.visible=!!s&&!i,this.selectionLabel.hidden=!!i||!s,s&&!i){let h=this.meshes.get(s.id);this.selectionBox.setFromObject(h).expandByScalar(.07);let l=new w;this.selectionBox.getCenter(l),l.y=this.selectionBox.max.y+.2,l.project(this.camera),this.showSelection(s,(l.x+1)*this.w/2,(1-l.y)*this.h/2)}if(this.brushCell&&!i){let h=this.brushCell;this.brushPreview.visible=!0,this.brushPreview.box.min.set(h.x,h.y,h.z),this.brushPreview.box.max.set(h.x+1,h.y+(this.brushHeight||1),h.z+1)}else this.brushPreview.visible=!1;this.grid&&(this.grid.visible=this.showGrid&&!i);let a=[...i?.particles||[],...i?.bullets||[]].slice(0,340),o=this.particleGeo.attributes.position;a.forEach((h,l)=>o.setXYZ(l,h.x,h.y,h.z)),o.needsUpdate=!0,this.particleGeo.setDrawRange(0,a.length),this.drawPath3d(),this.renderer.render(this.world,this.camera)}else this.draw2d(e,t,i,s)}drawPath3d(){let e=JSON.stringify(this.path);if(e===this.lastPath||(this.lastPath=e,this.pathGroup&&(this.disposeTree(this.pathGroup),this.world.remove(this.pathGroup)),this.pathGroup=new zt,this.world.add(this.pathGroup),!this.path.length))return;let t=this.path.map(n=>new w(n.x,(n.y||0)+.12,n.z));t.length>1&&t.push(t[0].clone());let i=new pr(new ze().setFromPoints(t),new Ws({color:"#8beaff",dashSize:.2,gapSize:.13,depthTest:!1}));i.computeLineDistances(),this.pathGroup.add(i);for(let n of this.path)Pt(.1,"#abf5ff",this.pathGroup,n.x,(n.y||0)+.12,n.z)}draw2d(e,t,i,n){let s=this.ctx,a=this.scale2d(),o=this.map,h=this.center2d();if(s.clearRect(0,0,this.w,this.h),s.save(),s.translate(this.w/2-h.x*a,this.h/2+(this.side?h.y*a:-h.z*a)),s.imageSmoothingEnabled=!1,this.terrainCanvas&&s.drawImage(this.terrainCanvas,-o.width/2*a,this.side?-16*a:-o.depth/2*a,o.width*a,(this.side?20:o.depth)*a),o.decorated&&this.scene.theme==="race"&&!this.side&&(s.strokeStyle="#344453",s.lineWidth=a*2.2,s.strokeRect(-a*4.6,-a*2.8,a*9.2,a*5.6),s.strokeStyle="#d3dbb9",s.lineWidth=1,s.setLineDash([10,10]),s.strokeRect(-a*4.6,-a*2.8,a*9.2,a*5.6),s.setLineDash([])),this.showGrid&&!i){s.strokeStyle="#9bc7bb33",s.lineWidth=1;for(let l=-o.width/2;l<=o.width/2;l++)s.beginPath(),s.moveTo(l*a,this.side?-16*a:-o.depth/2*a),s.lineTo(l*a,this.side?0:o.depth/2*a),s.stroke();for(let l=this.side?-16:-o.depth/2;l<=(this.side?0:o.depth/2);l++)s.beginPath(),s.moveTo(-o.width/2*a,l*a),s.lineTo(o.width/2*a,l*a),s.stroke()}this.path.length&&!i&&(s.strokeStyle="#85ecff",s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),this.path.forEach((l,c)=>{let u=l.x*a,d=(this.side?-(l.y||0):l.z)*a;c?s.lineTo(u,d):s.moveTo(u,d)}),s.closePath(),s.stroke(),s.setLineDash([]));for(let l of[...e].sort((c,u)=>this.side?u.z-c.z:c.z-u.z)){if(l.removed||l.visible===!1)continue;let c=this.getImage(l),u=a*1.8*l.scale,d=l.kind==="image"&&c.naturalWidth?c.naturalWidth/c.naturalHeight:1;s.save(),s.translate(l.x*a,(this.side?-l.y-.8*l.scale:l.z-l.y)*a),["car","ship"].includes(l.kind)&&s.rotate(-(l.angle??l.rotation)+Math.PI),c.complete&&c.naturalWidth&&s.drawImage(c,-u*d/2,-u/2,u*d,u),s.restore()}if(n&&!i){let l=a*1.8*n.scale,c=this.getImage(n),u=n.kind==="image"&&c.naturalHeight?c.naturalWidth/c.naturalHeight:1,d=n.x*a,p=(this.side?-n.y-.8*n.scale:n.z-n.y)*a;s.strokeStyle="#8decff",s.lineWidth=2,s.setLineDash([5,3]),s.strokeRect(d-l*u*.55,p-l*.55,l*u*1.1,l*1.1),s.setLineDash([]);for(let[m,y]of[[-1,-1],[-1,1],[1,-1],[1,1]])s.fillStyle="#c7f7ff",s.fillRect(d+m*l*u*.55-3,p+y*l*.55-3,6,6);this.showSelection(n,this.w/2+(n.x-h.x)*a,this.h/2+(this.side?h.y-n.y-.8*n.scale:n.z-n.y-h.z)*a-l*.6)}if(this.brushCell&&!i){let l=this.brushCell;s.strokeStyle="#a4f3c4",s.lineWidth=2,s.strokeRect(l.x*a,(this.side?-l.y-1:l.z)*a,a,this.side?a*(this.brushHeight||1):a)}for(let l of i?.particles||[])s.globalAlpha=Math.min(1,l.life),s.fillStyle=l.color,s.fillRect(l.x*a,(this.side?-l.y:l.z-l.y)*a,4,4);s.globalAlpha=1;for(let l of i?.bullets||[])s.fillStyle="#e3ffbc",s.fillRect(l.x*a-2,(this.side?-l.y:l.z-l.y)*a-5,5,10);s.restore()}destroy(){this.ro.disconnect(),this.world&&this.disposeTree(this.world),this.renderer?.dispose(),this.canvas.remove(),this.selectionLabel.remove()}};var Bc=".game-hud{position:absolute;inset:20px 20px auto;display:flex;gap:10px;pointer-events:none;z-index:8;align-items:center;font:600 13px system-ui;color:#ecfbff}.hud-pill{padding:10px 15px;border:1px solid #5bbcc52b;border-radius:12px;background:#101e2bd9;backdrop-filter:blur(10px)}.hud-spacer{flex:1}.game-hint{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 18px;color:#d5eaf0;font:12px system-ui;background:#12202bd9;border:1px solid #ffffff15;border-radius:10px;white-space:nowrap;z-index:8}.game-overlay{position:absolute;inset:0;display:grid;place-items:center;z-index:12;background:#0b132c75;backdrop-filter:blur(6px)}.game-overlay[hidden]{display:none}.game-card{width:min(440px,90%);padding:32px;background:#15222ef2;border:1px solid #6de0ef55;border-radius:22px;box-shadow:0 25px 100px #0008;text-align:center;color:#f0fbff;font:14px system-ui}.game-card h2{font-size:28px;letter-spacing:-1px;margin:12px 0}.game-card p{line-height:1.7;color:#adc3ce}.game-card .game-big{font-size:42px}.game-card button{display:block;background:#4cdef1;border:0;border-radius:10px;padding:13px 18px;width:100%;color:#10313b;font:700 14px system-ui;cursor:pointer;margin-top:10px}.game-card button.secondary{background:#263847;color:#d4eff6}.touch-controls{position:absolute;bottom:30px;left:24px;right:24px;display:flex;justify-content:space-between;pointer-events:none;z-index:10}.touch-controls .dpad{display:grid;grid-template-columns:repeat(3,42px);grid-template-rows:repeat(2,40px);gap:4px}.touch-controls button{pointer-events:auto;background:#223848c9;border:1px solid #88d9e85c;color:#effaff;font:700 20px system-ui;border-radius:10px;touch-action:none;user-select:none}.touch-controls .touch-action{height:62px;width:62px;align-self:flex-end}.touch-controls .touch-interact{height:42px;width:42px;align-self:flex-end;margin-right:8px}.touch-controls .up{grid-column:2}.touch-controls .left{grid-row:2}.touch-controls .down{grid-row:2}.touch-controls .right{grid-row:2}.touch-controls .actions{display:flex}.game-note{position:absolute;left:50%;top:80px;transform:translateX(-50%);background:#172d3e;color:#c1f5ff;padding:12px 18px;border:1px solid #54cddb66;border-radius:12px;z-index:11;font:13px system-ui;text-align:center}.touch-controls{opacity:.55}.touch-controls:hover{opacity:1}@media(pointer:fine) and (min-width:900px){.touch-controls{display:none}}@media(max-width:600px){.game-hint{bottom:8px;font-size:10px}.game-hud{inset:12px 12px auto}.hud-pill{padding:8px}}",ea=class{constructor({host:e,project:t,sceneIndex:i=0,renderer:n=null,onStop:s=()=>{}}){if(this.host=e,this.project=t,this.startIndex=i,this.onStop=s,this.ownsRenderer=!n,n)this.renderer=n;else try{this.renderer=new Cr(e,t.mode)}catch{e.querySelectorAll("canvas").forEach(o=>o.remove()),this.renderer=new Cr(e,"2d")}this.renderer.configure(t.camera),this.input={},this.paused=!1,this.muted=!t.sound,this.audioCtx=null,this.activeAudio=new Set,this.destroyed=!1,this.ui=document.createElement("div"),this.ui.className="player-ui",this.ui.innerHTML=`<div class="game-hud"><div class="hud-pill hud-title"></div><div class="hud-spacer"></div><div class="hud-pill hud-score"></div><div class="hud-pill hud-hearts"></div><div class="hud-pill hud-time"></div></div><div class="game-hint">${t.genre==="racing"?"\u2191 Accelerate &nbsp; \u2190 \u2192 Steer &nbsp; \u2193 Brake":t.genre==="shooter"?"Arrow keys / WASD to move &nbsp; \xB7 &nbsp; Space to shoot":"Arrow keys / WASD to move &nbsp; \xB7 &nbsp; Space to jump &nbsp; \xB7 &nbsp; E to talk"}</div><div class="touch-controls"><div class="dpad"><button class="up" data-key="up" aria-label="Move up">\u2191</button><button class="left" data-key="left" aria-label="Move left">\u2190</button><button class="down" data-key="down" aria-label="Move down">\u2193</button><button class="right" data-key="right" aria-label="Move right">\u2192</button></div><div class="actions"><button class="touch-interact" data-key="interact" aria-label="Talk">E</button><button class="touch-action" data-key="action" aria-label="Jump or shoot">\u2726</button></div></div><div class="game-overlay" hidden></div><div class="game-note" hidden></div>`,e.append(this.ui),this.overlay=this.ui.querySelector(".game-overlay");let a=t.camera?.preset;a==="side"?this.ui.querySelector(".game-hint").textContent="\u2190 \u2192 / A D to run \xB7 Space to jump \xB7 E to talk":(a==="first"||a==="third")&&(this.ui.querySelector(".game-hint").textContent="WASD / arrows to move \xB7 Drag to look \xB7 Q / R turn \xB7 Space \xB7 E talk"),this.keymap={q:"turnLeft",Q:"turnLeft",r:"turnRight",R:"turnRight",ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"," ":"action",e:"interact",E:"interact"},this.keydown=o=>{if(o.key==="Escape"){this.onStop();return}let h=this.keymap[o.key];h&&(o.preventDefault(),this.input[h]=!0)},this.keyup=o=>{let h=this.keymap[o.key];h&&(o.preventDefault(),this.input[h]=!1)},this.blur=()=>{this.input={}},window.addEventListener("keydown",this.keydown),window.addEventListener("keyup",this.keyup),window.addEventListener("blur",this.blur),this.ui.querySelectorAll("[data-key]").forEach(o=>{o.onpointerdown=h=>{h.preventDefault(),o.setPointerCapture(h.pointerId),this.input[o.dataset.key]=!0},o.onpointerup=o.onpointercancel=()=>{this.input[o.dataset.key]=!1}}),this.worldClick=o=>{if(this.paused||!this.sim||this.lookMoved||o.target!==this.renderer.canvas)return;let h=this.renderer.hit(o.clientX,o.clientY,this.sim.objects),l=this.sim.objects.find(c=>c.id===h);l&&Ye(l,"talk")&&(l.kind==="button"||this.sim.player&&Math.hypot(l.x-this.sim.player.x,l.z-this.sim.player.z)<2)&&(this.playSound(l.soundId),this.showStory())},e.addEventListener("pointerup",this.worldClick),this.lookDown=o=>{this.paused||!["first","third"].includes(this.project.camera?.preset)||o.target!==this.renderer.canvas||(this.lookDrag={id:o.pointerId,x:o.clientX,y:o.clientY},this.lookMoved=!1,this.host.setPointerCapture(o.pointerId))},this.lookMove=o=>{if(!this.lookDrag||this.lookDrag.id!==o.pointerId)return;let h=o.clientX-this.lookDrag.x,l=o.clientY-this.lookDrag.y;Math.abs(h)+Math.abs(l)>2&&(this.lookMoved=!0),this.renderer.cameraYaw-=h*.005,this.renderer.cameraPitch=je(this.renderer.cameraPitch+l*.004,-1.2,1.2),this.lookDrag.x=o.clientX,this.lookDrag.y=o.clientY},this.lookUp=()=>{this.lookDrag=null},e.addEventListener("pointerdown",this.lookDown),e.addEventListener("pointermove",this.lookMove),e.addEventListener("pointerup",this.lookUp),e.addEventListener("pointercancel",this.lookUp),this.reset(),this.playMusic(),this.last=performance.now(),this.frame=requestAnimationFrame(o=>this.loop(o))}reset(){this.paused=!1,this.overlay.hidden=!0,this.input={},this.sim=new Ur(this.project,this.startIndex,e=>this.event(e)),this.renderer.selected=null,this.renderer.path=[],this.renderer.setScene(this.sim.scene,this.project.assets),this.renderer.beginPlay(this.project.camera,this.sim.player),this.hudCache=null,this.updateHud(),this.project.genre==="story"&&this.showStory()}event(e){if(e.type==="scene"){let t=this.project.scenes[e.index];this.renderer.setScene(t,this.project.assets),this.ui.querySelector(".hud-title").textContent=t.name,this.sim&&(this.renderer.followPoint.set(this.sim.player?.x||0,this.sim.player?.y||0,this.sim.player?.z||0),this.renderer.cameraReady=!1,this.host.classList.remove("scene-fade","scene-slide"),this.host.offsetWidth,t.transition!=="none"&&this.host.classList.add("scene-"+t.transition),this.project.genre==="story"&&queueMicrotask(()=>this.showStory()))}e.type==="collect"&&(this.tone(660,.13,"sine"),setTimeout(()=>this.tone(990,.15,"sine"),70),this.playSound(e.object?.soundId)),e.type==="shoot"&&this.tone(300,.07,"triangle",100),e.type==="hurt"&&this.tone(140,.18,"triangle",80),e.type==="locked"&&this.note(`Find ${Math.max(0,this.project.rules.targetScore-this.sim.score)} more crystals to open the portal.`),e.type==="talk"&&(this.playSound(e.object?.soundId),this.showStory()),e.type==="win"&&(this.tone(880,.3),this.showCard("\u2726","You made it!",`${this.sim.score} points. A whole world of possibilities.`,[{label:"Play again",action:()=>this.reset()},{label:"Back to creating",action:this.onStop,secondary:!0}])),e.type==="lose"&&this.showCard("\u2661","One more adventure?","Every great game takes a little practice.",[{label:"Try again",action:()=>this.reset()},{label:"Back to creating",action:this.onStop,secondary:!0}])}showCard(e,t,i,n){this.paused=!0,this.input={},this.overlay.hidden=!1,this.overlay.innerHTML=`<div class="game-card"><span class="game-big">${Rr(e)}</span><h2>${Rr(t)}</h2><p>${Rr(i)}</p>${n.map((s,a)=>`<button class="${s.secondary?"secondary":""}" data-choice="${a}">${Rr(s.label)}</button>`).join("")}</div>`,this.overlay.querySelectorAll("button").forEach(s=>s.onclick=()=>{this.overlay.hidden=!0,this.paused=!1,n[Number(s.dataset.choice)].action()})}showStory(){let e=this.sim.scene.story;this.showCard("\u263E",e.title,e.text,e.choices.map(t=>({label:t.text,action:()=>{this.sim.next(t.target)}})))}note(e){let t=this.ui.querySelector(".game-note");t.textContent=e,t.hidden=!1,clearTimeout(this.noteTimer),this.noteTimer=setTimeout(()=>t.hidden=!0,2400)}updateHud(){if(!this.sim)return;let e=[this.sim.sceneIndex,this.sim.score,this.sim.lives,Math.ceil(this.sim.time)].join(":");if(e===this.hudCache)return;this.hudCache=e,this.ui.querySelector(".hud-title").textContent=this.sim.scene.name,this.ui.querySelector(".hud-score").textContent=`\u25C6 ${this.sim.score}${this.project.rules.targetScore?" / "+this.project.rules.targetScore:""}`,this.ui.querySelector(".hud-hearts").textContent="\u2665 ".repeat(Math.max(0,this.sim.lives));let t=this.ui.querySelector(".hud-time");t.hidden=!this.project.rules.timeLimit,t.textContent=`\u25F7 ${Math.max(0,Math.ceil(this.project.rules.timeLimit-this.sim.time))}s`}togglePause(){if(this.overlay.hidden)return this.paused=!this.paused,this.input={},this.note(this.paused?"Paused. Take your time.":"Let\u2019s play!"),this.paused}loop(e){if(this.destroyed)return;let t=Math.min((e-this.last)/1e3,.05);this.last=e;let i=Array.from(navigator.getGamepads?.()||[]).find(n=>n&&n.connected);if(i){let n=i.axes[0]||0,s=i.axes[1]||0,a=i.axes[2]||0;this.input.left=n<-.25||!!i.buttons[14]?.pressed,this.input.right=n>.25||!!i.buttons[15]?.pressed,this.input.up=s<-.25||!!i.buttons[12]?.pressed,this.input.down=s>.25||!!i.buttons[13]?.pressed,this.input.turnLeft=a<-.25||!!i.buttons[4]?.pressed,this.input.turnRight=a>.25||!!i.buttons[5]?.pressed,this.input.action=!!(i.buttons[0]?.pressed||i.buttons[7]?.pressed),this.input.interact=!!(i.buttons[2]?.pressed||i.buttons[3]?.pressed)}this.paused||(["first","third"].includes(this.project.camera?.preset)&&(this.renderer.cameraYaw+=((this.input.turnLeft?1:0)-(this.input.turnRight?1:0))*t*1.7,this.input.moveYaw=this.renderer.cameraYaw,this.input.lookPitch=this.renderer.cameraPitch),this.sim.update(t,this.input)),this.renderer.draw(this.sim.objects,e/1e3,this.sim),this.updateHud(),this.frame=requestAnimationFrame(n=>this.loop(n))}tone(e,t=.1,i="sine",n=e){if(!(this.muted||this.destroyed))try{this.audioCtx??=new(window.AudioContext||window.webkitAudioContext),this.audioCtx.resume();let s=this.audioCtx.createOscillator(),a=this.audioCtx.createGain(),o=this.audioCtx.currentTime;s.type=i,s.frequency.setValueAtTime(e,o),s.frequency.exponentialRampToValueAtTime(n,o+t),a.gain.setValueAtTime(.065,o),a.gain.exponentialRampToValueAtTime(.001,o+t),s.connect(a),a.connect(this.audioCtx.destination),s.start(o),s.stop(o+t)}catch{}}playSound(e){if(this.muted||!e)return;let t=this.project.assets.find(n=>n.id===e&&n.kind==="audio");if(!t)return;let i=new Audio(t.src);i.volume=.4,this.activeAudio.add(i),i.onended=()=>this.activeAudio.delete(i),i.play().catch(()=>{})}playMusic(){let e=this.project.assets.find(t=>t.id===this.project.music&&t.kind==="audio");e&&(this.music=new Audio(e.src),this.music.loop=!0,this.music.volume=.2,this.music.muted=this.muted,this.music.play().catch(()=>{}))}setMuted(e){this.muted=e,this.music&&(this.music.muted=e);for(let t of this.activeAudio)t.muted=e}destroy(){this.destroyed=!0,cancelAnimationFrame(this.frame),clearTimeout(this.noteTimer),window.removeEventListener("keydown",this.keydown),window.removeEventListener("keyup",this.keyup),window.removeEventListener("blur",this.blur),this.host.removeEventListener("pointerup",this.worldClick),this.host.removeEventListener("pointerdown",this.lookDown),this.host.removeEventListener("pointermove",this.lookMove),this.host.removeEventListener("pointerup",this.lookUp),this.host.removeEventListener("pointercancel",this.lookUp),this.renderer.endPlay(),this.music?.pause();for(let e of this.activeAudio)e.pause();this.audioCtx?.close(),this.ui.remove(),this.ownsRenderer&&this.renderer.destroy()}};var kc=Tl(JSON.parse(document.getElementById("soulcode-project").textContent)),Hc=document.createElement("style");Hc.textContent=Bc;document.head.append(Hc);var Tp=document.getElementById("game"),Ai,Ap=()=>{Ai?.destroy(),document.getElementById("start-screen").hidden=!0,Ai=new ea({host:Tp,project:kc,onStop:()=>{Ai.destroy(),Ai=null,document.getElementById("start-screen").hidden=!1}})};document.getElementById("start-play").addEventListener("click",Ap);document.getElementById("game-name").textContent=kc.name;document.getElementById("mute-game").onclick=()=>{Ai&&(Ai.setMuted(!Ai.muted),document.getElementById("mute-game").textContent=Ai.muted?"Sound off":"Sound on")};})();
/*! @license three.js r162 MIT License https://github.com/mrdoob/three.js/blob/dev/LICENSE */
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
