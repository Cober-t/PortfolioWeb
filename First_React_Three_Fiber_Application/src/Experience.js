import { Stage, Lightformer, Environment, Sky, ContactShadows, RandomizedLight, AccumulativeShadows, softShadows, BakeShadows, useHelper, MeshReflectorMaterial, Float, Text, Html, PivotControls, TransformControls, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { button, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import CustomObject from "./CustomObject.js"

// softShadows({
//     frutum: 3.75,
//     size: 0.005,
//     near: 9.5,
//     samples: 17,
//     rings: 11
// })

export default function Experince()
{
    const dirLight = useRef()
    useHelper(dirLight, THREE.DirectionalLightHelper, 1)

    const sphere = useRef()
    const cube = useRef()

    const { perfVisible } = useControls({
        perfVisible: true
    })
    const { color, opacity, blur } = useControls('contact shadows',{
        color: '#4b2709',
        opacity: { value: 0.4, min: 0, max: 1},
        blur: { value: 2.8, min: 0, max: 10 }
    })
    const { sunPosition } = useControls('sky', {
        sunPosition: { value: [1, 2, 3]}    // Better use spherical coords
    })
    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls('environment Map',{
        envMapIntensity: { value: 1, min: 0, max: 12 },
        envMapHeight: { value: 7, min: 0, max: 100 },
        envMapRadius: { value: 20, min: 10, max: 1000 },
        envMapScale: { value: 100, min: 10, max: 1000 },
    })

    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
    })

return <>

        { perfVisible ? <Perf position="top-left"/> : null }
        
        {/* <BakeShadows /> */}

        <Environment
            // background
            preset="sunset" // Files that you don't even have to download
            ground={ {
                height: envMapHeight,
                radius: envMapRadius,
                scale: envMapRadius
            }}
            // resolution={ 32 }
            // files={ './environmentMaps/the_sky_is_on_fire_2k.hdr' }
            // files={ [
            //     './environmentMaps/2/px.jpg',
            //     './environmentMaps/2/nx.jpg',
            //     './environmentMaps/2/py.jpg',
            //     './environmentMaps/2/ny.jpg',
            //     './environmentMaps/2/pz.jpg',
            //     './environmentMaps/2/nz.jpg',
            // ]}
        >
            {/* <color args={['#000000']} attach="background"/> */}
            {/* <Lightformer 
                position-z={ -5 }
                scale={ 10 }
                color="red"
                intensity={ 10 }
                form="ring"
            /> */}
            {/* <mesh position-z={ -1 } scale={ 1 }>
                <planeGeometry />
                <meshBasicMaterial color={ [2, 0, 0] }/>
            </mesh> */}
        </Environment>


        <color args={ ['#BFD4DB'] } attach="background" /> 

    {/* CONTROL */}
        <OrbitControls makeDefault enableDamping={false} />

    {/* LIGHTS */}

        {/* <Sky sunPosition={sunPosition}/> */}

        {/* <AccumulativeShadows
            position={ [0, -0.99, 0]}
            scale={ 10 }
            color="#316d39"
            opacity={ 0.8 }
            frames={ 100 } // Initity is an option
            temporal // spread the temporal cost of calculate shadows across time
            // blend={ 100 }
        >
            <RandomizedLight
                amount={ 8 }
                radius={ 1 }
                ambient={ 0.5 }
                intensity={ 1 }
                position={ [1, 2, 3] }
                bias={ 0.001 }
            />
        </AccumulativeShadows> */}
    
        <ContactShadows // Camera render from floor instead of from light
            position={ [0, 0, 0] }
            scale={ 10 }
            resolution={ 512 }
            far={ 5 }
            color={ color }
            opacity={ opacity }
            blur={ blur }
            // frames={ 1 } // Renders on first frame (bake light)
        />

        {/* <directionalLight 
            ref={ dirLight } 
            position={ sunPosition } 
            intensity= { 1.5 }
            castShadow
            shadow-mapSize={ [1024, 1024] }
            shadow-camera-near={ 1 }
            shadow-camera-far={ 10 }
            shadow-camera-top={ 5 }
            shadow-camera-right={ 5 }
            shadow-camera-bottom={ -5 }
            shadow-camera-left={ -5 }
        />
        <ambientLight intensity={ 0.5 } /> */}


    {/* SPHERE */}

    {/* Stage will set an environment map, two directional light, shadows and center the scene */}
    {/* <Stage
            contactShadow={ { opacity: 0.2, blut: 3 }}
            environment="sunset"
            preset="portrait"
            intensity={ 1 }
        > */}

        <mesh ref={sphere} castShadow position-y={1} position-x={-2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={ envMapIntensity } />
            <Html 
                    position={[1, 1, 0]} 
                    wrapperClass="label" 
                    center
                    distanceFactor={6}
                    occlude={[sphere, cube]}
                >
                    That's a sphere
            </Html>
        </mesh>
        
        {/* CONFLICT WITH ACCUMULATIVE LIGHT
         <TransformControls object={sphere} mode="translate"/> */}

    {/* CUBE */}
        {/* CONFLICT WITH CONTACT LIGHT
        <PivotControls anchor={[0, 0, 0]} depthTest={false} scale={100} fixed={ true }> */}
            <mesh ref={cube} castShadow rotation-y={ Math.PI * 0.25 } position-y={1} position-x={ 2 } scale={ 1.5 }>
                <boxGeometry scale={ 1.5 } />
                <meshStandardMaterial 
                    color="mediumpurple" 
                    envMapIntensity={ envMapIntensity }
                />
            </mesh>
        {/* </PivotControls> */}
    {/* </Stage> */}

    {/* PLANE */}
        {/* <mesh 
            position-y={ 0 }
            rotation-x={ -Math.PI * 0.5} 
            scale= {10}
            // receiveShadow 
        > */}
            {/* <planeGeometry /> */}
            {/* <meshStandardMaterial color="greenyellow" /> */}
            {/* <MeshReflectorMaterial 
                resolution={512} 
                blur={ [1000, 1000] }
                mixBlur={ 1 }
                mirror={ 0.5 }
                color="greenyellow"
                envMapIntensity={ envMapIntensity }
            /> */}
        {/* </mesh> */}

    {/* TEXT */}
        <Float
            speed={ 5 }
            floatIntensity={ 2 }
        >
            <Text 
                castShadow
                font="./Bangers-Regular.ttf"
                fontSize={ 1 }
                color="#ff4f4b"
                position-y={ 2 }
                maxWidth={ 2 }
                textAlign="center"
            >
                I LOVE R3F
            </Text>
        </Float>

        {/* <CustomObject /> */}
    </>
}