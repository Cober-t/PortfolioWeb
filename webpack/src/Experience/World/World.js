import * as THREE from 'three'
import Experience  from '../Experience.js'
import Environment from './Environment.js'
import PostProcessing from '../PostProcessing.js'
import Floor from './Floor.js'
import Fox   from './Fox.js'
import Head  from './Head.js'
import Helmet  from './Helmet.js'


// Shader test (abstract class)
import testVertexShader   from '../../shaders/test/galaxyVertex.glsl'
import testFragmentShader from '../../shaders/test/galaxyFragment.glsl'

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

        // Wait for Resources
        this.resources.on('ready', ()=> {
            // Setup
            this.floor = new Floor();
            this.fox = new Fox();
            // this.head = new Head();
            // this.helmet = new Helmet();
            // this.postProcessing = new PostProcessing();

            // Load the last one to apply changes to the rest of elements in the scene
            this.environment = new Environment();
        });
    }

    update()
    {
        if(this.fox)
            this.fox.update();
        
        if(this.head)
            this.head.update();
    }
}