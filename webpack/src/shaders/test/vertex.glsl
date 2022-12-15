// Uniforms
uniform mat4 projectionMatrix;  // Remove at ShaderMaterial  
uniform mat4 viewMatrix;        // Remove at ShaderMaterial
uniform mat4 modelMatrix;       // Remove at ShaderMaterial

// Custom
uniform float uFrequency;

// Attibutes
attribute vec3 position;    // Remove at ShaderMaterial  
attribute vec2 uv;          // Remove at ShaderMaterial  

// Custom
attribute float aRandom;

// Output
varying vec2 vUv;
varying float vRandom;

void main() 
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += aRandom * uFrequency;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vUv = uv;
    vRandom = aRandom;
}