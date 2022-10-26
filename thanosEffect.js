(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()


var times = [];
var fps;

function refreshLoop() {
  window.requestAnimationFrame(function() {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    console.log(fps);
    refreshLoop();
  });
}

refreshLoop();

var scene, sceneLight, pointLight, cam, renderer, clock, portalParticles = [], smokeParticles = [];

function initScene() {
    scene = new THREE.Scene();

    sceneLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sceneLight.position.set(0, 0, 1);
    scene.add(sceneLight);

    pointLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
    pointLight.position.set(0, 0, 250);
    scene.add(pointLight);

    cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    cam.position.z = 1200;   // distance of camera from objects
    scene.add(cam);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    particleSetup();
}
function particleSetup() {
    let loader = new THREE.TextureLoader();

    loader.load("smoke3.png", function (texture) {
        portalGeo = new THREE.PlaneBufferGeometry(350, 350);
        portalMaterial = new THREE.MeshStandardMaterial({
            map: texture,          // smoke image
            transparent: true      // background color is visible
        });
        smokeGeo = new THREE.PlaneBufferGeometry(1000, 1000);
        smokeMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true
        });

        for (let p = 1200; p > 0; p--) {
            let particle = new THREE.Mesh(portalGeo, portalMaterial);
            particle.position.set(                                       // conical sphere equation x = trcos(at) y = trsin(at) z = at
                0.5 * p * Math.cos((4 * p * Math.PI) / 180),
                0.5 * p * Math.sin((4 * p * Math.PI) / 180),
                0.1 * p
            );
            particle.rotation.z = Math.random() * 360;
            portalParticles.push(particle);
            scene.add(particle);
        }

        for (let i = 0; i < 100; i++) {
            let particle = new THREE.Mesh(smokeGeo, smokeMaterial);
            particle.position.set(
                Math.random() * 1000 - 500 ,                      // outer somke equation
                Math.random() * 1000 - 500,
            );
            particle.rotation.z = Math.random() * 360;
            particle.material.opacity = 0.6;
            smokeParticles.push(particle);
            scene.add(particle);
        }
        clock = new THREE.Clock();
        animate();

    });
}
function animate() {
    let timer = clock.getDelta();
    portalParticles.forEach(i => {
        i.rotation.z -= timer * 1.5;
    });
    smokeParticles.forEach(i => {
        i.rotation.z -= timer * 0.2;
    });
    if (Math.random() > 0.9) {
        pointLight.power =  350 + Math.random() * 500;
    }
    // console.log(timer);
    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}
initScene();