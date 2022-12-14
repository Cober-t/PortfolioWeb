import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DirectionalLight, DirectionalLightHelper, Group, MeshStandardMaterial, PointLight, RectAreaLight, SpotLight, SpotLightShadow } from 'three/src/Three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper' 
import gsap from 'gsap'

console.time('LOAD');

// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
const scene = new THREE.Scene();

// +++++++++++++++++++++++++++++++++++++++
// +++  Debug
const gui = new dat.GUI();

const debugObject =
{
    color: '#00ffff',
    spin: () =>
    {
        gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI})
    },
    fullscreen: () =>
    {
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
    },
    visible: true
}
gui.add(debugObject, 'fullscreen');
window.addEventListener('dblclick', () => 
{
    if(document.fullscreenElement || document.webkiFullscreenElement)
        debugObject.fullscreen();
    else
        dat.GUI.toggleHide();
});

// +++++++++++++++++++++++++++++++++++++++
// +++  Geometry 
const group = new Group();
const sphere1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial( {color: 'red'} )
) 
const sphere2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial( {color: 'red'} )
) 
const sphere3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial( {color: 'red'} )
) 
sphere1.position.x = -1.5
sphere3.position.x =  1.5
group.add(sphere1, sphere2, sphere3);
scene.add(group);

// +++++++++++++++++++++++++++++++++++++++
// +++  Raycaster
let currentIntersect = null;
const raycaster    = new THREE.Raycaster();

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
const camera   = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5
scene.add(camera);

// +++++++++++++++++++++++++++++++++++++++
// +++  Resizing
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
// +++  Mouse
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
})

window.addEventListener('click', (event) =>
{
    if(currentIntersect !== null) {
        switch(currentIntersect.object) {
            case sphere1: currentIntersect.object.material.color.set('#00ff00');
                break;
            case sphere2: currentIntersect.object.material.color.set('#00fff0');
                break;
            case sphere3: currentIntersect.object.material.color.set('#ffff00');
                break;
        }
    }
})

// +++++++++++++++++++++++++++++++++++++++
// +++  Controls
const controls = new OrbitControls(camera, canvas);

// +++++++++++++++++++++++++++++++++++++++
// +++  Time
const clock = new THREE.Clock();

const tick = () => {
    
    // UPDATE Time
    const elapsedTime = clock.getElapsedTime();

    // UPDATE Controls
    controls.update();

    // Animate objects
    sphere1.position.y  = Math.sin(elapsedTime * 0.3)  * 1.5;
    sphere2.position.y  = Math.sin(elapsedTime * 0.8)  * 1.5;
    sphere3.position.y  = Math.sin(elapsedTime * 0.45) * 1.5;

    // Cast a ray
    const objectsToTest = [sphere1, sphere2, sphere3];

    if(currentIntersect == null){
        for(const object of objectsToTest) 
            object.material.color.set('#ff0000');
    }

    // Intersect with raycast
    /*
    const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(1, 0, 0)
    rayDirection.normalize()  // Is a good practice to keep normalize

    const intersetcs = raycaster.intersectObjects(objectsToTest);
    raycaster.set(rayOrigin, rayDirection);

    for(const intersect of intersetcs) 
        intersect.object.material.color.set('#0000ff');
    */

    // Intersect with mouse
    const intersects = raycaster.intersectObjects(objectsToTest);
    raycaster.setFromCamera(mouse, camera);

    if(intersects.length)
    {
        if(currentIntersect === null)
            console.log('mouse enter');
        for(const intersect of intersects)
            currentIntersect = intersect;
    }
    else
    {
        if(currentIntersect !== null)
            console.log('mouse leave');
        currentIntersect = null;
    }


    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

console.timeEnd('LOAD');