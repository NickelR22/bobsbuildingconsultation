import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10); // Adjusted camera position

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('treeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

// Load the 3D Model
const loader = new GLTFLoader();
let treeModel;

loader.load('./modern_animal_sculptures_statue_pack.glb', (gltf) => {
    console.log('Model loaded successfully');
    treeModel = gltf.scene;
    treeModel.scale.set(1, 1, 1); // Adjust size
    scene.add(treeModel);
}, undefined, (error) => {
    console.error('Error loading 3D model:', error);
});

// Rotate with Scroll
window.addEventListener('scroll', () => {
    if (treeModel) {
        const scrollY = window.scrollY * 0.002; // Adjust rotation speed
        treeModel.rotation.y = scrollY;
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle Resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".footer").innerHTML = `&copy; ${new Date().getFullYear()} Simba's Surveillance. All rights reserved.`;
    
    let lastScrollY = window.scrollY;
    let rotation = 0;
    const tree = document.getElementById("tree");
    
    window.addEventListener("scroll", function() {
        let currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) {
            rotation += 5; // Rotate forward
        } else if (currentScrollY < lastScrollY) {
            rotation -= 5; // Rotate backward
        }
        
        tree.style.transform = `rotateY(${rotation}deg)`;
        lastScrollY = currentScrollY;
    });
});



