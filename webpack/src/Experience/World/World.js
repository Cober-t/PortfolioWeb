import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        
        // Wait for Resources
        this.resources.on('ready', ()=> { 
            // Setup
            this.floor = new Floor();
            this.fox = new Fox();
            // Load the last one to apply changes to the rest of elements in the scene
            this.environment = new Environment(); 
        });
    }

    update()
    {
        if(this.fox)
            this.fox.update();
    }
}