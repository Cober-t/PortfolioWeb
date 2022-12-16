
varying vec3 vColor;

void main() 
{
    // Generate Circles
    //float strength = distance(gl_PointCoord, vec2(0.5));
    //strength = step(0.5, strength);
    //strength = 1.0 - strength;

    // Diffuse Pattern
    // float strength = 1.0 - (distance(gl_PointCoord, vec2(0.5)) * 2.0);

    // Light Point Pattern
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final
    vec3 color = mix(vec3(0.0), vColor, strength);

    if(strength <= 0.0)
        discard;

    // With transparent = true
    // gl_FragColor = vec4(vColor, strength);
    // Instead do:
    gl_FragColor = vec4(color, 1.0);
}