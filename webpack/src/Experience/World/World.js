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
        // Custom Attribute
        const count = geometry.attributes.position.count;
        const randoms = new Float32Array(count);

        for(let i = 0; i < count; i++)
            randoms[i] = Math.random();

        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        // Wait for Resources
        this.resources.on('ready', ()=> { 
            
            // +++++++++++++++++++++++++++++++++++
            // ++++++++ Shader Test
            // Material
            const material = new THREE.RawShaderMaterial({
                vertexShader: testVertexShader,
                fragmentShader: testFragmentShader,
                uniforms:
                {
                    uFrequency: { value: 0.5 },
                    uTexture: { value: this.resources.items.grassColorTexture }
                }
            })
            
            //Debug
            if(this.debug.active){
                this.debugFolder = this.debug.ui.addFolder('Shader');
                this.debugFolder.add(material.uniforms.uFrequency, 'value').min(0.0).max(1.0).step(0.1).name('Modifier');
            }

            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);

            // Setup
            // this.floor = new Floor();
            // this.fox = new Fox();
            // Load the last one to apply changes to the rest of elements in the scene
            // this.environment = new Environment(); 
        });
    }

    update()
    {
        if(this.fox)
            this.fox.update();
    }
}