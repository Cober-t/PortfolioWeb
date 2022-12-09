//////////////////////////////
//+++ Comment when commit ++//
import './style.css'
import * as THREE from './three.js'
import gsap from 'gsap'

// Scene
const scene = new THREE.Scene();
const group = new THREE.Group();
scene.add(group);
// Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color:'red' });
const cube1    = new THREE.Mesh(geometry, material);
group.add(cube1);
// Green Cube
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color:'blue'})
)
cube2.position.set(-2, 0, 0);
group.add(cube2)
group.scale.set(1, 1, 1)

// Camera
const sizes = {
    width: 800,
    height: 600
}
const camera   = new THREE.PerspectiveCamera(55, sizes.width / sizes.height);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
camera.position.set(1, 1, 5);
camera.lookAt(cube2.position);
//camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Renderer
const canvas = document.querySelector('.webgl');
console.log(canvas)
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

//let time = Date.now();
const clock = new THREE.Clock();
gsap.to(cube2.position, { duration: 1, delay: 1, x: -4 } );
gsap.to(cube2.position, { duration: 1, delay: 2, x: -2 } );
// Animations
const tick = () => {
    
    // Time
    const elapsedTime = clock.getElapsedTime();
    //const currentTime = Date.now();
    //const deltaTime = currentTime - time
    //time = currentTime;
    // Update objects
    cube1.rotation.y = elapsedTime * Math.PI * 2;
    cube2.position.y = Math.sin(elapsedTime);
    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();