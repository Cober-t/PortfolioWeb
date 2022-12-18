import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources'
import sources from './sources.js'
import Debug from './Utils/Debug.js'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

let instance = null

export default class Experience
{
    constructor(canvas)
    {
        // Singleton
        if(instance !== null)
            return instance;    

        instance = this;
        window.experience = this;

        this.canvas = canvas;

        // Setup
        this.debug = new Debug();

        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
        
        this.sizes.on('resize', () => { this.resize() });
        this.time.on('tick', () => { this.update() });

        // Performance tip
        console.log(this.renderer.info);
    }
    
    resize()
    {
        this.camera.resize();
        this.renderer.resize();

        if(this.world.postProcessing)
            this.world.postProcessing.resize();
    }

    update()
    {
        this.debug.measureFPSStart();

        this.camera.update();
        this.world.update(); 
        this.renderer.update();
        
        if(this.world.postProcessing)
            this.world.postProcessing.update();

        this.debug.measureFPSEnd();
    }

    destroy()
    {
        this.sizes.off('resize');
        this.time.off('tick');

        // Traversee the whole scene and dispose
        this.scene.traverse((child)=>
        {
            if (child instanceof THREE.Mesh)
            {
                child.geometry.dispose();
                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key];

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function')
                        value.dispose();
                }
            }
        })

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        // When using post-processing must dispose of the
        // EffectComposer, its WebGLRenderTarget and any potential passes that are using

        if (this.debug.active)
            this.debug.ui.destroy();
    }
}