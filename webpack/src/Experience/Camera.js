import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from './Experience.js'

export default class Camera 
{
    constructor()
    {
        // Experience is a Singleton
        this.experience = new Experience();
        this.sizes  = this.experience.sizes;
        this.scene  = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setOrbitControls();
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            35, 
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.instance.position.set(-4, 1.0, 17),
        this.instance.rotation.y = 1;
        this.scene.add(this.instance);
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas);
        // this.controls.enableDamping = true;
    }

    resize() 
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }    
    
    update()
    {
        this.controls.update();
    }
}