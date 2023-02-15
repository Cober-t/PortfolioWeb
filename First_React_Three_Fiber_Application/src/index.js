import './style.css';
import ReactDOM from 'react-dom/client';
import {Canvas} from '@react-three/fiber'
import Experince from './Experience.js';
import * as THREE from 'three'
import { Leva } from 'leva';
import { StrictMode } from 'react'

const root = ReactDOM.createRoot(document.querySelector('#root'));

const cameraSettings = {
  fov: 45, 
  // zoom: 100, 
  near: 0.1, 
  far: 200, 
  position: [3, 2, 6] 
}

root.render(
  <StrictMode>
    <Leva collapsed />
    <Canvas
      //flat  // no tone mapping
      // perspective // default
      dpr={ [1, 2] } // clamp pixel ratio (default)
      gl={ {
        antialias:true, // default
        toneMapping: THREE.ACESFilmicToneMapping, // default
        outputEncoding: THREE.sRGBEncoding // (default)
      } } 
      camera={ cameraSettings }
      >
        <Experince />
    </Canvas>
  </StrictMode>
)