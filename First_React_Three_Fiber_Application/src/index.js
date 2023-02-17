import './style.css';
import ReactDOM from 'react-dom/client';
import {Canvas} from '@react-three/fiber'
import Experince from './Experience.js';
import * as THREE from 'three'
import { Leva } from 'leva';
import { StrictMode } from 'react'
import { Scene } from 'three';

const root = ReactDOM.createRoot(document.querySelector('#root'));

const cameraSettings = {
  fov: 45, 
  // zoom: 100, 
  near: 0.1, 
  far: 200, 
  position: [3, 2, 6] 
}

// Diferent ways of coloring background
// const created = ({ gl })    => { gl.setClearColor('#ff0000', 1) }
// const created = ({ scene }) => { scene.background = new THREE.Color('red') }

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
      shadows
      camera={ cameraSettings }
      // onCreated={ created }
      >
        <Experince />
    </Canvas>
  </StrictMode>
)