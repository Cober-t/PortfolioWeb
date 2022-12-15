import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import CANNON, { World } from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

console.time('LOAD');

// +++++++++++++++++++++++++++++++++++++++
// +++  Texture
const textureLoader = new THREE.TextureLoader();
const cubeTexLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTexLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
]);
// Don't apply encoding to normal textures (should have THREE.LinearEncoding)
environmentMapTexture.encoding = THREE.sRGBEncoding;

// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
const scene = new THREE.Scene();
scene.background = environmentMapTexture;
// scene.environment = environmentMapTexture;

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
                canvas.requestFullscreen ()
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
    visible: true,
    envMapIntensity: 1.6
}
gui.add(debugObject, 'fullscreen');
gui.add(debugObject, 'envMapIntensity')
   .min(0).max(10).step(0.01).name('Env_Intensity')
   .onChange(() => { updateAllMaterials() });

window.addEventListener('dblclick', () => 
{
    if(document.fullscreenElement || document.webkiFullscreenElement)
        debugObject.fullscreen();
    else
        dat.GUI.toggleHide();
});

// +++++++++++++++++++++++++++++++++++++++
// +++  Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 3)
dirLight.position.set(0.25, 3, -2.25);
dirLight.castShadow = true
dirLight.shadow.camera.far = 15;
dirLight.shadow.mapSize.set(1024/4, 1024/4);
// To avoid shadow acne on smooth surfaces (bias instead of normalBias helps with flat surfaces)
dirLight.shadow.normalBias = 0.05;
scene.add(dirLight);

gui.add(dirLight, 'intensity').min(0).max(10).step(0.001).name('Light_Intensity');
gui.add(dirLight.position, 'x').min(-5).max(5).step(0.001).name('Light_X');
gui.add(dirLight.position, 'y').min(-5).max(5).step(0.001).name('Light_Y');
gui.add(dirLight.position, 'z').min(-5).max(5).step(0.001).name('Light_Z');

// +++++++++++++++++++++++++++++++++++++++
// +++  Models
// Material
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // If not set environment to default (scene.environment = environmentMapTexture)
            child.material.envMap = environmentMapTexture;
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}

const gltfLoader = new GLTFLoader();
let helmetMesh = new THREE.Group();
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        const children = [...gltf.scene.children];
        for(const child of children) 
        {
            child.material.envMap = environmentMapTexture;
            helmetMesh.add(child);
        }

        helmetMesh.scale.set(5, 5, 5);
        scene.add(helmetMesh);

        updateAllMaterials();
    }
)

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
    alpha: true,
    // Must declare after the canvas
    // antialias: true, // renderer.antialias = true (dont work)
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true;
// Encoding is a way to optimize bright and dark values according to eye sensitivity
// sRGBEncoding is like using gammaEncoding with common value 2.2
renderer.outputEncoding = THREE.sRGBEncoding;
// or renderer.outputEncoding = THREE.gammaFactor;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;

// For HDR textures, but give some effects on LDR textures too
gui.add(renderer, 'toneMapping', 
{
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(() => 
{ 
    // Because last property convert toneMapping type to string
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
});
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001).name('ToneMap_Exp');

// +++++++++++++++++++++++++++++++++++++++
// +++  Camera
const camera   = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3, 6, 7)
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
let lastFrameTime = 0;

const tick = () => {
    
    // UPDATE Time
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastFrameTime;
    lastFrameTime = elapsedTime;

    // UPDATE control
    controls.update();
    
    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

console.timeEnd('LOAD');