import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import CANNON, { World } from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'

console.time('LOAD');

// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
const scene = new THREE.Scene();

// +++++++++++++++++++++++++++++++++++++++
// +++  Models
// Before gltfLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
// Don't use draco loader with low meshes
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;
let helmetMesh = new THREE.Group();
gltfLoader.load(
    '/models/Duck/glTF-Draco/Duck.gltf',
    (gltf) =>
    {
        const children = [...gltf.scene.children]
        for(const child of children)
        {
            child.position.x = -2;
            child.rotation.y = -Math.PI/2;
            scene.add(child);
        }

        // scene.add(gltf.scene);
    }
)
gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) =>
    {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[1]);

        action.play();

        gltf.scene.scale.set(0.025, 0.025, 0.025);
        scene.add(gltf.scene);
    }
)

gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        // Various Solutions
        // 1: Because when we import something, it delete from the origin scene
        //while(gltf.scene.children.length > 0)
        //    helmetMesh.add(gltf.scene.children[0]);

        // 2: For make a copy and dont delete childrens from scene
        const children = [...gltf.scene.children];
        for(const child of children)
            helmetMesh.add(child);

        helmetMesh.position.x = 2;
        scene.add(helmetMesh);

        // 3: Another solution consist on copy the whole scene
        // scene.add(gltf.scene)
    }
)


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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 0.2)
dirLight.castShadow = true
dirLight.shadow.mapSize.set(1024, 1024)
dirLight.shadow.camera.far = 15
dirLight.shadow.camera.left = - 7
dirLight.shadow.camera.top = 7
dirLight.shadow.camera.right = 7
dirLight.shadow.camera.bottom = - 7
dirLight.position.set(5, 5, 5)
scene.add(dirLight);

// +++++++++++++++++++++++++++++++++++++++
// +++  Geometry
// Material
const material = new THREE.MeshStandardMaterial({
    metalness: 0.4,
    roughness: 0.3,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
});
// Meshes
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI/2;
scene.add(floor);

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// +++++++++++++++++++++++++++++++++++++++
// +++  Camera
const camera   = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3, 3, 7)
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

    // UPDATE mixer (for loading models with animations)
    if(mixer !== null)
        mixer.update(deltaTime);

    // UPDATE control
    controls.update();
    
    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

console.timeEnd('LOAD');