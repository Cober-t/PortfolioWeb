import './style.css'
import * as THREE from './three.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

// +++++++++++++++++++++++++++++++++++++++
// +++  Textures
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () =>
{
    console.log('loading started');
}
loadingManager.onLoad = () =>
{
    console.log('loading finished');
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing');
}
loadingManager.onError = () =>
{
    console.log('loading error');
}
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load(
        '/textures/matcaps/1.png',
        () => 
        {
            console.log('load');
        },
        () =>
        {
            console.log('progress');
        }, 
        () =>
        {
            console.log('error');
        });
// Options
//texture.repeat.x = 2;
//texture.repeat.y = 3;
//texture.wrapS = THREE.MirroredRepeatWrapping;
//texture.wrapT = THREE.MirroredRepeatWrapping;

//texture.offset.x = 0.5;
//texture.offset.y = 0.5;

//texture.rotation = Math.PI / 4;
//texture.center.x = 0.5;
//texture.center.y = 0.5;

//texture.generateMipmaps = false;
//texture.minFilter = THREE.NearestFilter;
//texture.magFilter = THREE.NearestFilter;

// +++++++++++++++++++++++++++++++++++++++
// +++  Debug
const gui = new dat.GUI({ closed: true, width: 400 });
const debugObject =
{
    color: 0xff0000,
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
    enableWireframe: false,
    visible: true
}
gui.addColor(debugObject, 'color')
   .onChange(() =>
    {
        mat1.color.set(debugObject.color);
        mat2.color.set(debugObject.color);
    })



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
// Geometry
const positionsArray = new Float32Array([
    0, 0, 0,
    0, 1, 0,
    1, 0, 0
])
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
const geo1 = new THREE.BufferGeometry();
geo1.setAttribute('position', positionsAttribute);
const mat1 = new THREE.MeshBasicMaterial({ 
    color: debugObject.color,
    wireframe: true
});
const mesh    = new THREE.Mesh(geo1, mat1);
group.add(mesh)

const geo2 = new THREE.BoxBufferGeometry(1, 1, 1)
const mat2 = new THREE.MeshBasicMaterial({
    color: debugObject.color,
    map: texture,
    wireframe: debugObject.enableWireframe
})
const cube    = new THREE.Mesh(geo2, mat2);
cube.position.y -= 1
group.add(cube)
// Debug
// gui.add(mesh.position, 'y', -3, 3, 0.1)
gui.add(mesh.position, 'y')
   .min(-3)
   .max(3)
   .step(0.1)
   .name('Y')
gui.add(group, 'visible')
gui.add(debugObject, 'spin')
gui.add(debugObject, 'fullscreen')

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
camera.position.z = 5 
camera.lookAt(mesh.position);
// camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

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
gsap.to(mesh.position, { duration: 1, delay: 1, x: -1 } );
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 } );

const tick = () => {
    
    // UPDATE Time
    const elapsedTime = clock.getElapsedTime();
    //const currentTime = Date.now();
    //const deltaTime = currentTime - time
    //time = currentTime;

    // UPDATE Render
    //camera.position.set(cursor.x * 3, cursor.y * 3, camera.position.z);
    // rotate around the mesh
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(mesh.position)
    // Update objects
    //mesh.rotation.y = elapsedTime * Math.PI * 2;
    //mesh.position.y = Math.sin(elapsedTime);

    // UPDATE Controls
    controls.update();

    // UPDATE Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();