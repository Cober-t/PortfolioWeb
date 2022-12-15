import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import CANNON, { World } from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

console.time('LOAD');

// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
const scene = new THREE.Scene();

// +++++++++++++++++++++++++++++++++++++++
// +++  Audio
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = (collision) =>
{
    const impactStrenght = collision.contact.getImpactVelocityAlongNormal();
    
    if (impactStrenght > 1.5) 
    {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
    }
}
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
    reset: () => 
    {
        for(const object of objectToUpdate)
        {
            object.body.removeEventListener('collide', playHitSound);
            world.removeBody(object.body);

            scene.remove(object.mesh);
        }
    },
    visible: true,
    createSphere: () => 
    { 
        createSphere( 
        Math.random(), 
        {
            x:(Math.random() - 0.5) * 3,
            y:3,
            z:(Math.random() - 0.5) * 3,
        }); 
    },
    createBox: () => 
    { 
        createBox(
            Math.random(), 
            Math.random(), 
            Math.random(), 
            {
                x:(Math.random() - 0.5) * 3,
                y:3,
                z:(Math.random() - 0.5) * 3,
            }
        ); 
    }
}
gui.add(debugObject, 'fullscreen');
gui.add(debugObject, 'reset');
gui.add(debugObject, 'createSphere');
gui.add(debugObject, 'createBox');

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
// +++  Physics
// World
const world = new CANNON.World();
// Collision Algorithm (naive for default)
world.broadphase = new CANNON.SAPBroadphase(world);
// Don't check rest bodies until a force affect them
// can control body asleep with slepSpeedLimit and sleepTimeLimit
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Physics Materials
const concreteMat = new CANNON.Material('concrete');
const plasticMat = new CANNON.Material('plastic');
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMat,
    plasticMat,
    {
        friction: 0.1,
        restitution: 0.7
    }
);
world.addContactMaterial(concretePlasticContactMaterial);
// world.defaultContactMaterial(defaultContactMaterial);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.position.y = -0.5;
floorBody.material = concreteMat;
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0), 
    Math.PI * 0.5);
floorBody.addShape(floorShape);
world.addBody(floorBody);

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
floor.position.y = -0.5;
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
// +++  Utils
const objectToUpdate = [];

// Cubes
const boxGeo =  new THREE.BoxBufferGeometry(1, 1, 1);
const boxMat = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
const createBox = (width, height, depth, position) =>
{
    const mesh = new THREE.Mesh(boxGeo, boxMat);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: concreteMat,
    });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body);

    // Save in objects to update
    objectToUpdate.push({ mesh, body });
}
// Spheres
const sphereGeo =  new THREE.SphereBufferGeometry(1, 20, 20);
const sphereMat = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
const createSphere = (radius, position) =>
{
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: concreteMat,
    });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body);

    // Save in objects to update
    objectToUpdate.push({ mesh, body });
}
createSphere(0.5, { x:1, y:3, z:-1 });
createSphere(0.5, { x:2, y:3, z:2 });
createSphere(0.5, { x:3, y:3, z:1 });

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

    // UPDATE physics world
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
    world.step(1/60, deltaTime, 3);
    for(const object of objectToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }

    // UPDATE control
    controls.update();
    
    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

console.timeEnd('LOAD');