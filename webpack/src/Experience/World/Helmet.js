import * as THREE from 'three'
import Experience from '../Experience.js'

const customUniforms = {
    uTime: { value: 0 }
}

export default class Fox
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        // Setup
        this.resource = this.resources.items.helmetModel;

        this.setTextures();
        this.setMaterial();
        this.setModel();
    }

    setTextures()
    {
        this.textures = {};
        this.textures.color = this.resources.items.headColorTexture;
        this.textures.color.encoding = THREE.sRGBEncoding;
        
        this.textures.ambientOcclusion = this.resources.items.helmetAOTexture;
        this.textures.emissive = this.resources.items.helmetEmmissiveTexture;
        this.textures.metalRoughness = this.resources.items.helmetMetalRoughnessTexture;
        this.textures.normal = this.resources.items.helmetNormalTexture;
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
            emissiveMap: this.textures.emmisive,
            aoMap: this.textures.ambientOcclusion,
            metalRoughness: this.textures.metalRoughness,
        })
    }

    setModel()
    {
        let helmetMesh = new THREE.Group();
        const children = [...this.resource.scene.children];
        for(const child of children) 
        {
            helmetMesh.add(child);
        }

        helmetMesh.scale.set(5, 5, 5);
        this.scene.add(helmetMesh);
    }

    update()
    {

    }
}