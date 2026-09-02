SCILAB REACTION LAB UPGRADE
===========================

This package upgrades the current reaction simulator from the existing
single H2 + O2 reaction to 10 selectable reactions.

Files to replace:
1. src/simulations/reaction/data/reactions.js
2. src/simulations/reaction/data/molecules.js
3. src/simulations/reaction/engine/CollisionEngine.js
4. src/simulations/reaction/engine/ReactionEngine.js
5. src/simulations/reaction/core/ReactionState.js
6. src/simulations/reaction/core/ReactionSimulator.js
7. src/simulations/reaction/scene/MoleculeRenderer.js
8. src/simulations/reaction/systems/MoleculeSystem.js

Then open:
src/simulations/reaction/REACTION_UI_REPLACEMENT.txt

Apply the main.js replacement instructions there.

Finally append the CSS section from that file to:
src/style.css

The package deliberately does not replace your complete main.js, because
your main.js also controls Home, Physics, Chemistry, Biology, Atom,
Molecule Builder and pH routes.

After replacing the files:
- stop Vite with Ctrl+C
- run npm run dev again
- open #reaction
- select a reaction
- choose a temperature
- press Start

If Vite reports a new import error, do not create a random file.
Check the exact path in the error against the paths in this package.
