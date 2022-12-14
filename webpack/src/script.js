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

const parameters =
{
    materialColor: '#5261d1'
}
gui.addColor(parameters, 'materialColor').onChange(() =>
{
    material.color.set(parameters.materialColor);
    particlesMat.color.set(parameters.materialColor);
});

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
// +++  Textures
const textureLoader = new THREE.TextureLoader();
const gradientTex = textureLoader.load('textures/gradients/3.jpg')
gradientTex.magFilter = THREE.NearestFilter;

// +++++++++++++++++++++++++++++++++++++++
// +++  Light
const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(1, 1, 0);
scene.add(dirLight);

// +++++++++++++++++++++++++++++++++++++++
// +++  Geometry
// Materials
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTex
})
// Meshes
const objectsDistance = 4;
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
);
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
);
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);
mesh1.position.x = 2;
mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh2.position.x = -2;
mesh3.position.y = -objectsDistance * 2;
mesh3.position.x = 2;
scene.add(mesh1, mesh2, mesh3);
const sectionMeshes = [mesh1, mesh2, mesh3];
// Particles
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMat = new THREE.PointsMaterial( {
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.05
});
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
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    alpha: true
 });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// Scroll
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener('scroll', () => 
{
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);

    if (newSection != currentSection) 
    {
        currentSection = newSection;

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                z: '+=3'
            }
        );
    }
})
// Cursor
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (event) => 
{
    // Center coords
    cursor.x = event.clientX / sizes.width  - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

// +++++++++++++++++++++++++++++++++++++++
// +++  Camera
const cameraGroup = new THREE.Group();
const camera   = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 7;
cameraGroup.add(camera);
scene.add(cameraGroup);

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
// +++  Time
const clock = new THREE.Clock();
let lastFrameTime = 0;

const tick = () => {
    
    // UPDATE Time
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastFrameTime;
    lastFrameTime = elapsedTime;
    
    // Animate Camera
    camera.position.y = -scrollY / sizes.height * objectsDistance;
    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;
    
    const smoothValue = 3;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * smoothValue * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * smoothValue * deltaTime;
    // Animate Meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

console.timeEnd('LOAD');