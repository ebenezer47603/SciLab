import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createScene } from "./scene.js";
import { createCamera } from "./camera.js";
import { createRenderer } from "./renderer.js";
import { addLights } from "./lights.js";
import { animate } from "./animation.js";

import { updateAtom } from "../simulations/atom/AtomScene.js";


/*
|--------------------------------------------------------------------------
| SciLab 3D Engine
|--------------------------------------------------------------------------
| 
| This engine is used by:
|
| - Atom Simulator
| - Engine Test
|
| Molecule Builder has its own 3D engine.
|
|--------------------------------------------------------------------------
*/


export function createEngine(container) {

    /*
    |--------------------------------------------------------------------------
    | Scene
    |--------------------------------------------------------------------------
    */

    const scene =
        createScene();


    /*
    |--------------------------------------------------------------------------
    | Camera
    |--------------------------------------------------------------------------
    */

    const camera =
        createCamera(
            container
        );


    /*
    |--------------------------------------------------------------------------
    | Renderer
    |--------------------------------------------------------------------------
    */

    const renderer =
        createRenderer(
            container
        );


    /*
    |--------------------------------------------------------------------------
    | Orbit Controls
    |--------------------------------------------------------------------------
    */

    const controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.08;


    controls.enableZoom =
        true;


    controls.enablePan =
        true;


    controls.rotateSpeed =
        0.8;


    controls.zoomSpeed =
        1.0;


    /*
    |--------------------------------------------------------------------------
    | Lights
    |--------------------------------------------------------------------------
    */

    addLights(
        scene
    );


    /*
    |--------------------------------------------------------------------------
    | Animation
    |--------------------------------------------------------------------------
    */

    animate(

        renderer,

        scene,

        camera,

        () => {

            /*
            | Update camera controls
            */

            controls.update();


            /*
            | Update Atom Simulator
            */

            updateAtom();

        }

    );


    /*
    |--------------------------------------------------------------------------
    | Return engine
    |--------------------------------------------------------------------------
    */

    return {

        scene,

        camera,

        renderer,

        controls

    };

}