// ============================================================
// SciLab Reaction Lab - Reaction Information
// ============================================================

export class ReactionInfo {

    constructor(
        container,
        engine
    ) {
        this.container =
            container;

        this.engine =
            engine;

        this.render();
    }


    render() {

        if (!this.container) {
            return;
        }

        const reaction =
            this.engine.getReaction();

        const state =
            this.engine.getState();

        this.container.innerHTML = `

            <div class="reaction-info">

                <div class="reaction-info-name">
                    ${reaction.name}
                </div>

                <div class="reaction-info-category">
                    ${reaction.category}
                </div>


                <div class="reaction-live-grid">

                    <div class="reaction-live-item">

                        <span>
                            Temperature
                        </span>

                        <strong
                            class="temperature"
                        >
                            ${Math.round(
                                this.engine.getTemperature()
                            )} K
                        </strong>

                    </div>


                    <div class="reaction-live-item">

                        <span>
                            Reaction Rate
                        </span>

                        <strong
                            class="rate"
                        >
                            ${Math.round(
                                this.engine.getReactionRate() *
                                100
                            )}%
                        </strong>

                    </div>


                    <div class="reaction-live-item">

                        <span>
                            Progress
                        </span>

                        <strong
                            class="progress"
                        >
                            ${this.engine.getProgressPercent()}%
                        </strong>

                    </div>


                    <div class="reaction-live-item">

                        <span>
                            Collisions
                        </span>

                        <strong
                            class="collisions"
                        >
                            ${state.collisions || 0}
                        </strong>

                    </div>

                </div>


                <div class="reaction-progress">

                    <div class="reaction-progress-header">

                        <span>
                            Reaction progress
                        </span>

                        <strong
                            class="progress-label"
                        >
                            ${this.engine.getProgressPercent()}%
                        </strong>

                    </div>

                    <div class="reaction-progress-track">

                        <div
                            class="reaction-progress-fill"
                            data-progress-bar
                            style="
                                width:
                                ${this.engine.getProgressPercent()}%;
                            "
                        ></div>

                    </div>

                </div>


                <div class="reaction-energy">

                    <span>
                        Energy released
                    </span>

                    <strong
                        class="energy"
                    >
                        ${Number(
                            state.energy?.released || 0
                        ).toFixed(1)}
                        kJ
                    </strong>

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

        const progressLabel =
            this.container.querySelector(
                ".progress-label"
            );

        const progressBar =
            this.container.querySelector(
                "[data-progress-bar]"
            );

        const collisions =
            this.container.querySelector(
                ".collisions"
            );

        const energy =
            this.container.querySelector(
                ".energy"
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
                    this.engine.getReactionRate() *
                    100
                )}%`;
        }


        const percent =
            this.engine.getProgressPercent();


        if (progress) {

            progress.textContent =
                `${percent}%`;
        }


        if (progressLabel) {

            progressLabel.textContent =
                `${percent}%`;
        }


        if (progressBar) {

            progressBar.style.width =
                `${percent}%`;
        }


        if (collisions) {

            collisions.textContent =
                this.engine
                    .getState()
                    .collisions || 0;
        }


        if (energy) {

            energy.textContent =
                `${Number(
                    this.engine
                        .getState()
                        .energy?.released || 0
                ).toFixed(1)} kJ`;
        }
    }
}