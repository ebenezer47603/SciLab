// ============================================================
// SciLab - Home Page
// Home.js
// ============================================================

export function Home() {

    return `

        <!-- ==================================================
             SCILAB HOME
        =================================================== -->

        <main class="scilab-home">


            <!-- ==================================================
                 HERO SECTION
            =================================================== -->

            <section class="home-hero">

                <div class="hero-background">

                    <div class="hero-glow glow-one"></div>
                    <div class="hero-glow glow-two"></div>
                    <div class="hero-grid"></div>

                </div>


                <div class="hero-inner">

                    <!-- LEFT SIDE -->

                    <div class="hero-text">

                        <div class="hero-badge">

                            <span class="badge-dot"></span>

                            INTERACTIVE SCIENCE PLATFORM

                        </div>


                        <h1>

                            Discover

                            <span>
                                Science
                            </span>

                            <br>

                            Beyond The Classroom.

                        </h1>


                        <p class="hero-description">

                            Explore physics, chemistry and biology
                            through interactive simulations,
                            virtual experiments and visual learning.

                        </p>


                        <div class="hero-actions">

                            <button
                                class="home-primary-btn"
                                data-page="physics"
                            >

                                <span>
                                    Explore Science
                                </span>

                                <span class="btn-arrow">
                                    →
                                </span>

                            </button>


                            <button
                                class="home-secondary-btn"
                                data-page="chemistry"
                            >

                                🧪

                                <span>
                                    Open Laboratory
                                </span>

                            </button>

                        </div>


                        <!-- TRUST / QUICK INFO -->

                        <div class="hero-meta">

                            <div class="hero-meta-item">

                                <strong>
                                    03
                                </strong>

                                <span>
                                    Science Labs
                                </span>

                            </div>


                            <div class="hero-meta-divider"></div>


                            <div class="hero-meta-item">

                                <strong>
                                    ∞
                                </strong>

                                <span>
                                    Experiments
                                </span>

                            </div>


                            <div class="hero-meta-divider"></div>


                            <div class="hero-meta-item">

                                <strong>
                                    100%
                                </strong>

                                <span>
                                    Interactive
                                </span>

                            </div>

                        </div>

                    </div>



                    <!-- ==================================================
                         RIGHT SIDE SCIENCE VISUAL
                    =================================================== -->

                    <div class="hero-visual">

                        <div class="science-orbit orbit-one"></div>
                        <div class="science-orbit orbit-two"></div>
                        <div class="science-orbit orbit-three"></div>


                        <div class="science-core">

                            <div class="core-inner">

                                ⚛

                            </div>

                        </div>


                        <!-- FLOATING ELEMENTS -->

                        <div class="floating-science floating-one">

                            <span class="science-icon">
                                ⚛️
                            </span>

                            <div>
                                <strong>
                                    Physics
                                </strong>

                                <small>
                                    Motion & Forces
                                </small>
                            </div>

                        </div>


                        <div class="floating-science floating-two">

                            <span class="science-icon">
                                🧪
                            </span>

                            <div>
                                <strong>
                                    Chemistry
                                </strong>

                                <small>
                                    Molecules & Reactions
                                </small>
                            </div>

                        </div>


                        <div class="floating-science floating-three">

                            <span class="science-icon">
                                🧬
                            </span>

                            <div>
                                <strong>
                                    Biology
                                </strong>

                                <small>
                                    Cells & Life
                                </small>
                            </div>

                        </div>


                        <div class="floating-particle particle-one"></div>
                        <div class="floating-particle particle-two"></div>
                        <div class="floating-particle particle-three"></div>
                        <div class="floating-particle particle-four"></div>

                    </div>

                </div>

            </section>



            <!-- ==================================================
                 LABORATORIES
            =================================================== -->

            <section class="home-labs">

                <div class="home-section-heading">

                    <div>

                        <span class="section-kicker">
                            EXPLORE THE LABS
                        </span>

                        <h2>
                            Choose your
                            <span>
                                laboratory
                            </span>
                        </h2>

                    </div>


                    <p>

                        Learn by interacting with science,
                        not just reading about it.

                    </p>

                </div>



                <!-- LAB GRID -->

                <div class="labs-grid">


                    <!-- PHYSICS -->

                    <article
                        class="lab-card physics-lab"
                        data-page="physics"
                    >

                        <div class="lab-card-glow"></div>


                        <div class="lab-card-header">

                            <div class="lab-icon">
                                ⚛️
                            </div>

                            <span class="lab-number">
                                01
                            </span>

                        </div>


                        <div class="lab-card-body">

                            <span class="lab-label">
                                PHYSICS
                            </span>

                            <h3>
                                Physics Lab
                            </h3>

                            <p>

                                Explore motion, forces,
                                gravity, electricity,
                                waves and energy.

                            </p>

                        </div>


                        <button
                            class="lab-open-btn"
                            data-page="physics"
                        >

                            Enter Lab

                            <span>
                                →
                            </span>

                        </button>

                    </article>



                    <!-- CHEMISTRY -->

                    <article
                        class="lab-card chemistry-lab"
                        data-page="chemistry"
                    >

                        <div class="lab-card-glow"></div>


                        <div class="lab-card-header">

                            <div class="lab-icon">
                                🧪
                            </div>

                            <span class="lab-number">
                                02
                            </span>

                        </div>


                        <div class="lab-card-body">

                            <span class="lab-label">
                                CHEMISTRY
                            </span>

                            <h3>
                                Chemistry Lab
                            </h3>

                            <p>

                                Build molecules,
                                observe reactions,
                                explore atoms and
                                chemical changes.

                            </p>

                        </div>


                        <button
                            class="lab-open-btn"
                            data-page="chemistry"
                        >

                            Enter Lab

                            <span>
                                →
                            </span>

                        </button>

                    </article>



                    <!-- BIOLOGY -->

                    <article
                        class="lab-card biology-lab"
                        data-page="biology"
                    >

                        <div class="lab-card-glow"></div>


                        <div class="lab-card-header">

                            <div class="lab-icon">
                                🧬
                            </div>

                            <span class="lab-number">
                                03
                            </span>

                        </div>


                        <div class="lab-card-body">

                            <span class="lab-label">
                                BIOLOGY
                            </span>

                            <h3>
                                Biology Lab
                            </h3>

                            <p>

                                Discover cells, DNA,
                                circulation, osmosis,
                                enzymes and life systems.

                            </p>

                        </div>


                        <button
                            class="lab-open-btn"
                            data-page="biology"
                        >

                            Enter Lab

                            <span>
                                →
                            </span>

                        </button>

                    </article>

                </div>

            </section>



            <!-- ==================================================
                 LEARNING SECTION
            =================================================== -->

            <section class="home-learning">

                <div class="learning-visual">

                    <div class="learning-circle circle-one"></div>
                    <div class="learning-circle circle-two"></div>
                    <div class="learning-circle circle-three"></div>


                    <div class="learning-symbol">
                        🧠
                    </div>


                    <div class="learning-chip chip-one">
                        Explore
                    </div>

                    <div class="learning-chip chip-two">
                        Experiment
                    </div>

                    <div class="learning-chip chip-three">
                        Discover
                    </div>

                </div>


                <div class="learning-content">

                    <span class="section-kicker">
                        LEARN BY DOING
                    </span>


                    <h2>

                        Science is better
                        when you can
                        <span>
                            see it.
                        </span>

                    </h2>


                    <p>

                        SciLab transforms complex scientific
                        concepts into interactive experiences.
                        Move objects, change values, run
                        experiments and watch what happens
                        in real time.

                    </p>


                    <div class="learning-features">

                        <div class="learning-feature">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Interactive Simulations
                                </strong>

                                <small>
                                    Learn through visual experiments.
                                </small>

                            </div>

                        </div>


                        <div class="learning-feature">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Virtual Laboratories
                                </strong>

                                <small>
                                    Experiment without limits.
                                </small>

                            </div>

                        </div>


                        <div class="learning-feature">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Visual Learning
                                </strong>

                                <small>
                                    See science in action.
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            </section>



            <!-- ==================================================
                 CALL TO ACTION
            =================================================== -->

            <section class="home-cta">

                <div class="cta-glow"></div>


                <div class="cta-content">

                    <span class="section-kicker">
                        READY TO EXPLORE?
                    </span>


                    <h2>

                        Your laboratory
                        is waiting.

                    </h2>


                    <p>

                        Choose a subject and start
                        experimenting with science.

                    </p>


                    <div class="cta-buttons">

                        <button
                            class="home-primary-btn"
                            data-page="physics"
                        >

                            Start Exploring

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </div>

            </section>



        </main>

    `;
}