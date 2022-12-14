import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DirectionalLight, DirectionalLightHelper, MeshStandardMaterial, PointLight, RectAreaLight, SpotLight, SpotLightShadow } from 'three/src/Three'
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
// +++  Lights
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.25);
scene.add(ambientLight)
// Directional light
const dirLight = new THREE.DirectionalLight('#ff0000', 0.4);
dirLight.position.set(2.5, 2.5, 0);
scene.add(dirLight)
// Hemisphere light
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
// scene.add(hemisphereLight);
// Point light
const pointLight = new THREE.PointLight('#0000ff', 0.35);
pointLight.position.set(-0.82, 1.6, -0.82);
pointLight.distance = 3;
pointLight.decay = 0.5;
scene.add(pointLight);
gui.add(pointLight.position, 'x').min(-3).max(3).step(0.01);
gui.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
gui.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
gui.add(pointLight, 'intensity').min(0).max(1).step(0.01);
gui.add(pointLight, 'distance').min(0).max(10).step(0.01);
gui.add(pointLight, 'decay').min(0).max(1).step(0.01);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
gui.addColor(debugObject, 'color')
.onChange(() => {
    pointLight.color.set(debugObject.color);
})
// RectArea light (high cost)
const rectAreaLight = new THREE.RectAreaLight(0xf000ff, 1, 2, 1);
rectAreaLight.position.set(1, -0.4, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);
// Spot light (high cost)
const spotLight = new THREE.SpotLight(0xffff00, 0.5, 6, Math.PI * 0.1, 0.25, 1);
scene.add(spotLight);
spotLight.position.x = -1;
spotLight.target.position.x = -0.25;
scene.add(spotLight.target);

// Shadows
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.far = 6.5;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
// dirLight.shadow.radius = 5;
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.camera.far = 3;
pointLight.shadow.camera.near = 1;

spotLight.castShadow = true;
spotLight.shadow.mapSize.set(1024, 1024);
spotLight.shadow.camera.far = 3;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.fov = 30;

// Light helpers
const groupLightHelpers = new THREE.Group();
const directionalLightHelper = new THREE.DirectionalLightHelper(dirLight, 0.1);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
window.requestAnimationFrame(() =>
{
    spotLightHelper.update();
})
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// Camera helpers
// const directionalLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);

groupLightHelpers.add(  directionalLightHelper, 
                        // hemisphereLightHelper, 
                        pointLightHelper, 
                        spotLightHelper, 
                        rectAreaLightHelper,
                        //directionalLightCameraHelper,
                        //pointLightCameraHelper,
                        // spotLightCameraHelper
                     );
scene.add(groupLightHelpers);
gui.add(groupLightHelpers, 'visible');

// +++++++++++++++++++++++++++++++++++++++
// +++  Geometry
const group = new THREE.Group();
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.2;
gui.add(material, 'roughness').min(0).max(1).step(0.01);
// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 62, 62),
    material
)
sphere.position.x = -1.5
sphere.castShadow = true;
sphere.receiveShadow = true;
group.add(sphere);
// Torus
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.4, 0.3, 64, 128),
    material
)
torus.position.x = 1.5
torus.castShadow = true;
torus.receiveShadow = true;
group.add(torus);
// Plane
const planeMat = new MeshStandardMaterial();
planeMat.roughness = 0.2;
// planeMat.side = THREE.DoubleSide;
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    planeMat
)
plane.castShadow = true;
plane.receiveShadow = true;
group.add(plane);
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    material
)
floor.scale.set(5, 5)
floor.position.y = -1
floor.rotation.x = -Math.PI/2;
floor.castShadow = true;
floor.receiveShadow = true;
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
// Shadows
renderer.shadowMap.enabled = true;
// renderer.shadow.type = THREE.BasicShadowMap;
renderer.shadowMap.type = THREE.PCFShadowMap; // Radius property doeesn't work here
// renderer.shadow.type = THREE.PCFSoftShadowMap;
// renderer.shadow.type = THREE.VSMShadowMap;

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

console.timeEnd('LOAD');