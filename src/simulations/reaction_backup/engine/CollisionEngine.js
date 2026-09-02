export class CollisionEngine {
    constructor(distance = 0.8) {
        this.distance = distance;
        this.distanceSquared = distance * distance;
    }

    setDistance(distance) {
        const value = Number(distance);

        if (!Number.isFinite(value) || value <= 0) {
            return;
        }

        this.distance = value;
        this.distanceSquared = value * value;
    }

    detect(molecules = []) {
        const collisions = [];

        if (!Array.isArray(molecules)) {
            return collisions;
        }

        for (let i = 0; i < molecules.length; i++) {
            const a = molecules[i];

            if (
                !a ||
                !a.position
            ) {
                continue;
            }

            for (
                let j = i + 1;
                j < molecules.length;
                j++
            ) {
                const b = molecules[j];

                if (
                    !b ||
                    !b.position
                ) {
                    continue;
                }

                const distanceSquared =
                    a.position.distanceToSquared(
                        b.position
                    );

                if (
                    distanceSquared <=
                    this.distanceSquared
                ) {
                    collisions.push([
                        a,
                        b
                    ]);
                }
            }
        }

        return collisions;
    }

    isReactive(a, b) {
        if (!a || !b) {
            return false;
        }

        if (
            !a.formula ||
            !b.formula
        ) {
            return false;
        }

        return (
            (
                a.formula === "H2" &&
                b.formula === "O2"
            ) ||
            (
                a.formula === "O2" &&
                b.formula === "H2"
            )
        );
    }

    getDistance() {
        return this.distance;
    }
}