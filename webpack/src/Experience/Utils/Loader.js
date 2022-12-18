import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../Experience';

// Make with a plane (avoid mix css and javascript, bad for performance)
const loadingBarElement = document.querySelector('.loading-bar')

export default class Loader
{
    constructor()
    {
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.scene = this.experience.scene;

        // Overlay Setup
        const overlayGeo = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
        const overlayMat = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 }
            },
            vertexShader: `
                void main() { gl_Position = vec4(position, 1.0); } 
            `,
            fragmentShader: `
                uniform float uAlpha;
                void main() { gl_FragColor = vec4(0.1176, 0.1019, 0.1254, uAlpha); }
            `
        })
        
        const overlay = new THREE.Mesh(
            overlayGeo,
            overlayMat
        )
        this.scene.add(overlay);

        this.instance = new THREE.LoadingManager(
            ()=>
            {
                this.LoadingCompleted(overlayMat);
            },
            (itemUrl, itemsLoaded, itemsTotal)=>
            {
                this.LoadingProgress(itemUrl, itemsLoaded, itemsTotal)
            }
        )
    }

    LoadingCompleted(material)
    {
        // Wait a little
        gsap.delayedCall(0.5, ()=>
        {
            // Animate overlay
            gsap.to(material.uniforms.uAlpha, { duration: 3.0 , value: 0, delay: 1 })   
            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        })
        //window.setTimeout(() => /* ... */  }, 500)
    }

    LoadingProgress(itemUrl, itemsLoaded, itemsTotal)
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }

    LoadingError()
    {
        console.log('Error on Loading Resources');
    }
}
