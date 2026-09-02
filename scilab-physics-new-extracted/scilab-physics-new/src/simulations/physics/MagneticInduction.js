import * as THREE from 'three';

export class MagneticInduction {
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'Magnetic Induction';
        this.selectable = [];
        this.running = false;
        this.paused = false;
        this.t = 0;
        this.strength = 1;
        this.speed = 2;
        this.turns = 200;
        this.resistance = 10;
        this.createScene();
        this.reset();
    }

    createScene() {
        this.magnet = new THREE.Group();
        const n = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 1.1), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: .25 }));
        const s = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 1.1), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: .25 }));
        n.position.x = -.55; s.position.x = .55;
        this.magnet.add(n, s);
        this.magnet.position.x = 4;
        this.magnet.name = 'Bar Magnet';
        this.magnet.userData = { name: 'Bar Magnet', description: 'A moving magnet changes magnetic flux through the coil.', teacher: 'Move the magnet faster to increase induced EMF.' };
        this.group.add(this.magnet); this.selectable.push(this.magnet);

        this.coil = new THREE.Group();
        for (let i = -5; i <= 5; i++) {
            const torus = new THREE.Mesh(new THREE.TorusGeometry(1.35, .045, 10, 48), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: .7, roughness: .22 }));
            torus.rotation.y = Math.PI / 2; torus.position.z = i * .18; this.coil.add(torus);
        }
        this.coil.name = 'Copper Coil';
        this.coil.userData = { name: 'Copper Coil', description: 'A conductor in which EMF is induced by changing magnetic flux.', teacher: 'More turns increase the induced voltage.' };
        this.group.add(this.coil); this.selectable.push(this.coil);

        this.field = new THREE.Group(); this.group.add(this.field);
        for (let r = 1; r < 5; r++) {
            const curve = new THREE.EllipseCurve(0, 0, 1.5 + r * .45, 1.0 + r * .3, 0, Math.PI * 2, false, 0);
            const pts = curve.getPoints(64).map(p => new THREE.Vector3(p.x, p.y, 0));
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: .4 }));
            this.field.add(line);
        }

        this.needle = new THREE.Mesh(new THREE.BoxGeometry(.06, .9, .06), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        this.needle.position.set(0, 2.3, 0);
        this.group.add(this.needle);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(.75, .75, .22, 32), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: .4 }));
        base.position.set(0, 1.75, 0); this.group.add(base);
    }

    setMagnetStrength(v) { this.strength = Math.max(0, Number(v)); }
    setSpeed(v) { this.speed = Math.max(0, Number(v)); }
    setCoilTurns(v) { this.turns = Math.max(1, Number(v)); }
    setResistance(v) { this.resistance = Math.max(.5, Number(v)); }

    getState() { return { magnetStrength: this.strength, speed: this.speed, turns: this.turns, resistance: this.resistance, emf: this.emf, current: this.current, flux: this.flux, power: this.power, direction: this.direction }; }
    start() { this.running = true; this.paused = false; }
    pause() { this.paused = !this.paused; }
    reset() { this.running = false; this.paused = false; this.t = 0; this.magnet.position.x = 4; this.emf = 0; this.current = 0; this.flux = 0; this.power = 0; this.direction = 'None'; this.needle.rotation.z = 0; }

    update(delta) {
        if (!this.running || this.paused) return;
        this.t += delta;
        this.magnet.position.x = 4 * Math.cos(this.t * this.speed * .55);
        const v = -4 * Math.sin(this.t * this.speed * .55) * this.speed * .55;
        const distance = Math.max(.8, Math.abs(this.magnet.position.x));
        this.flux = (this.strength * this.turns) / (distance * distance) * .002;
        this.emf = v * this.strength * this.turns * .003;
        this.current = this.emf / this.resistance;
        this.power = this.current * this.current * this.resistance;
        this.direction = this.emf > .01 ? 'Clockwise' : this.emf < -.01 ? 'Counter-clockwise' : 'None';
        this.needle.rotation.z = THREE.MathUtils.clamp(this.current * .25, -1.2, 1.2);
        this.field.children.forEach((line, i) => { line.material.opacity = .25 + Math.min(.5, Math.abs(this.emf) * .08) + i * .02; });
    }
    getObject() { return this.group; }
    getSelectableObjects() { return this.selectable; }
    dispose() { this.group.traverse(o => { o.geometry?.dispose(); if (o.material) Array.isArray(o.material) ? o.material.forEach(m => m.dispose()) : o.material.dispose(); }); this.selectable = []; }
}
