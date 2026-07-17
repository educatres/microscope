import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

const scene=new THREE.Scene(); scene.background=new THREE.Color(0xe8f1f1);
const sceneEl=$('#scene'),sceneSize=()=>({w:Math.max(320,sceneEl.clientWidth),h:Math.max(320,sceneEl.clientHeight)});
const initialSize=sceneSize();
const camera=new THREE.PerspectiveCamera(42,initialSize.w/initialSize.h,.1,100); camera.position.set(7,5.3,8.5);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(initialSize.w,initialSize.h); renderer.shadowMap.enabled=true; sceneEl.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(0,2.7,0); controls.enableDamping=true; controls.minDistance=5; controls.maxDistance=15;
scene.add(new THREE.HemisphereLight(0xffffff,0x70878c,2.1)); const dl=new THREE.DirectionalLight(0xffffff,2.6); dl.position.set(5,10,6); dl.castShadow=true; scene.add(dl);
const mat=(c,metal=.1,rough=.55)=>new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});
const cream=mat(0xe9e2d1,.15,.45), dark=mat(0x26363b,.5,.3), silver=mat(0xaab8bc,.8,.2), glass=new THREE.MeshPhysicalMaterial({color:0xdffaff,transparent:true,opacity:.5,roughness:.05,transmission:.6});
const root=new THREE.Group(); root.rotation.y=-.25; scene.add(root); const clickable=[];
function mesh(g,m,p,r=[0,0,0],name='',desc=''){const o=new THREE.Mesh(g,m);o.position.set(...p);o.rotation.set(...r);o.castShadow=o.receiveShadow=true;root.add(o);if(name){o.userData={name,desc};clickable.push(o)}return o}
mesh(new THREE.CylinderGeometry(2.4,2.8,.45,48),dark,[0,.22,0],undefined,'底座','支撐整台顯微鏡。');
mesh(new THREE.TorusGeometry(2.4,.38,20,64,Math.PI*1.15),cream,[.2,2.7,.2],[0,0,-.48],'鏡臂','搬運時一手握鏡臂，另一手托底座。');
mesh(new THREE.BoxGeometry(4.2,.28,3.2),dark,[0,2.45,0],undefined,'載物臺','放置並固定載玻片。');
mesh(new THREE.BoxGeometry(3.3,.06,1.15),glass,[0,2.66,0],undefined,'載玻片','標本位於載玻片中央。');
mesh(new THREE.BoxGeometry(.9,.035,.9),glass,[0,2.72,0],undefined,'蓋玻片','薄玻璃片覆蓋標本。');
mesh(new THREE.CylinderGeometry(.38,.38,4.3,32),cream,[0,4.6,0],[0,0,.15],'鏡筒','維持目鏡與物鏡的距離。');
mesh(new THREE.CylinderGeometry(.52,.42,1.0,32),dark,[-.63,6.68,0],[0,0,.15],'目鏡','由此觀看放大的虛像。');
mesh(new THREE.CylinderGeometry(.75,.75,.35,32),silver,[.02,2.03,0],undefined,'光圈','調整進光量與對比。');
const mirror=mesh(new THREE.CylinderGeometry(.72,.72,.12,40),silver,[0,1.2,.1],[Math.PI/2,0,0],'反光鏡','將光反射向載物臺。');
const nose=mesh(new THREE.CylinderGeometry(.65,.65,.34,32),dark,[.38,3.05,0],[0,0,.15],'旋轉盤','轉動以切換物鏡。');
const objectives=[];[[4,-.2],[10,.38],[40,.95]].forEach(([v,x],i)=>{const o=mesh(new THREE.CylinderGeometry(.18,.25,.85+ i*.12,24),[mat(0xc9d3d5,.8,.25),mat(0xe9d37a,.6,.25),mat(0x6da9c5,.6,.25)][i],[x,2.77,.1],[0,0,.08],`${v}× 物鏡`,`${v} 倍物鏡`);objectives.push(o)});
mesh(new THREE.CylinderGeometry(.48,.48,.28,30),dark,[2.18,3.85,.3],[Math.PI/2,0,0],'粗調節輪','低倍時快速找像。');mesh(new THREE.CylinderGeometry(.28,.28,.34,30),silver,[2.2,3.85,.3],[Math.PI/2,0,0],'細調節輪','精細調整焦距。');
mesh(new THREE.CylinderGeometry(.95,.95,.25,40),mat(0xf3f7dc),[0,.65,0],undefined,'光源區','反光鏡將光線導向標本。');
const floor=new THREE.Mesh(new THREE.CircleGeometry(7,64),new THREE.MeshStandardMaterial({color:0xd9e8e6,roughness:1})); floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);

const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();renderer.domElement.addEventListener('click',e=>{const r=renderer.domElement.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*2-1;mouse.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(clickable)[0];if(hit){$('#partLabel').innerHTML=`<strong>${hit.object.userData.name}</strong><br><small>${hit.object.userData.desc}</small>`;$('#partLabel').classList.remove('hidden');setTimeout(()=>$('#partLabel').classList.add('hidden'),3500)}});
function resizeScene(){const s=sceneSize();camera.aspect=s.w/s.h;camera.updateProjectionMatrix();renderer.setSize(s.w,s.h)}
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}animate();
addEventListener('resize',resizeScene);requestAnimationFrame(resizeScene);

function focusError(){const s=specimens[state.specimen].ideal;return Math.abs(state.coarse-s.c)*1.25+Math.abs(state.fine-s.f)*.8+(state.objective===40?Math.abs(state.coarse-s.c)*1.2:0)}
function brightness(){return Math.max(.12,Math.min(1.25,(state.aperture/70)*(1-Math.abs(state.mirror-55)/110)/(1+Math.log10(state.objective)*.18)))}
function syncControls(){const total=state.objective*state.eyepiece;$('#totalMag').textContent=total+'×';$('#viewTotalMag').textContent=total+'×';['coarse','fine','aperture','mirror'].forEach(id=>{const main=$('#'+id),view=$('#view'+id[0].toUpperCase()+id.slice(1));if(main)main.value=state[id];if(view)view.value=state[id]});$('#coarseOut').textContent=state.coarse;$('#fineOut').textContent=state.fine;$('#apertureOut').textContent=state.aperture+'%';$('#mirrorOut').textContent=state.mirror;$('#viewCoarseOut').textContent=state.coarse;$('#viewFineOut').textContent=state.fine;$('#viewApertureOut').textContent=state.aperture+'%';$('#viewMirrorOut').textContent=state.mirror;$$('.objective').forEach(b=>b.classList.toggle('active',+b.dataset.mag===state.objective));$$('.view-objective').forEach(b=>b.classList.toggle('active',+b.dataset.viewObjective===state.objective));}
function update(){syncControls();mirror.rotation.z=(state.mirror-50)*.012;objectives.forEach(o=>o.material.emissive?.setHex(Number(o.userData.name.startsWith(state.objective))?0x332500:0));if(!$('#viewerModal').classList.contains('hidden'))renderView();updateFeedback();}
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
