import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// create canvas for scene rendering
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// initialize variables
let camera, scene, renderer, controls;
let model;

// colors
const dark = new THREE.Color("hsl(280,100%,0%)");

function init() {

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas: canvas
	});

	camera = new THREE.PerspectiveCamera(
		30,
		window.innerWidth / window.innerHeight,
		1,
		3000
	);
	camera.position.set(30, 0, 30);
	
	scene = new THREE.Scene();
	scene.background = dark;
	scene.fog = new THREE.Fog(dark, 40, 80);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;

	// attach camera to orbit controls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.enableDamping = true;

	// controls distance is 50
	controls.minDistance = 50;
	controls.maxDistance = 50;

	window.addEventListener("resize", onWindowResize);

	// gltf load
	let loader = new GLTFLoader();

	loader.load("/gltf/particle.glb", function(gltf) {
		model = gltf.scene;
		const ratio = 0.15;
		model.scale.set(ratio, ratio, ratio);
		model.position.set(0, -40, 0);
		model.rotation.set(0, 0, 0);
		scene.add(model);

		// change material
		model.traverse(function (child){
			if (child.isMesh) {
				// physical material with bump map
				let mat = new THREE.MeshPhysicalMaterial({
					color: 0xffffff,
					roughness: 0.8,
					bumpMap: child.material.normalMap,
					bumpScale: 0.1,
				});
				child.material = mat;
			}
		});

		
	})
	render();

	// add rim light
	let rimLight = new THREE.DirectionalLight(0xffffff, 3);
	rimLight.position.set(-0.1, 0, -1);
	scene.add(rimLight);

	// add point light
	let pointLight = new THREE.PointLight("hsl(180, 50%, 60%)", 2000, 200);
	pointLight.position.set(0, 30, 0);
	scene.add(pointLight);

	// indirectional light
	let directionalLight = new THREE.DirectionalLight("hsl(200,50%,50%)", 5);
	directionalLight.position.set(-0.5, 1, 0);
	scene.add(directionalLight);


	//01. create Particle
	let positions = [];

	for (let i = 0; i < 1000; i++) {
		positions.push((Math.random() * 2 - 1) * 30); // x // -1 ~ 1 -> -30 ~ 30
		positions.push((Math.random() * 2 - 1) * 30); // y
		positions.push((Math.random() * 2 - 1) * 30); // z
	}

	const particlePosition = new THREE.BufferGeometry();
	particlePosition.setAttribute(
		"position",
		new THREE.BufferAttribute(new Float32Array(positions), 3)
	);

	const particleMaterial = new THREE.PointsMaterial({
		size: 0.5,
		map: new THREE.TextureLoader().load("/particle/circle.png"),
		color: new THREE.Color("hsl(200,50%,70%)"),
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
	});
	const particle = new THREE.Points(particlePosition, particleMaterial);
	scene.add(particle);
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
	requestAnimationFrame(render);
	controls.update();

	//02. move particles

	renderer.render(scene, camera);
}

init();