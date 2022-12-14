import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DirectionalLightHelper, MeshStandardMaterial, PointLight, RectAreaLight, SpotLightShadow } from 'three/src/Three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper' 
import gsap from 'gsap'

// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
const scene = new THREE.Scene();

// +++++++++++++++++++++++++++++++++++++++
// +++  Debug
const gui = new dat.GUI();
gui.hide();
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

// +++++++++++++++++++++++++++++++++++++++
// +++  Lights
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.25);
scene.add(ambientLight)
// Directional light
const dirLight = new THREE.DirectionalLight('#00ff00', 0.6);
dirLight.position.set(2.5, 0.25, 0);
scene.add(dirLight)
// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
scene.add(hemisphereLight);
// Point light
const pointLight = new THREE.PointLight('#0005ff', 0.35);
pointLight.position.set(-0.65, -0.65, 1.5);
scene.add(pointLight);
gui.add(pointLight.position, 'x').min(-3).max(3).step(0.01);
gui.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
gui.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
gui.add(pointLight, 'intensity').min(0).max(1).step(0.01);
gui.add(pointLight, 'distance').min(1).max(10).step(0.01);
gui.add(pointLight, 'decay').min(1).max(10).step(0.01);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
gui.addColor(debugObject, 'color')
.onChange(() => {
    pointLight.color.set(debugObject.color);
})
// RectArea light (high cost)
const rectAreaLight = new THREE.RectAreaLight(0xf000ff, 1, 3, 1.5);
rectAreaLight.position.set(1, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);
// Spot light (high cost)
const spotLight = new THREE.SpotLight(0xffff00, 0.5, 6, Math.PI * 0.1, 0.25, 1);
scene.add(spotLight);
spotLight.position.x = -1;
spotLight.target.position.x = -0.25;
scene.add(spotLight.target);

// Light helpers
const groupLightHelpers = new THREE.Group();
const directionalLightHelper = new THREE.DirectionalLightHelper(dirLight, 0.1);
scene.add(directionalLightHelper)
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1);
scene.add(hemisphereLightHelper);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
scene.add(pointLightHelper);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
window.requestAnimationFrame(() =>
{
    spotLightHelper.update();
})
scene.add(spotLightHelper);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

groupLightHelpers.add(directionalLightHelper, hemisphereLightHelper, pointLightHelper, spotLightHelper, rectAreaLightHelper);
scene.add(groupLightHelpers);
gui.add(groupLightHelpers, 'visible');

// +++++++++++++++++++++++++++++++++++++++
// +++  Geometry
const group = new THREE.Group();
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.2;
gui.add(material, 'roughness').min(0).max(1).step(0.01);
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 62, 62),
    material
)
sphere.position.x = -1.5
group.add(sphere);
    
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.4, 0.3, 64, 128),
    material
)
torus.position.x = 1.5

group.add(torus);

const planeMat = new MeshStandardMaterial();
planeMat.side = THREE.DoubleSide;
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    planeMat
)
group.add(plane);
        
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    material
)
floor.scale.set(5, 5)
floor.position.y = -1
floor.rotation.x = -Math.PI/2;
group.add(floor);

scene.add(group);
gui.add(group, 'visible');

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
// +++  Controls
const controls = new OrbitControls(camera, canvas);

// +++++++++++++++++++++++++++++++++++++++
// +++  Time
const clock = new THREE.Clock();

const tick = () => {
    
    // UPDATE Time
    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.y = 0.3 * elapsedTime
    torus.rotation.y = 0.3 * elapsedTime
    plane.rotation.y = 0.3 * elapsedTime

    sphere.rotation.x = 0.4 * elapsedTime
    torus.rotation.x = 0.4 * elapsedTime
    plane.rotation.x = 0.4 * elapsedTime

    // UPDATE Controls
    controls.update();

    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();