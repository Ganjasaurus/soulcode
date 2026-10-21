// Terrain stays data-only. Rendering batches cells; collision visits nearby columns.
export const TILESETS={grass:{name:'Meadow',color:'#378e68',light:'#67b87d',dark:'#267655'},brick:{name:'Brick',color:'#b26d59',light:'#de9e7e',dark:'#704b4b'},stone:{name:'Stone',color:'#718997',light:'#a0b4bf',dark:'#536875'},sand:{name:'Sand',color:'#c5a475',light:'#e3c795',dark:'#ac8c5f'},wood:{name:'Wood',color:'#98724f',light:'#c49c6a',dark:'#6b4c36'},ice:{name:'Ice',color:'#79b7cc',light:'#c3edf3',dark:'#4f8fae'},metal:{name:'Neon',color:'#263e50',light:'#61dff3',dark:'#1a2d3e'}};
export const SHAPES={cube:{name:'Block',height:1},slab:{name:'Platform',height:.3},pillar:{name:'Pillar',height:1}};
export const MAX_BLOCKS=4096;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const number=(v,d,a,b)=>Number.isFinite(Number(v))?clamp(Number(v),a,b):d;
export const defaultMap=theme=>({width:18,depth:12,base:true,tileset:theme==='sand'?'sand':theme==='space'||theme==='race'?'metal':theme==='night'?'stone':'grass',tiles:[],blocks:[],decorated:true});
export function normalizeMap(value,theme='forest'){
 const m={...defaultMap(theme),...(value||{})};m.width=Math.round(number(m.width,18,8,64)/2)*2;m.depth=Math.round(number(m.depth,12,4,64)/2)*2;m.base=m.base!==false;m.decorated=m.decorated!==false;m.tileset=TILESETS[m.tileset]?m.tileset:'grass';
 const cells=new Map(),blocks=new Map();
 for(const t of (Array.isArray(m.tiles)?m.tiles:[]).slice(0,4096)){if(!t)continue;const x=Math.floor(number(t.x,0,-m.width/2,m.width/2-1)),z=Math.floor(number(t.z,0,-m.depth/2,m.depth/2-1));if(TILESETS[t.tile]||t.tile==='void')cells.set(`${x},${z}`,{x,z,tile:t.tile});}
 for(const b of (Array.isArray(m.blocks)?m.blocks:[]).slice(0,MAX_BLOCKS)){if(!b)continue;const x=Math.floor(number(b.x,0,-m.width/2,m.width/2-1)),z=Math.floor(number(b.z,0,-m.depth/2,m.depth/2-1)),y=Math.floor(number(b.y,0,0,15));blocks.set(`${x},${y},${z}`,{x,y,z,shape:SHAPES[b.shape]?b.shape:'cube',tile:TILESETS[b.tile]?b.tile:m.tileset});}
 return {width:m.width,depth:m.depth,base:m.base,tileset:m.tileset,decorated:m.decorated,tiles:[...cells.values()],blocks:[...blocks.values()]};
}
export function bounds(scene,margin=.35){const m=scene.map||defaultMap(scene.theme);return {minX:-m.width/2+margin,maxX:m.width/2-margin,minZ:-m.depth/2+margin,maxZ:m.depth/2-margin};}
export function paintCell(map,cell,brush){
 const x=Math.floor(cell.x),z=Math.floor(cell.z),y=Math.max(0,Math.min(15,Math.floor(cell.y||0)));
 if(x< -map.width/2||x>=map.width/2||z< -map.depth/2||z>=map.depth/2)return false;
 if(brush.tool==='floor'){
 const old=map.tiles.find(t=>t.x===x&&t.z===z),tile=brush.erase?'void':brush.tile;if(old?.tile===tile)return false;
 map.tiles=map.tiles.filter(t=>t.x!==x||t.z!==z);map.tiles.push({x,z,tile});map.decorated=false;return true;
 }
 if(brush.erase){const before=map.blocks.length;map.blocks=map.blocks.filter(b=>b.x!==x||b.z!==z||b.y!==y);return before!==map.blocks.length;}
 let changed=false;for(let i=0;i<(brush.tool==='wall'?3:1);i++){const by=y+i;if(by>15)break;const old=map.blocks.find(b=>b.x===x&&b.z===z&&b.y===by),shape=brush.tool==='wall'?'cube':brush.shape||'cube';if(old&&old.tile===brush.tile&&old.shape===shape)continue;if(!old&&map.blocks.length>=MAX_BLOCKS)break;map.blocks=map.blocks.filter(b=>b!==old);map.blocks.push({x,y:by,z,shape,tile:brush.tile});changed=true;}
 map.decorated=false;return changed;
}
export function resizeMap(scene,width,depth){const m=scene.map; // Grow freely; shrinking never silently deletes existing work.
 const occupied=[...m.blocks,...m.tiles,...scene.objects.map(o=>({x:o.x,z:o.z}))];
 const neededW=Math.max(8,...occupied.map(b=>2*Math.ceil(Math.abs(b.x+.5)+.5))),neededD=Math.max(4,...occupied.map(b=>2*Math.ceil(Math.abs(b.z+.5)+.5)));
 m.width=Math.max(Math.min(64,width),Math.min(64,neededW));m.depth=Math.max(Math.min(64,depth),Math.min(64,neededD));return {width:m.width,depth:m.depth};
}
export class TerrainIndex{
 constructor(scene){this.map=scene.map||defaultMap(scene.theme);this.columns=new Map();this.tiles=new Map(this.map.tiles.map(t=>[`${t.x},${t.z}`,t.tile]));for(const b of this.map.blocks){const key=`${b.x},${b.z}`;if(!this.columns.has(key))this.columns.set(key,[]);this.columns.get(key).push(b);}this.lastChecks=0;}
 nearby(x,z,r=.32){this.lastChecks=0;const result=[];for(let gx=Math.floor(x-r);gx<=Math.floor(x+r);gx++)for(let gz=Math.floor(z-r);gz<=Math.floor(z+r);gz++){this.lastChecks++;for(const b of this.columns.get(`${gx},${gz}`)||[])result.push(b);}return result;}
 baseAt(x,z){const t=this.tiles.get(`${Math.floor(x)},${Math.floor(z)}`);return t==='void'?false:!!(this.map.base||t);}
 floor(x,z,feet=0,r=.28){let top=this.baseAt(x,z)?0:-Infinity;for(const b of this.nearby(x,z,r)){const h=b.y+SHAPES[b.shape].height;if(h<=feet+.12&&h>top)top=h;}return top;}
 blocked(x,z,feet,height=1.1,r=.28){return this.nearby(x,z,r).some(b=>x+r>b.x&&x-r<b.x+1&&z+r>b.z&&z-r<b.z+1&&feet<b.y+SHAPES[b.shape].height-.03&&feet+height>b.y+.04);}
 ceiling(x,z,previousHead,nextHead,r=.28){let bottom=Infinity;for(const b of this.nearby(x,z,r))if(b.y>=previousHead-.001&&b.y<=nextHead)bottom=Math.min(bottom,b.y);return bottom;}
}
export function tileCanvas(tile){const spec=TILESETS[tile]||TILESETS.grass,c=document.createElement('canvas');c.width=c.height=32;const ctx=c.getContext('2d');ctx.fillStyle=spec.color;ctx.fillRect(0,0,32,32);ctx.strokeStyle=spec.dark;ctx.lineWidth=1;
 if(tile==='brick'||tile==='stone'){for(let y=0;y<32;y+=8){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(32,y);ctx.stroke();for(let x=(y%16?0:8);x<32;x+=16){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+8);ctx.stroke();}}}
 else if(tile==='wood'){for(let y=0;y<32;y+=8){ctx.fillStyle=spec.dark;ctx.fillRect(0,y,32,1);ctx.fillStyle=spec.light;ctx.fillRect((y*7)%25,y+3,10,1);}}
 else if(tile==='metal'){ctx.strokeStyle=spec.light;ctx.globalAlpha=.35;ctx.strokeRect(.5,.5,31,31);ctx.fillStyle=spec.light;ctx.fillRect(3,3,2,2);ctx.fillRect(27,27,2,2);ctx.globalAlpha=1;}
 else{for(let i=0;i<24;i++){ctx.fillStyle=i%3===0?spec.dark:spec.light;ctx.globalAlpha=.4;ctx.fillRect((i*13)%32,(i*23)%32,1+i%3,1);}ctx.globalAlpha=1;if(tile==='ice'){ctx.strokeStyle=spec.light;ctx.beginPath();ctx.moveTo(2,25);ctx.lineTo(25,2);ctx.stroke();}}
 return c;
}
