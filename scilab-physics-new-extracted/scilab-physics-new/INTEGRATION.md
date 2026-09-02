# SciLab Physics replacement

Replace the old physics scene files with these five new simulators:

- LensOptics.js
- MagneticInduction.js
- ElectricMotor.js
- SolarSystem.js
- VirtualPhysicsLab.js

Add to main.js:

import "./styles/physics.css";
import { createPhysicsSimulationPage, cleanupPhysicsSimulation } from "./pages/PhysicsSimulation.js";

Routes:

registerRoute("physics-lens", () => createPhysicsSimulationPage("lens"));
registerRoute("physics-magnetic", () => createPhysicsSimulationPage("magnetic"));
registerRoute("physics-motor", () => createPhysicsSimulationPage("motor"));
registerRoute("physics-solar-system", () => createPhysicsSimulationPage("solar"));
registerRoute("physics-virtual-lab", () => createPhysicsSimulationPage("virtual"));

Initialize these routes with cleanupPhysicsSimulation().
