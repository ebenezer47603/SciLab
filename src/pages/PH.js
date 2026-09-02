// ============================================================
// SciLab - pH Laboratory Page
// PH.js
// ============================================================

export function PH() {

    return `
        <section
            class="ph-page"
            id="ph-page"
        >

            <header class="ph-page-header">

                <div>

                    <span class="ph-eyebrow">
                        SCIENCE LABORATORY
                    </span>

                    <h1>
                        🧪 pH Laboratory
                    </h1>

                    <p>
                        Explore acids, bases and neutral
                        solutions using pH and litmus paper.
                    </p>

                </div>

            </header>

            <div class="ph-layout">

                <aside
                    id="ph-controls"
                    class="ph-sidebar"
                ></aside>

                <main class="ph-main">

                    <div
                        id="ph-scene-container"
                        class="ph-scene-container"
                    ></div>

                    <section
                        id="ph-information"
                        class="ph-information"
                    >

                        <div class="ph-result-card">

                            <div>
                                <span>
                                    Solution
                                </span>

                                <strong
                                    id="ph-solution-name"
                                >
                                    Distilled Water
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Formula
                                </span>

                                <strong
                                    id="ph-solution-formula"
                                >
                                    H₂O
                                </strong>
                            </div>

                            <div>
                                <span>
                                    pH
                                </span>

                                <strong
                                    id="ph-value"
                                >
                                    7.0
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Type
                                </span>

                                <strong
                                    id="ph-type"
                                >
                                    Neutral
                                </strong>
                            </div>

                        </div>

                        <div class="ph-scale-card">

                            <div class="ph-scale-title">

                                <strong>
                                    pH Scale
                                </strong>

                                <span>
                                    0 — 14
                                </span>

                            </div>

                            <div
                                id="ph-scale"
                                class="ph-scale"
                            >

                                <div class="ph-scale-gradient"></div>

                                <div
                                    id="ph-scale-marker"
                                    class="ph-scale-marker"
                                >
                                    <span></span>
                                </div>

                            </div>

                            <div class="ph-scale-numbers">

                                <span>0</span>
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                                <span>10</span>
                                <span>11</span>
                                <span>12</span>
                                <span>13</span>
                                <span>14</span>

                            </div>

                            <div class="ph-scale-labels">

                                <span>
                                    Acidic
                                </span>

                                <span>
                                    Neutral
                                </span>

                                <span>
                                    Basic / Alkaline
                                </span>

                            </div>

                        </div>

                        <div
                            id="ph-observation"
                            class="ph-observation"
                        >
                            Choose a solution to begin.
                        </div>

                    </section>

                </main>

            </div>

        </section>
    `;
}