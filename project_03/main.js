import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


// create canvas for scene rendering
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let camera, scene, renderer, mesh;
let originPosition;

function init(){
    renderer = new THREE.WebGLRenderer({
        canvas, 
        antialias:true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
	// renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
    );
    camera.position.set(0, 0, 0);

    // gamma
    renderer.gammaFactor = 2.2;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // add new group object
    const group = new THREE.Group();
    group.position.copy(camera.position);
    group.rotation.copy(camera.rotation);
    scene.add(group);

    group.add(camera);

    // add gltf model
    const loader = new GLTFLoader();

    loader.load("/gltf/move.glb", function(gltf){
        console.log(gltf);

        mesh = gltf.scene;
        mesh.position.set(0, 0, 0);

        const ratio = 0.1;
        mesh.scale.set(ratio, ratio, ratio);
        scene.add(mesh);

        // set defult camera position to gltf camera
        const cam = gltf.cameras[0];
        // multiply by ratio
        camera.position.set(
            cam.position.x * ratio,
            cam.position.y * ratio,
            cam.position.z * ratio,
        );
        camera.rotation.set(cam.rotation.x, cam.rotation.y, cam.rotation.z);
        originPosition = camera.position.clone();

        // change child material
        mesh.traverse((child) => {
            if (child.isMesh){
                console.log(child);

                if (child.name == "light") {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                    });
                    // double sided
                    child.material.side = THREE.DoubleSide;
                } else {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        roughness: 0.5
                    });
                }
            }
        });

        render();
    });

    // add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // add hemi light
    const hemiLight = new THREE.HemisphereLight(0x000000, 0xffffff, 0.3);
    hemiLight.position.set(1, 0, 1);
    scene.add(hemiLight);

}

function render(){
    animate();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

// window resize event
// the window interface represents a window containing a DOM document
// the document property points to the DOM document loaded in that window
window.addEventListener("resize", onWindowResize);
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// set up intereactive animation
const keyPressed = {
    forward: false,
    backward: false,
};

let speed = 5;

// add event listener
window.addEventListener("keydown", function(event){
    console.log(event.key);

    if (event.key == "w"){
        keyPressed.forward = true;
    } else if (event.key === "s"){
        keyPressed.backward = true;
    }
});

window.addEventListener("keyup", function(event){
    if (event.key == "w"){
        keyPressed.forward = false;
    } else if (event.key === "s"){
        keyPressed.backward = false;
    }
});


function animate(){
    // check key pressed
    if (keyPressed.forward) {
        camera.position.z -= speed;
    }
    if (keyPressed.backward) {
        camera.position.z += speed;
    }

    // check camera current position
    // original z position 1934
    console.log(camera.position.z);
    if (camera.position.z < -45) {
        camera.position.z = originPosition.z;
    }

    if (camera.position.z > 1974) {
        camera.position.z = 1974;
    }
}


init();