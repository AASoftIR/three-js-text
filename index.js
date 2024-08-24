import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
const gui = new GUI();
const colorM = "#ffffff";
const scene = new THREE.Scene();
const loader = new FontLoader();

let debuggerObj = {};
const camera = new THREE.PerspectiveCamera(75, 1200 / window.innerHeight);
window.addEventListener("keydown", (e) => {
	if (e.key === "h") {
		gui.show(gui._hidden);
	}
});

let geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
const material = new THREE.MeshBasicMaterial({
	color: colorM,
	side: THREE.DoubleSide,
});

const cube = new THREE.Mesh(geometry, material);
cube.position.set(-3, -2, 0);
// scene.add(cube);

debuggerObj.spin = () => {
	if (cube && cube.rotation) {
		gsap.to(cube.rotation, {
			y: cube.rotation.y + Math.PI * 2,
		});
	} else {
		console.error("cube or cube.rotation is null");
	}
};
let g = gui.addFolder("Cube");
g.add(cube, "visible");
g.add(cube.material, "wireframe");
g.add(cube.material, "visible");

g.add(camera.position, "x", -3, 3, 0.01);
g.add(camera.position, "y", -3, 3, 0.01);
g.add(camera.position, "z", -10, 15, 0.01);
scene.add(camera);
camera.lookAt(cube.position);
camera.position.z = 3;
camera.position.y = 0.2;
camera.position.x = 0.2;
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
});
window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
let texture = new THREE.TextureLoader().load("/static/t.jpg");
let texture2 = new THREE.TextureLoader().load("/static/t2.jpg");

loader.load("/static/f.json", (font) => {
	let Tgeometry = new TextGeometry("This is Hard!", {
		font: font,
		size: 0.5,
		depth: 0.2,
		curveSegments: 3,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 2,
		color: colorM,
	});
	// Tgeometry.computeBoundingBox();
	// Tgeometry.translate(
	// 	-(Tgeometry.boundingBox.max.x - 0.02) / 2,
	// 	-(Tgeometry.boundingBox.max.y - 0.02) / 2,
	// 	-(Tgeometry.boundingBox.max.z - 0.02) / 2
	// );
	Tgeometry.center();
	let material = new THREE.MeshMatcapMaterial({
		// color: colorM,
		// wireframe: true,
		matcap: texture,
		side: THREE.DoubleSide,
	});
	let mesh = new THREE.Mesh(Tgeometry, material);
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

	scene.add(mesh);
});
// let axis = new THREE.AxesHelper();
// scene.add(axis);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
const controls = new OrbitControls(camera, document.querySelector("#bg"));
controls.enableDamping = true;
let clock = new THREE.Clock();
function tick() {
	let elapsed = clock.getElapsedTime();

	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}
tick();
