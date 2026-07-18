const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={specimen:'paramecium',objective:4,eyepiece:10,coarse:50,fine:50,aperture:65,mirror:50,x:0,y:0,viewed:false};
const specimens={
 paramecium:{name:'草履蟲',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Paramecium%20sp.jpg?width=1600',ideal:{c:56,f:52},desc:'纖毛蟲，體表密布纖毛。'},
 euglena:{name:'眼蟲',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Euglena-1.jpg?width=1600',ideal:{c:47,f:56},desc:'具有鞭毛與葉綠體的單細胞生物。'},
 planaria:{name:'渦蟲',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Planaria%20Flatworm%20Labeled%20Microscope.jpg?width=1600',ideal:{c:61,f:47},desc:'扁形動物，可觀察眼點與分枝消化腔。'},
 algae:{name:'藻類',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Mikrofoto.de-alge2.jpg?width=1600',ideal:{c:51,f:60},desc:'柵藻等綠藻，可觀察細胞群體排列。'},
 leaf:{name:'樹葉／氣孔',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Stomata%20observed%20on%20the%20rear%20side%20of%20a%20leaf.jpg?width=1600',ideal:{c:53,f:55},desc:'葉片背面的氣孔，可觀察保衛細胞與孔隙。'},
 animalCell:{name:'動物細胞',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Cheekcells%20stained.jpg?width=1600',ideal:{c:57,f:54},desc:'染色人類口腔上皮細胞，可辨認細胞核與細胞質。'},
 plantCell:{name:'植物細胞',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Elodea%20cells%20under%20microscope.jpg?width=1600',ideal:{c:52,f:58},desc:'黑藻葉細胞，可觀察規則細胞壁與葉綠體。'},
 cork:{name:'軟木塞',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Cork%20Micrographia%20Hooke.png?width=1600',ideal:{c:50,f:50},desc:'Hooke 在 Micrographia 中描繪的軟木結構，是「cell」一詞的重要來源。'},
 videoA:{name:'影片玻片 A',type:'video',youtube:'io731XY8fH8',start:38,desc:'YouTube 顯微觀察影片，從 0:38 開始播放，倍率依影片內容為主。'},
 videoB:{name:'影片玻片 B',type:'video',youtube:'qaElp0M3NZw',start:25,desc:'YouTube 顯微觀察影片，從 0:25 開始播放，倍率依影片內容為主。'}
};
const models={
 modern:{
  name:'現代複式顯微鏡',
  id:'c85ebf4d10844726bafc8d9f4364d211',
  href:'https://sketchfab.com/3d-models/microscope-c85ebf4d10844726bafc8d9f4364d211',
  credit:'Microscope · Sketchfab',
  title:'現代複式顯微鏡',
  story:'現代複式顯微鏡使用目鏡與多個物鏡組合放大，載物臺、調焦輪、聚光器與內建光源讓觀察更穩定、可重複，也更適合課堂實驗。',
  compare:'和 Hooke 的顯微鏡相比，現代顯微鏡通常有可切換倍率的物鏡、較穩定的照明與精細調焦機構，能更容易得到明亮且清晰的影像。',
  videos:[
   {id:'29guENxstn4',title:'國中生物｜認識顯微鏡',source:'YouTube：台菜一姐'},
   {id:'7reBPZIShS4',title:'複式顯微鏡操作流程教學',source:'YouTube：Chihhsiang Chien'},
   {id:'7nvCrQZWDkw',title:'光學儀器－複式顯微鏡',source:'YouTube：廖家立'}
  ]
 },
 hooke:{
  name:"Hooke 1665",
  id:'be66b248b75c477faefd7e83b200a5e8',
  href:'https://sketchfab.com/3d-models/robert-hookes-microscope-1665-be66b248b75c477faefd7e83b200a5e8',
  credit:"Robert Hooke's Microscope (1665) by olemolvig · CC BY",
  title:"Robert Hooke's Microscope (1665)",
  story:'Robert Hooke 在 1665 年出版《Micrographia》，用顯微鏡描繪跳蚤、軟木等微小世界，讓許多人第一次看見肉眼之外的結構。他觀察軟木時使用了「cell」這個詞，後來成為生物學中「細胞」概念的重要起點。',
  compare:'Hooke 的顯微鏡是早期複式顯微鏡，照明、鏡片品質、穩定度與倍率切換都不如現代儀器；它更像一台精巧的探索工具，而現代顯微鏡則是可標準化操作、可精準調焦與控制光線的實驗設備。',
  portrait:{
   src:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/13_Portrait_of_Robert_Hooke.JPG/960px-13_Portrait_of_Robert_Hooke.JPG',
   alt:'Robert Hooke memorial portrait',
   credit:'Robert Hooke reconstructed memorial portrait · Wikimedia Commons'
  },
  videos:[
   {id:'0d-bZrK1sS8',title:'複式顯微鏡為什麼上下左右顛倒？',source:'YouTube：nemo的生物教室'}
  ]
 }
};
const parts=[
 {no:1,name:'目鏡',desc:'眼睛觀察的位置，本教材可切換 10×、15×。'},
 {no:2,name:'旋轉盤／物鏡轉換器',desc:'轉動後可切換不同倍率的物鏡。'},
 {no:3,name:'物鏡',desc:'接近標本的鏡頭，負責形成主要放大影像。'},
 {no:4,name:'粗調節輪',desc:'快速改變鏡筒與標本距離，適合低倍找像。'},
 {no:5,name:'細調節輪',desc:'小幅調焦，使影像更清晰，高倍時應使用它。'},
 {no:6,name:'載物臺',desc:'放置玻片標本的平台，中央孔洞讓光線通過。'},
 {no:7,name:'光源',desc:'提供向上穿過標本的照明。'},
 {no:8,name:'聚光器／光圈',desc:'集中並調節進入標本的光量。'},
 {no:9,name:'玻片夾／移動尺',desc:'固定玻片並協助左右、前後移動標本。'}
];
const specimenOptions=Object.entries(specimens).map(([key,sp])=>`<option value="${key}">${sp.name}</option>`).join('');
$('#viewSpecimen').innerHTML=specimenOptions;
$('#partsList').innerHTML=parts.map((p,i)=>`<div class="part-item" data-part-index="${i}" tabindex="0"><span class="part-number">${p.no}</span><div><b>${p.name}</b><br>${p.desc}</div></div>`).join('');

function mountOnlineModel(){
 const sceneEl=$('#scene');
 const diagram='https://commons.wikimedia.org/wiki/Special:FilePath/Optical%20microscope%20nikon%20alphaphot.jpg?width=1200';
 sceneEl.innerHTML=`<iframe id="modelFrame" title="3D microscope model" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe><div class="model-switch" aria-label="切換 3D 顯微鏡模型"><button class="model-option active" data-model="modern">現代</button><button class="model-option" data-model="hooke">Hooke 1665</button></div><figure id="partsDiagram" class="parts-diagram"><img src="${diagram}" alt="有 1 到 9 數字編號的 Nikon Alphaphot 光學顯微鏡照片"><figcaption>Optical microscope nikon alphaphot · GcG(jawp) · Public domain</figcaption></figure><div id="inlineViewerHost" class="inline-viewer-host hidden"></div><a class="model-credit" target="_blank" rel="noopener"></a>`;
}
mountOnlineModel();

function setModel(key){
 const model=models[key];
 const src=`https://sketchfab.com/models/${model.id}/embed?autostart=1&preload=1&ui_theme=dark&ui_infos=0&ui_watermark=0`;
 $('#modelFrame').src=src;
 $('#modelFrame').title=model.title;
 $('.model-credit').href=model.href;
 $('.model-credit').textContent=model.credit;
 const portrait=model.portrait?`<figure class="hooke-portrait"><img src="${model.portrait.src}" alt="${model.portrait.alt}"><figcaption>${model.portrait.credit}</figcaption></figure>`:'';
 const videos=model.videos?.length?`<div class="model-video-grid">${model.videos.map(video=>`<a class="model-video-card" href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="${video.title} 縮圖"><span><b>${video.title}</b><small>${video.source}</small></span></a>`).join('')}</div>`:'';
 $('#modelStory').innerHTML=`<h2>${model.title}</h2>${portrait}<p>${model.story}</p><p>${model.compare}</p>${videos}`;
 $$('.model-option').forEach(btn=>btn.classList.toggle('active',btn.dataset.model===key));
}
setModel('modern');
$$('.model-option').forEach(btn=>btn.onclick=()=>setModel(btn.dataset.model));

function setPartHighlight(index){
 $$('.part-item').forEach((el,i)=>el.classList.toggle('active',i===index));
 if(index>=0){
  const p=parts[index];
  $('#partLabel').innerHTML=`<strong>${p.name}</strong><br><small>${p.desc}</small>`;
  $('#partLabel').classList.remove('hidden');
 }
}
function clearPartHighlight(){
 $$('.part-item').forEach(el=>el.classList.remove('active'));
 $('#partLabel').classList.add('hidden');
}
function setPartsMode(enabled){
 $('#scene').classList.toggle('parts-mode',enabled);
 if(!enabled)clearPartHighlight();
}
$$('.part-item').forEach(el=>{const i=+el.dataset.partIndex;el.onmouseenter=()=>setPartHighlight(i);el.onfocus=()=>setPartHighlight(i);el.onclick=()=>setPartHighlight(i);el.onmouseleave=()=>{if(!el.matches(':focus'))clearPartHighlight()}});

function isVideoSpecimen(){return specimens[state.specimen].type==='video'}
function focusError(){if(isVideoSpecimen())return 0;const s=specimens[state.specimen].ideal;return Math.abs(state.coarse-s.c)*1.25+Math.abs(state.fine-s.f)*.8+(state.objective===40?Math.abs(state.coarse-s.c)*1.2:0)}
function brightness(){return Math.max(.12,Math.min(1.25,(state.aperture/70)*(1-Math.abs(state.mirror-55)/110)/(1+Math.log10(state.objective)*.18)))}
function syncControls(){const video=isVideoSpecimen(),total=video?'依影片':state.objective*state.eyepiece+'×';$('#viewTotalMag').textContent=video?'影片倍率':total;$('#viewSpecimen').value=state.specimen;$('#eyepiece').value=state.eyepiece;$('#eyepiece').disabled=video;['coarse','fine','aperture','mirror'].forEach(id=>{const view=$('#view'+id[0].toUpperCase()+id.slice(1));view.value=state[id];view.disabled=video});$('#viewCoarseOut').textContent=video?'影片':state.coarse;$('#viewFineOut').textContent=video?'影片':state.fine;$('#viewApertureOut').textContent=video?'影片':state.aperture+'%';$('#viewMirrorOut').textContent=video?'影片':state.mirror;$$('.view-objective').forEach(b=>{b.classList.toggle('active',+b.dataset.viewObjective===state.objective);b.disabled=video});}
function isViewerVisible(){return !$('#viewerModal').classList.contains('hidden')||$('#scene').classList.contains('missions-mode')}
function update(){syncControls();if(isViewerVisible())renderView();updateFeedback();}
function updateFeedback(){if(isVideoSpecimen()){const centered=Math.hypot(state.x,state.y)<.25;$('#feedback').textContent=centered?'影片模式：倍率依影片為主，粗調、細調、光圈與反光鏡已鎖定，可移動載玻片觀察不同位置。':'影片模式：倍率依影片為主，可用載玻片方向鍵移動視野。';return}const err=focusError(),b=brightness();let t='';if(state.objective===40&&Math.abs(state.coarse-specimens[state.specimen].ideal.c)>5)t='高倍下不應大幅使用粗調節輪，以免物鏡碰撞玻片。';else if(b<.4)t='視野太暗：調整反光鏡或開大光圈。';else if(b>1.05)t='光線過強：縮小光圈可提高對比。';else if(err>35)t='影像非常模糊，低倍時先用粗調節輪找像。';else if(err>12)t='已看到標本，再用細調節輪讓邊緣清晰。';else if(Math.hypot(state.x,state.y)>.55)t='影像清楚，但標本未置中；移動載玻片。';else t='影像清楚且置中，可以觀察或切換更高倍率。';$('#feedback').textContent=t;}
function renderView(){const sp=specimens[state.specimen],video=isVideoSpecimen(),total=state.objective*state.eyepiece,err=focusError(),b=brightness(),view=$('#microscopeView');let frame=$('#videoView');if(video){view.style.backgroundImage='none';view.style.filter='none';view.style.backgroundPosition='center';view.style.backgroundSize='cover';if(!frame){frame=document.createElement('iframe');frame.id='videoView';frame.className='video-view';frame.allow='autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;view.prepend(frame)}const src=`https://www.youtube.com/embed/${sp.youtube}?start=${sp.start}&autoplay=1&rel=0&playsinline=1`;if(frame.dataset.src!==src){frame.src=src;frame.dataset.src=src}frame.style.transform=`translate(${-state.x*16}%,${-state.y*16}%) scale(1.18)`;$('#viewTitle').textContent=sp.name;$('#viewInfo').textContent=`倍率依影片為主｜從 ${sp.start} 秒開始播放｜調焦與調光鎖定`;$('#scaleBar b').textContent='影片倍率';$('#scaleBar span').style.width='72px';syncControls();return}if(frame){frame.remove()}view.style.backgroundImage=`url("${sp.url}")`;view.style.backgroundSize=`${110+state.objective*5}%`;view.style.backgroundPosition=`${50-state.x*35}% ${50+state.y*35}%`;view.style.filter=`brightness(${b}) contrast(${.75+state.aperture/160}) blur(${Math.min(14,err/6)}px) saturate(${.8+b*.35})`;$('#viewTitle').textContent=sp.name;$('#viewInfo').textContent=`${total}×｜亮度 ${b<.4?'不足':b>1.05?'過強':'適中'}｜${err<12?'清晰':err<35?'接近焦點':'模糊'}`;$('#scaleBar b').textContent=state.objective===4?'500 µm':state.objective===10?'200 µm':'50 µm';$('#scaleBar span').style.width=state.objective===4?'110px':state.objective===10?'80px':'55px';syncControls();}
function dockViewer(mode){const shell=$('.viewer-shell');const inline=mode==='inline';if(inline){$('#inlineViewerHost').append(shell);$('#inlineViewerHost').classList.remove('hidden');$('#viewerModal').classList.add('hidden')}else{$('#viewerModal').append(shell);$('#inlineViewerHost').classList.add('hidden');}shell.classList.toggle('inline-viewer-shell',inline);$('#closeViewer').classList.toggle('hidden',inline);}
function showView(){state.viewed=true;dockViewer('modal');$('#viewerModal').classList.remove('hidden');renderView();}
function setObjective(v){state.objective=v;update()}
function setRange(id,value){state[id]=+value;update()}
function moveStage(d,step=.12){if(d==='up')state.y+=step;if(d==='down')state.y-=step;if(d==='left')state.x-=step;if(d==='right')state.x+=step;if(d==='center')state.x=state.y=0;state.x=Math.max(-1,Math.min(1,state.x));state.y=Math.max(-1,Math.min(1,state.y));update()}
function setStageMode(tab){const missions=tab==='missions';$('#scene').classList.toggle('missions-mode',missions);$('#scene').parentElement.classList.toggle('mission-stage-card',missions);setPartsMode(tab==='parts');if(missions){state.viewed=true;dockViewer('inline');renderView()}else{if(!$('#viewerModal').contains($('.viewer-shell')))dockViewer('modal');const frame=$('#videoView');if(frame)frame.remove();}}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab,.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active');setStageMode(b.dataset.tab)});
$$('.view-objective').forEach(b=>b.onclick=()=>setObjective(+b.dataset.viewObjective));
['coarse','fine','aperture','mirror'].forEach(id=>{$('#view'+id[0].toUpperCase()+id.slice(1)).oninput=e=>setRange(id,e.target.value)});
function setSpecimen(value){state.specimen=value;state.x=state.y=0;update()}
$('#viewSpecimen').onchange=e=>setSpecimen(e.target.value);$('#eyepiece').onchange=e=>{state.eyepiece=+e.target.value;update()};
$$('[data-view-move]').forEach(b=>b.onclick=()=>moveStage(b.dataset.viewMove));
function closeView(){const frame=$('#videoView');if(frame)frame.remove();$('#viewerModal').classList.add('hidden')}
$('#lookBtn').onclick=showView;$('#closeViewer').onclick=closeView;$('#tutorialBtn').onclick=()=>$('#tutorial').classList.remove('hidden');$('#closeTutorial').onclick=$('#startTutorial').onclick=()=>$('#tutorial').classList.add('hidden');
let dragStart=null;$('#microscopeView').addEventListener('pointerdown',e=>{dragStart={x:e.clientX,y:e.clientY,sx:state.x,sy:state.y};$('#microscopeView').setPointerCapture(e.pointerId);$('#microscopeView').classList.add('dragging')});$('#microscopeView').addEventListener('pointermove',e=>{if(!dragStart)return;const scale=state.objective===40?0.0018:state.objective===10?0.0028:0.0045;state.x=Math.max(-1,Math.min(1,dragStart.sx+(e.clientX-dragStart.x)*scale));state.y=Math.max(-1,Math.min(1,dragStart.sy-(e.clientY-dragStart.y)*scale));renderView();updateFeedback()});['pointerup','pointercancel','pointerleave'].forEach(type=>$('#microscopeView').addEventListener(type,()=>{dragStart=null;$('#microscopeView').classList.remove('dragging')}));
let lastTouchEnd=0;document.addEventListener('touchend',e=>{const now=Date.now(),btn=e.target.closest('[data-view-move]');if(now-lastTouchEnd<330&&e.target.closest('button,.dpad,.viewer-controls,#microscopeView')){e.preventDefault();if(btn)moveStage(btn.dataset.viewMove)}lastTouchEnd=now},{passive:false});
$('#resetBtn').onclick=()=>location.reload();
const missions=[['選擇任一玻片',()=>!!state.specimen],['使用 4× 低倍物鏡',()=>state.objective===4],['將亮度調到適中',()=>{const b=brightness();return b>=.4&&b<=1.05}],['找到接近焦點的影像',()=>focusError()<35],['使影像清晰',()=>focusError()<12],['將標本移到視野中央',()=>focusError()<12&&Math.hypot(state.x,state.y)<.25]];
$('#missionList').innerHTML=missions.map(m=>`<li>${m[0]}</li>`).join('');$('#checkMission').onclick=()=>{let n=0;[...$('#missionList').children].forEach((li,i)=>{const ok=missions[i][1]();li.classList.toggle('done',ok);if(ok)n++});$('#score').textContent=n;if(n===6)$('#feedback').textContent='挑戰完成！你已掌握低倍找像、調光、對焦與置中的基本流程。'};
update();
