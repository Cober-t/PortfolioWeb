import * as THREE from 'three'
import Experience  from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox   from './Fox.js'

// Shader test (abstract class)
import testVertexShader   from '../../shaders/test/waterVertex.glsl'
import testFragmentShader from '../../shaders/test/waterFragment.glsl'

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        this.time = this.experience.time;

        // +++++++++++++++++++++++++++++++++++
        // ++++++++ Shader Test
        const debugObject = { 
            depthColor: '#186691', 
            surfaceColor: '#9bd8ff' 
        }
        // Geometry
        const geometry = new THREE.PlaneBufferGeometry(1, 1, 512, 512);
        // Material
        const material = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            uniforms:
            {
                uTime:      { value: 0 },
                
                uBigWavesElevation: { value: 0.2 },
                uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                uBigWavesSpeed:     { value: 0.75},

                uSmallWavesElevation: { value: 0.15 },
                uSmallWavesFrequency: { value: 3.0 },
                uSmallWavesSpeed:     { value: 0.2 },
                uSmallWavesIterations:{ value: 4 },
                // Fragment
                uDepthColor:    { value: new THREE.Color(debugObject.depthColor)   },
                uSurfaceColor:  { value: new THREE.Color(debugObject.surfaceColor) },
                uColorOffset:       { value: 0.08 },
                uColorMultiplier:   { value: 5.0  },
            }
        })
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI/2;
        mesh.scale.set(3, 3);
        this.objectTest = {};
        this.objectTest.mesh = mesh;
        this.scene.add(mesh);

        // Debug
        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Waves');

            this.debugFolder.add(mesh.material.uniforms.uBigWavesElevation, 'value')
                            .min(0).max(1).step(0.001).name('Big_W_Elevation');
            this.debugFolder.add(mesh.material.uniforms.uBigWavesFrequency.value, 'x')
                            .min(0).max(10).step(0.001).name('Big_W_Frequency_X');
            this.debugFolder.add(mesh.material.uniforms.uBigWavesFrequency.value, 'y')
                            .min(0).max(10).step(0.001).name('Big_W_Frequency_Z');
            this.debugFolder.add(mesh.material.uniforms.uBigWavesSpeed, 'value')
                            .min(0).max(10).step(0.01).name('Big_W_Speed');

            this.debugFolder.add(mesh.material.uniforms.uSmallWavesElevation, 'value')
                            .min(0).max(1).step(0.001).name('Small_W_Elevation');
            this.debugFolder.add(mesh.material.uniforms.uSmallWavesFrequency, 'value')
                            .min(0).max(30).step(0.001).name('Small_W_Frequency_X');
            this.debugFolder.add(mesh.material.uniforms.uSmallWavesSpeed, 'value')
                            .min(0).max(4).step(0.0001).name('Small_W_Speed');
            this.debugFolder.add(mesh.material.uniforms.uSmallWavesIterations, 'value')
                            .min(0).max(5).step(1).name('Perlin_Iterations');

            this.debugFolder.addColor(debugObject, 'depthColor')
                            .name('Depth_Color')
                            .onChange(()=>
                            {
                                mesh.material.uniforms.uDepthColor.value.set(debugObject.depthColor);
                            });
            this.debugFolder.addColor(debugObject, 'surfaceColor')
                            .name('Surface_Color')
                            .onChange(()=>
                            {
                                mesh.material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
                            });
            this.debugFolder.add(mesh.material.uniforms.uColorOffset, 'value')
                            .min(0).max(1).step(0.01).name('Color_Off');
            this.debugFolder.add(mesh.material.uniforms.uColorMultiplier, 'value')
                            .min(0).max(5).step(0.001).name('Color_Mul');
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

        // Update Waves
        this.objectTest.mesh.material.uniforms.uTime.value = this.time.elapsed * 0.001;
    }
}