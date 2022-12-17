import * as THREE from 'three'
import Experience from "./Experience.js"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

const customUniforms = {
    uTime: { value: 0 }
}

export default class PostProcessing 
{
    constructor()
    {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.renderer = this.experience.renderer.instance;

        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.time = this.experience.time;

        const options = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            encoding: THREE.sRGBEncoding,
        };

        if (this.renderer.getPixelRatio() < 2 && this.renderer.capabilities.isWebGL2)
            options.samples = 2  // For enabling MSAA (MultiSamplig AntiAliasing)

        this.renderTarget = new THREE.WebGLRenderTarget(800, 600, options);


        // Second argument (renderTarget)
        this.effectComposer = new EffectComposer(this.renderer, this.renderTarget);

        this.setInstance();
        
        const renderPass = new RenderPass(this.scene, this.camera.instance);
        this.effectComposer.addPass(renderPass);
        // To ensure sRGB encoding work (must be the last pass)
        this.effectComposer.addPass( new ShaderPass( GammaCorrectionShader ) );


        this.example();


        // Must be the last pass if exist
        this.setAntialiasing();
    }

    setInstance()
    {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setAntialiasing()
    {
        // Bad for performance, MSAA is better but is not allowed in all browsers
        // If the pixle ratio is above 1 no need to use antialiasing
        if (this.renderer.getPixelRatio() < 2 && !this.renderer.capabilities.isWebGL2)
        {
            const smaaPass = new SMAAPass();
            this.effectComposer.addPass(smaaPass);
        }
    }

    addPass(passType)
    {
        for(let i = 0; i < passType.length; i++)
            this.effectComposer.addPass(passType[i]);
    }

    resize()
    {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    update() 
    {
        console.log('dasdasd')
        customUniforms.uTime.value = this.time.elapsed * 0.001;
        this.effectComposer.render();
    }

    example()
    {
        const dotScreenPass = new DotScreenPass();
        const glitchPass = new GlitchPass();
        const unrealBloomPass = new UnrealBloomPass();
        unrealBloomPass.strength = 0.3;
        unrealBloomPass.radius = 1;
        unrealBloomPass.threshold = 0.6;
        const rgbShiftShader = new ShaderPass(RGBShiftShader);

        //  Custom pass
        // ++++++++++ TINT PASS ++++++++++++
        const TintShader = 
        {
            // Always null, tDiffuse is a must
            uniforms: 
            {
                tDiffuse: { value: null },   // For EffectComposer update automatically
                uTint:    { value: null }
            },
            vertexShader: 
            `
                varying vec2 vUv;

                void main() 
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: 
            `
                uniform sampler2D tDiffuse;
                uniform vec3 uTint;
                varying vec2 vUv;
                void main()
                {
                    vec4 color = texture2D(tDiffuse, vUv);
                    color.rgb += uTint;
                    gl_FragColor = color;
                }
            `,
        }

        // ++++++++++ DISPLACEMENT PASS ++++++++++++
        const DisplacementShader = 
        {
            uniforms: 
            {
                tDiffuse: { value: null },
                uTime:    { value: null }
            },
            vertexShader: 
            `
                varying vec2 vUv;

                void main() 
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: 
            `
                uniform sampler2D tDiffuse;
                uniform float uTime;

                varying vec2 vUv;
                void main()
                {
                    vec2 newUv = vec2(
                        vUv.x,
                        vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
                        );
                    vec4 color = texture2D(tDiffuse, newUv);
                    gl_FragColor = color;
                }
            `,
        }

        // ++++++++++ DISPLACEMENT PASS ++++++++++++
        const FuturisticShader = 
        {
            uniforms: 
            {
                tDiffuse: { value: null },
                uNormalMap: { value: null }
            },
            vertexShader: 
            `
                varying vec2 vUv;

                void main() 
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: 
            `
                uniform sampler2D tDiffuse;
                uniform sampler2D uNormalMap;

                varying vec2 vUv;

                void main()
                {
                   vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;

                   vec2 newUv = vUv + normalColor.xy * 0.5;
                   vec4 color = texture2D(tDiffuse, newUv);

                   vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
                   float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
                   color.rgb += lightness * 2.0;

                   gl_FragColor = color;
                }
            `,
        }

        const tintPass = new ShaderPass(TintShader);
        tintPass.material.uniforms.uTint.value = new THREE.Vector3();

        const displacementPass = new ShaderPass(DisplacementShader);
        displacementPass.material.uniforms.uTime = customUniforms.uTime;

        const futuristicPass = new ShaderPass(FuturisticShader);
        futuristicPass.material.uniforms.uNormalMap.value = this.resources.items.futuristicNormalTexture;

        // Debug
        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('PostProcessing');
            const tint = tintPass.material.uniforms.uTint.value;
            this.debugFolder.add(tint, 'x').min(0).max(1).step(0.01).name('red');
            this.debugFolder.add(tint, 'y').min(0).max(1).step(0.01).name('green');
            this.debugFolder.add(tint, 'z').min(0).max(1).step(0.01).name('blue');
        }

        this.addPass([futuristicPass]);
    }
}