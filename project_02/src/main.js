import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let renderer, scene, camera, controls, gltfModel, mixer;

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

function init() {
	renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.shadowMap.enabled = true;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		32,
		window.innerWidth / window.innerHeight
	);
	camera.position.set(0, 0, 30);
	controls = new OrbitControls(camera, canvas);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(10, 10, 10);
	scene.add(directionalLight);

	directionalLight.castShadow = true;
	// increase the resolution of the shadow map generated 
	directionalLight.shadow.mapSize.width = 2048;
	directionalLight.shadow.mapSize.height = 2048;
	directionalLight.shadow.radius = 8;

	const sphere = new THREE.SphereGeometry();
	const material = new THREE.MeshStandardMaterial();
	const mesh = new THREE.Mesh(sphere, material);
	// scene.add(mesh);

	// start gltf load (type below)
	const loader = new GLTFLoader();
	loader.load("gltf/rocket.glb", function(gltf) {
		const model = gltf.scene;
		console.log(gltf);

		model.traverse((obj) => {
			if (obj.isMesh) {
				console.log(obj);

				obj.castShadow = true;
				obj.receiveShadow = true;
				obj.material.metalness = 0;
			}
		}, undefined, function(error){
			console.log(error);
		});

		gltfModel = model;
		scene.add(model);

		mixer = new THREE.AnimationMixer(model);
		gltf.animations.forEach((clip) => {
			mixer.clipAction(clip).play();
		});

		render();
	});
	// end gltf load
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	controls.update();

	animate();
}

function animate() {
	if (mixer) {
		mixer.update(1 / 60);
	}
	// gltfModel.rotation.y += 0.01; //gltfModel.rotation.y = gltfModel.rotation.y + 0.1
}

init();
