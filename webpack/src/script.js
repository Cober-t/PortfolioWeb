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
// +++  Textures
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/2.png');

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
// Cube
const cubeMesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshBasicMaterial()
);
scene.add(cubeMesh);
// Particles
// const particlesGeo = new THREE.SphereBufferGeometry(1, 32, 32);
// Custom Geometry
const particlesGeo = new THREE.BufferGeometry();
const count = 100000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
    colors[i] = Math.random(); 
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material
// Bad idea for animate particles, we must use a custom shader
const particlesMat = new THREE.PointsMaterial();
particlesMat.size = 0.5;
particlesMat.sizeAttenuation = true;
// particlesMat.color = new THREE.Color(0xff88cc); // If exist this and vertexColor return a mix
particlesMat.transparent = true;
particlesMat.alphaMap = particleTexture;
particlesMat.vertexColors = true;
// Solutions for z-buffer...
// particlesMat.alphaTest = 0.001; // not exactly
// particlesMat.depthTest = false; // dont work if there are other things on scene
particlesMat.depthWrite = false;   // not writing in the depth buffer (good solution)
// particlesMat.blending = THREE.AdditiveBlending // high cost and bright result

// +++++++++++++++++++++++++++++++++++++++
// +++  Particles (Points)
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

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

    // UPDATE Controls
    controls.update();

    // UPDATE Particles
    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3;

        // x: i3 + 0 -- y = i3 + 1 --  z = i3 + 2
        const x = particlesGeo.attributes.position.array[i3];
        // Bad idea, for update thousands of particles we must use a custom shader
        particlesGeo.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }
    // For update attributes in geometry
    particlesGeo.attributes.position.needsUpdate = true;

    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

console.timeEnd('LOAD');