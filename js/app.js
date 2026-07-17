const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={specimen:'paramecium',objective:4,eyepiece:10,coarse:50,fine:50,aperture:65,mirror:50,x:0,y:0,viewed:false};
const specimens={
 paramecium:{name:'草履蟲',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Paramecium%20sp.jpg?width=1600',ideal:{c:56,f:52},desc:'纖毛蟲，體表密布纖毛。'},
 euglena:{name:'眼蟲',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Euglena-1.jpg?width=1600',ideal:{c:47,f:56},desc:'具有鞭毛與葉綠體的單細胞生物。'},
 planaria:{name:'渦蟲',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Planaria%20Flatworm%20Labeled%20Microscope.jpg?width=1600',ideal:{c:61,f:47},desc:'扁形動物，可觀察眼點與分枝消化腔。'},
 algae:{name:'藻類',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Mikrofoto.de-alge2.jpg?width=1600',ideal:{c:51,f:60},desc:'柵藻等綠藻，可觀察細胞群體排列。'}
};
const parts=[['目鏡','眼睛觀察的位置，本教材可切換 10×、15×。'],['鏡筒','保持目鏡與物鏡在正確光路上。'],['旋轉盤／物鏡','切換 4×、10×、40× 物鏡。'],['載物臺','放置載玻片，中央孔洞讓光通過。'],['載玻片','承載標本的長方形玻璃片。'],['蓋玻片','覆蓋標本，避免液滴過厚並保護物鏡。'],['光圈','控制通過標本的光量。'],['反光鏡','將外界光線反射進入鏡筒。'],['粗調節輪','快速改變鏡筒與標本距離，適合低倍找像。'],['細調節輪','小幅調焦，使影像更清晰，高倍時應使用它。']];
$('#partsList').innerHTML=parts.map(([a,b])=>`<div class="part-item"><b>${a}</b><br>${b}</div>`).join('');

function mountOnlineModel(){
 const sceneEl=$('#scene');
 const embed='https://sketchfab.com/models/8bb65a9721e748c9864f37150527a8d9/embed?autostart=1&preload=1&ui_theme=dark&ui_infos=0&ui_watermark=0';
 sceneEl.innerHTML=`<iframe title="Compound Microscope 3D model" src="${embed}" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe><a class="model-credit" href="https://sketchfab.com/3d-models/compound-microscope-8bb65a9721e748c9864f37150527a8d9" target="_blank" rel="noopener">Compound Microscope by WheelchairDrift · CC BY</a>`;
}
mountOnlineModel();

function focusError(){const s=specimens[state.specimen].ideal;return Math.abs(state.coarse-s.c)*1.25+Math.abs(state.fine-s.f)*.8+(state.objective===40?Math.abs(state.coarse-s.c)*1.2:0)}
function brightness(){return Math.max(.12,Math.min(1.25,(state.aperture/70)*(1-Math.abs(state.mirror-55)/110)/(1+Math.log10(state.objective)*.18)))}
function syncControls(){const total=state.objective*state.eyepiece;$('#totalMag').textContent=total+'×';$('#viewTotalMag').textContent=total+'×';['coarse','fine','aperture','mirror'].forEach(id=>{const main=$('#'+id),view=$('#view'+id[0].toUpperCase()+id.slice(1));if(main)main.value=state[id];if(view)view.value=state[id]});$('#coarseOut').textContent=state.coarse;$('#fineOut').textContent=state.fine;$('#apertureOut').textContent=state.aperture+'%';$('#mirrorOut').textContent=state.mirror;$('#viewCoarseOut').textContent=state.coarse;$('#viewFineOut').textContent=state.fine;$('#viewApertureOut').textContent=state.aperture+'%';$('#viewMirrorOut').textContent=state.mirror;$$('.objective').forEach(b=>b.classList.toggle('active',+b.dataset.mag===state.objective));$$('.view-objective').forEach(b=>b.classList.toggle('active',+b.dataset.viewObjective===state.objective));}
function update(){syncControls();if(!$('#viewerModal').classList.contains('hidden'))renderView();updateFeedback();}
function updateFeedback(){const err=focusError(),b=brightness();let t='';if(state.objective===40&&Math.abs(state.coarse-specimens[state.specimen].ideal.c)>5)t='高倍下不應大幅使用粗調節輪，以免物鏡碰撞玻片。';else if(b<.4)t='視野太暗：調整反光鏡或開大光圈。';else if(b>1.05)t='光線過強：縮小光圈可提高對比。';else if(err>35)t='影像非常模糊，低倍時先用粗調節輪找像。';else if(err>12)t='已看到標本，再用細調節輪讓邊緣清晰。';else if(Math.hypot(state.x,state.y)>.55)t='影像清楚，但標本未置中；移動載玻片。';else t='影像清楚且置中，可以觀察或切換更高倍率。';$('#feedback').textContent=t;}
function renderView(){const sp=specimens[state.specimen],total=state.objective*state.eyepiece,err=focusError(),b=brightness();const view=$('#microscopeView');view.style.backgroundImage=`url("${sp.url}")`;view.style.backgroundSize=`${110+state.objective*5}%`;view.style.backgroundPosition=`${50-state.x*35}% ${50+state.y*35}%`;view.style.filter=`brightness(${b}) contrast(${.75+state.aperture/160}) blur(${Math.min(14,err/6)}px) saturate(${.8+b*.35})`;$('#viewTitle').textContent=sp.name;$('#viewInfo').textContent=`${total}×｜亮度 ${b<.4?'不足':b>1.05?'過強':'適中'}｜${err<12?'清晰':err<35?'接近焦點':'模糊'}`;$('#scaleBar b').textContent=state.objective===4?'500 µm':state.objective===10?'200 µm':'50 µm';$('#scaleBar span').style.width=state.objective===4?'110px':state.objective===10?'80px':'55px';syncControls();}
function showView(){state.viewed=true;$('#viewerModal').classList.remove('hidden');renderView();}
function setObjective(v){state.objective=v;update()}
function setRange(id,value){state[id]=+value;update()}
function moveStage(d,step=.12){if(d==='up')state.y-=step;if(d==='down')state.y+=step;if(d==='left')state.x+=step;if(d==='right')state.x-=step;if(d==='center')state.x=state.y=0;state.x=Math.max(-1,Math.min(1,state.x));state.y=Math.max(-1,Math.min(1,state.y));update()}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab,.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active')});
$$('.objective').forEach(b=>b.onclick=()=>setObjective(+b.dataset.mag));
$$('.view-objective').forEach(b=>b.onclick=()=>setObjective(+b.dataset.viewObjective));
['coarse','fine','aperture','mirror'].forEach(id=>{$('#'+id).oninput=e=>setRange(id,e.target.value);$('#view'+id[0].toUpperCase()+id.slice(1)).oninput=e=>setRange(id,e.target.value)});
$('#specimen').onchange=e=>{state.specimen=e.target.value;state.x=state.y=0;update()};$('#eyepiece').onchange=e=>{state.eyepiece=+e.target.value;update()};
$$('[data-move]').forEach(b=>b.onclick=()=>moveStage(b.dataset.move));
$$('[data-view-move]').forEach(b=>b.onclick=()=>moveStage(b.dataset.viewMove));
$('#lookBtn').onclick=showView;$('#closeViewer').onclick=()=>$('#viewerModal').classList.add('hidden');$('#tutorialBtn').onclick=()=>$('#tutorial').classList.remove('hidden');$('#closeTutorial').onclick=$('#startTutorial').onclick=()=>$('#tutorial').classList.add('hidden');
let dragStart=null;$('#microscopeView').addEventListener('pointerdown',e=>{dragStart={x:e.clientX,y:e.clientY,sx:state.x,sy:state.y};$('#microscopeView').setPointerCapture(e.pointerId);$('#microscopeView').classList.add('dragging')});$('#microscopeView').addEventListener('pointermove',e=>{if(!dragStart)return;const scale=state.objective===40?0.0018:state.objective===10?0.0028:0.0045;state.x=Math.max(-1,Math.min(1,dragStart.sx+(e.clientX-dragStart.x)*scale));state.y=Math.max(-1,Math.min(1,dragStart.sy-(e.clientY-dragStart.y)*scale));renderView();updateFeedback()});['pointerup','pointercancel','pointerleave'].forEach(type=>$('#microscopeView').addEventListener(type,()=>{dragStart=null;$('#microscopeView').classList.remove('dragging')}));
$('#resetBtn').onclick=()=>location.reload();
const missions=[['選擇任一玻片',()=>!!state.specimen],['使用 4× 低倍物鏡',()=>state.objective===4],['將亮度調到適中',()=>{const b=brightness();return b>=.4&&b<=1.05}],['找到接近焦點的影像',()=>focusError()<35],['使影像清晰',()=>focusError()<12],['將標本移到視野中央',()=>focusError()<12&&Math.hypot(state.x,state.y)<.25]];
$('#missionList').innerHTML=missions.map(m=>`<li>${m[0]}</li>`).join('');$('#checkMission').onclick=()=>{let n=0;[...$('#missionList').children].forEach((li,i)=>{const ok=missions[i][1]();li.classList.toggle('done',ok);if(ok)n++});$('#score').textContent=n;if(n===6)$('#feedback').textContent='挑戰完成！你已掌握低倍找像、調光、對焦與置中的基本流程。'};
update();
