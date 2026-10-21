import {chromium,expect} from '@playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
await mkdir('qa',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.SOULCODE_BROWSER||'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await browser.newContext({viewport:{width:1440,height:960},acceptDownloads:true});const page=await ctx.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.goto('http://127.0.0.1:4173/');await page.waitForSelector('#object-name');
await page.locator('[data-asset="slime"]').dragTo(page.locator('#viewport'),{targetPosition:{x:450,y:300}});await expect(page.locator('#object-count')).toHaveText('24 objects');
await page.locator('[data-panel="behaviors"]').click();await page.locator('[data-add-behavior="follow"]').dragTo(page.locator('#inspector'));await expect(page.locator('.behavior-card')).toHaveCount(3);
await page.locator('#export-button').click();const event=page.waitForEvent('download');await page.locator('#export-html').click();const d=await event;await d.saveAs('qa/game-3d.html');const html=await readFile('qa/game-3d.html','utf8');
const offline=await browser.newContext({offline:true,viewport:{width:1200,height:850}});const game=await offline.newPage();game.on('pageerror',e=>errors.push(e.message));await game.setContent(html,{waitUntil:'load'});await game.locator('#start-play').click();await expect(game.locator('canvas')).toHaveAttribute('aria-label','3D game world');await expect(game.locator('.game-hud')).toBeVisible();await game.keyboard.down('d');await game.waitForTimeout(300);await game.keyboard.up('d');await game.screenshot({path:'qa/export-3d.png'});await game.keyboard.press('Escape');await expect(game.locator('#start-screen')).toBeVisible();await offline.close();
console.log(JSON.stringify({checks:['asset drag and drop in 3D','behavior drag and drop','3D export plays offline','export stop returns to start screen'],errors}));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
