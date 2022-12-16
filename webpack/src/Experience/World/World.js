import * as THREE from 'three'
import Experience  from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox   from './Fox.js'

// Shader test (abstract class)
import testVertexShader   from '../../shaders/test/vertex.glsl'
import testFragmentShader from '../../shaders/test/fragment.glsl'
import GUI from 'lil-gui'
import { Int8Attribute } from 'three'

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // +++++++++++++++++++++++++++++++++++
        // ++++++++ Shader Test
        // Geometry
        const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
        // Material
        const material = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
        })
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        // Wait for Resources
        this.resources.on('ready', ()=> { 
            // Setup
            //this.floor = new Floor();
            //this.fox = new Fox();
            // Load the last one to apply changes to the rest of elements in the scene
            //this.environment = new Environment(); 
        });
    }

    update()
    {
        if(this.fox)
            this.fox.update();
    }
}