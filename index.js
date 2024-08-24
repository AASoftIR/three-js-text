import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const gui = new GUI();
const scene = new THREE.Scene();
const loader = new FontLoader();

const camera = new THREE.PerspectiveCamera(75, 1200 / window.innerHeight);
camera.position.z = 3;
camera.position.y = 0.2;
camera.position.x = 0.2;

scene.add(camera);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Handle window resize
window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

// Fullscreen on double-click
window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

// Load textures
let texture = new THREE.TextureLoader().load("/static/t.jpg");
let texture2 = new THREE.TextureLoader().load("/static/t2.jpg");

// Text properties object to hold dynamic parameters
const textProperties = {
	text: "This is Hard",
	size: 0.5,
	height: 0.2,
	bevelThickness: 0.03,
	bevelSize: 0.02,
	bevelEnabled: true,
	color: "#ffffff",
};

let textMesh; // To store the text mesh globally

// Load font and create text
loader.load("/static/f.json", (font) => {
	function createText() {
		if (textMesh) {
			scene.remove(textMesh); // Remove the previous text mesh
		}

		let Tgeometry = new TextGeometry(textProperties.text, {
			font: font,
			size: textProperties.size,
			height: textProperties.height,
			curveSegments: 3,
			bevelEnabled: textProperties.bevelEnabled,
			bevelThickness: textProperties.bevelThickness,
			bevelSize: textProperties.bevelSize,
			bevelOffset: 0,
			bevelSegments: 2,
		});

		Tgeometry.center();
		let textMaterial = new THREE.MeshMatcapMaterial({
			matcap: texture,
			side: THREE.DoubleSide,
			color: new THREE.Color(textProperties.color), // Updated to use the color from GUI
		});

		textMesh = new THREE.Mesh(Tgeometry, textMaterial);
		scene.add(textMesh);
	}

	// Initial text creation
	createText();

	// GUI controls for text properties
	const textFolder = gui.addFolder("Text");
	gui.hide();
	textFolder.add(textProperties, "text").onChange(createText);
	textFolder.add(textProperties, "size", 0.1, 2, 0.1).onChange(createText);
	textFolder.add(textProperties, "height", 0.1, 1, 0.01).onChange(createText);
	textFolder.add(textProperties, "bevelEnabled").onChange(createText);
	textFolder
		.add(textProperties, "bevelThickness", 0.01, 0.1, 0.01)
		.onChange(createText);
	textFolder
		.add(textProperties, "bevelSize", 0.01, 0.1, 0.01)
		.onChange(createText);
	textFolder.addColor(textProperties, "color").onChange(createText);

	// Create some donuts for decoration
	let donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
	let donutMaterial = new THREE.MeshMatcapMaterial({
		matcap: texture2,
	});
	for (let i = 0; i < 100; i++) {
		let donut = new THREE.Mesh(donutGeometry, donutMaterial);
		donut.position.set(
			Math.random() * 10 - 5,
			Math.random() * 10 - 5,
			Math.random() * 10 - 5
		);
		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;
		let scale = Math.random();
		donut.scale.set(scale, scale, scale);
		scene.add(donut);
	}
});

const controls = new OrbitControls(camera, document.querySelector("#bg"));
controls.enableDamping = true;
let clock = new THREE.Clock();

// Animation loop
function tick() {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}

tick();
