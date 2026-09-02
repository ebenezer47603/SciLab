import * as THREE from 'three';

export class ElectricMotor {
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'Electric Motor';
        this.selectable = [];
        this.running = false;
        this.paused = false;
        this.voltage = 12;
        this.currentInput = 2;
        this.field = .8;
        this.turns = 150;
        this.angle = 0;
        this.omega = 0;
        this.createScene();
        this.reset();
    }

    createScene() {
        const north = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.0, 32), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        north.rotation.z = Math.PI / 2; north.position.x = -2.2; north.name = 'North Pole';
        const south = north.clone(); south.material = north.material.clone(); south.material.color.set(0x3b82f6); south.position.x = 2.2; south.name = 'South Pole';
        this.group.add(north, south); this.selectable.push(north, south);

        this.rotor = new THREE.Group();
        const coilMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: .6, roughness: .25 });
        const coil = new THREE.Mesh(new THREE.TorusGeometry(1.35, .08, 12, 64), coilMat);
        coil.scale.set(1, .75, 1); this.rotor.add(coil);
        this.axle = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 3.8, 24), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: .8 }));
        this.axle.rotation.z = Math.PI / 2; this.rotor.add(this.axle);
        this.rotor.name = 'Rotor Coil';
        this.rotor.userData = { name: 'Rotor Coil', type: 'rotor', description: 'A current-carrying coil experiences torque in a magnetic field.', teacher: 'Increase current or magnetic field to increase motor torque.' };
        this.group.add(this.rotor); this.selectable.push(this.rotor);

        this.commutator = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .6, 32), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: .65 }));
        this.commutator.rotation.z = Math.PI / 2; this.commutator.position.x = 0; this.group.add(this.commutator);

        const field = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1.8, 0, 0), 3.6, 0x60a5fa, .25, .18);
        this.group.add(field);
    }

    setVoltage(v) { this.voltage = Math.max(0, Number(v)); }
    setCurrent(v) { this.currentInput = Math.max(0, Number(v)); }
    setField(v) { this.field = Math.max(0, Number(v)); }
    setTurns(v) { this.turns = Math.max(1, Number(v)); }

    getState() { return { voltage: this.voltage, current: this.currentInput, magneticField: this.field, turns: this.turns, torque: this.torque, rpm: this.rpm, power: this.power, efficiency: this.efficiency }; }
    start() { this.running = true; this.paused = false; }
    pause() { this.paused = !this.paused; }
    reset() { this.running = false; this.paused = false; this.angle = 0; this.omega = 0; this.torque = 0; this.rpm = 0; this.power = 0; this.efficiency = 0; this.rotor.rotation.x = 0; }

    update(delta) {
        if (!this.running || this.paused) return;
        this.torque = this.turns * this.field * this.currentInput * .0007;
        const targetOmega = this.torque * 220;
        this.omega += (targetOmega - this.omega) * Math.min(1, delta * 2);
        this.angle += this.omega * delta;
        this.rotor.rotation.x = this.angle;
        this.rpm = this.omega * 60 / (2 * Math.PI);
        this.power = this.voltage * this.currentInput;
        this.efficiency = Math.max(0, Math.min(100, this.torque * this.omega / Math.max(.1, this.power) * 100));
    }
    getObject() { return this.group; }
    getSelectableObjects() { return this.selectable; }
    dispose() { this.group.traverse(o => { o.geometry?.dispose(); if (o.material) Array.isArray(o.material) ? o.material.forEach(m => m.dispose()) : o.material.dispose(); }); this.selectable = []; }
}
