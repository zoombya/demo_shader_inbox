// based of Akella's excellent
// https://www.youtube.com/watch?v=8K5wJeVgjrM

import * as THREE from 'three';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import t1 from './imgs/impostor.png';
//import mask from './imgs/particle_mask.jpg'; 
import mask from './imgs/disc2.png';


class DatReader extends FileReader{
    constructor(file, callback){
        super(); 
        this.points = [];
        this.onload = ()=>{
            let file = this.result;
            let lines = file.split(/[\n]+/g);
            let box=parseFloat( lines[1].split("=")[1].split(" ")[1]);
            //let box = parseFloat(lines[0].split("=")[2]);

            lines = lines.slice(3); // discard the header

            console.log(lines.length);
            //fix for trailing new lines
            if (lines[lines.length-1] === "")
                lines = lines.slice(0,lines.length-1);
            
            //now we treat just the basic case of 1 conf cms 
            lines.forEach( (line,i)=>{
                let l = line.split(" ");
                //extract position
                this.points.push( 
                    new THREE.Vector3(parseFloat(l[0]),  parseFloat(l[1]), parseFloat(l[2]))
                );
            });
            callback(box,this.points);
        }
        this.readAsText(file[0]);
    }
}
export default class Sketch{
    constructor(){
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 3000 );
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();
        //this.scene.background= new THREE.Color("white");

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        //renderer.setAnimationLoop( animation );
        document.getElementById('container').appendChild( this.renderer.domElement );
        
        this.mask = new THREE.TextureLoader().load(mask);

        this.textures =[
            new THREE.TextureLoader().load(t1)
        ];

        //this.addMesh();
        
        this.time = 0; 


        this.controls = new OrbitControls(this.camera,this.renderer.domElement);


        //handle window resize
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

        this.addMesh();

        this.canvas = this.renderer.domElement;
        //this.canvas.
        this.canvas.addEventListener("dragover", (event)=> {
            event.preventDefault();
            this.canvas.classList.add('dragging');
          }, false);
        this.canvas.addEventListener("dragenter", (event)=> {
            event.preventDefault();
            this.canvas.classList.add('dragging');
        }, false);
        this.canvas.addEventListener("dragexit", (event)=> {
            event.preventDefault();
            this.canvas.classList.remove('dragging');
        }, false);
        this.canvas.addEventListener("drop",(event)=>{
          event.preventDefault();
          this.canvas.classList.remove('dragging');
          const files = event.dataTransfer? event.dataTransfer.files : null;
          console.log(files)
          if(files){
            //this.positions;
            let reader = new DatReader(files, (box,positions)=>{
                for(let i =0; i< positions.length; i++){
                    this.positions.setXYZ(i, positions[i].x,positions[i].y,positions[i].z );
                    this.size.setX(i, 5000);
                }
                 this.material.uniforms.box.value = box;
                 this.geometry.attributes.position.needsUpdate = true;
                 this.geometry.setDrawRange( 0, positions.length );

            });
          }
        });
        this.render();
    }
    addMesh(){
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms:{
                progress:{type:'f', value:0},
                t1:{type:'t', value:this.textures[0]},
                mask:{type:'t', value:this.mask},
                box:{type:'f', value:738.22021484375},
                dx:{type:'f', value:5},
                dy:{type:'f', value:5},
                dz:{type:'f', value:5},
                time:{type:'f', value:this.time}
            },
            side:THREE.DoubleSide,
            transparent:true,
            depthTest:false,
            depthWrite:false,
        });
        
        let nn = 512;
        let number = nn * nn;

        this.geometry = new THREE.BufferGeometry();
        this.positions = new THREE.BufferAttribute(
            new Float32Array(number*3),3
        );
        this.coordinates = new THREE.BufferAttribute(
            new Float32Array(number*3),3
        )
        this.size = new THREE.BufferAttribute(
            new Float32Array(number*3),1
        );
        this.color = new THREE.BufferAttribute(
            new Float32Array(number*3),3
        ) 
        //console.log(this.positions);

        let index = 0;
        for (let i = 0; i < nn; i++) {
            let posX = i -nn/2;
            for (let j = 0; j < nn; j++) {
                this.positions.setXYZ(index, posX*3,
                                            (j-nn/2)*3,
                                            Math.random()*150);
                this.coordinates.setXYZ(index, i, j,0);
                //this.size.setX(index, 500 + Math.random()*3000);
                this.size.setX(index, 5000);
                this.color.setXYZ(index,
                    Math.random(),Math.random(),Math.random()
                );
                index++;
            }
        }
        this.geometry.setAttribute("position", this.positions);
        this.geometry.setAttribute("aCoordinates",this.coordinates);
        this.geometry.setAttribute("aSize", this.size);
        this.geometry.setAttribute("aColor", this.color);

        //this.material = new THREE.PointsMaterial( { size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );

        this.mesh = new THREE.Points( this.geometry, this.material );
        this.scene.add( this.mesh );
    }
    

    render(){
        this.time++;
        this.renderer.render(this.scene, this.camera );
        if(this.material){
            this.material.uniforms.time.value = this.time/10;
            //console.log(this.time)
            //this.geometry.material.uniforms.dx.value+=10;
            //this.geometry.material.uniforms.dy.value+=10;
            //this.geometry.material.uniforms.dz.value+=10;
        }

        window.requestAnimationFrame(this.render.bind(this));    
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );    
    }

}
new Sketch();




//export class DatReader extends FileReader{
//    datFile : File;
//    callback: ((sys:System)=>void) | null;
//    system : System;
//    constructor(datFile:File, system:System, callback : ((sys:System)=>void) | null = null){
//        super();
//        this.datFile = datFile;
//        this.system = system;
//        this.callback = callback;
//        this.onload = ()=>{
//            let file = this.result as string
//            let lines = file.split(/[\n]+/g);
//
//            lines = lines.slice(3); // discard the header
//
//            console.log(lines.length);
//            //fix for trailing new lines
//            if (lines[lines.length-1] === "")
//                lines = lines.slice(0,lines.length-1);
//            
//            //now we treat just the basic case of 1 conf cms 
//            lines.forEach( (line:String,i: number)=>{
//                let l = line.split(" ");
//                //extract position
//                system.elements[i].position = new Vector3(parseFloat(l[0]),  parseFloat(l[1]), parseFloat(l[2]));
//                system.elements[i].a1 = new Vector3(parseFloat(l[3]),  parseFloat(l[4]), parseFloat(l[5]));
//                system.elements[i].a3 = new Vector3(parseFloat(l[6]),  parseFloat(l[7]), parseFloat(l[8]));
//
//            });
//            // what to do next ? 
//            if(this.callback) 
//                this.callback(this.system);
//        }
//        // we are a reader, so let's read the file 
//        this.readAsText(this.datFile);
//    }
//}