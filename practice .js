import * as THREE from './three.module';
// import {OrbitControls} from './OrbitControls.js';



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const boxGeo = new THREE.PlaneGeometry(18 ,10);
const boxMesh = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ); ;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
cam.position.z = 10;
// const orbit = new OrbitControls(cam, renderer.domElement);
// orbit.update();
scene.add(cam);

const box = new THREE.Mesh(boxGeo,boxMesh);


box.rotation.x = -1

scene.add(box);



renderer.render(scene, cam);