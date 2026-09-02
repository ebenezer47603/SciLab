export class ReactionRateSystem {
    constructor(reaction) {
        this.reaction = reaction;

        this.temperature = 298;
        this.rate = 0;
    }

    setTemperature(temperature) {
        const value = Number(temperature);

        this.temperature = Number.isFinite(value)
            ? Math.max(0, value)
            : 298;

        this.calculate();
    }

    calculate() {
        const min =
            Number(this.reaction?.minTemperature) || 0;

        const optimal =
            Number(this.reaction?.optimalTemperature) || min;

        if (this.temperature < min) {
            this.rate = 0;
            return this.rate;
        }

        if (optimal <= min) {
            this.rate = 1;
            return this.rate;
        }

        const normalized =
            (this.temperature - min) /
            (optimal - min);

        this.rate = Math.max(
            0,
            Math.min(1, normalized)
        );

        return this.rate;
    }

    getRate() {
        return this.rate;
    }

    getTemperature() {
        return this.temperature;
    }

    reset() {
        this.temperature = 298;
        this.rate = 0;
    }
}