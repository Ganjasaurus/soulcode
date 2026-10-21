import {build} from 'esbuild';
import {copyFile,mkdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['src/app.js'],bundle:true,minify:true,format:'esm',outfile:'dist/app.js',target:'es2022'});
await build({entryPoints:['src/standalone.js'],bundle:true,minify:true,format:'iife',outfile:'dist/player.js',target:'es2022'});
await copyFile('node_modules/three/LICENSE','dist/THREE-LICENSE.txt');
console.log('Built editor and self-contained game player.');
