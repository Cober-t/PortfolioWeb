import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active)
            this.debugFolder = this.debug.ui.addFolder('Environment');
        
        this.setSunLight();
        this.setEnvironmentMap();
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 1.0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, 3.75);
        this.scene.add(this.sunLight);

        // Debug
        if (this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .min(0)
                .max(10)
                .step(0.01)
                .name('Sun_Intensity')
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .min(0)
                .max(10)
                .step(0.01)
                .name('Sun_X')
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .min(0)
                .max(10)
                .step(0.01)
                .name('Sun_Y')
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .min(0)
                .max(10)
                .step(0.01)
                .name('Sun_Z')
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {};
        this.environmentMap.intensity = 1.0;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.encoding = THREE.sRGBEncoding;

        this.scene.environment = this.environmentMap.texture;
        this.scene.background = this.environmentMap.texture;

        // Update materials on the scene if needed (ej. load environmentMapTex after a Mesh)
        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) => 
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) 
                {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }
        this.environmentMap.updateMaterials();

        // Debug
        if (this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .min(0)
                .max(4)
                .step(0.01)
                .name('EnvMap_Intensity')
                .onChange(()=> { this.environmentMap.updateMaterials(); });
        }
    }
}