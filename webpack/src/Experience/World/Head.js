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
        this.debug = this.experience.debug;

        // Debug
        if(this.debug.active)
            this.debugFolder = this.debug.ui.addFolder('head');

        // Setup
        this.resource = this.resources.items.headModel;

        this.setTextures();
        this.setMaterial();
        this.setModel();
    }

    setTextures()
    {
        this.textures = {};
        this.textures.color = this.resources.items.headColorTexture;
        this.textures.color.encoding = THREE.sRGBEncoding;

        this.textures.normal = this.resources.items.headNormalTexture;
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })

        this.depthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
        });

        // Modify materials
        this.material.onBeforeCompile = (shader) =>
        {
            shader.uniforms.uTime = customUniforms.uTime;
            
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>', 
                `   #include <common>

                    uniform float uTime;

                    mat2 get2dRotateMatrix(float _angle)
                    {
                        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
                    }
                `
                );
            shader.vertexShader = shader.vertexShader.replace(
                '#include <beginnormal_vertex>', 
                `   #include <beginnormal_vertex>

                    float angle = (position.y + 4.0) * sin(uTime) * 0.9;
                    mat2 rotateMatrix = get2dRotateMatrix(angle);

                    objectNormal.xz = objectNormal.xz * rotateMatrix;
                `
                );
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>', 
                `   #include <begin_vertex>

                    transformed.xz = transformed.xz * rotateMatrix;
                `
                );
        }

        this.depthMaterial.onBeforeCompile = (shader) =>
        {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>', 
                `   #include <common>

                    uniform float uTime;

                    mat2 get2dRotateMatrix(float _angle)
                    {
                        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
                    }
                `
                );
                shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>', 
                `   #include <begin_vertex>

                    float angle = (position.y + uTime) * 0.9;
                    mat2 rotateMatrix = get2dRotateMatrix(angle);
                    
                    transformed.xz = transformed.xz * rotateMatrix;
                `
                );
        }

        this.material.castShadow  = true;
        this.material.receiveShadow = true;
        this.material.needsUpdate = true;
    }

    setModel()
    {
        this.model = this.resource.scene.children[0];
        this.model.material = this.material;
        this.model.customDepthMaterial = this.depthMaterial;
        this.scene.add(this.model);
    }

    update()
    {
        customUniforms.uTime.value = this.time.elapsed * 0.001;
    }
}