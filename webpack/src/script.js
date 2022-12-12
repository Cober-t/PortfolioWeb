import './style.css'
import * as THREE from './three.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

// +++++++++++++++++++++++++++++++++++++++
// +++  Cursor Data
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width  - 0.5;
    cursor.y = - (event.clientY / sizes.height - 0.5);
});


// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
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

// +++++++++++++++++++++++++++++++++++++++
// +++  Renderer
const sizes = {
    width: 800,
    height: 600
}
const aspectRatio = sizes.width / sizes.height

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// +++++++++++++++++++++++++++++++++++++++
// +++  Camera
const camera   = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 1, 1000);
// const camera   = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 1000);
// camera.position.set(1, 1, 5);
camera.position.z = 2; 
camera.lookAt(cube1.position);
// camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Fullscreen
window.addEventListener('dblclick', () => 
{
    // for Safari browser
    const fullScreenElement = document.fullscreenElement || document.webkiFullscreenElement;
    if(!fullScreenElement){
        if(canvas.requestFullscreen)
            canvas.requestFullscreen()
        else if(canvas.webkiFullscreenElement)
            canvas.webkiFullscreenElement();
    }
    else {
        if(document.exitFullscreen)
            document.exitFullscreen();
        else if (document.webkiFullscreenElement)
            document.webkiFullscreenElement();
    }

})

// Resizing
window.addEventListener('resize', () => 
{
    // Update sizes
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix();

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
window.dispatchEvent(new CustomEvent('resize'));

// +++++++++++++++++++++++++++++++++++++++
// +++  Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// +++++++++++++++++++++++++++++++++++++++
// +++  Controls
const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.target.y = 1;

// +++++++++++++++++++++++++++++++++++++++
// +++  Animations
//let time = Date.now();
const clock = new THREE.Clock();
gsap.to(cube2.position, { duration: 1, delay: 1, x: -4 } );
gsap.to(cube2.position, { duration: 1, delay: 2, x: -2 } );

const tick = () => {
    
    // UPDATE Time
    const elapsedTime = clock.getElapsedTime();
    //const currentTime = Date.now();
    //const deltaTime = currentTime - time
    //time = currentTime;

    // UPDATE Render
    //camera.position.set(cursor.x * 3, cursor.y * 3, camera.position.z);
    // rotate around the cube
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(cube1.position)
    // Update objects
    //cube1.rotation.y = elapsedTime * Math.PI * 2;
    //cube2.position.y = Math.sin(elapsedTime);

    // UPDATE Controls
    controls.update();

    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();