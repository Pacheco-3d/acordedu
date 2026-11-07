/* Motor de cifras: ChordPro, sem bibliotecas e sem dependência de backend. */
const CHROMATIC_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const CHROMATIC_FLAT = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const PITCH = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const CHORD_PATTERN = /^([A-G])([#b♯♭]?)(.*)$/;
const BASS_PATTERN = /\/([A-G])([#b♯♭]?)$/;
const normAcc = s => s.replace('♯','#').replace('♭','b');
const clampNote = n => (n%12+12)%12;
function transposeRoot(input, delta, preferFlats=false){
 const norm=normAcc(input); const ix=PITCH[norm];
 if(ix===undefined) return input;
 const arr = preferFlats ? CHROMATIC_FLAT : CHROMATIC_SHARP;
 return arr[clampNote(ix+delta)];
}
function transposeChord(chord, step=0,preferFlats=false){
 if(!step) return chord;
 const m=chord.match(CHORD_PATTERN);
 if(!m) return chord;
 const originalRoot=m[1]+normAcc(m[2]);
 let suffix=m[3];
 let bass='';
 const bassMatch=suffix.match(BASS_PATTERN);
 if(bassMatch){ bass='/'+transposeRoot(bassMatch[1]+normAcc(bassMatch[2]),step,preferFlats); suffix=suffix.slice(0,-bassMatch[0].length); }
 return transposeRoot(originalRoot,step,preferFlats)+suffix+bass;
}
function transposeKey(key,step){
 const m=key?.match(/^([A-G])([#b]?)(.*)$/);
 if(!m) return key||'—';
 return transposeRoot(m[1]+m[2],step,/[b]/.test(key))+m[3];
}
function getChords(text){
 return [...(text||'').matchAll(/\[([^\]]+)\]/g)].map(m=>m[1]).filter(c=>CHORD_PATTERN.test(c));
}
function plainChordLine(line){return String(line||'').replace(/\[[^\]]+\]/g,'');}
function lineSegments(line){
 const parts=String(line||'').split(/(\[[^\]]+\])/);
 const result=[]; let current=null;
 for(const part of parts){
  if(!part)continue;
  if(part.startsWith('[')&&part.endsWith(']')){
   if(current)result.push(current);
   current={chord:part.slice(1,-1),lyric:''};
  }else if(current){current.lyric+=part;}
  else{ result.push({chord:'',lyric:part}); }
 }
 if(current)result.push(current);
 return result.length?result:[{chord:'',lyric:' '}];
}
/* Estimativa harmônica; não substitui conferência auditiva. */
const MAJOR_PATTERN=[0,2,4,5,7,9,11];
const MINOR_PATTERN=[0,2,3,5,7,8,10];
function detectKey(sections){
 const raw=(sections||[]).flatMap(s=>(s.lines||[]).flatMap(getChords));
 if(!raw.length)return {key:'—',confidence:0,reason:'Sem acordes suficientes'};
 const parsed=raw.map(x=>{
  const m=x.match(/^([A-G])([#b♯♭]?)([^/]*)/);
  if(!m)return null;
  const root=PITCH[m[1]+normAcc(m[2])];
  const q=/^(m(?!aj)|min)/.test(m[3])?'minor':/(dim|º|°|m7b5)/.test(m[3])?'dim':'major';
  return {root,q};
 }).filter(Boolean);
 let scores=[];
 for(let p=0;p<12;p++)for(const minor of [false,true]){
  const scale=minor?MINOR_PATTERN:MAJOR_PATTERN;
  let score=0;
  for(const c of parsed){
   const d=clampNote(c.root-p); const idx=scale.indexOf(d);
   if(idx===-1){score-=1.7;continue;}
   const expected=minor?['minor','dim','major','minor','minor','major','major'][idx]:['major','minor','minor','major','major','minor','dim'][idx];
   score+=expected===c.q?3:0.8;
   if(d===0)score+=2.2;
   if(d===7)score+=0.7;
  }
  const ending=parsed[parsed.length-1];
  if(ending?.root===p)score+=2;
  scores.push({p,minor,score});
 }
 scores.sort((a,b)=>b.score-a.score);
 const top=scores[0],second=scores[1];
 const note=(CHROMATIC_SHARP[top.p])+(top.minor?'m':'');
 const conf=Math.max(35,Math.min(90,Math.round(52+(top.score-second.score)*3)));
 return {key:note,confidence:conf,reason:'Estimativa baseada na progressão de acordes'};
}
function chordCollection(sections,steps=0){
 return [...new Set((sections||[]).flatMap(s=>(s.lines||[]).flatMap(getChords)).map(c=>transposeChord(c,steps)))];
}
const SHAPES={
'C':{frets:[-1,3,2,0,1,0],fingers:[0,3,2,0,1,0]},'Cm':{frets:[-1,3,5,5,4,3],fingers:[0,1,4,3,2,1]},
'D':{frets:[-1,-1,0,2,3,2],fingers:[0,0,0,1,3,2]},'Dm':{frets:[-1,-1,0,2,3,1],fingers:[0,0,0,2,3,1]},
'E':{frets:[0,2,2,1,0,0],fingers:[0,2,3,1,0,0]},'Em':{frets:[0,2,2,0,0,0],fingers:[0,2,3,0,0,0]},
'F':{frets:[1,3,3,2,1,1],fingers:[1,3,4,2,1,1]},'Fm':{frets:[1,3,3,1,1,1],fingers:[1,3,4,1,1,1]},
'G':{frets:[3,2,0,0,0,3],fingers:[2,1,0,0,0,3]},'Gm':{frets:[3,5,5,3,3,3],fingers:[1,3,4,1,1,1]},
'A':{frets:[-1,0,2,2,2,0],fingers:[0,0,1,2,3,0]},'Am':{frets:[-1,0,2,2,1,0],fingers:[0,0,2,3,1,0]},
'B':{frets:[-1,2,4,4,4,2],fingers:[0,1,2,3,4,1]},'Bm':{frets:[-1,2,4,4,3,2],fingers:[0,1,3,4,2,1]},
'Bb':{frets:[-1,1,3,3,3,1],fingers:[0,1,2,3,4,1]},'F#':{frets:[2,4,4,3,2,2],fingers:[1,3,4,2,1,1]},
'F#m':{frets:[2,4,4,2,2,2],fingers:[1,3,4,1,1,1]},'C#':{frets:[-1,4,6,6,6,4],fingers:[0,1,2,3,4,1]},
'C#m':{frets:[-1,4,6,6,5,4],fingers:[0,1,3,4,2,1]},'G#':{frets:[4,6,6,5,4,4],fingers:[1,3,4,2,1,1]},
'G#m':{frets:[4,6,6,4,4,4],fingers:[1,3,4,1,1,1]},'Eb':{frets:[-1,-1,1,3,4,3],fingers:[0,0,1,2,4,3]},
'Ab':{frets:[4,6,6,5,4,4],fingers:[1,3,4,2,1,1]},'Db':{frets:[-1,4,6,6,6,4],fingers:[0,1,2,3,4,1]},
'B7':{frets:[-1,2,1,2,0,2],fingers:[0,2,1,3,0,4]},'D7':{frets:[-1,-1,0,2,1,2],fingers:[0,0,0,2,1,3]},
'A7':{frets:[-1,0,2,0,2,0],fingers:[0,0,2,0,3,0]},'G7':{frets:[3,2,0,0,0,1],fingers:[3,2,0,0,0,1]},
'E7':{frets:[0,2,0,1,0,0],fingers:[0,2,0,1,0,0]},'C7':{frets:[-1,3,2,3,1,0],fingers:[0,3,2,4,1,0]},
};
function chordDiagram(chord){
 let shape=SHAPES[chord];
 if(!shape){
   const simple=chord.match(/^([A-G][#b]?)(m(?!aj))?/);
   shape=simple&&SHAPES[simple[0]];
 }
 if(!shape)return '';
 const {frets}=shape;
 const active=frets.filter(x=>x>0),start=Math.max(1,Math.min(...active,1)+ (Math.min(...active)>3?Math.min(...active)-1:0));
 const minActive=active.length?Math.min(...active):1;
 const base=minActive>=4?minActive:1;
 const lines=[];
 for(let i=0;i<6;i++)lines.push(`<line x1="${22+i*18}" y1="28" x2="${22+i*18}" y2="128" stroke="#778390" stroke-width="1.3"/>`);
 for(let r=0;r<6;r++)lines.push(`<line x1="22" y1="${28+r*20}" x2="112" y2="${28+r*20}" stroke="#778390" stroke-width="${r===0&&base===1?4:1.4}"/>`);
 let dots='';
 frets.forEach((f,i)=>{
  const x=22+i*18;
  if(f===-1)dots+=`<text x="${x}" y="17" font-size="13" fill="#bd5353" text-anchor="middle">×</text>`;
  else if(f===0)dots+=`<circle cx="${x}" cy="11" r="4" fill="none" stroke="#414e62" stroke-width="1.5"/>`;
  else dots+=`<circle cx="${x}" cy="${28+((f-base)+.5)*20}" r="7.3" fill="#263955"/>`;
 });
 return `<svg class="chord-svg" viewBox="0 0 137 148" aria-label="Diagrama de ${escapeChord(chord)}" role="img">${lines.join('')}${dots}${base>1?`<text x="4" y="48" font-size="10" fill="#475569">${base}ª</text>`:''}</svg>`;
}
function escapeChord(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
window.AcordeChords={transposeChord,transposeKey,getChords,plainChordLine,lineSegments,detectKey,chordCollection,chordDiagram,SHAPES,PITCH,CHROMATIC_SHARP,CHROMATIC_FLAT};
