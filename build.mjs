import {build} from 'esbuild';
import {copyFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
await mkdir('dist',{recursive:true});
const plugins=[{name:'three-r162',setup(b){b.onResolve({filter:/^three$/},()=>({path:path.resolve('vendor/three-r162.module.min.js')}));}}];
await build({entryPoints:['src/app.js'],bundle:true,minify:true,format:'esm',outfile:'dist/app.js',target:'es2022',plugins});
await build({entryPoints:['src/standalone.js'],bundle:true,minify:true,format:'iife',outfile:'dist/player.js',target:'es2022',plugins});
await copyFile('node_modules/three/LICENSE','dist/THREE-LICENSE.txt');
console.log('Built editor and self-contained game player.');
