import * as THREE from "three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader"


// create canvas for scene rendering
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);


let camera, scene, renderer, mixer, gltfObject;
let rocket;
let paintObject;
let hemiLight;
let actions = {};

function init() {
	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		2000
	);
	camera.position.set(100, 100, 100);
	camera.lookAt(-20, 0, -20);

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	// tone mapping
	renderer.toneMapping = THREE.ACESFilmicToneMapping;

	window.addEventListener("resize", onWindowResize);

	// light
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(-0.5, 0.5, 0.5);
	light.castShadow = true;
	light.shadow.camera.top = 180;
	light.shadow.camera.bottom = -100;
	light.shadow.camera.left = -120;
	light.shadow.camera.right = 120;

	// soft shadow
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 500;

	scene.add(light);

	// hemi light
	hemiLight = new THREE.HemisphereLight(0xffffff, 0x555555, 1);
	hemiLight.position.set(0, -1, 0);
	scene.add(hemiLight);

	// play gltf animation when click model
	const loader = new GLTFLoader();
	loader.load("/gltf/click.glb", function (gltf) {
		const model = gltf.scene;

        console.log(model);

		model.position.set(0, 0, 0);
		model.scale.set(0.1, 0.1, 0.1);
		scene.add(model);
		mixer = new THREE.AnimationMixer(model);

        // Searches through an object and its children, starting with the 
        // object itself, and returns the first with a matching name.
		rocket = model.getObjectByName("rocket");
		paintObject = model.getObjectByName("change");

		// change child material
		model.traverse(function (child) {
			if (child.isMesh) {
				child.material = new THREE.MeshStandardMaterial({
					color: child.material.color,
					roughness: 0.3,
				});
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		if (gltf.animations.length > 0) {
			let clips = [];

			console.log("original animation clips", gltf.animations);
			// split clips by names
			gltf.animations[0].tracks.forEach((track) => {
				const clip = clips.find(
					(clip) => clip.name == track.name.split(".")[0]
				);
				// if clip exists
				if (clip) {
					clip.tracks.push(track);
				} else {
					//if not, make clip with their name
					const clip = new THREE.AnimationClip(track.name.split(".")[0], -1, [
						track,
					]);
					clips.push(clip);
				}
			});

			// split animation clips
			gltf.animations = clips;

			// link to actions
			clips.forEach((clip) => {
				actions[clip.name] = mixer.clipAction(clip);
				actions[clip.name].loop = THREE.LoopOnce;
			});

			// check animations
			console.log("Animations : ", actions);
		}

		gltfObject = gltf;

		render();
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	animate();
}


const raycaster= new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event)=> {
    
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( scene.children );

    // console.log(intersects[0]);

    if(intersects[0]) {
        const buttonColor = intersects[0].object.material.color;
        const rocketColor = scene.getObjectByName("change");
        
        const targetAnimation = actions[intersects[0].object.name];
        if (targetAnimation) {
            rocketColor.material.color = buttonColor;
            scene.background = buttonColor;
            targetAnimation.reset();
            targetAnimation.play();
        }
    }

});

const clock = new THREE.Clock();

function animate() {
    mixer.update(clock.getDelta());
    rocket.rotation.y += 0.01;
}

init();
