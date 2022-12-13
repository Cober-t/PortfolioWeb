import './style.css'
import * as THREE from './three.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { PointLight } from 'three/src/Three'

// +++++++++++++++++++++++++++++++++++++++
// +++  Textures
const textureLodaer = new THREE.TextureLoader()
const furAlbedo = textureLodaer.load('/textures/fur/albedo.png')
const furAO = textureLodaer.load('/textures/fur/ambientOcclusion.png')
const furHeight = textureLodaer.load('/textures/fur/height.png')
const furNormal = textureLodaer.load('/textures/fur/normal.png')

const rockWallAlbedo = textureLodaer.load('/textures/rockWall/albedo.png')
const rockWallAO = textureLodaer.load('/textures/rockWall/ambientOcclusion.png')
const rockWallHeight = textureLodaer.load('/textures/rockWall/height.png')
const rockWallNormal = textureLodaer.load('/textures/rockWall/normal.png')

const bamboAlbedo = textureLodaer.load('/textures/bamboWood/albedo.png')
const bamboAO = textureLodaer.load('/textures/bamboWood/ambientOcclusion.png')
const bamboRoughness = textureLodaer.load('/textures/bamboWood/roughness.png')
const bamboMetallic = textureLodaer.load('/textures/bamboWood/metallic.png')
const bamboNormal = textureLodaer.load('/textures/bamboWood/normal.png')

const matcapTex = textureLodaer.load('/textures/matcaps/7.png')
matcapTex.minFilter = THREE.NearestFilter;
matcapTex.magFilter = THREE.NearestFilter;
matcapTex.generateMipmaps = false;  // If we are using NearestFilter

// +++++++++++++++++++++++++++++++++++++++
// +++  Cube Texture
const cubeTexLoader = new THREE.CubeTextureLoader();
// Must load in order
const envMapTex = cubeTexLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

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
const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
const pointLight = new THREE.PointLight('#00ffff', 0.3);
pointLight.position.set(-1.5, 1.5, 1.5);
gui.add(pointLight.position, 'x').min(-3).max(3).step(0.01);
gui.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
gui.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
gui.add(pointLight, 'intensity').min(0).max(1).step(0.01);
gui.addColor(debugObject, 'color')
.onChange(() => {
    pointLight.color.set(debugObject.color);
})
const pointLightBox = new THREE.Mesh(
    new THREE.SphereBufferGeometry(),
    new THREE.MeshBasicMaterial( {color: '#00ffff'})
)
pointLightBox.scale.set(0.05, 0.05, 0.05)

// +++++++++++++++++++++++++++++++++++++++
// +++  Materials
//////  Albedo
// const material = new THREE.MeshBasicMaterial({color: 'red'});
// material.flatShading = true;
//////  Normal
//const material = new THREE.MeshNormalMaterial()
//////  Matcap
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTex;
//////  Depth
// const material = new THREE.MeshDepthMaterial();
// material.matcap = matcapTex;
//////  Lambert (reactive to lights)
// const material = new THREE.MeshLambertMaterial();
//////  Phong (reactive to lights)
//const material = new THREE.MeshPhongMaterial(); 
//material.shininess = 10;
//material.specular = new THREE.Color('yellow');
//////  Toon (reactive to lights)
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;
//////  Standard (the good one, support light, metalness and roughness)
const furMat = new THREE.MeshStandardMaterial();
gui.add(furMat, 'metalness').min(0).max(1).step(0.001);
gui.add(furMat, 'roughness').min(0).max(1).step(0.001);
gui.add(furMat, 'wireframe');
gui.add(furMat, 'displacementScale').min(0).max(1).step(0.01);
furMat.map = furAlbedo;
furMat.aoMap = furAO;
furMat.aoMapIntensity = 1;
furMat.displacementMap = furHeight;
furMat.displacementScale = 0.3
// furMat.metalnessMap = 
furMat.normalMap = furNormal;
// furMat.normalScale.set(0.1, 0.1);
// furMat.transparent = true
// furMat.alphaMap = 
furMat.side = THREE.DoubleSide;
//////  Physic Material
//////  Points Material (for particles)
//////  Shader Material (custom)

const bamboMat = new THREE.MeshStandardMaterial();
bamboMat.metalness = 0.7;
bamboMat.roughness = 0.0;
//bamboMat.map = bamboAlbedo;
//bamboMat.aoMap = bamboAO;
//bamboMat.normalMap = bamboNormal;
//bamboMat.roughness = bamboRoughness;
bamboMat.envMap = envMapTex;

const rockWallMat = new THREE.MeshStandardMaterial();
gui.add(rockWallMat, 'displacementScale').min(0).max(1).step(0.01);
rockWallMat.map = rockWallAlbedo;
rockWallMat.aoMap = rockWallAO;
rockWallMat.aoMapIntensity = 1;
rockWallMat.displacementMap = rockWallHeight;
rockWallMat.displacementScale = 0.08
rockWallMat.normalMap = rockWallNormal;

// +++++++++++++++++++++++++++++++++++++++
// +++  Axis helper
const axesHelper = new THREE.AxesHelper();

// +++++++++++++++++++++++++++++++++++++++
// +++  Geometry
const group = new THREE.Group();
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 62, 62),
    rockWallMat
)
sphere.position.x = -1.5
group.add(sphere);
    
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.4, 0.3, 64, 128),
    bamboMat
)
torus.position.x = 1.5

group.add(torus);
        
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    furMat
)
group.add(plane);
// UVs
torus.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
sphere.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
const scene = new THREE.Scene();
scene.add(group);
scene.add(ambientLight, pointLight, pointLightBox);
scene.add(axesHelper);
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
const camera   = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 1, 1000);
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

    // UPDATE Render
    pointLightBox.material.color = pointLight.color
    pointLightBox.position.set(pointLight.position.x, pointLight.position.y, pointLight.position.z)

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