import {clone,clamp,has,behavior} from './model.js';
import {TerrainIndex,bounds,SHAPES} from './terrain.js';
export class Simulation {
 constructor(project,sceneIndex=0,onEvent=()=>{}){this.project=project;this.onEvent=onEvent;this.score=0;this.lives=project.rules.lives;this.time=0;this.won=false;this.lost=false;this.particles=[];this.bullets=[];this.side=project.camera?.preset==='side';this.load(sceneIndex);}
 load(index){this.sceneIndex=clamp(index,0,this.project.scenes.length-1);this.scene=this.project.scenes[this.sceneIndex];this.terrain=new TerrainIndex(this.scene);this.limits=bounds(this.scene);this.objects=clone(this.scene.objects).filter(o=>o.visible!==false);this.player=this.objects.find(o=>has(o,'control')||has(o,'drive'));this.objects.forEach(o=>{o.home={x:o.x,z:o.z,y:o.y};o.angle=o.rotation||0;o.vy=0;o.target=0;o.cooldown=0;o.grounded=false;});this.bullets=[];this.invincible=0;this.talkCooldown=1;this.actionWasDown=false;this.onEvent({type:'scene',index:this.sceneIndex});}
 emit(type,o){this.onEvent({type,object:o});}
 burst(x,z,color='#68edff',count=18,y=.5){for(let i=0;i<count&&this.particles.length<240;i++)this.particles.push({x,z,y,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,vy:Math.random()*3,life:.6+Math.random()*.6,color});}
 next(target='next'){if(target==='close')return;if(target==='next'){if(this.sceneIndex+1<this.project.scenes.length)this.load(this.sceneIndex+1);else this.win();}else{const i=this.project.scenes.findIndex(s=>s.id===target);if(i>=0)this.load(i);}}
 win(){if(this.won)return;this.won=true;this.emit('win');}
 hit(){if(this.invincible>0||this.won||this.lost)return;this.lives--;this.invincible=2;this.emit('hurt');if(this.player){this.burst(this.player.x,this.player.z,'#ff929c',18,this.player.y+.5);Object.assign(this.player,this.player.home,{vy:0,velocity:0});}if(this.lives<=0){this.lost=true;this.emit('lose');}}
 blocked(o,x,z){const r=.3*o.scale,h=1.15*o.scale;if(this.terrain.blocked(x,z,o.y,h,r))return true;if(o!==this.player)return false;return this.objects.some(b=>b!==o&&has(b,'solid')&&!b.removed&&Math.hypot(x-b.x,z-b.z)<.48*(o.scale+b.scale)&&o.y<b.y+(b.kind==='tree'?2:1)*b.scale&&o.y+h>b.y+.1);}
 move(o,dx,dz){const b=this.limits;const x=clamp(o.x+dx,b.minX,b.maxX),z=clamp(o.z+dz,b.minZ,b.maxZ);if(!this.blocked(o,x,o.z))o.x=x;if(!this.blocked(o,o.x,z))o.z=z;}
 vertical(o,dt,jump){const old=o.y,h=1.15*o.scale;let floor=this.terrain.floor(o.x,o.z,o.y+.08,.28*o.scale);o.grounded=Number.isFinite(floor)&&Math.abs(o.y-floor)<.13&&o.vy<=0;if(o.grounded){o.y=floor;o.vy=0;}if(jump&&o.grounded){o.vy=behavior(o,'jump')?.power||6;o.grounded=false;this.emit('jump',o);}o.vy-=16*dt;let next=o.y+o.vy*dt;
 if(o.vy>0){const ceiling=this.terrain.ceiling(o.x,o.z,old+h-.01,next+h,.28*o.scale);if(Number.isFinite(ceiling)){next=ceiling-h;o.vy=0;}}
 if(o.vy<=0){floor=this.terrain.floor(o.x,o.z,old+.04,.28*o.scale);if(Number.isFinite(floor)&&next<=floor&&old>=floor-.1){next=floor;o.vy=0;o.grounded=true;}}
 o.y=next;if(o.y< -6){if(o===this.player)this.hit();else Object.assign(o,o.home,{vy:0});}}
 update(dt,input={}){
 dt=clamp(dt,0,.05);this.invincible=Math.max(0,this.invincible-dt);this.talkCooldown=Math.max(0,this.talkCooldown-dt);
 this.particles=this.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;p.vy-=6*dt;return p.life>0;});if(this.won||this.lost)return;this.time+=dt;
 if(this.project.rules.timeLimit&&this.time>=this.project.rules.timeLimit){this.lost=true;this.emit('lose');return;}
 const pressed=input.action&&!this.actionWasDown;this.actionWasDown=!!input.action;
 for(const o of this.objects){if(o.removed)continue;o.cooldown=Math.max(0,o.cooldown-dt);
 if(has(o,'control')){let x=(input.right?1:0)-(input.left?1:0),z=this.side?0:(input.down?1:0)-(input.up?1:0);const len=Math.hypot(x,z)||1,yaw=input.moveYaw||0;const dx=(x*Math.cos(yaw)+z*Math.sin(yaw))/len,dz=(z*Math.cos(yaw)-x*Math.sin(yaw))/len;const speed=behavior(o,'control').speed||4;this.move(o,dx*speed*dt,dz*speed*dt);if(x||z){o.angle=Math.atan2(dx,dz);if(x)o.facing=Math.sign(x);}}
 if(has(o,'drive')){const max=behavior(o,'drive').speed||6;o.velocity=(o.velocity||0)+((input.up?6:0)-(input.down?7:0))*dt;o.velocity*=Math.pow(.72,dt);o.velocity=clamp(o.velocity,-max*.45,max);o.angle+=((input.left?1:0)-(input.right?1:0))*dt*2*Math.sign(o.velocity||1);this.move(o,Math.sin(o.angle)*o.velocity*dt,Math.cos(o.angle)*o.velocity*dt);}
 if(has(o,'shoot')&&input.action&&o.cooldown<=0&&this.bullets.length<100){const yaw=input.moveYaw||0,pitch=this.side?0:input.lookPitch||0;const dx=this.side?(o.facing||1):-Math.sin(yaw)*Math.cos(pitch),dz=this.side?0:-Math.cos(yaw)*Math.cos(pitch),dy=this.side?0:-Math.sin(pitch);this.bullets.push({x:o.x+dx*.5,z:o.z+dz*.5,y:o.y+(this.project.camera?.preset==='first'?this.project.camera.height:.65),dx,dz,dy,life:3,speed:behavior(o,'shoot').speed||8});o.cooldown=.23;this.emit('shoot',o);}
 const follow=behavior(o,'follow'),patrol=behavior(o,'patrol'),wander=behavior(o,'wander');let target=null,speed=0;
 if(follow&&this.player&&o!==this.player){target=this.player;speed=follow.speed||1.6;}
 else if(patrol){const points=o.path?.length?o.path:[{x:o.home.x-1.4,z:o.home.z},{x:o.home.x+1.4,z:o.home.z}];o.target%=points.length;target=points[o.target];speed=patrol.speed||2;if(Math.hypot(o.x-target.x,o.z-target.z)<.15)o.target=(o.target+1)%points.length;}
 else if(wander){if(!o.wanderTo||Math.hypot(o.x-o.wanderTo.x,o.z-o.wanderTo.z)<.2)o.wanderTo={x:clamp(o.home.x+(Math.random()-.5)*5,this.limits.minX,this.limits.maxX),z:this.side?o.home.z:clamp(o.home.z+(Math.random()-.5)*5,this.limits.minZ,this.limits.maxZ)};target=o.wanderTo;speed=wander.speed||1.2;}
 if(target){const dx=target.x-o.x,dz=this.side?0:target.z-o.z,d=Math.hypot(dx,dz);if(d>.15){this.move(o,dx/d*Math.min(speed*dt,d),dz/d*Math.min(speed*dt,d));o.angle=Math.atan2(dx,dz);}}
 const gravity=has(o,'jump')||has(o,'control')||has(o,'drive')||follow||wander||patrol;if(gravity)this.vertical(o,dt,has(o,'jump')&&pressed);
 if(has(o,'spin'))o.angle+=dt*(behavior(o,'spin').speed||1.5);
 if(has(o,'bounce')&&!gravity)o.y=o.home.y+.2+Math.sin(this.time*(behavior(o,'bounce').speed||2))*.2;
 if(has(o,'particles')&&Math.random()<dt*6)this.burst(o.x,o.z,o.color,1,o.y+.5);
 }
 const p=this.player;
 if(p){for(const o of this.objects){if(o===p||o.removed)continue;const planar=Math.hypot(p.x-o.x,p.z-o.z),vertical=Math.abs(p.y-o.y),near=planar<.6*(p.scale+o.scale)&&vertical<1.2*(p.scale+o.scale)/2;
 if(near&&has(o,'collect')){o.removed=true;this.score++;this.burst(o.x,o.z,o.color,18,o.y+.5);this.emit('collect',o);if(this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&['racing','shooter'].includes(this.project.genre))this.win();}
 if(near&&has(o,'hazard')&&vertical<.7)this.hit();
 if(near&&has(o,'goal')){if(this.score>=this.project.rules.targetScore){this.next();return;}else if(this.talkCooldown<=0){this.emit('locked',o);this.talkCooldown=2;}}
 if(has(o,'talk')&&planar<2&&vertical<2&&input.interact&&this.talkCooldown<=0){this.emit('talk',o);this.talkCooldown=1;}
 }}
 for(const b of this.bullets){b.x+=(b.dx||0)*b.speed*dt;b.z+=(b.dz??-1)*b.speed*dt;b.y+=(b.dy||0)*b.speed*dt;b.life-=dt;if(this.terrain.blocked(b.x,b.z,b.y,.1,.08))b.life=0;if(b.life<=0)continue;for(const o of this.objects){if(!o.removed&&has(o,'hazard')&&Math.hypot(b.x-o.x,b.z-o.z)<.7*o.scale&&Math.abs(b.y-(o.y+.5))<.8*o.scale){o.removed=true;b.life=0;this.score++;this.burst(o.x,o.z,o.color,18,o.y+.5);this.emit('collect',o);if(this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore)this.win();break;}}}this.bullets=this.bullets.filter(b=>b.life>0&&Math.abs(b.x)<this.terrain.map.width/2&&Math.abs(b.z)<this.terrain.map.depth/2);
 }
}
