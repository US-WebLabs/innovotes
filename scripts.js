// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x2a2a2a, 1); // Match logo background

// Camera Position
camera.position.set(0, 5, 15);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Voting Box
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x003366, shininess: 100 });
const votingBox = new THREE.Mesh(boxGeometry, boxMaterial);
votingBox.position.set(0, -5, 0); // Position below the map
scene.add(votingBox);

// Slot on Top of Voting Box
const slotGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.4);
const slotMaterial = new THREE.MeshPhongMaterial({ color: 0x002244 });
const slot = new THREE.Mesh(slotGeometry, slotMaterial);
slot.position.y = 1.05;
votingBox.add(slot);

// Simplified U.S. Map Outline (Approximated with Spheres)
const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0, shininess: 50 });
const spheres = [];

// Approximate U.S. map using a grid of spheres
const usMapPoints = [];
const mapWidth = 20;
const mapHeight = 10;
for (let x = -mapWidth / 2; x < mapWidth / 2; x += 0.5) {
    for (let z = -mapHeight / 2; z < mapHeight / 2; z += 0.5) {
        // Simplified U.S. shape (excluding Hawaii/Alaska for simplicity)
        if (
            (x > -10 && x < 10 && z > -5 && z < 5) && // Mainland U.S.
            !(x > -2 && x < 2 && z > 3) && // Remove Great Lakes area
            !(x < -8 && z > 2) && // Remove northwest corner
            !(x > 8 && z < -2) // Remove southeast corner
        ) {
            usMapPoints.push(new THREE.Vector3(x, 0, z));
        }
    }
}

// Create Spheres (Voters)
usMapPoints.forEach((point, index) => {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(
        Math.random() * 30 - 15, // Random initial position
        Math.random() * 10 + 5,
        Math.random() * 30 - 15
    );
    sphere.targetPosition = point; // Target position on the map
    sphere.scale.set(0, 0, 0); // Start invisible
    spheres.push(sphere);
    scene.add(sphere);
});

// Animation Timeline
let animationPhase = 0; // 0: Form map, 1: Move to voting box, 2: Zoom into box
let animationProgress = 0;

// Animate Spheres
function animateSpheres() {
    if (animationPhase === 0) {
        // Phase 0: Form the U.S. map
        animationProgress += 0.02;
        spheres.forEach(sphere => {
            sphere.position.lerp(sphere.targetPosition, 0.05);
            sphere.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
        });
        if (animationProgress >= 1) {
            animationPhase = 1;
            animationProgress = 0;
        }
    } else if (animationPhase === 1) {
        // Phase 1: Move spheres to voting box
        animationProgress += 0.01;
        spheres.forEach(sphere => {
            const target = new THREE.Vector3(0, -5, 0); // Center of voting box
            sphere.position.lerp(target, 0.03);
            if (sphere.position.distanceTo(target) < 0.5) {
                sphere.visible = false; // Disappear into the box
            }
        });
        if (animationProgress >= 1) {
            animationPhase = 2;
            animationProgress = 0;
        }
    } else if (animationPhase === 2) {
        // Phase 2: Zoom into voting box (controlled by scroll)
        votingBox.rotation.y += 0.01;
    }
}

// Scroll Interaction
let scrollProgress = 0;
window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('hero');
    const featuresSection = document.getElementById('features');
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    scrollProgress = Math.min(1, Math.max(0, 1 - heroBottom / window.innerHeight));

    if (animationPhase === 2) {
        // Zoom camera into voting box
        camera.position.lerp(new THREE.Vector3(0, 0, 5), scrollProgress * 0.05);
        camera.lookAt(votingBox.position);
        votingBox.rotation.y += scrollProgress * 0.02;
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    animateSpheres();
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Form Submission Alert
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});
