import * as THREE from 'three'
import Experience  from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox   from './Fox.js'

// Shader test (abstract class)
import testVertexShader   from '../../shaders/test/galaxyVertex.glsl'
import testFragmentShader from '../../shaders/test/galaxyFragment.glsl'
import { TextureFilter } from 'three'

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderNative = this.experience.renderer.instance;
        this.debug = this.experience.debug;

        this.time = this.experience.time;

        // +++++++++++++++++++++++++++++++++++
        // ++++++++ Animate Galaxy Test
        this.parameters = {}
        this.parameters.count = 200000;
        this.parameters.size = 15;
        this.parameters.radius = 5;
        this.parameters.branches = 5;
        this.parameters.randomness = 0.7;
        this.parameters.randomnessPower = 6;
        this.parameters.insideColor = '#ff6030'
        this.parameters.outsideColor = '#1b3984'

        let geometry = null;
        let material = null;
        this.galaxy = null;

        const generateGalaxy = () =>
        {

            if(this.galaxy !== null) 
            {
                geometry.dispose();
                material.dispose();
                this.scene.remove(this.galaxy);
            }

            geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(this.parameters.count * 3);
            const colors = new Float32Array(this.parameters.count * 3);
            const scales = new Float32Array(this.parameters.count * 1);
            const randomness = new Float32Array(this.parameters.count * 3);
            
            const colorInside = new THREE.Color(this.parameters.insideColor);
            const colorOutside = new THREE.Color(this.parameters.outsideColor);

            for (let i = 0; i < this.parameters.count; i++) 
            {
                const i3 = i * 3;

                const radius = Math.random() * this.parameters.radius;

                const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;
                
                // Position
                positions[i3 + 0] = Math.cos(branchAngle) * radius;
                positions[i3 + 1] = 0;
                positions[i3 + 2] = Math.sin(branchAngle) * radius;

                // Randomness                
                const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius;
                const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius;
                const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius;
                randomness[i3 + 0] = randomX;
                randomness[i3 + 1] = randomY;
                randomness[i3 + 2] = randomZ;

                // Color
                const mixedColor = colorInside.clone();
                mixedColor.lerp(colorOutside, radius / this.parameters.radius);
                colors[i3 + 0] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;

                // Scales
                scales[i] = Math.random();
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
            geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

            material = new THREE.ShaderMaterial({
                depthWrite: false,
                // transparent: true,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                vertexShader:   testVertexShader,
                fragmentShader: testFragmentShader,
                uniforms:
                {
                    uTime: { value: 0.0 },
                    uSize: { value: this.parameters.size * this.renderNative.getPixelRatio() }
                }
            })
            material.vertexColors = true;
            this.galaxy = new THREE.Points(geometry, material)
            
            this.scene.add(this.galaxy);
        }

        generateGalaxy();

        // Debug
        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Galaxy');
            this.debugFolder.add(this.parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
            this.debugFolder.add(this.parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
            this.debugFolder.add(this.parameters, 'size').min(1.0).max(50.0).step(0.01).name('size').onFinishChange(generateGalaxy);
            this.debugFolder.add(this.parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
            this.debugFolder.add(this.parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
            this.debugFolder.add(this.parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
            this.debugFolder.addColor(this.parameters, 'insideColor').onFinishChange(generateGalaxy);
            this.debugFolder.addColor(this.parameters, 'outsideColor').onFinishChange(generateGalaxy);
        }

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

        this.galaxy.material.uniforms.uTime.value = this.time.elapsed * 0.001 * 0.2;
    }
}