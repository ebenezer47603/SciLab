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
        this.successfulReactions = 0;

        this.energy = {
            activationEnergy: 0,
            enthalpy: 0,
            released: 0
        };

        this.reactants = [];
        this.products = [];
    }

    start() {
        this.isRunning = true;
        this.isPaused = false;
    }

    pause() {
        if (this.isRunning) {
            this.isPaused = true;
        }
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

    getStatus() {
        if (!this.isRunning) {
            return "stopped";
        }

        if (this.isPaused) {
            return "paused";
        }

        return "running";
    }
}