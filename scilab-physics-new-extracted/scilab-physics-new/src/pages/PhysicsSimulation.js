import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LensOptics } from '../simulations/physics/LensOptics.js';
import { MagneticInduction } from '../simulations/physics/MagneticInduction.js';
import { ElectricMotor } from '../simulations/physics/ElectricMotor.js';
import { SolarSystem } from '../simulations/physics/SolarSystem.js';
import { VirtualPhysicsLab } from '../simulations/physics/VirtualPhysicsLab.js';

const MAP = {
    lens: { title: 'Lens & Ray Optics Lab', Sim: LensOptics },
    magnetic: { title: 'Magnetic Induction Simulator', Sim: MagneticInduction },
    motor: { title: 'Electric Motor Simulator', Sim: ElectricMotor },
    solar: { title: '3D Solar System Simulator', Sim: SolarSystem },
    virtual: { title: 'Virtual Physics Lab', Sim: VirtualPhysicsLab },
};

let active = null;
let cleanup = null;

function buildUI(mode) {
    const data = MAP[mode] || MAP.lens;
    const controls = mode === 'lens' ? `
        <label>Lens Type<select id="p-lens-type"><option value="convex">Convex Lens</option><option value="concave">Concave Lens</option></select></label>
        <label>Focal Length <output id="p-f">4</output><input id="p-focal" type="range" min="1" max="8" step="0.5" value="4"></label>
        <label>Object Distance <output id="p-d">8</output><input id="p-distance" type="range" min="2" max="14" step="0.5" value="8"></label>
        <label>Object Height <output id="p-h">2.5</output><input id="p-height" type="range" min="0.5" max="5" step="0.25" value="2.5"></label>
    ` : mode === 'magnetic' ? `
        <label>Magnet Strength <output id="p-bs">1.0</output><input id="p-strength" type="range" min="0" max="2" step="0.1" value="1"></label>
        <label>Movement Speed <output id="p-sp">2.0</output><input id="p-speed" type="range" min="0" max="4" step="0.1" value="2"></label>
        <label>Coil Turns <output id="p-tr">200</output><input id="p-turns" type="range" min="20" max="500" step="10" value="200"></label>
        <label>Resistance <output id="p-r">10</output><input id="p-resistance" type="range" min="1" max="50" step="1" value="10"></label>
    ` : mode === 'motor' ? `
        <label>Voltage <output id="p-v">12</output><input id="p-voltage" type="range" min="0" max="24" step="1" value="12"></label>
        <label>Current <output id="p-i">2</output><input id="p-current" type="range" min="0" max="8" step="0.1" value="2"></label>
        <label>Magnetic Field <output id="p-b">0.8</output><input id="p-field" type="range" min="0" max="2" step="0.1" value="0.8"></label>
        <label>Coil Turns <output id="p-ct">150</output><input id="p-coil-turns" type="range" min="20" max="300" step="10" value="150"></label>
    ` : mode === 'solar' ? `
        <label>Simulation Speed <output id="p-ss">1.0x</output><input id="p-solar-speed" type="range" min="0.1" max="4" step="0.1" value="1"></label>
        <label>Planet Focus<select id="p-focus"><option>Earth</option><option>Mercury</option><option>Venus</option><option>Mars</option><option>Jupiter</option><option>Saturn</option><option>Uranus</option><option>Neptune</option></select></label>
    ` : `
        <label>Experiment<select id="p-exp"><option>Pendulum</option></select></label>
        <label>Length <output id="p-l">1.2</output><input id="p-length" type="range" min="0.4" max="3" step="0.1" value="1.2"></label>
        <label>Angle <output id="p-a">15</output><input id="p-angle" type="range" min="2" max="35" step="1" value="15"></label>
    `;

    return `
      <section class="physics-sim-page">
        <header class="physics-sim-header"><div><span>SCILAB • PHYSICS • VIRTUAL LAB</span><h1>${data.title}</h1><p>Interactive 3D experiment with live parameters, measurements and teacher-ready explanations.</p></div><button id="p-back">← Physics</button></header>
        <div class="physics-sim-toolbar"><button id="p-start">▶ Start</button><button id="p-pause">⏸ Pause</button><button id="p-reset">↺ Reset</button><span id="p-status">READY</span></div>
        <main class="physics-sim-grid">
          <aside class="physics-panel physics-controls"><div class="physics-panel-head"><span>CONTROLS</span><small>Experiment parameters</small></div>${controls}</aside>
          <section class="physics-panel physics-view"><div class="physics-panel-head"><span>LIVE 3D SIMULATION</span><small id="p-phase">Ready</small></div><div id="physics-canvas"></div></section>
          <aside class="physics-panel physics-results"><div class="physics-panel-head"><span>LIVE RESULTS</span><small>Calculated values</small></div><div id="p-results"></div></aside>
        </main>
        <section class="physics-panel physics-bottom"><div><span>TEACHER EXPLANATION</span><p id="p-explanation">Adjust the experiment controls and observe the 3D model.</p></div><div class="physics-graph-wrap"><span>LIVE GRAPH</span><canvas id="p-graph" width="900" height="220"></canvas></div></section>
      </section>`;
}

function resultHTML(state, mode) {
    const rows = mode === 'lens' ? [['Image Distance', `${state.imageDistance === 9999 ? '∞' : state.imageDistance.toFixed(2)} units`], ['Magnification', `${state.magnification === 9999 ? '∞' : state.magnification.toFixed(2)}`], ['Image Height', `${state.imageHeight === 9999 ? '∞' : state.imageHeight.toFixed(2)}`], ['Image Type', state.imageType]]
      : mode === 'magnetic' ? [['Induced EMF', `${state.emf.toFixed(3)} V`], ['Current', `${state.current.toFixed(3)} A`], ['Magnetic Flux', `${state.flux.toFixed(4)} Wb`], ['Power', `${state.power.toFixed(3)} W`], ['Direction', state.direction]]
      : mode === 'motor' ? [['Torque', `${state.torque.toFixed(3)} N·m`], ['Angular Speed', `${state.rpm.toFixed(0)} RPM`], ['Current', `${state.current.toFixed(2)} A`], ['Power', `${state.power.toFixed(1)} W`], ['Efficiency', `${state.efficiency.toFixed(0)} %`]]
      : mode === 'solar' ? [['Planet', state.selected], ['Distance', `${state.distanceAU.toFixed(2)} AU`], ['Orbital Period', `${state.periodDays} days`], ['Speed', `${state.speed.toFixed(1)}x`]]
      : [['Length', `${state.length.toFixed(2)} m`], ['Angle', `${state.angle.toFixed(1)}°`], ['Period', `${state.period.toFixed(2)} s`], ['Frequency', `${state.frequency.toFixed(2)} Hz`], ['Time', `${state.time.toFixed(1)} s`]];
    return rows.map(([k, v]) => `<div class="physics-result-card"><span>${k}</span><strong>${v}</strong></div>`).join('');
}

function drawGraph(canvas, history, label='Value') {
    const ctx = canvas?.getContext('2d'); if (!ctx) return;
    const w = canvas.width, h = canvas.height; ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(148,163,184,.15)';
    for(let y=30;y<h-25;y+=40){ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(w-20,y);ctx.stroke();}
    ctx.strokeStyle='#60a5fa'; ctx.lineWidth=2.5; ctx.beginPath();
    const max = Math.max(1, ...history.map(v=>Math.abs(v))); const min=-max;
    history.forEach((v,i)=>{ const x=45+(i/Math.max(1,history.length-1))*(w-65); const y=25+(1-(v-min)/(max-min))*(h-50); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke();
    ctx.fillStyle='#94a3b8'; ctx.font='12px Arial'; ctx.fillText(label,10,18);
}

export function createPhysicsSimulationPage(mode) {
    setTimeout(() => init(mode), 0); return buildUI(mode);
}

function init(mode) {
    cleanup?.();
    const container = document.getElementById('physics-canvas'); if (!container) return;
    const Sim = MAP[mode]?.Sim || LensOptics; active = new Sim();
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x020814);
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 2000); camera.position.set(8,5,10);
    const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.setSize(container.clientWidth||800, container.clientHeight||520, false); renderer.shadowMap.enabled = true; container.innerHTML=''; container.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff,1.3)); const key=new THREE.DirectionalLight(0xffffff,2.1); key.position.set(8,12,8); scene.add(key);
    const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.target.set(0,0,0);
    scene.add(active.getObject());
    const fit=()=>{ const box=new THREE.Box3().setFromObject(active.getObject()); const c=box.getCenter(new THREE.Vector3()); const s=box.getSize(new THREE.Vector3()); const d=Math.max(s.length()*1.1,8); camera.position.set(c.x+d*.8,c.y+d*.45,c.z+d*.8); controls.target.copy(c); controls.update(); renderer.setSize(container.clientWidth||800, container.clientHeight||520,false); camera.aspect=(container.clientWidth||800)/(container.clientHeight||520); camera.updateProjectionMatrix(); };
    fit();
    const history=[]; const status=document.getElementById('p-status'); const phase=document.getElementById('p-phase'); const results=document.getElementById('p-results'); const graph=document.getElementById('p-graph'); const explanation=document.getElementById('p-explanation');
    const refresh=()=>{const state=active.getState(); results.innerHTML=resultHTML(state,mode); if(mode==='lens') explanation.textContent='Use the focal length and object distance to investigate when images become real, virtual, inverted, enlarged or diminished.'; else if(mode==='magnetic') explanation.textContent='A changing magnetic flux through the coil induces an EMF. Faster motion and more turns strengthen the effect.'; else if(mode==='motor') explanation.textContent='A current-carrying coil in a magnetic field experiences torque and rotates, converting electrical energy into mechanical motion.'; else if(mode==='solar') explanation.textContent='Planets orbit the Sun under gravity. Different orbital radii produce different orbital periods and speeds.'; else explanation.textContent='Use the virtual pendulum to investigate how length changes the period of oscillation.';};
    const bind=(id,fn,out)=>{const el=document.getElementById(id); if(!el) return; el.addEventListener('input',()=>{fn(el.value); if(out) document.getElementById(out).textContent=el.value; refresh();});};
    if(mode==='lens'){bind('p-lens-type',v=>active.setLensType(v));bind('p-focal',v=>active.setFocalLength(v),'p-f');bind('p-distance',v=>active.setObjectDistance(v),'p-d');bind('p-height',v=>active.setObjectHeight(v),'p-h');}
    if(mode==='magnetic'){bind('p-strength',v=>active.setMagnetStrength(v),'p-bs');bind('p-speed',v=>active.setSpeed(v),'p-sp');bind('p-turns',v=>active.setCoilTurns(v),'p-tr');bind('p-resistance',v=>active.setResistance(v),'p-r');}
    if(mode==='motor'){bind('p-voltage',v=>active.setVoltage(v),'p-v');bind('p-current',v=>active.setCurrent(v),'p-i');bind('p-field',v=>active.setField(v),'p-b');bind('p-coil-turns',v=>active.setTurns(v),'p-ct');}
    if(mode==='solar'){bind('p-solar-speed',v=>active.setSpeed(v),'p-ss'); document.getElementById('p-focus')?.addEventListener('change',e=>{active.setFocus(e.target.value);refresh();});}
    if(mode==='virtual'){bind('p-length',v=>active.setLength(v),'p-l');bind('p-angle',v=>active.setAngle(v),'p-a');}
    document.getElementById('p-start')?.addEventListener('click',()=>{active.start(); status.textContent='RUNNING';});
    document.getElementById('p-pause')?.addEventListener('click',()=>{active.pause(); status.textContent='PAUSED';});
    document.getElementById('p-reset')?.addEventListener('click',()=>{active.reset(); history.length=0; status.textContent='READY'; refresh();});
    document.getElementById('p-back')?.addEventListener('click',()=>{window.location.hash='physics';});
    const onResize=()=>fit(); window.addEventListener('resize',onResize);
    let last=performance.now(); const loop=(now)=>{ if(!active) return; const dt=Math.min(.05,(now-last)/1000); last=now; active.update(dt); controls.update(); renderer.render(scene,camera); const st=active.getState(); const value=mode==='magnetic'?st.emf:mode==='motor'?st.rpm:mode==='solar'?st.speed:mode==='virtual'?st.angle:st.imageDistance; history.push(Number.isFinite(value)?value:0); if(history.length>100)history.shift(); drawGraph(graph,history, mode==='magnetic'?'EMF':mode==='motor'?'RPM':mode==='solar'?'Orbit Speed':mode==='virtual'?'Angle':'Image Distance'); if(phase) phase.textContent=st.imageType||st.direction||st.selected||st.experiment||'LIVE'; refresh(); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
    cleanup=()=>{window.removeEventListener('resize',onResize); active?.dispose?.(); controls.dispose(); renderer.dispose(); active=null;};
}

export function cleanupPhysicsSimulation(){ cleanup?.(); cleanup=null; }
