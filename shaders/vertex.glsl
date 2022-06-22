varying vec2 vUv;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
attribute vec3 aColor;
attribute float aSize;
uniform float box;
uniform float dx;
uniform float dy;
uniform float dz;
uniform float time;

varying vec3 color;


void main(){
    vUv = uv;
    
    vec3 bPos = position+ time * vec3(dx,dy,dz);;
    
    float tx = floor(bPos.x / box);
    float ty = floor(bPos.y / box);
    float tz = floor(bPos.z / box);
    
    bPos -= vec3(tx*box, ty*box, tz*box);
    
    
    //bPos.x /= box;

    vec4 mvPosition = modelViewMatrix * vec4(bPos, 1.);
    //mvPosition.z = 0.;
    //gl_PointSize = 500. * (1. / -mvPosition.z);
    gl_PointSize = 5.;
    gl_Position = projectionMatrix * mvPosition;
   
    vCoordinates = aCoordinates.xy;
    color = aColor;
}