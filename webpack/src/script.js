import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { PointLight, TetrahedronGeometry } from 'three/src/Three'
import gsap from 'gsap'

// +++++++++++++++++++++++++++++++++++++++
// +++  Scene
const scene = new THREE.Scene();

// +++++++++++++++++++++++++++++++++++++++
// +++  Textures
const textureLoader = new THREE.TextureLoader()
const furAlbedo = textureLoader.load('/textures/fur/albedo.png')
const furAO = textureLoader.load('/textures/fur/ambientOcclusion.png')
const furHeight = textureLoader.load('/textures/fur/height.png')
const furNormal = textureLoader.load('/textures/fur/normal.png')

const rockWallAlbedo = textureLoader.load('/textures/rockWall/albedo.png')
const rockWallAO = textureLoader.load('/textures/rockWall/ambientOcclusion.png')
const rockWallHeight = textureLoader.load('/textures/rockWall/height.png')
const rockWallNormal = textureLoader.load('/textures/rockWall/normal.png')

const bamboAlbedo = textureLoader.load('/textures/bamboWood/albedo.png')
const bamboAO = textureLoader.load('/textures/bamboWood/ambientOcclusion.png')
const bamboRoughness = textureLoader.load('/textures/bamboWood/roughness.png')
const bamboNormal = textureLoader.load('/textures/bamboWood/normal.png')

const matcapTex = textureLoader.load('/textures/matcaps/7.png')
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
// +++  Fonts
const fontLoader = new FontLoader();
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTex });
const textValue = 'Hello Three.js';
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry (
            textValue,
            {
                font:   font,
                size:   0.5,
                height: 0.2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const text = new THREE.Mesh(textGeometry, matcapMaterial);
        text.position.y = 1.5;
        scene.add(text);
    }
);

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

scene.add(group);
scene.add(ambientLight, pointLight, pointLightBox);
scene.add(axesHelper);
gui.add(group, 'visible');

/////////////////////////////////////////
//////////   100 donuts test  ///////////
console.time('donuts');
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

for (let i = 0; i < 1000; i++){
    const donut = new THREE.Mesh(donutGeometry, matcapMaterial);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const randomScale = Math.random() * 0.1;
    donut.scale.set(randomScale, randomScale, randomScale);
    
    scene.add(donut);
}
console.timeEnd('donuts');

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