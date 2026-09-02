// ============================================================
// SciLab - Chemistry Laboratory
// Chemistry.js
// ============================================================

export function Chemistry() {

    return `

        <main class="chemistry-page">


            <!-- ==================================================
                 HERO
            =================================================== -->

            <section class="chemistry-hero">

                <div class="chemistry-hero-bg">

                    <div class="chem-glow chem-glow-one"></div>
                    <div class="chem-glow chem-glow-two"></div>
                    <div class="chem-grid"></div>

                    <div class="chem-particle particle-1"></div>
                    <div class="chem-particle particle-2"></div>
                    <div class="chem-particle particle-3"></div>
                    <div class="chem-particle particle-4"></div>
                    <div class="chem-particle particle-5"></div>

                </div>


                <div class="chemistry-hero-content">

                    <div class="chemistry-badge">

                        <span class="badge-dot"></span>

                        INTERACTIVE CHEMISTRY LAB

                    </div>


                    <h1>

                        Explore the
                        <span>
                            Chemistry
                        </span>

                        <br>

                        of Matter.

                    </h1>


                    <p>

                        Build atoms, create molecules,
                        observe chemical reactions and
                        experiment with acids and bases.

                    </p>


                    <div class="chemistry-hero-actions">

                        <button
                            class="chemistry-primary-btn"
                            data-page="atom"
                        >

                            <span>
                                Start Experiment
                            </span>

                            <span>
                                →
                            </span>

                        </button>


                        <button
                            class="chemistry-secondary-btn"
                            data-page="molecule"
                        >

                            ⚛️

                            <span>
                                Build a Molecule
                            </span>

                        </button>

                    </div>


                    <!-- QUICK STATS -->

                    <div class="chemistry-stats">

                        <div class="chem-stat">

                            <strong>
                                04
                            </strong>

                            <span>
                                Laboratories
                            </span>

                        </div>


                        <div class="chem-stat-divider"></div>


                        <div class="chem-stat">

                            <strong>
                                ∞
                            </strong>

                            <span>
                                Experiments
                            </span>

                        </div>


                        <div class="chem-stat-divider"></div>


                        <div class="chem-stat">

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
                     HERO MOLECULE VISUAL
                =================================================== -->

                <div class="chemistry-visual">

                    <div class="atom-orbit orbit-1"></div>
                    <div class="atom-orbit orbit-2"></div>
                    <div class="atom-orbit orbit-3"></div>


                    <div class="chem-nucleus">

                        <span>
                            C
                        </span>

                    </div>


                    <div class="electron electron-1"></div>
                    <div class="electron electron-2"></div>
                    <div class="electron electron-3"></div>


                    <div class="floating-chem-card chem-card-1">

                        <span>
                            ⚛️
                        </span>

                        <div>

                            <strong>
                                Atoms
                            </strong>

                            <small>
                                Build & Explore
                            </small>

                        </div>

                    </div>


                    <div class="floating-chem-card chem-card-2">

                        <span>
                            🧬
                        </span>

                        <div>

                            <strong>
                                Molecules
                            </strong>

                            <small>
                                Connect Atoms
                            </small>

                        </div>

                    </div>


                    <div class="floating-chem-card chem-card-3">

                        <span>
                            ⚗️
                        </span>

                        <div>

                            <strong>
                                Reactions
                            </strong>

                            <small>
                                Watch Chemistry
                            </small>

                        </div>

                    </div>

                </div>

            </section>



            <!-- ==================================================
                 LABORATORIES
            =================================================== -->

            <section class="chemistry-labs">


                <div class="chem-section-heading">

                    <div>

                        <span>
                            CHEMISTRY TOOLS
                        </span>

                        <h2>

                            Choose your
                            <span>
                                experiment
                            </span>

                        </h2>

                    </div>


                    <p>

                        Explore chemistry by interacting
                        directly with atoms, molecules,
                        reactions and pH.

                    </p>

                </div>



                <div class="chem-labs-grid">


                    <!-- ==================================================
                         ATOM
                    =================================================== -->

                    <article
                        class="chem-lab-card atom-card"
                        data-page="atom"
                    >

                        <div class="chem-card-glow"></div>


                        <div class="chem-card-top">

                            <div class="chem-icon">
                                ⚛️
                            </div>

                            <span>
                                01
                            </span>

                        </div>


                        <div class="chem-card-content">

                            <span class="chem-label">
                                ATOMIC STRUCTURE
                            </span>


                            <h3>
                                Atom Simulator
                            </h3>


                            <p>

                                Build an atom from
                                protons, neutrons and
                                electrons.

                            </p>

                        </div>


                        <button
                            class="chem-open-btn"
                            data-page="atom"
                        >

                            Open Simulator

                            <span>
                                →
                            </span>

                        </button>

                    </article>



                    <!-- ==================================================
                         MOLECULE
                    =================================================== -->

                    <article
                        class="chem-lab-card molecule-card"
                        data-page="molecule"
                    >

                        <div class="chem-card-glow"></div>


                        <div class="chem-card-top">

                            <div class="chem-icon">
                                🧬
                            </div>

                            <span>
                                02
                            </span>

                        </div>


                        <div class="chem-card-content">

                            <span class="chem-label">
                                MOLECULAR STRUCTURE
                            </span>


                            <h3>
                                Molecule Builder
                            </h3>


                            <p>

                                Connect atoms together
                                and create your own
                                molecular structures.

                            </p>

                        </div>


                        <button
                            class="chem-open-btn"
                            data-page="molecule"
                        >

                            Build Molecule

                            <span>
                                →
                            </span>

                        </button>

                    </article>



                    <!-- ==================================================
                         REACTION
                    =================================================== -->

                    <article
                        class="chem-lab-card reaction-card"
                        data-page="reaction"
                    >

                        <div class="chem-card-glow"></div>


                        <div class="chem-card-top">

                            <div class="chem-icon">
                                ⚗️
                            </div>

                            <span>
                                03
                            </span>

                        </div>


                        <div class="chem-card-content">

                            <span class="chem-label">
                                CHEMICAL REACTIONS
                            </span>


                            <h3>
                                Reaction Simulator
                            </h3>


                            <p>

                                Combine substances and
                                observe chemical changes
                                happening in real time.

                            </p>

                        </div>


                        <button
                            class="chem-open-btn"
                            data-page="reaction"
                        >

                            Run Reaction

                            <span>
                                →
                            </span>

                        </button>

                    </article>



                    <!-- ==================================================
                         PH
                    =================================================== -->

                    <article
                        class="chem-lab-card ph-card"
                        data-page="ph"
                    >

                        <div class="chem-card-glow"></div>


                        <div class="chem-card-top">

                            <div class="chem-icon">
                                🧪
                            </div>

                            <span>
                                04
                            </span>

                        </div>


                        <div class="chem-card-content">

                            <span class="chem-label">
                                ACIDS & BASES
                            </span>


                            <h3>
                                pH Laboratory
                            </h3>


                            <p>

                                Explore acids and bases
                                using the pH scale and
                                interactive solutions.

                            </p>

                        </div>


                        <button
                            class="chem-open-btn"
                            data-page="ph"
                        >

                            Open pH Lab

                            <span>
                                →
                            </span>

                        </button>

                    </article>

                </div>

            </section>



            <!-- ==================================================
                 CHEMISTRY CONCEPT
            =================================================== -->

            <section class="chemistry-learning">


                <div class="chem-learning-visual">

                    <div class="learning-ring ring-1"></div>
                    <div class="learning-ring ring-2"></div>
                    <div class="learning-ring ring-3"></div>


                    <div class="molecule-display">

                        <div class="molecule-atom carbon">
                            C
                        </div>

                        <div class="molecule-bond bond-left"></div>
                        <div class="molecule-bond bond-right"></div>

                        <div class="molecule-atom oxygen oxygen-left">
                            O
                        </div>

                        <div class="molecule-atom oxygen oxygen-right">
                            O
                        </div>

                    </div>


                    <div class="learning-floating lf-1">
                        Atomic Structure
                    </div>

                    <div class="learning-floating lf-2">
                        Chemical Bonds
                    </div>

                    <div class="learning-floating lf-3">
                        Reactions
                    </div>

                </div>



                <div class="chem-learning-content">

                    <span>
                        LEARN CHEMISTRY VISUALLY
                    </span>


                    <h2>

                        Chemistry makes sense
                        when you can
                        <span>
                            see the change.
                        </span>

                    </h2>


                    <p>

                        SciLab lets you interact directly
                        with chemical concepts. Build atoms,
                        connect molecules, change substances
                        and observe how matter behaves.

                    </p>


                    <div class="chem-learning-list">


                        <div class="chem-learning-item">

                            <div>
                                ✓
                            </div>

                            <section>

                                <strong>
                                    Build Atoms
                                </strong>

                                <small>
                                    Explore protons, neutrons
                                    and electrons.
                                </small>

                            </section>

                        </div>


                        <div class="chem-learning-item">

                            <div>
                                ✓
                            </div>

                            <section>

                                <strong>
                                    Create Molecules
                                </strong>

                                <small>
                                    Connect atoms using
                                    chemical bonds.
                                </small>

                            </section>

                        </div>


                        <div class="chem-learning-item">

                            <div>
                                ✓
                            </div>

                            <section>

                                <strong>
                                    Observe Reactions
                                </strong>

                                <small>
                                    Watch substances transform
                                    during reactions.
                                </small>

                            </section>

                        </div>

                    </div>

                </div>

            </section>



            <!-- ==================================================
                 CTA
            =================================================== -->

            <section class="chemistry-cta">

                <div class="chem-cta-glow"></div>


                <div class="chem-cta-content">

                    <span>
                        ENTER THE LAB
                    </span>


                    <h2>
                        Ready to experiment?
                    </h2>


                    <p>

                        Choose an experiment and
                        start discovering chemistry.

                    </p>


                    <button
                        class="chemistry-primary-btn"
                        data-page="molecule"
                    >

                        Start Experiment

                        <span>
                            →
                        </span>

                    </button>

                </div>

            </section>


        </main>

    `;
}