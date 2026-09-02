import * as THREE from 'three';

export class LensOptics {
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'Lens & Ray Optics';
        this.selectable = [];
        this.running = true;
        this.lensType = 'convex';
        this.focalLength = 4;
        this.objectDistance = 8;
        this.objectHeight = 2.5;
        this.showRays = true;
        this.createScene();
        this.updateOptics();
    }

    createScene() {
        const axisMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
        const axis = new THREE.Mesh(new THREE.BoxGeometry(22, 0.025, 0.025), axisMat);
        axis.position.set(0, 0, 0);
        this.group.add(axis);

        const lensMat = new THREE.MeshPhysicalMaterial({
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.34,
            roughness: 0.08,
            transmission: 0.15,
            side: THREE.DoubleSide,
        });
        this.lens = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.35, 64), lensMat);
        this.lens.rotation.z = Math.PI / 2;
        this.lens.name = 'Lens';
        this.lens.userData = { name: 'Lens', type: 'lens', description: 'A thin lens bends light rays and changes their direction to form an image.', teacher: 'Changing focal length changes the image position and magnification.' };
        this.group.add(this.lens);
        this.selectable.push(this.lens);

        this.focalMarks = new THREE.Group();
        this.group.add(this.focalMarks);

        this.object = new THREE.Group();
        this.object.name = 'Object';
        this.object.userData = { name: 'Object', type: 'object', description: 'The object is the source whose image is formed by the lens.', teacher: 'Move the object and observe how image formation changes.' };
        const stem = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.5, 0.12), new THREE.MeshStandardMaterial({ color: 0x4ade80 }));
        stem.position.y = 1.25;
        const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0x4ade80 }));
        head.position.y = 2.75;
        this.object.add(stem, head);
        this.group.add(this.object);
        this.selectable.push(this.object);

        this.image = new THREE.Group();
        this.group.add(this.image);
        this.rays = new THREE.Group();
        this.group.add(this.rays);

        const ground = new THREE.GridHelper(20, 20, 0x233044, 0x152033);
        ground.rotation.x = Math.PI / 2;
        ground.position.y = -0.02;
        ground.material.transparent = true;
        ground.material.opacity = 0.25;
        this.group.add(ground);
    }

    setLensType(value) { this.lensType = value === 'concave' ? 'concave' : 'convex'; this.updateOptics(); }
    setFocalLength(value) { this.focalLength = Math.max(1, Number(value)); this.updateOptics(); }
    setObjectDistance(value) { this.objectDistance = Math.max(2, Number(value)); this.updateOptics(); }
    setObjectHeight(value) { this.objectHeight = Math.max(0.5, Number(value)); this.updateOptics(); }

    clearGroup(group) {
        while (group.children.length) {
            const child = group.children.pop();
            child.geometry?.dispose();
            if (child.material) {
                Array.isArray(child.material) ? child.material.forEach(m => m.dispose()) : child.material.dispose();
            }
        }
    }

    updateOptics() {
        const f = this.focalLength;
        const d = this.objectDistance;
        const h = this.objectHeight;
        const isConvex = this.lensType === 'convex';
        let di = 0;
        let m = 0;
        let hi = 0;
        let type = 'Virtual, Upright';

        if (isConvex) {
            if (Math.abs(d - f) < 0.08) {
                di = Infinity;
                m = Infinity;
                hi = Infinity;
                type = 'Image at Infinity';
            } else {
                di = 1 / (1 / f - 1 / d);
                m = -di / d;
                hi = m * h;
                type = di > 0 ? (d > 2 * f ? 'Real, Inverted, Diminished' : (d > f ? 'Real, Inverted, Enlarged' : 'Virtual, Upright')) : 'Virtual, Upright';
            }
        } else {
            di = -1 / (1 / f + 1 / d);
            m = -di / d;
            hi = m * h;
            type = 'Virtual, Upright, Diminished';
        }

        this.object.position.x = -d;
        this.object.children[0].scale.y = h / 2.5;
        this.object.children[1].position.y = h + 0.25;

        this.clearGroup(this.focalMarks);
        const markerMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
        [-f, f].forEach(x => {
            const marker = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), markerMat.clone());
            marker.position.set(x, 0, 0);
            this.focalMarks.add(marker);
        });

        this.clearGroup(this.image);
        if (Number.isFinite(di) && Math.abs(di) < 18) {
            const stem = new THREE.Mesh(new THREE.BoxGeometry(0.12, Math.max(0.15, Math.abs(hi)), 0.12), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
            stem.position.y = hi / 2;
            const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
            head.position.y = hi + (hi >= 0 ? 0.25 : -0.25);
            if (hi < 0) head.rotation.z = Math.PI;
            this.image.add(stem, head);
            this.image.position.x = di;
        }

        this.clearGroup(this.rays);
        if (this.showRays) {
            this.createRay(-d, h, 0, isConvex ? f : -f);
            this.createRay(-d, 0, 0, 0);
            this.createRay(-d, h, 0, isConvex ? 0 : -f);
        }

        this.state = {
            lensType: this.lensType,
            focalLength: f,
            objectDistance: d,
            objectHeight: h,
            imageDistance: Number.isFinite(di) ? di : 9999,
            magnification: Number.isFinite(m) ? m : 9999,
            imageHeight: Number.isFinite(hi) ? hi : 9999,
            imageType: type,
        };
    }

    createRay(x1, y1, z1, x2) {
        const pts = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, 0, 0)];
        if (this.lensType === 'convex' && x2 > 0) pts.push(new THREE.Vector3(this.state.imageDistance, this.state.imageHeight, 0));
        else pts.push(new THREE.Vector3(0, 0, 0));
        const curve = new THREE.CatmullRomCurve3(pts);
        const geometry = new THREE.TubeGeometry(curve, 24, 0.025, 6, false);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        this.rays.add(mesh);
    }

    getState() { return { ...this.state }; }
    start() { this.running = true; }
    pause() { this.running = !this.running; }
    reset() { this.lensType = 'convex'; this.focalLength = 4; this.objectDistance = 8; this.objectHeight = 2.5; this.updateOptics(); }
    getObject() { return this.group; }
    getSelectableObjects() { return this.selectable; }
    update() {}
    dispose() {
        this.group.traverse(o => { o.geometry?.dispose(); if (o.material) Array.isArray(o.material) ? o.material.forEach(m => m.dispose()) : o.material.dispose(); });
        this.selectable = [];
    }
}
