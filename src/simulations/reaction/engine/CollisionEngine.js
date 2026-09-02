// ============================================================
// SciLab Reaction Lab - Collision Engine
// ============================================================

export class CollisionEngine {
    constructor(distance = 0.9) {
        this.distance = distance;
    }

    detect(molecules = []) {
        const collisions = [];

        for (let i = 0; i < molecules.length; i++) {
            for (let j = i + 1; j < molecules.length; j++) {
                const a = molecules[i];
                const b = molecules[j];

                if (!a?.position || !b?.position) {
                    continue;
                }

                if (
                    a.position.distanceTo(b.position) <=
                    this.distance
                ) {
                    collisions.push([a, b]);
                }
            }
        }

        return collisions;
    }

    findReactiveCollision(
        molecules,
        reaction
    ) {
        if (!reaction?.reactants?.length) {
            return null;
        }

        const required = new Set(
            reaction.reactants.map(item => item.formula)
        );

        const collisions = this.detect(molecules);

        for (const [a, b] of collisions) {
            if (
                required.has(a.formula) &&
                required.has(b.formula) &&
                a.formula !== b.formula
            ) {
                return [a, b];
            }
        }

        return null;
    }

    isReactive(a, b, reaction) {
        if (!a || !b || !reaction) {
            return false;
        }

        const required = new Set(
            reaction.reactants.map(item => item.formula)
        );

        return (
            required.has(a.formula) &&
            required.has(b.formula)
        );
    }
}
