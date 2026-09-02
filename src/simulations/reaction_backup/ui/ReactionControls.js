export class ReactionControls {
    constructor(container, engine) {
        this.container = container;
        this.engine = engine;

        this.render();
        this.bindEvents();
    }

    render() {
        if (!this.container) {
            return;
        }

        this.container.innerHTML = `
            <div class="reaction-controls">

                <div class="control-buttons">
                    <button
                        type="button"
                        data-action="start"
                    >
                        Start
                    </button>

                    <button
                        type="button"
                        data-action="pause"
                    >
                        Pause
                    </button>

                    <button
                        type="button"
                        data-action="resume"
                    >
                        Resume
                    </button>

                    <button
                        type="button"
                        data-action="reset"
                    >
                        Reset
                    </button>
                </div>

                <div class="temperature-control">
                    <label>
                        Temperature:
                        <strong class="temperature-value">
                            298 K
                        </strong>
                    </label>

                    <input
                        type="range"
                        min="250"
                        max="1200"
                        value="298"
                        step="1"
                        data-temperature
                    />
                </div>

            </div>
        `;
    }

    bindEvents() {
        if (!this.container) {
            return;
        }

        this.container
            .querySelectorAll(
                "[data-action]"
            )
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        this.handleAction(
                            button.dataset.action
                        );
                    }
                );
            });

        const slider =
            this.container.querySelector(
                "[data-temperature]"
            );

        if (slider) {
            slider.addEventListener(
                "input",
                event => {
                    const temperature =
                        Number(
                            event.target.value
                        );

                    this.engine.setTemperature(
                        temperature
                    );

                    this.updateTemperatureLabel(
                        temperature
                    );
                }
            );
        }
    }

    handleAction(action) {
        switch (action) {
            case "start":
                this.engine.start();
                break;

            case "pause":
                this.engine.pause();
                break;

            case "resume":
                this.engine.resume();
                break;

            case "reset":
                this.engine.reset();
                break;

            default:
                break;
        }
    }

    updateTemperatureLabel(
        temperature
    ) {
        const label =
            this.container.querySelector(
                ".temperature-value"
            );

        if (label) {
            label.textContent =
                `${Math.round(
                    temperature
                )} K`;
        }
    }
}