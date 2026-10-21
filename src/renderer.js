import * as THREE from 'three';
import {art} from './art.js';
import {has,clamp} from './model.js';
const palettes={forest:{top:'#347c65',side:'#203f3b',path:'#78a184',fog:'#142529'},night:{top:'#39445f',side:'#242b43',path:'#6a7191',fog:'#1b2034'},space:{top:'#28384a',side:'#192338',path:'#465b73',fog:'#101727'},race:{top:'#32675d',side:'#233e3e',path:'#364451',fog:'#15292d'},sand:{top:'#c5a87b',side:'#816e55',path:'#e3cba3',fog:'#2d2923'}};
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.75,...extra});
function mesh(geo,color,parent,x=0,y=0,z=0,extra={}){const m=new THREE.Mesh(geo,mat(color,extra));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const box=(w,h,d,c,g,x=0,y=0,z=0)=>mesh(new THREE.BoxGeometry(w,h,d),c,g,x,y,z);
const ball=(r,c,g,x=0,y=0,z=0)=>mesh(new THREE.SphereGeometry(r,16,12),c,g,x,y,z);
function makeObject(o,assets){
 const g=new THREE.Group(),c=o.color;
 if(['hero','npc'].includes(o.kind)){
 box(.53,.56,.42,c,g,0,.63);box(.83,.58,.57,c,g,0,1.19);box(.64,.29,.05,'#153649',g,0,1.23,.302);
 box(.1,.14,.04,'#d8ffff',g,-.18,1.24,.335);box(.1,.14,.04,'#d8ffff',g,.18,1.24,.335);
 ball(.12,c,g,-.4,.7);ball(.12,c,g,.4,.7);box(.18,.24,.28,'#264650',g,-.17,.19,.03);box(.18,.24,.28,'#264650',g,.17,.19,.03);
 mesh(new THREE.CylinderGeometry(.025,.025,.2,6),c,g,0,1.58);ball(.07,'#d9ffff',g,0,1.71);
 }else if(o.kind==='tree'){
 mesh(new THREE.CylinderGeometry(.13,.19,1,7),'#8c7258',g,0,.5);
 mesh(new THREE.ConeGeometry(.98,1.55,7),c,g,0,1.25);mesh(new THREE.ConeGeometry(.78,1.4,7),c,g,0,1.9);mesh(new THREE.ConeGeometry(.55,1.2,7),'#62c99e',g,0,2.45);
 }else if(o.kind==='crystal'){
 const gem=mesh(new THREE.OctahedronGeometry(.43),c,g,0,.8,0,{metalness:.25,roughness:.25,emissive:c,emissiveIntensity:.17});gem.scale.set(.73,1.35,.73);
 const ring=mesh(new THREE.RingGeometry(.28,.38,32),c,g,0,.025,0,{transparent:true,opacity:.2,side:THREE.DoubleSide});ring.rotation.x=-Math.PI/2;
 }else if(o.kind==='slime'){
 const s=ball(.58,c,g,0,.48);s.scale.y=.78;
 ball(.075,'#252844',g,-.2,.58,.48);ball(.075,'#252844',g,.2,.58,.48);ball(.13,c,g,-.35,.13,.23);ball(.13,c,g,.35,.13,.23);
 }else if(o.kind==='rock'){const r=mesh(new THREE.DodecahedronGeometry(.66),c,g,0,.38);r.scale.set(1,.75,.8);r.rotation.set(.2,.4,.1);
 }else if(o.kind==='crate'){
 box(.9,.85,.9,c,g,0,.425);for(const x of [-.34,.34])box(.12,.95,.98,'#875b3a',g,x,.44);for(const y of [.1,.73])box(.97,.1,.96,'#ba874c',g,0,y);
 }else if(o.kind==='portal'){
 const arch=new THREE.Shape();arch.moveTo(-.85,0);arch.lineTo(-.85,1.35);arch.absarc(0,1.35,.85,Math.PI,0,true);arch.lineTo(.85,0);arch.lineTo(.59,0);arch.lineTo(.59,1.35);arch.absarc(0,1.35,.59,0,Math.PI,false);arch.lineTo(-.59,0);
 mesh(new THREE.ExtrudeGeometry(arch,{depth:.3,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:2,steps:1}),c,g,0,0,0,{emissive:c,emissiveIntensity:.45});
 mesh(new THREE.PlaneGeometry(1.15,1.6),'#9e87ff',g,0,.86,.12,{transparent:true,opacity:.35,side:THREE.DoubleSide,emissive:'#9e87ff',emissiveIntensity:.7});box(2,.15,.8,'#62698f',g,0,.08,.15);
 }else if(o.kind==='car'){
 box(.8,.28,1.3,c,g,0,.37);box(.65,.3,.65,c,g,0,.62,-.1);box(.58,.24,.04,'#b8e8f4',g,0,.64,.245);
 for(const x of [-.45,.45])for(const z of [-.42,.42]){const w=mesh(new THREE.CylinderGeometry(.21,.21,.16,12),'#19242a',g,x,.23,z);w.rotation.z=Math.PI/2;}
 box(.17,.1,.04,'#fff6c8',g,-.23,.38,.67);box(.17,.1,.04,'#fff6c8',g,.23,.38,.67);
 }else if(o.kind==='ship'){
 const b=mesh(new THREE.ConeGeometry(.4,1.4,4),c,g,0,.4);b.rotation.x=-Math.PI/2;box(1.4,.12,.45,c,g,0,.32,.18);ball(.2,'#c4f3ff',g,0,.55,-.1);
 }else if(o.kind==='flower'){
 mesh(new THREE.CylinderGeometry(.025,.035,.5,5),'#71b886',g,0,.25);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const b=ball(.13,c,g,Math.cos(a)*.15,.53,Math.sin(a)*.15);b.scale.y=.5;}ball(.09,'#fff3ac',g,0,.56);
 }else if(o.kind==='image'){
 const asset=assets.find(a=>a.id===o.assetId);if(asset){const tex=new THREE.TextureLoader().load(asset.src);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));m.scale.set(1.5,1.5,1);m.position.y=.75;g.add(m);}
 }else if(o.kind==='button'){
 box(1.5,.25,.75,c,g,0,.2);const play=mesh(new THREE.ConeGeometry(.18,.4,3),'#164655',g,0,.38);play.rotation.z=-Math.PI/2;
 }else{for(let i=0;i<8;i++){const a=i*2.4;const b=mesh(new THREE.OctahedronGeometry(.07),c,g,Math.cos(a)*.6,.3+i*.17,Math.sin(a)*.6,{emissive:c,emissiveIntensity:.7});b.rotation.z=a;}}
 g.traverse(m=>{m.userData.objectId=o.id;});return g;
}
export class Renderer{
 constructor(host,mode='3d'){
 this.host=host;this.mode=mode;this.zoom=1;this.angle=.62;this.elevation=.78;this.showGrid=false;this.selected=null;this.path=[];this.meshes=new Map();this.images=new Map();this.assets=[];this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-label',mode==='3d'?'3D game world':'2D game world');host.prepend(this.canvas);
 if(mode==='3d'){
 this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
 this.world=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-12,12,8,-8,.1,100);this.world.add(new THREE.HemisphereLight('#c0e6f0','#243d3e',1.8));
 const sun=new THREE.DirectionalLight('#fff6e1',2.5);sun.position.set(-7,15,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14});sun.shadow.bias=-.0008;sun.shadow.normalBias=.03;this.world.add(sun);
 const blue=new THREE.DirectionalLight('#73bdff',.85);blue.position.set(8,5,-6);this.world.add(blue);
 this.content=new THREE.Group();this.world.add(this.content);this.ray=new THREE.Raycaster();this.groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.v=new THREE.Vector2();
 this.selection=mesh(new THREE.RingGeometry(.65,.69,48),'#66edff',this.world,0,.045,0,{emissive:'#53dfff',emissiveIntensity:2,side:THREE.DoubleSide,depthWrite:false});this.selection.rotation.x=-Math.PI/2;this.selection.visible=false;
 this.particleGeo=new THREE.BufferGeometry();this.particleGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(240*3),3));this.particlePoints=new THREE.Points(this.particleGeo,new THREE.PointsMaterial({color:'#a7f4ff',size:.11,transparent:true,opacity:.9}));this.world.add(this.particlePoints);
 }else this.ctx=this.canvas.getContext('2d');
 this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(host);this.resize();
 }
 resize(){this.w=this.host.clientWidth||800;this.h=this.host.clientHeight||600;if(this.renderer){this.renderer.setSize(this.w,this.h,false);this.updateCamera();}else{this.canvas.width=this.w*Math.min(devicePixelRatio,2);this.canvas.height=this.h*Math.min(devicePixelRatio,2);this.ctx.setTransform(Math.min(devicePixelRatio,2),0,0,Math.min(devicePixelRatio,2),0,0);}}
 updateCamera(){if(!this.camera)return;const h=8.2/this.zoom,ar=this.w/this.h;this.camera.left=-h*ar;this.camera.right=h*ar;this.camera.top=h;this.camera.bottom=-h;this.camera.position.set(Math.sin(this.angle)*23*Math.cos(this.elevation),Math.sin(this.elevation)*23,Math.cos(this.angle)*23*Math.cos(this.elevation));this.camera.lookAt(0,.2,0);this.camera.updateProjectionMatrix();}
 orbit(dx,dy){this.angle+=dx*.008;this.elevation=clamp(this.elevation+dy*.005,.3,1.45);this.updateCamera();}
 setZoom(z){this.zoom=clamp(z,.5,2);this.updateCamera();}
 reset(){this.angle=.62;this.elevation=.78;this.setZoom(1);}
 disposeTree(root){root.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{m.map?.dispose();m.dispose();});}});}
 setScene(s,assets=[]){this.scene=s;this.assets=assets;this.palette=palettes[s.theme]||palettes.forest;this.host.dataset.theme=s.theme;
 if(!this.renderer)return;
 this.disposeTree(this.content);this.content.clear();this.meshes.clear();
 const p=this.palette;
 box(17.2,.7,11.4,p.side,this.content,0,-.49);box(17.2,.14,11.4,p.top,this.content,0,-.07);
 // The tiled border makes the scene feel like a miniature world on a workbench.
 for(let i=0;i<19;i++){box(.5,.1,.18,'#619184',this.content,-8+i*.89,.015,5.6);box(.5,.1,.18,'#619184',this.content,-8+i*.89,.015,-5.6);}
 if(s.theme==='race'){
 const shape=new THREE.Shape();shape.moveTo(-6,-4);shape.lineTo(6,-4);shape.lineTo(6,4);shape.lineTo(-6,4);shape.closePath();const hole=new THREE.Path();hole.moveTo(-3,-1.7);hole.lineTo(-3,1.7);hole.lineTo(3,1.7);hole.lineTo(3,-1.7);hole.closePath();shape.holes.push(hole);const road=mesh(new THREE.ShapeGeometry(shape),p.path,this.content,0,.012);road.rotation.x=-Math.PI/2;
 for(let x=-5;x<=5;x++)for(const z of [-2.8,2.8])box(.45,.02,.06,'#d3daba',this.content,x,.035,z);
 for(let i=0;i<6;i++)box(.34,.025,.36,i%2?'#eaf6f4':'#203c42',this.content,-5.3+i*.34,.04,3.5);
 }else if(s.theme!=='space'){
 for(let i=0;i<16;i++){const x=-3.2+i*.51,z=2.5-i*.4;const tile=box(.64,.035,.47,p.path,this.content,x,.018,z);tile.rotation.y=Math.sin(i*4)*.35;}
 for(let i=0;i<65;i++){const x=Math.sin(i*134.6)*7.9,z=Math.cos(i*71.2)*5.1;const grass=mesh(new THREE.ConeGeometry(.07,.23,3),i%3?'#70b68b':'#a0c78b',this.content,x,.1,z);grass.rotation.z=.2;}
 }else{
 for(let i=0;i<70;i++)ball(.015+i%3*.009,i%2?'#8bafce':'#d7f5ff',this.content,Math.sin(i*135)*8,.03,Math.cos(i*71)*5.2);
 }
 const grid=new THREE.GridHelper(16,16,'#70ccc1','#518c85');grid.position.y=.03;grid.material.transparent=true;grid.material.opacity=.18;grid.visible=this.showGrid;this.content.add(grid);this.grid=grid;
 for(const o of s.objects){const g=makeObject(o,assets);this.content.add(g);this.meshes.set(o.id,g);}
 }
 screenToWorld(clientX,clientY){const r=this.canvas.getBoundingClientRect(),x=clientX-r.left,y=clientY-r.top;if(this.renderer){this.v.set(x/this.w*2-1,-y/this.h*2+1);this.ray.setFromCamera(this.v,this.camera);const pt=new THREE.Vector3();this.ray.ray.intersectPlane(this.groundPlane,pt);return {x:clamp(pt.x,-8,8),z:clamp(pt.z,-5.4,5.4)};}const k=this.scale2d();return {x:clamp((x-this.w/2)/k,-8,8),z:clamp((y-this.h/2)/k,-5.4,5.4)};}
 hit(clientX,clientY,objects){if(this.renderer){const r=this.canvas.getBoundingClientRect();this.v.set((clientX-r.left)/this.w*2-1,-(clientY-r.top)/this.h*2+1);this.ray.setFromCamera(this.v,this.camera);const hits=this.ray.intersectObjects([...this.meshes.values()].filter(g=>g.visible),true);return hits[0]?.object.userData.objectId||null;}const p=this.screenToWorld(clientX,clientY);return [...objects].reverse().find(o=>o.visible!==false&&Math.hypot(o.x-p.x,o.z-p.z)<.7*o.scale)?.id||null;}
 scale2d(){return Math.min(this.w/19,this.h/13)*this.zoom;}
 getImage(o){const key=o.kind+o.color+(o.assetId||'');if(!this.images.has(key)){const im=new Image();im.src=o.kind==='image'?(this.assets.find(a=>a.id===o.assetId)?.src||''):'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(art(o.kind,o.color));this.images.set(key,im);}return this.images.get(key);}
 draw(objects,t=0,simulation=null){if(!this.scene)return;if(this.renderer){for(const o of objects){const g=this.meshes.get(o.id);if(!g)continue;g.visible=o.visible!==false&&!o.removed;g.position.set(o.x,o.y||0,o.z);g.scale.setScalar(o.scale);g.rotation.y=o.angle??o.rotation??0;if(o.kind==='crystal'&&!simulation){g.position.y+=Math.sin(t*1.6+o.x)*.12;g.rotation.y+=t*.4;}if(o.kind==='slime')g.scale.y=o.scale*(1+Math.sin(t*3+o.x)*.04);}
 const selected=objects.find(o=>o.id===this.selected);this.selection.visible=!!selected&&!simulation;if(selected){this.selection.position.set(selected.x,.045,selected.z);this.selection.scale.setScalar(selected.scale);}
 if(this.grid)this.grid.visible=this.showGrid&&!simulation;
 const parts=[...(simulation?.particles||[]),...(simulation?.bullets||[]).map(b=>({...b,y:.65}))].slice(0,240);const pos=this.particleGeo.attributes.position;parts.forEach((p,i)=>pos.setXYZ(i,p.x,p.y,p.z));pos.needsUpdate=true;this.particleGeo.setDrawRange(0,parts.length);
 this.drawPath3d();this.renderer.render(this.world,this.camera);
 }else this.draw2d(objects,t,simulation);}
 drawPath3d(){const str=JSON.stringify(this.path);if(str===this.lastPath)return;this.lastPath=str;if(this.pathGroup){this.disposeTree(this.pathGroup);this.world.remove(this.pathGroup);}this.pathGroup=new THREE.Group();this.world.add(this.pathGroup);if(!this.path.length)return;const pts=this.path.map(p=>new THREE.Vector3(p.x,.12,p.z));if(pts.length>1)pts.push(pts[0].clone());const geo=new THREE.BufferGeometry().setFromPoints(pts);const line=new THREE.Line(geo,new THREE.LineDashedMaterial({color:'#8beaff',dashSize:.2,gapSize:.13}));line.computeLineDistances();this.pathGroup.add(line);for(const p of this.path)ball(.1,'#abf5ff',this.pathGroup,p.x,.12,p.z);}
 draw2d(objects,t,sim){const c=this.ctx,k=this.scale2d(),w=17.2*k,h=11.4*k;c.clearRect(0,0,this.w,this.h);c.save();c.translate(this.w/2,this.h/2);c.fillStyle=this.palette.side;c.beginPath();c.roundRect(-w/2,-h/2+8,w,h,20);c.fill();c.fillStyle=this.palette.top;c.beginPath();c.roundRect(-w/2,-h/2,w,h,20);c.fill();c.strokeStyle='#9bc7bb26';c.lineWidth=1;
 if(this.scene.theme==='race'){c.strokeStyle='#344453';c.lineWidth=k*2.2;c.strokeRect(-k*4.6,-k*2.8,k*9.2,k*5.6);c.strokeStyle='#d3dbb9';c.lineWidth=1;c.setLineDash([10,10]);c.strokeRect(-k*4.6,-k*2.8,k*9.2,k*5.6);c.setLineDash([]);}
 else for(let i=0;i<95;i++){c.fillStyle=this.scene.theme==='space'?'#a9ceec66':'#9fd1ac36';c.beginPath();c.arc(Math.sin(i*135)*w*.46,Math.cos(i*71)*h*.46,i%3===0?1.5:1,0,7);c.fill();}
 if(this.showGrid&&!sim){c.strokeStyle='#9bc7bb26';for(let x=-8;x<=8;x++){c.beginPath();c.moveTo(x*k,-h/2);c.lineTo(x*k,h/2);c.stroke();}for(let y=-5;y<=5;y++){c.beginPath();c.moveTo(-w/2,y*k);c.lineTo(w/2,y*k);c.stroke();}}
 if(this.path.length&&!sim){c.strokeStyle='#85ecff';c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();this.path.forEach((p,i)=>i?c.lineTo(p.x*k,p.z*k):c.moveTo(p.x*k,p.z*k));c.closePath();c.stroke();c.setLineDash([]);this.path.forEach(p=>{c.beginPath();c.arc(p.x*k,p.z*k,5,0,7);c.fillStyle='#a5efff';c.fill();});}
 for(const o of [...objects].sort((a,b)=>a.z-b.z)){if(o.removed||o.visible===false)continue;const im=this.getImage(o),size=k*1.8*o.scale;c.save();c.translate(o.x*k,o.z*k-(o.y||0)*k);if(o.id===this.selected&&!sim){c.strokeStyle='#5ee5ff';c.lineWidth=1.5;c.setLineDash([5,3]);c.strokeRect(-size*.53,-size*.53,size*1.06,size*1.06);c.setLineDash([]);for(const [x,y] of [[-1,-1],[-1,1],[1,-1],[1,1]]){c.fillStyle='#9ff2ff';c.fillRect(x*size*.53-3,y*size*.53-3,6,6);}}if(['car','ship'].includes(o.kind))c.rotate(-(o.angle??o.rotation)+Math.PI);if(im.complete&&im.naturalWidth)c.drawImage(im,-size/2,-size/2,size,size);c.restore();}
 for(const p of sim?.particles||[]){c.globalAlpha=Math.min(1,p.life);c.fillStyle=p.color;c.fillRect(p.x*k,p.z*k-p.y*k,4,4);}c.globalAlpha=1;for(const b of sim?.bullets||[]){c.fillStyle='#e3ffbc';c.fillRect(b.x*k-2,b.z*k-8,4,12);}c.restore();}
 destroy(){this.ro.disconnect();if(this.world)this.disposeTree(this.world);this.renderer?.dispose();this.canvas.remove();}
}
