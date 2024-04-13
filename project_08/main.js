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

init();

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
		
		render();
		
	})
	

	// add rim light
	let rimLight = new THREE.DirectionalLight(0xffffff, 1);
	rimLight.position.set(-1, -2, -10);
	scene.add(rimLight);
	// const rimHelper = new THREE.DirectionalLightHelper( rimLight, 5 );
	// scene.add( rimHelper );

	// add point light
	let pointLight = new THREE.PointLight("hsl(180, 50%, 60%)", 2000, 200);
	pointLight.position.set(0, 30, 0);
	scene.add(pointLight);
	const sphereSize = 5;
	const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
	scene.add( pointLightHelper );

	// indirectional light
	let directionalLight = new THREE.DirectionalLight("hsl(200,50%,50%)", 5);
	directionalLight.position.set(-0.5, 1, 0);
	scene.add(directionalLight);

}

//01. create Particle
	let positions = [];

	for (let i = 0; i < 2100; i++) {
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
		map: new THREE.TextureLoader().load("/particle/circle2.png"),
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		color: new THREE.Color(0xAEDAE6),
	});
	const particle = new THREE.Points(particlePosition, particleMaterial);
	scene.add(particle);

	// cloud particle
	let cloudPositions = [];

	for (let i = 0; i < 300; i++) {
	
		cloudPositions.push((Math.random() * 2 - 1) * 50); // x // -1 ~ 1 -> -30 ~ 30
		cloudPositions.push((Math.random() * 2 - 1) * 20); // y
		cloudPositions.push((Math.random() * 2 - 1) * 50); // z

	}

	const cloudParticlePosition = new THREE.BufferGeometry();
	cloudParticlePosition.setAttribute(
		"position",
		new THREE.BufferAttribute(new Float32Array(cloudPositions), 3)
	);

	const cloudParticleMaterial = new THREE.PointsMaterial({
		
		size: 80,
		map: new THREE.TextureLoader().load("/particle/cloud.png"),
		transparent: true,
		opacity: 0.03,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		color: new THREE.Color("hsl(200, 50%, 50%)")
	});
	const cloudParticle = new THREE.Points(cloudParticlePosition, cloudParticleMaterial);
	scene.add(cloudParticle);


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

let time = 0;

function render() {
	requestAnimationFrame(render);
	controls.update();

	
	time += 0.001;

	particle.rotation.y += 0.001;
	cloudParticle.rotation.y += 0.002;
	console.log(particlePosition);

	for (let i = 0; i < 2100; i++) {
		const yIndex = i * 3 + 1;
		particlePosition.attributes.position.array[yIndex] = 
		positions[yIndex] + 10 * Math.sin(i + time);
	} 
	particlePosition.attributes.position.needsUpdate = true;

	renderer.render(scene, camera);
}

