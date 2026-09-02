import * as THREE from 'three';

export class VirtualPhysicsLab {
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'Virtual Physics Lab';
        this.selectable = [];
        this.running = false;
        this.experiment = 'Pendulum';
        this.length = 1.2;
        this.angle = 15;
        this.time = 0;
        this.createScene();
        this.rebuild();
    }

    createScene() {
        const floor = new THREE.GridHelper(12, 12, 0x334155, 0x1e293b); floor.position.y = -2; this.group.add(floor);
        this.rig = new THREE.Group(); this.group.add(this.rig);
    }

    rebuild() {
        while (this.rig.children.length) {
            const o = this.rig.children.pop(); o.geometry?.dispose(); if (o.material) o.material.dispose();
        }
        const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, .12, .12), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
        top.position.y = 1.8; this.rig.add(top);
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, this.length * 2.1, 12), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
        rod.position.y = 1.8 - this.length; this.rig.add(rod);
        const bob = new THREE.Mesh(new THREE.SphereGeometry(.18, 24, 16), new THREE.MeshStandardMaterial({ color: 0xa78bfa }));
        bob.position.y = 1.8 - this.length * 2.05; this.rig.add(bob);
        this.bob = bob; this.rod = rod;
        this.selectable = [bob];
        bob.userData = { name: 'Pendulum Bob', type: 'experiment', description: 'A pendulum oscillates under gravity.', teacher: 'The period depends strongly on pendulum length.' };
    }
    setLength(v) { this.length = Math.max(.4, Number(v)); this.rebuild(); }
    setAngle(v) { this.angle = Number(v); }
    setExperiment(v) { this.experiment = v || 'Pendulum'; this.rebuild(); }
    getState() { const period = 2 * Math.PI * Math.sqrt(this.length / 9.81); return { experiment: this.experiment, length: this.length, angle: this.angle, period, frequency: 1 / period, time: this.time }; }
    start() { this.running = true; }
    pause() { this.running = !this.running; }
    reset() { this.running = false; this.time = 0; this.rebuild(); }
    update(delta) { if (!this.running) return; this.time += delta; if (this.bob) { const a = THREE.MathUtils.degToRad(this.angle) * Math.sin(this.time * 5); this.bob.position.x = Math.sin(a) * this.length; this.bob.position.y = 1.8 - Math.cos(a) * this.length; this.rod.position.x = this.bob.position.x / 2; this.rod.position.y = (1.8 + this.bob.position.y) / 2; this.rod.scale.y = this.length; this.rod.rotation.z = -a; } }
    getObject() { return this.group; }
    getSelectableObjects() { return this.selectable; }
    dispose() { this.group.traverse(o => { o.geometry?.dispose(); if (o.material) Array.isArray(o.material) ? o.material.forEach(m => m.dispose()) : o.material.dispose(); }); this.selectable = []; }
}
