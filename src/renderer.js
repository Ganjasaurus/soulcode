import * as THREE from 'three';
import {art} from './art.js';
import {has,clamp,cameraDefaults} from './model.js';
import {defaultMap,TILESETS,SHAPES,tileCanvas,bounds,TerrainIndex} from './terrain.js';
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
 const asset=assets.find(a=>a.id===o.assetId);if(asset){let sprite;const tex=new THREE.TextureLoader().load(asset.src,t=>{if(sprite){const ratio=t.image.width/t.image.height;sprite.scale.x=1.5*ratio;}});tex.colorSpace=THREE.SRGBColorSpace;tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.LinearFilter;
 if(o.billboard==='screen')sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,alphaTest:.1}));else{sprite=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.1,side:THREE.DoubleSide}));sprite.userData.upright=true;}
 sprite.scale.set(1.5*(asset.width||1)/(asset.height||1),1.5,1);sprite.position.y=.75;g.add(sprite);}
 }else if(o.kind==='button'){
 box(1.5,.25,.75,c,g,0,.2);const play=mesh(new THREE.ConeGeometry(.18,.4,3),'#164655',g,0,.38);play.rotation.z=-Math.PI/2;
 }else{for(let i=0;i<8;i++){const a=i*2.4;const b=mesh(new THREE.OctahedronGeometry(.07),c,g,Math.cos(a)*.6,.3+i*.17,Math.sin(a)*.6,{emissive:c,emissiveIntensity:.7});b.rotation.z=a;}}
 g.traverse(m=>{m.userData.objectId=o.id;});return g;
}
export class Renderer{
 constructor(host,mode='3d'){
 this.host=host;this.mode=mode;this.zoom=1;this.angle=.62;this.elevation=.78;this.showGrid=false;this.selected=null;this.path=[];this.meshes=new Map();this.images=new Map();this.assetSources=new Map();this.assets=[];this.map=defaultMap();this.pan={x:0,y:0,z:0};this.camConfig=cameraDefaults(mode==='3d'?'iso':'flat');this.followPoint=new THREE.Vector3();this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-label',mode==='3d'?'3D game world':'2D game world');host.prepend(this.canvas);
 this.selectionLabel=document.createElement('div');this.selectionLabel.className='selection-tag';this.selectionLabel.hidden=true;host.append(this.selectionLabel);
 this.tiles=new Map(Object.keys(TILESETS).map(t=>[t,tileCanvas(t)]));
 if(mode==='3d'){
 this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
 this.world=new THREE.Scene();this.ortho=new THREE.OrthographicCamera(-12,12,8,-8,.1,250);this.perspective=new THREE.PerspectiveCamera(65,1,.07,200);this.camera=this.ortho;this.world.add(new THREE.HemisphereLight('#c0e6f0','#243d3e',1.8));
 const sun=new THREE.DirectionalLight('#fff6e1',2.5);sun.position.set(-7,15,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20});sun.shadow.bias=-.0008;sun.shadow.normalBias=.03;this.world.add(sun);this.sun=sun;
 const blue=new THREE.DirectionalLight('#73bdff',.85);blue.position.set(8,5,-6);this.world.add(blue);
 this.content=new THREE.Group();this.world.add(this.content);this.terrainGroup=new THREE.Group();this.world.add(this.terrainGroup);this.ray=new THREE.Raycaster();this.groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.v=new THREE.Vector2();
 this.selectionBox=new THREE.Box3();this.selection=new THREE.Box3Helper(this.selectionBox,'#80eaff');this.selection.material.depthTest=false;this.selection.material.depthWrite=false;this.selection.material.transparent=true;this.selection.material.opacity=.95;this.selection.renderOrder=999;this.selection.visible=false;this.world.add(this.selection);
 this.brushPreview=new THREE.Box3Helper(new THREE.Box3(),'#8ff5cd');this.brushPreview.material.depthTest=false;this.brushPreview.material.depthWrite=false;this.brushPreview.renderOrder=998;this.brushPreview.visible=false;this.world.add(this.brushPreview);
 this.particleGeo=new THREE.BufferGeometry();this.particleGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(340*3),3));this.particlePoints=new THREE.Points(this.particleGeo,new THREE.PointsMaterial({color:'#a7f4ff',size:.11,transparent:true,opacity:.9}));this.world.add(this.particlePoints);
 }else this.ctx=this.canvas.getContext('2d');
 this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(host);this.resize();
 }
 get side(){return this.camConfig.preset==='side';}
 configure(config){this.camConfig={...cameraDefaults(this.mode==='3d'?'iso':'flat'),...config};this.sideCenter=4;if(this.scene)this.cacheTerrain2d();}
 resize(){this.w=this.host.clientWidth||800;this.h=this.host.clientHeight||600;if(this.renderer){this.renderer.setSize(this.w,this.h,false);this.perspective.aspect=this.w/this.h;this.perspective.updateProjectionMatrix();this.updateCamera();}else{this.canvas.width=this.w*Math.min(devicePixelRatio,2);this.canvas.height=this.h*Math.min(devicePixelRatio,2);this.ctx.setTransform(Math.min(devicePixelRatio,2),0,0,Math.min(devicePixelRatio,2),0,0);}}
 updateCamera(){if(!this.ortho||this.playing)return;this.camera=this.ortho;const ar=this.w/this.h,h=Math.max(8.2,this.map.depth*.65,this.map.width/ar*.6)/this.zoom;this.camera.left=-h*ar;this.camera.right=h*ar;this.camera.top=h;this.camera.bottom=-h;this.camera.position.set(this.pan.x+Math.sin(this.angle)*70*Math.cos(this.elevation),this.pan.y+Math.sin(this.elevation)*70,this.pan.z+Math.cos(this.angle)*70*Math.cos(this.elevation));this.camera.lookAt(this.pan.x,this.pan.y+.2,this.pan.z);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();}
 orbit(dx,dy){this.angle+=dx*.008;this.elevation=clamp(this.elevation+dy*.005,.2,1.5);this.updateCamera();}
 panPixels(dx,dy){if(this.renderer){const units=(this.ortho.top-this.ortho.bottom)/this.h;this.pan.x-=dx*units*Math.cos(this.angle)+dy*units*Math.sin(this.angle)/Math.max(.25,Math.sin(this.elevation));this.pan.z+=dx*units*Math.sin(this.angle)-dy*units*Math.cos(this.angle)/Math.max(.25,Math.sin(this.elevation));}else{const k=this.scale2d();this.pan.x-=dx/k;if(this.side)this.pan.y+=dy/k;else this.pan.z-=dy/k;}this.updateCamera();}
 setZoom(z){this.zoom=clamp(z,.3,5);this.updateCamera();}
 reset(){this.angle=.62;this.elevation=.78;this.pan={x:0,y:0,z:0};this.setZoom(1);}
 beginPlay(config,player){this.configure(config);if(!this.playing)this.savedView={pan:{...this.pan},zoom:this.zoom};this.playing=true;this.followPoint.set(player?.x||0,player?.y||0,player?.z||0);this.cameraYaw=(config.yaw||0)*Math.PI/180;this.cameraPitch=(config.angle||0)*Math.PI/180;this.cameraReady=false;}
 endPlay(){this.playing=false;if(this.savedView){this.pan=this.savedView.pan;this.zoom=this.savedView.zoom;}this.camera=this.ortho;this.updateCamera();}
 updatePlayCamera(player,dt){if(!player)return;const c=this.camConfig,a=1-Math.exp(-8*dt),target=new THREE.Vector3(player.x,player.y,player.z);if(c.follow||c.preset==='first'||c.preset==='third'||c.preset==='side')this.followPoint.lerp(target,a);else this.followPoint.set(0,0,0);
 if(!this.renderer)return;
 if(c.preset==='first'||c.preset==='third'){
 this.camera=this.perspective;const f=this.followPoint,yaw=this.cameraYaw,pitch=this.cameraPitch;let position,look;
 if(c.preset==='first'){position=new THREE.Vector3(f.x,f.y+c.height,f.z);look=position.clone().add(new THREE.Vector3(-Math.sin(yaw)*Math.cos(pitch),-Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)));}
 else{look=new THREE.Vector3(f.x,f.y+.9,f.z);position=new THREE.Vector3(f.x+Math.sin(yaw)*c.distance*Math.cos(pitch),Math.max(f.y+.25,f.y+c.height+Math.sin(pitch)*c.distance*.45),f.z+Math.cos(yaw)*c.distance*Math.cos(pitch));
 // A short column lookup sweep avoids raycasting thousands of block instances.
 const direction=position.clone().sub(look),distance=direction.length();direction.normalize();for(let d=.5;d<distance;d+=.2){const point=look.clone().addScaledVector(direction,d);if(this.terrainIndex.blocked(point.x,point.z,point.y,.15,.12)){position=look.clone().addScaledVector(direction,Math.max(.4,d-.3));break;}}
 }
 if(!this.cameraReady){this.camera.position.copy(position);this.lookAtPoint=look.clone();this.cameraReady=true;}else{this.camera.position.lerp(position,a);this.lookAtPoint.lerp(look,a);}this.camera.lookAt(this.lookAtPoint);
 }else{this.camera=this.ortho;const ar=this.w/this.h,h=c.distance*.95;Object.assign(this.ortho,{left:-h*ar,right:h*ar,top:h,bottom:-h});const f=this.followPoint;this.camera.position.set(f.x+Math.sin(.62+this.cameraYaw)*c.distance*3,f.y+c.height+Math.sin(c.angle*Math.PI/180)*c.distance*3,f.z+Math.cos(.62+this.cameraYaw)*c.distance*3);this.camera.lookAt(f.x,f.y+.3,f.z);this.camera.updateProjectionMatrix();}
 this.camera.updateMatrixWorld();
 }
 disposeTree(root){const geometries=new Set(),materials=new Set(),textures=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){materials.add(m);if(m.map)textures.add(m.map);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
 setScene(s,assets=[]){this.scene=s;this.map=s.map||defaultMap(s.theme);this.assets=assets;this.palette=palettes[s.theme]||palettes.forest;this.host.dataset.theme=s.theme;for(const a of assets){if(this.assetSources.get(a.id)!==a.src){for(const k of this.images.keys())if(k.endsWith(a.id))this.images.delete(k);this.assetSources.set(a.id,a.src);}}
 this.setTerrain(s);if(!this.renderer)return;this.disposeTree(this.content);this.content.clear();this.meshes.clear();
 for(const o of s.objects){const g=makeObject(o,assets);this.content.add(g);this.meshes.set(o.id,g);}this.updateCamera();
 }
 setTerrain(s){this.scene=s;this.map=s.map||defaultMap(s.theme);this.terrainIndex=new TerrainIndex(s);this.cacheTerrain2d();if(!this.renderer)return;
 this.disposeTree(this.terrainGroup);this.terrainGroup.clear();const m=this.map,groups=new Map(),overrides=new Map(m.tiles.map(t=>[`${t.x},${t.z}`,t.tile]));
 const add=(tile,shape,cell)=>{const key=tile+':'+shape;if(!groups.has(key))groups.set(key,{tile,shape,cells:[]});groups.get(key).cells.push(cell);};
 for(let x=-m.width/2;x<m.width/2;x++)for(let z=-m.depth/2;z<m.depth/2;z++){const tile=overrides.get(`${x},${z}`);if(tile==='void'||(!m.base&&!tile))continue;add(tile||m.tileset,'floor',{x,y:-.3,z});}
 for(const b of m.blocks)add(b.tile,b.shape,b);
 const textures=new Map(),materials=new Map();for(const {tile,shape,cells} of groups.values()){
 if(!textures.has(tile)){const texture=new THREE.CanvasTexture(this.tiles.get(tile));texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;textures.set(tile,texture);materials.set(tile,new THREE.MeshStandardMaterial({map:texture,roughness:.85}));}
 const height=shape==='floor'?.3:SHAPES[shape].height,geo=shape==='pillar'?new THREE.CylinderGeometry(.48,.48,height,12):new THREE.BoxGeometry(1,height,1),batch=new THREE.InstancedMesh(geo,materials.get(tile),cells.length),matrix=new THREE.Matrix4();
 cells.forEach((b,i)=>{matrix.makeTranslation(b.x+.5,b.y+height/2,b.z+.5);batch.setMatrixAt(i,matrix);});batch.castShadow=shape!=='floor';batch.receiveShadow=true;batch.userData.terrain=true;batch.userData.shape=shape;batch.userData.cells=cells;batch.computeBoundingSphere();this.terrainGroup.add(batch);
 }
 if(m.decorated&&m.base&&s.theme==='race'){const road=new THREE.Mesh(new THREE.RingGeometry(2.9,5.1,4,1,Math.PI/4),mat('#344653',{side:THREE.DoubleSide}));road.rotation.x=-Math.PI/2;road.position.y=.018;road.scale.set(1.35,.9,1);this.terrainGroup.add(road);}
 if(this.grid){this.world.remove(this.grid);this.disposeTree(this.grid);}this.grid=new THREE.GridHelper(Math.max(m.width,m.depth),Math.max(m.width,m.depth),'#86dfde','#87bcc0');this.grid.position.y=.025;this.grid.material.transparent=true;this.grid.material.opacity=.15;this.world.add(this.grid);
 const extent=Math.max(m.width,m.depth)*.65;Object.assign(this.sun.shadow.camera,{left:-extent,right:extent,top:extent,bottom:-extent});this.sun.shadow.camera.updateProjectionMatrix();this.updateCamera();
 }
 cacheTerrain2d(){if(this.renderer||!this.scene)return;const m=this.map,c=document.createElement('canvas'),cell=32;c.width=m.width*cell;c.height=(this.side?20:m.depth)*cell;const ctx=c.getContext('2d'),overrides=new Map(m.tiles.map(t=>[`${t.x},${t.z}`,t.tile]));
 if(this.side){for(let x=-m.width/2;x<m.width/2;x++){const tile=overrides.get(`${x},0`);if(tile==='void'||(!m.base&&!tile))continue;ctx.fillStyle=this.palette?.side||'#24564d';ctx.fillRect((x+m.width/2)*cell,16*cell,cell,4*cell);ctx.drawImage(this.tiles.get(tile||m.tileset),(x+m.width/2)*cell,16*cell,cell,cell);}for(const b of [...m.blocks].sort((a,b)=>b.z-a.z)){const h=SHAPES[b.shape].height;ctx.drawImage(this.tiles.get(b.tile),(b.x+m.width/2)*cell,(16-b.y-h)*cell,cell,h*cell);}}
 else{for(let x=-m.width/2;x<m.width/2;x++)for(let z=-m.depth/2;z<m.depth/2;z++){const t=overrides.get(`${x},${z}`);if(t==='void'||(!m.base&&!t))continue;ctx.drawImage(this.tiles.get(t||m.tileset),(x+m.width/2)*cell,(z+m.depth/2)*cell,cell,cell);}for(const b of [...m.blocks].sort((a,b)=>a.y-b.y)){const x=(b.x+m.width/2)*cell,y=(b.z+m.depth/2)*cell;ctx.drawImage(this.tiles.get(b.tile),x,y,cell,cell);ctx.fillStyle='#0004';ctx.fillRect(x,y+cell-3,cell,3);ctx.strokeStyle='#d4f6ff55';ctx.strokeRect(x+1,y+1,cell-2,cell-2);}}
 this.terrainCanvas=c;
 }
 rayAt(clientX,clientY){const r=this.canvas.getBoundingClientRect();this.v.set((clientX-r.left)/this.w*2-1,-(clientY-r.top)/this.h*2+1);this.camera.updateMatrixWorld();this.world.updateMatrixWorld(true);this.ray.setFromCamera(this.v,this.camera);}
 screenToWorld(clientX,clientY,height=0){const r=this.canvas.getBoundingClientRect(),x=clientX-r.left,y=clientY-r.top,b=bounds(this.scene||{map:this.map},.1);if(this.renderer){this.rayAt(clientX,clientY);const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-height),pt=new THREE.Vector3();if(!this.ray.ray.intersectPlane(plane,pt))return {x:0,y:height,z:0};return {x:clamp(pt.x,b.minX,b.maxX),y:height,z:clamp(pt.z,b.minZ,b.maxZ)};}
 const k=this.scale2d(),center=this.center2d();return this.side?{x:clamp((x-this.w/2)/k+center.x,b.minX,b.maxX),y:clamp(center.y-(y-this.h/2)/k,0,20),z:.5}:{x:clamp((x-this.w/2)/k+center.x,b.minX,b.maxX),y:height,z:clamp((y-this.h/2)/k+center.z+height,b.minZ,b.maxZ)};
 }
 placementPoint(x,y){if(!this.renderer)return this.screenToWorld(x,y);this.rayAt(x,y);const hit=this.ray.intersectObjects(this.terrainGroup.children,true).find(h=>h.object.userData.terrain);if(hit&&hit.face.normal.y>.5)return {x:hit.point.x,y:Math.max(0,hit.point.y),z:hit.point.z};return this.screenToWorld(x,y);}
 terrainCell(x,y,brush){if(!this.renderer){const p=this.screenToWorld(x,y);return {x:Math.floor(p.x),y:this.side?Math.floor(p.y):brush.layer||0,z:this.side?0:Math.floor(p.z)};}
 this.rayAt(x,y);if(brush.tool!=='floor'&&brush.layer===0){const hit=this.ray.intersectObjects(this.terrainGroup.children,true).find(h=>h.object.userData.terrain);if(hit){const point=hit.point.clone().addScaledVector(hit.face.normal,brush.erase?-.015:.015);return {x:Math.floor(point.x),y:Math.max(0,Math.floor(point.y)),z:Math.floor(point.z)};}}
 const p=this.screenToWorld(x,y,brush.tool==='floor'?0:brush.layer||0);return {x:Math.floor(p.x),y:brush.layer||0,z:Math.floor(p.z)};
 }
 hit(clientX,clientY,objects){if(this.renderer){this.rayAt(clientX,clientY);const valid=new Set(objects.filter(o=>o.visible!==false&&!o.removed).map(o=>o.id));const hits=this.ray.intersectObjects([...this.meshes].filter(([id])=>valid.has(id)).map(([,g])=>g),true);return hits[0]?.object.userData.objectId||null;}
 const r=this.canvas.getBoundingClientRect(),k=this.scale2d(),center=this.center2d(),px=clientX-r.left,py=clientY-r.top;
 return [...objects].sort((a,b)=>this.side?a.z-b.z:b.z-a.z).find(o=>{if(o.visible===false||o.removed)return false;const sx=this.w/2+(o.x-center.x)*k,sy=this.h/2+(this.side?center.y-o.y-.8*o.scale:o.z-center.z-o.y)*k,size=k*1.8*o.scale,im=this.getImage(o),ratio=o.kind==='image'&&im.naturalHeight?im.naturalWidth/im.naturalHeight:1;return Math.abs(px-sx)<size*ratio*.5&&Math.abs(py-sy)<size*.5;})?.id||null;
 }
 scale2d(){if(this.playing&&(this.camConfig.follow||this.side))return Math.min(this.w/20,this.h/13);return Math.min(this.w/(this.map.width+2),this.h/(this.side?13:this.map.depth+2))*this.zoom;}
 center2d(){if(this.playing&&(this.camConfig.follow||this.side))return {x:this.followPoint.x,y:this.followPoint.y+3,z:this.followPoint.z};return {x:this.pan.x,y:(this.sideCenter||4)+this.pan.y,z:this.pan.z};}
 getImage(o){const key=o.kind+o.color+(o.assetId||'');if(!this.images.has(key)){const im=new Image();im.src=o.kind==='image'?(this.assets.find(a=>a.id===o.assetId)?.src||''):'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(art(o.kind,o.color));this.images.set(key,im);}return this.images.get(key);}
 showSelection(o,x,y){this.selectionLabel.hidden=!o||this.playing;if(!o||this.playing)return;this.selectionLabel.textContent=o.name+(o.visible===false?' · hidden':'');this.selectionLabel.style.left=clamp(x,45,this.w-45)+'px';this.selectionLabel.style.top=clamp(y,26,this.h-30)+'px';this.canvas.dataset.selectedId=o.id;}
 draw(objects,t=0,simulation=null){if(!this.scene)return;const dt=Math.min(.05,Math.max(.001,t-(this.lastDrawTime||t)));this.lastDrawTime=t;if(simulation)this.updatePlayCamera(simulation.player,dt);
 const selected=objects.find(o=>o.id===this.selected);if(!selected){delete this.canvas.dataset.selectedId;this.selectionLabel.hidden=true;}
 if(this.renderer){for(const o of objects){const g=this.meshes.get(o.id);if(!g)continue;g.visible=o.visible!==false&&!o.removed&&!(simulation?.player===o&&this.camConfig.preset==='first');g.position.set(o.x,o.y||0,o.z);g.scale.setScalar(o.scale);g.rotation.y=o.angle??o.rotation??0;if(o.kind==='crystal'&&!simulation){g.position.y+=Math.sin(t*1.6+o.x)*.12;g.rotation.y+=t*.4;}if(o.kind==='slime')g.scale.y=o.scale*(1+Math.sin(t*3+o.x)*.04);if(o.kind==='image')g.children.forEach(s=>{if(s.userData.upright)s.rotation.y=Math.atan2(this.camera.position.x-o.x,this.camera.position.z-o.z)-g.rotation.y;});}
 this.world.updateMatrixWorld(true);this.selection.visible=!!selected&&!simulation;this.selectionLabel.hidden=!!simulation||!selected;
 if(selected&&!simulation){const g=this.meshes.get(selected.id);this.selectionBox.setFromObject(g).expandByScalar(.07);const p=new THREE.Vector3();this.selectionBox.getCenter(p);p.y=this.selectionBox.max.y+.2;p.project(this.camera);this.showSelection(selected,(p.x+1)*this.w/2,(1-p.y)*this.h/2);}
 if(this.brushCell&&!simulation){const p=this.brushCell;this.brushPreview.visible=true;this.brushPreview.box.min.set(p.x,p.y,p.z);this.brushPreview.box.max.set(p.x+1,p.y+(this.brushHeight||1),p.z+1);}else this.brushPreview.visible=false;
 if(this.grid)this.grid.visible=this.showGrid&&!simulation;
 const parts=[...(simulation?.particles||[]),...(simulation?.bullets||[])].slice(0,340);const pos=this.particleGeo.attributes.position;parts.forEach((p,i)=>pos.setXYZ(i,p.x,p.y,p.z));pos.needsUpdate=true;this.particleGeo.setDrawRange(0,parts.length);
 this.drawPath3d();this.renderer.render(this.world,this.camera);
 }else this.draw2d(objects,t,simulation,selected);
 }
 drawPath3d(){const str=JSON.stringify(this.path);if(str===this.lastPath)return;this.lastPath=str;if(this.pathGroup){this.disposeTree(this.pathGroup);this.world.remove(this.pathGroup);}this.pathGroup=new THREE.Group();this.world.add(this.pathGroup);if(!this.path.length)return;const pts=this.path.map(p=>new THREE.Vector3(p.x,(p.y||0)+.12,p.z));if(pts.length>1)pts.push(pts[0].clone());const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:'#8beaff',dashSize:.2,gapSize:.13,depthTest:false}));line.computeLineDistances();this.pathGroup.add(line);for(const p of this.path)ball(.1,'#abf5ff',this.pathGroup,p.x,(p.y||0)+.12,p.z);}
 draw2d(objects,t,sim,selected){const c=this.ctx,k=this.scale2d(),m=this.map,center=this.center2d();c.clearRect(0,0,this.w,this.h);c.save();c.translate(this.w/2-center.x*k,this.h/2+(this.side?center.y*k:-center.z*k));c.imageSmoothingEnabled=false;
 if(this.terrainCanvas)c.drawImage(this.terrainCanvas,-m.width/2*k,this.side?-16*k:-m.depth/2*k,m.width*k,(this.side?20:m.depth)*k);
 if(m.decorated&&this.scene.theme==='race'&&!this.side){c.strokeStyle='#344453';c.lineWidth=k*2.2;c.strokeRect(-k*4.6,-k*2.8,k*9.2,k*5.6);c.strokeStyle='#d3dbb9';c.lineWidth=1;c.setLineDash([10,10]);c.strokeRect(-k*4.6,-k*2.8,k*9.2,k*5.6);c.setLineDash([]);}
 if(this.showGrid&&!sim){c.strokeStyle='#9bc7bb33';c.lineWidth=1;for(let x=-m.width/2;x<=m.width/2;x++){c.beginPath();c.moveTo(x*k,this.side?-16*k:-m.depth/2*k);c.lineTo(x*k,this.side?0:m.depth/2*k);c.stroke();}for(let y=this.side?-16:-m.depth/2;y<=(this.side?0:m.depth/2);y++){c.beginPath();c.moveTo(-m.width/2*k,y*k);c.lineTo(m.width/2*k,y*k);c.stroke();}}
 if(this.path.length&&!sim){c.strokeStyle='#85ecff';c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();this.path.forEach((p,i)=>{const x=p.x*k,y=(this.side?-(p.y||0):p.z)*k;i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();c.stroke();c.setLineDash([]);}
 for(const o of [...objects].sort((a,b)=>this.side?b.z-a.z:a.z-b.z)){if(o.removed||o.visible===false)continue;const im=this.getImage(o),size=k*1.8*o.scale,ratio=o.kind==='image'&&im.naturalWidth?im.naturalWidth/im.naturalHeight:1;c.save();c.translate(o.x*k,(this.side?-o.y-.8*o.scale:o.z-o.y)*k);if(['car','ship'].includes(o.kind))c.rotate(-(o.angle??o.rotation)+Math.PI);if(im.complete&&im.naturalWidth)c.drawImage(im,-size*ratio/2,-size/2,size*ratio,size);c.restore();}
 if(selected&&!sim){const size=k*1.8*selected.scale,im=this.getImage(selected),ratio=selected.kind==='image'&&im.naturalHeight?im.naturalWidth/im.naturalHeight:1,x=selected.x*k,y=(this.side?-selected.y-.8*selected.scale:selected.z-selected.y)*k;c.strokeStyle='#8decff';c.lineWidth=2;c.setLineDash([5,3]);c.strokeRect(x-size*ratio*.55,y-size*.55,size*ratio*1.1,size*1.1);c.setLineDash([]);for(const [dx,dy] of [[-1,-1],[-1,1],[1,-1],[1,1]]){c.fillStyle='#c7f7ff';c.fillRect(x+dx*size*ratio*.55-3,y+dy*size*.55-3,6,6);}this.showSelection(selected,this.w/2+(selected.x-center.x)*k,this.h/2+(this.side?center.y-selected.y-.8*selected.scale:selected.z-selected.y-center.z)*k-size*.6);}
 if(this.brushCell&&!sim){const p=this.brushCell;c.strokeStyle='#a4f3c4';c.lineWidth=2;c.strokeRect(p.x*k,(this.side?-p.y-1:p.z)*k,k,this.side?k*(this.brushHeight||1):k);}
 for(const p of sim?.particles||[]){c.globalAlpha=Math.min(1,p.life);c.fillStyle=p.color;c.fillRect(p.x*k,(this.side?-p.y:p.z-p.y)*k,4,4);}c.globalAlpha=1;for(const b of sim?.bullets||[]){c.fillStyle='#e3ffbc';c.fillRect(b.x*k-2,(this.side?-b.y:b.z-b.y)*k-5,5,10);}c.restore();
 }
 destroy(){this.ro.disconnect();if(this.world)this.disposeTree(this.world);this.renderer?.dispose();this.canvas.remove();this.selectionLabel.remove();}
}
