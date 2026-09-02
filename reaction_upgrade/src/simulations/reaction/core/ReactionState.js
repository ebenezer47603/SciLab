// ============================================================
// SciLab Reaction Lab - Reaction State
// ============================================================

export class ReactionState {
    constructor() {
        this.reset();
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;

        this.temperature = 298;
        this.reactionRate = 0;
        this.progress = 0;

        this.elapsedTime = 0;
        this.collisions = 0;
        this.completedSteps = 0;

        this.reactants = [];
        this.products = [];

        this.energy = {
            activationEnergy: 0,
            enthalpy: 0,
            released: 0
        };
    }

    start() {
        this.isRunning = true;
        this.isPaused = false;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        if (this.isRunning) {
            this.isPaused = false;
        }
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
    }
}
