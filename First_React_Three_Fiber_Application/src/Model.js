import { Clone, useAnimations, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useControls } from 'leva'
// import { useLoader } from '@react-three/fiber'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default function Model()
{
    // load GLTF model
    // const model = useLoader(GLTFLoader, './hamburger.glb')
    // load DRACO model
    // const modelDraco = useLoader(GLTFLoader, './FlightHelmet/glTF/FlightHelmet.gltf',
    //     (loader)=>
    //     {
    //         const dracoLoader = new DRACOLoader()
    //         dracoLoader.setDecoderPath('./draco/')
    //         loader.setDRACOLoader(dracoLoader)
    //     })
    // return <>
    //     <primitive object={modelDraco.scene} scale={5} position-y={-1} position-x={2} />
    //     <primitive object={model.scene} position-y={-1} position-x={-2} scale={0.35} />
    // </>

    // load GLTF or DRACO model with DREI
    const model = useGLTF('./Fox/glTF/Fox.gltf')
    const animations = useAnimations(model.animations, model.scene)
    const { animationName } = useControls({
        animationName: {options: ['Survey', 'Walk', 'Run'] }
    })

    useEffect(() => 
    {
        const action = animations.actions[animationName]

        // We need to fade int the new animation and fade out the old one
        action.reset().fadeIn(0.5).play()

        return() => // cleanup phase
        {
            action.fadeOut(0.5)
        }
    }, [animationName])

    return <> 
        <primitive object={model.scene} scale={0.02} position-y={-1}/>
    </>
}

// useGLTF.preload('./hamburger-draco.glb')