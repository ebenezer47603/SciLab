import * as THREE from 'three';

const DATA = [
    ['Mercury', 0.34, 2.7, 0.45, 88, 0x9ca3af],
    ['Venus', 0.48, 3.8, 0.34, 225, 0xf59e0b],
    ['Earth', 0.52, 5.0, 0.28, 365, 0x38bdf8],
    ['Mars', 0.40, 6.2, 0.23, 687, 0xef4444],
    ['Jupiter', 1.05, 8.0, 0.13, 4333, 0xfbbf24],
    ['Saturn', 0.90, 10.0, 0.10, 10759, 0xfacc15],
    ['Uranus', 0.65, 12.0, 0.075, 30687, 0x67e8f9],
    ['Neptune', 0.64, 14.0, 0.06, 60190, 0x3b82f6],
];

export class SolarSystem {
    constructor() {
        this.group = new THREE.Group();
        this.group.name = '3D Solar System';
        this.selectable = [];
        this.running = true;
        this.speed = 1;
        this.selected = 'Earth';
        this.time = 0;
        this.planets = [];
        this.createScene();
    }

    createScene() {
        const sun = new THREE.Mesh(new THREE.SphereGeometry(1.55, 48, 32), new THREE.MeshBasicMaterial({ color: 0xffc857 }));
        sun.name = 'Sun'; sun.userData = { name: 'Sun', type: 'star', description: 'The Sun is the central star of our planetary system.', teacher: 'Gravity from the Sun keeps planets in orbit.' };
        this.group.add(sun); this.selectable.push(sun);
        const light = new THREE.PointLight(0xfff3c4, 500, 100); this.group.add(light);

        DATA.forEach(([name, radius, orbit, phase, period, color]) => {
            const orbitLine = new THREE.Mesh(new THREE.TorusGeometry(orbit, 0.012, 6, 128), new THREE.MeshBasicMaterial({ color: 0x334155, transparent: true, opacity: .55 }));
            orbitLine.rotation.x = Math.PI / 2; this.group.add(orbitLine);
            const planet = new THREE.Mesh(new THREE.SphereGeometry(radius * .32, 32, 24), new THREE.MeshStandardMaterial({ color, roughness: .55 }));
            const pivot = new THREE.Group(); pivot.add(planet); this.group.add(pivot);
            planet.name = name; planet.userData = { name, type: 'planet', description: `${name} orbits the Sun.`, teacher: `${name} travels around the Sun in an elliptical orbit.` };
            planet.position.x = orbit; this.planets.push({ name, orbit, period, phase, pivot, planet }); this.selectable.push(planet);
            if (name === 'Saturn') { const ring = new THREE.Mesh(new THREE.TorusGeometry(.7, .08, 12, 64), new THREE.MeshStandardMaterial({ color: 0xfde68a, transparent: true, opacity: .65 })); ring.rotation.x = Math.PI / 2.6; planet.add(ring); }
        });

        const stars = new THREE.BufferGeometry();
        const positions = [];
        for (let i = 0; i < 700; i++) { positions.push((Math.random() - .5) * 50, (Math.random() - .5) * 30, (Math.random() - .5) * 50); }
        stars.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.group.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xffffff, size: .05 })));
    }

    setSpeed(v) { this.speed = Math.max(.1, Number(v)); }
    setFocus(v) { this.selected = v || 'Earth'; }
    setRunning(v) { this.running = Boolean(v); }
    getState() {
        const planet = this.planets.find(p => p.name === this.selected) || this.planets[2];
        return { selected: planet.name, distanceAU: planet.orbit / 5, periodDays: planet.period, gravity: 9.81 / Math.max(1, planet.orbit / 5), speed: this.speed };
    }
    start() { this.running = true; }
    pause() { this.running = !this.running; }
    reset() { this.speed = 1; this.running = true; this.time = 0; }
    update(delta) {
        if (!this.running) return;
        this.time += delta * this.speed;
        this.planets.forEach(p => { p.pivot.rotation.y = (this.time / Math.max(5, p.period / 15)) + p.phase; });
    }
    getObject() { return this.group; }
    getSelectableObjects() { return this.selectable; }
    dispose() { this.group.traverse(o => { o.geometry?.dispose(); if (o.material) Array.isArray(o.material) ? o.material.forEach(m => m.dispose()) : o.material.dispose(); }); this.selectable = []; }
}
