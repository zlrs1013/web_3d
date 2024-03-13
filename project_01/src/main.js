
// import loader
// import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';


// loader an external 3D model
// const loader = new GLTFLoader();

// loader.load("./public/ship_in_clouds.glb", function(gltf){
//     scene.add(gltf.scene);
// }, undefined, function(error){
//     console.error(error);
// });

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let renderer, scene, camera, controls;

const canvas = document.createElement("canvas");
document.body.appendChild(canvas); 

renderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);

scene = new THREE.Scene();
scene.background = new THREE.Color( "rgb(157,119,110)");

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3,3,3);
// camera.lookAt(0,0,0);

controls = new OrbitControls(camera, canvas);
// controls.enableRotate = false; horizontal & vertical rotation
// controls.enableZoom
// controls.enablePan

// soft stopping
controls.enableDamping = true;

const directionalLight = new THREE.DirectionalLight(); 
directionalLight.position.set(1,2,3);
scene.add(directionalLight);

const dirHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dirHelper);

const cube_geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshPhongMaterial({color:"rgb(77,122,102)"});
const cube = new THREE.Mesh(cube_geometry, material);
scene.add(cube);



animate();


function animate(){

    // infinite loop
    requestAnimationFrame( animate );
    cube.rotation.x +=0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera)
    controls.upate();

}

init();
