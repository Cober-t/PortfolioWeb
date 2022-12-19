import * as THREE from 'three'
import Experience  from '../Experience.js'

const points = [
    {
        position: new THREE.Vector3(0.0, 0.2, 4.0),
        element: document.querySelector('.point-0')
    },
    {
        position: new THREE.Vector3(3.0, 1.5, 1.2),
        element: document.querySelector('.point-1')
    },
    {
        position: new THREE.Vector3(1.05, -2.85, 3.5),
        element: document.querySelector('.point-2')
    }

]
//let lastRaycast = 0
//let raycastInterval = 5;

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.raycaster = new THREE.Raycaster();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.world = this.experience.world;

        this.mouse = {};
        this.mouseState = {};
        this.mouseState.held = false;
        this.castRaycast = true;

        this.setEventHandlers();
    }

    setEventHandlers()
    {
        // Record mouse position for raycast
        addEventListener('mousemove', (e)=>
            {
                this.mouse.x = (e.clientX / window.innerWidth ) * 2 - 1;
                this.mouse.y = -((e.clientY - 50) / window.innerHeight ) * 2 + 1;
    
                // If we are panning, don't queue a raycast
                // this.castRaycast = !this.mouseState.held;
                if(this.mouseState.held)
                {
                    for(const point of points)
                        point.element.classList.remove('visible')

                    this.castRaycast = false;
                }
            });

        addEventListener('mousedown', (e)=>
            {
                this.mouseState.lastClick = Date.now();
                // this.mouseState.clicked = false;
                this.mouseState.held = true;
            });

        addEventListener('mouseup', (e)=> 
        { 
            this.mouseState.held = false;
            // In this case only cast a Raycast when we unhold the mouse button
            this.castRaycast = true;

        });
    }


    update()
    {
        // Check that we've waited long enough to raycast
        this.handleRaycast();
        //if (Date.now() - lastRaycast > raycastInterval && this.castRaycast) 
        //{
        //    this.handleRaycast();
        //    lastRaycast = Date.now();
        //    this.castRaycast = false;
        //}
    }

    handleRaycast() 
    {
        if (this.scene.sceneReady && this.castRaycast) 
        {
            for(const point of points)
            {
                const screenPosition = point.position.clone();
                screenPosition.project(this.experience.camera.instance);
    
                // Check Raycaster
                this.raycaster.setFromCamera(screenPosition, this.experience.camera.instance);
                
                // this.world.helmet.model.children
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                if (intersects.length === 0)
                    point.element.classList.add('visible')
                else
                {
                    const intersectionDistance = intersects[0].distance;
                    const pointDistance = point.position.distanceTo(this.experience.camera.instance.position)
                    if(intersectionDistance < pointDistance)
                        point.element.classList.remove('visible')
                    else
                        point.element.classList.add('visible')
                }
    
                const translateX =  screenPosition.x * this.experience.sizes.width *  0.5;
                const translateY = -screenPosition.y * this.experience.sizes.height * 0.5;
                point.element.style.transform = ` translate(${translateX}px, ${translateY}px) `
            }
            
            this.castRaycast = false;
        }
    }
}