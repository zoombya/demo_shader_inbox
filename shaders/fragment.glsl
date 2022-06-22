varying vec2 vCoordinates;
uniform sampler2D t1;
uniform sampler2D mask;
varying vec3 color;



void main(){
    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    vec2 myUV = vec2(vCoordinates.x / 512., vCoordinates.y / 512.);
    vec4 image = texture2D(t1, myUV);
    //vec4 image2 = texture2D(mask, myUV);
    
   
    
    //gl_FragColor.a *= maskTexture.z;
    gl_FragColor = image;
    gl_FragColor.xy = image.xy;
    gl_FragColor.a =  maskTexture.z;
    
    gl_FragColor = maskTexture;
    if(gl_FragColor.x == gl_FragColor.y && 
       gl_FragColor.x == gl_FragColor.z
    ){
        gl_FragColor.x *= color.x;
        gl_FragColor.y *= color.y;
        gl_FragColor.z *= color.z;
    }

    //gl_FragColor = vec4(vCoordinates.x /512.,
    //                    vCoordinates.y/512.,
    //                    0,
    //                    1.);
    
}




