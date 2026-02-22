const SIZE=16;
const COLORS=['red','blue','green','yellow','purple'];
const STAGES=[{level:1,target:5000,time:150},{level:2,target:10000,time:140},{level:3,target:18000,time:130},{level:4,target:27000,time:120}];
const SCORE={eggToChick:100,chickToAdult:300,fried:1000};

const boardEl=document.getElementById('board');
const statusEl=document.getElementById('status');
const stageEl=document.getElementById('stage');
const scoreEl=document.getElementById('score');
const goalEl=document.getElementById('goal');
const timeEl=document.getElementById('time');

let board=[]; let selected=null; let score=0; let stageIndex=0; let timeLeft=STAGES[0].time; let timer=null;

const egg=(c)=>({type:'egg',color:c});
const randEgg=()=>egg(COLORS[Math.floor(Math.random()*COLORS.length)]);
const clone=()=>board.map(r=>r.map(c=>({...c})));
const isAdj=(a,b)=>Math.abs(a.r-b.r)+Math.abs(a.c-b.c)===1;

function initBoard(){ board=Array.from({length:SIZE},()=>Array.from({length:SIZE},()=>randEgg())); }

function cellVisual(c){
  if(c.type==='egg'){const m={red:['#f94144','🥚'],blue:['#277da1','🥚'],green:['#43aa8b','🥚'],yellow:['#f9c74f','🥚'],purple:['#9d4edd','🥚']};return m[c.color];}
  if(c.type==='chick') return ['#ffd166','🐥'];
  if(c.type==='rooster') return ['#ef476f','🐓'];
  if(c.type==='hen') return ['#f78c6b','🐔'];
  return ['#0f172a',''];
}

function render(){
  const st=STAGES[Math.min(stageIndex,STAGES.length-1)];
  stageEl.textContent=String(st.level); scoreEl.textContent=String(score); goalEl.textContent=String(st.target); timeEl.textContent=String(timeLeft);
  boardEl.innerHTML='';
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    const div=document.createElement('button'); div.className='cell'; div.type='button';
    const [bg,label]=cellVisual(board[r][c]); div.style.background=bg; div.textContent=label;
    if(selected&&selected.r===r&&selected.c===c) div.classList.add('sel');
    div.addEventListener('click',()=>onCell(r,c)); boardEl.appendChild(div);
  }
}

function lines3(){ const out=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<=SIZE-3;c++) out.push([{r,c},{r,c:c+1},{r,c:c+2}]);
  for(let c=0;c<SIZE;c++)for(let r=0;r<=SIZE-3;r++) out.push([{r,c},{r:r+1,c},{r:r+2,c}]);
  return out;
}

function resolveOnce(b){
  let gained=0,matched=false;
  for(const line of lines3()){
    const [a,m,z]=line; const cells=[b[a.r][a.c],b[m.r][m.c],b[z.r][z.c]];
    if(cells.every(x=>x.type==='egg') && cells[0].color===cells[1].color && cells[1].color===cells[2].color){
      matched=true; gained+=SCORE.eggToChick; b[a.r][a.c]={type:'empty'}; b[z.r][z.c]={type:'empty'}; b[m.r][m.c]={type:'chick'}; continue;
    }
    if(cells.every(x=>x.type==='chick')){matched=true; gained+=SCORE.chickToAdult; b[a.r][a.c]={type:'empty'}; b[z.r][z.c]={type:'empty'}; b[m.r][m.c]=Math.random()>.5?{type:'rooster'}:{type:'hen'}; continue;}
    const adult=cells.filter(x=>x.type==='rooster'||x.type==='hen').length, chick=cells.filter(x=>x.type==='chick').length;
    if(adult===1&&chick===2){matched=true; gained+=SCORE.fried; for(const p of line) b[p.r][p.c]={type:'empty'};}
  }
  if(matched){
    for(let c=0;c<SIZE;c++){
      const stack=[]; for(let r=SIZE-1;r>=0;r--) if(b[r][c].type!=='empty') stack.push(b[r][c]);
      for(let r=SIZE-1;r>=0;r--) b[r][c]=stack[SIZE-1-r]||randEgg();
    }
  }
  return {b,gained,matched};
}

function move(from,to){
  if(!isAdj(from,to)) return {gain:0,combo:0};
  const b=clone(); [b[from.r][from.c],b[to.r][to.c]]=[b[to.r][to.c],b[from.r][from.c]];
  let gain=0,combo=0;
  while(true){const r=resolveOnce(b); if(!r.matched) break; gain+=Math.round(r.gained*(1+combo*0.2)); combo++;}
  board=b; return {gain,combo};
}

function onCell(r,c){
  if(timeLeft<=0) return;
  if(!selected){selected={r,c}; render(); return;}
  const res=move(selected,{r,c}); selected=null; score+=res.gain;
  statusEl.textContent=res.combo>1?`${res.combo} Combo!`:res.combo===1?'Match!':'No Match';
  const st=STAGES[Math.min(stageIndex,STAGES.length-1)];
  if(score>=st.target){stageIndex=Math.min(stageIndex+1,STAGES.length-1); timeLeft=STAGES[stageIndex].time; statusEl.textContent=`Stage ${stageIndex+1} 시작!`;}
  render();
}

function start(){ clearInterval(timer); timer=setInterval(()=>{timeLeft=Math.max(0,timeLeft-1); if(timeLeft===0) statusEl.textContent='Time Over'; render();},1000); }

document.getElementById('restart').addEventListener('click',()=>{score=0;stageIndex=0;timeLeft=STAGES[0].time;selected=null;statusEl.textContent='Restarted';initBoard();render();start();});
initBoard();render();start();
