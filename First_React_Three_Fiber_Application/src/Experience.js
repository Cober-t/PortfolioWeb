import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense } from 'react'
import Model from './Model.js'
import Placeholder from './Placeholder.js'

export default function Experince()
{   
   
    return <>

        <Perf position="top-left"/>

        <color args={ ['#BFD4DB'] } attach="background" /> 

    {/* LIGHTS */}

        <directionalLight 
            position={ [1, 2, 3] } 
            intensity= { 1.5 }
            castShadow
            shadow-normalBias={ 0.04 }
        />
        <ambientLight intensity={ 0.5 } />

        <OrbitControls makeDefault enableDamping={false}/>

        
    {/* PLANE */}
        <mesh position-y={-1} rotation-x={ -Math.PI * 0.5} scale= {10} receiveShadow >
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    {/* MODEL */}
    <Suspense fallback={ <Placeholder position-y={0.5} scale={ [2, 3, 2] } /> }>  
        <Model/>
    </Suspense>

    </>
}