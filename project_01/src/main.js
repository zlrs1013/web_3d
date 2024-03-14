
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.autoUpdate = true;
renderer.shadowMap.type = THREE.VSMShadowMap;


// scene
scene = new THREE.Scene();
scene.background = new THREE.Color( "rgb(157, 119, 110)");


// camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3,3,3);
// camera.lookAt(0,0,0);
// const cameraHelper = new THREE.CameraHelper( camera );
// scene.add( cameraHelper );


// object
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({color: 0x0ba29a});
const cube = new THREE.Mesh(cubeGeometry, material);
cube.castShadow = true;
cube.receiveShadow = false;
scene.add(cube);


// plane
// const planeGeometry = new THREE.PlaneGeometry(10, 10);
// const planeMaterial = new THREE.MeshBasicMaterial({
//     color: 0xffffff
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.position.set(0, -10, 10);
// plane.rotation.set(Math.PI * -0.5, 0, 0);
// scene.add(plane);

const geometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xf3b686, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, planeMaterial );
plane.position.set(0, -0.6, 0);
plane.rotation.set(Math.PI * 0.5, 0, 0);
plane.receiveShadow = true;
plane.castShadow = false;
scene.add( plane );


// view control
controls = new OrbitControls(camera, canvas);
// controls.enableRotate = false; horizontal & vertical rotation
// controls.enableZoom
// controls.enablePan
// soft stopping
controls.enableDamping = true;


// directional light
const directionalLight = new THREE.DirectionalLight(); 
directionalLight.position.set(1,1,1);
directionalLight.castShadow = true;
directionalLight.shadow.blurSamples = 10;
directionalLight.shadow.radius = 12;
scene.add(directionalLight);
const dirHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dirHelper);


// point light
const pointLight = new THREE.PointLight();
pointLight.position.set( -1, -1, -1 );
// scene.add( pointLight );
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
    skyColor: new THREE.Color("white"),
    groundColor: new THREE.Color("black"),
    intensity:1
});
const helper = new THREE.HemisphereLightHelper( hemisphereLight, 5);
// scene.add(hemisphereLight);
// scene.add( helper );



function animate(){

    // infinite loop
    requestAnimationFrame( animate );
    // cube.rotation.x +=0.01;
    // cube.rotation.y += 0.01;
    
    renderer.render(scene, camera)
    controls.upate();

}


animate();
