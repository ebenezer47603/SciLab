export class ReactionInfo {
    constructor(container, engine) {
        this.container = container;
        this.engine = engine;

        this.render();
    }

    render() {
        if (!this.container) {
            return;
        }

        const reaction =
            this.engine.getReaction();

        this.container.innerHTML = `
            <div class="reaction-info">
                <h2>${reaction.name}</h2>

                <div class="reaction-equation">
                    ${reaction.equation}
                </div>

                <div class="reaction-stats">
                    <div>
                        <span>Temperature</span>
                        <strong class="temperature">
                            ${this.engine.getTemperature()} K
                        </strong>
                    </div>

                    <div>
                        <span>Reaction Rate</span>
                        <strong class="rate">
                            ${Math.round(
                                this.engine.getReactionRate() * 100
                            )}%
                        </strong>
                    </div>

                    <div>
                        <span>Progress</span>
                        <strong class="progress">
                            ${this.engine.getProgressPercent()}%
                        </strong>
                    </div>

                    <div>
                        <span>Collisions</span>
                        <strong class="collisions">
                            0
                        </strong>
                    </div>
                </div>
            </div>
        `;
    }

    update() {
        if (!this.container) {
            return;
        }

        const temperature =
            this.container.querySelector(
                ".temperature"
            );

        const rate =
            this.container.querySelector(
                ".rate"
            );

        const progress =
            this.container.querySelector(
                ".progress"
            );

        const collisions =
            this.container.querySelector(
                ".collisions"
            );

        if (temperature) {
            temperature.textContent =
                `${Math.round(
                    this.engine.getTemperature()
                )} K`;
        }

        if (rate) {
            rate.textContent =
                `${Math.round(
                    this.engine.getReactionRate() * 100
                )}%`;
        }

        if (progress) {
            progress.textContent =
                `${this.engine.getProgressPercent()}%`;
        }

        if (collisions) {
            collisions.textContent =
                this.engine.getState().collisions;
        }
    }
}