import { MeshReflectorMaterial, Float, Text, Html, PivotControls, TransformControls, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { button, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import CustomObject from "./CustomObject.js"

export default function Experince()
{
    const sphere = useRef()
    const cube = useRef()

    const { perfVisible } = useControls({
        perfVisible: true
    })

return <>

        { perfVisible ? <Perf position="top-left"/> : null }

        <OrbitControls makeDefault enableDamping={false} />

        <directionalLight position={ [1, 2, 3]} intensity= { 1.5 }/>
        <ambientLight intensity={ 0.5 } />

        <mesh ref={sphere} position-x={-2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
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
        <TransformControls object={sphere} mode="translate"/>

        <PivotControls anchor={[0, 0, 0]} depthTest={false} scale={100} fixed={ true }>
            <mesh ref={cube} rotation-y={ Math.PI * 0.25 } position-x={ 2 } scale={ 1.5 }>
                <boxGeometry scale={ 1.5 } />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        </PivotControls>

        <mesh position-y={-1} rotation-x={ -Math.PI * 0.5} scale= {10}>
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" /> */}
            <MeshReflectorMaterial 
                resolution={512} 
                blur={ [1000, 1000] }
                mixBlur={ 1 }
                mirror={ 0.5 }
                color="greenyellow"
            />
        </mesh>

        <Float
            speed={ 5 }
            floatIntensity={ 2 }
        >
            <Text 
                font="./Bangers-Regular.ttf"
                fontSize={ 1 }
                color="salmon"
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