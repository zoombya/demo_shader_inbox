varying vec2 vCoordinates;
uniform sampler2D t1;
uniform sampler2D mask;

void main(){
    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    vec2 myUV = vec2(vCoordinates.x / 512., vCoordinates.y / 512.);
    vec4 image = texture2D(t1, myUV);
    gl_FragColor = image;
    //gl_FragColor.a *= maskTexture.z;
    gl_FragColor.a = 1. - maskTexture.z;
}

//gl_FragColor = vec4(vCoordinates.x /512.,
//                    vCoordinates.y/512.,
//                    0,
//                    1.);
