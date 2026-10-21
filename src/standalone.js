import {GameSession,playerStyles} from './runtime.js';
import {validateProject} from './model.js';
const project=validateProject(JSON.parse(document.getElementById('soulcode-project').textContent));
const style=document.createElement('style');style.textContent=playerStyles;document.head.append(style);
const host=document.getElementById('game');let session;
const start=()=>{session?.destroy();document.getElementById('start-screen').hidden=true;session=new GameSession({host,project,onStop:()=>{session.destroy();session=null;document.getElementById('start-screen').hidden=false;}});};
document.getElementById('start-play').addEventListener('click',start);
document.getElementById('game-name').textContent=project.name;
document.getElementById('mute-game').onclick=()=>{if(session){session.setMuted(!session.muted);document.getElementById('mute-game').textContent=session.muted?'Sound off':'Sound on';}};
