
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


// canvas
const canvas = document.createElement("canvas");
document.body.appendChild(canvas); 


// renderer
renderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);


// scene
scene = new THREE.Scene();
scene.background = new THREE.Color( "rgb(157, 119, 110)");


// camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3,3,3);
// camera.lookAt(0,0,0);


// object
const cube_geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshPhongMaterial({color:"rgb(77, 122, 102)"});
const cube = new THREE.Mesh(cube_geometry, material);
scene.add(cube);


// view control
controls = new OrbitControls(camera, canvas);
// controls.enableRotate = false; horizontal & vertical rotation
// controls.enableZoom
// controls.enablePan
// soft stopping
controls.enableDamping = true;


// directional light
const directionalLight = new THREE.DirectionalLight(); 
directionalLight.position.set(2,2,2);
scene.add(directionalLight);
const dirHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dirHelper);


// point light
const pointLight = new THREE.PointLight();
pointLight.position.set( -1, -1, -1 );
scene.add( pointLight );
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );


// ambient light
const ambientLight = new THREE.AmbientLight({
    color: 0xffffff,
    intensity:0.1
});
// scene.add(ambientLight);


// hemisphere light
const hemisphereLight = new THREE.HemisphereLight({
    groundColor: 0x000000,
    skyColor: 0xffffff,
    intensity:0.5

});
const helper = new THREE.HemisphereLightHelper( hemisphereLight, 5 );
scene.add(hemisphereLight);
scene.add( helper );



function animate(){

    // infinite loop
    requestAnimationFrame( animate );
    cube.rotation.x +=0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera)
    controls.upate();

}


animate();
