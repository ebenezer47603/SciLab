export function animate(renderer, scene, camera, update) {

    function loop() {

        requestAnimationFrame(loop);

        if (update) {
            update();
        }

        renderer.render(scene, camera);

    }

    loop();

}