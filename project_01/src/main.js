import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

let renderer, scene, camera, controls;

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

function init() {

	scene = new THREE.Scene();

    const loader = new RGBELoader();
	loader.load("./hdr/sky.hdr", function(texture) {
		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.background = texture;
		scene.environment = texture;
	});

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.VSMShadowMap;
    
	camera = new THREE.PerspectiveCamera();
	camera.fov = 32;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	camera.position.set(0, 0, 10);

	controls = new OrbitControls(camera, canvas);

	const geometry = new THREE.SphereGeometry();
	const material = new THREE.MeshStandardMaterial({
		color: new THREE.Color("#ffffff"),
		roughness: 0,
		metalness: 1,
        emissive: 0xffffff,
        emissiveIntensity: 0.1
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	const directionalLight = new THREE.DirectionalLight(
		new THREE.Color("white"),
		0.75
	);
	directionalLight.position.set(2, 2, 2);
	directionalLight.castShadow = true;
	directionalLight.shadow.blurSamples = 30;
	directionalLight.shadow.radius = 12;
	// scene.add(directionalLight);

	const dirHelper = new THREE.DirectionalLightHelper(directionalLight);
	// scene.add(dirHelper);

	const pointLight = new THREE.PointLight(0xffffff, 0.1);
	pointLight.position.set(2, 0, 2);
	// scene.add(pointLight);

	const pointHelper = new THREE.PointLightHelper(pointLight);
	// scene.add(pointHelper);

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	// scene.add(ambientLight);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.25);
	// scene.add(hemisphereLight);

	const hemiHelper = new THREE.HemisphereLightHelper(hemisphereLight);
	// scene.add(hemiHelper);

	const planeGeo = new THREE.PlaneGeometry(10, 10);
	const plane = new THREE.Mesh(planeGeo, material);
    plane.material.emissiveIntensity = 0;
	plane.position.set(0, -1, 0);
	plane.rotation.set(Math.PI * -0.5, 0, 0);
	scene.add(plane);

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	plane.castShadow = true;
	plane.receiveShadow = true;

	render();
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	controls.update();
}

// window resize event
window.addEventListener("resize", onWindowResize);
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
