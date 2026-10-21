import {Renderer} from '../src/renderer.js';
import {makeProject,cameraDefaults,object} from '../src/model.js';
import {Simulation} from '../src/simulation.js';
window.runRendererChecks=async()=>{
 const host=document.createElement('div');host.style='position:fixed;inset:0;background:#152633';document.body.append(host);
 const p=makeProject('blank'),s=p.scenes[0];s.map.width=s.map.depth=64;s.map.decorated=false;s.objects=[];
 for(let x=-32;x<32;x++)for(let z=-32;z<32;z++)s.map.blocks.push({x,y:0,z,tile:'stone',shape:'cube'});
 const r=new Renderer(host,'3d');r.configure(cameraDefaults('iso'));r.setScene(s,[]);r.draw([],0);
 const placementHeight=r.placementPoint(500,350).y;
 const terrainBatches=r.terrainGroup.children.length,blocks=r.terrainGroup.children.reduce((n,m)=>n+(m.userData.shape==='cube'?m.count:0),0),drawCalls=r.renderer.info.render.calls;
 s.objects=[object('hero',.5,.5,{y:1})];r.setScene(s,[]);p.camera=cameraDefaults('third');r.beginPlay(p.camera,s.objects[0]);const sim=new Simulation(p);
 let cameraTypes=[];for(const preset of ['first','third','iso']){r.beginPlay(cameraDefaults(preset),sim.player);r.draw(sim.objects,1,sim);cameraTypes.push(r.camera.type);}
 r.beginPlay(cameraDefaults('third'),sim.player);const times=[];let last=performance.now();for(let i=0;i<15;i++){await new Promise(requestAnimationFrame);const now=performance.now();times.push(now-last);last=now;sim.update(1/60,{right:true});r.draw(sim.objects,2+i/60,sim);}
 const finite=r.camera.position.toArray().every(Number.isFinite),medianFrameMs=times.sort((a,b)=>a-b)[Math.floor(times.length/2)];
 r.endPlay();r.destroy();host.remove();return {terrainBatches,blocks,drawCalls,cameraTypes,finite,medianFrameMs,placementHeight};
};
