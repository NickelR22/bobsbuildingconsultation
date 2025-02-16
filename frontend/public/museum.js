//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js Scene
const scene = new THREE.Scene();

// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Initialize the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Initialize loader for .gltf files
const loader = new GLTFLoader();

// Create a dictionary to store models and text
const models = {
    rhino: null,
    elephant: null,
    antelope: null, // Add more models as needed
};

const labels = {
    rhino: "Rhino",
    elephant: "Elephant",
    antelope: "Antelope",
};

// Function to load models dynamically
function loadModel(modelName, filePath, xPosition, scaleX = 1, scaleY = 1, scaleZ = 1) {
    loader.load(filePath, function(gltf) {
        models[modelName] = gltf.scene;
        models[modelName].position.x = xPosition; // Position models on the X-axis
        models[modelName].scale.set(scaleX, scaleY, scaleZ); // Set custom scale
        scene.add(gltf.scene);
        createLabel(modelName, xPosition); // Create label next to each model
        fitModelToContainer();  // Optional: Keep fitModelToContainer to handle resizing
    }, function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, function(error) {
        console.error(error);
    });
}

// Load models with positions and custom scales
loadModel('rhino', './models/rhino/scene.gltf', -40, 2, 2, 2); // Increase size of rhino
loadModel('elephant', './models/elephant/scene.gltf', 0, 2, 2, 2); // Increase size of elephant
loadModel('antelope', './models/antelope/scene.gltf', 40, 7, 7, 7); // Increase size of antelope

// Set initial camera position
camera.position.z = 40;

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Adjust the model size to fit container
function fitModelToContainer() {
    for (const modelName in models) {
        const model = models[modelName];
        if (model) {
            const boundingBox = new THREE.Box3().setFromObject(model);
            const size = boundingBox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            const container = document.getElementById("container3D");
            const containerHeight = container.clientHeight;
            const containerWidth = container.clientWidth;
            const aspectRatio = containerWidth / containerHeight;

            const idealSize = maxDim > 0 ? 10 / maxDim : 1; // Scale factor

            // Increase the scale factor (multiply by 2 here to double the size)
            const scaleFactor = 2; 
            model.scale.set(idealSize * scaleFactor, idealSize * scaleFactor, idealSize * scaleFactor);
            
            camera.aspect = aspectRatio;
            camera.updateProjectionMatrix();
            renderer.setSize(containerWidth, containerHeight);
        }
    }
}

// Resize the model when the window is resized
window.addEventListener("resize", fitModelToContainer);



// Create a new OrbitControls instance
const controls = new OrbitControls(camera, renderer.domElement);

// Create a flag to track whether the "F" key is pressed
let fKeyPressed = false;

// Event listener for when the "F" key is pressed
document.addEventListener("keydown", (event) => {
  if (event.key === 'f' || event.key === 'F') {
    fKeyPressed = true;
    // Disable page scrolling when zooming is enabled
    document.body.style.overflow = 'hidden'; // Disable scrolling on the page

    // Enable zoom in OrbitControls when "F" is pressed
    controls.enableZoom = true; // Enable zoom
  }
});

// Event listener for when the "F" key is released
document.addEventListener("keyup", (event) => {
  if (event.key === 'f' || event.key === 'F') {
    fKeyPressed = false;
    // Enable page scrolling when zooming is not active
    document.body.style.overflow = 'auto'; // Enable scrolling on the page

    // Disable zoom in OrbitControls when "F" is released
    controls.enableZoom = false; // Disable zoom
  }
});

// Update OrbitControls based on whether "F" is pressed
controls.zoomSpeed = 1.0;
controls.maxDistance = 100;
controls.minDistance = 10;

// Prevent default scroll behavior when zoom is not active (page scroll enabled)
document.addEventListener("wheel", (event) => {
  if (!fKeyPressed) {
    // Enable page scrolling when "F" is not pressed
    document.body.style.overflow = 'auto'; 
  }
});

// Render the scene
function animate() {
    requestAnimationFrame(animate);

    // Update camera controls
    controls.update();

    renderer.render(scene, camera);
}

// Add mouse position listener to interact with models
document.onmousemove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Apply rotations or other interactions based on mouse movement
    for (const modelName in models) {
        const model = models[modelName];
        if (model) {
            model.rotation.y = -3 + mouseX / window.innerWidth * 3;
            model.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
        }
    }
}

// Create labels next to each model
function createLabel(modelName, xPosition) {
    const label = document.createElement("div");
    label.classList.add("model-label");
    label.innerText = labels[modelName];
    label.style.position = "absolute";
    label.style.left = `${(window.innerWidth / 2) + xPosition}px`; // Position label based on model
    label.style.top = "20px"; // Adjust as needed
    document.body.appendChild(label);
}

// Start the animation loop
animate();

// Update on window resize
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Select the element to observe and the counter
const targetSection = document.getElementById("target-section");
const counterElement = document.getElementById("counter");

let isCounting = false; // To ensure the counter only starts once

// Set the target value (50%)
const target = 50;
const speed = 50; // Speed of the count-up animation

let current = 0;

// Create an IntersectionObserver to trigger the animation when the target section is in view
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // Check if the target section is in the viewport and if counting hasn't started yet
    if (entry.isIntersecting && !isCounting) {
      isCounting = true; // Prevent the animation from restarting

      // Start the counter animation when the section is in view
      const counter = setInterval(() => {
        if (current < target) {
          current++;
          counterElement.textContent = `${current}%`;
        } else {
          clearInterval(counter); // Stop the counter when it reaches the target
        }
      }, speed);
      
      // Stop observing once the counter has started
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5 // Trigger when 50% of the section is in view
});


// Start observing the target section
observer.observe(targetSection);


document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".footer").innerHTML = `&copy; ${new Date().getFullYear()} Simba's Surveillance. All rights reserved.`;
});

