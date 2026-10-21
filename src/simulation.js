import {clone,clamp,has,behavior} from './model.js';
export class Simulation {
 constructor(project,sceneIndex=0,onEvent=()=>{}) {this.project=project;this.onEvent=onEvent;this.score=0;this.lives=project.rules.lives;this.time=0;this.won=false;this.lost=false;this.particles=[];this.bullets=[];this.load(sceneIndex);}
 load(index){this.sceneIndex=clamp(index,0,this.project.scenes.length-1);this.scene=this.project.scenes[this.sceneIndex];this.objects=clone(this.scene.objects).filter(o=>o.visible!==false);this.player=this.objects.find(o=>has(o,'control')||has(o,'drive'));this.objects.forEach(o=>{o.home={x:o.x,z:o.z,y:o.y};o.angle=o.rotation||0;o.vy=0;o.target=0;o.cooldown=0;});this.bullets=[];this.invincible=0;this.talkCooldown=1;this.onEvent({type:'scene',index:this.sceneIndex});}
 emit(type,o){this.onEvent({type,object:o});}
 burst(x,z,color='#68edff',count=18){for(let i=0;i<count;i++)this.particles.push({x,z,y:.5,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,vy:Math.random()*3,life:.6+Math.random()*.6,color});}
 next(target='next'){if(target==='close')return;if(target==='next'){if(this.sceneIndex+1<this.project.scenes.length)this.load(this.sceneIndex+1);else this.win();}else{const i=this.project.scenes.findIndex(s=>s.id===target);if(i>=0)this.load(i);}}
 win(){if(this.won)return;this.won=true;this.emit('win');}
 hit(){if(this.invincible>0||this.won||this.lost)return;this.lives--;this.invincible=2;this.emit('hurt');if(this.player){this.burst(this.player.x,this.player.z,'#ff929c');this.player.x=this.player.home.x;this.player.z=this.player.home.z;}if(this.lives<=0){this.lost=true;this.emit('lose');}}
 move(o,dx,dz){const ox=o.x,oz=o.z;o.x=clamp(o.x+dx,-7.8,7.8);o.z=clamp(o.z+dz,-5.1,5.1);if(o===this.player){for(const b of this.objects){if(b!==o&&has(b,'solid')&&!b.removed&&Math.hypot(o.x-b.x,o.z-b.z)<.48*(o.scale+b.scale)&&o.y<1){o.x=ox;o.z=oz;break;}}}}
 update(dt,input={}){
 dt=clamp(dt,0,.05);this.time+=dt;this.invincible=Math.max(0,this.invincible-dt);this.talkCooldown=Math.max(0,this.talkCooldown-dt);
 this.particles=this.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;p.vy-=6*dt;return p.life>0;});
 if(this.won||this.lost)return;
 if(this.project.rules.timeLimit&&this.time>=this.project.rules.timeLimit){this.lost=true;this.emit('lose');return;}
 for(const o of this.objects){if(o.removed)continue;o.cooldown=Math.max(0,o.cooldown-dt);
 if(has(o,'control')){let x=(input.right?1:0)-(input.left?1:0),z=(input.down?1:0)-(input.up?1:0);const len=Math.hypot(x,z)||1;const speed=behavior(o,'control').speed||4;this.move(o,x/len*speed*dt,z/len*speed*dt);if(x||z)o.angle=Math.atan2(x,z);}
 if(has(o,'drive')){const max=behavior(o,'drive').speed||6;o.velocity=(o.velocity||0)+((input.up?6:0)-(input.down?7:0))*dt;o.velocity*=Math.pow(.72,dt);o.velocity=clamp(o.velocity,-max*.45,max);o.angle+=((input.left?1:0)-(input.right?1:0))*dt*2*Math.sign(o.velocity||1);this.move(o,Math.sin(o.angle)*o.velocity*dt,Math.cos(o.angle)*o.velocity*dt);}
 if(has(o,'jump')){if(input.action&&o.y<=o.home.y+.01)o.vy=behavior(o,'jump').power||6;o.vy-=16*dt;o.y=Math.max(o.home.y,o.y+o.vy*dt);if(o.y===o.home.y)o.vy=0;}
 if(has(o,'shoot')&&input.action&&o.cooldown<=0){this.bullets.push({x:o.x,z:o.z-.5,y:.6,life:3,speed:behavior(o,'shoot').speed||8});o.cooldown=.23;this.emit('shoot',o);}
 const follow=behavior(o,'follow'),patrol=behavior(o,'patrol'),wander=behavior(o,'wander');let target=null,speed=0;
 if(follow&&this.player&&o!==this.player){target=this.player;speed=follow.speed||1.6;}
 else if(patrol){const points=o.path?.length?o.path:[{x:o.home.x-1.4,z:o.home.z},{x:o.home.x+1.4,z:o.home.z}];o.target%=points.length;target=points[o.target];speed=patrol.speed||2;if(Math.hypot(o.x-target.x,o.z-target.z)<.15)o.target=(o.target+1)%points.length;}
 else if(wander){if(!o.wanderTo||Math.hypot(o.x-o.wanderTo.x,o.z-o.wanderTo.z)<.2)o.wanderTo={x:clamp(o.home.x+(Math.random()-.5)*5,-7,7),z:clamp(o.home.z+(Math.random()-.5)*5,-4.5,4.5)};target=o.wanderTo;speed=wander.speed||1.2;}
 if(target){const dx=target.x-o.x,dz=target.z-o.z,d=Math.hypot(dx,dz);if(d>.15){this.move(o,dx/d*Math.min(speed*dt,d),dz/d*Math.min(speed*dt,d));o.angle=Math.atan2(dx,dz);}}
 if(has(o,'spin'))o.angle+=dt*(behavior(o,'spin').speed||1.5);
 if(has(o,'bounce')&&!has(o,'jump'))o.y=o.home.y+.2+Math.sin(this.time*(behavior(o,'bounce').speed||2))*.2;
 if(has(o,'particles')&&Math.random()<dt*6)this.burst(o.x,o.z,o.color,1);
 }
 const p=this.player;
 if(p){for(const o of this.objects){if(o===p||o.removed)continue;const near=Math.hypot(p.x-o.x,p.z-o.z)<.6*(p.scale+o.scale);
 if(near&&has(o,'collect')){o.removed=true;this.score++;this.burst(o.x,o.z,o.color);this.emit('collect',o);if(this.project.rules.targetScore>0&&this.score>=this.project.rules.targetScore&&['racing','shooter'].includes(this.project.genre))this.win();}
 if(near&&has(o,'hazard')&&Math.abs(p.y-o.y)<.7)this.hit();
 if(near&&has(o,'goal')){if(this.score>=this.project.rules.targetScore){this.next();return;}else if(this.talkCooldown<=0){this.emit('locked',o);this.talkCooldown=2;}}
 if(has(o,'talk')&&Math.hypot(p.x-o.x,p.z-o.z)<2&&input.interact&&this.talkCooldown<=0){this.emit('talk',o);this.talkCooldown=1;}
 }}
 for(const b of this.bullets){b.z-=b.speed*dt;b.life-=dt;for(const o of this.objects){if(!o.removed&&has(o,'hazard')&&Math.hypot(b.x-o.x,b.z-o.z)<.7*o.scale){o.removed=true;b.life=0;this.score++;this.burst(o.x,o.z,o.color);this.emit('collect',o);if(this.score>=this.project.rules.targetScore)this.win();break;}}}this.bullets=this.bullets.filter(b=>b.life>0&&b.z>-7);
 }
}
